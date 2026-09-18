import type { ShardCombo, ShardPlayer } from "../domain/entities";

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
