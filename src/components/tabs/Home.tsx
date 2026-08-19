import { useStore } from "../../store";
import type { DashboardTab, DerivedProgress } from "../../types";
import { AREAS } from "../../data/areas";
import { overallScore } from "../../lib/engine";
import { formatDate, weeksUntil } from "../../lib/date";
import { getTodayScenario, getScenarioAnsweredToday } from "../../data/scenarios";
import { pickDailyMissions } from "../../data/missions";
import { todayKey } from "../../lib/date";
import Card from "../ui/Card";
import StatBar from "../ui/StatBar";

export default function Home({
  derived,
  onNavigate,
}: {
  derived: DerivedProgress;
  onNavigate: (t: DashboardTab) => void;
}) {
  const futureSelf = useStore((s) => s.futureSelf);
  const decisions = useStore((s) => s.decisions);
  const completedMissions = useStore((s) => s.completedMissions);
  if (!futureSelf) return null;

  const futureScore = overallScore(derived.futureStats, futureSelf.selectedAreas);
  const ghostScore = overallScore(derived.ghostStats, futureSelf.selectedAreas);

  const dateKey = todayKey();
  const answeredToday = getScenarioAnsweredToday(dateKey, decisions);
  const scenario = getTodayScenario(dateKey, futureSelf.selectedAreas, decisions);

  const dailyMissions = pickDailyMissions(dateKey, futureSelf.selectedAreas);
  const doneToday = dailyMissions.filter((m) =>
    completedMissions.some((cm) => cm.missionId === m.id && cm.date === dateKey),
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {futureSelf.avatarEmoji} Hey, {futureSelf.name}.
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Target date {formatDate(derived.targetDateAdjusted)} — {weeksUntil(derived.targetDateAdjusted)} weeks out.
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
            🔥 {derived.streak}-day streak
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
            ⭐ Level {derived.level}
          </div>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white/60">Level {derived.level} progress</p>
          <p className="text-xs text-white/40">
            {derived.xpIntoLevel} / {derived.xpForNextLevel} XP
          </p>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="animate-bar h-full rounded-full bg-gradient-to-r from-[#8b7bff] to-[#5aa9ff]"
            style={{ width: `${(derived.xpIntoLevel / derived.xpForNextLevel) * 100}%` }}
          />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="mb-3 text-sm font-semibold text-white/70">Which timeline are you feeding?</p>
          <div className="flex items-center justify-between">
            <TimelineBadge emoji="✨" label={`Future ${futureSelf.name}`} score={futureScore} tone="good" />
            <span className="text-white/30">vs</span>
            <TimelineBadge emoji="👻" label={`Ghost ${futureSelf.name}`} score={ghostScore} tone="bad" />
          </div>
          <button
            onClick={() => onNavigate("timelines")}
            className="mt-4 w-full rounded-lg border border-white/10 py-2 text-xs font-medium text-white/60 transition hover:border-white/25 hover:text-white/90"
          >
            View full comparison →
          </button>
        </Card>

        <Card>
          <p className="mb-3 text-sm font-semibold text-white/70">Today's missions</p>
          <p className="text-3xl font-bold">
            {doneToday}
            <span className="text-lg text-white/40">/{dailyMissions.length}</span>
          </p>
          <p className="mt-1 text-xs text-white/40">completed today</p>
          <button
            onClick={() => onNavigate("missions")}
            className="mt-4 w-full rounded-lg border border-white/10 py-2 text-xs font-medium text-white/60 transition hover:border-white/25 hover:text-white/90"
          >
            Open missions →
          </button>
        </Card>
      </div>

      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/40">
              {answeredToday ? "Today's decision — answered" : "Today's decision"}
            </p>
            <p className="mt-1.5 text-lg font-semibold">{scenario.prompt}</p>
          </div>
          <span className="text-3xl">🔮</span>
        </div>
        <button
          onClick={() => onNavigate("decision")}
          className="mt-4 rounded-full bg-gradient-to-r from-[#8b7bff] to-[#5aa9ff] px-5 py-2 text-sm font-semibold text-[#0a0a12] transition hover:brightness-110"
        >
          {answeredToday ? "See what changed →" : "Make the decision →"}
        </button>
      </Card>

      <Card>
        <p className="mb-4 text-sm font-semibold text-white/70">Your areas</p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {futureSelf.selectedAreas.map((id) => {
            const area = AREAS.find((a) => a.id === id)!;
            return (
              <StatBar key={id} label={area.label} emoji={area.emoji} value={derived.futureStats[id]} color={area.color} compact />
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function TimelineBadge({
  emoji,
  label,
  score,
  tone,
}: {
  emoji: string;
  label: string;
  score: number;
  tone: "good" | "bad";
}) {
  return (
    <div className="text-center">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border text-2xl ${
          tone === "good" ? "border-[#5aa9ff]/40 bg-[#5aa9ff]/10" : "border-white/15 bg-white/5"
        }`}
      >
        {emoji}
      </div>
      <p className="mt-2 text-xs text-white/50">{label}</p>
      <p className={`text-lg font-bold ${tone === "good" ? "text-[#8fd0ff]" : "text-white/60"}`}>{score}%</p>
    </div>
  );
}
