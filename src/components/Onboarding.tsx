import { useState } from "react";
import { useStore } from "../store";
import { AREAS } from "../data/areas";
import type { AreaId } from "../types";

const AVATAR_OPTIONS = ["🧑🏽", "👩🏾", "👨🏻", "👩🏻", "🧑🏿", "👨🏾", "🧑🏼", "👩🏼"];

export default function Onboarding() {
  const createFutureSelf = useStore((s) => s.createFutureSelf);
  const [step, setStep] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState<AreaId[]>(["money", "career", "fitness"]);
  const [name, setName] = useState("");
  const [avatarEmoji, setAvatarEmoji] = useState(AVATAR_OPTIONS[0]);
  const [monthsOut, setMonthsOut] = useState(12);
  const [goals, setGoals] = useState<Partial<Record<AreaId, string>>>({});

  const toggleArea = (id: AreaId) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const steps = [
    {
      title: "What matters to you right now?",
      subtitle: "Pick the areas you want Future You to focus on.",
      canNext: selectedAreas.length >= 2,
      body: (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {AREAS.map((area) => {
            const active = selectedAreas.includes(area.id);
            return (
              <button
                key={area.id}
                onClick={() => toggleArea(area.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition ${
                  active
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20"
                }`}
              >
                <span className="text-2xl">{area.emoji}</span>
                {area.label}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: "Build your Future Self",
      subtitle: "Who are you becoming?",
      canNext: name.trim().length > 0,
      body: (
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-white/60">Choose an avatar</label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setAvatarEmoji(emoji)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border text-2xl transition ${
                    avatarEmoji === emoji
                      ? "border-white/50 bg-white/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/60">Future Self's name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Monique"
              className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/60">
              How far out is this version of you? ({monthsOut} months)
            </label>
            <input
              type="range"
              min={3}
              max={24}
              value={monthsOut}
              onChange={(e) => setMonthsOut(Number(e.target.value))}
              className="w-full accent-[#8b7bff]"
            />
          </div>
        </div>
      ),
    },
    {
      title: `What does ${name || "Future You"} have?`,
      subtitle: "One line per area — be specific, it sharpens the simulation.",
      canNext: true,
      body: (
        <div className="space-y-4">
          {selectedAreas.map((id) => {
            const area = AREAS.find((a) => a.id === id)!;
            return (
              <div key={id}>
                <label className="mb-1.5 flex items-center gap-2 text-sm text-white/60">
                  <span>{area.emoji}</span> {area.label}
                </label>
                <input
                  value={goals[id] ?? ""}
                  onChange={(e) => setGoals((g) => ({ ...g, [id]: e.target.value }))}
                  placeholder={placeholderFor(id)}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-white placeholder:text-white/25 focus:border-white/40 focus:outline-none"
                />
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
      <div className="mb-8 flex gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition ${
              i <= step ? "bg-gradient-to-r from-[#8b7bff] to-[#5aa9ff]" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{current.title}</h1>
      <p className="mt-2 text-white/50">{current.subtitle}</p>

      <div className="mt-8">{current.body}</div>

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`text-sm text-white/50 transition hover:text-white/80 ${step === 0 ? "invisible" : ""}`}
        >
          ← Back
        </button>
        <button
          disabled={!current.canNext}
          onClick={() => {
            if (isLast) {
              createFutureSelf({ name: name.trim(), avatarEmoji, selectedAreas, goals, monthsOut });
            } else {
              setStep((s) => s + 1);
            }
          }}
          className="rounded-full bg-gradient-to-r from-[#8b7bff] to-[#5aa9ff] px-7 py-3 text-sm font-semibold text-[#0a0a12] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isLast ? "Enter the simulation →" : "Continue"}
        </button>
      </div>
    </div>
  );
}

function placeholderFor(id: AreaId): string {
  const map: Record<AreaId, string> = {
    love: "Happy, secure relationship",
    money: "£15k monthly income",
    career: "Business thriving",
    lifestyle: "New house",
    travel: "4 countries visited",
    confidence: "Speak up without overthinking it",
    fitness: "Stronger & fitter",
    family: "Present every week, not just holidays",
  };
  return map[id];
}
