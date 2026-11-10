import { z } from 'zod';

// EP-01 generation profile: the switches that frame chance and inheritance.
// Shared by configuration, artwork snapshots and (later) generator, worker and
// operator form, so that all of them apply the same rules.

/** Version of the compatibility rules in `profileIssues`. */
export const profileRulesVersion = 1;

export const frequencySchema = z.enum([
  'off',
  'rare',
  'normal',
  'often',
  'always',
]);
export const familyKeys = [
  'geometric',
  'color-field',
  'mosaic',
  'organic',
  'generative',
  'chaotic',
] as const;
export const familySchema = z.enum(familyKeys);
export const paletteStrategySchema = z.enum([
  'harmonic',
  'complementary',
  'monochrome',
  'free',
]);

/** Complete profile without defaults: every key must be present. */
export const profileSchema = z.strictObject({
  variation: z.strictObject({
    mutationStrength: z.enum(['calm', 'medium', 'high', 'wild']),
    noveltyWindow: z.number().int().min(1).max(30),
  }),
  features: z.strictObject({
    gradients: frequencySchema,
    patterns: frequencySchema,
    masks: frequencySchema,
    blendModes: frequencySchema,
    blurShadow: frequencySchema,
    lines: frequencySchema,
    curves: frequencySchema,
    generativeShapes: frequencySchema,
    animation: frequencySchema,
  }),
  palette: z.strictObject({
    strategies: z.array(paletteStrategySchema).max(4),
    contrast: z.enum(['low', 'varied', 'high']),
  }),
  families: z.strictObject({
    geometric: z.boolean(),
    'color-field': z.boolean(),
    mosaic: z.boolean(),
    organic: z.boolean(),
    generative: z.boolean(),
    chaotic: z.boolean(),
  }),
  composition: z.strictObject({
    maxLayers: z.number().int().min(1).max(3),
    symmetry: frequencySchema,
    density: z.enum(['sparse', 'varied', 'dense']),
  }),
  motion: z.strictObject({
    intensity: z.enum(['subtle', 'varied', 'strong']),
  }),
  experimental: z.strictObject({ mutationJumps: z.boolean() }),
});
export type Profile = z.infer<typeof profileSchema>;
export const profileGroups = [
  'variation',
  'features',
  'palette',
  'families',
  'composition',
  'motion',
  'experimental',
] as const satisfies readonly (keyof Profile)[];

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

/** Standard profile of EP-01 section 4; configuration schema 1 maps to it. */
export const defaultProfile: Profile = deepFreeze({
  variation: { mutationStrength: 'medium', noveltyWindow: 7 },
  features: {
    gradients: 'normal',
    patterns: 'normal',
    masks: 'rare',
    blendModes: 'rare',
    blurShadow: 'rare',
    lines: 'normal',
    curves: 'rare',
    generativeShapes: 'rare',
    animation: 'normal',
  },
  palette: {
    strategies: ['harmonic', 'complementary', 'monochrome', 'free'],
    contrast: 'varied',
  },
  families: {
    geometric: true,
    'color-field': true,
    mosaic: true,
    organic: true,
    generative: true,
    chaotic: true,
  },
  composition: { maxLayers: 3, symmetry: 'normal', density: 'varied' },
  motion: { intensity: 'varied' },
  experimental: { mutationJumps: false },
});

export type ProfileIssue = {
  rule: string;
  path: (string | number)[];
  message: string;
};

/**
 * Compatibility rules, version 1: only the two mandatory minimum selections.
 * Further exclusions need a new `profileRulesVersion` once renderer 2 and
 * generator 0.3.0 show which combinations are really impossible.
 */
export function profileIssues(profile: Profile): ProfileIssue[] {
  const issues: ProfileIssue[] = [];
  if (!Object.values(profile.families).some(Boolean))
    issues.push({
      rule: 'families.min-one',
      path: ['families'],
      message: 'Mindestens eine Kompositionsfamilie muss aktiv bleiben.',
    });
  if (profile.palette.strategies.length === 0)
    issues.push({
      rule: 'palette.strategies.min-one',
      path: ['palette', 'strategies'],
      message: 'Mindestens eine Palettenstrategie muss aktiv bleiben.',
    });
  if (
    new Set(profile.palette.strategies).size !==
    profile.palette.strategies.length
  )
    issues.push({
      rule: 'palette.strategies.unique',
      path: ['palette', 'strategies'],
      message: 'Jede Palettenstrategie darf nur einmal genannt werden.',
    });
  return issues;
}

export function addProfileIssues(
  profile: Profile,
  ctx: z.RefinementCtx,
  prefix: (string | number)[] = [],
) {
  for (const issue of profileIssues(profile))
    ctx.addIssue({
      code: 'custom',
      message: issue.message,
      path: [...prefix, ...issue.path],
    });
}

/** Complete profile that also satisfies the compatibility rules. */
export const validProfileSchema = profileSchema.superRefine((profile, ctx) =>
  addProfileIssues(profile, ctx),
);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Fills missing groups and keys with the standard profile. Present values are
 * never replaced; invalid or unknown ones stay in place and fail validation.
 */
export function withProfileDefaults(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...input };
  for (const group of profileGroups) {
    const given = input[group];
    if (given === undefined)
      result[group] = structuredClone(defaultProfile[group]);
    else if (isRecord(given))
      result[group] = { ...structuredClone(defaultProfile[group]), ...given };
  }
  return result;
}
