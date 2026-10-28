import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { generateStudy } from '../src/art/generator/study';
import {
  previewCollectionSchema,
  studyFamilySchema,
} from '../src/art/schema/preview';

const file = 'fixtures/preview/phase-1.json';
const generated = previewCollectionSchema.parse({
  schemaVersion: 1,
  purpose: 'phase-1-preview-only',
  studies: studyFamilySchema.options.flatMap((family) =>
    Array.from({ length: 4 }, (_, index) =>
      generateStudy({ family, seed: `evolvera:phase-1:${index + 1}` }),
    ),
  ),
});
if (process.argv.includes('--write')) {
  await mkdir('fixtures/preview', { recursive: true });
  // Existing references cannot be silently overwritten, even by a changed generator.
  await writeFile(file, `${JSON.stringify(generated, null, 2)}\n`, {
    flag: 'wx',
  });
  console.log(
    '12 getrennte Vorschau-DNA gespeichert; offizielles Archiv unberührt.',
  );
} else {
  const stored = previewCollectionSchema.parse(
    JSON.parse(await readFile(file, 'utf8')),
  );
  if (!isDeepStrictEqual(stored, generated))
    throw new Error(
      'Generator verändert gespeicherte Vorschau-DNA. Version/Referenzen ausdrücklich prüfen.',
    );
  console.log(
    '12 gespeicherte Vorschauen validiert und deterministisch reproduziert.',
  );
}
