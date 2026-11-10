// Renderer 2 geometry: turns the numeric shape genes of schema 3 into polygon
// points. Pure functions without React or browser APIs. All coordinates are
// logical pixels of the 1000 × 1000 art plane, relative to the element's box.
//
// Every non-rectangular outline becomes a CSS `clip-path: polygon(...)`.
// Curves are flattened into short segments, and strokes (arcs, rings, open
// paths) are outlined as closed areas, because an open clip path has no
// visible width. `polygon()` is supported by Chromium, Firefox and Safari
// alike, so no `path()`, `shape()` or SVG is needed.

export type Point = readonly [number, number];
export type Clip = { rule: 'nonzero' | 'evenodd'; points: Point[] };

const CURVE_STEPS = 12;
const round = (value: number) => Math.round(value * 100) / 100;

/** Points on an ellipse; 0° is at the top, angles run clockwise. */
function ellipse(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  from: number,
  to: number,
): Point[] {
  const steps = Math.max(2, Math.ceil(Math.abs(to - from) / 4));
  return Array.from({ length: steps + 1 }, (_, i) => {
    const angle = ((from + ((to - from) * i) / steps) * Math.PI) / 180;
    return [cx + rx * Math.sin(angle), cy - ry * Math.cos(angle)] as const;
  });
}

/** Elliptical band of constant width along the inside of the box. */
export function arcClip(
  width: number,
  height: number,
  start: number,
  sweep: number,
  stroke: number,
): Clip {
  const rx = width / 2;
  const ry = height / 2;
  const inner = [Math.max(rx - stroke, 0), Math.max(ry - stroke, 0)] as const;
  if (sweep >= 360)
    return {
      rule: 'evenodd',
      points: [
        ...ellipse(rx, ry, rx, ry, 0, 360),
        ...ellipse(rx, ry, inner[0], inner[1], 0, 360),
      ],
    };
  return {
    rule: 'nonzero',
    points: [
      ...ellipse(rx, ry, rx, ry, start, start + sweep),
      ...ellipse(rx, ry, inner[0], inner[1], start + sweep, start),
    ],
  };
}

export const ringClip = (width: number, height: number, stroke: number) =>
  arcClip(width, height, 0, 360, stroke);

export function polygonClip(
  points: readonly { x: number; y: number }[],
  width: number,
  height: number,
): Clip {
  return {
    rule: 'nonzero',
    points: points.map(({ x, y }) => [x * width, y * height] as const),
  };
}

export type PathCommand =
  | { op: 'M'; x: number; y: number }
  | { op: 'L'; x: number; y: number }
  | { op: 'Q'; cx: number; cy: number; x: number; y: number }
  | {
      op: 'C';
      c1x: number;
      c1y: number;
      c2x: number;
      c2y: number;
      x: number;
      y: number;
    };

/** Flattens lines and Bézier curves into a polyline in unit coordinates. */
export function flattenPath(commands: readonly PathCommand[]): Point[] {
  const points: Point[] = [];
  let [px, py] = [0, 0];
  for (const command of commands) {
    if (command.op === 'M' || command.op === 'L') {
      points.push([command.x, command.y]);
    } else {
      for (let i = 1; i <= CURVE_STEPS; i += 1) {
        const t = i / CURVE_STEPS;
        const u = 1 - t;
        if (command.op === 'Q')
          points.push([
            u * u * px + 2 * u * t * command.cx + t * t * command.x,
            u * u * py + 2 * u * t * command.cy + t * t * command.y,
          ]);
        else
          points.push([
            u ** 3 * px +
              3 * u * u * t * command.c1x +
              3 * u * t * t * command.c2x +
              t ** 3 * command.x,
            u ** 3 * py +
              3 * u * u * t * command.c1y +
              3 * u * t * t * command.c2y +
              t ** 3 * command.y,
          ]);
      }
    }
    [px, py] = [command.x, command.y];
  }
  return points;
}

/** Outline of a polyline as one closed area of the given width. */
function strokeOutline(line: readonly Point[], stroke: number): Point[] {
  const half = stroke / 2;
  const left: Point[] = [];
  const right: Point[] = [];
  for (let i = 0; i < line.length - 1; i += 1) {
    const [ax, ay] = line[i]!;
    const [bx, by] = line[i + 1]!;
    const length = Math.hypot(bx - ax, by - ay);
    if (length === 0) continue;
    const nx = (-(by - ay) / length) * half;
    const ny = ((bx - ax) / length) * half;
    // Two points per segment end: joins are bevelled and never spike.
    left.push([ax + nx, ay + ny], [bx + nx, by + ny]);
    right.push([ax - nx, ay - ny], [bx - nx, by - ny]);
  }
  return [...left, ...right.reverse()];
}

/**
 * Closed paths without stroke are filled areas. Stroked paths are drawn as
 * the outline of their line; their coordinates are inset by half the stroke
 * so that the full width stays inside the element's box.
 */
export function pathClip(
  commands: readonly PathCommand[],
  closed: boolean,
  stroke: number | undefined,
  width: number,
  height: number,
): Clip {
  const flat = flattenPath(commands);
  if (stroke === undefined)
    return {
      rule: 'nonzero',
      points: flat.map(([x, y]) => [x * width, y * height] as const),
    };
  const inset = Math.min(stroke / 2, width / 2, height / 2);
  const line = flat.map(
    ([x, y]) =>
      [
        inset + x * (width - 2 * inset),
        inset + y * (height - 2 * inset),
      ] as const,
  );
  if (closed && line.length > 1) line.push(line[0]!);
  return { rule: 'nonzero', points: strokeOutline(line, stroke) };
}

export function clipToCss({ rule, points }: Clip): string {
  const list = points.map(([x, y]) => `${round(x)}px ${round(y)}px`).join(', ');
  return `polygon(${rule}, ${list})`;
}
