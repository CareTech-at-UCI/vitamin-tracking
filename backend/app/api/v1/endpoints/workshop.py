"""
Workshop endpoints.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_workshop():
    return {"message": "Hello workshop"}