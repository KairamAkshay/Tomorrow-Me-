"""Psychology Agent — analyzes lifestyle inputs for mental wellness insights."""

from typing import Any

from app.ai.base_agent import BaseAgent
from app.ai.prompts import PSYCHOLOGY_AGENT_PROMPT


class PsychologyAgent(BaseAgent):
    """Analyzes lifestyle data and generates wellness insights."""

    def get_prompt(self, **kwargs) -> str:
        return PSYCHOLOGY_AGENT_PROMPT.format(
            sleep=kwargs["sleep"],
            screen_time=kwargs["screen_time"],
            study_hours=kwargs["study_hours"],
            exercise=kwargs["exercise"],
            stress=kwargs["stress"],
            mood=kwargs["mood"],
        )

    def get_fallback_response(self, **kwargs) -> dict[str, Any]:
        """Evidence-based demo fallback using actual input values."""
        sleep = kwargs.get("sleep", 7)
        screen_time = kwargs.get("screen_time", 6)
        study_hours = kwargs.get("study_hours", 5)
        exercise = kwargs.get("exercise", 30)
        stress = kwargs.get("stress", 5)
        mood = kwargs.get("mood", 6)

        # Calculate scores based on actual inputs
        sleep_factor = min(100, max(0, (sleep - 4) * 20))  # 4-9 hours
        exercise_factor = min(100, max(0, exercise * 1.5))  # 0-60+ min
        screen_factor = max(0, 100 - (screen_time - 2) * 12)  # 2-10 hours
        stress_factor = max(0, 100 - stress * 10)
        mood_factor = mood * 10

        focus_score = int(
            (sleep_factor * 0.3 + screen_factor * 0.3 + stress_factor * 0.2 + mood_factor * 0.2)
        )
        burnout_risk = int(
            100 - (sleep_factor * 0.25 + stress_factor * 0.35 + exercise_factor * 0.2 + mood_factor * 0.2)
        )
        decision_readiness = int(
            (sleep_factor * 0.3 + stress_factor * 0.3 + mood_factor * 0.25 + exercise_factor * 0.15)
        )
        attention_health = int(
            (screen_factor * 0.35 + sleep_factor * 0.25 + exercise_factor * 0.2 + stress_factor * 0.2)
        )
        overall = int((focus_score + (100 - burnout_risk) + decision_readiness + attention_health) / 4)

        # Clamp all scores
        focus_score = max(10, min(95, focus_score))
        burnout_risk = max(10, min(95, burnout_risk))
        decision_readiness = max(10, min(95, decision_readiness))
        attention_health = max(10, min(95, attention_health))
        overall = max(10, min(95, overall))

        recommendations = []
        positive_habits = []
        warning_signs = []

        if sleep < 7:
            recommendations.append({
                "area": "Sleep",
                "suggestion": f"You're getting {sleep} hours — aim for 7-9 hours. Try setting a consistent bedtime and avoiding screens 30 minutes before sleep.",
                "priority": "high",
            })
            warning_signs.append("Sleep deficit is affecting cognitive performance and emotional regulation")
        else:
            positive_habits.append(f"Good sleep duration at {sleep} hours — this supports clear thinking")

        if screen_time > 6:
            recommendations.append({
                "area": "Screen Time",
                "suggestion": f"At {screen_time} hours daily, consider the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.",
                "priority": "high",
            })
            warning_signs.append("Extended screen time may be contributing to attention fragmentation")
        else:
            positive_habits.append("Screen time is within healthy ranges for your age group")

        if exercise < 30:
            recommendations.append({
                "area": "Physical Activity",
                "suggestion": f"At {exercise} minutes daily, even a 10-minute walk can improve focus and mood. Start small and build consistency.",
                "priority": "medium",
            })
        else:
            positive_habits.append(f"Regular exercise at {exercise} minutes daily — excellent for mental clarity")

        if stress > 6:
            recommendations.append({
                "area": "Stress Management",
                "suggestion": "High stress levels detected. Try box breathing (4-4-4-4) or a 5-minute mindfulness break between tasks.",
                "priority": "high",
            })
            warning_signs.append("Elevated stress is reducing decision-making capacity")
        else:
            positive_habits.append("Stress levels are manageable — keep your current coping strategies")

        # Ensure at least 4 recommendations
        if len(recommendations) < 4:
            recommendations.append({
                "area": "Decision Timing",
                "suggestion": "Schedule important decisions for your peak energy hours — typically mid-morning for most people.",
                "priority": "low",
            })

        if not positive_habits:
            positive_habits.append("You're taking the step to track your wellness — that's a strong starting point")
        if not warning_signs:
            warning_signs.append("No major warning signs detected — maintain your current habits")

        return {
            "focus_score": focus_score,
            "burnout_risk": burnout_risk,
            "decision_readiness": decision_readiness,
            "attention_health": attention_health,
            "overall_wellness": overall,
            "analysis": {
                "focus_score": f"Based on your sleep ({sleep}h), screen time ({screen_time}h), and stress ({stress}/10), your ability to maintain deep focus is {'strong' if focus_score > 65 else 'moderate' if focus_score > 40 else 'challenged'}.",
                "burnout_risk": f"Your combination of stress ({stress}/10), sleep ({sleep}h), and exercise ({exercise}min) puts your burnout risk at {'low' if burnout_risk < 40 else 'moderate' if burnout_risk < 65 else 'elevated'} levels.",
                "decision_readiness": f"With your current mood ({mood}/10) and stress levels, you're {'well-positioned' if decision_readiness > 65 else 'moderately ready' if decision_readiness > 40 else 'not in the best state'} to make important decisions.",
                "attention_health": f"Screen time ({screen_time}h) and sleep quality are the biggest factors. Your attention health is {'good' if attention_health > 65 else 'fair' if attention_health > 40 else 'needs improvement'}.",
            },
            "recommendations": recommendations[:4],
            "positive_habits": positive_habits,
            "warning_signs": warning_signs,
        }


psychology_agent = PsychologyAgent()
