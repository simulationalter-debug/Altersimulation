import type { Action, ActionImpact, DecisionAppliedEvent, Goal, TuningConstants } from "./types";
import { DEFAULT_TUNING } from "./types";
import { computeCurrentValue, paceRatio, projectedRate, requiredRate, timelinePctRaw } from "./trajectory";
import { computeDaysToTarget } from "./payload";

interface PerGoalShift {
  goalId: string;
  timelinePctBefore: number;
  timelinePctAfter: number;
  timelinePctChange: number;
  daysToTargetBefore: number;
  daysToTargetAfter: number;
  timeShiftDays: number;
}

/**
 * Applies a decision's deltas to every goal it touches. Per §4's worked
 * example, the *current* projected rate is held constant on both sides of
 * the comparison — a decision changes current_value, not the trend, so
 * the shift it produces is attributable to the decision alone (and
 * therefore user-auditable, "how did we work this out?").
 */
export function computePerGoalShifts(
  goals: Goal[],
  actions: Action[],
  impacts: ActionImpact[],
  asOfIso: string,
  tuning: TuningConstants = DEFAULT_TUNING,
): PerGoalShift[] {
  const byGoalId = new Map(goals.map((g) => [g.goalId, g]));
  const impactsByGoal = new Map<string, number>();
  for (const impact of impacts) {
    impactsByGoal.set(impact.goalId, (impactsByGoal.get(impact.goalId) ?? 0) + impact.delta);
  }

  const shifts: PerGoalShift[] = [];
  for (const [goalId, delta] of impactsByGoal) {
    const goal = byGoalId.get(goalId);
    if (!goal) continue;

    const rate = projectedRate(goal, actions, asOfIso, tuning);
    const currentBefore = computeCurrentValue(goal, actions, asOfIso);
    const currentAfter = currentBefore + delta;

    const requiredBefore = requiredRate(goal, currentBefore, asOfIso);
    const requiredAfter = requiredRate(goal, currentAfter, asOfIso);

    const pctBefore = timelinePctRaw(paceRatio(rate, requiredBefore), tuning);
    const pctAfter = timelinePctRaw(paceRatio(rate, requiredAfter), tuning);

    const daysBefore = computeDaysToTarget(goal, currentBefore, rate);
    const daysAfter = computeDaysToTarget(goal, currentAfter, rate);
    const finite = (n: number) => (Number.isFinite(n) ? n : 0);

    shifts.push({
      goalId,
      timelinePctBefore: pctBefore,
      timelinePctAfter: pctAfter,
      timelinePctChange: pctAfter - pctBefore,
      daysToTargetBefore: finite(daysBefore),
      daysToTargetAfter: finite(daysAfter),
      timeShiftDays: finite(daysBefore) - finite(daysAfter),
    });
  }
  return shifts;
}

/**
 * Builds the emitted `decision_applied` event (§4): the goal with the
 * largest |timeline_pct_change| becomes the headline; every other
 * affected goal becomes a tradeoff line, mirroring the worked example's
 * "house_deposit... tradeoffs: [travel_2026]" shape.
 */
export function applyDecisionEvent(
  goals: Goal[],
  actions: Action[],
  impacts: ActionImpact[],
  asOfIso: string,
  tuning: TuningConstants = DEFAULT_TUNING,
): DecisionAppliedEvent {
  const shifts = computePerGoalShifts(goals, actions, impacts, asOfIso, tuning);
  if (shifts.length === 0) {
    return { event: "decision_applied", goal: "", timeShiftDays: 0, timelinePctChange: 0, tradeoffs: [] };
  }
  const primary = [...shifts].sort(
    (a, b) => Math.abs(b.timelinePctChange) - Math.abs(a.timelinePctChange),
  )[0];
  const tradeoffs = shifts
    .filter((s) => s.goalId !== primary.goalId)
    .map((s) => ({ goal: s.goalId, timelinePctChange: Math.round(s.timelinePctChange * 10) / 10 }));

  return {
    event: "decision_applied",
    goal: primary.goalId,
    timeShiftDays: Math.round(primary.timeShiftDays),
    timelinePctChange: Math.round(primary.timelinePctChange * 10) / 10,
    tradeoffs,
  };
}
