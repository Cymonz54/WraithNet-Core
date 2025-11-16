from pydantic import BaseModel
from datetime import datetime

class EventBase(BaseModel):
    source: str
    category: str
    severity: str
    message: str

class EventCreate(EventBase):
    pass

class EventOut(EventBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True
