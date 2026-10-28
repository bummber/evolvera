# Phase 4 – lokale Betreiberfunktion und Tageslauf

Stand: 28.10.2026. Betreiberauftrag: nächste Phase beginnen. Während der Umsetzung
wurden die **40 Testwerke ausdrücklich abgenommen**. Der gewünschte spätere Ausbau
mit mehr Varianz, Farbverläufen, Linien und Kurven ist ein separater Folgeauftrag.
Keine Änderung vorhandener Werke/Generatoren, kein neuer Serienstart.

## Lokal umgesetzt

- Worker mit echter implementierter GitHub-App-OAuth-/PKCE-Logik, State-Bindung an
  Browsercookie, kurzlebiger serverseitiger Sitzung und fester numerischer Betreiber-ID.
  SQLite-Durable-Object für Einmalverbrauch, Ablauf und Widerruf. Secure/HttpOnly/
  SameSite-Lax-Cookies, keine Drittanbieter-Cookies. Keine Token im Frontend.
- Betreiberoberfläche auf Worker-Origin: gespeicherten Modus/Revision lesen, Modus
  per POST mit Sitzung, CSRF und exakter Origin speichern, Logout. Kein allgemeiner
  Repositoryschreiber. Nur `config/generation.json`, nur Modus plus Revision.
- App-JWT und auf das Repository eingeschränktes Installationstoken serverseitig;
  SHA-/Revisionsprüfung und Verifikation des konkreten Git-Commits vor Erfolgsmeldung.
  Konflikte/unklare Antworten ergeben Fehler statt vorgetäuschtem Speichern.
- Reiner Tagesplaner plus Git-Adapter: Berliner 04:00-Tageszyklus, chronologische
  Nachholung, unabhängige Generation 1/2, eingefrorener Snapshot, anschließende Eltern.
  Keine Kalendertagsarithmetik mit pauschalen 24 Stunden über DST.
- Historischer Schutz über vollständige Git-Historie und ursprüngliche Werkbytes;
  fehlendes Serienende, beschädigte/inhaltlich manipulierte Daten werden restauriert.
  Ganze Kette/Rezept prüfen, bei unsicherem Ursprung stoppen. Index rekonstruierbar.
- Atomarer Archivcommit mit temporärem Git-Index; keine Änderungen am Entwickler-
  Arbeitsverzeichnis. Kein Force-Push. Ein kontrollierter Retry für einen parallelen
  reinen Moduscommit unter Erhaltung des Snapshots; Code-/Archivkonflikte stoppen.
- Tagesworkflow lokal vorbereitet: gemeinsame Sperre, vollständige Historie,
  Codeprüfungen vor Archivschreiben, Generierung/Build/Deploy im selben Workflow,
  Prüfung des aktuellen Remote-Commits vor Upload und Deployment. Alle externen Gates aus.
- Heute liest in sichtbaren Tabs alle 60 Sekunden und bei Fokus/Rückkehr frisch.
  Bekannte unveränderte Daten bleiben während des Abrufs sichtbar; Altantworten
  überschreiben keinen neueren Sammlungsstand. Künstlerische Renderer unverändert.

`config/release.json` dokumentiert die Betreiberabnahme mit Datum, Umfang, Versionen
und Referenz-Digests. Serienfreigabe bleibt **false**. `config/operator.json` enthält
nur eine später mögliche öffentliche Origin, derzeit **null**. Startdatum/Generierung
bleiben **null/false**; offizielles Archiv leer. Der Worker bleibt `ENABLED=false`.

## Prüfungen und Aussagekraft

- `npm run check`: Format, Lint, Typen, **122 Tests**, Daten-/Referenzprüfung,
  Produktionsbuild sowie Worker-Dry-Run erfolgreich.
- `npm run worker:test-runtime`: echte lokale workerd-Laufzeit mit SQLite-Durable-
  Objects. Sichere unkonfigurierte Antwort, atomarer Verbrauch bei parallelem Callback,
  Sitzung und Widerruf geprüft. Testserver/Datenspeicher werden wieder beendet/entfernt.
- `npm run test:browser`: **30 Fälle** Desktop/320px Chromium. Sechs unveränderte
  Kunstreferenzen. 04:00-Aktualisierung jetzt ohne Reload über Fokusereignis geprüft.
- Neue Node-Tests: echte isolierte lokale Git-Repositories und lokales Bare-Remote,
  keine GitHub-Schreibzugriffe. Zwei konkurrierende Pläne, Moduscommit während Lauf,
  Codekonflikt, ursprüngliche Bytes, gelöschtes Serienende, Snapshot und erneuter Lauf
  nach simuliertem Deployfehler. Idempotenz und keine Teilstände bei Fehlern.
- Auth-Tests mit synthetischen GitHub-Antworten und kurzlebig generiertem Test-RSA-
  Schlüssel: PKCE/JWT, numerische Identität, Cookie/State, Replay/Ablauf, Sitzungsende,
  CSRF/Origin, feste Schreibpfade, Revision, Konflikte und unbestätigtes Speichern.
- Lokaler unkonfigurierter Worker gestartet; `/health` korrekt HTTP 503 mit
  `configurationReady:false`. Keine echten Zugangsdaten nötig oder angefordert.
- Lokaler Tages-Dry-Run des gesicherten Git-Stands: deaktiviert, null neue Werke,
  null restaurierte Werke, null offizielle Werke. Kein Schreiben oder Netzwerkzugriff.

Ein zusätzlicher Laufzeitcheck fand eine leere Origin, die der URL-Validator zuvor
nicht korrekt abgefangen hatte. Behoben und mit Node- und workerd-Fällen abgesichert.
Temporäre Diagnose entfernt. Generierte Workerdateien korrekt von Lint/Formatierung
getrennt. Keine Umgehung des npm-Skriptschutzes notwendig: lokale Binärwerkzeuge laufen.

Neu: Wrangler **4.154.0**, exakt gepinnt, nur Entwicklungsabhängigkeit, mit Lockfile.
Begründung: Worker-Bundle und echte lokale Cloudflare-/SQLite-Prüfung. `npm install`
berichtete null bekannte Schwachstellen. Node 24.21.0/npm 12.2.0 unverändert.
CLI-Telemetrie in Projektbefehlen deaktiviert. Keine neue Frontend-Produktionsabhängigkeit.

## Noch nicht erfolgt

Kein Push, Repository weiterhin nicht durch uns öffentlich geschaltet, kein Deployment,
keine App-/Konto-/Secretregistrierung, kein offizielles Werk. Keine erfolgreiche echte
GitHub-Anmeldung, echte Konfigurationsänderung oder veröffentlichte URL behauptet.

Remote-CI/Workflow, Pages und GitHub-App-/Cloudflare-Ende-zu-Ende noch auszuführen.
Workflow wurde lokal vorbereitet/gelesen, nicht von GitHub ausgeführt. Kein lokales
`actionlint` verfügbar; Anbieter-Schema und reale Trigger/Permissions müssen bei Einrichtung
bestätigt werden. Prüfung mit blockierten Drittanbieter-Cookies steht als echter Cloudtest aus.
Physische Smartphones, Safari/Firefox und GPU-/FPS-Profiling bleiben offen.

Die letzten zwei Remote-SHA-Prüfungen minimieren veraltete Veröffentlichung; Git-Update
und Pages-Deployment können nicht als gemeinsame atomare Operation versprochen werden.
Bei einer Änderung danach folgt ein neuer Workflow. Historienwiederherstellung behandelt
nur nachweisbare erste Archivstände als kanonisch; unklare/ungültige Erststände stoppen.
Vor offiziellem Dauerbetrieb diese Grenzen und Betriebsalarme gemeinsam prüfen.

Nächster Schritt: den konkreten externen Einrichtungsplan in `docs/runbook.md`
gemeinsam freigeben und ausführen. Datum/Aktivierung erst separat bestimmen. Phase 5
nicht begonnen; lokale Implementierung ersetzt die externe Phase-4-Abnahme nicht.
