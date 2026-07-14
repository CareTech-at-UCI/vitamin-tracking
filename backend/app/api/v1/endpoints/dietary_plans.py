"""
Dietary Plans endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.dietary_plans import (
    ListDietaryPlansResponse,
    DietaryPlanCreate,
    DietaryPlanDeleteResponse,
    DietaryPlanRow,
    DietaryPlanUpdate,
)

router = APIRouter()


@router.get("/", response_model=ListDietaryPlansResponse)
async def get_dietary_plans(
    limit: int = Query(default=20, ge=1, le=100),
    is_custom: bool | None = Query(default=None),
    supabase: Client = Depends(get_supabase_admin),
):
    """
    List rows from `public.dietary_plans`.
    Use `is_custom=false` to list preset options for onboarding.
    """
    try:
        query = supabase.table("dietary_plans").select("*")
        if is_custom is not None:
            query = query.eq("is_custom", is_custom)
        response = query.limit(limit).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    return {"count": len(response.data or []), "items": response.data or []}


@router.get("/{id}", response_model=DietaryPlanRow)
async def get_dietary_plan(
    id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Retrieve one row from `public.dietary_plans` by `id`
    """
    try:
        response = (
            supabase.table("dietary_plans")
            .select("*")
            .eq("id", id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Dietary plan not found")
    return rows[0]


@router.post("/", response_model=DietaryPlanRow)
async def create_dietary_plan(
    body: DietaryPlanCreate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Insert one row, return the new row as JSON."""
    try:
        response = (
            supabase.table("dietary_plans")
            .insert({"name": body.name, "is_custom": body.is_custom})
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase insert failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=500, detail="Insert returned no row")
    return rows[0]


@router.patch("/{id}", response_model=DietaryPlanRow)
async def update_dietary_plan(
    id: int,
    body: DietaryPlanUpdate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Update `name` and/or `is_custom` for one row; return the updated row."""
    update_data = {}
    if body.name is not None:
        update_data["name"] = body.name
    if body.is_custom is not None:
        update_data["is_custom"] = body.is_custom
    if not update_data:
        raise HTTPException(status_code=400, detail="Provide at least one field to update")

    try:
        response = (
            supabase.table("dietary_plans")
            .update(update_data)
            .eq("id", id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase update failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Dietary plan not found")
    return rows[0]


@router.delete("/{id}", response_model=DietaryPlanDeleteResponse)
async def delete_dietary_plan(
    id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """Delete one row and return a success message."""
    try:
        response = (
            supabase.table("dietary_plans")
            .delete()
            .eq("id", id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase delete failed: {exc}") from exc

    if not response.data:
        raise HTTPException(status_code=404, detail="Dietary plan not found")
    return {"message": "Dietary plan deleted"}
