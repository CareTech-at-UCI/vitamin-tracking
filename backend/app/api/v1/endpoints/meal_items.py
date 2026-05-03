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
    MealItemSyncCreate,
    MealItemUpdate,
)

router = APIRouter()


def _ensure_meal_exists(supabase: Client, meal_id: int) -> None:
    """Raise 404 when the meal_id does not exist in `meals`."""
    try:
        response = (
            supabase.table("meals")
            .select("id")
            .eq("id", meal_id)
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase meal lookup failed: {exc}") from exc

    if not (response.data or []):
        raise HTTPException(status_code=404, detail="Meal not found")


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


@router.get("/meal/{meal_id}", response_model=ListMealItemsResponse)
async def get_meal_items_by_meal(
    meal_id: int,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    supabase: Client = Depends(get_supabase_admin),
):
    """List all meal items for one meal id."""
    _ensure_meal_exists(supabase, meal_id)

    try:
        response = (
            supabase.table("meal_items")
            .select("*")
            .eq("meal_id", meal_id)
            .order("id")
            .range(offset, offset + limit - 1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    items = response.data or []
    return {"count": len(items), "items": items}


@router.put("/meal/{meal_id}/sync", response_model=ListMealItemsResponse)
async def sync_meal_items(
    meal_id: int,
    body: MealItemSyncCreate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Overwrite a meal's item list while preserving existing item IDs when possible."""
    _ensure_meal_exists(supabase, meal_id)

    seen_ids: set[int] = set()
    requested_ids: list[int] = []
    for item in body.items:
        if item.id is None:
            continue
        if item.id in seen_ids:
            raise HTTPException(status_code=400, detail=f"Duplicate meal item id in request: {item.id}")
        seen_ids.add(item.id)
        requested_ids.append(item.id)

    try:
        existing_response = (
            supabase.table("meal_items")
            .select("*")
            .eq("meal_id", meal_id)
            .order("id")
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    existing_rows = existing_response.data or []
    existing_by_id = {row["id"]: row for row in existing_rows}

    for item_id in requested_ids:
        if item_id not in existing_by_id:
            raise HTTPException(
                status_code=400,
                detail=f"Meal item {item_id} does not belong to meal {meal_id}",
            )

    existing_ids = set(existing_by_id)
    ids_to_delete = sorted(existing_ids - set(requested_ids))

    if ids_to_delete:
        try:
            supabase.table("meal_items").delete().in_("id", ids_to_delete).execute()
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Supabase delete failed: {exc}") from exc

    for item in body.items:
        if item.id is None:
            continue

        update_data = {
            "weight": item.weight,
            "item_name": item.item_name,
        }
        try:
            supabase.table("meal_items").update(update_data).eq("id", item.id).execute()
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Supabase update failed: {exc}") from exc

    payload = [
        {
            "meal_id": meal_id,
            "weight": item.weight,
            "item_name": item.item_name,
        }
        for item in body.items
        if item.id is None
    ]

    if payload:
        try:
            supabase.table("meal_items").insert(payload).execute()
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Supabase insert failed: {exc}") from exc

    try:
        response = (
            supabase.table("meal_items")
            .select("*")
            .eq("meal_id", meal_id)
            .order("id")
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    rows = response.data or []
    return {"count": len(rows), "items": rows}


@router.get("/{item_id}", response_model=MealItemRow)
async def get_meal_item(
    item_id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """Get a single meal item by ID"""
    try:
        response = (
            supabase.table("meal_items")
            .select("*")
            .eq("id", item_id)
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Meal item not found")
    
    # gets meal item
    return rows[0]


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