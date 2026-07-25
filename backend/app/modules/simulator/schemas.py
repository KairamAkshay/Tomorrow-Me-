"""Simulator request/response schemas."""

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class SimulationRequest(BaseModel):
    """Request to run a future simulation."""

    situation: str = Field(..., min_length=10, max_length=2000, description="Current situation description")
    goal: str = Field(..., min_length=5, max_length=500, description="What you want to achieve")
    choices: list[str] = Field(..., min_items=2, max_items=5, description="Possible choices to simulate")


class TimelineScores(BaseModel):
    """Scores for a single timeline."""

    career_growth: int = Field(ge=0, le=100)
    income_potential: int = Field(ge=0, le=100)
    skill_development: int = Field(ge=0, le=100)
    network_growth: int = Field(ge=0, le=100)
    mental_wellbeing: int = Field(ge=0, le=100)
    risk_level: int = Field(ge=0, le=100)
    opportunities: int = Field(ge=0, le=100)
    confidence: int = Field(ge=0, le=100)


class TimelineResult(BaseModel):
    """A single timeline simulation result."""

    choice: str
    timeline_summary: str
    year_1: str
    year_2: str
    year_3: str
    year_5: str
    scores: dict[str, int]
    key_risks: list[str]
    key_opportunities: list[str]
    critical_milestones: list[str]


class JudgeResult(BaseModel):
    """Judge agent's final recommendation."""

    verdict: str
    confidence: int
    reasoning: str
    recommendation: str
    next_steps: list[str]
    caveats: list[str]


class SimulationResponse(BaseModel):
    """Complete simulation response."""

    id: int
    situation: str
    goal: str
    choices: list[str]
    timelines: list[dict[str, Any]]
    recommendation: Optional[dict[str, Any]]
    created_at: datetime

    model_config = {"from_attributes": True}
