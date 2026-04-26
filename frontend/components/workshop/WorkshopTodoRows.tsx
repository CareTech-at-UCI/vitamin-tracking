"use client";

import type { TodoRow } from "@/lib/workshop/config";

type WorkshopTodoRowsProps = {
  items: TodoRow[];
  loading: boolean;
  editingId: string | null;
  editingName: string;
  onEditingNameChange: (value: string) => void;
  onStartRename: (todo: TodoRow) => void;
  onCancelRename: () => void;
  onCommitRename: (todo: TodoRow) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
};

export function WorkshopTodoRows({
  items,
  loading,
  editingId,
  editingName,
  onEditingNameChange,
  onStartRename,
  onCancelRename,
  onCommitRename,
  onDelete,
}: WorkshopTodoRowsProps) {
  return (
    <div className="mt-8 border-t border-black/10 pt-6">
      <h3 className="text-sm font-semibold text-black">Rows</h3>
      {loading && items.length === 0 ? (
        <p className="mt-3 text-sm text-black/55">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-3 text-sm text-black/55">
          No rows yet. Add one above or insert rows in Supabase, then refresh.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-black/10 overflow-hidden rounded-xl border border-black/10">
          {items.map((todo) => {
            const isEditing = editingId === todo.id;
            return (
              <li
                key={todo.id}
                className="flex flex-col gap-3 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(event) => onEditingNameChange(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") void onCommitRename(todo);
                        if (event.key === "Escape") onCancelRename();
                      }}
                      className="w-full max-w-md rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-medium text-black focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
                      aria-label="Todo name"
                    />
                  ) : (
                    <p className="truncate text-sm font-medium text-black">{todo.name}</p>
                  )}
                  <p className="mt-0.5 font-mono text-xs text-black/45">{todo.id}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="rounded-lg border border-black/15 bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-black/90"
                        onClick={() => void onCommitRename(todo)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-black/4"
                        onClick={onCancelRename}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-black/4"
                        disabled={editingId != null}
                        onClick={() => onStartRename(todo)}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-red-500/25 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-900 hover:bg-red-500/10"
                        disabled={editingId != null}
                        onClick={() => void onDelete(todo.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
