"""partner certificates array (replaces single certificate_path)

Revision ID: 0005_partner_certificates
Revises: 0004_partner_achievement
Create Date: 2026-09-24 00:00:00

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB


revision: str = "0005_partner_certificates"
down_revision: Union[str, None] = "0004_partner_achievement"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "partners",
        sa.Column("certificates", JSONB(), nullable=False, server_default="[]"),
    )
    op.execute(
        """
        UPDATE partners
        SET certificates = jsonb_build_array(certificate_path)
        WHERE certificate_path IS NOT NULL
        """
    )
    op.alter_column("partners", "certificates", server_default=None)
    op.drop_column("partners", "certificate_path")


def downgrade() -> None:
    op.add_column(
        "partners",
        sa.Column("certificate_path", sa.String(512), nullable=True),
    )
    op.execute(
        """
        UPDATE partners
        SET certificate_path = certificates->>0
        WHERE jsonb_array_length(certificates) > 0
        """
    )
    op.drop_column("partners", "certificates")
