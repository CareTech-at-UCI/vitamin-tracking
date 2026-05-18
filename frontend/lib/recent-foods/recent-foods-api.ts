const DEFAULT_BASE = "http://127.0.0.1:8000";
export const DEMO_RECENT_FOODS_USER_ID =
  process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "869d8252-7373-4741-b888-8ee8a17a46ec";

export type RecentFoodsMealKey = "breakfast" | "lunch" | "dinner" | "snacks";

export type RecentFoodsApiItem = {
  id: number;
  meal_id: number;
  name: string;
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

export async function getRecentFoodsDay(
  date: string,
  userId = DEMO_RECENT_FOODS_USER_ID,
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
