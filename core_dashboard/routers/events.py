from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core_dashboard.database import get_db
from core_dashboard.models.event import Event
from core_dashboard.models.user import User  # Add this import
from core_dashboard.schemas.event import EventCreate, EventOut
from core_dashboard.utils.security import get_current_user, require_role

router = APIRouter(prefix="/events", tags=["events"])


@router.post("/", response_model=EventOut)
def create_event(
    event: EventCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Add role-based access control if needed
    require_role(current_user, ["researcher", "admin"])
    
    new_event = Event(
        source=event.source,
        category=event.category,
        severity=event.severity,
        message=event.message,
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event


@router.get("/", response_model=list[EventOut])
def list_events(
    skip: int = 0, 
    limit: int = 50, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Optional: add auth for listing too
):
    return db.query(Event).offset(skip).limit(limit).all()