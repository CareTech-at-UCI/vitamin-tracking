"""
Meal endpoints.
"""

from datetime import date, datetime, time, timedelta
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.meals import (
    ListMealsResponse,
    MealCreate,
    MealDeleteResponse,
    MealRow,
    MealUpdate,
    RecentFoodsDayResponse,
)

router = APIRouter()

RECENT_FOODS_MEAL_KEYS = ("breakfast", "lunch", "dinner", "snacks")


@router.get("/", response_model=ListMealsResponse)
async def get_meals(
    limit: int = Query(default=20, ge=1, le=100), # change limits as needed
    supabase: Client = Depends(get_supabase_admin),
):
    """List rows from meals"""
    try:
        response = (
            supabase.table("meals")
            .select("*")
            .limit(limit)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    return {"count": len(response.data or []), "items": response.data or []}


@router.get("/user/{user_id}", response_model=ListMealsResponse)
async def get_user_meals(
    user_id: UUID,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    start_date: datetime | None = Query(default=None),
    end_date: datetime | None = Query(default=None),
    supabase: Client = Depends(get_supabase_admin),
):
    """List meals for one user with optional date filtering."""
    try:
        user_response = (
            supabase.table("users")
            .select("id")
            .eq("id", str(user_id))
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase user lookup failed: {exc}") from exc

    if not (user_response.data or []):
        raise HTTPException(status_code=404, detail="User not found")

    try:
        query = (
            supabase.table("meals")
            .select("*")
            .eq("user_id", str(user_id))
            .order("consumed_at", desc=True)
        )
        if start_date is not None:
            query = query.gte("consumed_at", start_date.isoformat())
        if end_date is not None:
            query = query.lte("consumed_at", end_date.isoformat())
        response = query.range(offset, offset + limit - 1).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    items = response.data or []
    return {"count": len(items), "items": items}


@router.get("/recent-foods", response_model=RecentFoodsDayResponse)
async def get_recent_foods_for_day(
    user_id: UUID = Query(...),
    date_value: date = Query(..., alias="date"),
    supabase: Client = Depends(get_supabase_admin),
):
    """Return logged meal items for one user's local calendar day."""
    day_start = datetime.combine(date_value, time.min)
    next_day_start = day_start + timedelta(days=1)

    try:
        user_response = (
            supabase.table("users")
            .select("id")
            .eq("id", str(user_id))
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase user lookup failed: {exc}") from exc

    if not (user_response.data or []):
        raise HTTPException(status_code=404, detail="User not found")

    try:
        meals_response = (
            supabase.table("meals")
            .select("id, type, consumed_at")
            .eq("user_id", str(user_id))
            .gte("consumed_at", day_start.isoformat())
            .lt("consumed_at", next_day_start.isoformat())
            .order("consumed_at")
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase meals query failed: {exc}") from exc

    meals = meals_response.data or []
    grouped_items = {key: [] for key in RECENT_FOODS_MEAL_KEYS}
    if not meals:
        return {"date": date_value, "meals": grouped_items}

    meal_ids = [meal["id"] for meal in meals]
    meal_type_by_id = {
        meal["id"]: "snacks" if meal.get("type") == "snack" else meal.get("type")
        for meal in meals
    }

    try:
        items_response = (
            supabase.table("meal_items")
            .select("id, meal_id, item_name")
            .in_("meal_id", meal_ids)
            .order("id")
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase meal items query failed: {exc}") from exc

    for item in items_response.data or []:
        meal_key = meal_type_by_id.get(item.get("meal_id"))
        if meal_key not in grouped_items:
            continue
        grouped_items[meal_key].append(
            {
                "id": item["id"],
                "meal_id": item["meal_id"],
                "name": item["item_name"],
            }
        )

    return {"date": date_value, "meals": grouped_items}


@router.post("/", response_model=MealRow)
async def create_meal(
    body: MealCreate,
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Create a new meal entry
    """
    try:
        response = (
            supabase.table("meals")
            .insert({
                "user_id": str(body.user_id),
                "consumed_at": body.consumed_at.isoformat(),
                "type": body.type.value,
                "notes": body.notes,
            })
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="meal not found")
    
    # creates meal
    return rows[0]


@router.get("/{meal_id}", response_model=MealRow)
async def get_meal(
    meal_id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """Get a single meal by ID"""
    try:
        response = (
            supabase.table("meals")
            .select("*")
            .eq("id", meal_id)
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    # gets the meal
    return rows[0]


@router.put("/{meal_id}", response_model=MealRow)
async def update_meal(
    meal_id: int,
    body: MealUpdate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Update a meal entry"""
    update_data = {}
    if body.consumed_at:
        update_data["consumed_at"] = body.consumed_at.isoformat()
    if body.type:
        update_data["type"] = body.type.value
    if body.notes is not None:
        update_data["notes"] = body.notes

    if not update_data:
        raise HTTPException(status_code=400, detail="Provide at least one field to update")

    try:
        response = (
            supabase.table("meals")
            .update(update_data).eq("id", meal_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="meal not found")
    
    # update
    return rows[0]


@router.delete("/{meal_id}", response_model=MealDeleteResponse)
async def delete_meal(
    meal_id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """Delete a meal entry"""
    try:
        response = (
            supabase.table("meals")
            .delete().eq("id", meal_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    if not response.data:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    # delete
    return {"deleted": True, "id": meal_id}
