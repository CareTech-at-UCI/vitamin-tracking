"""
User Diet Restriction endpoints.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.user_diet_restrictions import *


router = APIRouter()


@router.get("/", response_model=ListUserDietRestrictionsResponse)
async def get_user_diet_restrictions(
    limit: int = Query(default=20, ge=1, le=100),
    supabase: Client = Depends(get_supabase_admin),
):
    """
    List all user-diet restriction links (flattened)
    Returns: user_id, diet_id, name, is_custom
    """
    try:
        response = (
            supabase.table("user_diet_restrictions")
            .select("user_id, diet_id, users(id), diet_restrictions(is_custom, name)")
            .limit(limit)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Supabase query failed: {exc}"
        ) from exc

    items = []

    for row in response.data or []:
        user = row.get("users") or {}
        diet = row.get("diet_restrictions") or {}

        items.append({
            "user_id": row.get("user_id"),
            "diet_id": row.get("diet_id"),
            "name": diet.get("name"),
            "is_custom": diet.get("is_custom"),
        })

    return {
        "count": len(items),
        "items": items
    }


@router.get("/user/{user_id}", response_model=ListUserDietRestrictionsResponse)
async def get_user_diet_restriction(
    user_id: UUID,
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Get all diet restrictions for a specific user (flattened)
    Returns: user_id, diet_id, name, is_custom
    """
    try:
        response = (
            supabase.table("user_diet_restrictions")
            .select("user_id, diet_id, diet_restrictions(is_custom, name)")
            .eq("user_id", str(user_id))
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Supabase query failed: {exc}"
        ) from exc

    items = []

    for row in response.data or []:
        diet = row.get("diet_restrictions") or {}

        items.append({
            "user_id": row.get("user_id"),
            "diet_id": row.get("diet_id"),
            "name": diet.get("name"),
            "is_custom": diet.get("is_custom"),
        })

    return {
        "count": len(items),
        "items": items
    }


@router.post("/", response_model=UserDietRestrictionsRow)
async def create_user_diet_restriction(
    body: UserDietRestrictionsCreate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Insert one row, return the new row as JSON."""
    try:
        response = (
            supabase.table("user_diet_restrictions")
            .insert({
                "user_id": str(body.user_id),
                "diet_id": body.diet_id
            })
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase insert failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=500, detail="Insert returned no row")

    return rows[0]


@router.post("/batch", response_model=list[UserDietRestrictionsRow])
async def create_user_diet_restrictions_batch(
    body: UserDietRestrictionsBatchCreate,
    supabase: Client = Depends(get_supabase_admin),
):
    try:
        payload = [
            {"user_id": str(body.user_id), "diet_id": diet_id}
            for diet_id in body.diet_ids
        ]

        response = (
            supabase.table("user_diet_restrictions")
            .insert(payload)
            .execute()
        )

    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase insert failed: {exc}") from exc

    return response.data or []


@router.delete("/{diet_id}", response_model=UserDietRestrictionsDelete)
async def delete_user_diet_restriction(
    diet_id: int,
    user_id: UUID,
    supabase: Client = Depends(get_supabase_admin),
):
    try:
        response = (
            supabase.table("user_diet_restrictions")
            .delete()
            .eq("user_id", str(user_id))
            .eq("diet_id", diet_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase delete failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Diet restriction not found")

    return {
        "deleted": True,
        "id": diet_id
    }


@router.put("/{diet_id}", response_model=UserDietRestrictionsRow)
async def put_user_diet_restriction(
    diet_id: int,
    user_id: UUID,
    new_diet_id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Replace a user's diet restriction (update join table row).
    """

    try:
        response = (
            supabase.table("user_diet_restrictions")
            .update({"diet_id": new_diet_id})
            .eq("user_id", str(user_id))
            .eq("diet_id", diet_id)
            .execute()
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Supabase update failed: {exc}"
        ) from exc

    rows = response.data or []

    if not rows:
        raise HTTPException(status_code=404, detail="User diet restriction not found")

    return rows[0]