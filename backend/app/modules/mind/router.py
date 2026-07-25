"""Mind Mirror API endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.rate_limiter import ai_rate_limiter
from app.database import get_db
from app.modules.auth.models import User
from app.modules.mind.schemas import MindAssessmentRequest, MindAssessmentResponse
from app.modules.mind.service import MindService

router = APIRouter(prefix="/mind", tags=["Mind Mirror"])


@router.post("/assess", response_model=MindAssessmentResponse, status_code=201)
def run_assessment(
    data: MindAssessmentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Run a mind mirror assessment."""
    ai_rate_limiter.check(str(current_user.id))
    service = MindService(db)
    assessment = service.assess(current_user.id, data)
    return MindAssessmentResponse.model_validate(assessment)


@router.get("/", response_model=list[MindAssessmentResponse])
def list_assessments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all mind assessments."""
    service = MindService(db)
    assessments = service.list_assessments(current_user.id)
    return [MindAssessmentResponse.model_validate(a) for a in assessments]


@router.get("/{assessment_id}", response_model=MindAssessmentResponse)
def get_assessment(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific assessment."""
    service = MindService(db)
    assessment = service.get_assessment(current_user.id, assessment_id)
    return MindAssessmentResponse.model_validate(assessment)


@router.delete("/{assessment_id}", status_code=204)
def delete_assessment(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete an assessment."""
    service = MindService(db)
    service.delete_assessment(current_user.id, assessment_id)
