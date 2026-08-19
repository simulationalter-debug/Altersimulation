# Database schema

**Status: not connected.** The app currently persists everything to
`localStorage` via `hooks/useAppStore.ts` (zustand `persist`). No
Supabase project is wired up. This document describes the schema in
`supabase/migrations/0001_init.sql`, written so a real backend can be
connected later without changing the engine or the app's data shapes.

## Design

The schema mirrors `features/simulations/engine/types.ts` and the
"ALTER Simulation Engine Specification v0.1" §10 (see
`docs/product/engine-spec.md`), adapted to the engine's actual field
names:

- `profiles` — one row per user (Future Self identity: name, avatar,
  target date, selected categories). `id` matches `auth.users.id`.
- `goals` — category, metric_type, baseline/target/deadline, weight,
  `onboarding_daily_rate` (Ghost's cold-start seed). A check constraint
  enforces the §7 safety rail that fitness goals must use
  `metric_type = 'frequency'`.
- `actions` + `action_impacts` — the append-only event log the engine
  replays; one action can impact multiple goals (§1.2).
- `decisions` — one row per decision made, storing the engine's
  computed `time_shift_days` / `timeline_pct_change` / `tradeoffs` at
  the moment it was applied (§4) — never recomputed retroactively.
- `mission_completions` — references a `template_id` from the static
  catalog in `data/mission-templates` (application code, not a table).
- `journal_entries`, `chat_messages` — as named.
- `ghost_baselines` — Ghost's per-goal floor state (§3).
- `trajectories` — optional daily snapshot table (§2, §10) for a future
  Life Replay / "what if I'd chosen differently" fork view; the current
  client doesn't need it (it replays from `actions` on every read).

Every table has Row Level Security enabled, scoped to `auth.uid()` —
see `services/auth` for the (currently local-only) auth boundary this
assumes.

## Connecting a real project

1. `supabase init` / point the CLI at a real project.
2. `supabase db push` to apply `supabase/migrations/0001_init.sql`.
3. Implement `DatabaseService` (`services/database/index.ts`) against
   the Supabase JS client.
4. Swap `hooks/useAppStore.ts`'s zustand `persist` storage for calls
   through that service (or keep localStorage as an offline cache and
   sync in the background — either is additive, not a rewrite, because
   every component already reads through the store, not localStorage
   directly).
