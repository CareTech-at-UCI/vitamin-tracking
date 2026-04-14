"""
User Diet Restrictions schemas

Pydantic models for workshop todo requests and responses (reference for other resources).
"""

from uuid import UUID
from typing import List

from pydantic import BaseModel, ConfigDict, Field


class UserDietRestrictionsCreate(BaseModel):
    """Request body for `POST /api/v1/user_diet_restrictions/`"""
    user_id: UUID
    diet_id: int


class UserDietRestrictionsBatchCreate(BaseModel):
    """Rrequest body for `POST /api/v1/user-diet-restrictions/batch`"""
    user_id: UUID
    diet_ids: List[int] = Field(..., min_items=1)


class UserDietRestrictionsRow(BaseModel):
    """One row from `public.user_diet_restrictions`"""

    model_config = ConfigDict(extra="ignore")

    user_id: UUID
    diet_id: int


class UserDietRestrictionItem(BaseModel):
    user_id: UUID
    diet_id: int
    name: str | None
    is_custom: bool


class ListUserDietRestrictionsResponse(BaseModel):
    count: int
    items: List[UserDietRestrictionItem]


class UserDietRestrictionsDelete(BaseModel):
    """Response from `DELETE /api/v1/user-diet-restrictions/{id}` when implemented"""

    deleted: bool
    id: int


class UserDietRestrictionsPut(BaseModel):
    """Response from `PUT /api/v1/user-diet-restrictions/user/{user_id}/sync"""
    restriction_list: List[str] = Field(..., min_items=1)