import { useState, useSyncExternalStore } from 'react';
import { ArtRenderer } from './ArtRenderer';
import type { RenderSource, Playback } from './ArtRenderer';
import { dnaSchema } from '../schema/artwork';

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
export function ArtStage({ source }: { source: RenderSource }) {
  const reduceMotion = useSyncExternalStore(subscribe, reduced, () => true);
  const [manual, setManual] = useState<Playback | null>(null);
  const [optIn, setOptIn] = useState(false);
  const parsed = dnaSchema.safeParse(source.dna);
  const animated =
    parsed.success &&
    parsed.data.elements.some((element) => element.motion.kind !== 'static');
  const state = manual ?? (reduceMotion ? 'rest' : 'playing');
  return (
    <div className="art-stage">
      <ArtRenderer
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
            onClick={() => {
              setOptIn(true);
              setManual(state === 'playing' ? 'paused' : 'playing');
            }}
          >
            {state === 'playing'
              ? 'Animation pausieren'
              : 'Animation abspielen'}
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
