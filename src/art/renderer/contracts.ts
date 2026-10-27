import type { Artwork } from '../schema/artwork';

export type RendererRequest = Readonly<{
  artwork: Artwork;
  presentation: 'rest' | 'main';
  motion: 'paused' | 'playing';
}>;
export const SUPPORTED_RENDERER_VERSION = '1';
// Reserved contract, no artwork renderer yet. Phase 1 must isolate styles,
// scale every visual measure together and define a deterministic visible rest state.
