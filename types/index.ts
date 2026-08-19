import type { Action, DecisionAppliedEvent, Goal, GoalCategory } from "@/features/simulations/engine";

export interface FutureSelf {
  name: string;
  avatarEmoji: string;
  createdAt: string; // ISO date
  targetDate: string; // ISO date — default deadline used for every goal
  selectedCategories: GoalCategory[];
}

export interface DecisionChoice {
  id: string;
  label: string;
  emoji: string;
  /** deltas keyed by category — resolved to the user's actual goal id at apply-time */
  categoryImpacts: Partial<Record<GoalCategory, number>>;
  narration: string;
}

export interface DecisionScenario {
  id: string;
  categories: GoalCategory[];
  prompt: string;
  choices: DecisionChoice[];
}

export interface DecisionLogEntry {
  date: string; // ISO day
  scenarioId: string;
  choiceId: string;
  event: DecisionAppliedEvent;
}

export interface MissionTemplate {
  id: string;
  label: string;
  emoji: string;
  xp: number;
  categoryImpacts: Partial<Record<GoalCategory, number>>;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "future-self";
  text: string;
  date: string;
}

/** Raw, persisted store shape. Everything numeric is derived from `goals` + `actions` via the engine. */
export interface AppState {
  futureSelf: FutureSelf | null;
  goals: Goal[];
  actions: Action[];
  decisionLog: DecisionLogEntry[];
  journal: JournalEntry[];
  chat: ChatMessage[];
}

export type { GoalCategory, Goal, Action };
