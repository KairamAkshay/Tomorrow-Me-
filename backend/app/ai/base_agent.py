"""Base agent class for AI interactions."""

import json
import logging
from abc import ABC, abstractmethod
from typing import Any, Optional

from openai import OpenAI

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class BaseAgent(ABC):
    """Abstract base class for all AI agents."""

    def __init__(self):
        self.client: Optional[OpenAI] = None
        if settings.ai_available:
            self.client = OpenAI(
                api_key=settings.AI_API_KEY,
                base_url=settings.AI_BASE_URL,
            )

    @abstractmethod
    def get_prompt(self, **kwargs) -> str:
        """Build the prompt for this agent."""
        pass

    @abstractmethod
    def get_fallback_response(self, **kwargs) -> dict[str, Any]:
        """Return a fallback response when AI is unavailable."""
        pass

    def analyze(self, **kwargs) -> dict[str, Any]:
        """Run the agent analysis. Uses AI if available, fallback otherwise."""
        if not self.client:
            logger.warning(
                f"{self.__class__.__name__}: AI unavailable, using fallback"
            )
            return self.get_fallback_response(**kwargs)

        prompt = self.get_prompt(**kwargs)

        try:
            response = self.client.chat.completions.create(
                model=settings.AI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful AI analyst. Always respond with valid JSON only. No markdown, no code blocks, just raw JSON.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=2000,
            )

            content = response.choices[0].message.content.strip()

            # Clean up response — strip markdown code blocks if present
            if content.startswith("```"):
                content = content.split("\n", 1)[1]  # Remove first line
                if content.endswith("```"):
                    content = content[:-3]
                content = content.strip()

            return json.loads(content)

        except json.JSONDecodeError as e:
            logger.error(f"{self.__class__.__name__}: JSON parse error: {e}")
            return self.get_fallback_response(**kwargs)
        except Exception as e:
            logger.error(f"{self.__class__.__name__}: AI call failed: {e}")
            return self.get_fallback_response(**kwargs)
