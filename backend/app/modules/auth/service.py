"""Auth business logic service — MongoDB version."""

import logging
from datetime import datetime, timedelta, timezone

from bson import ObjectId

from app.core.exceptions import BadRequestError, UnauthorizedError, NotFoundError
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
    generate_reset_token,
)
from app.core.serializers import serialize_doc, now_utc
from app.database import get_database
from app.modules.auth.schemas import (
    UserLogin,
    UserRegister,
    UserResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UpdateProfileRequest,
)
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def _user_response(user: dict) -> UserResponse:
    """Build a UserResponse from a MongoDB user document."""
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user.get("full_name", ""),
        created_at=user["created_at"].isoformat() if isinstance(user["created_at"], datetime) else str(user["created_at"]),
    )


class AuthService:
    """Handles authentication business logic with MongoDB."""

    def __init__(self):
        self.db = get_database()

    async def register(self, data: UserRegister) -> tuple[dict, str]:
        """Register a new user. Returns (user_doc, access_token)."""
        normalized_email = data.email.lower().strip()

        # Check if email exists
        existing = await self.db.users.find_one({"email": normalized_email})
        if existing:
            raise BadRequestError("Email already registered")

        # Create user document
        now = now_utc()
        user_doc = {
            "email": normalized_email,
            "full_name": data.full_name.strip(),
            "hashed_password": hash_password(data.password),
            "created_at": now,
            "updated_at": now,
        }

        result = await self.db.users.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id

        # Generate token
        token = create_access_token(data={"sub": str(result.inserted_id)})
        return user_doc, token

    async def login(self, data: UserLogin) -> tuple[dict, str]:
        """Authenticate a user. Returns (user_doc, access_token)."""
        normalized_email = data.email.lower().strip()
        user = await self.db.users.find_one({"email": normalized_email})

        if not user or not verify_password(data.password, user["hashed_password"]):
            raise UnauthorizedError("Invalid email or password")

        token = create_access_token(data={"sub": str(user["_id"])})
        return user, token

    async def forgot_password(self, data: ForgotPasswordRequest) -> dict:
        """Generate a password reset token."""
        normalized_email = data.email.lower().strip()
        user = await self.db.users.find_one({"email": normalized_email})

        # Always return success to avoid email enumeration
        if not user:
            logger.warning(f"Forgot password requested for non-existent email: {normalized_email}")
            return {"message": "If an account exists with this email, a reset link has been generated."}

        reset_token = generate_reset_token()
        expires_at = now_utc() + timedelta(minutes=settings.RESET_TOKEN_EXPIRE_MINUTES)

        await self.db.password_reset_tokens.insert_one({
            "user_id": user["_id"],
            "token": reset_token,
            "expires_at": expires_at,
            "used": False,
            "created_at": now_utc(),
        })

        # In production, send reset email. For now, return the token (for dev/testing).
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        logger.info(f"Reset token generated for {normalized_email}: {reset_url}")

        return {
            "message": "If an account exists with this email, a reset link has been generated.",
            "reset_token": reset_token,  # Remove in production — only for dev/testing
            "reset_url": reset_url,
        }

    async def reset_password(self, data: ResetPasswordRequest) -> dict:
        """Reset password using a valid reset token."""
        token_doc = await self.db.password_reset_tokens.find_one({
            "token": data.token,
            "used": False,
        })

        if not token_doc:
            raise BadRequestError("Invalid or expired reset token")

        # Normalizing expires_at to compare safely with now_utc
        token_expires = token_doc["expires_at"]
        if token_expires.tzinfo is None:
            token_expires = token_expires.replace(tzinfo=timezone.utc)

        if token_expires < now_utc():
            raise BadRequestError("Reset token has expired")

        # Update password
        new_hash = hash_password(data.new_password)
        await self.db.users.update_one(
            {"_id": token_doc["user_id"]},
            {"$set": {"hashed_password": new_hash, "updated_at": now_utc()}},
        )

        # Mark token as used
        await self.db.password_reset_tokens.update_one(
            {"_id": token_doc["_id"]},
            {"$set": {"used": True}},
        )

        return {"message": "Password reset successfully"}

    async def get_profile(self, user: dict) -> UserResponse:
        """Get user profile."""
        return _user_response(user)

    async def update_profile(self, user: dict, data: UpdateProfileRequest) -> UserResponse:
        """Update user profile."""
        update_fields = {"updated_at": now_utc()}

        if data.full_name is not None:
            update_fields["full_name"] = data.full_name.strip()

        if data.email is not None:
            normalized_email = data.email.lower().strip()
            if normalized_email != user["email"]:
                existing = await self.db.users.find_one({"email": normalized_email})
                if existing:
                    raise BadRequestError("Email already in use")
                update_fields["email"] = normalized_email

        await self.db.users.update_one(
            {"_id": user["_id"]},
            {"$set": update_fields},
        )

        updated_user = await self.db.users.find_one({"_id": user["_id"]})
        return _user_response(updated_user)
