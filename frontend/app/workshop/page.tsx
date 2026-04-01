"use client";

import { getWorkshopApiBaseUrl, type TodoRow } from "@/lib/workshop/config";
import {
  createTodo,
  deleteTodo,
  listTodos,
  updateTodo,
} from "@/lib/workshop/todos-api";
import { useCallback, useEffect, useState } from "react";

/**
 * Workshop: UI only - implement requests in `lib/workshop/todos-api.ts`
 * The error panel shows thrown messages (including "Workshop: implement …" until done)
 */

export default function WorkshopPage() {
  const [items, setItems] = useState<TodoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const reload = useCallback(async () => {
    setActionError(null);
    setLoading(true);
    try {
      const data = await listTodos();
      setItems(data.items);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setActionError(null);
    const name = newName.trim();
    if (!name) return;

    try {
      await createTodo(name);
      setNewName("");
      await reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Create failed");
    }
  }

  async function handleDelete(id: string) {
    setActionError(null);
    try {
      await deleteTodo(id);
      await reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function handleRename(todo: TodoRow) {
    setActionError(null);
    const next = window.prompt("New name", todo.name);
    if (next == null) return;
    const trimmed = next.trim();
    if (trimmed === "" || trimmed === todo.name) return;

    try {
      await updateTodo(todo.id, trimmed);
      await reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Rename failed");
    }
  }

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/45">
            Workshop
          </p>
          <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight text-white">
            Todos via API
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Set{" "}
            <code className="rounded bg-white/6 px-1.5 py-0.5 font-mono text-xs">
              NEXT_PUBLIC_API_URL
            </code>{" "}
            if needed (defaults to{" "}
            <code className="font-mono text-xs">http://127.0.0.1:8000</code>). API
            explorer:{" "}
            <code className="rounded bg-white/6 px-1.5 py-0.5 font-mono text-xs">
              {getWorkshopApiBaseUrl()}/docs
            </code>
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-black">List</h2>
              <p className="mt-1 text-sm text-black/60">
                <code className="font-mono text-xs">GET</code> implemented in{" "}
                <code className="font-mono text-xs">lib/workshop/todos-api.ts</code> (
                <code className="font-mono text-xs">listTodos</code>)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-black/10 bg-black/3 px-3 py-1 text-xs font-medium text-black/70">
                {loading ? "…" : `${items.length} item(s)`}
              </span>
              <button
                type="button"
                onClick={() => void reload()}
                className="rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-medium text-black hover:bg-black/4"
              >
                Refresh
              </button>
            </div>
          </div>

          {actionError ? (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="text-sm font-medium text-red-800">Request failed</div>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-red-800/90">
                {actionError}
              </pre>
            </div>
          ) : null}

          <form
            onSubmit={(e) => void handleCreate(e)}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm">
              <span className="font-medium text-black">New todo</span>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Buy oat milk"
                className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm text-black placeholder:text-black/35 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </label>
            <button
              type="submit"
              className="h-10 shrink-0 rounded-xl bg-black px-4 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-40"
              disabled={loading || !newName.trim()}
            >
              Add
            </button>
          </form>
          <p className="mt-2 text-xs text-black/45">
            Implement <code className="font-mono">createTodo</code> in{" "}
            <code className="font-mono">todos-api.ts</code>
          </p>

          <div className="mt-8 border-t border-black/10 pt-6">
            <h3 className="text-sm font-semibold text-black">Rows</h3>
            {loading && items.length === 0 ? (
              <p className="mt-3 text-sm text-black/55">Loading…</p>
            ) : items.length === 0 ? (
              <p className="mt-3 text-sm text-black/55">
                No rows yet. Insert in Supabase or implement Add above, then refresh.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-black/10 overflow-hidden rounded-xl border border-black/10">
                {items.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex flex-col gap-3 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-black">{todo.name}</p>
                      <p className="mt-0.5 font-mono text-xs text-black/45">{todo.id}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-black/4"
                        onClick={() => void handleRename(todo)}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-red-500/25 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-900 hover:bg-red-500/10"
                        onClick={() => void handleDelete(todo.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
