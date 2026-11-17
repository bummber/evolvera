// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { sections } from '../src/admin/fields';
import {
  defaultProfile,
  profileSchema,
  settingsIssues,
} from '../src/art/schema/profile';
import {
  presets,
  profileWarnings,
  settingsChanges,
  type Settings,
} from '../src/operator/profile-form';
import { writableSettingsSchema } from '../workers/admin/github';

// EP-01 P8: pure helpers of the operator page.

const standard: Settings = {
  inheritanceMode: 'traceable',
  ...structuredClone(defaultProfile),
};
const leaves = (value: unknown, prefix = ''): string[] =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? Object.entries(value).flatMap(([key, entry]) =>
        leaves(entry, prefix ? `${prefix}.${key}` : key),
      )
    : [prefix];

describe('Betreiberseite: Schalter, Schnellprofile und Hinweise', () => {
  it('bietet jeden schreibbaren Schlüssel genau einmal an, in sieben Bereichen', () => {
    expect(sections.map((section) => section.title)).toEqual([
      'Komposition',
      'Evolution',
      'Formen',
      'Oberfläche',
      'Farbe',
      'Bewegung',
      'Experimente',
    ]);
    const offered = sections.flatMap((section) =>
      section.fields.flatMap((field) =>
        // Families are one field for all six switches.
        field.path === 'families'
          ? Object.keys(defaultProfile.families).map((key) => `families.${key}`)
          : [field.path],
      ),
    );
    expect(new Set(offered).size).toBe(offered.length);
    expect([...offered].sort()).toEqual(leaves(standard).sort());
    for (const field of sections.flatMap((section) => section.fields))
      expect(field.help.trim().length).toBeGreaterThan(20);
  });

  it('nennt im Erklärsatz der Dichte die Wirkung auf die Zahl der Formen', () => {
    const density = sections[0]!.fields.find(
      (field) => field.path === 'composition.density',
    )!;
    expect(density.help).toContain('weniger Formen');
    expect(density.help).toContain('Vererbte Ebenen behalten ihre Formen');
  });

  it('hat drei vollständige, regelkonforme Schnellprofile', () => {
    expect(presets.standard).toEqual(defaultProfile);
    for (const profile of Object.values(presets)) {
      expect(profileSchema.parse(profile)).toEqual(profile);
      for (const inheritanceMode of ['traceable', 'free'] as const) {
        expect(settingsIssues({ inheritanceMode, ...profile })).toEqual([]);
        expect(
          writableSettingsSchema.safeParse({ inheritanceMode, ...profile })
            .success,
        ).toBe(true);
      }
    }
    expect(presets.calm.composition.density).toBe('sparse');
    expect(presets.calm.variation.mutationStrength).toBe('calm');
    expect(presets.wild.composition.density).toBe('dense');
    expect(presets.wild.experimental.mutationJumps).toBe(true);
    // The standard profile itself stays untouched.
    expect(defaultProfile.composition.density).toBe('varied');
  });

  it('warnt bei vielfaltverringernden Kombinationen, nicht beim Standard', () => {
    expect(profileWarnings(standard)).toEqual([]);
    const narrow: Settings = {
      ...structuredClone(standard),
      families: {
        geometric: false,
        'color-field': true,
        mosaic: false,
        organic: false,
        generative: false,
        chaotic: false,
      },
      palette: { strategies: ['monochrome'], contrast: 'varied' },
      features: {
        ...standard.features,
        gradients: 'off',
        patterns: 'off',
        animation: 'always',
      },
      variation: { mutationStrength: 'medium', noveltyWindow: 1 },
    };
    const warnings = profileWarnings(narrow);
    expect(warnings).toHaveLength(4);
    expect(warnings.join(' ')).toContain('Nur eine Kompositionsfamilie');
    expect(warnings.join(' ')).toContain('Nur eine Palettenstrategie');
    expect(warnings.join(' ')).toContain('3 Merkmale stehen fest');
  });

  it('fasst die Änderungen gegenüber der gespeicherten Revision zusammen', () => {
    expect(settingsChanges(standard, standard)).toEqual([]);
    const changes = settingsChanges(standard, {
      ...standard,
      ...structuredClone(presets.calm),
      inheritanceMode: 'free',
      families: { ...standard.families, chaotic: false },
    });
    expect(
      changes.map((change) => `${change.label}: ${change.from} → ${change.to}`),
    ).toEqual([
      'Vererbungsmodus: Nachvollziehbar → Frei',
      'Mutationsstärke: Mittel → Ruhig',
      'Muster: Normal → Selten',
      'Bewegung: Normal → Selten',
      'Kontrast: Wechselnd → Niedrig',
      'Chaotische Überlagerung: an → aus',
      'Dichte: Wechselnd → Sparsam',
      'Bewegungsstärke: Wechselnd → Dezent',
    ]);
  });
});
