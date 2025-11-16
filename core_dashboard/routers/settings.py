# core_dashboard/routers/settings.py
from fastapi import APIRouter

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("/")
async def get_settings():
    return {
        "firewall_enabled": True,
        "auto_updates": True,
        "version": "1.0.3",
        "last_patch": "2025-09-27",
    }
