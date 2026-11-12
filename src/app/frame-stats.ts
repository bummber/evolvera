/** Summary of the gaps between animation frames, in milliseconds. */
export type FrameStats = {
  frames: number;
  median: number;
  p95: number;
  longest: number;
  /** Share of gaps above 33.4 ms (slower than 30 frames per second). */
  over33: number;
  /** Share of gaps above 50 ms (clearly visible stutter). */
  over50: number;
};

const round = (value: number) => Math.round(value * 10) / 10;

/** `times` are frame timestamps in ascending order. */
export function frameStats(times: readonly number[]): FrameStats | null {
  const gaps = times
    .slice(1)
    .map((time, index) => time - times[index]!)
    .sort((a, b) => a - b);
  if (gaps.length < 2) return null;
  const at = (share: number) =>
    gaps[Math.min(gaps.length - 1, Math.floor(share * gaps.length))]!;
  const share = (limit: number) =>
    round((gaps.filter((gap) => gap > limit).length / gaps.length) * 100);
  return {
    frames: gaps.length,
    median: round(at(0.5)),
    p95: round(at(0.95)),
    longest: round(gaps.at(-1)!),
    over33: share(33.4),
    over50: share(50),
  };
}
