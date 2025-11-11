from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent 
class Settings(BaseSettings):
    fastapi_host: str
    fastapi_port: int
    smtp_host: str
    smtp_port: int
    smtp_user: str
    smtp_pass: str
    recipient_email: str
    frontend_origin: str

    class Config:
        env_file = BASE_DIR / ".env"
        case_sensitive = False

settings = Settings()
