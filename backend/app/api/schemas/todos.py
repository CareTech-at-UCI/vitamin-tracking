"""
Todo schemas

Pydantic models for workshop todo requests and responses (reference for other resources).
"""

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TodoCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=500)


class TodoUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=500)


class TodoRow(BaseModel):
    """One row from `public.todos` (matches frontend `TodoRow`)."""

    model_config = ConfigDict(extra="ignore")

    id: UUID
    name: str


class ListTodosResponse(BaseModel):
    """Response from `GET /api/v1/todos/`."""

    count: int
    items: list[TodoRow]


class TodoDeleteResponse(BaseModel):
    """Response from `DELETE /api/v1/todos/{todo_id}` when implemented."""

    deleted: bool
    id: str
