from unittest import TestCase
from unittest.mock import Mock

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.deps.supabase import get_supabase_admin
from app.api.v1.endpoints import vitamin_breakdown


def table_returning(data: list[dict]) -> Mock:
    query = Mock()
    for method in ("select", "eq", "gte", "lt", "in_"):
        getattr(query, method).return_value = query
    query.execute.return_value = Mock(data=data)
    return query


class VitaminBreakdownDatesTests(TestCase):
    def setUp(self) -> None:
        app = FastAPI()
        app.include_router(vitamin_breakdown.router, prefix="/vitamin-breakdown")
        self.supabase = Mock()
        app.dependency_overrides[get_supabase_admin] = lambda: self.supabase
        self.client = TestClient(app)

        self.meals = table_returning([{"id": 1, "consumed_at": "2026-10-02T06:30:00+00:00"}])
        self.supabase.table.side_effect = {
            "meals": self.meals,
            "meal_items": table_returning([{"id": 2, "meal_id": 1}]),
            "meal_nutrients": table_returning([{"item_id": 2, "nutrient_id": 3, "quantity": 5}]),
            "nutrients": table_returning([{"id": 3, "name": "Vitamin C", "symbol": "C", "unit": "mg"}]),
            "nutrient_goals": table_returning([{"nutrient_id": 3, "quantity": 10}]),
        }.__getitem__

    def test_daily_breakdown_uses_local_date(self) -> None:
        response = self.client.get("/vitamin-breakdown/", params={
            "user_id": "44728848-87d7-45ea-99d2-e6600c49b8d1",
            "date": "2026-10-01", "time_zone": "America/Los_Angeles",
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["days"][0]["vitamins"][0]["total_quantity"], 5)
        self.assertEqual(response.json()["days"][0]["vitamins"][0]["ratio"], 0.5)
        self.meals.gte.assert_called_once_with("consumed_at", "2026-10-01T07:00:00+00:00")
        self.meals.lt.assert_called_once_with("consumed_at", "2026-10-02T07:00:00+00:00")

    def test_weekly_breakdown_groups_by_local_date(self) -> None:
        response = self.client.get("/vitamin-breakdown/week", params={
            "user_id": "44728848-87d7-45ea-99d2-e6600c49b8d1",
            "anchor_date": "2026-10-02", "time_zone": "America/Los_Angeles",
        })

        self.assertEqual(response.status_code, 200)
        totals = {day["date"]: sum(v["total_quantity"] for v in day["vitamins"]) for day in response.json()["days"]}
        self.assertEqual(totals["2026-10-01"], 5)
        self.assertEqual(totals["2026-10-02"], 0)

    def test_fall_back_day_includes_both_repeated_hours(self) -> None:
        self.meals.execute.return_value = Mock(data=[
            {"id": 1, "consumed_at": "2026-11-01T08:30:00+00:00"},
            {"id": 2, "consumed_at": "2026-11-01T09:30:00+00:00"},
        ])
        items = self.supabase.table.side_effect("meal_items")
        items.execute.return_value = Mock(data=[{"id": 2, "meal_id": 1}, {"id": 4, "meal_id": 2}])
        quantities = self.supabase.table.side_effect("meal_nutrients")
        quantities.execute.return_value = Mock(data=[
            {"item_id": 2, "nutrient_id": 3, "quantity": 5},
            {"item_id": 4, "nutrient_id": 3, "quantity": 5},
        ])

        response = self.client.get("/vitamin-breakdown/", params={
            "user_id": "44728848-87d7-45ea-99d2-e6600c49b8d1",
            "date": "2026-11-01", "time_zone": "America/Los_Angeles",
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["days"][0]["vitamins"][0]["total_quantity"], 10)
        self.meals.gte.assert_called_once_with("consumed_at", "2026-11-01T07:00:00+00:00")
        self.meals.lt.assert_called_once_with("consumed_at", "2026-11-02T08:00:00+00:00")