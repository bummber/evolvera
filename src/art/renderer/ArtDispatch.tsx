import { ArtRenderer } from './ArtRenderer';
import type { Playback, RenderSource } from './ArtRenderer';

/**
 * Selects the renderer by the stored `rendererVersion`. Renderer 1 is frozen
 * in ArtRenderer.tsx. Renderer 2 (EP-01, P2) does not exist yet, so its works
 * are reported as not displayable instead of being drawn with other rules.
 */
export function ArtDispatch(props: {
  source: RenderSource;
  presentation?: 'rest' | 'main';
  playback?: Playback;
  motionOptIn?: boolean;
}) {
  if (props.source.rendererVersion === '2')
    return (
      <p role="alert">
        Dieses Werk braucht Renderer 2 und ist in dieser Version noch nicht
        darstellbar.
      </p>
    );
  // Version 1 and every unknown version: ArtRenderer draws 1 and refuses the rest.
  return <ArtRenderer {...props} />;
}
