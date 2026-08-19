import type { AppState, AreaId } from "../types";
import { AREA_MAP } from "../data/areas";
import { computeDerivedProgress } from "./engine";
import { weeksUntil } from "./date";

interface KeywordRule {
  areas: AreaId[];
  keywords: string[];
  build: (state: AppState) => string;
}

function name(state: AppState): string {
  return state.futureSelf?.name || "Future You";
}

function goalLine(state: AppState, area: AreaId): string {
  const goal = state.futureSelf?.goals[area];
  return goal ? `Your goal was: "${goal}".` : "";
}

function statsLine(state: AppState, area: AreaId): { future: number; ghost: number } {
  const derived = computeDerivedProgress(state.futureSelf, state.decisions, state.completedMissions);
  return { future: derived.futureStats[area], ghost: derived.ghostStats[area] };
}

const RULES: KeywordRule[] = [
  {
    areas: ["money"],
    keywords: ["takeaway", "spend", "spending", "buy", "shopping", "money", "debt", "save", "saving"],
    build: (state) => {
      const { future, ghost } = statsLine(state, "money");
      const gap = future - ghost;
      const recentNoSpend = state.completedMissions.filter((m) => m.missionId === "no-spend").length;
      const gapLine =
        gap > 3
          ? `We're ${gap} points ahead of where habits alone would leave us.`
          : gap < -3
            ? `Ghost ${name(state)} is actually closer than us on money right now — that should sting a little.`
            : `We're basically neck and neck with Ghost ${name(state)} on money — this is the tie-breaker moment.`;
      return `You can. One decision isn't destroying the plan. But you've hit "no unnecessary spending" ${recentNoSpend} time${recentNoSpend === 1 ? "" : "s"} so far. ${gapLine} ${goalLine(state, "money")}`.trim();
    },
  },
  {
    areas: ["career"],
    keywords: ["job", "apply", "interview", "career", "promotion", "business", "work", "quit"],
    build: (state) => {
      const { future, ghost } = statsLine(state, "career");
      return `Yes — do it. ${goalLine(state, "career") || "Career was one of the areas we're actively building."} Right now Future You is at ${Math.round(future)} on career vs ${Math.round(ghost)} for Ghost You who didn't take the risk. This is exactly the kind of move that widens that gap.`;
    },
  },
  {
    areas: ["fitness"],
    keywords: ["gym", "workout", "run", "exercise", "fitness", "tired", "skip"],
    build: (state) => {
      const { future, ghost } = statsLine(state, "fitness");
      return `Go, even for 15 minutes. Fitness is at ${Math.round(future)} for us right now, ${Math.round(ghost)} for Ghost ${name(state)}. Showing up on the days you don't feel like it is the entire difference between those two numbers.`;
    },
  },
  {
    areas: ["love"],
    keywords: ["relationship", "partner", "boyfriend", "girlfriend", "husband", "wife", "date", "love"],
    build: (state) =>
      `${goalLine(state, "love") || "Relationships were one of the areas we said mattered most."} Small, consistent attention beats grand gestures — what's one specific thing you could do today, not eventually?`,
  },
  {
    areas: ["travel"],
    keywords: ["trip", "travel", "holiday", "flight", "vacation"],
    build: (state) => {
      const { future } = statsLine(state, "travel");
      return `${goalLine(state, "travel") || "Travel was one of the goals on the board."} Travel is sitting at ${Math.round(future)} for us. If the money side can take it, this is the kind of memory Ghost ${name(state)} never gets to have.`;
    },
  },
  {
    areas: ["confidence"],
    keywords: ["scared", "nervous", "anxious", "confidence", "doubt", "afraid", "worried"],
    build: (state) => {
      const { future, ghost } = statsLine(state, "confidence");
      const diff = future - ghost;
      return `That feeling doesn't go away before you do the thing — it goes away after. Confidence is ${Math.round(future)} for Future You, ${diff > 0 ? `${Math.round(diff)} points ahead of` : "about level with"} Ghost ${name(state)}. Every hard thing you do anyway is what built that gap.`;
    },
  },
  {
    areas: ["family"],
    keywords: ["family", "mum", "mom", "dad", "parents", "kids", "children"],
    build: (state) =>
      `${goalLine(state, "family") || "Family was one of the areas we said we wouldn't let slide."} These are the moments that don't show up as XP but matter more than almost anything else on the board. Go be present for it.`,
  },
];

function progressSummary(state: AppState): string {
  const derived = computeDerivedProgress(state.futureSelf, state.decisions, state.completedMissions);
  const weeks = state.futureSelf ? weeksUntil(derived.targetDateAdjusted) : 0;
  return `We're Level ${derived.level}, ${derived.streak}-day streak, and ${weeks} weeks out from the target date. Every small decision either pulls that closer or pushes it back — what's actually on your mind?`;
}

export function generateFutureSelfReply(userText: string, state: AppState): string {
  if (!state.futureSelf) {
    return "I don't exist yet — build your Future Self first and I'll actually have context to talk to you with.";
  }

  const lower = userText.toLowerCase();

  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.build(state);
    }
  }

  if (/should i/.test(lower)) {
    const derived = computeDerivedProgress(state.futureSelf, state.decisions, state.completedMissions);
    const strongestArea = (Object.entries(derived.futureStats) as [AreaId, number][]).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const weakestArea = (Object.entries(derived.futureStats) as [AreaId, number][]).sort(
      (a, b) => a[1] - b[1],
    )[0];
    return `Ask yourself which version of this pulls you toward ${AREA_MAP[weakestArea[0]].label} — that's the area dragging behind ${AREA_MAP[strongestArea[0]].label} right now. If it moves that needle, do it.`;
  }

  if (/hi|hello|hey/.test(lower) && lower.length < 20) {
    return `Hey. ${progressSummary(state)}`;
  }

  return progressSummary(state);
}
