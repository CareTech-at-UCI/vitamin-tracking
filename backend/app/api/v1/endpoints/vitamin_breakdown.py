"""
Vitamin breakdown endpoints.

Aggregate meal nutrients with nutrient_goals for the frontend vitamin breakdown page.
"""

from datetime import date, datetime, time, timedelta, timezone
from uuid import UUID
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.vitamin_breakdown import (
    VitaminBreakdownResponse,
    VitaminDay,
    VitaminDetail,
)

router = APIRouter()


def _local_zone(time_zone: str) -> ZoneInfo:
    try:
        return ZoneInfo(time_zone)
    except (ZoneInfoNotFoundError, ValueError) as exc:
        raise HTTPException(status_code=422, detail="Invalid time zone") from exc


def _fetch_nutrition_rows(
    user_id: str, start_date: date, end_date: date, local_zone: ZoneInfo, supabase: Client
) -> list[dict]:
    range_start = datetime.combine(start_date, time.min, tzinfo=local_zone)
    range_end = datetime.combine(end_date + timedelta(days=1), time.min, tzinfo=local_zone)

    try:
        meals = (
            supabase.table("meals")
            .select("id, consumed_at")
            .eq("user_id", user_id)
            .gte("consumed_at", range_start.astimezone(timezone.utc).isoformat())
            .lt("consumed_at", range_end.astimezone(timezone.utc).isoformat())
            .execute()
        ).data or []
        if not meals:
            return []

        meal_ids = [meal["id"] for meal in meals]
        items = (
            supabase.table("meal_items")
            .select("id, meal_id")
            .in_("meal_id", meal_ids)
            .execute()
        ).data or []
        if not items:
            return []

        item_ids = [item["id"] for item in items]
        quantities = (
            supabase.table("meal_nutrients")
            .select("item_id, nutrient_id, quantity")
            .in_("item_id", item_ids)
            .execute()
        ).data or []
        if not quantities:
            return []

        nutrients = (
            supabase.table("nutrients")
            .select("id, name, symbol, unit")
            .in_("id", list({row["nutrient_id"] for row in quantities}))
            .execute()
        ).data or []
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase nutrition query failed: {exc}") from exc

    date_by_meal = {
        meal["id"]: datetime.fromisoformat(meal["consumed_at"].replace("Z", "+00:00"))
        .astimezone(local_zone).date().isoformat()
        for meal in meals
    }
    date_by_item = {item["id"]: date_by_meal[item["meal_id"]] for item in items}
    nutrient_by_id = {nutrient["id"]: nutrient for nutrient in nutrients}
    totals: dict[tuple[str, int], float] = {}
    for row in quantities:
        key = (date_by_item[row["item_id"]], row["nutrient_id"])
        totals[key] = totals.get(key, 0) + float(row.get("quantity") or 0)

    rows = [
        {
            "consumed_date": consumed_date,
            "id": nutrient_id,
            "nutrient_name": nutrient_by_id[nutrient_id]["name"],
            "symbol": nutrient_by_id[nutrient_id].get("symbol"),
            "unit": nutrient_by_id[nutrient_id].get("unit"),
            "total_quantity": quantity,
        }
        for (consumed_date, nutrient_id), quantity in totals.items()
        if nutrient_id in nutrient_by_id
    ]
    return sorted(rows, key=lambda row: row["nutrient_name"])


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
    time_zone: str = Query(default="UTC"),
    supabase: Client = Depends(get_supabase_admin),
):
    """Return vitamin intake breakdown for a single day."""
    uid = str(user_id)
    date_str = date.isoformat()

    nutrition_rows = _fetch_nutrition_rows(uid, date, date, _local_zone(time_zone), supabase)
    goals = await _fetch_goals(uid, supabase)
    dates = [date_str]
    days = _build_days(nutrition_rows, goals, dates)

    return VitaminBreakdownResponse(dates=dates, days=days)


@router.get("/week", response_model=VitaminBreakdownResponse)
async def get_weekly_vitamin_breakdown(
    user_id: UUID,
    anchor_date: date = Query(..., description="End date of the 7-day window (YYYY-MM-DD)"),
    time_zone: str = Query(default="UTC"),
    supabase: Client = Depends(get_supabase_admin),
):
    """Return vitamin intake breakdown for the 7 days ending on anchor_date."""
    uid = str(user_id)
    start_date = anchor_date - timedelta(days=6)

    dates = [
        (anchor_date - timedelta(days=i)).isoformat()
        for i in range(7)
    ]

    nutrition_rows = _fetch_nutrition_rows(uid, start_date, anchor_date, _local_zone(time_zone), supabase)
    goals = await _fetch_goals(uid, supabase)
    days = _build_days(nutrition_rows, goals, dates)

    return VitaminBreakdownResponse(dates=dates, days=days)
