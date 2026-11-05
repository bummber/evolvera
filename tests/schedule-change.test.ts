// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { cycleDate, scheduledFor, isCatchUp } from '../src/series/calendar';
import { berlinCycleDate } from '../src/archive/reader';
import { artworkSchema } from '../src/art/schema/artwork';
import { createPreviewChain } from '../src/art/generator/preview-chain';
import { prepareRun } from '../src/automation/plan';
import { indexPath, indexText, workPath } from '../src/automation/archive';
import releaseRecord from '../config/release.json';

describe('Zeitumstellung ab Werkdatum 06.11.2026', () => {
  it.each([
    ['2026-11-05T03:59:59+01:00', '2026-11-04'],
    ['2026-11-05T04:00:00+01:00', '2026-11-05'],
    ['2026-11-06T01:16:59+01:00', '2026-11-05'],
    ['2026-11-06T01:17:00+01:00', '2026-11-06'],
    ['2027-03-28T00:16:59Z', '2027-03-27'],
    ['2027-03-28T00:17:00Z', '2027-03-28'],
    ['2027-10-30T23:16:59Z', '2027-10-30'],
    ['2027-10-30T23:17:00Z', '2027-10-31'],
    ['2027-01-01T00:16:59Z', '2026-12-31'],
    ['2027-01-01T00:17:00Z', '2027-01-01'],
  ])('hält Generator und Anzeige bei %s auf %s', (instant, expected) => {
    expect(cycleDate(instant)).toBe(expected);
    expect(berlinCycleDate(new Date(instant))).toBe(expected);
  });
  it.each([
    ['2026-11-04', '2026-11-04T04:00:00+01:00'],
    ['2026-11-05', '2026-11-05T04:00:00+01:00'],
    ['2026-11-06', '2026-11-06T01:17:00+01:00'],
    ['2027-03-28', '2027-03-28T01:17:00+01:00'],
    ['2027-03-29', '2027-03-29T01:17:00+02:00'],
    ['2027-10-31', '2027-10-31T01:17:00+02:00'],
    ['2027-11-01', '2027-11-01T01:17:00+01:00'],
  ])('erhält den korrekten Offset am Werkdatum %s', (id, expected) => {
    expect(scheduledFor(id)).toBe(expected);
  });
  it('erzeugt Gen. 3 erst ab 01:17 mit beiden Eltern und erhält historische Bytes', () => {
    const origins = createPreviewChain(
      'traceable',
      2,
      '2026-11-04',
      'synthetic:schedule',
    ).works;
    const canonical = new Map(
      origins.map((work) => [
        workPath(work.id),
        JSON.stringify(work, null, 2) + '\n',
      ]),
    );
    const current = new Map([...canonical, [indexPath, indexText(origins)]]);
    const input = {
      settings: {
        schemaVersion: 1,
        revision: 6,
        seriesStartDate: '2026-11-04',
        generationEnabled: true,
        timezone: 'Europe/Berlin',
        inheritanceMode: 'traceable',
      },
      release: { ...releaseRecord, seriesAuthorized: true },
      current,
      canonical,
      runStartedAt: '2026-11-06T01:16:59+01:00',
    };
    expect(
      prepareRun(input, () => {
        throw new Error('Zu früh');
      }).changes.size,
    ).toBe(0);
    const plan = prepareRun(
      { ...input, runStartedAt: '2026-11-06T01:17:00+01:00' },
      () => '2026-11-06T01:17:01+01:00',
    );
    expect(plan.added).toEqual([workPath('2026-11-06')]);
    for (const [path, bytes] of canonical)
      expect(plan.files.get(path)).toBe(bytes);
    const third = JSON.parse(plan.files.get(workPath('2026-11-06'))!);
    expect(third).toMatchObject({
      generation: 3,
      parentIds: ['2026-11-04', '2026-11-05'],
      scheduledFor: '2026-11-06T01:17:00+01:00',
      isCatchUp: false,
      settingsRevision: 6,
    });
    expect(
      artworkSchema.safeParse({
        ...third,
        scheduledFor: '2026-11-06T04:00:00+01:00',
        runStartedAt: '2026-11-06T04:00:01+01:00',
        generatedAt: '2026-11-06T04:00:02+01:00',
      }).success,
    ).toBe(false);
    expect(
      artworkSchema.safeParse({
        ...third,
        runStartedAt: '2026-11-06T01:16:59+01:00',
      }).success,
    ).toBe(false);
    expect(
      prepareRun(
        {
          ...input,
          runStartedAt: '2026-11-06T02:23:00+01:00',
          current: plan.files,
          canonical: new Map(
            [...plan.files].filter(([path]) => path !== indexPath),
          ),
        },
        () => {
          throw new Error('Keine Neugenerierung');
        },
      ).changes.size,
    ).toBe(0);
  });
  it('markiert Nachholung erst ab dem nächsten datierten Tageszyklus', () => {
    expect(isCatchUp('2026-11-05', '2026-11-06T01:16:59+01:00')).toBe(false);
    expect(isCatchUp('2026-11-05', '2026-11-06T01:17:00+01:00')).toBe(true);
    expect(isCatchUp('2027-03-27', '2027-03-28T01:16:59+01:00')).toBe(false);
    expect(isCatchUp('2027-03-27', '2027-03-28T01:17:00+01:00')).toBe(true);
    expect(isCatchUp('2027-10-30', '2027-10-31T01:17:00+02:00')).toBe(true);
  });
  it('plant den Hauptlauf und beide Nachholversuche in Berlin', () => {
    const workflow = readFileSync(
      new URL('../.github/workflows/pages.yml', import.meta.url),
      'utf8',
    );
    expect(
      [...workflow.matchAll(/cron: '([^']+)'\s+timezone: (\S+)/g)].map(
        (match) => [match[1], match[2]],
      ),
    ).toEqual([
      ['17 1 * * *', 'Europe/Berlin'],
      ['47 1 * * *', 'Europe/Berlin'],
      ['23 2 * * *', 'Europe/Berlin'],
    ]);
  });
});
