import type { GoalCategory } from "@/features/simulations/engine";
import type { DecisionLogEntry, DecisionScenario } from "@/types";

export const SCENARIOS: DecisionScenario[] = [
  {
    id: "windfall-600",
    categories: ["financial", "travel", "lifestyle"],
    prompt: "You've got £600 unexpectedly. What does Future You do?",
    choices: [
      {
        id: "book-holiday",
        label: "Book the holiday",
        emoji: "✈️",
        categoryImpacts: { travel: 0.3, financial: -200, confidence: 2 },
        narration:
          "We needed that reset more than we admit. Just don't let it become a habit.",
      },
      {
        id: "invest-split",
        label: "Invest £400, spend £200",
        emoji: "💰",
        categoryImpacts: { financial: 400, confidence: 3 },
        narration: "That's the move. Balanced, not extreme.",
      },
      {
        id: "pay-debt",
        label: "Pay down debt",
        emoji: "💳",
        categoryImpacts: { financial: 500, confidence: 4 },
        narration: "Boring but it's the one that compounds.",
      },
      {
        id: "treat-yourself",
        label: "Treat yourself",
        emoji: "🛍️",
        categoryImpacts: { financial: -300, confidence: 3 },
        narration:
          "Fine once. But we both know this is the choice that's cost us before, more than once.",
      },
    ],
  },
  {
    id: "friday-night-invite",
    categories: ["relationship", "confidence", "career"],
    prompt: "Friends invite you out on a Friday night, but you had a plan to work on your side project.",
    choices: [
      {
        id: "go-out",
        label: "Go out, recharge",
        emoji: "🎉",
        categoryImpacts: { confidence: 4, relationship: 3, career: -100 },
        narration: "We're not a machine. This kind of night is why we don't burn out at month nine.",
      },
      {
        id: "stay-in-build",
        label: "Stay in, keep building",
        emoji: "🛠️",
        categoryImpacts: { career: 300, confidence: 1 },
        narration: "This is exactly the kind of night the business plan was counting on.",
      },
      {
        id: "half-and-half",
        label: "Go for one hour, then leave",
        emoji: "⏱️",
        categoryImpacts: { career: 150, relationship: 1.5, confidence: 2 },
        narration: "Smart compromise. We got the connection and the momentum.",
      },
    ],
  },
  {
    id: "job-offer",
    categories: ["career", "financial", "confidence"],
    prompt: "A recruiter reaches out about a role that pays more but feels like a risk. Do you apply?",
    choices: [
      {
        id: "apply-now",
        label: "Apply — go for it",
        emoji: "🚀",
        categoryImpacts: { career: 600, financial: 100, confidence: 5 },
        narration:
          "Yes. This is the kind of move the goal actually needs, and honestly, we needed the confidence hit too.",
      },
      {
        id: "wait-safer",
        label: "Stay safe, wait for a better time",
        emoji: "🛑",
        categoryImpacts: { career: -100, confidence: -2 },
        narration: "I get it, it's scary. But 'a better time' has cost us before.",
      },
      {
        id: "negotiate-current",
        label: "Use it to negotiate at current job",
        emoji: "🤝",
        categoryImpacts: { career: 300, financial: 80, confidence: 3 },
        narration: "Underrated move. Lower risk, real leverage.",
      },
    ],
  },
  {
    id: "gym-skip",
    categories: ["fitness", "confidence"],
    prompt: "You're exhausted and the gym is calling your name to skip it.",
    choices: [
      {
        id: "go-anyway",
        label: "Go anyway, shorter session",
        emoji: "🏋🏾",
        categoryImpacts: { fitness: 1, confidence: 2 },
        narration: "Showing up tired is the version of this that actually builds the streak.",
      },
      {
        id: "rest-day",
        label: "Take a real rest day",
        emoji: "🛌",
        categoryImpacts: { confidence: 1 },
        narration: "Listening to the body isn't the same as quitting.",
      },
      {
        id: "skip-scroll",
        label: "Skip it, scroll instead",
        emoji: "📱",
        categoryImpacts: { fitness: -0.5, confidence: -2 },
        narration:
          "We both know how this one goes. It's not the workout, it's what skipping tends to lead to.",
      },
    ],
  },
  {
    id: "family-call",
    categories: ["family", "confidence"],
    prompt: "Your family calls while you're mid-focus on something important. Answer?",
    choices: [
      {
        id: "answer-now",
        label: "Answer now",
        emoji: "📞",
        categoryImpacts: { family: 4, confidence: 1 },
        narration: "Every one of these calls is a deposit we can't get back later.",
      },
      {
        id: "call-back-later",
        label: "Call back later",
        emoji: "⏳",
        categoryImpacts: { family: -1, career: 100 },
        narration: "Fine sometimes. Just don't let 'later' become the pattern.",
      },
    ],
  },
  {
    id: "spending-day",
    categories: ["financial", "confidence"],
    prompt: "It's been a rough day and your card is already in your hand.",
    choices: [
      {
        id: "no-spend",
        label: "Put the card away",
        emoji: "🙅🏾",
        categoryImpacts: { financial: 150, confidence: 3 },
        narration: "That's the version of us that hits the target on time.",
      },
      {
        id: "small-spend",
        label: "Small, planned treat",
        emoji: "☕",
        categoryImpacts: { financial: -20, confidence: 2 },
        narration: "Reasonable. This is what 'sustainable' actually looks like, not restriction.",
      },
      {
        id: "big-spend",
        label: "Order the big takeaway anyway",
        emoji: "🛍️",
        categoryImpacts: { financial: -80, confidence: -1 },
        narration:
          "You can. One night isn't destroying the plan. But this is the third time this week.",
      },
    ],
  },
  {
    id: "networking-event",
    categories: ["career", "confidence", "relationship"],
    prompt: "There's a networking event tonight, but it means going alone and you don't know anyone.",
    choices: [
      {
        id: "go-alone",
        label: "Go alone, push through the awkward",
        emoji: "🚪",
        categoryImpacts: { career: 250, confidence: 4 },
        narration: "This is the exact kind of discomfort that got us here.",
      },
      {
        id: "skip-it",
        label: "Skip it, stay comfortable",
        emoji: "🏠",
        categoryImpacts: { career: -50, confidence: -1 },
        narration: "Understandable. But growth was never going to come from the comfortable option.",
      },
    ],
  },
  {
    id: "big-trip-deposit",
    categories: ["travel", "financial", "relationship"],
    prompt: "A big trip you've been dreaming about needs a non-refundable deposit today.",
    choices: [
      {
        id: "commit",
        label: "Commit — pay the deposit",
        emoji: "🌍",
        categoryImpacts: { travel: 0.4, financial: -300, confidence: 2 },
        narration: "We only get one shot at some of these windows.",
      },
      {
        id: "wait-save-more",
        label: "Wait and save more first",
        emoji: "🐢",
        categoryImpacts: { financial: 100, travel: -0.05 },
        narration: "Cautious, and not wrong. Let's not let 'someday' become the whole travel goal.",
      },
    ],
  },
];

/**
 * Deterministic "today's decision" — prioritises scenarios touching the
 * user's chosen categories, skips ones already answered until the pool
 * is exhausted, then cycles.
 */
export function getTodayScenario(
  dateKey: string,
  selectedCategories: GoalCategory[],
  decisionLog: DecisionLogEntry[],
): DecisionScenario {
  const answeredIds = new Set(decisionLog.map((d) => d.scenarioId));
  const relevant = SCENARIOS.filter((s) => s.categories.some((c) => selectedCategories.includes(c)));
  const pool = relevant.length > 0 ? relevant : SCENARIOS;
  const unanswered = pool.filter((s) => !answeredIds.has(s.id));
  const candidates = unanswered.length > 0 ? unanswered : pool;

  const seed = hashString(dateKey);
  return candidates[seed % candidates.length];
}

export function getScenarioAnsweredToday(
  dateKey: string,
  decisionLog: DecisionLogEntry[],
): DecisionLogEntry | undefined {
  return decisionLog.find((d) => d.date === dateKey);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
