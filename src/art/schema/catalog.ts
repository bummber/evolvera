import { z } from 'zod';
import { dnaV3Schema } from './artwork-v3';

// Hand-written sample sheets for renderer 2 (EP-01, P2). Preview only: no
// generator output, no artwork IDs, never part of the official archive.
export const catalogSheetSchema = z.strictObject({
  id: z.string().regex(/^ep01-[a-z-]{3,40}$/),
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(800),
  rendererVersion: z.literal('2'),
  dna: dnaV3Schema,
});
export const catalogSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    purpose: z.literal('ep01-catalog-preview-only'),
    sheets: z.array(catalogSheetSchema).min(1).max(12),
  })
  .refine(
    (value) =>
      new Set(value.sheets.map((sheet) => sheet.id)).size ===
      value.sheets.length,
    { message: 'Doppelte Musterbogen-IDs.' },
  );
export type CatalogSheet = z.infer<typeof catalogSheetSchema>;
