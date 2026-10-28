import { z } from 'zod';
import { createRandom } from '../generator/random';
import { workDateSchema } from '../schema/config';

export const LEXICON_VERSION = '0.1.0';
const prefixes = [
  'Lumi',
  'Chroma',
  'Nebel',
  'Kaleido',
  'Aero',
  'Velu',
  'Nocti',
  'Sonnen',
  'Silber',
  'Zinnober',
  'Echo',
  'Traum',
  'Mira',
  'Schatten',
  'Leucht',
  'Ferna',
  'Iri',
  'Dämmer',
  'Astra',
  'Orbi',
  'Funkel',
  'Zwischen',
  'Lila',
  'Wellen',
  'Phos',
  'Raum',
  'Morgen',
  'Azur',
  'Flimmer',
  'Samt',
  'Sternen',
  'Eis',
  'Glut',
  'Falter',
  'Ocker',
  'Zeit',
];
const endings = [
  'fuge',
  'saum',
  'rauschen',
  'faltung',
  'wirbel',
  'schimmer',
  'tanz',
  'fragment',
  'klang',
  'flucht',
  'spur',
  'bogen',
  'strömung',
  'schweben',
  'fieber',
  'stille',
  'kante',
  'flechten',
  'schweif',
  'drift',
  'schlag',
  'flimmern',
  'wende',
  'weben',
  'mosaik',
  'bruch',
  'resonanz',
  'schein',
  'falter',
  'kristall',
];
const places = [
  'Zwischenraum',
  'Morgen',
  'Stillstand',
  'Ungefähren',
  'Echo',
  'Umbruch',
  'Licht',
  'Nebel',
  'Nirgendwo',
  'Schweben',
  'Nachhall',
  'Anfang',
];
const requestSchema = z.strictObject({
  seed: z.string().min(1).max(500),
  lexiconVersion: z.literal(LEXICON_VERSION),
  parents: z
    .array(
      z.strictObject({ id: workDateSchema, title: z.string().min(1).max(160) }),
    )
    .max(2),
  usedTitles: z.array(z.string().max(160)).max(10000).default([]),
});
export type TitleRequest = z.input<typeof requestSchema>;
export type TitleResult = {
  title: string;
  tokens: string[];
  pattern: 'compound' | 'pair' | 'phrase';
  parentFragments: { parentId: string; fragment: string }[];
};

export function generateTitle(input: unknown): TitleResult {
  const request = requestSchema.parse(input);
  const used = new Set(
    request.usedTitles.map((title) =>
      title.normalize('NFC').toLocaleLowerCase('de-DE'),
    ),
  );
  for (let attempt = 0; attempt < 64; attempt++) {
    const random = createRandom(
      `${LEXICON_VERSION}:${request.seed}:${JSON.stringify(request.parents)}:${attempt}`,
    );
    const parentFragments: TitleResult['parentFragments'] = [];
    const pattern = random.pick(['compound', 'pair', 'phrase'] as const);
    const inherited = request.parents.flatMap((parent) => {
      if (random.next() < 0.35) return [];
      const word = parent.title.match(/[\p{L}]{4,}/u)?.[0];
      if (!word) return [];
      const fragment = word.slice(
        0,
        random.integer(2, Math.min(5, word.length)),
      );
      parentFragments.push({ parentId: parent.id, fragment });
      return [fragment];
    });
    const prefix = inherited.length
      ? inherited
          .map((fragment, index) =>
            index ? fragment.toLocaleLowerCase('de-DE') : fragment,
          )
          .join('')
      : random.pick(prefixes);
    const ending = random.pick(endings);
    const second = `${random.pick(prefixes)}${random.pick(endings)}`;
    const place = random.pick(places);
    const title =
      pattern === 'compound'
        ? `${prefix}${ending}`
        : pattern === 'pair'
          ? `${prefix}${ending} / ${second}`
          : `${prefix}${ending} im ${place}`;
    if (
      title.length <= 160 &&
      !used.has(title.normalize('NFC').toLocaleLowerCase('de-DE'))
    ) {
      return {
        title,
        tokens: [
          prefix,
          ending,
          ...(pattern === 'pair'
            ? [second]
            : pattern === 'phrase'
              ? ['im', place]
              : []),
        ],
        pattern,
        parentFragments,
      };
    }
  }
  throw new Error('Kein neuer Titel nach 64 deterministischen Versuchen.');
}
