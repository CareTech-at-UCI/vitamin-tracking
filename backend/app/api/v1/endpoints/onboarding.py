from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

@router.get("/")
async def get_onboarding():
    pass

@router.patch("/step/{step_key}")
async def patch_onboarding():
    pass

@router.post("/complete")
async def post_onbarding():
    pass