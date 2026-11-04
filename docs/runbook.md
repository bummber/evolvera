# Betrieb und spätere Einrichtung

Aktueller Abschluss des echten Cookie-Speichertests am 04.11.2026: Nach konkreter
Freigabe traceable/3 → free/4 → traceable/5 durch den Betreiber gespeichert. Remote
zuletzt `a66d0b49041149d3734a2e5bee2b56a5fc6f30b6`, beide CI-/Pages-Läufe erfolgreich;
je 22 öffentliche Dateien bytegleich zum jeweiligen Laufartefakt. Generierung false,
Startdatum null, Serienfreigabe false, Archiv leer. Kein Worker-Upload.
[Nachweise, Lauf-IDs und Grenzen](operator-cookie-check.md). Lokales HEAD/main und
gespeichertes origin/main weiter `d844e3f`, lokale Konfiguration traceable/3. Vor
weiterer Arbeit sicher integrieren, Remote-Revision 5 nicht zurücksetzen.

Die genau 17 uncommittierten Arbeitsdateien wurden vor diesem Ergebnisnachtrag
separat freigegeben als lokales Archiv gesichert; Pfad und Prüfsumme im neuesten
[HANDOFF](HANDOFF.md). Das Archiv enthält noch nicht die anschließenden Übergabetexte.
Kein lokaler Commit/Push oder Merge aus dieser Übergabe beauftragt. Kein neuer
Remoteabgleich im reinen Übergabeschritt. Die folgenden Einträge sind frühere Stände.

Aktuelle lokale Restabnahme 04.11.2026: [Matrix A-01 bis A-27 und konkreter
Start-/Fehlerablauf](pre-series-acceptance.md). Ergänzte synthetische Formular-/
Konflikt-/Sitzungstests, echter SQLite-Ablauf, Chromium mit eingeschränkten Cookies
und WebKit erfolgreich. Echte iPhone-/Safari-Prüfung einschließlich gespeicherter
Webapp vom Betreiber am 04.11. ohne Auffälligkeiten bestätigt. Firefox inzwischen
mit temporären getrennten Anwendungsdaten erfolgreich; vollständige Zusatzsuite
sechs bestanden in drei Engines. [Echte Cloud-Anmeldung und Logout](operator-cookie-check.md)
vom Betreiber auf iPhone/Safari im Privatmodus nach Anleitung bestätigt; Reload nach
Logout zeigt das Formular nicht wieder. Modusspeichern unter dieser Einstellung
bleibt separat offen. Desktop-Safari-Stichprobe durchgeführt. Kein neuer Commit,
Push, Deployment oder Serienstart. Bestehende Ergebnisarbeiten vollständig erhalten.

Aktueller Abschluss 04.11.2026: Nach ausdrücklicher Freigabe genau acht Dateien in
`d844e3f` lokal gesichert und regulär samt den sechs vorhandenen Commits gepusht.
CI und Pages erfolgreich, Generierung übersprungen. Werkbuch und Betreiber-Link
öffentlich; alle 22 Builddateien bytegleich, anonyme Liveprüfung 320/1440 px erfolgreich.
traceable/3, Generierung/Serienstart aus, Archiv leer. Kein Worker-Upload oder
Login-/Speichervorgang. Nur nachträgliche Ergebnisdokumentation bleibt uncommittiert;
kein zweiter Commit/Push beauftragt. [Veröffentlichungsbericht](gallery-publication-preparation.md).
Vor dem nächsten Arbeitspaket gemeinsam den veröffentlichten Stand sichten.
Die folgenden Zwischenstände sind historisch.

Aktueller Stand 04.11.2026: Galerie-Link zum bestehenden Betreiberworker lokal gesetzt,
Galerie-Statushinweise berichtigt, Werkbuch-Design unverändert. Publikationsprüfung,
Gesamtcheck mit 165 Tests, lokaler Runtime-Test und 68 Browserfälle erfolgreich;
sechs bewusste Doppelaufruf-Skips, Kunstreferenzen unverändert. Kein Commit/Push oder
Deployment. Acht lokale Dateien und kompletter späterer Veröffentlichungsumfang im
[aktuellen Vorbereitungsbericht](gallery-publication-preparation.md).
Generierung/Serienstart aus, traceable/Revision 3 erhalten. Kein Worker-Upload oder
Cloudflare-Verwaltungstoken für dieses Galeriepaket erforderlich. Die folgenden
„neuesten“ Zwischenstände sind historisch; aktueller HANDOFF hat Vorrang.

Neuester Abschluss 03.11.2026: Zwei lokale Commits separat freigegeben.
Sicherungscommit `238cbda` mit 22 benannten Dateien erstellt; anschließend
`origin/main` auf `f793247` gefetcht und konfliktfrei zusammengeführt. Abschließender
Mergecommit hat Eltern `238cbda` und `f793247`; aktuellen Hash aus Git lesen.
Reale lokale und Remote-Konfiguration jetzt traceable/Revision 3, Generierung aus.
Kein Push/Deployment, Galerie-Origin weiter null. Vor dem nächsten Arbeitspaket
gesicherten Stand gemeinsam sichten; Designveröffentlichung separat vorbereiten.
[Lokaler Integrationsbericht](integration-preparation.md).
Die folgenden Vorbereitungs-/Freigabehinweise sind historische Zwischenstände.

Neueste Vorbereitung: Lokaler und externer Stand isoliert konfliktfrei kombiniert,
Remote-Revision 3 erhalten, Gesamtcheck mit 165 Tests, Runtime und 68 Browserfälle
erfolgreich. Noch kein Merge oder Commit im eigentlichen Projekt. Vorgeschlagen
sind genau zwei lokale Commits ohne Push/Deployment; Freigabe noch offen.
[Kandidat, genaue Dateiauswahl und Prüfnachweise](integration-preparation.md).

Neuester Stand: Betreiber hat den separat mit „ja“ freigegebenen Rückwechsel selbst
gespeichert und traceable/Revision 3 bestätigt. Remote-Commit `f793247`, ausschließlich
Modusdatei, Generierung/Serienstart aus. CI und Pages erfolgreich, Build/Deploy
bestätigt, Generierung übersprungen. Öffentliche Dateien bytegleich zum isolierten
traceable/3-Build, Archiv leer. Keine weitere Speicherung; lokale Datei weiter traceable/1,
Remote-Revision 3 beim späteren Abgleich erhalten.
[Modusbericht und Prüfergebnisse](operator-mode-test.md).

Vorheriger Nachtrag: Ein-Datei-CI-Testfix auf separaten Auftrag als Remote-Commit
`75f11aed4481a56b67ece6bdff67354053857ab6` übernommen, ausschließlich
`tests/evolution.test.ts`. Remote-Modusdatei bytegleich free/2, Generierung aus.
CI und Pages für diesen Commit erfolgreich, Generierung korrekt übersprungen.
Öffentliches HTML und vier initiale Assets bytegleich zum isolierten Remote-Build;
offizielles Archiv weiter leer. Ergebnis im
[Modusbericht](operator-mode-test.md). Kein lokaler Design-/Worker-Push.
Die nachfolgende frühere Aufforderung zur Testfix-Freigabe ist damit erledigt.

Neuester Stand 03.11.2026: Remote-Modus **free/Revision 2** gespeichert, zusätzliche
Konfliktanzeige gemeldet. CI-/Pages-Testphase wegen einer an die veränderliche
Betreiberkonfiguration gekoppelten Testannahme fehlgeschlagen, Deploy übersprungen.
Nur Testfix lokal vorbereitet; **nicht erneut speichern oder ungefragt pushen**.
Lokale Modusdatei weiter traceable/1, Remote einen Moduscommit vor altem 9ad1fa7.
[Nachweise, Git-Grenzen und gezielter Freigabevorschlag](operator-mode-test.md).

Aktueller Reparaturstand 03.11.2026: Formular-/Logout-Fix separat freigegeben und
um 22:38 Uhr MEZ als Code-Update veröffentlicht. Aktive Version
`08317969-9743-4a86-84c2-a57afd3b7e75`; bestehende Secrets und derselbe SQLite-Namespace
erhalten. Health/Rechtstexte lesend erfolgreich geprüft. Der Betreiber bestätigt
den anschließenden Abmelde-/Neuanmeldetest mit „Funktioniert“.
Noch keinen Modus speichern; Schreibtest separat vorlegen. Kein weiteres Deployment nötig.
[Ursache, Tests und Updatebericht](operator-form-fix.md).

Aktueller Stand 03.11.2026: Der ausdrücklich freigegebene erste Worker-Upload samt
beiden Secrets, SQLite-Sitzungsspeicher und Anmeldeaktivierung ist ausgeführt.
Live: `https://evolvera-admin.alexander-brocker.workers.dev`.
Health und öffentliche Rechtstexte erfolgreich geprüft; Logging und Preview URLs
aus. Der Betreiber hat den ersten GitHub-Login selbst ausgeführt und bestätigt
sichtbare Einstellungen, ohne zu speichern. Modusspeichertest und umfassende
Sitzungsprüfung bleiben offen; nächsten Schritt gemeinsam sichten, noch keinen
Modus speichern. Kein Pages-Push und keine Serienaktivierung.
[Vollständiger Bericht](operator-first-upload.md#freigegeben-und-ausgeführt--03112026).
Die nachfolgenden Einrichtungsabschnitte sind historische Vorbereitung. Für spätere
Änderungen zuerst den vorhandenen Cloudzustand lesen, keinen Erstupload wiederholen.
Versionierter Workerstandard bleibt für lokale Prüfungen deaktiviert; Live-Upload
verwendete die getrennte ignorierte Vorlage. Galerie-Origin weiterhin null.

Vorheriger Nachtrag 03.11.2026: [Lokale Anbieterprüfung abgeschlossen](provider-review.md),
`providerReviewedOn:2026-11-03`. Die früher erwähnte Kontoprüfung ist für die lokale
Vorbereitung erledigt. Reale Logging-Konfiguration beim späteren Deployment prüfen;
keine Secrets, Bereitstellung oder Aktivierung aus dieser Prüfung ableiten.

Aktualisierung 02.11.2026: Erster Push und GitHub-CI erfolgreich, Repository danach
auf separaten Auftrag öffentlich geschaltet. Anschließend Betreiberangaben bestätigt,
Push und erstes Pages-Testdeployment separat freigegeben und erfolgreich ausgeführt.
Live: https://bummber.github.io/evolvera/ — [Deploymentbericht](first-pages-deployment.md).
`PAGES_DEPLOYMENT_ENABLED=true`, tägliche Automatisierung weiterhin aus.
Siehe [Veröffentlichungsvorbereitung](publication-preparation.md). Vor Pages zusätzlich
`npm run check:publication` ausführen; fehlende Textdurchsicht oder noch nicht
abgedeckte Betreiberanmeldung verhindern Upload. Die Galerie ist veröffentlicht;
die Betreiberfunktion bleibt lokal implementiert; die GitHub App ist inzwischen
installiert, der Worker extern noch nicht eingerichtet.
Die 40 Testwerke sind abgenommen, keine offizielle Serie. Historische Daten und
Generator 0.2.0 bleiben erhalten.

Zusatzstand 02.11.: Der Betreiber hat ein Cloudflare-Konto angelegt; die getrennte
Codex-MCP-Verbindung mit drei Basisrechten funktioniert nach Neustart. Vier Werkzeuge
lesend erfolgreich geprüft, ein Konto gefunden. Das aktiviert keine Evolvera-Anmeldung.
Am 03.11. Workers Free im Dashboard als aktueller Tarif bestätigt, vorhandene
Subdomain lesend geprüft. Betreiber hat für die Einrichtungsvorlage
`https://evolvera-admin.alexander-brocker.workers.dev` ausgewählt; noch nicht eingerichtet.
GitHub `/user` bestätigt `bummber`/`46008719`, Remote bleibt `9ad1fa7`.
GitHub App am 03.11. separat freigegeben, registriert und ausschließlich auf
`bummber/evolvera` installiert: Contents read/write und Metadata read-only.
Kennungen/Nachweis in der [Einrichtungskarte](operator-setup.md). Keine Secrets oder
privaten Schlüssel erzeugt; Worker-Deployment bleibt offen, keine zusätzlichen MCP-Rechte.
Details und nächster Freigabepunkt im [Übergabestand](HANDOFF.md).
Auf Fortsetzungsauftrag lokal neue Betreiber-Datenschutzhinweise und unabhängige
Durchsichtsgates umgesetzt. Pages-Prüfung und direkte Worker-Aktivierung bleiben
wegen offener Cloudflare-Kontoprüfung gesperrt. Textdurchsicht für die gewählte
Worker-Origin am 03.11. ausdrücklich bestätigt und dokumentiert. Kein Live-Update.

## Lokal prüfen

Node 24.21.0 gemäß `.nvmrc`, `npm ci`, `npm run check`,
`npm run worker:test-runtime`, `npm run test:browser`.
Wrangler 4.154.0 ist exakt als Entwicklungsabhängigkeit gepinnt. Sein Build läuft
mit `--dry-run`: kein Cloudflare-Upload. Telemetrie ist in Projektbefehlen deaktiviert.
`.worker-build` und `.wrangler` sind lokale, ignorierte Ausgaben und keine Pages-Dateien.

`npm run dev` startet die Galerie. `npm run worker:dev` startet den separaten Worker
auf Loopback/Port 8787. `/health` liefert ohne Einrichtung HTTP 503 und
`{"configurationReady":false}`; `/settings` erklärt den fehlenden Zugang.
`/privacy` und `/imprint` liefern auch deaktiviert Rechtstexte ohne Sitzung und
GitHub-Aufruf. Alle Worker-HTML-Seiten verlinken sie. Der Betreiber-Datenschutztext
wird mit der Galerie aus gemeinsamem Inhalt erzeugt; lokal derzeit als Entwurf.
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

## Externe Einrichtung – bestehender Betrieb und historische Einrichtung

Stand 04.11.2026: Galerie und bestehender Worker sind eingerichtet und veröffentlicht,
GitHub App nur auf bummber/evolvera installiert, Login/Logout und Modusrunde bis
traceable/5 nachgewiesen; lokal noch traceable/3, Integration offen. Keine Wiederholung
der Einrichtung oder Secret-Eingabe
aufgrund der folgenden historischen Schritte. Die versionierte Worker-Vorlage ist
bewusst deaktiviert; der echte Worker wurde separat bereitgestellt.
[Veröffentlichungsbericht](gallery-publication-preparation.md),
[aktuelle Restabnahme und Startplan](pre-series-acceptance.md).

### Historische Einrichtungsschritte – nicht erneut ausführen

Konkrete Werte, Rechte, Grenzen und Freigabereihenfolge stehen in der
[Einrichtungsvorlage, aktualisiert am 03.11.2026](operator-setup.md). Die Dokumentation selbst ist keine Beauftragung.
Keine Konten, Apps, zusätzlichen Rechte, Secrets oder Deployments ohne den konkreten
Betreiberauftrag einrichten. Keine Secrets im Chat.

1. Cloudflare-Konto und Workers Free am 03.11. lesend bestätigt. Für die Vorlage ausgewählt:
   `https://evolvera-admin.alexander-brocker.workers.dev`. Noch nicht eingerichtet.
   SQLite-Binding `SESSIONS`, Klasse `Sessions`, Migration `v1` sind lokal vorbereitet;
   keine zusätzliche D1-/KV-Datenbank nötig. `workers_dev:false`/`preview_urls:false`
   bleiben bis zum entsprechenden Auftrag bestehen.
2. GitHub App auf separaten Auftrag am 03.11. im Betreiberkonto registriert und nur
   auf `bummber/evolvera` installiert. Contents read/write und Metadata read-only,
   keine weiteren Rechte. Contents gilt auf Repositoryebene; nur der Worker begrenzt
   auf den festen Konfigurationspfad. Betreiber-ID `46008719` gegen das angemeldete
   Konto `bummber` abgeglichen. Keine Schlüssel oder Secrets erzeugt; Anlage/Übertragung
   vor Durchführung gesondert konkretisieren und freigeben lassen.
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
   tatsächlichen Vertrag/DPA und Kontoeinstellungen prüfen und separate Textdurchsicht
   bestätigen lassen. Hinweise auf Galerie/Worker und neue Prüfungen sind lokal
   umgesetzt. `config/operator-privacy.json` bindet Durchsicht an Origin/Textversion;
   Textdurchsicht vom 03.11. mit Version `2026-11-03.1` dokumentiert, Nachweis der
   Cloudflare-Kontoprüfung weiterhin null. Die frühere Pages-Durchsicht genügt nicht.
   Direkter Worker-Login bleibt ebenfalls gesperrt. Das Runtimegate verhindert keinen
   Code-Upload; dessen Freigabe ist unabhängig erforderlich. Sicheren Secret-Ablauf
   anhand der [Vorbereitung](operator-secrets.md) konkret freigeben.
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

Vorher die offenen Nachweise der [Abnahmematrix](pre-series-acceptance.md) sichten
und abschließen oder begründet gesondert entscheiden. Datum bleibt bis dahin offen.
Der konkrete Start-/Stopp-/Nachweisablauf ist dort vorbereitet, ohne Gates zu ändern.
Anschließend in einem gesonderten,
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
- CI-/Pages-Deployment und echte Betreiberanmeldung sind nachgewiesen. Der erste
  geplante offizielle Archivlauf ist noch nicht erfolgt; lokale/synthetische
  Testergebnisse niemals als dessen Erfolg oder volle Cloud-Abnahme darstellen.

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
