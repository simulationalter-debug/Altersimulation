"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/hooks/useAppStore";
import { AREAS } from "@/data/life-categories/areas";
import { ROUTES } from "@/constants/routes";

export default function LandingPage() {
  const router = useRouter();
  const futureSelf = useAppStore((s) => s.futureSelf);

  useEffect(() => {
    if (futureSelf) router.replace(ROUTES.home);
  }, [futureSelf, router]);

  if (futureSelf) return null;

  return (
    <div className="relative overflow-hidden">
      <div
        className="animate-glow pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-60 blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.5), rgba(168,85,247,0.3), transparent 70%)",
        }}
      />

      <header className="relative flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="text-2xl">✨</span> ALTER
        </div>
      </header>

      <main className="relative px-6 pb-16 pt-4 text-center">
        <p className="mx-auto mb-5 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
          The AI Life Simulator
        </p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          Meet the version of you
          <br />
          <span className="grad-primary-text">who made the other choice.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-white/60">
          Build your Future Self, make real decisions, and watch two timelines diverge — the
          person you&apos;re becoming, and who you stay if nothing changes.
        </p>

        <div className="mt-8">
          <p className="text-sm font-medium text-white/50">Where do you want to be 12 months from now?</p>
          <div className="mx-auto mt-4 flex flex-wrap justify-center gap-2">
            {AREAS.map((area) => (
              <span
                key={area.id}
                className="animate-rise rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-white/80"
              >
                {area.emoji} {area.label}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={ROUTES.onboarding}
          className="grad-primary mt-8 inline-block rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-[0_0_40px_rgba(236,72,153,0.35)] transition hover:brightness-110 active:scale-[0.98]"
        >
          Build my Future Self →
        </Link>
        <p className="mt-3 text-xs text-white/40">Free to start. Takes about 90 seconds.</p>

        <div className="mt-14 grid grid-cols-1 gap-3 text-left">
          <FeatureRow emoji="🔮" title="Every decision creates a timeline" desc="Real-life choices shift your stats, live." />
          <FeatureRow emoji="👻" title="Future You vs Ghost You" desc="See where your current habits actually lead." />
          <FeatureRow emoji="🎮" title="Missions, XP, streaks" desc="Turn real progress into something you play." />
          <FeatureRow emoji="💬" title="Ask Future Me" desc="Talk to who you're becoming, not a generic bot." />
        </div>
      </main>
    </div>
  );
}

function FeatureRow({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className="font-semibold text-white/90">{title}</p>
        <p className="text-sm text-white/50">{desc}</p>
      </div>
    </div>
  );
}
