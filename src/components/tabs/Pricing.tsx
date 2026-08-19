import Card from "../ui/Card";

interface Tier {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "£0",
    tagline: "Get your first timeline",
    features: ["Future Self", "3 goals", "Basic daily missions", "7-day timeline"],
  },
  {
    name: "ALTER+",
    price: "£9.99/mo",
    tagline: "Unlock the full simulation",
    highlight: true,
    features: [
      "Unlimited goals",
      "AI Future Self",
      "Ghost Timeline",
      "Advanced simulations",
      "Journalling",
      "Weekly Future Report",
      "Custom challenges",
    ],
  },
  {
    name: "ALTER Together",
    price: "£14.99/mo",
    tagline: "Build a future with someone",
    features: [
      "Everything in ALTER+",
      "Two accounts",
      "Shared future goals",
      "Relationship challenges",
      "Secret missions",
      "Date challenges",
    ],
  },
  {
    name: "ALTER Family",
    price: "£19.99/mo",
    tagline: "One future, the whole household",
    features: ["Shared family goals", "Family routines", "Family challenges"],
  },
];

export default function Pricing() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Feed the right timeline</h1>
        <p className="mt-1 text-white/50">Upgrade any time. Cancel any time.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier) => (
          <Card
            key={tier.name}
            className={`flex flex-col ${
              tier.highlight ? "border-[#8b7bff]/50 bg-[#8b7bff]/[0.06]" : ""
            }`}
          >
            {tier.highlight && (
              <span className="mb-3 w-fit rounded-full bg-gradient-to-r from-[#8b7bff] to-[#5aa9ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0a0a12]">
                Most popular
              </span>
            )}
            <h2 className="text-lg font-bold">{tier.name}</h2>
            <p className="text-xs text-white/40">{tier.tagline}</p>
            <p className="mt-3 text-2xl font-bold">{tier.price}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-white/70">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#7ee787]">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`mt-5 w-full rounded-full py-2.5 text-sm font-semibold transition ${
                tier.highlight
                  ? "bg-gradient-to-r from-[#8b7bff] to-[#5aa9ff] text-[#0a0a12] hover:brightness-110"
                  : "border border-white/15 text-white/80 hover:border-white/30"
              }`}
            >
              {tier.name === "Free" ? "Current plan" : "Upgrade"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
