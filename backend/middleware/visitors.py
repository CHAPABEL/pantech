from __future__ import annotations

import asyncio
import logging
import uuid
from datetime import date

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from config import settings
from services.visits import record_visit

log = logging.getLogger(__name__)

_ONE_YEAR_SECONDS = 365 * 24 * 3600


class VisitorMiddleware(BaseHTTPMiddleware):
    """Tracks unique daily visitors for non-API GET requests.

    A visitor is identified by a long-lived cookie. When the cookie is missing
    we treat the request as a new unique visitor and set the cookie on the
    response. Counter updates are fire-and-forget so they never block the
    request lifecycle.
    """

    async def dispatch(self, request: Request, call_next):
        is_tracked = self._should_track(request)
        visitor_id = request.cookies.get(settings.visitor_cookie)
        is_new = is_tracked and not visitor_id

        response: Response = await call_next(request)

        if is_tracked:
            if is_new:
                visitor_id = str(uuid.uuid4())
                response.set_cookie(
                    key=settings.visitor_cookie,
                    value=visitor_id,
                    max_age=_ONE_YEAR_SECONDS,
                    httponly=True,
                    secure=settings.cookie_secure,
                    samesite="lax",
                    path="/",
                )
            asyncio.create_task(self._safe_record(is_new))

        return response

    @staticmethod
    def _should_track(request: Request) -> bool:
        if request.method != "GET":
            return False
        path = request.url.path
        if path.startswith("/api/"):
            return False
        if path.startswith("/docs") or path.startswith("/openapi") or path.startswith(
            "/redoc"
        ):
            return False
        if path.startswith("/static") or path.endswith((".css", ".js", ".map")):
            return False
        return True

    @staticmethod
    async def _safe_record(is_new: bool) -> None:
        try:
            await record_visit(today=date.today(), is_new_visitor=is_new)
        except Exception:  # noqa: BLE001
            log.exception("Failed to record visit")
