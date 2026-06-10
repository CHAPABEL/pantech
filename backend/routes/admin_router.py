from __future__ import annotations

from datetime import date, datetime, time, timezone
from pathlib import Path
from typing import Type, TypeVar

from fastapi import APIRouter, Body, Depends, File, Form, HTTPException, Query, UploadFile, status
from pydantic import BaseModel
from sqlalchemy import delete, func, or_, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from db import get_session
from models import Card, Content, ContentValueType, Message, Partner, Project, Service
from schemas import (
    CardCreate,
    CardOut,
    CardUpdate,
    ContentBulkUpdate,
    MessageList,
    MessageOut,
    ImageAssetList,
    PartnerCreate,
    PartnerOut,
    PartnerUpdate,
    ProjectCreate,
    ProjectOut,
    ProjectUpdate,
    ServiceCreate,
    ServiceOut,
    ServiceUpdate,
    StatsOut,
)
from services.media import list_available_images, save_image
from services.security import get_current_admin
from services.visits import get_stats_summary

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
    dependencies=[Depends(get_current_admin)],
)


# ----- content -----

@router.get("/content")
async def admin_list_content(
    session: AsyncSession = Depends(get_session),
) -> list[dict[str, str]]:
    rows = (
        await session.execute(select(Content).order_by(Content.key))
    ).scalars().all()
    return [
        {"key": r.key, "value": r.value, "value_type": r.value_type.value}
        for r in rows
    ]


@router.put("/content")
async def admin_update_content(
    payload: ContentBulkUpdate,
    session: AsyncSession = Depends(get_session),
) -> dict[str, int]:
    if not payload.items:
        return {"updated": 0}
    for item in payload.items:
        stmt = pg_insert(Content).values(
            key=item.key,
            value=item.value,
            value_type=ContentValueType(item.value_type),
        )
        stmt = stmt.on_conflict_do_update(
            index_elements=[Content.key],
            set_={
                "value": item.value,
                "value_type": ContentValueType(item.value_type),
            },
        )
        await session.execute(stmt)
    await session.commit()
    return {"updated": len(payload.items)}


# ----- cards / services / projects -----

ModelT = TypeVar("ModelT")


def _crud_routes(
    *,
    path: str,
    Model: Type,
    OutSchema: Type[BaseModel],
    CreateSchema: Type[BaseModel],
    UpdateSchema: Type[BaseModel],
    tag: str,
) -> APIRouter:
    sub = APIRouter(prefix=path, tags=[tag])

    @sub.get("", response_model=list[OutSchema])
    async def list_all(session: AsyncSession = Depends(get_session)):
        rows = (
            await session.execute(select(Model).order_by(Model.position, Model.id))
        ).scalars().all()
        return list(rows)

    async def create(
        payload: BaseModel = Body(...),
        session: AsyncSession = Depends(get_session),
    ):
        obj = Model(**payload.model_dump())
        session.add(obj)
        await session.commit()
        await session.refresh(obj)
        return obj

    async def update(
        item_id: int,
        payload: BaseModel = Body(...),
        session: AsyncSession = Depends(get_session),
    ):
        obj = await session.get(Model, item_id)
        if not obj:
            raise HTTPException(status_code=404, detail="Not found")
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(obj, field, value)
        await session.commit()
        await session.refresh(obj)
        return obj

    # FastAPI introspects `__annotations__` to detect Body schemas. Because
    # CreateSchema/UpdateSchema are received via TypeVar, we have to patch the
    # annotation post-hoc with the concrete Pydantic class for each route.
    create.__annotations__["payload"] = CreateSchema
    update.__annotations__["payload"] = UpdateSchema

    sub.add_api_route(
        "",
        create,
        methods=["POST"],
        response_model=OutSchema,
        status_code=status.HTTP_201_CREATED,
    )
    sub.add_api_route(
        "/{item_id}",
        update,
        methods=["PUT"],
        response_model=OutSchema,
    )

    @sub.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    async def remove(
        item_id: int, session: AsyncSession = Depends(get_session)
    ) -> None:
        await session.execute(delete(Model).where(Model.id == item_id))
        await session.commit()

    return sub


router.include_router(
    _crud_routes(
        path="/cards",
        Model=Card,
        OutSchema=CardOut,
        CreateSchema=CardCreate,
        UpdateSchema=CardUpdate,
        tag="admin-cards",
    )
)
router.include_router(
    _crud_routes(
        path="/services",
        Model=Service,
        OutSchema=ServiceOut,
        CreateSchema=ServiceCreate,
        UpdateSchema=ServiceUpdate,
        tag="admin-services",
    )
)
router.include_router(
    _crud_routes(
        path="/projects",
        Model=Project,
        OutSchema=ProjectOut,
        CreateSchema=ProjectCreate,
        UpdateSchema=ProjectUpdate,
        tag="admin-projects",
    )
)
router.include_router(
    _crud_routes(
        path="/partners",
        Model=Partner,
        OutSchema=PartnerOut,
        CreateSchema=PartnerCreate,
        UpdateSchema=PartnerUpdate,
        tag="admin-partners",
    )
)


# ----- uploads / media library -----

@router.get("/images", response_model=ImageAssetList)
async def admin_list_images(
    category: str | None = Query(
        default=None,
        pattern="^(media|partners|cards|services|projects)$",
    ),
) -> ImageAssetList:
    """Gallery items for admin image picker (uploads + static paths)."""
    items = list_available_images(category)
    return ImageAssetList(items=items)


@router.post("/upload")
async def admin_upload_image(
    file: UploadFile = File(...),
    category: str = Form("media"),
) -> dict[str, str]:
    """Upload image; returns public path served at /api/uploads/..."""
    path = await save_image(file, category=category)
    return {"path": path, "name": Path(path).name}


# ----- messages -----

@router.get("/messages", response_model=MessageList)
async def admin_list_messages(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    q: str | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
) -> MessageList:
    base = select(Message)
    count_q = select(func.count(Message.id))
    if q:
        like = f"%{q.lower()}%"
        cond = or_(
            func.lower(Message.email).like(like),
            func.lower(Message.name).like(like),
            func.lower(Message.about).like(like),
        )
        base = base.where(cond)
        count_q = count_q.where(cond)

    total = (await session.execute(count_q)).scalar_one()
    rows = (
        await session.execute(
            base.order_by(Message.created_at.desc()).limit(limit).offset(offset)
        )
    ).scalars().all()
    return MessageList(items=[MessageOut.model_validate(r) for r in rows], total=int(total))


# ----- stats -----

@router.get("/stats", response_model=StatsOut)
async def admin_stats(session: AsyncSession = Depends(get_session)) -> StatsOut:
    today = date.today()
    today_start = datetime.combine(today, time.min, tzinfo=timezone.utc)

    messages_total = (
        await session.execute(select(func.count(Message.id)))
    ).scalar_one()
    messages_today = (
        await session.execute(
            select(func.count(Message.id)).where(Message.created_at >= today_start)
        )
    ).scalar_one()

    visit_summary = await get_stats_summary(session)

    return StatsOut(
        messages_total=int(messages_total or 0),
        messages_today=int(messages_today or 0),
        visitors_today=visit_summary["visitors_today"],
        visitors_7d=visit_summary["visitors_7d"],
        visitors_30d=visit_summary["visitors_30d"],
        page_views_today=visit_summary["page_views_today"],
    )
