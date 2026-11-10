import type { DnaV3 } from '../../schema/artwork-v3';
import type { Random } from '../random';

// Fill gene of generator 0.3.0: every shape carries a fill of its own,
// independent of its outline.

export type Fill = DnaV3['elements'][number]['fill'];
export type PatternKind = Extract<Fill, { kind: 'pattern' }>['pattern'];
export const gradientKinds = ['linear', 'radial', 'conic'] as const;
export const patternKinds = [
  'stripes',
  'grid',
  'dots',
  'rings',
  'checker',
  'truchet',
] as const satisfies readonly PatternKind[];

const round = (value: number) => Math.round(value * 1e6) / 1e6;

export const solid = (color: string): Fill => ({ kind: 'solid', color });

/** Gradient over two to four of the given colours, evenly spaced stops. */
export function gradient(
  random: Random,
  colors: readonly string[],
  kind: (typeof gradientKinds)[number] = random.pick(gradientKinds),
): Fill {
  const count = Math.min(4, Math.max(2, colors.length));
  const stops = colors.slice(0, count).map((color, index) => ({
    color,
    offset: round(index / (count - 1)),
  }));
  if (kind === 'linear') return { kind, angle: random.integer(0, 359), stops };
  const centerX = round(random.between(0.2, 0.8));
  const centerY = round(random.between(0.2, 0.8));
  return kind === 'radial'
    ? { kind, centerX, centerY, stops }
    : { kind, angle: random.integer(0, 359), centerX, centerY, stops };
}

/** Pattern of two colours; `period` is a fraction of the art plane. */
export function pattern(
  random: Random,
  foreground: string,
  background: string,
  kind: PatternKind = random.pick(patternKinds),
): Fill {
  return {
    kind: 'pattern',
    pattern: kind,
    // Only stripes and grids have a direction of their own.
    angle:
      kind === 'stripes' || kind === 'grid'
        ? random.pick([0, 30, 45, 60, 90, 120, 135, 150] as const)
        : 0,
    period: round(random.between(0.024, 0.09)),
    foreground,
    background,
  };
}

/** All colours a fill can show; used by contrast and visibility checks. */
export function fillColors(fill: Fill): string[] {
  switch (fill.kind) {
    case 'solid':
      return [fill.color];
    case 'pattern':
      return [fill.foreground, fill.background];
    default:
      return fill.stops.map((stop) => stop.color);
  }
}
