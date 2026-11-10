import {
  dnaV3Schema,
  layerNames,
  loadLimitsV3,
  type DnaV3,
} from '../../schema/artwork-v3';
import { familyKeys, type Profile } from '../../schema/profile';
import { createRandom, type Random } from '../random';
import {
  ANCHOR_MIN_CONTRAST,
  ANCHOR_MIN_SIZE,
  anchorKinds,
  placeAnchor,
  featuresOf,
  findAnchor,
  isAnchor,
  strongestColor,
} from './checks';
import {
  curveSet,
  families,
  lineBundle,
  polygonSet,
  type Family,
} from './families';
import { gradient, pattern, solid, type Fill } from './fills';
import {
  createBudget,
  createLayer,
  featureNames,
  mirror,
  mirrorEffects,
  mirrorFill,
  round,
  type Effects,
  type Element,
  type Flags,
  type LayerName,
} from './kit';
import { createPalette, type PaletteStrategy } from './palette';

// Composition of one independent origin work: feature decisions, palette,
// layer model, effects, motion and the hard checks. Every decision group
// draws from a random stream of its own, so a change to one family does not
// shift the others.

/** Chance per work and feature group; part of generator version 0.3.0. */
export const frequencyChance: Record<
  Profile['features'][keyof Profile['features']],
  number
> = { off: 0, rare: 0.15, normal: 0.4, often: 0.7, always: 1 };

export function drawFlags(seed: string, profile: Profile): Flags {
  const draw = (name: string, level: keyof typeof frequencyChance) =>
    createRandom(`${seed}:feature:${name}`).next() < frequencyChance[level];
  return {
    ...(Object.fromEntries(
      featureNames.map((name) => [name, draw(name, profile.features[name])]),
    ) as Record<(typeof featureNames)[number], boolean>),
    symmetry: draw('symmetry', profile.composition.symmetry),
  };
}

/** How well a family suits a layer; higher is drawn more often. */
const roleWeights: Record<LayerName, Record<Family, number>> = {
  background: {
    'color-field': 3,
    organic: 3,
    mosaic: 1,
    generative: 1,
    geometric: 1,
    chaotic: 1,
  },
  structure: {
    geometric: 3,
    mosaic: 3,
    generative: 3,
    organic: 2,
    chaotic: 2,
    'color-field': 2,
  },
  accent: {
    geometric: 3,
    generative: 2,
    chaotic: 2,
    organic: 1,
    mosaic: 1,
    'color-field': 1,
  },
};
/** Element limits per layer. The shared budget keeps the sum below 120;
 * supplements are built first and so never lose their place. */
const layerCaps: Record<LayerName, number> = {
  background: 14,
  structure: 64,
  accent: 20,
};
const SUPPLEMENT_CAP = 40;

function planLayers(random: Random, profile: Profile) {
  const draw = random.next();
  const count = Math.min(
    profile.composition.maxLayers,
    draw < 0.25 ? 1 : draw < 0.7 ? 2 : 3,
  );
  const names: LayerName[] =
    count === 1
      ? ['structure']
      : count === 2
        ? random.next() < 0.5
          ? ['background', 'structure']
          : ['structure', 'accent']
        : [...layerNames];
  const active = familyKeys.filter((key) => profile.families[key]);
  const taken = new Set<Family>();
  return names.map((name) => {
    // Prefer a family no other layer of the work uses.
    const fresh = active.filter((key) => !taken.has(key));
    const pool = (fresh.length ? fresh : active).flatMap((key) =>
      Array.from({ length: roleWeights[name][key] }, () => key),
    );
    const family = random.pick(pool);
    taken.add(family);
    return { name, family };
  });
}

type Group = Element[];
const area = (group: Group) => group[0]!.width * group[0]!.height;
const shortSide = (group: Group) => Math.min(group[0]!.width, group[0]!.height);
function setFill(group: Group, fill: Fill) {
  group[0]!.fill = fill;
  if (group[1]) group[1].fill = mirrorFill(fill);
}
function addEffects(group: Group, effects: Effects) {
  group[0]!.effects = { ...group[0]!.effects, ...effects };
  if (group[1])
    group[1].effects = { ...group[1].effects, ...mirrorEffects(effects) };
}
/** Draws up to `count` groups without repetition while `fits` allows. */
function choose(
  random: Random,
  pool: readonly Group[],
  count: number,
  limit: number,
) {
  const rest = [...pool];
  const chosen: Group[] = [];
  let load = 0;
  while (chosen.length < count && rest.length) {
    const [group] = rest.splice(random.integer(0, rest.length - 1), 1);
    if (load + group!.length > limit) continue;
    load += group!.length;
    chosen.push(group!);
  }
  return chosen;
}

export type Recipe = {
  paletteStrategy: PaletteStrategy;
  features: Flags;
  /** Found as drawn, a form brought to the front, a form moved, or a new one. */
  anchor: 'natural' | 'promoted' | 'moved' | 'added';
};

/**
 * One attempt. Returns `null` when a hard check fails; the caller then
 * retries with the next deterministic seed.
 */
export function compose(
  seed: string,
  profile: Profile,
  flags: Flags,
): { dna: DnaV3; recipe: Recipe } | null {
  const paletteRandom = createRandom(`${seed}:palette`);
  const palette = createPalette(
    paletteRandom,
    paletteRandom.pick(profile.palette.strategies),
    profile.palette.contrast,
  );
  const layerRandom = createRandom(`${seed}:layers`);
  const plan = planLayers(layerRandom, profile);
  const density =
    profile.composition.density === 'sparse'
      ? 0.2
      : profile.composition.density === 'dense'
        ? 0.85
        : layerRandom.between(0.15, 0.95);
  const symmetric = (name: LayerName) =>
    flags.symmetry && (name === 'structure' || layerRandom.next() < 0.5);
  const layout = plan.map((entry) => ({
    ...entry,
    symmetric: symmetric(entry.name),
  }));
  const budget = createBudget();
  const top = layout.at(-1)!;

  // Supplements guarantee the drawn feature groups; they are built first so
  // that the families cannot use up their load, and drawn last.
  const supplements = createLayer({
    random: createRandom(`${seed}:supplements`),
    palette,
    flags,
    role: top.name,
    density,
    budget,
    symmetric: top.symmetric,
    overflow: 'fold',
    cap: SUPPLEMENT_CAP,
  });
  if (flags.lines) lineBundle(supplements);
  if (flags.curves) curveSet(supplements);
  if (flags.generativeShapes) polygonSet(supplements);

  let groups: Group[] = [];
  for (const entry of layout) {
    const layer = createLayer({
      random: createRandom(`${seed}:layer:${entry.name}`),
      palette,
      flags,
      role: entry.name,
      density,
      budget,
      symmetric: entry.symmetric,
      cap: layerCaps[entry.name],
    });
    families[entry.family](layer);
    groups.push(...layer.groups);
  }
  groups.push(...supplements.groups);
  if (groups.length === 0) return null;

  // Fill guarantees: a drawn gradient or pattern must really occur.
  const fillRandom = createRandom(`${seed}:fills`);
  const bySize = [...groups]
    .filter((group) => group[0]!.kind !== 'line')
    .sort((a, b) => area(b) - area(a));
  const hasFill = (kinds: readonly Fill['kind'][]) =>
    groups.some((group) => kinds.includes(group[0]!.fill.kind));
  const two = () => {
    const base = fillRandom.pick(palette.colors);
    const rest = palette.colors.filter((color) => color !== base);
    return [base, rest.length ? fillRandom.pick(rest) : palette.background];
  };
  if (flags.gradients && !hasFill(['linear', 'radial', 'conic'])) {
    const target = bySize.find((group) => group[0]!.fill.kind === 'solid');
    if (!target) return null;
    setFill(target, gradient(fillRandom, two()));
  }
  if (flags.patterns && !hasFill(['pattern'])) {
    const wide = bySize.filter((group) => shortSide(group) >= 0.08);
    const plain = wide.filter((group) => group[0]!.fill.kind === 'solid');
    // Prefer the second largest plain area, so the pattern does not take
    // over. Without one a gradient gives way, as long as another remains.
    const gradients = wide.filter((group) => group[0]!.fill.kind !== 'solid');
    const target =
      plain[1] ?? plain[0] ?? (gradients.length > 1 ? gradients[1] : undefined);
    if (!target) return null;
    const [foreground, background] = two();
    setFill(target, pattern(fillRandom, foreground!, background!));
  }

  // Visibility anchor, settled before effects and motion so that both
  // leave it alone. Elements stay grouped by layer; within the top layer a
  // group may move to the front.
  const assemble = (list: readonly Group[]): DnaV3 => ({
    background: palette.background,
    layers: Object.fromEntries(
      layout.map((entry) => [entry.name, { family: entry.family }]),
    ),
    elements: list.flat(),
  });
  let anchor: Recipe['anchor'] = 'natural';
  let anchorGroup: Group | undefined;
  const natural = assemble(groups);
  const found = findAnchor(natural);
  if (found !== -1) {
    const element = natural.elements[found]!;
    anchorGroup = groups.find((group) => group.includes(element));
  } else {
    const fillClass = (group: Group) =>
      group[0]!.fill.kind === 'pattern'
        ? 'pattern'
        : group[0]!.fill.kind === 'solid'
          ? 'solid'
          : 'gradient';
    const candidates = groups
      .filter(
        (group) =>
          group[0]!.layer === top.name &&
          anchorKinds.has(group[0]!.kind) &&
          shortSide(group) >= ANCHOR_MIN_SIZE,
      )
      // Smallest first: it hides the least when it moves to the front.
      .sort((a, b) => area(a) - area(b))
      .slice(0, 16);
    for (const group of candidates) {
      const saved = group.map(({ rotation, opacity, fill }) => ({
        rotation,
        opacity,
        fill,
      }));
      for (const element of group) {
        element.rotation = 0;
        element.opacity = Math.max(element.opacity, 0.8);
      }
      const reordered = [...groups.filter((other) => other !== group), group];
      const draft = assemble(reordered);
      const first = draft.elements.indexOf(group[0]!);
      const visible = () =>
        group.some((_, offset) => isAnchor(draft, first + offset));
      if (!visible()) {
        // Recolour, unless that would remove the only gradient or pattern.
        const kind = fillClass(group);
        const { color, score } = strongestColor(draft, first, palette);
        if (
          score >= ANCHOR_MIN_CONTRAST &&
          (kind === 'solid' ||
            groups.some(
              (other) => other !== group && fillClass(other) === kind,
            ))
        )
          setFill(group, solid(color));
      }
      if (visible()) {
        groups = reordered;
        anchorGroup = group;
        anchor = 'promoted';
        break;
      }
      group.forEach((element, index) => Object.assign(element, saved[index]));
    }
    const anchorRandom = createRandom(`${seed}:anchor`);
    if (!anchorGroup) {
      // Move a form of the top layer to the place where it reads best. It
      // keeps its outline and may grow up to the minimum size.
      const movable = groups
        .filter(
          (group) =>
            group[0]!.layer === top.name &&
            anchorKinds.has(group[0]!.kind) &&
            shortSide(group) >= 0.085 &&
            (group[0]!.fill.kind === 'solid' ||
              groups.some(
                (other) =>
                  other !== group && fillClass(other) === fillClass(group),
              )),
        )
        .sort((a, b) => area(a) - area(b))
        .slice(0, 8);
      for (const group of movable) {
        const element = group[0]!;
        const scale = Math.max(1, 0.13 / shortSide(group));
        const rest = groups.filter((other) => other !== group);
        const place = placeAnchor(
          anchorRandom,
          assemble(rest),
          palette,
          [
            [
              round(Math.min(1, element.width * scale)),
              round(Math.min(1, element.height * scale)),
            ],
          ],
          top.symmetric,
        );
        if (!place) continue;
        Object.assign(element, place.box, {
          rotation: 0,
          opacity: Math.max(element.opacity, 0.8),
          fill: solid(place.color),
        });
        // On the axis the form stands alone; beside it, with its mirror image.
        anchorGroup = place.paired ? [element, mirror(element)] : [element];
        groups = [...rest, anchorGroup];
        anchor = 'moved';
        break;
      }
    }
    if (!anchorGroup) {
      const kind = anchorRandom.pick([
        'rectangle',
        'circle',
        'ellipse',
      ] as const);
      const stretch = kind === 'ellipse' ? anchorRandom.between(1.2, 1.6) : 1;
      const place = placeAnchor(
        anchorRandom,
        natural,
        palette,
        [0.2, 0.16, 0.13].map((size) => [round(size * stretch), size] as const),
        top.symmetric,
      );
      if (!place) return null;
      const added: Element = {
        kind,
        layer: top.name,
        ...place.box,
        rotation: 0,
        opacity: 1,
        fill: solid(place.color),
        motion: { kind: 'static', durationSeconds: 30, amplitude: 0 },
      };
      anchorGroup = place.paired ? [added, mirror(added)] : [added];
      groups.push(anchorGroup);
      anchor = 'added';
    }
  }
  const free = groups.filter((group) => group !== anchorGroup);

  // Effects within the load limits of renderer 2.
  const effectRandom = createRandom(`${seed}:effects`);
  const solidEnough = free.filter(
    (group) => group[0]!.kind !== 'line' && shortSide(group) >= 0.06,
  );
  if (flags.blendModes) {
    // The first group has nothing below it to blend with.
    const chosen = choose(
      effectRandom,
      solidEnough.filter((group) => group !== groups[0]),
      effectRandom.integer(1, 3),
      loadLimitsV3.blends,
    );
    if (!chosen.length) return null;
    for (const group of chosen)
      addEffects(group, {
        blend: effectRandom.pick([
          'multiply',
          'screen',
          'overlay',
          'soft-light',
          'difference',
        ] as const),
      });
  }
  if (flags.masks) {
    const chosen = choose(
      effectRandom,
      solidEnough.filter((group) => shortSide(group) >= 0.12),
      effectRandom.integer(1, 2),
      loadLimitsV3.masks,
    );
    if (!chosen.length) return null;
    for (const group of chosen) {
      const kind = effectRandom.pick(['linear', 'radial'] as const);
      const from = round(effectRandom.between(0.2, 0.5));
      addEffects(group, {
        mask: {
          kind,
          angle: kind === 'linear' ? effectRandom.integer(0, 359) : 0,
          from,
          to: round(Math.min(1, from + effectRandom.between(0.3, 0.5))),
        },
      });
    }
  }
  if (flags.blurShadow) {
    // Blur and shadow spread; behind a natural anchor they could cover it.
    const front =
      anchor === 'natural' && anchorGroup
        ? groups.slice(groups.indexOf(anchorGroup) + 1)
        : [];
    const chosen = choose(
      effectRandom,
      solidEnough.filter((group) => !front.includes(group)),
      effectRandom.integer(1, 2),
      loadLimitsV3.blurs,
    );
    if (!chosen.length) return null;
    for (const group of chosen)
      addEffects(
        group,
        effectRandom.next() < 0.5
          ? { blur: round(effectRandom.between(0.004, 0.02)) }
          : {
              shadow: {
                offsetX: round(effectRandom.between(-0.03, 0.03)),
                offsetY: round(effectRandom.between(0.005, 0.04)),
                blur: round(effectRandom.between(0.01, 0.05)),
                color: '#000000',
                opacity: round(effectRandom.between(0.25, 0.5)),
              },
            },
      );
  }

  // Motion: a share of the smaller elements, by intensity.
  if (flags.animation) {
    const motionRandom = createRandom(`${seed}:motion`);
    const intensity = profile.motion.intensity;
    const share =
      intensity === 'subtle'
        ? 0.15
        : intensity === 'strong'
          ? 0.5
          : motionRandom.between(0.15, 0.5);
    const [low, high] =
      intensity === 'subtle'
        ? [0.01, 0.025]
        : intensity === 'strong'
          ? [0.04, 0.1]
          : [0.01, 0.08];
    if (!free.length) return null;
    const moving = free.filter(() => motionRandom.next() < share);
    if (!moving.length) moving.push(motionRandom.pick(free));
    for (const group of moving) {
      const circular = ['circle', 'ring'].includes(group[0]!.kind);
      const large = Math.max(group[0]!.width, group[0]!.height) >= 0.7;
      const motion = {
        // Turning a full circle or ring shows nothing; large areas only
        // breathe.
        kind: large
          ? ('pulse' as const)
          : motionRandom.pick(
              circular
                ? (['pulse', 'float'] as const)
                : (['rotate', 'pulse', 'float'] as const),
            ),
        durationSeconds: motionRandom.integer(12, 90),
        amplitude: round(motionRandom.between(low!, high!)),
      };
      for (const element of group) element.motion = { ...motion };
    }
  }

  const parsed = dnaV3Schema.safeParse(assemble(groups));
  if (!parsed.success || findAnchor(parsed.data) === -1) return null;
  // The census must match the decisions exactly: nothing drawn is missing
  // and nothing excluded slipped in.
  const census = featuresOf(parsed.data);
  if (featureNames.some((name) => census[name] !== flags[name])) return null;
  return {
    dna: parsed.data,
    recipe: { paletteStrategy: palette.strategy, features: flags, anchor },
  };
}
