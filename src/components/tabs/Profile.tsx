import { useEngineSnapshot } from "../../lib/useEngineSnapshot";
import { computeCurrentValue } from "../../engine";
import { GOAL_TEMPLATES } from "../../data/goalTemplates";
import { AREA_MAP } from "../../data/areas";
import Card from "../ui/Card";
import type { Overlay } from "../Dashboard";
import { useStore } from "../../store";

export default function Profile({ onOpen }: { onOpen: (o: Overlay) => void }) {
  const snap = useEngineSnapshot();
  const resetSimulation = useStore((s) => s.resetSimulation);
  const { futureSelf, goals, actions, decisionLog, ctx, level } = snap;
  if (!futureSelf) return null;

  const asOf = new Date().toISOString();
  const overallProgress =
    ctx.goals.length > 0
      ? Math.round(ctx.goals.reduce((a, g) => a + g.timelinePct, 0) / ctx.goals.length)
      : 0;

  const goalsCompleted = goals.filter((g) => {
    const cv = computeCurrentValue(g, actions, asOf);
    return cv >= g.target;
  }).length;
  const missionsCompleted = actions.filter((a) => a.source === "mission_completed").length;

  return (
    <div className="space-y-5 px-4 pt-6">
      <div className="flex items-center gap-3">
        <div className="grad-primary flex h-16 w-16 items-center justify-center rounded-full text-3xl">
          {futureSelf.avatarEmoji}
        </div>
        <div>
          <h1 className="text-lg font-bold">{futureSelf.name}</h1>
          <p className="text-xs text-white/50">Level {level}</p>
          <span className="mt-1 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60">
            ✨ Alter Member
          </span>
        </div>
      </div>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/40">12-month progress</p>
        <div className="mt-4 flex items-center gap-5">
          <div
            className="grad-ring flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundImage: `conic-gradient(#ec4899 ${overallProgress * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
            }}
          >
            <div className="flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-full bg-[#0a0813]">
              <span className="text-lg font-bold">{overallProgress}%</span>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-y-3 text-xs">
            <Stat label="Goals completed" value={`${goalsCompleted}/${goals.length}`} />
            <Stat label="Missions done" value={String(missionsCompleted)} />
            <Stat label="Decisions made" value={String(decisionLog.length)} />
            <Stat label="Current streak" value={`${snap.streak}d`} />
          </div>
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Key goals</p>
        <div className="space-y-4">
          {goals.map((g) => {
            const template = GOAL_TEMPLATES[g.category];
            const area = AREA_MAP[g.category];
            const cv = computeCurrentValue(g, actions, asOf);
            const pct = g.target !== 0 ? Math.min(100, Math.max(0, (cv / g.target) * 100)) : 0;
            return (
              <div key={g.goalId}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">
                    {area.emoji} {g.label}
                  </span>
                  <span className="text-xs text-white/40">
                    {template.formatValue(Math.max(0, cv))} / {template.formatValue(g.target)}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="grad-primary animate-bar h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <button onClick={() => onOpen({ type: "pricing" })} className="block w-full text-left">
        <Card className="border-[#a855f7]/30 bg-gradient-to-br from-[#ec4899]/10 to-[#a855f7]/10 transition hover:border-[#a855f7]/50">
          <p className="text-sm font-semibold">✨ Upgrade to ALTER+</p>
          <p className="mt-1 text-xs text-white/50">Unlock unlimited goals, Ghost Timeline, and more.</p>
        </Card>
      </button>

      <button
        onClick={() => {
          if (confirm("Reset your entire simulation? This can't be undone.")) resetSimulation();
        }}
        className="w-full pb-4 text-center text-xs text-white/30 underline decoration-white/20 underline-offset-2 hover:text-white/50"
      >
        Reset simulation
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold text-white">{value}</p>
      <p className="text-white/40">{label}</p>
    </div>
  );
}
