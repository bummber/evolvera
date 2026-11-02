# Evolvera – aktueller Übergabestand

Stand: 02.11.2026. Aktueller Betreiberauftrag hat Vorrang. Die öffentliche
**Pages-Testversion ist veröffentlicht und geprüft**. Betreiberanmeldung und
Cloudflare-Einrichtung sind noch offen. Kein offizieller Serienstart.

## Öffentliche Vorschau und Git

- Live: https://bummber.github.io/evolvera/
- 40 getrennte Testwerke: https://bummber.github.io/evolvera/#/kunstpruefung
- Bestehender Ordner `/Users/abrocker/ai_o_projects/evolvera/`, Branch `main`,
  `origin` `https://github.com/bummber/evolvera.git`. Repository öffentlich.
- Veröffentlichter Commit: `9ad1fa797210680e4348e2da5c487c2b37037960`.
- [Normale GitHub-CI erfolgreich](https://github.com/bummber/evolvera/actions/runs/41524513299).
- [Erstes Pages-Deployment erfolgreich](https://github.com/bummber/evolvera/actions/runs/41524588435),
  inklusive Build, Tests, Upload, Prüfung des aktuellen Commits und Deploy.
- Pages-Quelle `workflow`, HTTPS erzwungen. `PAGES_DEPLOYMENT_ENABLED=true` gesetzt.
  Dadurch sind künftige freigegebene Pushes auf `main` auch Veröffentlichungsvorgänge.
  `EVOLVERA_AUTOMATION_ENABLED` nicht gesetzt, geplante Tagesläufe bleiben aus.
- Der aktuelle Dokumentationsnachtrag wird nur lokal gesichert; kein zweiter
  identischer Pages-Lauf allein für den Abschlussbericht. Git vor Folgearbeit prüfen.
- Unversionierte `docs/PRD_v1.1_backup.md` ist identisch mit `docs/PRD.md` und wurde
  erhalten; nicht still in einen Commit aufnehmen.

## Betreiberentscheidungen und Quellen

Quelle bleibt `docs/PRD.md` v1.1; Root-v1.0 historisch. `AGENTS.md` beachten.
Design A ist ausgewählt. Die 40 bisherigen Testwerke beider Modi sind ausdrücklich
abgenommen; Versionen/Digests in `config/release.json` und `docs/art-review.md`.

Am 02.11. wurden nacheinander ausdrücklich freigegeben: erster privater Push samt
CI, öffentliche Repositorysichtbarkeit, dann Push der Impressums-/Datenschutzseiten
und erstes Pages-Testdeployment. Der letzte Auftrag umfasst die bestätigten Angaben
in `config/legal.json`. Deutschland, Kunst ohne Einnahmen; Kontaktdaten nicht aus
Profilen abgeleitet. `reviewedOn:2026-11-02`. Keine anwaltliche Rechtsprüfung behauptet;
Erreichbarkeit des neuen E-Mail-Postfachs nicht durch Testversand des Agenten geprüft.

Die neue PRD v1.2 aus dem anderen Ordner wurde ausschließlich ausgewertet. Das
abgeleitete [Erweiterungspaket EP-01](extensions/PRD-EP01.md) bleibt für später
vorgemerkt: höhere Varianz, Verläufe, Linien und Kurven. Nicht implementieren,
keine neue Serie und keine Neugenerierung alter Werke. Siehe `docs/future-series.md`.

## Verfügbarer Funktionsstand

Heute, Galerie mit Suche/Pagination, Werkdetails, Herkunft mit tatsächlichen Eltern
und Nachfolgern, Über-Seite, deaktivierter Betreiberzugang, Impressum und Datenschutz.
`#/kunstpruefung` zeigt 20 Werke je Modus; `#/atelier` und `#/evolutionslabor` bleiben.
Testdaten liegen separat, simulierte Januar-2000-Daten, nie offizielles Archiv.
Hash-Query `sammlung=traceable|free` wählt nur die Testsammlung, keine Konfiguration.
Kunst ausschließlich HTML/CSS, Hauptwerk mit Pause/reduzierter Bewegung, Kacheln statisch.
Bestehende Generatoren/Renderer, Daten und sechs Kunstreferenzen unverändert erhalten.

Worker lokal implementiert: GitHub-App-PKCE/State, feste numerische Betreiber-ID,
SQLite-Sitzung, CSRF/Origin, Logout, eingeschränkte Git-Modusspeicherung mit
SHA/Revision und Commitverifikation. Noch keine reale App, Secrets oder Workerroute.

Tagesplaner/Git-Adapter lokal implementiert: Berliner 04:00-Zyklus, Nachholung,
Snapshot, unabhängige Ursprünge, ganze Historie prüfen, Originalbytes restaurieren,
atomarer Archivcommit und begrenzter Konflikt-Retry ohne Force-Push. Heute liest
bei Fokus/Rückkehr und in sichtbaren Tabs alle 60 Sekunden neu.

## Tatsächlich geprüfter aktueller Stand

Node 24.21.0, npm 12.2.0. Lokal `npm run check` mit **131 Tests**, Format, Lint,
Typen, Daten-/Vorschauprüfung, Build und Worker-Dry-Run erfolgreich.
`npm run test:browser`: **32 Fälle** Desktop/320px Chromium, bestehende sechs
Kunstreferenzen unverändert. `npm run check:publication` nach Freigabe erfolgreich.

Dieselben Prüfungen einschließlich echtem workerd-/SQLite-Laufzeittest auch auf
GitHub erfolgreich. Der Archiv-/Generierungsschritt wurde dort korrekt übersprungen.
Frühere reine Logiktests nutzen isolierte Git-Repositories und synthetische Secrets,
keine echten GitHub-Schreibzugriffe. 365 Testtage je Modus weiterhin enthalten.

Live zusätzlich ohne Anmeldung geprüft: HTTPS/HTTP 200, HTML und initiale JS-/CSS-
Assets bytegenau zum lokalen Build, `artworks/index.json` HTTP 200 mit richtigem
JSON-Typ und null Werken. Im Browser Startseite, Footer/Impressum/Datenschutz,
Testübersicht, nachvollziehbare Galerie und Werkdetails beider Modi samt Elternbelegen.
Bei gemessenen 320 CSS-Pixeln kein horizontaler Überlauf der geprüften Werkansicht,
keine `img`-/`svg`-/`canvas`-Knoten. Temporäre Browsergrößen zurückgesetzt.

GitHub meldet eine nicht blockierende Node-20-Abkündigung innerhalb der verschachtelten
Upload-Action; Lauf verwendet erzwungen Node 24 und ist erfolgreich. Runner-Image-Migration
ebenfalls nur Hinweis. Keine ungeprüfte Abhängigkeitsänderung vorgenommen.

## Weiterhin gesperrt und offen

`seriesAuthorized:false`, Startdatum `null`, Generierung `false`, Standard `traceable`,
Revision 1, offizieller Index leer. Betreiber-Origin `null`, Worker `ENABLED=false`.
Keine Cloudflare-Konto-/App-/Secretregistrierung durch uns. Keine Secrets in Frontend,
Git, Logs oder Chat; niemals im Chat anfordern.

Offen: echte Betreiberanmeldung und Modusspeicherung über GitHub/Cloudflare,
blockierte Drittanbieter-Cookies, reale Konflikt-/Sitzungstests, geplanter Tageslauf
und Nachholung nach späterer Aktivierung. Safari/Firefox, physische Smartphones und
GPU-/FPS-Profiling noch offen. Kein lokales `actionlint`. Keine vollständige Phase-4-
Cloud-Abnahme, kein Phase-5-Start. Erstes Pages-Deployment ist keine Serienfreigabe.

## Nächster abgegrenzter Schritt

Die öffentliche Vorschau gemeinsam auf echten Geräten ansehen. Anschließend die
Cloudflare-/GitHub-App-Einrichtung konkret beauftragen: Konto/Tarif, SQLite-Binding,
App mit minimalen Rechten nur auf `bummber/evolvera`, numerische Betreiber-ID,
HTTPS-Origin und Callback sowie serverseitige Secrets. Details in `docs/runbook.md`.
Vor aktivem Betreiberlink die Datenschutzinformationen und deren Prüfumfang ergänzen;
`check:publication` verlangt dies bereits bei gesetzter Betreiber-Origin.

Kontoregistrierung, Sicherheitsberechtigungen und konkrete externe Einrichtung nicht
allein aus diesem Dokument ableiten. Serienstartdatum und Generierung bleiben eine
spätere eigenständige Entscheidung. EP-01 bleibt zurückgestellt.

## Wiedereinstieg

`AGENTS.md`, diesen Vermerk, `docs/PRD.md`, `docs/runbook.md`,
`docs/first-pages-deployment.md` und `docs/publication-preparation.md` lesen; Git prüfen.
Lokal `npm run dev`. `npm run generate:daily -- --dry-run` liest den Git-Commit,
ändert weder Dateien noch Remote. Historische Schäden niemals neu auswürfeln.
