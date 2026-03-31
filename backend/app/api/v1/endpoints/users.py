"""
User endpoints
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/users")
async def get_users():
    return {"message": "Hello World"}