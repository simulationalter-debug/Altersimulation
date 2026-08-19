# ALTER — The AI Life Simulator

"Meet the version of you who made the other choice."

ALTER is an interactive web app where you build your Future Self, make
real-world decisions, complete daily missions, and watch two timelines
unfold side by side: the person you're becoming (**Future You**) and
where your current habits lead if nothing changes (**Ghost You**). See
`docs/product/pitch.md` for the full product pitch.

## Core loop

See `docs/user-flows/core-loop.md` for the full route-by-route flow.

1. **Onboarding** (`/onboarding`) — pick your focus areas, build your
   Future Self, set one real target per area.
2. **Daily Decision** (`/decisions`) — a scenario grounded in your
   goals. Preview the impact of each option before committing.
3. **Future You / Ghost You** (`/future-you`, `/ghost-you`) — per-goal
   timelines that diverge based on what you actually do.
4. **Missions** (`/missions`) — small daily actions worth XP, with
   streaks and levels.
5. **Ask Future Me** (`/ask-future-me`) — a chat with your own Future
   Self, grounded in your goals, decisions, and journal entries.
6. **Timeline** (`/timeline`) — a unified activity feed.
7. **Paywall** (`/paywall`) — Free / ALTER+ / ALTER Together / ALTER
   Family tiers.

## Architecture

```
app/            Next.js App Router routes (one folder per screen)
components/     UI building blocks (buttons, cards, progress, modals, navigation, avatar)
features/       Product logic above the engine (goals, missions, xp, streaks, achievements, simulations, future-self, ghost-self)
services/       External-system boundaries (ai, auth, database, payments, notifications, analytics) — see below
data/           Static content (mission templates, life categories, decision scenarios, xp rules, achievements)
hooks/          App state (useAppStore, zustand+localStorage) and derived-data hooks
utils/          Framework-agnostic helpers (dates)
types/          App-level shared types
constants/      Routes/nav config
supabase/       Forward-looking schema (migrations), seed data, and an edge function skeleton — not connected to a live project
docs/           Product spec, engine spec, user flows, wireframe/mockup notes, database notes
tests/          Vitest unit tests (the engine's 18 tests, currently)
```

The **simulation engine** (`features/simulations/engine/`) is the one
part of this app that's a pure, dependency-free TypeScript module — see
`docs/product/engine-spec.md` for the full spec it implements (goals,
EWMA trajectories, the tanh confidence curve, Ghost You's cold-start/
warm-blend model, decision time-shift math, the decision simulator, and
safety rails). Every number the UI shows is read from this engine's
output, never computed ad hoc in a component.

## Current state vs. target architecture

- **No live backend.** Everything persists to `localStorage` via
  `hooks/useAppStore.ts`. `supabase/migrations/0001_init.sql` defines
  the schema a real Supabase project would use; `services/database`
  documents the interface that would sit between the store and it.
- **No real auth, payments, or push notifications.** `services/auth`,
  `services/payments`, and `services/notifications` are typed
  interfaces with local/no-op implementations, ready to swap for real
  providers.
- **"Ask Future Me" is not an LLM call.** `services/ai` implements the
  engine spec's §9 contract (numbers only ever come from the engine
  payload) with a deterministic, keyword-routed generator — see the
  note in `docs/product/engine-spec.md` §9.

## Tech

- Next.js (App Router) + React + TypeScript
- Tailwind CSS for styling
- Zustand (`localStorage`-persisted) for client state
- Vitest for the engine's unit tests

## Development

```bash
npm install
npm run dev     # Next.js dev server
npm run build   # production build (static export, output: "export")
npm run test    # vitest — engine unit tests
npm run lint    # eslint
```

## Running as a native app

The build is a fully static export (no server needed at runtime), so
it's wrapped with [Capacitor](https://capacitorjs.com) into real
`android/` and `ios/` native projects, ready to open in Android
Studio's emulator or Xcode's Simulator. See `docs/mobile-app.md` for
the full setup (`npm run cap:android` / `npm run cap:ios`) — building
and running the native projects needs tools this repo's dev
environment may not have (Xcode requires macOS; Android Studio needs a
local install), so that part happens on your own machine.
