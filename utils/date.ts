export function todayKey(): string {
  return toKey(new Date());
}

export function toKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(fromIso.slice(0, 10));
  const to = new Date(toIso.slice(0, 10));
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

export function addMonths(d: Date, months: number): Date {
  const copy = new Date(d);
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function weeksUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.round(ms / (7 * 86_400_000)));
}
