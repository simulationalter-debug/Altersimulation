import type { MissionTemplate } from "@/types";

export const MISSION_POOL: MissionTemplate[] = [
  { id: "workout-30", label: "30-minute workout", emoji: "🏋🏾", xp: 50, categoryImpacts: { fitness: 1 } },
  { id: "avoided-thing", label: "Do the thing you've been avoiding", emoji: "😤", xp: 100, categoryImpacts: { confidence: 4, career: 60 } },
  { id: "no-spend", label: "No unnecessary spending today", emoji: "💸", xp: 75, categoryImpacts: { financial: 30 } },
  { id: "business-action", label: "Take one action towards your business", emoji: "📈", xp: 150, categoryImpacts: { career: 120, financial: 20 } },
  { id: "journal", label: "Write a 2-minute journal entry", emoji: "📓", xp: 40, categoryImpacts: { confidence: 1 } },
  { id: "reach-out", label: "Reach out to someone you love", emoji: "❤️", xp: 60, categoryImpacts: { relationship: 3, family: 2 } },
  { id: "walk-outside", label: "Get outside for 15 minutes", emoji: "🌤️", xp: 30, categoryImpacts: { fitness: 0.3, confidence: 1 } },
  { id: "cook-instead", label: "Cook instead of ordering out", emoji: "🍳", xp: 45, categoryImpacts: { financial: 15, fitness: 0.2 } },
  { id: "plan-trip", label: "Spend 10 minutes planning your next trip", emoji: "🗺️", xp: 35, categoryImpacts: { travel: 0.05 } },
  { id: "no-scroll-hour", label: "One hour with your phone away", emoji: "📵", xp: 55, categoryImpacts: { confidence: 2 } },
  { id: "family-time", label: "Give someone in your family your full attention", emoji: "👨‍👩‍👧", xp: 60, categoryImpacts: { family: 3 } },
  { id: "learn-skill", label: "Spend 20 minutes learning a career skill", emoji: "🧠", xp: 70, categoryImpacts: { career: 80, confidence: 1 } },
  { id: "budget-check", label: "Check your budget / spending this week", emoji: "🧾", xp: 45, categoryImpacts: { financial: 10 } },
  { id: "compliment", label: "Say something kind to your partner", emoji: "💬", xp: 40, categoryImpacts: { relationship: 3 } },
  { id: "sleep-early", label: "Lights out before 11pm", emoji: "😴", xp: 35, categoryImpacts: { fitness: 0.2, confidence: 1 } },
];

// Deterministic daily picks from the pool, prioritising the user's selected categories.
export function pickDailyMissions(
  dateKey: string,
  selectedCategories: string[],
  count = 4,
): MissionTemplate[] {
  const seed = hashString(dateKey);
  const relevant = MISSION_POOL.filter((m) =>
    Object.keys(m.categoryImpacts).some((c) => selectedCategories.includes(c)),
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
