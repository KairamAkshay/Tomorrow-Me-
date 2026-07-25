"""Reality Check API endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.rate_limiter import ai_rate_limiter
from app.database import get_db
from app.modules.auth.models import User
from app.modules.reality.schemas import RealityCheckRequest, RealityCheckResponse
from app.modules.reality.service import RealityService

router = APIRouter(prefix="/reality", tags=["Reality Check"])


@router.post("/analyze", response_model=RealityCheckResponse, status_code=201)
def analyze_content(
    data: RealityCheckRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Run a reality check on content."""
    ai_rate_limiter.check(str(current_user.id))
    service = RealityService(db)
    check = service.analyze(current_user.id, data)
    return RealityCheckResponse.model_validate(check)


@router.get("/", response_model=list[RealityCheckResponse])
def list_checks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all reality checks."""
    service = RealityService(db)
    checks = service.list_checks(current_user.id)
    return [RealityCheckResponse.model_validate(c) for c in checks]


@router.get("/{check_id}", response_model=RealityCheckResponse)
def get_check(
    check_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific reality check."""
    service = RealityService(db)
    check = service.get_check(current_user.id, check_id)
    return RealityCheckResponse.model_validate(check)


@router.delete("/{check_id}", status_code=204)
def delete_check(
    check_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a reality check."""
    service = RealityService(db)
    service.delete_check(current_user.id, check_id)
