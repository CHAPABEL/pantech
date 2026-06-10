from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db import get_session
from models import Partner
from schemas import PartnerOut

router = APIRouter(prefix="/api/partners", tags=["partners"])


@router.get("", response_model=list[PartnerOut])
async def list_partners(
    session: AsyncSession = Depends(get_session),
) -> list[Partner]:
    rows = (
        await session.execute(
            select(Partner)
            .where(Partner.is_published.is_(True))
            .order_by(Partner.position, Partner.id)
        )
    ).scalars().all()
    return list(rows)
