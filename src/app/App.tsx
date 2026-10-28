import { lazy, Suspense, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { modeLabels } from '../art/schema/config';
import { initialSettings } from '../operator/settings';
import { collectionKey, collectionLink } from '../archive/reader';

const ArchivePage = lazy(() => import('./ArchivePages'));
const ArtReview = lazy(() => import('./ArtReview'));
const Atelier = lazy(() => import('./Atelier'));
const EvolutionLab = lazy(() => import('./EvolutionLab'));

const navigation = [
  ['/', 'Heute'],
  ['/galerie', 'Galerie'],
  ['/evolution', 'Evolution'],
  ['/ueber', 'Über Evolvera'],
  ['/einstellungen', 'Einstellungen'],
  ['/atelier', 'Testatelier'],
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
            Die Kunst besteht ausschließlich aus HTML-Elementen und CSS: Formen,
            Farben, Verläufe und Bewegung. Ohne Bilddateien, SVG, Canvas oder
            WebGL.
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
            Dies ist die lokale Vorschau. Im getrennten Testatelier stehen erste
            unabhängige Studien mit HTML-/CSS-Renderer bereit. Die getrennte
            Testsammlung zeigt 40 Werke in beiden Modi mit Galerie,
            Herkunftsvergleich und poetischen Titeln. Betreiberanmeldung und
            täglicher Betrieb folgen später. Erst nach ausdrücklicher Abnahme
            von 30–50 separaten Testwerken beider Modi beginnt die offizielle
            Serie.
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
  const pageAddress = location.pathname + location.search;
  const previous = useRef(pageAddress);
  const source = collectionKey(new URLSearchParams(location.search));
  const navTarget = (path: string) =>
    source && ['/', '/galerie', '/evolution'].includes(path)
      ? collectionLink(path, source)
      : path;
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const updateTitle = () => {
      const heading = main.current?.querySelector('h1');
      document.title = `${heading?.textContent ?? navigation.find(([path]) => path === location.pathname)?.[1] ?? (location.pathname === '/kunstpruefung' ? 'Kunstsichtung' : location.pathname === '/evolutionslabor' ? 'Evolutionslabor' : 'Evolvera')} · Evolvera Vorschau`;
    };
    updateTitle();
    const observer = new MutationObserver(updateTitle);
    if (main.current)
      observer.observe(main.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    if (previous.current !== pageAddress) {
      main.current?.focus();
      window.scrollTo?.(0, 0);
      previous.current = pageAddress;
    }
    return () => observer.disconnect();
  }, [location.pathname, pageAddress]);
  return (
    <div className="page">
      <div className="preview-bar">
        <span>Lokale Vorschau · Phase 3</span>
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
          <Link
            to={navTarget('/')}
            className="brand"
            aria-label="Evolvera – Heute"
          >
            evolvera
            <span className="brand-dot" aria-hidden="true">
              ↗
            </span>
          </Link>
          <nav className="desktop-navigation" aria-label="Hauptnavigation">
            {navigation.map(([path, label]) => (
              <NavLink key={path} to={navTarget(path)} end={path === '/'}>
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
                  to={navTarget(path)}
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
          <Suspense fallback={<p role="status">Ansicht wird geladen …</p>}>
            <Routes>
              <Route path="/" element={<ArchivePage view="today" />} />
              <Route
                path="/atelier"
                element={
                  <Suspense
                    fallback={<p role="status">Testatelier wird geladen …</p>}
                  >
                    <Atelier />
                  </Suspense>
                }
              />
              <Route
                path="/evolutionslabor"
                element={
                  <Suspense
                    fallback={
                      <p role="status">Evolutionslabor wird geladen …</p>
                    }
                  >
                    <EvolutionLab />
                  </Suspense>
                }
              />
              <Route path="/galerie" element={<ArchivePage view="gallery" />} />
              <Route
                path="/evolution"
                element={<ArchivePage view="evolution" />}
              />
              <Route
                path="/werk/:date"
                element={<ArchivePage view="detail" />}
              />
              <Route path="/kunstpruefung" element={<ArtReview />} />
              <Route path="/ueber" element={<About />} />
              <Route path="/einstellungen" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
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
