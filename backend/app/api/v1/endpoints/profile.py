"""
Profile endpoints
"""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from app.api.deps.auth import get_current_user_id
from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.profile import (
    ProfileDietaryPlansUpdatePayload,
    ProfileDietRestrictionsUpdatePayload,
    ProfileResponse,
    ProfileUpdatePayload,
)
from app.api.services.user_diet_restrictions import (
    list_user_diet_restrictions,
    sync_user_diet_restrictions,
)
from app.api.services.user_dietary_plans import (
    list_user_dietary_plans,
    sync_user_dietary_plans,
)

router = APIRouter()


@router.get(
    "/",
    response_model=ProfileResponse,
)
async def get_profile(
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_admin),
):
    """Get the authenticated user's complete profile."""

    try:
        response = (
            supabase
            .table("users")
            .select(
                """
                first_name,
                last_name,
                date_of_birth,
                sex,
                height,
                weight,
                activity_level,
                profile_picture
                """
            )
            .eq("id", user_id)
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Supabase profile lookup failed: {exc}",
        ) from exc

    rows = response.data or []

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    profile = rows[0]

    profile["diet_restrictions"] = list_user_diet_restrictions(
        supabase,
        user_id,
    )

    profile["dietary_plans"] = list_user_dietary_plans(
        supabase,
        user_id,
    )

    return profile


@router.patch(
    "/",
    response_model=ProfileResponse,
)
async def update_profile(
    body: ProfileUpdatePayload,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Update the authenticated user's profile.

    Only fields supplied in the request are updated.
    Onboarding state is intentionally not modified.
    """

    update_data: dict[str, Any] = body.model_dump(
        mode="json",
        exclude_unset=True,
    )

    if update_data:
        try:
            response = (
                supabase
                .table("users")
                .update(update_data)
                .eq("id", user_id)
                .execute()
            )
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Supabase profile update failed: {exc}",
            ) from exc

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )
    else:
        try:
            response = (
                supabase
                .table("users")
                .select("id")
                .eq("id", user_id)
                .limit(1)
                .execute()
            )
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Supabase profile lookup failed: {exc}",
            ) from exc

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

    try:
        response = (
            supabase
            .table("users")
            .select(
                """
                first_name,
                last_name,
                date_of_birth,
                sex,
                height,
                weight,
                activity_level,
                profile_picture
                """
            )
            .eq("id", user_id)
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Supabase profile lookup failed: {exc}",
        ) from exc

    rows = response.data or []

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    profile = rows[0]

    profile["diet_restrictions"] = list_user_diet_restrictions(
        supabase,
        user_id,
    )

    profile["dietary_plans"] = list_user_dietary_plans(
        supabase,
        user_id,
    )

    return profile

# diet restrictions + plans implemented separately

@router.put(
    "/diet-restrictions",
    response_model=ProfileResponse,
)
async def update_profile_diet_restrictions(
    body: ProfileDietRestrictionsUpdatePayload,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_admin),
):
    """Replace all dietary restrictions for the authenticated user."""

    sync_user_diet_restrictions(
        supabase,
        user_id,
        body.diet_restriction_ids,
        body.custom_names,
    )

    return await get_profile(
        user_id=user_id,
        supabase=supabase,
    )


@router.put(
    "/dietary-plans",
    response_model=ProfileResponse,
)
async def update_profile_dietary_plans(
    body: ProfileDietaryPlansUpdatePayload,
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

    return await get_profile(
        user_id=user_id,
        supabase=supabase,
    )
