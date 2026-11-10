// @vitest-environment node
import { readFileSync, readdirSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ArtDispatch } from '../src/art/renderer/ArtDispatch';
import { ArtRenderer } from '../src/art/renderer/ArtRenderer';
import { artworkSchema, type Artwork } from '../src/art/schema/artwork';
import {
  anyArtworkSchema,
  artworkV3Schema,
  dnaV3Schema,
  readTraitV3,
  traitPathV3Schema,
  validateArtworkV3,
} from '../src/art/schema/artwork-v3';
import { origin } from './fixtures/artworks';
import { originV3, transitionFamily } from './fixtures/artworks-v3';

const storedWorks = () => {
  const archive = (
    readdirSync('public/artworks', { recursive: true }) as string[]
  )
    .filter((file) => /\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .map((file) => JSON.parse(readFileSync(`public/artworks/${file}`, 'utf8')));
  const chains = ['phase-2', 'phase-3'].flatMap((name) =>
    (
      JSON.parse(readFileSync(`fixtures/preview/${name}.json`, 'utf8')) as {
        chains: { works: unknown[] }[];
      }
    ).chains.flatMap((chain) => chain.works),
  );
  return [...archive, ...chains] as unknown[];
};
const messages = (input: unknown) => {
  const result = artworkV3Schema.safeParse(input);
  return result.success
    ? []
    : result.error.issues.map((issue) => issue.message);
};

describe('Werkschema 3 (EP-01)', () => {
  it('lässt alle Archivwerke und Testwerke unverändert gültig', () => {
    const works = storedWorks();
    expect(works.length).toBeGreaterThanOrEqual(47);
    for (const work of works) {
      const parsed = artworkSchema.parse(work);
      expect(parsed).toEqual(work);
      expect(anyArtworkSchema.parse(work)).toEqual(work);
      expect(artworkV3Schema.safeParse(work).success).toBe(false);
    }
  });

  it('nimmt ein vollständiges Werk mit allen Formen, Füllungen und Effekten an', () => {
    const work = originV3();
    expect(artworkV3Schema.parse(work)).toEqual(work);
    expect(anyArtworkSchema.parse(work)).toEqual(work);
    expect(artworkSchema.safeParse(work).success).toBe(false);
    expect(new Set(work.dna.elements.map((element) => element.kind))).toEqual(
      new Set(['rectangle', 'polygon', 'blob', 'arc', 'ring', 'path']),
    );
  });

  it.each([
    ['fremder Schlüssel', (w: Draft) => (w.dna.elements[0].css = 'x')],
    ['CSS-Wert als Farbe', (w: Draft) => (w.dna.background = 'url(x)')],
    [
      'Bildquelle als Füllung',
      (w: Draft) => (w.dna.elements[0].fill = { kind: 'image', url: 'x' }),
    ],
    ['ein Farbstopp', (w: Draft) => (w.dna.elements[0].fill.stops.length = 1)],
    [
      'fünf Farbstopps',
      (w: Draft) =>
        (w.dna.elements[0].fill.stops = Array(5).fill({
          color: '#000000',
          offset: 0,
        })),
    ],
    [
      'absteigende Stopps',
      (w: Draft) => w.dna.elements[0].fill.stops.reverse(),
    ],
    [
      'Polygon mit zwei Punkten',
      (w: Draft) => (w.dna.elements[1].shape.points.length = 2),
    ],
    [
      'Blob mit sieben Radien',
      (w: Draft) => (w.dna.elements[2].shape.radii.length = 7),
    ],
    ['Form ohne Formangaben', (w: Draft) => delete w.dna.elements[3].shape],
    [
      'Rechteck mit Formangaben',
      (w: Draft) => (w.dna.elements[0].shape = { strokeWidth: 0.1 }),
    ],
    [
      'unbekannter Blendmodus',
      (w: Draft) => (w.dna.elements[2].effects.blend = 'hue'),
    ],
    [
      'zu starke Unschärfe',
      (w: Draft) => (w.dna.elements[2].effects.blur = 0.2),
    ],
    [
      'Pfadtext statt Zahlen',
      (w: Draft) => (w.dna.elements[5].shape.commands = 'M0 0L1 1'),
    ],
    [
      'Pfad ohne Startpunkt',
      (w: Draft) => (w.dna.elements[5].shape.commands[0].op = 'L'),
    ],
    [
      'offener Pfad ohne Strich',
      (w: Draft) => delete w.dna.elements[5].shape.strokeWidth,
    ],
    ['Familie kinetic', (w: Draft) => (w.dna.layers.accent.family = 'kinetic')],
    ['Element ohne Ebene', (w: Draft) => delete w.dna.layers.accent],
    ['Ebenenreihenfolge', (w: Draft) => w.dna.elements.reverse()],
    ['keine Ebene', (w: Draft) => (w.dna.layers = {})],
    [
      '121 Elemente',
      (w: Draft) => (w.dna.elements = Array(121).fill(w.dna.elements[0])),
    ],
    ['Renderer 1', (w: Draft) => (w.rendererVersion = '1')],
    ['Generator 0.2.0', (w: Draft) => (w.generatorVersion = '0.2.0')],
    ['fehlender Snapshot', (w: Draft) => delete w.settings],
    [
      'unvollständiger Snapshot',
      (w: Draft) => delete w.settings.features.masks,
    ],
    [
      'Snapshot ohne Familie',
      (w: Draft) =>
        Object.keys(w.settings.families).forEach(
          (k) => (w.settings.families[k] = false),
        ),
    ],
    [
      'Snapshot mit anderem Modus',
      (w: Draft) => (w.settings.inheritanceMode = 'free'),
    ],
    ['fehlender Kontextdigest', (w: Draft) => delete w.novelty.contextDigest],
    [
      'unbekannte Abstandsversion',
      (w: Draft) => (w.novelty.distanceVersion = 2),
    ],
  ])('weist zurück: %s', (_, change) => {
    const work = structuredClone(originV3()) as unknown as Draft;
    change(work);
    expect(artworkV3Schema.safeParse(work).success).toBe(false);
  });

  it('vermerkt einen verfehlten Mindestabstand im Werk', () => {
    const work = originV3();
    work.novelty = { ...work.novelty, distance: 0.12, minimumReached: false };
    expect(artworkV3Schema.parse(work).novelty.minimumReached).toBe(false);
  });

  it('liest Merkmale über Belegpfade und kennt nur geschlossene Pfade', () => {
    const { dna } = originV3();
    expect(readTraitV3(dna, 'background')).toBe('#101d34');
    expect(readTraitV3(dna, 'layers.structure.family')).toBe('geometric');
    expect(readTraitV3(dna, 'elements.0.fill.stops.1.color')).toBe('#3c47b4');
    expect(readTraitV3(dna, 'elements.0.fill.angle')).toBe(45);
    expect(readTraitV3(dna, 'elements.1.shape.points.1.x')).toBe(0.5);
    expect(readTraitV3(dna, 'elements.2.shape.radii.1')).toBe(0.7);
    expect(readTraitV3(dna, 'elements.5.shape.commands.2.c2y')).toBe(1);
    expect(readTraitV3(dna, 'elements.9.x')).toBeUndefined();
    expect(readTraitV3(dna, 'elements.0.fill')).toBeUndefined();
    expect(readTraitV3(dna, 'elements.length')).toBeUndefined();
    for (const path of [
      'elements.4.fill.stops.1.color',
      'elements.4.fill.angle',
      'elements.2.shape.points.3.x',
      'layers.structure.family',
    ])
      expect(traitPathV3Schema.safeParse(path).success).toBe(true);
    for (const path of [
      'title',
      'elements.0.motion.kind',
      'elements.01.x',
      'elements.0.fill.stops.4.color',
      'elements.0.effects.blend',
      'layers.structure',
      '__proto__.x',
    ])
      expect(traitPathV3Schema.safeParse(path).success).toBe(false);
  });

  it('belegt Beiträge alter Eltern (Schema 1) im ersten neuen Werk', () => {
    const { a, b, child } = transitionFamily();
    expect(validateArtworkV3(child, [a, b])).toEqual(child);
  });

  it('belegt Beiträge von Eltern im Schema 3 und Umwandlungen (constrained)', () => {
    const a = originV3();
    const b = originV3(2, '2026-10-28');
    const child = originV3(3, '2026-10-29');
    child.parentIds = [a.id, b.id];
    child.dna.elements[0]!.fill = { kind: 'solid', color: '#92727f' };
    child.settings.features.gradients = 'off';
    child.evolution = {
      type: 'hybrid',
      evaluatedParentIds: [a.id, b.id],
      decisions: [
        {
          parentId: a.id,
          source: { path: 'elements.0.fill.kind', value: 'linear' },
          target: { path: 'elements.0.fill.kind', value: 'solid' },
          operation: { kind: 'constrained', rule: 'features.gradients=off' },
        },
        {
          parentId: b.id,
          source: { path: 'layers.structure.family', value: 'geometric' },
          target: { path: 'layers.structure.family', value: 'geometric' },
          operation: { kind: 'copy' },
        },
      ],
    };
    expect(validateArtworkV3(child, [a, b])).toEqual(child);
    child.evolution.decisions[0]!.target.value = 'linear';
    expect(messages(child)).toEqual(
      expect.arrayContaining([
        'Zielbeleg stimmt nicht mit der DNA überein.',
        'Eine Umwandlung muss den Wert tatsächlich ändern.',
      ]),
    );
  });

  it('erkennt erfundene Quellen, falsche Ziele und fehlende Elternbeiträge', () => {
    const invented = transitionFamily();
    invented.child.evolution.decisions[0]!.source.value = '#123456';
    invented.child.evolution.decisions[0]!.target.value = '#123456';
    invented.child.dna.elements[1]!.fill = { kind: 'solid', color: '#123456' };
    expect(() =>
      validateArtworkV3(invented.child, [invented.a, invented.b]),
    ).toThrow(/Ausgangsbeleg/);

    const wrongTarget = transitionFamily();
    wrongTarget.child.dna.elements[1]!.x = 0.7;
    expect(messages(wrongTarget.child)).toEqual([
      'Zielbeleg stimmt nicht mit der DNA überein.',
    ]);
    const wrongAmount = transitionFamily();
    wrongAmount.child.evolution.decisions[1]!.operation = {
      kind: 'offset',
      amount: 0.2,
    };
    expect(messages(wrongAmount.child)).toEqual([
      'Numerischer Mutationsoperator belegt den Zielwert nicht.',
    ]);

    const oneParent = transitionFamily();
    oneParent.child.evolution.decisions.pop();
    expect(messages(oneParent.child)).toContain(
      'Nachvollziehbare Vererbung benötigt gestalterische Belege beider Eltern.',
    );
    oneParent.child.inheritanceMode = 'free';
    oneParent.child.settings.inheritanceMode = 'free';
    expect(messages(oneParent.child)).toEqual([]);

    const wrongParents = transitionFamily();
    expect(() =>
      validateArtworkV3(wrongParents.child, [wrongParents.b, wrongParents.a]),
    ).toThrow(/Vorgängergenerationen/);
    expect(() => validateArtworkV3(wrongParents.child, [])).toThrow(
      /Elternwerke fehlen/,
    );
  });

  it('prüft das DNA-Schema unabhängig vom Werk', () => {
    expect(dnaV3Schema.safeParse(originV3().dna).success).toBe(true);
    expect(dnaV3Schema.safeParse(origin().dna).success).toBe(false);
  });
});

describe('Renderer-Dispatch nach Version', () => {
  const v1: Artwork = origin();
  it('gibt Renderer 1 unverändert weiter', () => {
    expect(renderToStaticMarkup(<ArtDispatch source={v1} />)).toBe(
      renderToStaticMarkup(<ArtRenderer source={v1} />),
    );
    expect(
      renderToStaticMarkup(
        <ArtDispatch source={v1} presentation="main" playback="paused" />,
      ),
    ).toBe(
      renderToStaticMarkup(
        <ArtRenderer source={v1} presentation="main" playback="paused" />,
      ),
    );
  });
  it('meldet Werke für Renderer 2 als noch nicht darstellbar', () => {
    const markup = renderToStaticMarkup(<ArtDispatch source={originV3()} />);
    expect(markup).toContain('role="alert"');
    expect(markup).toContain('Renderer 2');
    expect(markup).not.toContain('data-art-element');
  });
  it('stellt unbekannte Versionen nicht dar', () => {
    const markup = renderToStaticMarkup(
      <ArtDispatch source={{ ...v1, rendererVersion: '999' }} />,
    );
    expect(markup).toContain('role="alert"');
    expect(markup).not.toContain('data-art-element');
  });
});

// Deliberately loose: the cases above write invalid data on purpose.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Draft = any;
