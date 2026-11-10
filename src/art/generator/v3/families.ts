import type { Profile } from '../../schema/profile';
import { solid } from './fills';
import { gradient } from './fills';
import { clamp, MIN_STROKE, type ElementKind, type Layer } from './kit';

// The six generating families of generator 0.3.0. Each draws one layer; the
// layer context limits kinds, fills and load to what the work allows.

export type Family = keyof Profile['families'];

/** Kinds a family may use in addition to rectangles, circles and ellipses. */
function optionalKinds(layer: Layer): ElementKind[] {
  const { flags } = layer;
  return [
    ...(flags.lines ? (['line'] as const) : []),
    ...(flags.curves ? (['arc', 'ring'] as const) : []),
    ...(flags.generativeShapes ? (['polygon'] as const) : []),
  ];
}

/** Constellation: one dominant form next to small parts (scale contrast). */
function geometric(layer: Layer) {
  const r = layer.random;
  const kinds: ElementKind[] = [
    'rectangle',
    'circle',
    'ellipse',
    ...optionalKinds(layer),
  ];
  if (layer.role !== 'accent' && r.next() < 0.7) {
    const kind = r.pick(kinds.filter((k) => k !== 'line' && k !== 'ellipse'));
    const size = r.between(0.42, 0.68);
    layer.add(
      layer.shape(
        kind,
        r.between(0.32, 0.68),
        r.between(0.32, 0.68),
        size,
        size,
        {
          rotation:
            kind === 'rectangle' || kind === 'polygon'
              ? r.pick([0, 0, 15, 30, 45] as const)
              : 0,
        },
      ),
    );
  }
  const count = layer.count(4, 16);
  // Half of the works align their small parts to a loose grid.
  const snap = r.next() < 0.5 ? r.integer(4, 7) : 0;
  const at = () => {
    const value = r.between(0.1, 0.9);
    return snap ? (Math.floor(value * snap) + 0.5) / snap : value;
  };
  for (let index = 0; index < count; index++) {
    const kind = r.pick(kinds);
    if (kind === 'line')
      layer.add(
        layer.shape(
          kind,
          at(),
          at(),
          r.between(0.15, 0.5),
          r.between(MIN_STROKE, 0.018),
          {
            rotation: r.integer(0, 11) * 15,
          },
        ),
      );
    else {
      const size = r.between(0.045, 0.2);
      layer.add(
        layer.shape(
          kind,
          at(),
          at(),
          size,
          kind === 'ellipse' || kind === 'rectangle'
            ? r.between(0.045, 0.24)
            : size,
          {
            rotation:
              kind === 'circle' || kind === 'ring' ? 0 : r.integer(-6, 6) * 15,
          },
        ),
      );
    }
  }
}

/** Colour fields: full bands or stacked fields with a margin. */
function colorField(layer: Layer) {
  const r = layer.random;
  const vertical = r.next() < 0.5;
  const band = (start: number, size: number, inset = 0) =>
    vertical
      ? layer.shape('rectangle', start + size / 2, 0.5, size, 1 - 2 * inset)
      : layer.shape('rectangle', 0.5, start + size / 2, 1 - 2 * inset, size);
  if (layer.role === 'accent') {
    const count = r.integer(1, 2);
    for (let index = 0; index < count; index++)
      layer.add(band(r.between(0.1, 0.8), r.between(0.03, 0.1)));
    return;
  }
  const weights = Array.from({ length: r.integer(2, 5) }, () =>
    r.between(0.4, 1.6),
  );
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (r.next() < 0.5) {
    let start = 0;
    for (const weight of weights) {
      layer.add(band(start, weight / total));
      start += weight / total;
    }
  } else {
    const margin = r.between(0.06, 0.12);
    const gap = r.between(0.015, 0.04);
    const space = 1 - 2 * margin - gap * (weights.length - 1);
    let start = margin;
    for (const weight of weights) {
      const size = (space * weight) / total;
      layer.add(band(start, size, margin));
      start += size + gap;
    }
  }
}

const triangles = [
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ],
  [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ],
];

/** Grid of cells; one cell form per work or a mix. */
function mosaic(layer: Layer) {
  const r = layer.random;
  const cols =
    layer.role === 'background'
      ? r.integer(2, 4)
      : 3 + Math.round(layer.density * 4);
  const rows = Math.max(2, cols + r.integer(-1, 1));
  const margin = r.pick([0, 0.05, 0.08] as const);
  const gap = r.pick([0, 0.006, 0.012] as const);
  const cellWidth = (1 - 2 * margin) / cols;
  const cellHeight = (1 - 2 * margin) / rows;
  const kinds: ElementKind[] = [
    'rectangle',
    'rectangle',
    'circle',
    ...(layer.flags.curves ? (['arc'] as const) : []),
    ...(layer.flags.generativeShapes ? (['polygon'] as const) : []),
  ];
  const uniform = r.next() < 0.6 ? r.pick(kinds) : undefined;
  const skip = layer.role === 'accent' ? 0.75 : r.pick([0, 0.1, 0.25] as const);
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols; col++) {
      if (r.next() < skip) continue;
      const kind = uniform ?? r.pick(kinds);
      const cx = margin + (col + 0.5) * cellWidth;
      const cy = margin + (row + 0.5) * cellHeight;
      const width = cellWidth - gap;
      const height = cellHeight - gap;
      const side = Math.min(width, height);
      if (kind === 'polygon')
        layer.add({
          kind,
          ...layer.frame(cx, cy, width, height),
          shape: { points: r.pick(triangles) },
        });
      else if (kind === 'rectangle')
        layer.add(layer.shape(kind, cx, cy, width, height));
      else layer.add(layer.shape(kind, cx, cy, side, side));
    }
}

/** Soft blobs with radial gradients, curved areas and strokes. */
function organic(layer: Layer) {
  const r = layer.random;
  const count = layer.count(3, 9);
  for (let index = 0; index < count; index++) {
    const size =
      layer.role === 'background'
        ? r.between(0.35, 0.75)
        : r.between(0.14, 0.5);
    const base = layer.color();
    const fill =
      layer.flags.gradients && r.next() < 0.7
        ? gradient(r, [base, layer.otherThan(base)], 'radial')
        : layer.paint(base);
    const kind =
      layer.flags.generativeShapes && r.next() < 0.25 ? 'path' : 'blob';
    layer.add(
      layer.shape(
        kind,
        r.between(0.15, 0.85),
        r.between(0.15, 0.85),
        size,
        size * r.between(0.7, 1.3),
        { rotation: r.integer(-90, 90), opacity: r.between(0.55, 0.95), fill },
      ),
    );
  }
  if (layer.flags.curves) {
    const strokes = r.integer(0, 2);
    for (let index = 0; index < strokes; index++)
      layer.add(
        layer.openCurve(
          r.between(0.3, 0.7),
          r.between(0.3, 0.7),
          r.between(0.3, 0.7),
          r.between(0.15, 0.4),
        ),
      );
  }
}

const lissajousPairs = [
  [1, 2],
  [2, 3],
  [3, 2],
  [3, 4],
  [5, 4],
  [1, 3],
] as const;

/** Rule-based structures: point figures, tilings, divisions and rings. */
function generative(layer: Layer) {
  const r = layer.random;
  const { flags } = layer;
  const variants = [
    'subdivision',
    'rings',
    ...(layer.left('dots') >= 16
      ? (['phyllotaxis', 'spiral', 'lissajous'] as const)
      : []),
    ...((flags.curves && layer.left('clipped') >= 18) || flags.lines
      ? (['truchet'] as const)
      : []),
  ] as const;
  const variant = r.pick(variants);
  const cx = layer.symmetric ? 0.5 : r.between(0.42, 0.58);
  const cy = r.between(0.42, 0.58);
  const radius =
    layer.role === 'accent' ? r.between(0.14, 0.24) : r.between(0.3, 0.4);
  const first = layer.color();
  const second = layer.otherThan(first);

  if (variant === 'subdivision') {
    const margin = r.pick([0, 0.05, 0.08] as const);
    const gap = r.pick([0.006, 0.012, 0.02] as const);
    const target = layer.count(5, 22);
    const cells: { x: number; y: number; w: number; h: number }[] = [
      { x: margin, y: margin, w: 1 - 2 * margin, h: 1 - 2 * margin },
    ];
    while (cells.length < target) {
      let largest = 0;
      cells.forEach((cell, index) => {
        if (cell.w * cell.h > cells[largest]!.w * cells[largest]!.h)
          largest = index;
      });
      const cell = cells[largest]!;
      const ratio = r.pick([0.382, 0.5, 0.618] as const);
      cells.splice(
        largest,
        1,
        ...(cell.w >= cell.h
          ? [
              { ...cell, w: cell.w * ratio },
              { ...cell, x: cell.x + cell.w * ratio, w: cell.w * (1 - ratio) },
            ]
          : [
              { ...cell, h: cell.h * ratio },
              { ...cell, y: cell.y + cell.h * ratio, h: cell.h * (1 - ratio) },
            ]),
      );
    }
    for (const cell of cells) {
      if (r.next() < 0.1) continue;
      layer.add(
        layer.shape(
          'rectangle',
          cell.x + cell.w / 2,
          cell.y + cell.h / 2,
          cell.w - gap,
          cell.h - gap,
        ),
      );
    }
    return;
  }

  if (variant === 'rings') {
    const count = Math.max(3, layer.count(4, 9));
    const strokeWidth = clamp(
      (radius / count) * r.between(0.4, 0.8),
      MIN_STROKE + 0.002,
      0.5,
    );
    for (let index = 0; index < count; index++) {
      const size = 2 * radius * (1 - index / count);
      const fill = solid(index % 2 ? second : first);
      if (flags.curves)
        layer.add({
          kind: 'ring',
          ...layer.frame(cx, cy, size, size, { fill, opacity: 1 }),
          shape: { strokeWidth },
        });
      else
        layer.add(
          layer.shape('circle', cx, cy, size, size, { fill, opacity: 1 }),
        );
    }
    return;
  }

  if (variant === 'truchet') {
    const cells = layer.role === 'accent' ? 3 : 4;
    const side = Math.min(2 * radius, 0.7);
    const cell = side / cells;
    const left = clamp(cx, 0.45, 0.55) - side / 2;
    const top = clamp(cy, 0.45, 0.55) - side / 2;
    const strokeWidth = clamp(
      cell * r.between(0.1, 0.2),
      MIN_STROKE + 0.002,
      0.5,
    );
    const fill = solid(first);
    for (let row = 0; row < cells; row++)
      for (let col = 0; col < cells; col++) {
        const turned = r.next() < 0.5;
        if (flags.curves) {
          // Two quarter arcs around opposite corners of the cell.
          const corners = turned
            ? ([
                [0, 0, 90],
                [1, 1, 270],
              ] as const)
            : ([
                [1, 0, 180],
                [0, 1, 0],
              ] as const);
          for (const [dx, dy, start] of corners)
            layer.add({
              kind: 'arc',
              ...layer.frame(
                left + (col + dx) * cell,
                top + (row + dy) * cell,
                cell + strokeWidth,
                cell + strokeWidth,
                { fill, opacity: 1 },
              ),
              shape: { start, sweep: 90, strokeWidth },
            });
        } else
          layer.add(
            layer.shape(
              'line',
              left + (col + 0.5) * cell,
              top + (row + 0.5) * cell,
              cell * 1.3,
              strokeWidth,
              { rotation: turned ? 45 : -45, fill },
            ),
          );
      }
    return;
  }

  // Point figures: single circles, computed here and stored one by one.
  const count = Math.min(
    layer.left('dots'),
    Math.round((22 + layer.density * 34) * (layer.role === 'accent' ? 0.5 : 1)),
  );
  const [a, b] = r.pick(lissajousPairs);
  const turns = r.between(2, 4);
  const constant = r.between(0.016, 0.03);
  for (let index = 0; index < count; index++) {
    const share = index / count;
    let x = cx;
    let y = cy;
    let size = constant;
    if (variant === 'phyllotaxis') {
      const angle = index * 2.399963229728653;
      const distance = radius * Math.sqrt((index + 0.5) / count);
      x += distance * Math.cos(angle);
      y += distance * Math.sin(angle);
      size = 0.012 + 0.026 * share;
    } else if (variant === 'spiral') {
      const angle = turns * 2 * Math.PI * share;
      x += radius * share * Math.cos(angle);
      y += radius * share * Math.sin(angle);
      size = 0.012 + 0.026 * share;
    } else {
      const t = 2 * Math.PI * share;
      x += radius * Math.sin(a * t + Math.PI / 2);
      y += radius * Math.sin(b * t);
    }
    layer.add(
      layer.shape('circle', x, y, size, size, {
        fill: solid(index % 3 === 0 ? second : first),
        opacity: 1,
      }),
    );
  }
}

/** Overlay of many forms in all sizes, turned and translucent. */
function chaotic(layer: Layer) {
  const r = layer.random;
  const kinds: ElementKind[] = [
    'rectangle',
    'circle',
    'ellipse',
    'blob',
    ...optionalKinds(layer),
  ];
  const count = layer.count(10, 28);
  for (let index = 0; index < count; index++) {
    const kind = r.pick(kinds);
    const cx = r.between(0.05, 0.95);
    const cy = r.between(0.05, 0.95);
    const opacity = r.between(0.35, 0.9);
    if (kind === 'line')
      layer.add(
        layer.shape(
          kind,
          cx,
          cy,
          r.between(0.3, 1),
          r.between(MIN_STROKE, 0.03),
          {
            rotation: r.integer(-90, 90),
            opacity,
          },
        ),
      );
    else {
      const size = 0.05 + 0.5 * r.next() ** 2;
      layer.add(
        layer.shape(kind, cx, cy, size, size * r.between(0.5, 1.5), {
          rotation: r.integer(-180, 180),
          opacity,
        }),
      );
    }
  }
}

export const families: Record<Family, (layer: Layer) => void> = {
  geometric,
  'color-field': colorField,
  mosaic,
  organic,
  generative,
  chaotic,
};

/** Line bundle, hatching or fan with a visible stroke width. */
export function lineBundle(layer: Layer) {
  const r = layer.random;
  const fill = solid(layer.color());
  const strokeWidth = r.between(MIN_STROKE, 0.02);
  const angle = r.integer(0, 11) * 15;
  const variant = r.pick(['parallel', 'hatch', 'fan'] as const);
  const cx = r.between(0.42, 0.58);
  const cy = r.between(0.3, 0.7);
  if (variant === 'fan') {
    const count = r.integer(6, 12);
    const spread = r.between(40, 120);
    const length = r.between(0.25, 0.45);
    for (let index = 0; index < count; index++) {
      const turn = angle - spread / 2 + (spread * index) / (count - 1);
      const radians = (turn * Math.PI) / 180;
      layer.add(
        layer.shape(
          'line',
          cx + (Math.cos(radians) * length) / 2,
          cy + (Math.sin(radians) * length) / 2,
          length,
          strokeWidth,
          { rotation: turn, fill },
        ),
      );
    }
    return;
  }
  const hatch = variant === 'hatch';
  const count = hatch ? r.integer(8, 14) : r.integer(5, 12);
  const length = hatch ? r.between(0.12, 0.25) : r.between(0.4, 0.9);
  const spacing =
    strokeWidth + (hatch ? r.between(0.012, 0.022) : r.between(0.02, 0.04));
  const radians = (angle * Math.PI) / 180;
  for (let index = 0; index < count; index++) {
    const offset = (index - (count - 1) / 2) * spacing;
    layer.add(
      layer.shape(
        'line',
        cx - Math.sin(radians) * offset,
        cy + Math.cos(radians) * offset,
        length,
        strokeWidth,
        { rotation: angle, fill },
      ),
    );
  }
}

/** Arcs around one centre, single rings or open curve strokes. */
export function curveSet(layer: Layer) {
  const r = layer.random;
  const fill = solid(layer.color());
  const variant = r.pick(['arcs', 'rings', 'strokes'] as const);
  const cx = r.between(0.3, 0.7);
  const cy = r.between(0.3, 0.7);
  if (variant === 'arcs') {
    const count = r.integer(3, 5);
    const outer = r.between(0.3, 0.6);
    const start = r.integer(0, 7) * 45;
    const sweep = r.pick([90, 180, 270] as const);
    const strokeWidth = r.between(0.01, 0.025);
    for (let index = 0; index < count; index++) {
      const size = outer * (1 - (index * 0.8) / count);
      layer.add({
        kind: 'arc',
        ...layer.frame(cx, cy, size, size, { fill, opacity: 1 }),
        shape: { start, sweep, strokeWidth },
      });
    }
  } else if (variant === 'rings') {
    const count = r.integer(2, 3);
    for (let index = 0; index < count; index++) {
      const size = r.between(0.12, 0.35);
      layer.add(
        layer.shape(
          'ring',
          r.between(0.2, 0.8),
          r.between(0.2, 0.8),
          size,
          size,
          {
            fill,
            opacity: 1,
          },
        ),
      );
    }
  } else {
    const count = r.integer(1, 3);
    for (let index = 0; index < count; index++)
      layer.add(
        layer.openCurve(cx, cy, r.between(0.3, 0.8), r.between(0.15, 0.5)),
      );
  }
}

/** One to three generative polygons: regular forms and stars. */
export function polygonSet(layer: Layer) {
  const r = layer.random;
  const count = r.integer(1, 3);
  for (let index = 0; index < count; index++) {
    const size = r.between(0.1, 0.35);
    layer.add(
      layer.shape(
        'polygon',
        r.between(0.2, 0.8),
        r.between(0.2, 0.8),
        size,
        size,
        { rotation: r.integer(-6, 6) * 15 },
      ),
    );
  }
}
