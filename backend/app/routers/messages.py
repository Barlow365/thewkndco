from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import Message, Package, User
from app.schemas.models import MessageCreate, MessageOut

router = APIRouter()


def _ensure_user(db: Session, user_id: str) -> User:
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    user = db.get(User, user_id)
    if not user:
        # Create a lightweight placeholder user to satisfy FK constraints
        user = User(id=user_id, name=f"User {user_id}", email=f"{user_id}@example.com")
        db.add(user)
    return user


@router.post("", response_model=MessageOut)
def send_message(payload: MessageCreate, db: Session = Depends(get_db)):
    _ensure_user(db, payload.sender_id)
    _ensure_user(db, payload.receiver_id)

    if payload.package_id:
        package = db.get(Package, payload.package_id)
        if not package:
            raise HTTPException(status_code=404, detail="Package not found")

    message = Message(
        id=str(uuid4()),
        sender_id=payload.sender_id,
        receiver_id=payload.receiver_id,
        package_id=payload.package_id,
        message_text=payload.message_text,
        attachment_url=payload.attachment_url,
    )
    db.add(message)
    db.flush()
    db.refresh(message)
    return message
