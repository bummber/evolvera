# Evolvera – aktueller Übergabestand

Stand: 03.11.2026. Aktueller Betreiberauftrag hat Vorrang. Die öffentliche
**Pages-Testversion ist veröffentlicht und geprüft**. Betreiberanmeldung und
Worker-Einrichtung sind noch offen. Cloudflare-Konto und lesende Codex-MCP-Verbindung
sind inzwischen vorhanden und geprüft. Kein offizieller Serienstart.
Die GitHub App wurde am 03.11. separat freigegeben, registriert und ausschließlich
auf `bummber/evolvera` installiert; Secrets und Worker fehlen weiterhin.
Auf anschließenden Fortsetzungsauftrag sind Datenschutzhinweise und unabhängige
Pages-/Worker-Aktivierungsgates lokal umgesetzt. Die Textdurchsicht für die gewählte
Worker-Adresse wurde anschließend ausdrücklich bestätigt; Cloudflare-Kontoprüfung offen.

## Übergabe an den neuen Design-Chat – 03.11.2026

**Aktueller Betreiberauftrag:** Den erreichten Stand sichern. Der Betreiber möchte
vor der nächsten Veröffentlichung das Design anpassen und gibt den konkreten
Designprompt in einem neuen Chat. **Jetzt keine Designänderung beginnen.**
Cloudflare-Vertragsprüfung, Secret-Anlage und Deployment sind vorerst nicht das
nächste Arbeitspaket; erst den neuen Designauftrag entgegennehmen und den Stand
gemeinsam sichten. Die bereits öffentliche Pages-Testversion bleibt auf `9ad1fa7`;
eine neue Veröffentlichung oder ein Serienstart ist nicht freigegeben.

Der gesamte in diesem Chat erarbeitete lokale Stand wird als Sicherungscommit
mit Titel `chore: checkpoint operator privacy work before design handoff` erhalten.
Er enthält App-Einrichtungsnachweis, Datenschutzvorbereitung/-gates, Tests und die
bestätigte Textdurchsicht. Kein Push. Vor der Sicherung: `main`, zwei lokale Commits
`5056ed7`/`d9f921b` vor `origin/main`; nach der Sicherung den neuen Commit zusätzlich
über `git log` prüfen. `origin` bleibt `https://github.com/bummber/evolvera.git`.

Für den neuen Chat maßgeblich:

- `AGENTS.md`, diese HANDOFF und `docs/PRD.md` v1.1 lesen. Der neue Designprompt
  bestimmt den Designumfang. Die frühere Auswahl Design A darf nicht als bereits
  erteilter Auftrag für die neue Gestaltung behandelt werden. EP-01 bleibt zurückgestellt.
- `docs/design-system.md` wurde während dieser Arbeit unversioniert vorgefunden,
  weder inhaltlich ausgewertet noch geändert oder als verbindliche Quelle übernommen.
  Es bleibt **außerhalb des Sicherungscommits**. Erst anhand des neuen Prompts klären,
  welche Rolle es spielen soll. `docs/PRD_v1.1_backup.md` ebenfalls unversioniert
  erhalten und bytegleich mit der PRD; nicht automatisch aufnehmen oder formatieren.
- Lokal enthält `config/legal.json` den vorbereiteten Scope `pages-and-operator`.
  Textdurchsicht für die ausgewählte Worker-Origin ist am 03.11. mit Version
  `2026-11-03.1` bestätigt. `providerReviewedOn:null` bleibt offen; Veröffentlichung
  und Worker-Anmeldung deshalb weiterhin gesperrt. Ändert der Designauftrag auch
  Datenschutztext oder Datenfluss, Version/Durchsicht entsprechend erneuern.
- GitHub App registriert und nur auf `bummber/evolvera` installiert. Noch keine
  Secrets, privaten Schlüssel, zusätzliche Cloudflare-Rechte oder Worker-Bereitstellung.
  Galerie-Origin null, `ADMIN_ORIGIN` leer, `ENABLED=false`. Serienstart null,
  Generierung aus, Serienfreigabe false, Modus `traceable`, Revision 1, Archiv leer.
- Kunst bleibt HTML/CSS. Generator-/Rendererhistorie, archivierte Daten und die
  abgenommenen 40 Testwerke erhalten. UI-Designänderungen dürfen alte Kunst nicht
  unbeabsichtigt verändern; bestehende sechs Kunstreferenzen nicht still ersetzen.
- Letzte Einzelprüfungen erfolgreich: Lint, Typen, **149 Tests**, Datenprüfung, Build,
  Worker-Dry-Run und **35 Browserfälle**, ein doppelter Worker-Aufruf bewusst übersprungen.
  Echter workerd-/SQLite-Lauf zuletzt im Datenschutzpaket erfolgreich. Der Gesamtcheck
  stoppt aktuell bereits bei Prettier an `docs/design-system.md`, beim Sichern erneut
  genauso ausgeführt. Formatprüfung dieser HANDOFF und `git diff --check` erfolgreich.
  `check:publication` stoppt nur an der offenen Cloudflare-Kontoprüfung.
  Für diese reine Sicherung keine neuen UI-/Worker-Laufzeitnachweise behaupten.
- Lokale Vorschauprozesse wurden auf 4173 (gebauter Galeriestand) und 8787
  (deaktivierter Worker) gestartet. Im neuen Chat Erreichbarkeit prüfen; Persistenz
  über den Chat-/App-Wechsel nicht voraussetzen. Bei Bedarf Projektbefehle verwenden.

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
SHA/Revision und Commitverifikation. Reale GitHub App inzwischen registriert und
installiert; noch keine Secrets oder Workerroute, kein echter Login-Nachweis.
Lokal ergänzte Worker-Routen `/privacy` und `/imprint` funktionieren auch deaktiviert
ohne Anmeldung. Die gemeinsame Datenschutzfassung wird ebenfalls in der Galerie
gerendert. Fehlende Durchsicht blockiert Pages-Publikation und direkte Worker-Anmeldung.

Tagesplaner/Git-Adapter lokal implementiert: Berliner 04:00-Zyklus, Nachholung,
Snapshot, unabhängige Ursprünge, ganze Historie prüfen, Originalbytes restaurieren,
atomarer Archivcommit und begrenzter Konflikt-Retry ohne Force-Push. Heute liest
bei Fokus/Rückkehr und in sichtbaren Tabs alle 60 Sekunden neu.

## Prüfstand der veröffentlichten Pages-Fassung vom 02.11.

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
Keine Cloudflare-Ressourcen oder Secrets eingerichtet. Keine Secrets in Frontend,
Git, Logs oder Chat; niemals im Chat anfordern.

Das Cloudflare-Konto wurde vom Betreiber selbst angelegt. Die erfolgreiche
MCP-Anmeldung verbindet Codex mit Cloudflare; sie ist **nicht** die spätere
GitHub-Betreiberanmeldung von Evolvera. Worker, App-Secrets und öffentliche
Worker-Origin sind weiterhin nicht eingerichtet. Workers Free und vorhandene
Account-Subdomain wurden am 03.11. lesend im Dashboard verifiziert; siehe unten.
2FA-Status weiterhin nicht geprüft.

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

## Wiedereinstieg – 03.11.2026

Auf Auftrag anhand dieses Vermerks fortgesetzt. Git vor Änderungen geprüft: `main`
mit zwei lokalen Dokumentationscommits `5056ed7`/`d9f921b` vor `origin/main`, nur das
unversionierte PRD-Backup vorhanden und bytegleich erhalten. GitHub-API am 03.11.
erneut lesend geprüft: Remote bleibt `9ad1fa797210680e4348e2da5c487c2b37037960`;
angemeldetes Konto `bummber`, numerische ID `46008719`. Keine erneute Prüfung von
Pages-Variable, Branchschutz oder Rulesets in diesem Schritt behauptet.

MCP `GET /accounts` erneut erfolgreich, genau ein Konto. API-Schema nennt für
Abonnements Billing Read und für Subdomain Workers Scripts Read; diese Aufrufe
nicht ausgeführt und keine zusätzlichen Rechte angefordert. Stattdessen vorhandenes
Cloudflare-Dashboard lesend geöffnet: **Workers Free**, „Current plan“, 0 US-Dollar,
100.000 Requests/Tag, 10 ms CPU pro Aufruf. Vorhandene Account-Subdomain
`alexander-brocker.workers.dev`; Workers-&-Pages-Übersicht meldet keine Projekte.
Keine Konto-/Profilkennung oder E-Mail ins Projekt übernommen.

Der Betreiber hat für die Einrichtungsvorlage
`https://evolvera-admin.alexander-brocker.workers.dev` ausgewählt. Noch keine Worker-
Adresse eingerichtet oder Erreichbarkeit geprüft. `ADMIN_ORIGIN` bleibt leer,
Galerie-Origin null, `ENABLED=false`; alle Seriengates unverändert. Nur lokale
Dokumentation fortgeschrieben, kein Commit/Push, keine Secrets oder Deployments.
Die [Einrichtungsvorlage](operator-setup.md) enthält die aktualisierten Werte.

Am 03.11. tatsächlich neu geprüft: Node 24.21.0/npm 12.2.0, `npm run check`
erfolgreich mit 131 Tests, Format/Lint/Typen, Daten-/Vorschauprüfung, Build und
lokalem Worker-Dry-Run. Erster Sandboxlauf nach bestandenen Tests am tsx-Socket
blockiert, Wiederholung mit lokalen Prozessrechten erfolgreich. Kein neuer Browser-
oder Worker-Sitzungstest, da nur Dokumentation geändert wurde. PRD-Backup bytegleich,
keine offizielle Generierung und keine Änderung an Implementierung/Konfiguration.

## GitHub App – separat freigegeben und eingerichtet am 03.11.

Nach konkreter Vorlage ausdrücklich Registrierung und Installation freigegeben;
Secrets, Worker-Deployment und Push waren ausgenommen. GitHub verlangte Sudo-
Bestätigung, die der Betreiber selbst im Browser vorgenommen hat.

- App **Evolvera Betreiber bummber**, Slug `evolvera-betreiber-bummber`, Eigentümer
  `bummber`, Installierbarkeit **Only on this account**.
- App-ID `5595636`, Client-ID `Iv23liYblHBrFsNZZllG`, Installations-ID `178198041`.
  Diese Kennungen sind nicht geheim; nur dokumentiert, keine Worker-Konfiguration geändert.
- Homepage `https://bummber.github.io/evolvera/`; einziger Callback
  `https://evolvera-admin.alexander-brocker.workers.dev/auth/callback`, Wildcards aus.
- Webhooks aus, keine Events, Device Flow aus, OAuth während Installation aus,
  Setup URL leer; ablaufende User-Tokens bei Registrierung aktiviert gelassen.
- GitHub meldet erfolgreiche Installation auf `bummber`. Persistierte Installation
  zeigt **Only select repositories**, genau **`bummber/evolvera`** und ausschließlich
  **Contents read/write**, **Metadata read-only**. Keine App-Installation auf anderen
  Repositories; keine Administration-/Actions-/Workflows-/Pages-Rechte oder Bypässe.
- Kein privater Schlüssel und kein Client-Secret erzeugt, gelesen oder übertragen;
  GitHub ließ die Installation trotz vorherigem Hinweis auf den noch fehlenden
  privaten Schlüssel abschließen. Keine Authentifizierungs- oder Schreibprüfung.
- [App-Einstellungen](https://github.com/settings/apps/evolvera-betreiber-bummber),
  [Installation](https://github.com/settings/installations/178198041).

Contents gilt repositoryweit; der Worker begrenzt den Schreibpfad zusätzlich im Code.
Keine Cloudflare-Berechtigung erweitert, keine Anmeldung aktiviert, kein Deployment,
Push oder offizielles Werk. PRD-Backup erhalten. Nur lokale Dokumentation angepasst;
anschließend erneut `npm run check` mit 131 Tests, Daten-/Vorschauprüfung, Build
und Worker-Dry-Run erfolgreich. `git diff --check` erfolgreich, PRD-Backup weiterhin
bytegleich. Kein neuer App-Browserregressions- oder Worker-Sitzungslauf, da weder
UI/Routing noch Worker-/Sitzungscode geändert; GitHub-Einrichtung im Browser geprüft.

## Datenschutz lokal vorbereitet – weiterer Auftrag am 03.11.

Hinweise zu Anmeldung, Datenfluss, Cookies, Cloudflare/Empfängern, Speicherdauer,
Rechten und Rechtsgrundlagen lokal umgesetzt. Gemeinsamer Text in
`src/site/operator-privacy-content.ts`; eigene Durchsicht in neuer
`config/operator-privacy.json`, an die geplante Worker-Origin und Textversion
`2026-11-03.1` gebunden. Alle drei Nachweise waren zunächst null. Nach ausdrücklicher
Betreiberbestätigung ist `reviewedOn:2026-11-03`, `reviewedVersion:2026-11-03.1`
gesetzt; `providerReviewedOn` bleibt null. `config/legal.json` lokal auf
`privacyScope:pages-and-operator` vorbereitet;
bestätigter Kontakt und früheres Pages-Durchsichtsdatum unverändert erhalten.
Keine Durchsicht, Vertragsannahme oder Rechtsprüfung aus dem Auftrag abgeleitet.

Pages-Prüfung verlangt die neue Durchsicht und Cloudflare-Vertrags-/Kontoprüfung.
Auch bei vollständigen technischen Zugangswerten sperrt der Worker ohne passenden
Nachweis `/login`; `/health` liefert 503. Rechtstexte auf `/privacy` und `/imprint`
bleiben ohne Sitzung/Cookies und ohne GitHub-Aufruf erreichbar. Alle Worker-HTML-Seiten
verlinken sie. Eingesetzte Texte werden vor HTML-Ausgabe maskiert; Schemaauswertung
läuft in workerd ohne dynamischen JIT-Code. Kein erweiterter Git-Zugriff.

Tatsächlich geprüft: `npm run check` mit **149 Tests**, Format/Lint/Typen, Datenprüfung,
Build und Worker-Dry-Run erfolgreich. `npm run worker:test-runtime` mit lokalem
workerd/SQLite erfolgreich, einschließlich Rechtstextrouten und Datenschutzgate.
`npm run test:browser`: **35 bestanden, 1 bewusst übersprungen**. Der neue synthetische
Worker-Browserfall prüft Desktop und 320px gemeinsam; deshalb keine Verdopplung im
Mobilprojekt. Sechs bestehende Kunstreferenzen unverändert. Keine Cloud-Auth-Abnahme.
`npm run check:publication` erwartungsgemäß Exit 1 mit genau den zwei offenen Durchsichten.

Zusätzlich gebaute Galerie-Datenschutzfassung und deaktivierte Worker-Datenschutzseite
im lokalen Chrome geöffnet und sichtbar geprüft. Lokale Vorschauen zur Durchsicht:
`http://127.0.0.1:4173/evolvera/#/datenschutz` und `http://127.0.0.1:8787/privacy`.
Keine veröffentlichten URLs. Automatisierte Worker-Tests verwenden isolierten
temporären SQLite-Speicher und synthetische Zugangsdaten.

Der [vorbereitete Secret-Ablauf](operator-secrets.md) sieht später eine geschützte
JSON-Datei außerhalb des Repositories vor. Lokales Wrangler 4.154.0 bestätigt
`deploy --secrets-file` für einen gemeinsamen Code-/Secret-Upload; nur Hilfe/Anleitung
gelesen, kein Upload. Keine Schlüssel, Secrets, zusätzlichen Rechte, Commits, Pushes
oder Deployments; alle Seriengates, Archiv und Betreiberkonfiguration unverändert.
PRD-Backup bleibt unversioniert und bytegleich.

Die ausdrückliche Betreiberbestätigung lautet: „Ich bestätige die Textdurchsicht der
Datenschutzhinweise für die Betreiberanmeldung unter
evolvera-admin.alexander-brocker.workers.dev.“ Nur diese Textdurchsicht dokumentiert;
keine Anbieter-/Kontoprüfung, Vertragsannahme oder Veröffentlichung daraus abgeleitet.
Datenschutztext und Textversion selbst unverändert. Zusätzlich vorgefundene
unversionierte `docs/design-system.md` erhalten, nicht verändert oder mitversioniert.

Nach Textbestätigung erneut geprüft: `check:publication` Exit 1 ausschließlich wegen
offener Cloudflare-Vertrags-/Kontoprüfung. `npm run check` stoppt bei Prettier an der
neu vorgefundenen `docs/design-system.md`; deren Formatierung nicht ungefragt geändert.
Formatprüfung der eigenen geänderten Dateien und `git diff --check` erfolgreich.
Die übrigen Prüfungen separat erfolgreich: Lint, Typen, 149 Tests, Datenprüfung,
Build, Worker-Dry-Run und 35 Browserfälle (1 Doppelaufruf bewusst übersprungen).
Kein neuer Worker-Sitzungslauf, da nur Durchsichtsdaten/Dokumentation und die erwartete
verbleibende Browsermeldung geändert wurden. Keine zusätzliche Freigabe dokumentiert.

**Späterer Einrichtungsschritt nach dem nun gewünschten Designpaket:** Zum Cloudflare-Konto
gehörenden Vertragspartner, wirksame Bedingungen/DPA und Logging-Vorgaben konkret
prüfen; erst danach die Durchsicht dokumentieren. Sicherer Secret-Ablauf und konkretes
Deployment bleiben gesondert zu beauftragen. Bei Textänderungen Version/Durchsicht
erneuern. Das Runtimegate verhindert keine direkten Code-Uploads.
Cloudflare nennt für Worker-Neuanlage Workers-Admin auf Produktebene, für spätere
Updates genügt Worker-Editor. Keine zusätzlichen Rechte allein aus diesem Vermerk ableiten.

Die Textdurchsicht gilt für die gemeinsame Fassung in Galerie und Worker an der
genannten Origin. `check:publication` blockiert wegen der offenen Kontoprüfung weiterhin,
aber keinen direkten Worker-Code-Upload.
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
