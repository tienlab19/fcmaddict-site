export type PlayerReview = {
  id: number;
  slug: string;
  name: string;
  position: string;
  event: string;
  image: string;
  rating: number;
  weakFoot: string;
  skillMoves: string;
  stamina: number;
  pros: string;
  cons: string;
  verdict: string;
  stats: { label: string; value: number }[];
};

export type LatestPlayer = {
  id: number;
  name: string;
  rating: number;
  position: string;
  added: string;
  auctionable: boolean;
  image: string;
  club: string;
  nation: string;
  program: string;
  stats: Record<string, number>;
};

export type RankingCard = {
  rank: number;
  name: string;
  image: string;
  marketValue: string;
  weakFoot: string;
  skillMoves: string;
  stamina: string;
  reviewLink: string;
};

export type RankingGroup = {
  updatedAt: string;
  cards: RankingCard[];
};

export type ShardPlayer = {
  id: string;
  name: string;
  image: string;
  overall: number;
  position: string;
  shardValue: number;
  event: string;
  quality: string;
  alternatives: string[];
};

export type ShardCombo = {
  players: { player: ShardPlayer; assignedPosition: string }[];
  totalCost: number;
  score: number;
  percentage: number;
};

export type AppData = {
  generatedAt: string;
  reviews: PlayerReview[];
  codes: { id: number; code: string; reward: string; addedDate: string; active: boolean }[];
  cards: { id: number; title: string; image: string; animatedImage: string; type: string }[];
  playerRenders: Asset[];
  iconRenders: Asset[];
  rankings: Record<string, { top: RankingGroup; mid: RankingGroup; low: RankingGroup }>;
  shardPlayers: ShardPlayer[];
  latestPlayers: LatestPlayer[];
};

export type Asset = {
  id: number;
  name: string;
  image: string;
  primary: string;
  secondary: string;
};

const qualityWeight: Record<string, number> = {
  super: 5,
  best: 4,
  good: 3,
  average: 2,
  bad: 1,
};

function supports(player: ShardPlayer, position: string) {
  return player.position === position || player.alternatives.includes(position);
}

function playerScore(player: ShardPlayer) {
  return (qualityWeight[player.quality] ?? 1) * 1000 + player.overall;
}

export function findShardCombos({
  budget,
  positions,
  players,
  event,
}: {
  budget: number;
  positions: string[];
  players: ShardPlayer[];
  event?: string;
}): ShardCombo[] {
  if (budget <= 0 || positions.length === 0) return [];
  const available = event ? players.filter((player) => player.event === event) : players;
  const byPosition = Object.fromEntries(
    positions.map((position) => [
      position,
      available
        .filter((player) => supports(player, position))
        .sort((left, right) => {
          const score = playerScore(right) - playerScore(left);
          return score || left.shardValue - right.shardValue;
        }),
    ]),
  ) as Record<string, ShardPlayer[]>;
  if (positions.some((position) => byPosition[position].length === 0)) return [];

  const candidates: Omit<ShardCombo, "percentage">[] = [];
  const selected: ShardCombo["players"] = [];
  const usedIds = new Set<string>();

  function search(positionIndex: number, totalCost: number) {
    if (candidates.length >= 300) return;
    if (positionIndex === positions.length) {
      candidates.push({
        players: [...selected],
        totalCost,
        score: selected.reduce((sum, item) => sum + playerScore(item.player), 0),
      });
      return;
    }
    const position = positions[positionIndex];
    for (const player of byPosition[position]) {
      if (usedIds.has(player.id)) continue;
      const nextCost = totalCost + player.shardValue;
      if (nextCost > budget) continue;
      selected.push({ player, assignedPosition: position });
      usedIds.add(player.id);
      search(positionIndex + 1, nextCost);
      usedIds.delete(player.id);
      selected.pop();
      if (candidates.length >= 300) return;
    }
  }

  search(0, 0);
  candidates.sort((left, right) => right.score - left.score || left.totalCost - right.totalCost);
  const unique: typeof candidates = [];
  const signatures = new Set<string>();
  for (const candidate of candidates) {
    const signature = candidate.players.map((item) => item.player.id).sort().join(",");
    if (signatures.has(signature)) continue;
    signatures.add(signature);
    unique.push(candidate);
    if (unique.length === 15) break;
  }
  const bestScore = unique[0]?.score ?? 0;
  return unique.map((candidate) => ({
    ...candidate,
    percentage: bestScore ? Math.round((candidate.score / bestScore) * 100) : 0,
  }));
}

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

export function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}
