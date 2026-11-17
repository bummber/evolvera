import type { InheritanceMode } from '../art/schema/config';
import { defaultProfile, type Profile } from '../art/schema/profile';
import {
  contrastLabels,
  familyLabels,
  featureLabels,
  frequencyLabels,
  intensityLabels,
  strategyLabels,
  strengthLabels,
} from '../app/work-labels';

// EP-01 P8: pure helpers of the operator page. No I/O; the worker validates
// again with the shared rules before anything reaches Git.

export type Settings = Profile & { inheritanceMode: InheritanceMode };

const clone = (profile: Profile): Profile => structuredClone(profile);

/** Quick profiles (operator decision 8). The mode stays as chosen. */
export const presets: Record<'standard' | 'calm' | 'wild', Profile> = {
  standard: clone(defaultProfile),
  calm: {
    ...clone(defaultProfile),
    variation: { ...defaultProfile.variation, mutationStrength: 'calm' },
    features: {
      ...defaultProfile.features,
      patterns: 'rare',
      animation: 'rare',
    },
    palette: { ...clone(defaultProfile).palette, contrast: 'low' },
    composition: { ...defaultProfile.composition, density: 'sparse' },
    motion: { intensity: 'subtle' },
  },
  wild: {
    ...clone(defaultProfile),
    variation: { ...defaultProfile.variation, mutationStrength: 'wild' },
    features: {
      ...defaultProfile.features,
      patterns: 'often',
      animation: 'often',
      masks: 'normal',
      blendModes: 'normal',
      blurShadow: 'normal',
      curves: 'normal',
      generativeShapes: 'normal',
    },
    palette: { ...clone(defaultProfile).palette, contrast: 'high' },
    composition: { ...defaultProfile.composition, density: 'dense' },
    motion: { intensity: 'strong' },
    experimental: { mutationJumps: true },
  },
};
export const presetLabels = {
  standard: 'Standard',
  calm: 'Ruhig',
  wild: 'Wild',
} as const;

/** Labels of the operator page; the density uses the operator's own words. */
export const modeOptions = {
  traceable: 'Nachvollziehbar',
  free: 'Frei',
} as const;
export const densityOptions = {
  sparse: 'Sparsam',
  varied: 'Wechselnd',
  dense: 'Dicht',
} as const;
export const layerOptions = { 1: '1 Ebene', 2: '2 Ebenen', 3: '3 Ebenen' };

/** Combinations that are allowed but narrow the variety of the series. */
export function profileWarnings(settings: Settings): string[] {
  const warnings: string[] = [];
  if (Object.values(settings.families).filter(Boolean).length === 1)
    warnings.push(
      'Nur eine Kompositionsfamilie: Die Werke ähneln sich im Aufbau stärker.',
    );
  if (settings.palette.strategies.length === 1)
    warnings.push(
      'Nur eine Palettenstrategie: Die Farbwelt wird einheitlicher.',
    );
  const fixed = [
    ...Object.values(settings.features),
    settings.composition.symmetry,
  ].filter((value) => value === 'off' || value === 'always').length;
  if (fixed >= 3)
    warnings.push(
      `${fixed} Merkmale stehen fest auf „Aus“ oder „Immer“: weniger Abwechslung zwischen den Werken.`,
    );
  if (settings.variation.noveltyWindow <= 2)
    warnings.push(
      'Kurzes Ähnlichkeitsfenster: Ein Werk darf früheren Werken stärker gleichen.',
    );
  return warnings;
}

type Entry = { label: string; format: (value: never) => string };
const yesNo = (value: boolean) => (value ? 'an' : 'aus');
const fields: Record<string, Entry> = {
  inheritanceMode: {
    label: 'Vererbungsmodus',
    format: (value: InheritanceMode) => modeOptions[value],
  },
  'variation.mutationStrength': {
    label: 'Mutationsstärke',
    format: (value: keyof typeof strengthLabels) => strengthLabels[value],
  },
  'variation.noveltyWindow': {
    label: 'Ähnlichkeitsfenster',
    format: (value: number) => `${value} Werke`,
  },
  ...Object.fromEntries(
    Object.entries(featureLabels).map(([key, label]) => [
      `features.${key}`,
      {
        label,
        format: (value: keyof typeof frequencyLabels) => frequencyLabels[value],
      },
    ]),
  ),
  'palette.strategies': {
    label: 'Palettenstrategien',
    format: (value: (keyof typeof strategyLabels)[]) =>
      value.map((name) => strategyLabels[name]).join(', '),
  },
  'palette.contrast': {
    label: 'Kontrast',
    format: (value: keyof typeof contrastLabels) => contrastLabels[value],
  },
  ...Object.fromEntries(
    Object.entries(familyLabels)
      .filter(([key]) => key in defaultProfile.families)
      .map(([key, label]) => [`families.${key}`, { label, format: yesNo }]),
  ),
  'composition.density': {
    label: 'Dichte',
    format: (value: keyof typeof densityOptions) => densityOptions[value],
  },
  'composition.maxLayers': {
    label: 'Höchste Ebenenzahl',
    format: (value: 1 | 2 | 3) => layerOptions[value],
  },
  'composition.symmetry': {
    label: 'Symmetrie',
    format: (value: keyof typeof frequencyLabels) => frequencyLabels[value],
  },
  'motion.intensity': {
    label: 'Bewegungsstärke',
    format: (value: keyof typeof intensityLabels) => intensityLabels[value],
  },
  'experimental.mutationJumps': {
    label: 'Mutationssprünge',
    format: yesNo,
  },
};

const read = (settings: Settings, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (value, key) => (value as Record<string, unknown>)[key],
      settings,
    );

/** Every switch that differs from the stored revision, in plain words. */
export function settingsChanges(stored: Settings, form: Settings) {
  return Object.entries(fields).flatMap(([path, entry]) => {
    const before = read(stored, path);
    const after = read(form, path);
    if (JSON.stringify(before) === JSON.stringify(after)) return [];
    const format = entry.format as (value: unknown) => string;
    return [
      { path, label: entry.label, from: format(before), to: format(after) },
    ];
  });
}
