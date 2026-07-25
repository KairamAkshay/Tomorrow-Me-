"""Future Agent — generates timeline simulations for life decisions."""

import random
from typing import Any

from app.ai.base_agent import BaseAgent
from app.ai.prompts import FUTURE_AGENT_PROMPT


class FutureAgent(BaseAgent):
    """Generates timeline simulations for each possible choice."""

    def get_prompt(self, **kwargs) -> str:
        return FUTURE_AGENT_PROMPT.format(
            situation=kwargs["situation"],
            goal=kwargs["goal"],
            choice=kwargs["choice"],
        )

    def get_fallback_response(self, **kwargs) -> dict[str, Any]:
        """Realistic demo fallback when AI is unavailable."""
        choice = kwargs.get("choice", "This choice")
        goal = kwargs.get("goal", "your goal")

        # Generate varied but realistic scores
        base = random.randint(55, 75)
        return {
            "choice": choice,
            "timeline_summary": (
                f"Choosing '{choice}' creates a path that builds steadily over 5 years. "
                f"This option aligns moderately well with your goal of {goal}, "
                f"offering a balance of growth and stability."
            ),
            "year_1": (
                f"You begin the transition into '{choice}'. The first year involves "
                f"significant adjustment and learning. Income may dip initially as you "
                f"invest in building new skills and connections."
            ),
            "year_2": (
                f"By year 2, you've established a foundation. Early results start showing — "
                f"your network expands, skills deepen, and you gain more clarity on your path."
            ),
            "year_3": (
                f"Year 3 marks a turning point. You've built enough expertise to take on "
                f"larger opportunities. Income stabilizes and begins growing meaningfully."
            ),
            "year_5": (
                f"By year 5, this path has matured. You have a strong professional identity, "
                f"valuable skills, and a network that opens doors. The early sacrifices "
                f"have compounded into tangible results."
            ),
            "scores": {
                "career_growth": min(100, base + random.randint(-10, 15)),
                "income_potential": min(100, base + random.randint(-15, 10)),
                "skill_development": min(100, base + random.randint(-5, 20)),
                "network_growth": min(100, base + random.randint(-10, 10)),
                "mental_wellbeing": min(100, base + random.randint(-20, 10)),
                "risk_level": min(100, random.randint(25, 65)),
                "opportunities": min(100, base + random.randint(-5, 15)),
                "confidence": min(100, base + random.randint(-10, 10)),
            },
            "key_risks": [
                "Initial income uncertainty during the transition period",
                "Potential skill gaps that need active investment to fill",
                "Market conditions could shift, affecting long-term projections",
            ],
            "key_opportunities": [
                "Strong skill development that compounds over time",
                "Growing professional network in the target field",
                "Positioning for emerging opportunities in the sector",
            ],
            "critical_milestones": [
                "Complete initial transition and onboarding (Month 3-6)",
                "Achieve first significant professional win (Year 1-2)",
                "Reach income parity or growth inflection point (Year 2-3)",
            ],
        }


future_agent = FutureAgent()
