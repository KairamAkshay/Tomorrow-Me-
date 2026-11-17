"""Auth API endpoints — MongoDB version."""

from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.modules.auth.schemas import (
    ForgotPasswordRequest,
    MessageResponse,
    ResetPasswordRequest,
    TokenResponse,
    UpdateProfileRequest,
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.modules.auth.service import AuthService, _user_response

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: UserRegister):
    """Register a new user account."""
    service = AuthService()
    user, token = await service.register(data)
    return TokenResponse(
        access_token=token,
        user=_user_response(user),
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    """Login with email and password."""
    service = AuthService()
    user, token = await service.login(data)
    return TokenResponse(
        access_token=token,
        user=_user_response(user),
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout the current user (client-side token invalidation)."""
    return MessageResponse(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get the current authenticated user."""
    service = AuthService()
    return await service.get_profile(current_user)


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    """Request a password reset token."""
    service = AuthService()
    return await service.forgot_password(data)


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(data: ResetPasswordRequest):
    """Reset password using a valid reset token."""
    service = AuthService()
    result = await service.reset_password(data)
    return MessageResponse(message=result["message"])


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    data: UpdateProfileRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update user profile information."""
    service = AuthService()
    return await service.update_profile(current_user, data)
