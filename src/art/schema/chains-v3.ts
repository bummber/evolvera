import { z } from 'zod';
import { artworkSchema } from './artwork';
import { artworkV3Schema } from './artwork-v3';
import { modeSchema, workDateSchema } from './config';

// Stored preview chains of generator 0.3.0 (EP-01, P4). Preview only: no
// series start and never part of the official archive.

export const previewChainV3Schema = z.strictObject({
  schemaVersion: z.literal(1),
  kind: z.literal('evolution-preview-v3'),
  key: z.string().regex(/^[a-z][a-z-]{0,23}$/),
  inheritanceMode: modeSchema,
  simulationStart: workDateSchema,
  /** Two stored works of schema 1 or 2 that the first new works descend
   * from (transition), or none for a chain that starts with two origins. */
  legacyParents: z.array(artworkSchema).max(2),
  works: z.array(artworkV3Schema).min(2).max(400),
});
export type PreviewChainV3 = z.infer<typeof previewChainV3Schema>;

export const chainCollectionV3Schema = z.strictObject({
  schemaVersion: z.literal(1),
  purpose: z.literal('ep01-chains-preview-only'),
  chains: z.array(previewChainV3Schema).min(1).max(8),
});
