import {
  layerNames,
  validateArtworkV3,
  type AnyArtwork,
  type ArtworkV3,
} from '../../schema/artwork-v3';
import { featuresOf, findAnchor, isAnchor } from './checks';
import { featureNames } from './kit';
import { canonicalJson, sha256 } from './sha256';

// Strict validation of a schema 3 work of generator 0.3.0 against its
// parents (EP-01, P4). The schema proves that sources and targets hold the
// stored values; this module proves that contributions are visible and that
// the frozen settings were kept.

const elementTarget = /^elements\.(0|[1-9]\d*)\./;

export function validateEvolutionV3(
  input: unknown,
  parents: readonly AnyArtwork[],
): ArtworkV3 {
  const work = validateArtworkV3(input, parents);
  const { settings, dna } = work;
  const fail = (message: string): never => {
    throw new Error(message);
  };

  // A-29: the stored seed binds the digest of the complete snapshot.
  const digest = sha256(
    canonicalJson({ revision: work.settingsRevision, settings }),
  );
  if (!work.seed.endsWith(`:settings-${digest}`))
    fail('Seed und Einstellungssnapshot gehören nicht zusammen.');

  // The settings limit both modes.
  const layers = layerNames.filter((name) => dna.layers[name]);
  if (layers.length > settings.composition.maxLayers)
    fail('Mehr Ebenen als die Einstellungen erlauben.');
  for (const name of layers)
    if (!settings.families[dna.layers[name]!.family])
      fail('Ebene benutzt eine abgeschaltete Familie.');
  const census = featuresOf(dna);
  for (const name of featureNames) {
    if (settings.features[name] === 'off' && census[name])
      fail(`Ausgeschlossenes Merkmal kommt vor: ${name}.`);
    if (settings.features[name] === 'always' && !census[name])
      fail(`Verlangtes Merkmal fehlt: ${name}.`);
  }
  if (findAnchor(dna) === -1) fail('Werk hat keinen sichtbaren Anker.');

  const contributions = new Set<string>();
  for (const decision of work.evolution.decisions) {
    const { operation, target } = decision;
    if (operation.kind === 'constrained') {
      // The rule must name a setting that really holds this value.
      const [path, value] = operation.rule.split('=');
      const [group, key] = path!.split('.');
      const section = (settings as Record<string, unknown>)[group!];
      const actual =
        typeof section === 'object' && section !== null && key !== undefined
          ? (section as Record<string, unknown>)[key]
          : undefined;
      if (actual === undefined || String(actual) !== value)
        fail('Umwandlung beruft sich auf eine Regel, die nicht gilt.');
      continue;
    }
    // Copies and offsets claim a contribution: only on a visible form.
    const match = elementTarget.exec(target.path);
    if (!match || !isAnchor(dna, Number(match[1])))
      fail('Belegtes Merkmal ist nicht nachweisbar sichtbar.');
    contributions.add(decision.parentId);
  }
  if (
    work.evolution.type === 'hybrid' &&
    work.inheritanceMode === 'traceable' &&
    work.parentIds.some((id) => !contributions.has(id))
  )
    fail(
      'Nachvollziehbare Vererbung benötigt einen sichtbaren Beitrag jedes Elternteils.',
    );

  for (const fragment of work.titleDna.parentFragments) {
    const parent = parents.find((entry) => entry.id === fragment.parentId);
    if (
      !parent ||
      !parent.title.includes(fragment.fragment) ||
      !work.title
        .toLocaleLowerCase('de-DE')
        .includes(fragment.fragment.toLocaleLowerCase('de-DE'))
    )
      fail('Titelherkunft ist nicht belegt.');
  }
  if (work.evolution.type === 'origin' && work.titleDna.parentFragments.length)
    fail('Ursprünge müssen vollständig unabhängig bleiben.');
  return work;
}
