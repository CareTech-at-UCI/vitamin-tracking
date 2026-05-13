"use client";

import { useEffect, useState } from "react";

const DEFAULT_API_BASE = "http://127.0.0.1:8000";
const DASHBOARD_WEEK_USER_ID = "869d8252-7373-4741-b888-8ee8a17a46ec";

type DashboardWeekVitamin = {
  nutrient_id: number;
  nutrient_name: string;
  symbol: string | null;
  unit: string | null;
  total_quantity: number;
  goal_quantity: number;
  percentage: number;
};

type DashboardWeekDay = {
  date: string;
  vitamins: DashboardWeekVitamin[];
};

type DashboardWeekResponse = {
  dates: string[];
  days: DashboardWeekDay[];
};

export type DashboardVitaminCard = {
  id: string;
  name: string;
  percentage: number;
};

type DashboardWeekState = {
  vitamins: DashboardVitaminCard[];
  isLoading: boolean;
  error: string | null;
};

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  return base ?? DEFAULT_API_BASE;
}

function toVitaminId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchDashboardWeek(userId: string): Promise<DashboardWeekResponse> {
  const base = getApiBaseUrl();
  const url = new URL(`${base}/api/v1/dashboard/week`);
  url.searchParams.set("user_id", userId);

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET /api/v1/dashboard/week failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<DashboardWeekResponse>;
}

function pickWeekVitamins(response: DashboardWeekResponse): DashboardVitaminCard[] {
  const byNutrientId = new Map<
    number,
    { id: string; name: string; total: number; goal: number }
  >();

  for (const day of response.days) {
    for (const vitamin of day.vitamins) {
      const existing = byNutrientId.get(vitamin.nutrient_id);
      const total = (existing?.total ?? 0) + (vitamin.total_quantity ?? 0);
      const goal = vitamin.goal_quantity ?? existing?.goal ?? 0;

      byNutrientId.set(vitamin.nutrient_id, {
        id: toVitaminId(vitamin.nutrient_name),
        name: vitamin.nutrient_name,
        total,
        goal,
      });
    }
  }

  const cards: DashboardVitaminCard[] = Array.from(byNutrientId.values()).map(
    ({ id, name, total, goal }) => ({
      id,
      name,
      percentage: goal > 0 ? Math.round((total / goal) * 100 * 100) / 100 : 0,
    }),
  );

  return cards.sort((a, b) => a.name.localeCompare(b.name));
}

export function useDashboardWeekVitamins(): DashboardWeekState {
  const [vitamins, setVitamins] = useState<DashboardVitaminCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadVitamins = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchDashboardWeek(DASHBOARD_WEEK_USER_ID);

        if (!isActive) {
          return;
        }

        setVitamins(pickWeekVitamins(response));
      } catch (fetchError) {
        if (!isActive) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load dashboard vitamin data.",
        );
        setVitamins([]);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadVitamins();

    return () => {
      isActive = false;
    };
  }, []);

  return { vitamins, isLoading, error };
}