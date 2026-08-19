-- Local-dev fixture: one demo user with a financial goal and a week of
-- activity, useful for exercising the schema (and eventually a real
-- DatabaseService adapter) without going through onboarding by hand.
--
-- Requires a matching row in auth.users first, e.g. via the Supabase CLI:
--   supabase auth admin create-user --email demo@example.com
-- then substitute its id below.

do $$
declare
  demo_user_id uuid := '00000000-0000-0000-0000-000000000001';
  demo_goal_id uuid := gen_random_uuid();
  action_id uuid;
begin
  insert into profiles (id, name, avatar_emoji, target_date, selected_categories)
  values (demo_user_id, 'Monique', '👩🏾', current_date + interval '12 months', array['financial', 'career', 'fitness'])
  on conflict (id) do nothing;

  insert into goals (id, user_id, category, metric_type, label, baseline, target, deadline, weight, onboarding_daily_rate)
  values (demo_goal_id, demo_user_id, 'financial', 'cumulative', 'Save £10,000', 0, 10000, current_date + interval '12 months', 0.34, 4.1)
  on conflict do nothing;

  insert into actions (id, user_id, occurred_at, source, xp)
  values (gen_random_uuid(), demo_user_id, now() - interval '1 day', 'mission_completed', 75)
  returning id into action_id;

  insert into action_impacts (action_id, goal_id, delta, delta_type)
  values (action_id, demo_goal_id, 30, 'direct');

  insert into mission_completions (user_id, action_id, occurred_on, template_id, xp)
  values (demo_user_id, action_id, current_date - 1, 'no-spend', 75);
end $$;
