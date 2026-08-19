import type { Overlay } from "../Dashboard";

export default function QuickActionsSheet({
  onClose,
  onOpen,
}: {
  onClose: () => void;
  onOpen: (o: Overlay) => void;
}) {
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-md rounded-t-3xl border-t border-white/10 bg-[#120f1d] p-5 pb-8 sm:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" />
        <p className="mb-4 text-sm font-semibold text-white/60">Quick actions</p>
        <div className="space-y-2">
          <ActionRow
            emoji="🔮"
            label="Make today's decision"
            onClick={() => {
              onClose();
              onOpen({ type: "decision" });
            }}
          />
          <ActionRow
            emoji="📓"
            label="Write a journal entry"
            onClick={() => {
              onClose();
              onOpen({ type: "journal" });
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ActionRow({ emoji, label, onClick }: { emoji: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-white/25"
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
