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
