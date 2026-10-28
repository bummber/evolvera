import { readFile, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { createPreviewChain } from '../src/art/generator/preview-chain';
const file = 'fixtures/preview/phase-3.json';
const original = JSON.parse(
  await readFile('fixtures/preview/phase-2.json', 'utf8'),
);
const complete = [
  createPreviewChain('traceable', 20),
  createPreviewChain('free', 20),
];
complete.forEach((chain, index) => {
  if (
    !isDeepStrictEqual(chain.works.slice(0, 10), original.chains[index].works)
  )
    throw new Error('Bisherige Phase-2-Werke wären verändert.');
});
const generated = {
  purpose: 'phase-3-review-extension-only',
  chains: complete.map((chain) => ({
    inheritanceMode: chain.inheritanceMode,
    works: chain.works.slice(10),
  })),
};
if (process.argv.includes('--write')) {
  await writeFile(file, `${JSON.stringify(generated, null, 2)}\n`, {
    flag: 'wx',
  });
  console.log(
    '20 weitere getrennte Testwerke gespeichert; bisherige Werke erhalten.',
  );
} else {
  const stored = JSON.parse(await readFile(file, 'utf8'));
  if (!isDeepStrictEqual(stored, generated))
    throw new Error(
      'Phase-3-Testreferenzen verändert; keine automatische Neuberechnung.',
    );
  const { reviewChains } = await import('../src/preview/review');
  const works = reviewChains.flatMap((chain) => chain.works);
  if (
    works.length !== 40 ||
    new Set(works.map((work) => work.seed)).size !== 40
  )
    throw new Error('40 getrennte Testwerke erforderlich.');
  console.log(
    '40 Testwerke in zwei Zwanzigerketten validiert und exakt reproduziert. Abnahmestatus separat in config/release.json.',
  );
}
