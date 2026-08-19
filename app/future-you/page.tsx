"use client";

import Link from "next/link";
import { useEngineSnapshot } from "@/hooks/useEngineSnapshot";
import { computeCurrentValue } from "@/features/simulations/engine";
import { GOAL_TEMPLATES } from "@/data/life-categories/goalTemplates";
import { AREA_MAP } from "@/data/life-categories/areas";
import Card from "@/components/cards/Card";
import ProgressBar from "@/components/progress/ProgressBar";
import PageHeader from "@/components/navigation/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function FutureYouPage() {
  const snap = useEngineSnapshot();
  const { futureSelf, goals, actions, ctx } = snap;
  if (!futureSelf) return null;

  const asOf = new Date().toISOString();
  const overallScore =
    ctx.goals.length > 0 ? Math.round(ctx.goals.reduce((a, g) => a + g.timelinePct, 0) / ctx.goals.length) : 0;

  return (
    <div>
      <PageHeader title="Future You" backHref={ROUTES.home} />

      <div className="space-y-5 px-4 py-6">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#a855f7]/40 bg-gradient-to-br from-[#ec4899]/20 to-[#a855f7]/15 text-4xl">
            {futureSelf.avatarEmoji}
          </div>
          <h1 className="mt-3 text-xl font-bold">Future {futureSelf.name}</h1>
          <p className="text-sm text-white/50">{overallScore}% on the way there</p>
        </div>

        <Card>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Per-goal timeline</p>
          <div className="space-y-4">
            {goals.map((g) => {
              const area = AREA_MAP[g.category];
              const template = GOAL_TEMPLATES[g.category];
              const payload = ctx.goals.find((p) => p.goalId === g.goalId);
              const cv = computeCurrentValue(g, actions, asOf);
              return (
                <div key={g.goalId}>
                  <ProgressBar
                    label={g.label}
                    emoji={area.emoji}
                    value={payload?.timelinePct ?? 50}
                    color={area.color}
                  />
                  <p className="mt-1 text-xs text-white/40">
                    {template.formatValue(Math.max(0, cv))} / {template.formatValue(g.target)}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        <Link href={ROUTES.ghostYou} className="block">
          <Card className="text-center transition hover:border-white/25">
            <p className="text-sm font-semibold text-white/70">See where Ghost {futureSelf.name} ends up →</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
