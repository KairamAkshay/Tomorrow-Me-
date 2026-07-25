"""Auth business logic service."""

from sqlalchemy.orm import Session

from app.core.exceptions import BadRequestError, UnauthorizedError
from app.core.security import create_access_token, hash_password, verify_password
from app.modules.auth.models import User
from app.modules.auth.schemas import UserLogin, UserRegister


class AuthService:
    """Handles authentication business logic."""

    def __init__(self, db: Session):
        self.db = db

    def register(self, data: UserRegister) -> tuple[User, str]:
        """Register a new user. Returns (user, access_token)."""
        # Check if username exists
        if self.db.query(User).filter(User.username == data.username).first():
            raise BadRequestError("Username already taken")

        # Check if email exists
        if self.db.query(User).filter(User.email == data.email).first():
            raise BadRequestError("Email already registered")

        # Create user
        user = User(
            username=data.username,
            email=data.email,
            hashed_password=hash_password(data.password),
            full_name=data.full_name,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        # Generate token
        token = create_access_token(data={"sub": str(user.id)})
        return user, token

    def login(self, data: UserLogin) -> tuple[User, str]:
        """Authenticate a user. Returns (user, access_token)."""
        user = (
            self.db.query(User).filter(User.username == data.username).first()
        )

        if not user or not verify_password(data.password, user.hashed_password):
            raise UnauthorizedError("Invalid username or password")

        token = create_access_token(data={"sub": str(user.id)})
        return user, token
