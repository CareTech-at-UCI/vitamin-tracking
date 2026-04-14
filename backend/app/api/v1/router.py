"""
API Router for the application.

Includes all endpoint routers in one place.
"""

# NOTE: be sure to add all new endpoint routers here so that they are included in the API and accessible via the API routes

from fastapi import APIRouter

from .endpoints import meals, users, todos, diet_restrictions, user_diet_restrictions

router = APIRouter()

router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(meals.router, prefix="/meals", tags=["meals"])
router.include_router(todos.router, prefix="/todos", tags=["todos"])
router.include_router(diet_restrictions.router, prefix="/diet_restrictions", tags=["diet_restrictions"])
router.include_router(user_diet_restrictions.router, prefix="/user_diet_restrictions", tags=["user_diet_restrictions"])