import { readFile, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { format } from 'prettier';
import { validatePreviewChainV3 } from '../src/art/generator/preview-chain-v3';
import { MAX_NOVELTY_WINDOW } from '../src/art/generator/v3/distance';
import { generateArtworkV3 } from '../src/art/generator/v3/evolve';
import type { ArtworkV3 } from '../src/art/schema/artwork-v3';
import { constraintPreviewSchema } from '../src/art/schema/chains-v3';
import { defaultProfile } from '../src/art/schema/profile';
import { addDay, scheduledFor } from '../src/series/calendar';

// EP-01 P6: a short preview chain for the gallery and detail views. The two
// origins use the standard profile; from the third work on gradients,
// patterns, lines, curves and generative shapes are switched off (settings
// revision 2), so inherited traits are converted and recorded as
// `constrained`. Generator 0.3.0 is only called, not changed. Preview only,
// separate from the official archive; not frozen before the art review (P7).
const file = 'fixtures/preview/ep01-constraints.json';
const length = 6;
const restricted = {
  ...structuredClone(defaultProfile),
  features: {
    ...defaultProfile.features,
    gradients: 'off',
    patterns: 'off',
    lines: 'off',
    curves: 'off',
    generativeShapes: 'off',
  },
};
const works: ArtworkV3[] = [];
let workDate = '2000-01-01';
for (let generation = 1; generation <= length; generation++) {
  const planned = scheduledFor(workDate);
  const at = (offset: number) =>
    new Date(Date.parse(planned) + offset).toISOString();
  works.push(
    generateArtworkV3(
      {
        generation,
        workDate,
        scheduledFor: planned,
        runStartedAt: at(1000),
        settings: {
          inheritanceMode: 'traceable',
          ...structuredClone(generation <= 2 ? defaultProfile : restricted),
        },
        settingsRevision: generation <= 2 ? 1 : 2,
        parents: generation <= 2 ? [] : works.slice(-2),
        history: works.slice(-MAX_NOVELTY_WINDOW),
        seed: `evolvera:ep01:rules:${generation}`,
        usedTitles: works.map((work) => work.title),
      },
      () => at(2000),
    ),
  );
  workDate = addDay(workDate);
}
const generated = constraintPreviewSchema.parse({
  schemaVersion: 1,
  purpose: 'ep01-constraints-preview-only',
  chain: {
    schemaVersion: 1,
    kind: 'evolution-preview-v3',
    key: 'constraints',
    inheritanceMode: 'traceable',
    simulationStart: '2000-01-01',
    legacyParents: [],
    works,
  },
});
validatePreviewChainV3(generated.chain);
const converted = works.reduce(
  (sum, work) =>
    sum +
    work.evolution.decisions.filter(
      (decision) => decision.operation.kind === 'constrained',
    ).length,
  0,
);
if (converted === 0)
  throw new Error('Die Probekette enthält keine Umwandlung.');
if (process.argv.includes('--write')) {
  // Written in the project's Prettier style so that format:check accepts it.
  await writeFile(
    file,
    await format(JSON.stringify(generated), { parser: 'json' }),
  );
  console.log(
    `${works.length} Werke mit ${converted} Umwandlungen gespeichert; offizielles Archiv unberührt.`,
  );
} else {
  const stored = constraintPreviewSchema.parse(
    JSON.parse(await readFile(file, 'utf8')),
  );
  validatePreviewChainV3(stored.chain);
  if (!isDeepStrictEqual(stored, generated))
    throw new Error(
      'Generator 0.3.0 verändert die gespeicherte Probekette mit Umwandlungen. Bewusst mit --write neu erzeugen und neu sichten.',
    );
  console.log(
    `${works.length} Werke mit ${converted} Umwandlungen validiert und deterministisch reproduziert.`,
  );
}
