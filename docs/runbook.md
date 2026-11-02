# Betrieb und spätere Einrichtung

Aktualisierung 02.11.2026: Erster Push und GitHub-CI erfolgreich, Repository danach
auf separaten Auftrag öffentlich geschaltet. Anschließend Betreiberangaben bestätigt,
Push und erstes Pages-Testdeployment separat freigegeben und erfolgreich ausgeführt.
Live: https://bummber.github.io/evolvera/ — [Deploymentbericht](first-pages-deployment.md).
`PAGES_DEPLOYMENT_ENABLED=true`, tägliche Automatisierung weiterhin aus.
Siehe [Veröffentlichungsvorbereitung](publication-preparation.md). Vor Pages zusätzlich
`npm run check:publication` ausführen; fehlende Textdurchsicht oder noch nicht
abgedeckte Betreiberanmeldung verhindern Upload. Die Galerie ist veröffentlicht;
die Betreiberfunktion bleibt lokal implementiert und extern nicht eingerichtet.
Die 40 Testwerke sind abgenommen, keine offizielle Serie. Historische Daten und
Generator 0.2.0 bleiben erhalten.

Zusatzstand 02.11.: Der Betreiber hat ein Cloudflare-Konto angelegt; die getrennte
Codex-MCP-Verbindung mit drei Basisrechten funktioniert nach Neustart. Vier Werkzeuge
lesend erfolgreich geprüft, ein Konto gefunden. Das aktiviert keine Evolvera-Anmeldung.
Konkreter Workers-Tarif, Worker-Origin, GitHub App und Deployment bleiben offen.
Details und nächster Schritt im [Übergabestand](HANDOFF.md).

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

Konkrete Werte, Rechte, Grenzen und Freigabereihenfolge stehen in der
[Einrichtungsvorlage vom 02.11.2026](operator-setup.md). Sie ist keine Beauftragung.
Keine Konten, Apps, zusätzlichen Rechte, Secrets oder Deployments ohne den konkreten
Betreiberauftrag einrichten. Keine Secrets im Chat.

1. Cloudflare-Konto, Workers Free und gewünschte HTTPS-Origin bestätigen. Vorgeschlagen:
   `https://evolvera-admin.<bestätigte-account-subdomain>.workers.dev`. Noch nicht eingerichtet.
   SQLite-Binding `SESSIONS`, Klasse `Sessions`, Migration `v1` sind lokal vorbereitet;
   keine zusätzliche D1-/KV-Datenbank nötig. `workers_dev:false`/`preview_urls:false`
   bleiben bis zum entsprechenden Auftrag bestehen.
2. GitHub App nur im Betreiberkonto und nur auf `bummber/evolvera` installieren.
   Contents read/write und erforderliche Metadaten genügen. Keine weiteren Rechte.
   Contents gilt auf Repositoryebene; nur der Worker begrenzt auf den festen
   Konfigurationspfad. Betreiber-ID `46008719` wurde lesend verifiziert und ist vor
   Hinterlegung mit dem angemeldeten Konto abzugleichen.
3. Callback exakt `<ADMIN_ORIGIN>/auth/callback`, Oberfläche `/settings`. Login,
   Callback und Moduswahl als Top-Level-Navigation auf derselben Worker-Origin.
   Nichtgeheime Variablen: `ADMIN_ORIGIN`, `OWNER_ID`, `GITHUB_CLIENT_ID`,
   `GITHUB_APP_ID`, `GITHUB_INSTALLATION_ID`. Geheim: `GITHUB_CLIENT_SECRET` und
   `GITHUB_PRIVATE_KEY_PKCS8`, ausschließlich serverseitig in Cloudflare-Secrets.
4. GitHub stellt gegebenenfalls PKCS#1 bereit. WebCrypto braucht unverschlüsseltes
   PKCS#8. Nur geschützt lokal mit restriktiven Rechten konvertieren, z. B.
   `umask 077` und
   `openssl pkcs8 -topk8 -nocrypt -in <geschützte-Eingabe.pem> -out <geschützte-Ausgabe.pem>`.
   Inhalt weder anzeigen noch in Chat, Git, Logs, Frontend oder Konsolenargumente
   übernehmen. Sichere Secret-Eingabe erst mit Auftrag; **`wrangler secret put` und
   `secret delete` deployen unmittelbar**. Das ist ebenfalls freigabepflichtig.
5. Vor Aktivierung [Datenschutzentwurf](operator-privacy-draft.md) vervollständigen,
   Hinweise auf Galerie und Worker vor Login erreichbar machen, Publikationsprüfung
   erweitern und separate Textdurchsicht bestätigen lassen. Der bisherige
   `pages-only`-Prüfumfang genügt nicht. Die Pages-Prüfung sperrt keinen direkten
   Worker-Deploy; dafür ist die Freigabe unabhängig erforderlich.
6. Erst nach konkretem Deployment-/Aktivierungsauftrag `ENABLED=true` setzen.
   Echtes Ende-zu-Ende prüfen: Betreiber/Fremdkonto, PKCE/State, Ablauf und Logout,
   Origin/CSRF, Konflikt und Commitverifikation, auch mit blockierten Drittanbieter-Cookies.
   Der Galerie-Link darf bis zur geprüften Veröffentlichung noch deaktiviert bleiben.
   Ein realer Login ist bei `ENABLED=false` nicht möglich; `/health` ist kein Auth-Nachweis.
7. Echte Moduscommits auf `main` und Push des Galerie-Links lösen bei aktueller
   Pages-Variable Veröffentlichung aus. Deshalb konkrete Speichertests und Push samt
   Datenschutzänderungen vorher beauftragen lassen. Der bereits lokale Dokumentations-
   commit gehört zum späteren Pushumfang. Serienstart und Automatisierung bleiben aus.

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

Grundlagen vom 28.10.2026; am 02.11.2026 zusätzlich aktuelle Auth-, Tarif-, Rollen-,
Routing- und Secretregeln für die [Einrichtungsvorlage](operator-setup.md) gelesen.
Bei tatsächlicher Einrichtung Konto/Tarif und Zustimmungsumfang erneut prüfen:

- [GitHub-App-Login mit PKCE](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub Contents API und SHA](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents)
- [GitHub-Zeitplan mit IANA-Zeitzone](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onschedule)
- [GITHUB_TOKEN und Folgeereignisse](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [Cloudflare SQLite-Speicher und Transaktionen](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)
- [Durable-Objects-Free-Tarif und Limits](https://developers.cloudflare.com/durable-objects/platform/pricing/)
