"""
Meal items endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.meal_items import (
    ListMealItemsResponse,
    MealItemCreate,
    MealItemDeleteResponse,
    MealItemRow,
    MealItemUpdate,
)

router = APIRouter()


@router.get("/", response_model=ListMealItemsResponse)
async def get_meal_items(
    limit: int = Query(default=20, ge=1, le=100), # change limits as needed idk
    supabase: Client = Depends(get_supabase_admin),
):
    """List rows from meal_items"""
    try:
        response = (
            supabase.table("meal_items")
            .select("*").limit(limit)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    # gets meal items and count
    return {"count": len(response.data or []), "items": response.data or []}
    # return {"items": response.data or [], "count": len(response.data or [])} # count first or items first?

@router.post("/", response_model=MealItemRow)
async def create_meal_item(
    body: MealItemCreate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Create a meal item"""
    try:
        response = (
            supabase.table("meal_items")
            .insert({
                "meal_id": body.meal_id,
                "weight": body.weight,
                "item_name": body.item_name,
            })
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=500, detail="Insert returned no row")
    
    # creates meal item
    return rows[0]


@router.get("/{item_id}", response_model=MealItemRow)
async def get_meal_item(
    item_id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """Get a single meal item by ID"""
    try:
        response = (
            supabase.table("meal_items")
            .select("*").eq("id", item_id).single()
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    if not response.data:
        raise HTTPException(status_code=404, detail="Meal item not found")
    
    # gets meal item
    return response.data


@router.put("/{item_id}", response_model=MealItemRow)
async def update_meal_item(
    item_id: int,
    body: MealItemUpdate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Update a meal item"""

    # only mutable fields are accepted; meal_id is immutable after create
    update_data = {}
    if body.weight is not None:
        update_data["weight"] = body.weight
    if body.item_name is not None:
        update_data["item_name"] = body.item_name

    if not update_data:
        raise HTTPException(status_code=400, detail="Provide at least one field to update")

    try:
        response = (
            supabase.table("meal_items")
            .update(update_data).eq("id", item_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Meal item not found")
    
    # update
    return rows[0]


@router.delete("/{item_id}", response_model=MealItemDeleteResponse)
async def delete_meal_item(
    item_id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """Delete a meal item"""
    try:
        response = (
            supabase.table("meal_items")
            .delete().eq("id", item_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    if not response.data:
        raise HTTPException(status_code=404, detail="Meal item not found")
    
    # delete meal item + id
    return {"deleted": True, "id": item_id}