import { scheduledFor } from '../../series/calendar';
import type { ArtworkV3 } from '../schema/artwork-v3';
import { defaultProfile, familyKeys, type Profile } from '../schema/profile';
import {
  distanceParts,
  DISTANCE_WEIGHTS,
  MAX_NOVELTY_WINDOW,
  signatureOf,
  type DistancePart,
} from './v3/distance';
import { generateArtworkV3 } from './v3/evolve';
import { featureNames } from './v3/kit';

// Simulated chains that measure the similarity window (EP-01, P5): how many
// candidates a minimum distance rejects and how often it is missed. The
// dates are simulation metadata; nothing is written or archived.

const nextDay = (id: string) => {
  const date = new Date(`${id}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
};

export function simulateNovelty(options: {
  mode: 'traceable' | 'free';
  minimum: number;
  chains: number;
  days: number;
  profile?: Profile;
  prefix?: string;
}) {
  const { mode, minimum, profile = defaultProfile } = options;
  const result = {
    works: 0,
    candidates: 0,
    rejected: 0,
    missed: 0,
    maxRetry: 0,
    maxElements: 0,
    /** Distance of every valid candidate to its window. */
    candidateDistances: [] as number[],
    /** Distance of every archived work to its window. */
    workDistances: [] as number[],
    /** Parts of the distance between a work and its nearest window work. */
    parts: Object.fromEntries(
      Object.keys(DISTANCE_WEIGHTS).map((part) => [part, 0]),
    ) as Record<DistancePart, number>,
  };
  for (let chain = 1; chain <= options.chains; chain++) {
    const history: ArtworkV3[] = [];
    let workDate = '2001-01-01';
    for (let generation = 1; generation <= options.days; generation++) {
      const at = scheduledFor(workDate);
      const work = generateArtworkV3(
        {
          generation,
          workDate,
          scheduledFor: at,
          runStartedAt: new Date(Date.parse(at) + 1000).toISOString(),
          settings: { inheritanceMode: mode, ...structuredClone(profile) },
          settingsRevision: 1,
          parents: generation <= 2 ? [] : history.slice(-2),
          history: history.slice(-MAX_NOVELTY_WINDOW),
          seed: `${options.prefix ?? 'evolvera:ep01:novelty'}:${mode}:${chain}:${generation}`,
          usedTitles: history.map((entry) => entry.title),
        },
        () => new Date(Date.parse(at) + 2000).toISOString(),
        {
          minimum,
          observe: ({ distance }) => {
            if (distance === null) return;
            result.candidates++;
            result.candidateDistances.push(distance);
            if (distance < minimum) result.rejected++;
          },
        },
      );
      if (work.novelty.distance !== null) {
        result.works++;
        result.workDistances.push(work.novelty.distance);
        if (!work.novelty.minimumReached) result.missed++;
        result.maxRetry = Math.max(
          result.maxRetry,
          work.evolution.recipe.retry,
        );
        const window = history.slice(-profile.variation.noveltyWindow);
        const own = signatureOf(work);
        const nearest = window
          .map((entry) => distanceParts(own, signatureOf(entry)))
          .map((parts) => ({
            parts,
            sum: (Object.keys(parts) as DistancePart[]).reduce(
              (sum, part) => sum + DISTANCE_WEIGHTS[part] * parts[part],
              0,
            ),
          }))
          .sort((a, b) => a.sum - b.sum)[0]!;
        for (const part of Object.keys(result.parts) as DistancePart[])
          result.parts[part] += nearest.parts[part];
      }
      result.maxElements = Math.max(
        result.maxElements,
        work.dna.elements.length,
      );
      history.push(work);
      workDate = nextDay(workDate);
    }
  }
  result.candidateDistances.sort((a, b) => a - b);
  result.workDistances.sort((a, b) => a - b);
  return result;
}

const profileWith = (change: (profile: Profile) => void) => {
  const profile = structuredClone(defaultProfile) as Profile;
  change(profile);
  return profile;
};
const all = (level: 'off' | 'always') =>
  profileWith((profile) => {
    for (const name of featureNames) profile.features[name] = level;
    profile.composition.symmetry = level;
  });
/** Extreme profiles of A-35. */
export const extremeProfiles: [string, Profile][] = [
  ['alles off', all('off')],
  ['alles always', all('always')],
  ...familyKeys.map((family): [string, Profile] => [
    `nur ${family}`,
    profileWith((profile) => {
      for (const key of familyKeys) profile.families[key] = key === family;
    }),
  ]),
  [
    'wild',
    profileWith((profile) => {
      profile.variation.mutationStrength = 'wild';
    }),
  ],
];
