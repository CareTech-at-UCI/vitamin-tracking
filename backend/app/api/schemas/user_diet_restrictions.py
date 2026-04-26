"""
User Diet Restrictions schemas

Pydantic models for user diet restriction API requests and responses.
"""

from uuid import UUID
from typing import List

from pydantic import BaseModel, ConfigDict, Field


class UserDietRestrictionsCreate(BaseModel):
    """Request body for `POST /api/v1/user_diet_restrictions/`"""
    user_id: UUID
    diet_id: int


class UserDietRestrictionsBatchCreate(BaseModel):
    """Request body for `POST /api/v1/user_diet_restrictions/batch`"""
    user_id: UUID
    diet_ids: List[int] = Field(..., min_items=1)


class UserDietRestrictionsRow(BaseModel):
    """One row from `public.user_diet_restrictions`"""

    model_config = ConfigDict(extra="ignore")

    user_id: UUID
    diet_id: int


class UserDietRestrictionItem(BaseModel):
    """one user-diet pairing"""
    user_id: UUID
    diet_id: int
    name: str | None
    is_custom: bool | None


class ListUserDietRestrictionsResponse(BaseModel):
    """Request body for both GET paths"""
    items: List[UserDietRestrictionItem]


class UserDietRestrictionsDelete(BaseModel):
    """Request body for `DELETE /api/v1/user_diet_restrictions/user/{user_id}/diet/{diet_id}`"""
    user_id: UUID
    diet_id: int
    deleted: bool = True


class UserDietRestrictionsPut(BaseModel):
    """Request body for `PUT /api/v1/user_diet_restrictions/user/{user_id}/sync"""
    diet_ids: List[int] = Field(..., min_items=1)