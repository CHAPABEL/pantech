from fastapi import APIRouter, Form, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from email.message import EmailMessage
import smtplib
from config import settings
from datetime import datetime
from pathlib import Path
from .email_logger import log_email_entry

router = APIRouter()

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 МБ
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/send-email")
async def send_email(
    name: str = Form(...),
    direction: str | None = Form(None),
    email: str = Form(...),
    phone: str = Form(...),
    about: str = Form(...),
    file: UploadFile | None = File(None)
):
    saved_file_path = None

    try:
        text_content = f"""
Новое сообщение с сайта Pantech
Пользователь: {name}
Направление: {direction or "не указано"}
Email: {email}
Телефон: {phone}
О проекте: {about}
"""
        html_content = f"""
<html>
  <body style="font-family: Arial, sans-serif;">
    <h2 style="color:#327be1;">Новое сообщение с сайта Pantech</h2>
    <p><strong>Пользователь:</strong> {name}</p>
    <p><strong>Направление:</strong> {direction or 'не указано'}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Телефон:</strong> {phone}</p>
    <p><strong>О проекте:</strong><br>{about}</p>
  </body>
</html>
"""

        msg = EmailMessage()
        msg['Subject'] = 'Новое сообщение с сайта Pantech'
        msg['From'] = settings.smtp_user
        msg['To'] = settings.recipient_email
        msg.set_content(text_content)
        msg.add_alternative(html_content, subtype="html")

        # Обработка вложений
        if file:
            file_content = await file.read()
            if len(file_content) > MAX_FILE_SIZE:
                raise HTTPException(status_code=413, detail="Файл слишком большой. Максимум 20 МБ.")
            saved_file_path = UPLOAD_DIR / file.filename
            with open(saved_file_path, "wb") as f:
                f.write(file_content)
            msg.add_attachment(
                file_content,
                maintype="application",
                subtype="octet-stream",
                filename=file.filename
            )

        # Отправка через Reg.ru SSL SMTP (порт 465)
        try:
            with smtplib.SMTP_SSL(settings.smtp_host, 465, timeout=10) as smtp:
                smtp.login(settings.smtp_user, settings.smtp_pass)
                smtp.send_message(msg)
        except smtplib.SMTPException as smtp_err:
            raise HTTPException(status_code=500, detail=f"SMTP error: {smtp_err}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ошибка при отправке письма: {e}")

        # Логирование
        log_email_entry({
            "name": name,
            "direction": direction,
            "email": email,
            "phone": phone,
            "about": about,
            "file": saved_file_path.name if saved_file_path else None,
            "sent_at": datetime.utcnow().isoformat(),
            "status": "sent"
        })

        return JSONResponse({"message": "Письмо отправлено!"}, status_code=201)

    except HTTPException as he:
        log_email_entry({
            "name": name,
            "direction": direction,
            "email": email,
            "phone": phone,
            "about": about,
            "file": saved_file_path.name if saved_file_path else None,
            "sent_at": datetime.utcnow().isoformat(),
            "status": f"error: {he.detail}"
        })
        return JSONResponse({"message": he.detail}, status_code=he.status_code)

    except Exception as e:
        log_email_entry({
            "name": name,
            "direction": direction,
            "email": email,
            "phone": phone,
            "about": about,
            "file": saved_file_path.name if saved_file_path else None,
            "sent_at": datetime.utcnow().isoformat(),
            "status": f"error: {str(e)}"
        })
        return JSONResponse({"message": "Ошибка при отправке письма"}, status_code=500)
