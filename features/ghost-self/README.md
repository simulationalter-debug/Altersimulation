# features/ghost-self

No dedicated module yet — "Ghost You" is implemented entirely inside
the engine (`features/simulations/engine/ghost.ts`: cold-start/warm
blend, floor revision) and rendered by `app/ghost-you/page.tsx`. This
folder is reserved for Ghost-specific product logic that sits above the
engine's math — e.g. the "Not Today, Ghost" achievement (engine spec
§3), Ghost's notification/interjection copy, or per-user tone-guard
tuning — once those exist.
