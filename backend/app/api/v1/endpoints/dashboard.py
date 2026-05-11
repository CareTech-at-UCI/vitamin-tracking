"""
Dashboard endpoints.
"""

from datetime import date, datetime, timedelta
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.dashboard import DashboardWeekResponse

router = APIRouter()


@router.get("/week", response_model=DashboardWeekResponse)
async def get_dashboard_week(
    user_id: UUID,
    anchor_date: date | None = Query(default=None),
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Get dashboard vitamin totals for past 7 days.
    """

    if anchor_date is None:
        anchor_date = datetime.utcnow().date()

    # Generate rolling 7 day window.
    start_date = anchor_date - timedelta(days=6)
    dates = [start_date + timedelta(days=i) for i in range(7)]

    # Default empty response structure.
    empty_days = [{"date": current_date, "vitamins": []} for current_date in dates]

    try:
        # Fetch meals for the selected user within the date range.
        meals_response = (
            supabase.table("meals")
            .select("*")
            .eq("user_id", str(user_id))
            .gte("consumed_at", start_date.isoformat())
            .lte("consumed_at", anchor_date.isoformat())
            .execute()
        )

        meals = meals_response.data or []

        meal_ids = [meal["id"] for meal in meals]

        if not meal_ids:
            return {"dates": dates, "days": empty_days}

        # Fetch meal items tied to the user's meals.
        meal_items_response = (
            supabase.table("meal_items")
            .select("*")
            .in_("meal_id", meal_ids)
            .execute()
        )

        meal_items = meal_items_response.data or []

        item_ids = [item["id"] for item in meal_items]

        if not item_ids:
            return {"dates": dates, "days": empty_days}

        meal_nutrients_response = (
            supabase.table("meal_nutrients")
            .select("*")
            .in_("item_id", item_ids)
            .execute()
        )

        # Fetch nutrient quantities linked to meal items.
        meal_nutrients = meal_nutrients_response.data or []

        nutrient_ids = list({row["nutrient_id"] for row in meal_nutrients})

        if not nutrient_ids:
            return {"dates": dates, "days": empty_days}
        
        # Fetch nutrient metadata and the user's nutrient goals.
        nutrients_response = (
            supabase.table("nutrients")
            .select("*")
            .in_("id", nutrient_ids)
            .execute()
        )

        goals_response = (
            supabase.table("nutrient_goals")
            .select("*")
            .eq("user_id", str(user_id))
            .in_("nutrient_id", nutrient_ids)
            .execute()
        )

        nutrients = nutrients_response.data or []
        goals = goals_response.data or []

        # Create lookup maps for faster aggregation.
        nutrients_by_id = {nutrient["id"]: nutrient for nutrient in nutrients}
        goals_by_nutrient_id = {
            goal["nutrient_id"]: goal["quantity"]
            for goal in goals
        }

        meal_by_id = {meal["id"]: meal for meal in meals}
        meal_id_by_item_id = {
            item["id"]: item["meal_id"]
            for item in meal_items
        }

        # Aggregate nutrient totals by day and nutrient.
        totals_by_date_and_nutrient = {}

        for row in meal_nutrients:
            item_id = row["item_id"]
            nutrient_id = row["nutrient_id"]
            quantity = row.get("quantity") or 0

            meal_id = meal_id_by_item_id.get(item_id)
            meal = meal_by_id.get(meal_id)

            if meal is None:
                continue

            consumed_date = datetime.fromisoformat(
                meal["consumed_at"].replace("Z", "+00:00")
            ).date()

            key = (consumed_date, nutrient_id)
            totals_by_date_and_nutrient[key] = (
                totals_by_date_and_nutrient.get(key, 0) + quantity
            )

        # Build frontend-ready response structure.
        days = []

        for current_date in dates:
            vitamins = []

            for nutrient_id in nutrient_ids:
                nutrient = nutrients_by_id.get(nutrient_id)
                goal_quantity = goals_by_nutrient_id.get(nutrient_id)

                if nutrient is None or goal_quantity is None or goal_quantity == 0:
                    continue

                total_quantity = totals_by_date_and_nutrient.get(
                    (current_date, nutrient_id),
                    0,
                )

                percentage = round((total_quantity / goal_quantity) * 100, 2)

                vitamins.append(
                    {
                        "nutrient_id": nutrient_id,
                        "nutrient_name": nutrient["name"],
                        "symbol": nutrient.get("symbol"),
                        "unit": nutrient.get("unit"),
                        "total_quantity": round(total_quantity, 2),
                        "goal_quantity": goal_quantity,
                        "percentage": percentage,
                    }
                )

            days.append(
                {
                    "date": current_date,
                    "vitamins": vitamins,
                }
            )

        return {
            "dates": dates,
            "days": days,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Dashboard query failed: {exc}",
        ) from exc