import { useStore } from "../../store";
import type { DerivedProgress } from "../../types";
import { pickDailyMissions } from "../../data/missions";
import { todayKey } from "../../lib/date";
import { AREA_MAP } from "../../data/areas";
import Card from "../ui/Card";

export default function Missions({ derived }: { derived: DerivedProgress }) {
  const futureSelf = useStore((s) => s.futureSelf);
  const completedMissions = useStore((s) => s.completedMissions);
  const toggleMission = useStore((s) => s.toggleMission);
  if (!futureSelf) return null;

  const dateKey = todayKey();
  const missions = pickDailyMissions(dateKey, futureSelf.selectedAreas);
  const doneToday = missions.filter((m) =>
    completedMissions.some((cm) => cm.missionId === m.id && cm.date === dateKey),
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Today's missions</h1>
          <p className="mt-1 text-white/50">Complete them and your timeline evolves.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
          🔥 {derived.streak}-day streak
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Progress today</span>
          <span className="font-semibold">
            {doneToday.length}/{missions.length}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="animate-bar h-full rounded-full bg-gradient-to-r from-[#7ee787] to-[#3fd0c9]"
            style={{ width: `${(doneToday.length / missions.length) * 100}%` }}
          />
        </div>
      </Card>

      <div className="grid gap-3">
        {missions.map((m) => {
          const done = completedMissions.some((cm) => cm.missionId === m.id && cm.date === dateKey);
          return (
            <button
              key={m.id}
              onClick={() => toggleMission(m.id)}
              className={`flex items-center justify-between gap-4 rounded-xl border p-4 text-left transition ${
                done
                  ? "border-[#7ee787]/40 bg-[#7ee787]/[0.08]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/25"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
                    done ? "border-[#7ee787]/60 bg-[#7ee787]/20" : "border-white/20"
                  }`}
                >
                  {done ? "✓" : m.emoji}
                </span>
                <span>
                  <span className={`block font-medium ${done ? "text-white/50 line-through" : ""}`}>
                    {m.label}
                  </span>
                  <span className="text-xs text-white/35">
                    {m.areas.map((a) => AREA_MAP[a].label).join(" · ")}
                  </span>
                </span>
              </span>
              <span className={`text-sm font-semibold ${done ? "text-[#a6f0af]" : "text-white/50"}`}>
                +{m.xp} XP
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
