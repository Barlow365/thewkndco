from fastapi import APIRouter, Path
from pydantic import BaseModel

router = APIRouter()

class ChangeRequest(BaseModel):
    notes: str

@router.post("/packages/{id}/change-request")
def request_change(id: str, payload: ChangeRequest):
    return {"status": "change_requested", "package_id": id, "notes": payload.notes}

@router.post("/bookings/{id}/cancel")
def cancel_booking(id: str):
    return {"status": "cancelled", "booking_id": id}
