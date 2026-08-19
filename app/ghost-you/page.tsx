"use client";

import Link from "next/link";
import { useEngineSnapshot } from "@/hooks/useEngineSnapshot";
import { GOAL_TEMPLATES } from "@/data/life-categories/goalTemplates";
import { AREA_MAP } from "@/data/life-categories/areas";
import Card from "@/components/cards/Card";
import ProgressBar from "@/components/progress/ProgressBar";
import PageHeader from "@/components/navigation/PageHeader";
import { ROUTES } from "@/constants/routes";
import type { GoalPayload } from "@/features/simulations/engine";

/** Tone guard per spec §3: quiet unless the gap is meaningful, never shaming when Ghost is ahead. */
function toneFor(payload: GoalPayload, name: string): string {
  if (payload.ghostGap >= 10) return `You're pulling well ahead of where habits alone would leave us.`;
  if (payload.ghostGap >= 0) return `Close enough that this week decides it.`;
  return `Ghost ${name} is actually ahead here right now — not a verdict, just today's read.`;
}

export default function GhostYouPage() {
  const snap = useEngineSnapshot();
  const { futureSelf, goals, ctx } = snap;
  if (!futureSelf) return null;

  const overallScore =
    ctx.goals.length > 0 ? Math.round(ctx.goals.reduce((a, g) => a + g.ghostTimelinePct, 0) / ctx.goals.length) : 0;

  return (
    <div>
      <PageHeader title="Ghost You" backHref={ROUTES.home} />

      <div className="space-y-5 px-4 py-6">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/5 text-4xl grayscale">
            👻
          </div>
          <h1 className="mt-3 text-xl font-bold text-white/80">Ghost {futureSelf.name}</h1>
          <p className="text-sm text-white/40">{overallScore}% — same habits, same job, no changes</p>
        </div>

        <Card>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Per-goal timeline</p>
          <div className="space-y-4">
            {goals.map((g) => {
              const area = AREA_MAP[g.category];
              const template = GOAL_TEMPLATES[g.category];
              const payload = ctx.goals.find((p) => p.goalId === g.goalId);
              if (!payload) return null;
              return (
                <div key={g.goalId}>
                  <ProgressBar label={g.label} emoji={area.emoji} value={payload.ghostTimelinePct} color="#5a5a6e" />
                  <p className="mt-1 text-xs text-white/40">
                    {template.formatValue(g.target)} target · {toneFor(payload, futureSelf.name)}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <p className="text-sm text-white/60">
            Ghost {futureSelf.name} isn&apos;t a punishment — it&apos;s just what happens by default. Every
            decision and mission you complete is what widens the gap in Future {futureSelf.name}&apos;s favour.
          </p>
        </Card>

        <Link href={ROUTES.futureYou} className="block">
          <Card className="text-center transition hover:border-white/25">
            <p className="text-sm font-semibold text-white/70">← Back to Future {futureSelf.name}</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
