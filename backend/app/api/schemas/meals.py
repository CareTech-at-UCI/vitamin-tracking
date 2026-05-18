"""
Meal schemas

Pydantic models and types for API Request and Response validation.
"""


from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime
from enum import Enum


class MealType(str, Enum):
    """meal_type enum values"""
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack" 
    # what if the user uses supper instead of dinner or brunch or linner lawl


class MealCreate(BaseModel):
    """Request body for POST /api/v1/meals/"""
    model_config = ConfigDict(extra="forbid")
    user_id: UUID
    consumed_at: datetime
    type: MealType
    notes: str | None = Field(default=None)


class MealUpdate(BaseModel):
    """Request body for PUT /api/v1/meals/{meal_id}"""
    model_config = ConfigDict(extra="forbid")
    consumed_at: datetime | None = Field(default=None)
    type: MealType | None = Field(default=None)
    notes: str | None = Field(default=None)


class MealRow(BaseModel):
    """One row from meals"""

    id: int
    user_id: UUID | None
    consumed_at: datetime
    type: MealType
    notes: str | None
    created_at: datetime
    updated_at: datetime


class ListMealsResponse(BaseModel):
    """Response from GET /api/v1/meals/"""

    count: int
    items: list[MealRow]


class MealDeleteResponse(BaseModel):
    """Response from DELETE /api/v1/meals/{meal_id}"""

    deleted: bool
    id: int


class RecentFoodItem(BaseModel):
    """Meal item formatted for the Recent Foods page."""

    id: int
    meal_id: int
    name: str


class RecentFoodsMeals(BaseModel):
    """Recent food items grouped by meal type for one local day."""

    breakfast: list[RecentFoodItem] = Field(default_factory=list)
    lunch: list[RecentFoodItem] = Field(default_factory=list)
    dinner: list[RecentFoodItem] = Field(default_factory=list)
    snacks: list[RecentFoodItem] = Field(default_factory=list)


class RecentFoodsDayResponse(BaseModel):
    """Response from GET /api/v1/meals/recent-foods."""

    date: date
    meals: RecentFoodsMeals
