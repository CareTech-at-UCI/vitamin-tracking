/**
 * Diet restriction API client.
 */

import { createClient } from "@/utils/supabase/client";

const BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

async function getAccessToken(): Promise<string> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No active session");
  return token;
}

async function apiFetch(path: string, init: RequestInit = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

export type DietRestriction = {
  id: number;
  name: string;
  is_custom: boolean | null;
};

export type UserDietRestriction = {
  id: number;
  name: string;
  is_custom: boolean;
};

export async function getPresetDietRestrictions(): Promise<DietRestriction[]> {
  const data = await apiFetch("/api/v1/diet_restrictions/?is_custom=false&limit=100");
  return data.items ?? [];
}

export async function getUserDietRestrictions(): Promise<UserDietRestriction[]> {
  const data = await apiFetch("/api/v1/user-diet-restrictions/me");
  return data.items ?? [];
}

