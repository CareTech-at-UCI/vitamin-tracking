"""
User diet restriction endpoints.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from app.api.deps.auth import get_current_user_id
from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.user_diet_restrictions import (
    ListUserDietRestrictionsResponse,
    UserDietRestrictionSyncCreate,
)
from app.api.services.user_diet_restrictions import (
    list_user_diet_restrictions,
    sync_user_diet_restrictions,
)

router = APIRouter()


async def _ensure_user_exists(user_id: UUID, supabase: Client) -> None:
    try:
        response = (
            supabase.table("users")
            .select("id")
            .eq("id", str(user_id))
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase user lookup failed: {exc}") from exc

    if not (response.data or []):
        raise HTTPException(status_code=404, detail="User not found")
    
@router.get("/me", response_model=ListUserDietRestrictionsResponse)
async def get_my_diet_restrictions(
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_admin),
):
    """List diet restrictions for the authenticated user."""
    await _ensure_user_exists(UUID(user_id), supabase)

    items = list_user_diet_restrictions(
        supabase,
        user_id,
    )

    return {
        "count": len(items),
        "items": items,
    }


@router.get("/user/{user_id}", response_model=ListUserDietRestrictionsResponse)
async def get_user_diet_restrictions(
    user_id: UUID,
    supabase: Client = Depends(get_supabase_admin),
):
    """List diet restrictions for a user."""
    await _ensure_user_exists(user_id, supabase)
    items = list_user_diet_restrictions(supabase, str(user_id))
    return {"count": len(items), "items": items}


@router.put("/user/{user_id}/sync", response_model=ListUserDietRestrictionsResponse)
async def sync_user_diet_restrictions_endpoint(
    user_id: UUID,
    body: UserDietRestrictionSyncCreate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Replace all diet restrictions for a user."""
    await _ensure_user_exists(user_id, supabase)
    sync_user_diet_restrictions(
        supabase,
        str(user_id),
        body.diet_restriction_ids,
        body.custom_names,
    )
    items = list_user_diet_restrictions(supabase, str(user_id))
    return {"count": len(items), "items": items}



@router.put("/me/sync", response_model=ListUserDietRestrictionsResponse)
async def sync_my_diet_restrictions(
    body: UserDietRestrictionSyncCreate,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_admin),
):
    """Replace diet restrictions for the authenticated user."""
    sync_user_diet_restrictions(
        supabase,
        user_id,
        body.diet_restriction_ids,
        body.custom_names,
    )
    items = list_user_diet_restrictions(supabase, user_id)
    return {"count": len(items), "items": items}
