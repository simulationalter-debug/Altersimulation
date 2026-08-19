import type { Action, Goal } from "../engine";

export interface Milestone {
  date: string;
  emoji: string;
  label: string;
}

const STREAK_THRESHOLDS = [7, 14, 30, 60, 90, 180, 365];
const PROGRESS_THRESHOLDS = [25, 50, 75, 100];

/**
 * Derives milestone events by replaying the action log chronologically —
 * streak-length crossings and goal-progress crossings (25/50/75/100% of
 * target). Not a stored table (§10 would persist these); recomputed from
 * `actions` + `goals`, which is cheap at MVP scale.
 */
export function computeMilestones(goals: Goal[], actions: Action[]): Milestone[] {
  const milestones: Milestone[] = [];
  const sorted = [...actions].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  if (sorted.length > 0) {
    milestones.push({ date: sorted[0].timestamp, emoji: "🎉", label: "Started your journey" });
  }

  // Streak crossings
  const activeDates = Array.from(new Set(sorted.map((a) => a.timestamp.slice(0, 10)))).sort();
  let streak = 0;
  let prevDate: string | null = null;
  const hitStreak = new Set<number>();
  for (const date of activeDates) {
    if (prevDate) {
      const prev = new Date(prevDate);
      prev.setDate(prev.getDate() + 1);
      streak = prev.toISOString().slice(0, 10) === date ? streak + 1 : 1;
    } else {
      streak = 1;
    }
    prevDate = date;
    for (const t of STREAK_THRESHOLDS) {
      if (streak === t && !hitStreak.has(t)) {
        hitStreak.add(t);
        milestones.push({ date: `${date}T12:00:00.000Z`, emoji: "🔥", label: `${t}-day streak` });
      }
    }
  }

  // Goal progress crossings
  for (const goal of goals) {
    let value = goal.baseline;
    const hit = new Set<number>();
    for (const action of sorted) {
      for (const impact of action.impacts) {
        if (impact.goalId !== goal.goalId) continue;
        value += impact.delta;
        const pctOfTarget = goal.target !== 0 ? (value / goal.target) * 100 : 0;
        for (const t of PROGRESS_THRESHOLDS) {
          if (pctOfTarget >= t && !hit.has(t)) {
            hit.add(t);
            milestones.push({
              date: action.timestamp,
              emoji: t === 100 ? "🏁" : "🎯",
              label: `${goal.label} — ${t}% there`,
            });
          }
        }
      }
    }
  }

  return milestones.sort((a, b) => b.date.localeCompare(a.date));
}
