"""add partner full_description

Revision ID: 0006_partner_full_description
Revises: 0005_partner_certificates
Create Date: 2026-09-25 00:00:00

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0006_partner_full_description"
down_revision: Union[str, None] = "0005_partner_certificates"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "partners",
        sa.Column("full_description", sa.Text(), nullable=False, server_default=""),
    )
    op.alter_column("partners", "full_description", server_default=None)


def downgrade() -> None:
    op.drop_column("partners", "full_description")
