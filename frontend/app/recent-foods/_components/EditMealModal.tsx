"use client";

import { useEffect, useMemo, useState } from "react";
import { HiMagnifyingGlass, HiPencil, HiTrash, HiXMark } from "react-icons/hi2";
import ModalShell from "@/components/ModalShell";
import {
  getMealEditorDetails,
  deleteMeal,
  saveMealEditorDetails,
  type MealEditorDetails,
  type MealEditorItem,
} from "@/lib/recent-foods/recent-foods-api";
import { createClient } from "@/utils/supabase/client";

type Props = {
  mealId: number;
  image: string;
  onClose: () => void;
  onSaved: () => void;
};

function toLocalDateTime(value: string) {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromLocalDateTime(date: string, time: string) {
  return new Date(`${date}T${time}`).toISOString();
}

function formatQuantity(quantity: number) {
  return Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1);
}

export default function EditMealModal({ mealId, image, onClose, onSaved }: Props) {
  const [meal, setMeal] = useState<MealEditorDetails | null>(null);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [foodSearch, setFoodSearch] = useState("");
  const [nutrientSearch, setNutrientSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleEditing, setTitleEditing] = useState(false);

  useEffect(() => {
    let current = true;
    async function load() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (!data.user) throw new Error("Sign in to edit meals.");
        const details = await getMealEditorDetails(mealId, data.user.id);
        if (!current) return;
        setMeal(details);
        setActiveItemId(details.items[0]?.id ?? null);
      } catch (loadError) {
        if (current) {
          setError(loadError instanceof Error ? loadError.message : "Could not load this meal.");
        }
      } finally {
        if (current) setLoading(false);
      }
    }
    void load();
    return () => {
      current = false;
    };
  }, [mealId]);

  const activeItem = meal?.items.find((item) => item.id === activeItemId) ?? meal?.items[0];
  const visibleNutrients = useMemo(() => {
    const query = nutrientSearch.trim().toLowerCase();
    return (meal?.nutrients ?? []).filter((nutrient) =>
      nutrient.name.toLowerCase().includes(query),
    );
  }, [meal?.nutrients, nutrientSearch]);

  function updateMeal(patch: Partial<MealEditorDetails>) {
    setMeal((current) => current ? { ...current, ...patch } : current);
  }

  function updateItem(itemId: number | undefined, patch: Partial<MealEditorItem>) {
    setMeal((current) => current ? {
      ...current,
      items: current.items.map((item) => item.id === itemId ? { ...item, ...patch } : item),
    } : current);
  }

  function addFood() {
    const name = foodSearch.trim();
    if (!name) return;
    const id = Date.now();
    const newItem: MealEditorItem = {
      id: -id,
      meal_id: mealId,
      item_name: name,
      serving_size: 1,
    };
    setMeal((current) => current ? { ...current, items: [...current.items, newItem] } : current);
    setActiveItemId(id);
    setFoodSearch("");
  }

  function removeFood(item: MealEditorItem) {
    setMeal((current) => current ? {
      ...current,
      items: current.items.filter((candidate) => candidate !== item),
    } : current);
    if (item.id === activeItemId) setActiveItemId(null);
  }

  async function handleSave() {
    if (!meal) return;
    if (meal.items.some((item) => !item.item_name.trim() || item.serving_size < 1)) {
      setError("Each food needs a name and at least one serving.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveMealEditorDetails({
        ...meal,
        items: meal.items.map((item) => ({
          ...item,
          item_name: item.item_name.trim(),
        })),
      });
      onSaved();
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save this meal.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMeal() {
    setDeleting(true);
    setError(null);
    try {
      await deleteMeal(mealId);
      onSaved();
      onClose();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete this meal.");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const displayTitle = meal?.notes?.trim() ||
    `${meal?.type?.charAt(0).toUpperCase()}${meal?.type?.slice(1) ?? "Meal"}`;
  const summaryNutrients = [
    { label: "Calories", match: /calor|energy/i },
    { label: "Carbs", match: /carbohydrate|carb/i },
    { label: "Fat", match: /fat/i },
    { label: "Protein", match: /protein/i },
  ].map(({ label, match }) => ({
    label,
    nutrient: meal?.nutrients.find((nutrient) => match.test(nutrient.name)),
  }));

  return (
    <ModalShell
      ariaLabel="Edit meal"
      onClose={onClose}
      className="z-70 items-start! overflow-y-auto py-4 sm:items-center! sm:py-8"
      panelClassName="max-w-[810px] overflow-hidden rounded-[14px] bg-background text-secondary"
      closeButtonClassName="right-5 top-5 text-secondary"
    >
      <div className="flex max-h-[min(760px,calc(100svh-2rem))] min-h-0 flex-col px-6 pb-6 pt-8 sm:min-h-155 sm:px-9 sm:pb-7 sm:pt-8">
        <div className="min-w-0 pr-12">
          <div className="flex items-center gap-2">
            {titleEditing ? (
              <input
                autoFocus
                value={meal?.notes ?? ""}
                onChange={(event) => updateMeal({ notes: event.target.value })}
                onBlur={() => setTitleEditing(false)}
                onKeyDown={(event) => event.key === "Enter" && setTitleEditing(false)}
                aria-label="Meal name"
                className="min-w-0 max-w-full border-b border-primary bg-transparent font-primary text-3xl font-semibold leading-tight text-secondary outline-none sm:text-4xl"
              />
            ) : (
              <h2 className="truncate font-primary text-3xl font-semibold leading-tight text-secondary sm:text-4xl">
                {loading ? "Loading meal" : displayTitle}
              </h2>
            )}
            <button
              type="button"
              onClick={() => setTitleEditing(true)}
              className="flex size-8 shrink-0 items-center justify-center text-neutral-500 hover:text-primary"
              aria-label="Edit meal name"
            >
              <HiPencil className="size-5" />
            </button>
          </div>
          <h3 className="mt-5 font-secondary text-sm font-semibold">Food items</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {meal?.items.map((item) => (
              <div
                key={item.id ?? `new-${item.item_name}`}
                className={`inline-flex min-h-9 items-center gap-2 rounded-full pl-4 pr-2 font-secondary text-sm text-white transition ${item.id === activeItem?.id ? "bg-primary" : "bg-primary/85 hover:bg-primary"}`}
              >
                <button
                  type="button"
                  onClick={() => setActiveItemId(item.id ?? null)}
                  className="py-2 text-left"
                >
                  {item.item_name}
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${item.item_name}; save entry to apply`}
                  title="Remove this food when you save the entry"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeFood(item);
                  }}
                  className="flex size-7 items-center justify-center text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <form
            className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-primary/10 bg-[#f4efd9] px-4"
            onSubmit={(event) => {
              event.preventDefault();
              addFood();
            }}
          >
            <input
              value={foodSearch}
              onChange={(event) => setFoodSearch(event.target.value)}
              placeholder="Search or add a food item"
              aria-label="Search or add a food item"
              className="min-w-0 flex-1 bg-transparent font-secondary text-sm text-secondary outline-none placeholder:text-secondary/75"
            />
            {foodSearch ? (
              <button type="submit" aria-label={`Add ${foodSearch}`} className="text-primary">
                <HiMagnifyingGlass className="size-5" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setFoodSearch("")}
              aria-label="Clear food search"
              className="text-primary"
            >
              <HiXMark className="size-5" />
            </button>
          </form>
        </div>

        <div className="mt-8 grid min-h-0 flex-1 gap-7 overflow-y-auto md:grid-cols-[230px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <img src={image} alt="Meal" className="mx-auto aspect-square w-28 rounded-xl object-cover" />
            <label className="grid grid-cols-[54px_minmax(0,1fr)] items-center gap-3 font-secondary text-sm">
              <span>Date</span>
              <input
                type="date"
                value={meal ? toLocalDateTime(meal.consumed_at).slice(0, 10) : ""}
                onChange={(event) => {
                  if (!meal || !event.target.value) return;
                  const time = toLocalDateTime(meal.consumed_at).slice(11, 16);
                  updateMeal({ consumed_at: fromLocalDateTime(event.target.value, time) });
                }}
                disabled={loading}
                className="h-10 w-full rounded-xl border border-primary/70 bg-transparent px-3 font-secondary text-sm text-secondary"
              />
            </label>
            <label className="grid grid-cols-[54px_minmax(0,1fr)] items-center gap-3 font-secondary text-sm">
              <span>Time</span>
              <input
                type="time"
                value={meal ? toLocalDateTime(meal.consumed_at).slice(11, 16) : ""}
                onChange={(event) => {
                  if (!meal || !event.target.value) return;
                  const date = toLocalDateTime(meal.consumed_at).slice(0, 10);
                  updateMeal({ consumed_at: fromLocalDateTime(date, event.target.value) });
                }}
                disabled={loading}
                className="h-10 w-full rounded-xl border border-primary/70 bg-transparent px-3 font-secondary text-sm text-secondary"
              />
            </label>
            <label className="grid grid-cols-[54px_minmax(0,1fr)] items-center gap-3 font-secondary text-sm">
              <span>Meal</span>
              <select
                value={meal?.type ?? "breakfast"}
                onChange={(event) => updateMeal({ type: event.target.value as MealEditorDetails["type"] })}
                disabled={loading}
                className="h-10 w-full rounded-xl border border-primary/70 bg-background px-3 font-secondary text-sm text-secondary"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </label>
            <div className="mt-1">
              <div className="mb-1 flex items-center justify-between font-secondary text-sm">
                <label htmlFor="meal-serving-size">Servings</label>
                <span>{activeItem?.serving_size ?? 0}</span>
              </div>
              <input
                id="meal-serving-size"
                type="range"
                min="1"
                max="10"
                step="1"
                value={activeItem?.serving_size ?? 1}
                disabled={!activeItem}
                onChange={(event) => updateItem(activeItem?.id, { serving_size: Number(event.target.value) })}
                className="w-full accent-[#f26a32]"
              />
              <div className="flex justify-between font-secondary text-xs text-secondary/75">
                <span>1</span><span>10</span>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col">
            <div className="border-b border-secondary/20 pb-3">
              <h3 className="font-secondary text-sm font-semibold">Food Summary</h3>
              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4">
                {summaryNutrients.map(({ label, nutrient }) => (
                  <div key={label} className="min-w-0">
                    <strong className="font-primary text-xl leading-none text-[#f26a32]">
                      {nutrient ? formatQuantity(nutrient.quantity) : "--"}
                    </strong>
                    <span className="ml-1 font-secondary text-xs text-secondary">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex min-h-0 flex-1 flex-col">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="font-secondary text-sm font-semibold">Nutrition Information</h3>
                <span className="font-secondary text-sm font-semibold">%DV</span>
              </div>
              <label className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-primary/80 px-3">
                <HiMagnifyingGlass className="size-5 shrink-0 text-primary" />
                <input
                  value={nutrientSearch}
                  onChange={(event) => setNutrientSearch(event.target.value)}
                  placeholder="Search for a vitamin"
                  aria-label="Search nutrients"
                  className="min-w-0 flex-1 bg-transparent font-secondary text-sm outline-none placeholder:text-secondary"
                />
              </label>
              <div className="mt-2 min-h-28 flex-1 overflow-y-auto">
                {loading ? (
                  <p className="p-3 font-secondary text-sm text-secondary/65">Loading nutrition...</p>
                ) : visibleNutrients.length ? (
                  visibleNutrients.map((nutrient, index) => (
                    <div
                      key={nutrient.nutrient_id}
                      className={`grid grid-cols-[minmax(0,1fr)_50px] items-center gap-2 rounded-lg px-2 py-2 font-secondary text-sm ${index === 1 ? "bg-[#fbe0c9]" : ""}`}
                    >
                      <span className="min-w-0 truncate">
                        <strong>{nutrient.name}</strong>
                        <span className="ml-3">{formatQuantity(nutrient.quantity)} {nutrient.unit ?? ""}</span>
                      </span>
                      <span className="text-right font-semibold">{nutrient.daily_value === null ? "—" : `${nutrient.daily_value}%`}</span>
                    </div>
                  ))
                ) : (
                  <p className="p-3 font-secondary text-sm text-secondary/65">
                    {meal?.nutrients.length ? "No matching nutrients." : "No nutrient details are available for this meal."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && <p role="alert" className="mt-3 font-secondary text-sm text-red-700">{error}</p>}
        {confirmDelete && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-700/20 bg-red-50 px-3 py-2">
            <p className="font-secondary text-sm text-red-900">
              Delete this meal and all its food items? This cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="rounded-full px-3 py-2 font-secondary text-sm text-secondary hover:bg-black/5 disabled:opacity-60"
              >
                Keep Meal
              </button>
              <button
                type="button"
                onClick={handleDeleteMeal}
                disabled={deleting}
                className="rounded-full bg-red-700 px-4 py-2 font-secondary text-sm font-medium text-white hover:bg-red-800 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Meal"}
              </button>
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-secondary/15 pt-4">
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={loading || saving || deleting || !meal}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-secondary text-sm font-medium text-red-800 transition hover:bg-red-50 disabled:opacity-50"
          >
            <HiTrash className="size-4" />
            Delete Meal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || saving || deleting || !meal}
            className="min-w-32 rounded-full bg-primary px-6 py-2.5 font-secondary text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-55"
          >
            {saving ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}