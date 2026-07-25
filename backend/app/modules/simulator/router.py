"""Simulator API endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.rate_limiter import ai_rate_limiter
from app.database import get_db
from app.modules.auth.models import User
from app.modules.simulator.schemas import SimulationRequest, SimulationResponse
from app.modules.simulator.service import SimulatorService

router = APIRouter(prefix="/simulator", tags=["Future Simulator"])


@router.post("/run", response_model=SimulationResponse, status_code=201)
def run_simulation(
    data: SimulationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Run a new future simulation."""
    ai_rate_limiter.check(str(current_user.id))
    service = SimulatorService(db)
    simulation = service.run_simulation(current_user.id, data)
    return SimulationResponse.model_validate(simulation)


@router.get("/", response_model=list[SimulationResponse])
def list_simulations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all simulations for the current user."""
    service = SimulatorService(db)
    simulations = service.list_simulations(current_user.id)
    return [SimulationResponse.model_validate(s) for s in simulations]


@router.get("/{simulation_id}", response_model=SimulationResponse)
def get_simulation(
    simulation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific simulation."""
    service = SimulatorService(db)
    simulation = service.get_simulation(current_user.id, simulation_id)
    return SimulationResponse.model_validate(simulation)


@router.delete("/{simulation_id}", status_code=204)
def delete_simulation(
    simulation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a simulation."""
    service = SimulatorService(db)
    service.delete_simulation(current_user.id, simulation_id)
