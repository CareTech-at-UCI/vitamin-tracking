"""
API Router for the application.

Includes all endpoint routers in one place.
"""

# NOTE: be sure to add all new endpoint routers here so that they are included in the API and accessible via the API routes

from fastapi import APIRouter

from .endpoints import meal_nutrients, meals, nutrients, users, todos

router = APIRouter()

router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(meals.router, prefix="/meals", tags=["meals"])
router.include_router(todos.router, prefix="/todos", tags=["todos"])
router.include_router(nutrients.router, prefix="/nutrients", tags=["nutrients"])
router.include_router(meal_nutrients.router, prefix="/meal-nutrients", tags=["meal-nutrients"])