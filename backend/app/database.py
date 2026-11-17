"""MongoDB database connection and initialization using Motor (async PyMongo)."""

import logging
import certifi
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import IndexModel, ASCENDING
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# Global client and database references — initialized once at startup
_client: AsyncIOMotorClient | None = None
_database: AsyncIOMotorDatabase | None = None


async def connect_db() -> None:
    """Initialize the MongoDB connection and create indexes."""
    global _client, _database

    logger.info(f"Connecting to MongoDB: {settings.DATABASE_NAME}")
    _client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
    )
    _database = _client[settings.DATABASE_NAME]

    # Verify connectivity
    try:
        await _client.admin.command("ping")
        logger.info("MongoDB connection established successfully")
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error(f"MongoDB connection failed: {e}")
        raise

    # Create indexes
    await _create_indexes()


async def _create_indexes() -> None:
    """Create database indexes for all collections."""
    db = get_database()

    # Users collection indexes (unique email index)
    await db.users.create_indexes([
        IndexModel([("email", ASCENDING)], unique=True),
    ])

    # Simulations collection indexes
    await db.simulations.create_indexes([
        IndexModel([("user_id", ASCENDING)]),
        IndexModel([("created_at", ASCENDING)]),
    ])

    # Decision reports (reality checks) collection indexes
    await db.decision_reports.create_indexes([
        IndexModel([("user_id", ASCENDING)]),
        IndexModel([("created_at", ASCENDING)]),
    ])

    # Mind mirror results collection indexes
    await db.mind_mirror_results.create_indexes([
        IndexModel([("user_id", ASCENDING)]),
        IndexModel([("created_at", ASCENDING)]),
    ])

    # Password reset tokens
    await db.password_reset_tokens.create_indexes([
        IndexModel([("token", ASCENDING)], unique=True),
        IndexModel([("expires_at", ASCENDING)], expireAfterSeconds=0),
    ])

    logger.info("Database indexes created")


async def close_db() -> None:
    """Close the MongoDB connection."""
    global _client, _database
    if _client:
        _client.close()
        _client = None
        _database = None
        logger.info("MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    """Get the database instance. Raises RuntimeError if not connected."""
    if _database is None:
        raise RuntimeError("Database not initialized. Call connect_db() first.")
    return _database


async def check_health() -> dict:
    """Check MongoDB connection health."""
    try:
        if _client is None:
            return {"status": "disconnected", "error": "No client"}
        await _client.admin.command("ping")
        return {"status": "connected", "database": settings.DATABASE_NAME}
    except Exception as e:
        return {"status": "error", "error": str(e)}
