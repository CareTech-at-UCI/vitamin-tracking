from unittest import TestCase
from unittest.mock import Mock

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.deps.supabase import get_supabase_admin
from app.api.v1.endpoints import dashboard


def table_returning(data: list[dict]) -> Mock:
    query = Mock()
    for method in ("select", "eq", "gte", "lt", "in_"):
        getattr(query, method).return_value = query
    query.execute.return_value = Mock(data=data)
    return query


class DashboardDatesTests(TestCase):
    def setUp(self) -> None:
        app = FastAPI()
        app.include_router(dashboard.router, prefix="/dashboard")
        self.supabase = Mock()
        app.dependency_overrides[get_supabase_admin] = lambda: self.supabase
        self.client = TestClient(app)

    def test_late_local_meal_counts_toward_local_day(self) -> None:
        meals = table_returning([{"id": 1, "consumed_at": "2026-10-02T06:30:00+00:00"}])
        tables = {
            "meals": meals,
            "meal_items": table_returning([{"id": 2, "meal_id": 1}]),
            "meal_nutrients": table_returning([{"item_id": 2, "nutrient_id": 3, "quantity": 5}]),
            "nutrients": table_returning([{"id": 3, "name": "Vitamin C", "symbol": "C", "unit": "mg"}]),
            "nutrient_goals": table_returning([{"nutrient_id": 3, "quantity": 10}]),
        }
        self.supabase.table.side_effect = tables.__getitem__

        response = self.client.get("/dashboard/week", params={
            "user_id": "44728848-87d7-45ea-99d2-e6600c49b8d1",
            "anchor_date": "2026-10-02",
            "time_zone": "America/Los_Angeles",
        })

        self.assertEqual(response.status_code, 200)
        totals = {day["date"]: day["vitamins"][0]["total_quantity"] for day in response.json()["days"]}
        self.assertEqual(totals["2026-10-01"], 5)
        self.assertEqual(totals["2026-10-02"], 0)
        meals.gte.assert_called_once_with("consumed_at", "2026-09-26T07:00:00+00:00")
        meals.lt.assert_called_once_with("consumed_at", "2026-10-03T07:00:00+00:00")