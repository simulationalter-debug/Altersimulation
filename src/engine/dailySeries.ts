import type { Action } from "./types";

export function toDateKey(iso: string): string {
  return iso.slice(0, 10);
}

export function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(toDateKey(fromIso));
  const to = new Date(toDateKey(toIso));
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(toDateKey(iso));
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Sum of impact deltas for one goal, per calendar day, for every day from
 * `fromIso` to `toIso` inclusive. Days without a matching action are
 * present in the map as 0 — silence is a first-class zero, which is what
 * lets inaction decay the EWMA naturally (§1.2, §3).
 */
export function buildDailyDeltaSeries(
  actions: Action[],
  goalId: string,
  fromIso: string,
  toIso: string,
): Map<string, number> {
  const series = new Map<string, number>();
  const totalDays = Math.max(0, daysBetween(fromIso, toIso));
  for (let i = 0; i <= totalDays; i++) {
    series.set(addDays(fromIso, i), 0);
  }
  for (const action of actions) {
    const key = toDateKey(action.timestamp);
    if (!series.has(key)) continue;
    for (const impact of action.impacts) {
      if (impact.goalId !== goalId) continue;
      series.set(key, (series.get(key) ?? 0) + impact.delta);
    }
  }
  return series;
}

/** Deltas for the `windowDays` ending on (and including) `asOfIso`, oldest first. */
export function windowedDeltas(
  series: Map<string, number>,
  asOfIso: string,
  windowDays: number,
): number[] {
  const out: number[] = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    const key = addDays(asOfIso, -i);
    out.push(series.get(key) ?? 0);
  }
  return out;
}
