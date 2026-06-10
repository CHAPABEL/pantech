from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db import get_session
from models import Project
from schemas import ProjectOut

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=list[ProjectOut])
async def list_projects(
    session: AsyncSession = Depends(get_session),
) -> list[Project]:
    rows = (
        await session.execute(
            select(Project)
            .where(Project.is_published.is_(True))
            .order_by(Project.position, Project.id)
        )
    ).scalars().all()
    return list(rows)
