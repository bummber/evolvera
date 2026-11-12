import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useSearchParams } from 'react-router-dom';
import rawCatalog from '../../fixtures/preview/ep01-catalog.json';
import { ArtDispatch } from '../art/renderer/ArtDispatch';
import { hasMotion } from '../art/renderer/motion';
import { loadCounts, loadLimitsV3, type DnaV3 } from '../art/schema/artwork-v3';
import { catalogSchema } from '../art/schema/catalog';
import { acceptanceCollectionV3Schema } from '../art/schema/chains-v3';
import { frameStats, type FrameStats } from './frame-stats';

// EP-01 P7: load measurement on a real device. Shows the sample sheet that
// sits exactly on all load limits and the heaviest acceptance works, each
// animated at full size, and records the gaps between animation frames.
// Nothing is stored or sent; the result is text for the operator to copy.
// The frame gaps show the pace of the main thread only, so the operator's
// own impression of the motion belongs to the result.

type Subject = { id: string; label: string; dna: DnaV3 };
type Result = {
  subject: Subject;
  animations: number;
  stats: FrameStats | null;
};

const sheet = catalogSchema
  .parse(rawCatalog)
  .sheets.find((candidate) => candidate.id === 'ep01-lastgrenze')!;

/** Rough rendering cost: effects weigh more than plain elements. */
function weight(dna: DnaV3) {
  const counts = loadCounts(dna.elements);
  return (
    counts.blurs * 8 +
    counts.blends * 4 +
    counts.masks * 4 +
    counts.clipped +
    counts.elements / 10
  );
}

async function loadSubjects(): Promise<Subject[]> {
  const files = await Promise.all([
    import('../../fixtures/preview/ep01-review.json'),
    import('../../fixtures/preview/ep01-review-profiles.json'),
  ]);
  const heaviest = files
    .flatMap((file) => acceptanceCollectionV3Schema.parse(file.default).chains)
    .flatMap((chain) =>
      chain.works.map((work) => ({
        id: `${chain.key}-${work.generation}`,
        label: `Abnahmewerk ${chain.key} Gen. ${work.generation} „${work.title}“`,
        dna: work.dna,
      })),
    )
    .filter((subject) => hasMotion({ rendererVersion: '2', dna: subject.dna }))
    .map((subject) => ({ subject, weight: weight(subject.dna) }))
    .sort(
      (a, b) => b.weight - a.weight || a.subject.id.localeCompare(b.subject.id),
    )
    .slice(0, 5)
    .map(({ subject }) => subject);
  return [
    { id: sheet.id, label: `Musterbogen „${sheet.title}“`, dna: sheet.dna },
    ...heaviest,
  ];
}

const query = '(prefers-reduced-motion: reduce)';
function subscribe(callback: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
const reduced = () =>
  typeof window.matchMedia !== 'function' || window.matchMedia(query).matches;

const describeLoad = (dna: DnaV3) => {
  const counts = loadCounts(dna.elements);
  return (Object.keys(loadLimitsV3) as (keyof typeof loadLimitsV3)[])
    .map((key) => `${key} ${counts[key]}/${loadLimitsV3[key]}`)
    .join(', ');
};

function report(results: readonly Result[], seconds: number, reduce: boolean) {
  return [
    'Evolvera Lastmessung (EP-01 P7)',
    `Zeit: ${new Date().toISOString()}`,
    `Browser: ${navigator.userAgent}`,
    `Fenster: ${window.innerWidth} × ${window.innerHeight} CSS-Pixel, Gerätepixel ${window.devicePixelRatio}`,
    `Bewegung reduzieren: ${reduce ? 'ja (Werke ruhen)' : 'nein'}`,
    `Dauer je Werk: ${seconds} s`,
    '',
    ...results.flatMap(({ subject, animations, stats }) => [
      subject.label,
      `  Last: ${describeLoad(subject.dna)}`,
      `  laufende Animationen: ${animations}`,
      stats
        ? `  Bilder ${stats.frames}, Median ${stats.median} ms, 95 % ${stats.p95} ms, längster ${stats.longest} ms, über 33 ms ${stats.over33} %, über 50 ms ${stats.over50} %`
        : '  keine Messwerte',
    ]),
  ].join('\n');
}

export default function LoadMeasure() {
  const [search] = useSearchParams();
  const requested = Number(search.get('dauer') ?? 10);
  const seconds =
    Number.isFinite(requested) && requested >= 1 && requested <= 30
      ? requested
      : 10;
  const reduce = useSyncExternalStore(subscribe, reduced, () => true);
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [current, setCurrent] = useState<number | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    loadSubjects().then(
      (loaded) => active && setSubjects(loaded),
      () => active && setFailed(true),
    );
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (current === null || !subjects) return;
    const subject = subjects[current];
    if (!subject) return;
    const times: number[] = [];
    let frame = 0;
    let begin = 0;
    const tick = (now: number) => {
      // One second to settle before the frames count.
      if (!begin) begin = now + 1000;
      if (now >= begin) times.push(now);
      if (now < begin + seconds * 1000) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const animations =
        stage.current
          ?.getAnimations({ subtree: true })
          .filter((animation) => animation.playState === 'running').length ?? 0;
      setResults((before) => [
        ...before,
        { subject, animations, stats: frameStats(times) },
      ]);
      setCurrent(current + 1 < subjects.length ? current + 1 : null);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [current, subjects, seconds]);

  const running = current !== null;
  const done =
    !running && subjects !== null && results.length === subjects.length;
  const subject = running ? subjects?.[current] : undefined;
  return (
    <section className="measure-page">
      <p className="eyebrow">EP-01 · Geräteprüfung</p>
      <h1>Lastmessung</h1>
      <p className="intro">
        Diese Seite zeigt nacheinander den Musterbogen an der Lastgrenze und die
        fünf aufwendigsten Abnahmewerke in Bewegung und misst je {seconds}{' '}
        Sekunden lang den Abstand der Bilder.
      </p>
      <p className="atelier-notice">
        Nur eine Messhilfe: Es wird nichts gespeichert und nichts gesendet.
        Bitte das Gerät währenddessen nicht bedienen und zusätzlich selbst auf
        Ruckeln achten.
        {reduce &&
          ' „Bewegung reduzieren“ ist aktiv: Die Werke ruhen, gemessen wird der Ruhezustand.'}
      </p>
      {failed && (
        <p role="alert">Die Abnahmewerke konnten nicht geladen werden.</p>
      )}
      <button
        className="secondary-button"
        type="button"
        disabled={!subjects || running}
        onClick={() => {
          setResults([]);
          setCurrent(0);
        }}
      >
        {done ? 'Messung wiederholen' : 'Messung starten'}
      </button>
      <p role="status" className="measure-status">
        {!subjects && !failed
          ? 'Werke werden geladen …'
          : running
            ? `Messung ${current + 1} von ${subjects!.length}: ${subject!.label}`
            : done
              ? 'Messung abgeschlossen.'
              : 'Bereit.'}
      </p>
      <div className="measure-stage" ref={stage}>
        {subject && (
          <ArtDispatch
            key={subject.id}
            source={{
              rendererVersion: '2',
              dna: subject.dna,
              description: subject.label,
            }}
            presentation="main"
            playback={reduce ? 'rest' : 'playing'}
          />
        )}
      </div>
      {done && (
        <>
          <h2>Ergebnis</h2>
          <p>
            Bitte den ganzen Text kopieren und zusammen mit Gerät und eigenem
            Eindruck weitergeben.
          </p>
          <textarea
            className="measure-report"
            aria-label="Messergebnis als Text"
            readOnly
            rows={24}
            value={report(results, seconds, reduce)}
            onFocus={(event) => event.target.select()}
          />
        </>
      )}
    </section>
  );
}
