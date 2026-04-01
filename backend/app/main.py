from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.core.config import get_settings
from app.api.v1.router import router as v1_router

app = FastAPI()

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")