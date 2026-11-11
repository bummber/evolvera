import { useState, type KeyboardEvent } from 'react';
import rawChains from '../../fixtures/preview/ep01-chains.json';
import { chainCollectionV3Schema } from '../art/schema/chains-v3';
import { ArtDispatch } from '../art/renderer/ArtDispatch';
import { ArtStage } from '../art/renderer/ArtStage';
import type { ArtworkV3 } from '../art/schema/artwork-v3';

// EP-01 P4: stored preview chains of generator 0.3.0. Preview only; nothing
// is generated here and nothing reaches the official archive.
const chains = chainCollectionV3Schema.parse(rawChains).chains;
const chainLabels: Record<string, string> = {
  traceable: 'Nachvollziehbare Vererbung',
  free: 'Maximale Freiheit',
  transition: 'Übergang von alten Elternwerken',
};
const heritageLabels = {
  new: 'neu',
  parentA: 'älteres Elternwerk',
  parentB: 'jüngeres Elternwerk',
  mixed: 'gemischt',
} as const;
const layerLabels = {
  background: 'Hintergrund',
  structure: 'Struktur',
  accent: 'Akzent',
} as const;
const cardId = (key: string, work: ArtworkV3) =>
  `ep01-chain-${key}-${work.generation}`;

function Evidence({ work }: { work: ArtworkV3 }) {
  const { decisions, recipe } = work.evolution;
  const contributions = decisions.filter(
    (decision) => decision.operation.kind !== 'constrained',
  );
  const converted = decisions.length - contributions.length;
  const layers = (['background', 'structure', 'accent'] as const)
    .filter((name) => recipe.layers[name])
    .map(
      (name) => `${layerLabels[name]}: ${heritageLabels[recipe.layers[name]!]}`,
    );
  return (
    <dl className="chainv3-facts">
      <div>
        <dt>Eltern</dt>
        <dd>
          {work.parentIds.length ? work.parentIds.join(' und ') : 'keine'}
        </dd>
      </div>
      <div>
        <dt>Ebenen</dt>
        <dd>{layers.join(' · ')}</dd>
      </div>
      <div>
        <dt>Palette</dt>
        <dd>
          {heritageLabels[recipe.palette]}
          {recipe.mutationJump ? ' · Mutationssprung' : ''}
        </dd>
      </div>
      <div>
        <dt>Sichtbare Belege</dt>
        <dd>
          {work.parentIds.length === 0
            ? 'Ursprungswerk'
            : work.parentIds
                .map(
                  (id) =>
                    `${id}: ${contributions.filter((decision) => decision.parentId === id).length}`,
                )
                .join(' · ')}
          {converted ? ` · ${converted} Umwandlungen` : ''}
        </dd>
      </div>
    </dl>
  );
}

/** Arrow keys, Home and End move the focus between the works of a chain. */
function moveWithin(event: KeyboardEvent<HTMLButtonElement>) {
  const cards = [
    ...event.currentTarget.parentElement!.querySelectorAll<HTMLButtonElement>(
      'button.chainv3-card',
    ),
  ];
  const index = cards.indexOf(event.currentTarget);
  const next =
    event.key === 'ArrowRight' || event.key === 'ArrowDown'
      ? index + 1
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
        ? index - 1
        : event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? cards.length - 1
            : -1;
  if (next < 0 || next >= cards.length) return;
  event.preventDefault();
  cards[next]!.focus();
}

export default function EvolutionChains() {
  const [active, setActive] = useState({ chain: 0, work: 0 });
  const chain = chains[active.chain]!;
  const selected = chain.works[active.work]!;
  const name = `Generation ${selected.generation}`;
  return (
    <section className="atelier-gallery" aria-labelledby="chains-heading">
      <div className="atelier-gallery-heading">
        <h2 id="chains-heading">Probeketten von Generator 0.3.0.</h2>
        <p>
          EP-01 · Standardprofil · Vererbung mit sichtbaren Belegen · kein
          Archiv · Pfeiltasten wechseln innerhalb einer Kette
        </p>
      </div>
      <figure className="chainv3-main" aria-label="Aktives Kettenwerk">
        <ArtStage
          key={cardId(chain.key, selected)}
          source={selected}
          name={name}
        />
        <figcaption>
          <strong>{selected.title}</strong>
          <span>
            {chainLabels[chain.key] ?? chain.key} · {name}
          </span>
          <span className="chainv3-description">{selected.description}</span>
          <Evidence work={selected} />
        </figcaption>
      </figure>
      {chains.map((entry, chainIndex) => (
        <div className="chainv3-chain" key={entry.key}>
          <h3>{chainLabels[entry.key] ?? entry.key}</h3>
          <div className="chainv3-grid">
            {entry.legacyParents.map((parent) => (
              <figure className="chainv3-legacy" key={parent.id}>
                <ArtDispatch source={parent} />
                <figcaption className="chainv3-card-label">
                  <span>Gen. {parent.generation} · altes Elternwerk</span>
                </figcaption>
              </figure>
            ))}
            {entry.works.map((work, workIndex) => (
              <button
                type="button"
                className="chainv3-card"
                key={work.id}
                id={cardId(entry.key, work)}
                aria-label={`${chainLabels[entry.key] ?? entry.key}: Generation ${work.generation}, ${work.title}`}
                aria-pressed={
                  active.chain === chainIndex && active.work === workIndex
                }
                // One tab stop per chain; arrow keys move within it.
                tabIndex={
                  workIndex === (active.chain === chainIndex ? active.work : 0)
                    ? 0
                    : -1
                }
                onKeyDown={moveWithin}
                onClick={() =>
                  setActive({ chain: chainIndex, work: workIndex })
                }
              >
                <ArtDispatch source={work} />
                <span className="chainv3-card-label">
                  <span>
                    Gen. {work.generation} · {work.title}
                  </span>
                  <span aria-hidden="true">↗</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
