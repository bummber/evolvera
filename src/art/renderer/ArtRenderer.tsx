import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { dnaSchema } from '../schema/artwork';
import styles from './ArtV1.module.css';

export type Playback = 'rest' | 'playing' | 'paused';
export type RenderSource = {
  rendererVersion: string;
  dna: unknown;
  description: string;
};

/** V1 is frozen for archived DNA. Future renderers must use a new dispatch version. */
export function ArtRenderer({
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
        String(node.getBoundingClientRect().width / 1000),
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
  const parsed = dnaSchema.safeParse(source.dna);
  if (source.rendererVersion !== '1' || !parsed.success) {
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
      data-renderer="1"
      data-state={state}
      data-opt-in={motionOptIn ? 'true' : 'false'}
      style={{ backgroundColor: dna.background }}
    >
      <div className={styles.plane} aria-hidden="true">
        {dna.elements.map((element, index) => (
          <div
            key={index}
            className={`${styles.shape} ${styles[element.motion.kind] ?? ''}`}
            data-art-element={element.kind}
            style={
              {
                left: element.x * 1000,
                top: element.y * 1000,
                width: element.width * 1000,
                height: element.height * 1000,
                rotate: `${element.rotation}deg`,
                backgroundColor: element.color,
                opacity: element.opacity,
                borderRadius: ['circle', 'ellipse'].includes(element.kind)
                  ? '50%'
                  : 0,
                '--duration': `${element.motion.durationSeconds}s`,
                '--alpha': element.opacity,
                '--travel': `${element.motion.amplitude * 1000}px`,
                '--amplitude': element.motion.amplitude,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
