from __future__ import annotations

import json
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from config import settings
from middleware.visitors import VisitorMiddleware
from routes.admin_router import router as admin_router
from routes.auth_router import router as auth_router
from routes.cards_router import router as cards_router
from routes.content_router import router as content_router
from routes.email_router import router as messages_router
from routes.partners_router import router as partners_router
from routes.projects_router import router as projects_router
from routes.services_router import router as services_router
from services.media import UPLOAD_ROOT, ensure_upload_dirs

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pantech")

app = FastAPI(title="Pantech API")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Log the offending request body and per-field errors on every 422."""
    try:
        body = (await request.body()).decode("utf-8", errors="replace")
        try:
            body = json.dumps(json.loads(body), ensure_ascii=False)
        except (json.JSONDecodeError, ValueError):
            pass
    except Exception:
        body = "<unreadable>"
    logger.warning(
        "422 %s %s | errors=%s | body=%s",
        request.method,
        request.url.path,
        json.dumps(exc.errors(), ensure_ascii=False, default=str),
        body,
    )
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": body},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(VisitorMiddleware)

app.include_router(auth_router)
app.include_router(content_router)
app.include_router(cards_router)
app.include_router(services_router)
app.include_router(projects_router)
app.include_router(partners_router)
app.include_router(messages_router)
app.include_router(admin_router)

ensure_upload_dirs()
app.mount(
    "/api/uploads",
    StaticFiles(directory=str(UPLOAD_ROOT.resolve()), check_dir=False),
    name="uploads",
)


@app.get("/api/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.fastapi_host,
        port=settings.fastapi_port,
        reload=False,
    )
