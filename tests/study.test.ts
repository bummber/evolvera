import { describe, expect, it, vi } from 'vitest';
import { createRandom, hashSeed } from '../src/art/generator/random';
import { generateStudy, hasVisibleAnchor } from '../src/art/generator/study';
import {
  previewCollectionSchema,
  previewSchema,
  studyFamilySchema,
} from '../src/art/schema/preview';
import { artworkSchema } from '../src/art/schema/artwork';
import rawStudies from '../fixtures/preview/phase-1.json';

describe('Versionierter Zufall', () => {
  it('hält den dokumentierten FNV-1a-/Mulberry32-Referenzvektor', () => {
    expect(hashSeed('evolvera/v1')).toBe(2933923275);
    const random = createRandom('evolvera/v1');
    expect(Array.from({ length: 5 }, () => random.next())).toEqual([
      0.4882566884625703, 0.7553806975483894, 0.8818093156442046,
      0.9451989852823317, 0.9863542760722339,
    ]);
  });
  it('bleibt in [0,1) und unterscheidet Seeds einschließlich Umlauten', () => {
    const random = createRandom('Übergang');
    const values = Array.from({ length: 5000 }, () => random.next());
    expect(values.every((value) => value >= 0 && value < 1)).toBe(true);
    expect(createRandom('Ä').next()).not.toBe(createRandom('A').next());
    expect(() => random.pick([])).toThrow();
  });
});

describe('Unabhängige Vorschau-DNA', () => {
  it.each(studyFamilySchema.options)(
    'prüft 100 Seeds für %s auf Gültigkeit, Last und Sichtbarkeit',
    (family) => {
      const fingerprints = new Set<string>();
      for (let index = 0; index < 100; index++) {
        const work = generateStudy({ family, seed: `parameter-${index}` });
        expect(previewSchema.safeParse(work).success).toBe(true);
        expect(work.dna.family).toBe(family);
        expect(work.dna.elements.length).toBeLessThanOrEqual(50);
        expect(hasVisibleAnchor(work.dna)).toBe(true);
        expect(
          work.dna.elements.every(
            (element) =>
              element.x + element.width <= 1 && element.y + element.height <= 1,
          ),
        ).toBe(true);
        fingerprints.add(JSON.stringify(work.dna));
      }
      expect(fingerprints.size).toBe(100);
    },
  );
  it('verwendet weder Systemzeit noch Math.random und verändert Eingaben nicht', () => {
    const request = Object.freeze({ family: 'geometric', seed: 'gleich' });
    const forbidden = () => {
      throw new Error('Nichtdeterministischer Zugriff');
    };
    const random = vi.spyOn(Math, 'random').mockImplementation(forbidden);
    const clock = vi.spyOn(Date, 'now').mockImplementation(forbidden);
    try {
      expect(generateStudy(request)).toEqual(generateStudy(request));
    } finally {
      random.mockRestore();
      clock.mockRestore();
    }
  });
  it('reproduziert gespeicherte Referenzen statt sie aus aktuellen Regeln zu ersetzen', () => {
    const collection = previewCollectionSchema.parse(rawStudies);
    expect(collection.studies).toHaveLength(12);
    for (const saved of collection.studies) {
      expect(
        generateStudy({ family: saved.dna.family, seed: saved.seed }),
      ).toEqual(saved);
      expect(artworkSchema.safeParse(saved).success).toBe(false);
    }
  });
  it('weist leere Seeds, fremde Familien und implizite offizielle Aufträge zurück', () => {
    for (const value of [
      { seed: '', family: 'geometric' },
      { seed: ' ', family: 'mosaic' },
      { seed: 'a'.repeat(161), family: 'mosaic' },
      { seed: 'x', family: 'unknown' },
      { seed: 'x', family: 'mosaic', workDate: '2026-10-28' },
    ]) {
      expect(() => generateStudy(value)).toThrow();
    }
  });
  it('unterscheidet statische Farbfelder von geometrischen und rasterbasierten Bewegungen', () => {
    const collection = previewCollectionSchema.parse(rawStudies).studies;
    expect(
      collection
        .filter((work) => work.dna.family === 'color-field')
        .every((work) =>
          work.dna.elements.every(
            (element) => element.motion.kind === 'static',
          ),
        ),
    ).toBe(true);
    expect(
      collection.some((work) =>
        work.dna.elements.some((element) => element.motion.kind === 'rotate'),
      ),
    ).toBe(true);
    expect(
      collection.some((work) =>
        work.dna.elements.some((element) => element.motion.kind === 'pulse'),
      ),
    ).toBe(true);
  });
});
