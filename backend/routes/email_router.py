from __future__ import annotations

import asyncio
import re
import smtplib
import unicodedata
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from db import get_session
from models import Message
from services.mailer import build_message, send_message
from services.media import ATTACHMENTS_DIR, UPLOAD_ROOT, public_url
from services.rate_limit import enforce_rate_limit

router = APIRouter(tags=["messages"])

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB
UPLOAD_DIR = ATTACHMENTS_DIR
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Держим в синхроне с accept= в PopupSend.tsx — вложение к заявке, а не картинка.
ATTACHMENT_EXTENSIONS = {".docx", ".vsdx", ".pdf", ".drawio", ".ppt", ".pptx"}

_SAFE_FILENAME_RE = re.compile(r"[^A-Za-zА-Яа-яЁё0-9_.\- ]+")


def _sanitize_filename(name: str) -> str:
    name = unicodedata.normalize("NFC", name).strip().replace("/", "_").replace("\\", "_")
    name = _SAFE_FILENAME_RE.sub("_", name)
    return name[:128] or "upload.bin"


async def _save_upload(file: UploadFile) -> tuple[Path, bytes]:
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ATTACHMENT_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Недопустимый формат файла. Разрешены: "
            + ", ".join(sorted(ATTACHMENT_EXTENSIONS)),
        )
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Файл слишком большой. Максимум 20 МБ.")
    safe = _sanitize_filename(file.filename or "upload.bin")
    if Path(safe).suffix.lower() != ext:
        safe = f"{safe}{ext}"
    path = UPLOAD_DIR / safe
    counter = 1
    while path.exists():
        stem, suffix = path.stem, path.suffix
        path = UPLOAD_DIR / f"{stem}_{counter}{suffix}"
        counter += 1
    path.write_bytes(content)
    return path, content


async def _process_message(
    *,
    session: AsyncSession,
    name: str,
    direction: str | None,
    email: str,
    phone: str,
    about: str,
    file: UploadFile | None,
) -> JSONResponse:
    saved_path: Path | None = None
    file_bytes: bytes | None = None

    if file is not None and file.filename:
        saved_path, file_bytes = await _save_upload(file)

    msg = build_message(
        name=name,
        direction=direction,
        email=email,
        phone=phone,
        about=about,
        file_name=saved_path.name if saved_path else None,
        file_bytes=file_bytes,
    )

    record = Message(
        name=name,
        email=email,
        phone=phone,
        direction=direction,
        about=about,
        file_path=(
            public_url(saved_path.relative_to(UPLOAD_ROOT).as_posix())
            if saved_path
            else None
        ),
        status="pending",
    )
    session.add(record)
    await session.flush()

    try:
        await asyncio.to_thread(send_message, msg)
    except smtplib.SMTPException as smtp_err:
        record.status = "error"
        record.error = f"SMTP error: {smtp_err}"
        await session.commit()
        return JSONResponse(
            {"message": f"SMTP error: {smtp_err}"}, status_code=500
        )
    except Exception as exc:  # noqa: BLE001
        record.status = "error"
        record.error = f"{type(exc).__name__}: {exc}"
        await session.commit()
        return JSONResponse(
            {"message": "Ошибка при отправке письма"}, status_code=500
        )

    record.status = "sent"
    await session.commit()
    return JSONResponse({"message": "Письмо отправлено!"}, status_code=201)


@router.post("/api/messages")
@router.post("/send-email")  # legacy alias
async def send_email(
    request: Request,
    name: str = Form(...),
    direction: str | None = Form(None),
    email: str = Form(...),
    phone: str = Form(...),
    about: str = Form(...),
    file: UploadFile | None = File(None),
    session: AsyncSession = Depends(get_session),
) -> JSONResponse:
    enforce_rate_limit(request, bucket="messages", limit=5, window_seconds=600)
    try:
        return await _process_message(
            session=session,
            name=name,
            direction=direction,
            email=email,
            phone=phone,
            about=about,
            file=file,
        )
    except HTTPException as he:
        # Persist the failed attempt so admins can see it.
        session.add(
            Message(
                name=name,
                email=email,
                phone=phone,
                direction=direction,
                about=about,
                status="error",
                error=str(he.detail),
            )
        )
        await session.commit()
        return JSONResponse({"message": he.detail}, status_code=he.status_code)
