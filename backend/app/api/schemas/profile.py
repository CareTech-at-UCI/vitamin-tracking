"""
Profile schemas.

Pydantic models for profile API request and response validation.
"""

from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.api.schemas.user_diet_restrictions import UserDietRestrictionItem
from app.api.schemas.user_dietary_plans import UserDietaryPlanItem
from app.api.schemas.users import ProfilePictureType, SexType


class ProfileUpdatePayload(BaseModel):
    """Fields that can be updated on a user's profile."""

    model_config = ConfigDict(extra="forbid")

    first_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=20,
    )
    last_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=20,
    )
    date_of_birth: date | None = None
    sex: SexType | None = None
    height: Decimal | None = Field(
        default=None,
        gt=0,
        max_digits=5,
        decimal_places=2,
    )
    weight: Decimal | None = Field(
        default=None,
        gt=0,
        max_digits=5,
        decimal_places=2,
    )
    activity_level: int | None = Field(
        default=None,
        ge=1,
        le=5,
    )
    profile_picture: ProfilePictureType | None = None


class ProfileDietRestrictionsUpdatePayload(BaseModel):
    """Payload for replacing a user's dietary restrictions."""

    model_config = ConfigDict(extra="forbid")

    diet_restriction_ids: list[int] = Field(default_factory=list)
    custom_names: list[str] = Field(default_factory=list)


class ProfileDietaryPlansUpdatePayload(BaseModel):
    """Payload for replacing a user's dietary plans."""

    model_config = ConfigDict(extra="forbid")

    dietary_plan_ids: list[int] = Field(default_factory=list)
    custom_names: list[str] = Field(default_factory=list)


class ProfileResponse(BaseModel):
    """Complete profile for the authenticated user."""

    model_config = ConfigDict(extra="ignore")

    first_name: str | None = None
    last_name: str | None = None
    date_of_birth: date | None = None
    sex: SexType | None = None
    height: Decimal | None = None
    weight: Decimal | None = None
    activity_level: int | None = None
    profile_picture: ProfilePictureType | None = None
    diet_restrictions: list[UserDietRestrictionItem] = Field(
        default_factory=list
    )
    dietary_plans: list[UserDietaryPlanItem] = Field(
        default_factory=list
    )
