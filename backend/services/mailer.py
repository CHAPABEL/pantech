from __future__ import annotations

import smtplib
from email.message import EmailMessage

from config import settings


def build_message(
    *,
    name: str,
    direction: str | None,
    email: str,
    phone: str,
    about: str,
    file_name: str | None = None,
    file_bytes: bytes | None = None,
) -> EmailMessage:
    text_content = (
        "Новое сообщение с сайта Pantech\n"
        f"Пользователь: {name}\n"
        f"Направление: {direction or 'не указано'}\n"
        f"Email: {email}\n"
        f"Телефон: {phone}\n"
        f"О проекте: {about}\n"
    )
    html_content = f"""
<html>
  <body style="font-family: Arial, sans-serif;">
    <h2 style="color:#3076d8;">Новое сообщение с сайта Pantech</h2>
    <p><strong>Пользователь:</strong> {name}</p>
    <p><strong>Направление:</strong> {direction or 'не указано'}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Телефон:</strong> {phone}</p>
    <p><strong>О проекте:</strong><br>{about}</p>
  </body>
</html>
"""

    msg = EmailMessage()
    msg["Subject"] = "Новое сообщение с сайта Pantech"
    msg["From"] = settings.smtp_user
    msg["To"] = settings.recipient_email
    msg.set_content(text_content)
    msg.add_alternative(html_content, subtype="html")

    if file_bytes and file_name:
        msg.add_attachment(
            file_bytes,
            maintype="application",
            subtype="octet-stream",
            filename=file_name,
        )
    return msg


def send_message(msg: EmailMessage) -> None:
    """Synchronous SMTP send. Caller is responsible for running in a worker."""
    with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
        smtp.login(settings.smtp_user, settings.smtp_pass)
        smtp.send_message(msg)
