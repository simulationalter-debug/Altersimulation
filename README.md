# ALTER — The AI Life Simulator

"Meet the version of you who made the other choice."

ALTER is an interactive web app where you build your Future Self, make
real-world decisions, complete daily missions, and watch two timelines
unfold side by side: the person you're becoming (**Future You**) and
where your current habits lead if nothing changes (**Ghost You**).

## Core loop

1. **Onboarding** — pick your focus areas (Love, Money, Career, Lifestyle,
   Travel, Confidence, Body/Fitness, Family) and build your Future Self —
   a name, a target date, and headline goals.
2. **Daily Decision** — a scenario grounded in your goals with several
   choices. Each choice shifts your timeline stats and nudges your
   target date.
3. **Timelines** — Future You vs Ghost You, rendered as stat bars that
   diverge over time based on what you actually do.
4. **Missions** — small daily actions worth XP, with streaks, levels, and
   milestones.
5. **Ask Future Me** — a chat with your own Future Self, grounded in your
   goals, decisions, journal entries, and mission history (no generic
   assistant framing).
6. **Pricing** — Free / ALTER+ / ALTER Together / ALTER Family tiers, as
   described in product materials.

## Tech

- React + TypeScript + Vite
- Tailwind CSS for styling
- Zustand (`localStorage`-persisted) for state — the whole simulation
  runs client-side, no backend required for the MVP

## Development

```bash
npm install
npm run dev
```

## Notes on "AI"

`Ask Future Me` and the decision-impact narration are implemented as a
deterministic, context-aware response engine (no external LLM call) so
the app runs fully offline. It reads from the same goal/decision/mission
state the rest of the app uses, which is the important part: responses
get more specific as your history accumulates.
