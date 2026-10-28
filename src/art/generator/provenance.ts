import { dnaSchema, readTrait, validateArtwork } from '../schema/artwork';
import type { Artwork, Dna, EvolutionArtwork, Recipe } from '../schema/artwork';
import { generateStudy, contrast } from './study';

type Element = Dna['elements'][number];
const round = (value: number) => Math.round(value * 1e6) / 1e6;
function paintBounds(element: Element) {
  if (element.rotation === 0 && element.motion.kind === 'static')
    return element;
  const radius =
    Math.hypot(element.width, element.height) / 2 + element.motion.amplitude;
  return {
    x: element.x + element.width / 2 - radius,
    y: element.y + element.height / 2 - radius,
    width: radius * 2,
    height: radius * 2,
  };
}
export function boundsIntersect(a: Element, b: Element) {
  const first = paintBounds(a),
    later = paintBounds(b);
  return (
    first.x < later.x + later.width - 1e-6 &&
    first.x + first.width > later.x + 1e-6 &&
    first.y < later.y + later.height - 1e-6 &&
    first.y + first.height > later.y + 1e-6
  );
}
export function isExposed(dna: Dna, index: number): boolean {
  const shape = dna.elements[index];
  const behind = dna.elements[index - 1];
  return (
    !!shape &&
    !!behind &&
    shape.width >= 0.12 &&
    shape.height >= 0.12 &&
    shape.opacity === 1 &&
    shape.rotation === 0 &&
    shape.motion.kind === 'static' &&
    shape.x >= 0 &&
    shape.y >= 0 &&
    shape.x + shape.width <= 1 &&
    shape.y + shape.height <= 1 &&
    behind.kind === 'rectangle' &&
    behind.opacity === 1 &&
    behind.rotation === 0 &&
    behind.motion.kind === 'static' &&
    behind.color === dna.background &&
    behind.x <= shape.x &&
    behind.y <= shape.y &&
    round(behind.x + behind.width) >= round(shape.x + shape.width) &&
    round(behind.y + behind.height) >= round(shape.y + shape.height) &&
    contrast(shape.color, behind.color) >= 2 &&
    dna.elements
      .slice(index + 1)
      .every((later) => !boundsIntersect(shape, later))
  );
}
export function readRecipeValue(dna: Dna, path: string): string | number {
  if (path === 'background') return dna.background;
  const [, rawIndex, field, motionField] = path.split('.');
  const element = dna.elements[Number(rawIndex)];
  if (!element) throw new Error('Rezeptpfad ohne Element.');
  const value =
    field === 'motion'
      ? element.motion[motionField as keyof Element['motion']]
      : element[field as keyof Element];
  if (typeof value !== 'string' && typeof value !== 'number')
    throw new Error('Nicht unterstützter Rezeptwert.');
  return value;
}
export function applyRecipeValue(
  dna: Dna,
  path: string,
  value: string | number,
) {
  if (path === 'background') {
    dna.background = String(value);
    return;
  }
  const [, rawIndex, field, motionField] = path.split('.');
  const element = dna.elements[Number(rawIndex)];
  if (!element || !field) throw new Error('Ungültiger Rezeptpfad.');
  const target = field === 'motion' ? element.motion : element;
  const key = field === 'motion' ? motionField : field;
  Object.assign(target, { [key!]: value });
}
export function replayRecipe(
  recipe: Recipe,
  parents: readonly Artwork[],
  family: Dna['family'],
): Dna {
  const base =
    recipe.base.source === 'new'
      ? generateStudy({ seed: recipe.base.seed, family }).dna
      : structuredClone(parents[recipe.base.source === 'parentA' ? 0 : 1]?.dna);
  if (!base) throw new Error('Rezeptbasis ohne Elternwerk.');
  base.elements = base.elements.slice(0, 50);
  for (const mutation of recipe.mutations) {
    if (readRecipeValue(base, mutation.path) !== mutation.before)
      throw new Error('Rezept-Ausgangswert stimmt nicht.');
    applyRecipeValue(base, mutation.path, mutation.after);
  }
  base.elements.push(...structuredClone(recipe.additions));
  return dnaSchema.parse(base);
}

/** Strong V2 validation: replay every composition decision and verify exposed contributions. */
export function validateEvolution(
  work: EvolutionArtwork,
  parents: readonly Artwork[],
): EvolutionArtwork {
  validateArtwork(work, parents);
  if (
    JSON.stringify(
      replayRecipe(work.evolution.recipe, parents, work.dna.family),
    ) !== JSON.stringify(work.dna)
  ) {
    throw new Error('Rezept reproduziert die archivierte DNA nicht.');
  }
  if (
    work.generation <= 2 &&
    (work.evolution.recipe.base.source !== 'new' ||
      work.titleDna.parentFragments.length)
  ) {
    throw new Error('Ursprünge müssen vollständig unabhängig bleiben.');
  }
  for (const decision of work.evolution.decisions) {
    const target = /^elements\.(\d+)\.(color|width|height)$/.exec(
      decision.target.path,
    );
    if (!target || !isExposed(work.dna, Number(target[1])))
      throw new Error('Belegtes Merkmal ist nicht nachweisbar sichtbar.');
    const parent = parents.find(
      (candidate) => candidate.id === decision.parentId,
    );
    if (
      !parent ||
      readTrait(parent.dna, decision.source.path) !== decision.source.value
    )
      throw new Error('Ungültiger Quellbeleg.');
    const source = /^elements\.(\d+)\.(color|width|height)$/.exec(
      decision.source.path,
    );
    if (!source || !isExposed(parent.dna, Number(source[1])))
      throw new Error('Quellmerkmal ist nicht sichtbar belegt.');
  }
  for (const fragment of work.titleDna.parentFragments) {
    const parent = parents.find(
      (candidate) => candidate.id === fragment.parentId,
    );
    if (
      !parent ||
      !parent.title.includes(fragment.fragment) ||
      !work.title
        .toLocaleLowerCase('de-DE')
        .includes(fragment.fragment.toLocaleLowerCase('de-DE'))
    ) {
      throw new Error('Titelherkunft ist nicht belegt.');
    }
  }
  return work;
}
