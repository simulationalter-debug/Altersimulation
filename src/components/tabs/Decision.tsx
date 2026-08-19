import { useState } from "react";
import { useStore } from "../../store";
import type { DerivedProgress } from "../../types";
import { getTodayScenario, getScenarioAnsweredToday } from "../../data/scenarios";
import { todayKey } from "../../lib/date";
import { AREA_MAP } from "../../data/areas";
import Card from "../ui/Card";

export default function Decision({ derived: _derived }: { derived: DerivedProgress }) {
  const futureSelf = useStore((s) => s.futureSelf);
  const decisions = useStore((s) => s.decisions);
  const answerDecision = useStore((s) => s.answerDecision);
  const [justPicked, setJustPicked] = useState<string | null>(null);

  if (!futureSelf) return null;

  const dateKey = todayKey();
  const scenario = getTodayScenario(dateKey, futureSelf.selectedAreas, decisions);
  const answered = getScenarioAnsweredToday(dateKey, decisions);
  const answeredChoice = answered ? scenario.choices.find((c) => c.id === answered.choiceId) : undefined;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-white/40">Today's decision</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{scenario.prompt}</h1>
        {scenario.context && <p className="mt-2 text-white/50">{scenario.context}</p>}
        <div className="mt-3 flex gap-2">
          {scenario.areas.map((a) => (
            <span key={a} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/50">
              {AREA_MAP[a].emoji} {AREA_MAP[a].label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {scenario.choices.map((choice) => {
          const isChosen = answered?.choiceId === choice.id;
          const disabled = Boolean(answered);
          return (
            <button
              key={choice.id}
              disabled={disabled}
              onClick={() => {
                answerDecision(scenario, choice.id);
                setJustPicked(choice.id);
              }}
              className={`flex items-center justify-between gap-4 rounded-xl border p-4 text-left transition ${
                isChosen
                  ? "border-[#8b7bff]/60 bg-[#8b7bff]/10"
                  : disabled
                    ? "border-white/5 bg-white/[0.02] opacity-40"
                    : "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">{choice.emoji}</span>
                <span className="font-medium">{choice.label}</span>
              </span>
              {isChosen && <span className="text-xs font-semibold text-[#b3a8ff]">Chosen</span>}
            </button>
          );
        })}
      </div>

      {answered && answeredChoice && (
        <Card className={justPicked ? "animate-rise" : ""}>
          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
            {futureSelf.name} says
          </p>
          <p className="mt-2 text-lg leading-relaxed text-white/90">
            "{answeredChoice.narration.replace("{weeks}", String(Math.abs(answeredChoice.weeksShift)))}"
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(answeredChoice.futureImpact).map(([area, delta]) => (
              <span
                key={area}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                  (delta ?? 0) >= 0
                    ? "border-[#7ee787]/30 bg-[#7ee787]/10 text-[#a6f0af]"
                    : "border-[#f5556c]/30 bg-[#f5556c]/10 text-[#ff9fac]"
                }`}
              >
                {AREA_MAP[area as keyof typeof AREA_MAP].emoji} {(delta ?? 0) > 0 ? "+" : ""}
                {delta}
              </span>
            ))}
          </div>
        </Card>
      )}

      <p className="text-center text-xs text-white/30">
        A new decision unlocks tomorrow. This is a scenario simulation based on what you've told
        ALTER — not a guarantee.
      </p>
    </div>
  );
}
