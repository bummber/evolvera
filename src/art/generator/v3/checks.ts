import type { DnaV3 } from '../../schema/artwork-v3';
import type { Random } from '../random';
import { fillColors } from './fills';
import { round, type Element, type FeatureName } from './kit';
import { contrast, type Palette } from './palette';

// Hard checks of generator 0.3.0: visibility anchor and feature census.

/** Visibility rules of the EP-01 plan, section 4.3. */
export const ANCHOR_MIN_SIZE = 0.12;
export const ANCHOR_MIN_OPACITY = 0.65;
export const ANCHOR_MIN_CONTRAST = 2;

/** Oriented box of an element at rest, widened by blur and shadow. */
type Box = {
  cx: number;
  cy: number;
  halfWidth: number;
  halfHeight: number;
  /** Rotation in radians. */
  turn: number;
};
/**
 * Exact for rectangles and lines, conservative for every other outline,
 * which lies inside its box.
 */
export function bounds(element: Element): Box {
  const shadow = element.effects?.shadow;
  const spread =
    3 * (element.effects?.blur ?? 0) +
    (shadow
      ? Math.max(Math.abs(shadow.offsetX), Math.abs(shadow.offsetY)) +
        2 * shadow.blur
      : 0);
  return {
    cx: element.x + element.width / 2,
    cy: element.y + element.height / 2,
    halfWidth: element.width / 2 + spread,
    halfHeight: element.height / 2 + spread,
    turn: (element.rotation * Math.PI) / 180,
  };
}
/** Separating axis test of two oriented boxes; touching is no overlap. */
function overlaps(a: Box, b: Box) {
  const axes = [a.turn, a.turn + Math.PI / 2, b.turn, b.turn + Math.PI / 2];
  const reach = (box: Box, axis: number) =>
    box.halfWidth * Math.abs(Math.cos(axis - box.turn)) +
    box.halfHeight * Math.abs(Math.sin(axis - box.turn));
  return axes.every((axis) => {
    const distance = Math.abs(
      (b.cx - a.cx) * Math.cos(axis) + (b.cy - a.cy) * Math.sin(axis),
    );
    return distance < reach(a, axis) + reach(b, axis) - 1e-9;
  });
}

/** Outlines without a clip path; anchors stay unturned and unclipped. */
export const anchorKinds = new Set<Element['kind']>([
  'rectangle',
  'circle',
  'ellipse',
  'blob',
]);

/** Lowest contrast of the colours against the ground and what lies below. */
function weakestContrast(
  colors: readonly string[],
  box: Box,
  dna: DnaV3,
  below: number,
) {
  const behind = [
    dna.background,
    ...dna.elements
      .slice(0, below)
      .filter((element) => overlaps(bounds(element), box))
      .flatMap((element) => fillColors(element.fill)),
  ];
  return Math.min(
    ...colors.flatMap((color) => behind.map((other) => contrast(color, other))),
  );
}

/**
 * Colour with the strongest contrast for a box above the first `below`
 * elements. Palette colours come first; the two extreme tones are used only
 * where no palette colour reaches the minimum contrast.
 */
function strongest(dna: DnaV3, box: Box, below: number, palette: Palette) {
  const pick = (colors: readonly string[]) => {
    let best = { color: colors[0]!, score: 0 };
    for (const color of colors) {
      const score = weakestContrast([color], box, dna, below);
      if (score > best.score) best = { color, score };
    }
    return best;
  };
  const own = pick(palette.colors);
  return own.score >= ANCHOR_MIN_CONTRAST ? own : pick(palette.extremes);
}
/** Strongest colour for the element at `index` as it lies in the work. */
export function strongestColor(dna: DnaV3, index: number, palette: Palette) {
  return strongest(dna, bounds(dna.elements[index]!), index, palette);
}

/** Whether the element at `index` is a visible anchor of the work. */
export function isAnchor(dna: DnaV3, index: number): boolean {
  const element = dna.elements[index];
  if (
    !element ||
    !anchorKinds.has(element.kind) ||
    element.rotation !== 0 ||
    element.motion.kind !== 'static' ||
    (element.effects !== undefined &&
      Object.keys(element.effects).length > 0) ||
    element.opacity < ANCHOR_MIN_OPACITY ||
    element.width < ANCHOR_MIN_SIZE ||
    element.height < ANCHOR_MIN_SIZE ||
    element.x + element.width > 1 + 1e-9 ||
    element.y + element.height > 1 + 1e-9
  )
    return false;
  const box = bounds(element);
  if (
    dna.elements.slice(index + 1).some((later) => overlaps(bounds(later), box))
  )
    return false;
  return (
    weakestContrast(fillColors(element.fill), box, dna, index) >=
    ANCHOR_MIN_CONTRAST
  );
}
/** Index of the first visible anchor, or -1. */
export function findAnchor(dna: DnaV3): number {
  return dna.elements.findIndex((_, index) => isAnchor(dna, index));
}

/** From this contrast on a place counts as clearly readable. */
const ANCHOR_GOOD_CONTRAST = 3;

/**
 * Place for an anchor drawn above everything in `dna`, for the first of the
 * given sizes that fits. Among all places it draws one at random from the
 * best tier: a palette colour with clear contrast, then a palette colour at
 * the minimum contrast, then one of the two extreme tones. Without a place
 * that reaches the minimum contrast there is none.
 */
export function placeAnchor(
  random: Random,
  dna: DnaV3,
  palette: Palette,
  sizes: readonly (readonly [number, number])[],
  /** Mirrored top layer: on the axis, or left of it with a mirror image. */
  symmetric: boolean,
) {
  const steps = [0.14, 0.23, 0.32, 0.41, 0.5, 0.59, 0.68, 0.77, 0.86];
  const below = dna.elements.length;
  for (const [width, height] of sizes) {
    type Place = {
      box: { x: number; y: number; width: number; height: number };
      color: string;
      paired: boolean;
    };
    const tiers: [Place[], Place[], Place[]] = [[], [], []];
    for (const stepY of steps)
      for (const stepX of symmetric ? steps.filter((s) => s <= 0.5) : steps) {
        // Keep the whole form inside the plane.
        const cx = Math.min(1 - width / 2, Math.max(width / 2, stepX));
        const cy = Math.min(1 - height / 2, Math.max(height / 2, stepY));
        const paired = symmetric && stepX < 0.5;
        // A pair must not touch itself across the axis.
        if (paired && cx + width / 2 > 0.49) continue;
        const box = {
          cx,
          cy,
          halfWidth: width / 2,
          halfHeight: height / 2,
          turn: 0,
        };
        const { color, score: here } = strongest(dna, box, below, palette);
        const score = paired
          ? Math.min(
              here,
              weakestContrast([color], { ...box, cx: 1 - cx }, dna, below),
            )
          : here;
        if (score < ANCHOR_MIN_CONTRAST) continue;
        tiers[
          !palette.colors.includes(color)
            ? 2
            : score >= ANCHOR_GOOD_CONTRAST
              ? 0
              : 1
        ].push({
          box: {
            x: round(cx - width / 2),
            y: round(cy - height / 2),
            width,
            height,
          },
          color,
          paired,
        });
      }
    const tier = tiers.find((places) => places.length);
    if (tier) return random.pick(tier);
  }
  return undefined;
}

/** Which feature groups a DNA actually contains. */
export function featuresOf(dna: DnaV3): Record<FeatureName, boolean> {
  const some = (test: (element: Element) => boolean) => dna.elements.some(test);
  return {
    gradients: some((e) => ['linear', 'radial', 'conic'].includes(e.fill.kind)),
    patterns: some((e) => e.fill.kind === 'pattern'),
    masks: some((e) => e.effects?.mask !== undefined),
    blendModes: some((e) => e.effects?.blend !== undefined),
    blurShadow: some(
      (e) => e.effects?.blur !== undefined || e.effects?.shadow !== undefined,
    ),
    lines: some((e) => e.kind === 'line'),
    // Curves: arcs, rings and stroked paths.
    curves: some(
      (e) =>
        e.kind === 'arc' ||
        e.kind === 'ring' ||
        (e.kind === 'path' && e.shape.strokeWidth !== undefined),
    ),
    // Generative shapes: polygons and filled curved areas.
    generativeShapes: some(
      (e) =>
        e.kind === 'polygon' ||
        (e.kind === 'path' && e.shape.strokeWidth === undefined),
    ),
    animation: some((e) => e.motion.kind !== 'static'),
  };
}
