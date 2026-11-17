"""Simulator business logic — orchestrates Future Agent and Judge Agent (MongoDB version)."""

import logging
from bson import ObjectId

from app.ai.future_agent import future_agent
from app.ai.judge_agent import judge_agent
from app.core.exceptions import NotFoundError
from app.core.serializers import serialize_doc, now_utc
from app.database import get_database
from app.modules.simulator.schemas import SimulationRequest, SimulationResponse

logger = logging.getLogger(__name__)


def _sim_response(doc: dict) -> SimulationResponse:
    """Build SimulationResponse from MongoDB document."""
    return SimulationResponse(
        id=str(doc["_id"]),
        situation=doc["situation"],
        goal=doc["goal"],
        choices=doc["choices"],
        timelines=doc.get("timelines", []),
        recommendation=doc.get("recommendation"),
        created_at=doc["created_at"].isoformat(),
    )


class SimulatorService:
    """Orchestrates future simulation analysis."""

    def __init__(self):
        self.db = get_database()

    async def run_simulation(self, user_id: str, data: SimulationRequest) -> SimulationResponse:
        """Run a full future simulation for all choices."""
        logger.info(f"Running simulation for user {user_id}: {data.choices}")

        # Generate timeline for each choice
        timelines = []
        for choice in data.choices:
            timeline = future_agent.analyze(
                situation=data.situation,
                goal=data.goal,
                choice=choice,
            )
            timelines.append(timeline)

        # Get judge recommendation
        recommendation = judge_agent.analyze(
            context=f"Situation: {data.situation}\nGoal: {data.goal}\nChoices: {', '.join(data.choices)}",
            agent_outputs=timelines,
        )

        # Store in MongoDB
        now = now_utc()
        doc = {
            "user_id": ObjectId(user_id),
            "situation": data.situation,
            "goal": data.goal,
            "choices": data.choices,
            "timelines": timelines,
            "recommendation": recommendation,
            "created_at": now,
            "updated_at": now,
        }

        result = await self.db.simulations.insert_one(doc)
        doc["_id"] = result.inserted_id

        return _sim_response(doc)

    async def get_simulation(self, user_id: str, simulation_id: str) -> SimulationResponse:
        """Get a specific simulation by ID."""
        try:
            doc = await self.db.simulations.find_one({
                "_id": ObjectId(simulation_id),
                "user_id": ObjectId(user_id),
            })
        except Exception:
            raise NotFoundError("Simulation not found")

        if not doc:
            raise NotFoundError("Simulation not found")
        return _sim_response(doc)

    async def list_simulations(self, user_id: str) -> list[SimulationResponse]:
        """List all simulations for a user."""
        cursor = self.db.simulations.find(
            {"user_id": ObjectId(user_id)}
        ).sort("created_at", -1)
        docs = await cursor.to_list(length=100)
        return [_sim_response(doc) for doc in docs]

    async def delete_simulation(self, user_id: str, simulation_id: str) -> None:
        """Delete a simulation."""
        try:
            result = await self.db.simulations.delete_one({
                "_id": ObjectId(simulation_id),
                "user_id": ObjectId(user_id),
            })
        except Exception:
            raise NotFoundError("Simulation not found")

        if result.deleted_count == 0:
            raise NotFoundError("Simulation not found")
