import { useMemo } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import { runEngine } from "@/features/simulations/engine";
import { computeXp, computeLevel } from "@/features/xp";
import { computeStreak, computeDaysSinceLastAction, weekActivity } from "@/features/streaks";
import { todayKey } from "@/utils/date";

export function useEngineSnapshot() {
  const futureSelf = useAppStore((s) => s.futureSelf);
  const goals = useAppStore((s) => s.goals);
  const actions = useAppStore((s) => s.actions);
  const journal = useAppStore((s) => s.journal);
  const decisionLog = useAppStore((s) => s.decisionLog);

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
