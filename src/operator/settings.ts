import rawConfig from '../../config/generation.json';
import { configSchema } from '../art/schema/config';
import type { GenerationSnapshot } from '../art/generator/contracts';

export const initialSettings = Object.freeze(configSchema.parse(rawConfig));

/** Pure boundary helper; it does not acquire a lock, refresh Git or start a run. */
export function snapshotSettings(input: unknown): GenerationSnapshot {
  return Object.freeze(configSchema.parse(input));
}
