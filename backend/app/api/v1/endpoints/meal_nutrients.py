"""
Meal nutrient endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.meal_nutrients import (
    MealNutrientBatchCreate,
    MealNutrientBatchResponse,
    MealNutrientCreate,
    MealNutrientRow,
    ListMealNutrientsResponse,
    MealNutrientUpdate,
    MealNutrientSyncCreate,
    MealNutrientSyncResponse,
    MealNutrientDeleteResponse,
)

router = APIRouter()


@router.post("/", response_model=MealNutrientRow, status_code=201)
async def create_meal_nutrient(
    body: MealNutrientCreate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Link one nutrient to one meal item."""
    try:
        response = (
            supabase.table("meal_nutrients")
            .insert(body.model_dump())
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase insert failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=500, detail="Insert returned no row")

    return rows[0]


@router.post("/batch", response_model=MealNutrientBatchResponse, status_code=201)
async def create_meal_nutrients_batch(
    body: MealNutrientBatchCreate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Link multiple nutrients to a single meal item in one request."""
    payload = [
        {
            "item_id": body.item_id,
            "nutrient_id": nutrient.nutrient_id,
            "quantity": nutrient.quantity,
        }
        for nutrient in body.nutrients
    ]

    try:
        response = supabase.table("meal_nutrients").insert(payload).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase batch insert failed: {exc}") from exc

    rows = response.data or []
    if len(rows) != len(payload):
        raise HTTPException(
            status_code=500,
            detail="Batch insert did not return all rows",
        )

    return {"count": len(rows), "items": rows}


@router.get("/meal/{meal_id}", response_model=ListMealNutrientsResponse)
async def get_meal_nutrients(
    meal_id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """Retrieve all nutrients linked to a specific meal."""
    try:
        response = (
            supabase.table("meal_nutrients")
            .select("*")
            .eq("item_id", meal_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc
    
    items = response.data or []
    return {"count": len(items), "items": items}


@router.patch("/item/{item_id}/nutrient/{nutrient_id}", response_model=MealNutrientRow)
async def update_meal_nutrient(
    item_id: int,
    nutrient_id: int,
    body: MealNutrientUpdate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Update the quantity of a specific nutrient linked to a meal."""
    try:
        response = (
            supabase.table("meal_nutrients")
            .update({"quantity": body.quantity})
            .eq("item_id", item_id)
            .eq("nutrient_id", nutrient_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase update failed: {exc}") from exc
    
    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Meal nutrient not found")
    
    return rows[0]


@router.put("/meal/{item_id}/sync", response_model=MealNutrientSyncResponse)
async def sync_meal_nutrients(
    item_id: int,
    body: MealNutrientSyncCreate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Overwrite all nutrients for a meal, delete existing and insert new set."""
    try:
        supabase.table("meal_nutrients").delete().eq("item_id", item_id).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase delete failed: {exc}") from exc
    

    payload = [
        {
            "item_id": item_id,
            "nutrient_id": nutrient.nutrient_id,
            "quantity": nutrient.quantity,
        }
        for nutrient in body.nutrients
    ]

    try:
        response = supabase.table("meal_nutrients").insert(payload).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase insert failed: {exc}") from exc
    
    rows = response.data or []
    return {"count": len(rows), "items": rows}


@router.delete("/item/{item_id}/nutrient/{nutrient_id}", response_model=MealNutrientDeleteResponse)
async def delete_meal_nutrient(
    item_id: int,
    nutrient_id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """Remove a specific nutrient entry from a meal by item and nutrient id."""
    try:
        response = (
            supabase.table("meal_nutrients")
            .delete()
            .eq("item_id", item_id)
            .eq("nutrient_id", nutrient_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase delete failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Meal nutrient not found")

    return {"deleted": True, "item_id": item_id, "nutrient_id": nutrient_id}