"""add partner short_description

Revision ID: 0007_partner_short_description
Revises: 0006_partner_full_description
Create Date: 2026-11-06 00:00:00

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0007_partner_short_description"
down_revision: Union[str, None] = "0006_partner_full_description"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "partners",
        sa.Column("short_description", sa.String(140), nullable=False, server_default=""),
    )
    op.alter_column("partners", "short_description", server_default=None)


def downgrade() -> None:
    op.drop_column("partners", "short_description")
