import { useState } from 'react';
import rawOrigins from '../../fixtures/preview/ep01-origins.json';
import { ArtDispatch } from '../art/renderer/ArtDispatch';
import { ArtStage } from '../art/renderer/ArtStage';
import { originCollectionSchema } from '../art/schema/preview-v3';

// EP-01 P3: stored origin studies of generator 0.3.0. Preview only; nothing
// is generated here and nothing reaches the official archive.
const origins = originCollectionSchema.parse(rawOrigins).studies;
const label = (index: number) =>
  `Probewerk ${String(index + 1).padStart(2, '0')}`;

export default function OriginStudies() {
  const [active, setActive] = useState(0);
  const selected = origins[active]!;
  return (
    <section className="atelier-gallery" aria-labelledby="origins-heading">
      <div className="atelier-gallery-heading">
        <h2 id="origins-heading">
          {origins.length} Ursprungswerke von Generator 0.3.0.
        </h2>
        <p>
          EP-01 · Standardprofil · fortlaufende Seeds ohne Auswahl · kein Archiv
        </p>
      </div>
      <figure className="origin-main" aria-label="Aktives Probewerk">
        <ArtStage key={selected.id} source={selected} name={label(active)} />
        <figcaption>
          <strong>{label(active)}</strong>
          <span>
            Generator {selected.generatorVersion} / Renderer{' '}
            {selected.rendererVersion} · Versuch {selected.retry + 1}
          </span>
          <span className="origin-description">{selected.description}</span>
        </figcaption>
      </figure>
      <div className="origin-grid">
        {origins.map((study, index) => (
          <button
            type="button"
            className="origin-card"
            key={study.id}
            id={study.id}
            aria-label={label(index)}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <ArtDispatch source={study} />
            <span className="origin-card-label">
              <span>{label(index)}</span>
              <span aria-hidden="true">↗</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
