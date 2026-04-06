"""
Todo endpoints (workshop)

`GET /` is implemented - use it as the reference for Supabase + FastAPI
Implement `create_todo`, `update_todo`, and `delete_todo` for a full-stack exercise

If you only run the frontend track, uncomment the bodies below (or replace `501` stubs
with the examples in each function’s docstring)
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from supabase import Client

from app.api.deps.supabase import get_supabase_admin

router = APIRouter()


class TodoCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=500)


class TodoUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=500)


@router.get("/")
async def get_todos(
    limit: int = Query(default=20, ge=1, le=100),
    supabase: Client = Depends(get_supabase_admin),
):
    """
    List rows from `public.todos` - reference implementation for the workshop
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


@router.post("/")
async def create_todo(
    body: TodoCreate, # The parsed request (dictionary)
    supabase: Client = Depends(get_supabase_admin),
):
    """
    WORKSHOP: insert one row, return the new row as JSON

    Hint (Supabase Python client):

        response = (
            supabase.table("todos")
            .???({"name": ???})     # Update the ??? with the correct information! Hint: You have to use the 'body' argument for one of them.
            .execute()
        )
        rows = response.data or []
        if not rows:
            raise HTTPException(status_code=500, detail="Insert returned no row")
        return rows[0]

    On failure, map exceptions to HTTP 500 with a useful `detail` string.
    """
    try:
        response = (
            supabase.table("todos")
            .insert({"name": body.name})
            .execute()
        )
        rows = response.data or []
        if not rows:
            raise HTTPException(status_code=500, detail="Insert returned no row")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc
    
    return rows[0]


@router.patch("/{todo_id}")
async def update_todo(
    todo_id: UUID,
    body: TodoUpdate, # The parsed request (dictionary)
    supabase: Client = Depends(get_supabase_admin),
):
    """
    WORKSHOP: update `name` for one row; return the updated row.

    Hint:

        if body.name is None:
            raise HTTPException(status_code=400, detail="Provide at least one field to update")
        response = (
            supabase.table("todos")
            .???({"name": ???})   # Update the ??? with the correct command! Hint: The second ??? is the same as the one used in POST.
            .eq("id", str(todo_id))
            .execute()
        )
        rows = response.data or []
        if not rows:
            raise HTTPException(status_code=404, detail="Todo not found")
        return rows[0]
    """
    try:
        if body.name is None:
            raise HTTPException(status_code=400, detail="Provide at least one field to update")
        response = (
            supabase.table("todos")
            .update({"name": body.name})
            .eq("id", str(todo_id))
            .execute()
        )
        rows = response.data or []
        if not rows:
            raise HTTPException(status_code=404, detail="Todo not found")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc
    
    return rows[0]


@router.delete("/{todo_id}")
async def delete_todo(
    todo_id: UUID,
    supabase: Client = Depends(get_supabase_admin),
):
    """
    WORKSHOP: delete one row by id.

    Hint — return 404 if nothing was deleted (use `.select("id")` so `response.data` tells you):

        response = (
            supabase.table("todos")
            .???()                      # Update the ??? with the correct command!
            .eq("id", str(todo_id))
            .execute()
        )
        rows = response.data or []
        if not rows:
            raise HTTPException(status_code=404, detail="Todo not found")
        return {"deleted": True, "id": str(todo_id)}
    """
    try: 
        response = (
            supabase.table("todos")
            .delete()
            .eq("id", str(todo_id))
            .execute()
        )
        rows = response.data or []
        if not rows:
            raise HTTPException(status_code=404, detail="Todo not found")
    except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc
    
    return rows[0]
