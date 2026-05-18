"""
Authentication dependencies for the API

includes dependencies for authentication in the API that FastAPI uses via Depends().
"""

from fastapi import Depends, Header, HTTPException
from supabase import Client

from app.api.deps.supabase import get_supabase_admin


async def get_current_user_id(
    authorization: str = Header(..., alias="Authorization"),
    supabase: Client = Depends(get_supabase_admin),
) -> str:
    """
    Validates the Bearer token from the Authorization header via Supabase and
    returns the authenticated user's ID. Raises 401 if missing or invalid.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid Authorization header",
        )
    token = authorization.removeprefix("Bearer ")
    try:
        result = supabase.auth.get_user(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from e
    if not result.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return str(result.user.id)
