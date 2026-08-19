import type { AppState } from "@/types";
import type { GoalCategory } from "@/features/simulations/engine";
import { computeGoalPayload, detectLowState } from "@/features/simulations/engine";
import { AREA_MAP } from "@/data/life-categories/areas";
import { computeLevel, computeXp } from "@/features/xp";
import { computeStreak, computeDaysSinceLastAction } from "@/features/streaks";
import { scoreSentiment } from "@/features/simulations/engine";

interface KeywordRule {
  keywords: string[];
  build: (state: AppState) => string;
}

function name(state: AppState): string {
  return state.futureSelf?.name || "Future You";
}

function goalForCategory(state: AppState, category: GoalCategory) {
  return state.goals.find((g) => g.category === category && g.status === "active");
}

function statsLine(state: AppState, category: GoalCategory): { future: number; ghost: number; label: string } | null {
  const goal = goalForCategory(state, category);
  if (!goal) return null;
  const payload = computeGoalPayload(goal, state.actions, new Date().toISOString());
  return { future: payload.timelinePct, ghost: payload.ghostTimelinePct, label: goal.label };
}

const RULES: KeywordRule[] = [
  {
    keywords: ["takeaway", "spend", "spending", "buy", "shopping", "money", "debt", "save", "saving"],
    build: (state) => {
      const stats = statsLine(state, "financial");
      if (!stats) return "We haven't set a money goal yet — add one and I'll actually have numbers to back this up.";
      const gap = stats.future - stats.ghost;
      const recentNoSpend = state.actions.filter((a) => a.actionId.includes("no-spend")).length;
      const gapLine =
        gap > 3
          ? `We're ${Math.round(gap)} points ahead of where habits alone would leave us.`
          : gap < -3
            ? `Ghost ${name(state)} is actually closer than us on money right now — that should sting a little.`
            : `We're basically neck and neck with Ghost ${name(state)} on money right now — this is the tie-breaker moment.`;
      return `You can. One decision isn't destroying "${stats.label}". You've hit "no unnecessary spending" ${recentNoSpend} time${recentNoSpend === 1 ? "" : "s"} so far. ${gapLine}`;
    },
  },
  {
    keywords: ["job", "apply", "interview", "career", "promotion", "business", "work", "quit"],
    build: (state) => {
      const stats = statsLine(state, "career");
      if (!stats) return "We haven't set a career goal yet — add one and I'll have real numbers on this.";
      return `Yes — do it. "${stats.label}" is at ${Math.round(stats.future)}% for Future You vs ${Math.round(stats.ghost)}% for Ghost ${name(state)} who didn't take the risk. This is exactly the kind of move that widens that gap.`;
    },
  },
  {
    keywords: ["gym", "workout", "run", "exercise", "fitness", "tired", "skip"],
    build: (state) => {
      const stats = statsLine(state, "fitness");
      if (!stats) return "We haven't set a fitness goal yet — add one and I'll track this properly.";
      return `Go, even for 15 minutes. "${stats.label}" is at ${Math.round(stats.future)}% for us right now, ${Math.round(stats.ghost)}% for Ghost ${name(state)}. Showing up on the days you don't feel like it is the entire difference between those two numbers.`;
    },
  },
  {
    keywords: ["relationship", "partner", "boyfriend", "girlfriend", "husband", "wife", "date", "love"],
    build: (state) => {
      const stats = statsLine(state, "relationship");
      return `${stats ? `"${stats.label}" — ` : ""}Small, consistent attention beats grand gestures. What's one specific thing you could do today, not eventually?`;
    },
  },
  {
    keywords: ["trip", "travel", "holiday", "flight", "vacation"],
    build: (state) => {
      const stats = statsLine(state, "travel");
      if (!stats) return "Travel isn't one of our goals yet, but go live a little anyway.";
      return `"${stats.label}" is at ${Math.round(stats.future)}% right now. If the money side can take it, this is the kind of memory Ghost ${name(state)} never gets to have.`;
    },
  },
  {
    keywords: ["scared", "nervous", "anxious", "confidence", "doubt", "afraid", "worried"],
    build: (state) => {
      const stats = statsLine(state, "confidence");
      if (!stats) return "That feeling doesn't go away before you do the thing — it goes away after.";
      const diff = stats.future - stats.ghost;
      return `That feeling doesn't go away before you do the thing — it goes away after. Confidence is ${Math.round(stats.future)}% for Future You, ${diff > 0 ? `${Math.round(diff)} points ahead of` : "about level with"} Ghost ${name(state)}. Every hard thing you do anyway is what built that gap.`;
    },
  },
  {
    keywords: ["family", "mum", "mom", "dad", "parents", "kids", "children"],
    build: (state) => {
      const stats = statsLine(state, "family");
      return `${stats ? `"${stats.label}" — ` : ""}These are the moments that don't show up as XP but matter more than almost anything else on the board. Go be present for it.`;
    },
  },
];

function progressSummary(state: AppState): string {
  const xp = computeXp(state.actions);
  const { level } = computeLevel(xp);
  const streak = computeStreak(state.actions);
  return `We're Level ${level}, ${streak}-day streak. Every small decision either pulls the plan closer or pushes it back — what's actually on your mind?`;
}

export function generateFutureSelfReply(userText: string, state: AppState): string {
  if (!state.futureSelf) {
    return "I don't exist yet — build your Future Self first and I'll actually have context to talk to you with.";
  }

  const recentSentiments = state.journal.slice(0, 5).map((j) => scoreSentiment(j.text));
  const lowState = detectLowState({
    recentSentiments,
    daysSinceLastAction: computeDaysSinceLastAction(state.actions),
  });
  if (lowState) {
    return "Hey. No missions, no streaks, no Ghost You comparisons right now — just checking in. How are you actually doing?";
  }

  const lower = userText.toLowerCase();

  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.build(state);
    }
  }

  if (/should i/.test(lower)) {
    const payloads = state.goals
      .filter((g) => g.status === "active")
      .map((g) => ({ goal: g, payload: computeGoalPayload(g, state.actions, new Date().toISOString()) }));
    if (payloads.length === 0) return progressSummary(state);
    const weakest = [...payloads].sort((a, b) => a.payload.timelinePct - b.payload.timelinePct)[0];
    const strongest = [...payloads].sort((a, b) => b.payload.timelinePct - a.payload.timelinePct)[0];
    return `Ask yourself which version of this pulls you toward ${AREA_MAP[weakest.goal.category].label} — that's the area dragging behind ${AREA_MAP[strongest.goal.category].label} right now. If it moves that needle, do it.`;
  }

  if (/hi|hello|hey/.test(lower) && lower.length < 20) {
    return `Hey. ${progressSummary(state)}`;
  }

  return progressSummary(state);
}
