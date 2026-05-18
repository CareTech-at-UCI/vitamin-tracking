"""
User diet restriction schemas.
"""

from pydantic import BaseModel, ConfigDict, Field


class UserDietRestrictionItem(BaseModel):
    """One diet restriction linked to a user."""

    model_config = ConfigDict(extra="ignore")

    id: int
    name: str
    is_custom: bool


class UserDietRestrictionSyncCreate(BaseModel):
    """Request body for syncing a user's diet restrictions."""

    model_config = ConfigDict(extra="forbid")

    diet_restriction_ids: list[int] = Field(default_factory=list)
    custom_names: list[str] = Field(default_factory=list)


class ListUserDietRestrictionsResponse(BaseModel):
    """Response for listing a user's diet restrictions."""

    count: int
    items: list[UserDietRestrictionItem]
