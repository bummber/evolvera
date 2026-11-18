import { instantSchema, readGenerationConfig } from '../art/schema/config';
import type { Artwork } from '../art/schema/artwork';
import type { AnyArtwork } from '../art/schema/artwork-v3';
import { snapshotSettings } from '../operator/settings';
import { generateArtwork } from '../art/generator/evolve';
import { MAX_NOVELTY_WINDOW } from '../art/generator/v3/distance';
import {
  generateArtworkV3,
  generateArtworkV4,
} from '../art/generator/v3/evolve';
import {
  addDay,
  cycleDate,
  generatorChangeDate,
  generatorV4Date,
  generatorVersionFor,
  lexiconVersionFor,
  scheduledFor,
} from './calendar';
import {
  assertGeneratorGate,
  assertSeriesGate,
  assertTitleGate,
} from './release';
import { indexPath, indexText, readArchive, workPath } from './archive';

/**
 * Reads the archive and checks that each work was made by the generator of
 * its work date: schema 3 exactly from the dated generator change on (EP-01),
 * generator 0.4.0 from the restart on. Without a change date no schema 3
 * work is accepted at all.
 */
function readSeries(
  files: ReadonlyMap<string, string>,
  start: string | null,
  changeDate: string | null,
  v4Date: string | null,
) {
  const works = readArchive(files, start);
  for (const work of works) {
    const expected = generatorVersionFor(work.id, changeDate, v4Date);
    if (
      (work.schemaVersion === 3) !== (expected !== '0.2.0') ||
      (work.schemaVersion === 3 && work.generatorVersion !== expected)
    )
      throw new Error('Archivwerk passt nicht zum datierten Generatorwechsel.');
  }
  return works;
}

/** Works before the generator change only exist with configuration schema 1. */
function legacyOnly<T>(settings: T | null): T {
  if (!settings)
    throw new Error(
      'Werke vor dem Generatorwechsel entstehen nur mit Konfigurationsschema 1.',
    );
  return settings;
}

/** No I/O. Bytes of present works come from their archived Git version, never regeneration; deleted works stay deleted. */
export function prepareRun(
  input: {
    settings: unknown;
    release: unknown;
    current: ReadonlyMap<string, string>;
    canonical: ReadonlyMap<string, string>;
    runStartedAt: string;
  },
  clock: () => string,
  /** Tests only: other change dates than the published ones. */
  options: {
    generatorChangeDate?: string | null;
    generatorV4Date?: string | null;
  } = {},
) {
  const changeDate =
    options.generatorChangeDate === undefined
      ? generatorChangeDate
      : options.generatorChangeDate;
  const v4Date =
    options.generatorV4Date === undefined
      ? generatorV4Date
      : options.generatorV4Date;
  // The immutable snapshot of this run, read once before any generation:
  // configuration schema 1 or 2 with its complete effective profile.
  const settings = readGenerationConfig(input.settings);
  // Generator 0.2.0 records the strict configuration of schema 1 in its works.
  const legacySettings =
    settings.schemaVersion === 1 ? snapshotSettings(input.settings) : null;
  const release = assertSeriesGate(settings, input.release);
  const runStartedAt = instantSchema.parse(input.runStartedAt);
  const files = new Map(input.canonical);
  const works: AnyArtwork[] = readSeries(
    files,
    settings.seriesStartDate,
    changeDate,
    v4Date,
  );
  const restored = [...files]
    .filter(([path, text]) => input.current.get(path) !== text)
    .map(([path]) => path);
  for (const path of input.current.keys())
    if (path !== indexPath && !files.has(path))
      throw new Error('Aktuelles Werk ohne sichere Git-Herkunft.');
  const added: string[] = [];
  const lastDue = cycleDate(runStartedAt);
  if (settings.generationEnabled && settings.seriesStartDate) {
    let next = works.length
      ? addDay(works.at(-1)!.id)
      : settings.seriesStartDate;
    while (next <= lastDue) {
      if (works.length >= 10000)
        throw new Error(
          'Serienbudget erreicht; manuelle Erweiterung erforderlich.',
        );
      assertTitleGate(release, lexiconVersionFor(next));
      const generatorVersion = generatorVersionFor(next, changeDate, v4Date);
      assertGeneratorGate(release, generatorVersion);
      const request = {
        generation: works.length + 1,
        workDate: next,
        seed: `evolvera:${generatorVersion}:${next}`,
        scheduledFor: scheduledFor(next),
        runStartedAt,
        usedTitles: works.map((work) => work.title),
        lexiconVersion: lexiconVersionFor(next),
      };
      const parents = works.length < 2 ? [] : works.slice(-2);
      const generateV3 =
        generatorVersion === '0.4.0' ? generateArtworkV4 : generateArtworkV3;
      const work =
        generatorVersion !== '0.2.0'
          ? generateV3(
              {
                ...request,
                // Complete effective settings of this run: the mode and the
                // profile of the configuration (schema 1: standard profile).
                settings: {
                  inheritanceMode: settings.inheritanceMode,
                  ...structuredClone(settings.profile),
                },
                settingsRevision: settings.revision,
                parents,
                // Ordered history context, oldest first; works of a
                // catch-up run join it one by one.
                history: works.slice(-MAX_NOVELTY_WINDOW),
              },
              clock,
            )
          : generateArtwork(
              {
                ...request,
                settings: legacyOnly(legacySettings),
                // Before the change date every work is of schema 1 or 2.
                parents: parents as Artwork[],
              },
              clock,
            );
      const path = workPath(next);
      files.set(path, JSON.stringify(work, null, 2) + '\n');
      added.push(path);
      works.push(work);
      next = addDay(next);
    }
  }
  readSeries(files, settings.seriesStartDate, changeDate, v4Date);
  const expectedIndex = indexText(works);
  let previousIndex = input.current.get(indexPath);
  try {
    if (
      JSON.stringify(JSON.parse(previousIndex ?? 'null')) !==
      JSON.stringify(JSON.parse(expectedIndex))
    )
      previousIndex = undefined;
  } catch {
    previousIndex = undefined;
  }
  files.set(indexPath, previousIndex ?? expectedIndex);
  const changes = new Map(
    [...files].filter(([path, text]) => input.current.get(path) !== text),
  );
  return { settings, files, changes, added, restored, workCount: works.length };
}
