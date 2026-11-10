import { Link } from 'react-router-dom';
import { lazy, Suspense, useState } from 'react';
import type { FormEvent } from 'react';
import rawStudies from '../../fixtures/preview/phase-1.json';
import rawCatalog from '../../fixtures/preview/ep01-catalog.json';
import { catalogSchema } from '../art/schema/catalog';
import {
  previewCollectionSchema,
  familyLabels,
  studyFamilySchema,
} from '../art/schema/preview';
import type { StudyFamily } from '../art/schema/preview';
import { generateStudy } from '../art/generator/study';
import { ArtRenderer } from '../art/renderer/ArtRenderer';
import { ArtStage } from '../art/renderer/ArtStage';

// The 40 origin studies of generator 0.3.0 load after the page itself, so
// the atelier does not wait for their validation.
const OriginStudies = lazy(() => import('./OriginStudies'));
const studies = previewCollectionSchema.parse(rawStudies).studies;
const sheets = catalogSchema.parse(rawCatalog).sheets;
export default function Atelier() {
  const [selected, setSelected] = useState(studies[0]!);
  const [family, setFamily] = useState<StudyFamily>('geometric');
  const [seed, setSeed] = useState(studies[0]!.seed);
  const [error, setError] = useState('');
  function create(event: FormEvent) {
    event.preventDefault();
    try {
      setSelected(generateStudy({ seed, family }));
      setError('');
    } catch {
      setError(
        'Bitte einen Seed mit 1–160 Zeichen und eine unterstützte Familie wählen.',
      );
    }
  }
  return (
    <>
      <p className="eyebrow">Lokales Experiment · Phase 1</p>
      <h1>Testatelier</h1>
      <p className="intro">
        Drei Familien. Viele Möglichkeiten. Erkunde unabhängige
        HTML-/CSS-Studien und vergleiche ihre Formen, Farben und Bewegung.
      </p>
      <p className="atelier-notice">
        Nur Vorschauen – keine offiziellen Werke und keine Kunstabnahme. Beide
        Vererbungsmodi und poetische Titel sind im getrennten Evolutionslabor zu
        sehen.
      </p>
      <Link className="text-link" to="/evolutionslabor">
        Zum Evolutionslabor mit beiden Modi ↗
      </Link>
      <p>
        <Link className="text-link" to="/kunstpruefung">
          40 getrennte Testwerke gemeinsam sichten ↗
        </Link>
      </p>
      <div className="atelier-layout">
        <figure className="atelier-main" aria-label="Aktive Studie">
          <ArtStage key={`${selected.id}:${selected.seed}`} source={selected} />
          <figcaption>
            <strong>{familyLabels[selected.dna.family as StudyFamily]}</strong>
            <span>Seed: {selected.seed}</span>
          </figcaption>
        </figure>
        <div className="atelier-tools">
          <h2>Ein Anfang aus deinem Seed.</h2>
          <p>
            Ein Seed ist ein frei gewähltes Wort oder eine Zeichenfolge.
            Derselbe Seed erzeugt in derselben Familie mit dieser
            Generatorversion immer dieselbe Komposition.
          </p>
          <form onSubmit={create}>
            <label htmlFor="study-family">Kompositionsfamilie</label>
            <select
              id="study-family"
              value={family}
              onChange={(event) =>
                setFamily(studyFamilySchema.parse(event.target.value))
              }
            >
              {studyFamilySchema.options.map((value) => (
                <option key={value} value={value}>
                  {familyLabels[value]}
                </option>
              ))}
            </select>
            <label htmlFor="study-seed">Seed</label>
            <input
              id="study-seed"
              value={seed}
              maxLength={160}
              required
              onChange={(event) => setSeed(event.target.value)}
              autoComplete="off"
            />
            <button className="primary-button" type="submit">
              Studie aus Seed erzeugen <span aria-hidden="true">↗</span>
            </button>
            {error && (
              <p className="notice" role="alert">
                <span className="notice-label">Fehler</span>
                {error}
              </p>
            )}
          </form>
          <dl>
            <div>
              <dt>Generator / Renderer</dt>
              <dd>
                {selected.generatorVersion} / {selected.rendererVersion}
              </dd>
            </div>
            <div>
              <dt>Formen / Darstellung</dt>
              <dd>{selected.dna.elements.length} / HTML + CSS</dd>
            </div>
          </dl>
          <p className="muted">
            Vorschauparameter werden im Browser berechnet. Das offizielle Archiv
            und die globalen Einstellungen werden dabei nicht geändert.
          </p>
        </div>
      </div>
      <section className="atelier-gallery" aria-labelledby="study-heading">
        <div className="atelier-gallery-heading">
          <h2 id="study-heading">Zwölf erste Studien.</h2>
          <p>Gespeicherte DNA · alle Kacheln im festen Ruhezustand</p>
        </div>
        <div className="study-grid">
          {studies.map((study, index) => (
            <button
              type="button"
              className="study-card"
              key={study.id}
              aria-label={`${familyLabels[study.dna.family as StudyFamily]} · Studie ${String(index + 1).padStart(2, '0')}`}
              aria-pressed={selected.id === study.id}
              onClick={() => {
                setSelected(study);
                setSeed(study.seed);
                setFamily(study.dna.family as StudyFamily);
                setError('');
              }}
            >
              <ArtRenderer source={study} />
              <span className="study-card-label">
                <span>
                  {String(index + 1).padStart(2, '0')} /{' '}
                  {familyLabels[study.dna.family as StudyFamily]}
                </span>
                <span aria-hidden="true">↗</span>
              </span>
            </button>
          ))}
        </div>
      </section>
      <section className="atelier-gallery" aria-labelledby="catalog-heading">
        <div className="atelier-gallery-heading">
          <h2 id="catalog-heading">Musterbogen für Renderer 2.</h2>
          <p>EP-01 · von Hand geschrieben · kein Generator, kein Archiv</p>
        </div>
        <div className="catalog-grid">
          {sheets.map((sheet) => (
            <figure className="catalog-sheet" key={sheet.id} id={sheet.id}>
              <ArtStage source={sheet} name={sheet.title} />
              <figcaption>
                <strong>{sheet.title}</strong>
                <span>{sheet.description}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <Suspense fallback={<p role="status">Probewerke werden geladen …</p>}>
        <OriginStudies />
      </Suspense>
    </>
  );
}
