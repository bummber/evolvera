import type { Artwork } from '../schema/artwork';
import type { GenerationConfig } from '../schema/config';

/** Immutable input captured after the future exclusive run lock and fresh checkout. */
export type GenerationSnapshot = Readonly<GenerationConfig>;
export type GenerationRequest = Readonly<{
  workDate: string;
  seed: string;
  runStartedAt: string;
  settings: GenerationSnapshot;
  parents: readonly Artwork[];
}>;
export type Generator = (request: GenerationRequest) => Artwork;
// Official generator contract remains reserved. Phase 1 implements independent preview DNA in study.ts, not evolution or scheduling.
