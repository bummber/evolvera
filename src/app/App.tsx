import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { modeLabels, workDateSchema } from '../art/schema/config';
import { initialSettings } from '../operator/settings';
import { useArchive } from './useArchive';

const navigation = [
  ['/', 'Heute'],
  ['/galerie', 'Galerie'],
  ['/evolution', 'Evolution'],
  ['/ueber', 'Über Evolvera'],
  ['/einstellungen', 'Einstellungen'],
] as const;

function Page({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children}
    </>
  );
}

function EmptyArchive({
  context,
}: {
  context: 'today' | 'gallery' | 'evolution';
}) {
  const archive = useArchive();
  if (archive.status === 'loading')
    return <p role="status">Archiv wird geladen …</p>;
  if (archive.status === 'error')
    return (
      <div className="notice" role="alert">
        <h2>Archiv gerade nicht verfügbar</h2>
        <p>
          Die Werkdaten konnten nicht geladen oder geprüft werden. Bitte lade
          die Seite erneut. Das ist kein leeres Archiv.
        </p>
      </div>
    );
  if (archive.index.works.length > 0)
    return (
      <div className="notice">
        <h2>Werkdarstellung noch in Arbeit</h2>
        <p>Diese Phase-0-Vorschau stellt noch keine Archivwerke dar.</p>
      </div>
    );
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

function Today() {
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
            <Link className="primary-link" to="/galerie">
              Die Galerie entdecken <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" to="/ueber">
              Das Prinzip
            </Link>
          </div>
        </div>
        <div className="home-stage">
          <EmptyArchive context="today" />
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
          Vor dem Start werden 30–50 getrennte Testwerke aus beiden Modi
          ausdrücklich abgenommen.
        </p>
      </section>
    </>
  );
}
function Gallery() {
  return (
    <Page eyebrow="Das bleibende Gedächtnis" title="Galerie">
      <p className="intro">
        Jedes Werk behält seine Komposition, seine Farben und seine
        Bewegungsregeln. Hier wird die Serie später durchsuchbar.
      </p>
      <EmptyArchive context="gallery" />
      <p className="muted">
        Galeriekacheln zeigen künftig echte HTML-/CSS-Werke in einem festen
        Ruhezustand. Blättern und Vorschauen folgen in einer späteren Phase.
      </p>
    </Page>
  );
}
function Evolution() {
  return (
    <Page eyebrow="Woher etwas kommt" title="Evolution">
      <p className="intro">
        Zwei unabhängige Ursprungswerke eröffnen die Serie. Danach sind immer
        die letzten beiden Generationen die Eltern.
      </p>
      <EmptyArchive context="evolution" />
      <div className="two-column">
        <section className="panel">
          <h2>Nachvollziehbare Vererbung</h2>
          <p>
            Jeder Elternteil trägt ab Generation 3 ein belegbares sichtbares
            Merkmal bei. Wie viel sich verändert, bleibt offen.
          </p>
        </section>
        <section className="panel">
          <h2>Maximale Freiheit</h2>
          <p>
            Beide Eltern werden ausgewertet. Ein vollständiger gestalterischer
            Neuanfang ist erlaubt.
          </p>
        </section>
      </div>
      <p className="muted">
        Abstammungsansicht und Evolutionslogik sind noch nicht implementiert.
      </p>
    </Page>
  );
}
function About() {
  return (
    <Page eyebrow="Die Idee hinter der Serie" title="Über Evolvera">
      <p className="intro">
        Eine wachsende Sammlung abstrakter Kunst. Aus einfachen Regeln entstehen
        Verwandtschaften, Unterschiede und Überraschungen.
      </p>
      <div className="reading">
        <section>
          <h2>HTML und CSS als Material</h2>
          <p>
            Die Kunst wird ausschließlich aus HTML-Elementen und CSS bestehen:
            Formen, Farben, Verläufe und Bewegung. Ohne Bilddateien, SVG, Canvas
            oder WebGL.
          </p>
        </section>
        <section>
          <h2>Zwei Anfänge. Dann Evolution.</h2>
          <p>
            Am ersten und zweiten Serientag entsteht jeweils ein unabhängiges
            Ursprungswerk. Ab dem dritten Werk dienen die beiden unmittelbar
            vorherigen Generationen als Eltern.
          </p>
        </section>
        <section>
          <h2>Zwei Wege der Vererbung</h2>
          <p>
            „Nachvollziehbare Vererbung“ ist der Standard und verlangt sichtbare
            Beiträge beider Eltern. „Maximale Freiheit“ erlaubt auch einen
            vollständigen Bruch. Der verwendete Modus bleibt am jeweiligen Werk
            gespeichert.
          </p>
        </section>
        <section>
          <h2>Eine dauerhafte Geschichte</h2>
          <p>
            Historische Werke werden erhalten. Ein späterer Moduswechsel gilt
            erst ab dem nächsten noch nicht begonnenen Generierungslauf und
            verändert kein Archiv. Verspätet erzeugte Werke erhalten ihr
            vorgesehenes Werkdatum und eine ehrliche Nachholkennzeichnung.
          </p>
        </section>
        <section>
          <h2>Stand dieser Vorschau</h2>
          <p>
            Dies ist das lokale Grundgerüst aus Phase 0. Kunstgenerator,
            Renderer, Titelgenerator, Betreiberanmeldung und täglicher Betrieb
            folgen später. Erst nach ausdrücklicher Abnahme von 30–50 separaten
            Testwerken beider Modi beginnt die offizielle Serie.
          </p>
        </section>
      </div>
    </Page>
  );
}
function Settings() {
  return (
    <Page eyebrow="Nur für den Betreiber" title="Einstellungen">
      <p className="intro">
        Die Galerie bleibt frei zugänglich. Den Modus kommender Werke darf
        später ausschließlich der Betreiber nach GitHub-Anmeldung ändern.
      </p>
      <div className="panel settings-panel">
        <span className="badge">Anmeldung noch nicht eingerichtet</span>
        <h2>Vererbung für kommende Werke</h2>
        <dl>
          <div>
            <dt>Gespeicherte Voreinstellung</dt>
            <dd>{modeLabels[initialSettings.inheritanceMode]}</dd>
          </div>
          <div>
            <dt>Einstellungsrevision</dt>
            <dd>{initialSettings.revision}</dd>
          </div>
          <div>
            <dt>Offizielle Generierung</dt>
            <dd>Deaktiviert · Startdatum offen</dd>
          </div>
        </dl>
        <p>
          Verfügbar sein werden „Nachvollziehbare Vererbung“ und „Maximale
          Freiheit“. Ein erfolgreich gespeicherter Wechsel gilt ab dem nächsten
          noch nicht begonnenen Generierungslauf. Bestehende Werke bleiben
          erhalten.
        </p>
        <button type="button" disabled aria-describedby="auth-status">
          Mit GitHub anmelden – später verfügbar
        </button>
        <p id="auth-status" className="muted">
          Die geschützte Betreiberfunktion wird erst in einer späteren Phase
          eingerichtet. In dieser Vorschau kannst du keine Einstellungen ändern.
        </p>
      </div>
    </Page>
  );
}
function WorkDetail() {
  const { date = '' } = useParams();
  const valid = workDateSchema.safeParse(date).success;
  return (
    <Page
      eyebrow="Ein Werk im Zusammenhang"
      title={valid ? 'Werk noch nicht vorhanden' : 'Ungültige Werkadresse'}
    >
      <div className="notice">
        <p>
          {valid
            ? `Für den ${new Intl.DateTimeFormat('de-DE', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))} liegt hier kein offizielles Werk vor. Die Serie hat noch nicht begonnen.`
            : 'Werkadressen benötigen ein gültiges Kalenderdatum im Format JJJJ-MM-TT.'}
        </p>
        <p>Die vollständige Werkdarstellung folgt nach Phase 0.</p>
        <Link className="text-link" to="/galerie">
          Zur Galerie <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Page>
  );
}
function NotFound() {
  return (
    <Page eyebrow="Nicht gefunden" title="Diese Seite gibt es nicht.">
      <p>
        <Link className="text-link" to="/">
          Zurück zu Heute
        </Link>
      </p>
    </Page>
  );
}
export function App() {
  const location = useLocation();
  const main = useRef<HTMLElement>(null);
  const previous = useRef(location.pathname);
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const heading = main.current?.querySelector('h1');
    document.title = `${heading?.textContent ?? 'Evolvera'} · Evolvera Vorschau`;
    if (previous.current !== location.pathname) {
      main.current?.focus();
      window.scrollTo?.(0, 0);
      previous.current = location.pathname;
    }
  }, [location.pathname]);
  return (
    <div className="page">
      <div className="preview-bar">
        <span>Lokale Vorschau · Phase 0</span>
        <span>HTML + CSS / Serie noch nicht gestartet</span>
      </div>
      <div className="site-shell">
        <a
          className="skip-link"
          href="#main-content"
          onClick={(event) => {
            event.preventDefault();
            main.current?.focus();
          }}
        >
          Zum Inhalt
        </a>
        <header className="site-header">
          <Link to="/" className="brand" aria-label="Evolvera – Heute">
            evolvera
            <span className="brand-dot" aria-hidden="true">
              ↗
            </span>
          </Link>
          <nav className="desktop-navigation" aria-label="Hauptnavigation">
            {navigation.map(([path, label]) => (
              <NavLink key={path} to={path} end={path === '/'}>
                {label}
              </NavLink>
            ))}
          </nav>
          <details
            className="mobile-navigation"
            ref={mobileMenu}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && mobileMenu.current?.open) {
                event.preventDefault();
                mobileMenu.current.open = false;
                mobileMenu.current.querySelector('summary')?.focus();
              }
            }}
          >
            <summary>
              Menü <span aria-hidden="true">+</span>
            </summary>
            <nav aria-label="Mobile Hauptnavigation">
              {navigation.map(([path, label]) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  onClick={() => {
                    if (mobileMenu.current) mobileMenu.current.open = false;
                  }}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </details>
        </header>
        <main id="main-content" tabIndex={-1} ref={main}>
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/galerie" element={<Gallery />} />
            <Route path="/evolution" element={<Evolution />} />
            <Route path="/werk/:date" element={<WorkDetail />} />
            <Route path="/ueber" element={<About />} />
            <Route path="/einstellungen" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer>
          <p className="footer-brand">evolvera.</p>
          <p>Ein Experiment mit offenem Ausgang.</p>
          <p>HTML + CSS · Serie noch nicht gestartet</p>
        </footer>
      </div>
    </div>
  );
}
