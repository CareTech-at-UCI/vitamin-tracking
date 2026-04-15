"""
Meal endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.meals import (
    ListMealsResponse,
    MealCreate,
    MealDeleteResponse,
    MealRow,
    MealUpdate,
)

router = APIRouter()


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
            .select("*").eq("meal_id", meal_id).single()
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    if not response.data:
        raise HTTPException(status_code=404, detail="meal not found")
    
    # gets the meal
    return response.data


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
            .update(update_data).eq("meal_id", meal_id)
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
            .delete().eq("meal_id", meal_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    if not response.data:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    # delete
    return {"deleted": True, "id": meal_id}