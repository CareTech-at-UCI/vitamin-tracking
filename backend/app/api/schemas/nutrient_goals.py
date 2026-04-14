"""
Nutrient goal schemas

Pydantic models for user nutrient goal requests and responses.
"""

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class NutrientGoalInput(BaseModel):
    """One goal entry in a sync request."""

    nutrient_id: int = Field(..., gt=0)
    quantity: float = Field(..., ge=0)


class NutrientGoalSyncCreate(BaseModel):
    """Request body for `PUT /api/v1/nutrient-goals/user/{user_id}/sync`"""

    goals: list[NutrientGoalInput] = Field(..., min_length=1)


class NutrientGoalUpdate(BaseModel):
    """Request body for `PATCH /api/v1/nutrient-goals/user/{user_id}/nutrient/{nutrient_id}`"""

    quantity: float = Field(..., ge=0)


class NutrientGoalRow(BaseModel):
    """One row from `public.nutrient_goals`"""

    model_config = ConfigDict(extra="ignore")

    user_id: UUID
    nutrient_id: int
    quantity: float | None = None


class ListNutrientGoalsResponse(BaseModel):
    """Response for `GET /api/v1/nutrient-goals/user/{user_id}`"""

    count: int
    items: list[NutrientGoalRow]


class NutrientGoalDeleteResponse(BaseModel):
    """Response for `DELETE /api/v1/nutrient-goals/user/{user_id}/nutrient/{nutrient_id}`"""

    deleted: bool
    user_id: str
    nutrient_id: int