import type { PropsWithChildren } from "react";

interface ProgressRingProps {
  percent: number; // 0-100
  size?: number; // px
  thickness?: number; // px
}

/** A conic-gradient ring with a dark center hole — used for XP rings and overall-progress dials. */
export default function ProgressRing({
  percent,
  size = 96,
  thickness = 12,
  children,
}: PropsWithChildren<ProgressRingProps>) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        backgroundImage: `conic-gradient(#ec4899 ${clamped * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
      }}
    >
      <div
        className="flex flex-col items-center justify-center rounded-full bg-[#0a0813]"
        style={{ width: size - thickness * 2, height: size - thickness * 2 }}
      >
        {children}
      </div>
    </div>
  );
}
