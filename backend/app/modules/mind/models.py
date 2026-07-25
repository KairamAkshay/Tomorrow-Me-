"""Mind Mirror database models."""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON

from app.database import Base


class MindAssessment(Base):
    """Stores a mind mirror wellness assessment."""

    __tablename__ = "mind_assessments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    sleep = Column(Float, nullable=False)
    screen_time = Column(Float, nullable=False)
    study_hours = Column(Float, nullable=False)
    exercise = Column(Integer, nullable=False)
    stress = Column(Integer, nullable=False)
    mood = Column(Integer, nullable=False)
    analysis = Column(JSON, nullable=False)
    focus_score = Column(Integer, nullable=False)
    burnout_risk = Column(Integer, nullable=False)
    decision_readiness = Column(Integer, nullable=False)
    attention_health = Column(Integer, nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
