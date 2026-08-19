import type { Goal, TuningConstants } from "./types";
import { DEFAULT_TUNING } from "./types";
import { addDays, daysBetween } from "./dailySeries";
import { percentile } from "./ewma";
import { replayTimeline, type DailyTimelinePoint } from "./trajectory";

interface GhostDayPoint {
  date: string;
  rate: number;
  currentValue: number;
  floorRate: number;
}

/**
 * Ghost You's per-day rate and running value, computed in a single
 * forward pass from goal creation to `asOfIso` (§3).
 *
 * - Days 0–27 ("cold start"): Ghost's rate is fixed at the onboarding
 *   baseline — this is why onboarding has to capture real numbers, not
 *   vibes (§3.1).
 * - Day 28+ ("warm"): rate blends a slowly-revisable "floor" (seeded at
 *   the onboarding baseline) with the 25th-percentile weekly rate
 *   observed so far, 40/60. Ghost never improves from a single good
 *   week — the floor only rises after `ghostFloorRevisionWeeks`
 *   consecutive weeks beat it, giving the "even your bad weeks beat your
 *   old normal" payoff described in §3 point 3.
 */
export function computeGhostSeries(
  goal: Goal,
  asOfIso: string,
  tuning: TuningConstants = DEFAULT_TUNING,
): GhostDayPoint[] {
  const totalDays = Math.max(0, daysBetween(goal.createdAt, asOfIso));
  const points: GhostDayPoint[] = [];

  let floorRate = goal.onboardingDailyRate;
  let consecutiveImprovedWeeks = 0;
  let improvedWeekRates: number[] = [];
  const weekRatesToDate: number[] = [];

  let weekBuffer: number[] = [];
  let currentValue = goal.baseline;

  for (let i = 0; i <= totalDays; i++) {
    const day = addDays(goal.createdAt, i);
    const isWarm = i >= 28;

    let rate: number;
    if (!isWarm) {
      rate = goal.onboardingDailyRate;
    } else {
      const worstQuartile =
        weekRatesToDate.length > 0 ? percentile(weekRatesToDate, 0.25) : goal.onboardingDailyRate;
      rate =
        tuning.ghostOnboardingWeight * floorRate +
        tuning.ghostWorstQuartileWeight * worstQuartile;
    }

    currentValue += rate;
    points.push({ date: day, rate, currentValue, floorRate });

    // Ghost's own trajectory (not the user's real actions) is what feeds
    // the weekly-rate history — Ghost's "worst weeks" are relative to its
    // own drift, per the "you on autopilot" framing in §3.
    weekBuffer.push(rate);
    if (weekBuffer.length === 7) {
      const weekRate = weekBuffer.reduce((a, b) => a + b, 0) / 7;
      weekRatesToDate.push(weekRate);
      if (weekRate > floorRate) {
        consecutiveImprovedWeeks += 1;
        improvedWeekRates.push(weekRate);
      } else {
        consecutiveImprovedWeeks = 0;
        improvedWeekRates = [];
      }
      if (consecutiveImprovedWeeks >= tuning.ghostFloorRevisionWeeks) {
        floorRate = improvedWeekRates.reduce((a, b) => a + b, 0) / improvedWeekRates.length;
        consecutiveImprovedWeeks = 0;
        improvedWeekRates = [];
      }
      weekBuffer = [];
    }
  }

  return points;
}

export function computeGoalGhostTimeline(
  goal: Goal,
  asOfIso: string,
  tuning: TuningConstants = DEFAULT_TUNING,
): DailyTimelinePoint[] {
  const series = computeGhostSeries(goal, asOfIso, tuning);
  const byDate = new Map(series.map((p) => [p.date, p]));
  const fallback = series[series.length - 1] ?? {
    rate: goal.onboardingDailyRate,
    currentValue: goal.baseline,
  };

  return replayTimeline(
    goal,
    asOfIso,
    (day) => byDate.get(day)?.rate ?? fallback.rate,
    (day) => byDate.get(day)?.currentValue ?? fallback.currentValue,
    tuning,
  );
}
