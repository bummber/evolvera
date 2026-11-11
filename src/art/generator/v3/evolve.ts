import { z } from 'zod';
import { isCatchUp } from '../../../series/calendar';
import {
  anyArtworkSchema,
  artworkV3Schema,
  layerNames,
  type ArtworkV3,
  type DnaV3,
  type RecipeV3,
} from '../../schema/artwork-v3';
import { instantSchema, workDateSchema } from '../../schema/config';
import {
  settingsSnapshotSchema,
  type SettingsSnapshot,
} from '../../schema/preview-v3';
import { generateTitle } from '../../titles/generate';
import { compose, drawFlags } from './compose';
import { composeChild } from './inherit';
import { readParent } from './parents';
import { validateEvolutionV3 } from './provenance';
import { canonicalJson, sha256 } from './sha256';

// Generator 0.3.0, part B (EP-01, P4): complete artworks of schema 3, as
// origin or as child of the two preceding generations. Pure: the clock is
// injected and touches metadata only. No official run and no writes.

export const GENERATOR_VERSION_V3 = '0.3.0';
/** Deterministic attempts per work: retry 0 to 15, as for origin studies. */
export const MAX_RETRY_V3 = 15;

export const generationInputV3Schema = z.strictObject({
  generation: z.number().int().positive(),
  workDate: workDateSchema,
  seed: z.string().min(1).max(160),
  /** Complete effective settings of the run, frozen at its start. */
  settings: settingsSnapshotSchema,
  settingsRevision: z.number().int().positive(),
  parents: z.array(anyArtworkSchema).max(2),
  scheduledFor: instantSchema,
  runStartedAt: instantSchema,
  usedTitles: z.array(z.string().max(160)).max(10000).default([]),
  lexiconVersion: z.enum(['0.1.0', '0.2.0']).default('0.2.0'),
});
export type GenerationInputV3 = z.input<typeof generationInputV3Schema>;

/**
 * Digest of the complete settings snapshot and its revision (A-29). Any
 * change to a single switch gives another digest and so another work.
 */
export function settingsDigest(settings: SettingsSnapshot, revision: number) {
  return sha256(canonicalJson({ revision, settings }));
}
/** Stored seed: the seed of the run, bound to the settings digest. */
export const boundSeed = (seed: string, digest: string) =>
  `${seed}:settings-${digest}`;

/**
 * Placeholder until the similarity window exists (P5): no history context is
 * evaluated yet. The digest is that of an empty context, the distance is
 * unknown (`null`) and no minimum is claimed to be missed.
 */
export const NOVELTY_PLACEHOLDER: ArtworkV3['novelty'] = Object.freeze({
  distanceVersion: 1,
  contextDigest: sha256(canonicalJson({ distanceVersion: 1, window: [] })),
  distance: null,
  minimumReached: true,
});

const layerLabels = {
  background: 'Hintergrund',
  structure: 'Struktur',
  accent: 'Akzent',
} as const;
const familyLabels = {
  geometric: 'geometrische Konstellation',
  'color-field': 'Farbfeld',
  mosaic: 'Mosaik',
  organic: 'organische Formen',
  generative: 'generative Struktur',
  chaotic: 'chaotische Überlagerung',
} as const;
const heritageLabels = {
  new: 'neu',
  parentA: 'vom älteren Elternwerk',
  parentB: 'vom jüngeren Elternwerk',
  mixed: 'aus beiden Elternwerken gemischt',
} as const;

function describe(title: string, dna: DnaV3, recipe: Omit<RecipeV3, 'retry'>) {
  const origin = Object.values(recipe.layers).every(
    (heritage) => heritage === 'new',
  );
  const layers = layerNames
    .filter((name) => dna.layers[name])
    .map(
      (name) =>
        `${layerLabels[name]} ${familyLabels[dna.layers[name]!.family]}${origin ? '' : ` (${heritageLabels[recipe.layers[name]!]})`}`,
    );
  return [
    `${title}: ${dna.elements.length} Elemente in ${layers.length === 1 ? 'einer Ebene' : `${layers.length} Ebenen`}: ${layers.join(', ')}.`,
    `Palette ${heritageLabels[recipe.palette]}.`,
    ...(recipe.mutationJump ? ['Mit Mutationssprung.'] : []),
    dna.elements.some((element) => element.motion.kind !== 'static')
      ? 'Mit CSS-Bewegung.'
      : 'Statisch.',
  ].join(' ');
}

/**
 * One complete artwork of schema 3. The same input always yields the same
 * work apart from `generatedAt`. Generations 1 and 2 are independent
 * origins; later works are children of exactly the two preceding works,
 * which may still be stored in schema 1 or 2.
 */
export function generateArtworkV3(
  input: unknown,
  clock: () => string,
): ArtworkV3 {
  const request = generationInputV3Schema.parse(input);
  const generatedAt = instantSchema.parse(clock());
  const origin = request.generation <= 2;
  if (request.parents.length !== (origin ? 0 : 2))
    throw new Error('Ursprünge haben keine Eltern, Evolution hat genau zwei.');
  request.parents.forEach((parent, index) => {
    if (
      parent.generation !== request.generation - 2 + index ||
      parent.id >= request.workDate ||
      (index === 1 && request.parents[0]!.id >= parent.id)
    )
      throw new Error(
        'Nicht die beiden unmittelbar vorherigen Eltern in korrekter Reihenfolge.',
      );
  });
  const { settings } = request;
  const digest = settingsDigest(settings, request.settingsRevision);
  const parentDigest = sha256(
    canonicalJson(
      request.parents.map(({ id, title, dna }) => ({ id, title, dna })),
    ),
  );
  const base = `${GENERATOR_VERSION_V3}:work:${request.seed}:${request.generation}:${digest}:${parentDigest}`;
  // Feature decisions belong to the work, not to the attempt.
  const flags = drawFlags(base, settings);
  const views = request.parents.map(readParent);
  const title = generateTitle({
    seed: `${request.seed}:${request.generation}`,
    lexiconVersion: request.lexiconVersion,
    parents: request.parents.map(({ id, title }) => ({ id, title })),
    usedTitles: request.usedTitles,
  });
  for (let retry = 0; retry <= MAX_RETRY_V3; retry++) {
    const seed = `${base}:retry-${retry}`;
    let dna: DnaV3;
    let recipe: Omit<RecipeV3, 'retry'>;
    let decisions: ArtworkV3['evolution']['decisions'] = [];
    if (origin) {
      const result = compose(seed, settings, flags);
      if (!result) continue;
      dna = result.dna;
      recipe = {
        palette: 'new',
        layers: Object.fromEntries(
          layerNames
            .filter((name) => dna.layers[name])
            .map((name) => [name, 'new' as const]),
        ),
        mutationJump: false,
        features: result.recipe.features,
        anchor: result.recipe.anchor,
      };
    } else {
      const result = composeChild(seed, settings, flags, [
        views[0]!,
        views[1]!,
      ]);
      if (!result) continue;
      dna = result.dna;
      recipe = result.recipe;
      decisions = result.decisions.map(({ parent, ...decision }) => ({
        parentId: request.parents[parent]!.id,
        ...decision,
      }));
      // A child that repeats its younger parent exactly is no new work.
      if (JSON.stringify(dna) === JSON.stringify(request.parents.at(-1)!.dna))
        continue;
    }
    const work = artworkV3Schema.safeParse({
      schemaVersion: 3,
      generatorVersion: GENERATOR_VERSION_V3,
      rendererVersion: '2',
      lexiconVersion: request.lexiconVersion,
      id: request.workDate,
      generation: request.generation,
      title: title.title,
      description: describe(title.title, dna, recipe),
      timezone: 'Europe/Berlin',
      scheduledFor: request.scheduledFor,
      generatedAt,
      runStartedAt: request.runStartedAt,
      isCatchUp: isCatchUp(request.workDate, request.runStartedAt),
      seed: boundSeed(request.seed, digest),
      inheritanceMode: settings.inheritanceMode,
      settingsRevision: request.settingsRevision,
      settings,
      novelty: NOVELTY_PLACEHOLDER,
      parentIds: request.parents.map((parent) => parent.id),
      dna,
      titleDna: {
        tokens: title.tokens,
        pattern: title.pattern,
        parentFragments: title.parentFragments,
      },
      evolution: {
        type: origin ? 'origin' : 'hybrid',
        evaluatedParentIds: request.parents.map((parent) => parent.id),
        decisions,
        recipe: { retry, ...recipe },
      },
    });
    // Metadata errors do not heal with another attempt.
    if (!work.success) throw work.error;
    return validateEvolutionV3(work.data, request.parents);
  }
  throw new Error('Kein gültiges Werk nach den deterministischen Versuchen.');
}
