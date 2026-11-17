"""MongoDB serialization helpers for safe JSON responses."""

from bson import ObjectId
from datetime import datetime, timezone
from typing import Any


def serialize_doc(doc: dict | None) -> dict | None:
    """Convert MongoDB document to JSON-safe dict.
    
    Converts ObjectId to string and ensures datetime fields are present.
    """
    if doc is None:
        return None
    result = {}
    for key, value in doc.items():
        if key == "_id":
            result["id"] = str(value)
        elif isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, list):
            result[key] = [serialize_doc(v) if isinstance(v, dict) else v for v in value]
        elif isinstance(value, dict):
            result[key] = serialize_doc(value)
        else:
            result[key] = value
    return result


def serialize_docs(docs: list[dict]) -> list[dict]:
    """Convert a list of MongoDB documents to JSON-safe dicts."""
    return [serialize_doc(doc) for doc in docs if doc is not None]


def now_utc() -> datetime:
    """Return current UTC datetime."""
    return datetime.now(timezone.utc)
