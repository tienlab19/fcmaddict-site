import assert from "node:assert/strict";
import test from "node:test";

import { calculateSquadOvr, findShardCombos } from "../features/tools/domain/toolkit.ts";

test("OVR web giữ đúng công thức Flutter", () => {
  assert.deepEqual(
    calculateSquadOvr({
      starters: Array(11).fill(90),
      bench: [80, null, null, null, null, null, null],
      badgeCount: 2,
    }),
    { squadOvr: 92, base: 90, playerOvrNeeded: 11, squadSize: 12 },
  );
});

test("ShardIQ không lặp cầu thủ và không vượt ngân sách", () => {
  const players = [
    { id: "1", name: "A", image: "", overall: 120, position: "ST", shardValue: 50, event: "X", quality: "super", alternatives: ["RW"] },
    { id: "2", name: "B", image: "", overall: 118, position: "RW", shardValue: 40, event: "X", quality: "best", alternatives: [] },
    { id: "3", name: "C", image: "", overall: 115, position: "ST", shardValue: 30, event: "X", quality: "good", alternatives: [] },
  ];
  const combos = findShardCombos({ budget: 90, positions: ["ST", "RW"], players });
  assert.ok(combos.length > 0);
  assert.ok(combos.every((combo) => combo.totalCost <= 90));
  assert.ok(combos.every((combo) => new Set(combo.players.map((item) => item.player.id)).size === 2));
});
