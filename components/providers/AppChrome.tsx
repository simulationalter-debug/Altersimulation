"use client";

import type { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import StoreHydration from "./StoreHydration";
import BottomNav from "@/components/navigation/BottomNav";
import { BOTTOM_NAV_TABS } from "@/constants/routes";

export default function AppChrome({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const showNav = BOTTOM_NAV_TABS.some((tab) => tab.href === pathname);

  return (
    <StoreHydration>
      <div className="mx-auto min-h-screen max-w-md bg-[#0a0813] sm:max-w-lg">
        <div className={showNav ? "pb-24" : ""}>{children}</div>
        {showNav && <BottomNav />}
      </div>
    </StoreHydration>
  );
}
