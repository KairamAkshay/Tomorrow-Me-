"""Reality Check business logic service."""

import logging

from sqlalchemy.orm import Session

from app.ai.reality_agent import reality_agent
from app.core.exceptions import NotFoundError
from app.modules.reality.models import RealityCheck
from app.modules.reality.schemas import RealityCheckRequest

logger = logging.getLogger(__name__)


class RealityService:
    """Handles reality check analysis."""

    def __init__(self, db: Session):
        self.db = db

    def analyze(self, user_id: int, data: RealityCheckRequest) -> RealityCheck:
        """Run a reality check on the provided content."""
        logger.info(f"Running reality check for user {user_id}: {data.content_type}")

        analysis = reality_agent.analyze(
            content=data.content,
            content_type=data.content_type.value,
        )

        overall_score = analysis.get("overall_score", 50)

        check = RealityCheck(
            user_id=user_id,
            content=data.content,
            content_type=data.content_type.value,
            analysis=analysis,
            overall_score=overall_score,
        )
        self.db.add(check)
        self.db.commit()
        self.db.refresh(check)

        return check

    def get_check(self, user_id: int, check_id: int) -> RealityCheck:
        """Get a specific reality check."""
        check = (
            self.db.query(RealityCheck)
            .filter(RealityCheck.id == check_id, RealityCheck.user_id == user_id)
            .first()
        )
        if not check:
            raise NotFoundError("Reality check not found")
        return check

    def list_checks(self, user_id: int) -> list[RealityCheck]:
        """List all reality checks for a user."""
        return (
            self.db.query(RealityCheck)
            .filter(RealityCheck.user_id == user_id)
            .order_by(RealityCheck.created_at.desc())
            .all()
        )

    def delete_check(self, user_id: int, check_id: int) -> None:
        """Delete a reality check."""
        check = self.get_check(user_id, check_id)
        self.db.delete(check)
        self.db.commit()
