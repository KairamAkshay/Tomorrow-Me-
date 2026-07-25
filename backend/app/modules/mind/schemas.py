"""Mind Mirror request/response schemas."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class MindAssessmentRequest(BaseModel):
    """Request to run a mind mirror assessment."""

    sleep: float = Field(..., ge=0, le=24, description="Hours of sleep per night")
    screen_time: float = Field(..., ge=0, le=24, description="Hours of screen time per day")
    study_hours: float = Field(..., ge=0, le=24, description="Hours of study/work per day")
    exercise: int = Field(..., ge=0, le=300, description="Minutes of exercise per day")
    stress: int = Field(..., ge=1, le=10, description="Stress level (1-10)")
    mood: int = Field(..., ge=1, le=10, description="Mood level (1-10)")


class MindAssessmentResponse(BaseModel):
    """Mind mirror assessment response."""

    id: int
    sleep: float
    screen_time: float
    study_hours: float
    exercise: int
    stress: int
    mood: int
    analysis: dict[str, Any]
    focus_score: int
    burnout_risk: int
    decision_readiness: int
    attention_health: int
    created_at: datetime

    model_config = {"from_attributes": True}
