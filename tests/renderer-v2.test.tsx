// @vitest-environment node
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ArtRendererV2 } from '../src/art/renderer/ArtRendererV2';
import { hasMotion } from '../src/art/renderer/motion';
import {
  arcClip,
  clipToCss,
  flattenPath,
  pathClip,
  polygonClip,
  ringClip,
} from '../src/art/renderer/v2/geometry';
import { effectStyles, fillBackground } from '../src/art/renderer/v2/paint';
import {
  dnaV3Schema,
  loadCounts,
  loadLimitsV3,
} from '../src/art/schema/artwork-v3';
import { catalogSchema } from '../src/art/schema/catalog';
import { origin } from './fixtures/artworks';
import { originV3 } from './fixtures/artworks-v3';

const catalog = catalogSchema.parse(
  JSON.parse(readFileSync('fixtures/preview/ep01-catalog.json', 'utf8')),
);
const render = (source: Parameters<typeof ArtRendererV2>[0]['source']) =>
  renderToStaticMarkup(<ArtRendererV2 source={source} />);
const inside = (
  points: readonly (readonly [number, number])[],
  w: number,
  h: number,
) =>
  points.every(
    ([x, y]) => x >= -1e-6 && x <= w + 1e-6 && y >= -1e-6 && y <= h + 1e-6,
  );

describe('Renderer 2: Geometrie', () => {
  it('zeichnet Bögen als geschlossene Fläche mit Strichstärke', () => {
    const clip = arcClip(200, 200, 0, 90, 20);
    expect(clip.rule).toBe('nonzero');
    expect(inside(clip.points, 200, 200)).toBe(true);
    // Outer edge starts at the top, inner edge ends 20 px below it.
    expect(clip.points[0]![0]).toBeCloseTo(100);
    expect(clip.points[0]![1]).toBeCloseTo(0);
    expect(clip.points.at(-1)![0]).toBeCloseTo(100);
    expect(clip.points.at(-1)![1]).toBeCloseTo(20);
    // A quarter turn clockwise ends on the right-hand side.
    const outerEnd = clip.points[clip.points.length / 2 - 1]!;
    expect(outerEnd[0]).toBeCloseTo(200);
    expect(outerEnd[1]).toBeCloseTo(100);
  });
  it('zeichnet Ringe und volle Bögen mit ausgespartem Inneren', () => {
    const ring = ringClip(300, 200, 30);
    expect(ring.rule).toBe('evenodd');
    expect(ring).toEqual(arcClip(300, 200, 123, 360, 30));
    expect(inside(ring.points, 300, 200)).toBe(true);
    // An oversized stroke degenerates to a filled ellipse, never negative radii.
    expect(inside(ringClip(100, 100, 400).points, 100, 100)).toBe(true);
  });
  it('skaliert Polygonpunkte auf die Elementfläche', () => {
    expect(
      polygonClip(
        [
          { x: 0, y: 1 },
          { x: 0.5, y: 0 },
          { x: 1, y: 1 },
        ],
        200,
        100,
      ).points,
    ).toEqual([
      [0, 100],
      [100, 0],
      [200, 100],
    ]);
  });
  it('glättet Kurven und trifft Anfangs- und Endpunkt genau', () => {
    const flat = flattenPath([
      { op: 'M', x: 0, y: 0.5 },
      { op: 'Q', cx: 0.25, cy: 0, x: 0.5, y: 0.5 },
      { op: 'C', c1x: 0.6, c1y: 1, c2x: 0.9, c2y: 1, x: 1, y: 0.5 },
      { op: 'L', x: 1, y: 1 },
    ]);
    expect(flat).toHaveLength(1 + 12 + 12 + 1);
    expect(flat[0]).toEqual([0, 0.5]);
    expect(flat[12]![0]).toBeCloseTo(0.5);
    expect(flat[24]![0]).toBeCloseTo(1);
    expect(flat[24]![1]).toBeCloseTo(0.5);
    expect(flat.at(-1)).toEqual([1, 1]);
  });
  it('macht offene Pfade als Fläche in voller Strichstärke sichtbar', () => {
    const clip = pathClip(
      [
        { op: 'M', x: 0, y: 0.5 },
        { op: 'L', x: 1, y: 0.5 },
      ],
      false,
      10,
      200,
      100,
    );
    expect(inside(clip.points, 200, 100)).toBe(true);
    const ys = clip.points.map(([, y]) => y);
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(10);
    const xs = clip.points.map(([x]) => x);
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(190);
  });
  it('füllt geschlossene Pfade ohne Strich und schließt gestrichene Pfade', () => {
    const triangle = [
      { op: 'M', x: 0, y: 0 },
      { op: 'L', x: 1, y: 0 },
      { op: 'L', x: 0.5, y: 1 },
    ] as const;
    expect(pathClip(triangle, true, undefined, 100, 100).points).toEqual([
      [0, 0],
      [100, 0],
      [50, 100],
    ]);
    // Three segments including the closing one, four outline points each.
    expect(pathClip(triangle, true, 4, 100, 100).points).toHaveLength(12);
    expect(pathClip(triangle, false, 4, 100, 100).points).toHaveLength(8);
  });
  it('schreibt Polygone nur aus gerundeten Pixelzahlen', () => {
    const css = clipToCss(ringClip(100.123456, 50, 5));
    expect(css).toMatch(
      /^polygon\(evenodd, (-?\d+(\.\d{1,2})?px -?\d+(\.\d{1,2})?px(, )?)+\)$/,
    );
  });
});

describe('Renderer 2: Füllungen und Effekte', () => {
  const fills = catalog.sheets.flatMap((sheet) =>
    sheet.dna.elements.map((element) => element.fill),
  );
  it('deckt im Musterbogen alle Füllarten und Muster ab', () => {
    expect(new Set(fills.map((fill) => fill.kind))).toEqual(
      new Set(['solid', 'linear', 'radial', 'conic', 'pattern']),
    );
    expect(
      new Set(
        fills.flatMap((fill) =>
          fill.kind === 'pattern' ? [fill.pattern] : [],
        ),
      ),
    ).toEqual(
      new Set(['stripes', 'grid', 'dots', 'rings', 'checker', 'truchet']),
    );
  });
  it('baut Füllungen nur aus Verläufen, Farben und Zahlen', () => {
    for (const fill of fills) {
      const css = fillBackground(fill);
      expect(css).not.toMatch(/url\(|image\(|element\(|var\(|;|<|expression/i);
      expect(css).toMatch(
        /^(#[\da-f]{6}|((repeating-)?(linear|radial|conic)-gradient\(.+\)( 0 0 \/ [\d.]+px [\d.]+px)?(, )?)+(#[\da-f]{6})?)$/i,
      );
    }
    expect(
      fillBackground({
        kind: 'linear',
        angle: 45,
        stops: [
          { color: '#000000', offset: 0 },
          { color: '#ffffff', offset: 0.5 },
        ],
      }),
    ).toBe('linear-gradient(45deg, #000000 0%, #ffffff 50%)');
  });
  it('übersetzt Effekte in Blendmodus, Filter und Maske', () => {
    expect(effectStyles(undefined)).toEqual({});
    expect(
      effectStyles({
        blend: 'multiply',
        blur: 0.01,
        shadow: {
          offsetX: 0.01,
          offsetY: -0.02,
          blur: 0.02,
          color: '#102030',
          opacity: 0.5,
        },
        mask: { kind: 'linear', angle: 90, from: 0.1, to: 0.9 },
      }),
    ).toEqual({
      mixBlendMode: 'multiply',
      filter: 'blur(10px) drop-shadow(10px -20px 20px rgba(16, 32, 48, 0.5))',
      maskImage: 'linear-gradient(90deg, #000 10%, transparent 90%)',
    });
    expect(
      effectStyles({ mask: { kind: 'radial', angle: 0, from: 0.2, to: 1 } }),
    ).toEqual({
      maskImage: 'radial-gradient(closest-side, #000 20%, transparent 100%)',
    });
  });
});

describe('Renderer 2: Darstellung', () => {
  it.each(catalog.sheets)(
    'stellt den Musterbogen $id nur aus DNA dar',
    (sheet) => {
      const markup = render(sheet);
      expect(markup).toContain('data-renderer="2"');
      expect(markup).toContain('data-state="rest"');
      expect(markup.match(/data-art-element=/g)).toHaveLength(
        sheet.dna.elements.length,
      );
      // One DOM node per element plus frame and plane: no wrappers, no images.
      expect(markup.match(/<div/g)).toHaveLength(sheet.dna.elements.length + 2);
      expect(markup).not.toMatch(
        /<(img|svg|canvas|script|iframe|style|picture)/,
      );
      expect(markup).not.toMatch(/url\(/);
      expect(markup).toBe(render(sheet));
    },
  );
  it('deckt im Musterbogen alle Formarten, Effekte und Bewegungen ab', () => {
    const elements = catalog.sheets.flatMap((sheet) => sheet.dna.elements);
    expect(new Set(elements.map((element) => element.kind))).toEqual(
      new Set([
        'rectangle',
        'circle',
        'ellipse',
        'line',
        'arc',
        'ring',
        'polygon',
        'blob',
        'path',
      ]),
    );
    expect(
      new Set(elements.flatMap((element) => element.effects?.blend ?? [])),
    ).toEqual(
      new Set(['multiply', 'screen', 'overlay', 'soft-light', 'difference']),
    );
    for (const key of ['blur', 'shadow', 'mask'] as const)
      expect(elements.some((element) => element.effects?.[key])).toBe(true);
    expect(new Set(elements.map((element) => element.motion.kind))).toEqual(
      new Set(['static', 'rotate', 'pulse', 'float']),
    );
  });
  it('lässt Beschreibungen Text sein und stoppt bei fremden Eingaben', () => {
    const work = originV3();
    const hostile = { ...work, description: '<img src=x onerror=alert(1)>' };
    expect(render(hostile)).not.toContain('<img');
    for (const source of [
      { ...work, rendererVersion: '1' },
      { ...work, rendererVersion: '3' },
      { ...work, dna: origin().dna },
      {
        ...work,
        dna: { ...work.dna, background: 'url(https://example.com/x)' },
      },
    ]) {
      const markup = render(source);
      expect(markup).toContain('role="alert"');
      expect(markup).not.toContain('data-art-element');
    }
  });
  it('erkennt Bewegung in beiden Rendererversionen', () => {
    const moving = catalog.sheets.find((sheet) => sheet.id === 'ep01-ebenen')!;
    const still = catalog.sheets.find((sheet) => sheet.id === 'ep01-formen')!;
    expect(hasMotion(moving)).toBe(true);
    expect(hasMotion(still)).toBe(false);
    expect(hasMotion(origin())).toBe(false);
    expect(hasMotion({ rendererVersion: '2', dna: origin().dna })).toBe(false);
  });
});

describe('Lastgrenzen und Vokabular im Schema 3', () => {
  const stress = catalog.sheets.find(
    (sheet) => sheet.id === 'ep01-lastgrenze',
  )!;
  it('hält den Prüfbogen genau an allen Lastgrenzen', () => {
    expect(loadCounts(stress.dna.elements)).toEqual(loadLimitsV3);
  });
  it('weist ein Werk über der Grenze zurück: Punkte', () => {
    const dna = structuredClone(stress.dna) as Draft;
    const first = dna.elements.findIndex((e: Draft) => e.kind === 'rectangle');
    Object.assign(dna.elements[first], {
      kind: 'circle',
      width: 0.03,
      height: 0.03,
    });
    const result = dnaV3Schema.safeParse(dna);
    expect(result.success).toBe(false);
    expect(result.error!.issues.map((issue) => issue.message)).toEqual([
      'Lastgrenze überschritten: höchstens 60 Punkte.',
    ]);
  });
  it.each([
    ['blends', { blend: 'screen' }, 'Blendmodi'],
    ['masks', { mask: { kind: 'radial', angle: 0, from: 0, to: 1 } }, 'Masken'],
    ['blurs', { blur: 0.01 }, 'Unschärfen und Schatten'],
  ] as const)(
    'weist ein Werk über der Grenze zurück: %s',
    (key, effects, label) => {
      const dna = structuredClone(stress.dna) as Draft;
      const free = dna.elements.find(
        (e: Draft) => e.kind === 'circle' && !e.effects,
      );
      free.effects = effects;
      const result = dnaV3Schema.safeParse(dna);
      expect(result.success).toBe(false);
      expect(result.error!.issues.map((issue) => issue.message)).toEqual([
        `Lastgrenze überschritten: höchstens ${loadLimitsV3[key]} ${label}.`,
      ]);
    },
  );
  it('gibt gekachelten Mustern keinen eigenen Winkel und Masken eine Richtung', () => {
    const dna = structuredClone(originV3().dna) as Draft;
    dna.elements[4].fill.pattern = 'dots';
    expect(dnaV3Schema.safeParse(dna).success).toBe(false);
    dna.elements[4].fill.angle = 0;
    expect(dnaV3Schema.safeParse(dna).success).toBe(true);
    dna.elements[4].effects.mask = {
      kind: 'linear',
      angle: 90,
      from: 0.8,
      to: 0.2,
    };
    expect(dnaV3Schema.safeParse(dna).success).toBe(false);
  });
});

// Deliberately loose: the cases above write invalid data on purpose.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Draft = any;
