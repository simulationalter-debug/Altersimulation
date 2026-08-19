import type { ButtonHTMLAttributes } from "react";

export default function PrimaryButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`grad-primary rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
    />
  );
}
