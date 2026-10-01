"""
Scan schemas

Pydantic models for logging scanned meals.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.api.schemas.meals import MealType


class ScanLogItem(BaseModel):
    """One confirmed food; `food_item_id` comes from inference, `name` is the fallback for manual edits."""
    model_config = ConfigDict(extra="forbid")

    food_item_id: int | None = Field(default=None, gt=0)
    name: str | None = Field(default=None, min_length=1, max_length=200)
    servings: int = Field(..., ge=1, le=10)

    @model_validator(mode="after")
    def require_food_reference(self) -> "ScanLogItem":
        if self.food_item_id is None and self.name is None:
            raise ValueError("Provide food_item_id or name")
        return self


class ScanLogCreate(BaseModel):
    """Request body for `POST /api/v1/scan/log`"""
    model_config = ConfigDict(extra="forbid")

    type: MealType
    consumed_at: datetime
    notes: str | None = Field(default=None, max_length=1000)
    items: list[ScanLogItem] = Field(..., min_length=1, max_length=20)


class LoggedFoodItem(BaseModel):
    food_item_id: int
    name: str
    servings: int


class LoggedNutrient(BaseModel):
    nutrient_id: int
    name: str
    symbol: str | None = None
    unit: str | None = None
    quantity: float


class ScanLogResponse(BaseModel):
    """Response from `POST /api/v1/scan/log`"""

    meal_id: int
    items: list[LoggedFoodItem]
    nutrients: list[LoggedNutrient]
