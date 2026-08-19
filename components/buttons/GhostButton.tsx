import type { ButtonHTMLAttributes } from "react";

export default function GhostButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
    />
  );
}
