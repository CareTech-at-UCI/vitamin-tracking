"""
User schemas

Pydantic models and types for API Request and Response validation.
"""

from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


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
    recomendations: list[str] | None = None


class UserResponse(BaseModel):
    """Response body for `GET /api/v1/users/` and `GET /api/v1/users/{user_id}`"""

    model_config = ConfigDict(extra="ignore")

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
    recomendations: list[str] | None = None
    created_at: datetime
    updated_at: datetime 


class ListUserResponse(BaseModel):
    """Response from `GET /api/v1/users/`"""

    count: int
    items: list[UserResponse]
