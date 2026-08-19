"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV_TABS } from "@/constants/routes";
import QuickActionsSheet from "@/components/modals/QuickActionsSheet";
import JournalModal from "@/components/modals/JournalModal";

export default function BottomNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);

  const left = BOTTOM_NAV_TABS.slice(0, 2);
  const right = BOTTOM_NAV_TABS.slice(2);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md items-center justify-between border-t border-white/10 bg-[#0a0813]/95 px-4 py-2 backdrop-blur sm:max-w-lg">
        {left.map((tab) => (
          <NavLink key={tab.href} href={tab.href} label={tab.label} emoji={tab.emoji} active={pathname === tab.href} />
        ))}
        <button
          onClick={() => setSheetOpen(true)}
          className="grad-primary -mt-6 flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white shadow-[0_4px_20px_rgba(236,72,153,0.45)] transition active:scale-95"
          aria-label="Quick actions"
        >
          +
        </button>
        {right.map((tab) => (
          <NavLink key={tab.href} href={tab.href} label={tab.label} emoji={tab.emoji} active={pathname === tab.href} />
        ))}
      </nav>

      {sheetOpen && (
        <QuickActionsSheet
          onClose={() => setSheetOpen(false)}
          onOpenJournal={() => setJournalOpen(true)}
        />
      )}
      {journalOpen && <JournalModal onClose={() => setJournalOpen(false)} />}
    </>
  );
}

function NavLink({
  href,
  label,
  emoji,
  active,
}: {
  href: string;
  label: string;
  emoji: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] font-medium transition ${
        active ? "text-white" : "text-white/40"
      }`}
    >
      <span className={`text-lg ${active ? "grad-primary-text" : ""}`}>{emoji}</span>
      {label.split(" ")[0]}
    </Link>
  );
}
