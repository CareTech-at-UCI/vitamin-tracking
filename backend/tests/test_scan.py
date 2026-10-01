import json
from pathlib import Path
from unittest import TestCase
from unittest.mock import Mock, patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.deps.auth import get_current_user_id
from app.api.deps.supabase import get_supabase_admin
from app.api.v1.endpoints import scan

USER_ID = "44728848-87d7-45ea-99d2-e6600c49b8d1"


def table_returning(data: list[dict]) -> Mock:
    query = Mock()
    query.select.return_value = query
    query.in_.return_value = query
    query.execute.return_value = Mock(data=data)
    return query


class ScanEndpointTests(TestCase):
    def setUp(self) -> None:
        app = FastAPI()
        app.include_router(scan.router, prefix="/scan")
        self.supabase = Mock()
        app.dependency_overrides[get_supabase_admin] = lambda: self.supabase
        app.dependency_overrides[get_current_user_id] = lambda: USER_ID
        self.client = TestClient(app)

    @patch("app.api.v1.endpoints.scan.get_roboflow_client")
    def test_infer_returns_model_predictions(self, get_client: Mock) -> None:
        temporary_paths: list[Path] = []

        def infer(image_path: str, *, model_id: str) -> dict:
            path = Path(image_path)
            self.assertTrue(path.exists())
            self.assertEqual(model_id, "jh-r3-caretech/1")
            temporary_paths.append(path)
            return {"predictions": [{"class": "apple", "confidence": 0.93}]}

        get_client.return_value.infer.side_effect = infer
        self.supabase.table.return_value = table_returning([])

        response = self.client.post(
            "/scan/infer",
            files={"image": ("apple.jpg", b"jpeg data", "image/jpeg")},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["predictions"][0]["class"], "apple")
        self.assertTrue(temporary_paths)
        self.assertFalse(temporary_paths[0].exists())

    @patch("app.api.v1.endpoints.scan.get_roboflow_client")
    def test_infer_rejects_unsupported_media(self, get_client: Mock) -> None:
        response = self.client.post(
            "/scan/infer",
            files={"image": ("food.txt", b"not an image", "text/plain")},
        )

        self.assertEqual(response.status_code, 415)
        get_client.assert_not_called()

    @patch("app.api.v1.endpoints.scan.get_roboflow_client")
    def test_infer_attaches_foods_by_class_name(self, get_client: Mock) -> None:
        get_client.return_value.infer.return_value = {
            "predictions": [
                {"class": "apple", "class_id": 2, "confidence": 0.6},
                {"class": "apple", "class_id": 2, "confidence": 0.9},
                {"class": "waffle", "class_id": 210, "confidence": 0.7},
            ]
        }
        food_items = table_returning([
            {"id": 240, "class_id": 211, "name": "waffle"},
            {"id": 3, "class_id": 2, "name": "apple"},
        ])
        self.supabase.table.return_value = food_items

        response = self.client.post(
            "/scan/infer",
            files={"image": ("food.jpg", b"jpeg data", "image/jpeg")},
        )

        self.assertEqual(response.status_code, 200)
        food_items.in_.assert_called_once_with("name", ["apple", "waffle"])
        foods = response.json()["foods"]
        self.assertEqual([f["name"] for f in foods], ["apple", "waffle"])
        self.assertEqual(foods[0]["confidence"], 0.9)

    def test_log_creates_meal_and_returns_scaled_nutrients(self) -> None:
        food_items = table_returning([{"id": 3, "name": "apple"}])
        food_item_nutrients = table_returning([
            {"food_item_id": 3, "quantity": 8.4, "nutrients": {"id": 1, "name": "Vitamin C", "symbol": "C", "unit": "mg"}},
        ])
        meal_scans = Mock()
        self.supabase.table.side_effect = lambda name: {
            "food_items": food_items,
            "food_item_nutrients": food_item_nutrients,
            "meal_scans": meal_scans,
        }[name]
        self.supabase.rpc.return_value.execute.return_value = Mock(data=42)
        bucket = self.supabase.storage.from_.return_value

        response = self.client.post(
            "/scan/log",
            data={"payload": json.dumps({
                "type": "lunch",
                "consumed_at": "2026-10-01T12:30:00-07:00",
                "items": [{"food_item_id": 3, "servings": 2}],
            })},
            files={"image": ("apple.jpg", b"jpeg data", "image/jpeg")},
        )

        self.assertEqual(response.status_code, 201)
        body = response.json()
        self.assertEqual(body["meal_id"], 42)
        self.assertAlmostEqual(body["nutrients"][0]["quantity"], 16.8)
        rpc_name, rpc_params = self.supabase.rpc.call_args.args
        self.assertEqual(rpc_name, "log_scanned_meal")
        self.assertEqual(rpc_params["p_user_id"], USER_ID)
        self.assertEqual(rpc_params["p_items"], [{"food_item_id": 3, "servings": 2}])

        self.supabase.storage.from_.assert_called_with("scan-images")
        uploaded_path, uploaded_bytes, _ = bucket.upload.call_args.args
        self.assertTrue(uploaded_path.startswith(f"{USER_ID}/42/"))
        self.assertTrue(uploaded_path.endswith(".jpg"))
        self.assertEqual(uploaded_bytes, b"jpeg data")
        self.assertEqual(body["image_path"], uploaded_path)
        meal_scans.insert.assert_called_once_with(
            {"user_id": USER_ID, "meal_id": 42, "image_path": uploaded_path}
        )

    def test_log_keeps_meal_when_image_upload_fails(self) -> None:
        food_items = table_returning([{"id": 3, "name": "apple"}])
        food_item_nutrients = table_returning([])
        self.supabase.table.side_effect = lambda name: {
            "food_items": food_items,
            "food_item_nutrients": food_item_nutrients,
        }[name]
        self.supabase.rpc.return_value.execute.return_value = Mock(data=7)
        self.supabase.storage.from_.return_value.upload.side_effect = RuntimeError("storage down")

        response = self.client.post(
            "/scan/log",
            data={"payload": json.dumps({
                "type": "dinner",
                "consumed_at": "2026-10-01T19:00:00Z",
                "items": [{"food_item_id": 3, "servings": 1}],
            })},
            files={"image": ("apple.png", b"png data", "image/png")},
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["meal_id"], 7)
        self.assertIsNone(response.json()["image_path"])

    def test_log_rejects_unsupported_image_before_logging(self) -> None:
        response = self.client.post(
            "/scan/log",
            data={"payload": json.dumps({
                "type": "lunch",
                "consumed_at": "2026-10-01T12:30:00Z",
                "items": [{"food_item_id": 3, "servings": 1}],
            })},
            files={"image": ("food.gif", b"gif data", "image/gif")},
        )

        self.assertEqual(response.status_code, 415)
        self.supabase.rpc.assert_not_called()

    def test_log_resolves_manual_names_and_rejects_unknown(self) -> None:
        food_items = table_returning([])
        self.supabase.table.return_value = food_items

        response = self.client.post(
            "/scan/log",
            data={"payload": json.dumps({
                "type": "snack",
                "consumed_at": "2026-10-01T15:00:00Z",
                "items": [{"name": "Mystery Stew", "servings": 1}],
            })},
        )

        self.assertEqual(response.status_code, 422)
        food_items.in_.assert_called_once_with("name", ["mystery-stew"])
        self.supabase.rpc.assert_not_called()