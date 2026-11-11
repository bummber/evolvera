import type { ArtworkV3 } from '../../src/art/schema/artwork-v3';
import { defaultProfile } from '../../src/art/schema/profile';
import { origin } from './artworks';

// Synthetic schema 3 fixtures only: hand-written, not generated, not archived.
const motion = { kind: 'static', durationSeconds: 24, amplitude: 0 } as const;
const box = {
  x: 0.1,
  y: 0.1,
  width: 0.5,
  height: 0.5,
  rotation: 0,
  opacity: 1,
};

export function originV3(generation = 1, id = '2026-10-27'): ArtworkV3 {
  return {
    schemaVersion: 3,
    generatorVersion: '0.3.0',
    rendererVersion: '2',
    lexiconVersion: '0.2.0',
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
    settingsRevision: 7,
    settings: {
      inheritanceMode: 'traceable',
      ...structuredClone(defaultProfile),
    },
    novelty: {
      distanceVersion: 1,
      contextDigest: 'a'.repeat(64),
      distance: null,
      minimumReached: true,
    },
    parentIds: [],
    dna: {
      background: '#101d34',
      layers: {
        background: { family: 'color-field' },
        structure: { family: 'geometric' },
        accent: { family: 'generative' },
      },
      elements: [
        {
          kind: 'rectangle',
          layer: 'background',
          ...box,
          fill: {
            kind: 'linear',
            angle: 45,
            stops: [
              { color: '#e89d56', offset: 0 },
              { color: '#3c47b4', offset: 1 },
            ],
          },
          motion,
        },
        {
          kind: 'polygon',
          layer: 'structure',
          ...box,
          shape: {
            points: [
              { x: 0, y: 1 },
              { x: 0.5, y: 0 },
              { x: 1, y: 1 },
            ],
          },
          fill: { kind: 'solid', color: '#e89d56' },
          motion,
        },
        {
          kind: 'blob',
          layer: 'structure',
          ...box,
          shape: { radii: [0.3, 0.7, 0.5, 0.5, 0.6, 0.4, 0.5, 0.5] },
          fill: {
            kind: 'radial',
            centerX: 0.5,
            centerY: 0.5,
            stops: [
              { color: '#ffffff', offset: 0 },
              { color: '#3c47b4', offset: 0.6 },
              { color: '#101d34', offset: 1 },
            ],
          },
          effects: { blend: 'multiply', blur: 0.01 },
          motion,
        },
        {
          kind: 'arc',
          layer: 'accent',
          ...box,
          shape: { start: 0, sweep: 180, strokeWidth: 0.02 },
          fill: { kind: 'solid', color: '#ffffff' },
          motion,
        },
        {
          kind: 'ring',
          layer: 'accent',
          ...box,
          shape: { strokeWidth: 0.03 },
          fill: {
            kind: 'pattern',
            pattern: 'stripes',
            angle: 30,
            period: 0.05,
            foreground: '#e89d56',
            background: '#101d34',
          },
          effects: {
            shadow: {
              offsetX: 0.01,
              offsetY: 0.01,
              blur: 0.02,
              color: '#000000',
              opacity: 0.4,
            },
            mask: { kind: 'linear', angle: 90, from: 0, to: 1 },
          },
          motion,
        },
        {
          kind: 'path',
          layer: 'accent',
          ...box,
          shape: {
            commands: [
              { op: 'M', x: 0, y: 0.5 },
              { op: 'Q', cx: 0.25, cy: 0, x: 0.5, y: 0.5 },
              { op: 'C', c1x: 0.6, c1y: 1, c2x: 0.9, c2y: 1, x: 1, y: 0.5 },
            ],
            closed: false,
            strokeWidth: 0.01,
          },
          fill: {
            kind: 'conic',
            angle: 0,
            centerX: 0.5,
            centerY: 0.5,
            stops: [
              { color: '#e89d56', offset: 0 },
              { color: '#3c47b4', offset: 1 },
            ],
          },
          motion,
        },
      ],
    },
    titleDna: { tokens: ['Schema'], pattern: 'compound', parentFragments: [] },
    evolution: {
      type: 'origin',
      evaluatedParentIds: [],
      decisions: [],
      recipe: originRecipe(),
    },
  };
}
export function originRecipe(): ArtworkV3['evolution']['recipe'] {
  return {
    retry: 0,
    palette: 'new',
    layers: { background: 'new', structure: 'new', accent: 'new' },
    mutationJump: false,
    features: {
      gradients: true,
      patterns: true,
      masks: true,
      blendModes: true,
      blurShadow: true,
      lines: false,
      curves: true,
      generativeShapes: true,
      animation: false,
      symmetry: false,
    },
    anchor: 'natural',
  };
}

/** A schema 3 child of two old parents (schema 1), as in the first new works. */
export function transitionFamily() {
  const a = origin();
  const b = origin(2, '2026-10-28');
  b.dna.elements[0]!.x = 0.5;
  const child = originV3(3, '2026-10-29');
  child.parentIds = [a.id, b.id];
  child.dna.elements[1]!.x = 0.6;
  child.evolution = {
    type: 'hybrid',
    evaluatedParentIds: [a.id, b.id],
    decisions: [
      {
        parentId: a.id,
        source: { path: 'elements.0.color', value: '#e89d56' },
        target: { path: 'elements.1.fill.color', value: '#e89d56' },
        operation: { kind: 'copy' },
      },
      {
        parentId: b.id,
        source: { path: 'elements.0.x', value: 0.5 },
        target: { path: 'elements.1.x', value: 0.6 },
        operation: { kind: 'offset', amount: 0.1 },
      },
    ],
    recipe: {
      ...originRecipe(),
      palette: 'parentA',
      layers: { background: 'new', structure: 'parentB', accent: 'new' },
    },
  };
  return { a, b, child };
}
