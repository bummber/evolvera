import { layerNames, type ArtworkV3 } from '../art/schema/artwork-v3';
import { familyLabels, layerLabels } from './work-labels';

/**
 * Stored description of a schema 3 work and its layers as read from the DNA
 * (EP-01 P6). Older works keep their views without this block.
 */
export function WorkComposition({ work }: { work: ArtworkV3 }) {
  const layers = layerNames.filter((name) => work.dna.layers[name]);
  return (
    <section className="work-composition" aria-label="Werkbeschreibung">
      <p>{work.description}</p>
      <h2>Aufbau</h2>
      <ul role="list">
        {layers.map((name) => {
          const count = work.dna.elements.filter(
            (element) => element.layer === name,
          ).length;
          return (
            <li key={name}>
              <span>{layerLabels[name]}</span>
              {familyLabels[work.dna.layers[name]!.family]} · {count}{' '}
              {count === 1 ? 'Form' : 'Formen'}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
