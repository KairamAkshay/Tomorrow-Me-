"""Simple in-memory rate limiter using sliding window."""

import time
from collections import defaultdict

from app.config import get_settings
from app.core.exceptions import RateLimitError

settings = get_settings()


class RateLimiter:
    """Sliding window rate limiter stored in memory."""

    def __init__(
        self,
        max_requests: int = settings.RATE_LIMIT_REQUESTS,
        window_seconds: int = settings.RATE_LIMIT_WINDOW,
    ):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: dict[str, list[float]] = defaultdict(list)

    def check(self, key: str) -> None:
        """Check if the request is within rate limits. Raises RateLimitError if exceeded."""
        now = time.time()
        window_start = now - self.window_seconds

        # Remove expired entries
        self._requests[key] = [
            ts for ts in self._requests[key] if ts > window_start
        ]

        if len(self._requests[key]) >= self.max_requests:
            raise RateLimitError()

        self._requests[key].append(now)


# Global rate limiter instances
api_rate_limiter = RateLimiter()
ai_rate_limiter = RateLimiter(max_requests=10, window_seconds=60)
