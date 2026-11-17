"""Mind Mirror database models — MongoDB documents.

MindAssessment document schema:
{
    "_id": ObjectId,
    "user_id": ObjectId,
    "sleep": float,
    "screen_time": float,
    "study_hours": float,
    "exercise": int,
    "stress": int,
    "mood": int,
    "analysis": dict,
    "focus_score": int,
    "burnout_risk": int,
    "decision_readiness": int,
    "attention_health": int,
    "created_at": datetime,
    "updated_at": datetime,
}
"""
