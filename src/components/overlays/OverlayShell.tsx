import type { PropsWithChildren } from "react";

export default function OverlayShell({
  title,
  onClose,
  children,
  headerRight,
}: PropsWithChildren<{ title: string; onClose: () => void; headerRight?: React.ReactNode }>) {
  return (
    <div className="fixed inset-0 z-30 mx-auto flex max-w-md flex-col bg-[#0a0813] sm:max-w-lg">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <button onClick={onClose} className="text-xl text-white/70">
          ←
        </button>
        <p className="text-sm font-semibold">{title}</p>
        <div className="w-5 text-right">{headerRight}</div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-5">{children}</div>
    </div>
  );
}
