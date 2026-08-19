import type { GoalCategory, MetricType } from "../engine";

/**
 * Per-category defaults used to turn one onboarding number into a real
 * engine Goal (§1.1). To keep onboarding to "pick areas → name Future
 * You → one target per area" (matching the product's "90 seconds" promise
 * and the mockup's lightweight onboarding), baseline defaults to 0 and
 * Ghost's onboarding daily rate is derived as a fraction of the required
 * pace rather than asked explicitly — a documented v0.1 simplification,
 * not an engine limitation (the engine takes any GhostBaseline you give it).
 */
export interface GoalTemplate {
  category: GoalCategory;
  metricType: MetricType;
  unit: string;
  targetFieldLabel: string;
  defaultTarget: number;
  /** fitness: the number entered is a weekly frequency; engine target = that × weeks-out */
  perWeekTarget?: boolean;
  /** fraction of the required daily rate Ghost coasts on by default, if the user changes nothing */
  ghostPassiveFactor: number;
  formatValue: (n: number) => string;
  buildLabel: (target: number) => string;
}

export const GOAL_TEMPLATES: Record<GoalCategory, GoalTemplate> = {
  financial: {
    category: "financial",
    metricType: "cumulative",
    unit: "£",
    targetFieldLabel: "Savings target (£)",
    defaultTarget: 10000,
    ghostPassiveFactor: 0.15,
    formatValue: (n) => `£${Math.round(n).toLocaleString()}`,
    buildLabel: (t) => `Save £${Math.round(t).toLocaleString()}`,
  },
  career: {
    category: "career",
    metricType: "cumulative",
    unit: "£/mo",
    targetFieldLabel: "Income increase target (£/month)",
    defaultTarget: 6000,
    ghostPassiveFactor: 0.1,
    formatValue: (n) => `£${Math.round(n).toLocaleString()}/mo`,
    buildLabel: (t) => `Increase income by £${Math.round(t).toLocaleString()}/mo`,
  },
  fitness: {
    category: "fitness",
    metricType: "frequency",
    unit: "workouts",
    targetFieldLabel: "Workouts per week (target)",
    defaultTarget: 3,
    perWeekTarget: true,
    ghostPassiveFactor: 0.25,
    formatValue: (n) => `${Math.round(n)} workouts`,
    buildLabel: (t) => `Train ${t}x per week`,
  },
  travel: {
    category: "travel",
    metricType: "cumulative",
    unit: "countries",
    targetFieldLabel: "New countries to visit",
    defaultTarget: 4,
    ghostPassiveFactor: 0.1,
    formatValue: (n) => `${n.toFixed(1)} countries`,
    buildLabel: (t) => `Visit ${t} new countries`,
  },
  relationship: {
    category: "relationship",
    metricType: "cumulative",
    unit: "pts",
    targetFieldLabel: "Relationship investment target (0-100)",
    defaultTarget: 100,
    ghostPassiveFactor: 0.3,
    formatValue: (n) => `${Math.round(n)}%`,
    buildLabel: () => "Build a happy, secure relationship",
  },
  family: {
    category: "family",
    metricType: "cumulative",
    unit: "pts",
    targetFieldLabel: "Presence target (0-100)",
    defaultTarget: 100,
    ghostPassiveFactor: 0.35,
    formatValue: (n) => `${Math.round(n)}%`,
    buildLabel: () => "Be present every week, not just holidays",
  },
  confidence: {
    category: "confidence",
    metricType: "cumulative",
    unit: "pts",
    targetFieldLabel: "Confidence target (0-100)",
    defaultTarget: 100,
    ghostPassiveFactor: 0.25,
    formatValue: (n) => `${Math.round(n)}%`,
    buildLabel: () => "Speak up without overthinking it",
  },
  lifestyle: {
    category: "lifestyle",
    metricType: "cumulative",
    unit: "pts",
    targetFieldLabel: "Lifestyle upgrade target (0-100)",
    defaultTarget: 100,
    ghostPassiveFactor: 0.2,
    formatValue: (n) => `${Math.round(n)}%`,
    buildLabel: () => "Upgrade your day-to-day lifestyle",
  },
};
