"""
User diet restriction schemas.
"""

from pydantic import BaseModel, ConfigDict, Field, model_validator


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

    @model_validator(mode="after")
    def require_at_least_one(self):
        if not self.diet_restriction_ids and not self.custom_names:
            raise ValueError("Select at least one dietary restriction")
        return self


class ListUserDietRestrictionsResponse(BaseModel):
    """Response for listing a user's diet restrictions."""

    count: int
    items: list[UserDietRestrictionItem]
