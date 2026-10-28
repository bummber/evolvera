import { artworkSchema, validateArtwork } from '../art/schema/artwork';
import type { Artwork } from '../art/schema/artwork';
import { validateEvolution } from '../art/generator/provenance';
import { addDay } from './calendar';
export const workPath = (id: string) =>
  `public/artworks/${id.slice(0, 4)}/${id}.json`;
export const indexPath = 'public/artworks/index.json';
export const isWorkPath = (path: string) =>
  /^public\/artworks\/\d{4}\/\d{4}-\d{2}-\d{2}\.json$/.test(path);
export function readWorks(
  files: ReadonlyMap<string, string>,
  start: string | null,
): Artwork[] {
  const works = [...files]
    .filter(([path]) => path !== indexPath)
    .map(([path, text]) => {
      if (!isWorkPath(path)) throw new Error('Unerwarteter Archivpfad.');
      const work = artworkSchema.parse(JSON.parse(text));
      if (path !== workPath(work.id))
        throw new Error('Archivpfad passt nicht zur Werk-ID.');
      return work;
    })
    .sort((a, b) => a.generation - b.generation);
  let next = start;
  const titles = new Set<string>();
  works.forEach((work, index) => {
    if (!next || work.id !== next || work.generation !== index + 1)
      throw new Error('Archiv hat Datums- oder Generationenlücken.');
    const parents = index < 2 ? [] : works.slice(index - 2, index);
    if (work.schemaVersion === 2) validateEvolution(work, parents);
    else validateArtwork(work, parents);
    const title = work.title.normalize('NFC').toLocaleLowerCase('de-DE');
    if (titles.has(title)) throw new Error('Doppelter Archivtitel.');
    titles.add(title);
    next = addDay(next);
  });
  return works;
}
export const indexText = (works: readonly Artwork[]) =>
  JSON.stringify(
    {
      schemaVersion: 1,
      works: works
        .toReversed()
        .map(({ id, generation, title }) => ({ id, generation, title })),
    },
    null,
    2,
  ) + '\n';
