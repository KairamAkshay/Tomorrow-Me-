"""Simulator database models — MongoDB documents (no ORM model needed).

Simulation document schema:
{
    "_id": ObjectId,
    "user_id": ObjectId,
    "situation": str,
    "goal": str,
    "choices": list[str],
    "timelines": list[dict],
    "recommendation": dict | None,
    "created_at": datetime,
    "updated_at": datetime,
}
"""
