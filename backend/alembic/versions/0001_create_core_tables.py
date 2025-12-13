"""Create core PartyWKND tables

Revision ID: 0001_create_core_tables
Revises: 
Create Date: 2025-12-12
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import func


# revision identifiers, used by Alembic.
revision = "0001_create_core_tables"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False, unique=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.sql.expression.true()),
    )

    op.create_table(
        "agents",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("user_id", sa.String(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("display_name", sa.String(), nullable=False),
    )

    op.create_table(
        "admin_users",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("email", sa.String(), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=True),
    )

    op.create_table(
        "events",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("city", sa.String(), nullable=False),
        sa.Column("venue", sa.String(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("tags", sa.JSON(), nullable=True),
    )

    op.create_table(
        "lodgings",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("location", sa.String(), nullable=False),
        sa.Column("price", sa.Float(), nullable=False),
    )

    op.create_table(
        "packages",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("lodging_id", sa.String(), sa.ForeignKey("lodgings.id"), nullable=True),
        sa.Column("status", sa.String(), nullable=False, server_default="draft"),
        sa.Column("addons", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=func.now()),
    )

    op.create_table(
        "package_events",
        sa.Column("package_id", sa.String(), sa.ForeignKey("packages.id"), primary_key=True),
        sa.Column("event_id", sa.String(), sa.ForeignKey("events.id"), primary_key=True),
    )

    op.create_table(
        "bookings",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("package_id", sa.String(), sa.ForeignKey("packages.id"), nullable=False),
        sa.Column("user_id", sa.String(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("payment_token", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=func.now()),
    )

    op.create_table(
        "messages",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("sender_id", sa.String(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("receiver_id", sa.String(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("package_id", sa.String(), sa.ForeignKey("packages.id"), nullable=True),
        sa.Column("message_text", sa.String(), nullable=False),
        sa.Column("attachment_url", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=func.now()),
    )


def downgrade():
    op.drop_table("messages")
    op.drop_table("bookings")
    op.drop_table("package_events")
    op.drop_table("packages")
    op.drop_table("lodgings")
    op.drop_table("events")
    op.drop_table("admin_users")
    op.drop_table("agents")
    op.drop_table("users")
