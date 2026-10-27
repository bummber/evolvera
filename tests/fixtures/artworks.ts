import type { Artwork } from '../../src/art/schema/artwork';

// Synthetic schema fixtures only: no preview collection, generated art or official series.
export function origin(generation = 1, id = '2026-10-27'): Artwork {
  return {
    schemaVersion: 1,
    generatorVersion: '0.0.0',
    rendererVersion: '1',
    lexiconVersion: '0.0.0',
    id,
    generation,
    title: 'Schema-Prüfdatensatz',
    description: 'Synthetischer Datensatz ausschließlich für die Datenprüfung.',
    timezone: 'Europe/Berlin',
    scheduledFor: `${id}T04:00:00+01:00`,
    generatedAt: `${id}T03:00:02Z`,
    runStartedAt: `${id}T03:00:01Z`,
    isCatchUp: false,
    seed: 'schema-only',
    inheritanceMode: 'traceable',
    settingsRevision: 1,
    parentIds: [],
    dna: {
      family: 'geometric',
      background: '#101d34',
      elements: [
        {
          kind: 'circle',
          x: 0.2,
          y: 0.3,
          width: 0.4,
          height: 0.4,
          rotation: 0,
          color: '#e89d56',
          opacity: 1,
          motion: { kind: 'static', durationSeconds: 24, amplitude: 0 },
        },
      ],
    },
    titleDna: { tokens: ['Schema'] },
    evolution: { type: 'origin', evaluatedParentIds: [], decisions: [] },
  };
}
export function family() {
  const a = origin();
  const b = origin(2, '2026-10-28');
  b.dna.elements[0]!.x = 0.5;
  const child = origin(3, '2026-10-29');
  child.parentIds = [a.id, b.id];
  child.dna.elements[0]!.x = 0.6;
  child.evolution = {
    type: 'hybrid',
    evaluatedParentIds: [a.id, b.id],
    decisions: [
      {
        parentId: a.id,
        source: { path: 'elements.0.color', value: a.dna.elements[0]!.color },
        target: {
          path: 'elements.0.color',
          value: child.dna.elements[0]!.color,
        },
        operation: { kind: 'copy' },
      },
      {
        parentId: b.id,
        source: { path: 'elements.0.x', value: 0.5 },
        target: { path: 'elements.0.x', value: 0.6 },
        operation: { kind: 'offset', amount: 0.1 },
      },
    ],
  };
  return { a, b, child };
}
