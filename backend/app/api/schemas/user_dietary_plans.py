"""
User dietary plans schemas.
"""

from pydantic import BaseModel, ConfigDict, Field


class UserDietaryPlanItem(BaseModel):
    """One dietary plan linked to a user."""

    model_config = ConfigDict(extra="ignore")

    id: int
    name: str
    is_custom: bool


class UserDietaryPlanSyncCreate(BaseModel):
    """Request body for syncing a user's dietary plans."""

    model_config = ConfigDict(extra="forbid")

    dietary_plan_ids: list[int] = Field(default_factory=list)
    custom_names: list[str] = Field(default_factory=list)


class ListUserDietaryPlansResponse(BaseModel):
    """Response for listing a user's dietary plans."""

    count: int
    items: list[UserDietaryPlanItem]
