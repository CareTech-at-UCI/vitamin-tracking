"""
Dashboard endpoints.
"""

from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.api.deps.supabase import get_supabase_admin
from app.api.schemas.dashboard import DashboardWeekResponse

router = APIRouter()


@router.get("/week", response_model=DashboardWeekResponse)
async def get_dashboard_week(
    anchor_date: date | None = Query(default=None),
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Get dashboard vitamin totals for past 7 days.
    """

    if anchor_date is None:
        anchor_date = datetime.utcnow().date()

    start_date = anchor_date - timedelta(days=6)

    try:
        # temporary placeholder response
        return {
            "dates": [],
            "days": [],
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Dashboard query failed: {exc}",
        ) from exc