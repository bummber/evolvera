import { useState } from 'react';
import { Link } from 'react-router-dom';
import rawChains from '../../fixtures/preview/phase-2.json';
import { validatePreviewChain } from '../art/generator/preview-chain';
import { modeLabels, modeSchema } from '../art/schema/config';
import type { InheritanceMode } from '../art/schema/config';
import { ArtRenderer } from '../art/renderer/ArtRenderer';
import { ArtStage } from '../art/renderer/ArtStage';

const chains = rawChains.chains.map(validatePreviewChain);
const percent = (value: string | number) =>
  (Number(value) * 100).toLocaleString('de-DE', { maximumFractionDigits: 4 });
export default function EvolutionLab() {
  const [mode, setMode] = useState<InheritanceMode>('traceable');
  const [generation, setGeneration] = useState(3);
  const chain = chains.find((candidate) => candidate.inheritanceMode === mode)!;
  const work = chain.works[generation - 1]!;
  const parents = work.parentIds.map((id) =>
    chain.works.find((candidate) => candidate.id === id)!,
  );
  const noParentTraits =
    work.evolution.recipe.base.source === 'new' &&
    work.evolution.decisions.length === 0;
  return (
    <>
      <p className="eyebrow">Getrennte Beispielketten · Phase 2</p>
      <h1>Evolutionslabor</h1>
      <p className="intro">
        Zwei Ursprünge. Danach Verwandlung. Vergleiche Eltern und Kind in zwei
        reproduzierbaren Ketten mit jeweils zehn Werken.
      </p>
      <p className="atelier-notice">
        20 Beispielwerke aus der abgenommenen Testsammlung – keine offizielle
        Serie. Die Datumswerte 01.–10.01.2000 sind simulierte Testmetadaten.
      </p>
      <div className="chain-controls">
        <label htmlFor="chain-mode">Beispielmodus</label>
        <select
          id="chain-mode"
          value={mode}
          onChange={(event) => {
            setMode(modeSchema.parse(event.target.value));
            setGeneration(3);
          }}
        >
          <option value="traceable">Nachvollziehbare Vererbung</option>
          <option value="free">Maximale Freiheit</option>
        </select>
        <span>Die Auswahl ändert keine Betreibereinstellung.</span>
      </div>
      <nav
        className="generation-strip"
        aria-label="Generation der Beispielkette"
      >
        {chain.works.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            aria-label={`Generation ${candidate.generation}`}
            aria-pressed={generation === candidate.generation}
            onClick={() => setGeneration(candidate.generation)}
          >
            {String(candidate.generation).padStart(2, '0')}
          </button>
        ))}
      </nav>
      <div className="evolution-layout">
        <div>
          <figure className="evolution-main">
            <ArtStage key={`${mode}:${work.id}`} source={work} />
            <figcaption>
              <span>Generation {generation}</span>
              <h2>{work.title}</h2>
              <p>
                {modeLabels[work.inheritanceMode]} · Einstellungsrevision{' '}
                {work.settingsRevision}
              </p>
            </figcaption>
          </figure>
          <div className="chain-steps">
            <button
              type="button"
              disabled={generation === 1}
              onClick={() => setGeneration((current) => current - 1)}
            >
              ← Vorheriges Werk
            </button>
            <button
              type="button"
              disabled={generation === 10}
              onClick={() => setGeneration((current) => current + 1)}
            >
              Nächstes Werk →
            </button>
          </div>
        </div>
        <aside
          className="evolution-report"
          aria-label="Herkunft des Beispielwerks"
        >
          <h2>
            {generation < 3
              ? 'Ein unabhängiger Ursprung.'
              : 'Aus zwei Vorgängern.'}
          </h2>
          {generation < 3 ? (
            <p>
              Ursprungswerk – unabhängig generiert. Der gespeicherte Modus wird
              erst ab Generation 3 als Vererbungsregel angewendet.
            </p>
          ) : (
            <>
              <div className="parent-studies">
                {parents.map((parent, index) => (
                  <button
                    type="button"
                    className="study-card"
                    key={parent.id}
                    aria-label={`Elternteil ${index === 0 ? 'A' : 'B'}: Generation ${parent.generation}`}
                    onClick={() => setGeneration(parent.generation)}
                  >
                    <ArtRenderer source={parent} />
                    <span className="study-card-label">
                      {index === 0 ? 'A' : 'B'} / Generation {parent.generation}
                    </span>
                    <span className="parent-title">{parent.title}</span>
                  </button>
                ))}
              </div>
              <p>
                {noParentTraits
                  ? 'Vollständige gestalterische Neuschöpfung. Beide Eltern-DNA wurden ausgewertet; es wird keine Übernahme behauptet.'
                  : mode === 'traceable'
                    ? 'Beide Eltern tragen mindestens ein nachweisbar sichtbares Merkmal bei. Es gibt keine feste prozentuale Aufteilung.'
                    : 'Freie Mischung und Veränderung. Nur die folgenden Einzelbeiträge werden als sichtbare Übernahmen belegt.'}
              </p>
              <ol className="inheritance-proofs">
                {work.evolution.decisions.map((decision, index) => (
                  <li key={index}>
                    <strong>
                      Elternteil{' '}
                      {decision.parentId === work.parentIds[0] ? 'A' : 'B'} ·{' '}
                      {decision.target.path.endsWith('.color')
                        ? `Farbe ${decision.target.value} übernommen`
                        : `Breite von ${percent(decision.source.value)} % auf ${percent(decision.target.value)} % ${decision.operation.kind === 'copy' ? 'übernommen' : 'verändert'}`}
                    </strong>
                    <details>
                      <summary>Werte prüfen</summary>
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
            </>
          )}
          <details className="recipe-details">
            <summary>Komposition und Titel nachvollziehen</summary>
            <p>
              Rezeptbasis:{' '}
              {work.evolution.recipe.base.source === 'new'
                ? 'neu erzeugt'
                : work.evolution.recipe.base.source === 'parentA'
                  ? 'Elternteil A'
                  : 'Elternteil B'}
              . {work.evolution.recipe.mutations.length} Parameteränderungen;{' '}
              {work.evolution.recipe.additions.length} ergänzte HTML-Formen
              einschließlich Freistellungen.
            </p>
            <p>
              Titelmuster: {work.titleDna.pattern}.{' '}
              {work.titleDna.parentFragments.length
                ? `Elternfragmente: ${work.titleDna.parentFragments.map((item) => `„${item.fragment}“`).join(', ')}.`
                : 'Titel vollständig aus dem Lexikon kombiniert.'}
            </p>
            <p>
              Generator {work.generatorVersion} · Lexikon {work.lexiconVersion}{' '}
              · Renderer {work.rendererVersion} · Schema {work.schemaVersion}
            </p>
            <p className="seed-value">Seed: {work.seed}</p>
          </details>
        </aside>
      </div>
      <p className="muted">
        Die historischen Daten werden beim Wechsel nicht neu gewürfelt. Der
        Renderer liest ausschließlich die gespeicherten Endparameter.
      </p>
      <Link className="text-link" to="/atelier">
        Zum unabhängigen Testatelier ↗
      </Link>
    </>
  );
}
