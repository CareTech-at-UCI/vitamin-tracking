"""
Helpers for syncing and reading `user_diet_restrictions`.
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


def _fetch_diet_restrictions_by_ids(
    supabase: Client, restriction_ids: list[int]
) -> dict[int, dict[str, Any]]:
    if not restriction_ids:
        return {}

    try:
        response = (
            supabase.table("diet_restrictions")
            .select("id, name, is_custom")
            .in_("id", restriction_ids)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Supabase diet restriction lookup failed: {exc}"
        ) from exc

    rows = response.data or []
    return {row["id"]: row for row in rows}


def _resolve_or_create_custom_ids(supabase: Client, names: list[str]) -> list[int]:
    ids: list[int] = []
    for name in _normalize_names(names):
        try:
            existing = (
                supabase.table("diet_restrictions")
                .select("id, is_custom")
                .eq("name", name)
                .limit(1)
                .execute()
            )
        except Exception as exc:
            raise HTTPException(
                status_code=500, detail=f"Supabase diet restriction lookup failed: {exc}"
            ) from exc

        rows = existing.data or []
        if rows:
            ids.append(rows[0]["id"])
            continue

        try:
            created = (
                supabase.table("diet_restrictions")
                .insert({"name": name, "is_custom": True})
                .execute()
            )
        except Exception as exc:
            raise HTTPException(
                status_code=500, detail=f"Supabase custom restriction insert failed: {exc}"
            ) from exc

        created_rows = created.data or []
        if not created_rows:
            raise HTTPException(
                status_code=500, detail="Custom restriction insert returned no row"
            )
        ids.append(created_rows[0]["id"])

    return ids


def sync_user_diet_restrictions(
    supabase: Client,
    user_id: str,
    diet_restriction_ids: list[int],
    custom_names: list[str],
) -> list[dict[str, Any]]:
    """
    Replace all diet restrictions for a user.

    Preset selections must reference non-custom rows. Custom names are upserted
    into `diet_restrictions` with `is_custom = true`.
    """
    unique_preset_ids = sorted(set(diet_restriction_ids))
    if not unique_preset_ids and not custom_names:
        raise HTTPException(
            status_code=400, detail="Select at least one dietary restriction"
        )

    preset_rows = _fetch_diet_restrictions_by_ids(supabase, unique_preset_ids)
    missing_ids = [rid for rid in unique_preset_ids if rid not in preset_rows]
    if missing_ids:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown diet restriction ids: {', '.join(map(str, missing_ids))}",
        )

    non_preset_ids = [
        rid for rid, row in preset_rows.items() if row.get("is_custom") is True
    ]
    if non_preset_ids:
        raise HTTPException(
            status_code=400,
            detail=(
                "Preset diet_restriction_ids must reference non-custom restrictions: "
                f"{', '.join(map(str, non_preset_ids))}"
            ),
        )

    custom_ids = _resolve_or_create_custom_ids(supabase, custom_names)
    all_ids = sorted(set(unique_preset_ids + custom_ids))

    try:
        supabase.table("user_diet_restrictions").delete().eq("user_id", user_id).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Supabase delete failed: {exc}"
        ) from exc

    if not all_ids:
        return []

    payload = [
        {"user_id": user_id, "diet_id": restriction_id}
        for restriction_id in all_ids
    ]

    try:
        response = supabase.table("user_diet_restrictions").insert(payload).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase insert failed: {exc}") from exc

    return list_user_diet_restrictions(supabase, user_id)


def list_user_diet_restrictions(supabase: Client, user_id: str) -> list[dict[str, Any]]:
    """Return joined diet restriction rows for a user."""
    try:
        response = (
            supabase.table("user_diet_restrictions")
            .select("diet_id, diet_restrictions(id, name, is_custom)")
            .eq("user_id", user_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {exc}") from exc

    items: list[dict[str, Any]] = []
    for row in response.data or []:
        restriction = row.get("diet_restrictions")
        if not restriction:
            continue
        items.append(
            {
                "id": restriction["id"],
                "name": restriction["name"],
                "is_custom": bool(restriction.get("is_custom")),
            }
        )

    items.sort(key=lambda item: (item["is_custom"], item["name"].casefold()))
    return items
