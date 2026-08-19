/**
 * Exponentially-weighted moving average rate, per spec §1.3 / §2.
 * `deltas` is ordered oldest → newest and should already be windowed
 * (see `windowedDeltas`). Seeded at `seed` (default 0) rather than always
 * 0: a goal with real action history converges onto that history within
 * a few days regardless of seed (short half-life), but a *brand new*
 * goal with zero actions logged would otherwise report projected_rate=0
 * forever — which zeroes out pace_ratio and silently defeats every
 * decision/mission on day one (§4's "three weeks closer" moment never
 * fires). Callers seed new goals with their onboarding passive rate so
 * "no data yet" reads as "assume today's habits," not "assume nothing
 * ever happens" — and a goal that's gone completely quiet after some
 * history still decays toward whatever it's seeded with.
 */
export function ewmaRate(deltas: number[], halfLifeDays: number, seed = 0): number {
  const alpha = 1 - Math.pow(0.5, 1 / halfLifeDays);
  let ewma = seed;
  for (const d of deltas) {
    ewma = alpha * d + (1 - alpha) * ewma;
  }
  return ewma;
}

/** 25th percentile (worst quartile) of a numeric series. Empty input → 0. */
export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}
