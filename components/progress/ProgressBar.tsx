interface ProgressBarProps {
  label: string;
  emoji?: string;
  value: number; // 0-100
  color?: string;
  compact?: boolean;
}

export default function ProgressBar({ label, emoji, value, color, compact }: ProgressBarProps) {
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
          className={`animate-bar h-full rounded-full ${color ? "" : "grad-primary"}`}
          style={{
            width: `${Math.max(2, Math.min(100, value))}%`,
            ...(color ? { background: color } : {}),
          }}
        />
      </div>
    </div>
  );
}
