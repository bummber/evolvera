import {
  dnaV3Schema,
  loadLimitsV3,
  MAX_INHERITED_PER_PARENT,
  type DnaV3,
  type InheritanceDecisionV3,
  type RecipeV4,
} from '../../schema/artwork-v3';
import type { SettingsSnapshot } from '../../schema/preview-v3';
import { familyKeys } from '../../schema/profile';
import { createRandom, type Random } from '../random';
import {
  ANCHOR_MIN_CONTRAST,
  ANCHOR_MIN_SIZE,
  anchorKinds,
  bounds,
  featuresOf,
  findAnchor,
  isAnchor,
  layerShows,
  overlaps,
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
import { fillColors, solid } from './fills';
import { MUTATION_JUMP_CHANCE, mutationLevels } from './inherit';
import {
  clamp,
  createBudget,
  createLayer,
  featureNames,
  round,
  type Element,
  type Flags,
  type LayerName,
} from './kit';
import { contrast, createPalette, type Palette } from './palette';
import {
  colorSource,
  sourceTrait,
  type ParentView,
  type Source,
} from './parents';

// Evolution of generator 0.4.0: a child takes single properties of its two
// parents instead of whole layers. Each parent gives at most three: a
// colour, a form or the family of a layer. Everything else is built anew
// like an origin work. Every property is proven on the finished work.

type ParentIndex = 0 | 1;

/**
 * Chance of 0, 1, 2 or 3 inherited properties per parent; part of generator
 * 0.4.0. `traceable` takes at least one from each parent, `free` may take
 * none.
 */
export const traitCountWeights = {
  traceable: [0, 0.4, 0.35, 0.25],
  free: [0.25, 0.3, 0.25, 0.2],
} as const;
/** At least one colour of the child's palette stays new. */
const MAX_INHERITED_COLORS = 4;
const SUPPLEMENT_CAP = 40;
/** Most new elements a colour carrier may clear away to read. */
const WINDOW_MAX_CLEARED = 8;
const WINDOW_STEPS = [0.14, 0.23, 0.32, 0.41, 0.5, 0.59, 0.68, 0.77, 0.86];
const still = { kind: 'static', durationSeconds: 30, amplitude: 0 } as const;

type Trait =
  | {
      parent: ParentIndex;
      kind: 'color';
      color: string;
      source: { path: string; value: string | number };
    }
  | { parent: ParentIndex; kind: 'form'; source: Source }
  | { parent: ParentIndex; kind: 'family'; layer: LayerName; family: Family };

export type ChildResultV4 = {
  dna: DnaV3;
  recipe: Omit<RecipeV4, 'retry'>;
  /** Decisions without parent IDs; the caller adds them. */
  decisions: (Omit<InheritanceDecisionV3, 'parentId'> & {
    parent: ParentIndex;
  })[];
};

function drawCount(random: Random, weights: readonly number[]) {
  let rest = random.next() * weights.reduce((sum, weight) => sum + weight, 0);
  for (let count = 0; count < weights.length; count++) {
    rest -= weights[count]!;
    if (rest < 0) return count;
  }
  return weights.length - 1;
}

/** Contrast an inherited colour needs against the child's new ground. */
const COLOR_MIN_CONTRAST = 3;
/** Largest side of an inherited form; larger ones would cover the work. */
const FORM_MAX_SIZE = 0.45;

/**
 * What a parent can give: stored colours that read on the child's ground,
 * forms that can stand as a visible anchor, usable families.
 */
function poolOf(
  view: ParentView,
  settings: SettingsSnapshot,
  background: string,
) {
  return {
    color: [...new Set(view.palette.colors)].flatMap((color) => {
      const source = colorSource(view, color);
      return source && contrast(background, color) >= COLOR_MIN_CONTRAST
        ? [{ color, source }]
        : [];
    }),
    form: view.sources.filter(
      ({ element }) =>
        anchorKinds.has(element.kind) &&
        element.width >= ANCHOR_MIN_SIZE &&
        element.height >= ANCHOR_MIN_SIZE &&
        element.width <= FORM_MAX_SIZE &&
        element.height <= FORM_MAX_SIZE,
    ),
    // Families of the old vocabulary have no layer path to cite.
    family: view.legacy
      ? []
      : (Object.keys(view.layers) as LayerName[]).filter(
          (name) => settings.families[view.layers[name]!.family],
        ),
  };
}

/**
 * One attempt at a child of two parents. Returns `null` when a hard check
 * fails; the caller then retries with the next deterministic seed.
 */
export function composeChildV4(
  seed: string,
  settings: SettingsSnapshot,
  flags: Flags,
  parents: readonly [ParentView, ParentView],
): ChildResultV4 | null {
  const mode = settings.inheritanceMode;
  const mutation = mutationLevels[settings.variation.mutationStrength];
  const heritage = createRandom(`${seed}:heritage`);
  // All draws happen in a fixed order, whether or not they are used.
  const jumpDraw = heritage.next();
  const jump =
    settings.experimental.mutationJumps && jumpDraw < MUTATION_JUMP_CHANCE;

  const paletteRandom = createRandom(`${seed}:palette`);
  const fresh = createPalette(
    paletteRandom,
    paletteRandom.pick(settings.palette.strategies),
    settings.palette.contrast,
  );
  const layerRandom = createRandom(`${seed}:layers`);
  const plan = planLayers(layerRandom, settings);
  const density =
    settings.composition.density === 'sparse'
      ? 0.2
      : settings.composition.density === 'dense'
        ? 0.85
        : layerRandom.between(0.15, 0.95);
  const layout = plan.map((entry) => ({
    ...entry,
    symmetric:
      flags.symmetry &&
      (entry.name === 'structure' || layerRandom.next() < 0.5),
    trait: undefined as Trait | undefined,
  }));

  // Properties: how many per parent, then which ones. A mutation jump
  // keeps only the minimum of the mode.
  const traits: Trait[] = [];
  const takenColors = new Set<string>();
  let familySlots = layout.length;
  for (const parent of [0, 1] as const) {
    const drawn = drawCount(heritage, traitCountWeights[mode]);
    const wanted = Math.min(
      MAX_INHERITED_PER_PARENT,
      jump ? (mode === 'traceable' ? 1 : 0) : drawn,
    );
    const pool = poolOf(parents[parent], settings, fresh.background);
    for (let count = 0; count < wanted; count++) {
      pool.color = pool.color.filter(({ color }) => !takenColors.has(color));
      const kinds = (['color', 'form', 'family'] as const).filter((kind) =>
        kind === 'color'
          ? pool.color.length > 0 && takenColors.size < MAX_INHERITED_COLORS
          : kind === 'family'
            ? pool.family.length > 0 && familySlots > 0
            : pool.form.length > 0,
      );
      if (!kinds.length) break;
      const kind = heritage.pick(kinds);
      if (kind === 'color') {
        const [{ color, source }] = pool.color.splice(
          heritage.integer(0, pool.color.length - 1),
          1,
        ) as [(typeof pool.color)[number]];
        takenColors.add(color);
        traits.push({ parent, kind, color, source });
      } else if (kind === 'form') {
        const [source] = pool.form.splice(
          heritage.integer(0, pool.form.length - 1),
          1,
        ) as [Source];
        traits.push({ parent, kind, source });
      } else {
        const [layer] = pool.family.splice(
          heritage.integer(0, pool.family.length - 1),
          1,
        ) as [LayerName];
        familySlots--;
        traits.push({
          parent,
          kind,
          layer,
          family: parents[parent].layers[layer]!.family,
        });
      }
    }
    if (mode === 'traceable' && !traits.some((t) => t.parent === parent))
      return null;
  }

  // Families: into the highest free layer, where their forms show best.
  for (const trait of traits) {
    if (trait.kind !== 'family') continue;
    const target = layout.toReversed().find((entry) => !entry.trait)!;
    target.family = trait.family;
    target.trait = trait;
  }
  // Mutation jump: the layers built anew avoid every family of the parents.
  if (jump) {
    const shown = new Set(
      parents.flatMap((parent) =>
        Object.values(parent.layers).map((layer) => layer.family),
      ),
    );
    const others = familyKeys.filter(
      (key) => settings.families[key] && !shown.has(key),
    );
    for (const entry of layout)
      if (!entry.trait && shown.has(entry.family) && others.length)
        entry.family = heritage.pick(others);
  }

  // Palette: new, with the inherited colours at random ranks.
  const palette: Palette = { ...fresh, colors: [...fresh.colors] };
  const ranks = palette.colors.map((_, rank) => rank);
  for (const trait of traits)
    if (trait.kind === 'color') {
      const [rank] = ranks.splice(
        paletteRandom.integer(0, ranks.length - 1),
        1,
      );
      palette.colors[rank!] = trait.color;
    }
  // Keep the order by falling contrast that the layers rely on.
  palette.colors.sort(
    (a, b) =>
      contrast(palette.background, b) - contrast(palette.background, a) ||
      (a < b ? -1 : 1),
  );

  // Everything else is built anew, as in an origin work. Inherited forms
  // and colour carriers keep their places in the budget.
  const budget = createBudget();
  budget.elements -= traits.filter((trait) => trait.kind !== 'family').length;
  const top = layout.at(-1)!;
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
  if (!guaranteeFills(createRandom(`${seed}:fills`), groups, palette, flags))
    return null;

  const assemble = assembler(palette.background, layout);
  /** Groups that carry a proof; they must all stay visible. */
  const proofs: Group[] = [];
  /** Groups drawn above everything built anew, in drawing order. */
  const tail: Group[] = [];
  const carrierOf = new Map<Trait, Group>();
  const all = () => [...groups, ...tail];
  const visibleIn = (dna: DnaV3, group: Group) =>
    group.some((element) => isAnchor(dna, dna.elements.indexOf(element)));
  const proofsVisible = (dna: DnaV3) =>
    proofs.every((group) => visibleIn(dna, group));
  const toFront = (element: Element) => {
    element.rotation = 0;
    element.opacity = Math.max(element.opacity, 0.8);
    element.motion = { ...still };
    element.layer = top.name;
    delete element.effects;
  };

  // Forms: kind, outline and size of a parent form, in a colour of the
  // child, where it stood or else where it reads. Mutation may resize it.
  const formRandom = createRandom(`${seed}:forms`);
  for (const trait of traits) {
    if (trait.kind !== 'form') continue;
    const element = structuredClone(trait.source.element);
    toFront(element);
    element.opacity = 1;
    const mutate = formRandom.next() < mutation.share;
    const factor = 1 + 2 * formRandom.between(-1, 1) * mutation.amplitude;
    if (mutate) {
      element.width = round(clamp(element.width * factor, ANCHOR_MIN_SIZE, 1));
      element.height = round(
        clamp(element.height * factor, ANCHOR_MIN_SIZE, 1),
      );
      element.x = round(clamp(element.x, 0, 1 - element.width));
      element.y = round(clamp(element.y, 0, 1 - element.height));
    }
    const group: Group = [element];
    const below = assemble(all());
    const index = below.elements.length;
    let placed = false;
    const here = strongestColor(assemble([...all(), group]), index, palette);
    if (here.score >= ANCHOR_MIN_CONTRAST) {
      element.fill = solid(here.color);
      const draft = assemble([...all(), group]);
      placed = isAnchor(draft, index) && proofsVisible(draft);
    }
    if (!placed) {
      // Its own size first; where none fits, smaller in the same proportion.
      const sizes = [1, 0.75, 0.5].map((scale) => {
        const shrink = Math.max(
          scale,
          ANCHOR_MIN_SIZE / Math.min(element.width, element.height),
        );
        return [
          round(Math.min(element.width, element.width * shrink)),
          round(Math.min(element.height, element.height * shrink)),
        ] as const;
      });
      const place = placeAnchor(
        formRandom,
        below,
        palette,
        sizes,
        false,
        proofs.flat(),
      );
      if (!place) return null;
      Object.assign(element, place.box, { fill: solid(place.color) });
      const draft = assemble([...all(), group]);
      if (!isAnchor(draft, index) || !proofsVisible(draft)) return null;
    }
    tail.push(group);
    proofs.push(group);
    carrierOf.set(trait, group);
  }

  // Colours: a form that already shows the colour, else a form brought to
  // the front in it, else a new small form where the colour reads.
  const colorRandom = createRandom(`${seed}:colors`);
  for (const trait of traits) {
    if (trait.kind !== 'color') continue;
    const { color } = trait;
    const natural = assemble(all());
    let carrier = groups.find(
      (group) =>
        !proofs.includes(group) &&
        group[0]!.fill.kind === 'solid' &&
        group[0]!.fill.color === color &&
        visibleIn(natural, group),
    );
    if (!carrier) {
      const candidates = groups
        .filter(
          (group) =>
            !proofs.includes(group) &&
            group[0]!.fill.kind === 'solid' &&
            anchorKinds.has(group[0]!.kind) &&
            shortSide(group) >= ANCHOR_MIN_SIZE &&
            group.every(
              (element) =>
                element.x + element.width <= 1 &&
                element.y + element.height <= 1,
            ),
        )
        .sort((a, b) => area(a) - area(b))
        .slice(0, 24);
      for (const group of candidates) {
        const saved = group.map((element) => structuredClone(element));
        group.forEach(toFront);
        setFill(group, solid(color));
        const rest = groups.filter((other) => other !== group);
        const draft = assemble([...rest, ...tail, group]);
        if (visibleIn(draft, group) && proofsVisible(draft)) {
          groups = rest;
          tail.push(group);
          carrier = group;
          break;
        }
        group.forEach((element, index) => {
          for (const key of Object.keys(element))
            delete (element as Record<string, unknown>)[key];
          Object.assign(element, saved[index]);
        });
      }
    }
    if (!carrier) {
      if (all().flat().length >= loadLimitsV3.elements - 2) return null;
      const place = placeAnchor(
        colorRandom,
        assemble(all()),
        { ...palette, colors: [color], extremes: [color, color] },
        [
          [0.2, 0.2],
          [0.16, 0.16],
          [0.13, 0.13],
        ],
        false,
        proofs.flat(),
      );
      let box = place?.color === color ? place.box : undefined;
      if (!box) {
        // A window: the place where the fewest new forms keep the colour
        // from reading; those forms give way. Inherited ones never do.
        type Box = { x: number; y: number; width: number; height: number };
        let best: { box: Box; clear: Group[] } | undefined;
        for (const size of [0.16, 0.13])
          for (const stepY of WINDOW_STEPS)
            for (const stepX of WINDOW_STEPS) {
              const candidate = {
                x: round(clamp(stepX - size / 2, 0, 1 - size)),
                y: round(clamp(stepY - size / 2, 0, 1 - size)),
                width: size,
                height: size,
              };
              const area = bounds({
                ...candidate,
                rotation: 0,
              } as Element);
              if (
                proofs.flat().some((element) => overlaps(bounds(element), area))
              )
                continue;
              const clear = all().filter(
                (group) =>
                  !proofs.includes(group) &&
                  group.some(
                    (element) =>
                      overlaps(bounds(element), area) &&
                      fillColors(element.fill).some(
                        (other) => contrast(other, color) < ANCHOR_MIN_CONTRAST,
                      ),
                  ),
              );
              const load = clear.flat().length;
              if (
                load <= WINDOW_MAX_CLEARED &&
                (!best || load < best.clear.flat().length)
              )
                best = { box: candidate, clear };
            }
        if (!best) return null;
        groups = groups.filter((group) => !best.clear.includes(group));
        tail.splice(
          0,
          tail.length,
          ...tail.filter((group) => !best.clear.includes(group)),
        );
        box = best.box;
      }
      carrier = [
        {
          kind: colorRandom.next() < 0.5 ? 'rectangle' : 'ellipse',
          layer: top.name,
          ...box,
          rotation: 0,
          opacity: 1,
          fill: solid(color),
          motion: { ...still },
        },
      ];
      if (!visibleIn(assemble([...all(), carrier]), carrier)) return null;
      tail.push(carrier);
    }
    proofs.push(carrier);
    carrierOf.set(trait, carrier);
  }

  groups = all();
  const settled = settleAnchor(seed, groups, top, palette, assemble);
  if (!settled) return null;
  groups = settled.groups;
  const guarded = [...proofs, settled.anchorGroup];
  const free = groups.filter((group) => !guarded.includes(group));
  // Blur and shadow spread: nothing drawn after a guarded form gets one.
  const first = Math.min(...guarded.map((group) => groups.indexOf(group)));
  const front = groups.slice(first + 1);
  if (!decorate(seed, settings, flags, groups, free, front)) return null;

  const dna = assemble(groups);
  if (!dnaV3Schema.safeParse(dna).success || findAnchor(dna) === -1)
    return null;
  // Inherited properties bring no feature group along: the census matches
  // the drawn features exactly, as in an origin work.
  const census = featuresOf(dna);
  if (featureNames.some((name) => census[name] !== flags[name])) return null;
  if (!proofsVisible(dna)) return null;
  for (const entry of layout)
    if (entry.trait && !layerShows(dna, entry.name)) return null;

  // Evidence: concrete source and target values for every property.
  const decisions: ChildResultV4['decisions'] = [];
  for (const trait of traits) {
    const before = decisions.length;
    if (trait.kind === 'family') {
      const entry = layout.find((candidate) => candidate.trait === trait)!;
      decisions.push({
        parent: trait.parent,
        source: { path: `layers.${trait.layer}.family`, value: trait.family },
        target: { path: `layers.${entry.name}.family`, value: trait.family },
        operation: { kind: 'copy' },
      });
    } else if (trait.kind === 'color') {
      const group = carrierOf.get(trait)!;
      const index = group
        .map((element) => dna.elements.indexOf(element))
        .find((position) => isAnchor(dna, position))!;
      decisions.push({
        parent: trait.parent,
        source: trait.source,
        target: { path: `elements.${index}.fill.color`, value: trait.color },
        operation: { kind: 'copy' },
      });
    } else {
      const element = carrierOf.get(trait)![0]!;
      const index = dna.elements.indexOf(element);
      for (const name of ['kind', 'width', 'height', 'x', 'y'] as const) {
        const source = sourceTrait(trait.source, name);
        const value = element[name];
        if (!source) continue;
        const target = { path: `elements.${index}.${name}`, value };
        if (source.value === value)
          decisions.push({
            parent: trait.parent,
            source,
            target,
            operation: { kind: 'copy' },
          });
        else if (
          (name === 'width' || name === 'height') &&
          typeof source.value === 'number' &&
          typeof value === 'number'
        ) {
          const amount = round(value - source.value);
          if (Math.abs(source.value + amount - value) <= 1e-9)
            decisions.push({
              parent: trait.parent,
              source,
              target,
              operation: { kind: 'offset', amount },
            });
        }
      }
    }
    // A property without a provable trait is no contribution.
    if (decisions.length === before) return null;
  }

  return {
    dna,
    recipe: {
      inherited: traits.map((trait) => ({
        parent: trait.parent === 0 ? 'parentA' : 'parentB',
        property: trait.kind,
      })),
      mutationJump: jump,
      features: flags,
      anchor: settled.anchor,
    },
    decisions,
  };
}
