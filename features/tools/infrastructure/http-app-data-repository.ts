import type { AppDataRepository } from "../application/load-app-data";
import type { AppData } from "../domain/toolkit";

function parseAppData(value: unknown): AppData {
  if (!value || typeof value !== "object") throw new Error("Invalid app data");
  const data = value as Partial<AppData>;
  const arrays = [
    data.reviews,
    data.codes,
    data.cards,
    data.playerRenders,
    data.iconRenders,
    data.shardPlayers,
    data.latestPlayers,
  ];
  if (
    typeof data.generatedAt !== "string"
    || !data.rankings
    || typeof data.rankings !== "object"
    || arrays.some((items) => !Array.isArray(items))
  ) {
    throw new Error("Invalid app data");
  }
  return data as AppData;
}

export const httpAppDataRepository: AppDataRepository = {
  async load(signal) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const response = await fetch(`${basePath}/data/app-data.json`, { signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return parseAppData(await response.json());
  },
};
