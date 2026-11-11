import {
  dnaV3Schema,
  layerNames,
  loadLimitsV3,
  type DnaV3,
  type InheritanceDecisionV3,
  type RecipeV3,
} from '../../schema/artwork-v3';
import type { SettingsSnapshot } from '../../schema/preview-v3';
import { familyKeys } from '../../schema/profile';
import { createRandom, type Random } from '../random';
import {
  ANCHOR_MIN_CONTRAST,
  ANCHOR_MIN_SIZE,
  anchorKinds,
  featuresOf,
  findAnchor,
  isAnchor,
  placeAnchor,
  strongestColor,
} from './checks';
import {
  area,
  assembler,
  decorate,
  guaranteeFills,
  layerCaps,
  planLayers,
  setFill,
  settleAnchor,
  shortSide,
  type Group,
} from './compose';
import {
  curveSet,
  families,
  lineBundle,
  polygonSet,
  type Family,
} from './families';
import { solid } from './fills';
import {
  clamp,
  createBudget,
  createLayer,
  featureNames,
  MIN_STROKE,
  mirror,
  round,
  spend,
  type Element,
  type Flags,
  type LayerName,
} from './kit';
import { createPalette, oklchToHex, type Palette } from './palette';
import {
  colorSource,
  fillTraits,
  mapColor,
  mapFill,
  readElementTrait,
  sourceTrait,
  type ParentView,
  type Source,
} from './parents';

// Evolution of generator 0.3.0 (EP-01, P4): a child of two parents.
// Inheritance works per layer (take over, mix, build anew) and per feature
// group (palette, geometry, fill, effects, motion). Contributions are proven
// on real design traits of visible forms, never on evidence blocks.

type Heritage = RecipeV3['palette'];
type ParentIndex = 0 | 1;
const heritageOf = (parent: ParentIndex): Heritage =>
  parent === 0 ? 'parentA' : 'parentB';

/** Chances per layer and for the palette; part of generator version 0.3.0. */
export const heritageWeights = {
  traceable: { parent: 0.35, mixed: 0.1, fresh: 0.2 },
  free: { parent: 0.2, mixed: 0.1, fresh: 0.5 },
} as const;
/** Chance of a work without any takeover in the mode `free`. */
export const FREE_BREAK_CHANCE = 0.35;
/** Share of mutated forms and largest deviation per mutation strength. */
export const mutationLevels = {
  calm: { share: 0.1, amplitude: 0.03 },
  medium: { share: 0.25, amplitude: 0.06 },
  high: { share: 0.45, amplitude: 0.1 },
  wild: { share: 0.7, amplitude: 0.16 },
} as const;
/** Chance of a mutation jump per work, if the experiment is switched on. */
export const MUTATION_JUMP_CHANCE = 0.1;
/** Visible contributions recorded per parent, and traits per form. */
const EVIDENCE_FORMS = 3;
const EVIDENCE_TRAITS = 4;
const CONSTRAINED_LIMIT = 40;

/** Where the traits of a child element come from. */
type Origin = {
  geometry?: { parent: ParentIndex; source: Source };
  fill?: { parent: ParentIndex; source: Source };
};
type Conversion = {
  element: Element;
  trait: 'kind' | 'fill.kind';
  parent: ParentIndex;
  source: { path: string; value: string };
  rule: string;
};

/**
 * Neutral mid-tones, a further reserve for a contribution that must read
 * above light and dark at once (e.g. a gradient from ground to pale). Used
 * only where neither a palette colour nor an extreme tone reads.
 */
const MID_TONES = [oklchToHex(0.5, 0, 0), oklchToHex(0.66, 0, 0)];
const still = { kind: 'static', durationSeconds: 30, amplitude: 0 } as const;
type PlainKind = 'rectangle' | 'circle' | 'ellipse' | 'line';
/** The element as a plain form of another kind, without shape genes. */
function reshape(
  element: Element,
  kind: PlainKind,
  box: Partial<Pick<Element, 'y' | 'height'>> = {},
): Element {
  const { layer, x, y, width, height, rotation, opacity, fill, motion } =
    element;
  return {
    kind,
    layer,
    x,
    y,
    width,
    height,
    rotation,
    opacity,
    fill,
    ...(element.effects ? { effects: element.effects } : {}),
    motion,
    ...box,
  };
}
/** A band of the given thickness around the horizontal centre line. */
function band(element: Element, thickness: number) {
  const height = round(clamp(thickness, MIN_STROKE, 1));
  return {
    height,
    y: round(clamp(element.y + element.height / 2 - height / 2, 0, 1 - height)),
  };
}

/**
 * Converts what the frozen settings forbid (`off`) into something allowed.
 * Effects and motion have no allowed counterpart and are removed.
 */
function constrain(
  input: Element,
  features: SettingsSnapshot['features'],
): {
  element: Element;
  changes: { trait: Conversion['trait']; rule: string }[];
} {
  let element = input;
  const changes: { trait: Conversion['trait']; rule: string }[] = [];
  const { fill } = element;
  if (
    features.gradients === 'off' &&
    (fill.kind === 'linear' || fill.kind === 'radial' || fill.kind === 'conic')
  ) {
    element = { ...element, fill: solid(fill.stops[0]!.color) };
    changes.push({ trait: 'fill.kind', rule: 'features.gradients=off' });
  } else if (features.patterns === 'off' && fill.kind === 'pattern') {
    element = { ...element, fill: solid(fill.foreground) };
    changes.push({ trait: 'fill.kind', rule: 'features.patterns=off' });
  }
  if (element.effects) {
    const effects = { ...element.effects };
    if (features.masks === 'off') delete effects.mask;
    if (features.blendModes === 'off') delete effects.blend;
    if (features.blurShadow === 'off') {
      delete effects.blur;
      delete effects.shadow;
    }
    const rest: Record<string, unknown> = { ...element };
    delete rest.effects;
    if (Object.keys(effects).length) rest.effects = effects;
    element = rest as Element;
  }
  if (features.animation === 'off' && element.motion.kind !== 'static')
    element = { ...element, motion: { ...still } };
  const linesOff = features.lines === 'off';
  const stroked =
    element.kind === 'arc' ||
    element.kind === 'ring' ||
    (element.kind === 'path' && element.shape.strokeWidth !== undefined);
  if (features.curves === 'off' && stroked) {
    // An arc or curve stroke becomes a line, a ring a full circle.
    if (element.kind === 'ring') element = reshape(element, 'circle');
    else if (linesOff) element = reshape(element, 'ellipse');
    else {
      const strokeWidth =
        element.kind === 'arc' || element.kind === 'path'
          ? (element.shape.strokeWidth ?? 0.012)
          : 0.012;
      element = reshape(
        element,
        'line',
        band(element, Math.min(strokeWidth, 0.03)),
      );
    }
    changes.push({ trait: 'kind', rule: 'features.curves=off' });
  } else if (
    features.generativeShapes === 'off' &&
    (element.kind === 'polygon' || element.kind === 'path')
  ) {
    element = reshape(
      element,
      element.kind === 'polygon' ? 'rectangle' : 'ellipse',
    );
    changes.push({ trait: 'kind', rule: 'features.generativeShapes=off' });
  }
  if (linesOff && element.kind === 'line') {
    // A hairline becomes a bar that reads as an area.
    element = reshape(
      element,
      'rectangle',
      band(element, Math.max(element.height, 0.035)),
    );
    changes.push({ trait: 'kind', rule: 'features.lines=off' });
  }
  return { element, changes };
}

export type ChildResult = {
  dna: DnaV3;
  recipe: Omit<RecipeV3, 'retry'>;
  /** Decisions without parent IDs; the caller adds them. */
  decisions: (Omit<InheritanceDecisionV3, 'parentId'> & {
    parent: ParentIndex;
  })[];
};

/**
 * One attempt at a child of two parents. Returns `null` when a hard check
 * fails; the caller then retries with the next deterministic seed.
 */
export function composeChild(
  seed: string,
  settings: SettingsSnapshot,
  flags: Flags,
  parents: readonly [ParentView, ParentView],
): ChildResult | null {
  const mode = settings.inheritanceMode;
  const weights = heritageWeights[mode];
  const mutation = mutationLevels[settings.variation.mutationStrength];
  const heritage = createRandom(`${seed}:heritage`);
  // All draws happen in a fixed order, whether or not they are used.
  const breakDraw = heritage.next();
  const jumpDraw = heritage.next();
  const fullyNew = mode === 'free' && breakDraw < FREE_BREAK_CHANCE;
  const jump =
    !fullyNew &&
    settings.experimental.mutationJumps &&
    jumpDraw < MUTATION_JUMP_CHANCE;
  /** Draws a heritage among the available ones; unavailable weight is lost. */
  const draw = (random: Random, available: Record<Heritage, boolean>) => {
    const options: [Heritage, number][] = [
      ['parentA', weights.parent],
      ['parentB', weights.parent],
      ['mixed', weights.mixed],
      ['new', weights.fresh],
    ];
    const open = options.filter(([name]) => available[name]);
    const total = open.reduce((sum, [, weight]) => sum + weight, 0);
    let rest = random.next() * total;
    for (const [name, weight] of open) {
      rest -= weight;
      if (rest < 0) return name;
    }
    return 'new' as const;
  };

  // Palette: of one parent, of both, or new.
  const paletteRandom = createRandom(`${seed}:palette`);
  const fresh = createPalette(
    paletteRandom,
    paletteRandom.pick(settings.palette.strategies),
    settings.palette.contrast,
  );
  const paletteDraw = draw(heritage, {
    parentA: true,
    parentB: true,
    mixed: true,
    new: true,
  });
  const paletteHeritage: Heritage = fullyNew || jump ? 'new' : paletteDraw;
  let palette: Palette;
  if (paletteHeritage === 'new') palette = fresh;
  else if (paletteHeritage === 'mixed') {
    const [first, second] =
      paletteRandom.next() < 0.5 ? parents : [parents[1], parents[0]];
    const { background } = first.palette;
    palette = {
      strategy: 'free',
      background,
      extremes: first.palette.extremes,
      colors: [0, 1, 2]
        .flatMap((rank) => [
          first.palette.colors[rank]!,
          second.palette.colors[rank]!,
        ])
        .slice(0, 5),
    };
  } else {
    const own = parents[paletteHeritage === 'parentA' ? 0 : 1].palette;
    palette = { ...own, colors: [...own.colors] };
    // Palette mutation: one colour gives way to a new one.
    if (paletteRandom.next() < mutation.share) {
      const rank = paletteRandom.integer(0, palette.colors.length - 1);
      palette.colors[rank] = fresh.colors[rank]!;
    }
  }

  // Layers: the plan of an origin work, then the heritage of each layer.
  const layerRandom = createRandom(`${seed}:layers`);
  const plan = planLayers(layerRandom, settings);
  const density =
    settings.composition.density === 'sparse'
      ? 0.2
      : settings.composition.density === 'dense'
        ? 0.85
        : layerRandom.between(0.15, 0.95);
  const usable = (parent: ParentIndex, name: LayerName) => {
    const layer = parents[parent].layers[name];
    return !!layer && settings.families[layer.family];
  };
  type Entry = {
    name: LayerName;
    family: Family;
    heritage: Heritage;
    /** Parent of the forms; for `mixed` the other one gives the fills. */
    forms?: ParentIndex;
    symmetric: boolean;
  };
  const layout: Entry[] = plan.map((entry) => {
    const mirrored =
      flags.symmetry &&
      (entry.name === 'structure' || layerRandom.next() < 0.5);
    const available = {
      parentA: usable(0, entry.name),
      parentB: usable(1, entry.name),
      mixed: usable(0, entry.name) && usable(1, entry.name),
      new: true,
    };
    const drawn = draw(heritage, available);
    const side = heritage.next() < 0.5 ? 0 : 1;
    const chosen: Heritage = fullyNew ? 'new' : drawn;
    if (chosen === 'new')
      return { ...entry, heritage: 'new', symmetric: mirrored };
    const forms: ParentIndex =
      chosen === 'mixed' ? side : chosen === 'parentA' ? 0 : 1;
    return {
      name: entry.name,
      family: parents[forms].layers[entry.name]!.family,
      heritage: chosen,
      forms,
      symmetric: false,
    };
  });
  // Traceable works keep at least one layer of a parent where one exists.
  if (mode === 'traceable' && layout.every((entry) => entry.heritage === 'new'))
    for (const entry of layout) {
      const candidates = ([0, 1] as const).filter((parent) =>
        usable(parent, entry.name),
      );
      if (!candidates.length) continue;
      const forms = heritage.pick(candidates);
      Object.assign(entry, {
        family: parents[forms].layers[entry.name]!.family,
        heritage: heritageOf(forms),
        forms,
        symmetric: false,
      });
      break;
    }
  // Mutation jump: one inherited layer is rebuilt in a family neither
  // parent shows there, together with the new palette.
  if (jump) {
    const target = layout.find((entry) => entry.heritage !== 'new');
    if (target) {
      const shown = new Set(
        parents.map((parent) => parent.layers[target.name]?.family),
      );
      const others = familyKeys.filter(
        (key) => settings.families[key] && !shown.has(key),
      );
      const planned = plan.find((entry) => entry.name === target.name)!;
      Object.assign(target, {
        family: others.length ? heritage.pick(others) : planned.family,
        heritage: 'new',
        forms: undefined,
        symmetric: false,
      });
    }
  }
  const top = layout.at(-1)!;

  // Inherited layers come first: they are charged to the load budget before
  // anything new is built.
  const budget = createBudget();
  // Two more places stay free for visible contributions of the parents.
  budget.elements -= 2;
  const origins = new Map<Element, Origin>();
  const conversions: Conversion[] = [];
  const effectLoad = { blends: 0, masks: 0, blurs: 0 };
  const inherited = new Map<LayerName, Group[]>();
  for (const entry of layout) {
    if (entry.heritage === 'new' || entry.forms === undefined) continue;
    const parent = entry.forms;
    const view = parents[parent];
    const other = (1 - parent) as ParentIndex;
    const random = createRandom(`${seed}:inherit:${entry.name}`);
    const context = createLayer({
      random,
      palette,
      flags,
      role: entry.name,
      density,
      budget,
      symmetric: false,
      cap: layerCaps[entry.name],
    });
    const sources = view.sources.filter(
      (source) => source.element.layer === entry.name,
    );
    const fillSources =
      entry.heritage === 'mixed'
        ? parents[other].sources.filter(
            (source) =>
              source.element.layer === entry.name &&
              source.element.kind !== 'line',
          )
        : [];
    // Mirrored pairs stay pairs: neighbours that are mirror images.
    const paired: Source[][] = [];
    for (let index = 0; index < sources.length; index++) {
      const next = sources[index + 1];
      if (
        next &&
        !view.legacy &&
        JSON.stringify(mirror(sources[index]!.element)) ===
          JSON.stringify(next.element)
      ) {
        paired.push([sources[index]!, next]);
        index++;
      } else paired.push([sources[index]!]);
    }
    const total = sources.length;
    const keep = Math.min(1, layerCaps[entry.name] / Math.max(1, total));
    const recolour = paletteHeritage !== heritageOf(parent);
    const groups: Group[] = [];
    for (const pair of paired) {
      const source = pair[0]!;
      // Thin out layers that grew beyond their limit.
      if (random.next() >= keep) continue;
      let element = structuredClone(source.element);
      const origin: Origin = { geometry: { parent, source } };
      let fillSource = source;
      let fillParent = parent;
      if (fillSources.length && element.kind !== 'line') {
        fillSource = random.pick(fillSources);
        fillParent = other;
        element.fill = structuredClone(fillSource.element.fill);
        origin.fill = { parent: other, source: fillSource };
      }
      if (fillParent !== parent || recolour) {
        const from = parents[fillParent].palette;
        if (paletteHeritage !== heritageOf(fillParent))
          element.fill = mapFill(element.fill, (color) =>
            mapColor(color, from, palette),
          );
      }
      const constrained = constrain(element, settings.features);
      element = constrained.element;
      // Mutation: position, size, turn or a new fill.
      if (random.next() < mutation.share) {
        const kind = random.next();
        const swing = () => random.between(-1, 1) * mutation.amplitude;
        if (kind < 0.4) {
          element.x = clamp(element.x + swing(), 0, 1 - element.width);
          element.y = clamp(element.y + swing(), 0, 1 - element.height);
        } else if (kind < 0.7) {
          const factor = 1 + 2 * swing();
          const width = clamp(element.width * factor, 0.004, 1);
          const height =
            element.kind === 'line'
              ? element.height
              : clamp(element.height * factor, 0.004, 1);
          element.x = clamp(
            element.x + (element.width - width) / 2,
            0,
            1 - width,
          );
          element.y = clamp(
            element.y + (element.height - height) / 2,
            0,
            1 - height,
          );
          element.width = width;
          element.height = height;
        } else if (kind < 0.85) {
          if (element.kind !== 'circle' && element.kind !== 'ring')
            element.rotation = clamp(
              Math.round(element.rotation + swing() * 180),
              -360,
              360,
            );
        } else if (element.kind !== 'line') {
          element.fill = context.paint();
          delete origin.fill;
        }
        for (const key of ['x', 'y', 'width', 'height'] as const)
          element[key] = round(element[key]);
      }
      // Load limits of the effects also hold when two parents are combined.
      if (element.effects) {
        const effects = { ...element.effects };
        const count = pair.length;
        if (effects.blend && effectLoad.blends + count > loadLimitsV3.blends)
          delete effects.blend;
        if (effects.mask && effectLoad.masks + count > loadLimitsV3.masks)
          delete effects.mask;
        if (
          (effects.blur !== undefined || effects.shadow) &&
          effectLoad.blurs + count > loadLimitsV3.blurs
        ) {
          delete effects.blur;
          delete effects.shadow;
        }
        if (effects.blend) effectLoad.blends += count;
        if (effects.mask) effectLoad.masks += count;
        if (effects.blur !== undefined || effects.shadow)
          effectLoad.blurs += count;
        if (Object.keys(effects).length) element.effects = effects;
        else delete element.effects;
      }
      const group: Group =
        pair.length === 2 ? [element, mirror(element)] : [element];
      if (!spend(budget, group)) continue;
      origins.set(element, origin);
      if (group[1])
        origins.set(group[1], { geometry: { parent, source: pair[1]! } });
      for (const change of constrained.changes) {
        const from = change.trait === 'kind' ? source : fillSource;
        const stored = sourceTrait(from, change.trait);
        if (stored && typeof stored.value === 'string')
          conversions.push({
            element,
            trait: change.trait,
            parent: change.trait === 'kind' ? parent : fillParent,
            source: { path: stored.path, value: stored.value },
            rule: change.rule,
          });
      }
      groups.push(group);
    }
    inherited.set(entry.name, groups);
  }
  const census = (list: readonly Group[]) =>
    featuresOf({ elements: list.flat() } as unknown as DnaV3);
  const present = census([...inherited.values()].flat());

  // Supplements guarantee the drawn feature groups the parents did not
  // already bring along; as in an origin work they are built first and
  // drawn last.
  const supplements = createLayer({
    random: createRandom(`${seed}:supplements`),
    palette,
    flags,
    role: top.name,
    density,
    budget,
    symmetric: top.symmetric,
    overflow: 'fold',
    cap: 40,
  });
  if (flags.lines && !present.lines) lineBundle(supplements);
  if (flags.curves && !present.curves) curveSet(supplements);
  if (flags.generativeShapes && !present.generativeShapes)
    polygonSet(supplements);

  let groups: Group[] = [];
  for (const entry of layout) {
    const taken = inherited.get(entry.name);
    if (taken) {
      groups.push(...taken);
      continue;
    }
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
  if (!guaranteeFills(createRandom(`${seed}:fills`), groups, palette, flags))
    return null;

  // Visible contributions: in the mode `traceable` every parent needs a
  // form that passes the visibility rules and carries one of its traits.
  const assemble = assembler(palette.background, layout);
  const carriers: Group[] = [];
  const visibleIn = (dna: DnaV3, group: Group) =>
    group.some((element) => isAnchor(dna, dna.elements.indexOf(element)));
  const allVisible = (list: readonly Group[]) => {
    const dna = assemble(list);
    return carriers.every((group) => visibleIn(dna, group));
  };
  const toFront = (element: Element) => {
    element.rotation = 0;
    element.opacity = Math.max(element.opacity, 0.8);
    element.motion = { ...still };
    element.layer = top.name;
    delete element.effects;
  };
  // Colours a parent really stores, with the path of their first occurrence.
  const colorCache = [new Map(), new Map()] as Map<
    string,
    ReturnType<typeof colorSource>
  >[];
  const parentColor = (parent: ParentIndex, color: string) => {
    const cache = colorCache[parent]!;
    if (!cache.has(color))
      cache.set(color, colorSource(parents[parent], color));
    return cache.get(color);
  };
  /** The form shows a plain colour of this parent. */
  const showsColor = (parent: ParentIndex, element: Element) =>
    element.fill.kind === 'solid' &&
    parentColor(parent, element.fill.color) !== undefined;
  const restore = (group: Group, saved: readonly Element[]) =>
    group.forEach((element, index) => {
      for (const key of Object.keys(element))
        delete (element as Record<string, unknown>)[key];
      Object.assign(element, saved[index]);
    });
  /**
   * Settles the visible contribution of one parent. Existing forms come
   * first; a new form is the last resort.
   */
  const settleCarrier = (parent: ParentIndex): boolean => {
    const view = parents[parent];
    const byForm = (group: Group) =>
      origins.get(group[0]!)?.geometry?.parent === parent;
    const free = (group: Group) => !carriers.includes(group);
    const mine = (group: Group) =>
      free(group) && (byForm(group) || showsColor(parent, group[0]!));
    // 1. A form or a colour of this parent is visible as it stands.
    const natural = assemble(groups);
    const found = groups.find(
      (group) => mine(group) && visibleIn(natural, group),
    );
    if (found) {
      carriers.push(found);
      return true;
    }
    const shaped = (group: Group, side: number) =>
      anchorKinds.has(group[0]!.kind) &&
      shortSide(group) >= side &&
      group.every(
        (element) =>
          element.x + element.width <= 1 && element.y + element.height <= 1,
      );
    /** The parent's own colours, for places where one of them reads. */
    const own: Palette = {
      ...palette,
      colors: view.palette.colors.filter(
        (color) => parentColor(parent, color) !== undefined,
      ),
    };
    /** For a form that proves a measure: any tone that reads. */
    const reserve = (colors: readonly string[]): Palette => ({
      ...palette,
      colors: [...colors],
      extremes: [...palette.extremes, ...MID_TONES] as unknown as [
        string,
        string,
      ],
    });
    const ownColor = (draft: DnaV3, group: Group) => {
      const { color, score } = strongestColor(
        draft,
        draft.elements.indexOf(group[0]!),
        own,
      );
      return score >= ANCHOR_MIN_CONTRAST &&
        parentColor(parent, color) !== undefined
        ? color
        : undefined;
    };
    // 2. A form of this parent comes to the front and is set straight; then
    // 3. any other form comes to the front in a colour of this parent.
    const bySize = (list: Group[]) =>
      list.sort((a, b) => area(a) - area(b)).slice(0, 12);
    const candidates = [
      ...bySize(
        groups.filter((group) => mine(group) && shaped(group, ANCHOR_MIN_SIZE)),
      ),
      ...bySize(
        groups.filter(
          (group) =>
            free(group) && !mine(group) && shaped(group, ANCHOR_MIN_SIZE),
        ),
      ),
    ];
    for (const group of candidates) {
      const saved = group.map((element) => structuredClone(element));
      const form = byForm(group);
      group.forEach(toFront);
      const reordered = [...groups.filter((other) => other !== group), group];
      const draft = assemble(reordered);
      if (
        !visibleIn(draft, group) ||
        !(form || showsColor(parent, group[0]!))
      ) {
        const color =
          ownColor(draft, group) ??
          (form
            ? strongestColor(draft, draft.elements.indexOf(group[0]!), palette)
                .color
            : undefined);
        if (color) setFill(group, solid(color));
      }
      if (
        (form || showsColor(parent, group[0]!)) &&
        visibleIn(assemble(reordered), group) &&
        allVisible(reordered)
      ) {
        groups = reordered;
        carriers.push(group);
        return true;
      }
      restore(group, saved);
    }
    const random = createRandom(`${seed}:carrier:${parent}`);
    const avoid = carriers.flat();
    // 4. A form moves to a place where a colour of this parent reads; a
    // form of this parent may also move in any readable colour.
    const movable = groups
      .filter((group) => free(group) && shaped(group, 0.085))
      .sort(
        (a, b) => Number(byForm(b)) - Number(byForm(a)) || area(a) - area(b),
      )
      .slice(0, 10);
    for (const group of movable) {
      const element = group[0]!;
      const scale = Math.max(1, 0.13 / shortSide(group));
      const rest = groups.filter((other) => other !== group);
      const sizes = [
        [
          round(Math.min(1, element.width * scale)),
          round(Math.min(1, element.height * scale)),
        ],
      ] as const;
      const below = assemble(rest);
      let place = placeAnchor(random, below, own, sizes, false, avoid);
      if (place && parentColor(parent, place.color) === undefined)
        place = undefined;
      if (!place && byForm(group))
        place = placeAnchor(
          random,
          below,
          reserve(palette.colors),
          sizes,
          false,
          avoid,
        );
      if (!place) continue;
      toFront(element);
      Object.assign(element, place.box, { fill: solid(place.color) });
      const carrier = [element];
      groups = [...rest, carrier];
      carriers.push(carrier);
      return true;
    }
    // 5. Last resort (A-31): a new form with a measure and, where it reads,
    // a colour of this parent. Placed freely, without grid or padding.
    if (!view.sources.length) return false;
    const inRange = (value: number) => value >= 0.13 && value <= 0.26;
    const exact = view.sources.filter(
      ({ element }) => inRange(element.width) && inRange(element.height),
    );
    const source = random.pick(exact.length ? exact : view.sources);
    const width = round(clamp(source.element.width, 0.13, 0.26));
    const height = round(clamp(source.element.height, 0.13, 0.26));
    const place = placeAnchor(
      random,
      assemble(groups),
      reserve(own.colors),
      [
        [width, height],
        [width, 0.13],
        [0.13, 0.13],
      ],
      false,
      avoid,
    );
    if (!place || groups.flat().length >= loadLimitsV3.elements) return false;
    const kind =
      source.element.kind === 'circle' || source.element.kind === 'ellipse'
        ? 'ellipse'
        : 'rectangle';
    const added: Element = {
      kind,
      layer: top.name,
      ...place.box,
      rotation: 0,
      opacity: 1,
      fill: solid(place.color),
      motion: { ...still },
    };
    origins.set(added, { geometry: { parent, source } });
    const carrier = [added];
    groups = [...groups, carrier];
    carriers.push(carrier);
    return true;
  };
  if (mode === 'traceable')
    for (const parent of [0, 1] as const)
      if (!settleCarrier(parent)) return null;

  const settled = settleAnchor(seed, groups, top, palette, assemble);
  if (!settled) return null;
  groups = settled.groups;
  const guarded = [...carriers, settled.anchorGroup];
  const free = groups.filter((group) => !guarded.includes(group));
  // Blur and shadow spread: nothing drawn after a guarded form gets one.
  const first = Math.min(...guarded.map((group) => groups.indexOf(group)));
  const front = groups.slice(first + 1);
  if (!decorate(seed, settings, flags, groups, free, front, census(groups)))
    return null;

  const dna = assemble(groups);
  if (!dnaV3Schema.safeParse(dna).success || findAnchor(dna) === -1)
    return null;
  // `off` excludes a feature group, a drawn one (always with `always`)
  // must occur; everything else may be inherited.
  const final = featuresOf(dna);
  for (const name of featureNames)
    if (
      (settings.features[name] === 'off' && final[name]) ||
      (flags[name] && !final[name])
    )
      return null;
  if (!carriers.every((group) => visibleIn(dna, group))) return null;

  // Evidence: concrete source and target values on visible forms only.
  const decisions: ChildResult['decisions'] = [];
  const trait = (
    parent: ParentIndex,
    index: number,
    name: string,
    source: { path: string; value: string | number } | undefined,
    offsetAllowed: boolean,
  ): ChildResult['decisions'][number] | undefined => {
    const value = readElementTrait(dna.elements[index]!, name);
    if (!source || value === undefined) return undefined;
    const target = { path: `elements.${index}.${name}`, value };
    if (source.value === value)
      return { parent, source, target, operation: { kind: 'copy' } };
    if (
      !offsetAllowed ||
      typeof source.value !== 'number' ||
      typeof value !== 'number'
    )
      return undefined;
    const amount = round(value - source.value);
    if (Math.abs(source.value + amount - value) > 1e-9) return undefined;
    return { parent, source, target, operation: { kind: 'offset', amount } };
  };
  const visible = dna.elements
    .map((element, index) => ({ element, index }))
    .filter(({ index }) => isAnchor(dna, index));
  if (!fullyNew)
    for (const parent of [0, 1] as const) {
      const own = carriers.flatMap((group) => group);
      const forms = visible
        .filter(({ element }) => {
          const origin = origins.get(element);
          return (
            origin?.geometry?.parent === parent ||
            origin?.fill?.parent === parent ||
            showsColor(parent, element)
          );
        })
        // Settled carriers first, then further visible forms.
        .sort(
          (a, b) =>
            Number(own.includes(b.element)) - Number(own.includes(a.element)),
        )
        .slice(0, EVIDENCE_FORMS);
      for (const { element, index } of forms) {
        const origin = origins.get(element) ?? {};
        const found: (ChildResult['decisions'][number] | undefined)[] = [];
        // A plain colour this parent stores, wherever the form comes from.
        if (element.fill.kind === 'solid')
          found.push(
            trait(
              parent,
              index,
              'fill.color',
              parentColor(parent, element.fill.color),
              false,
            ),
          );
        const fillFrom =
          origin.fill ??
          (origin.geometry?.parent === parent ? origin.geometry : undefined);
        if (fillFrom?.parent === parent)
          for (const name of fillTraits(element.fill))
            found.push(
              trait(
                parent,
                index,
                name,
                sourceTrait(fillFrom.source, name),
                false,
              ),
            );
        if (origin.geometry?.parent === parent) {
          const { source } = origin.geometry;
          for (const name of ['width', 'height'] as const)
            found.push(
              trait(parent, index, name, sourceTrait(source, name), true),
            );
          for (const name of ['x', 'y'] as const)
            found.push(
              trait(parent, index, name, sourceTrait(source, name), false),
            );
        }
        const kept = found.filter((entry) => entry !== undefined);
        // Colours first, then measures; no path twice.
        const paths = new Set<string>();
        for (const entry of kept
          .sort(
            (a, b) =>
              Number(typeof b.target.value === 'string') -
              Number(typeof a.target.value === 'string'),
          )
          .filter((entry) => {
            if (paths.has(entry.target.path)) return false;
            paths.add(entry.target.path);
            return true;
          })
          .slice(0, EVIDENCE_TRAITS))
          decisions.push(entry);
      }
    }
  if (
    mode === 'traceable' &&
    ([0, 1] as const).some(
      (parent) => !decisions.some((decision) => decision.parent === parent),
    )
  )
    return null;
  // Conversions forced by `off`: documented, but never a contribution.
  for (const conversion of conversions.slice(0, CONSTRAINED_LIMIT)) {
    const index = dna.elements.indexOf(conversion.element);
    if (index === -1) continue;
    const value = readElementTrait(conversion.element, conversion.trait);
    if (typeof value !== 'string' || value === conversion.source.value)
      continue;
    decisions.push({
      parent: conversion.parent,
      source: conversion.source,
      target: { path: `elements.${index}.${conversion.trait}`, value },
      operation: { kind: 'constrained', rule: conversion.rule },
    });
  }
  // A family the settings switched off: the layer is built anew.
  for (const entry of layout)
    for (const parent of [0, 1] as const) {
      const layer = parents[parent].layers[entry.name];
      if (
        fullyNew ||
        !layer ||
        parents[parent].legacy ||
        settings.families[layer.family] ||
        layer.family === entry.family
      )
        continue;
      decisions.push({
        parent,
        source: { path: `layers.${entry.name}.family`, value: layer.family },
        target: { path: `layers.${entry.name}.family`, value: entry.family },
        operation: {
          kind: 'constrained',
          rule: `families.${layer.family}=false`,
        },
      });
    }

  return {
    dna,
    recipe: {
      palette: paletteHeritage,
      layers: Object.fromEntries(
        layerNames
          .map((name) => layout.find((entry) => entry.name === name))
          .filter((entry) => entry !== undefined)
          .map((entry) => [entry.name, entry.heritage]),
      ),
      mutationJump: jump,
      features: flags,
      anchor: settled.anchor,
    },
    decisions,
  };
}
