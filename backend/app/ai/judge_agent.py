"""Judge Agent — synthesizes outputs from other agents into final recommendations."""

from typing import Any
import json

from app.ai.base_agent import BaseAgent
from app.ai.prompts import JUDGE_AGENT_PROMPT


class JudgeAgent(BaseAgent):
    """Combines outputs from all agents into a final verdict."""

    def get_prompt(self, **kwargs) -> str:
        return JUDGE_AGENT_PROMPT.format(
            context=kwargs["context"],
            agent_outputs=json.dumps(kwargs["agent_outputs"], indent=2),
        )

    def get_fallback_response(self, **kwargs) -> dict[str, Any]:
        """Synthesize a fallback recommendation from agent outputs."""
        agent_outputs = kwargs.get("agent_outputs", {})
        context = kwargs.get("context", "a life decision")

        # Try to extract the best option from agent outputs
        if isinstance(agent_outputs, list) and len(agent_outputs) > 0:
            # For simulator: pick the timeline with highest average score
            best_choice = None
            best_avg = 0
            for output in agent_outputs:
                scores = output.get("scores", {})
                if scores:
                    avg = sum(scores.values()) / len(scores) if scores else 0
                    if avg > best_avg:
                        best_avg = avg
                        best_choice = output.get("choice", "Option A")

            return {
                "verdict": f"Based on the analysis, '{best_choice}' shows the strongest overall potential.",
                "confidence": int(min(85, best_avg + 10)),
                "reasoning": (
                    f"After analyzing all options against your goals, '{best_choice}' "
                    f"scored highest across career growth, skill development, and opportunity "
                    f"metrics. While no path is without risk, this option provides the best "
                    f"balance of growth potential and stability for your situation."
                ),
                "recommendation": f"Consider moving forward with '{best_choice}' while staying open to pivoting if circumstances change significantly.",
                "next_steps": [
                    "Research this path more deeply — talk to 3-5 people who've taken it",
                    "Create a 90-day action plan with specific milestones",
                    "Identify your top 2-3 risks and create mitigation strategies",
                ],
                "caveats": [
                    "This analysis is based on general patterns — your specific circumstances may differ",
                    "External factors (market conditions, personal events) can significantly alter outcomes",
                ],
            }

        return {
            "verdict": "The analysis suggests proceeding with cautious optimism.",
            "confidence": 65,
            "reasoning": (
                "Based on the available data and analysis, the overall picture is moderately positive. "
                "There are both opportunities and risks to consider. The key is to stay informed "
                "and adaptable as circumstances evolve."
            ),
            "recommendation": "Take measured action while continuing to gather information and stay flexible.",
            "next_steps": [
                "Reflect on which option aligns most with your core values",
                "Seek input from trusted mentors or peers",
                "Set a decision deadline to avoid analysis paralysis",
            ],
            "caveats": [
                "AI analysis provides a framework for thinking, not definitive answers",
                "Personal circumstances and values should weigh heavily in your decision",
            ],
        }


judge_agent = JudgeAgent()
