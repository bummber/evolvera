import { scheduledFor as scheduleForDate } from '../../series/calendar';
import type { Artwork } from '../schema/artwork';
import type { AnyArtwork, ArtworkV3 } from '../schema/artwork-v3';
import { previewChainV3Schema, type PreviewChainV3 } from '../schema/chains-v3';
import type { SettingsSnapshot } from '../schema/preview-v3';
import { defaultProfile, type Profile } from '../schema/profile';
import { generateArtworkV3 } from './v3/evolve';
import { validateEvolutionV3 } from './v3/provenance';

// Preview chains of generator 0.3.0 (EP-01, P4). Simulation only: the dates
// are fixture metadata, not a series start, and nothing reaches the archive.

const nextDay = (id: string) => {
  const date = new Date(`${id}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
};

export function createPreviewChainV3(options: {
  key: string;
  mode: 'traceable' | 'free';
  length?: number;
  /** Work date of the first new work. */
  start?: string;
  prefix?: string;
  profile?: Profile;
  legacyParents?: readonly Artwork[];
}): PreviewChainV3 {
  const {
    key,
    mode,
    length = 10,
    prefix = 'evolvera:ep01:chain',
    profile = defaultProfile,
    legacyParents = [],
  } = options;
  const start =
    options.start ??
    (legacyParents.length ? nextDay(legacyParents.at(-1)!.id) : '2000-01-01');
  if (legacyParents.length !== 0 && legacyParents.length !== 2)
    throw new Error('Übergangskette: genau zwei alte Eltern oder keine.');
  if (!Number.isInteger(length) || length < 2 || length > 400)
    throw new Error('Vorschaukette: 2–400 Generationen.');
  const settings: SettingsSnapshot = {
    inheritanceMode: mode,
    ...structuredClone(profile),
  };
  const before = legacyParents.at(-1)?.generation ?? 0;
  const history: AnyArtwork[] = [...legacyParents];
  const works: ArtworkV3[] = [];
  let workDate = start;
  for (let index = 0; index < length; index++) {
    const generation = before + index + 1;
    const scheduledFor = scheduleForDate(workDate);
    const runStartedAt = new Date(
      Date.parse(scheduledFor) + 1000,
    ).toISOString();
    const generatedAt = new Date(Date.parse(scheduledFor) + 2000).toISOString();
    const work = generateArtworkV3(
      {
        generation,
        workDate,
        scheduledFor,
        runStartedAt,
        settings,
        settingsRevision: 1,
        parents: generation <= 2 ? [] : history.slice(-2),
        seed: `${prefix}:${key}:${generation}`,
        usedTitles: history.map((entry) => entry.title),
      },
      () => generatedAt,
    );
    works.push(work);
    history.push(work);
    workDate = nextDay(workDate);
  }
  return validatePreviewChainV3({
    schemaVersion: 1,
    kind: 'evolution-preview-v3',
    key,
    inheritanceMode: mode,
    simulationStart: start,
    legacyParents: [...legacyParents],
    works,
  });
}

export function validatePreviewChainV3(input: unknown): PreviewChainV3 {
  const chain = previewChainV3Schema.parse(input);
  const history: AnyArtwork[] = [...chain.legacyParents];
  const titles = new Set(
    history.map((work) =>
      work.title.normalize('NFC').toLocaleLowerCase('de-DE'),
    ),
  );
  let expectedDate = chain.simulationStart;
  let generation = (chain.legacyParents.at(-1)?.generation ?? 0) + 1;
  for (const work of chain.works) {
    if (
      work.id !== expectedDate ||
      work.generation !== generation ||
      work.inheritanceMode !== chain.inheritanceMode
    )
      throw new Error(
        'Datums-, Modus- oder Generationenlücke in der Vorschaukette.',
      );
    const title = work.title.normalize('NFC').toLocaleLowerCase('de-DE');
    if (titles.has(title))
      throw new Error('Doppelter Titel in der Vorschaukette.');
    titles.add(title);
    validateEvolutionV3(work, generation <= 2 ? [] : history.slice(-2));
    history.push(work);
    expectedDate = nextDay(expectedDate);
    generation++;
  }
  return chain;
}
