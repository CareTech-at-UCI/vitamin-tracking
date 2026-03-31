"""
Meal endpoints
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/meals")
async def get_meals():
    return {"message": "Hello World"}