"""Reality Check business logic service — MongoDB version."""

import logging
from bson import ObjectId

from app.ai.reality_agent import reality_agent
from app.core.exceptions import NotFoundError
from app.core.serializers import now_utc
from app.database import get_database
from app.modules.reality.schemas import RealityCheckRequest, RealityCheckResponse

logger = logging.getLogger(__name__)


def _check_response(doc: dict) -> RealityCheckResponse:
    """Build RealityCheckResponse from MongoDB document."""
    return RealityCheckResponse(
        id=str(doc["_id"]),
        content=doc["content"],
        content_type=doc["content_type"],
        analysis=doc["analysis"],
        overall_score=doc["overall_score"],
        created_at=doc["created_at"].isoformat(),
    )


class RealityService:
    """Handles reality check analysis."""

    def __init__(self):
        self.db = get_database()

    async def analyze(self, user_id: str, data: RealityCheckRequest) -> RealityCheckResponse:
        """Run a reality check on the provided content."""
        logger.info(f"Running reality check for user {user_id}: {data.content_type}")

        analysis = reality_agent.analyze(
            content=data.content,
            content_type=data.content_type.value,
        )

        overall_score = analysis.get("overall_score", 50)
        now = now_utc()

        doc = {
            "user_id": ObjectId(user_id),
            "content": data.content,
            "content_type": data.content_type.value,
            "analysis": analysis,
            "overall_score": overall_score,
            "created_at": now,
            "updated_at": now,
        }

        result = await self.db.decision_reports.insert_one(doc)
        doc["_id"] = result.inserted_id

        return _check_response(doc)

    async def get_check(self, user_id: str, check_id: str) -> RealityCheckResponse:
        """Get a specific reality check."""
        try:
            doc = await self.db.decision_reports.find_one({
                "_id": ObjectId(check_id),
                "user_id": ObjectId(user_id),
            })
        except Exception:
            raise NotFoundError("Reality check not found")

        if not doc:
            raise NotFoundError("Reality check not found")
        return _check_response(doc)

    async def list_checks(self, user_id: str) -> list[RealityCheckResponse]:
        """List all reality checks for a user."""
        cursor = self.db.decision_reports.find(
            {"user_id": ObjectId(user_id)}
        ).sort("created_at", -1)
        docs = await cursor.to_list(length=100)
        return [_check_response(doc) for doc in docs]

    async def delete_check(self, user_id: str, check_id: str) -> None:
        """Delete a reality check."""
        try:
            result = await self.db.decision_reports.delete_one({
                "_id": ObjectId(check_id),
                "user_id": ObjectId(user_id),
            })
        except Exception:
            raise NotFoundError("Reality check not found")

        if result.deleted_count == 0:
            raise NotFoundError("Reality check not found")
