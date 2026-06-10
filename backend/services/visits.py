from __future__ import annotations

from datetime import date, timedelta

from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from db import AsyncSessionLocal
from models import VisitStat


async def record_visit(*, today: date, is_new_visitor: bool) -> None:
    """Upsert today's row in visit_stats."""
    async with AsyncSessionLocal() as session:
        stmt = pg_insert(VisitStat).values(
            day=today,
            unique_visitors=1 if is_new_visitor else 0,
            page_views=1,
        )
        stmt = stmt.on_conflict_do_update(
            index_elements=[VisitStat.day],
            set_={
                "unique_visitors": VisitStat.unique_visitors
                + (1 if is_new_visitor else 0),
                "page_views": VisitStat.page_views + 1,
            },
        )
        await session.execute(stmt)
        await session.commit()


async def get_stats_summary(session: AsyncSession) -> dict[str, int]:
    today = date.today()
    week_ago = today - timedelta(days=6)
    month_ago = today - timedelta(days=29)

    today_row = (
        await session.execute(
            select(VisitStat).where(VisitStat.day == today)
        )
    ).scalar_one_or_none()

    week_visitors = (
        await session.execute(
            select(func.coalesce(func.sum(VisitStat.unique_visitors), 0)).where(
                VisitStat.day >= week_ago
            )
        )
    ).scalar_one()

    month_visitors = (
        await session.execute(
            select(func.coalesce(func.sum(VisitStat.unique_visitors), 0)).where(
                VisitStat.day >= month_ago
            )
        )
    ).scalar_one()

    return {
        "visitors_today": today_row.unique_visitors if today_row else 0,
        "visitors_7d": int(week_visitors or 0),
        "visitors_30d": int(month_visitors or 0),
        "page_views_today": today_row.page_views if today_row else 0,
    }
