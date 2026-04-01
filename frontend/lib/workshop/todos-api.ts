/**
 * Workshop: all HTTP calls to FastAPI -> Supabase live here
 *
 * `listTodos` is implemented — copy its pattern for the rest. OpenAPI: `{base}/docs`
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

/**
 * `POST /api/v1/todos/` — body `{ "name": string }`, returns one row
 *
 * WORKSHOP: implement (copy `listTodos`, then adjust method/body). Example:
 *
 *   const base = getWorkshopApiBaseUrl();
 *   const res = await fetch(`${base}/api/v1/todos/`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ name }),
 *   });
 *   if (!res.ok) throw new Error(await res.text());
 *   return res.json() as Promise<TodoRow>;
 */
export async function createTodo(_name: string): Promise<TodoRow> {
  throw new Error(
    "Workshop: implement createTodo() in lib/workshop/todos-api.ts (see comment above + listTodos)",
  );
}

/**
 * `PATCH /api/v1/todos/{id}` — body `{ "name": string }`, returns updated row
 *
 *   const base = getWorkshopApiBaseUrl();
 *   const res = await fetch(`${base}/api/v1/todos/${id}`, {
 *     method: "PATCH",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ name }),
 *   });
 *   if (!res.ok) throw new Error(await res.text());
 *   return res.json() as Promise<TodoRow>;
 */
export async function updateTodo(_id: string, _name: string): Promise<TodoRow> {
  throw new Error(
    "Workshop: implement updateTodo() in lib/workshop/todos-api.ts (see comment above + listTodos)",
  );
}

/**
 * `DELETE /api/v1/todos/{id}`
 *
 *   const base = getWorkshopApiBaseUrl();
 *   const res = await fetch(`${base}/api/v1/todos/${id}`, { method: "DELETE" });
 *   if (!res.ok) throw new Error(await res.text());
 */
export async function deleteTodo(_id: string): Promise<void> {
  throw new Error(
    "Workshop: implement deleteTodo() in lib/workshop/todos-api.ts (see comment above + listTodos)",
  );
}
