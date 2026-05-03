"""
Meal nutrient schemas

Pydantic models for meal-to-nutrient link table requests and responses.
"""

from pydantic import BaseModel, ConfigDict, Field


class MealNutrientCreate(BaseModel):
    """Request body for `POST /api/v1/meal-nutrients/`"""
    model_config = ConfigDict(extra="forbid")

    item_id: int = Field(..., gt=0)
    nutrient_id: int = Field(..., gt=0)
    quantity: float = Field(..., ge=0)


class MealNutrientInput(BaseModel):
    """One nutrient entry in a batch create request."""
    model_config = ConfigDict(extra="forbid")

    nutrient_id: int = Field(..., gt=0)
    quantity: float = Field(..., ge=0)


class MealNutrientBatchCreate(BaseModel):
    """Request body for `POST /api/v1/meal-nutrients/batch`"""
    model_config = ConfigDict(extra="forbid")

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


class ListMealNutrientsResponse(BaseModel):
    """Response for getting all nutrient rows linked to meal"""

    count: int
    items: list[MealNutrientRow]


class MealNutrientUpdate(BaseModel):
    """Request body for `PATCH /api/v1/meal-nutrients/item/{item_id}/nutrient/{nutrient_id}`"""

    quantity: float = Field(..., ge=0)


class MealNutrientSyncCreate(BaseModel):
    """Request body for `PUT /api/v1/meal-nutrients/meal/{item_id}/sync`"""

    nutrients: list[MealNutrientInput] = Field(..., min_length=1)


class MealNutrientSyncResponse(BaseModel):
    """Response for sync route."""

    count: int
    items: list[MealNutrientRow]


class MealNutrientDeleteResponse(BaseModel):
    """Response for `DELETE /api/v1/meal-nutrients/item/{item_id}/nutrient/{nutrient_id}`"""

    deleted: bool
    item_id: int
    nutrient_id: int