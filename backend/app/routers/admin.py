from datetime import date
from uuid import uuid4
from typing import List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import Event, Lodging
from app.schemas.models import EventOut, LodgingOut

router = APIRouter()


class EventCreate(BaseModel):
    id: Optional[str]
    title: str
    city: str
    venue: str
    date: date
    tags: List[str]
    price: float


class LodgingCreate(BaseModel):
    id: Optional[str]
    name: str
    location: str
    price: float


@router.post("/events", response_model=EventOut)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    event_id = event.id or str(uuid4())
    obj = Event(
        id=event_id,
        title=event.title,
        city=event.city,
        venue=event.venue,
        date=event.date,
        price=event.price,
        tags=event.tags,
    )
    db.merge(obj)
    db.flush()
    db.refresh(obj)
    return obj


@router.post("/lodgings", response_model=LodgingOut)
def create_lodging(lodging: LodgingCreate, db: Session = Depends(get_db)):
    lodging_id = lodging.id or str(uuid4())
    obj = Lodging(
        id=lodging_id,
        name=lodging.name,
        location=lodging.location,
        price=lodging.price,
    )
    db.merge(obj)
    db.flush()
    db.refresh(obj)
    return obj
