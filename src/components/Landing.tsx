import { useStore } from "../store";
import { AREAS } from "../data/areas";

export default function Landing() {
  const goToOnboarding = useStore((s) => s.goToOnboarding);

  return (
    <div className="relative overflow-hidden">
      <div
        className="animate-glow pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(122,90,248,0.55), rgba(90,169,255,0.25), transparent 70%)",
        }}
      />

      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="text-2xl">✨</span> ALTER
        </div>
        <button
          onClick={goToOnboarding}
          className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
        >
          Sign in
        </button>
      </header>

      <main className="relative mx-auto max-w-3xl px-6 pb-24 pt-10 text-center">
        <p className="mx-auto mb-5 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
          The AI Life Simulator
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Meet the version of you
          <br />
          <span className="bg-gradient-to-r from-[#8b7bff] via-[#5aa9ff] to-[#3fd0c9] bg-clip-text text-transparent">
            who made the other choice.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
          Build your Future Self, make real decisions, and watch two timelines diverge —
          the person you're becoming, and who you stay if nothing changes.
        </p>

        <div className="mt-10">
          <p className="text-sm font-medium text-white/50">
            Where do you want to be 12 months from now?
          </p>
          <div className="mx-auto mt-4 flex max-w-xl flex-wrap justify-center gap-2">
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

        <button
          onClick={goToOnboarding}
          className="mt-10 rounded-full bg-gradient-to-r from-[#8b7bff] to-[#5aa9ff] px-8 py-3.5 text-base font-semibold text-[#0a0a12] shadow-[0_0_40px_rgba(122,90,248,0.35)] transition hover:brightness-110 active:scale-[0.98]"
        >
          Build my Future Self →
        </button>
        <p className="mt-3 text-xs text-white/40">Free to start. Takes about 90 seconds.</p>

        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-4 text-left sm:grid-cols-2">
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
