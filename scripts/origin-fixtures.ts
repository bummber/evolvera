import { readFile, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { format } from 'prettier';
import { generateOriginV3 } from '../src/art/generator/v3/index';
import { originCollectionSchema } from '../src/art/schema/preview-v3';
import { defaultProfile } from '../src/art/schema/profile';

// EP-01 P3: 40 independent origin studies of generator 0.3.0 with the fixed
// standard profile, drawn from consecutive seeds without any selection.
// Preview only, separate from the official archive.
//
// Until the art review of EP-01 (P7) this fixture is not frozen: after a
// deliberate change to generator 0.3.0 it is rewritten with `--write` and
// the new works are reviewed again.
const file = 'fixtures/preview/ep01-origins.json';
const count = 40;
const generated = originCollectionSchema.parse({
  schemaVersion: 1,
  purpose: 'ep01-origins-preview-only',
  studies: Array.from({ length: count }, (_, index) =>
    generateOriginV3({
      seed: `evolvera:ep01:origin:${index + 1}`,
      settings: { inheritanceMode: 'traceable', ...defaultProfile },
    }),
  ),
});
if (process.argv.includes('--write')) {
  // Written in the project's Prettier style so that format:check accepts it.
  await writeFile(
    file,
    await format(JSON.stringify(generated), { parser: 'json' }),
  );
  console.log(
    `${count} Ursprungs-Probewerke gespeichert; offizielles Archiv unberührt.`,
  );
} else {
  const stored = originCollectionSchema.parse(
    JSON.parse(await readFile(file, 'utf8')),
  );
  if (!isDeepStrictEqual(stored, generated))
    throw new Error(
      'Generator 0.3.0 verändert die gespeicherten Probewerke. Bewusst mit --write neu erzeugen und neu sichten.',
    );
  console.log(
    `${count} Ursprungs-Probewerke validiert und deterministisch reproduziert.`,
  );
}
