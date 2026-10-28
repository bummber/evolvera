import { readFile, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import {
  createPreviewChain,
  validatePreviewChain,
} from '../src/art/generator/preview-chain';

const file = 'fixtures/preview/phase-2.json';
const generated = {
  purpose: 'phase-2-preview-only',
  chains: [createPreviewChain('traceable'), createPreviewChain('free')],
};
if (process.argv.includes('--write')) {
  await writeFile(file, `${JSON.stringify(generated, null, 2)}\n`, {
    flag: 'wx',
  });
  console.log('Zwei getrennte Vorschauketten gespeichert (je 10 Werke).');
} else {
  const stored = JSON.parse(await readFile(file, 'utf8')) as typeof generated;
  if (stored.purpose !== 'phase-2-preview-only' || stored.chains.length !== 2)
    throw new Error('Falsche Preview-Sammlung.');
  stored.chains.forEach(validatePreviewChain);
  if (!isDeepStrictEqual(stored, generated))
    throw new Error(
      'Evolution verändert gespeicherte Referenzen. Keine automatische Neuberechnung.',
    );
  console.log(
    '20 gespeicherte Evolutionsvorschauen validiert und exakt reproduziert.',
  );
}
