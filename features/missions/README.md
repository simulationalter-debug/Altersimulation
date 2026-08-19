# features/missions

No dedicated module yet — mission selection is a pure function
(`pickDailyMissions` in `data/mission-templates`) and completion is
handled directly by `hooks/useAppStore.ts`'s `toggleMission`. This
folder is reserved for mission logic that grows beyond that — e.g. the
real nightly-job-driven selection described in engine spec §6 (Main
Quest / Quick Win / rotating third slot, weighted by `pace_ratio` and
staleness) once `supabase/functions/nightly-job` is implemented, which
would replace today's deterministic pool-shuffle.
