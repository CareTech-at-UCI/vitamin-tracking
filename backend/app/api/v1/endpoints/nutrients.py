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

@router.get("/", response_model=ListNutrientsResponse)
async def get_nutrients(
    supabase: Client = Depends(get_supabase_admin),
):
    """List all nutrients and their units."""
    try:
        response = (
            supabase.table("nutrients")
            .select("*")
            .order("name")
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    items = response.data or []
    return {"count": len(items), "items": items}


@router.get("/{nutrient_id}", response_model=NutrientRow)
async def get_nutrient(
    nutrient_id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """Get one nutrient by id."""
    try:
        response = (
            supabase.table("nutrients")
            .select("*")
            .eq("nutrient_id", nutrient_id)
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Nutrient not found")

    return rows[0]
