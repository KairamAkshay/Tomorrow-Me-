"""Reality Check API endpoints — MongoDB version."""

from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.core.rate_limiter import ai_rate_limiter
from app.modules.reality.schemas import RealityCheckRequest, RealityCheckResponse
from app.modules.reality.service import RealityService

router = APIRouter(prefix="/reality", tags=["Reality Check"])


@router.post("/analyze", response_model=RealityCheckResponse, status_code=201)
async def analyze_content(
    data: RealityCheckRequest,
    current_user: dict = Depends(get_current_user),
):
    """Run a reality check on content."""
    user_id = str(current_user["_id"])
    ai_rate_limiter.check(user_id)
    service = RealityService()
    return await service.analyze(user_id, data)


@router.get("/", response_model=list[RealityCheckResponse])
async def list_checks(
    current_user: dict = Depends(get_current_user),
):
    """List all reality checks."""
    user_id = str(current_user["_id"])
    service = RealityService()
    return await service.list_checks(user_id)


@router.get("/{check_id}", response_model=RealityCheckResponse)
async def get_check(
    check_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get a specific reality check."""
    user_id = str(current_user["_id"])
    service = RealityService()
    return await service.get_check(user_id, check_id)


@router.delete("/{check_id}", status_code=204)
async def delete_check(
    check_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a reality check."""
    user_id = str(current_user["_id"])
    service = RealityService()
    await service.delete_check(user_id, check_id)
