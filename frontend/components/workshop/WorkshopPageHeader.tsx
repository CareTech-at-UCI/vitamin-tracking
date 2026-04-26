"use client";

import { getWorkshopApiBaseUrl } from "@/lib/workshop/config";

export function WorkshopPageHeader() {
  return (
    <div className="mb-8">
      <p className="text-xs font-medium uppercase tracking-wide text-white/45">Workshop</p>
      <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight text-white">
        Todos via API
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        Set{" "}
        <code className="rounded bg-white/6 px-1.5 py-0.5 font-mono text-xs">
          NEXT_PUBLIC_API_URL
        </code>{" "}
        if needed (defaults to{" "}
        <code className="font-mono text-xs">http://127.0.0.1:8000</code>). API explorer:{" "}
        <code className="rounded bg-white/6 px-1.5 py-0.5 font-mono text-xs">
          {getWorkshopApiBaseUrl()}/docs
        </code>
      </p>
    </div>
  );
}
