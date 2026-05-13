"""
Vitamin breakdown schemas

Pydantic models for the vitamin breakdown aggregate endpoints.
"""

from pydantic import BaseModel


class VitaminDetail(BaseModel):
    """One nutrient's intake for a single day."""

    nutrient_id: int | None = None
    nutrient_name: str
    symbol: str | None = None
    unit: str | None = None
    total_quantity: float
    goal_quantity: float
    ratio: float | None = None


class VitaminDay(BaseModel):
    """All vitamin intake data for a single date."""

    date: str
    vitamins: list[VitaminDetail]


class VitaminBreakdownResponse(BaseModel):
    """Top-level response for both daily and weekly vitamin breakdown."""

    dates: list[str]
    days: list[VitaminDay]
