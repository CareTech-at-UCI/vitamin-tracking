"""
User schemas

Pydantic models and types for API Request and Response validation.
"""

from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class SexType(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class ProfilePictureType(str, Enum):
    fox = "fox"
    monkey = "monkey"
    cat = "cat"


class UserUpdate(BaseModel):
    """Request body for `PATCH /api/v1/users/{user_id}`"""

    model_config = ConfigDict(extra="forbid")

    first_name: str | None = Field(default=None, min_length=1, max_length=20)
    last_name: str | None = Field(default=None, min_length=1, max_length=20)
    date_of_birth: date | None = None
    sex: SexType | None = None
    height: Decimal | None = Field(default=None, max_digits=5, decimal_places=2, gt=0)
    weight: Decimal | None = Field(default=None, max_digits=5, decimal_places=2, gt=0)
    activity_level: int | None = Field(default=None, ge=1, le=5)
    is_pregnant: bool | None = None
    profile_picture: ProfilePictureType | None = None
    goal_type: str | None = None
    recommendations: list[str] | None = None

    @model_validator(mode="after")
    def validate_pregnancy_requires_female(self):
        """
        For partial updates, only validate when both fields are present in payload.
        Full merged-state validation is handled in endpoint logic.
        """
        if (
            self.is_pregnant is True
            and self.sex is not None
            and self.sex != SexType.female
        ):
            raise ValueError("is_pregnant can only be true when sex is female")
        return self


class UserResponse(BaseModel):
    """Response body for `GET /api/v1/users/` and `GET /api/v1/users/{user_id}`"""

    id: UUID
    first_name: str 
    last_name: str 
    date_of_birth: date 
    sex: SexType 
    height: Decimal 
    weight: Decimal 
    activity_level: int 
    is_pregnant: bool | None = None
    profile_picture: ProfilePictureType | None = None
    goal_type: str | None = None
    recommendations: list[str] | None = None
    created_at: datetime
    updated_at: datetime 


class ListUserResponse(BaseModel):
    """Response from `GET /api/v1/users/`"""

    count: int
    items: list[UserResponse]


class UserCreate(BaseModel):
    """Request body for `POST /api/v1/users/`"""

    model_config = ConfigDict(extra="forbid")

    first_name: str = Field(min_length=1, max_length=20)
    last_name: str = Field(min_length=1, max_length=20)
    date_of_birth: date
    sex: SexType
    height: Decimal = Field(max_digits=5, decimal_places=2, gt=0)
    weight: Decimal = Field(max_digits=5, decimal_places=2, gt=0)
    activity_level: int = Field(ge=1, le=5)
    is_pregnant: bool | None = None
    profile_picture: ProfilePictureType | None = None
    goal_type: str | None = None
    recommendations: list[str] | None = None

    @model_validator(mode="after")
    def validate_pregnancy_requires_female(self):
        """Prevent invalid pregnancy state at request-validation stage."""
        if self.is_pregnant is True and self.sex != SexType.female:
            raise ValueError("is_pregnant can only be true when sex is female")
        return self
