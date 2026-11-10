import { z } from 'zod';
import { dnaV3Schema } from './artwork-v3';
import { modeSchema } from './config';
import {
  addProfileIssues,
  paletteStrategySchema,
  profileSchema,
} from './profile';

// Independent origin studies of generator 0.3.0 (EP-01, P3). Preview only:
// no dates, titles, parents or artwork IDs, never part of the official
// archive. The complete artwork of schema 3 follows with evolution (P4).

/** Complete effective settings of a run, as stored in a schema 3 artwork. */
export const settingsSnapshotSchema = z
  .strictObject({ inheritanceMode: modeSchema, ...profileSchema.shape })
  .superRefine((settings, ctx) => addProfileIssues(settings, ctx));
export type SettingsSnapshot = z.infer<typeof settingsSnapshotSchema>;

export const originRequestSchema = z.strictObject({
  seed: z.string().trim().min(1).max(160),
  settings: settingsSnapshotSchema,
});

const flag = z.boolean();
export const originStudySchema = z.strictObject({
  schemaVersion: z.literal(1),
  kind: z.literal('origin-preview'),
  id: z.string().regex(/^ep01-origin-[a-f0-9]{8}$/),
  seed: z.string().trim().min(1).max(160),
  generatorVersion: z.literal('0.3.0'),
  rendererVersion: z.literal('2'),
  retry: z.number().int().min(0).max(15),
  settings: settingsSnapshotSchema,
  // Decisions of the generator that the DNA alone does not name.
  recipe: z.strictObject({
    paletteStrategy: paletteStrategySchema,
    features: z.strictObject({
      gradients: flag,
      patterns: flag,
      masks: flag,
      blendModes: flag,
      blurShadow: flag,
      lines: flag,
      curves: flag,
      generativeShapes: flag,
      animation: flag,
      symmetry: flag,
    }),
    anchor: z.enum(['natural', 'promoted', 'moved', 'added']),
  }),
  description: z.string().trim().min(1).max(800),
  dna: dnaV3Schema,
});
export type OriginStudy = z.infer<typeof originStudySchema>;

export const originCollectionSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    purpose: z.literal('ep01-origins-preview-only'),
    studies: z.array(originStudySchema).min(1).max(60),
  })
  .refine(
    (value) =>
      new Set(value.studies.map((study) => study.id)).size ===
      value.studies.length,
    { message: 'Doppelte Vorschau-IDs.' },
  );
