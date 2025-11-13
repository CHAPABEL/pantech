from fastapi import APIRouter, Form, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from email.message import EmailMessage
import smtplib
from config import settings
from typing import Optional 

router = APIRouter()

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 МБ

@router.post("/send-email")
async def send_email(
    name: str = Form(...),
    direction: str | None = Form(None), 
    email: str = Form(...),
    phone: str = Form(...),
    about: str = Form(...),
    file: UploadFile | None = File(None)
):
    try:
        # текстовая версия
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
  <div style="margin:0; padding-top:50px; padding-bottom:50px; bprder-radius:15px;  background-color:#327be1; font-family: Arial, sans-serif;">
      <h2 style="color:#ffff; font-size:32px; text-align:center; margin-bottom:20px;">Новое сообщение с сайта Pantech</h2>
    <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      
      <p style="font-size:20px"><strong>Пользователь:</strong> {name}</p>
      <p style="font-size:20px"><strong>Направление:</strong> {direction or 'не указано'}</p>
      <p style="font-size:20px"><strong>Email:</strong> {email}</p>
      <p style="font-size:20px"><strong>Телефон:</strong> {phone}</p>
      <p style="font-size:20px"><strong>О проекте:</strong><br>{about}</p>
      
    </div>
  </div>
</html>
"""

        msg = EmailMessage()
        msg['Subject'] = 'Новое сообщение с сайта Pantech'
        msg['From'] = settings.smtp_user
        msg['To'] = settings.recipient_email

        msg.set_content(text_content)  
        msg.add_alternative(html_content, subtype="html") 

        if file is not None:
            file_content = await file.read()
            if len(file_content) > MAX_FILE_SIZE:
                raise HTTPException(status_code=413, detail="Файл слишком большой. Максимум 20 МБ.")
            msg.add_attachment(
                file_content,
                maintype="application",
                subtype="octet-stream",
                filename=file.filename
            )

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as smtp:
            smtp.starttls()
            smtp.login(settings.smtp_user, settings.smtp_pass)
            smtp.send_message(msg)

        return JSONResponse({"message": "Письмо отправлено!"}, status_code=201)

    except HTTPException as he:
        return JSONResponse({"message": he.detail}, status_code=he.status_code)
    except Exception as e:
        print("Ошибка при отправке письма:", e)
        return JSONResponse({"message": "Ошибка при отправке письма"}, status_code=500)
