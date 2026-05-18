/**
 * Vitamin breakdown — HTTP calls to FastAPI `/api/v1/vitamin-breakdown`
 */

const DEFAULT_API_BASE = "http://127.0.0.1:8000";

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  return base ?? DEFAULT_API_BASE;
}

export type VitaminDetail = {
  nutrient_id: number | null;
  nutrient_name: string;
  symbol: string | null;
  unit: string | null;
  total_quantity: number;
  goal_quantity: number;
  ratio: number | null;
};

export type VitaminDay = {
  date: string;
  vitamins: VitaminDetail[];
};

export type VitaminBreakdownResponse = {
  dates: string[];
  days: VitaminDay[];
};

async function fetchVitaminBreakdown(
  path: string,
  params: URLSearchParams,
): Promise<VitaminBreakdownResponse> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}${path}?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${path} failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<VitaminBreakdownResponse>;
}

/** `GET /api/v1/vitamin-breakdown` */
export async function getDailyVitaminBreakdown(
  userId: string,
  date: string,
): Promise<VitaminBreakdownResponse> {
  const params = new URLSearchParams({ user_id: userId, date });
  return fetchVitaminBreakdown("/api/v1/vitamin-breakdown", params);
}

/** `GET /api/v1/vitamin-breakdown/week` */
export async function getWeeklyVitaminBreakdown(
  userId: string,
  anchorDate: string,
): Promise<VitaminBreakdownResponse> {
  const params = new URLSearchParams({
    user_id: userId,
    anchor_date: anchorDate,
  });
  return fetchVitaminBreakdown("/api/v1/vitamin-breakdown/week", params);
}
