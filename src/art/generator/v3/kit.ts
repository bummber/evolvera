import { loadCounts, loadLimitsV3, type DnaV3 } from '../../schema/artwork-v3';
import type { Random } from '../random';
import { gradient, pattern, solid, type Fill } from './fills';
import type { Palette } from './palette';

// Shared building kit of generator 0.3.0: element construction, mirroring,
// load budget and the per-layer context every family draws with.

export type Element = DnaV3['elements'][number];
export type ElementKind = Element['kind'];
export type LayerName = Element['layer'];
export type Effects = NonNullable<Element['effects']>;
type PathCommand = Extract<
  Element,
  { kind: 'path' }
>['shape']['commands'][number];

export const featureNames = [
  'gradients',
  'patterns',
  'masks',
  'blendModes',
  'blurShadow',
  'lines',
  'curves',
  'generativeShapes',
  'animation',
] as const;
export type FeatureName = (typeof featureNames)[number];
/** Decisions per work: which feature groups and whether symmetry occur. */
export type Flags = Record<FeatureName | 'symmetry', boolean>;

/** Six decimals; `+ 0` turns -0 into 0 so that stored JSON compares equal. */
export const round = (value: number) => Math.round(value * 1e6) / 1e6 + 0;
export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function rounded<T>(value: T): T {
  if (typeof value === 'number') return round(value) as T;
  if (Array.isArray(value)) return value.map(rounded) as T;
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, rounded(entry)]),
    ) as T;
  return value;
}

/** Remaining load of one work; counted while elements are added. */
export type Budget = {
  elements: number;
  dots: number;
  clipped: number;
  paths: number;
};
const budgetKeys = ['elements', 'dots', 'clipped', 'paths'] as const;
/** Two elements stay free for a visibility anchor and its mirror image. */
export const createBudget = (): Budget => ({
  elements: loadLimitsV3.elements - 2,
  dots: loadLimitsV3.dots,
  clipped: loadLimitsV3.clipped,
  paths: loadLimitsV3.paths,
});

/** Charges a ready-made group to the budget; `false` when it does not fit. */
export function spend(budget: Budget, group: readonly Element[]): boolean {
  const cost = loadCounts(group);
  if (budgetKeys.some((key) => cost[key] > budget[key])) return false;
  for (const key of budgetKeys) budget[key] -= cost[key];
  return true;
}

const flip = (angle: number) => round((720 - angle) % 360);

export function mirrorFill(fill: Fill): Fill {
  switch (fill.kind) {
    case 'solid':
      return fill;
    case 'linear':
      return { ...fill, angle: flip(fill.angle) };
    case 'radial':
      return { ...fill, centerX: round(1 - fill.centerX) };
    case 'conic':
      // A mirrored conic gradient runs the other way round.
      return {
        ...fill,
        angle: flip(fill.angle),
        centerX: round(1 - fill.centerX),
        stops: [...fill.stops]
          .reverse()
          .map((stop) => ({ ...stop, offset: round(1 - stop.offset) })),
      };
    case 'pattern':
      return fill.pattern === 'stripes' || fill.pattern === 'grid'
        ? { ...fill, angle: flip(fill.angle) }
        : fill;
  }
}
export function mirrorEffects(effects: Effects): Effects {
  return {
    ...effects,
    ...(effects.mask
      ? { mask: { ...effects.mask, angle: flip(effects.mask.angle) } }
      : {}),
    ...(effects.shadow
      ? {
          shadow: {
            ...effects.shadow,
            offsetX: round(-effects.shadow.offsetX),
          },
        }
      : {}),
  };
}
function mirrorCommand(command: PathCommand): PathCommand {
  const x = round(1 - command.x);
  if (command.op === 'Q') return { ...command, x, cx: round(1 - command.cx) };
  if (command.op === 'C')
    return {
      ...command,
      x,
      c1x: round(1 - command.c1x),
      c2x: round(1 - command.c2x),
    };
  return { ...command, x };
}
/** Mirror image of an element across the vertical centre axis. */
export function mirror(element: Element): Element {
  const common = {
    x: round(clamp(1 - element.x - element.width, 0, 1)),
    rotation: round(-element.rotation),
    fill: mirrorFill(element.fill),
    ...(element.effects ? { effects: mirrorEffects(element.effects) } : {}),
  };
  switch (element.kind) {
    case 'arc':
      return {
        ...element,
        ...common,
        shape: {
          ...element.shape,
          start: flip(element.shape.start + element.shape.sweep),
        },
      };
    case 'polygon':
      return {
        ...element,
        ...common,
        shape: {
          points: element.shape.points.map((point) => ({
            x: round(1 - point.x),
            y: point.y,
          })),
        },
      };
    case 'blob': {
      const r = element.shape.radii;
      return {
        ...element,
        ...common,
        shape: {
          radii: [r[1]!, r[0]!, r[3]!, r[2]!, r[5]!, r[4]!, r[7]!, r[6]!],
        },
      };
    }
    case 'path':
      return {
        ...element,
        ...common,
        shape: {
          ...element.shape,
          commands: element.shape.commands.map(mirrorCommand),
        },
      };
    default:
      return { ...element, ...common };
  }
}

/** Regular polygon or, with `inner`, a star; points in the unit box. */
export function ngon(corners: number, inner?: number) {
  const count = inner === undefined ? corners : corners * 2;
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
    const radius = inner !== undefined && index % 2 === 1 ? 0.5 * inner : 0.5;
    return {
      x: clamp(0.5 + radius * Math.cos(angle), 0, 1),
      y: clamp(0.5 + radius * Math.sin(angle), 0, 1),
    };
  });
}

/** Kinds that look the same when mirrored in place. */
const selfSymmetric = new Set<ElementKind>([
  'rectangle',
  'circle',
  'ellipse',
  'ring',
]);
/** Smallest stroke: about 1.7 device pixels on a 280 px wide work. */
export const MIN_STROKE = 0.006;

type FrameOptions = { rotation?: number; opacity?: number; fill?: Fill };

export function createLayer(options: {
  random: Random;
  palette: Palette;
  flags: Flags;
  role: LayerName;
  density: number;
  budget: Budget;
  /** Mirror the layer across the vertical centre axis. */
  symmetric: boolean;
  /** In a symmetric layer, elements right of the axis are dropped, or
   * (`fold`) moved to the left so that small element sets survive. */
  overflow?: 'drop' | 'fold';
  /** Highest number of elements of this layer. */
  cap: number;
}) {
  const { random, palette, flags, role, density, budget, symmetric, cap } =
    options;
  /** Single elements or mirrored pairs, in drawing order. */
  const groups: Element[][] = [];
  let used = 0;
  // Grounds stay calm, accents take the strongest colours.
  const colors =
    role === 'background'
      ? palette.colors.slice(2)
      : role === 'accent'
        ? palette.colors.slice(0, 3)
        : palette.colors;
  const color = () => random.pick(colors);
  const otherThan = (base: string) => {
    const rest = palette.colors.filter((entry) => entry !== base);
    return rest.length ? random.pick(rest) : palette.background;
  };

  /** How many more elements of a kind fit into this layer. */
  const left = (key: keyof Budget = 'elements') =>
    Math.max(0, Math.min(cap - used, budget.elements, budget[key]));

  function add(input: Element): boolean {
    let element = rounded(input);
    let group = [element];
    if (symmetric) {
      const center = element.x + element.width / 2;
      if (
        Math.abs(center - 0.5) < 0.02 &&
        element.rotation === 0 &&
        selfSymmetric.has(element.kind)
      ) {
        element = { ...element, x: round(0.5 - element.width / 2) };
        group = [element];
      } else {
        if (center > 0.5) {
          if (options.overflow !== 'fold') return false;
          element = mirror(element);
        }
        group = [element, mirror(element)];
      }
    }
    const cost = loadCounts(group);
    if (
      used + group.length > cap ||
      budgetKeys.some((key) => cost[key] > budget[key])
    )
      return false;
    for (const key of budgetKeys) budget[key] -= cost[key];
    used += group.length;
    groups.push(group);
    return true;
  }

  /** Fill gene: gradients and patterns only where the work's flags allow. */
  function paint(base: string = color()): Fill {
    if (flags.gradients && random.next() < 0.4) {
      const list = [base, otherThan(base)];
      if (random.next() < 0.35) list.push(otherThan(base));
      return gradient(random, list);
    }
    if (flags.patterns && random.next() < 0.22)
      return pattern(random, base, otherThan(base));
    return solid(base);
  }

  function defaultOpacity() {
    if (role === 'accent') return 1;
    if (role === 'background') return random.between(0.6, 1);
    return random.next() < 0.8 ? 1 : random.between(0.7, 1);
  }
  /** Common genes of an element around a centre, kept inside the plane. */
  function frame(
    cx: number,
    cy: number,
    w: number,
    h: number,
    given: FrameOptions = {},
  ) {
    const width = clamp(w, 0.004, 1);
    const height = clamp(h, 0.004, 1);
    return {
      layer: role,
      x: clamp(cx - width / 2, 0, 1 - width),
      y: clamp(cy - height / 2, 0, 1 - height),
      width,
      height,
      rotation: given.rotation ?? 0,
      opacity: given.opacity ?? defaultOpacity(),
      fill: given.fill ?? paint(),
      motion: { kind: 'static' as const, durationSeconds: 30, amplitude: 0 },
    };
  }
  const stroke = (size: number) =>
    clamp(size * random.between(0.08, 0.3), MIN_STROKE + 0.002, 0.5);

  /** Closed, softly curved outline around the centre of the unit box. */
  function closedCurve(): PathCommand[] {
    const count = random.integer(5, 7);
    const at = (turn: number, radius: number) => ({
      x: clamp(0.5 + radius * Math.cos(turn * 2 * Math.PI), 0, 1),
      y: clamp(0.5 + radius * Math.sin(turn * 2 * Math.PI), 0, 1),
    });
    const anchors = Array.from({ length: count }, (_, index) =>
      at(index / count, random.between(0.28, 0.46)),
    );
    const commands: PathCommand[] = [{ op: 'M', ...anchors[0]! }];
    for (let index = 1; index <= count; index++) {
      const control = at((index - 0.5) / count, random.between(0.4, 0.5));
      const end = anchors[index % count]!;
      commands.push({ op: 'Q', cx: control.x, cy: control.y, ...end });
    }
    return commands;
  }

  /** One element of the given kind with shape genes drawn for it. */
  function shape(
    kind: ElementKind,
    cx: number,
    cy: number,
    w: number,
    h: number,
    given: FrameOptions = {},
  ): Element {
    switch (kind) {
      case 'rectangle':
      case 'ellipse':
        return { kind, ...frame(cx, cy, w, h, given) };
      case 'circle':
        return { kind, ...frame(cx, cy, w, w, given) };
      case 'line': {
        // The unrotated box must stay inside the plane, so the length is
        // limited by the distance of the centre to the nearer side.
        const center = clamp(cx, 0.05, 0.95);
        const length = Math.min(w, 2 * Math.min(center, 1 - center));
        return {
          kind,
          ...frame(center, cy, length, clamp(h, MIN_STROKE, 0.03), {
            ...given,
            opacity: given.opacity ?? 1,
            fill: given.fill ?? solid(color()),
          }),
        };
      }
      case 'arc': {
        const box = frame(cx, cy, w, w, given);
        return {
          kind,
          ...box,
          shape: {
            start: random.integer(0, 7) * 45,
            sweep: random.pick([90, 135, 180, 270] as const),
            strokeWidth: stroke(box.width),
          },
        };
      }
      case 'ring': {
        const box = frame(cx, cy, w, w, given);
        return { kind, ...box, shape: { strokeWidth: stroke(box.width) } };
      }
      case 'polygon':
        return {
          kind,
          ...frame(cx, cy, w, h, given),
          shape: {
            points:
              random.next() < 0.5
                ? ngon(random.integer(3, 8))
                : ngon(random.integer(4, 8), random.between(0.35, 0.6)),
          },
        };
      case 'blob': {
        // Opposite radii add up to the side, so the outline never scales.
        const [a, b, c, d] = [0, 1, 2, 3].map(() => random.between(0.3, 0.7));
        return {
          kind,
          ...frame(cx, cy, w, h, given),
          shape: {
            radii: [a!, 1 - a!, b!, 1 - b!, c!, d!, 1 - d!, 1 - c!],
          },
        };
      }
      case 'path':
        return {
          kind,
          ...frame(cx, cy, w, h, given),
          shape: { commands: closedCurve(), closed: true },
        };
    }
  }

  /** Open curve drawn as a visible stroke. */
  function openCurve(cx: number, cy: number, w: number, h: number): Element {
    const y = () => random.between(0.05, 0.95);
    return {
      kind: 'path',
      ...frame(cx, cy, w, h, {
        rotation: random.integer(-45, 45),
        opacity: 1,
        fill: solid(color()),
      }),
      shape: {
        commands: [
          { op: 'M', x: 0, y: y() },
          {
            op: 'C',
            c1x: random.between(0.2, 0.4),
            c1y: y(),
            c2x: random.between(0.6, 0.8),
            c2y: y(),
            x: 1,
            y: y(),
          },
        ],
        closed: false,
        strokeWidth: random.between(0.01, 0.03),
      },
    };
  }

  /** Element count between two bounds, by density and role of the layer. */
  const count = (min: number, max: number) =>
    Math.max(
      1,
      Math.round(
        (min + (max - min) * density) *
          (role === 'background' ? 0.5 : role === 'accent' ? 0.4 : 1),
      ),
    );

  return {
    random,
    palette,
    flags,
    role,
    density,
    symmetric,
    groups,
    add,
    left,
    color,
    otherThan,
    paint,
    frame,
    shape,
    openCurve,
    count,
  };
}
export type Layer = ReturnType<typeof createLayer>;
