/**
 * Workshop: all HTTP calls to FastAPI -> Supabase live here
 *
 * OpenAPI: `{base}/docs`
 */

import {
  getWorkshopApiBaseUrl,
  type ListTodosResponse,
  type TodoRow,
} from "./config";

export type { TodoRow, ListTodosResponse } from "./config";

/** `GET /api/v1/todos/` — reference implementation */
export async function listTodos(limit = 20): Promise<ListTodosResponse> {
  const base = getWorkshopApiBaseUrl();
  const url = new URL(`${base}/api/v1/todos/`);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET /api/v1/todos/ failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<ListTodosResponse>;
}

/** `POST /api/v1/todos/` — body `{ "name": string }`, returns one row */
export async function createTodo(name: string): Promise<TodoRow> {
  const base = getWorkshopApiBaseUrl();
  const res = await fetch(`${base}/api/v1/todos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /api/v1/todos/ failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<TodoRow>;
}

/** `PATCH /api/v1/todos/{id}` — body `{ "name": string }`, returns updated row */
export async function updateTodo(id: string, name: string): Promise<TodoRow> {
  const base = getWorkshopApiBaseUrl();
  const res = await fetch(`${base}/api/v1/todos/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PATCH /api/v1/todos/${id} failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<TodoRow>;
}

/** `DELETE /api/v1/todos/{id}` */
export async function deleteTodo(id: string): Promise<void> {
  const base = getWorkshopApiBaseUrl();
  const res = await fetch(`${base}/api/v1/todos/${encodeURIComponent(id)}`, {
    method: "DELETE",
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DELETE /api/v1/todos/${id} failed (${res.status}): ${text}`);
  }
}
