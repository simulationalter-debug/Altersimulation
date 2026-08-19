# Mobile mockup reference

The product owner supplied an 8-screen mobile mockup (dark navy/purple
theme, pink-to-purple gradient CTAs) that the current UI is styled to
match:

1. **Onboarding** — "Where do you want to be 12 months from now?" with
   selectable area chips (Love, Money, Career, Lifestyle, Travel,
   Confidence, Fitness, Family).
2. **Future vs Ghost** — two portrait cards side by side (Future You /
   Ghost You) with headline stats, "I choose my Future" CTA.
3. **Home Dashboard** — greeting, Future You / Ghost You level+XP cards,
   life score bars, streak row, today's missions list, bottom nav
   (Home / Timeline / + / Ask Future Me / Profile).
4. **Mission Detail** — circular XP ring, mission title, step checklist,
   "Mission Complete!" button, Future Self quote on completion.
5. **Decision Simulator** — lettered choice list (A/B/C/D), "See
   Impact" button revealing per-goal projected impact before
   committing.
6. **Ask Future Me** — hero header with avatar, chat bubbles, suggested
   prompts.
7. **Timeline** — filterable chronological feed (All / Decisions /
   Missions / Milestones), grouped by month.
8. **Profile & Progress** — avatar, level, membership badge, progress
   ring, key-goal list with real units and completion counts.

The implemented app (`app/`) maps 1:1 onto these eight screens, plus a
landing page (`/`) and paywall (`/paywall`) that weren't in the mockup
set but follow the same visual language.
