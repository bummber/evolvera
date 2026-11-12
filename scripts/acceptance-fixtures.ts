import { readFile, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { format } from 'prettier';
import {
  createAcceptanceChain,
  profileSpecs,
  standardSpecs,
  type AcceptanceSpec,
} from '../src/art/generator/acceptance-v3';
import { validatePreviewChainV3 } from '../src/art/generator/preview-chain-v3';
import { NOVELTY_MINIMUM } from '../src/art/generator/v3/distance';
import { acceptanceCollectionV3Schema } from '../src/art/schema/chains-v3';

// EP-01 P7: acceptance works of generator 0.3.0 for the operator's art
// review. Preview only, separate from the official archive.
//
//   (no flag)  validate the stored fixtures and reproduce them
//   --write    create them again on purpose (then review them again)
//   --report   threshold figures per work; writes nothing
//
// The operator approved these works on 2026-11-12. The fixtures are frozen
// (SHA-256 in tests/acceptance-v3.test.tsx): `--write` needs a new review.
const sets = [
  ['fixtures/preview/ep01-review.json', 'standard', standardSpecs],
  ['fixtures/preview/ep01-review-profiles.json', 'deviating', profileSpecs],
] as const;

function report(spec: AcceptanceSpec) {
  const candidates = new Map<number, (number | null)[]>();
  const chain = createAcceptanceChain(spec, undefined, (generation, distance) =>
    candidates.set(generation, [
      ...(candidates.get(generation) ?? []),
      distance,
    ]),
  );
  console.log(`\n${spec.key} (${spec.mode})`);
  console.log('Gen.  Abstand   Versuch  verworfen  Elemente  Titel');
  let rejected = 0;
  let total = 0;
  for (const work of chain.works) {
    const seen = candidates.get(work.generation) ?? [];
    const dropped = seen.filter(
      (distance) => distance !== null && distance < NOVELTY_MINIMUM,
    ).length;
    rejected += dropped;
    total += seen.filter((distance) => distance !== null).length;
    console.log(
      [
        String(work.generation).padStart(4),
        (work.novelty.distance?.toFixed(3) ?? '–').padStart(8),
        String(work.evolution.recipe.retry + 1).padStart(8),
        String(dropped).padStart(10),
        String(work.dna.elements.length).padStart(9),
        ` ${work.title}${work.novelty.minimumReached ? '' : ' (Mindestabstand verfehlt)'}`,
      ].join(' '),
    );
  }
  console.log(`verworfen: ${rejected} von ${total} gemessenen Kandidaten`);
  return chain;
}

if (process.argv.includes('--report')) {
  for (const [, , specs] of sets)
    for (const spec of specs) {
      const chain = report(spec);
      if (spec.mode !== 'free') continue;
      // What a separate threshold for `free` would change (P5: about 0.22).
      for (const minimum of [0.1, 0.22]) {
        const other = createAcceptanceChain(spec, { minimum });
        const changed = chain.works.filter(
          (work, index) =>
            !isDeepStrictEqual(work.dna, other.works[index]!.dna),
        );
        const first = changed[0]?.generation;
        console.log(
          `Schwelle ${minimum} statt ${NOVELTY_MINIMUM}: ${changed.length} von ${chain.works.length} Werken anders${first ? ` (ab Generation ${first})` : ''}; verfehlt: ${other.works.filter((work) => !work.novelty.minimumReached).length}`,
        );
      }
    }
} else
  for (const [file, profiles, specs] of sets) {
    const generated = acceptanceCollectionV3Schema.parse({
      schemaVersion: 1,
      purpose: 'ep01-acceptance-preview-only',
      profiles,
      chains: specs.map((spec) => createAcceptanceChain(spec)),
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
        `${count} Abnahmewerke (${profiles}) gespeichert; offizielles Archiv unberührt.`,
      );
    } else {
      const stored = acceptanceCollectionV3Schema.parse(
        JSON.parse(await readFile(file, 'utf8')),
      );
      stored.chains.forEach(validatePreviewChainV3);
      if (!isDeepStrictEqual(stored, generated))
        throw new Error(
          'Generator 0.3.0 verändert die gespeicherten Abnahmewerke. Bewusst mit --write neu erzeugen und neu abnehmen lassen.',
        );
      console.log(
        `${count} Abnahmewerke (${profiles}) validiert und deterministisch reproduziert.`,
      );
    }
  }
