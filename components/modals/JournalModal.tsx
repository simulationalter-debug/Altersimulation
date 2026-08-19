"use client";

import { useState } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import { formatDate } from "@/utils/date";
import Card from "@/components/cards/Card";
import PrimaryButton from "@/components/buttons/PrimaryButton";

export default function JournalModal({ onClose }: { onClose: () => void }) {
  const journal = useAppStore((s) => s.journal);
  const addJournalEntry = useAppStore((s) => s.addJournalEntry);
  const [text, setText] = useState("");

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        className="mx-auto max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-white/10 bg-[#0a0813] p-5 pb-8 sm:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" />
        <p className="text-sm font-semibold">Journal</p>
        <p className="mt-1 text-xs text-white/50">A quick note to Future You. Ask Future Me reads these too.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            addJournalEntry(text.trim());
            setText("");
          }}
          className="mt-4 flex flex-col gap-3"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind today?"
            rows={3}
            className="w-full resize-none rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
          />
          <PrimaryButton type="submit" className="self-end px-5 py-2">
            Save entry
          </PrimaryButton>
        </form>

        <div className="mt-6 max-h-64 space-y-3 overflow-y-auto">
          {journal.length === 0 && (
            <p className="text-center text-sm text-white/30">No entries yet. Write your first one above.</p>
          )}
          {journal.map((entry) => (
            <Card key={entry.id}>
              <p className="text-xs text-white/40">{formatDate(entry.date)}</p>
              <p className="mt-1.5 text-white/85">{entry.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
