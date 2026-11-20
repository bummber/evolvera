import { useEffect, useState } from 'react';
import { z } from 'zod';
import { workDateSchema } from '../art/schema/config';
import { favoritesIndexSchema, parentsOf } from '../archive/favorites';
import type { Favorite } from '../archive/favorites';
import { Page } from './AdminApp';

// Package B: the operator marks works of the running series as favourites or
// removes them. The worker copies a favourite and its direct parents outside
// the series archive; success is shown only after the worker confirmed the
// commit. The local review mode reads and saves nothing.

const gallery = 'https://bummber.github.io/evolvera/#';
const viewSchema = z.object({
  series: workDateSchema.nullable(),
  works: z.array(
    z.object({
      id: workDateSchema,
      generation: z.number().int().positive(),
      title: z.string().min(1),
    }),
  ),
  favorites: favoritesIndexSchema,
  restart: workDateSchema.nullable(),
});
type View = z.infer<typeof viewSchema>;
type Status =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'saved'; changed: boolean; text: string }
  | { kind: 'conflict' }
  | { kind: 'signedOut' }
  | { kind: 'failed' };
const dateLabel = (id: string) =>
  new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(`${id}T12:00:00Z`));
const key = (entry: { series: string; id: string }) =>
  `${entry.series}/${entry.id}`;

export function FavoritesApp({ review }: { review: boolean }) {
  const [view, setView] = useState<View | null>(null);
  const [csrf, setCsrf] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [loadFailed, setLoadFailed] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (review) return;
    let active = true;
    fetch('/api/favorites', { credentials: 'same-origin', cache: 'no-store' })
      .then(async (response) => {
        if (!active) return;
        if (response.status === 401) return setStatus({ kind: 'signedOut' });
        if (!response.ok) throw new Error('load');
        const data = viewSchema
          .extend({ csrf: z.string().min(1) })
          .parse(await response.json());
        if (!active) return;
        setView(data);
        setCsrf(data.csrf);
      })
      .catch(() => active && setLoadFailed(true));
    return () => {
      active = false;
    };
  }, [review]);

  if (review)
    return (
      <Page title="Favoriten." review>
        <p className="notice">
          Favoriten sind nur mit Anmeldung verfügbar. In der lokalen Sichtung
          wird nichts gelesen oder gespeichert.
        </p>
      </Page>
    );
  if (status.kind === 'signedOut')
    return (
      <Page title="Favoriten.">
        <p className="notice" role="status">
          Die Sitzung ist abgelaufen oder beendet. Es wurde nichts gespeichert.
        </p>
        <p>
          <a href="/login">Mit GitHub anmelden</a>
        </p>
      </Page>
    );
  if (loadFailed)
    return (
      <Page title="Favoriten.">
        <p className="notice" role="alert">
          Die Favoriten konnten nicht geladen werden. Es wird nichts angezeigt
          oder gespeichert, solange der Stand unsicher ist.
        </p>
        <p>
          <a href="/favorites">Neu laden</a>
        </p>
      </Page>
    );
  if (!view || !csrf)
    return (
      <Page title="Favoriten.">
        <p role="status">Favoriten werden geladen …</p>
      </Page>
    );

  const marked = new Set(view.favorites.favorites.map(key));
  const change = async (
    action: 'add' | 'remove',
    entry: { series: string; id: string; title: string },
  ) => {
    setConfirm(null);
    setStatus({ kind: 'saving' });
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csrf,
          action,
          series: entry.series,
          id: entry.id,
        }),
      });
      if (response.status === 401) return setStatus({ kind: 'signedOut' });
      if (response.status === 409) return setStatus({ kind: 'conflict' });
      if (!response.ok) return setStatus({ kind: 'failed' });
      const body = viewSchema
        .extend({ changed: z.boolean() })
        .parse(await response.json());
      setView(body);
      setStatus({
        kind: 'saved',
        changed: body.changed,
        text:
          action === 'add'
            ? `„${entry.title}“ ist Favorit und mit seinen direkten Eltern gesichert.`
            : `„${entry.title}“ ist kein Favorit mehr.`,
      });
    } catch {
      setStatus({ kind: 'failed' });
    }
  };
  const busy = status.kind === 'saving';

  return (
    <Page title="Favoriten.">
      <p>
        Ein Favorit bleibt mit seinen direkten Eltern als Kopie erhalten, auch
        wenn die Serie gelöscht oder neu gestartet wird. Die Galerie zeigt die
        Favoriten öffentlich unter{' '}
        <a href={`${gallery}/favoriten`}>Favoriten</a>.
      </p>
      {view.restart && (
        <p className="restart-notice">
          Nächster Neustart der Serie:{' '}
          <strong>{dateLabel(view.restart)}</strong>. Dann löscht der Tageslauf
          alle Werke der laufenden Serie; was bis dahin nicht als Favorit
          markiert ist, verschwindet aus der Galerie.
        </p>
      )}
      <SaveStatus status={status} />
      <section aria-labelledby="favorites-title">
        <h2 id="favorites-title">
          Favoriten ({view.favorites.favorites.length})
        </h2>
        {view.favorites.favorites.length ? (
          <ul className="works">
            {view.favorites.favorites.map((entry) => (
              <li key={key(entry)}>
                <WorkLine work={entry} />
                <p className="help">
                  {parentsOf(entry.series, entry.id).length
                    ? `Mit Eltern vom ${parentsOf(entry.series, entry.id)
                        .map(dateLabel)
                        .join(' und ')}.`
                    : 'Ursprungswerk ohne Eltern.'}{' '}
                  Serie ab {dateLabel(entry.series)}.
                </p>
                {confirm === key(entry) ? (
                  <div role="group" aria-label="Entfernen bestätigen">
                    <p>
                      Wirklich entfernen? Die Kopien, die kein anderer Favorit
                      braucht, werden gelöscht.
                    </p>
                    <button
                      type="button"
                      className="primary"
                      disabled={busy}
                      onClick={() => void change('remove', entry)}
                    >
                      Ja, entfernen
                    </button>
                    <button type="button" onClick={() => setConfirm(null)}>
                      Abbrechen
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setConfirm(key(entry))}
                    aria-label={`„${entry.title}“ als Favorit entfernen`}
                  >
                    Entfernen
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Noch keine Favoriten.</p>
        )}
      </section>
      <section aria-labelledby="works-title">
        <h2 id="works-title">Werke der laufenden Serie</h2>
        {!view.series ? (
          <p>Die Serie hat noch nicht begonnen.</p>
        ) : view.works.length === 0 ? (
          <p>Noch keine archivierten Werke.</p>
        ) : (
          <ul className="works">
            {view.works.map((work) => {
              const entry = { ...work, series: view.series! };
              return (
                <li key={work.id}>
                  <WorkLine work={entry} link />
                  {marked.has(key(entry)) ? (
                    <p className="help">Favorit.</p>
                  ) : (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void change('add', entry)}
                      aria-label={`„${work.title}“ als Favorit markieren`}
                    >
                      Als Favorit markieren
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <form action="/logout" method="post" className="logout">
        <input type="hidden" name="csrf" value={csrf} />
        <button>Abmelden</button>
      </form>
    </Page>
  );
}

function WorkLine({
  work,
  link = false,
}: {
  work: Pick<Favorite, 'id' | 'generation' | 'title'>;
  link?: boolean;
}) {
  return (
    <p className="work">
      <span>
        Generation {work.generation} · {dateLabel(work.id)}
      </span>
      <strong>{work.title}</strong>
      {link && <a href={`${gallery}/werk/${work.id}`}>Werk ansehen</a>}
    </p>
  );
}

function SaveStatus({ status }: { status: Status }) {
  if (status.kind === 'saving')
    return (
      <p className="notice" role="status">
        Wird gespeichert …
      </p>
    );
  if (status.kind === 'saved')
    return (
      <p className="notice" role="status">
        {status.changed
          ? `In Git gespeichert und bestätigt. ${status.text}`
          : 'Keine Änderung gegenüber dem gespeicherten Stand; nichts geschrieben.'}
      </p>
    );
  if (status.kind === 'conflict')
    return (
      <div className="notice" role="alert">
        <p>
          Speicherkonflikt: Der Git-Stand wurde inzwischen geändert. Fremde
          Änderungen wurden nicht überschrieben.
        </p>
        <a href="/favorites">Favoriten neu laden</a>
      </div>
    );
  if (status.kind === 'failed')
    return (
      <p className="notice" role="alert">
        Speichern nicht bestätigt. Es wird kein Erfolg behauptet; bitte neu
        laden und prüfen.
      </p>
    );
  return null;
}
