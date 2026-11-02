# Evolvera – aktueller Übergabestand

Stand: 02.11.2026. Aktueller Betreiberauftrag hat Vorrang. Die öffentliche
**Pages-Testversion ist veröffentlicht und geprüft**. Betreiberanmeldung und
Worker-Einrichtung sind noch offen. Cloudflare-Konto und lesende Codex-MCP-Verbindung
sind inzwischen vorhanden und geprüft. Kein offizieller Serienstart.

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
- Dokumentationsnachtrag `5056ed7` und die anschließende Einrichtungsvorbereitung
  werden nur lokal versioniert. Kein weiterer Push/Pages-Lauf beauftragt.
  Git und Umfang der lokalen Folgecommits vor dem Wiedereinstieg prüfen.
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

Das Cloudflare-Konto wurde vom Betreiber selbst angelegt. Die erfolgreiche
MCP-Anmeldung verbindet Codex mit Cloudflare; sie ist **nicht** die spätere
GitHub-Betreiberanmeldung von Evolvera. Worker, GitHub App, App-Secrets und öffentliche
Worker-Origin sind weiterhin nicht eingerichtet. Konkreter Workers-Tarif, 2FA-Status
und gewünschte Account-Subdomain wurden nicht verifiziert.

Offen: echte Betreiberanmeldung und Modusspeicherung über GitHub/Cloudflare,
blockierte Drittanbieter-Cookies, reale Konflikt-/Sitzungstests, geplanter Tageslauf
und Nachholung nach späterer Aktivierung. Safari/Firefox, physische Smartphones und
GPU-/FPS-Profiling noch offen. Kein lokales `actionlint`. Keine vollständige Phase-4-
Cloud-Abnahme, kein Phase-5-Start. Erstes Pages-Deployment ist keine Serienfreigabe.

## Nächster abgegrenzter Schritt

Am 02.11.2026 wurde auf Folgeauftrag ausschließlich lokal die echte Betreiberanmeldung
vorbereitet. [Einrichtungsvorlage](operator-setup.md) enthält konkrete App-Felder,
Rechte, noch offene Kontowerte und getrennte Freigaben; der
[Datenschutzentwurf](operator-privacy-draft.md) dokumentiert Datenfluss, Cookies und
die noch erforderliche Ergänzung der öffentlichen Hinweise/Publikationsprüfung.
Runbook aktualisiert, bestehende Implementierung und sämtliche Konfiguration erhalten.
Die Vorbereitung wird auf Wunsch des Betreibers vor der Unterbrechung bis morgen
als weiterer lokaler Dokumentationscommit gesichert. `5056ed7` bleibt erhalten.
Kein Push oder Deployment; PRD-Backup nicht mitversionieren.

Lesend über GitHub-API bestätigt: Remote weiterhin `9ad1fa7`, Repository öffentlich,
Pages-Variable true, Tagesautomatisierungsvariable fehlt, `main` ungeschützt und keine
Rulesets. Betreiber `bummber` hat numerische ID `46008719`; bei Einrichtung gegen
das tatsächlich angemeldete Konto prüfen. Diese GitHub-Leseprüfung erfolgte vor
der späteren MCP-Einrichtung; keine neue Remoteprüfung beim Sichern behauptet.
Keine Secrets gelesen. PRD-Backup weiterhin unversioniert und bytegleich.

Erneut tatsächlich geprüft: `npm run check` mit 131 Tests, Build und Worker-Dry-Run;
`npm run worker:test-runtime` mit echtem lokalem workerd/SQLite;
`npm run check:publication` für den bisherigen Pages-only-Umfang. Alles erfolgreich.
`npm run generate:daily -- --dry-run`: 0 neue, 0 restaurierte, 0 offizielle Werke.
Der erste Check wurde beim lokalen tsx-Socket von der Sandbox gestoppt; Wiederholung
mit lokalen Prozessrechten erfolgreich. Kein neuer Browserlauf, da nur Dokumentation
geändert wurde; bisherige 32 Browserfälle sind der vorherige Nachweis.
Vor dem abendlichen Sicherungscommit nochmals `npm run check` erfolgreich ausgeführt;
kein neuer Browser- oder Worker-Sitzungslauf für die reinen Dokumentationsänderungen.

## Cloudflare-MCP und lokale Entwicklungswerkzeuge

Auf ausdrücklichen Folgeauftrag die
[offizielle Cloudflare-Agent-Anleitung](https://developers.cloudflare.com/agent-setup/prompt.md)
abgerufen und den Codex-Teil eingerichtet:

- 19 offizielle Skills aus `cloudflare/skills`, Quellcommit
  `1a33048817d06df12882cb881dfc754e7039954a`, unter
  `/Users/abrocker/.codex/skills/` installiert; vorhandene Skills erhalten.
- MCP `cloudflare` mit URL `https://mcp.cloudflare.com/mcp` in der persönlichen
  Codex-Konfiguration registriert. Bestehende MCP-Einträge unverändert.
- Nach Abbruch des standardmäßig zu breiten OAuth-Dialogs nur `offline_access`,
  `user:read`, `account:read` gewählt. Betreiber hat die Verbindung im Browser
  bestätigt. CLI meldete erfolgreichen OAuth-Abschluss; keine Tokens dokumentiert.
- Codex wurde anschließend vom Betreiber neu gestartet. Alle vier MCP-Werkzeuge
  tatsächlich erfolgreich geprüft: `whoami` erkennt eine Benutzeridentität,
  `execute` mit `GET /accounts` liefert Erfolg und genau ein Konto, `search` findet
  API-Endpunkte/Berechtigungen, `docs` liefert Dokumentationssuchergebnisse.
- Bei der anschließenden MCP-Funktionsprüfung keine Schreibaufrufe, Ressourcenerstellung,
  zusätzlichen Rechte, Tarifänderung oder Deployments. Die optionale `cf`-CLI wurde
  nicht installiert; Wrangler bleibt
  projektlokal gepinnt. Konto-/Profilkennungen, E-Mail und OAuth-Daten nicht ins Repo.

Die Skills/MCP-Konfiguration und OAuth-Anmeldedaten liegen außerhalb des
Projekt-Repositories und werden durch dessen Git-Commit nicht mitgesichert.
Ein MCP-Lesetest belegt weder den Workers-Free-Tarif noch Worker-Deploymentbereitschaft.

## Morgen fortsetzen – 03.11.2026

Zuerst diesen Stand und Git gemeinsam sichten. Danach den konkreten Workers-Free-Tarif
und die gewünschte workers.dev-Origin im vorhandenen Konto klären. Die MCP-Verbindung
hat nur die oben genannten Basisrechte; für Abonnementdaten nennt die API zusätzlich
Billing Read, für Worker-Metadaten passende Workers-Leserechte. Fehlende Rechte nicht
automatisch nachfordern. Alternativ den Tarif im Dashboard gemeinsam ansehen.

Anschließend App-Registrierung/Installation nur auf `bummber/evolvera` mit Contents
read/write und Metadata read-only konkret vorlegen und freigeben lassen. Contents
gilt repositoryweit; der Worker begrenzt den Schreibpfad zusätzlich im Code.
Cloudflare nennt für Worker-Neuanlage Workers-Admin auf Produktebene, für spätere
Updates genügt Worker-Editor. Keine zusätzlichen Rechte allein aus diesem Vermerk ableiten.

Vor Aktivierung auch direkt auf der Worker-Origin die Datenschutzinformationen und
deren Prüfumfang fertigstellen und durchsehen lassen. `check:publication` blockiert
aktuell jeden gesetzten Betreiberlink, aber keinen direkten Worker-Deploy.
`wrangler secret put/delete` deployt unmittelbar; echte Moduscommits auf `main`
lösen Pages aus. Beides deshalb nur mit konkretem Auftrag. Eine deaktivierte
Bereitstellung/Healthprüfung ist noch kein Login-Nachweis. Echte Geräteprüfung der
öffentlichen Vorschau bleibt ebenfalls offen.

Kontoregistrierung, Sicherheitsberechtigungen und konkrete externe Einrichtung nicht
allein aus diesem Dokument ableiten. Serienstartdatum und Generierung bleiben eine
spätere eigenständige Entscheidung. EP-01 bleibt zurückgestellt.

## Wiedereinstieg

`AGENTS.md`, diesen Vermerk, `docs/PRD.md`, `docs/runbook.md`,
`docs/first-pages-deployment.md` und `docs/publication-preparation.md` lesen; Git prüfen.
Lokal `npm run dev`. `npm run generate:daily -- --dry-run` liest den Git-Commit,
ändert weder Dateien noch Remote. Historische Schäden niemals neu auswürfeln.
