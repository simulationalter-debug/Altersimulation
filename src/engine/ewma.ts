/**
 * Exponentially-weighted moving average rate, per spec §1.3 / §2.
 * `deltas` is ordered oldest → newest and should already be windowed
 * (see `windowedDeltas`). EWMA is seeded at 0 so a goal with no history
 * yet — or one that's gone completely quiet — decays toward 0 rather
 * than carrying forward a stale rate.
 */
export function ewmaRate(deltas: number[], halfLifeDays: number): number {
  const alpha = 1 - Math.pow(0.5, 1 / halfLifeDays);
  let ewma = 0;
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
