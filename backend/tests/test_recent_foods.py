from unittest import TestCase
from unittest.mock import Mock

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.deps.supabase import get_supabase_admin
from app.api.v1.endpoints import meals


class RecentFoodsDayTests(TestCase):
    def setUp(self) -> None:
        app = FastAPI()
        app.include_router(meals.router, prefix="/meals")
        self.supabase = Mock()
        app.dependency_overrides[get_supabase_admin] = lambda: self.supabase
        self.client = TestClient(app)

    def test_local_day_uses_supplied_timezone_aware_bounds(self) -> None:
        query = self.supabase.table.return_value
        query.select.return_value = query
        query.eq.return_value = query
        query.limit.return_value = query
        query.gte.return_value = query
        query.lt.return_value = query
        query.order.return_value = query
        query.execute.side_effect = [Mock(data=[{"id": "user"}]), Mock(data=[])]

        response = self.client.get("/meals/recent-foods", params={
            "user_id": "44728848-87d7-45ea-99d2-e6600c49b8d1",
            "date": "2026-10-01",
            "start_at": "2026-10-01T07:00:00Z",
            "end_at": "2026-10-02T07:00:00Z",
        })

        self.assertEqual(response.status_code, 200)
        query.gte.assert_called_once_with("consumed_at", "2026-10-01T07:00:00+00:00")
        query.lt.assert_called_once_with("consumed_at", "2026-10-02T07:00:00+00:00")

    def test_rejects_naive_day_bounds(self) -> None:
        response = self.client.get("/meals/recent-foods", params={
            "user_id": "44728848-87d7-45ea-99d2-e6600c49b8d1",
            "date": "2026-10-01",
            "start_at": "2026-10-01T00:00:00",
            "end_at": "2026-10-02T00:00:00",
        })

        self.assertEqual(response.status_code, 422)
        self.supabase.table.assert_not_called()