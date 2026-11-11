/** Structural equality of parsed JSON values. */
export const isDeepStrictEqual = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);
