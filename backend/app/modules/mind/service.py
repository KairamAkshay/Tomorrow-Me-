"""Mind Mirror business logic service."""

import logging

from sqlalchemy.orm import Session

from app.ai.psychology_agent import psychology_agent
from app.core.exceptions import NotFoundError
from app.modules.mind.models import MindAssessment
from app.modules.mind.schemas import MindAssessmentRequest

logger = logging.getLogger(__name__)


class MindService:
    """Handles mind mirror wellness assessments."""

    def __init__(self, db: Session):
        self.db = db

    def assess(self, user_id: int, data: MindAssessmentRequest) -> MindAssessment:
        """Run a mind mirror assessment."""
        logger.info(f"Running mind assessment for user {user_id}")

        analysis = psychology_agent.analyze(
            sleep=data.sleep,
            screen_time=data.screen_time,
            study_hours=data.study_hours,
            exercise=data.exercise,
            stress=data.stress,
            mood=data.mood,
        )

        assessment = MindAssessment(
            user_id=user_id,
            sleep=data.sleep,
            screen_time=data.screen_time,
            study_hours=data.study_hours,
            exercise=data.exercise,
            stress=data.stress,
            mood=data.mood,
            analysis=analysis,
            focus_score=analysis.get("focus_score", 50),
            burnout_risk=analysis.get("burnout_risk", 50),
            decision_readiness=analysis.get("decision_readiness", 50),
            attention_health=analysis.get("attention_health", 50),
        )
        self.db.add(assessment)
        self.db.commit()
        self.db.refresh(assessment)

        return assessment

    def get_assessment(self, user_id: int, assessment_id: int) -> MindAssessment:
        """Get a specific assessment."""
        assessment = (
            self.db.query(MindAssessment)
            .filter(
                MindAssessment.id == assessment_id,
                MindAssessment.user_id == user_id,
            )
            .first()
        )
        if not assessment:
            raise NotFoundError("Assessment not found")
        return assessment

    def list_assessments(self, user_id: int) -> list[MindAssessment]:
        """List all assessments for a user."""
        return (
            self.db.query(MindAssessment)
            .filter(MindAssessment.user_id == user_id)
            .order_by(MindAssessment.created_at.desc())
            .all()
        )

    def delete_assessment(self, user_id: int, assessment_id: int) -> None:
        """Delete an assessment."""
        assessment = self.get_assessment(user_id, assessment_id)
        self.db.delete(assessment)
        self.db.commit()
