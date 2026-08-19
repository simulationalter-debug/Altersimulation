import { AREAS } from "../data/areas";
import { MISSION_POOL } from "../data/missions";
import type {
  AreaId,
  CompletedMission,
  DecisionLogEntry,
  DerivedProgress,
  FutureSelf,
  StatMap,
} from "../types";
import { daysBetween, todayKey } from "./date";

const BASE_STAT = 50;
const XP_PER_LEVEL = 500;
const DECISION_XP = 20;

// Small daily entropy applied to Ghost You per area — "same habits, same job".
const GHOST_DRIFT: Record<AreaId, number> = {
  love: -0.02,
  money: -0.06,
  career: -0.03,
  lifestyle: -0.02,
  travel: -0.015,
  confidence: -0.04,
  fitness: -0.05,
  family: -0.01,
};

const MISSION_TEMPLATE_MAP = Object.fromEntries(
  MISSION_POOL.map((m) => [m.id, m]),
);

function emptyStatMap(value: number): StatMap {
  return AREAS.reduce((acc, area) => {
    acc[area.id] = value;
    return acc;
  }, {} as StatMap);
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}

export function computeFutureStats(decisions: DecisionLogEntry[], completedMissions: CompletedMission[]): StatMap {
  const stats = emptyStatMap(BASE_STAT);
  for (const d of decisions) {
    for (const [area, delta] of Object.entries(d.impact)) {
      stats[area as AreaId] += delta ?? 0;
    }
  }
  for (const cm of completedMissions) {
    const template = MISSION_TEMPLATE_MAP[cm.missionId];
    if (!template) continue;
    const perArea = 2.2 / template.areas.length;
    for (const area of template.areas) {
      stats[area] += perArea;
    }
  }
  for (const key of Object.keys(stats) as AreaId[]) {
    stats[key] = clamp(stats[key]);
  }
  return stats;
}

export function computeGhostStats(futureSelf: FutureSelf | null): StatMap {
  const stats = emptyStatMap(BASE_STAT);
  if (!futureSelf) return stats;
  const elapsed = daysBetween(futureSelf.createdAt, todayKey());
  for (const key of Object.keys(stats) as AreaId[]) {
    stats[key] = clamp(BASE_STAT + GHOST_DRIFT[key] * elapsed);
  }
  return stats;
}

export function computeXp(decisions: DecisionLogEntry[], completedMissions: CompletedMission[]): number {
  const decisionXp = decisions.length * DECISION_XP;
  const missionXp = completedMissions.reduce((sum, cm) => {
    const template = MISSION_TEMPLATE_MAP[cm.missionId];
    return sum + (template?.xp ?? 0);
  }, 0);
  return decisionXp + missionXp;
}

export function computeStreak(decisions: DecisionLogEntry[], completedMissions: CompletedMission[]): number {
  const activeDates = new Set<string>();
  for (const d of decisions) activeDates.add(d.date);
  for (const cm of completedMissions) activeDates.add(cm.date);
  if (activeDates.size === 0) return 0;

  const today = new Date(todayKey());
  let streak = 0;
  const cursor = new Date(today);

  // If nothing done today yet, don't break streak — start checking from yesterday.
  if (!activeDates.has(todayKey())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (activeDates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeWeeksShiftedTotal(decisions: DecisionLogEntry[]): number {
  return decisions.reduce((sum, d) => sum + d.weeksShift, 0);
}

export function computeTargetDateAdjusted(futureSelf: FutureSelf | null, decisions: DecisionLogEntry[]): string {
  if (!futureSelf) return todayKey();
  const totalShift = computeWeeksShiftedTotal(decisions);
  const target = new Date(futureSelf.targetDate);
  target.setDate(target.getDate() - totalShift * 7);
  return target.toISOString();
}

export function computeDerivedProgress(
  futureSelf: FutureSelf | null,
  decisions: DecisionLogEntry[],
  completedMissions: CompletedMission[],
): DerivedProgress {
  const xp = computeXp(decisions, completedMissions);
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  return {
    futureStats: computeFutureStats(decisions, completedMissions),
    ghostStats: computeGhostStats(futureSelf),
    xp,
    level,
    xpIntoLevel: xp % XP_PER_LEVEL,
    xpForNextLevel: XP_PER_LEVEL,
    streak: computeStreak(decisions, completedMissions),
    targetDateAdjusted: computeTargetDateAdjusted(futureSelf, decisions),
    weeksShiftedTotal: computeWeeksShiftedTotal(decisions),
  };
}

export function overallScore(stats: StatMap, areas: AreaId[]): number {
  const relevant = areas.length > 0 ? areas : (Object.keys(stats) as AreaId[]);
  const sum = relevant.reduce((acc, a) => acc + stats[a], 0);
  return Math.round(sum / relevant.length);
}
