"""
Todo endpoints

(FOR WORKSHOP / LEARNING PURPOSES)
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin

router = APIRouter()


@router.get("/")
async def get_todos(
    limit: int = Query(default=20, ge=1, le=100),
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Sample endpoint that selects all rows from the `todos` table in Supabase
    """
    try:
        response = (
            supabase.table("todos")
            .select("*")
            .limit(limit)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    return {"count": len(response.data or []), "items": response.data or []}
