import type { Action } from "@/features/simulations/engine";
import { todayKey } from "@/utils/date";

export function computeStreak(actions: Action[]): number {
  const activeDates = new Set(actions.map((a) => a.timestamp.slice(0, 10)));
  if (activeDates.size === 0) return 0;

  const cursor = new Date(todayKey());
  if (!activeDates.has(todayKey())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (activeDates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeDaysSinceLastAction(actions: Action[]): number {
  if (actions.length === 0) return 999;
  const latest = actions.reduce((max, a) => (a.timestamp > max ? a.timestamp : max), actions[0].timestamp);
  const diffMs = Date.now() - new Date(latest).getTime();
  return Math.max(0, Math.floor(diffMs / 86_400_000));
}

/** Last 7 calendar days, oldest first, with whether the user logged anything that day. */
export function weekActivity(actions: Action[]): { date: string; active: boolean }[] {
  const activeDates = new Set(actions.map((a) => a.timestamp.slice(0, 10)));
  const out: { date: string; active: boolean }[] = [];
  const today = new Date(todayKey());
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ date: key, active: activeDates.has(key) });
  }
  return out;
}
