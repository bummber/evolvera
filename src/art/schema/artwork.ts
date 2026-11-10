import {
  berlinDateTime,
  scheduledTime,
  isCatchUp,
} from '../../series/calendar';
import { z } from 'zod';
import { instantSchema, modeSchema, workDateSchema } from './config';

const version = z.string().regex(/^\d+\.\d+\.\d+$/);
const color = z.string().regex(/^#[\da-fA-F]{6}$/);
const unit = z.number().min(0).max(1);
const positiveUnit = z.number().positive().max(1);

// Closed vocabulary: no arbitrary CSS, markup, URLs or executable renderer input.
export const dnaSchema = z.strictObject({
  family: z.enum([
    'geometric',
    'color-field',
    'mosaic',
    'organic',
    'kinetic',
    'chaotic',
  ]),
  background: color,
  elements: z
    .array(
      z.strictObject({
        kind: z.enum(['circle', 'rectangle', 'ellipse', 'line']),
        x: unit,
        y: unit,
        width: positiveUnit,
        height: positiveUnit,
        rotation: z.number().min(-360).max(360),
        color,
        opacity: z.number().min(0.05).max(1),
        motion: z.strictObject({
          kind: z.enum(['static', 'rotate', 'pulse', 'float']),
          durationSeconds: z.number().min(4).max(240),
          amplitude: z.number().min(0).max(0.25),
        }),
      }),
    )
    .min(1)
    .max(120),
});

// Paths name actual visible DNA fields, never title words or parent IDs alone.
const traitPath = z
  .string()
  .regex(
    /^(background|elements\.(0|[1-9]\d*)\.(color|x|y|width|height|rotation|opacity))$/,
  );
const traitValue = z.union([color, z.number().finite()]);
const evidenceSchema = z.strictObject({
  parentId: workDateSchema,
  source: z.strictObject({ path: traitPath, value: traitValue }),
  target: z.strictObject({ path: traitPath, value: traitValue }),
  operation: z.discriminatedUnion('kind', [
    z.strictObject({ kind: z.literal('copy') }),
    z.strictObject({ kind: z.literal('offset'), amount: z.number().finite() }),
  ]),
});

const artworkCore = z.strictObject({
  schemaVersion: z.literal(1),
  generatorVersion: version,
  rendererVersion: z.literal('1'),
  lexiconVersion: version,
  id: workDateSchema,
  generation: z.number().int().positive(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(800),
  timezone: z.literal('Europe/Berlin'),
  scheduledFor: instantSchema,
  generatedAt: instantSchema,
  // Run start is separate: catch-up depends on when the run started, not finished.
  runStartedAt: instantSchema,
  isCatchUp: z.boolean(),
  seed: z.string().min(1).max(256),
  inheritanceMode: modeSchema,
  settingsRevision: z.number().int().positive(),
  parentIds: z.array(workDateSchema).max(2),
  dna: dnaSchema,
  titleDna: z.strictObject({
    tokens: z.array(z.string().min(1).max(80)).min(1).max(20),
  }),
  evolution: z.strictObject({
    type: z.enum(['origin', 'hybrid']),
    evaluatedParentIds: z.array(workDateSchema).max(2),
    decisions: z.array(evidenceSchema).max(240),
  }),
});
function refineArtwork(
  work: Omit<z.infer<typeof artworkCore>, 'schemaVersion'>,
  ctx: z.RefinementCtx,
) {
  const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
  const origin = work.generation <= 2;
  if (
    work.parentIds.length !== (origin ? 0 : 2) ||
    new Set(work.parentIds).size !== work.parentIds.length
  ) {
    fail(
      'Ursprungswerke haben keine Eltern, Folgewerke genau zwei unterschiedliche.',
    );
  }
  if (work.parentIds.some((id) => id >= work.id))
    fail('Eltern müssen vor dem Werkdatum liegen.');
  if (work.evolution.type !== (origin ? 'origin' : 'hybrid'))
    fail('Evolutionstyp passt nicht zur Generation.');
  if (
    JSON.stringify(work.parentIds) !==
    JSON.stringify(work.evolution.evaluatedParentIds)
  )
    fail('Beide Eltern müssen als ausgewertete Quellen protokolliert sein.');
  if (origin && work.evolution.decisions.length > 0)
    fail('Ursprungswerke haben keine Vererbungsbelege.');
  for (const decision of work.evolution.decisions) {
    if (!work.parentIds.includes(decision.parentId))
      fail('Beleg verweist auf ein fremdes Elternwerk.');
    if (readTrait(work.dna, decision.target.path) !== decision.target.value)
      fail('Zielbeleg stimmt nicht mit der DNA überein.');
    const { kind } = decision.operation;
    if (kind === 'copy' && decision.source.value !== decision.target.value)
      fail('Kopierte Werte müssen gleich sein.');
    if (decision.operation.kind === 'offset') {
      if (
        typeof decision.source.value !== 'number' ||
        typeof decision.target.value !== 'number' ||
        Math.abs(
          decision.source.value +
            decision.operation.amount -
            decision.target.value,
        ) > 1e-9
      ) {
        fail('Numerischer Mutationsoperator belegt den Zielwert nicht.');
      }
    }
  }
  if (
    !origin &&
    work.inheritanceMode === 'traceable' &&
    work.parentIds.some(
      (id) => !work.evolution.decisions.some((d) => d.parentId === id),
    )
  ) {
    fail(
      'Nachvollziehbare Vererbung benötigt gestalterische Belege beider Eltern.',
    );
  }
  // The dated schedule policy preserves historical timestamps and rejects early starts.
  if (
    Date.parse(work.generatedAt) < Date.parse(work.runStartedAt) ||
    Date.parse(work.runStartedAt) < Date.parse(work.scheduledFor)
  )
    fail('Zeitpunkte liegen nicht in erlaubter Reihenfolge.');
  if (
    ![work.scheduledFor, work.runStartedAt, work.generatedAt].every((value) =>
      Number.isFinite(Date.parse(value)),
    )
  )
    return;
  if (workDateSchema.safeParse(work.id).success) {
    if (
      berlinDateTime(work.scheduledFor) !==
      `${work.id} ${scheduledTime(work.id)}:00`
    )
      fail(
        'Geplanter Termin passt nicht zur Zeitregel des Werkdatums in Europe/Berlin.',
      );
    if (work.isCatchUp !== isCatchUp(work.id, work.runStartedAt))
      fail(
        'Nachholkennzeichnung entspricht nicht dem Laufstart im Berliner Tageszyklus.',
      );
  }
}
export const artworkV1Schema = artworkCore.superRefine(refineArtwork);

// Additive dispatch: existing V1 files retain their original contract.
export const recipePathSchema = z
  .string()
  .regex(
    /^(background|elements\.(0|[1-9]\d*)\.(kind|color|x|y|width|height|rotation|opacity|motion\.(kind|durationSeconds|amplitude)))$/,
  );
export const recipeSchema = z.strictObject({
  base: z.strictObject({
    source: z.enum(['new', 'parentA', 'parentB']),
    seed: z.string().min(1).max(500),
  }),
  mutations: z
    .array(
      z.strictObject({
        path: recipePathSchema,
        before: z.union([z.string().max(80), z.number().finite()]),
        after: z.union([z.string().max(80), z.number().finite()]),
        operator: z.literal('replace'),
      }),
    )
    .max(600),
  additions: z.array(dnaSchema.shape.elements.element).max(12),
});
export const artworkV2Schema = z
  .strictObject({
    ...artworkCore.shape,
    schemaVersion: z.literal(2),
    generatorVersion: z.literal('0.2.0'),
    lexiconVersion: z.enum(['0.1.0', '0.2.0']),
    titleDna: z.strictObject({
      tokens: z.array(z.string().min(1).max(80)).min(1).max(20),
      pattern: z.enum(['compound', 'pair', 'phrase']),
      parentFragments: z
        .array(
          z.strictObject({
            parentId: workDateSchema,
            fragment: z.string().min(2).max(12),
          }),
        )
        .max(2),
    }),
    evolution: z.strictObject({
      type: z.enum(['origin', 'hybrid']),
      evaluatedParentIds: z.array(workDateSchema).max(2),
      decisions: z.array(evidenceSchema).max(240),
      recipe: recipeSchema,
    }),
  })
  .superRefine(refineArtwork);
export const artworkSchema = z.union([artworkV1Schema, artworkV2Schema]);
export type EvolutionArtwork = z.infer<typeof artworkV2Schema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type InheritanceDecision = z.infer<typeof evidenceSchema>;
export type Artwork = z.infer<typeof artworkSchema>;
export type Dna = z.infer<typeof dnaSchema>;

export function readTrait(dna: Dna, path: string): string | number | undefined {
  if (path === 'background') return dna.background;
  const [, index, field] = path.split('.');
  const element = dna.elements[Number(index)];
  if (!element || !field) return undefined;
  const value = element[field as keyof typeof element];
  return typeof value === 'string' || typeof value === 'number'
    ? value
    : undefined;
}

/** Structural/evidence validation, not a substitute for Phase 1 visual checks. */
export function validateArtwork(
  input: unknown,
  parents: readonly Artwork[],
): Artwork {
  const work = artworkSchema.parse(input);
  if (parents.length !== work.parentIds.length)
    throw new Error('Elternwerke fehlen oder sind unerwartet.');
  work.parentIds.forEach((id, index) => {
    const parent = parents[index];
    if (
      !parent ||
      parent.id !== id ||
      parent.generation !== work.generation - 2 + index
    ) {
      throw new Error(
        'Eltern müssen die beiden unmittelbaren Vorgängergenerationen sein.',
      );
    }
  });
  for (const decision of work.evolution.decisions) {
    const parent = parents.find((p) => p.id === decision.parentId);
    if (
      !parent ||
      readTrait(parent.dna, decision.source.path) !== decision.source.value
    ) {
      throw new Error(
        'Ausgangsbeleg stimmt nicht mit gespeicherter Eltern-DNA überein.',
      );
    }
  }
  return work;
}
