"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/hooks/useAppStore";
import { getScenarioAnsweredToday, getTodayScenario } from "@/data/decision-scenarios";
import { simulateOptions } from "@/features/simulations/engine";
import { AREA_MAP } from "@/data/life-categories/areas";
import { todayKey } from "@/utils/date";
import Card from "@/components/cards/Card";
import PageHeader from "@/components/navigation/PageHeader";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { ROUTES } from "@/constants/routes";

const LETTERS = ["A", "B", "C", "D"];

export default function DecisionsPage() {
  const router = useRouter();
  const futureSelf = useAppStore((s) => s.futureSelf);
  const goals = useAppStore((s) => s.goals);
  const actions = useAppStore((s) => s.actions);
  const decisionLog = useAppStore((s) => s.decisionLog);
  const answerDecision = useAppStore((s) => s.answerDecision);
  const [selected, setSelected] = useState<string | null>(null);
  const [impactShown, setImpactShown] = useState(false);

  if (!futureSelf) return null;

  const dateKey = todayKey();
  const scenario = getTodayScenario(dateKey, futureSelf.selectedCategories, decisionLog);
  const answered = getScenarioAnsweredToday(dateKey, decisionLog);
  const answeredChoice = answered ? scenario.choices.find((c) => c.id === answered.choiceId) : undefined;

  if (answered && answeredChoice) {
    return (
      <div>
        <PageHeader title="Today's Decision" backHref={ROUTES.home} />
        <div className="px-4 py-6">
          <p className="text-xs font-medium uppercase tracking-wide text-white/40">{scenario.prompt}</p>
          <Card className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-white/40">{futureSelf.name} says</p>
            <p className="mt-2 text-lg leading-relaxed text-white/90">&quot;{answeredChoice.narration}&quot;</p>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70">
              {answered.event.timeShiftDays !== 0 && (
                <p>
                  That decision moved{" "}
                  <strong className="text-white">
                    {AREA_MAP[goals.find((g) => g.goalId === answered.event.goal)?.category ?? "financial"].label}
                  </strong>{" "}
                  {answered.event.timeShiftDays > 0 ? "closer" : "further"} by ~
                  <strong className="text-white">{Math.abs(answered.event.timeShiftDays)} days</strong>.
                </p>
              )}
              {answered.event.tradeoffs.length > 0 && (
                <p className="mt-1 text-xs text-white/50">
                  Tradeoffs:{" "}
                  {answered.event.tradeoffs
                    .map((t) => `${t.goal} ${t.timelinePctChange > 0 ? "+" : ""}${t.timelinePctChange}%`)
                    .join(", ")}
                </p>
              )}
            </div>
          </Card>
          <p className="mt-4 text-center text-xs text-white/30">A new decision unlocks tomorrow.</p>
        </div>
      </div>
    );
  }

  const selectedChoice = scenario.choices.find((c) => c.id === selected);
  const preview =
    selectedChoice && impactShown
      ? simulateOptions(
          goals,
          actions,
          [
            {
              optionId: selectedChoice.id,
              label: selectedChoice.label,
              impacts: Object.entries(selectedChoice.categoryImpacts)
                .map(([category, delta]) => {
                  const goal = goals.find((g) => g.category === category && g.status === "active");
                  return goal ? { goalId: goal.goalId, delta: delta ?? 0, deltaType: "direct" as const } : null;
                })
                .filter((x): x is NonNullable<typeof x> => x !== null),
            },
          ],
          new Date().toISOString(),
        )[0]
      : null;

  return (
    <div>
      <PageHeader title="Decision Simulator" backHref={ROUTES.home} />

      <div className="px-4 py-6">
        <p className="text-xs font-medium uppercase tracking-wide text-white/40">Today&apos;s decision</p>
        <h1 className="mt-1.5 text-xl font-bold leading-snug">{scenario.prompt}</h1>

        <div className="mt-5 space-y-2.5">
          {scenario.choices.map((choice, i) => {
            const isSelected = selected === choice.id;
            return (
              <button
                key={choice.id}
                data-testid="decision-choice"
                onClick={() => {
                  setSelected(choice.id);
                  setImpactShown(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                  isSelected ? "border-[#a855f7]/60 bg-[#a855f7]/10" : "border-white/10 bg-white/[0.02] hover:border-white/25"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    isSelected ? "border-[#c084fc] bg-[#c084fc]/20 text-[#e9d5ff]" : "border-white/25 text-white/40"
                  }`}
                >
                  {LETTERS[i]}
                </span>
                <span className="flex-1 text-sm font-medium">
                  {choice.emoji} {choice.label}
                </span>
                <span
                  className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                    isSelected ? "border-[#c084fc] bg-[#c084fc]" : "border-white/25"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {preview && (
          <Card className="mt-4 animate-rise">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Projected impact</p>
            <div className="space-y-2">
              {preview.perGoal.map((pg) => {
                const goal = goals.find((g) => g.goalId === pg.goalId);
                if (!goal) return null;
                const area = AREA_MAP[goal.category];
                return (
                  <div key={pg.goalId} className="flex items-center justify-between text-sm">
                    <span className="text-white/70">
                      {area.emoji} {area.label}
                    </span>
                    <span className={`font-semibold ${pg.timelinePctChange >= 0 ? "text-[#7ee787]" : "text-[#ff9fac]"}`}>
                      {pg.timelinePctChange >= 0 ? "+" : ""}
                      {pg.timelinePctChange.toFixed(1)}%
                      {Number.isFinite(pg.timeShiftDays) && Math.abs(pg.timeShiftDays) >= 1 && (
                        <span className="ml-1 text-xs text-white/40">
                          ({Math.abs(Math.round(pg.timeShiftDays))}d {pg.timeShiftDays > 0 ? "closer" : "further"})
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <div className="mt-6 space-y-2.5">
          {!impactShown ? (
            <PrimaryButton className="w-full py-3" disabled={!selected} onClick={() => setImpactShown(true)}>
              See Impact
            </PrimaryButton>
          ) : (
            <PrimaryButton
              className="w-full py-3"
              onClick={() => {
                if (selected) answerDecision(scenario, selected);
                router.push(ROUTES.home);
              }}
            >
              Confirm this choice
            </PrimaryButton>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-white/30">
          A scenario simulation based on what you&apos;ve told ALTER — not a guarantee.
        </p>
      </div>
    </div>
  );
}
