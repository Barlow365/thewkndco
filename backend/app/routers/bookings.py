from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import Booking, Package, User
from app.schemas.models import BookingCreate, BookingOut

router = APIRouter()


def _ensure_user(db: Session, user_id: str) -> User:
    user = db.get(User, user_id)
    if not user:
        user = User(id=user_id, name=f"User {user_id}", email=f"{user_id}@example.com")
        db.add(user)
    return user


@router.post("", response_model=BookingOut)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    package = db.get(Package, payload.package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")

    _ensure_user(db, payload.user_id)

    booking = Booking(
        id=str(uuid4()),
        package_id=payload.package_id,
        user_id=payload.user_id,
        payment_token=payload.payment_token,
        status="confirmed",
    )
    db.add(booking)
    db.flush()
    db.refresh(booking)
    return booking
