from __future__ import annotations

from datetime import datetime, timedelta, timezone

import hmac

import bcrypt
from fastapi import HTTPException, Request, Response, status
from jose import JWTError, jwt

from config import settings


def verify_password(plain: str, hashed: str) -> bool:
    if not hashed:
        return False
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        return False


def verify_admin_credentials(login: str, password: str) -> bool:
    """Validates admin login + password.

    Supports either ADMIN_PASSWORD_HASH (bcrypt, recommended) or the simpler
    ADMIN_PASSWORD (plain-text) from the environment. If both are set, the
    hash takes precedence.
    """
    if not settings.admin_login or login != settings.admin_login:
        return False
    if settings.admin_password_hash:
        return verify_password(password, settings.admin_password_hash)
    if settings.admin_password:
        return hmac.compare_digest(password, settings.admin_password)
    return False


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.jwt_ttl_hours)
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(
            token, settings.jwt_secret, algorithms=[settings.jwt_algorithm]
        )
        sub = payload.get("sub")
        return sub if isinstance(sub, str) else None
    except JWTError:
        return None


def set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.cookie_name,
        value=token,
        max_age=settings.jwt_ttl_hours * 3600,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        path="/",
    )


def clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(key=settings.cookie_name, path="/")


def get_current_admin(request: Request) -> str:
    """Dependency: validates admin JWT cookie, returns admin login."""
    token = request.cookies.get(settings.cookie_name)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )
    sub = decode_access_token(token)
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
    return sub
