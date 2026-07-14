"""
Onboarding endpoints.
"""

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import ValidationError
from supabase import Client

from app.api.deps.auth import get_current_user_id
from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.onboarding import (
    AvatarStepPayload,
    HealthStepPayload,
    NameAgeStepPayload,
    OnboardingCompleteResponse,
    OnboardingStateResponse,
    OnboardingStepResponse,
    RestrictionsStepPayload,
    DietaryPlansStepPayload,
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

STEP_SCHEMAS: dict[str, type] = {
    "name_age": NameAgeStepPayload,
    "health": HealthStepPayload,
    "restrictions": RestrictionsStepPayload,
    "dietary_plans": DietaryPlansStepPayload,
    "avatar": AvatarStepPayload,
}

# Fields that must be non-null for onboarding to be considered complete
REQUIRED_FIELDS = [
    "first_name",
    "last_name",
    "date_of_birth",
    "sex",
    "height",
    "weight",
    "activity_level",
]


@router.get("/", response_model=OnboardingStateResponse)
async def get_onboarding(
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_admin),
):
    """Returns the current user's onboarding state for prefill and resume."""
    try:
        response = supabase.table("users").select("*").eq("id", user_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query failed: {e}") from e

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="User not found")

    user = rows[0]
    user["diet_restrictions"] = list_user_diet_restrictions(supabase, user_id)
    user["dietary_plans"] = list_user_dietary_plans(supabase, user_id)
    return user


@router.patch("/step/{step_key}", response_model=OnboardingStepResponse)
async def patch_onboarding_step(
    step_key: str,
    request: Request,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_admin),
):
    """Validates and saves one onboarding step, then updates current_step."""
    if step_key not in STEP_SCHEMAS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown step key '{step_key}'. Valid keys: {list(STEP_SCHEMAS)}",
        )

    raw_body = await request.json()
    try:
        body = STEP_SCHEMAS[step_key].model_validate(raw_body)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors()) from e

    if step_key == "restrictions":
        assert isinstance(body, RestrictionsStepPayload)
        sync_user_diet_restrictions(
            supabase,
            user_id,
            body.diet_restriction_ids,
            body.custom_names,
        )
        data = {"current_step": step_key}
    elif step_key == "dietary_plans":
        assert isinstance(body, DietaryPlansStepPayload)
        sync_user_dietary_plans(
            supabase,
            user_id,
            body.dietary_plan_ids,
            body.custom_names,
        )
        data = {"current_step": step_key}
    else:
        data = body.model_dump(mode="json")
        data["current_step"] = step_key

    try:
        response = (
            supabase.table("users").update(data).eq("id", user_id).execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database update failed: {e}") from e

    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")

    return {"current_step": step_key}


@router.post("/complete", response_model=OnboardingCompleteResponse)
async def complete_onboarding(
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_admin),
):
    """Verifies all required steps are complete and marks onboarding done."""
    try:
        response = supabase.table("users").select("*").eq("id", user_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query failed: {e}") from e

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="User not found")

    user = rows[0]
    missing = [f for f in REQUIRED_FIELDS if not user.get(f)]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Required fields not completed: {', '.join(missing)}",
        )

    try:
        supabase.table("users").update(
            {
                "is_completed": True,
                "current_step": "complete",
                "onboarding_completed_at": datetime.now(timezone.utc).isoformat(),
            }
        ).eq("id", user_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database update failed: {e}") from e

    return {"message": "Onboarding complete"}
