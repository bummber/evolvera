import { z } from 'zod';

export const workDateSchema = z.iso.date();
export const instantSchema = z.iso.datetime({ offset: true });
export const modeSchema = z.enum(['traceable', 'free']);
export const modeLabels = {
  traceable: 'Nachvollziehbare Vererbung',
  free: 'Maximale Freiheit',
} as const;

export const configSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    revision: z.number().int().positive(),
    seriesStartDate: workDateSchema.nullable(),
    generationEnabled: z.boolean(),
    timezone: z.literal('Europe/Berlin'),
    inheritanceMode: modeSchema,
  })
  .refine(
    (value) => !value.generationEnabled || value.seriesStartDate !== null,
    {
      message:
        'Aktive Generierung benötigt ein ausdrücklich freigegebenes Startdatum.',
      path: ['seriesStartDate'],
    },
  );

export type GenerationConfig = z.infer<typeof configSchema>;
export type InheritanceMode = z.infer<typeof modeSchema>;
