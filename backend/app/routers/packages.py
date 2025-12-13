from typing import List

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import Event, Lodging, Package
from app.schemas.models import PackageOut, PackageUpdate

router = APIRouter()


def _fetch_events(db: Session, event_ids: List[str]) -> List[Event]:
    if not event_ids:
        return []
    events = db.query(Event).filter(Event.id.in_(event_ids)).all()
    if len(events) != len(event_ids):
        raise HTTPException(status_code=404, detail="One or more events not found")
    return events


@router.put("/{package_id}", response_model=PackageOut)
def update_package(
    package_id: str = Path(...),
    payload: PackageUpdate = None,
    db: Session = Depends(get_db),
):
    package = db.get(Package, package_id)
    if not package:
        package = Package(id=package_id, status="draft")
        db.add(package)

    if payload and payload.lodging_id:
        lodging = db.get(Lodging, payload.lodging_id)
        if not lodging:
            raise HTTPException(status_code=404, detail="Lodging not found")
        package.lodging = lodging

    if payload:
        package.events = _fetch_events(db, payload.event_ids)
        package.addons = payload.addons

    db.add(package)
    db.flush()
    db.refresh(package)
    return package
