"""Food image inference endpoints."""

from asyncio import to_thread
from functools import lru_cache
from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, HTTPException, UploadFile
from inference_sdk import InferenceConfiguration, InferenceHTTPClient

from app.api.core.config import get_settings

router = APIRouter()

MODEL_ID = "jh-r3-caretech/1"
MAX_IMAGE_BYTES = 10 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


@lru_cache
def get_roboflow_client() -> InferenceHTTPClient:
    settings = get_settings()
    return InferenceHTTPClient(
        api_url=settings.roboflow_api_url,
        api_key=settings.roboflow_api_key,
    ).configure(InferenceConfiguration(api_key_transport="header"))


@router.post("/infer")
async def infer_food(image: UploadFile) -> dict:
    """Run the configured Roboflow object-detection model on an uploaded image."""
    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=415, detail="Upload a JPEG, PNG, or WebP image.")

    image_bytes = await image.read(MAX_IMAGE_BYTES + 1)
    if not image_bytes:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="The image must be 10 MB or smaller.")

    suffix = Path(image.filename or "capture.jpg").suffix or ".jpg"
    temporary_path: Path | None = None
    try:
        with NamedTemporaryFile(suffix=suffix, delete=False) as temporary_file:
            temporary_file.write(image_bytes)
            temporary_path = Path(temporary_file.name)

        result = await to_thread(
            get_roboflow_client().infer,
            str(temporary_path),
            model_id=MODEL_ID,
        )

        print("Inference result:", result)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Roboflow inference failed.") from exc
    finally:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)

    if not isinstance(result, dict):
        raise HTTPException(status_code=502, detail="Roboflow returned an invalid response.")
    return result