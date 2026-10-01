"""
Scan services

Maps model predictions to food_items and logs confirmed foods as meals with nutrients.
"""

import re
from typing import Any

from supabase import Client

from app.api.schemas.scan import ScanLogCreate

FOOD_ITEM_COLUMNS = "id, class_id, name, description, serving_description, serving_size_g"


def to_food_slug(name: str) -> str:
    """Normalize a display name ("Apple Pie") to the food_items.name format ("apple-pie")."""
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def match_predictions_to_foods(supabase: Client, predictions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Return one food_items row per detected class, ordered by highest confidence."""
    # Match on class name: the model's class_id ordering does not match food_items.class_id.
    best_confidence: dict[str, float] = {}
    for prediction in predictions:
        class_name = prediction.get("class")
        confidence = float(prediction.get("confidence") or 0)
        if isinstance(class_name, str) and class_name:
            slug = to_food_slug(class_name)
            if confidence > best_confidence.get(slug, -1.0):
                best_confidence[slug] = confidence

    if not best_confidence:
        return []

    response = (
        supabase.table("food_items")
        .select(FOOD_ITEM_COLUMNS)
        .in_("name", list(best_confidence))
        .execute()
    )
    foods = [
        {**row, "confidence": best_confidence[row["name"]]}
        for row in response.data or []
    ]
    return sorted(foods, key=lambda food: food["confidence"], reverse=True)


def resolve_food_items(supabase: Client, body: ScanLogCreate) -> tuple[list[dict[str, Any]], list[str]]:
    """
    Resolve each requested item to a food_items row.
    Returns (resolved items with food_item_id/name/servings, unmatched names).
    """
    ids = {item.food_item_id for item in body.items if item.food_item_id is not None}
    slugs = {to_food_slug(item.name) for item in body.items if item.food_item_id is None and item.name}

    rows: list[dict[str, Any]] = []
    if ids:
        rows += supabase.table("food_items").select("id, name").in_("id", list(ids)).execute().data or []
    if slugs:
        rows += supabase.table("food_items").select("id, name").in_("name", list(slugs)).execute().data or []

    by_id = {row["id"]: row for row in rows}
    by_slug = {row["name"]: row for row in rows}

    resolved: list[dict[str, Any]] = []
    unmatched: list[str] = []
    for item in body.items:
        row = by_id.get(item.food_item_id) if item.food_item_id is not None else by_slug.get(to_food_slug(item.name or ""))
        if row is None:
            unmatched.append(item.name or str(item.food_item_id))
            continue
        resolved.append({"food_item_id": row["id"], "name": row["name"], "servings": item.servings})
    return resolved, unmatched


def log_meal(supabase: Client, user_id: str, body: ScanLogCreate, items: list[dict[str, Any]]) -> int:
    """Atomically insert the meal, meal_items, and scaled meal_nutrients via RPC."""
    response = supabase.rpc(
        "log_scanned_meal",
        {
            "p_user_id": user_id,
            "p_type": body.type.value,
            "p_consumed_at": body.consumed_at.isoformat(),
            "p_notes": body.notes,
            "p_items": [{"food_item_id": i["food_item_id"], "servings": i["servings"]} for i in items],
        },
    ).execute()
    return int(response.data)


def summarize_nutrients(supabase: Client, items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Total nutrients across the logged items, scaled by servings."""
    food_ids = list({item["food_item_id"] for item in items})
    response = (
        supabase.table("food_item_nutrients")
        .select("food_item_id, quantity, nutrients(id, name, symbol, unit)")
        .in_("food_item_id", food_ids)
        .execute()
    )

    servings_by_food: dict[int, int] = {}
    for item in items:
        servings_by_food[item["food_item_id"]] = servings_by_food.get(item["food_item_id"], 0) + item["servings"]

    totals: dict[int, dict[str, Any]] = {}
    for row in response.data or []:
        nutrient = row["nutrients"]
        entry = totals.setdefault(
            nutrient["id"],
            {
                "nutrient_id": nutrient["id"],
                "name": nutrient["name"],
                "symbol": nutrient.get("symbol"),
                "unit": nutrient.get("unit"),
                "quantity": 0.0,
            },
        )
        entry["quantity"] += float(row["quantity"]) * servings_by_food[row["food_item_id"]]

    return sorted(totals.values(), key=lambda n: n["name"])
