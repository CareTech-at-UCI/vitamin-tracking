/**
 * Workshop: base URL + shared types. HTTP examples live in `lib/workshop/todos-api.ts`
 * (`listTodos` is implemented; other methods are stubs)
 */

const DEFAULT_BASE = "http://127.0.0.1:8000";

export function getWorkshopApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  return base ?? DEFAULT_BASE;
}

/** Row shape from `public.todos` (and API JSON bodies) */
export type TodoRow = {
  id: string;
  name: string;
};

/** Response from `GET /api/v1/todos/` */
export type ListTodosResponse = {
  count: number;
  items: TodoRow[];
};
