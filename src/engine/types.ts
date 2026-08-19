/**
 * ALTER Simulation Engine — core types, per spec v0.1 §1–§5, §10.
 *
 * The engine is a pure, deterministic module. It never calls an LLM and
 * never invents numbers — it is the single source of truth for every
 * number ALTER shows a user. An LLM ("voice layer") may only wrap this
 * engine's output in words; see §9.
 */

export type GoalCategory =
  | "financial"
  | "fitness"
  | "career"
  | "relationship"
  | "travel"
  | "lifestyle"
  | "confidence"
  | "family";

/**
 * `cumulative` — save toward a target (£10k saved).
 * `rate`       — sustain a per-period rate (£15k/month income).
 * `frequency`  — behavioural consistency (train 4x/week). Fitness goals
 *                are restricted to this type — see safety rails §7.
 * `milestone`  — staged/binary (get the job) — measured as % of stages done.
 */
export type MetricType = "cumulative" | "rate" | "frequency" | "milestone";

export interface GoalStage {
  id: string;
  label: string;
  /** value current_value takes on when this stage completes */
  completionValue: number;
  done: boolean;
}

export interface Goal {
  goalId: string;
  category: GoalCategory;
  metricType: MetricType;
  label: string;
  /** value at goal creation */
  baseline: number;
  /** value required by deadline */
  target: number;
  deadline: string; // ISO date
  createdAt: string; // ISO date
  currentValue: number;
  /** 0–1, user-assigned importance; drives mission generation priority */
  weight: number;
  /**
   * Ghost's onboarding-seeded daily rate for this goal — captured at
   * onboarding as "what happens to this number if you change nothing."
   * This is what makes onboarding Ghost You's training data (§3.1).
   */
  onboardingDailyRate: number;
  stages?: GoalStage[];
  status: "active" | "completed" | "abandoned";
}

export type DeltaType = "direct" | "behavioural";

export interface ActionImpact {
  goalId: string;
  delta: number;
  deltaType: DeltaType;
}

export type ActionSource =
  | "mission_completed"
  | "decision_made"
  | "manual_log"
  | "journal_extracted";

export interface Action {
  actionId: string;
  timestamp: string; // ISO datetime
  source: ActionSource;
  impacts: ActionImpact[];
  /** display-layer only — XP never feeds the model */
  xp: number;
  rawNote?: string;
}

export interface TrajectorySnapshot {
  goalId: string;
  date: string; // ISO date (day)
  futureRate: number;
  ghostRate: number;
  timelinePctRaw: number;
  timelinePctDisplayed: number;
}

export interface GoalPayload {
  goalId: string;
  category: GoalCategory;
  label: string;
  timelinePct: number;
  ghostTimelinePct: number;
  ghostGap: number; // future - ghost, in points
  paceRatio: number;
  daysToTarget: number;
  daysRemaining: number;
  onPace: boolean;
}

export interface DecisionAppliedEvent {
  event: "decision_applied";
  goal: string;
  timeShiftDays: number;
  timelinePctChange: number;
  tradeoffs: { goal: string; timelinePctChange: number }[];
}

export interface SimulationOptionResult {
  optionId: string;
  label: string;
  perGoal: {
    goalId: string;
    timelinePctBefore: number;
    timelinePctAfter: number;
    timelinePctChange: number;
    daysToTargetBefore: number;
    daysToTargetAfter: number;
    timeShiftDays: number;
  }[];
}

/** Ghost's per-goal baseline/floor state — see §3, §10 `ghost_baselines`. */
export interface GhostBaseline {
  goalId: string;
  onboardingRate: number;
  floorRate: number;
  /** consecutive weeks the user's worst-quartile rate beat the current floor */
  consecutiveImprovedWeeks: number;
  updatedAt: string;
}

export interface TuningConstants {
  ewmaWindowDays: number;
  ewmaHalfLifeDays: number;
  confidenceK: number;
  clampMin: number;
  clampMax: number;
  maxDailyMoveDisplayed: number;
  ghostOnboardingWeight: number;
  ghostWorstQuartileWeight: number;
  ghostFloorRevisionWeeks: number;
  sentimentCapPoints: number;
}

export const DEFAULT_TUNING: TuningConstants = {
  ewmaWindowDays: 28,
  ewmaHalfLifeDays: 10,
  confidenceK: 1.2,
  clampMin: 2,
  clampMax: 98,
  maxDailyMoveDisplayed: 3,
  ghostOnboardingWeight: 0.4,
  ghostWorstQuartileWeight: 0.6,
  ghostFloorRevisionWeeks: 8,
  sentimentCapPoints: 5,
};
