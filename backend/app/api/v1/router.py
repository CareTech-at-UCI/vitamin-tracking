"""
API Router for the application.

Includes all endpoint routers in one place.
"""

from fastapi import APIRouter

from .endpoints import meals, users, workshop

router = APIRouter()

router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(meals.router, prefix="/meals", tags=["meals"])
router.include_router(workshop.router, prefix="/workshop", tags=["workshop"])