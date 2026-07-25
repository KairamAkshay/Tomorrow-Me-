"""Simulator business logic — orchestrates Future Agent and Judge Agent."""

import logging

from sqlalchemy.orm import Session

from app.ai.future_agent import future_agent
from app.ai.judge_agent import judge_agent
from app.core.exceptions import NotFoundError
from app.modules.simulator.models import Simulation
from app.modules.simulator.schemas import SimulationRequest

logger = logging.getLogger(__name__)


class SimulatorService:
    """Orchestrates future simulation analysis."""

    def __init__(self, db: Session):
        self.db = db

    def run_simulation(self, user_id: int, data: SimulationRequest) -> Simulation:
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

        # Store in database
        simulation = Simulation(
            user_id=user_id,
            situation=data.situation,
            goal=data.goal,
            choices=data.choices,
            timelines=timelines,
            recommendation=recommendation,
        )
        self.db.add(simulation)
        self.db.commit()
        self.db.refresh(simulation)

        return simulation

    def get_simulation(self, user_id: int, simulation_id: int) -> Simulation:
        """Get a specific simulation by ID."""
        simulation = (
            self.db.query(Simulation)
            .filter(Simulation.id == simulation_id, Simulation.user_id == user_id)
            .first()
        )
        if not simulation:
            raise NotFoundError("Simulation not found")
        return simulation

    def list_simulations(self, user_id: int) -> list[Simulation]:
        """List all simulations for a user."""
        return (
            self.db.query(Simulation)
            .filter(Simulation.user_id == user_id)
            .order_by(Simulation.created_at.desc())
            .all()
        )

    def delete_simulation(self, user_id: int, simulation_id: int) -> None:
        """Delete a simulation."""
        simulation = self.get_simulation(user_id, simulation_id)
        self.db.delete(simulation)
        self.db.commit()
