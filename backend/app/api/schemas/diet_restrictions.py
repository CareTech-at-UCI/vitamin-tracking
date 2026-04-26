"""
Diet Restriction schemas

Pydantic models and types for API Request and Response validation.
"""

from pydantic import BaseModel, ConfigDict, Field


class DietRestrictionCreate(BaseModel):
    """Request body for `POST /api/v1/diet_restrictions/`"""
    model_config = ConfigDict(extra="forbid")
    name: str = Field(..., min_length=1, max_length=500)
    is_custom: bool = Field(default=False)


class DietRestrictionUpdate(BaseModel):
    """Request body for `PATCH /api/v1/diet_restrictions/{diet_id}`"""
    model_config = ConfigDict(extra="forbid")
    name: str | None = Field(default=None, min_length=1, max_length=500)
    is_custom: bool | None = Field(default=None)


class DietRestrictionRow(BaseModel):
    """One row from `public.diet_restrictions`"""
    model_config = ConfigDict(extra="ignore")

    id: int
    name: str
    is_custom: bool | None


class ListDietRestrictionsResponse(BaseModel):
    """Response from `GET /api/v1/diet_restrictions/`"""
    count: int
    items: list[DietRestrictionRow]


class DietRestrictionDeleteResponse(BaseModel):
    """Response from `DELETE /api/v1/diet_restrictions/{diet_id}` when implemented"""
    deleted: bool
    id: int