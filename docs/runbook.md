# Betrieb und spätere Einrichtung

Stand: 28.10.2026. Lokale Phase 4; **nicht veröffentlicht, nicht eingerichtet,
keine offizielle Serie**. Die 40 Testwerke sind ausdrücklich abgenommen.
Historische Daten und Generator 0.2.0 bleiben erhalten.

## Lokal prüfen

Node 24.21.0 gemäß `.nvmrc`, `npm ci`, `npm run check`,
`npm run worker:test-runtime`, `npm run test:browser`.
Wrangler 4.154.0 ist exakt als Entwicklungsabhängigkeit gepinnt. Sein Build läuft
mit `--dry-run`: kein Cloudflare-Upload. Telemetrie ist in Projektbefehlen deaktiviert.
`.worker-build` und `.wrangler` sind lokale, ignorierte Ausgaben und keine Pages-Dateien.

`npm run dev` startet die Galerie. `npm run worker:dev` startet den separaten Worker
auf Loopback/Port 8787. `/health` liefert ohne Einrichtung HTTP 503 und
`{"configurationReady":false}`; `/settings` erklärt den fehlenden Zugang.
Keine Demo-Sitzung, keine Demo-Speicherung und kein lokaler Ersatz für GitHub.
Die echte Betreiberoberfläche wird nach Einrichtung über ihre HTTPS-Origin geöffnet.

`npm run worker:test-runtime` startet einen separaten lokalen Test-Worker auf
127.0.0.1:8789 mit temporärem SQLite-Speicher, prüft Einmalverbrauch, Sitzung und
Widerruf und beendet ihn. Dieser Testentrypoint wird niemals als Betreiberworker gebaut.

`npm run generate:daily -- --dry-run` liest den aktuellen **Git-Commit** einschließlich
vollständiger Historie. Er erzeugt einen Plan im Speicher; weder Dateien, Git-Objekte,
Commits noch Remotes werden geschrieben. Uncommittete Änderungen werden nicht als
Betriebsstand interpretiert. Bei aktuellem deaktiviertem Stand: null neue Werke.
`--apply` ist zusätzlich auf den freigegebenen GitHub-Workflow und das feste Repository
begrenzt; lokal kein vorgesehener Schreibbefehl.

## Externe Einrichtung – noch nicht ausgeführt

Diese Schritte benötigen einen separaten Betreiberauftrag. Keine Secrets im Chat.

1. Bestehendes `bummber/evolvera` für das erste öffentliche Testdeployment öffentlich
   schalten und den ersten Push ausdrücklich freigeben. Pages aus Actions, Environment
   `github-pages`, Branchschutz/erforderliche Freigaben und rechtliche Angaben klären.
   Die URL `https://bummber.github.io/evolvera/` ist eine Zieladresse, keine bestätigte Live-URL.
2. Cloudflare-Konto/Tarif prüfen. Workers Free und SQLite-Durable-Objects sind vorgesehen;
   kein kostenpflichtiger Tarifwechsel. Aktuelle Limits vor Aktivierung nochmals prüfen.
   Worker `evolvera-admin` mit SQLite-Binding `SESSIONS` und Migration `v1` einrichten.
   `workers_dev:false`/`preview_urls:false` verhindern einen versehentlichen Standardhost;
   erst eine bewusst freigegebene HTTPS-Route oder workers.dev-Adresse konfigurieren.
3. GitHub App im bestehenden Betreiberkonto anlegen, Installation nur auf
   `bummber/evolvera`. Repository Contents read/write und erforderliche Metadaten;
   keine Administration, Workflows oder pauschale Installation auf allen Repositories.
   Numerische Betreiber-ID und richtige Installation verifizieren. Loginname allein genügt nicht.
4. Callback **exakt** `https://<Worker-Origin>/auth/callback`, Startseite `/settings`.
   Login/Callback/Moduswahl bleiben per Top-Level-Navigation auf derselben Worker-Origin.
   Kein iframe, keine Besucheranmeldung und keine Drittanbieter-Cookies.
5. Nichtgeheime Worker-Variablen: `ADMIN_ORIGIN` (HTTPS-Origin ohne abschließenden Slash),
   `OWNER_ID`, `GITHUB_CLIENT_ID`, `GITHUB_APP_ID`, `GITHUB_INSTALLATION_ID`.
   Secrets ausschließlich mit sicherer Cloudflare-Secreteingabe:
   `GITHUB_CLIENT_SECRET`, `GITHUB_PRIVATE_KEY_PKCS8`. Nicht in `.env`/Git/VITE-Variablen
   oder Konsolenargumenten ablegen. Ein lokales `.dev.vars` bleibt ignoriert.
6. GitHub stellt gegebenenfalls einen PKCS#1-Schlüssel bereit. Für WebCrypto ist
   unverschlüsseltes PKCS#8 nötig. Nur in einem geschützten lokalen Verzeichnis
   mit restriktiven Rechten konvertieren, z. B. `umask 077` und
   `openssl pkcs8 -topk8 -nocrypt -in <geschützte-Eingabe.pem> -out <geschützte-Ausgabe.pem>`.
   Inhalt weder anzeigen noch in den Chat kopieren. Anschließend über das Secret-Prompt
   setzen; lokale Schlüssel geschützt verwahren bzw. gemäß Betreiberverfahren entfernen.
7. Erst nach realer Prüfung `ENABLED=true` setzen und die echte öffentliche Worker-Origin
   in `config/operator.json` eintragen. Der Galerie-Link führt nur zur Betreiberseite;
   keine Tokens oder Cookies werden aus dem Frontend übertragen.
8. Echtes GitHub-/Cloudflare-Ende-zu-Ende prüfen: nur Betreiber, Fremdkonto abgewiesen,
   PKCE/State/Callback, Ablauf und Logout, exakte Origin/CSRF, Speicherkonflikt und
   tatsächlich verifizierter Git-Commit. Drittanbieter-Cookies blockieren und denselben
   Ablauf erneut prüfen. Ohne diese Tests ist der lokale Mock-Test keine Live-Abnahme.
9. Für das öffentliche Vorschau-Deployment `PAGES_DEPLOYMENT_ENABLED=true` bewusst als
   Repositoryvariable freigeben; manueller Workflow mit `deploy=true`. Serienstart bleibt aus.
   Automatisierte Push-/Schedule-Veröffentlichung ist erst mit dieser Variable möglich.

## Offizielle Serie – gesonderte Aktivierung

Die Kunstabnahme ist in `config/release.json` dokumentiert, samt Umfang, Versionen
und SHA-256 der beiden Testpakete. **`seriesAuthorized` bleibt false.**
Startdatum `null` und `generationEnabled:false` in `config/generation.json` bleiben
unverändert, bis Betreiber Datum und Aktivierung ausdrücklich freigibt.

Vorher alle externen Prüfungen durchführen. Anschließend in einem gesonderten,
prüfbaren Commit ein konkretes Startdatum setzen, `seriesAuthorized:true` und
`generationEnabled:true` freigeben. `EVOLVERA_AUTOMATION_ENABLED=true` und Pages-
Freigabe sind zusätzliche Workflowgates. Diese Variablen ersetzen die Dateigates nicht.
Der Betreiberworker kann ausschließlich Modus/Revision ändern, niemals diese Freigaben.

Der Workflow verwendet eine gemeinsame `evolvera-publish`-Sperre mit
`cancel-in-progress:false`, vollständige Historie und einen frischen `main`-Checkout.
Vor dem schreibenden Lauf laufen Codeprüfungen/Tests. Ist der Checkout inzwischen
veraltet, stoppt er; niemals einen alten Stand publizieren. Der Lauf friert Modus und
Revision einmal ein. Erzeugung ab 04:00 Berlin, zwei unabhängige Starttage, danach
unmittelbare Eltern. Nachholtage werden kalenderweise chronologisch erzeugt.

Erst der vollständig validierte Plan wird als ein Git-Commit vorbereitet und ohne
Force-Push archiviert. Ein paralleler reiner Moduscommit kann einmal integriert werden;
der begonnene Lauf behält dabei seinen Snapshot. Code-/Archivkonflikte stoppen.
Build und Pages-Deployment erfolgen im selben Workflow. Vor Upload und unmittelbar
vor Deployment wird der Remote-Commit erneut geprüft. Eine Änderung danach ist nicht
atomar mit GitHub Pages sperrbar; spätere Worker-Commits lösen den nächsten Lauf aus.

Geplante Starts: 04:00, 04:17 und 05:13 `Europe/Berlin`; best effort, keine sekundengenaue
Garantie. Ein offener sichtbarer Heute-Tab liest alle 60 Sekunden sowie bei Fokus/
Rückkehr zur Seite neu. Hintergrundtabs werden nicht aktiv abgefragt.

## Fehlerbehebung und historische Wiederherstellung

- Workflowstatus/letzten erfolgreichen Pages-Lauf prüfen, bevor man einen Fehler als
  leeres Archiv deutet. Keine parallelen manuellen Reparatur- oder Force-Push-Aktionen.
- Deployment fehlgeschlagen: Nach Archivprüfung denselben Commit erneut bauen/deployen.
  Bereits archivierte Werke werden nicht neu erzeugt. Die letzte erfolgreiche Website
  bleibt verfügbar; nichts Defektes als Ersatz veröffentlichen.
- Index beschädigt/fehlend: aus vollständig validierten Werkdateien rekonstruieren.
- Werkdatei beschädigt, gültig manipuliert oder gelöscht (auch letzter Serientag):
  der Runner sucht die **erste archivierte Version jedes bekannten Werkpfads** in
  der vollständigen erreichbaren Git-Historie. Diese Bytes bleiben kanonisch. Er prüft
  die ganze rekonstruierte Kette samt Rezepten und stellt exakt wieder her.
- Ist schon die erste Archivversion ungültig, der Pfad unklar, die Historie shallow
  oder die Kette nicht lückenlos, stoppt der Lauf ohne Neuauswürfelung. Manuell einen
  nachweislich intakten Git-Stand prüfen; keine heutigen Generatorregeln auf alte Daten
  anwenden. Eine legitime andere Restaurierungsquelle muss bewusst geprüft werden.
- Bei Moduskonflikt im Worker: Einstellungen neu laden und gespeicherte Revision prüfen.
  Unklare GitHub-Antwort kann bereits einen Commit bedeuten. Keine blinde Wiederholung;
  die Oberfläche behauptet bis zur Commitprüfung keinen Erfolg.
- Noch kein konkreter erfolgreicher Cloud-Lauf vorhanden: keine Deployment-/Auth-
  Erfolgsangaben aus lokalen Testergebnissen ableiten.

Lastgrenze aktuell 10.000 Werke/Titel pro Serie; bei Erreichen sicher stoppen statt
Teildaten zu archivieren. Historische Renderer/Generatorversionen erhalten.

## Verifizierte Anbietergrundlagen

Am 28.10.2026 erneut gelesen; bei externer Einrichtung nochmals prüfen:

- [GitHub-App-Login mit PKCE](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub Contents API und SHA](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents)
- [GitHub-Zeitplan mit IANA-Zeitzone](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onschedule)
- [GITHUB_TOKEN und Folgeereignisse](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [Cloudflare SQLite-Speicher und Transaktionen](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)
- [Durable-Objects-Free-Tarif und Limits](https://developers.cloudflare.com/durable-objects/platform/pricing/)
