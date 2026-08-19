import type { PropsWithChildren } from "react";

export default function Card({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
