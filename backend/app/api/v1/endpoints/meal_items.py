"""
Meal items endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.meal_items import (
    ListMealItemsResponse,
    MealItemCreate,
    MealItemDeleteResponse,
    MealItemRow,
    MealItemUpdate,
)

router = APIRouter()