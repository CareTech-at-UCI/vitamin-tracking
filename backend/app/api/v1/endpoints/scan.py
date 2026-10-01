"""Food image inference endpoints."""

from asyncio import to_thread
from functools import lru_cache
from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from inference_sdk import InferenceConfiguration, InferenceHTTPClient
from pydantic import ValidationError
from supabase import Client

from app.api.core.config import get_settings
from app.api.deps.auth import get_current_user_id
from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.scan import ScanLogCreate, ScanLogResponse
from app.api.services import scan_service

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


async def read_image(image: UploadFile) -> bytes:
    """Validate an uploaded image's type and size and return its bytes."""
    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=415, detail="Upload a JPEG, PNG, or WebP image.")

    image_bytes = await image.read(MAX_IMAGE_BYTES + 1)
    if not image_bytes:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="The image must be 10 MB or smaller.")
    return image_bytes


@router.post("/infer")
async def infer_food(
    image: UploadFile,
    supabase: Client = Depends(get_supabase_admin),
) -> dict:
    """Run the Roboflow model on an uploaded image and attach matching food_items as `foods`."""
    image_bytes = await read_image(image)

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

    try:
        result["foods"] = scan_service.match_predictions_to_foods(supabase, result.get("predictions") or [])
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Food lookup failed.") from exc
    return result


@router.post("/log", response_model=ScanLogResponse, status_code=201)
async def log_scanned_meal(
    payload: str = Form(..., description="JSON-encoded ScanLogCreate"),
    image: UploadFile | None = File(default=None),
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_admin),
):
    """Log confirmed foods as a meal for the authenticated user and store the optional scan photo."""
    try:
        body = ScanLogCreate.model_validate_json(payload)
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=exc.errors(include_url=False, include_context=False)) from exc

    image_bytes = await read_image(image) if image is not None else None

    try:
        items, unmatched = scan_service.resolve_food_items(supabase, body)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Food lookup failed.") from exc

    if unmatched:
        raise HTTPException(
            status_code=422,
            detail=f"Not in our food database: {', '.join(unmatched)}",
        )

    try:
        meal_id = scan_service.log_meal(supabase, user_id, body, items)
        nutrients = scan_service.summarize_nutrients(supabase, items)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Failed to log meal.") from exc

    image_path = None
    if image_bytes is not None and image is not None:
        image_path = scan_service.save_meal_image(
            supabase, user_id, meal_id, image_bytes, image.content_type or ""
        )

    return {"meal_id": meal_id, "items": items, "nutrients": nutrients, "image_path": image_path}