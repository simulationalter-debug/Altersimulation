import type { Goal } from "./types";

/**
 * §7 safety rails — engine-level so no prompt/UI variation can bypass
 * them.
 */

/**
 * Fitness goals are restricted to behavioural consistency (frequency),
 * never weight-loss rates, calorie targets, or body measurements. Call
 * this at goal creation; it throws rather than silently coercing so a
 * caller can't accidentally ship a body-composition target.
 */
export function assertFitnessGoalSafe(goal: Pick<Goal, "category" | "metricType">): void {
  if (goal.category === "fitness" && goal.metricType !== "frequency") {
    throw new Error(
      "Fitness goals must use metricType 'frequency' (sessions/consistency) — " +
        "weight-loss rates, calorie targets, and body measurements are not supported.",
    );
  }
}

export interface LowStateSignal {
  /** last N journal sentiment scores, -1..1, most recent last */
  recentSentiments: number[];
  /** days since the user last logged any action */
  daysSinceLastAction: number;
}

/**
 * True when journal sentiment has been persistently negative *and*
 * engagement has collapsed. When true, callers must: suppress Ghost You,
 * suppress streak-loss messaging, and switch Future You to a maintenance
 * tone. This flag lives here, not in a prompt, so it can't be varied away.
 */
export function detectLowState(signal: LowStateSignal): boolean {
  const { recentSentiments, daysSinceLastAction } = signal;
  if (recentSentiments.length < 3) return false;
  const avg = recentSentiments.reduce((a, b) => a + b, 0) / recentSentiments.length;
  const persistentlyNegative = avg < -0.3;
  const engagementCollapsed = daysSinceLastAction >= 5;
  return persistentlyNegative && engagementCollapsed;
}

/** Relationship missions are additive-only — never scoring or grading a partner. */
const FORBIDDEN_RELATIONSHIP_MISSION_TERMS = ["score", "grade", "rate your partner", "rank"];

export function assertRelationshipMissionSafe(label: string): void {
  const lower = label.toLowerCase();
  if (FORBIDDEN_RELATIONSHIP_MISSION_TERMS.some((term) => lower.includes(term))) {
    throw new Error(`Relationship missions must be additive-only, rejected: "${label}"`);
  }
}
