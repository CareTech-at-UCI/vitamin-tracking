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
    Get all diet restrictions for a specific user 
    Returns: user_id, diet_id, is_custom, name
    """
    try:
        response = (
            supabase.table("user_diet_restrictions")
            .select("user_id, diet_id, diet_restrictions(name, is_custom)")
            .limit(limit)
            .execute()
        )
        print("RAW RESPONSE:", response)
        print("RAW DATA:", response.data)
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
        "items": items
    }
    

@router.get("/user/{user_id}", response_model=ListUserDietRestrictionsResponse)
async def get_user_diet_restriction(
    user_id: UUID,
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Get all diet restrictions for a specific user 
    Returns: user_id, diet_id, is_custom, name
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


@router.delete("/user/{user_id}/diet/{diet_id}", response_model=UserDietRestrictionsDelete)
async def delete_user_diet_restriction(
    user_id: UUID,
    diet_id: int,
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
        raise HTTPException(
            status_code=500,
            detail=f"Supabase delete failed: {exc}"
        ) from exc

    rows = response.data or []

    if not rows:
        raise HTTPException(status_code=404, detail="Diet restriction not found")

    deleted_row = rows[0]

    return {
        "user_id": deleted_row["user_id"],
        "diet_id": deleted_row["diet_id"],
        "deleted": True
    }
    

@router.put("/user/{user_id}/sync", response_model=list[UserDietRestrictionsRow])
async def sync_user_diet_restrictions(
    user_id: UUID,
    body: UserDietRestrictionsPut,
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Overwrite a user's entire diet restriction list and return inserted rows.
    """

    try:
        supabase.table("user_diet_restrictions") \
            .delete() \
            .eq("user_id", str(user_id)) \
            .execute()

        payload = [
            {"user_id": str(user_id), "diet_id": diet_id}
            for diet_id in body.diet_ids
        ]

        if not payload:
            return []

        response = (
            supabase.table("user_diet_restrictions")
            .insert(payload)
            .execute()
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Sync failed: {exc}"
        ) from exc

    return response.data or []