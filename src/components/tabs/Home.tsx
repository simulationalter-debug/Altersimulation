import { useEngineSnapshot } from "../../lib/useEngineSnapshot";
import { AREA_MAP } from "../../data/areas";
import { pickDailyMissions } from "../../data/missions";
import { getTodayScenario, getScenarioAnsweredToday } from "../../data/scenarios";
import Card from "../ui/Card";
import type { Overlay } from "../Dashboard";
import { daysBetween } from "../../lib/date";
import { useStore } from "../../store";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function Home({ onOpen }: { onOpen: (o: Overlay) => void }) {
  const snap = useEngineSnapshot();
  const toggleMission = useStore((s) => s.toggleMission);
  const { futureSelf, ctx, xp, level, xpIntoLevel, xpForNextLevel, streak, week, dateKey } = snap;
  if (!futureSelf) return null;

  const dayNumber = daysBetween(futureSelf.createdAt, new Date().toISOString()) + 1;
  const avgGhostPct =
    ctx.goals.length > 0
      ? Math.round(ctx.goals.reduce((a, g) => a + g.ghostTimelinePct, 0) / ctx.goals.length)
      : 50;
  const avgGap =
    ctx.goals.length > 0 ? ctx.goals.reduce((a, g) => a + g.ghostGap, 0) / ctx.goals.length : 0;

  const missions = pickDailyMissions(dateKey, futureSelf.selectedCategories);
  const doneToday = missions.filter((m) =>
    snap.actions.some((a) => a.actionId === `mission:${dateKey}:${m.id}`),
  );

  const scenario = getTodayScenario(dateKey, futureSelf.selectedCategories, snap.decisionLog);
  const answeredToday = getScenarioAnsweredToday(dateKey, snap.decisionLog);

  return (
    <div className="space-y-5 px-4 pt-6">
      <div>
        <h1 className="text-xl font-bold">
          Good {timeOfDay()}, {futureSelf.name} {futureSelf.avatarEmoji}
        </h1>
        <p className="mt-0.5 text-sm text-white/40">Day {dayNumber} of your journey</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="border-[#a855f7]/30 bg-gradient-to-br from-[#ec4899]/15 to-[#a855f7]/10">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
            ✨ Future You
          </p>
          <p className="mt-2 text-lg font-bold">Level {level}</p>
          <p className="text-xs text-white/50">{xp.toLocaleString()} XP</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="grad-primary animate-bar h-full rounded-full"
              style={{ width: `${(xpIntoLevel / xpForNextLevel) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-white/40">{xpForNextLevel - xpIntoLevel} XP to next level</p>
        </Card>

        <Card className="border-white/10 bg-white/[0.03]">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-white/50">👻 Ghost You</p>
          <p className="mt-2 text-lg font-bold text-white/70">{avgGhostPct}%</p>
          <p className="text-xs text-white/40">on pace, on autopilot</p>
          <p
            className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              avgGap >= 0
                ? "bg-[#22c55e]/15 text-[#7ee787]"
                : "bg-[#ef4444]/15 text-[#ff9f9f]"
            }`}
          >
            {avgGap >= 0 ? `You're ${Math.round(avgGap)} pts ahead` : "Falling behind"}
          </p>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-white/70">Life scores</p>
          <p className="text-[10px] text-white/30">updated today</p>
        </div>
        <div className="space-y-3">
          {ctx.goals.map((g) => {
            const area = AREA_MAP[g.category];
            return (
              <div key={g.goalId}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">
                    {area.emoji} {area.label}
                  </span>
                  <span className="font-semibold text-white/90">{Math.round(g.timelinePct)}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="animate-bar h-full rounded-full"
                    style={{ width: `${g.timelinePct}%`, background: area.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-white/70">
            🔥 {streak}-day streak
          </p>
        </div>
        <div className="flex justify-between">
          {week.map((d) => {
            const dow = new Date(d.date).getDay();
            const isToday = d.date === dateKey;
            return (
              <div key={d.date} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-white/30">{WEEKDAY_LABELS[dow]}</span>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                    d.active
                      ? "grad-primary text-white"
                      : isToday
                        ? "border border-dashed border-white/30 text-white/30"
                        : "bg-white/5 text-white/20"
                  }`}
                >
                  {d.active ? "✓" : ""}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-white/70">Today's missions</p>
          <p className="text-xs text-white/40">
            {doneToday.length}/{missions.length} completed
          </p>
        </div>
        <div className="space-y-2">
          {missions.map((m) => {
            const done = snap.actions.some((a) => a.actionId === `mission:${dateKey}:${m.id}`);
            return (
              <div
                key={m.id}
                data-testid="mission-row"
                role="button"
                tabIndex={0}
                onClick={() => onOpen({ type: "mission", missionId: m.id })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onOpen({ type: "mission", missionId: m.id });
                }}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${
                  done ? "border-[#22c55e]/30 bg-[#22c55e]/[0.06]" : "border-white/10 bg-white/[0.02] hover:border-white/25"
                }`}
              >
                <span className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMission(m.id, m.categoryImpacts, m.xp, dateKey);
                    }}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                      done ? "border-[#22c55e]/60 bg-[#22c55e]/20 text-[#7ee787]" : "border-white/20"
                    }`}
                  >
                    {done ? "✓" : ""}
                  </button>
                  <span className={`text-sm ${done ? "text-white/50 line-through" : "text-white/85"}`}>
                    {m.emoji} {m.label}
                  </span>
                </span>
                <span className="text-xs font-semibold text-white/40">+{m.xp} XP</span>
              </div>
            );
          })}
        </div>
      </Card>

      <button onClick={() => onOpen({ type: "decision" })} className="block w-full text-left">
        <Card className="border-[#a855f7]/30 bg-gradient-to-br from-[#ec4899]/10 to-[#a855f7]/10 transition hover:border-[#a855f7]/50">
          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
            {answeredToday ? "Today's decision — answered" : "Today's decision"}
          </p>
          <p className="mt-1.5 text-base font-semibold">{scenario.prompt}</p>
          <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#f0abfc]">
            {answeredToday ? "See what changed" : "Make the decision"} →
          </p>
        </Card>
      </button>
    </div>
  );
}

function timeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}
