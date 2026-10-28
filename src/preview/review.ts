import { z } from 'zod';
import original from '../../fixtures/preview/phase-2.json';
import extension from '../../fixtures/preview/phase-3.json';
import { artworkV2Schema } from '../art/schema/artwork';
import { modeSchema } from '../art/schema/config';
import {
  previewChainSchema,
  validatePreviewChain,
} from '../art/generator/preview-chain';
import { createReader } from '../archive/reader';

export const reviewExtensionSchema = z.strictObject({
  purpose: z.literal('phase-3-review-extension-only'),
  chains: z
    .array(
      z.strictObject({
        inheritanceMode: modeSchema,
        works: z.array(artworkV2Schema).length(10),
      }),
    )
    .length(2),
});
const originals = z
  .strictObject({
    purpose: z.literal('phase-2-preview-only'),
    chains: z.array(previewChainSchema).length(2),
  })
  .parse(original);
const extra = reviewExtensionSchema.parse(extension);
export const reviewChains = modeSchema.options.map((mode) => {
  const bases = originals.chains.filter(
    (chain) => chain.inheritanceMode === mode,
  );
  const additions = extra.chains.filter(
    (chain) => chain.inheritanceMode === mode,
  );
  if (bases.length !== 1 || additions.length !== 1)
    throw new Error('Testsammlung benötigt genau eine Kette je Modus.');
  return validatePreviewChain({
    ...bases[0]!,
    works: [...bases[0]!.works, ...additions[0]!.works],
  });
});
export function previewReader(mode: 'traceable' | 'free') {
  const chain = reviewChains.find(
    (candidate) => candidate.inheritanceMode === mode,
  )!;
  const byId = new Map(chain.works.map((work) => [work.id, work]));
  return createReader(
    mode,
    {
      schemaVersion: 1,
      works: chain.works
        .toReversed()
        .map(({ id, generation, title }) => ({ id, generation, title })),
    },
    async (id) => byId.get(id),
  );
}
