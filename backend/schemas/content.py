from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


ValueType = Literal["text", "html", "json"]


class ContentItem(BaseModel):
    key: str = Field(..., min_length=1, max_length=128)
    value: str
    value_type: ValueType = "text"


class ContentBulkUpdate(BaseModel):
    items: list[ContentItem]


class _BaseEntity(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    image_path: str | None = None
    position: int = 0
    is_published: bool = True
    created_at: datetime
    updated_at: datetime


class CardOut(_BaseEntity):
    stack: list[str] = Field(default_factory=list)
    is_clickable: bool = False
    popup_content_key: str | None = None


class CardCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = ""
    image_path: str | None = None
    stack: list[str] = Field(default_factory=list)
    is_clickable: bool = False
    popup_content_key: str | None = None
    position: int = 0
    is_published: bool = True


class CardUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    description: str | None = None
    image_path: str | None = None
    stack: list[str] | None = None
    is_clickable: bool | None = None
    popup_content_key: str | None = None
    position: int | None = None
    is_published: bool | None = None


class ServiceOut(_BaseEntity):
    pass


class ServiceCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = ""
    image_path: str | None = None
    position: int = 0
    is_published: bool = True


class ServiceUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    description: str | None = None
    image_path: str | None = None
    position: int | None = None
    is_published: bool | None = None


class ProjectOut(_BaseEntity):
    pass


class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = ""
    image_path: str | None = None
    position: int = 0
    is_published: bool = True


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    description: str | None = None
    image_path: str | None = None
    position: int | None = None
    is_published: bool | None = None


class PartnerOut(_BaseEntity):
    pass


class PartnerCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = ""
    image_path: str | None = None
    position: int = 0
    is_published: bool = True


class PartnerUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    description: str | None = None
    image_path: str | None = None
    position: int | None = None
    is_published: bool | None = None


class ImageAsset(BaseModel):
    path: str
    name: str
    source: str


class ImageAssetList(BaseModel):
    items: list[ImageAsset]
