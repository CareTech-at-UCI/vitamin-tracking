"""
Meal Items schemas

Pydantic models and types for API Request and Response validation.
"""

from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class MealItemCreate(BaseModel):
    """Request body for POST /api/v1/meal_items/"""
    meal_id: int = Field(..., gt=0)
    weight: int = Field(..., gt=0)


class MealItemUpdate(BaseModel):
    """Request body for PUT /api/v1/meal_items/{item_id}"""
    meal_id: int | None = Field(default=None, gt=0)
    weight: int | None = Field(default=None, gt=0)


class MealItemRow(BaseModel):
    """One row from meal_items"""

    model_config = ConfigDict(extra="ignore")

    item_id: int
    meal_id: int
    weight: int
    created_at: datetime
    updated_at: datetime


class ListMealItemsResponse(BaseModel):
    """Response from GET /api/v1/meal_items/"""

    count: int
    items: list[MealItemRow]


class MealItemDeleteResponse(BaseModel):
    """Response from DELETE /api/v1/meal_items/{item_id}"""

    deleted: bool
    id: int