"""
Supabase dependencies for the API

Provides a cached Supabase client for service-to-service operations.
"""

from __future__ import annotations

from functools import lru_cache

from supabase import Client, create_client

from app.api.core.config import get_settings


@lru_cache
def get_supabase_admin() -> Client:
    """
    Supabase client using the service role key
    """
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_role_key)