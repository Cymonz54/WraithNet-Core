# core_dashboard/routers/telemetry.py
from fastapi import APIRouter, WebSocket
import asyncio
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])

@router.websocket("/ws")
async def telemetry_ws(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            now = datetime.utcnow()
            data = {
                "cpu": [{"time": (now - timedelta(minutes=i)).strftime("%H:%M"), "usage": random.randint(10, 90)} for i in range(10)],
                "memory": [{"time": (now - timedelta(minutes=i)).strftime("%H:%M"), "usage": random.randint(30, 95)} for i in range(10)],
            }
            await ws.send_json(data)
            await asyncio.sleep(2)
    except Exception as e:
        print("WebSocket disconnected:", e)
    finally:
        await ws.close()
