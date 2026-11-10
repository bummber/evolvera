import type { DnaV3 } from '../../schema/artwork-v3';

// Renderer 2 paint: builds CSS values for fills and effects from validated
// numbers, hex colours and enumerations only. No `url(...)`, no images.

type Element = DnaV3['elements'][number];
type Fill = Element['fill'];
type Effects = NonNullable<Element['effects']>;

const PLANE = 1000;
const round = (value: number) => Math.round(value * 100) / 100;
const percent = (value: number) => `${round(value * 100)}%`;
const px = (value: number) => `${round(value * PLANE)}px`;

function stops(list: readonly { color: string; offset: number }[]) {
  return list.map((stop) => `${stop.color} ${percent(stop.offset)}`).join(', ');
}

/** Value of the CSS `background` shorthand for one fill. */
export function fillBackground(fill: Fill): string {
  switch (fill.kind) {
    case 'solid':
      return fill.color;
    case 'linear':
      return `linear-gradient(${round(fill.angle)}deg, ${stops(fill.stops)})`;
    case 'radial':
      return `radial-gradient(farthest-corner at ${percent(fill.centerX)} ${percent(fill.centerY)}, ${stops(fill.stops)})`;
    case 'conic':
      return `conic-gradient(from ${round(fill.angle)}deg at ${percent(fill.centerX)} ${percent(fill.centerY)}, ${stops(fill.stops)})`;
    case 'pattern':
      return patternBackground(fill);
  }
}

function patternBackground(fill: Extract<Fill, { kind: 'pattern' }>): string {
  const { foreground: fg, background: bg } = fill;
  const period = px(fill.period);
  const half = px(fill.period / 2);
  const tile = `0 0 / ${period} ${period}`;
  switch (fill.pattern) {
    case 'stripes':
      return `repeating-linear-gradient(${round(fill.angle)}deg, ${fg} 0 ${half}, ${bg} ${half} ${period})`;
    case 'grid': {
      const line = px(fill.period * 0.2);
      const bars = (angle: number) =>
        `repeating-linear-gradient(${round(angle)}deg, ${fg} 0 ${line}, transparent ${line} ${period})`;
      return `${bars(fill.angle)}, ${bars(fill.angle + 90)}, ${bg}`;
    }
    case 'dots':
      return `radial-gradient(circle closest-side, ${fg} 58%, transparent 62%) ${tile}, ${bg}`;
    case 'rings':
      return `repeating-radial-gradient(circle at 50% 50%, ${fg} 0 ${half}, ${bg} ${half} ${period})`;
    case 'checker':
      return `conic-gradient(${fg} 25%, ${bg} 0 50%, ${fg} 0 75%, ${bg} 0) ${tile}`;
    case 'truchet': {
      const arc = (corner: string) =>
        `radial-gradient(circle ${period} at ${corner}, transparent 0 40%, ${fg} 40% 60%, transparent 60%) ${tile}`;
      return `${arc('0 0')}, ${arc('100% 100%')}, ${bg}`;
    }
  }
}

function rgba(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${value >> 16}, ${(value >> 8) & 255}, ${value & 255}, ${round(alpha)})`;
}

export function effectStyles(effects: Effects | undefined): {
  mixBlendMode?: Effects['blend'];
  filter?: string;
  maskImage?: string;
} {
  if (!effects) return {};
  const filters: string[] = [];
  if (effects.blur !== undefined) filters.push(`blur(${px(effects.blur)})`);
  if (effects.shadow) {
    const { offsetX, offsetY, blur, color, opacity } = effects.shadow;
    filters.push(
      `drop-shadow(${px(offsetX)} ${px(offsetY)} ${px(blur)} ${rgba(color, opacity)})`,
    );
  }
  const mask = effects.mask;
  const fade = mask
    ? `#000 ${percent(mask.from)}, transparent ${percent(mask.to)}`
    : '';
  return {
    ...(effects.blend ? { mixBlendMode: effects.blend } : {}),
    ...(filters.length ? { filter: filters.join(' ') } : {}),
    ...(mask
      ? {
          maskImage:
            mask.kind === 'linear'
              ? `linear-gradient(${round(mask.angle)}deg, ${fade})`
              : `radial-gradient(closest-side, ${fade})`,
        }
      : {}),
  };
}
