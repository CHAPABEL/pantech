from __future__ import annotations

import enum
from datetime import date, datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    Date,
    DateTime,
    Enum as SAEnum,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from db import Base


class ContentValueType(str, enum.Enum):
    TEXT = "text"
    HTML = "html"
    JSON = "json"


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class Message(Base, TimestampMixin):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    phone: Mapped[str | None] = mapped_column(String(64), nullable=True)
    direction: Mapped[str | None] = mapped_column(String(255), nullable=True)
    about: Mapped[str] = mapped_column(Text, nullable=False, default="")
    file_path: Mapped[str | None] = mapped_column(String(512), nullable=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="sent")
    error: Mapped[str | None] = mapped_column(Text, nullable=True)


class Content(Base):
    __tablename__ = "content"

    key: Mapped[str] = mapped_column(String(128), primary_key=True)
    value: Mapped[str] = mapped_column(Text, nullable=False, default="")
    value_type: Mapped[ContentValueType] = mapped_column(
        SAEnum(
            ContentValueType,
            name="content_value_type",
            values_callable=lambda enum_cls: [m.value for m in enum_cls],
        ),
        nullable=False,
        default=ContentValueType.TEXT,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class Card(Base, TimestampMixin):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    image_path: Mapped[str | None] = mapped_column(String(512), nullable=True)
    stack: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    is_clickable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    popup_content_key: Mapped[str | None] = mapped_column(String(128), nullable=True)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class Service(Base, TimestampMixin):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    image_path: Mapped[str | None] = mapped_column(String(512), nullable=True)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    image_path: Mapped[str | None] = mapped_column(String(512), nullable=True)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class Partner(Base, TimestampMixin):
    __tablename__ = "partners"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    image_path: Mapped[str | None] = mapped_column(String(512), nullable=True)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class VisitStat(Base):
    __tablename__ = "visit_stats"

    day: Mapped[date] = mapped_column(Date, primary_key=True)
    unique_visitors: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    page_views: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
