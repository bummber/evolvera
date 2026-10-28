import { z } from 'zod';
import { dnaSchema } from './artwork';

export const studyFamilySchema = z.enum(['geometric', 'color-field', 'mosaic']);
export const studyRequestSchema = z.strictObject({
  seed: z.string().trim().min(1).max(160),
  family: studyFamilySchema,
});
export const previewSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    kind: z.literal('preview'),
    id: z
      .string()
      .regex(/^preview-(geometric|color-field|mosaic)-[a-f0-9]{8}$/),
    seed: z.string().trim().min(1).max(160),
    generatorVersion: z.literal('0.1.0'),
    rendererVersion: z.literal('1'),
    retry: z.number().int().min(0).max(3),
    description: z.string().min(1).max(800),
    dna: dnaSchema,
  })
  .refine((value) => studyFamilySchema.safeParse(value.dna.family).success, {
    message: 'Die Vorschau unterstützt nur die Phase-1-Familien.',
  });
export const previewCollectionSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    purpose: z.literal('phase-1-preview-only'),
    studies: z.array(previewSchema).min(3).max(24),
  })
  .refine(
    (value) =>
      new Set(value.studies.map((study) => study.id)).size ===
      value.studies.length,
    {
      message: 'Doppelte Vorschau-IDs.',
    },
  );
export type StudyFamily = z.infer<typeof studyFamilySchema>;
export type PreviewStudy = z.infer<typeof previewSchema>;
export const familyLabels: Record<StudyFamily, string> = {
  geometric: 'Geometrische Konstellation',
  'color-field': 'Farbfeld / Minimalismus',
  mosaic: 'Mosaik / Raster',
};
