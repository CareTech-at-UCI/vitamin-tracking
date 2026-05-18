"""
API Router for the application.

Includes all endpoint routers in one place.
"""

# NOTE: be sure to add all new endpoint routers here so that they are included in the API and accessible via the API routes

from fastapi import APIRouter

from .endpoints import (
    meals,
    meal_items,
    users,
    todos,
    diet_restrictions,
    user_diet_restrictions,
    nutrients,
    nutrient_goals,
    meal_nutrients,
    onboarding,
)

router = APIRouter()

router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(meals.router, prefix="/meals", tags=["meals"])
router.include_router(meal_items.router, prefix="/meal_items", tags=["meal_items"])
router.include_router(todos.router, prefix="/todos", tags=["todos"])
router.include_router(diet_restrictions.router, prefix="/diet_restrictions", tags=["diet_restrictions"])
router.include_router(
    user_diet_restrictions.router,
    prefix="/user-diet-restrictions",
    tags=["user-diet-restrictions"],
)
router.include_router(nutrients.router, prefix="/nutrients", tags=["nutrients"])
router.include_router(meal_nutrients.router, prefix="/meal-nutrients", tags=["meal-nutrients"])
router.include_router(nutrient_goals.router, prefix="/nutrient-goals", tags=["nutrient-goals"])
router.include_router(onboarding.router, prefix="/onboarding", tags=["onboarding"])