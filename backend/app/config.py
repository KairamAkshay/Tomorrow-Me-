"""Application configuration via environment variables."""

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from functools import lru_cache
from typing import Any


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "Tomorrow Me"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False

    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "tomorrow_me_ai"

    # Security
    JWT_SECRET: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    RESET_TOKEN_EXPIRE_MINUTES: int = 30

    # AI Configuration
    GEMINI_API_KEY: str = ""
    AI_API_KEY: str = ""
    AI_BASE_URL: str = "https://generativelanguage.googleapis.com/v1beta/openai/"
    AI_MODEL: str = "gemini-2.0-flash"

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    FRONTEND_URL: str = "http://localhost:3000"

    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 60
    RATE_LIMIT_WINDOW: int = 60  # seconds

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, v: Any) -> bool:
        """Handle case where external env var sets DEBUG to non-boolean like 'WARN'."""
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.lower() in ("true", "1", "t", "yes", "y")
        return False

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins from comma-separated string."""
        if not self.CORS_ORIGINS or self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def ai_available(self) -> bool:
        """Check if any AI API key is configured."""
        key = self.GEMINI_API_KEY or self.AI_API_KEY
        return bool(key and key != "your-api-key-here")

    @property
    def effective_ai_key(self) -> str:
        """Return whichever AI key is set."""
        return self.GEMINI_API_KEY or self.AI_API_KEY

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
