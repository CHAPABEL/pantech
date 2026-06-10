from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db import get_session
from models import Card
from schemas import CardOut

router = APIRouter(prefix="/api/cards", tags=["cards"])


@router.get("", response_model=list[CardOut])
async def list_cards(session: AsyncSession = Depends(get_session)) -> list[Card]:
    rows = (
        await session.execute(
            select(Card)
            .where(Card.is_published.is_(True))
            .order_by(Card.position, Card.id)
        )
    ).scalars().all()
    return list(rows)
