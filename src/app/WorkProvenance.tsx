import type { Artwork } from '../art/schema/artwork';
const percent = (value: string | number) =>
  (Number(value) * 100).toLocaleString('de-DE', { maximumFractionDigits: 4 });
const labels: Record<string, string> = {
  background: 'Hintergrundfarbe',
  color: 'Farbe',
  x: 'Horizontale Position',
  y: 'Vertikale Position',
  width: 'Breite',
  height: 'Höhe',
  rotation: 'Drehung',
  opacity: 'Deckkraft',
};
const field = (path: string) => path.split('.').at(-1)!;
const traitValue = (value: string | number, path: string) =>
  typeof value === 'string'
    ? value
    : field(path) === 'rotation'
      ? `${value}°`
      : `${percent(value)} %`;
export function WorkProvenance({ work }: { work: Artwork }) {
  const fresh =
    work.schemaVersion === 2 &&
    work.evolution.recipe.base.source === 'new' &&
    work.evolution.decisions.length === 0;
  return (
    <section className="work-provenance" aria-labelledby="provenance-heading">
      <h2 id="provenance-heading">Was weiterlebt.</h2>
      <p>
        {work.generation < 3
          ? 'Ursprungswerk – unabhängig generiert. Der gespeicherte Modus wird erst ab Generation 3 als Vererbungsregel angewendet.'
          : fresh
            ? 'Vollständige gestalterische Neuschöpfung. Beide Eltern-DNA wurden ausgewertet; es wird keine sichtbare Übernahme behauptet.'
            : work.inheritanceMode === 'traceable'
              ? 'Beide Eltern tragen nachweisbar sichtbare Merkmale bei. Es gibt keine feste prozentuale Aufteilung.'
              : 'Freie Mischung und Veränderung. Nur die gespeicherten Beiträge werden als sichtbare Übernahmen benannt.'}
      </p>
      {work.evolution.decisions.length > 0 && (
        <ol className="inheritance-proofs">
          {work.evolution.decisions.map((decision, index) => (
            <li key={index}>
              <strong>
                Elternteil {decision.parentId === work.parentIds[0] ? 'A' : 'B'}{' '}
                · {labels[field(decision.target.path)] ?? 'Merkmal'}{' '}
                {decision.operation.kind === 'copy'
                  ? `${traitValue(decision.target.value, decision.target.path)} übernommen`
                  : `von ${traitValue(decision.source.value, decision.source.path)} auf ${traitValue(decision.target.value, decision.target.path)} verändert`}
              </strong>
              <details>
                <summary>Beleg ansehen</summary>
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
                      {decision.operation.kind === 'copy'
                        ? 'Kopie'
                        : `Offset ${decision.operation.amount}`}
                    </dd>
                  </div>
                </dl>
              </details>
            </li>
          ))}
        </ol>
      )}
      {work.schemaVersion === 2 && (
        <details className="recipe-details">
          <summary>Komposition und Titel nachvollziehen</summary>
          <p>
            Ausgangskomposition:{' '}
            {work.evolution.recipe.base.source === 'new'
              ? 'neu erzeugt'
              : `Elternteil ${work.evolution.recipe.base.source === 'parentA' ? 'A' : 'B'}`}
            . {work.evolution.recipe.mutations.length} gespeicherte
            Parameteränderungen; {work.evolution.recipe.additions.length}{' '}
            ergänzte Formen einschließlich Freistellungen.
          </p>
          <p>
            {work.titleDna.parentFragments.length
              ? `Elternfragmente im Titel: ${work.titleDna.parentFragments.map((fragment) => `„${fragment.fragment}“`).join(', ')}.`
              : 'Titel vollständig aus dem Lexikon kombiniert.'}
          </p>
        </details>
      )}
    </section>
  );
}
