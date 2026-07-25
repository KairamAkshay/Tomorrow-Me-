"""Reports API — aggregates all analysis types into a unified report view."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.modules.auth.models import User
from app.modules.simulator.models import Simulation
from app.modules.reality.models import RealityCheck
from app.modules.mind.models import MindAssessment

from pydantic import BaseModel
from datetime import datetime
from typing import Any, Optional

router = APIRouter(prefix="/reports", tags=["Reports"])


class ReportItem(BaseModel):
    """A unified report item from any module."""

    id: int
    type: str  # "simulation" | "reality_check" | "mind_assessment"
    title: str
    summary: str
    score: Optional[int] = None
    data: dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}


class ReportsListResponse(BaseModel):
    """List of all reports."""

    reports: list[ReportItem]
    total: int


@router.get("/", response_model=ReportsListResponse)
def list_all_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all reports from all modules, ordered by date."""
    reports: list[ReportItem] = []

    # Simulations
    simulations = (
        db.query(Simulation)
        .filter(Simulation.user_id == current_user.id)
        .all()
    )
    for sim in simulations:
        choices_text = ", ".join(sim.choices) if sim.choices else "N/A"
        reports.append(ReportItem(
            id=sim.id,
            type="simulation",
            title=f"Future Simulation: {choices_text[:60]}",
            summary=sim.situation[:120] + ("..." if len(sim.situation) > 120 else ""),
            score=sim.recommendation.get("confidence") if sim.recommendation else None,
            data={
                "situation": sim.situation,
                "goal": sim.goal,
                "choices": sim.choices,
                "timelines": sim.timelines,
                "recommendation": sim.recommendation,
            },
            created_at=sim.created_at,
        ))

    # Reality Checks
    checks = (
        db.query(RealityCheck)
        .filter(RealityCheck.user_id == current_user.id)
        .all()
    )
    for check in checks:
        reports.append(ReportItem(
            id=check.id,
            type="reality_check",
            title=f"Reality Check: {check.content_type.replace('_', ' ').title()}",
            summary=check.content[:120] + ("..." if len(check.content) > 120 else ""),
            score=check.overall_score,
            data=check.analysis,
            created_at=check.created_at,
        ))

    # Mind Assessments
    assessments = (
        db.query(MindAssessment)
        .filter(MindAssessment.user_id == current_user.id)
        .all()
    )
    for assessment in assessments:
        reports.append(ReportItem(
            id=assessment.id,
            type="mind_assessment",
            title="Mind Mirror Assessment",
            summary=f"Focus: {assessment.focus_score} | Burnout Risk: {assessment.burnout_risk} | Decision Ready: {assessment.decision_readiness}",
            score=assessment.focus_score,
            data=assessment.analysis,
            created_at=assessment.created_at,
        ))

    # Sort by date (newest first)
    reports.sort(key=lambda r: r.created_at, reverse=True)

    return ReportsListResponse(reports=reports, total=len(reports))
