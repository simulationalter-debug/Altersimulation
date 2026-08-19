"use client";

import Link from "next/link";
import { useAppStore } from "@/hooks/useAppStore";
import { pickDailyMissions } from "@/data/mission-templates";
import { todayKey } from "@/utils/date";
import Card from "@/components/cards/Card";
import PageHeader from "@/components/navigation/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function MissionsPage() {
  const futureSelf = useAppStore((s) => s.futureSelf);
  const actions = useAppStore((s) => s.actions);
  if (!futureSelf) return null;

  const dateKey = todayKey();
  const missions = pickDailyMissions(dateKey, futureSelf.selectedCategories);
  const doneToday = missions.filter((m) => actions.some((a) => a.actionId === `mission:${dateKey}:${m.id}`));

  return (
    <div>
      <PageHeader title="Today's Missions" backHref={ROUTES.home} />

      <div className="space-y-4 px-4 py-6">
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

        <div className="space-y-3">
          {missions.map((m) => {
            const done = actions.some((a) => a.actionId === `mission:${dateKey}:${m.id}`);
            return (
              <Link key={m.id} href={`${ROUTES.missions}/${m.id}`} className="block">
                <Card
                  className={`flex items-center justify-between gap-3 transition ${
                    done ? "border-[#22c55e]/30 bg-[#22c55e]/[0.06]" : "hover:border-white/25"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
                        done ? "border-[#22c55e]/60 bg-[#22c55e]/20" : "border-white/20"
                      }`}
                    >
                      {done ? "✓" : m.emoji}
                    </span>
                    <span className={`font-medium ${done ? "text-white/50 line-through" : ""}`}>{m.label}</span>
                  </span>
                  <span className={`text-sm font-semibold ${done ? "text-[#a6f0af]" : "text-white/50"}`}>
                    +{m.xp} XP
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
