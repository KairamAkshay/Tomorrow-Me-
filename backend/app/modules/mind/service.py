"""Mind Mirror business logic service — MongoDB version."""

import logging
from bson import ObjectId

from app.ai.psychology_agent import psychology_agent
from app.core.exceptions import NotFoundError
from app.core.serializers import now_utc
from app.database import get_database
from app.modules.mind.schemas import MindAssessmentRequest, MindAssessmentResponse

logger = logging.getLogger(__name__)


def _assess_response(doc: dict) -> MindAssessmentResponse:
    """Build MindAssessmentResponse from MongoDB document."""
    return MindAssessmentResponse(
        id=str(doc["_id"]),
        sleep=doc["sleep"],
        screen_time=doc["screen_time"],
        study_hours=doc["study_hours"],
        exercise=doc["exercise"],
        stress=doc["stress"],
        mood=doc["mood"],
        analysis=doc["analysis"],
        focus_score=doc["focus_score"],
        burnout_risk=doc["burnout_risk"],
        decision_readiness=doc["decision_readiness"],
        attention_health=doc["attention_health"],
        created_at=doc["created_at"].isoformat(),
    )


class MindService:
    """Handles mind mirror wellness assessments."""

    def __init__(self):
        self.db = get_database()

    async def assess(self, user_id: str, data: MindAssessmentRequest) -> MindAssessmentResponse:
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

        now = now_utc()
        doc = {
            "user_id": ObjectId(user_id),
            "sleep": data.sleep,
            "screen_time": data.screen_time,
            "study_hours": data.study_hours,
            "exercise": data.exercise,
            "stress": data.stress,
            "mood": data.mood,
            "analysis": analysis,
            "focus_score": analysis.get("focus_score", 50),
            "burnout_risk": analysis.get("burnout_risk", 50),
            "decision_readiness": analysis.get("decision_readiness", 50),
            "attention_health": analysis.get("attention_health", 50),
            "created_at": now,
            "updated_at": now,
        }

        result = await self.db.mind_mirror_results.insert_one(doc)
        doc["_id"] = result.inserted_id

        return _assess_response(doc)

    async def get_assessment(self, user_id: str, assessment_id: str) -> MindAssessmentResponse:
        """Get a specific assessment."""
        try:
            doc = await self.db.mind_mirror_results.find_one({
                "_id": ObjectId(assessment_id),
                "user_id": ObjectId(user_id),
            })
        except Exception:
            raise NotFoundError("Assessment not found")

        if not doc:
            raise NotFoundError("Assessment not found")
        return _assess_response(doc)

    async def list_assessments(self, user_id: str) -> list[MindAssessmentResponse]:
        """List all assessments for a user."""
        cursor = self.db.mind_mirror_results.find(
            {"user_id": ObjectId(user_id)}
        ).sort("created_at", -1)
        docs = await cursor.to_list(length=100)
        return [_assess_response(doc) for doc in docs]

    async def delete_assessment(self, user_id: str, assessment_id: str) -> None:
        """Delete an assessment."""
        try:
            result = await self.db.mind_mirror_results.delete_one({
                "_id": ObjectId(assessment_id),
                "user_id": ObjectId(user_id),
            })
        except Exception:
            raise NotFoundError("Assessment not found")

        if result.deleted_count == 0:
            raise NotFoundError("Assessment not found")
