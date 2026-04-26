"""Todo endpoints: list, create, update, delete via Supabase."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.todos import (
    ListTodosResponse,
    TodoCreate,
    TodoDeleteResponse,
    TodoRow,
    TodoUpdate,
)

router = APIRouter()


@router.get("/", response_model=ListTodosResponse)
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


@router.post("/", response_model=TodoRow)
async def create_todo(
    body: TodoCreate,  # The parsed request (dictionary)
    supabase: Client = Depends(get_supabase_admin),
):
    """Insert one row, return the new row as JSON."""
    try:
        response = (
            supabase.table("todos")
            .insert({"name": body.name})
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase insert failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=500, detail="Insert returned no row")
    return rows[0]


@router.patch("/{todo_id}", response_model=TodoRow)
async def update_todo(
    todo_id: UUID,
    body: TodoUpdate,  # The parsed request (dictionary)
    supabase: Client = Depends(get_supabase_admin),
):
    """Update `name` for one row; return the updated row."""
    if body.name is None:
        raise HTTPException(status_code=400, detail="Provide at least one field to update")
    try:
        response = (
            supabase.table("todos")
            .update({"name": body.name})
            .eq("id", str(todo_id))
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase update failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Todo not found")
    return rows[0]


@router.delete("/{todo_id}", response_model=TodoDeleteResponse)
async def delete_todo(
    todo_id: UUID,
    supabase: Client = Depends(get_supabase_admin),
):
    """Delete one row by id."""
    try:
        response = (
            supabase.table("todos")
            .delete()
            .eq("id", str(todo_id))
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase delete failed: {exc}") from exc

    rows = response.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"deleted": True, "id": str(todo_id)}
