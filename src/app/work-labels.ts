import type { Profile } from '../art/schema/profile';

// Display texts for schema 3 works (EP-01 P6). View only: the stored work
// stays the source, nothing here is written back.
export const layerLabels = {
  background: 'Hintergrund',
  structure: 'Struktur',
  accent: 'Akzent',
} as const;
export const familyLabels: Record<string, string> = {
  geometric: 'Geometrische Konstellation',
  'color-field': 'Farbfeld',
  mosaic: 'Mosaik',
  organic: 'Organische Formen',
  generative: 'Generative Struktur',
  chaotic: 'Chaotische Überlagerung',
  kinetic: 'Kinetische Komposition',
};
export const heritageLabels = {
  new: 'neu aufgebaut',
  parentA: 'von Elternteil A',
  parentB: 'von Elternteil B',
  mixed: 'aus beiden Eltern gemischt',
} as const;
export const frequencyLabels = {
  off: 'Aus',
  rare: 'Selten',
  normal: 'Normal',
  often: 'Häufig',
  always: 'Immer',
} as const;
export const featureLabels: Record<keyof Profile['features'], string> = {
  gradients: 'Verläufe',
  patterns: 'Muster',
  masks: 'Masken',
  blendModes: 'Blendmodi',
  blurShadow: 'Schatten und Unschärfe',
  lines: 'Linien',
  curves: 'Kurven und Bögen',
  generativeShapes: 'Generative Formen',
  animation: 'Bewegung',
};
export const strategyLabels = {
  harmonic: 'harmonisch',
  complementary: 'komplementär',
  monochrome: 'monochrom',
  free: 'frei',
} as const;
export const strengthLabels = {
  calm: 'Ruhig',
  medium: 'Mittel',
  high: 'Hoch',
  wild: 'Wild',
} as const;
export const contrastLabels = {
  low: 'Niedrig',
  varied: 'Wechselnd',
  high: 'Hoch',
} as const;
export const densityLabels = {
  sparse: 'Locker',
  varied: 'Wechselnd',
  dense: 'Dicht',
} as const;
export const intensityLabels = {
  subtle: 'Dezent',
  varied: 'Wechselnd',
  strong: 'Kräftig',
} as const;
/** Stored enumeration values of forms, fills and families in plain words. */
export const valueLabels: Record<string, string> = {
  rectangle: 'Rechteck',
  circle: 'Kreis',
  ellipse: 'Ellipse',
  line: 'Linie',
  arc: 'Bogen',
  ring: 'Ring',
  polygon: 'Polygon',
  blob: 'weiche Form',
  path: 'Kurve',
  solid: 'Vollfarbe',
  linear: 'linearer Verlauf',
  radial: 'radialer Verlauf',
  conic: 'konischer Verlauf',
  pattern: 'Muster',
};
