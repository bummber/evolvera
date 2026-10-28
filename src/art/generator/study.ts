import type { Dna } from '../schema/artwork';
import {
  previewSchema,
  studyRequestSchema,
  familyLabels,
} from '../schema/preview';
import type { PreviewStudy, StudyFamily } from '../schema/preview';
import { createRandom, hashSeed } from './random';
import type { Random } from './random';

export const GENERATOR_VERSION = '0.1.0';
type Element = Dna['elements'][number];
const palettes = [
  ['#191c29', '#ff6651', '#e3ed82', '#b2b9f0', '#f2e6ce'],
  ['#ece4cc', '#17372c', '#e94d29', '#2254d2', '#6d3c63'],
  ['#2c1942', '#efc5d0', '#f99b37', '#72c8b7', '#e9edcc'],
  ['#d0e7df', '#1a2647', '#c8384e', '#803bbb', '#416641'],
  ['#174346', '#f6da5f', '#f6bc9b', '#e26140', '#a6c1f4'],
  ['#eac3af', '#3240a2', '#642c2e', '#1b5c48', '#a13458'],
  ['#232228', '#d2cbf0', '#fe8a39', '#e4edc1', '#70b5cd'],
  ['#e7eafb', '#923257', '#1d3831', '#3c47b4', '#ba4528'],
] as const;
const round = (value: number) => Math.round(value * 1e6) / 1e6;
function shape(
  random: Random,
  color: string,
  patch: Partial<Element> = {},
): Element {
  return {
    kind: 'rectangle',
    x: 0.1,
    y: 0.1,
    width: 0.2,
    height: 0.2,
    rotation: 0,
    color,
    opacity: 1,
    motion: {
      kind: 'static',
      durationSeconds: random.integer(12, 60),
      amplitude: 0,
    },
    ...patch,
  };
}
function composition(seed: string, family: StudyFamily): Dna {
  const random = createRandom(seed);
  const [background, ...colors] = random.pick(palettes);
  const elements: Element[] = [];
  if (family === 'geometric') {
    const count = random.integer(8, 18);
    for (let index = 0; index < count; index++) {
      const kind = random.pick([
        'circle',
        'rectangle',
        'ellipse',
        'line',
      ] as const);
      const size = round(random.between(0.1, 0.34));
      elements.push(
        shape(random, random.pick(colors), {
          kind,
          x: round(random.between(0.06, 0.63)),
          y: round(random.between(0.06, 0.63)),
          width: kind === 'line' ? 0.007 : size,
          height: kind === 'circle' ? size : round(random.between(0.12, 0.4)),
          rotation: kind === 'circle' ? 0 : random.integer(-70, 70),
          opacity: round(random.between(0.65, 1)),
          motion: {
            kind: random.pick(['static', 'rotate', 'float'] as const),
            durationSeconds: random.integer(18, 72),
            amplitude: round(random.between(0.015, 0.045)),
          },
        }),
      );
    }
  } else if (family === 'color-field') {
    const vertical = random.next() > 0.5;
    const count = random.integer(3, 5);
    for (let index = 0; index < count; index++) {
      elements.push(
        shape(random, colors[index % colors.length]!, {
          x: vertical
            ? round(0.08 + index * 0.16)
            : round(random.between(0.06, 0.25)),
          y: vertical
            ? round(random.between(0.08, 0.3))
            : round(0.08 + index * 0.16),
          width: vertical
            ? round(random.between(0.12, 0.24))
            : round(random.between(0.5, 0.68)),
          height: vertical
            ? round(random.between(0.5, 0.67))
            : round(random.between(0.13, 0.23)),
        }),
      );
    }
  } else {
    const columns = random.integer(4, 7);
    const cell = 0.84 / columns;
    for (let row = 0; row < columns; row++) {
      for (let col = 0; col < columns; col++) {
        const animated = random.next() < 0.15;
        elements.push(
          shape(random, random.pick(colors), {
            kind: random.pick(['rectangle', 'rectangle', 'circle'] as const),
            x: round(0.08 + col * cell),
            y: round(0.08 + row * cell),
            width: round(cell * random.between(0.7, 0.92)),
            height: round(cell * 0.9),
            rotation: random.next() < 0.18 ? random.pick([-15, 15, 30]) : 0,
            motion: {
              kind: animated ? 'pulse' : 'static',
              durationSeconds: random.integer(12, 36),
              amplitude: 0.08,
            },
          }),
        );
      }
    }
  }
  // Bound unrotated boxes to the logical surface; rotation may crop deliberately.
  for (const element of elements) {
    element.width = round(Math.min(element.width, 1 - element.x));
    element.height = round(Math.min(element.height, 1 - element.y));
  }
  // Topmost visible anchor. No reliance on hidden elements, titles or randomness at render time.
  const anchorColor = colors.find((color) => contrast(background, color) >= 3);
  if (!anchorColor)
    throw new Error('Palette ohne ausreichend sichtbaren Akzent.');
  elements.push(
    shape(random, anchorColor, {
      kind: family === 'color-field' ? 'rectangle' : 'circle',
      x: round(random.between(0.45, 0.67)),
      y: round(random.between(0.45, 0.67)),
      width: family === 'mosaic' ? 0.13 : 0.22,
      height: family === 'mosaic' ? 0.13 : 0.22,
    }),
  );
  return { family, background, elements };
}
function luminance(hex: string) {
  const values = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return values[0]! * 0.2126 + values[1]! * 0.7152 + values[2]! * 0.0722;
}
export function contrast(a: string, b: string) {
  const first = luminance(a),
    second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}
export function hasVisibleAnchor(dna: Dna): boolean {
  const last = dna.elements.at(-1);
  return (
    !!last &&
    last.opacity >= 0.65 &&
    last.width >= 0.12 &&
    last.height >= 0.12 &&
    last.x + last.width <= 1 &&
    last.y + last.height <= 1 &&
    last.rotation === 0 &&
    last.motion.kind === 'static' &&
    contrast(dna.background, last.color) >= 3
  );
}
/** Phase 1: independent preview DNA only. No dates, parents, titles or official writes. */
export function generateStudy(input: unknown): PreviewStudy {
  const { seed, family } = studyRequestSchema.parse(input);
  for (let retry = 0; retry <= 3; retry++) {
    const dna = composition(
      `${GENERATOR_VERSION}:${family}:${seed}:retry-${retry}`,
      family,
    );
    const study = previewSchema.parse({
      schemaVersion: 1,
      kind: 'preview',
      id: `preview-${family}-${hashSeed(seed).toString(16).padStart(8, '0')}`,
      seed,
      generatorVersion: GENERATOR_VERSION,
      rendererVersion: '1',
      retry,
      dna,
      description: `${familyLabels[family]}; Hintergrund ${dna.background}, ${dna.elements.length} Formen. ${dna.elements.some((element) => element.motion.kind !== 'static') ? 'Mit dezenter Bewegung.' : 'Statische Komposition.'}`,
    });
    if (hasVisibleAnchor(study.dna)) return study;
  }
  throw new Error(
    'Keine sichtbare, gültige Vorschau nach deterministischen Versuchen.',
  );
}
