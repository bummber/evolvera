import { z } from 'zod';
import type { GenerationConfig } from '../art/schema/config';
const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const releaseSchema = z.strictObject({
  schemaVersion: z.literal(1),
  seriesAuthorized: z.boolean(),
  artReview: z.strictObject({
    status: z.enum(['pending', 'approved']),
    approvedOn: z.iso.date().nullable(),
    workCount: z.number().int().min(0).max(50),
    generatorVersion: z.literal('0.2.0'),
    rendererVersion: z.literal('1'),
    lexiconVersion: z.literal('0.1.0'),
    statement: z.string().max(1000),
    fixtureSha256: z.strictObject({ phase2: digest, phase3: digest }),
  }),
  // Separate from the art review: operator approval of a later title lexicon.
  titleReview: z
    .strictObject({
      lexiconVersion: z.literal('0.2.0'),
      approvedOn: z.iso.date(),
      statement: z.string().min(1).max(1000),
    })
    .optional(),
  // EP-01 P7: separate art review of generator 0.3.0 with renderer 2. The
  // review of the 40 older test works does not cover it.
  artReviewV3: z
    .strictObject({
      generatorVersion: z.literal('0.3.0'),
      rendererVersion: z.literal('2'),
      approvedOn: z.iso.date(),
      /** Reviewed works of the standard profile (EP-01: 30 to 50). */
      workCount: z.number().int().min(30).max(50),
      statement: z.string().min(1).max(1000),
      fixtureSha256: z.strictObject({ standard: digest, profiles: digest }),
    })
    .optional(),
});
export type Release = z.infer<typeof releaseSchema>;
export function assertSeriesGate(config: GenerationConfig, input: unknown) {
  const release = releaseSchema.parse(input);
  const approved =
    release.artReview.status === 'approved' &&
    release.artReview.approvedOn !== null &&
    release.artReview.workCount >= 30;
  if (
    (config.generationEnabled || config.seriesStartDate !== null) &&
    (!release.seriesAuthorized || !approved)
  )
    throw new Error('Serienfreigabe und dokumentierte Kunstabnahme fehlen.');
  return release;
}
/** Lexicon 0.1.0 is covered by the art review; later versions need their own approval. */
export function assertTitleGate(release: Release, lexiconVersion: string) {
  if (
    lexiconVersion !== release.artReview.lexiconVersion &&
    release.titleReview?.lexiconVersion !== lexiconVersion
  )
    throw new Error(
      `Dokumentierte Titelabnahme für Lexikon ${lexiconVersion} fehlt.`,
    );
}
/** Generator 0.2.0 is covered by the art review; 0.3.0 needs its own. */
export function assertGeneratorGate(
  release: Release,
  generatorVersion: string,
) {
  if (
    generatorVersion !== release.artReview.generatorVersion &&
    release.artReviewV3?.generatorVersion !== generatorVersion
  )
    throw new Error(
      `Dokumentierte Kunstabnahme für Generator ${generatorVersion} fehlt.`,
    );
}
