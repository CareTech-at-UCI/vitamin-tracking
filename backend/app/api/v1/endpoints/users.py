"""
User endpoints.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.users import (
    UserUpdate,
    UserResponse,
    ListUserResponse
)

router = APIRouter()

@router.get("/", response_model=ListUserResponse) 
async def get_users(
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Retrives all users - for admin / dev use.
    """
    try:
        response = (
            supabase.table("users")
            .select("*")
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {e}") from e

    return {"count": len(response.data or []), "items": response.data or []}




@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: UUID,
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Retrives a user by id.
    """
    try:
        response = (
            supabase.table("users")
            .select("*")
            .eq("id", str(user_id))
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {e}") from e

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=500, detail="GET returned no user")
    return rows[0]


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: UUID,
    body: UserUpdate,
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Updates a user by id; returns the updated user.
    """
    data = body.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="Provide at least one field to update")
    try:
        response = (
            supabase.table("users")
            .update(data)
            .eq("id", str(user_id))
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase update failed: {e}") from e

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="User not found")
    return rows[0]