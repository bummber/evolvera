import { z } from 'zod';
import {
  addProfileIssues,
  defaultProfile,
  profileSchema,
  withProfileDefaults,
  type Profile,
} from './profile';

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

// EP-01: schema 2 adds the generation profile. Schema 1 stays the strict
// contract of the running series; nothing writes schema 2 yet.
export const configV2Schema = z
  .strictObject({
    schemaVersion: z.literal(2),
    revision: z.number().int().positive(),
    seriesStartDate: workDateSchema.nullable(),
    generationEnabled: z.boolean(),
    timezone: z.literal('Europe/Berlin'),
    inheritanceMode: modeSchema,
    ...profileSchema.shape,
  })
  .superRefine((value, ctx) => {
    if (value.generationEnabled && value.seriesStartDate === null)
      ctx.addIssue({
        code: 'custom',
        message:
          'Aktive Generierung benötigt ein ausdrücklich freigegebenes Startdatum.',
        path: ['seriesStartDate'],
      });
    addProfileIssues(value, ctx);
  });

export type EffectiveGenerationConfig = Readonly<
  Omit<GenerationConfig, 'schemaVersion'> & {
    schemaVersion: 1 | 2;
    profile: Profile;
  }
>;

/**
 * Reads configuration schema 1 or 2 and always returns the complete effective
 * profile. Schema 1 has no profile keys and yields the standard profile;
 * schema 2 may omit keys, which then take their standard value.
 */
export function readGenerationConfig(
  input: unknown,
): EffectiveGenerationConfig {
  if (
    typeof input === 'object' &&
    input !== null &&
    !Array.isArray(input) &&
    (input as { schemaVersion?: unknown }).schemaVersion === 2
  ) {
    const {
      variation,
      features,
      palette,
      families,
      composition,
      motion,
      experimental,
      ...core
    } = configV2Schema.parse(
      withProfileDefaults(input as Record<string, unknown>),
    );
    return Object.freeze({
      ...core,
      profile: {
        variation,
        features,
        palette,
        families,
        composition,
        motion,
        experimental,
      },
    });
  }
  return Object.freeze({
    ...configSchema.parse(input),
    profile: defaultProfile,
  });
}
