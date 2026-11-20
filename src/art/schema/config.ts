import { z } from 'zod';
import {
  addSettingsIssues,
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

// EP-01: schema 2 adds the generation profile and is checked with the
// compatibility rules of version 2. Schema 1 stays valid and strict; only
// the operator worker writes schema 2 or 3, always complete.
const profileConfigShape = {
  revision: z.number().int().positive(),
  seriesStartDate: workDateSchema.nullable(),
  generationEnabled: z.boolean(),
  timezone: z.literal('Europe/Berlin'),
  inheritanceMode: modeSchema,
  ...profileSchema.shape,
};
function addConfigIssues(
  value: z.infer<z.ZodObject<typeof profileConfigShape>>,
  ctx: z.RefinementCtx,
) {
  if (value.generationEnabled && value.seriesStartDate === null)
    ctx.addIssue({
      code: 'custom',
      message:
        'Aktive Generierung benötigt ein ausdrücklich freigegebenes Startdatum.',
      path: ['seriesStartDate'],
    });
  addSettingsIssues(value, ctx);
}
export const configV2Schema = z
  .strictObject({ schemaVersion: z.literal(2), ...profileConfigShape })
  .superRefine(addConfigIssues);

// Package C (operator decision of 2026-11-20): schema 3 adds the restart of
// the series after a number of days, `null` for never. With it,
// `seriesStartDate` is the start of the first series; the running series
// starts with its first archived work (see src/series/restart.ts).
export const restartDays = { min: 3, max: 365, standard: 30 } as const;
export const restartAfterDaysSchema = z
  .number()
  .int()
  .min(restartDays.min)
  .max(restartDays.max)
  .nullable();
export const configV3Schema = z
  .strictObject({
    schemaVersion: z.literal(3),
    ...profileConfigShape,
    restartAfterDays: restartAfterDaysSchema,
  })
  .superRefine(addConfigIssues);

export type EffectiveGenerationConfig = Readonly<
  Omit<GenerationConfig, 'schemaVersion'> & {
    schemaVersion: 1 | 2 | 3;
    profile: Profile;
    restartAfterDays: number | null;
  }
>;

/**
 * Reads configuration schema 1, 2 or 3 and always returns the complete
 * effective profile. Schema 1 has no profile keys and yields the standard
 * profile; schema 2 may omit keys, which then take their standard value.
 * Before schema 3 the series never restarts.
 */
export function readGenerationConfig(
  input: unknown,
): EffectiveGenerationConfig {
  const version =
    typeof input === 'object' && input !== null && !Array.isArray(input)
      ? (input as { schemaVersion?: unknown }).schemaVersion
      : undefined;
  if (version === 2 || version === 3) {
    const {
      variation,
      features,
      palette,
      families,
      composition,
      motion,
      experimental,
      ...core
    } = (version === 3 ? configV3Schema : configV2Schema).parse(
      withProfileDefaults(input as Record<string, unknown>),
    );
    return Object.freeze({
      restartAfterDays: null,
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
    restartAfterDays: null,
  });
}
