/**
Profile API, impelements all created endpoints in /v1/profile.py
*/

import { createClient } from "@/utils/supabase/client";

const BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://127.0.0.1:8000";

async function getAccessToken(): Promise<string> {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
        throw new Error("No active session");
    }

    return token;
}

async function apiFetch(
    path: string,
    init: RequestInit = {}
) {
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

        throw new Error(
            `${init.method ?? "GET"} ${path} failed (${res.status}): ${text}`
        );
    }

    return res.json();
}

export type ProfilePicture =
    | "tomato"
    | "blueberry"
    | "watermelon"
    | "grape"
    | "fox"
    | "monkey"
    | "cat";

export type Sex = "male" | "female" | "other";

export type ProfileDietRestriction = {
    id: number;
    name: string;
    is_custom: boolean;
};

export type ProfileDietaryPlan = {
    id: number;
    name: string;
    is_custom: boolean;
};

export type Profile = {
    first_name: string | null;
    last_name: string | null;
    date_of_birth: string | null;
    sex: Sex | null;
    height: number | null;
    weight: number | null;
    activity_level: number | null;
    profile_picture: ProfilePicture | null;
    diet_restrictions: ProfileDietRestriction[];
    dietary_plans: ProfileDietaryPlan[];
};

export type ProfileUpdate = {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    sex?: Sex;
    height?: number;
    weight?: number;
    activity_level?: number;
    profile_picture?: ProfilePicture;
};

export type ProfileDietRestrictionsUpdate = {
    diet_restriction_ids: number[];
    custom_names: string[];
};

export type ProfileDietaryPlansUpdate = {
    dietary_plan_ids: number[];
    custom_names: string[];
};

// General profile get + update

export async function getProfile(): Promise<Profile> {
    return apiFetch("/api/v1/profile/");
}

export async function updateProfile(
    profile: ProfileUpdate
): Promise<Profile> {
    return apiFetch("/api/v1/profile/", {
        method: "PATCH",
        body: JSON.stringify(profile),
    });
}

// Diet Restrictions + Plans, they have their own functions for updating and therefore are implemented separately

export async function updateProfileDietRestrictions(
    restrictions: ProfileDietRestrictionsUpdate
): Promise<Profile> {
    return apiFetch("/api/v1/profile/diet-restrictions", {
        method: "PUT",
        body: JSON.stringify(restrictions),
    });
}

export async function updateProfileDietaryPlans(
    plans: ProfileDietaryPlansUpdate
): Promise<Profile> {
    return apiFetch("/api/v1/profile/dietary-plans", {
        method: "PUT",
        body: JSON.stringify(plans),
    });
}
