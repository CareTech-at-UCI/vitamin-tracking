"""
User dietary plan endpoints.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from app.api.deps.auth import get_current_user_id
from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.user_dietary_plans import (
    ListUserDietaryPlansResponse,
    UserDietaryPlanSyncCreate,
)
from app.api.services.user_dietary_plans import (
    list_user_dietary_plans,
    sync_user_dietary_plans,
)

router = APIRouter()


async def _ensure_user_exists(
    user_id: UUID,
    supabase: Client,
) -> None:
    try:
        response = (
            supabase.table("users")
            .select("id")
            .eq("id", str(user_id))
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Supabase user lookup failed: {exc}",
        ) from exc

    if not (response.data or []):
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )



@router.get(
    "/user/{user_id}",
    response_model=ListUserDietaryPlansResponse,
)
async def get_user_dietary_plans(
    user_id: UUID,
    supabase: Client = Depends(get_supabase_admin),
):
    """List dietary plans for a user."""

    await _ensure_user_exists(user_id, supabase)

    items = list_user_dietary_plans(
        supabase,
        str(user_id),
    )

    return {
        "count": len(items),
        "items": items,
    }


@router.put(
    "/user/{user_id}/sync",
    response_model=ListUserDietaryPlansResponse,
)
async def sync_user_dietary_plans_endpoint(
    user_id: UUID,
    body: UserDietaryPlanSyncCreate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Replace all dietary plans for a user."""

    await _ensure_user_exists(user_id, supabase)

    sync_user_dietary_plans(
        supabase,
        str(user_id),
        body.dietary_plan_ids,
        body.custom_names,
    )

    items = list_user_dietary_plans(
        supabase,
        str(user_id),
    )

    return {
        "count": len(items),
        "items": items,
    }


@router.put(
    "/me/sync",
    response_model=ListUserDietaryPlansResponse,
)
async def sync_my_dietary_plans(
    body: UserDietaryPlanSyncCreate,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_admin),
):
    """Replace all dietary plans for the authenticated user."""

    sync_user_dietary_plans(
        supabase,
        user_id,
        body.dietary_plan_ids,
        body.custom_names,
    )

    items = list_user_dietary_plans(
        supabase,
        user_id,
    )

    return {
        "count": len(items),
        "items": items,
    }