import { useCallback, useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  berlinCycleDate,
  collectionKey,
  collectionLink,
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
import type { Artwork } from '../art/schema/artwork';
import { modeLabels, workDateSchema } from '../art/schema/config';
import { initialSettings } from '../operator/settings';
import { ArtRenderer } from '../art/renderer/ArtRenderer';
import { ArtStage } from '../art/renderer/ArtStage';
import { WorkProvenance } from './WorkProvenance';

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
      <h2>
        {work ? 'Werk gerade nicht verfügbar' : 'Archiv gerade nicht verfügbar'}
      </h2>
      <p>
        Die Werkdaten konnten nicht geladen oder geprüft werden. Das ist kein
        leeres Archiv. Es wird nichts neu erzeugt.
      </p>
      <button type="button" onClick={() => window.location.reload()}>
        Erneut laden
      </button>
    </div>
  );
}
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
        </select>
      </div>
      <p>
        {source === 'official'
          ? initialSettings.generationEnabled
            ? 'Gespeicherte Werke der offiziellen Serie.'
            : 'Die offizielle Serie hat noch nicht begonnen.'
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
        <p role="alert">
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
    <div className={`empty-state ${context === 'today' ? 'stage' : ''}`}>
      <span className="stage-mark" aria-hidden="true">
        {context === 'today' ? '01 — ∞' : '—'}
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
          ? 'Die Bühne ist bereit. Die offizielle Serie hat noch nicht begonnen.'
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
            <Link className="primary-link" to="/kunstpruefung">
              40 Testwerke entdecken ↗
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
          {reader.index.works.length ? (
            <div className="empty-state stage">
              <h2>Noch kein fälliges Werk.</h2>
              <p>
                Ein neues Tageswerk erscheint frühestens ab 04:00 Uhr Berliner
                Zeit.
              </p>
            </div>
          ) : (
            <Empty context="today" />
          )}
        </div>
      </div>
      <section className="series-info" aria-labelledby="series-heading">
        <div className="series-intro">
          <span className="badge">Vor Serienstart</span>
          <h2 id="series-heading">Die erste Seite ist noch offen.</h2>
          <p>
            Das Startdatum steht noch nicht fest. Offizielle Werke werden
            derzeit nicht generiert.
          </p>
        </div>
        <dl>
          <div>
            <dt>Geplanter Rhythmus</dt>
            <dd>Täglich ab 04:00 · Berlin</dd>
          </div>
          <div>
            <dt>Voreingestellter Modus</dt>
            <dd>{modeLabels[initialSettings.inheritanceMode]}</dd>
          </div>
        </dl>
        <p className="muted">
          Die 40 getrennten Testwerke aus beiden Modi sind ausdrücklich
          abgenommen. Datum und Aktivierung der offiziellen Serie bleiben offen.
        </p>
      </section>
    </>
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
    <Heading
      title="Galerie"
      eyebrow={
        reader.key === 'official'
          ? 'Das bleibende Gedächtnis'
          : 'Eine Testsammlung · zwanzig Generationen'
      }
    >
      <p className="intro">
        Neueste zuerst. Entdecke Verwandtschaften und Brüche. Jedes Werk behält
        seine Farben, seine Komposition und seinen Titel.
      </p>
      {reader.index.works.length === 0 ? (
        <Empty context="gallery" />
      ) : (
        <>
          <form className="gallery-search" onSubmit={find}>
            <label htmlFor="gallery-search">Titel oder Werkdatum suchen</label>
            <div>
              <input
                key={term}
                id="gallery-search"
                name="suche"
                type="search"
                defaultValue={term}
                maxLength={160}
              />
              <button type="submit">Suchen</button>
            </div>
          </form>
          {!result || result.outOfRange ? (
            <div className="notice">
              <h2>Diese Galerieseite gibt es nicht.</h2>
              <Link to={pageLink(1)}>Zur ersten Seite</Link>
            </div>
          ) : (
            <>
              <p className="gallery-count" role="status">
                {result.total} Werke · Seite {page} von {result.pages}
              </p>
              {result.rows.length ? (
                <div className="archive-grid">
                  {result.rows.map((row) => (
                    <WorkCard
                      key={`${reader.key}:${row.id}`}
                      reader={reader}
                      row={row}
                    />
                  ))}
                </div>
              ) : (
                <p className="notice">
                  Keine Werke zu dieser Suche.{' '}
                  <Link to={collectionLink('/galerie', reader.key)}>
                    Alle Werke ansehen
                  </Link>
                </p>
              )}
              <nav className="pagination" aria-label="Galerieseiten">
                {page > 1 && (
                  <Link to={pageLink(page - 1)}>← Neuere Werke</Link>
                )}
                <span>
                  Seite {page} / {result.pages}
                </span>
                {page < result.pages && (
                  <Link to={pageLink(page + 1)}>Ältere Werke →</Link>
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
    </Heading>
  );
}
function WorkCard({
  reader,
  row,
}: {
  reader: ArchiveReader;
  row: ArchiveIndex['works'][number];
}) {
  const task = useCallback(
    (signal: AbortSignal) => reader.read(row.id, signal),
    [reader, row.id],
  );
  const state = useResource(`${reader.key}:${row.id}`, task);
  return (
    <article className="archive-card">
      <Link
        to={collectionLink(`/werk/${row.id}`, reader.key)}
        aria-label={`Generation ${row.generation}: ${row.title}`}
      >
        {state.status === 'ready' ? (
          <ArtRenderer source={state.value} />
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
    <>
      {evolution && (
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
      )}
      <WorkView
        key={`${reader.key}:${id}:${evolution}`}
        reader={reader}
        id={id}
        evolution={evolution}
      />
    </>
  );
}
function WorkView({
  reader,
  id,
  evolution = false,
  todayLabel,
}: {
  reader: ArchiveReader;
  id: string;
  evolution?: boolean;
  todayLabel?: string;
}) {
  const task = useCallback(
    (signal: AbortSignal) => loadWorkContext(reader, id, signal),
    [reader, id],
  );
  const state = useResource(`${reader.key}:${id}`, task);
  if (state.status === 'loading')
    return <p role="status">Werk und Herkunft werden geladen …</p>;
  if (state.status === 'error') return <Failure work />;
  return (
    <WorkPresentation
      reader={reader}
      data={state.value}
      evolution={evolution}
      todayLabel={todayLabel}
    />
  );
}
function Related({
  reader,
  title,
  works,
  empty,
}: {
  reader: ArchiveReader;
  title: string;
  works: Artwork[];
  empty: string;
}) {
  return (
    <section className="related-section" aria-label={title}>
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
              <ArtRenderer source={work} />
              <span>
                Generation {work.generation} · {dateLabel(work.id)}
              </span>
              <h3>{work.title}</h3>
            </Link>
          ))}
        </div>
      ) : (
        <p className="muted">{empty}</p>
      )}
    </section>
  );
}
function WorkPresentation({
  reader,
  data,
  evolution,
  todayLabel,
}: {
  reader: ArchiveReader;
  data: WorkContext;
  evolution: boolean;
  todayLabel?: string;
}) {
  const { work, parents, successors } = data;
  return (
    <>
      <p className="eyebrow">
        {todayLabel ?? (evolution ? 'Evolution' : 'Ein Werk im Zusammenhang')} ·
        Generation {work.generation}
        {reader.key !== 'official' ? ' · Testwerk' : ''}
      </p>
      <h1 className="work-title">{work.title}</h1>
      <div className="work-dateline">
        <time dateTime={work.id}>{dateLabel(work.id)}</time>
        <span>{modeLabels[work.inheritanceMode]}</span>
        {work.isCatchUp && <span className="badge">Nachgeholt</span>}
      </div>
      <div className="work-layout">
        <div>
          <ArtStage key={`${reader.key}:${work.id}`} source={work} />
          <div className="work-actions">
            <Link to={collectionLink(`/werk/${work.id}`, reader.key)}>
              Direktlink zum Werk ↗
            </Link>
            <Link
              to={collectionLink('/evolution', reader.key, { werk: work.id })}
            >
              Herkunft ansehen ↗
            </Link>
            <Link to={collectionLink('/galerie', reader.key)}>Zur Galerie</Link>
          </div>
        </div>
        <aside className="work-information">
          <WorkProvenance work={work} />
          <details className="work-metadata">
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
                  Schema {work.schemaVersion} · Generator{' '}
                  {work.generatorVersion} · Lexikon {work.lexiconVersion} ·
                  Renderer {work.rendererVersion}
                </dd>
              </div>
              <div>
                <dt>Seed</dt>
                <dd className="seed-value">{work.seed}</dd>
              </div>
            </dl>
          </details>
        </aside>
      </div>
      <div className="work-relations">
        <Related
          reader={reader}
          title="Elternwerke"
          works={parents}
          empty="Ursprungswerk – unabhängig generiert, ohne Elternwerke."
        />
        <Related
          reader={reader}
          title="Direkte Nachfolger"
          works={successors}
          empty="In dieser Sammlung sind noch keine direkten Nachfolger vorhanden."
        />
      </div>
      {reader.key !== 'official' && (
        <p className="atelier-notice">
          Testwerk aus einer getrennten Zwanzigerkette. Die Daten sind
          simuliert. Die 40 Testwerke sind abgenommen; die offizielle Serie ist
          noch nicht gestartet.
        </p>
      )}
    </>
  );
}
