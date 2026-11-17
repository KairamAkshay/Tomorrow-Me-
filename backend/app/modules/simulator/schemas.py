"""Simulator request/response schemas."""

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class SimulationRequest(BaseModel):
    """Request to run a future simulation."""

    situation: str = Field(..., min_length=10, max_length=2000, description="Current situation description")
    goal: str = Field(..., min_length=5, max_length=500, description="What you want to achieve")
    choices: list[str] = Field(..., min_length=2, max_length=5, description="Possible choices to simulate")


class SimulationResponse(BaseModel):
    """Complete simulation response."""

    id: str
    situation: str
    goal: str
    choices: list[str]
    timelines: list[dict[str, Any]]
    recommendation: Optional[dict[str, Any]] = None
    created_at: str
