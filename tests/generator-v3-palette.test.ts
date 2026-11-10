import { describe, expect, it } from 'vitest';
import { createRandom } from '../src/art/generator/random';
import {
  fillColors,
  gradient,
  gradientKinds,
  pattern,
  patternKinds,
  solid,
} from '../src/art/generator/v3/fills';
import {
  contrast,
  createPalette,
  oklchToHex,
  PALETTE_ANCHOR_CONTRAST,
} from '../src/art/generator/v3/palette';
import { fillSchema } from '../src/art/schema/artwork-v3';
import { paletteStrategySchema } from '../src/art/schema/profile';

const HEX = /^#[\da-f]{6}$/;

describe('OKLCH nach Hex', () => {
  it('trifft bekannte sRGB-Werte', () => {
    expect(oklchToHex(0, 0, 0)).toBe('#000000');
    expect(oklchToHex(1, 0, 0)).toBe('#ffffff');
    // sRGB primaries in OKLCH (CSS Color 4 reference values).
    expect(oklchToHex(0.627955, 0.257683, 29.2339)).toBe('#ff0000');
    expect(oklchToHex(0.86644, 0.294827, 142.4953)).toBe('#00ff00');
    expect(oklchToHex(0.452014, 0.313214, 264.052)).toBe('#0000ff');
  });
  it('reduziert außerhalb des Gamuts nur die Sättigung', () => {
    const mapped = oklchToHex(0.7, 0.4, 150);
    expect(mapped).toMatch(HEX);
    // Same lightness and hue with zero chroma is a neutral grey; the mapped
    // colour must stay clearly green and close to that lightness.
    const value = Number.parseInt(mapped.slice(1), 16);
    const [r, g, b] = [value >> 16, (value >> 8) & 255, value & 255];
    expect(g).toBeGreaterThan(r!);
    expect(g).toBeGreaterThan(b!);
    expect(contrast(mapped, oklchToHex(0.7, 0, 150))).toBeLessThan(1.25);
  });
  it('liefert für jeden Wert im Raster eine gültige Farbe', () => {
    for (let l = 0; l <= 1; l += 0.1)
      for (let c = 0; c <= 0.4; c += 0.08)
        for (let h = 0; h < 360; h += 30)
          expect(oklchToHex(l, c, h)).toMatch(HEX);
  });
});

describe('Paletten', () => {
  it.each(paletteStrategySchema.options)(
    'erzeugt für %s deterministische, lesbare Paletten',
    (strategy) => {
      for (let index = 0; index < 200; index++) {
        const seed = `palette:${strategy}:${index}`;
        const palette = createPalette(createRandom(seed), strategy, 'varied');
        expect(palette).toEqual(
          createPalette(createRandom(seed), strategy, 'varied'),
        );
        expect(palette.strategy).toBe(strategy);
        expect(palette.background).toMatch(HEX);
        expect(palette.colors).toHaveLength(5);
        palette.colors.forEach((color) => expect(color).toMatch(HEX));
        expect(
          contrast(palette.background, palette.colors[0]!),
        ).toBeGreaterThanOrEqual(PALETTE_ANCHOR_CONTRAST);
      }
    },
  );
  it('spannt bei hohem Kontrast weiter als bei niedrigem', () => {
    const spread = (setting: 'low' | 'high') => {
      let total = 0;
      for (let index = 0; index < 200; index++) {
        const { colors } = createPalette(
          createRandom(`spread:${index}`),
          'free',
          setting,
        );
        total += contrast(colors[0]!, colors.at(-1)!);
      }
      return total;
    };
    expect(spread('high')).toBeGreaterThan(spread('low'));
  });
});

describe('Füllungsgen', () => {
  const colors = ['#112233', '#ddeeff', '#ff8800', '#00aa55', '#aa00aa'];
  it('erzeugt gültige Füllungen aller Arten', () => {
    const random = createRandom('fills');
    expect(fillSchema.parse(solid(colors[0]!))).toEqual({
      kind: 'solid',
      color: colors[0],
    });
    for (const kind of gradientKinds)
      for (const count of [2, 3, 4, 5]) {
        const fill = fillSchema.parse(
          gradient(random, colors.slice(0, count), kind),
        );
        expect(fill.kind).toBe(kind);
        expect(fillColors(fill)).toEqual(colors.slice(0, Math.min(4, count)));
      }
    for (const kind of patternKinds)
      for (let index = 0; index < 20; index++) {
        const fill = fillSchema.parse(
          pattern(random, colors[0]!, colors[1]!, kind),
        );
        expect(fillColors(fill)).toEqual([colors[0], colors[1]]);
      }
  });
});
