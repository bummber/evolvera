import type { AnyArtwork } from '../../schema/artwork-v3';
import { hashSeed } from '../random';
import type { Family } from './families';
import { fillColors, solid, type Fill } from './fills';
import type { Element, LayerName } from './kit';
import { contrast, oklchToHex, type Palette } from './palette';

// Parents as generator 0.3.0 reads them (EP-01, P4). Works of schema 3 are
// taken as stored. Works of schema 1 and 2 are read in memory only, as one
// structure layer with solid fills; their files are never touched.

/** One element of a parent with the path of its stored DNA. */
export type Source = {
  /** The element in the vocabulary of schema 3. */
  element: Element;
  /** `elements.N` in the stored DNA of the parent. */
  path: string;
  /** Stored in schema 1 or 2: the colour lies at `color`, not in a fill. */
  legacy: boolean;
};
export type ParentView = {
  id: string;
  legacy: boolean;
  background: string;
  layers: Partial<Record<LayerName, { family: Family }>>;
  sources: Source[];
  /** Palette read from the DNA: the five colours with the largest area. */
  palette: Palette;
};

/** Neutral reserve tones for parents that store no palette. */
const NEUTRAL: [string, string] = [
  oklchToHex(0.13, 0, 0),
  oklchToHex(0.97, 0, 0),
];
const PALETTE_SIZE = 5;

function derivePalette(background: string, sources: readonly Source[]) {
  const weights = new Map<string, number>();
  for (const { element } of sources)
    for (const color of fillColors(element.fill))
      if (color !== background)
        weights.set(
          color,
          (weights.get(color) ?? 0) +
            element.width * element.height * element.opacity,
        );
  const ranked = [...weights]
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
    .slice(0, PALETTE_SIZE)
    .map(([color]) => color);
  if (ranked.length === 0)
    ranked.push(
      contrast(background, NEUTRAL[0]) >= contrast(background, NEUTRAL[1])
        ? NEUTRAL[0]
        : NEUTRAL[1],
    );
  const colors = Array.from(
    { length: PALETTE_SIZE },
    (_, index) => ranked[index % ranked.length]!,
  ).sort(
    (a, b) =>
      contrast(background, b) - contrast(background, a) || (a < b ? -1 : 1),
  );
  const palette: Palette = {
    strategy: 'free',
    background,
    colors,
    extremes: NEUTRAL,
  };
  return palette;
}

/** `kinetic` exists only in the old vocabulary and was never generated. */
const legacyFamily = (family: string): Family =>
  family === 'kinetic' ? 'generative' : (family as Family);

export function readParent(work: AnyArtwork): ParentView {
  if (work.schemaVersion === 3) {
    const sources = work.dna.elements.map((element, index) => ({
      element,
      path: `elements.${index}`,
      legacy: false,
    }));
    return {
      id: work.id,
      legacy: false,
      background: work.dna.background,
      layers: work.dna.layers,
      sources,
      palette: derivePalette(work.dna.background, sources),
    };
  }
  const { background } = work.dna;
  const sources = work.dna.elements
    .map(({ color, ...rest }, index) => ({
      element: { ...rest, layer: 'structure', fill: solid(color) } as Element,
      path: `elements.${index}`,
      legacy: true,
    }))
    // Ground-coloured forms are the padding of the old evidence blocks and
    // show nothing; they are not inherited.
    .filter(({ element }) => fillColors(element.fill)[0] !== background);
  return {
    id: work.id,
    legacy: true,
    background,
    layers: { structure: { family: legacyFamily(work.dna.family) } },
    sources,
    palette: derivePalette(background, sources),
  };
}

/** Colour of the child palette at the rank the colour has in its parent. */
export function mapColor(color: string, from: Palette, to: Palette) {
  if (color === from.background) return to.background;
  const rank = from.colors.indexOf(color);
  return to.colors[(rank >= 0 ? rank : hashSeed(color)) % to.colors.length]!;
}
export function mapFill(fill: Fill, map: (color: string) => string): Fill {
  switch (fill.kind) {
    case 'solid':
      return { ...fill, color: map(fill.color) };
    case 'pattern':
      return {
        ...fill,
        foreground: map(fill.foreground),
        background: map(fill.background),
      };
    default:
      return {
        ...fill,
        stops: fill.stops.map((stop) => ({ ...stop, color: map(stop.color) })),
      };
  }
}

/** Trait paths of a fill, relative to its element, colours first. */
export function fillTraits(fill: Fill): string[] {
  const stops = (count: number) =>
    Array.from({ length: count }, (_, index) => `fill.stops.${index}.color`);
  switch (fill.kind) {
    case 'solid':
      return ['fill.color'];
    case 'linear':
      return [...stops(fill.stops.length), 'fill.angle'];
    case 'radial':
      return [...stops(fill.stops.length), 'fill.centerX', 'fill.centerY'];
    case 'conic':
      return [
        ...stops(fill.stops.length),
        'fill.angle',
        'fill.centerX',
        'fill.centerY',
      ];
    case 'pattern':
      return ['fill.foreground', 'fill.background', 'fill.period'];
  }
}

/** Value at a dotted path below an element, if it is a plain trait value. */
export function readElementTrait(
  element: Element,
  path: string,
): string | number | undefined {
  let node: unknown = element;
  for (const key of path.split('.')) {
    if (typeof node !== 'object' || node === null || !Object.hasOwn(node, key))
      return undefined;
    node = (node as Record<string, unknown>)[key];
  }
  return typeof node === 'string' || typeof node === 'number'
    ? node
    : undefined;
}

/**
 * Stored path and value of a trait of a parent element. For parents of
 * schema 1 and 2 only the fields of the old vocabulary exist.
 */
export function sourceTrait(source: Source, trait: string) {
  if (source.legacy) {
    if (trait.startsWith('fill.') && trait !== 'fill.color') return undefined;
    if (!/^(fill\.color|x|y|width|height|rotation|opacity)$/.test(trait))
      return undefined;
  }
  const value = readElementTrait(source.element, trait);
  if (value === undefined) return undefined;
  return {
    path: `${source.path}.${source.legacy && trait === 'fill.color' ? 'color' : trait}`,
    value,
  };
}

/** First stored trait of the parent that holds exactly this colour. */
export function colorSource(view: ParentView, color: string) {
  for (const source of view.sources)
    for (const trait of fillTraits(source.element.fill)) {
      const found = sourceTrait(source, trait);
      if (found?.value === color) return found;
    }
  return undefined;
}
