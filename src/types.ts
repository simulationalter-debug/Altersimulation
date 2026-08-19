export type AreaId =
  | "love"
  | "money"
  | "career"
  | "lifestyle"
  | "travel"
  | "confidence"
  | "fitness"
  | "family";

export interface Area {
  id: AreaId;
  label: string;
  emoji: string;
  color: string; // tailwind gradient stop, hex
}

export type StatMap = Record<AreaId, number>;

export interface FutureSelf {
  name: string;
  avatarEmoji: string;
  targetDate: string; // ISO date, ~12 months out
  createdAt: string; // ISO date
  selectedAreas: AreaId[];
  goals: Partial<Record<AreaId, string>>;
}

export interface DecisionChoice {
  id: string;
  label: string;
  emoji: string;
  futureImpact: Partial<Record<AreaId, number>>;
  weeksShift: number; // negative = closer to goal, positive = further away
  narration: string; // Future Self's reaction, may include {weeks}
}

export interface DecisionScenario {
  id: string;
  areas: AreaId[];
  prompt: string;
  context?: string;
  choices: DecisionChoice[];
}

export interface DecisionLogEntry {
  date: string; // ISO date (day)
  scenarioId: string;
  choiceId: string;
  impact: Partial<Record<AreaId, number>>;
  weeksShift: number;
}

export interface MissionTemplate {
  id: string;
  label: string;
  emoji: string;
  xp: number;
  areas: AreaId[];
}

export interface MissionInstance extends MissionTemplate {
  date: string;
  completed: boolean;
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

export type Screen =
  | "landing"
  | "onboarding"
  | "dashboard";

export type DashboardTab =
  | "home"
  | "decision"
  | "timelines"
  | "missions"
  | "chat"
  | "journal"
  | "pricing";

export interface CompletedMission {
  date: string;
  missionId: string;
}

/** Raw, persisted store shape. Stats/XP/streak/ghost are derived, see lib/engine.ts */
export interface AppState {
  screen: Screen;
  futureSelf: FutureSelf | null;
  decisions: DecisionLogEntry[];
  completedMissions: CompletedMission[];
  journal: JournalEntry[];
  chat: ChatMessage[];
}

export interface DerivedProgress {
  futureStats: StatMap;
  ghostStats: StatMap;
  xp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  streak: number;
  targetDateAdjusted: string;
  weeksShiftedTotal: number;
}
