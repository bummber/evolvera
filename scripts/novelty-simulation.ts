import {
  extremeProfiles,
  simulateNovelty,
} from '../src/art/generator/novelty-simulation';
import {
  NOVELTY_MINIMUM,
  type DistancePart,
} from '../src/art/generator/v3/distance';

// EP-01 P5: measurement behind the minimum distance of distance measure 1.
// Simulation only, not part of `npm run check`; it writes nothing.
//
//   npx tsx scripts/novelty-simulation.ts [--chains 4] [--days 365] [--minimum 0.2]
//   npx tsx scripts/novelty-simulation.ts --extremes [--days 52]
//
// Without `--minimum` it reports the distances of first valid candidates
// when nothing is rejected, then the effect of `NOVELTY_MINIMUM`.

const option = (name: string, fallback: number) => {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : Number(process.argv[index + 1]);
};
const extremes = process.argv.includes('--extremes');
const chains = option('chains', extremes ? 1 : 4);
const days = option('days', extremes ? 52 : 365);

const quantile = (sorted: readonly number[], share: number) =>
  sorted[Math.min(sorted.length - 1, Math.floor(share * sorted.length))]!;
const percent = (part: number, whole: number) =>
  `${((100 * part) / Math.max(1, whole)).toFixed(1)} %`;

if (extremes)
  for (const [name, profile] of extremeProfiles)
    for (const mode of ['traceable', 'free'] as const) {
      const result = simulateNovelty({
        mode,
        minimum: NOVELTY_MINIMUM,
        chains,
        days,
        profile,
        prefix: 'evolvera:ep01:extreme',
      });
      console.log(
        `${name}, ${mode}: ${result.works + chains} Werke, ${result.candidates} Kandidaten, verworfen ${percent(result.rejected, result.candidates)}, verfehlt ${result.missed}, höchster Versuch ${result.maxRetry + 1}, Median ${quantile(result.workDistances, 0.5).toFixed(3)}, Elemente bis ${result.maxElements}`,
      );
    }
else {
  const minimums = process.argv.includes('--minimum')
    ? [option('minimum', 0)]
    : [0, NOVELTY_MINIMUM];
  for (const minimum of minimums)
    for (const mode of ['traceable', 'free'] as const) {
      const started = Date.now();
      const result = simulateNovelty({ mode, minimum, chains, days });
      const q = (share: number) =>
        quantile(result.candidateDistances, share).toFixed(3);
      console.log(
        [
          `${mode}, Mindestabstand ${minimum}: ${chains} Ketten × ${days} Tage, ${result.works} Werke mit Fenster, ${result.candidates} gültige Kandidaten`,
          `  Kandidaten: min ${q(0)}, 5 % ${q(0.05)}, 10 % ${q(0.1)}, 25 % ${q(0.25)}, Median ${q(0.5)}, 75 % ${q(0.75)}, max ${q(1)}`,
          `  verworfen ${result.rejected} (${percent(result.rejected, result.candidates)}), Mindestabstand verfehlt ${result.missed} Werke (${percent(result.missed, result.works)}), höchster Versuch ${result.maxRetry + 1}`,
          `  Werke: kleinster Abstand ${result.workDistances[0]?.toFixed(3)}, Median ${quantile(result.workDistances, 0.5).toFixed(3)}`,
          `  Mittel je Merkmal zum nächsten Fensterwerk: ${(
            Object.keys(result.parts) as DistancePart[]
          )
            .map(
              (part) =>
                `${part} ${(result.parts[part] / result.works).toFixed(2)}`,
            )
            .join(', ')}`,
          `  ${((Date.now() - started) / 1000).toFixed(1)} s`,
        ].join('\n'),
      );
    }
}
