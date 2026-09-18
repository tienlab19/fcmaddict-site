import type { AppData } from "../domain/entities";

export interface AppDataRepository {
  load(signal: AbortSignal): Promise<AppData>;
}

export function loadAppData(
  repository: AppDataRepository,
  signal: AbortSignal,
) {
  return repository.load(signal);
}
