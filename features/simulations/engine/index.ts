export * from "./types";
export * from "./dailySeries";
export * from "./ewma";
export * from "./trajectory";
export * from "./ghost";
export * from "./rollup";
export * from "./payload";
export * from "./decisions";
export * from "./simulate";
export * from "./safety";

import type { Action, Goal, GoalCategory, TuningConstants } from "./types";
import { DEFAULT_TUNING, type GoalPayload } from "./types";
import { computeGoalPayload } from "./payload";
import { computeCategoryRollup, computeHappiness, scoreSentiment } from "./rollup";
import { detectLowState } from "./safety";

export interface EngineContext {
  goals: GoalPayload[];
  categoryRollups: Partial<Record<GoalCategory, number>>;
  happiness: number;
  lowState: boolean;
}

/**
 * §9 "Engine → LLM contract": the single call a UI or voice layer needs —
 * every goal's payload plus rollups, happiness, and the low-state flag.
 * Nothing downstream should compute a displayed number itself; it should
 * read it from here.
 */
export function runEngine(
  goals: Goal[],
  actions: Action[],
  asOfIso: string,
  recentJournalTexts: string[],
  daysSinceLastAction: number,
  tuning: TuningConstants = DEFAULT_TUNING,
): EngineContext {
  const activeGoals = goals.filter((g) => g.status === "active");
  const payloads = activeGoals.map((g) => computeGoalPayload(g, actions, asOfIso, tuning));
  const payloadByGoalId = new Map(payloads.map((p) => [p.goalId, p]));

  const categories = Array.from(new Set(activeGoals.map((g) => g.category)));
  const categoryRollups: Partial<Record<GoalCategory, number>> = {};
  for (const category of categories) {
    const rollup = computeCategoryRollup(activeGoals, payloadByGoalId, category);
    if (rollup !== null) categoryRollups[category] = rollup;
  }

  const sentiments = recentJournalTexts.map(scoreSentiment);
  const avgSentiment = sentiments.length
    ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length
    : 0;
  const happiness = computeHappiness(Object.values(categoryRollups), avgSentiment, tuning);

  const lowState = detectLowState({ recentSentiments: sentiments, daysSinceLastAction });

  return { goals: payloads, categoryRollups, happiness, lowState };
}
