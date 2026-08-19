"use client";

import { useAppStore } from "@/hooks/useAppStore";
import { MISSION_POOL } from "@/data/mission-templates";
import { todayKey } from "@/utils/date";
import Card from "@/components/cards/Card";
import ProgressRing from "@/components/progress/ProgressRing";
import PageHeader from "@/components/navigation/PageHeader";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import GhostButton from "@/components/buttons/GhostButton";
import { ROUTES } from "@/constants/routes";

const STEPS = ["Plan it", "Do it", "Log it in ALTER"];

export default function MissionDetailClient({ missionId }: { missionId: string }) {
  const template = MISSION_POOL.find((m) => m.id === missionId);
  const futureSelf = useAppStore((s) => s.futureSelf);
  const actions = useAppStore((s) => s.actions);
  const toggleMission = useAppStore((s) => s.toggleMission);

  if (!template || !futureSelf) {
    return (
      <div>
        <PageHeader title="Mission" backHref={ROUTES.missions} />
        <p className="px-4 py-10 text-center text-sm text-white/40">Mission not found.</p>
      </div>
    );
  }

  const dateKey = todayKey();
  const done = actions.some((a) => a.actionId === `mission:${dateKey}:${template.id}`);

  return (
    <div>
      <PageHeader title="Mission" backHref={ROUTES.missions} />

      <div className="px-4 py-6">
        <div className="flex flex-col items-center pt-4">
          <ProgressRing percent={done ? 100 : 0} size={160} thickness={16}>
            <span className="text-3xl">{template.emoji}</span>
            <span className="mt-1 text-sm font-bold text-white">+{template.xp} XP</span>
          </ProgressRing>
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

        {done ? (
          <GhostButton
            className="mt-6 w-full"
            onClick={() => toggleMission(template.id, template.categoryImpacts, template.xp, dateKey)}
          >
            Mark as not done
          </GhostButton>
        ) : (
          <PrimaryButton
            className="mt-6 w-full py-3.5"
            onClick={() => toggleMission(template.id, template.categoryImpacts, template.xp, dateKey)}
          >
            Mission Complete! 🎉
          </PrimaryButton>
        )}

        {done && (
          <Card className="mt-4 animate-rise">
            <p className="text-xs font-semibold text-white/40">{futureSelf.name} says</p>
            <p className="mt-1.5 text-sm italic text-white/85">&quot;Every rep is a vote for the life we want.&quot;</p>
          </Card>
        )}
      </div>
    </div>
  );
}
