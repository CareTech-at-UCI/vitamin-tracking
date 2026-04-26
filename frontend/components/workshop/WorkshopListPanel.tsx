"use client";

import type { FormEvent, ReactNode } from "react";

type WorkshopListPanelProps = {
  loading: boolean;
  itemCount: number;
  actionError: string | null;
  newName: string;
  onNewNameChange: (value: string) => void;
  onCreate: (event: FormEvent) => void | Promise<void>;
  onRefresh: () => void | Promise<void>;
  children: ReactNode;
};

export function WorkshopListPanel({
  loading,
  itemCount,
  actionError,
  newName,
  onNewNameChange,
  onCreate,
  onRefresh,
  children,
}: WorkshopListPanelProps) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-black">List</h2>
          <p className="mt-1 text-sm text-black/60">
            CRUD via <code className="font-mono text-xs">lib/workshop/todos-api.ts</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-black/10 bg-black/3 px-3 py-1 text-xs font-medium text-black/70">
            {loading ? "…" : `${itemCount} item(s)`}
          </span>
          <button
            type="button"
            onClick={() => void onRefresh()}
            className="rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-medium text-black hover:bg-black/4"
          >
            Refresh
          </button>
        </div>
      </div>

      {actionError ? (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="text-sm font-medium text-red-800">Request failed</div>
          <pre className="mt-2 whitespace-pre-wrap text-xs text-red-800/90">{actionError}</pre>
        </div>
      ) : null}

      <form
        onSubmit={(event) => void onCreate(event)}
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm">
          <span className="font-medium text-black">New todo</span>
          <input
            value={newName}
            onChange={(event) => onNewNameChange(event.target.value)}
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

      {children}
    </div>
  );
}
