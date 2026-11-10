import { useState, useSyncExternalStore } from 'react';
import { ArtDispatch } from './ArtDispatch';
import type { RenderSource, Playback } from './ArtRenderer';
import { hasMotion } from './motion';

const query = '(prefers-reduced-motion: reduce)';
function subscribe(callback: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
const reduced = () =>
  typeof window.matchMedia !== 'function' || window.matchMedia(query).matches;

/** Mount with key=study.id to reset playback on selection. Visitor preference only. */
export function ArtStage({
  source,
  name,
}: {
  source: RenderSource;
  /** Distinguishes the playback button when a page shows several stages. */
  name?: string;
}) {
  const reduceMotion = useSyncExternalStore(subscribe, reduced, () => true);
  const [manual, setManual] = useState<Playback | null>(null);
  const [optIn, setOptIn] = useState(false);
  const animated = hasMotion(source);
  const state = manual ?? (reduceMotion ? 'rest' : 'playing');
  const action =
    state === 'playing' ? 'Animation pausieren' : 'Animation abspielen';
  return (
    <div className="art-stage">
      <ArtDispatch
        source={source}
        presentation="main"
        playback={animated ? state : 'rest'}
        motionOptIn={optIn}
      />
      <div className="art-controls">
        {animated ? (
          <button
            type="button"
            aria-pressed={state === 'playing'}
            aria-label={name ? `${action}: ${name}` : undefined}
            onClick={() => {
              setOptIn(true);
              setManual(state === 'playing' ? 'paused' : 'playing');
            }}
          >
            {action}
          </button>
        ) : (
          <span>Statische Komposition</span>
        )}
        <span>
          {reduceMotion && !optIn
            ? 'Reduzierte Bewegung beachtet'
            : 'Bewegung nur im Hauptwerk'}
        </span>
      </div>
    </div>
  );
}
