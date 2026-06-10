from __future__ import annotations

from pydantic import BaseModel


class StatsOut(BaseModel):
    messages_total: int
    messages_today: int
    visitors_today: int
    visitors_7d: int
    visitors_30d: int
    page_views_today: int
