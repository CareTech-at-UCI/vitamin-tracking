"""
Onboarding schemas

Pydantic models for onboarding API request and response validation.
"""

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.api.schemas.user_diet_restrictions import UserDietRestrictionItem
from app.api.schemas.users import ProfilePictureType, SexType


class NameAgeStepPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    first_name: str = Field(min_length=1, max_length=20)
    last_name: str = Field(min_length=1, max_length=20)
    date_of_birth: date


class HealthStepPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    height: Decimal = Field(gt=0, max_digits=5, decimal_places=2)
    weight: Decimal = Field(gt=0, max_digits=5, decimal_places=2)
    sex: SexType
    activity_level: int = Field(ge=1, le=5)


class RestrictionsStepPayload(BaseModel):
    """Diet restrictions synced to `user_diet_restrictions`."""

    model_config = ConfigDict(extra="forbid")

    diet_restriction_ids: list[int] = Field(default_factory=list)
    custom_names: list[str] = Field(default_factory=list)


class AvatarStepPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    profile_picture: ProfilePictureType


class OnboardingStateResponse(BaseModel):
    current_step: str | None = None
    is_completed: bool = False
    first_name: str | None = None
    last_name: str | None = None
    date_of_birth: date | None = None
    sex: SexType | None = None
    height: Decimal | None = None
    weight: Decimal | None = None
    activity_level: int | None = None
    diet_restrictions: list[UserDietRestrictionItem] | None = None
    profile_picture: ProfilePictureType | None = None


class OnboardingStepResponse(BaseModel):
    current_step: str
    message: str = "Step saved"


class OnboardingCompleteResponse(BaseModel):
    message: str = "Onboarding complete"
