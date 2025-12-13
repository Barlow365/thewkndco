import datetime

from app.db.session import SessionLocal, engine
from app.models.base import Base
from app.models.models import Event, Lodging, Package


def seed():
    """
    Minimal seed to make discovery pages non-empty.
    """
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    events = [
        Event(
            id="event-concert",
            title="Skyline Rooftop Concert",
            city="Los Angeles",
            venue="Downtown Loft",
            date=datetime.date(2025, 12, 24),
            price=120.0,
            tags=["live-music", "rooftop", "vip"],
            source="seed",
            external_url="https://example.com/events/skyline",
        ),
        Event(
            id="event-comedy",
            title="Late Night Comedy",
            city="New York",
            venue="Laugh Club",
            date=datetime.date(2025, 12, 25),
            price=75.0,
            tags=["comedy", "downtown"],
            source="seed",
            external_url="https://example.com/events/comedy",
        ),
    ]

    lodgings = [
        Lodging(
            id="lodging-01",
            name="City Hotel",
            location="New York",
            price=220.0,
            source="seed",
            external_url="https://example.com/lodgings/city-hotel",
        ),
        Lodging(
            id="lodging-02",
            name="Beach Bungalow",
            location="Los Angeles",
            price=320.0,
            source="seed",
            external_url="https://example.com/lodgings/beach-bungalow",
        ),
    ]

    for event in events:
        db.merge(event)
    for lodging in lodgings:
        db.merge(lodging)

    pkg = Package(
        id="package-demo",
        lodging_id=lodgings[0].id,
        status="active",
        total_price=499.0,
        markup_percentage=0.15,
    )
    pkg.events = events
    db.merge(pkg)

    db.commit()
    db.close()


if __name__ == "__main__":
    seed()
