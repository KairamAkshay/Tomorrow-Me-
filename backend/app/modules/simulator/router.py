"""Simulator API endpoints — MongoDB version."""

from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.core.rate_limiter import ai_rate_limiter
from app.modules.simulator.schemas import SimulationRequest, SimulationResponse
from app.modules.simulator.service import SimulatorService

router = APIRouter(prefix="/simulator", tags=["Future Simulator"])


@router.post("/run", response_model=SimulationResponse, status_code=201)
async def run_simulation(
    data: SimulationRequest,
    current_user: dict = Depends(get_current_user),
):
    """Run a new future simulation."""
    user_id = str(current_user["_id"])
    ai_rate_limiter.check(user_id)
    service = SimulatorService()
    return await service.run_simulation(user_id, data)


@router.get("/", response_model=list[SimulationResponse])
async def list_simulations(
    current_user: dict = Depends(get_current_user),
):
    """List all simulations for the current user."""
    user_id = str(current_user["_id"])
    service = SimulatorService()
    return await service.list_simulations(user_id)


@router.get("/{simulation_id}", response_model=SimulationResponse)
async def get_simulation(
    simulation_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get a specific simulation."""
    user_id = str(current_user["_id"])
    service = SimulatorService()
    return await service.get_simulation(user_id, simulation_id)


@router.delete("/{simulation_id}", status_code=204)
async def delete_simulation(
    simulation_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a simulation."""
    user_id = str(current_user["_id"])
    service = SimulatorService()
    await service.delete_simulation(user_id, simulation_id)
