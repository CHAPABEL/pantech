"""add partner certificate_path

Revision ID: 0003_partner_cert
Revises: 0002_partners
Create Date: 2026-09-09 00:00:00

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0003_partner_cert"
down_revision: Union[str, None] = "0002_partners"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "partners",
        sa.Column("certificate_path", sa.String(512), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("partners", "certificate_path")
