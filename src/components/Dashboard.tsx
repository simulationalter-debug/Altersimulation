import { useState } from "react";
import { useStore } from "../store";
import type { DashboardTab } from "../types";
import { computeDerivedProgress } from "../lib/engine";
import Home from "./tabs/Home";
import Decision from "./tabs/Decision";
import Timelines from "./tabs/Timelines";
import Missions from "./tabs/Missions";
import Chat from "./tabs/Chat";
import Journal from "./tabs/Journal";
import Pricing from "./tabs/Pricing";

const TABS: { id: DashboardTab; label: string; emoji: string }[] = [
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "decision", label: "Decision", emoji: "🔮" },
  { id: "timelines", label: "Timelines", emoji: "👻" },
  { id: "missions", label: "Missions", emoji: "🎮" },
  { id: "chat", label: "Ask Future Me", emoji: "💬" },
  { id: "journal", label: "Journal", emoji: "📓" },
  { id: "pricing", label: "Upgrade", emoji: "✨" },
];

export default function Dashboard() {
  const [tab, setTab] = useState<DashboardTab>("home");
  const futureSelf = useStore((s) => s.futureSelf);
  const decisions = useStore((s) => s.decisions);
  const completedMissions = useStore((s) => s.completedMissions);
  const resetSimulation = useStore((s) => s.resetSimulation);

  const derived = computeDerivedProgress(futureSelf, decisions, completedMissions);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl">
      <aside className="sticky top-0 hidden h-screen w-60 flex-col border-r border-white/10 px-4 py-6 sm:flex">
        <div className="mb-8 flex items-center gap-2 px-2 text-lg font-semibold">
          <span className="text-xl">✨</span> ALTER
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                tab === t.id
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <span>{t.emoji}</span> {t.label}
            </button>
          ))}
        </nav>
        <div className="space-y-2 px-2">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>🔥 {derived.streak}-day streak</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>⭐ Level {derived.level}</span>
          </div>
          <button
            onClick={() => {
              if (confirm("Reset your entire simulation? This can't be undone.")) {
                resetSimulation();
              }
            }}
            className="mt-3 text-xs text-white/30 underline decoration-white/20 underline-offset-2 hover:text-white/50"
          >
            Reset simulation
          </button>
        </div>
      </aside>

      <div className="flex-1 px-4 pb-24 pt-6 sm:px-8 sm:pb-10">
        <MobileTabBar tab={tab} setTab={setTab} />
        {tab === "home" && <Home derived={derived} onNavigate={setTab} />}
        {tab === "decision" && <Decision derived={derived} />}
        {tab === "timelines" && <Timelines derived={derived} />}
        {tab === "missions" && <Missions derived={derived} />}
        {tab === "chat" && <Chat />}
        {tab === "journal" && <Journal />}
        {tab === "pricing" && <Pricing />}
      </div>
    </div>
  );
}

function MobileTabBar({
  tab,
  setTab,
}: {
  tab: DashboardTab;
  setTab: (t: DashboardTab) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-between overflow-x-auto border-t border-white/10 bg-[#05050a]/95 px-2 py-2 backdrop-blur sm:hidden">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] font-medium ${
            tab === t.id ? "text-white" : "text-white/40"
          }`}
        >
          <span className="text-base">{t.emoji}</span>
          {t.label.split(" ")[0]}
        </button>
      ))}
    </nav>
  );
}
