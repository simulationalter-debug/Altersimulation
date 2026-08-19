import { useState } from "react";
import { useStore } from "../../store";
import { formatDate } from "../../lib/date";
import OverlayShell from "./OverlayShell";
import Card from "../ui/Card";

export default function JournalOverlay({ onClose }: { onClose: () => void }) {
  const journal = useStore((s) => s.journal);
  const addJournalEntry = useStore((s) => s.addJournalEntry);
  const [text, setText] = useState("");

  return (
    <OverlayShell title="Journal" onClose={onClose}>
      <p className="text-sm text-white/50">A quick note to Future You. Ask Future Me reads these too.</p>

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
        <button
          type="submit"
          className="grad-primary self-end rounded-full px-5 py-2 text-sm font-semibold text-white transition"
        >
          Save entry
        </button>
      </form>

      <div className="mt-6 space-y-3">
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
    </OverlayShell>
  );
}
