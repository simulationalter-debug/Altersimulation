import { useMemo, useState } from "react";
import { useStore } from "../../store";
import { MISSION_POOL } from "../../data/missions";
import { SCENARIOS } from "../../data/scenarios";
import { computeMilestones } from "../../lib/milestones";
import { formatDate } from "../../lib/date";
import Card from "../ui/Card";

type Filter = "all" | "decisions" | "missions" | "milestones";

interface FeedItem {
  date: string;
  emoji: string;
  title: string;
  subtitle?: string;
  xp?: number;
  kind: Exclude<Filter, "all">;
}

export default function TimelineFeed() {
  const actions = useStore((s) => s.actions);
  const decisionLog = useStore((s) => s.decisionLog);
  const journal = useStore((s) => s.journal);
  const goals = useStore((s) => s.goals);
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo<FeedItem[]>(() => {
    const missionItems: FeedItem[] = actions
      .filter((a) => a.source === "mission_completed")
      .map((a) => {
        const missionId = a.actionId.split(":")[2];
        const template = MISSION_POOL.find((m) => m.id === missionId);
        return {
          date: a.timestamp,
          emoji: template?.emoji ?? "🎮",
          title: `Completed mission: ${template?.label ?? "Mission"}`,
          xp: a.xp,
          kind: "missions" as const,
        };
      });

    const decisionItems: FeedItem[] = decisionLog.map((d) => {
      const scenario = SCENARIOS.find((s) => s.id === d.scenarioId);
      const choice = scenario?.choices.find((c) => c.id === d.choiceId);
      return {
        date: `${d.date}T12:00:00.000Z`,
        emoji: choice?.emoji ?? "🔮",
        title: `Decision: ${choice?.label ?? "Made a choice"}`,
        subtitle:
          d.event.timeShiftDays !== 0
            ? `${Math.abs(d.event.timeShiftDays)}d ${d.event.timeShiftDays > 0 ? "closer" : "further"}`
            : undefined,
        xp: 20,
        kind: "decisions" as const,
      };
    });

    const journalItems: FeedItem[] = journal.map((j) => ({
      date: `${j.date}T12:00:00.000Z`,
      emoji: "📓",
      title: "Journal entry",
      subtitle: j.text.length > 60 ? `${j.text.slice(0, 60)}…` : j.text,
      kind: "missions" as const,
    }));

    const milestoneItems: FeedItem[] = computeMilestones(goals, actions).map((m) => ({
      date: m.date,
      emoji: m.emoji,
      title: m.label,
      kind: "milestones" as const,
    }));

    return [...missionItems, ...decisionItems, ...journalItems, ...milestoneItems].sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  }, [actions, decisionLog, journal, goals]);

  const filtered = filter === "all" ? items : items.filter((i) => i.kind === filter);

  const grouped = useMemo(() => {
    const groups = new Map<string, FeedItem[]>();
    for (const item of filtered) {
      const key = new Date(item.date).toLocaleDateString(undefined, { month: "long", year: "numeric" });
      groups.set(key, [...(groups.get(key) ?? []), item]);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold">Timeline</h1>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {(["all", "decisions", "missions", "milestones"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition ${
              filter === f ? "grad-primary text-white" : "border border-white/10 text-white/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-6">
        {grouped.length === 0 && <p className="pt-10 text-center text-sm text-white/30">Nothing here yet.</p>}
        {grouped.map(([month, entries]) => (
          <div key={month}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/30">{month}</p>
            <div className="space-y-2">
              {entries.map((item, i) => (
                <Card key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-white/90">{item.title}</p>
                      {item.subtitle && <p className="text-xs text-white/40">{item.subtitle}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    {item.xp !== undefined && <p className="text-xs font-semibold text-[#c084fc]">+{item.xp} XP</p>}
                    <p className="text-[10px] text-white/30">{formatDate(item.date)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
