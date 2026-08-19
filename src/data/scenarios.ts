import type { AreaId, DecisionLogEntry, DecisionScenario } from "../types";

export const SCENARIOS: DecisionScenario[] = [
  {
    id: "windfall-600",
    areas: ["money", "travel", "lifestyle"],
    prompt: "You've got £600 unexpectedly. What does Future You do?",
    choices: [
      {
        id: "book-holiday",
        label: "Book the holiday",
        emoji: "✈️",
        futureImpact: { travel: 6, money: -2, confidence: 2 },
        weeksShift: 1,
        narration:
          "We needed that reset more than we admit. Just don't let it become a habit — {weeks} weeks added to the money goal.",
      },
      {
        id: "invest-split",
        label: "Invest £400, spend £200",
        emoji: "💰",
        futureImpact: { money: 7, confidence: 3, lifestyle: 1 },
        weeksShift: -3,
        narration:
          "That's the move. Balanced, not extreme — that decision just brought us about {weeks} weeks closer to our financial target.",
      },
      {
        id: "pay-debt",
        label: "Pay down debt",
        emoji: "💳",
        futureImpact: { money: 8, confidence: 4 },
        weeksShift: -4,
        narration:
          "Boring but it's the one that compounds. {weeks} weeks closer, and the pressure in our chest just eased a little.",
      },
      {
        id: "treat-yourself",
        label: "Treat yourself",
        emoji: "🛍️",
        futureImpact: { confidence: 3, money: -4 },
        weeksShift: 2,
        narration:
          "Fine once. But we both know this is the choice that's cost us {weeks} extra weeks before, more than once.",
      },
    ],
  },
  {
    id: "friday-night-invite",
    areas: ["love", "confidence", "career"],
    prompt:
      "Friends invite you out on a Friday night, but you had a plan to work on your side project.",
    choices: [
      {
        id: "go-out",
        label: "Go out, recharge",
        emoji: "🎉",
        futureImpact: { confidence: 4, love: 2, career: -1 },
        weeksShift: 1,
        narration:
          "We're not a machine. This kind of night is why we don't burn out at month nine — worth the {weeks} week delay.",
      },
      {
        id: "stay-in-build",
        label: "Stay in, keep building",
        emoji: "🛠️",
        futureImpact: { career: 5, confidence: 1, love: -1 },
        weeksShift: -2,
        narration:
          "This is exactly the kind of night the business plan was counting on. {weeks} weeks closer to launch.",
      },
      {
        id: "half-and-half",
        label: "Go for one hour, then leave",
        emoji: "⏱️",
        futureImpact: { career: 2, love: 1, confidence: 2 },
        weeksShift: -1,
        narration:
          "Smart compromise. We got the connection and the momentum — small win, {weeks} weeks in the bank.",
      },
    ],
  },
  {
    id: "job-offer",
    areas: ["career", "money", "confidence"],
    prompt:
      "A recruiter reaches out about a role that pays more but feels like a risk. Do you apply?",
    choices: [
      {
        id: "apply-now",
        label: "Apply — go for it",
        emoji: "🚀",
        futureImpact: { career: 6, money: 4, confidence: 3 },
        weeksShift: -5,
        narration:
          "Yes. This is the kind of move the goal actually needs — {weeks} weeks closer, and honestly, we needed the confidence hit too.",
      },
      {
        id: "wait-safer",
        label: "Stay safe, wait for a better time",
        emoji: "🛑",
        futureImpact: { career: -2, confidence: -1 },
        weeksShift: 3,
        narration:
          "I get it, it's scary. But 'a better time' has cost us {weeks} weeks before. Worth asking what we're actually protecting.",
      },
      {
        id: "negotiate-current",
        label: "Use it to negotiate at current job",
        emoji: "🤝",
        futureImpact: { career: 3, money: 3, confidence: 2 },
        weeksShift: -2,
        narration:
          "Underrated move. Lower risk, real leverage — {weeks} weeks closer without leaving what's already working.",
      },
    ],
  },
  {
    id: "gym-skip",
    areas: ["fitness", "confidence"],
    prompt: "You're exhausted and the gym is calling your name to skip it.",
    choices: [
      {
        id: "go-anyway",
        label: "Go anyway, shorter session",
        emoji: "🏋🏾",
        futureImpact: { fitness: 4, confidence: 2 },
        weeksShift: -1,
        narration:
          "Showing up tired is the version of this that actually builds the streak. {weeks} weeks closer.",
      },
      {
        id: "rest-day",
        label: "Take a real rest day",
        emoji: "🛌",
        futureImpact: { fitness: 1, confidence: 1 },
        weeksShift: 0,
        narration:
          "Listening to the body isn't the same as quitting. This one's neutral — no weeks lost.",
      },
      {
        id: "skip-scroll",
        label: "Skip it, scroll instead",
        emoji: "📱",
        futureImpact: { fitness: -3, confidence: -2 },
        weeksShift: 2,
        narration:
          "We both know how this one goes. It's not the workout, it's what skipping tends to lead to — {weeks} weeks slower.",
      },
    ],
  },
  {
    id: "family-call",
    areas: ["family", "confidence"],
    prompt: "Your family calls while you're mid-focus on something important. Answer?",
    choices: [
      {
        id: "answer-now",
        label: "Answer now",
        emoji: "📞",
        futureImpact: { family: 5, confidence: 1 },
        weeksShift: 0,
        narration:
          "Every one of these calls is a deposit we can't get back later. No cost to the plan, real gain everywhere else.",
      },
      {
        id: "call-back-later",
        label: "Call back later",
        emoji: "⏳",
        futureImpact: { family: -1, career: 1 },
        weeksShift: -1,
        narration:
          "Fine sometimes. Just don't let 'later' become the pattern — {weeks} weeks closer on the thing you're focused on.",
      },
    ],
  },
  {
    id: "spending-day",
    areas: ["money", "confidence"],
    prompt: "It's been a rough day and your card is already in your hand.",
    choices: [
      {
        id: "no-spend",
        label: "Put the card away",
        emoji: "🙅🏾",
        futureImpact: { money: 3, confidence: 3 },
        weeksShift: -2,
        narration:
          "That's the version of us that hits the target on time. {weeks} weeks closer, and it felt hard in the moment — that's exactly why it counts.",
      },
      {
        id: "small-spend",
        label: "Small, planned treat",
        emoji: "☕",
        futureImpact: { money: -1, confidence: 2 },
        weeksShift: 0,
        narration:
          "Reasonable. This is what 'sustainable' actually looks like, not restriction — no real cost.",
      },
      {
        id: "big-spend",
        label: "Order the big takeaway anyway",
        emoji: "🛍️",
        futureImpact: { money: -5, confidence: -1 },
        weeksShift: 3,
        narration:
          "You can. One night isn't destroying the plan. But this is the third time this week — {weeks} weeks added, and we both know it.",
      },
    ],
  },
  {
    id: "networking-event",
    areas: ["career", "confidence", "love"],
    prompt: "There's a networking event tonight, but it means going alone and you don't know anyone.",
    choices: [
      {
        id: "go-alone",
        label: "Go alone, push through the awkward",
        emoji: "🚪",
        futureImpact: { career: 4, confidence: 4 },
        weeksShift: -2,
        narration:
          "This is the exact kind of discomfort that got us here. {weeks} weeks closer, and confidence just went up a notch.",
      },
      {
        id: "skip-it",
        label: "Skip it, stay comfortable",
        emoji: "🏠",
        futureImpact: { career: -1, confidence: -1 },
        weeksShift: 1,
        narration:
          "Understandable. But growth was never going to come from the comfortable option — {weeks} weeks slower this time.",
      },
    ],
  },
  {
    id: "big-trip-deposit",
    areas: ["travel", "money", "love"],
    prompt: "A big trip you've been dreaming about needs a non-refundable deposit today.",
    choices: [
      {
        id: "commit",
        label: "Commit — pay the deposit",
        emoji: "🌍",
        futureImpact: { travel: 7, money: -3, confidence: 2 },
        weeksShift: 1,
        narration:
          "We only get one shot at some of these windows. Worth the {weeks} week tradeoff on the money goal.",
      },
      {
        id: "wait-save-more",
        label: "Wait and save more first",
        emoji: "🐢",
        futureImpact: { money: 2, travel: -1 },
        weeksShift: -1,
        narration:
          "Cautious, and not wrong. {weeks} weeks closer on money, but let's not let 'someday' become the whole travel goal.",
      },
    ],
  },
];

/**
 * Deterministic "today's decision" — prioritises scenarios touching the
 * user's chosen areas, skips ones already answered until the pool is
 * exhausted, then cycles.
 */
export function getTodayScenario(
  dateKey: string,
  selectedAreas: AreaId[],
  decisions: DecisionLogEntry[],
): DecisionScenario {
  const answeredIds = new Set(decisions.map((d) => d.scenarioId));
  const relevant = SCENARIOS.filter((s) =>
    s.areas.some((a) => selectedAreas.includes(a)),
  );
  const pool = relevant.length > 0 ? relevant : SCENARIOS;
  const unanswered = pool.filter((s) => !answeredIds.has(s.id));
  const candidates = unanswered.length > 0 ? unanswered : pool;

  const seed = hashString(dateKey);
  return candidates[seed % candidates.length];
}

export function getScenarioAnsweredToday(
  dateKey: string,
  decisions: DecisionLogEntry[],
): DecisionLogEntry | undefined {
  return decisions.find((d) => d.date === dateKey);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
