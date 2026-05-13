/**
 * Onboarding API client — all HTTP calls to the FastAPI onboarding endpoints.
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

export type OnboardingState = {
  current_step: string | null;
  is_completed: boolean;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  sex: "male" | "female" | "other" | null;
  height: number | null;
  weight: number | null;
  activity_level: number | null;
  recommendations: string[] | null;
  profile_picture: "fox" | "monkey" | "cat" | null;
};

export async function getOnboarding(): Promise<OnboardingState> {
  return apiFetch("/api/v1/onboarding/");
}

export async function patchOnboardingStep(
  stepKey: string,
  body: Record<string, unknown>,
): Promise<void> {
  await apiFetch(`/api/v1/onboarding/step/${stepKey}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function completeOnboarding(): Promise<void> {
  await apiFetch("/api/v1/onboarding/complete", { method: "POST" });
}
