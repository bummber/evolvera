import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { AnyArtwork } from '../art/schema/artwork-v3';
import type { ArchiveReader } from '../archive/reader';
import { collectionLink } from '../archive/reader';
import { ArtDispatch } from '../art/renderer/ArtDispatch';

/** A view of the already validated context, not a new ancestry calculation. */
export function EvolutionBraid({
  reader,
  work,
  parents,
}: {
  reader: ArchiveReader;
  work: AnyArtwork;
  parents: AnyArtwork[];
}) {
  const nodes = [work, ...parents].toSorted(
    (a, b) => b.generation - a.generation,
  );
  const selectedIndex = nodes.findIndex((node) => node.id === work.id);
  return (
    <section className="evolution-lineage" aria-labelledby="lineage-heading">
      <div className="lineage-heading">
        <h2 id="lineage-heading">Herkunft im Zusammenhang.</h2>
        <p>Ausgewähltes Werk und seine gespeicherten Eltern</p>
      </div>
      <ul
        className="lineage-legend"
        aria-label="Legende der Elternzuordnung"
        role="list"
      >
        <li>
          <span className="lineage-key lineage-a" aria-hidden="true" />A ·
          erster gespeicherter Elternteil
        </li>
        <li>
          <span className="lineage-key lineage-b" aria-hidden="true" />B ·
          zweiter gespeicherter Elternteil
        </li>
      </ul>
      <div
        className="lineage-scroll"
        role="region"
        aria-label="Abstammung des ausgewählten Werks"
        tabIndex={0}
      >
        <div
          className="lineage-track"
          style={{ '--node-count': nodes.length } as CSSProperties}
        >
          <div className="lineage-lines" aria-hidden="true">
            {parents.map((parent) => {
              const targetIndex = nodes.findIndex(
                (node) => node.id === parent.id,
              );
              const parentIndex = work.parentIds.indexOf(parent.id);
              return (
                <span
                  key={parent.id}
                  className={`lineage-edge lineage-${parentIndex === 0 ? 'a' : 'b'} ${Math.abs(targetIndex - selectedIndex) === 1 ? 'lineage-straight' : 'lineage-arc'}`}
                  style={
                    {
                      '--edge-start': Math.min(selectedIndex, targetIndex),
                      '--edge-length': Math.abs(targetIndex - selectedIndex),
                    } as CSSProperties
                  }
                />
              );
            })}
          </div>
          <ol className="lineage-nodes" role="list">
            {nodes.map((node) => {
              const selected = node.id === work.id;
              const parent = work.parentIds.indexOf(node.id);
              return (
                <li
                  key={node.id}
                  className={selected ? 'lineage-selected' : undefined}
                >
                  <Link
                    to={collectionLink(`/werk/${node.id}`, reader.key)}
                    aria-label={`${selected ? 'Ausgewähltes Werk' : `Elternteil ${parent === 0 ? 'A' : 'B'}`} · Generation ${node.generation}: ${node.title}`}
                    aria-current={selected ? 'true' : undefined}
                  >
                    <span className="lineage-preview" aria-hidden="true">
                      <ArtDispatch source={node} />
                    </span>
                    <span className="lineage-label">
                      <span className="lineage-generation">
                        Generation {node.generation} ·{' '}
                        <time dateTime={node.id}>{node.id}</time>
                      </span>
                      <strong>{node.title}</strong>
                      <span>
                        {selected
                          ? 'Ausgewähltes Werk'
                          : `Elternteil ${parent === 0 ? 'A' : 'B'}`}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <p className="lineage-note">
        {work.generation < 3
          ? 'Generation 1 und 2 sind unabhängige Ursprungswerke. Dieses Werk hat keine Eltern.'
          : 'Die Linien verbinden das ausgewählte Werk mit seinen tatsächlichen Eltern. Deren weitere Herkunft ist über die Werklinks erreichbar; Generation 1 und 2 sind unabhängige Ursprungswerke.'}
      </p>
    </section>
  );
}
