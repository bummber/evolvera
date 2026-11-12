import {
  configSchema,
  instantSchema,
  readGenerationConfig,
} from '../art/schema/config';
import type { Artwork } from '../art/schema/artwork';
import type { AnyArtwork } from '../art/schema/artwork-v3';
import { snapshotSettings } from '../operator/settings';
import { generateArtwork } from '../art/generator/evolve';
import { MAX_NOVELTY_WINDOW } from '../art/generator/v3/distance';
import { generateArtworkV3 } from '../art/generator/v3/evolve';
import {
  addDay,
  cycleDate,
  generatorChangeDate,
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
 * its work date: schema 3 exactly from the dated generator change on (EP-01).
 * Without a change date no schema 3 work is accepted at all.
 */
function readSeries(
  files: ReadonlyMap<string, string>,
  start: string | null,
  changeDate: string | null,
) {
  const works = readArchive(files, start);
  for (const work of works)
    if (
      (work.schemaVersion === 3) !==
      (generatorVersionFor(work.id, changeDate) === '0.3.0')
    )
      throw new Error('Archivwerk passt nicht zum datierten Generatorwechsel.');
  return works;
}

/** No I/O. Historical bytes come from the first archived Git version, never regeneration. */
export function prepareRun(
  input: {
    settings: unknown;
    release: unknown;
    current: ReadonlyMap<string, string>;
    canonical: ReadonlyMap<string, string>;
    runStartedAt: string;
  },
  clock: () => string,
  /** Tests only: another change date than the published one. */
  options: { generatorChangeDate?: string | null } = {},
) {
  const changeDate =
    options.generatorChangeDate === undefined
      ? generatorChangeDate
      : options.generatorChangeDate;
  const settings = snapshotSettings(configSchema.parse(input.settings));
  const release = assertSeriesGate(settings, input.release);
  const runStartedAt = instantSchema.parse(input.runStartedAt);
  const files = new Map(input.canonical);
  const works: AnyArtwork[] = readSeries(
    files,
    settings.seriesStartDate,
    changeDate,
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
      const generatorVersion = generatorVersionFor(next, changeDate);
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
      const work =
        generatorVersion === '0.3.0'
          ? generateArtworkV3(
              {
                ...request,
                // Complete effective settings of this run: the mode and the
                // profile of the configuration (schema 1: standard profile).
                settings: {
                  inheritanceMode: settings.inheritanceMode,
                  ...structuredClone(
                    readGenerationConfig(input.settings).profile,
                  ),
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
                settings,
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
  readSeries(files, settings.seriesStartDate, changeDate);
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
