import { useEffect, useId, useMemo, useState } from 'react';
import { z } from 'zod';
import { modeSchema } from '../art/schema/config';
import { profileSchema, settingsIssues } from '../art/schema/profile';
import {
  presetLabels,
  presets,
  profileWarnings,
  settingsChanges,
  type Settings,
} from '../operator/profile-form';
import { sections, type Field } from './fields';
import { Preview } from './Preview';

// EP-01 P8: the operator page. It reads the stored revision from the worker,
// checks every change with the shared rules and reports success only after
// the worker has confirmed the commit. The local review mode never saves.

const settingsSchema = z.strictObject({
  inheritanceMode: modeSchema,
  ...profileSchema.shape,
});
const loadedSchema = z.object({
  schemaVersion: z.union([z.literal(1), z.literal(2)]),
  revision: z.number().int().positive(),
  settings: settingsSchema,
  csrf: z.string().min(1),
});
type Loaded = { revision: number; settings: Settings; csrf: string | null };
type Status =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'saved'; changed: boolean; revision: number }
  | { kind: 'conflict' }
  | { kind: 'rejected'; messages: string[] }
  | { kind: 'signedOut' }
  | { kind: 'failed' };

const get = (settings: Settings, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (value, key) => (value as Record<string, unknown>)[key],
      settings,
    );
function set(settings: Settings, path: string, value: unknown): Settings {
  const next = structuredClone(settings) as unknown as Record<string, unknown>;
  const keys = path.split('.');
  let target = next;
  for (const key of keys.slice(0, -1))
    target = target[key] as Record<string, unknown>;
  target[keys.at(-1)!] = value;
  return next as unknown as Settings;
}

async function loadFromWorker(): Promise<Loaded | 'signedOut'> {
  const response = await fetch('/api/settings', {
    credentials: 'same-origin',
    cache: 'no-store',
  });
  if (response.status === 401) return 'signedOut';
  if (!response.ok) throw new Error('load');
  const data = loadedSchema.parse(await response.json());
  return { revision: data.revision, settings: data.settings, csrf: data.csrf };
}

async function loadForReview(): Promise<Loaded> {
  const [{ readGenerationConfig }, raw] = await Promise.all([
    import('../art/schema/config'),
    import('../../config/generation.json'),
  ]);
  const config = readGenerationConfig(raw.default);
  return {
    revision: config.revision,
    settings: settingsSchema.parse({
      inheritanceMode: config.inheritanceMode,
      ...config.profile,
    }),
    csrf: null,
  };
}

export function AdminApp({ review }: { review: boolean }) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [form, setForm] = useState<Settings | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;
    (review ? loadForReview() : loadFromWorker())
      .then((result) => {
        if (!active) return;
        if (result === 'signedOut') setStatus({ kind: 'signedOut' });
        else {
          setLoaded(result);
          setForm(result.settings);
        }
      })
      .catch(() => active && setLoadFailed(true));
    return () => {
      active = false;
    };
  }, [review]);

  const issues = useMemo(() => (form ? settingsIssues(form) : []), [form]);
  const warnings = useMemo(
    () => (form && issues.length === 0 ? profileWarnings(form) : []),
    [form, issues],
  );
  const changes = useMemo(
    () => (form && loaded ? settingsChanges(loaded.settings, form) : []),
    [form, loaded],
  );

  if (status.kind === 'signedOut')
    return (
      <Page>
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
      <Page>
        <p className="notice" role="alert">
          Die gespeicherten Einstellungen konnten nicht geladen werden. Es wird
          nichts angezeigt oder gespeichert, solange der Stand unsicher ist.
        </p>
        <p>
          <a href="/settings">Neu laden</a>
        </p>
      </Page>
    );
  if (!loaded || !form)
    return (
      <Page>
        <p role="status">Einstellungen werden geladen …</p>
      </Page>
    );

  const update = (path: string, value: unknown) => {
    setForm(set(form, path, value));
    if (status.kind !== 'saving') setStatus({ kind: 'idle' });
  };
  const applyPreset = (name: keyof typeof presets) => {
    setForm({
      inheritanceMode: form.inheritanceMode,
      ...structuredClone(presets[name]),
    });
    setStatus({ kind: 'idle' });
  };
  const save = async () => {
    if (review || !loaded.csrf || issues.length || !changes.length) return;
    setStatus({ kind: 'saving' });
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csrf: loaded.csrf,
          revision: loaded.revision,
          settings: form,
        }),
      });
      if (response.status === 401) return setStatus({ kind: 'signedOut' });
      if (response.status === 409) return setStatus({ kind: 'conflict' });
      if (response.status === 422) {
        const body = z
          .object({ issues: z.array(z.object({ message: z.string() })) })
          .parse(await response.json());
        return setStatus({
          kind: 'rejected',
          messages: body.issues.map((issue) => issue.message),
        });
      }
      if (!response.ok) return setStatus({ kind: 'failed' });
      const body = loadedSchema
        .omit({ csrf: true })
        .extend({ changed: z.boolean() })
        .parse(await response.json());
      setLoaded({
        ...loaded,
        revision: body.revision,
        settings: body.settings,
      });
      setForm(body.settings);
      setStatus({
        kind: 'saved',
        changed: body.changed,
        revision: body.revision,
      });
    } catch {
      setStatus({ kind: 'failed' });
    }
  };

  return (
    <Page review={review}>
      <p>
        Gespeicherte Revision <strong>{loaded.revision}</strong>. Änderungen
        wirken ab dem nächsten noch nicht begonnenen Tageslauf; bestehende Werke
        und ein bereits laufender Lauf bleiben unverändert.
      </p>
      <section aria-labelledby="presets-title" className="presets">
        <h2 id="presets-title">Schnellprofile</h2>
        <p className="help">
          Setzen alle Schalter außer dem Vererbungsmodus; danach lässt sich
          alles einzeln anpassen.
        </p>
        <div className="buttons">
          {(Object.keys(presets) as (keyof typeof presets)[]).map((name) => (
            <button type="button" key={name} onClick={() => applyPreset(name)}>
              {presetLabels[name]}
            </button>
          ))}
        </div>
      </section>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        {sections.map((section, index) => (
          <details key={section.id} open={index === 0}>
            <summary>{section.title}</summary>
            {section.fields.map((field) => (
              <FieldControl
                key={field.path}
                field={field}
                value={get(form, field.path)}
                onChange={(value) => update(field.path, value)}
              />
            ))}
          </details>
        ))}
        <section aria-labelledby="summary-title" className="summary">
          <h2 id="summary-title">
            Änderungen gegenüber Revision {loaded.revision}
          </h2>
          {changes.length ? (
            <ul>
              {changes.map((change) => (
                <li key={change.path}>
                  {change.label}: {change.from} → {change.to}
                </li>
              ))}
            </ul>
          ) : (
            <p>Keine Änderungen.</p>
          )}
          {issues.length > 0 && (
            <div className="issues" role="alert">
              {issues.map((issue) => (
                <p key={issue.rule}>{issue.message}</p>
              ))}
            </div>
          )}
          {warnings.length > 0 && (
            <div className="warnings">
              <h3>Hinweis zur Vielfalt</h3>
              {warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          )}
          {review ? (
            <p className="notice">
              Lokale Sichtung: Speichern ist hier gesperrt, es wird nichts
              gespeichert.
            </p>
          ) : (
            <button
              type="submit"
              className="primary"
              disabled={
                status.kind === 'saving' ||
                issues.length > 0 ||
                changes.length === 0
              }
            >
              {status.kind === 'saving' ? 'Wird gespeichert …' : 'Speichern'}
            </button>
          )}
          <SaveStatus status={status} />
        </section>
      </form>
      <Preview settings={form} valid={issues.length === 0} />
      {!review && loaded.csrf && (
        <form action="/logout" method="post" className="logout">
          <input type="hidden" name="csrf" value={loaded.csrf} />
          <button>Abmelden</button>
        </form>
      )}
    </Page>
  );
}

function SaveStatus({ status }: { status: Status }) {
  if (status.kind === 'saved')
    return (
      <p className="notice" role="status">
        {status.changed
          ? `In Git gespeichert und bestätigt (Revision ${status.revision}). Wirkt ab dem nächsten noch nicht begonnenen Tageslauf.`
          : 'Keine Änderung gegenüber dem gespeicherten Stand; nichts geschrieben.'}
      </p>
    );
  if (status.kind === 'conflict')
    return (
      <div className="notice" role="alert">
        <p>
          Speicherkonflikt: Der gespeicherte Stand wurde inzwischen geändert.
          Fremde Änderungen wurden nicht überschrieben.
        </p>
        <a href="/settings">Einstellungen neu laden</a>
      </div>
    );
  if (status.kind === 'rejected')
    return (
      <div className="notice" role="alert">
        {status.messages.map((message) => (
          <p key={message}>{message}</p>
        ))}
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

export function Page({
  children,
  review = false,
  title = 'Kommende Werke.',
}: {
  children: React.ReactNode;
  review?: boolean;
  title?: string;
}) {
  return (
    <main>
      <p className="eyebrow">EVOLVERA / BETREIBER</p>
      {!review && (
        <nav aria-label="Betreiberbereich" className="areas">
          <a href="/settings">Einstellungen</a>
          <a href="/favorites">Favoriten</a>
        </nav>
      )}
      <h1>{title}</h1>
      {review && (
        <p className="review" role="note">
          Lokale Sichtung ohne Anmeldung: Es wird nichts gespeichert. Gezeigt
          wird der Stand aus config/generation.json.
        </p>
      )}
      {children}
      <nav aria-label="Rechtliche Informationen">
        <a href="/privacy">Datenschutz</a> <a href="/imprint">Impressum</a>
      </nav>
      <p>
        <a href="https://bummber.github.io/evolvera/#/einstellungen">
          Zurück zur Galerie
        </a>
      </p>
    </main>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const id = useId();
  const help = (
    <p className="help" id={`${id}-help`}>
      {field.help}
    </p>
  );
  if (field.kind === 'number')
    return (
      <div className="field">
        <label htmlFor={id}>{field.label}</label>
        {help}
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={field.min}
          max={field.max}
          value={String(value)}
          aria-describedby={`${id}-help`}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isInteger(next))
              onChange(Math.min(field.max, Math.max(field.min, next)));
          }}
        />
      </div>
    );
  if (field.kind === 'toggle')
    return (
      <div className="field">
        <label className="check">
          <input
            type="checkbox"
            checked={value === true}
            aria-describedby={`${id}-help`}
            onChange={(event) => onChange(event.target.checked)}
          />
          {field.label}
        </label>
        {help}
      </div>
    );
  if (field.kind === 'list') {
    // Families are a record of switches, strategies an ordered list.
    const record = !Array.isArray(value);
    const active = record
      ? Object.entries(value as Record<string, boolean>)
          .filter(([, on]) => on)
          .map(([key]) => key)
      : (value as string[]);
    const toggle = (key: string, on: boolean) => {
      if (record)
        onChange({ ...(value as Record<string, boolean>), [key]: on });
      else
        onChange(
          Object.keys(field.options).filter((name) =>
            name === key ? on : active.includes(name),
          ),
        );
    };
    return (
      <fieldset className="field" aria-describedby={`${id}-help`}>
        <legend>{field.label}</legend>
        {help}
        <div className="options">
          {Object.entries(field.options).map(([key, label]) => (
            <label key={key} className="check">
              <input
                type="checkbox"
                checked={active.includes(key)}
                onChange={(event) => toggle(key, event.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }
  return (
    <fieldset className="field" aria-describedby={`${id}-help`}>
      <legend>{field.label}</legend>
      {help}
      <div className="options">
        {Object.entries(field.options).map(([key, label]) => (
          <label key={key} className="choice">
            <input
              type="radio"
              name={id}
              value={key}
              checked={String(value) === key}
              onChange={() => onChange(field.numeric ? Number(key) : key)}
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
