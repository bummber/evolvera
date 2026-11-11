import {
  layerNames,
  type AnyArtwork,
  type DnaV3,
} from '../../schema/artwork-v3';
import { readParent, viewOfDna, type ParentView } from './parents';
import { canonicalJson, sha256 } from './sha256';

// Distance measure version 1 and the similarity window (EP-01, P5). Pure
// numbers: no React, no browser, no clock. Works of schema 1 and 2 are read
// in memory like parents, as one structure layer with solid fills.

export const DISTANCE_VERSION = 1;
/** Weights of the six parts; they add up to 1 and belong to version 1. */
export const DISTANCE_WEIGHTS = Object.freeze({
  families: 0.25,
  palette: 0.25,
  kinds: 0.15,
  fills: 0.15,
  density: 0.1,
  motion: 0.1,
});
export type DistancePart = keyof typeof DISTANCE_WEIGHTS;
/**
 * Minimum distance of a new work to the nearest of the recent works it is
 * compared with. Derived from simulations (365 test days per mode) so that
 * at most about every tenth candidate is rejected; see
 * docs/extensions/EP01-vielfalt-5.md.
 */
export const NOVELTY_MINIMUM = 0.02;
/** Largest window a profile can ask for (`variation.noveltyWindow`). */
export const MAX_NOVELTY_WINDOW = 30;

/** OKLab distance at which two colours count as entirely different. */
const COLOR_CAP = 0.25;
/** Ratio of element counts at which two densities count as entirely different. */
const DENSITY_CAP = 8;

type Lab = readonly [number, number, number];
export type Signature = {
  families: Partial<Record<(typeof layerNames)[number], string>>;
  background: Lab;
  colors: Lab[];
  kinds: Map<string, number>;
  fills: Map<string, number>;
  motion: Map<string, number>;
  count: number;
};

const round = (value: number) => Math.round(value * 1e6) / 1e6;

/** 8-bit sRGB hex to OKLab (Björn Ottosson's matrices). */
export function hexToOklab(hex: string): Lab {
  const value = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [value >> 16, (value >> 8) & 255, value & 255].map(
    (channel) => {
      const unit = channel / 255;
      return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
    },
  ) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function shares(values: readonly string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  // Divided once, so equal proportions give exactly equal shares.
  return new Map(
    [...counts].map(([value, count]) => [value, count / values.length]),
  );
}

function signatureOfView(view: ParentView): Signature {
  const elements = view.sources.map((source) => source.element);
  return {
    families: Object.fromEntries(
      layerNames
        .filter((name) => view.layers[name])
        .map((name) => [name, view.layers[name]!.family]),
    ),
    background: hexToOklab(view.background),
    colors: [...new Set(view.palette.colors)].map(hexToOklab),
    kinds: shares(elements.map((element) => element.kind)),
    fills: shares(elements.map((element) => element.fill.kind)),
    motion: shares(elements.map((element) => element.motion.kind)),
    count: elements.length,
  };
}
/** What the measure sees of a stored work of any schema. */
export const signatureOf = (work: AnyArtwork) =>
  signatureOfView(readParent(work));
/** What the measure sees of a candidate DNA of schema 3. */
export const signatureOfDna = (dna: DnaV3) =>
  signatureOfView(viewOfDna('candidate', dna));

const colorDistance = (a: Lab, b: Lab) =>
  Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
const capped = (value: number, cap: number) => Math.min(1, value / cap);
/** Mean distance of each colour to the nearest colour of the other set. */
const nearest = (from: readonly Lab[], to: readonly Lab[]) =>
  from.reduce(
    (sum, color) =>
      sum + Math.min(...to.map((other) => colorDistance(color, other))),
    0,
  ) / from.length;
/** Half the summed difference of two share tables: 0 equal, 1 disjoint. */
function variation(a: Map<string, number>, b: Map<string, number>) {
  let sum = 0;
  for (const key of new Set([...a.keys(), ...b.keys()]))
    sum += Math.abs((a.get(key) ?? 0) - (b.get(key) ?? 0));
  return Math.min(1, sum / 2);
}

/** The six parts of the distance, each from 0 (equal) to 1. */
export function distanceParts(
  a: Signature,
  b: Signature,
): Record<DistancePart, number> {
  const slots = layerNames.filter(
    (name) => a.families[name] ?? b.families[name],
  );
  return {
    families: slots.length
      ? slots.filter((name) => a.families[name] !== b.families[name]).length /
        slots.length
      : 0,
    palette:
      capped(colorDistance(a.background, b.background), COLOR_CAP) / 2 +
      capped(
        (nearest(a.colors, b.colors) + nearest(b.colors, a.colors)) / 2,
        COLOR_CAP,
      ) /
        2,
    kinds: variation(a.kinds, b.kinds),
    fills: variation(a.fills, b.fills),
    density: capped(
      Math.abs(Math.log(Math.max(1, a.count) / Math.max(1, b.count))),
      Math.log(DENSITY_CAP),
    ),
    motion: variation(a.motion, b.motion),
  };
}

/** Distance of two works, 0 to 1, rounded like every stored number. */
export function distance(a: Signature, b: Signature) {
  const parts = distanceParts(a, b);
  return round(
    (Object.keys(DISTANCE_WEIGHTS) as DistancePart[]).reduce(
      (sum, part) => sum + DISTANCE_WEIGHTS[part] * parts[part],
      0,
    ),
  );
}

/** Distance to the nearest recent work; `null` if there is none. */
export function distanceToWindow(
  candidate: Signature,
  recent: readonly Signature[],
) {
  return recent.length
    ? Math.min(...recent.map((entry) => distance(candidate, entry)))
    : null;
}

/**
 * The window of a work: the last N works of its chain in chronological
 * order, all of them if the chain is shorter.
 */
export function noveltyWindow<T extends AnyArtwork>(
  history: readonly T[],
  size: number,
) {
  return history.slice(-size);
}

/**
 * Stable digest that binds a work to the archived works of its window: their
 * order, their ids and their complete DNA.
 */
export function contextDigest(recent: readonly AnyArtwork[]) {
  return sha256(
    canonicalJson({
      distanceVersion: DISTANCE_VERSION,
      window: recent.map((work) => ({
        id: work.id,
        dna: sha256(canonicalJson(work.dna)),
      })),
    }),
  );
}

/**
 * The history a work was generated with must be a gapless run of the
 * generations right before it, oldest first.
 */
export function assertHistory(
  history: readonly AnyArtwork[],
  generation: number,
  workDate: string,
) {
  history.forEach((work, index) => {
    if (
      work.generation !== generation - history.length + index ||
      work.id >= workDate ||
      (index > 0 && history[index - 1]!.id >= work.id)
    )
      throw new Error(
        'Historienkontext ist nicht die lückenlose, geordnete Folge der vorherigen Werke.',
      );
  });
}
