"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/hooks/useAppStore";
import { AREAS } from "@/data/life-categories/areas";
import { GOAL_TEMPLATES } from "@/data/life-categories/goalTemplates";
import type { GoalCategory } from "@/types";
import AvatarPicker, { AVATAR_OPTIONS } from "@/components/avatar/AvatarPicker";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { ROUTES } from "@/constants/routes";

export default function OnboardingPage() {
  const router = useRouter();
  const createFutureSelf = useAppStore((s) => s.createFutureSelf);
  const [step, setStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<GoalCategory[]>([
    "financial",
    "career",
    "fitness",
  ]);
  const [name, setName] = useState("");
  const [avatarEmoji, setAvatarEmoji] = useState(AVATAR_OPTIONS[0]);
  const [monthsOut, setMonthsOut] = useState(12);
  const [targets, setTargets] = useState<Partial<Record<GoalCategory, number>>>({});

  const toggleCategory = (id: GoalCategory) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const steps = [
    {
      title: "What matters to you right now?",
      subtitle: "Pick the areas you want Future You to focus on.",
      canNext: selectedCategories.length >= 2,
      body: (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {AREAS.map((area) => {
            const active = selectedCategories.includes(area.id);
            return (
              <button
                key={area.id}
                onClick={() => toggleCategory(area.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition ${
                  active
                    ? "border-[#c084fc]/60 bg-[#a855f7]/10 text-white"
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
            <AvatarPicker value={avatarEmoji} onChange={setAvatarEmoji} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/60">Future Self&apos;s name</label>
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
              className="w-full accent-[#a855f7]"
            />
          </div>
        </div>
      ),
    },
    {
      title: `What does ${name || "Future You"} achieve?`,
      subtitle: "One target per area — this is Ghost You's training data too, so be realistic.",
      canNext: true,
      body: (
        <div className="space-y-4">
          {selectedCategories.map((id) => {
            const area = AREAS.find((a) => a.id === id)!;
            const template = GOAL_TEMPLATES[id];
            return (
              <div key={id}>
                <label className="mb-1.5 flex items-center gap-2 text-sm text-white/60">
                  <span>{area.emoji}</span> {template.targetFieldLabel}
                </label>
                <input
                  type="number"
                  min={0}
                  value={targets[id] ?? ""}
                  onChange={(e) =>
                    setTargets((t) => ({ ...t, [id]: e.target.value === "" ? undefined : Number(e.target.value) }))
                  }
                  placeholder={String(template.defaultTarget)}
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
    <div className="flex min-h-screen flex-col justify-center px-6 py-16">
      <div className="mb-8 flex gap-1.5">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition ${i <= step ? "grad-primary" : "bg-white/10"}`} />
        ))}
      </div>

      <h1 className="text-2xl font-bold tracking-tight">{current.title}</h1>
      <p className="mt-2 text-white/50">{current.subtitle}</p>

      <div className="mt-8">{current.body}</div>

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`text-sm text-white/50 transition hover:text-white/80 ${step === 0 ? "invisible" : ""}`}
        >
          ← Back
        </button>
        <PrimaryButton
          disabled={!current.canNext}
          onClick={() => {
            if (isLast) {
              const resolvedTargets = Object.fromEntries(
                selectedCategories.map((id) => [id, targets[id] ?? GOAL_TEMPLATES[id].defaultTarget]),
              ) as Partial<Record<GoalCategory, number>>;
              createFutureSelf({
                name: name.trim(),
                avatarEmoji,
                selectedCategories,
                targets: resolvedTargets,
                monthsOut,
              });
              router.push(ROUTES.home);
            } else {
              setStep((s) => s + 1);
            }
          }}
        >
          {isLast ? "Enter the simulation →" : "Continue"}
        </PrimaryButton>
      </div>
    </div>
  );
}
