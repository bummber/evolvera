import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WorkComposition } from '../src/app/WorkComposition';
import { WorkConditions } from '../src/app/WorkConditions';
import { WorkProvenance } from '../src/app/WorkProvenance';
import { WorkTitle } from '../src/app/WorkTitle';
import {
  collectionKey,
  createReader,
  ep01Collections,
  loadWorkContext,
  openCollection,
} from '../src/archive/reader';
import { MAX_NOVELTY_WINDOW } from '../src/art/generator/v3/distance';
import { generateArtworkV3 } from '../src/art/generator/v3/evolve';
import type { AnyArtwork, ArtworkV3 } from '../src/art/schema/artwork-v3';
import { defaultProfile } from '../src/art/schema/profile';
import {
  indexText,
  readArchive,
  readWorks,
  workPath,
} from '../src/automation/archive';
import { ep01Reader, ep01Works } from '../src/preview/ep01';
import { reviewChains } from '../src/preview/review';
import { addDay, scheduledFor } from '../src/series/calendar';

// EP-01 P6: gallery, detail view and data validation for schema 3. All works
// come from preview fixtures or are generated here; nothing is archived.
const v3 = (key: (typeof ep01Collections)[number], generation: number) =>
  ep01Works(key).find(
    (work): work is ArtworkV3 =>
      work.generation === generation && work.schemaVersion === 3,
  )!;
const indexOf = (works: readonly AnyArtwork[]) => ({
  schemaVersion: 1 as const,
  works: works
    .toReversed()
    .map(({ id, generation, title }) => ({ id, generation, title })),
});

describe('Archivleser mit Schema 3', () => {
  it('kennt die vier EP-01-Sammlungen neben den bisherigen', () => {
    for (const key of ep01Collections)
      expect(collectionKey(new URLSearchParams(`sammlung=${key}`))).toBe(key);
    expect(collectionKey(new URLSearchParams('sammlung=ep01'))).toBeNull();
    expect(ep01Collections.map((key) => ep01Works(key).length)).toEqual([
      10, 10, 14, 6,
    ]);
  });
  it('liest eine gemischte Kette: alte Eltern im Schema 2, Kinder im Schema 3', async () => {
    const reader = await openCollection('ep01-transition');
    expect(reader.index.works).toHaveLength(14);
    const first = await loadWorkContext(reader, '2000-01-11');
    expect(first.work.schemaVersion).toBe(3);
    expect(first.parents.map((work) => work.schemaVersion)).toEqual([2, 2]);
    expect(first.parents.map((work) => work.generation)).toEqual([9, 10]);
    const second = await loadWorkContext(reader, '2000-01-12');
    expect(second.parents.map((work) => work.schemaVersion)).toEqual([2, 3]);
    const old = await loadWorkContext(reader, '2000-01-10');
    expect(old.work.schemaVersion).toBe(2);
    expect(old.successors.map((work) => work.schemaVersion)).toEqual([3, 3]);
    // The reviewed schema 2 works are the stored ones, not copies.
    expect(old.work).toEqual(reviewChains[0]!.works[9]);
  });
  it.each(ep01Collections)(
    'prüft jedes Werk der Sammlung %s samt Eltern',
    async (key) => {
      const reader = ep01Reader(key);
      for (const row of reader.index.works) {
        const context = await loadWorkContext(reader, row.id);
        expect(context.work.title).toBe(row.title);
      }
    },
  );
  it('lehnt ein Werk im Schema 3 mit erfundenem Elternbeleg ab', async () => {
    const works = structuredClone(ep01Works('ep01-traceable')) as ArtworkV3[];
    const child = works[2]!;
    // The value is still copied, but no longer from where the parent stores it.
    child.evolution.decisions[0]!.source.path = 'elements.0.opacity';
    const byId = new Map(works.map((work) => [work.id, work]));
    const reader = createReader('ep01-traceable', indexOf(works), async (id) =>
      byId.get(id),
    );
    await expect(loadWorkContext(reader, child.id)).rejects.toThrow(
      /Ausgangsbeleg/,
    );
  });
});

describe('Datenprüfung mit Schema 3 an einem synthetischen Archiv', () => {
  const files = (works: readonly AnyArtwork[]) =>
    new Map(
      works.map((work) => [workPath(work.id), JSON.stringify(work, null, 2)]),
    );
  /** Ten stored schema 2 works and two children of generator 0.3.0. */
  function mixedArchive() {
    const works: AnyArtwork[] = [...reviewChains[0]!.works.slice(0, 10)];
    let workDate = addDay(works.at(-1)!.id);
    for (let step = 0; step < 2; step++) {
      const planned = scheduledFor(workDate);
      const at = (offset: number) =>
        new Date(Date.parse(planned) + offset).toISOString();
      works.push(
        generateArtworkV3(
          {
            generation: works.length + 1,
            workDate,
            scheduledFor: planned,
            runStartedAt: at(1000),
            settings: {
              inheritanceMode: 'traceable',
              ...structuredClone(defaultProfile),
            },
            settingsRevision: 1,
            parents: works.slice(-2),
            history: works.slice(-MAX_NOVELTY_WINDOW),
            seed: `synthetic-archive:${works.length + 1}`,
            usedTitles: works.map((work) => work.title),
          },
          () => at(2000),
        ),
      );
      workDate = addDay(workDate);
    }
    return works;
  }
  it('nimmt eine reine Kette im Schema 3 mit vollständiger Historie an', () => {
    const works = ep01Works('ep01-constraints');
    const read = readArchive(files(works), '2000-01-01');
    expect(read).toEqual(works);
    expect(JSON.parse(indexText(read))).toEqual(indexOf(works));
  });
  it('nimmt eine gemischte Kette an und rechnet den Kontext der Historie nach', () => {
    const works = mixedArchive();
    expect(works.map((work) => work.schemaVersion).slice(-3)).toEqual([
      2, 3, 3,
    ]);
    expect(readArchive(files(works), '2000-01-01')).toHaveLength(12);
    // A beautified distance is noticed only because the history is checked.
    const tampered = structuredClone(works);
    const last = tampered.at(-1) as ArtworkV3;
    last.novelty.distance = last.novelty.distance! + 0.1;
    expect(() => readArchive(files(tampered), '2000-01-01')).toThrow(
      /Abstand passt nicht zum Historienkontext/,
    );
  });
  it('lässt den Tageslauf unverändert: readWorks lehnt Schema 3 weiter ab', () => {
    expect(() => readWorks(files(mixedArchive()), '2000-01-01')).toThrow();
    const old = reviewChains[0]!.works;
    expect(readArchive(files(old), '2000-01-01')).toEqual(
      readWorks(files(old), '2000-01-01'),
    );
  });
});

describe('Herkunft, Rahmenbedingungen und Beschreibung', () => {
  it('nennt Elternbeiträge an sichtbaren Formen mit Ebene und Beleg', () => {
    const work = v3('ep01-traceable', 3);
    render(<WorkProvenance work={work} parents={[]} />);
    const proofs = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(proofs).toHaveLength(work.evolution.decisions.length);
    expect(proofs[0]).toHaveTextContent(/^Elternteil [AB] · /);
    expect(proofs[0]).toHaveTextContent(/\(Form \d+ · \w+\)/);
    expect(proofs[0]).toHaveTextContent(
      work.evolution.decisions[0]!.source.path,
    );
    expect(document.body.textContent).not.toMatch(/NaN|undefined/);
    expect(
      screen.queryByText(/Durch Rahmenbedingungen umgewandelt/),
    ).not.toBeInTheDocument();
  });
  it('erklärt Elternwerke im Schema 2 und behält deren alte Pfade', () => {
    const works = ep01Works('ep01-transition');
    const work = v3('ep01-transition', 11);
    render(<WorkProvenance work={work} parents={works.slice(8, 10)} />);
    expect(
      screen.getByText(/Beide Elternwerke stammen aus einer früheren/),
    ).toBeVisible();
    expect(document.body.textContent).toMatch(/elements\.\d+\.(color|width)/);
    const next = v3('ep01-transition', 12);
    render(<WorkProvenance work={next} parents={works.slice(9, 11)} />);
    expect(screen.getByText(/Elternteil A stammt aus einer/)).toBeVisible();
  });
  it('nennt umgewandelte Merkmale ausdrücklich und nicht als Elternbeitrag', () => {
    const work = v3('ep01-constraints', 3);
    const converted = work.evolution.decisions.filter(
      (decision) => decision.operation.kind === 'constrained',
    );
    expect(converted.length).toBeGreaterThan(0);
    render(<WorkProvenance work={work} parents={[]} />);
    expect(
      screen.getByRole('heading', {
        name: 'Durch Rahmenbedingungen umgewandelt.',
      }),
    ).toBeVisible();
    expect(screen.getByText(/zählt nicht als Elternbeitrag/)).toBeVisible();
    const [contributions, conversions] = screen.getAllByRole('list');
    expect(within(contributions!).getAllByRole('listitem')).toHaveLength(
      work.evolution.decisions.length - converted.length,
    );
    const groups = within(conversions!).getAllByRole('listitem');
    expect(groups.length).toBeLessThanOrEqual(converted.length);
    expect(conversions).toHaveTextContent(
      /Linie → Rechteck, weil „Linien“ auf Aus steht/,
    );
    expect(conversions).toHaveTextContent(/→ Vollfarbe, weil „Verläufe“/);
    // Every stored conversion stays readable as raw evidence.
    for (const decision of converted)
      expect(conversions).toHaveTextContent(decision.target.path);
  });
  it('zeigt bei Ursprungswerken und freien Neuschöpfungen keine Belege', () => {
    render(<WorkProvenance work={v3('ep01-free', 1)} />);
    expect(screen.getByText(/Ursprungswerk – unabhängig/)).toBeVisible();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    const fresh = ep01Works('ep01-free').find(
      (work) => work.generation > 2 && work.evolution.decisions.length === 0,
    )!;
    render(<WorkProvenance work={fresh} />);
    expect(screen.getByText(/Vollständige gestalterische/)).toBeVisible();
  });
  it('zeigt die Rahmenbedingungen aus dem Snapshot des Werks', () => {
    const work = v3('ep01-constraints', 3);
    render(<WorkConditions work={work} />);
    const section = screen.getByText(
      'Rahmenbedingungen ansehen',
    ).parentElement!;
    expect(section).not.toHaveAttribute('open');
    for (const text of [
      'Nachvollziehbare Vererbung · Revision 2',
      'Mutationsstärke: Mittel',
      'Ähnlichkeitsfenster: 7 Werke',
      'Verläufe: Aus',
      'Linien: Aus',
      'Masken: Selten',
      'Strategien: harmonisch, komplementär, monochrom, frei',
      'Familien (6 von 6)',
      'Höchstens 3 Ebenen',
      'Mutationssprünge: Aus',
      'Mindestabstand erreicht',
    ])
      expect(section).toHaveTextContent(text);
    expect(section.textContent).not.toContain(work.novelty.contextDigest);
  });
  it('vermerkt einen verfehlten Mindestabstand und das erste Kettenwerk', () => {
    const missed = structuredClone(v3('ep01-traceable', 8));
    missed.novelty = {
      ...missed.novelty,
      distance: 0.004,
      minimumReached: false,
    };
    render(<WorkConditions work={missed} />);
    expect(
      screen.getByText('Mindestabstand nicht erreicht'),
    ).toBeInTheDocument();
    expect(document.body).toHaveTextContent('Abstand zum Fenster: 0,004');
    render(<WorkConditions work={v3('ep01-traceable', 1)} />);
    expect(document.body).toHaveTextContent('Kein Vergleichswerk');
  });
  it('erfindet für alte Werke keinen Snapshot', () => {
    const old = reviewChains[0]!.works[4]!;
    render(<WorkConditions work={old} />);
    expect(document.body).toHaveTextContent(
      `Nachvollziehbare Vererbung · Revision ${old.settingsRevision}`,
    );
    expect(document.body).toHaveTextContent(
      'Weitere Rahmenbedingungen sind in dieser Version nicht gespeichert.',
    );
    expect(document.body.textContent).not.toMatch(/Verläufe|Mindestabstand/);
  });
  it('zeigt die gespeicherte Beschreibung und den Aufbau je Ebene', () => {
    const work = v3('ep01-traceable', 7);
    render(<WorkComposition work={work} />);
    expect(screen.getByText(work.description)).toBeVisible();
    const layers = screen.getAllByRole('listitem');
    expect(layers).toHaveLength(Object.keys(work.dna.layers).length);
    const total = layers
      .map((item) => Number(/(\d+) Form/.exec(item.textContent!)![1]))
      .reduce((sum, count) => sum + count, 0);
    expect(total).toBe(work.dna.elements.length);
  });
  it('unterstreicht Titelfragmente der Eltern auch im Schema 3', () => {
    const work = ep01Collections
      .flatMap((key) => ep01Works(key))
      .find(
        (candidate) =>
          candidate.schemaVersion === 3 &&
          candidate.titleDna.parentFragments.length > 0,
      )!;
    expect(work).toBeDefined();
    render(<WorkTitle work={work} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      work.title,
    );
    expect(screen.getByRole('list', { name: 'Titelherkunft' })).toBeVisible();
  });
});
