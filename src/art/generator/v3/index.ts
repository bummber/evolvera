import { layerNames, type DnaV3 } from '../../schema/artwork-v3';
import {
  originRequestSchema,
  originStudySchema,
  type OriginStudy,
} from '../../schema/preview-v3';
import { hashSeed } from '../random';
import { compose, drawFlags, type Recipe } from './compose';
import type { Family } from './families';

// Generator 0.3.0, part A (EP-01, P3): independent origin works in schema 3.
// Pure functions without React, browser, clock or file access. No
// inheritance, no titles and no official artworks yet.

export const GENERATOR_VERSION_V3 = '0.3.0';
/** Deterministic attempts per work: retry 0 to 15. Over 20,000 seeds of the
 * standard profile the highest retry needed was 6. */
export const MAX_RETRY = 15;

const layerLabels = {
  background: 'Hintergrund',
  structure: 'Struktur',
  accent: 'Akzent',
} as const;
const familyLabels: Record<Family, string> = {
  geometric: 'geometrische Konstellation',
  'color-field': 'Farbfeld',
  mosaic: 'Mosaik',
  organic: 'organische Formen',
  generative: 'generative Struktur',
  chaotic: 'chaotische Überlagerung',
};
const strategyLabels: Record<Recipe['paletteStrategy'], string> = {
  harmonic: 'harmonisch',
  complementary: 'komplementär',
  monochrome: 'monochrom',
  free: 'frei',
};
const featureLabels: Record<keyof Recipe['features'], string> = {
  gradients: 'Verläufe',
  patterns: 'Muster',
  masks: 'Masken',
  blendModes: 'Blendmodi',
  blurShadow: 'Unschärfe oder Schatten',
  lines: 'Linien',
  curves: 'Kurven und Bögen',
  generativeShapes: 'generative Formen',
  animation: 'Bewegung',
  symmetry: 'Symmetrie',
};

function describe(dna: DnaV3, recipe: Recipe) {
  const layers = layerNames
    .filter((name) => dna.layers[name])
    .map(
      (name) =>
        `${layerLabels[name]} ${familyLabels[dna.layers[name]!.family]}`,
    );
  const features = (Object.keys(featureLabels) as (keyof Recipe['features'])[])
    .filter((name) => recipe.features[name])
    .map((name) => featureLabels[name]);
  return [
    `Unabhängiges Probewerk mit ${dna.elements.length} Elementen in ${layers.length === 1 ? 'einer Ebene' : `${layers.length} Ebenen`}: ${layers.join(', ')}.`,
    `Palette ${strategyLabels[recipe.paletteStrategy]}.`,
    features.length
      ? `Merkmale: ${features.join(', ')}.`
      : 'Ohne zusätzliche Merkmale.',
  ].join(' ');
}

/**
 * One independent origin study from a seed and a complete settings snapshot.
 * The same input always yields the same study. An attempt that fails a hard
 * check (visibility anchor, load limits, drawn features) is repeated with
 * the next retry seed; nothing is relaxed.
 */
export function generateOriginV3(input: unknown): OriginStudy {
  const { seed, settings } = originRequestSchema.parse(input);
  const base = `${GENERATOR_VERSION_V3}:origin:${seed}`;
  // Feature decisions belong to the work, not to the attempt: a retry
  // composes differently but never changes what was drawn.
  const flags = drawFlags(base, settings);
  for (let retry = 0; retry <= MAX_RETRY; retry++) {
    const result = compose(`${base}:retry-${retry}`, settings, flags);
    if (!result) continue;
    return originStudySchema.parse({
      schemaVersion: 1,
      kind: 'origin-preview',
      id: `ep01-origin-${hashSeed(seed).toString(16).padStart(8, '0')}`,
      seed,
      generatorVersion: GENERATOR_VERSION_V3,
      rendererVersion: '2',
      retry,
      settings,
      recipe: result.recipe,
      description: describe(result.dna, result.recipe),
      dna: result.dna,
    });
  }
  throw new Error(
    'Kein gültiges Ursprungswerk nach den deterministischen Versuchen.',
  );
}
