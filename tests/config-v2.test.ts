// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  configSchema,
  configV2Schema,
  readGenerationConfig,
} from '../src/art/schema/config';
import {
  defaultProfile,
  profileIssues,
  profileRulesVersion,
  settingsIssues,
  validProfileSchema,
} from '../src/art/schema/profile';
import { settingsSnapshotSchema } from '../src/art/schema/preview-v3';

const core = {
  revision: 7,
  seriesStartDate: '2026-11-04',
  generationEnabled: true,
  timezone: 'Europe/Berlin',
  inheritanceMode: 'traceable',
} as const;
const messages = (input: unknown) => {
  try {
    readGenerationConfig(input);
    return [];
  } catch (error) {
    return (error as { issues: { message: string }[] }).issues.map(
      (issue) => issue.message,
    );
  }
};

describe('Konfigurationsschema 2 und gemeinsamer Leser (EP-01 A-32, A-37)', () => {
  it('liest die veröffentlichte Konfiguration in Schema 1 oder 2', () => {
    const stored = JSON.parse(
      readFileSync('config/generation.json', 'utf8'),
    ) as { schemaVersion?: unknown };
    const config = readGenerationConfig(stored);
    if (stored.schemaVersion === 1)
      // Schema 1 yields the standard profile.
      expect(config).toEqual({
        ...configSchema.parse(stored),
        profile: defaultProfile,
      });
    // The worker writes schema 2 always complete.
    else expect(configV2Schema.parse(stored)).toEqual(stored);
  });

  it('liest Schema 1 als Standardprofil', () => {
    const stored = { schemaVersion: 1, ...core };
    expect(readGenerationConfig(stored)).toEqual({
      ...stored,
      profile: defaultProfile,
      restartAfterDays: null,
    });
  });

  it('lässt Schema 1 streng: Profilschlüssel bleiben dort unbekannt', () => {
    const input = { schemaVersion: 1, ...core, features: {} };
    expect(configSchema.safeParse(input).success).toBe(false);
    expect(() => readGenerationConfig(input)).toThrow();
  });

  it('ergänzt in Schema 2 fehlende Gruppen und Schlüssel mit Standardwerten', () => {
    const config = readGenerationConfig({
      schemaVersion: 2,
      ...core,
      features: { gradients: 'always', masks: 'off' },
      families: { chaotic: false },
    });
    expect(config.schemaVersion).toBe(2);
    expect(config.inheritanceMode).toBe('traceable');
    expect(config.profile).toEqual({
      ...defaultProfile,
      features: {
        ...defaultProfile.features,
        gradients: 'always',
        masks: 'off',
      },
      families: { ...defaultProfile.families, chaotic: false },
    });
    expect(readGenerationConfig({ schemaVersion: 2, ...core }).profile).toEqual(
      defaultProfile,
    );
  });

  it('verändert das Standardprofil nicht und friert das Ergebnis ein', () => {
    const config = readGenerationConfig({
      schemaVersion: 2,
      ...core,
      palette: { strategies: ['free'] },
    });
    expect(config.profile.palette.strategies).toEqual(['free']);
    expect(defaultProfile.palette.strategies).toHaveLength(4);
    expect(Object.isFrozen(config)).toBe(true);
    expect(Object.isFrozen(defaultProfile.features)).toBe(true);
  });

  it('entspricht dem Standardprofil aus EP-01 Abschnitt 4', () => {
    expect(validProfileSchema.parse(defaultProfile)).toEqual(defaultProfile);
    expect(defaultProfile.variation).toEqual({
      mutationStrength: 'medium',
      noveltyWindow: 7,
    });
    expect(defaultProfile.features).toMatchObject({
      lines: 'normal',
      curves: 'rare',
      generativeShapes: 'rare',
      gradients: 'normal',
      patterns: 'normal',
      masks: 'rare',
      blendModes: 'rare',
      blurShadow: 'rare',
      animation: 'normal',
    });
    expect(Object.keys(defaultProfile.families)).toEqual([
      'geometric',
      'color-field',
      'mosaic',
      'organic',
      'generative',
      'chaotic',
    ]);
    expect(Object.values(defaultProfile.families).every(Boolean)).toBe(true);
    expect(defaultProfile.composition.maxLayers).toBe(3);
    expect(defaultProfile.experimental.mutationJumps).toBe(false);
  });

  it('lehnt unmögliche Profile mit verständlicher Meldung ab', () => {
    const noFamily = Object.fromEntries(
      Object.keys(defaultProfile.families).map((key) => [key, false]),
    );
    expect(messages({ schemaVersion: 2, ...core, families: noFamily })).toEqual(
      ['Mindestens eine Kompositionsfamilie muss aktiv bleiben.'],
    );
    expect(
      messages({ schemaVersion: 2, ...core, palette: { strategies: [] } }),
    ).toEqual(['Mindestens eine Palettenstrategie muss aktiv bleiben.']);
    expect(
      messages({
        schemaVersion: 2,
        ...core,
        palette: { strategies: ['free', 'free'] },
      }),
    ).toEqual(['Jede Palettenstrategie darf nur einmal genannt werden.']);
    expect(profileRulesVersion).toBe(2);
    expect(profileIssues(defaultProfile)).toEqual([]);
  });

  it('lehnt in Regelversion 2 eine einzige Ebene bei nachvollziehbarer Vererbung ab (A-32)', () => {
    const oneLayer = { composition: { maxLayers: 1 } };
    expect(messages({ schemaVersion: 2, ...core, ...oneLayer })).toEqual([
      'Nachvollziehbare Vererbung braucht mindestens 2 Ebenen. Mit nur einer Ebene findet der Generator nicht immer ein gültiges Werk, und der Tageslauf bliebe ohne Werk.',
    ]);
    const traceable = { inheritanceMode: 'traceable' as const };
    expect(
      settingsIssues({ ...traceable, ...defaultProfile }).map(
        (issue) => issue.rule,
      ),
    ).toEqual([]);
    expect(
      settingsIssues({
        ...traceable,
        ...defaultProfile,
        composition: { ...defaultProfile.composition, maxLayers: 1 },
      }).map((issue) => issue.path),
    ).toEqual([['composition', 'maxLayers']]);
    // `free` keeps one layer; two layers stay possible in both modes.
    for (const [inheritanceMode, maxLayers] of [
      ['free', 1],
      ['free', 2],
      ['traceable', 2],
    ] as const)
      expect(
        readGenerationConfig({
          schemaVersion: 2,
          ...core,
          inheritanceMode,
          composition: { maxLayers },
        }).profile.composition.maxLayers,
      ).toBe(maxLayers);
  });

  it('lässt archivierte Snapshots unter Regelversion 1 gültig', () => {
    // Works store no rules version; the stricter configuration rules never
    // invalidate a snapshot of schema 3 afterwards.
    const snapshot = {
      inheritanceMode: 'traceable',
      ...defaultProfile,
      composition: { ...defaultProfile.composition, maxLayers: 1 },
    };
    expect(settingsSnapshotSchema.safeParse(snapshot).success).toBe(true);
    expect(
      configV2Schema.safeParse({ schemaVersion: 2, ...core, ...snapshot })
        .success,
    ).toBe(false);
  });

  it('lässt ein einzelnes verbleibendes Merkmal je Mindestregel zu', () => {
    const oneFamily = Object.fromEntries(
      Object.keys(defaultProfile.families).map((key) => [
        key,
        key === 'mosaic',
      ]),
    );
    const config = readGenerationConfig({
      schemaVersion: 2,
      ...core,
      families: oneFamily,
      palette: { strategies: ['monochrome'] },
      features: Object.fromEntries(
        Object.keys(defaultProfile.features).map((key) => [key, 'off']),
      ),
    });
    expect(config.profile.families.mosaic).toBe(true);
  });

  it.each([
    { features: { gradients: 'sometimes' } },
    { features: { glitter: 'normal' } },
    { families: { colorField: true } },
    { variation: { noveltyWindow: 0 } },
    { variation: { noveltyWindow: 31 } },
    { composition: { maxLayers: 4 } },
    { palette: 'free' },
    { secret: 'x' },
    { generationEnabled: true, seriesStartDate: null },
    { inheritanceMode: 'demo' },
  ])('weist unbekannte Schlüssel und Werte zurück: %j', (patch) => {
    expect(() =>
      readGenerationConfig({ schemaVersion: 2, ...core, ...patch }),
    ).toThrow();
  });

  it('verlangt im strengen Schema 2 selbst das vollständige Profil', () => {
    expect(
      configV2Schema.safeParse({ schemaVersion: 2, ...core }).success,
    ).toBe(false);
    expect(
      configV2Schema.safeParse({ schemaVersion: 2, ...core, ...defaultProfile })
        .success,
    ).toBe(true);
  });

  it('behandelt unbekannte Schemaversionen nicht als Schema 2', () => {
    expect(() => readGenerationConfig({ schemaVersion: 3, ...core })).toThrow();
    expect(() => readGenerationConfig(null)).toThrow();
    expect(() => readGenerationConfig([])).toThrow();
  });
});
