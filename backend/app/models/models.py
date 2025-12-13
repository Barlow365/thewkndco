from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    JSON,
    String,
    Table,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base

# Association table linking weekend packages to events
package_events = Table(
    "package_events",
    Base.metadata,
    Column("package_id", String, ForeignKey("packages.id"), primary_key=True),
    Column("event_id", String, ForeignKey("events.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    is_active = Column(Boolean, default=True)


class Agent(Base):
    __tablename__ = "agents"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    display_name = Column(String, nullable=False)
    user = relationship("User")


class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=True)


class Event(Base):
    __tablename__ = "events"
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    city = Column(String, nullable=False)
    venue = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    price = Column(Float, nullable=False)
    tags = Column(JSON, nullable=True)
    packages = relationship("Package", secondary=package_events, back_populates="events")


class Lodging(Base):
    __tablename__ = "lodgings"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    packages = relationship("Package", back_populates="lodging")


class Package(Base):
    __tablename__ = "packages"
    id = Column(String, primary_key=True)
    lodging_id = Column(String, ForeignKey("lodgings.id"), nullable=True)
    status = Column(String, default="draft", nullable=False)
    addons = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lodging = relationship("Lodging", back_populates="packages")
    events = relationship("Event", secondary=package_events, back_populates="packages")
    bookings = relationship("Booking", back_populates="package")
    messages = relationship("Message", back_populates="package")


class Booking(Base):
    __tablename__ = "bookings"
    id = Column(String, primary_key=True)
    package_id = Column(String, ForeignKey("packages.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    payment_token = Column(String, nullable=False)
    status = Column(String, default="pending", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    package = relationship("Package", back_populates="bookings")
    user = relationship("User")


class Message(Base):
    __tablename__ = "messages"
    id = Column(String, primary_key=True)
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(String, ForeignKey("users.id"), nullable=False)
    package_id = Column(String, ForeignKey("packages.id"), nullable=True)
    message_text = Column(String, nullable=False)
    attachment_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    package = relationship("Package", back_populates="messages")
