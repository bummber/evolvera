import rawConfig from '../../config/generation.json';
import { configSchema, readGenerationConfig } from '../art/schema/config';
import type { GenerationSnapshot } from '../art/generator/contracts';

/** Published configuration, schema 1 or 2, with its effective profile. */
export const initialSettings = readGenerationConfig(rawConfig);

/** Pure boundary helper; it does not acquire a lock, refresh Git or start a run. */
export function snapshotSettings(input: unknown): GenerationSnapshot {
  return Object.freeze(configSchema.parse(input));
}
