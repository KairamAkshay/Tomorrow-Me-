"""Reports API — aggregates all analysis types from MongoDB into a unified view."""

from fastapi import APIRouter, Depends
from bson import ObjectId
from pydantic import BaseModel
from typing import Any, Optional

from app.core.dependencies import get_current_user
from app.database import get_database

router = APIRouter(prefix="/reports", tags=["Reports"])


class ReportItem(BaseModel):
    """A unified report item from any module."""

    id: str
    type: str  # "simulation" | "reality_check" | "mind_assessment"
    title: str
    summary: str
    score: Optional[int] = None
    data: dict[str, Any]
    created_at: str


class ReportsListResponse(BaseModel):
    """List of all reports."""

    reports: list[ReportItem]
    total: int


@router.get("/", response_model=ReportsListResponse)
async def list_all_reports(
    current_user: dict = Depends(get_current_user),
):
    """List all reports from all collections, ordered by date."""
    db = get_database()
    user_id = current_user["_id"]
    reports: list[ReportItem] = []

    # 1. Simulations
    sim_cursor = db.simulations.find({"user_id": user_id}).sort("created_at", -1)
    simulations = await sim_cursor.to_list(length=100)
    for sim in simulations:
        choices = sim.get("choices", [])
        choices_text = ", ".join(choices) if choices else "N/A"
        rec = sim.get("recommendation")
        reports.append(ReportItem(
            id=str(sim["_id"]),
            type="simulation",
            title=f"Future Simulation: {choices_text[:60]}",
            summary=sim.get("situation", "")[:120] + ("..." if len(sim.get("situation", "")) > 120 else ""),
            score=rec.get("confidence") if isinstance(rec, dict) else None,
            data={
                "situation": sim.get("situation"),
                "goal": sim.get("goal"),
                "choices": choices,
                "timelines": sim.get("timelines", []),
                "recommendation": rec,
            },
            created_at=sim["created_at"].isoformat() if hasattr(sim["created_at"], "isoformat") else str(sim["created_at"]),
        ))

    # 2. Decision Reports (Reality Checks)
    reality_cursor = db.decision_reports.find({"user_id": user_id}).sort("created_at", -1)
    reality_checks = await reality_cursor.to_list(length=100)
    for check in reality_checks:
        c_type = check.get("content_type", "advice")
        content = check.get("content", "")
        reports.append(ReportItem(
            id=str(check["_id"]),
            type="reality_check",
            title=f"Reality Check: {c_type.replace('_', ' ').title()}",
            summary=content[:120] + ("..." if len(content) > 120 else ""),
            score=check.get("overall_score"),
            data=check.get("analysis", {}),
            created_at=check["created_at"].isoformat() if hasattr(check["created_at"], "isoformat") else str(check["created_at"]),
        ))

    # 3. Mind Mirror Results
    mind_cursor = db.mind_mirror_results.find({"user_id": user_id}).sort("created_at", -1)
    mind_results = await mind_cursor.to_list(length=100)
    for assessment in mind_results:
        f_score = assessment.get("focus_score", 50)
        b_risk = assessment.get("burnout_risk", 50)
        d_ready = assessment.get("decision_readiness", 50)
        reports.append(ReportItem(
            id=str(assessment["_id"]),
            type="mind_assessment",
            title="Mind Mirror Assessment",
            summary=f"Focus: {f_score} | Burnout Risk: {b_risk} | Decision Ready: {d_ready}",
            score=f_score,
            data=assessment.get("analysis", {}),
            created_at=assessment["created_at"].isoformat() if hasattr(assessment["created_at"], "isoformat") else str(assessment["created_at"]),
        ))

    # Sort all reports descending by created_at
    reports.sort(key=lambda r: r.created_at, reverse=True)

    return ReportsListResponse(reports=reports, total=len(reports))
