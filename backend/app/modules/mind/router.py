"""Mind Mirror API endpoints — MongoDB version."""

from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.core.rate_limiter import ai_rate_limiter
from app.modules.mind.schemas import MindAssessmentRequest, MindAssessmentResponse
from app.modules.mind.service import MindService

router = APIRouter(prefix="/mind", tags=["Mind Mirror"])


@router.post("/assess", response_model=MindAssessmentResponse, status_code=201)
async def run_assessment(
    data: MindAssessmentRequest,
    current_user: dict = Depends(get_current_user),
):
    """Run a mind mirror assessment."""
    user_id = str(current_user["_id"])
    ai_rate_limiter.check(user_id)
    service = MindService()
    return await service.assess(user_id, data)


@router.get("/", response_model=list[MindAssessmentResponse])
async def list_assessments(
    current_user: dict = Depends(get_current_user),
):
    """List all mind assessments."""
    user_id = str(current_user["_id"])
    service = MindService()
    return await service.list_assessments(user_id)


@router.get("/{assessment_id}", response_model=MindAssessmentResponse)
async def get_assessment(
    assessment_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get a specific assessment."""
    user_id = str(current_user["_id"])
    service = MindService()
    return await service.get_assessment(user_id, assessment_id)


@router.delete("/{assessment_id}", status_code=204)
async def delete_assessment(
    assessment_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete an assessment."""
    user_id = str(current_user["_id"])
    service = MindService()
    await service.delete_assessment(user_id, assessment_id)
