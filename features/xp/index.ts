import type { Action } from "@/features/simulations/engine";
import { XP_PER_LEVEL } from "@/data/xp-rules";

/** XP is display-layer only per spec §1.2 — it never feeds the engine. */
export function computeXp(actions: Action[]): number {
  return actions.reduce((sum, a) => sum + a.xp, 0);
}

export function computeLevel(xp: number): { level: number; xpIntoLevel: number; xpForNextLevel: number } {
  return {
    level: Math.floor(xp / XP_PER_LEVEL) + 1,
    xpIntoLevel: xp % XP_PER_LEVEL,
    xpForNextLevel: XP_PER_LEVEL,
  };
}
