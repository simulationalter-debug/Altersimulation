import type { Action, Goal, TuningConstants } from "./types";
import { DEFAULT_TUNING, type GoalPayload } from "./types";
import { computeCurrentValue, computeGoalFutureTimeline, daysRemaining, paceRatio, projectedRate, requiredRate } from "./trajectory";
import { computeGoalGhostTimeline } from "./ghost";

export function computeDaysToTarget(goal: Goal, currentValue: number, rate: number): number {
  if (rate <= 0) return Infinity;
  return Math.max(0, (goal.target - currentValue) / rate);
}

/**
 * The full per-goal payload the UI (and eventually the LLM voice layer,
 * §9) reads from — every number a user sees should trace back to this.
 */
export function computeGoalPayload(
  goal: Goal,
  actions: Action[],
  asOfIso: string,
  tuning: TuningConstants = DEFAULT_TUNING,
): GoalPayload {
  const currentValue = computeCurrentValue(goal, actions, asOfIso);
  const rate = projectedRate(goal, actions, asOfIso, tuning);
  const required = requiredRate(goal, currentValue, asOfIso);
  const ratio = paceRatio(rate, required);

  const futureTimeline = computeGoalFutureTimeline(goal, actions, asOfIso, tuning);
  const ghostTimeline = computeGoalGhostTimeline(goal, asOfIso, tuning);

  const timelinePct = futureTimeline[futureTimeline.length - 1]?.displayed ?? 50;
  const ghostTimelinePct = ghostTimeline[ghostTimeline.length - 1]?.displayed ?? 50;

  return {
    goalId: goal.goalId,
    category: goal.category,
    label: goal.label,
    timelinePct,
    ghostTimelinePct,
    ghostGap: timelinePct - ghostTimelinePct,
    paceRatio: ratio,
    daysToTarget: computeDaysToTarget(goal, currentValue, rate),
    daysRemaining: daysRemaining(goal, asOfIso),
    onPace: ratio >= 1,
  };
}
