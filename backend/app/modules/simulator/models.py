"""Simulator database models."""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text

from app.database import Base


class Simulation(Base):
    """Stores a complete simulation analysis."""

    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    situation = Column(Text, nullable=False)
    goal = Column(Text, nullable=False)
    choices = Column(JSON, nullable=False)  # List of choice strings
    timelines = Column(JSON, nullable=False)  # List of timeline results
    recommendation = Column(JSON, nullable=True)  # Judge agent output
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
