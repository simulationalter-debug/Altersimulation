-- ALTER — initial schema.
-- Mirrors the engine's Goal/Action/Decision model (see
-- features/simulations/engine/types.ts and docs/database/schema.md) plus
-- the "ALTER Simulation Engine Specification v0.1" §10.
--
-- No live Supabase project is connected yet — the app runs entirely on
-- localStorage (hooks/useAppStore). This migration is forward-looking:
-- apply it with `supabase db push` / `supabase migration up` once a
-- project exists, then implement services/database's DatabaseService
-- against it.

create extension if not exists "pgcrypto";

-- One row per authenticated user. `id` matches auth.users.id when
-- Supabase Auth is wired up (see services/auth).
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  name text not null,
  avatar_emoji text not null,
  target_date date not null,
  selected_categories text[] not null default '{}'
);

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  category text not null check (
    category in (
      'financial', 'fitness', 'career', 'relationship',
      'travel', 'lifestyle', 'confidence', 'family'
    )
  ),
  metric_type text not null check (metric_type in ('cumulative', 'rate', 'frequency', 'milestone')),
  label text not null,
  baseline numeric not null default 0,
  target numeric not null,
  deadline date not null,
  created_at timestamptz not null default now(),
  weight numeric not null default 1 check (weight >= 0 and weight <= 1),
  onboarding_daily_rate numeric not null default 0,
  stages jsonb,
  status text not null default 'active' check (status in ('active', 'completed', 'abandoned'))
);
create index if not exists goals_user_id_idx on goals (user_id);

-- Fitness goals are restricted to metric_type = 'frequency' (safety rail,
-- §7 — see features/simulations/engine/safety.ts for the client-side
-- mirror of this constraint).
alter table goals add constraint fitness_goals_frequency_only
  check (category <> 'fitness' or metric_type = 'frequency');

create table if not exists actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  occurred_at timestamptz not null default now(),
  source text not null check (
    source in ('mission_completed', 'decision_made', 'manual_log', 'journal_extracted')
  ),
  xp integer not null default 0,
  raw_note text
);
create index if not exists actions_user_id_occurred_at_idx on actions (user_id, occurred_at);

create table if not exists action_impacts (
  action_id uuid not null references actions (id) on delete cascade,
  goal_id uuid not null references goals (id) on delete cascade,
  delta numeric not null,
  delta_type text not null check (delta_type in ('direct', 'behavioural')),
  primary key (action_id, goal_id)
);

-- One row per decision made (§4). `time_shift_days` and
-- `timeline_pct_change` are the engine's computed output at the moment
-- the decision was applied — stored for history/display, never
-- recomputed retroactively.
create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  action_id uuid references actions (id) on delete set null,
  occurred_on date not null,
  scenario_id text not null,
  choice_id text not null,
  goal_id uuid references goals (id) on delete set null,
  time_shift_days integer not null default 0,
  timeline_pct_change numeric not null default 0,
  tradeoffs jsonb not null default '[]'
);
create index if not exists decisions_user_id_idx on decisions (user_id);

-- One row per completed mission instance. `template_id` refers to the
-- static mission catalog in data/mission-templates (application code,
-- not a DB table — see that file's comment).
create table if not exists mission_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  action_id uuid references actions (id) on delete set null,
  occurred_on date not null,
  template_id text not null,
  xp integer not null default 0,
  unique (user_id, occurred_on, template_id)
);

create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  action_id uuid references actions (id) on delete set null,
  occurred_on date not null,
  text text not null,
  sentiment numeric
);
create index if not exists journal_entries_user_id_idx on journal_entries (user_id);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  role text not null check (role in ('user', 'future-self')),
  text text not null,
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_user_id_idx on chat_messages (user_id);

-- Ghost You's per-goal floor state (§3). Revised slowly — see
-- features/simulations/engine/ghost.ts for the algorithm this persists.
create table if not exists ghost_baselines (
  goal_id uuid primary key references goals (id) on delete cascade,
  onboarding_rate numeric not null,
  floor_rate numeric not null,
  consecutive_improved_weeks integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Daily timeline_pct snapshot per goal (§2 smoothing, §10). Not required
-- for the current client (which replays from `actions` on every read),
-- but this is what makes a future Life Replay / "what if" fork view
-- cheap: read history instead of recomputing it.
create table if not exists trajectories (
  goal_id uuid not null references goals (id) on delete cascade,
  on_date date not null,
  future_rate numeric not null,
  ghost_rate numeric not null,
  timeline_pct_raw numeric not null,
  timeline_pct_displayed numeric not null,
  primary key (goal_id, on_date)
);

-- Row Level Security: every table is scoped to auth.uid() once Supabase
-- Auth is wired up (see services/auth). No policies are permissive by
-- default — nothing is readable/writable until a real auth session
-- exists.
alter table profiles enable row level security;
alter table goals enable row level security;
alter table actions enable row level security;
alter table action_impacts enable row level security;
alter table decisions enable row level security;
alter table mission_completions enable row level security;
alter table journal_entries enable row level security;
alter table chat_messages enable row level security;
alter table ghost_baselines enable row level security;
alter table trajectories enable row level security;

create policy "own profile" on profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "own goals" on goals for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own actions" on actions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own action impacts" on action_impacts for all using (
  exists (select 1 from actions a where a.id = action_impacts.action_id and a.user_id = auth.uid())
);
create policy "own decisions" on decisions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own mission completions" on mission_completions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own journal entries" on journal_entries for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own chat messages" on chat_messages for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own ghost baselines" on ghost_baselines for all using (
  exists (select 1 from goals g where g.id = ghost_baselines.goal_id and g.user_id = auth.uid())
);
create policy "own trajectories" on trajectories for all using (
  exists (select 1 from goals g where g.id = trajectories.goal_id and g.user_id = auth.uid())
);
