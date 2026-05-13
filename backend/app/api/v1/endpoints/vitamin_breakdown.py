"""
Vitamin breakdown endpoints.

Aggregate endpoints that combine daily_nutrition_view data with nutrient_goals
to return vitamin intake ratios for the frontend vitamin breakdown page.
"""

from datetime import date, timedelta
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.vitamin_breakdown import (
    VitaminBreakdownResponse,
    VitaminDay,
    VitaminDetail,
)

router = APIRouter()


def _build_days(
    nutrition_rows: list[dict],
    goals_by_nutrient: dict[int, float],
    dates: list[str],
) -> list[VitaminDay]:
    """Group nutrition rows by date and attach goal/ratio info."""

    # Index rows by date
    by_date: dict[str, list[dict]] = {d: [] for d in dates}
    for row in nutrition_rows:
        d = str(row.get("consumed_date", ""))
        if d in by_date:
            by_date[d].append(row)

    days: list[VitaminDay] = []
    for d in dates:
        vitamins: list[VitaminDetail] = []
        for row in by_date[d]:
            nutrient_id = row.get("id")
            total_qty = float(row.get("total_quantity", 0))
            goal_qty = goals_by_nutrient.get(nutrient_id, 0.0)
            ratio = (total_qty / goal_qty) if goal_qty > 0 else None

            vitamins.append(
                VitaminDetail(
                    nutrient_id=nutrient_id,
                    nutrient_name=row.get("nutrient_name", ""),
                    symbol=row.get("symbol"),
                    unit=row.get("unit"),
                    total_quantity=total_qty,
                    goal_quantity=goal_qty,
                    ratio=ratio,
                )
            )
        days.append(VitaminDay(date=d, vitamins=vitamins))

    return days


async def _fetch_goals(user_id: str, supabase: Client) -> dict[int, float]:
    """Return {nutrient_id: quantity} for a user's nutrient goals."""
    try:
        response = (
            supabase.table("nutrient_goals")
            .select("nutrient_id, quantity")
            .eq("user_id", user_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Supabase nutrient_goals query failed: {exc}"
        ) from exc

    return {
        row["nutrient_id"]: float(row.get("quantity") or 0)
        for row in (response.data or [])
    }


@router.get("/", response_model=VitaminBreakdownResponse)
async def get_daily_vitamin_breakdown(
    user_id: UUID,
    date: date = Query(..., description="Date in YYYY-MM-DD format"),
    supabase: Client = Depends(get_supabase_admin),
):
    """Return vitamin intake breakdown for a single day."""
    uid = str(user_id)
    date_str = date.isoformat()

    try:
        response = (
            supabase.table("daily_nutrition_view")
            .select("*")
            .eq("user_id", uid)
            .eq("consumed_date", date_str)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Supabase daily_nutrition_view query failed: {exc}"
        ) from exc

    goals = await _fetch_goals(uid, supabase)
    dates = [date_str]
    days = _build_days(response.data or [], goals, dates)

    return VitaminBreakdownResponse(dates=dates, days=days)


@router.get("/week", response_model=VitaminBreakdownResponse)
async def get_weekly_vitamin_breakdown(
    user_id: UUID,
    anchor_date: date = Query(..., description="End date of the 7-day window (YYYY-MM-DD)"),
    supabase: Client = Depends(get_supabase_admin),
):
    """Return vitamin intake breakdown for the 7 days ending on anchor_date."""
    uid = str(user_id)
    start_date = anchor_date - timedelta(days=6)

    dates = [
        (anchor_date - timedelta(days=i)).isoformat()
        for i in range(7)
    ]

    try:
        response = (
            supabase.table("daily_nutrition_view")
            .select("*")
            .eq("user_id", uid)
            .gte("consumed_date", start_date.isoformat())
            .lte("consumed_date", anchor_date.isoformat())
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Supabase daily_nutrition_view query failed: {exc}"
        ) from exc

    goals = await _fetch_goals(uid, supabase)
    days = _build_days(response.data or [], goals, dates)

    return VitaminBreakdownResponse(dates=dates, days=days)
