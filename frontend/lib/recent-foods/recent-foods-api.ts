import { createClient } from "@/utils/supabase/client";

const DEFAULT_BASE = "http://127.0.0.1:8000";

export type RecentFoodsMealKey = "breakfast" | "lunch" | "dinner" | "snacks";

export type RecentFoodsApiItem = {
  id: number;
  meal_id: number;
  name: string;
  image_path: string | null;
};

export type MealEditorItem = {
  id?: number;
  meal_id: number;
  item_name: string;
  serving_size: number;
};

export type MealEditorNutrient = {
  nutrient_id: number;
  name: string;
  unit: string | null;
  quantity: number;
  daily_value: number | null;
};

export type MealEditorDetails = {
  id: number;
  consumed_at: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  notes: string | null;
  items: MealEditorItem[];
  nutrients: MealEditorNutrient[];
};

export type RecentFoodsApiMeals = Record<RecentFoodsMealKey, RecentFoodsApiItem[]>;

export type RecentFoodsDayResponse = {
  date: string;
  meals: RecentFoodsApiMeals;
};

export function getRecentFoodsApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  return base ?? DEFAULT_BASE;
}

async function mealApiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sign in to edit meals.");

  const response = await fetch(`${getRecentFoodsApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${init.method ?? "GET"} ${path} failed (${response.status}): ${text}`);
  }
  return response.json() as Promise<T>;
}

export async function getMealEditorDetails(
  mealId: number,
  userId: string,
): Promise<MealEditorDetails> {
  const [meal, itemResponse] = await Promise.all([
    mealApiFetch<{
      id: number;
      consumed_at: string;
      type: MealEditorDetails["type"];
      notes: string | null;
    }>(
      `/api/v1/meals/${mealId}`,
    ),
    mealApiFetch<{ items: MealEditorItem[] }>(`/api/v1/meal_items/meal/${mealId}`),
  ]);

  let nutrients: MealEditorNutrient[] = [];
  try {
    const [itemNutrients, goalsResponse] = await Promise.all([
      Promise.all(
        itemResponse.items
          .filter((item): item is MealEditorItem & { id: number } => item.id !== undefined)
          .map((item) =>
            mealApiFetch<{ items: Array<{ nutrient_id: number; quantity: number }> }>(
              `/api/v1/meal-nutrients/meal/${item.id}`,
            ),
          ),
      ),
      mealApiFetch<{ items: Array<{ nutrient_id: number; quantity: number }> }>(
        `/api/v1/nutrient-goals/user/${userId}`,
      ),
    ]);
    const totals = new Map<number, number>();
    for (const response of itemNutrients) {
      for (const nutrient of response.items) {
        totals.set(
          nutrient.nutrient_id,
          (totals.get(nutrient.nutrient_id) ?? 0) + Number(nutrient.quantity),
        );
      }
    }

    nutrients = await Promise.all(
      [...totals].map(async ([nutrientId, quantity]) => {
        const nutrient = await mealApiFetch<{
          id: number;
          name: string;
          unit: string | null;
        }>(`/api/v1/nutrients/${nutrientId}`);
        const dailyValue = goalsResponse.items.find(
          (goal) => goal.nutrient_id === nutrientId,
        )?.quantity;
        return {
          nutrient_id: nutrientId,
          name: nutrient.name,
          unit: nutrient.unit,
          quantity,
          daily_value:
            dailyValue && dailyValue > 0
              ? Math.round((quantity / dailyValue) * 100)
              : null,
        };
      }),
    );
  } catch {
    nutrients = [];
  }

  return { ...meal, items: itemResponse.items, nutrients };
}

export async function saveMealEditorDetails(
  meal: Pick<MealEditorDetails, "id" | "consumed_at" | "type" | "notes" | "items">,
): Promise<void> {
  const { id, consumed_at, type, notes, items } = meal;
  await mealApiFetch(`/api/v1/meals/${id}`, {
    method: "PUT",
    body: JSON.stringify({ consumed_at, type, notes }),
  });
  await mealApiFetch(`/api/v1/meal_items/meal/${id}/sync`, {
    method: "PUT",
    body: JSON.stringify({
      items: items.map(({ id: itemId, item_name, serving_size }) => ({
        ...(itemId !== undefined && itemId > 0 ? { id: itemId } : {}),
        item_name,
        serving_size,
      })),
    }),
  });
}

export async function getRecentFoodsDay(
  date: string,
  userId: string,
): Promise<RecentFoodsDayResponse> {
  const base = getRecentFoodsApiBaseUrl();
  const url = new URL(`${base}/api/v1/meals/recent-foods`);
  url.searchParams.set("date", date);
  url.searchParams.set("user_id", userId);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GET /api/v1/meals/recent-foods failed (${response.status}): ${text}`);
  }

  return response.json() as Promise<RecentFoodsDayResponse>;
}
