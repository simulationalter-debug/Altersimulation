import { useStore } from "../../store";
import type { DerivedProgress } from "../../types";
import { AREAS } from "../../data/areas";
import { overallScore } from "../../lib/engine";
import Card from "../ui/Card";
import StatBar from "../ui/StatBar";

export default function Timelines({ derived }: { derived: DerivedProgress }) {
  const futureSelf = useStore((s) => s.futureSelf);
  if (!futureSelf) return null;

  const areas = futureSelf.selectedAreas.length ? futureSelf.selectedAreas : AREAS.map((a) => a.id);
  const futureScore = overallScore(derived.futureStats, areas);
  const ghostScore = overallScore(derived.ghostStats, areas);
  const gap = futureScore - ghostScore;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Which timeline are you feeding?</h1>
        <p className="mt-1 text-white/50">
          Future {futureSelf.name} is the person you're building. Ghost {futureSelf.name} is where
          today's habits lead if nothing changes.
        </p>
      </div>

      <Card className="text-center">
        <p className="text-sm text-white/50">Overall gap</p>
        <p className="mt-1 text-4xl font-bold">
          <span className="text-[#8fd0ff]">+{Math.max(0, gap)}</span>
          <span className="text-lg font-normal text-white/40"> points ahead of Ghost {futureSelf.name}</span>
        </p>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-[#8b7bff]/30 bg-[#8b7bff]/[0.06]">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-3xl">✨</span>
            <div>
              <p className="font-semibold">Future {futureSelf.name}</p>
              <p className="text-xs text-white/40">{futureScore}% overall</p>
            </div>
          </div>
          <div className="space-y-3">
            {areas.map((id) => {
              const area = AREAS.find((a) => a.id === id)!;
              return (
                <StatBar key={id} label={area.label} emoji={area.emoji} value={derived.futureStats[id]} color={area.color} />
              );
            })}
          </div>
        </Card>

        <Card className="opacity-90">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-3xl grayscale">👻</span>
            <div>
              <p className="font-semibold text-white/70">Ghost {futureSelf.name}</p>
              <p className="text-xs text-white/40">{ghostScore}% overall</p>
            </div>
          </div>
          <div className="space-y-3">
            {areas.map((id) => {
              const area = AREAS.find((a) => a.id === id)!;
              return (
                <StatBar key={id} label={area.label} emoji={area.emoji} value={derived.ghostStats[id]} color="#5a5a6e" />
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <p className="text-sm text-white/60">
          Ghost {futureSelf.name} isn't a punishment — it's just what happens by default. Every
          decision and mission you complete is what widens this gap in Future {futureSelf.name}'s
          favour.
        </p>
      </Card>
    </div>
  );
}
