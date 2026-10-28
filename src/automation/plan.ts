import { configSchema, instantSchema } from '../art/schema/config';
import { snapshotSettings } from '../operator/settings';
import { generateArtwork } from '../art/generator/evolve';
import { addDay, cycleDate, scheduledFor } from './calendar';
import { assertSeriesGate } from './release';
import { indexPath, indexText, readWorks, workPath } from './archive';

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
) {
  const settings = snapshotSettings(configSchema.parse(input.settings));
  assertSeriesGate(settings, input.release);
  const runStartedAt = instantSchema.parse(input.runStartedAt);
  const files = new Map(input.canonical);
  const works = readWorks(files, settings.seriesStartDate);
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
      const work = generateArtwork(
        {
          generation: works.length + 1,
          workDate: next,
          seed: `evolvera:0.2.0:${next}`,
          scheduledFor: scheduledFor(next),
          runStartedAt,
          settings,
          parents: works.length < 2 ? [] : works.slice(-2),
          usedTitles: works.map((work) => work.title),
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
  readWorks(files, settings.seriesStartDate);
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
