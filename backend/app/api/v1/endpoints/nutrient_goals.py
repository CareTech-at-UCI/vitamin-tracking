"""
Nutrient goal endpoints.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.nutrient_goals import (
    ListNutrientGoalsResponse,
    NutrientGoalDeleteResponse,
    NutrientGoalRow,
    NutrientGoalSyncCreate,
    NutrientGoalUpdate,
)

router = APIRouter()


async def _ensure_user_exists(user_id: UUID, supabase: Client) -> None:
    """Return 404 when user foreign key does not exist."""
    try:
        user_response = (
            supabase.table("users")
            .select("id")
            .eq("id", str(user_id))
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase user lookup failed: {exc}") from exc

    if not (user_response.data or []):
        raise HTTPException(status_code=404, detail="User not found")


async def _ensure_nutrient_exists(nutrient_id: int, supabase: Client) -> None:
    """Return 404 when nutrient foreign key does not exist."""
    try:
        nutrient_response = (
            supabase.table("nutrients")
            .select("id")
            .eq("id", nutrient_id)
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase nutrient lookup failed: {exc}") from exc

    if not (nutrient_response.data or []):
        raise HTTPException(status_code=404, detail=f"Nutrient {nutrient_id} not found")


@router.get("/user/{user_id}", response_model=ListNutrientGoalsResponse)
async def get_nutrient_goals(
    user_id: UUID,
    supabase: Client = Depends(get_supabase_admin),
):
    """Retrieve all daily nutrient targets for a user."""
    await _ensure_user_exists(user_id, supabase)

    try:
        response = (
            supabase.table("nutrient_goals")
            .select("*")
            .eq("user_id", str(user_id))
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    items = response.data or []
    return {"count": len(items), "items": items}


@router.put("/user/{user_id}/sync", response_model=ListNutrientGoalsResponse)
async def sync_nutrient_goals(
    user_id: UUID,
    body: NutrientGoalSyncCreate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Overwrite all nutrient goals for a user — deletes existing, inserts new set."""
    await _ensure_user_exists(user_id, supabase)
    for goal in body.goals:
        await _ensure_nutrient_exists(goal.nutrient_id, supabase)

    try:
        supabase.table("nutrient_goals").delete().eq("user_id", str(user_id)).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase delete failed: {exc}") from exc

    payload = [
        {
            "user_id": str(user_id),
            "nutrient_id": goal.nutrient_id,
            "quantity": goal.quantity,
        }
        for goal in body.goals
    ]

    try:
        response = supabase.table("nutrient_goals").insert(payload).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase insert failed: {exc}") from exc

    rows = response.data or []
    return {"count": len(rows), "items": rows}


@router.patch("/user/{user_id}/nutrient/{nutrient_id}", response_model=NutrientGoalRow)
async def update_nutrient_goal(
    user_id: UUID,
    nutrient_id: int,
    body: NutrientGoalUpdate,
    supabase: Client = Depends(get_supabase_admin),
):
    """Adjust the quantity of a specific nutrient goal."""
    await _ensure_user_exists(user_id, supabase)
    await _ensure_nutrient_exists(nutrient_id, supabase)

    try:
        response = (
            supabase.table("nutrient_goals")
            .update({"quantity": body.quantity})
            .eq("user_id", str(user_id))
            .eq("nutrient_id", nutrient_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase update failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Nutrient goal not found")

    return rows[0]


@router.delete("/user/{user_id}/nutrient/{nutrient_id}", response_model=NutrientGoalDeleteResponse)
async def delete_nutrient_goal(
    user_id: UUID,
    nutrient_id: int,
    supabase: Client = Depends(get_supabase_admin),
):
    """Remove a specific nutrient goal by user and nutrient id."""
    await _ensure_user_exists(user_id, supabase)
    await _ensure_nutrient_exists(nutrient_id, supabase)

    try:
        response = (
            supabase.table("nutrient_goals")
            .delete()
            .eq("user_id", str(user_id))
            .eq("nutrient_id", nutrient_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase delete failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Nutrient goal not found")

    return {"deleted": True, "user_id": str(user_id), "nutrient_id": nutrient_id}