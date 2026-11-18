import { readFile, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { format } from 'prettier';
import {
  createAcceptanceChain,
  standardSpecs,
} from '../src/art/generator/acceptance-v3';
import { validatePreviewChainV3 } from '../src/art/generator/preview-chain-v3';
import { acceptanceCollectionV4Schema } from '../src/art/schema/chains-v3';

// Light review of generator 0.4.0 (operator decision of 2026-11-18): one
// chain of 20 works per inheritance mode in the standard profile. Preview
// only, separate from the official archive.
//
//   (no flag)  validate the stored fixture and reproduce it
//   --write    create it again on purpose (then review it again)
const file = 'fixtures/preview/review-v4.json';
const generated = acceptanceCollectionV4Schema.parse({
  schemaVersion: 1,
  purpose: 'v4-acceptance-preview-only',
  profiles: 'standard',
  chains: standardSpecs.map((spec) =>
    createAcceptanceChain(spec, undefined, undefined, '0.4.0'),
  ),
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
    `${count} Abnahmewerke von Generator 0.4.0 gespeichert; offizielles Archiv unberührt.`,
  );
} else {
  const stored = acceptanceCollectionV4Schema.parse(
    JSON.parse(await readFile(file, 'utf8')),
  );
  stored.chains.forEach(validatePreviewChainV3);
  if (!isDeepStrictEqual(stored, generated))
    throw new Error(
      'Generator 0.4.0 verändert die gespeicherten Abnahmewerke. Bewusst mit --write neu erzeugen und neu abnehmen lassen.',
    );
  console.log(
    `${count} Abnahmewerke von Generator 0.4.0 validiert und deterministisch reproduziert.`,
  );
}
