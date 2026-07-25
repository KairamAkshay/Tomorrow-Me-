"""Reality Agent — analyzes content for credibility and bias."""

import random
from typing import Any

from app.ai.base_agent import BaseAgent
from app.ai.prompts import REALITY_AGENT_PROMPT


class RealityAgent(BaseAgent):
    """Analyzes content credibility, bias, and evidence quality."""

    def get_prompt(self, **kwargs) -> str:
        return REALITY_AGENT_PROMPT.format(
            content_type=kwargs["content_type"],
            content=kwargs["content"],
        )

    def get_fallback_response(self, **kwargs) -> dict[str, Any]:
        """Demo fallback for reality check analysis."""
        content_type = kwargs.get("content_type", "content")
        content = kwargs.get("content", "")
        snippet = content[:80] + "..." if len(content) > 80 else content

        overall = random.randint(45, 75)
        return {
            "overall_score": overall,
            "summary": (
                f"This {content_type} presents claims that are partially supported "
                f"by available evidence. While some points are valid, there are notable "
                f"biases and assumptions that should be considered before acting on this advice."
            ),
            "scores": {
                "credibility": random.randint(40, 80),
                "evidence_quality": random.randint(30, 70),
                "bias_level": random.randint(30, 70),
                "hidden_assumptions": random.randint(35, 75),
                "practicality": random.randint(40, 80),
                "risk_level": random.randint(25, 65),
                "suitability_for_gen_z": random.randint(45, 85),
            },
            "explanations": {
                "credibility": (
                    "The source makes several claims without citing specific data or research. "
                    "While the general direction may be accurate, the specifics need verification."
                ),
                "evidence_quality": (
                    "Limited empirical evidence is provided. The claims rely heavily on "
                    "anecdotal reasoning and generalizations rather than concrete data."
                ),
                "bias_level": (
                    "There's a noticeable survivorship bias — focusing on success stories "
                    "while overlooking the many who followed similar advice without success."
                ),
                "hidden_assumptions": (
                    "Assumes access to certain resources, networks, or starting conditions "
                    "that not everyone has. Does not account for systemic barriers."
                ),
                "practicality": (
                    "Some suggestions are actionable, but others are vague or require "
                    "significant resources to implement effectively."
                ),
                "risk_level": (
                    "Following this advice carries moderate risk. The downside of acting on "
                    "unverified claims could lead to wasted time or missed opportunities."
                ),
                "suitability_for_gen_z": (
                    "The advice is somewhat relevant to young adults but doesn't fully "
                    "account for current economic conditions and career landscapes."
                ),
            },
            "red_flags": [
                "Lacks specific data sources or citations",
                "Uses emotionally charged language to persuade rather than inform",
            ],
            "strengths": [
                "Addresses a relevant topic that many people care about",
                "Provides some actionable starting points for further research",
            ],
            "recommendation": (
                "Treat this as a starting point for further research, not as definitive guidance. "
                "Verify the core claims independently and consider your specific circumstances "
                "before making decisions based on this content."
            ),
        }


reality_agent = RealityAgent()
