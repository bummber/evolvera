import { z } from 'zod';
import { createRandom } from '../generator/random';
import { workDateSchema } from '../schema/config';

export const LEXICON_VERSION = '0.1.0';
/** 0.2.0 inherits whole lexicon parts instead of sliced letters. */
export const LEXICON_VERSION_2 = '0.2.0';
const RECENT_MAIN_WORDS = 365;
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
  lexiconVersion: z.enum([LEXICON_VERSION, LEXICON_VERSION_2]),
  parents: z
    .array(
      z.strictObject({ id: workDateSchema, title: z.string().min(1).max(160) }),
    )
    .max(2),
  // Chronological; 0.2.0 keeps the main word unique among the most recent ones.
  usedTitles: z.array(z.string().max(160)).max(10000).default([]),
});
export type TitleRequest = z.input<typeof requestSchema>;
export type TitleResult = {
  title: string;
  tokens: string[];
  pattern: 'compound' | 'pair' | 'phrase';
  parentFragments: { parentId: string; fragment: string }[];
};

type Part = { slot: 'prefix' | 'ending'; text: string };
const longest = (candidates: string[]) =>
  candidates.sort((a, b) => b.length - a.length)[0];
const mainWord = (title: string) =>
  (title.match(/\p{L}+/u)?.[0] ?? '')
    .normalize('NFC')
    .toLocaleLowerCase('de-DE');
/** Lexicon parts a parent title can pass on; place words after "im" are not heritable. */
function heritableParts(title: string): Part[] {
  const parts: Part[] = [];
  for (const word of title.split(' im ')[0]!.match(/\p{L}+/gu) ?? []) {
    const prefix = longest(
      prefixes.filter(
        (item) => word.startsWith(item) && word.length > item.length,
      ),
    );
    const ending = longest(
      endings.filter(
        (item) => word.endsWith(item) && word.length > item.length,
      ),
    );
    if (prefix) parts.push({ slot: 'prefix', text: prefix });
    if (ending) parts.push({ slot: 'ending', text: ending });
  }
  return parts;
}
function generateTitleV2(request: z.output<typeof requestSchema>): TitleResult {
  const normalize = (title: string) =>
    title.normalize('NFC').toLocaleLowerCase('de-DE');
  const used = new Set(request.usedTitles.map(normalize));
  const recentMainWords = new Set(
    request.usedTitles.slice(-RECENT_MAIN_WORDS).map(mainWord),
  );
  for (let attempt = 0; attempt < 64; attempt++) {
    const random = createRandom(
      `${LEXICON_VERSION_2}:${request.seed}:${JSON.stringify(request.parents)}:${attempt}`,
    );
    const pattern = random.pick(['compound', 'pair', 'phrase'] as const);
    const slots: Partial<Record<Part['slot'], string>> = {};
    const parentFragments: TitleResult['parentFragments'] = [];
    for (const parent of request.parents) {
      if (random.next() < 0.35) continue;
      const open = heritableParts(parent.title).filter(
        (part) => !slots[part.slot],
      );
      if (!open.length) continue;
      const part = random.pick(open);
      slots[part.slot] = part.text;
      parentFragments.push({ parentId: parent.id, fragment: part.text });
    }
    const prefix = slots.prefix ?? random.pick(prefixes);
    const ending = slots.ending ?? random.pick(endings);
    const second = `${random.pick(prefixes)}${random.pick(endings)}`;
    const place = random.pick(places);
    const title =
      pattern === 'compound'
        ? `${prefix}${ending}`
        : pattern === 'pair'
          ? `${prefix}${ending} / ${second}`
          : `${prefix}${ending} im ${place}`;
    if (!used.has(normalize(title)) && !recentMainWords.has(mainWord(title))) {
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

export function generateTitle(input: unknown): TitleResult {
  const request = requestSchema.parse(input);
  if (request.lexiconVersion === LEXICON_VERSION_2)
    return generateTitleV2(request);
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
