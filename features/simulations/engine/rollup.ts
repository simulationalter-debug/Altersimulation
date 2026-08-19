import type { Goal, GoalCategory, TuningConstants } from "./types";
import { DEFAULT_TUNING, type GoalPayload } from "./types";
import { clamp } from "./trajectory";

/** Weight-averaged timeline_pct across every goal in a category (§2 "Category rollups"). */
export function computeCategoryRollup(
  goals: Goal[],
  payloadByGoalId: Map<string, GoalPayload>,
  category: GoalCategory,
): number | null {
  const inCategory = goals.filter((g) => g.category === category);
  if (inCategory.length === 0) return null;
  let weightedSum = 0;
  let totalWeight = 0;
  for (const goal of inCategory) {
    const payload = payloadByGoalId.get(goal.goalId);
    if (!payload) continue;
    weightedSum += payload.timelinePct * goal.weight;
    totalWeight += goal.weight;
  }
  if (totalWeight === 0) return null;
  return weightedSum / totalWeight;
}

/**
 * Happiness = weighted blend of every category's rollup, seasoned (never
 * driven) by journal sentiment — capped at ±`sentimentCapPoints` (§2).
 */
export function computeHappiness(
  categoryRollups: number[],
  journalSentiment: number, // -1..1
  tuning: TuningConstants = DEFAULT_TUNING,
): number {
  if (categoryRollups.length === 0) return 50;
  const base = categoryRollups.reduce((a, b) => a + b, 0) / categoryRollups.length;
  const seasoning = clamp(journalSentiment, -1, 1) * tuning.sentimentCapPoints;
  return clamp(base + seasoning, tuning.clampMin, tuning.clampMax);
}

const POSITIVE_WORDS = [
  "good",
  "great",
  "happy",
  "proud",
  "excited",
  "grateful",
  "motivated",
  "progress",
  "confident",
  "win",
  "love",
  "calm",
];
const NEGATIVE_WORDS = [
  "bad",
  "sad",
  "tired",
  "anxious",
  "stressed",
  "worried",
  "stuck",
  "angry",
  "hate",
  "overwhelmed",
  "failed",
  "scared",
  "lonely",
];

/**
 * Minimal keyword-count sentiment, returned in [-1, 1]. v0.1 placeholder —
 * real NLP can replace this without touching any caller, since it's
 * already capped downstream (§2, §7 low-state detection uses the same
 * signal).
 */
export function scoreSentiment(text: string): number {
  const lower = text.toLowerCase();
  let pos = 0;
  let neg = 0;
  for (const w of POSITIVE_WORDS) if (lower.includes(w)) pos += 1;
  for (const w of NEGATIVE_WORDS) if (lower.includes(w)) neg += 1;
  const total = pos + neg;
  if (total === 0) return 0;
  return clamp((pos - neg) / total, -1, 1);
}
