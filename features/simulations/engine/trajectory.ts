import type { Action, Goal, TuningConstants } from "./types";
import { DEFAULT_TUNING } from "./types";
import { addDays, buildDailyDeltaSeries, daysBetween, windowedDeltas } from "./dailySeries";
import { ewmaRate } from "./ewma";

/** current_value as of `asOfIso` = baseline + every logged delta for this goal to date (§1.1). */
export function computeCurrentValue(goal: Goal, actions: Action[], asOfIso: string): number {
  let value = goal.baseline;
  const asOf = new Date(asOfIso.slice(0, 10)).getTime();
  for (const action of actions) {
    if (new Date(action.timestamp.slice(0, 10)).getTime() > asOf) continue;
    for (const impact of action.impacts) {
      if (impact.goalId === goal.goalId) value += impact.delta;
    }
  }
  return value;
}

export function requiredRate(goal: Goal, currentValue: number, asOfIso: string): number {
  const remaining = Math.max(1, daysBetween(asOfIso, goal.deadline));
  return (goal.target - currentValue) / remaining;
}

export function daysRemaining(goal: Goal, asOfIso: string): number {
  return Math.max(0, daysBetween(asOfIso, goal.deadline));
}

/**
 * projected_rate / required_rate, per §2. Handles the edge cases the raw
 * formula doesn't: a goal already at/past target (required_rate ≈ 0), and
 * a projected rate moving in the wrong direction relative to what's
 * required — both are pushed toward the tanh curve's saturation points
 * rather than producing NaN/Infinity.
 */
export function paceRatio(projected: number, required: number): number {
  const EPS = 1e-6;
  if (Math.abs(required) < EPS) {
    return projected >= 0 ? 5 : -5;
  }
  return projected / required;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function timelinePctRaw(ratio: number, tuning: TuningConstants = DEFAULT_TUNING): number {
  const raw = 50 + 50 * Math.tanh(tuning.confidenceK * (ratio - 1));
  return clamp(raw, tuning.clampMin, tuning.clampMax);
}

/**
 * projected_rate (T_f) as of `asOfIso` — EWMA of this goal's daily deltas
 * over the tuning window, including zero-delta days (§1.3, §2).
 */
export function projectedRate(
  goal: Goal,
  actions: Action[],
  asOfIso: string,
  tuning: TuningConstants = DEFAULT_TUNING,
): number {
  const series = buildDailyDeltaSeries(actions, goal.goalId, goal.createdAt, asOfIso);
  // A goal only has as much history as it's old — cap the lookback so a
  // brand-new goal doesn't get its onboarding-seeded rate decayed through
  // 27 days of "phantom" pre-creation zeros on day one (see ewmaRate's seed
  // comment: that would silence every day-one decision/mission).
  const daysAlive = daysBetween(goal.createdAt, asOfIso) + 1;
  const effectiveWindow = Math.min(tuning.ewmaWindowDays, Math.max(1, daysAlive));
  const window = windowedDeltas(series, asOfIso, effectiveWindow);
  return ewmaRate(window, tuning.ewmaHalfLifeDays, goal.onboardingDailyRate);
}

export interface DailyTimelinePoint {
  date: string;
  raw: number;
  displayed: number;
}

/**
 * Replays every day from `goal.createdAt` to `asOfIso`, recomputing the
 * raw timeline_pct for that day from `rateAtDay`/`currentValueAtDay`, and
 * moving the displayed value toward it by at most `maxDailyMoveDisplayed`
 * points/day (§2 "Smoothing"). Future and Ghost both replay through this
 * same function with different rate sources — that's the "same model, two
 * behaviour parameter sets" design principle from §0.
 */
export function replayTimeline(
  goal: Goal,
  asOfIso: string,
  rateAtDay: (dayIso: string) => number,
  currentValueAtDay: (dayIso: string) => number,
  tuning: TuningConstants = DEFAULT_TUNING,
): DailyTimelinePoint[] {
  const totalDays = Math.max(0, daysBetween(goal.createdAt, asOfIso));
  const points: DailyTimelinePoint[] = [];
  let displayed = 50;

  for (let i = 0; i <= totalDays; i++) {
    const dayIso = addDays(goal.createdAt, i);
    const rate = rateAtDay(dayIso);
    const required = requiredRate(goal, currentValueAtDay(dayIso), dayIso);
    const ratio = paceRatio(rate, required);
    const raw = timelinePctRaw(ratio, tuning);
    displayed += clamp(raw - displayed, -tuning.maxDailyMoveDisplayed, tuning.maxDailyMoveDisplayed);
    points.push({ date: dayIso, raw, displayed });
  }
  return points;
}

/** Future You's daily timeline_pct series, driven entirely by real action history. */
export function computeGoalFutureTimeline(
  goal: Goal,
  actions: Action[],
  asOfIso: string,
  tuning: TuningConstants = DEFAULT_TUNING,
): DailyTimelinePoint[] {
  return replayTimeline(
    goal,
    asOfIso,
    (day) => projectedRate(goal, actions, day, tuning),
    (day) => computeCurrentValue(goal, actions, day),
    tuning,
  );
}
