"""
Nutrient endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.nutrients import (
    ListNutrientsResponse,
    NutrientCreate,
    NutrientDeleteResponse,
    NutrientRow,
    NutrientUpdate,
)

router = APIRouter()


@router.post("/", response_model=NutrientRow, status_code=201)
async def create_nutrient(
    body: NutrientCreate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Create a new nutrient lookup row."""
    try:
        response = (
            supabase.table("nutrients")
            .insert(body.model_dump())
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase insert failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=500, detail="Insert returned no row")

    return rows[0]
