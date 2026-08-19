# Core user flow

```
/  (Landing)
 └─ "Build my Future Self" → /onboarding
      1. Pick 2+ focus areas (life categories)
      2. Name, avatar, target date (months out)
      3. One numeric target per area → creates real Goal objects
      └─ "Enter the simulation" → /home  (creates Future Self + Goals)

/home  (bottom nav: Home · Timeline · Ask Future Me · Profile)
 ├─ Future You card   → /future-you
 ├─ Ghost You card    → /ghost-you
 ├─ Life scores        (per-goal timeline_pct bars)
 ├─ Streak calendar
 ├─ Today's missions   → tap a mission → /missions/[missionId]
 └─ Today's decision   → /decisions

/decisions
 1. Pick a choice (A/B/C/D)
 2. "See Impact" → engine.simulateOptions() preview (no persistence yet)
 3. "Confirm this choice" → engine.applyDecisionEvent() + logs an Action
    → back to /home

/missions/[missionId]
 - Mission ring, steps, "Mission Complete!" → logs an Action, awards XP
 - Future Self line on completion

/timeline
 - Unified feed: decisions, missions, journal entries, milestones
 - Filterable (All / Decisions / Missions / Milestones)

/ask-future-me
 - Chat grounded in the user's own goals/actions/journal via
   services/ai (no external LLM call yet — see engine-spec.md §9)

/profile
 - Level, XP, overall progress ring, per-goal key stats (real units)
 - → /paywall (upgrade tiers)
 - Reset simulation → back to /
```

## Quick actions ("+" in the bottom nav)

Opens a sheet with two shortcuts: jump to `/decisions`, or open the
Journal modal in place (journal entries don't have their own route —
they're written from wherever the user is, then show up in `/timeline`
and feed Ask Future Me's low-state detection).
