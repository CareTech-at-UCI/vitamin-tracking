"""
Meal endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.meals import (
    ListMealsResponse,
    MealCreate,
    MealDeleteResponse,
    MealRow,
    MealUpdate,
)

router = APIRouter()
