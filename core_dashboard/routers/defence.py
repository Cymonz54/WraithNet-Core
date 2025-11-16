# core_dashboard/routers/defense.py
from fastapi import APIRouter

router = APIRouter(prefix="/defense", tags=["Defense"])

@router.get("/")
async def get_defense():
    agents = [
        {"id": 1, "name": "Agent Alpha", "status": "online", "last_seen": "2m ago"},
        {"id": 2, "name": "Agent Beta", "status": "offline", "last_seen": "15m ago"},
        {"id": 3, "name": "Agent Gamma", "status": "online", "last_seen": "1m ago"},
    ]
    return {"count": len(agents), "agents": agents}
