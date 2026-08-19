import { useMemo } from "react";
import { useStore } from "../store";
import { runEngine } from "../engine";
import { computeXp, computeLevel, computeStreak, computeDaysSinceLastAction, weekActivity } from "./progress";
import { todayKey } from "./date";

export function useEngineSnapshot() {
  const futureSelf = useStore((s) => s.futureSelf);
  const goals = useStore((s) => s.goals);
  const actions = useStore((s) => s.actions);
  const journal = useStore((s) => s.journal);
  const decisionLog = useStore((s) => s.decisionLog);

  return useMemo(() => {
    const asOf = new Date().toISOString();
    const recentJournalTexts = journal.slice(0, 5).map((j) => j.text);
    const daysSinceLastAction = computeDaysSinceLastAction(actions);
    const ctx = runEngine(goals, actions, asOf, recentJournalTexts, daysSinceLastAction);

    const xp = computeXp(actions);
    const level = computeLevel(xp);
    const streak = computeStreak(actions);
    const week = weekActivity(actions);

    return {
      futureSelf,
      goals,
      actions,
      journal,
      decisionLog,
      ctx,
      xp,
      ...level,
      streak,
      week,
      dateKey: todayKey(),
    };
  }, [futureSelf, goals, actions, journal, decisionLog]);
}
