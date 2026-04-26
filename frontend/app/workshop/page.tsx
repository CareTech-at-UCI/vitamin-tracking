"use client";

import {
  WorkshopListPanel,
  WorkshopPageHeader,
  WorkshopTodoRows,
} from "@/components/workshop";
import type { TodoRow } from "@/lib/workshop/config";
import {
  createTodo,
  deleteTodo,
  listTodos,
  updateTodo,
} from "@/lib/workshop/todos-api";
import { useCallback, useEffect, useState } from "react";

/**
 * Workshop: UI only - implement requests in `lib/workshop/todos-api.ts`
 * The error panel shows thrown messages from failed requests.
 */

export default function WorkshopPage() {
  const [items, setItems] = useState<TodoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  /** Inline rename: which todo id is being edited, and the draft title */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const reload = useCallback(async () => {
    setActionError(null);
    setEditingId(null);
    setEditingName("");
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

  function startRename(todo: TodoRow) {
    setActionError(null);
    setEditingId(todo.id);
    setEditingName(todo.name);
  }

  function cancelRename() {
    setEditingId(null);
    setEditingName("");
  }

  async function commitRename(original: TodoRow) {
    if (editingId !== original.id) return;
    const trimmed = editingName.trim();
    if (trimmed === "") {
      setActionError("Name cannot be empty.");
      return;
    }
    if (trimmed === original.name) {
      cancelRename();
      return;
    }

    setActionError(null);
    try {
      await updateTodo(original.id, trimmed);
      cancelRename();
      await reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Rename failed");
    }
  }

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <WorkshopPageHeader />
        <WorkshopListPanel
          loading={loading}
          itemCount={items.length}
          actionError={actionError}
          newName={newName}
          onNewNameChange={setNewName}
          onCreate={handleCreate}
          onRefresh={reload}
        >
          <WorkshopTodoRows
            items={items}
            loading={loading}
            editingId={editingId}
            editingName={editingName}
            onEditingNameChange={setEditingName}
            onStartRename={startRename}
            onCancelRename={cancelRename}
            onCommitRename={commitRename}
            onDelete={handleDelete}
          />
        </WorkshopListPanel>
      </div>
    </main>
  );
}
