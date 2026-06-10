from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    phone: str | None = None
    direction: str | None = None
    about: str
    file_path: str | None = None
    status: str
    error: str | None = None
    created_at: datetime


class MessageList(BaseModel):
    items: list[MessageOut]
    total: int
