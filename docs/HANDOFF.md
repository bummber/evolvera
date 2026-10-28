# Evolvera – aktueller Übergabestand

Stand: 28.10.2026. Aktueller Betreiberauftrag hat Vorrang. Lokale Phase 4 umgesetzt;
**externe Einrichtung und echte Phase-4-Abnahme noch offen**. Kein offizieller Start.

## Entscheidungen und Git

- Projekt `/Users/abrocker/ai_o_projects/evolvera/`, Branch `main`, bestehendes
  `origin` `https://github.com/bummber/evolvera.git`. Bisher kein Push, Deployment oder
  Sichtbarkeitswechsel. Remote am 28.10.2026 erneut nur lesend verifiziert: privat und leer.
- Quelle `docs/PRD.md` v1.1 unverändert; Root-v1.0 historisch. `AGENTS.md` beachten.
- Historie: Phase 0 `59d05ed`, Übergabe `45d8486`, Design A `b1a6750`, Phase 1 `0fcd7c8`,
  Phase 2 `b589c84`, Phase 3 `97e9c0a`, lokale Phase 4 `e033043`.
  Vor Änderungen aktuellen Git-Stand prüfen.
- Betreiber hat Phase 4 beauftragt und ausdrücklich erklärt: **„Die 40 Testwerke sind
  abgenommen“**. In `config/release.json` und `docs/art-review.md` dokumentiert, inklusive
  Versionen/Referenz-Digests. Keine stellvertretende Abnahme; Smartphoneprüfung auf
  physischen Geräten wurde damit nicht als ausgeführt behauptet.
- Spätere weitere Serie mit mehr Varianz, Farbverläufen, Linien/Kurven gewünscht;
  ausdrücklich vertagt, separater Folgeauftrag in `docs/future-series.md`. Aktuelle
  Generatoren/Renderer und alle Testwerke erhalten. Keine solche neue Serie begonnen.

## Lokal nutzbar

Galerie mit Suche und Pagination, Heute, Werkdetails, Herkunftsvergleich sowie Eltern/
Nachfolger. `#/kunstpruefung`: 40 abgenommene Testwerke, 20 je Modus. Bisherige 20
unverändert; `phase-3.json` enthält nur Ergänzungen. Simulierte Januar-2000-Metadaten,
nie offizielles Archiv. Hash-Query `sammlung=traceable|free`, sonst offizieller Leerbereich.
`#/atelier` und `#/evolutionslabor` bleiben vorhanden. Kunst ausschließlich HTML/CSS.

Neu: `workers/admin` implementiert GitHub-App-Login mit PKCE/State, numerischer Betreiber-ID,
serverseitiger SQLite-Sitzung, CSRF/Origin, Modus-Speicherung in Git, SHA/Revision und
Commitverifikation, Logout. Unkonfiguriert sicher deaktiviert. Keine Login-Demo.

`src/automation` und `scripts/generate-daily.ts`: reiner Tagesplan, Kalenderlogik,
Nachholung/Snapshot, volle Historienprüfung, ursprüngliche Bytes restaurieren,
atomarer Archivcommit, nicht erzwungener Push mit einem Konfigurations-Retry.
Workflow vorbereitet für Generierung/Build/Deploy im selben gesperrten Lauf. Mehrere
Datei-/Workflowgates verhindern versehentlichen Serienstart oder Veröffentlichung.

Heute aktualisiert sichtbare Tabs alle 60 Sekunden und bei Fokus/Rückkehr. Archiv/
Renderer lesen gespeicherte Daten. Aktueller Modus ändert nie historische Werke.

## Tatsächliche Prüfungen

Node 24.21.0, npm 12.2.0. `npm run check`: Format, Lint, Typen, **122 Tests**, Daten/
Referenzen, Produktionsbuild und Worker-Dry-Run erfolgreich. `npm run test:browser`:
**30 Desktop-/320px-Chromium-Fälle**, unveränderte sechs Kunstreferenzen. Auth mit
synthetischen GitHub-Antworten, echte isolierte lokale Git-Repositories/Bare-Remotes.
Keine GitHub-Schreibzugriffe in Tests. 365 Testtage je Modus weiterhin enthalten.

`npm run worker:test-runtime` prüft atomaren Callback, Sitzung und Widerruf mit echtem
lokalem workerd/SQLite. Unkonfigurierter Worker lokal gestartet: Health korrekt 503,
`configurationReady:false`. Eine leere Origin als Laufzeitfehler behoben und abgesichert.
Tages-Dry-Run: deaktiviert, null neue/restaurierte/offizielle Werke; keine Schreibaktion.
Wrangler 4.154.0 neue exakt gepinnte Dev-Abhängigkeit, Lockfile aktualisiert. Keine neue
Frontend-Produktionsabhängigkeit; Cloudflare-CLI-Telemetrie in Projektbefehlen aus.

Offen: echte GitHub-/Cloudflare-/Pages-Prüfungen, blockierte Drittanbieter-Cookies in
realem Login, GitHub-Workflow/Permissions/Trigger, Linux-CI, Safari/Firefox, physische
Geräte und GPU-/FPS-Profiling. Kein `actionlint` installiert. Lokale Prüfungen sind keine
Cloud-Abnahme. Grenzen und Quellen in `docs/phase-4-results.md` und `docs/runbook.md`.

## Weiterhin gesperrt

`seriesAuthorized:false`, Startdatum `null`, Generierung `false`, Standard `traceable`,
Revision 1, offizieller Index leer. `config/operator.json` Origin `null`; Worker
`ENABLED=false`, keine öffentliche Route registriert. Keine externen Konten/Apps/Secrets
angelegt. Keine Secrets im Frontend, Git, Logs oder Chat; nicht im Chat anfordern.

## Nächster konkreter Schritt

Den externen Einrichtungsplan in `docs/runbook.md` gemeinsam freigeben: Repository/
Pages, Cloudflare-Worker/SQLite, eingeschränkte GitHub App, numerische ID, Callback und
serverseitige Secrets. Registrierung, Sicherheitsberechtigungen und Veröffentlichung
als konkrete Betreiberaktionen behandeln. Serienstartdatum und Aktivierung nochmals
separat bestimmen. Phase 5 nicht begonnen; Varianz-Folgeprojekt nicht beginnen.

Wiedereinstieg: `AGENTS.md`, diese Notiz, `docs/PRD.md`, `docs/phase-4-results.md` und
`docs/runbook.md` lesen. Git prüfen. Bei Bedarf `npm ci`; npm-Cache außerhalb Sandbox
über `--cache /tmp/evolvera-npm-cache`. `npm run dev` für Galerie. Worker: `npm run
worker:dev`, unkonfiguriert deaktiviert. `npm run generate:daily -- --dry-run` liest den
Commitstand, keine Arbeitskopie. Niemals historische Schäden durch Neuwürfeln beheben.

## Kopierbare Startnachricht

> Wir setzen Evolvera im vorhandenen Projekt fort. Lies `AGENTS.md`, `docs/HANDOFF.md`,
> `docs/PRD.md`, `docs/phase-4-results.md` und `docs/runbook.md`. Prüfe den Git-Stand.
> Die 40 Testwerke sind abgenommen; Serienstart ist noch deaktiviert. Wir prüfen
> gemeinsam die konkreten externen Einrichtungsschritte. Noch keine neue Serie oder
> Phase 5 beginnen und keine Secrets im Chat anfordern.

## Arbeitsunterbrechung am 28.10.2026

Auf Wunsch des Betreibers ist die Arbeit für heute beendet. Geplante Fortsetzung:
29.10.2026. Implementierung und Kunstabnahme sind lokal in `e033043` gesichert; beim
Beginn dieser Sicherung war das Arbeitsverzeichnis sauber. Dieser Übergabevermerk
wird zusätzlich lokal versioniert. Keine Hintergrundaufgabe oder Erinnerung beauftragt.

Morgen zuerst diesen Vermerk und `docs/runbook.md` lesen, Git prüfen und bei Bedarf
die lokale Vorschau starten. Danach den konkreten externen Einrichtungsplan gemeinsam
besprechen. Bis zum passenden Betreiberauftrag nichts pushen, öffentlich schalten,
registrieren oder deployen; die offizielle Serie bleibt deaktiviert.
