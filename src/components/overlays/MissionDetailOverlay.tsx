import { useStore } from "../../store";
import { MISSION_POOL } from "../../data/missions";
import { todayKey } from "../../lib/date";
import OverlayShell from "./OverlayShell";
import Card from "../ui/Card";

const STEPS = ["Plan it", "Do it", "Log it in ALTER"];

export default function MissionDetailOverlay({
  missionId,
  onClose,
}: {
  missionId: string;
  onClose: () => void;
}) {
  const template = MISSION_POOL.find((m) => m.id === missionId);
  const futureSelf = useStore((s) => s.futureSelf);
  const actions = useStore((s) => s.actions);
  const toggleMission = useStore((s) => s.toggleMission);
  if (!template || !futureSelf) return null;

  const dateKey = todayKey();
  const done = actions.some((a) => a.actionId === `mission:${dateKey}:${template.id}`);

  return (
    <OverlayShell title="Mission" onClose={onClose}>
      <div className="flex flex-col items-center pt-4">
        <div
          className={`grad-ring flex h-40 w-40 items-center justify-center rounded-full ${done ? "" : "opacity-90"}`}
        >
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#0a0813]">
            <span className="text-3xl">{template.emoji}</span>
            <span className="mt-1 text-sm font-bold text-white">+{template.xp} XP</span>
          </div>
        </div>
        <h1 className="mt-5 text-xl font-bold">{template.label}</h1>
        <p className="mt-1 text-sm text-white/40">Your effort, your future.</p>
      </div>

      <Card className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Mission steps</p>
        <div className="space-y-2.5">
          {STEPS.map((step) => (
            <div key={step} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                  done ? "border-[#22c55e]/60 bg-[#22c55e]/20 text-[#7ee787]" : "border-white/25 text-transparent"
                }`}
              >
                ✓
              </span>
              <span className={done ? "text-white/50 line-through" : "text-white/80"}>{step}</span>
            </div>
          ))}
        </div>
      </Card>

      <button
        onClick={() => toggleMission(template.id, template.categoryImpacts, template.xp, dateKey)}
        className={`mt-6 w-full rounded-full py-3.5 text-sm font-semibold transition ${
          done ? "border border-white/15 text-white/70" : "grad-primary text-white"
        }`}
      >
        {done ? "Mark as not done" : "Mission Complete! 🎉"}
      </button>

      {done && (
        <Card className="mt-4 animate-rise">
          <p className="text-xs font-semibold text-white/40">{futureSelf.name} says</p>
          <p className="mt-1.5 text-sm italic text-white/85">"Every rep is a vote for the life we want."</p>
        </Card>
      )}
    </OverlayShell>
  );
}
