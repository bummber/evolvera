import { ArtRenderer } from './ArtRenderer';
import type { Playback, RenderSource } from './ArtRenderer';
import { ArtRendererV2 } from './ArtRendererV2';

/**
 * Selects the renderer by the stored `rendererVersion`. Renderer 1 is frozen
 * in ArtRenderer.tsx; renderer 2 (EP-01) draws artwork schema 3. A work is
 * never drawn with the rules of another version.
 */
export function ArtDispatch(props: {
  source: RenderSource;
  presentation?: 'rest' | 'main';
  playback?: Playback;
  motionOptIn?: boolean;
}) {
  if (props.source.rendererVersion === '2') return <ArtRendererV2 {...props} />;
  // Version 1 and every unknown version: ArtRenderer draws 1 and refuses the rest.
  return <ArtRenderer {...props} />;
}
