from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # FastAPI
    fastapi_host: str = "0.0.0.0"
    fastapi_port: int = 8080

    # SMTP
    smtp_host: str
    smtp_port: int = 465
    smtp_user: str
    smtp_pass: str
    recipient_email: str

    # Frontend / CORS
    frontend_origin: str = "http://localhost"

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@db:5432/pantech_db"

    # Admin auth
    # Use either:
    #   ADMIN_PASSWORD       — plain-text password (simpler, less secure)
    #   ADMIN_PASSWORD_HASH  — bcrypt hash (recommended for production)
    # If both are set, the hash wins.
    admin_login: str = "admin"
    admin_password: str = ""
    admin_password_hash: str = ""

    # JWT / cookie
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_ttl_hours: int = 12
    cookie_name: str = "pt_admin"
    cookie_secure: bool = False
    cookie_samesite: str = "lax"

    # Visitor tracking
    visitor_cookie: str = "pt_visit"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.frontend_origin.split(",") if o.strip()]


settings = Settings()
