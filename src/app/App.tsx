import { dailyTime } from '../series/calendar';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { modeLabels } from '../art/schema/config';
import { initialSettings } from '../operator/settings';
import { operatorSettings } from '../operator/access';
import { collectionKey, collectionLink } from '../archive/reader';
import { AboutIllustration } from './AboutIllustration';

const aboutChapters = [
  ['material', 'Material'],
  ['origins', 'Ursprünge'],
  ['modes', 'Vererbung'],
  ['history', 'Archiv'],
  ['preview', 'Vorschau'],
] as const;
function focusAboutChapter(hash: string) {
  const section = document.getElementById(hash.slice(1));
  section?.focus({ preventScroll: true });
  section?.scrollIntoView({ block: 'start' });
}

const ArchivePage = lazy(() => import('./ArchivePages'));
const ArtReview = lazy(() => import('./ArtReview'));
const Atelier = lazy(() => import('./Atelier'));
const EvolutionLab = lazy(() => import('./EvolutionLab'));
const LegalPages = lazy(() => import('./LegalPages'));

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
  const location = useLocation();
  useEffect(() => {
    if (!aboutChapters.some(([id]) => location.hash === `#about-${id}`)) return;
    const frame = requestAnimationFrame(() => {
      focusAboutChapter(location.hash);
    });
    return () => cancelAnimationFrame(frame);
  }, [location.hash]);
  return (
    <div className="about-page">
      <Page eyebrow="Die Idee hinter der Serie" title="Über Evolvera">
        <p className="intro">
          Eine wachsende Sammlung abstrakter Kunst. Aus einfachen Regeln
          entstehen Verwandtschaften, Unterschiede und Überraschungen.
        </p>
        <div className="about-layout">
          <nav
            className="chapter-navigation"
            aria-label="Kapitel über Evolvera"
          >
            {aboutChapters.map(([id, label], index) => (
              <Link
                key={id}
                to={`${location.pathname}${location.search}#about-${id}`}
                aria-current={
                  location.hash === `#about-${id}` ? 'location' : undefined
                }
                onClick={() => {
                  if (location.hash === `#about-${id}`)
                    focusAboutChapter(location.hash);
                }}
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {label}
              </Link>
            ))}
          </nav>
          <div className="reading about-chapters">
            <section
              id="about-material"
              tabIndex={-1}
              aria-labelledby="about-material-heading"
            >
              <div className="chapter-copy">
                <div className="chapter-heading">
                  <span aria-hidden="true">01</span>
                  <h2 id="about-material-heading">HTML und CSS als Material</h2>
                </div>
                <p>
                  Die Kunst besteht ausschließlich aus HTML-Elementen und CSS:
                  Formen, Farben, Verläufe und Bewegung. Ohne Bilddateien, SVG,
                  Canvas oder WebGL.
                </p>
              </div>
              <AboutIllustration chapter="material" />
            </section>
            <section
              id="about-origins"
              tabIndex={-1}
              aria-labelledby="about-origins-heading"
            >
              <div className="chapter-copy">
                <div className="chapter-heading">
                  <span aria-hidden="true">02</span>
                  <h2 id="about-origins-heading">
                    Zwei Anfänge. Dann Evolution.
                  </h2>
                </div>
                <p>
                  Am ersten und zweiten Serientag entsteht jeweils ein
                  unabhängiges Ursprungswerk. Ab dem dritten Werk dienen die
                  beiden unmittelbar vorherigen Generationen als Eltern.
                </p>
              </div>
              <AboutIllustration chapter="origins" />
            </section>
            <section
              id="about-modes"
              tabIndex={-1}
              aria-labelledby="about-modes-heading"
            >
              <div className="chapter-copy">
                <div className="chapter-heading">
                  <span aria-hidden="true">03</span>
                  <h2 id="about-modes-heading">Zwei Wege der Vererbung</h2>
                </div>
                <p>
                  „Nachvollziehbare Vererbung“ ist der Standard und verlangt
                  sichtbare Beiträge beider Eltern. „Maximale Freiheit“ erlaubt
                  auch einen vollständigen Bruch. Der verwendete Modus bleibt am
                  jeweiligen Werk gespeichert.
                </p>
              </div>
              <AboutIllustration chapter="modes" />
            </section>
            <section
              id="about-history"
              tabIndex={-1}
              aria-labelledby="about-history-heading"
            >
              <div className="chapter-copy">
                <div className="chapter-heading">
                  <span aria-hidden="true">04</span>
                  <h2 id="about-history-heading">Eine dauerhafte Geschichte</h2>
                </div>
                <p>
                  Historische Werke werden erhalten. Ein späterer Moduswechsel
                  gilt erst ab dem nächsten noch nicht begonnenen
                  Generierungslauf und verändert kein Archiv. Verspätet erzeugte
                  Werke erhalten ihr vorgesehenes Werkdatum und eine ehrliche
                  Nachholkennzeichnung.
                </p>
              </div>
              <AboutIllustration chapter="history" />
            </section>
            <section
              id="about-preview"
              className="about-preview"
              tabIndex={-1}
              aria-labelledby="about-preview-heading"
            >
              <div className="chapter-copy">
                <div className="chapter-heading">
                  <span aria-hidden="true">05</span>
                  <h2 id="about-preview-heading">
                    {initialSettings.generationEnabled
                      ? 'Stand der Serie'
                      : 'Stand dieser Vorschau'}
                  </h2>
                </div>
                <p>
                  {initialSettings.generationEnabled
                    ? 'Dies ist Evolvera.'
                    : 'Dies ist die Testversion von Evolvera.'}{' '}
                  Im getrennten Testatelier stehen erste unabhängige Studien mit
                  HTML-/CSS-Renderer bereit. Die getrennte Testsammlung zeigt 40
                  Werke in beiden Modi mit Galerie, Herkunftsvergleich und
                  poetischen Titeln. Die 40 Testwerke sind abgenommen.
                  {operatorSettings.adminOrigin
                    ? ' Die Betreiberanmeldung ist auf einer eigenen geschützten Betreiberseite eingerichtet.'
                    : ' Die Betreiberfunktion ist lokal vorbereitet; die Betreiberanmeldung ist noch nicht eingerichtet.'}{' '}
                  {initialSettings.generationEnabled
                    ? `Die tägliche Generierung ist aktiviert. Serienstart ${initialSettings.seriesStartDate}.`
                    : initialSettings.seriesStartDate
                      ? `Die offizielle Generierung ist pausiert. Serienstart ${initialSettings.seriesStartDate}.`
                      : 'Die offizielle Kunstserie ist noch nicht gestartet.'}
                </p>
                <div className="about-actions">
                  <Link className="primary-link" to="/kunstpruefung">
                    <span>40 Testwerke sichten</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                  <Link className="text-link" to="/atelier">
                    Zum Testatelier ↗
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Page>
    </div>
  );
}
function Settings() {
  return (
    <div className="settings-page">
      <Page eyebrow="Nur für den Betreiber" title="Einstellungen">
        <p className="intro">
          Die Galerie bleibt frei zugänglich. Den Modus kommender Werke darf
          ausschließlich der Betreiber nach GitHub-Anmeldung ändern.
        </p>
        <div className="settings-layout">
          <div className="settings-overview">
            <h2>Vererbung für kommende Werke</h2>
            <dl
              className="settings-status"
              aria-label="Gespeicherter Einstellungsstand"
            >
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
                <dd>
                  {initialSettings.generationEnabled
                    ? `Aktiv · Serienstart ${initialSettings.seriesStartDate}`
                    : initialSettings.seriesStartDate
                      ? `Deaktiviert · Serienstart ${initialSettings.seriesStartDate}`
                      : 'Deaktiviert · Startdatum offen'}
                </dd>
              </div>
            </dl>
            <p>
              Zur Wahl stehen „Nachvollziehbare Vererbung“ und „Maximale
              Freiheit“. Ein erfolgreich gespeicherter Wechsel gilt ab dem
              nächsten noch nicht begonnenen Generierungslauf. Bestehende Werke
              bleiben erhalten. Diese Anzeige entspricht dem Stand dieser
              Galerieversion; den aktuellen Stand zeigt die Betreiberseite.
            </p>
          </div>
          <div className="settings-controls">
            <section
              className="settings-access"
              aria-labelledby="access-heading"
            >
              <span className="badge">
                {operatorSettings.adminOrigin
                  ? 'Geschützter Betreiberzugang'
                  : 'Betreiberfunktion · externe Einrichtung offen'}
              </span>
              <h2 id="access-heading">Geschützter Betreiberzugang</h2>
              {operatorSettings.adminOrigin ? (
                <a
                  className="dark-link"
                  href={`${operatorSettings.adminOrigin}/settings`}
                >
                  Zur geschützten Betreiberseite ↗
                </a>
              ) : (
                <button
                  className="dark-button"
                  type="button"
                  disabled
                  aria-describedby="auth-status"
                >
                  Mit GitHub anmelden – externe Einrichtung offen
                </button>
              )}
              <p id="auth-status" className="muted">
                {operatorSettings.adminOrigin
                  ? 'Anmeldung und Moduswahl öffnen auf einer eigenen Betreiberseite. Die Galerie bleibt ohne Anmeldung zugänglich.'
                  : 'Die Betreiberfunktion ist lokal implementiert, aber noch nicht mit GitHub und Cloudflare verbunden. In dieser Vorschau kannst du keine Einstellungen ändern.'}
              </p>
            </section>
            <fieldset
              className="mode-options"
              disabled
              aria-describedby="mode-access-hint auth-status"
            >
              <legend>
                <span className="settings-chapter" aria-hidden="true">
                  01
                </span>
                Vererbungsmodus
              </legend>
              {(['traceable', 'free'] as const).map((mode) => (
                <label className="mode-option" key={mode}>
                  <input
                    type="radio"
                    name="inheritance-mode"
                    value={mode}
                    checked={initialSettings.inheritanceMode === mode}
                    readOnly
                  />
                  <span>
                    <strong>{modeLabels[mode]}</strong>
                    <span>
                      {mode === 'traceable'
                        ? 'Sichtbare Beiträge beider Eltern. Der Standard.'
                        : 'Freie Mischung bis zum vollständigen Bruch.'}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>
            <p id="mode-access-hint" className="mode-access-hint">
              Die Moduskarten dienen hier nur zur Anzeige. Änderungen erfolgen
              ausschließlich auf der geschützten Betreiberseite.
            </p>
          </div>
        </div>
      </Page>
    </div>
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
  const [menuAddress, setMenuAddress] = useState<string | null>(null);
  const menuOpen = menuAddress === pageAddress;
  function closeMenu(target: 'summary' | 'main') {
    if (mobileMenu.current) mobileMenu.current.open = false;
    setMenuAddress(null);
    requestAnimationFrame(() => {
      if (target === 'summary')
        mobileMenu.current
          ?.querySelector('summary')
          ?.focus({ preventScroll: true });
      else main.current?.focus();
    });
  }
  useEffect(() => {
    const desktop = window.matchMedia?.('(min-width: 1000px)');
    if (!desktop) return;
    const closeOnDesktop = () => {
      if (!desktop.matches || !mobileMenu.current?.open) return;
      mobileMenu.current.open = false;
      setMenuAddress(null);
      requestAnimationFrame(() => main.current?.focus({ preventScroll: true }));
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  useEffect(() => {
    if (menuOpen)
      mobileMenu.current
        ?.querySelector('summary')
        ?.focus({ preventScroll: true });
  }, [menuOpen]);
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
      <div className="preview-bar" inert={menuOpen}>
        <span>
          {initialSettings.generationEnabled
            ? 'Evolvera · Täglich neu'
            : 'Evolvera · Testversion'}
        </span>
        <span>
          {initialSettings.generationEnabled
            ? 'HTML + CSS / Fortlaufende Serie'
            : 'HTML + CSS / Serie noch nicht gestartet'}
        </span>
      </div>
      <div className="site-shell">
        <a
          className="skip-link"
          inert={menuOpen}
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
            inert={menuOpen}
            aria-label="Evolvera – Heute"
          >
            evolvera
            <span className="brand-dot" aria-hidden="true">
              ↗
            </span>
          </Link>
          <nav
            className="desktop-navigation"
            aria-label="Hauptnavigation"
            inert={menuOpen}
          >
            {navigation.map(([path, label]) => (
              <NavLink key={path} to={navTarget(path)} end={path === '/'}>
                {label}
              </NavLink>
            ))}
          </nav>
          <details
            className="mobile-navigation"
            ref={mobileMenu}
            open={menuOpen}
            onToggle={(event) => {
              setMenuAddress(event.currentTarget.open ? pageAddress : null);
            }}
            onKeyDown={(event) => {
              if (!mobileMenu.current?.open) return;
              if (event.key === 'Escape') {
                event.preventDefault();
                closeMenu('summary');
              }
              if (event.key === 'Tab') {
                const targets = Array.from(
                  mobileMenu.current.querySelectorAll<HTMLElement>(
                    'summary, a[href], button:not(:disabled)',
                  ),
                ).filter((node) => node.getClientRects().length > 0);
                const first = targets[0];
                const last = targets.at(-1);
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            <summary
              aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
              aria-controls="mobile-menu-panel"
            >
              <span className="menu-summary-label">Menü</span>
              <span className="menu-icon" aria-hidden="true" />
            </summary>
            <div className="mobile-menu-panel" id="mobile-menu-panel">
              <Link
                to={navTarget('/')}
                className="brand mobile-menu-brand"
                aria-label="Evolvera – Heute"
                onClick={() => closeMenu('main')}
              >
                evolvera
                <span className="brand-dot" aria-hidden="true">
                  ↗
                </span>
              </Link>
              <nav aria-label="Mobile Hauptnavigation">
                <ol>
                  {navigation.map(([path, label], index) => (
                    <li
                      key={path}
                      className={
                        index >= 4 ? 'mobile-menu-secondary' : undefined
                      }
                    >
                      <NavLink
                        to={navTarget(path)}
                        end={path === '/'}
                        onClick={() => closeMenu('main')}
                      >
                        <span className="mobile-menu-number" aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="mobile-menu-label">{label}</span>
                        {index >= 4 && (
                          <span className="mobile-menu-hint" aria-hidden="true">
                            {index === 4 ? 'Betreiber' : 'Studien'}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ol>
              </nav>
              <dl className="mobile-menu-facts">
                <div>
                  <dt>Rhythmus</dt>
                  <dd>
                    {initialSettings.generationEnabled
                      ? `Täglich ab ${dailyTime}`
                      : `Geplant ab ${dailyTime}`}
                    <span>{initialSettings.timezone}</span>
                  </dd>
                </div>
                <div>
                  <dt>Modus kommender Werke</dt>
                  <dd>{modeLabels[initialSettings.inheritanceMode]}</dd>
                </div>
              </dl>
              <div className="mobile-menu-footer">
                <p>Ein Experiment mit offenem Ausgang.</p>
                <nav
                  className="legal-navigation mobile-menu-legal"
                  aria-label="Rechtliche Informationen im Menü"
                >
                  <Link to="/impressum" onClick={() => closeMenu('main')}>
                    Impressum
                  </Link>
                  <Link to="/datenschutz" onClick={() => closeMenu('main')}>
                    Datenschutz
                  </Link>
                </nav>
              </div>
            </div>
          </details>
        </header>
        <main id="main-content" tabIndex={-1} ref={main} inert={menuOpen}>
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
              <Route
                path="/impressum"
                element={<LegalPages view="imprint" />}
              />
              <Route
                path="/datenschutz"
                element={<LegalPages view="privacy" />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <footer className="site-footer" inert={menuOpen}>
          <p className="footer-brand">evolvera.</p>
          <p className="footer-claim">Ein Experiment mit offenem Ausgang.</p>
          <nav
            className="legal-navigation"
            aria-label="Rechtliche Informationen"
          >
            <Link to="/impressum">Impressum</Link>
            <Link to="/datenschutz">Datenschutz</Link>
          </nav>
          <p className="footer-status">
            {initialSettings.generationEnabled
              ? 'HTML + CSS · Fortlaufende Serie'
              : 'HTML + CSS · Serie noch nicht gestartet'}
          </p>
        </footer>
      </div>
      <nav
        className="mobile-dock"
        aria-label="Schnellnavigation"
        inert={menuOpen}
      >
        {navigation.slice(0, 3).map(([path, label], index) => (
          <NavLink key={path} to={navTarget(path)} end={path === '/'}>
            <span
              className={`dock-icon dock-icon-${['today', 'gallery', 'evolution'][index]}`}
              aria-hidden="true"
            >
              {Array.from(
                { length: index === 1 ? 4 : index === 2 ? 3 : 0 },
                (_, point) => (
                  <span key={point} />
                ),
              )}
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          aria-controls="mobile-menu-panel"
          aria-expanded={menuOpen}
          onClick={() => {
            if (mobileMenu.current) mobileMenu.current.open = true;
            setMenuAddress(pageAddress);
          }}
        >
          <span className="dock-icon menu-icon" aria-hidden="true" />
          <span>Menü</span>
        </button>
      </nav>
    </div>
  );
}
