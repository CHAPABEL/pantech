from fastapi import APIRouter
from fastapi.responses import JSONResponse
from email.message import EmailMessage
import smtplib
from models.email_form import EmailForm


router = APIRouter()

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "nikitabel.moskva@gmail.com"
SMTP_PASS = "zrvnxnrohdfpvrqw"
RECIPIENT_EMAIL = "nikitabel.msk@mail.ru"

@router.post("/send-email")
async def send_email(form: EmailForm):  
    try:
        message_text = (
            f"Новое сообщение с сайта Pantech\n\n"
            f"Пользователь: {form.name}\n"
            f"Email: {form.email}\n"
            f"Телефон: {form.phone}\n\n"
            f"О проекте: {form.about}"
        )

        msg = EmailMessage()
        msg['Subject'] = 'Новое сообщение с сайта Pantech'
        msg['From'] = SMTP_USER
        msg['To'] = RECIPIENT_EMAIL
        msg.set_content(message_text)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.send_message(msg)

        return JSONResponse({"message": "Письмо отправлено!"},status_code=201)

    except Exception as e:
        print("Ошибка при отправке письма:", e)
        return JSONResponse({"message": "Ошибка при отправке письма"}, status_code=500)
