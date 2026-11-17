"""Reality Check database models — MongoDB documents.

RealityCheck document schema:
{
    "_id": ObjectId,
    "user_id": ObjectId,
    "content": str,
    "content_type": str,
    "analysis": dict,
    "overall_score": int,
    "created_at": datetime,
    "updated_at": datetime,
}
"""
