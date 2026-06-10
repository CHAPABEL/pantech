"""init schema

Revision ID: 0001_init
Revises:
Create Date: 2026-05-08 00:00:00

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


revision: str = "0001_init"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "messages",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(64), nullable=True),
        sa.Column("direction", sa.String(255), nullable=True),
        sa.Column("about", sa.Text(), nullable=False, server_default=""),
        sa.Column("file_path", sa.String(512), nullable=True),
        sa.Column("status", sa.String(32), nullable=False, server_default="sent"),
        sa.Column("error", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )
    op.create_index("ix_messages_email", "messages", ["email"])

    content_value_type = postgresql.ENUM(
        "text", "html", "json", name="content_value_type"
    )
    content_value_type.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "content",
        sa.Column("key", sa.String(128), primary_key=True),
        sa.Column("value", sa.Text(), nullable=False, server_default=""),
        sa.Column(
            "value_type",
            postgresql.ENUM(
                "text", "html", "json", name="content_value_type", create_type=False
            ),
            nullable=False,
            server_default="text",
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )

    op.create_table(
        "cards",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("image_path", sa.String(512), nullable=True),
        sa.Column(
            "stack",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default="[]",
        ),
        sa.Column(
            "is_clickable", sa.Boolean(), nullable=False, server_default=sa.text("false")
        ),
        sa.Column("popup_content_key", sa.String(128), nullable=True),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "is_published", sa.Boolean(), nullable=False, server_default=sa.text("true")
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )

    op.create_table(
        "services",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("image_path", sa.String(512), nullable=True),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "is_published", sa.Boolean(), nullable=False, server_default=sa.text("true")
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )

    op.create_table(
        "projects",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("image_path", sa.String(512), nullable=True),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "is_published", sa.Boolean(), nullable=False, server_default=sa.text("true")
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )

    op.create_table(
        "visit_stats",
        sa.Column("day", sa.Date(), primary_key=True),
        sa.Column(
            "unique_visitors", sa.Integer(), nullable=False, server_default="0"
        ),
        sa.Column("page_views", sa.Integer(), nullable=False, server_default="0"),
    )


def downgrade() -> None:
    op.drop_table("visit_stats")
    op.drop_table("projects")
    op.drop_table("services")
    op.drop_table("cards")
    op.drop_table("content")
    op.drop_index("ix_messages_email", table_name="messages")
    op.drop_table("messages")

    content_value_type = postgresql.ENUM(
        "text", "html", "json", name="content_value_type"
    )
    content_value_type.drop(op.get_bind(), checkfirst=True)
