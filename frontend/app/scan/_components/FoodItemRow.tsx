"use client";

import Image from "next/image";
import { useState } from "react";

export type FoodItem = {
  id: number;
  name: string;
  servings: number;
};

type FoodItemRowProps = {
  item: FoodItem;
  canDelete: boolean;
  onChange: (item: FoodItem) => void;
  onDelete: () => void;
};

export default function FoodItemRow({
  item,
  canDelete,
  onChange,
  onDelete,
}: FoodItemRowProps) {
  const [isEditingName, setIsEditingName] = useState(false);

  function updateName(name: string) {
    onChange({ ...item, name });
  }

  function updateServings(servings: number) {
    onChange({ ...item, servings });
  }

  return (
    <article className="grid gap-3 font-display text-scan-green-dark">
      <div className="relative mx-auto w-full max-w-[644px]">
        <div className="flex min-w-0 items-center justify-center gap-3 px-12">
          {isEditingName ? (
            <input
              type="text"
              value={item.name}
              onChange={(event) => updateName(event.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(event) => {
                if (event.key === "Enter") setIsEditingName(false);
              }}
              className="min-h-11 min-w-0 max-w-[320px] rounded-xl border border-scan-green/30 bg-white px-3 text-center text-3xl font-semibold leading-none text-scan-green-dark outline-none [background-image:none] focus:border-scan-orange focus:ring-2 focus:ring-scan-orange/20"
              autoFocus
            />
          ) : (
            <h3 className="min-w-0 truncate text-center text-3xl font-semibold leading-none md:text-[34px]">
              {item.name}
            </h3>
          )}

          <button
            type="button"
            onClick={() => setIsEditingName(true)}
            aria-label={`Edit ${item.name}`}
            className="flex size-8 shrink-0 items-center justify-center text-neutral-500 transition hover:text-scan-orange"
          >
            <Image
              src="/assets/scan/material-symbols_edit.svg"
              alt=""
              width={32}
              height={32}
              aria-hidden="true"
              className="size-6"
            />
          </button>
        </div>

        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          aria-label={`Delete ${item.name}`}
          className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-scan-orange transition hover:bg-scan-orange/10 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <DeleteIcon className="size-5" />
        </button>
      </div>

      <div className="mx-auto w-full max-w-[644px]">
        <div className="flex min-h-[54px] items-center rounded-[14px] bg-scan-orange py-2 pl-4 pr-3 text-white">
          <span className="min-w-0 flex-1 font-body text-base font-medium">
            {item.servings} {item.servings === 1 ? "serving" : "servings"}
          </span>
          <Image
            src="/assets/scan/food-icon.svg"
            alt=""
            width={48}
            height={48}
            aria-hidden="true"
            className="size-10 shrink-0"
          />
        </div>

        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={item.servings}
          onChange={(event) => updateServings(Number(event.target.value))}
          aria-label={`${item.name} servings`}
          className="scan-serving-range mt-4 w-full"
          style={{
            "--scan-serving-progress": `${item.servings * 10}%`,
          } as React.CSSProperties}
        />

        <div className="mt-2 flex items-center justify-between text-sm font-medium text-scan-green-dark">
          <span>0</span>
          <span>10</span>
        </div>
      </div>
    </article>
  );
}

function DeleteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="m9.4 9.4 5.2 5.2m0-5.2-5.2 5.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}
