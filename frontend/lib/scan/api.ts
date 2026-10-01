import { createClient } from "@/utils/supabase/client";

const DEFAULT_API_BASE = "http://127.0.0.1:8000";

type MatchedFood = {
  id: number;
  class_id: number;
  name: string;
  confidence: number;
};

type InferenceResult = {
  foods?: MatchedFood[];
};

export type DetectedFood = {
  foodItemId: number;
  name: string;
  confidence: number;
};

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type LogMealItem = {
  foodItemId?: number;
  name: string;
  servings: number;
};

export type LoggedNutrient = {
  nutrient_id: number;
  name: string;
  symbol: string | null;
  unit: string | null;
  quantity: number;
};

export type LogMealResponse = {
  meal_id: number;
  items: { food_item_id: number; name: string; servings: number }[];
  nutrients: LoggedNutrient[];
};

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? DEFAULT_API_BASE;
}

async function readErrorDetail(response: Response, fallback: string): Promise<string> {
  const body = (await response.json().catch(() => null)) as { detail?: unknown } | null;
  return typeof body?.detail === "string" ? body.detail : fallback;
}

export function formatFoodName(name: string): string {
  return name.replace(/-/g, " ");
}

export function mealTypeForTime(date: Date): MealType {
  const hour = date.getHours();
  if (hour >= 4 && hour < 11) return "breakfast";
  if (hour >= 11 && hour < 16) return "lunch";
  if (hour >= 16 && hour < 22) return "dinner";
  return "snack";
}

export async function inferFoodImage(image: Blob): Promise<DetectedFood[]> {
  const formData = new FormData();
  formData.append("image", image, image instanceof File ? image.name : "capture.jpg");

  const response = await fetch(`${getApiBaseUrl()}/api/v1/scan/infer`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Food recognition failed. Please try again."));
  }

  const result = (await response.json()) as InferenceResult;
  return (result.foods ?? []).map((food) => ({
    foodItemId: food.id,
    name: formatFoodName(food.name),
    confidence: food.confidence,
  }));
}

export async function logScannedMeal(
  items: LogMealItem[],
  consumedAt: Date = new Date(),
): Promise<LogMealResponse> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Please sign in to log meals.");

  const response = await fetch(`${getApiBaseUrl()}/api/v1/scan/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: mealTypeForTime(consumedAt),
      consumed_at: consumedAt.toISOString(),
      items: items.map((item) =>
        item.foodItemId
          ? { food_item_id: item.foodItemId, servings: item.servings }
          : { name: item.name, servings: item.servings },
      ),
    }),
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Failed to log meal. Please try again."));
  }
  return response.json() as Promise<LogMealResponse>;
}