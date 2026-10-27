import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { configSchema } from '../src/art/schema/config';
import { validateArtwork, artworkSchema } from '../src/art/schema/artwork';
import type { Artwork } from '../src/art/schema/artwork';
import { archiveIndexSchema } from '../src/archive';

const readJson = async (file: string): Promise<unknown> =>
  JSON.parse(await readFile(file, 'utf8'));
const settings = configSchema.parse(await readJson('config/generation.json'));
const root = 'public/artworks';
const index = archiveIndexSchema.parse(
  await readJson(path.join(root, 'index.json')),
);
const files = (await readdir(root, { recursive: true })).filter(
  (file) => file.endsWith('.json') && file !== 'index.json',
);
const works: Artwork[] = [];
for (const file of files) {
  const work = artworkSchema.parse(await readJson(path.join(root, file)));
  if (file !== `${work.id.slice(0, 4)}/${work.id}.json`)
    throw new Error(`Falscher Werkpfad: ${file}`);
  works.push(work);
}
works.sort((a, b) => a.generation - b.generation);
for (const [position, work] of works.entries()) {
  if (work.generation !== position + 1)
    throw new Error('Generationen sind nicht lückenlos.');
  const parents = work.parentIds.map((id) => {
    const parent = works.find((candidate) => candidate.id === id);
    if (!parent) throw new Error(`Verwaiste Elternreferenz: ${id}`);
    return parent;
  });
  validateArtwork(work, parents);
}
const expectedIndex = works
  .toReversed()
  .map(({ id, generation, title }) => ({ id, generation, title }));
if (JSON.stringify(index.works) !== JSON.stringify(expectedIndex))
  throw new Error('Index entspricht nicht dem Archiv (neueste Werke zuerst).');
// Phase 0 safeguard, deliberately removed only with an explicitly approved later phase.
if (
  settings.seriesStartDate !== null ||
  settings.generationEnabled ||
  works.length !== 0
) {
  throw new Error(
    'Phase 0: Serienstart, offizielle Generierung und offizielles Archiv müssen deaktiviert/leer bleiben.',
  );
}
console.log(
  `Datenprüfung erfolgreich: Konfiguration gültig, ${works.length} offizielle Werke, Index konsistent.`,
);
