"""User model — MongoDB documents (no ORM model needed).

User document schema:
{
    "_id": ObjectId,
    "email": str (unique, lowercase),
    "full_name": str,
    "hashed_password": str,
    "created_at": datetime,
    "updated_at": datetime,
}
"""
