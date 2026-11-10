import { z } from 'zod';
import {
  berlinDateTime,
  isCatchUp,
  scheduledTime,
} from '../../series/calendar';
import { artworkSchema, readTrait, type Artwork } from './artwork';
import { instantSchema, modeSchema, workDateSchema } from './config';
import { addProfileIssues, familySchema, profileSchema } from './profile';

// EP-01 artwork schema 3 for renderer 2 and generator 0.3.0. Additive: the
// contracts of schema 1 and 2 in artwork.ts stay untouched. Nothing is
// archived with this schema before the art review of EP-01 (P7); until then
// it may still be refined together with renderer 2 (P2).

const version = z.string().regex(/^\d+\.\d+\.\d+$/);
const color = z.string().regex(/^#[\da-fA-F]{6}$/);
const unit = z.number().min(0).max(1);
const positiveUnit = z.number().positive().max(1);
const angle = z.number().min(0).max(360);
// Stroke widths are fractions of the 1000 × 1000 art plane, like all lengths.
const strokeWidth = z.number().min(0.002).max(0.5);

export const layerNames = ['background', 'structure', 'accent'] as const;
const layerName = z.enum(layerNames);
const layer = z.strictObject({ family: familySchema });

const stops = z
  .array(z.strictObject({ color, offset: unit }))
  .min(2)
  .max(4)
  .refine(
    (list) =>
      list.every((stop, i) => i === 0 || stop.offset >= list[i - 1]!.offset),
    { message: 'Farbstopps müssen aufsteigend geordnet sein.' },
  );

// Closed vocabulary: only numbers, hex colours and enumerations. CSS and path
// strings are assembled by the renderer alone.
export const fillSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('solid'), color }),
  z.strictObject({ kind: z.literal('linear'), angle, stops }),
  z.strictObject({
    kind: z.literal('radial'),
    centerX: unit,
    centerY: unit,
    stops,
  }),
  z.strictObject({
    kind: z.literal('conic'),
    angle,
    centerX: unit,
    centerY: unit,
    stops,
  }),
  z.strictObject({
    kind: z.literal('pattern'),
    pattern: z.enum(['stripes', 'grid', 'dots', 'rings', 'checker', 'truchet']),
    angle,
    period: z.number().min(0.01).max(0.5),
    foreground: color,
    background: color,
  }),
]);

export const effectsSchema = z.strictObject({
  blend: z
    .enum(['multiply', 'screen', 'overlay', 'soft-light', 'difference'])
    .optional(),
  blur: z.number().positive().max(0.05).optional(),
  shadow: z
    .strictObject({
      offsetX: z.number().min(-0.1).max(0.1),
      offsetY: z.number().min(-0.1).max(0.1),
      blur: z.number().min(0).max(0.1),
      color,
      opacity: unit,
    })
    .optional(),
  mask: z
    .strictObject({
      kind: z.enum(['linear', 'radial']),
      angle,
      from: unit,
      to: unit,
    })
    .optional(),
});

const common = {
  layer: layerName,
  x: unit,
  y: unit,
  width: positiveUnit,
  height: positiveUnit,
  rotation: z.number().min(-360).max(360),
  opacity: z.number().min(0.05).max(1),
  fill: fillSchema,
  effects: effectsSchema.optional(),
  motion: z.strictObject({
    kind: z.enum(['static', 'rotate', 'pulse', 'float']),
    durationSeconds: z.number().min(4).max(240),
    amplitude: z.number().min(0).max(0.25),
  }),
};
// Shape coordinates are fractions of the element's own box.
const point = z.strictObject({ x: unit, y: unit });
const pathCommand = z.discriminatedUnion('op', [
  z.strictObject({ op: z.literal('M'), x: unit, y: unit }),
  z.strictObject({ op: z.literal('L'), x: unit, y: unit }),
  z.strictObject({ op: z.literal('Q'), cx: unit, cy: unit, x: unit, y: unit }),
  z.strictObject({
    op: z.literal('C'),
    c1x: unit,
    c1y: unit,
    c2x: unit,
    c2y: unit,
    x: unit,
    y: unit,
  }),
]);
const plain = <K extends string>(kind: K) =>
  z.strictObject({ kind: z.literal(kind), ...common });

export const elementV3Schema = z.discriminatedUnion('kind', [
  plain('rectangle'),
  plain('circle'),
  plain('ellipse'),
  plain('line'),
  z.strictObject({
    kind: z.literal('arc'),
    ...common,
    shape: z.strictObject({
      start: angle,
      sweep: z.number().min(5).max(360),
      strokeWidth,
    }),
  }),
  z.strictObject({
    kind: z.literal('ring'),
    ...common,
    shape: z.strictObject({ strokeWidth }),
  }),
  z.strictObject({
    kind: z.literal('polygon'),
    ...common,
    shape: z.strictObject({ points: z.array(point).min(3).max(24) }),
  }),
  z.strictObject({
    kind: z.literal('blob'),
    ...common,
    shape: z.strictObject({
      radii: z.array(z.number().min(0.05).max(1)).length(8),
    }),
  }),
  z.strictObject({
    kind: z.literal('path'),
    ...common,
    shape: z
      .strictObject({
        commands: z.array(pathCommand).min(2).max(24),
        closed: z.boolean(),
        strokeWidth: strokeWidth.optional(),
      })
      .superRefine((shape, ctx) => {
        if (shape.commands[0]?.op !== 'M')
          ctx.addIssue({
            code: 'custom',
            message: 'Ein Pfad beginnt mit einem Startpunkt (M).',
          });
        if (shape.commands.slice(1).some((command) => command.op === 'M'))
          ctx.addIssue({
            code: 'custom',
            message: 'Ein Pfad hat genau einen Startpunkt.',
          });
        if (!shape.closed && shape.strokeWidth === undefined)
          ctx.addIssue({
            code: 'custom',
            message: 'Ein offener Pfad braucht eine sichtbare Strichstärke.',
          });
      }),
  }),
]);

export const dnaV3Schema = z
  .strictObject({
    background: color,
    // Up to three layers in fixed order; each has exactly one family.
    layers: z.strictObject({
      background: layer.optional(),
      structure: layer.optional(),
      accent: layer.optional(),
    }),
    elements: z.array(elementV3Schema).min(1).max(120),
  })
  .superRefine((dna, ctx) => {
    if (!layerNames.some((name) => dna.layers[name]))
      ctx.addIssue({
        code: 'custom',
        message: 'Ein Werk braucht mindestens eine Ebene.',
        path: ['layers'],
      });
    let previous = 0;
    dna.elements.forEach((element, index) => {
      const order = layerNames.indexOf(element.layer);
      if (!dna.layers[element.layer])
        ctx.addIssue({
          code: 'custom',
          message: 'Element verweist auf eine nicht vorhandene Ebene.',
          path: ['elements', index, 'layer'],
        });
      if (order < previous)
        ctx.addIssue({
          code: 'custom',
          message:
            'Elemente folgen der festen Ebenenreihenfolge Hintergrund, Struktur, Akzent.',
          path: ['elements', index, 'layer'],
        });
      previous = Math.max(previous, order);
    });
  });
export type DnaV3 = z.infer<typeof dnaV3Schema>;

// Evidence paths name actual design traits of the DNA.
const index = String.raw`(0|[1-9]\d*)`;
const legacyPath = String.raw`background|elements\.${index}\.(color|x|y|width|height|rotation|opacity)`;
const fillPath = String.raw`fill\.(kind|color|angle|centerX|centerY|pattern|period|foreground|background|stops\.[0-3]\.(color|offset))`;
const shapePath = String.raw`shape\.(start|sweep|strokeWidth|points\.${index}\.(x|y)|radii\.[0-7]|commands\.${index}\.(x|y|cx|cy|c1x|c1y|c2x|c2y))`;
const v3Path = String.raw`background|layers\.(background|structure|accent)\.family|elements\.${index}\.(kind|layer|x|y|width|height|rotation|opacity|${fillPath}|${shapePath})`;
export const traitPathV3Schema = z.string().regex(new RegExp(`^(${v3Path})$`));
// The first new works have parents in schema 1/2, addressed by their old paths.
const sourcePathSchema = z
  .string()
  .regex(new RegExp(`^(${legacyPath}|${v3Path})$`));
const traitValue = z.union([
  color,
  z.number().finite(),
  z.string().regex(/^[a-z][a-z-]{0,23}$/),
]);
export const evidenceV3Schema = z.strictObject({
  parentId: workDateSchema,
  source: z.strictObject({ path: sourcePathSchema, value: traitValue }),
  target: z.strictObject({ path: traitPathV3Schema, value: traitValue }),
  operation: z.discriminatedUnion('kind', [
    z.strictObject({ kind: z.literal('copy') }),
    z.strictObject({ kind: z.literal('offset'), amount: z.number().finite() }),
    // A parent trait the frozen settings forbid, converted into an allowed one.
    // Source and target hold the values before and after; `rule` names the
    // setting that triggered it, e.g. "features.gradients=off".
    z.strictObject({
      kind: z.literal('constrained'),
      rule: z.string().regex(/^[a-z]+\.[A-Za-z-]+=[a-z0-9-]+$/),
    }),
  ]),
});

export function readTraitV3(
  dna: DnaV3,
  path: string,
): string | number | undefined {
  let node: unknown = dna;
  for (const key of path.split('.')) {
    if (Array.isArray(node))
      node = /^(0|[1-9]\d*)$/.test(key) ? node[Number(key)] : undefined;
    else if (
      typeof node === 'object' &&
      node !== null &&
      Object.hasOwn(node, key)
    )
      node = (node as Record<string, unknown>)[key];
    else return undefined;
  }
  return typeof node === 'string' || typeof node === 'number'
    ? node
    : undefined;
}

export const artworkV3Schema = z
  .strictObject({
    schemaVersion: z.literal(3),
    generatorVersion: z.literal('0.3.0'),
    rendererVersion: z.literal('2'),
    lexiconVersion: version,
    id: workDateSchema,
    generation: z.number().int().positive(),
    title: z.string().trim().min(1).max(160),
    description: z.string().trim().min(1).max(800),
    timezone: z.literal('Europe/Berlin'),
    scheduledFor: instantSchema,
    generatedAt: instantSchema,
    runStartedAt: instantSchema,
    isCatchUp: z.boolean(),
    seed: z.string().min(1).max(256),
    inheritanceMode: modeSchema,
    settingsRevision: z.number().int().positive(),
    // Complete effective settings of the run; never filled in from defaults.
    settings: z.strictObject({
      inheritanceMode: modeSchema,
      ...profileSchema.shape,
    }),
    // Similarity check (P5): distance measure version, digest of the ordered
    // history context and the result. A missed minimum is recorded, not hidden.
    novelty: z.strictObject({
      distanceVersion: z.literal(1),
      contextDigest: z.string().regex(/^[\da-f]{64}$/),
      distance: z.number().min(0).nullable(),
      minimumReached: z.boolean(),
    }),
    parentIds: z.array(workDateSchema).max(2),
    dna: dnaV3Schema,
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
      decisions: z.array(evidenceV3Schema).max(240),
    }),
  })
  .superRefine((work, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
    addProfileIssues(work.settings, ctx, ['settings']);
    if (work.settings.inheritanceMode !== work.inheritanceMode)
      fail('Einstellungssnapshot und Vererbungsmodus widersprechen sich.');
    const origin = work.generation <= 2;
    if (
      work.parentIds.length !== (origin ? 0 : 2) ||
      new Set(work.parentIds).size !== work.parentIds.length
    )
      fail(
        'Ursprungswerke haben keine Eltern, Folgewerke genau zwei unterschiedliche.',
      );
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
      if (readTraitV3(work.dna, decision.target.path) !== decision.target.value)
        fail('Zielbeleg stimmt nicht mit der DNA überein.');
      const { operation, source, target } = decision;
      if (operation.kind === 'copy' && source.value !== target.value)
        fail('Kopierte Werte müssen gleich sein.');
      if (
        operation.kind === 'offset' &&
        (typeof source.value !== 'number' ||
          typeof target.value !== 'number' ||
          Math.abs(source.value + operation.amount - target.value) > 1e-9)
      )
        fail('Numerischer Mutationsoperator belegt den Zielwert nicht.');
      if (operation.kind === 'constrained' && source.value === target.value)
        fail('Eine Umwandlung muss den Wert tatsächlich ändern.');
    }
    if (
      !origin &&
      work.inheritanceMode === 'traceable' &&
      work.parentIds.some(
        (id) => !work.evolution.decisions.some((d) => d.parentId === id),
      )
    )
      fail(
        'Nachvollziehbare Vererbung benötigt gestalterische Belege beider Eltern.',
      );
    if (
      Date.parse(work.generatedAt) < Date.parse(work.runStartedAt) ||
      Date.parse(work.runStartedAt) < Date.parse(work.scheduledFor)
    )
      fail('Zeitpunkte liegen nicht in erlaubter Reihenfolge.');
    if (
      ![work.scheduledFor, work.runStartedAt, work.generatedAt].every((value) =>
        Number.isFinite(Date.parse(value)),
      ) ||
      !workDateSchema.safeParse(work.id).success
    )
      return;
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
  });
export type ArtworkV3 = z.infer<typeof artworkV3Schema>;
export type InheritanceDecisionV3 = z.infer<typeof evidenceV3Schema>;

/** All artwork contracts. `artworkSchema` (1 and 2) stays the archive contract
 * until gallery and readers support schema 3 (P6). */
export const anyArtworkSchema = z.union([artworkSchema, artworkV3Schema]);
export type AnyArtwork = Artwork | ArtworkV3;

/** Structural and evidence validation of a schema 3 work against its parents. */
export function validateArtworkV3(
  input: unknown,
  parents: readonly AnyArtwork[],
): ArtworkV3 {
  const work = artworkV3Schema.parse(input);
  if (parents.length !== work.parentIds.length)
    throw new Error('Elternwerke fehlen oder sind unerwartet.');
  work.parentIds.forEach((id, position) => {
    const parent = parents[position];
    if (
      !parent ||
      parent.id !== id ||
      parent.generation !== work.generation - 2 + position
    )
      throw new Error(
        'Eltern müssen die beiden unmittelbaren Vorgängergenerationen sein.',
      );
  });
  for (const decision of work.evolution.decisions) {
    const parent = parents.find((p) => p.id === decision.parentId);
    const value = !parent
      ? undefined
      : parent.schemaVersion === 3
        ? readTraitV3(parent.dna, decision.source.path)
        : readTrait(parent.dna, decision.source.path);
    if (value === undefined || value !== decision.source.value)
      throw new Error(
        'Ausgangsbeleg stimmt nicht mit gespeicherter Eltern-DNA überein.',
      );
  }
  return work;
}
