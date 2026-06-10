from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db import get_session
from models import Service
from schemas import ServiceOut

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("", response_model=list[ServiceOut])
async def list_services(
    session: AsyncSession = Depends(get_session),
) -> list[Service]:
    rows = (
        await session.execute(
            select(Service)
            .where(Service.is_published.is_(True))
            .order_by(Service.position, Service.id)
        )
    ).scalars().all()
    return list(rows)
