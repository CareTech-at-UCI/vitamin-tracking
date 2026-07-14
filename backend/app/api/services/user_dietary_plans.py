"""
Helpers for syncing and reading `user_dietary_plans`.
"""

from __future__ import annotations

from typing import Any

from fastapi import HTTPException
from supabase import Client


def _normalize_names(names: list[str]) -> list[str]:
    seen: set[str] = set()
    normalized: list[str] = []
    for name in names:
        trimmed = name.strip()
        if not trimmed:
            continue
        key = trimmed.casefold()
        if key in seen:
            continue
        seen.add(key)
        normalized.append(trimmed)
    return normalized


def _fetch_dietary_plans_by_ids(
    supabase: Client, dietary_plan_ids: list[int]
) -> dict[int, dict[str, Any]]:
    if not dietary_plan_ids:
        return {}

    try:
        response = (
            supabase.table("dietary_plans")
            .select("id, name, is_custom")
            .in_("id", dietary_plan_ids)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Supabase dietary plan lookup failed: {exc}"
        ) from exc

    rows = response.data or []
    return {row["id"]: row for row in rows}


def _resolve_or_create_custom_ids(supabase: Client, names: list[str]) -> list[int]:
    ids: list[int] = []
    for name in _normalize_names(names):
        try:
            existing = (
                supabase.table("dietary_plans")
                .select("id, is_custom")
                .eq("name", name)
                .limit(1)
                .execute()
            )
        except Exception as exc:
            raise HTTPException(
                status_code=500, detail=f"Supabase dietary plan lookup failed: {exc}"
            ) from exc

        rows = existing.data or []
        if rows:
            ids.append(rows[0]["id"])
            continue

        try:
            created = (
                supabase.table("dietary_plans")
                .insert({"name": name, "is_custom": True})
                .execute()
            )
        except Exception as exc:
            raise HTTPException(
                status_code=500, detail=f"Supabase custom dietary plan insert failed: {exc}"
            ) from exc

        created_rows = created.data or []
        if not created_rows:
            raise HTTPException(
                status_code=500, detail="Custom dietary plan insert returned no row"
            )
        ids.append(created_rows[0]["id"])

    return ids


def sync_user_dietary_plans(
    supabase: Client,
    user_id: str,
    dietary_plan_ids: list[int],
    custom_names: list[str],
) -> list[dict[str, Any]]:
    """
    Replace all dietary plans for a user.

    Preset selections must reference non-custom rows. Custom names are upserted
    into `dietary_plans` with `is_custom = true`.
    """
    unique_preset_ids = sorted(set(dietary_plan_ids))
    normalized_custom = _normalize_names(custom_names)

    preset_rows = _fetch_dietary_plans_by_ids(supabase, unique_preset_ids)
    missing_ids = [rid for rid in unique_preset_ids if rid not in preset_rows]
    if missing_ids:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown dietary plan ids: {', '.join(map(str, missing_ids))}",
        )

    non_preset_ids = [
        rid for rid, row in preset_rows.items() if row.get("is_custom") is True
    ]
    if non_preset_ids:
        raise HTTPException(
            status_code=400,
            detail=(
                "Preset dietary_plan_ids must reference non-custom plans: "
                f"{', '.join(map(str, non_preset_ids))}"
            ),
        )

    custom_ids = _resolve_or_create_custom_ids(supabase, normalized_custom)
    all_ids = sorted(set(unique_preset_ids + custom_ids))

    try:
        supabase.table("user_dietary_plans").delete().eq("user_id", user_id).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Supabase delete failed: {exc}"
        ) from exc

    if not all_ids:
        return []

    payload = [
        {"user_id": user_id, "dietary_plan_id": plan_id}
        for plan_id in all_ids
    ]

    try:
        response = supabase.table("user_dietary_plans").insert(payload).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase insert failed: {exc}") from exc

    return list_user_dietary_plans(supabase, user_id)


def list_user_dietary_plans(
    supabase: Client, user_id: str
) -> list[dict[str, Any]]:
    """
    Retrieve all dietary plans for a user (preset + custom).
    """
    try:
        response = (
            supabase.table("user_dietary_plans")
            .select("dietary_plans(id, name, is_custom)")
            .eq("user_id", user_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Supabase query failed: {exc}"
        ) from exc

    rows = response.data or []
    return [row["dietary_plans"] for row in rows if row.get("dietary_plans")]
