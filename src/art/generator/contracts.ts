import type { GenerationConfig } from '../schema/config';
import type { EvolutionArtwork } from '../schema/artwork';
import type { GenerationInput } from './evolve';
export type GenerationSnapshot = Readonly<GenerationConfig>;
export type GenerationRequest = Readonly<GenerationInput>;
export type Generator = (
  request: GenerationRequest,
  clock: () => string,
) => EvolutionArtwork;
// Pure generation core only; official orchestration and writes remain disabled.
