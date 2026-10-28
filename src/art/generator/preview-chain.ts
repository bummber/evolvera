import { z } from 'zod';
import { generateArtwork } from './evolve';
import { validateEvolution } from './provenance';
import { artworkV2Schema } from '../schema/artwork';
import type { EvolutionArtwork } from '../schema/artwork';
import { modeSchema, workDateSchema } from '../schema/config';
import { snapshotSettings } from '../../operator/settings';

export const previewChainSchema = z.strictObject({
  schemaVersion: z.literal(1),
  kind: z.literal('evolution-preview'),
  inheritanceMode: modeSchema,
  simulationStart: workDateSchema,
  works: z.array(artworkV2Schema).min(2).max(400),
});
export type PreviewChain = z.infer<typeof previewChainSchema>;

/** Simulation only. Dates are injected fixture metadata, not a configured series start. */
export function createPreviewChain(
  mode: 'traceable' | 'free',
  length = 10,
  start = '2000-01-01',
  prefix = 'evolvera:phase-2',
): PreviewChain {
  modeSchema.parse(mode);
  workDateSchema.parse(start);
  if (!Number.isInteger(length) || length < 2 || length > 400)
    throw new Error('Vorschaukette: 2–400 Generationen.');
  const works: EvolutionArtwork[] = [];
  const settings = snapshotSettings({
    schemaVersion: 1,
    revision: 1,
    seriesStartDate: null,
    generationEnabled: false,
    timezone: 'Europe/Berlin',
    inheritanceMode: mode,
  });
  const day = new Date(`${start}T12:00:00Z`);
  for (let index = 0; index < length; index++) {
    const workDate = day.toISOString().slice(0, 10);
    // At 04:00 Berlin DST transitions are complete. No 24h addition to a Berlin instant.
    const offset = new Intl.DateTimeFormat('en', {
      timeZone: 'Europe/Berlin',
      timeZoneName: 'shortOffset',
    })
      .formatToParts(new Date(`${workDate}T04:00:00Z`))
      .find((part) => part.type === 'timeZoneName')!.value;
    const hours = Number(offset.replace('GMT', ''));
    const scheduledFor = `${workDate}T04:00:00+${String(hours).padStart(2, '0')}:00`;
    const runStartedAt = new Date(
      Date.parse(scheduledFor) + 1000,
    ).toISOString();
    const generatedAt = new Date(Date.parse(scheduledFor) + 2000).toISOString();
    works.push(
      generateArtwork(
        {
          generation: index + 1,
          workDate,
          scheduledFor,
          runStartedAt,
          settings,
          parents: index < 2 ? [] : works.slice(-2),
          seed: `${prefix}:${mode}:${index + 1}`,
          usedTitles: works.map((work) => work.title),
        },
        () => generatedAt,
      ),
    );
    day.setUTCDate(day.getUTCDate() + 1);
  }
  return validatePreviewChain({
    schemaVersion: 1,
    kind: 'evolution-preview',
    inheritanceMode: mode,
    simulationStart: start,
    works,
  });
}
export function validatePreviewChain(input: unknown): PreviewChain {
  const chain = previewChainSchema.parse(input);
  const date = new Date(`${chain.simulationStart}T12:00:00Z`);
  const titles = new Set<string>();
  chain.works.forEach((work, index) => {
    if (
      work.id !== date.toISOString().slice(0, 10) ||
      work.generation !== index + 1 ||
      work.inheritanceMode !== chain.inheritanceMode
    )
      throw new Error(
        'Datums-, Modus- oder Generationenlücke in der Vorschaukette.',
      );
    const key = work.title.normalize('NFC').toLocaleLowerCase('de-DE');
    if (titles.has(key))
      throw new Error('Doppelter Titel in der Vorschaukette.');
    titles.add(key);
    validateEvolution(
      work,
      index < 2 ? [] : chain.works.slice(index - 2, index),
    );
    date.setUTCDate(date.getUTCDate() + 1);
  });
  return chain;
}
