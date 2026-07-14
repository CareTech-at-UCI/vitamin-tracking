"""
Dietary Plans schemas

Pydantic models and types for API Request and Response validation.
"""

from pydantic import BaseModel, ConfigDict, Field


class DietaryPlanCreate(BaseModel):
    """Request body for `POST /api/v1/dietary_plans/`"""
    model_config = ConfigDict(extra="forbid")
    name: str = Field(..., min_length=1, max_length=500)
    is_custom: bool = Field(default=False)


class DietaryPlanUpdate(BaseModel):
    """Request body for `PATCH /api/v1/dietary_plans/{id}`"""
    model_config = ConfigDict(extra="forbid")
    name: str | None = Field(default=None, min_length=1, max_length=500)
    is_custom: bool | None = Field(default=None)


class DietaryPlanRow(BaseModel):
    """One row from `public.dietary_plans`"""
    model_config = ConfigDict(extra="ignore")

    id: int
    name: str
    is_custom: bool | None


class ListDietaryPlansResponse(BaseModel):
    """Response from `GET /api/v1/dietary_plans/`"""
    count: int
    items: list[DietaryPlanRow]


class DietaryPlanDeleteResponse(BaseModel):
    """Response from `DELETE /api/v1/dietary_plans/{id}`"""
    message: str
