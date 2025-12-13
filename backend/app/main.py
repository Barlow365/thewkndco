from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import engine
from app.models.base import Base
from app.routers import admin, bookings, edge, messages, packages

# Ensure metadata is available (migrations are preferred for production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PartyWKND API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(packages.router, prefix=f"{settings.api_prefix}/packages", tags=["Packages"])
app.include_router(messages.router, prefix=f"{settings.api_prefix}/messages", tags=["Messages"])
app.include_router(bookings.router, prefix=f"{settings.api_prefix}/bookings", tags=["Bookings"])
app.include_router(admin.router, prefix=f"{settings.api_prefix}/admin", tags=["Admin"])
app.include_router(edge.router, prefix=f"{settings.api_prefix}", tags=["Edge Cases"])


@app.get("/health")
def healthcheck():
    return {"status": "ok"}
