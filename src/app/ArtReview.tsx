import { Link } from 'react-router-dom';
import { reviewChains } from '../preview/review';
import { modeLabels } from '../art/schema/config';
import { collectionLink } from '../archive/reader';
import { ArtRenderer } from '../art/renderer/ArtRenderer';

export default function ArtReview() {
  return (
    <>
      <p className="eyebrow">Gemeinsame Sichtung · Phase 3</p>
      <h1>
        Was bleibt.
        <br />
        Was bricht.
      </h1>
      <p className="intro">
        40 getrennte Testwerke. Zwei Wege, aus Vorgängern etwas Neues zu machen.
        Erkunde die Ketten und ihre Unterschiede.
      </p>
      <p className="atelier-notice">
        Die Kunstabnahme ist offen. Diese Sammlung startet keine offizielle
        Serie und wird nicht in deren Archiv übernommen. Alle Datums- und
        Zeitangaben im Januar 2000 sind simuliert.
      </p>
      <div className="review-collections">
        {reviewChains.map((chain) => {
          const work = chain.works.at(-1)!;
          return (
            <section key={chain.inheritanceMode}>
              <Link
                className="review-cover"
                to={collectionLink('/galerie', chain.inheritanceMode)}
              >
                <ArtRenderer source={work} />
                <span className="eyebrow">20 Werke · Generation 1–20</span>
                <h2>{modeLabels[chain.inheritanceMode]}</h2>
              </Link>
              <p>
                {chain.inheritanceMode === 'traceable'
                  ? 'Ab Generation 3 trägt jeder Elternteil sichtbare, belegte Merkmale bei. Wie viel sich verändert, bleibt offen.'
                  : 'Beide Eltern werden ausgewertet. Ein vollständiger gestalterischer Neuanfang ist erlaubt.'}
              </p>
              <div className="hero-actions">
                <Link
                  className="primary-link"
                  to={collectionLink('/galerie', chain.inheritanceMode)}
                >
                  Sammlung durchsehen ↗
                </Link>
                <Link
                  className="text-link"
                  to={collectionLink('/', chain.inheritanceMode)}
                >
                  Letztes Testwerk
                </Link>
              </div>
            </section>
          );
        })}
      </div>
      <section className="reading review-questions">
        <h2>Worauf wir gemeinsam schauen.</h2>
        <ul>
          <li>
            Wirken die Werke ausreichend verschieden – in Farbe, Dichte,
            Komposition und Bewegung?
          </li>
          <li>
            Sind in „Nachvollziehbare Vererbung“ die Beiträge beider Eltern
            erkennbar und die Belege verständlich?
          </li>
          <li>Erlaubt „Maximale Freiheit“ überraschende Stilbrüche?</li>
          <li>
            Bleibt die Kunst auf Smartphone und Desktop sichtbar und die
            Navigation angenehm?
          </li>
        </ul>
        <p>
          Deine ausdrückliche Abnahme gilt später den Generatorregeln und ihrer
          Bandbreite. Einzelne Lieblingswerke auszuwählen ist dafür nicht nötig.
        </p>
      </section>
      <div className="hero-actions">
        <Link className="text-link" to="/atelier">
          Zum unabhängigen Testatelier ↗
        </Link>
        <Link className="text-link" to="/evolutionslabor">
          Zum bisherigen Zehnervergleich ↗
        </Link>
        <Link className="text-link" to="/">
          Zum offiziellen Bereich
        </Link>
      </div>
    </>
  );
}
