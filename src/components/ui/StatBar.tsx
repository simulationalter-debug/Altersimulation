interface StatBarProps {
  label: string;
  emoji?: string;
  value: number;
  color: string;
  compact?: boolean;
}

export default function StatBar({ label, emoji, value, color, compact }: StatBarProps) {
  return (
    <div className={compact ? "space-y-1" : "space-y-1.5"}>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-white/80">
          {emoji && <span>{emoji}</span>}
          {label}
        </span>
        <span className="font-semibold tabular-nums text-white/90">{Math.round(value)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="animate-bar h-full rounded-full"
          style={{
            width: `${Math.max(2, value)}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
          }}
        />
      </div>
    </div>
  );
}
