from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException, Request, Response, status
from pydantic import BaseModel, Field

from config import settings
from services.security import (
    create_access_token,
    clear_auth_cookie,
    decode_access_token,
    set_auth_cookie,
    verify_admin_credentials,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginPayload(BaseModel):
    login: str = Field(..., min_length=1, max_length=128)
    password: str = Field(..., min_length=1, max_length=512)


class MeResponse(BaseModel):
    login: str


@router.post("/login", response_model=MeResponse)
async def login(payload: LoginPayload, response: Response) -> MeResponse:
    if not verify_admin_credentials(payload.login, payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid login or password",
        )
    token = create_access_token(payload.login)
    set_auth_cookie(response, token)
    return MeResponse(login=payload.login)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response) -> Response:
    clear_auth_cookie(response)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me")
async def me(request: Request) -> Response:
    token = request.cookies.get(settings.cookie_name)
    sub = decode_access_token(token) if token else None
    if not sub:
        # Return 401 directly so we can also clear a stale cookie on the way out.
        # (Raising HTTPException would discard cookie mutations.)
        response = Response(
            content=json.dumps({"detail": "Not authenticated"}),
            media_type="application/json",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )
        if token:
            clear_auth_cookie(response)
        return response
    return Response(
        content=json.dumps({"login": sub}),
        media_type="application/json",
        status_code=status.HTTP_200_OK,
    )
