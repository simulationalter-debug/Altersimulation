import type { MissionTemplate } from "../types";

export const MISSION_POOL: MissionTemplate[] = [
  { id: "workout-30", label: "30-minute workout", emoji: "🏋🏾", xp: 50, areas: ["fitness"] },
  { id: "avoided-thing", label: "Do the thing you've been avoiding", emoji: "😤", xp: 100, areas: ["confidence", "career"] },
  { id: "no-spend", label: "No unnecessary spending today", emoji: "💸", xp: 75, areas: ["money"] },
  { id: "business-action", label: "Take one action towards your business", emoji: "📈", xp: 150, areas: ["career", "money"] },
  { id: "journal", label: "Write a 2-minute journal entry", emoji: "📓", xp: 40, areas: ["confidence"] },
  { id: "reach-out", label: "Reach out to someone you love", emoji: "❤️", xp: 60, areas: ["love", "family"] },
  { id: "walk-outside", label: "Get outside for 15 minutes", emoji: "🌤️", xp: 30, areas: ["fitness", "confidence"] },
  { id: "cook-instead", label: "Cook instead of ordering out", emoji: "🍳", xp: 45, areas: ["money", "fitness"] },
  { id: "plan-trip", label: "Spend 10 minutes planning your next trip", emoji: "🗺️", xp: 35, areas: ["travel"] },
  { id: "no-scroll-hour", label: "One hour with your phone away", emoji: "📵", xp: 55, areas: ["confidence"] },
  { id: "family-time", label: "Give someone in your family your full attention", emoji: "👨‍👩‍👧", xp: 60, areas: ["family"] },
  { id: "learn-skill", label: "Spend 20 minutes learning a career skill", emoji: "🧠", xp: 70, areas: ["career", "confidence"] },
  { id: "budget-check", label: "Check your budget / spending this week", emoji: "🧾", xp: 45, areas: ["money"] },
  { id: "compliment", label: "Say something kind to your partner", emoji: "💬", xp: 40, areas: ["love"] },
  { id: "sleep-early", label: "Lights out before 11pm", emoji: "😴", xp: 35, areas: ["fitness", "confidence"] },
];

// Deterministic daily picks from the pool, prioritising the user's selected areas.
export function pickDailyMissions(
  dateKey: string,
  selectedAreas: string[],
  count = 4,
): MissionTemplate[] {
  const seed = hashString(dateKey);
  const relevant = MISSION_POOL.filter((m) =>
    m.areas.some((a) => selectedAreas.includes(a)),
  );
  const pool = relevant.length >= count ? relevant : MISSION_POOL;
  const shuffled = seededShuffle(pool, seed);
  return shuffled.slice(0, count);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed || 1;
  const next = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
