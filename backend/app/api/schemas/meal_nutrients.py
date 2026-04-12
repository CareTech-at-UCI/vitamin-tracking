"""
Meal nutrient schemas

Pydantic models for meal-to-nutrient link table requests and responses.
"""

from pydantic import BaseModel, ConfigDict, Field


class MealNutrientCreate(BaseModel):
    """Request body for `POST /api/v1/meal-nutrients/`"""

    item_id: int = Field(..., gt=0)
    nutrient_id: int = Field(..., gt=0)
    quantity: float = Field(..., ge=0)


class MealNutrientInput(BaseModel):
    """One nutrient entry in a batch create request."""

    nutrient_id: int = Field(..., gt=0)
    quantity: float = Field(..., ge=0)


class MealNutrientBatchCreate(BaseModel):
    """Request body for `POST /api/v1/meal-nutrients/batch`"""

    item_id: int = Field(..., gt=0)
    nutrients: list[MealNutrientInput] = Field(..., min_length=1)


class MealNutrientRow(BaseModel):
    """One row from `public.meal_nutrients`"""

    model_config = ConfigDict(extra="ignore")

    item_id: int
    nutrient_id: int
    quantity: float | None = None


class MealNutrientBatchResponse(BaseModel):
    """Response for batch insert route."""

    count: int
    items: list[MealNutrientRow]
