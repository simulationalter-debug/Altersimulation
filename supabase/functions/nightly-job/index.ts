// Supabase Edge Function (Deno) — placeholder for the §6 "nightly job":
// mission generation + inaction handling, run once per user per day.
//
// NOT DEPLOYED. This is a structural skeleton so the intended shape of
// the job lives next to the schema it reads/writes. To activate it:
//   1. `supabase functions deploy nightly-job`
//   2. schedule it (Supabase cron, or an external scheduler) to POST here daily
//   3. replace the TODOs with real queries against the tables in
//      supabase/migrations/0001_init.sql
//
// Note: the client-side engine (features/simulations/engine) already gets
// "silence decays the model" for free — EWMA is computed over a 28-day
// window that includes zero-delta days, so a user who does nothing sees
// their projected_rate decay without any server job. This function's job
// is narrower: generate tomorrow's mission slots server-side (so they're
// consistent across devices) and flag genuinely stale goals for the
// Ask Future Me / notifications layer, per spec §6.

interface NightlyJobResult {
  usersProcessed: number;
  missionsGenerated: number;
}

Deno.serve(async (_req: Request) => {
  // TODO: for each active profile:
  //   - compute pace_ratio and staleness per goal (reuse the engine's
  //     computeGoalPayload logic — port it, or call out to a shared
  //     package, rather than reimplementing the math here)
  //   - select Main Quest / Quick Win / rotating third slot per §6
  //   - insert tomorrow's mission_completions placeholders (status:
  //     'pending') so the client just marks them done instead of
  //     picking from the static pool
  //   - if daysSinceLastAction crosses the low-state threshold (§7),
  //     write a flag the notifications service can read

  const result: NightlyJobResult = { usersProcessed: 0, missionsGenerated: 0 };
  return new Response(JSON.stringify(result), {
    headers: { "content-type": "application/json" },
  });
});
