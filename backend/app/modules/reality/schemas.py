"""Reality Check request/response schemas."""

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class ContentType(str, Enum):
    """Supported content types for reality check."""

    ADVICE = "advice"
    TWEET = "tweet"
    LINKEDIN_POST = "linkedin_post"
    INSTAGRAM_CAPTION = "instagram_caption"
    ARTICLE = "article"
    OTHER = "other"


class RealityCheckRequest(BaseModel):
    """Request to run a reality check."""

    content: str = Field(..., min_length=10, max_length=5000, description="Content to analyze")
    content_type: ContentType = Field(..., description="Type of content")


class RealityCheckResponse(BaseModel):
    """Reality check analysis response."""

    id: int
    content: str
    content_type: str
    analysis: dict[str, Any]
    overall_score: int
    created_at: datetime

    model_config = {"from_attributes": True}
