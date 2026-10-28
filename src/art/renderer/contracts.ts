import type { Artwork } from '../schema/artwork';

export type RendererRequest = Readonly<{
  artwork: Artwork;
  presentation: 'rest' | 'main';
  motion: 'paused' | 'playing';
}>;
export const SUPPORTED_RENDERER_VERSION = '1';
// Renderer V1 is implemented in ArtRenderer.tsx. Evolution and official runs remain disabled.
