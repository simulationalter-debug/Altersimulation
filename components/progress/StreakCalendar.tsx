const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

interface StreakCalendarProps {
  week: { date: string; active: boolean }[];
  todayKey: string;
}

export default function StreakCalendar({ week, todayKey }: StreakCalendarProps) {
  return (
    <div className="flex justify-between">
      {week.map((d) => {
        const dow = new Date(d.date).getDay();
        const isToday = d.date === todayKey;
        return (
          <div key={d.date} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-white/30">{WEEKDAY_LABELS[dow]}</span>
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                d.active
                  ? "grad-primary text-white"
                  : isToday
                    ? "border border-dashed border-white/30 text-white/30"
                    : "bg-white/5 text-white/20"
              }`}
            >
              {d.active ? "✓" : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}
