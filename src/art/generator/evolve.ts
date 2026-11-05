import { isCatchUp } from '../../series/calendar';
import { z } from 'zod';
import { artworkSchema, artworkV2Schema, dnaSchema } from '../schema/artwork';
import type {
  Dna,
  EvolutionArtwork,
  InheritanceDecision,
  Recipe,
} from '../schema/artwork';
import { configSchema, workDateSchema, instantSchema } from '../schema/config';
import { studyFamilySchema } from '../schema/preview';
import { generateStudy, contrast } from './study';
import { createRandom, hashSeed } from './random';
import type { Random } from './random';
import {
  isExposed,
  readRecipeValue,
  applyRecipeValue,
  validateEvolution,
} from './provenance';
import { generateTitle } from '../titles/generate';

export const EVOLUTION_VERSION = '0.2.0';
export const generationInputSchema = z.strictObject({
  generation: z.number().int().positive(),
  workDate: workDateSchema,
  seed: z.string().min(1).max(160),
  settings: configSchema,
  parents: z.array(artworkSchema).max(2),
  scheduledFor: instantSchema,
  runStartedAt: instantSchema,
  usedTitles: z.array(z.string().max(160)).max(10000).default([]),
});
export type GenerationInput = z.input<typeof generationInputSchema>;
type Element = Dna['elements'][number];
const round = (value: number) => Math.round(value * 1e6) / 1e6;
const staticMotion: Element['motion'] = {
  kind: 'static',
  durationSeconds: 24,
  amplitude: 0,
};
function solid(
  color: string,
  x: number,
  y: number,
  width: number,
  height: number,
  kind: Element['kind'] = 'rectangle',
): Element {
  return {
    kind,
    color,
    x,
    y,
    width,
    height,
    opacity: 1,
    rotation: 0,
    motion: { ...staticMotion },
  };
}
function readable(background: string, colors: string[]) {
  return (
    colors.find((color) => contrast(background, color) >= 2) ??
    (contrast(background, '#181919') >= contrast(background, '#f6f2e9')
      ? '#181919'
      : '#f6f2e9')
  );
}
function expose(background: string, element: Element): Element[] {
  return [
    solid(
      background,
      round(element.x - 0.01),
      round(element.y - 0.01),
      round(element.width + 0.02),
      round(element.height + 0.02),
    ),
    element,
  ];
}
function mutation(
  recipe: Recipe,
  dna: Dna,
  path: string,
  after: string | number,
) {
  const before = readRecipeValue(dna, path);
  if (before === after) return;
  recipe.mutations.push({ path, before, after, operator: 'replace' });
  applyRecipeValue(dna, path, after);
}
function permute(random: Random) {
  const slots = [0, 1, 2, 3, 4, 5];
  for (let index = slots.length - 1; index > 0; index--) {
    const swap = random.integer(0, index);
    [slots[index], slots[swap]] = [slots[swap]!, slots[index]!];
  }
  return slots;
}

/** Pure core; clock is injected and affects metadata only. No official run or writes. */
export function generateArtwork(
  input: unknown,
  clock: () => string,
): EvolutionArtwork {
  const request = generationInputSchema.parse(input);
  const generatedAt = instantSchema.parse(clock());
  const origin = request.generation <= 2;
  if (request.parents.length !== (origin ? 0 : 2))
    throw new Error('Ursprünge haben keine Eltern, Evolution hat genau zwei.');
  request.parents.forEach((parent, index) => {
    if (
      parent.generation !== request.generation - 2 + index ||
      parent.id >= request.workDate ||
      (index === 1 && request.parents[0]!.id >= parent.id)
    ) {
      throw new Error(
        'Nicht die beiden unmittelbar vorherigen Eltern in korrekter Reihenfolge.',
      );
    }
  });
  // Both inputs are validated and evaluated even on a complete-free branch.
  const parentFingerprint = hashSeed(
    JSON.stringify(
      request.parents.map((parent) => ({
        dna: parent.dna,
        title: parent.title,
      })),
    ),
  );
  for (let retry = 0; retry < 4; retry++) {
    const random = createRandom(
      `${EVOLUTION_VERSION}:${request.seed}:${request.settings.inheritanceMode}:${request.settings.revision}:${request.generation}:${parentFingerprint}:${retry}`,
    );
    const fullyNew =
      origin ||
      (request.settings.inheritanceMode === 'free' && random.next() < 0.35);
    const source =
      fullyNew || random.next() < 0.4
        ? 'new'
        : random.pick(['parentA', 'parentB'] as const);
    const freshSeed = `evolution:${hashSeed(`${request.seed}:${parentFingerprint}:${retry}`)}:${request.generation}`;
    const family = random.pick(studyFamilySchema.options);
    const fresh = generateStudy({ seed: freshSeed, family }).dna;
    const dna =
      source === 'new'
        ? structuredClone(fresh)
        : structuredClone(request.parents[source === 'parentA' ? 0 : 1]!.dna);
    dna.elements = dna.elements.slice(0, 50);
    const recipe: Recipe = {
      base: { source, seed: freshSeed },
      mutations: [],
      additions: [],
    };
    if (source === 'new') {
      // Seeded RGB channel shifts open the palette beyond the frozen Phase-1 examples.
      const shifts = [
        random.integer(-96, 96),
        random.integer(-96, 96),
        random.integer(-96, 96),
      ];
      const transformColor = (color: string) =>
        '#' +
        [1, 3, 5]
          .map((start, channel) =>
            (
              (parseInt(color.slice(start, start + 2), 16) +
                shifts[channel]! +
                256) %
              256
            )
              .toString(16)
              .padStart(2, '0'),
          )
          .join('');
      mutation(recipe, dna, 'background', transformColor(dna.background));
      dna.elements.forEach((element, index) =>
        mutation(
          recipe,
          dna,
          `elements.${index}.color`,
          transformColor(element.color),
        ),
      );
    }
    if (!fullyNew) {
      const strength = random.next() ** 2;
      if (random.next() < strength)
        mutation(recipe, dna, 'background', fresh.background);
      dna.elements.forEach((element, index) => {
        const freshElement = fresh.elements[index % fresh.elements.length]!;
        for (const field of [
          'color',
          'x',
          'y',
          'width',
          'height',
          'rotation',
          'opacity',
        ] as const) {
          if (random.next() < strength)
            mutation(
              recipe,
              dna,
              `elements.${index}.${field}`,
              freshElement[field],
            );
        }
        for (const field of ['kind', 'durationSeconds', 'amplitude'] as const) {
          if (random.next() < strength)
            mutation(
              recipe,
              dna,
              `elements.${index}.motion.${field}`,
              freshElement.motion[field],
            );
        }
        mutation(
          recipe,
          dna,
          `elements.${index}.width`,
          round(Math.min(element.width, 1 - element.x)),
        );
        mutation(
          recipe,
          dna,
          `elements.${index}.height`,
          round(Math.min(element.height, 1 - element.y)),
        );
      });
    }
    const decisions: InheritanceDecision[] = [];
    const slots = permute(random);
    const count =
      origin || fullyNew
        ? 1
        : request.settings.inheritanceMode === 'traceable'
          ? random.integer(2, 6)
          : random.integer(0, 6);
    for (let index = 0; index < count; index++) {
      const parentIndex =
        origin || fullyNew
          ? null
          : request.settings.inheritanceMode === 'traceable' && index < 2
            ? index
            : random.integer(0, 1);
      const parent =
        parentIndex === null ? undefined : request.parents[parentIndex];
      const candidates =
        parent?.dna.elements
          .map((_, candidate) => candidate)
          .filter((candidate) => isExposed(parent.dna, candidate)) ?? [];
      if (parent && candidates.length === 0)
        throw new Error(
          'Eltern-DNA enthält kein belegbar sichtbares Quellmerkmal.',
        );
      const sourceIndex = parent ? random.pick(candidates) : -1;
      const sourceElement = parent?.dna.elements[sourceIndex];
      const inheritColor =
        !!sourceElement &&
        contrast(dna.background, sourceElement.color) >= 2 &&
        random.next() < 0.6;
      const width =
        sourceElement && !inheritColor
          ? round(
              Math.max(
                0.12,
                Math.min(
                  0.25,
                  sourceElement.width *
                    (random.next() < 0.5 ? 1 : random.between(0.8, 1.2)),
                ),
              ),
            )
          : round(random.between(0.13, 0.25));
      const height = round(random.between(0.13, 0.25));
      const slot = slots[index]!;
      const element = solid(
        inheritColor
          ? sourceElement!.color
          : readable(dna.background, [random.pick(fresh.elements).color]),
        round(0.08 + (slot % 3) * 0.3 + random.between(-0.005, 0.005)),
        round(
          0.15 + Math.floor(slot / 3) * 0.4 + random.between(-0.005, 0.005),
        ),
        width,
        height,
        dna.family === 'color-field'
          ? 'rectangle'
          : random.pick(['rectangle', 'circle'] as const),
      );
      const addition = expose(dna.background, element);
      const targetIndex = dna.elements.length + 1;
      recipe.additions.push(...addition);
      dna.elements.push(...addition);
      if (parent && sourceElement) {
        const trait = inheritColor ? 'color' : 'width';
        const before = sourceElement[trait],
          after = element[trait];
        decisions.push({
          parentId: parent.id,
          source: { path: `elements.${sourceIndex}.${trait}`, value: before },
          target: { path: `elements.${targetIndex}.${trait}`, value: after },
          operation:
            before === after
              ? { kind: 'copy' }
              : {
                  kind: 'offset',
                  amount: round(Number(after) - Number(before)),
                },
        });
      }
    }
    // Free-with-no-copy still needs an exposed source for possible later traceable children.
    if (count === 0) {
      const element = solid(
        readable(
          dna.background,
          fresh.elements.map((item) => item.color),
        ),
        0.72,
        0.68,
        0.16,
        0.16,
        'circle',
      );
      const addition = expose(dna.background, element);
      recipe.additions.push(...addition);
      dna.elements.push(...addition);
    }
    const parsedDna = dnaSchema.parse(dna);
    if (
      request.parents.at(-1) &&
      JSON.stringify(parsedDna) === JSON.stringify(request.parents.at(-1)!.dna)
    )
      continue;
    const title = generateTitle({
      seed: `${request.seed}:${request.generation}`,
      lexiconVersion: '0.1.0',
      parents: request.parents.map(({ id, title }) => ({ id, title })),
      usedTitles: request.usedTitles,
    });
    const work = artworkV2Schema.parse({
      schemaVersion: 2,
      generatorVersion: EVOLUTION_VERSION,
      rendererVersion: '1',
      lexiconVersion: '0.1.0',
      id: request.workDate,
      generation: request.generation,
      title: title.title,
      description: `${title.title}; Familie ${parsedDna.family}, Hintergrund ${parsedDna.background}, ${parsedDna.elements.length} Formen. ${parsedDna.elements.some((element) => element.motion.kind !== 'static') ? 'Mit CSS-Bewegung.' : 'Statisch.'}`,
      timezone: 'Europe/Berlin',
      scheduledFor: request.scheduledFor,
      generatedAt,
      runStartedAt: request.runStartedAt,
      isCatchUp: isCatchUp(request.workDate, request.runStartedAt),
      seed: request.seed,
      inheritanceMode: request.settings.inheritanceMode,
      settingsRevision: request.settings.revision,
      parentIds: request.parents.map((parent) => parent.id),
      dna: parsedDna,
      titleDna: {
        tokens: title.tokens,
        pattern: title.pattern,
        parentFragments: title.parentFragments,
      },
      evolution: {
        type: origin ? 'origin' : 'hybrid',
        evaluatedParentIds: request.parents.map((parent) => parent.id),
        decisions,
        recipe,
      },
    });
    return validateEvolution(work, request.parents);
  }
  throw new Error(
    'Kein erkennbar verändertes Werk nach deterministischen Retries.',
  );
}
