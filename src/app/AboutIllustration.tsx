import { modeLabels } from '../art/schema/config';

/** Explanatory diagrams only: no generated artwork or simulated archive data. */
export function AboutIllustration({
  chapter,
}: {
  chapter: 'material' | 'origins' | 'modes' | 'history';
}) {
  if (chapter === 'material')
    return (
      <figure className="chapter-illustration material-study">
        <figcaption>Das Material</figcaption>
        <div className="material-chips">
          {['HTML', 'CSS', 'Formen', 'Farben', 'Verläufe', 'Bewegung'].map(
            (label) => (
              <span key={label}>{label}</span>
            ),
          )}
        </div>
        <div className="excluded-chips">
          {['Bilddateien', 'SVG', 'Canvas', 'WebGL'].map((label) => (
            <span key={label}>
              <span aria-hidden="true">× </span>
              {label}
            </span>
          ))}
        </div>
      </figure>
    );
  if (chapter === 'origins')
    return (
      <figure className="chapter-illustration origin-study">
        <figcaption>
          Das Prinzip der ersten Generationen · keine Werkvorschauen
        </figcaption>
        <div className="origin-pair">
          <div>
            <strong>01</strong>
            <span>Unabhängiger Ursprung</span>
          </div>
          <div>
            <strong>02</strong>
            <span>Unabhängiger Ursprung</span>
          </div>
        </div>
        <div className="origin-join" aria-hidden="true" />
        <div className="origin-child">
          <strong>03</strong>
          <span>Erstes Werk mit zwei Eltern</span>
        </div>
      </figure>
    );
  if (chapter === 'modes')
    return (
      <figure className="chapter-illustration mode-study">
        <figcaption>Zwei Regeln für kommende Werke</figcaption>
        <dl>
          <div>
            <dt>{modeLabels.traceable}</dt>
            <dd>Sichtbare Beiträge beider Eltern</dd>
          </div>
          <div>
            <dt>{modeLabels.free}</dt>
            <dd>Ein vollständiger Bruch ist möglich</dd>
          </div>
        </dl>
      </figure>
    );
  return (
    <figure className="chapter-illustration history-study">
      <figcaption>Prinzip einer Nachholung · keine Serientermine</figcaption>
      <ol role="list">
        <li>Vorgesehenes Werkdatum</li>
        <li>
          Später erstellt <span className="badge badge-accent">Nachgeholt</span>
        </li>
        <li>Dauerhaft im Archiv erhalten</li>
      </ol>
    </figure>
  );
}
