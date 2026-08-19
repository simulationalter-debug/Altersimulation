export const AVATAR_OPTIONS = ["🧑🏽", "👩🏾", "👨🏻", "👩🏻", "🧑🏿", "👨🏾", "🧑🏼", "👩🏼"];

export default function AvatarPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (emoji: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {AVATAR_OPTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          className={`flex h-12 w-12 items-center justify-center rounded-full border text-2xl transition ${
            value === emoji
              ? "border-[#c084fc]/70 bg-[#a855f7]/15"
              : "border-white/10 bg-white/[0.02] hover:border-white/25"
          }`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
