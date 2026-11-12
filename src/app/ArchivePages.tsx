import { dailyTime } from '../series/calendar';
import { useCallback, useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  berlinCycleDate,
  collectionKey,
  acceptanceCollections,
  collectionLink,
  ep01Collections,
  loadWorkContext,
  openCollection,
  pageOf,
} from '../archive/reader';
import type {
  ArchiveReader,
  CollectionKey,
  WorkContext,
} from '../archive/reader';
import type { ArchiveIndex } from '../archive';
import type { AnyArtwork } from '../art/schema/artwork-v3';
import { modeLabels, workDateSchema } from '../art/schema/config';
import { initialSettings } from '../operator/settings';
import { ArtDispatch } from '../art/renderer/ArtDispatch';
import { ArtStage } from '../art/renderer/ArtStage';
import { WorkProvenance } from './WorkProvenance';
import { WorkConditions } from './WorkConditions';
import { WorkComposition } from './WorkComposition';
import { StageFrame } from './StageFrame';
import { WorkTitle } from './WorkTitle';
import { EvolutionBraid } from './EvolutionBraid';

type Resource<T> =
  { status: 'loading' } | { status: 'error' } | { status: 'ready'; value: T };
function useResource<T>(
  key: string,
  task: (signal: AbortSignal) => Promise<T>,
): Resource<T> {
  const [state, setState] = useState<{
    key: string;
    result: Resource<T>;
  } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    task(controller.signal).then(
      (value) => {
        if (!controller.signal.aborted)
          setState({ key, result: { status: 'ready', value } });
      },
      () => {
        if (!controller.signal.aborted)
          setState({ key, result: { status: 'error' } });
      },
    );
    return () => controller.abort();
  }, [key, task]);
  return state?.key === key ? state.result : { status: 'loading' };
}
const dateLabel = (id: string) =>
  new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${id}T12:00:00Z`));
const instantLabel = (value: string) =>
  new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'Europe/Berlin',
  }).format(new Date(value));
function Heading({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children?: ReactNode;
}) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children}
    </>
  );
}
function Failure({ work = false }: { work?: boolean }) {
  return (
    <div className="notice" role="alert">
      <span className="notice-label">Fehler</span>
      <h2>
        {work ? 'Werk gerade nicht verfügbar' : 'Archiv gerade nicht verfügbar'}
      </h2>
      <p>
        Die Werkdaten konnten nicht geladen oder geprüft werden. Das ist kein
        leeres Archiv. Es wird nichts neu erzeugt.
      </p>
      <button
        className="secondary-button"
        type="button"
        onClick={() => window.location.reload()}
      >
        Erneut laden
      </button>
    </div>
  );
}
// EP-01 P6: preview collections of generator 0.3.0. Texts per collection;
// the two reviewed test collections keep their wording.
const ep01Info: Partial<
  Record<
    CollectionKey,
    { option: string; count: number; eyebrow: string; review?: true }
  >
> = {
  // EP-01 P7: the works of the art review of generator 0.3.0 (approved).
  'abnahme-traceable': {
    option: 'Abnahme 0.3.0 · Nachvollziehbare Vererbung',
    count: 20,
    eyebrow: 'Abnahmewerke · Standardprofil · zwanzig Generationen',
    review: true,
  },
  'abnahme-free': {
    option: 'Abnahme 0.3.0 · Maximale Freiheit',
    count: 20,
    eyebrow: 'Abnahmewerke · Standardprofil · zwanzig Generationen',
    review: true,
  },
  'abnahme-ruhig': {
    option: 'Abnahme 0.3.0 · Profil „Ruhig“',
    count: 6,
    eyebrow: 'Abnahmewerke · abweichendes Profil · sechs Generationen',
    review: true,
  },
  'abnahme-wild': {
    option: 'Abnahme 0.3.0 · Profil „Wild“',
    count: 6,
    eyebrow: 'Abnahmewerke · abweichendes Profil · sechs Generationen',
    review: true,
  },
  'abnahme-reduziert': {
    option: 'Abnahme 0.3.0 · Profil „Reduziert“',
    count: 6,
    eyebrow: 'Abnahmewerke · abweichendes Profil · sechs Generationen',
    review: true,
  },
  'ep01-traceable': {
    option: 'EP-01 · Nachvollziehbare Vererbung',
    count: 10,
    eyebrow: 'Eine Probekette · zehn Generationen',
  },
  'ep01-free': {
    option: 'EP-01 · Maximale Freiheit',
    count: 10,
    eyebrow: 'Eine Probekette · zehn Generationen',
  },
  'ep01-transition': {
    option: 'EP-01 · Übergang von alten Elternwerken',
    count: 14,
    eyebrow: 'Eine gemischte Probekette · vierzehn Generationen',
  },
  'ep01-constraints': {
    option: 'EP-01 · Umwandlungen durch Rahmenbedingungen',
    count: 6,
    eyebrow: 'Eine Probekette · sechs Generationen',
  },
};
function CollectionBar({ source }: { source: CollectionKey }) {
  const [search, setSearch] = useSearchParams();
  return (
    <section
      className={`collection-bar ${source !== 'official' ? 'is-preview' : ''}`}
      aria-label="Angezeigte Sammlung"
    >
      <div>
        <label htmlFor="collection">Sammlung ansehen</label>
        <select
          id="collection"
          value={source}
          onChange={(event) => {
            const next = new URLSearchParams(search);
            next.delete('sammlung');
            next.delete('seite');
            next.delete('suche');
            next.delete('werk');
            if (event.target.value !== 'official')
              next.set('sammlung', event.target.value);
            setSearch(next);
          }}
        >
          <option value="official">Offizielles Archiv</option>
          <option value="traceable">Test · Nachvollziehbare Vererbung</option>
          <option value="free">Test · Maximale Freiheit</option>
          {ep01Collections.map((key) => (
            <option key={key} value={key}>
              {ep01Info[key]!.option}
            </option>
          ))}
          {acceptanceCollections.map((key) => (
            <option key={key} value={key}>
              {ep01Info[key]!.option}
            </option>
          ))}
        </select>
      </div>
      <p>
        {source === 'official'
          ? initialSettings.generationEnabled
            ? 'Gespeicherte Werke der offiziellen Serie.'
            : 'Die offizielle Serie hat noch nicht begonnen.'
          : ep01Info[source]?.review
            ? `Abnahmewerke von Generator 0.3.0 · ${ep01Info[source].count} Werke · simulierte Daten im Januar 2000. Am 12.11.2026 abgenommen; keine offizielle Serie. Die Auswahl ändert keine Einstellung.`
            : ep01Info[source]
              ? `Probekette von Generator 0.3.0 · ${ep01Info[source].count} Werke · simulierte Daten im Januar 2000. Keine offizielle Serie und keine Kunstabnahme. Die Auswahl ändert keine Einstellung.`
              : 'Testsammlung · 20 Werke · simulierte Daten im Januar 2000. Keine offizielle Serie. Die Auswahl ändert keine Einstellung.'}
      </p>
      <Link to="/kunstpruefung">Zur gemeinsamen Kunstsichtung ↗</Link>
    </section>
  );
}
export default function ArchivePage({
  view,
}: {
  view: 'today' | 'gallery' | 'evolution' | 'detail';
}) {
  const [search] = useSearchParams();
  const key = collectionKey(search);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (view !== 'today' || key !== 'official') return;
    const update = () => {
      if (document.visibilityState !== 'hidden')
        setRefresh((value) => value + 1);
    };
    const timer = window.setInterval(update, 60000);
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, [view, key]);
  const task = useCallback(
    (signal: AbortSignal) => {
      void refresh;
      void view;
      return key
        ? openCollection(key, signal)
        : Promise.reject(new Error('Unbekannte Sammlung'));
    },
    [key, refresh, view],
  );
  const state = useResource(`collection:${key}`, task);
  if (!key)
    return (
      <Heading title="Unbekannte Sammlung" eyebrow="Adresse prüfen">
        <p className="notice" role="alert">
          <span className="notice-label">Fehler</span>
          Diese Testsammlung gibt es nicht. Bitte wähle eine vorhandene
          Sammlung.
        </p>
        <Link to="/kunstpruefung">Zur Kunstsichtung</Link>
      </Heading>
    );
  return (
    <>
      <CollectionBar source={key} />
      {state.status === 'loading' ? (
        <p role="status">Archiv wird geladen …</p>
      ) : state.status === 'error' ? (
        <Failure />
      ) : view === 'today' ? (
        <Today reader={state.value} />
      ) : view === 'gallery' ? (
        <Gallery reader={state.value} />
      ) : (
        <Detail reader={state.value} evolution={view === 'evolution'} />
      )}
    </>
  );
}
function Empty({ context }: { context: 'today' | 'gallery' | 'evolution' }) {
  return (
    <div
      className={`empty-state ${context === 'today' ? 'stage' : 'empty-message'}`}
    >
      <span
        className={context === 'today' ? 'stage-mark' : 'empty-marker'}
        aria-hidden="true"
      >
        {context === 'today' ? '01 — ∞' : '?'}
      </span>
      <h2>
        {context === 'today'
          ? 'Hier beginnt etwas Neues.'
          : context === 'gallery'
            ? 'Noch keine Werke im Archiv.'
            : 'Die Geschichte beginnt mit zwei Ursprüngen.'}
      </h2>
      <p>
        {context === 'today'
          ? initialSettings.generationEnabled
            ? 'Die Bühne ist bereit. Das erste offizielle Werk ist noch nicht veröffentlicht.'
            : initialSettings.seriesStartDate
              ? 'Die Bühne ist bereit. Die offizielle Generierung ist pausiert.'
              : 'Die Bühne ist bereit. Die offizielle Serie hat noch nicht begonnen.'
          : context === 'gallery'
            ? 'Nach dem Serienstart bleibt jedes Werk mit seinem Datum dauerhaft erhalten.'
            : 'Erst das dritte Werk verbindet die beiden unmittelbar vorherigen Generationen.'}
      </p>
      {context === 'today' && (
        <span className="caption">Leere Kunstbühne · kein Kunstwerk</span>
      )}
    </div>
  );
}
function Today({ reader }: { reader: ArchiveReader }) {
  const cycle = berlinCycleDate(new Date());
  const latest = reader.index.works.find(
    (work) => reader.key !== 'official' || work.id <= cycle,
  );
  if (latest)
    return (
      <WorkView
        reader={reader}
        id={latest.id}
        todayLabel={
          reader.key !== 'official'
            ? 'Letztes Testwerk'
            : latest.id === cycle
              ? 'Aktuelles Tageswerk'
              : 'Zuletzt veröffentlicht'
        }
      />
    );
  return (
    <>
      <div className="home-kicker">
        <span>Unberechenbar. Jeden Tag neu.</span>
        <span>Eine Galerie im Werden</span>
      </div>
      <div className="home-hero">
        <div className="home-editorial">
          <h1>
            Form wird <br />
            <span>Zukunft.</span>
          </h1>
          <p className="intro">
            Zwei Ursprünge. Unendlich viele Möglichkeiten. Eine Galerie für
            Kunst, die sich weiterentwickelt.
          </p>
          <p className="hero-description">
            Aus Farben, Formen und Regeln entsteht eine fortlaufende Geschichte.
            Was bleibt? Was verändert sich? Was kommt als Nächstes?
          </p>
          <div className="hero-actions">
            <Link
              className="primary-link"
              to="/kunstpruefung"
              aria-label="40 Testwerke entdecken ↗"
            >
              <span>40 Testwerke entdecken</span>
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" to="/galerie">
              Zur Galerie
            </Link>
            <Link className="text-link" to="/ueber">
              Das Prinzip
            </Link>
          </div>
        </div>
        <div className="home-stage">
          <StageFrame>
            {reader.index.works.length ? (
              <div className="empty-state stage">
                <h2>Noch kein fälliges Werk.</h2>
                <p>
                  Ein neues Tageswerk erscheint frühestens ab {dailyTime} Uhr
                  Berliner Zeit.
                </p>
              </div>
            ) : (
              <Empty context="today" />
            )}
          </StageFrame>
        </div>
      </div>
      <SeriesInfo />
    </>
  );
}
function SeriesInfo() {
  return (
    <section className="series-info" aria-labelledby="series-heading">
      <div className="series-intro">
        <span className="badge">
          {initialSettings.generationEnabled
            ? 'Serie aktiviert'
            : initialSettings.seriesStartDate
              ? 'Generierung pausiert'
              : 'Vor Serienstart'}
        </span>
        <h2 id="series-heading">
          {initialSettings.generationEnabled
            ? 'Die erste Veröffentlichung steht bevor.'
            : initialSettings.seriesStartDate
              ? 'Die Serie ist pausiert.'
              : 'Die erste Seite ist noch offen.'}
        </h2>
        <p>
          {initialSettings.generationEnabled
            ? `Serienstart ${initialSettings.seriesStartDate}. Die tägliche Generierung ist aktiviert.`
            : initialSettings.seriesStartDate
              ? `Serienstart ${initialSettings.seriesStartDate}. Die offizielle Generierung ist pausiert.`
              : 'Das Startdatum steht noch nicht fest. Offizielle Werke werden derzeit nicht generiert.'}
        </p>
      </div>
      <dl>
        <div>
          <dt>Geplanter Rhythmus</dt>
          <dd>Täglich ab {dailyTime} · Berlin</dd>
        </div>
        <div>
          <dt>Voreingestellter Modus</dt>
          <dd>{modeLabels[initialSettings.inheritanceMode]}</dd>
        </div>
      </dl>
      <p className="muted">
        Die 40 getrennten Testwerke aus beiden Modi sind ausdrücklich
        abgenommen.
        {!initialSettings.seriesStartDate &&
          ' Datum und Aktivierung der offiziellen Serie bleiben offen.'}
      </p>
    </section>
  );
}
function Gallery({ reader }: { reader: ArchiveReader }) {
  const [search, setSearch] = useSearchParams();
  const rawPage = search.get('seite') ?? '1';
  const page = /^[1-9]\d*$/.test(rawPage) ? Number(rawPage) : NaN;
  const term = search.get('suche') ?? '';
  const result = Number.isSafeInteger(page)
    ? pageOf(reader.index, term, page)
    : null;
  function find(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(
      new FormData(event.currentTarget).get('suche') ?? '',
    ).trim();
    const next = new URLSearchParams(search);
    next.delete('seite');
    if (value) next.set('suche', value);
    else next.delete('suche');
    setSearch(next);
  }
  const pageLink = (number: number) =>
    collectionLink('/galerie', reader.key, {
      seite: String(number),
      ...(term ? { suche: term } : {}),
    });
  return (
    <section className="gallery-page">
      <header className="gallery-heading">
        <div className="gallery-title">
          <Heading
            title="Galerie"
            eyebrow={
              reader.key === 'official'
                ? 'Das bleibende Gedächtnis'
                : (ep01Info[reader.key]?.eyebrow ??
                  'Eine Testsammlung · zwanzig Generationen')
            }
          />
        </div>
        <div className="gallery-tools">
          <p className="intro">
            Neueste zuerst. Entdecke Verwandtschaften und Brüche. Jedes Werk
            behält seine Farben, seine Komposition und seinen Titel.
          </p>
          {reader.index.works.length > 0 && (
            <form className="gallery-search" onSubmit={find}>
              <label htmlFor="gallery-search">
                Titel oder Werkdatum suchen
              </label>
              <div>
                <input
                  key={term}
                  id="gallery-search"
                  name="suche"
                  type="search"
                  defaultValue={term}
                  maxLength={160}
                />
                <button className="dark-button" type="submit">
                  Suchen
                </button>
              </div>
            </form>
          )}
        </div>
      </header>
      {reader.index.works.length === 0 ? (
        <Empty context="gallery" />
      ) : (
        <>
          {!result || result.outOfRange ? (
            <div className="notice">
              <h2>Diese Galerieseite gibt es nicht.</h2>
              <Link className="text-link" to={pageLink(1)}>
                Zur ersten Seite
              </Link>
            </div>
          ) : (
            <>
              <p className="gallery-count" role="status">
                {result.total} Werke · Seite {page} von {result.pages}
              </p>
              {result.rows.length ? (
                <div className="archive-grid">
                  {result.rows.map((row, index) => (
                    <WorkCard
                      key={`${reader.key}:${row.id}`}
                      reader={reader}
                      row={row}
                      featured={index === 0}
                    />
                  ))}
                </div>
              ) : (
                <p className="empty-message">
                  <span className="empty-marker" aria-hidden="true">
                    ?
                  </span>
                  <span>
                    Keine Werke zu dieser Suche.{' '}
                    <Link
                      className="text-link"
                      to={collectionLink('/galerie', reader.key)}
                    >
                      Alle Werke ansehen
                    </Link>
                  </span>
                </p>
              )}
              <nav className="pagination" aria-label="Galerieseiten">
                {page > 1 && (
                  <Link className="secondary-link" to={pageLink(page - 1)}>
                    ← Neuere Werke
                  </Link>
                )}
                <span>
                  Seite {page} / {result.pages}
                </span>
                {page < result.pages && (
                  <Link className="secondary-link" to={pageLink(page + 1)}>
                    Ältere Werke →
                  </Link>
                )}
              </nav>
            </>
          )}
        </>
      )}
      <p className="muted">
        Alle Kacheln zeigen gespeicherte HTML-/CSS-Kunst im festen Ruhezustand.
        Bewegung läuft ausschließlich im geöffneten Hauptwerk.
      </p>
    </section>
  );
}
function WorkCard({
  reader,
  row,
  featured = false,
}: {
  reader: ArchiveReader;
  row: ArchiveIndex['works'][number];
  featured?: boolean;
}) {
  const task = useCallback(
    (signal: AbortSignal) => reader.read(row.id, signal),
    [reader, row.id],
  );
  const state = useResource(`${reader.key}:${row.id}`, task);
  return (
    <article
      className={`archive-card${featured ? ' archive-card-featured' : ''}`}
    >
      <Link
        to={collectionLink(`/werk/${row.id}`, reader.key)}
        aria-label={`Generation ${row.generation}: ${row.title}`}
      >
        <div className="card-art">
          {state.status === 'ready' ? (
            <ArtDispatch source={state.value} />
          ) : (
            <div
              className="card-placeholder"
              role={state.status === 'error' ? 'alert' : 'status'}
            >
              {state.status === 'error'
                ? 'Werkdaten nicht verfügbar'
                : 'Werk wird geladen …'}
            </div>
          )}
        </div>
        <div className="card-body">
          <div className="card-meta">
            <span>Generation {row.generation}</span>
            <time dateTime={row.id}>{dateLabel(row.id)}</time>
          </div>
          <h2>{row.title}</h2>
          {state.status === 'ready' && (
            <span className="card-mode">
              {modeLabels[state.value.inheritanceMode]}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
function Detail({
  reader,
  evolution,
}: {
  reader: ArchiveReader;
  evolution: boolean;
}) {
  const { date = '' } = useParams();
  const [search, setSearch] = useSearchParams();
  const id = evolution
    ? (search.get('werk') ?? reader.index.works[0]?.id ?? '')
    : date;
  if (!id && evolution)
    return (
      <section className="evolution-empty">
        <Heading title="Evolution" eyebrow="Woher etwas kommt">
          <p className="intro">
            Zwei unabhängige Ursprünge. Danach sind immer die letzten beiden
            Generationen die Eltern.
          </p>
          <Empty context="evolution" />
          <Link className="text-link" to="/kunstpruefung">
            Evolution an Testwerken erkunden ↗
          </Link>
        </Heading>
      </section>
    );
  if (!workDateSchema.safeParse(id).success)
    return (
      <Heading title="Ungültige Werkadresse" eyebrow="Adresse prüfen">
        <p>
          Werkadressen benötigen ein gültiges Kalenderdatum im Format
          JJJJ-MM-TT.
        </p>
        <Link to={collectionLink('/galerie', reader.key)}>Zur Galerie</Link>
      </Heading>
    );
  if (!reader.index.works.some((row) => row.id === id))
    return (
      <Heading
        title="Werk noch nicht vorhanden"
        eyebrow="Ein Werk im Zusammenhang"
      >
        <p>Für den {dateLabel(id)} liegt in dieser Sammlung kein Werk vor.</p>
        <Link to={collectionLink('/galerie', reader.key)}>Zur Galerie</Link>
      </Heading>
    );
  return (
    <WorkView
      key={`${reader.key}:${id}:${evolution}`}
      reader={reader}
      id={id}
      evolution={evolution}
      evolutionPicker={
        evolution ? (
          <form className="evolution-picker">
            <label htmlFor="evolution-work">
              Werk für den Herkunftsvergleich
            </label>
            <select
              id="evolution-work"
              value={id}
              onChange={(event) => {
                const next = new URLSearchParams(search);
                next.set('werk', event.target.value);
                setSearch(next);
              }}
            >
              {reader.index.works.map((row) => (
                <option key={row.id} value={row.id}>
                  Generation {row.generation} · {row.title}
                </option>
              ))}
            </select>
          </form>
        ) : undefined
      }
    />
  );
}
function WorkView({
  reader,
  id,
  evolution = false,
  todayLabel,
  evolutionPicker,
}: {
  reader: ArchiveReader;
  id: string;
  evolution?: boolean;
  todayLabel?: string;
  evolutionPicker?: ReactNode;
}) {
  const task = useCallback(
    (signal: AbortSignal) => loadWorkContext(reader, id, signal),
    [reader, id],
  );
  const state = useResource(`${reader.key}:${id}`, task);
  if (state.status === 'loading')
    return (
      <>
        {evolutionPicker}
        <p role="status">Werk und Herkunft werden geladen …</p>
      </>
    );
  if (state.status === 'error')
    return (
      <>
        {evolutionPicker}
        <Failure work />
      </>
    );
  return (
    <WorkPresentation
      reader={reader}
      data={state.value}
      evolution={evolution}
      todayLabel={todayLabel}
      evolutionPicker={evolutionPicker}
    />
  );
}
function Related({
  reader,
  title,
  works,
  empty,
  child,
  parentOrder,
}: {
  reader: ArchiveReader;
  title: string;
  works: AnyArtwork[];
  empty: string;
  child?: AnyArtwork;
  parentOrder?: AnyArtwork;
}) {
  return (
    <section
      className={`related-section${child ? ' parent-diagram' : ''}`}
      aria-label={title}
    >
      <h2>{title}</h2>
      {works.length ? (
        <div className="relation-grid">
          {works.map((work) => (
            <Link
              className="related-card"
              key={work.id}
              to={collectionLink(`/werk/${work.id}`, reader.key)}
              aria-label={`Generation ${work.generation}: ${work.title}`}
            >
              <ArtDispatch source={work} />
              <span>
                {(child || parentOrder) && (
                  <>
                    {(child ?? parentOrder)!.parentIds.indexOf(work.id) === 0
                      ? 'A'
                      : 'B'}{' '}
                    ·{' '}
                  </>
                )}
                Generation {work.generation} · {dateLabel(work.id)}
              </span>
              <h3>{work.title}</h3>
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty-message">
          <span className="empty-marker" aria-hidden="true">
            ?
          </span>
          <span>{empty}</span>
        </p>
      )}
      {child && works.length === 2 && (
        <>
          <div className="parent-bracket" aria-hidden="true" />
          <p className="diagram-child">
            <span className="diagram-child-art" aria-hidden="true">
              <ArtDispatch source={child} />
            </span>
            <span>Dieses Werk · Generation {child.generation}</span>
          </p>
        </>
      )}
    </section>
  );
}
function WorkPresentation({
  reader,
  data,
  evolution,
  todayLabel,
  evolutionPicker,
}: {
  reader: ArchiveReader;
  data: WorkContext;
  evolution: boolean;
  todayLabel?: string;
  evolutionPicker?: ReactNode;
}) {
  const { work, parents, successors } = data;
  const detail = !todayLabel && !evolution;
  const heading = (
    <>
      <p className="eyebrow">
        {todayLabel ?? (evolution ? 'Evolution' : 'Ein Werk im Zusammenhang')} ·
        Generation {work.generation}
        {reader.key !== 'official' ? ' · Testwerk' : ''}
      </p>
      {detail ? (
        <WorkTitle work={work} />
      ) : (
        <h1 className="work-title">{work.title}</h1>
      )}
      <div className="work-dateline">
        <time className="info-chip" dateTime={work.id}>
          {dateLabel(work.id)}
        </time>
        <span className="info-chip">{modeLabels[work.inheritanceMode]}</span>
        {work.isCatchUp && (
          <span className="badge badge-accent">Nachgeholt</span>
        )}
      </div>
    </>
  );
  const actions = (
    <div className="work-actions">
      <Link
        className="text-link"
        to={collectionLink(`/werk/${work.id}`, reader.key)}
      >
        Direktlink zum Werk ↗
      </Link>
      <Link
        className="text-link"
        to={collectionLink('/evolution', reader.key, { werk: work.id })}
      >
        Herkunft ansehen ↗
      </Link>
      <Link to={collectionLink('/galerie', reader.key)}>Zur Galerie</Link>
    </div>
  );
  const metadata = (
    <details className="work-metadata" open={detail ? true : undefined}>
      <summary>Werkdaten ansehen</summary>
      <dl>
        <div>
          <dt>Werkdatum</dt>
          <dd>
            {dateLabel(work.id)} ·{' '}
            {reader.key === 'official'
              ? 'vorgesehenes Seriendatum'
              : 'simuliertes Testdatum'}
          </dd>
        </div>
        <div>
          <dt>Geplanter Termin</dt>
          <dd>
            <time dateTime={work.scheduledFor}>
              {instantLabel(work.scheduledFor)}
            </time>
          </dd>
        </div>
        <div>
          <dt>Lauf gestartet</dt>
          <dd>
            <time dateTime={work.runStartedAt}>
              {instantLabel(work.runStartedAt)}
            </time>
          </dd>
        </div>
        <div>
          <dt>
            Tatsächlich erstellt
            {reader.key !== 'official' ? ' (simuliert)' : ''}
          </dt>
          <dd>
            <time dateTime={work.generatedAt}>
              {instantLabel(work.generatedAt)}
            </time>
          </dd>
        </div>
        <div>
          <dt>Zeitzone der Angaben</dt>
          <dd>Europe/Berlin</dd>
        </div>
        <div>
          <dt>Nachholstatus</dt>
          <dd>
            {work.isCatchUp
              ? 'Nachgeholt · Lauf erst in einem späteren Tageszyklus gestartet'
              : 'Keine Nachholung'}
          </dd>
        </div>
        <div>
          <dt>Gespeicherte Einstellung</dt>
          <dd>
            {modeLabels[work.inheritanceMode]} · Revision{' '}
            {work.settingsRevision}
          </dd>
        </div>
        <div>
          <dt>Versionen</dt>
          <dd>
            Schema {work.schemaVersion} · Generator {work.generatorVersion} ·
            Lexikon {work.lexiconVersion} · Renderer {work.rendererVersion}
          </dd>
        </div>
        <div>
          <dt>Seed</dt>
          <dd className="seed-value">{work.seed}</dd>
        </div>
      </dl>
    </details>
  );
  const information = (
    <aside className="work-information">
      {work.schemaVersion === 3 && <WorkComposition work={work} />}
      <WorkProvenance work={work} parents={parents} />
      <div className="work-records">
        {metadata}
        <WorkConditions work={work} />
      </div>
    </aside>
  );
  const stage = <ArtStage key={`${reader.key}:${work.id}`} source={work} />;
  return (
    <>
      {detail ? (
        <section className="work-detail">
          <div className="detail-toolbar">
            <Link
              className="secondary-link"
              to={collectionLink('/galerie', reader.key)}
            >
              ← Galerie
            </Link>
            <span>Generation {work.generation}</span>
          </div>
          <div className="work-layout detail-hero">
            <div className="detail-story">
              {heading}
              {work.schemaVersion === 3 && <WorkComposition work={work} />}
              {actions}
            </div>
            <div className="detail-stage">
              <StageFrame generation={work.generation}>{stage}</StageFrame>
            </div>
          </div>
          <div className="detail-inheritance">
            <Related
              reader={reader}
              title="Elternwerke"
              works={parents}
              child={work}
              empty="Ursprungswerk – unabhängig generiert, ohne Elternwerke."
            />
            <aside className="work-information">
              <WorkProvenance work={work} parents={parents} decorated />
            </aside>
          </div>
          {metadata}
          <WorkConditions work={work} />
        </section>
      ) : todayLabel ? (
        <section className="today-work">
          <div className="home-kicker home-meta">
            <span>{todayLabel}</span>
            <time dateTime={work.id}>
              {new Intl.DateTimeFormat('de-DE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              }).format(new Date(`${work.id}T12:00:00Z`))}
            </time>
            <span>
              {reader.key === 'official'
                ? `${new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(work.scheduledFor))} Berlin`
                : 'Simuliertes Testdatum'}
            </span>
          </div>
          <div className="home-hero">
            <div className="home-editorial">
              {heading}
              <div className="hero-actions">
                <Link
                  className="primary-link"
                  aria-label="Herkunft ansehen ↗"
                  to={collectionLink('/evolution', reader.key, {
                    werk: work.id,
                  })}
                >
                  <span>Herkunft ansehen</span>
                  <span aria-hidden="true">↗</span>
                </Link>
                <Link
                  className="secondary-link"
                  to={collectionLink(`/werk/${work.id}`, reader.key)}
                >
                  Direktlink zum Werk ↗
                </Link>
                <Link
                  className="text-link"
                  to={collectionLink('/galerie', reader.key)}
                >
                  Zur Galerie
                </Link>
              </div>
            </div>
            <div className="home-stage">
              <StageFrame generation={work.generation}>{stage}</StageFrame>
            </div>
          </div>
          <div className="today-information">{information}</div>
        </section>
      ) : (
        <section className="evolution-page">
          <header className="evolution-page-heading">
            <div>{heading}</div>
            <div className="evolution-page-tools">
              <p className="intro">
                Zwei unabhängige Ursprünge. Danach sind immer die letzten beiden
                Generationen die Eltern.
              </p>
              {evolutionPicker}
            </div>
          </header>
          <EvolutionBraid reader={reader} work={work} parents={parents} />
          <div className="work-layout evolution-cards">
            <section
              className="evolution-current"
              aria-label="Ausgewähltes Werk"
            >
              <h2>Ausgewähltes Werk</h2>
              {stage}
              <h3>{work.title}</h3>
              {actions}
            </section>
            <Related
              reader={reader}
              title="Elternwerke"
              works={parents}
              parentOrder={work}
              empty="Ursprungswerk – unabhängig generiert, ohne Elternwerke."
            />
          </div>
          <div className="evolution-analysis">{information}</div>
        </section>
      )}
      <div
        className={`work-relations${detail || evolution ? ' detail-relations' : ''}`}
      >
        {!detail && !evolution && (
          <Related
            reader={reader}
            title="Elternwerke"
            works={parents}
            empty="Ursprungswerk – unabhängig generiert, ohne Elternwerke."
          />
        )}
        <Related
          reader={reader}
          title="Direkte Nachfolger"
          works={successors}
          empty="In dieser Sammlung sind noch keine direkten Nachfolger vorhanden."
        />
      </div>
      {todayLabel && !initialSettings.generationEnabled && <SeriesInfo />}
      {reader.key !== 'official' && (
        <p className="atelier-notice">
          {ep01Info[reader.key]?.review ? (
            'Abnahmewerk von Generator 0.3.0 aus einer getrennten Kette. Die Daten sind simuliert. Am 12.11.2026 abgenommen; nicht Teil des offiziellen Archivs.'
          ) : ep01Info[reader.key] ? (
            'Probewerk von Generator 0.3.0 aus einer getrennten Probekette. Die Daten sind simuliert. Keine Kunstabnahme; nicht Teil des offiziellen Archivs.'
          ) : (
            <>
              Testwerk aus einer getrennten Zwanzigerkette. Die Daten sind
              simuliert. Die 40 Testwerke sind abgenommen.
              {!initialSettings.seriesStartDate &&
                ' Die offizielle Serie ist noch nicht gestartet.'}
            </>
          )}
        </p>
      )}
    </>
  );
}
