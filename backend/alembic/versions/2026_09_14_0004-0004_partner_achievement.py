"""add partner achievement

Revision ID: 0004_partner_achievement
Revises: 0003_partner_cert
Create Date: 2026-09-14 00:00:00

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0004_partner_achievement"
down_revision: Union[str, None] = "0003_partner_cert"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "partners",
        sa.Column("achievement", sa.Text(), nullable=False, server_default=""),
    )
    op.alter_column("partners", "achievement", server_default=None)


def downgrade() -> None:
    op.drop_column("partners", "achievement")
