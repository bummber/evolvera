import type { Profile } from '../../schema/profile';
import type { Random } from '../random';

// Generator 0.3.0 palettes. Colours are computed in OKLCH and archived as
// 8-bit sRGB hex; the renderer never recomputes them.

export type PaletteStrategy = Profile['palette']['strategies'][number];
export type Palette = {
  strategy: PaletteStrategy;
  background: string;
  /** Five colours, ordered by falling contrast against the background. */
  colors: string[];
  /** Deepest and palest tone of the base hue; reserve for the visibility
   * anchor where no palette colour reads against what lies below. */
  extremes: [string, string];
};

const round = (value: number) => Math.round(value * 1e6) / 1e6;
const wrap = (hue: number) => ((hue % 360) + 360) % 360;

/** OKLCH to linear sRGB (Björn Ottosson's OKLab matrices). */
function linearRgb(l: number, c: number, h: number) {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l3 = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m3 = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s3 = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
  ] as const;
}
const GAMUT_TOLERANCE = 1e-4;
const inGamut = (rgb: readonly number[]) =>
  rgb.every(
    (value) => value >= -GAMUT_TOLERANCE && value <= 1 + GAMUT_TOLERANCE,
  );

/**
 * Gamut handling: a colour outside sRGB keeps lightness and hue; only its
 * chroma is reduced by bisection (20 steps) until it fits. Then each channel
 * is clamped, gamma-encoded and rounded to 8 bit.
 */
export function oklchToHex(l: number, c: number, h: number): string {
  const lightness = Math.min(1, Math.max(0, l));
  let chroma = Math.max(0, c);
  if (!inGamut(linearRgb(lightness, chroma, h))) {
    let low = 0;
    let high = chroma;
    for (let step = 0; step < 20; step++) {
      const middle = (low + high) / 2;
      if (inGamut(linearRgb(lightness, middle, h))) low = middle;
      else high = middle;
    }
    chroma = low;
  }
  return `#${linearRgb(lightness, chroma, h)
    .map((value) => {
      const linear = Math.min(1, Math.max(0, value));
      const encoded =
        linear <= 0.0031308
          ? 12.92 * linear
          : 1.055 * linear ** (1 / 2.4) - 0.055;
      return Math.round(encoded * 255)
        .toString(16)
        .padStart(2, '0');
    })
    .join('')}`;
}

function luminance(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [value >> 16, (value >> 8) & 255, value & 255].map(
    (channel) => {
      const unit = channel / 255;
      return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
    },
  );
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}
/** WCAG contrast ratio of two hex colours, 1 to 21. */
export function contrast(a: string, b: string) {
  const first = luminance(a);
  const second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

const COLOR_COUNT = 5;
/** Lowest contrast the strongest palette colour has against the background. */
export const PALETTE_ANCHOR_CONTRAST = 3;

function hues(random: Random, strategy: PaletteStrategy): number[] {
  const base = random.between(0, 360);
  switch (strategy) {
    case 'harmonic': {
      // Analogous: neighbours within a 70° fan.
      const step = random.between(10, 17.5);
      return [-2, -1, 0, 1, 2].map((index) => base + index * step);
    }
    case 'complementary':
      // Two opposite groups, three and two colours.
      return [0, 0, 0, 180, 180].map(
        (offset) => base + offset + random.between(-12, 12),
      );
    case 'monochrome':
      return Array.from(
        { length: COLOR_COUNT },
        () => base + random.between(-4, 4),
      );
    case 'free':
      return Array.from({ length: COLOR_COUNT }, () => random.between(0, 360));
  }
}

/**
 * One palette per work: a background and five colours. `contrast` sets the
 * lightness span of the colours; `varied` draws the span per work.
 */
export function createPalette(
  random: Random,
  strategy: PaletteStrategy,
  contrastSetting: Profile['palette']['contrast'],
): Palette {
  const hueList = hues(random, strategy);
  const ground = random.next();
  // Dark, light or (rarely) a saturated mid-tone ground.
  const [groundL, groundC] =
    ground < 0.45
      ? [random.between(0.16, 0.28), random.between(0.01, 0.05)]
      : ground < 0.9
        ? [random.between(0.9, 0.96), random.between(0.01, 0.04)]
        : [random.between(0.36, 0.46), random.between(0.08, 0.14)];
  const background = oklchToHex(
    groundL,
    groundC,
    hueList[0]! + random.between(-20, 20),
  );
  const span =
    contrastSetting === 'low'
      ? 0.25
      : contrastSetting === 'high'
        ? 0.6
        : random.between(0.25, 0.6);
  // Centre the colours away from the ground so that they stay readable.
  const center = groundL < 0.5 ? 0.7 : 0.48;
  const colors = hueList.map((hue, index) => {
    const position = index / (COLOR_COUNT - 1) - 0.5;
    const l = Math.min(
      0.95,
      Math.max(0.2, center + position * span + random.between(-0.04, 0.04)),
    );
    const c =
      strategy === 'monochrome'
        ? random.between(0.04, 0.18)
        : random.between(0.09, 0.22);
    return { l: round(l), c: round(c), h: round(wrap(hue)) };
  });
  // Monochrome and analogous palettes would otherwise sort hue by lightness.
  for (let index = colors.length - 1; index > 0; index--) {
    const other = random.integer(0, index);
    const [a, b] = [colors[index]!, colors[other]!];
    [a.l, b.l] = [b.l, a.l];
  }
  const hexes = colors.map(({ l, c, h }) => oklchToHex(l, c, h));
  // Guarantee one clearly readable colour: move the strongest one further
  // away from the ground in fixed lightness steps.
  let best = 0;
  hexes.forEach((hex, index) => {
    if (contrast(background, hex) > contrast(background, hexes[best]!))
      best = index;
  });
  const anchor = colors[best]!;
  const direction = groundL < 0.5 ? 1 : -1;
  while (
    contrast(background, hexes[best]!) < PALETTE_ANCHOR_CONTRAST &&
    anchor.l > 0.05 &&
    anchor.l < 0.98
  ) {
    anchor.l = round(anchor.l + direction * 0.03);
    hexes[best] = oklchToHex(anchor.l, anchor.c, anchor.h);
  }
  return {
    strategy,
    background,
    extremes: [
      oklchToHex(0.13, 0.03, wrap(hueList[0]!)),
      oklchToHex(0.97, 0.02, wrap(hueList[0]!)),
    ],
    colors: [...hexes].sort(
      (a, b) => contrast(background, b) - contrast(background, a),
    ),
  };
}
