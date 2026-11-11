import type { AnyArtwork, ArtworkV3 } from '../art/schema/artwork-v3';
import { TraitPreview } from './WorkProvenance';
import {
  familyLabels,
  featureLabels,
  heritageLabels,
  layerLabels,
  valueLabels,
} from './work-labels';

type Decision = ArtworkV3['evolution']['decisions'][number];
type LayerName = keyof typeof layerLabels;

const percent = (value: number) =>
  (value * 100).toLocaleString('de-DE', { maximumFractionDigits: 4 });
const traitLabels: Record<string, string> = {
  background: 'Hintergrundfarbe',
  color: 'Farbe',
  x: 'Horizontale Position',
  y: 'Vertikale Position',
  width: 'Breite',
  height: 'Höhe',
  rotation: 'Drehung',
  opacity: 'Deckkraft',
  kind: 'Formart',
  layer: 'Ebene',
  'fill.kind': 'Füllart',
  'fill.color': 'Füllfarbe',
  'fill.angle': 'Winkel der Füllung',
  'fill.centerX': 'Mittelpunkt der Füllung (horizontal)',
  'fill.centerY': 'Mittelpunkt der Füllung (vertikal)',
  'fill.pattern': 'Musterart',
  'fill.period': 'Musterperiode',
  'fill.foreground': 'Musterfarbe',
  'fill.background': 'Mustergrund',
  'shape.start': 'Bogenanfang',
  'shape.sweep': 'Bogenweite',
  'shape.strokeWidth': 'Strichstärke',
};
/** Splits `elements.4.fill.stops.1.color` into element index and trait. */
function parse(path: string) {
  const element = /^elements\.(\d+)\.(.+)$/.exec(path);
  if (element) return { index: Number(element[1]), trait: element[2]! };
  return { index: null, trait: path };
}
function traitLabel(path: string) {
  const { trait } = parse(path);
  const layer = /^layers\.(\w+)\.family$/.exec(trait);
  if (layer) return `Familie der Ebene ${layerLabels[layer[1] as LayerName]}`;
  const stop = /^fill\.stops\.(\d)\.(color|offset)$/.exec(trait);
  if (stop)
    return stop[2] === 'color'
      ? `Farbstopp ${Number(stop[1]) + 1}`
      : `Lage von Farbstopp ${Number(stop[1]) + 1}`;
  if (trait.startsWith('shape.points.')) return 'Formpunkt';
  if (trait.startsWith('shape.radii.')) return 'Rundung';
  if (trait.startsWith('shape.commands.')) return 'Kurvenpunkt';
  return traitLabels[trait] ?? 'Merkmal';
}
const degrees = /(^|\.)(rotation|angle|start|sweep)$/;
function traitValue(value: string | number, path: string) {
  if (typeof value === 'number')
    return degrees.test(path) ? `${value}°` : `${percent(value)} %`;
  if (value.startsWith('#')) return value;
  return path.endsWith('.family')
    ? (familyLabels[value] ?? value)
    : (valueLabels[value] ?? value);
}
/** Where a trait sits in the work: form number and layer. */
function place(work: ArtworkV3, path: string) {
  const { index } = parse(path);
  if (index === null) return null;
  const element = work.dna.elements[index];
  return element
    ? `Form ${index + 1} · ${layerLabels[element.layer]}`
    : `Form ${index + 1}`;
}
function ruleLabel(rule: string) {
  const [path = '', value] = rule.split('=');
  const [group, key = ''] = path.split('.');
  if (group === 'features' && value === 'off' && key in featureLabels)
    return `weil „${featureLabels[key as keyof typeof featureLabels]}“ auf Aus steht`;
  if (group === 'families' && value === 'false')
    return `weil die Familie „${familyLabels[key] ?? key}“ nicht aktiv ist`;
  return `nach der Regel ${rule}`;
}
const anchorLabels = {
  natural: 'war schon vorhanden',
  promoted: 'wurde nach vorn geholt',
  moved: 'wurde versetzt',
  added: 'wurde ergänzt',
} as const;

function Proof({ decision }: { decision: Decision }) {
  const { operation } = decision;
  return (
    <dl>
      <div>
        <dt>Quelle</dt>
        <dd>
          {decision.source.path}: {decision.source.value}
        </dd>
      </div>
      <div>
        <dt>Ziel</dt>
        <dd>
          {decision.target.path}: {decision.target.value}
        </dd>
      </div>
      <div>
        <dt>Operator</dt>
        <dd>
          {operation.kind === 'copy'
            ? 'Kopie'
            : operation.kind === 'offset'
              ? `Offset ${operation.amount}`
              : `Umwandlung · ${operation.rule}`}
        </dd>
      </div>
    </dl>
  );
}

/** Provenance of a schema 3 work (EP-01 P6), from its stored evidence only. */
export function WorkProvenanceV3({
  work,
  parents = [],
  decorated = false,
}: {
  work: ArtworkV3;
  parents?: readonly AnyArtwork[];
  decorated?: boolean;
}) {
  const { decisions, recipe } = work.evolution;
  const letter = (parentId: string) =>
    parentId === work.parentIds[0] ? 'A' : 'B';
  const badge = (parentId: string) =>
    decorated && (
      <span
        className={`proof-parent dna-${letter(parentId).toLowerCase()}`}
        aria-hidden="true"
      >
        {letter(parentId)}
      </span>
    );
  const shown = (raw: string | number, path: string) =>
    decorated ? (
      <span className="proof-value">{traitValue(raw, path)}</span>
    ) : (
      traitValue(raw, path)
    );
  const contributions = decisions.filter(
    (decision) => decision.operation.kind !== 'constrained',
  );
  // Identical conversions are listed once with their number of forms.
  const conversions = new Map<string, Decision[]>();
  for (const decision of decisions) {
    if (decision.operation.kind !== 'constrained') continue;
    const key = [
      decision.parentId,
      parse(decision.target.path).index === null ? decision.target.path : '',
      decision.source.value,
      decision.target.value,
      decision.operation.rule,
    ].join('|');
    conversions.set(key, [...(conversions.get(key) ?? []), decision]);
  }
  const legacy = parents.filter((parent) => parent.schemaVersion !== 3);
  const layers = (Object.keys(layerLabels) as LayerName[]).filter(
    (name) => recipe.layers[name],
  );
  return (
    <section className="work-provenance" aria-labelledby="provenance-heading">
      <h2 id="provenance-heading">Was weiterlebt.</h2>
      <p>
        {work.generation < 3
          ? 'Ursprungswerk – unabhängig generiert. Der gespeicherte Modus wird erst ab Generation 3 als Vererbungsregel angewendet.'
          : contributions.length === 0
            ? 'Vollständige gestalterische Neuschöpfung. Beide Elternwerke wurden ausgewertet; es wird keine sichtbare Übernahme behauptet.'
            : work.inheritanceMode === 'traceable'
              ? 'Beide Eltern tragen nachweisbar sichtbare Merkmale bei. Belegt wird an sichtbaren Formen, nicht an eigenen Belegflächen.'
              : 'Freie Mischung und Veränderung. Nur die gespeicherten Beiträge werden als sichtbare Übernahmen benannt.'}
      </p>
      {legacy.length > 0 && (
        <p className="provenance-note">
          {legacy.length === 2
            ? 'Beide Elternwerke stammen'
            : `Elternteil ${letter(legacy[0]!.id)} stammt`}{' '}
          aus einer früheren Werkversion (Schema {legacy[0]!.schemaVersion}).
          Ältere Elternwerke werden als eine Struktur-Ebene mit Vollfarben
          gelesen; der sichtbare Sprung in der Formensprache ist gewollt. Die
          Belege nennen die Merkmale so, wie das alte Werk sie speichert.
        </p>
      )}
      {contributions.length > 0 && (
        <ol
          className="inheritance-proofs"
          role={decorated ? 'list' : undefined}
        >
          {contributions.map((decision, index) => (
            <li key={index}>
              {badge(decision.parentId)}
              <strong>
                Elternteil {letter(decision.parentId)} ·{' '}
                {traitLabel(decision.target.path)}{' '}
                {decision.operation.kind === 'copy' ? (
                  <>
                    {shown(decision.target.value, decision.target.path)}{' '}
                    übernommen
                  </>
                ) : (
                  <>
                    von {shown(decision.source.value, decision.source.path)} auf{' '}
                    {shown(decision.target.value, decision.target.path)}{' '}
                    verändert
                  </>
                )}
                {place(work, decision.target.path) && (
                  <span className="proof-place">
                    {' '}
                    ({place(work, decision.target.path)})
                  </span>
                )}
              </strong>
              {decorated && <TraitPreview decision={decision} />}
              <details>
                <summary>Beleg ansehen</summary>
                <Proof decision={decision} />
              </details>
            </li>
          ))}
        </ol>
      )}
      {conversions.size > 0 && (
        <>
          <h3 className="conversion-heading">
            Durch Rahmenbedingungen umgewandelt.
          </h3>
          <p>
            Diese Merkmale der Eltern waren für dieses Werk ausgeschlossen und
            wurden in erlaubte umgewandelt. Eine Umwandlung zählt nicht als
            Elternbeitrag.
          </p>
          <ul className="inheritance-proofs conversion-proofs" role="list">
            {[...conversions.values()].map((group, index) => {
              const first = group[0]!;
              const { operation } = first;
              const layer = /^layers\.(\w+)\.family$/.exec(first.target.path);
              return (
                <li key={index}>
                  {badge(first.parentId)}
                  <strong>
                    Elternteil {letter(first.parentId)} ·{' '}
                    {layer
                      ? `Ebene ${layerLabels[layer[1] as LayerName]}`
                      : `${group.length} ${group.length === 1 ? 'Form' : 'Formen'}`}
                    : {traitValue(first.source.value, first.source.path)} →{' '}
                    {traitValue(first.target.value, first.target.path)}
                    {layer ? ' (neu aufgebaut)' : ''},{' '}
                    {operation.kind === 'constrained'
                      ? ruleLabel(operation.rule)
                      : ''}
                    .
                  </strong>
                  <details>
                    <summary>
                      {group.length === 1
                        ? 'Beleg ansehen'
                        : `${group.length} Belege ansehen`}
                    </summary>
                    {group.map((decision, position) => (
                      <Proof key={position} decision={decision} />
                    ))}
                  </details>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <details className="recipe-details">
        <summary>Komposition und Titel nachvollziehen</summary>
        <p>
          {work.generation < 3
            ? 'Alle Ebenen und die Palette wurden neu aufgebaut.'
            : `${layers
                .map(
                  (name) =>
                    `${layerLabels[name]}: ${heritageLabels[recipe.layers[name]!]}`,
                )
                .join(' · ')}. Palette: ${heritageLabels[recipe.palette]}.`}
          {recipe.mutationJump ? ' Mit Mutationssprung.' : ''}
        </p>
        <p>
          Versuch {recipe.retry + 1} von 16. Der Sichtbarkeitsanker{' '}
          {anchorLabels[recipe.anchor]}.
        </p>
        <p>
          {work.titleDna.parentFragments.length
            ? `Elternfragmente im Titel: ${work.titleDna.parentFragments.map((fragment) => `„${fragment.fragment}“`).join(', ')}.`
            : 'Titel vollständig aus dem Lexikon kombiniert.'}
        </p>
      </details>
    </section>
  );
}
