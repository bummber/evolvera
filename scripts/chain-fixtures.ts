import { readFile, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { format } from 'prettier';
import {
  createPreviewChainV3,
  validatePreviewChainV3,
} from '../src/art/generator/preview-chain-v3';
import { chainCollectionV3Schema } from '../src/art/schema/chains-v3';
import { artworkSchema } from '../src/art/schema/artwork';

// EP-01 P4: preview chains of generator 0.3.0 with the fixed standard
// profile: ten generations per inheritance mode and a short transition chain
// whose first works descend from two stored works of schema 2 (read from the
// phase 2 preview, which stays untouched). Preview only, separate from the
// official archive.
//
// Until the art review of EP-01 (P7) this fixture is not frozen: after a
// deliberate change to generator 0.3.0 it is rewritten with `--write` and
// the chains are reviewed again.
const file = 'fixtures/preview/ep01-chains.json';
const phase2 = JSON.parse(
  await readFile('fixtures/preview/phase-2.json', 'utf8'),
) as { chains: { works: unknown[] }[] };
const legacyParents = phase2.chains[0]!.works.slice(-2).map((work) =>
  artworkSchema.parse(work),
);
const generated = chainCollectionV3Schema.parse({
  schemaVersion: 1,
  purpose: 'ep01-chains-preview-only',
  chains: [
    createPreviewChainV3({ key: 'traceable', mode: 'traceable' }),
    createPreviewChainV3({ key: 'free', mode: 'free' }),
    createPreviewChainV3({
      key: 'transition',
      mode: 'traceable',
      length: 4,
      legacyParents,
    }),
  ],
});
const count = generated.chains.reduce(
  (sum, chain) => sum + chain.works.length,
  0,
);
if (process.argv.includes('--write')) {
  // Written in the project's Prettier style so that format:check accepts it.
  await writeFile(
    file,
    await format(JSON.stringify(generated), { parser: 'json' }),
  );
  console.log(
    `${count} Kettenwerke in ${generated.chains.length} Probeketten gespeichert; offizielles Archiv unberührt.`,
  );
} else {
  const stored = chainCollectionV3Schema.parse(
    JSON.parse(await readFile(file, 'utf8')),
  );
  stored.chains.forEach(validatePreviewChainV3);
  if (!isDeepStrictEqual(stored, generated))
    throw new Error(
      'Generator 0.3.0 verändert die gespeicherten Probeketten. Bewusst mit --write neu erzeugen und neu sichten.',
    );
  console.log(
    `${count} Kettenwerke in ${generated.chains.length} Probeketten validiert und deterministisch reproduziert.`,
  );
}
