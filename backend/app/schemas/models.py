from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel


class EventOut(BaseModel):
    id: str
    title: str
    city: str
    venue: str
    date: date
    price: float
    tags: Optional[List[str]] = None

    class Config:
        orm_mode = True


class LodgingOut(BaseModel):
    id: str
    name: str
    location: str
    price: float

    class Config:
        orm_mode = True


class PackageUpdate(BaseModel):
    lodging_id: Optional[str]
    event_ids: List[str]
    addons: Optional[dict] = None


class PackageOut(BaseModel):
    id: str
    status: str
    addons: Optional[dict] = None
    created_at: Optional[datetime]
    lodging: Optional[LodgingOut]
    events: List[EventOut] = []

    class Config:
        orm_mode = True


class BookingCreate(BaseModel):
    package_id: str
    user_id: str
    payment_token: str


class BookingOut(BaseModel):
    id: str
    status: str
    package_id: str
    user_id: str
    created_at: Optional[datetime]

    class Config:
        orm_mode = True


class MessageCreate(BaseModel):
    sender_id: str
    receiver_id: str
    package_id: Optional[str]
    message_text: str
    attachment_url: Optional[str] = None


class MessageOut(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    package_id: Optional[str]
    message_text: str
    attachment_url: Optional[str] = None
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
