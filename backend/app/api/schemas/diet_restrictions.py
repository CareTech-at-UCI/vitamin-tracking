"""
Diet Restriction schemas

Pydantic models and types for API Request and Response validation.
"""

from pydantic import BaseModel, ConfigDict, Field


class DietRestrictionCreate(BaseModel):
    """Request body for `POST /api/v1/diet_restrictions/`"""
    name: str = Field(..., min_length=1, max_length=500)
    is_custom: bool = Field(default=False)


class DietRestrictionUpdate(BaseModel):
    """Request body for `PATCH /api/v1/diet_restrictions/{diet_id}`"""
    name: str | None = Field(default=None, min_length=1, max_length=500)
    is_custom: bool | None = Field(default=None)


class DietRestrictionRow(BaseModel):
    """One row from `public.diet_restrictions`"""
    model_config = ConfigDict(extra="ignore")

    diet_id: int
    name: str
    is_custom: bool


class ListDietRestrictionsResponse(BaseModel):
    """Response from `GET /api/v1/diet_restrictions/`"""
    count: int
    items: list[DietRestrictionRow]


class DietRestrictionDeleteResponse(BaseModel):
    """Response from `DELETE /api/v1/diet_restrictions/{diet_id}` when implemented"""
    deleted: bool
    diet_id: int