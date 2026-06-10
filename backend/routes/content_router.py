from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db import get_session
from models import Content

router = APIRouter(prefix="/api/content", tags=["content"])


@router.get("")
async def list_content(
    session: AsyncSession = Depends(get_session),
) -> dict[str, dict[str, str]]:
    """Returns all content as `{ key: { value, type } }`."""
    rows = (await session.execute(select(Content))).scalars().all()
    return {
        row.key: {"value": row.value, "type": row.value_type.value} for row in rows
    }
