from __future__ import annotations

import uuid
from datetime import date

from fastapi import APIRouter, Request, Response

from config import settings
from services.visits import record_visit

router = APIRouter(tags=["visit"])


@router.post("/api/visit")
async def track_visit(request: Request, response: Response) -> dict[str, str]:
    visitor_id = request.cookies.get(settings.visitor_cookie)
    is_new = not visitor_id
    if is_new:
        response.set_cookie(
            key=settings.visitor_cookie,
            value=str(uuid.uuid4()),
            httponly=True,
            secure=settings.cookie_secure,
            samesite="lax",
            path="/",
        )
    await record_visit(today=date.today(), is_new_visitor=is_new)
    return {"status": "ok"}
