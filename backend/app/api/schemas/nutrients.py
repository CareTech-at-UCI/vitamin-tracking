"""
Nutrient schemas

Pydantic models for nutrient lookup table requests and responses.
"""

from pydantic import BaseModel, ConfigDict, Field


class NutrientCreate(BaseModel):
    """Request body for `POST /api/v1/nutrients/`"""

    name: str = Field(..., min_length=1, max_length=200)
    symbol: str | None = Field(default=None, max_length=50)
    unit: str | None = Field(default=None, max_length=50)


class NutrientUpdate(BaseModel):
    """Request body for `PATCH /api/v1/nutrients/{nutrient_id}`"""

    name: str | None = Field(default=None, min_length=1, max_length=200)
    symbol: str | None = Field(default=None, max_length=50)
    unit: str | None = Field(default=None, max_length=50)


class NutrientRow(BaseModel):
    """One row from `public.nutrients`"""

    model_config = ConfigDict(extra="ignore")

    nutrient_id: int
    name: str
    symbol: str | None = None
    unit: str | None = None


class ListNutrientsResponse(BaseModel):
    """Response from `GET /api/v1/nutrients/`"""

    count: int
    items: list[NutrientRow]


class NutrientDeleteResponse(BaseModel):
    """Response from `DELETE /api/v1/nutrients/{nutrient_id}`"""

    deleted: bool
    id: int
