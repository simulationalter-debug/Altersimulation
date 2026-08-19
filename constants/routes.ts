export const ROUTES = {
  landing: "/",
  onboarding: "/onboarding",
  home: "/home",
  futureYou: "/future-you",
  ghostYou: "/ghost-you",
  missions: "/missions",
  decisions: "/decisions",
  timeline: "/timeline",
  askFutureMe: "/ask-future-me",
  profile: "/profile",
  paywall: "/paywall",
} as const;

export interface NavTab {
  href: (typeof ROUTES)[keyof typeof ROUTES];
  label: string;
  emoji: string;
}

/** The 4 tabs in the persistent bottom nav — see components/navigation/BottomNav. */
export const BOTTOM_NAV_TABS: NavTab[] = [
  { href: ROUTES.home, label: "Home", emoji: "🏠" },
  { href: ROUTES.timeline, label: "Timeline", emoji: "📜" },
  { href: ROUTES.askFutureMe, label: "Ask Future Me", emoji: "💬" },
  { href: ROUTES.profile, label: "Profile", emoji: "👤" },
];

/** Routes that render without the app chrome (no bottom nav). */
export const CHROMELESS_ROUTES: string[] = [ROUTES.landing, ROUTES.onboarding];
