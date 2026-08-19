import { useState } from "react";
import { useStore } from "../store";
import type { DashboardTab } from "../types";
import Home from "./tabs/Home";
import TimelineFeed from "./tabs/TimelineFeed";
import Chat from "./tabs/Chat";
import Profile from "./tabs/Profile";
import DecisionOverlay from "./overlays/DecisionOverlay";
import MissionDetailOverlay from "./overlays/MissionDetailOverlay";
import JournalOverlay from "./overlays/JournalOverlay";
import PricingOverlay from "./overlays/PricingOverlay";
import QuickActionsSheet from "./overlays/QuickActionsSheet";

const TABS: { id: DashboardTab; label: string; emoji: string }[] = [
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "timeline", label: "Timeline", emoji: "📜" },
  { id: "chat", label: "Ask Future Me", emoji: "💬" },
  { id: "profile", label: "Profile", emoji: "👤" },
];

export type Overlay =
  | { type: "quickActions" }
  | { type: "decision" }
  | { type: "mission"; missionId: string }
  | { type: "journal" }
  | { type: "pricing" };

export default function Dashboard() {
  const [tab, setTab] = useState<DashboardTab>("home");
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const futureSelf = useStore((s) => s.futureSelf);

  if (!futureSelf) return null;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#0a0813] sm:max-w-lg">
      <div className="flex-1 overflow-y-auto pb-24">
        {tab === "home" && <Home onOpen={setOverlay} />}
        {tab === "timeline" && <TimelineFeed />}
        {tab === "chat" && <Chat />}
        {tab === "profile" && <Profile onOpen={setOverlay} />}
      </div>

      <BottomNav tab={tab} setTab={setTab} onOpenQuickActions={() => setOverlay({ type: "quickActions" })} />

      {overlay?.type === "quickActions" && (
        <QuickActionsSheet onClose={() => setOverlay(null)} onOpen={setOverlay} />
      )}
      {overlay?.type === "decision" && <DecisionOverlay onClose={() => setOverlay(null)} />}
      {overlay?.type === "mission" && (
        <MissionDetailOverlay missionId={overlay.missionId} onClose={() => setOverlay(null)} />
      )}
      {overlay?.type === "journal" && <JournalOverlay onClose={() => setOverlay(null)} />}
      {overlay?.type === "pricing" && <PricingOverlay onClose={() => setOverlay(null)} />}
    </div>
  );
}

function BottomNav({
  tab,
  setTab,
  onOpenQuickActions,
}: {
  tab: DashboardTab;
  setTab: (t: DashboardTab) => void;
  onOpenQuickActions: () => void;
}) {
  const left = TABS.slice(0, 2);
  const right = TABS.slice(2);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md items-center justify-between border-t border-white/10 bg-[#0a0813]/95 px-4 py-2 backdrop-blur sm:max-w-lg">
      {left.map((t) => (
        <NavButton key={t.id} tab={t} active={tab === t.id} onClick={() => setTab(t.id)} />
      ))}
      <button
        onClick={onOpenQuickActions}
        className="grad-primary -mt-6 flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white shadow-[0_4px_20px_rgba(236,72,153,0.45)] transition active:scale-95"
        aria-label="Quick actions"
      >
        +
      </button>
      {right.map((t) => (
        <NavButton key={t.id} tab={t} active={tab === t.id} onClick={() => setTab(t.id)} />
      ))}
    </nav>
  );
}

function NavButton({
  tab,
  active,
  onClick,
}: {
  tab: { id: DashboardTab; label: string; emoji: string };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] font-medium transition ${
        active ? "text-white" : "text-white/40"
      }`}
    >
      <span className={`text-lg ${active ? "grad-primary-text" : ""}`}>{tab.emoji}</span>
      {tab.label.split(" ")[0]}
    </button>
  );
}
