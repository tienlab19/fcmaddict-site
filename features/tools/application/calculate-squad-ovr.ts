export function calculateSquadOvr({
  starters,
  bench,
  badgeCount,
}: {
  starters: (number | null)[];
  bench: (number | null)[];
  badgeCount: number;
}) {
  const filledBench = bench.filter((value): value is number => value != null);
  const hasInput = starters.some((value) => value != null) || filledBench.length > 0;
  if (!hasInput) {
    return { squadOvr: null, base: null, playerOvrNeeded: null, squadSize: 11 };
  }
  const squadSize = 11 + filledBench.length;
  const sum = starters.reduce<number>((total, value) => total + (value ?? 0), 0)
    + filledBench.reduce((total, value) => total + value, 0);
  const base = Math.ceil(sum / squadSize);
  return {
    squadOvr: base + badgeCount,
    base,
    playerOvrNeeded: base * squadSize + 1 - sum,
    squadSize,
  };
}
