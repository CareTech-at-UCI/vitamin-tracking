#!/usr/bin/env python3
"""
Seed demo meals for the Recent Foods page.

Usage (from vitamind/backend):
  python scripts/seed_recent_foods_demo.py
  python scripts/seed_recent_foods_demo.py --user-id <uuid> --dates 2026-05-08 2026-05-07
"""

from __future__ import annotations

import argparse
import sys
from datetime import date, datetime, time
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.api.deps.supabase import get_supabase_admin

DEFAULT_USER_ID = "869d8252-7373-4741-b888-8ee8a17a46ec"
DEFAULT_DATES = ("2026-05-08", "2026-05-07")

# meal_type -> list of (item_name, weight_grams)
DAY_MENU: dict[str, dict[str, list[tuple[str, int]]]] = {
    "2026-05-08": {
        "breakfast": [
            ("Greek yogurt with honey", 180),
            ("Banana", 120),
            ("Whole grain toast", 70),
        ],
        "lunch": [
            ("Grilled chicken salad", 320),
            ("Brown rice", 150),
        ],
        "snack": [
            ("Almonds", 30),
            ("Green apple", 180),
        ],
        "dinner": [
            ("Baked salmon", 200),
            ("Roasted broccoli", 120),
            ("Quinoa", 140),
        ],
    },
    "2026-05-07": {
        "breakfast": [
            ("Scrambled eggs", 160),
            ("Avocado toast", 110),
        ],
        "lunch": [
            ("Turkey sandwich", 240),
            ("Carrot sticks", 90),
        ],
        "snack": [
            ("Protein bar", 60),
        ],
        "dinner": [
            ("Tofu stir-fry", 280),
            ("Mixed vegetables", 200),
        ],
    },
}

MEAL_TIMES: dict[str, tuple[int, int]] = {
    "breakfast": (8, 15),
    "lunch": (12, 30),
    "snack": (15, 45),
    "dinner": (19, 0),
}


def parse_date(value: str) -> date:
    return date.fromisoformat(value)


def consumed_at(day: date, meal_type: str) -> str:
    hour, minute = MEAL_TIMES[meal_type]
    if meal_type == "breakfast" and day.isoformat() == "2026-05-07":
        hour, minute = 7, 50
    if meal_type == "lunch" and day.isoformat() == "2026-05-07":
        hour, minute = 13, 0
    if meal_type == "snack" and day.isoformat() == "2026-05-07":
        hour, minute = 16, 20
    if meal_type == "dinner" and day.isoformat() == "2026-05-07":
        hour, minute = 18, 30
    dt = datetime.combine(day, time(hour, minute))
    return dt.isoformat()


def day_range(dates: list[date]) -> tuple[str, str]:
    start = min(dates)
    end = max(dates)
    next_day = date.fromordinal(end.toordinal() + 1)
    return (
        datetime.combine(start, time.min).isoformat(),
        datetime.combine(next_day, time.min).isoformat(),
    )


def ensure_user_exists(supabase, user_id: str) -> None:
    response = supabase.table("users").select("id").eq("id", user_id).limit(1).execute()
    if not (response.data or []):
        raise SystemExit(f"User {user_id} not found in users table.")


def clear_existing(supabase, user_id: str, dates: list[date]) -> int:
    range_start, range_end = day_range(dates)
    meals = (
        supabase.table("meals")
        .select("id")
        .eq("user_id", user_id)
        .gte("consumed_at", range_start)
        .lt("consumed_at", range_end)
        .execute()
    )
    meal_ids = [row["id"] for row in meals.data or []]
    if not meal_ids:
        return 0
    supabase.table("meals").delete().in_("id", meal_ids).execute()
    return len(meal_ids)


def seed_day(supabase, user_id: str, day: date, menu: dict[str, list[tuple[str, int]]]) -> int:
    created_items = 0
    for meal_type, items in menu.items():
        meal_response = (
            supabase.table("meals")
            .insert(
                {
                    "user_id": user_id,
                    "type": meal_type,
                    "consumed_at": consumed_at(day, meal_type),
                    "notes": "Demo seed for recent foods",
                }
            )
            .execute()
        )
        meal_rows = meal_response.data or []
        if not meal_rows:
            raise SystemExit(f"Failed to create {meal_type} meal for {day.isoformat()}")

        meal_id = meal_rows[0]["id"]
        payload = [
            {"meal_id": meal_id, "item_name": name, "weight": weight}
            for name, weight in items
        ]
        supabase.table("meal_items").insert(payload).execute()
        created_items += len(payload)

    return created_items


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed recent-foods demo data")
    parser.add_argument("--user-id", default=DEFAULT_USER_ID)
    parser.add_argument(
        "--dates",
        nargs="+",
        default=list(DEFAULT_DATES),
        help="YYYY-MM-DD dates to seed (must exist in DAY_MENU or be added there)",
    )
    parser.add_argument(
        "--no-clear",
        action="store_true",
        help="Do not delete existing meals for these dates before seeding",
    )
    args = parser.parse_args()

    dates = [parse_date(value) for value in args.dates]
    supabase = get_supabase_admin()

    ensure_user_exists(supabase, args.user_id)

    if not args.no_clear:
        removed = clear_existing(supabase, args.user_id, dates)
        print(f"Cleared {removed} existing meal(s) for {args.user_id}")

    total_items = 0
    for day in dates:
        menu = DAY_MENU.get(day.isoformat())
        if not menu:
            raise SystemExit(
                f"No menu configured for {day.isoformat()}. Add it to DAY_MENU in this script."
            )
        count = seed_day(supabase, args.user_id, day, menu)
        total_items += count
        print(f"Seeded {day.isoformat()}: {count} food item(s)")

    print(f"Done. {total_items} meal item(s) for user {args.user_id}")


if __name__ == "__main__":
    main()
