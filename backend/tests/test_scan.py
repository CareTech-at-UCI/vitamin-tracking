from pathlib import Path
from unittest import TestCase
from unittest.mock import Mock, patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.v1.endpoints import scan


class ScanEndpointTests(TestCase):
    def setUp(self) -> None:
        app = FastAPI()
        app.include_router(scan.router, prefix="/scan")
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