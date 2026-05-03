"""
Diet Restriction endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.diet_restrictions import (
    ListDietRestrictionsResponse,
    DietRestrictionCreate,
    DietRestrictionDeleteResponse,
    DietRestrictionRow,
    DietRestrictionUpdate,
)

router = APIRouter()


@router.get("/", response_model=ListDietRestrictionsResponse)
async def get_diet_restrictions(
    limit: int = Query(default=20, ge=1, le=100),
    supabase: Client = Depends(get_supabase_admin),
):
    """
    List rows from `public.diet_restrictions`
    """
    try:
        response = (
            supabase.table("diet_restrictions")
            .select("*")
            .limit(limit)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    return {"count": len(response.data or []), "items": response.data or []}


@router.get("/{id}", response_model=DietRestrictionRow)
async def get_diet_restriction(
    id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Retrieve one row from `public.diet_restrictions` by `diet_id`
    """
    try:
        response = (
            supabase.table("diet_restrictions")
            .select("*")
            .eq("id", id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Diet restriction not found")
    return rows[0]


@router.post("/", response_model=DietRestrictionRow)
async def create_diet_restriction(
    body: DietRestrictionCreate,  # The parsed request (dictionary)
    supabase: Client = Depends(get_supabase_admin),
):
    """Insert one row, return the new row as JSON."""
    try:
        response = (
            supabase.table("diet_restrictions")
            .insert({"name": body.name, "is_custom": body.is_custom})
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase insert failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=500, detail="Insert returned no row")
    return rows[0]


@router.patch("/{id}", response_model=DietRestrictionRow)
async def update_diet_restriction(
    id: int,
    body: DietRestrictionUpdate,  # The parsed request (dictionary)
    supabase: Client = Depends(get_supabase_admin),
):
    """Update `name` and/or 'is_custom' for one row; return the updated row."""
    update_data = {}
    if body.name is not None:
        update_data["name"] = body.name
    if body.is_custom is not None:
        update_data["is_custom"] = body.is_custom
    if not update_data:
        raise HTTPException(status_code=400, detail="Provide at least one field to update")

    try:
        response = (
            supabase.table("diet_restrictions")
            .update(update_data)
            .eq("id", id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase update failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Diet restriction not found")
    return rows[0]


@router.delete("/{id}", response_model=DietRestrictionDeleteResponse)
async def delete_diet_restriction(
    id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """Delete one row by id."""
    try:
        response = (
            supabase.table("diet_restrictions")
            .delete()
            .eq("id", id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase delete failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Diet restriction not found")
    return {"deleted": True, "id": id}
