import { addDay, scheduledFor } from '../../series/calendar';
import type { ArtworkV3 } from '../schema/artwork-v3';
import type { PreviewChainV3 } from '../schema/chains-v3';
import { defaultProfile, type Profile } from '../schema/profile';
import { validatePreviewChainV3 } from './preview-chain-v3';
import { MAX_NOVELTY_WINDOW } from './v3/distance';
import { generateArtworkV3, type NoveltyTuning } from './v3/evolve';
import { featureNames } from './v3/kit';

// EP-01 P7: the works shown to the operator for the art review of generator
// 0.3.0. Consecutive seeds without selection. Preview only: the dates are
// fixture metadata, nothing reaches the official archive. Generator 0.3.0 is
// only called here, not changed.

const profileWith = (change: (profile: Profile) => void) => {
  const profile = structuredClone(defaultProfile) as Profile;
  change(profile);
  return profile;
};

export type AcceptanceSpec = {
  key: string;
  mode: 'traceable' | 'free';
  length: number;
  profile: Profile;
};

/** Forty works of the standard profile: one chain per inheritance mode. */
export const standardSpecs: readonly AcceptanceSpec[] = [
  { key: 'traceable', mode: 'traceable', length: 20, profile: defaultProfile },
  { key: 'free', mode: 'free', length: 20, profile: defaultProfile },
];

/** Three short chains with deviating profiles. */
export const profileSpecs: readonly AcceptanceSpec[] = [
  {
    key: 'calm',
    mode: 'traceable',
    length: 6,
    profile: profileWith((profile) => {
      profile.variation.mutationStrength = 'calm';
      profile.composition.density = 'sparse';
      profile.motion.intensity = 'subtle';
    }),
  },
  {
    key: 'wild',
    mode: 'traceable',
    length: 6,
    profile: profileWith((profile) => {
      profile.variation.mutationStrength = 'wild';
      profile.experimental.mutationJumps = true;
      for (const name of featureNames) profile.features[name] = 'often';
    }),
  },
  {
    key: 'reduced',
    mode: 'traceable',
    length: 6,
    profile: profileWith((profile) => {
      profile.families = {
        geometric: false,
        'color-field': true,
        mosaic: false,
        organic: true,
        generative: false,
        chaotic: false,
      };
      profile.composition.maxLayers = 2;
    }),
  },
];

/**
 * One acceptance chain. `tuning` is for the threshold report only; the
 * stored fixtures are always created without it.
 */
export function createAcceptanceChain(
  spec: AcceptanceSpec,
  tuning?: NoveltyTuning,
  observe?: (generation: number, distance: number | null) => void,
): PreviewChainV3 {
  const works: ArtworkV3[] = [];
  const simulationStart = '2000-01-01';
  let workDate = simulationStart;
  for (let generation = 1; generation <= spec.length; generation++) {
    const planned = scheduledFor(workDate);
    const at = (offset: number) =>
      new Date(Date.parse(planned) + offset).toISOString();
    works.push(
      generateArtworkV3(
        {
          generation,
          workDate,
          scheduledFor: planned,
          runStartedAt: at(1000),
          settings: {
            inheritanceMode: spec.mode,
            ...structuredClone(spec.profile),
          },
          settingsRevision: 1,
          parents: generation <= 2 ? [] : works.slice(-2),
          history: works.slice(-MAX_NOVELTY_WINDOW),
          seed: `evolvera:ep01:review:${spec.key}:${generation}`,
          usedTitles: works.map((work) => work.title),
        },
        () => at(2000),
        tuning || observe
          ? {
              ...tuning,
              observe: ({ distance }) => observe?.(generation, distance),
            }
          : undefined,
      ),
    );
    workDate = addDay(workDate);
  }
  const chain: PreviewChainV3 = {
    schemaVersion: 1,
    kind: 'evolution-preview-v3',
    key: spec.key,
    inheritanceMode: spec.mode,
    simulationStart,
    legacyParents: [],
    works,
  };
  // A different threshold cannot pass the strict validator of the stored one.
  return tuning?.minimum === undefined ? validatePreviewChainV3(chain) : chain;
}
