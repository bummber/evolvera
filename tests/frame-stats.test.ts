import { describe, expect, it } from 'vitest';
import { frameStats } from '../src/app/frame-stats';

describe('Bildstatistik der Lastmessung', () => {
  it('fasst gleichmäßige Bilder zusammen', () => {
    const times = Array.from({ length: 61 }, (_, index) => index * 16.7);
    expect(frameStats(times)).toEqual({
      frames: 60,
      median: 16.7,
      p95: 16.7,
      longest: 16.7,
      over33: 0,
      over50: 0,
    });
  });
  it('zählt lange Abstände', () => {
    // 18 gaps of 16 ms, one of 40 ms and one of 80 ms.
    const times = [0];
    for (let index = 0; index < 18; index++) times.push(times.at(-1)! + 16);
    times.push(times.at(-1)! + 40, times.at(-1)! + 120);
    const stats = frameStats(times)!;
    expect(stats.frames).toBe(20);
    expect(stats.median).toBe(16);
    expect(stats.longest).toBe(80);
    expect(stats.over33).toBe(10);
    expect(stats.over50).toBe(5);
  });
  it('liefert ohne genug Bilder kein Ergebnis', () => {
    expect(frameStats([])).toBeNull();
    expect(frameStats([0, 16])).toBeNull();
  });
});
