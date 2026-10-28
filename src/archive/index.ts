import { z } from 'zod';
import { workDateSchema } from '../art/schema/config';

export const archiveIndexSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    works: z.array(
      z.strictObject({
        id: workDateSchema,
        generation: z.number().int().positive(),
        title: z.string().trim().min(1).max(160),
      }),
    ),
  })
  .superRefine(({ works }, ctx) => {
    if (
      new Set(works.map((w) => w.id)).size !== works.length ||
      new Set(works.map((w) => w.generation)).size !== works.length
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Doppelte Werkdaten oder Generationen im Index.',
      });
    }
  });
export type ArchiveIndex = z.infer<typeof archiveIndexSchema>;

export function dataPath(relative: string): string {
  if (
    !/^artworks\/(index\.json|\d{4}\/\d{4}-\d{2}-\d{2}\.json)$/.test(relative)
  ) {
    throw new Error('Nicht erlaubter Archivpfad.');
  }
  return `${import.meta.env.BASE_URL}${relative}`;
}

export async function loadArchiveIndex(
  signal?: AbortSignal,
): Promise<ArchiveIndex> {
  const response = await fetch(dataPath('artworks/index.json'), {
    signal,
    cache: 'no-cache',
  });
  if (!response.ok)
    throw new Error(`Archiv nicht erreichbar (HTTP ${response.status}).`);
  return archiveIndexSchema.parse(await response.json());
}
