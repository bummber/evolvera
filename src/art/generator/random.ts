/** FNV-1a over JS UTF-16 code units; stable across supported JS runtimes. */
export function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index++) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 16777619);
  }
  return hash >>> 0;
}

/** Mulberry32, uint32 state, output [0,1). No wall clock or Math.random. */
export function createRandom(seed: string) {
  let state = hashSeed(seed);
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const integer = (min: number, max: number) =>
    min + Math.floor(next() * (max - min + 1));
  const pick = <T>(values: readonly T[]): T => {
    if (values.length === 0) throw new Error('Leere Zufallsauswahl.');
    return values[integer(0, values.length - 1)]!;
  };
  return {
    next,
    integer,
    pick,
    between: (min: number, max: number) => min + next() * (max - min),
  };
}
export type Random = ReturnType<typeof createRandom>;
