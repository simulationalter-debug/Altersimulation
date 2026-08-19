# features/future-self

No dedicated module yet — "Future You" is currently just the engine's
normal Goal/Action projection (`timelinePct` in
`features/simulations/engine`), rendered by `app/future-you/page.tsx`
and `app/home/page.tsx`. This folder is reserved for Future-You-specific
logic that doesn't belong in the general-purpose engine — e.g. narrative
generation for milestone moments, avatar/appearance evolution as levels
increase, or the "weekly Future Report" from the ALTER+ tier — once
those exist.
