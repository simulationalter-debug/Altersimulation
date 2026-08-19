"use client";

import { useEffect, useState, type PropsWithChildren } from "react";
import { useAppStore } from "@/hooks/useAppStore";

/**
 * Rehydrates the zustand/localStorage store on the client after mount
 * (see hooks/useAppStore's `skipHydration`). Server render and the first
 * client render both show the loading state, so there's no
 * server/client markup mismatch — then real data swaps in.
 */
export default function StoreHydration({ children }: PropsWithChildren) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    Promise.resolve(useAppStore.persist.rehydrate()).then(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0813]">
        <span className="animate-glow text-3xl">✨</span>
      </div>
    );
  }

  return <>{children}</>;
}
