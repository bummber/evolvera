import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { dnaV3Schema, type DnaV3 } from '../schema/artwork-v3';
import type { Playback, RenderSource } from './ArtRenderer';
import styles from './ArtV2.module.css';
import {
  arcClip,
  clipToCss,
  pathClip,
  polygonClip,
  ringClip,
} from './v2/geometry';
import { effectStyles, fillBackground } from './v2/paint';

const PLANE = 1000;

/** Outline of one element: a border radius or a computed clip polygon. */
function outline(element: DnaV3['elements'][number]) {
  const width = element.width * PLANE;
  const height = element.height * PLANE;
  switch (element.kind) {
    case 'rectangle':
    case 'line':
      return {};
    case 'circle':
    case 'ellipse':
      return { '--radius': '50%' };
    case 'blob': {
      const radii = element.shape.radii.map((r) => `${Math.round(r * 100)}%`);
      return {
        '--radius': `${radii.slice(0, 4).join(' ')} / ${radii.slice(4).join(' ')}`,
      };
    }
    case 'arc':
      return {
        '--clip': clipToCss(
          arcClip(
            width,
            height,
            element.shape.start,
            element.shape.sweep,
            element.shape.strokeWidth * PLANE,
          ),
        ),
      };
    case 'ring':
      return {
        '--clip': clipToCss(
          ringClip(width, height, element.shape.strokeWidth * PLANE),
        ),
      };
    case 'polygon':
      return {
        '--clip': clipToCss(polygonClip(element.shape.points, width, height)),
      };
    case 'path':
      return {
        '--clip': clipToCss(
          pathClip(
            element.shape.commands,
            element.shape.closed,
            element.shape.strokeWidth === undefined
              ? undefined
              : element.shape.strokeWidth * PLANE,
            width,
            height,
          ),
        ),
      };
  }
}

/** Renderer 2 for artwork schema 3 (EP-01). Draws stored DNA only, as HTML and CSS. */
export function ArtRendererV2({
  source,
  presentation = 'rest',
  playback = 'rest',
  motionOptIn = false,
}: {
  source: RenderSource;
  presentation?: 'rest' | 'main';
  playback?: Playback;
  motionOptIn?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const node = frame.current;
    if (!node) return;
    const scale = () =>
      node.style.setProperty(
        '--art-scale',
        String(node.getBoundingClientRect().width / PLANE),
      );
    scale();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', scale);
      return () => window.removeEventListener('resize', scale);
    }
    const observer = new ResizeObserver(scale);
    observer.observe(node);
    return () => observer.disconnect();
  }, [source]);
  const parsed = dnaV3Schema.safeParse(source.dna);
  if (source.rendererVersion !== '2' || !parsed.success) {
    return (
      <p role="alert">
        Diese Werkdaten oder Renderer-Version können nicht sicher dargestellt
        werden.
      </p>
    );
  }
  const dna = parsed.data;
  const state = presentation === 'rest' ? 'rest' : playback;
  return (
    <div
      ref={frame}
      className={styles.frame}
      role="img"
      aria-label={source.description}
      data-renderer="2"
      data-state={state}
      data-opt-in={motionOptIn ? 'true' : 'false'}
      style={{ backgroundColor: dna.background }}
    >
      <div
        className={styles.plane}
        aria-hidden="true"
        style={{ backgroundColor: dna.background }}
      >
        {dna.elements.map((element, index) => {
          const effects = effectStyles(element.effects);
          const style: Record<string, string | number | undefined> = {
            left: element.x * PLANE,
            top: element.y * PLANE,
            width: element.width * PLANE,
            height: element.height * PLANE,
            rotate: `${element.rotation}deg`,
            opacity: element.opacity,
            ...effects,
            WebkitMaskImage: effects.maskImage,
            '--fill': fillBackground(element.fill),
            ...outline(element),
            '--duration': `${element.motion.durationSeconds}s`,
            '--alpha': element.opacity,
            '--travel': `${element.motion.amplitude * PLANE}px`,
            '--amplitude': element.motion.amplitude,
          };
          return (
            <div
              key={index}
              className={`${styles.shape} ${styles[element.motion.kind] ?? ''}`}
              data-art-element={element.kind}
              data-art-layer={element.layer}
              style={style as CSSProperties}
            />
          );
        })}
      </div>
    </div>
  );
}
