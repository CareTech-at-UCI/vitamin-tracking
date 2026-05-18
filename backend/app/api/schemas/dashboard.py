"""
Dashboard schemas

Pydantic models for weekly dashboard responses.
"""

from datetime import date
from pydantic import BaseModel, ConfigDict


class DashboardVitamin(BaseModel):
    """Vitamin intake for one day"""

    model_config = ConfigDict(extra="ignore")

    nutrient_id: int
    nutrient_name: str
    symbol: str | None = None
    unit: str | None = None

    total_quantity: float
    goal_quantity: float
    percentage: float


class DashboardDay(BaseModel):
    """One dashboard day"""

    date: date
    vitamins: list[DashboardVitamin]


class DashboardWeekResponse(BaseModel):
    """Response from GET /api/v1/dashboard/week"""

    dates: list[date]
    days: list[DashboardDay]