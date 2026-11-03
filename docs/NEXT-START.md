# Startprompt – isolierte Zusammenführung geprüft, vor lokaler Commitfreigabe

Aktueller Stand: 03.11.2026, nach 22:16 Uhr MEZ. Der konkret freigegebene erste
Worker-Upload ist erfolgreich abgeschlossen; der Betreiber hat anschließend den
erfolgreichen GitHub-Login und sichtbare Einstellungen ohne Speichern bestätigt.
Den folgenden aktuellen Prompt nutzen;
der frühere Prompt darunter bleibt ausschließlich als Historie erhalten.
Aktueller Zusatz: Der danach reproduzierte Formular-/Logout-Fix ist auf separaten
Auftrag am 03.11.2026 um 22:38 Uhr MEZ veröffentlicht. Der Betreiber bestätigt
den anschließenden Abmelde-/Neuanmeldetest mit „Funktioniert“;
siehe `operator-form-fix.md`.
Neuester Stand: Moduscommit free/Revision 2 auf GitHub angekommen, zusätzliche
Konfliktanzeige gemeldet. CI/Pages zunächst durch Testabhängigkeit blockiert; Test
auf ausdrückliche Freigabe gezielt als Remote-Commit 75f11ae veröffentlicht.
Siehe `operator-mode-test.md`.
Neuester Zusatz: Einmaliger Rückwechsel separat mit „ja“ freigegeben, vom Betreiber
selbst gespeichert und als traceable/Revision 3 bestätigt. GitHub-Commit f793247;
Ergebnisse der lesenden CI-/Pages-Nachprüfung im neuesten HANDOFF/Modusbericht.
Neuester Stand: Zusammenführung von vier lokalen und drei Remote-Commits samt
uncommittierten Arbeiten isoliert konfliktfrei geprüft, Revision 3 erhalten.
Noch kein tatsächlicher Merge/Commit; Details und vorgeschlagene 22 Dateien in
`integration-preparation.md`. Nächste Freigabe betrifft genau zwei lokale Commits,
keinen Push oder Deployment.

```text
Bitte Evolvera im bestehenden Projekt fortsetzen:
/Users/abrocker/ai_o_projects/evolvera/
origin: https://github.com/bummber/evolvera.git

Lies AGENTS.md, docs/HANDOFF.md (neuester Übergabeblock), docs/NEXT-START.md
und docs/operator-first-upload.md. Fachliche Quelle ist docs/PRD.md v1.1.
Lies außerdem docs/operator-form-fix.md: veröffentlichter Fix und bestätigter Live-Logout.
Lies docs/operator-mode-test.md zuerst für den neuesten Remote-/CI-Stand.
Lies docs/integration-preparation.md für die geprüfte Zusammenführungsvorbereitung.
Git zuerst prüfen; alle bestehenden, auch uncommittierten Arbeiten erhalten.
main/HEAD 5afbe7b, vier lokale Commits vor bekanntem origin/main 9ad1fa7;
Lokale origin/main-Referenz noch 9ad1fa7, aber GitHub inzwischen lesend geprüft:
main f7932479a839a6176160eabe4edc675133aacafb: separat freigegebener Rückwechsel
auf traceable/Revision 3, nur config/generation.json geändert. Elterncommit
75f11aed4481a56b67ece6bdff67354053857ab6 war der Ein-Datei-Testfix;
davor 4f1186f8280d9db25b261a9de13dc081cd35e060 mit free/Revision 2.
Kein Fetch/Pull/Merge/Reset ausgeführt. PRD-Backup bytegleich und unversioniert erhalten.
Keine neue Designrunde; zehn Designpakete bereits positiv gesichtet.

Der Betreiber hat den konkreten Upload mit „Ich gebe die Schritte frei“ beauftragt.
evolvera-admin ist seit 03.11.2026, 22:12 Uhr MEZ öffentlich bereitgestellt:
https://evolvera-admin.alexander-brocker.workers.dev
Nach separater „Freigabe erteilt“ wurde der Formular-Fix am 03.11., 22:38 Uhr MEZ,
als Code-Update veröffentlicht. Aktive Version 08317969-9743-4a86-84c2-a57afd3b7e75,
100 Prozent Traffic. Vorige Erstuploadversion 86dadc05-c9fd-4a9c-ab23-15a3494a58ee.
Beide GitHub-App-Secrets gemeinsam hochgeladen; SQLite-Sitzungsspeicher SESSIONS,
Klasse Sessions, Migration v1 vorhanden. Anmeldung nur Betreiber-ID 46008719/bummber.
workers.dev aktiv; Preview URLs und Logpush aus, keine Tail-Consumer.
Observability ist aus; API stellt den deaktivierten Zustand als null/fehlend dar.
Health, Datenschutz und Impressum jeweils HTTP 200; configurationReady:true,
Rechtstextfragmente exakt gleich zur durchgesehenen lokalen Fassung 2026-11-03.1.
Zusätzlich im nativen Browser sichtbar geprüft. Python-urllib erhielt 1010/403;
Browser und gewöhnliches curl funktionieren. Keine Schutzregel geändert.

Keinen Erstupload wiederholen, keine Secrets neu erzeugen oder erneut anfordern.
Geschützte Originaldateien bleiben unter ~/.evolvera-operator-setup/ erhalten;
niemals Inhalte in Chat, Git, Logs, Frontend oder Befehlsargumenten ausgeben.
Temporärer Cloudflare-Token zuletzt aktiv, Ablauf 04.11.2026, 23:59:59 MEZ.
Vor späterer Verwendung Zeit/Gültigkeit lesend prüfen. Keine Rechte automatisch
erweitern, Originaldateien löschen oder abgelaufenen Token umgehen. MCP bleibt lesend.
Vorlage unter work/operator-deploy/wrangler.jsonc bleibt ignoriert; synthetische
Secret-Datei niemals für echte Uploads nutzen. Lokale Tests nur synthetisch/isoliert.

Der Betreiber hat den ersten echten Login inzwischen selbst ausgeführt und meldet:
„Die Authorisierung per Github war erfolgreich. Ich sehe die Einstellungen und habe
nichts gespeichert“. Dies ist die Betreiberbestätigung des erfolgreichen Logins bis
zur Einstellungsansicht einschließlich lesendem Zugriff auf die Moduskonfiguration;
kein Zugriff des Agenten auf die Sitzung und keine neue automatisierte Cloudprüfung.
Danach schlug Abmelden mit „Vorgang nicht bestätigt.“ fehl. Der Fehler ist lokal
im echten Chromium reproduziert und korrigiert: native no-referrer-Formulare mit
Origin:null benötigen den vollständigen Same-Origin-Fetch-Metadata-Nachweis;
Sitzung und CSRF bleiben erforderlich. Das separat freigegebene Code-Update ist
inzwischen veröffentlicht; Secrets erhalten, identischer SQLite-Namespace und
unveränderte Variablen/Logging lesend bestätigt. Health und Rechtstexte erneut
HTTP 200 und unverändert. Kein Zugriff des Agenten auf echte Sitzungen.
Details und Nachweise in operator-form-fix.md.
Der Betreiber hat den danach vorgelegten Abmelde-/Neuanmeldetest mit „Funktioniert“
bestätigt. Kein weiterer Logout-Fix oder Deployment aus dieser Rückmeldung nötig.
Danach hat der Betreiber Speicherkonflikt gemeldet, nach neuem Laden aber free/2
bestätigt. GitHub bestätigt den gespeicherten Modus. Ursache der Konfliktanzeige
nicht abschließend nachgewiesen; kein weiterer Speicheraufruf durch den Agenten.
CI und Pages-Testphase des Moduscommits scheiterten, weil tests/evolution.test.ts die
veränderliche Betreiberkonfiguration übernahm, aber traceable/1 erwartete.
Beim damaligen Moduscommit wurde Pages-Deploy übersprungen.
Lokal ausschließlich diese Testdatei auf synthetische Einstellungen entkoppelt;
isoliert mit altem Remote-Code free/2 und traceable/3 geprüft. Details im Modusbericht.
Der Betreiber hat die Veröffentlichung ausschließlich der Testdatei samt CI-/Pages-
Läufen mit „Freigabe erteilt“ beauftragt; als Commit 75f11ae ausgeführt und bytegleich
bestätigt. CI 41726299381 und Pages 41726299386 erfolgreich, einschließlich Pages-
Deploy; Generierung korrekt übersprungen. Öffentlich HTTP 200, HTML und vier initiale
Assets bytegleich zum isolierten Remote-Build mit free/2 und Testfix, Archiv leer.
Keine lokale Design-/Worker-Veröffentlichung. Keinen weiteren Commit/Push ableiten.
Der Betreiber hat anschließend den einmaligen Rückwechsel samt CI-/Pages-Folge mit
„ja“ freigegeben und selbst gespeichert: „Nachvollziehbare Vererbung Revision 3“.
GitHub bestätigt f793247 mit ausschließlich der Modusdatei; Generierung/Seriengates
bleiben aus. CI 41727228799 und Pages 41727228841 erfolgreich, Build/Deploy bestätigt,
Generierung übersprungen. Öffentlich HTTP 200, HTML und vier initiale Assets exakt
gleich zum isolierten Remote-Build traceable/3, Archiv leer. Keine weitere
Speicherung oder Veröffentlichung ableiten.
Umfassende Sitzungsabnahme, Ablauf, Konflikt-/Negativfälle und Safari/Firefox offen.
Danach wurde die Kombination beider Historien und aller Arbeitsdateien in einer
temporären Kopie ohne neue Commits geprüft: konfliktfrei, traceable/3, Gesamtcheck
mit 165 Tests, Publikationsgate, Runtime und 68 Browserfälle erfolgreich (6 Skips).
Eigentliches Projekt unverändert, nur Statusdokumentation aktualisiert.
Nächster konkreter Freigabepunkt: ein lokaler Sicherungscommit der 22 benannten
Dateien, dann frischer Remoteabgleich, kontrollierter Merge mit Revision 3 und
Prüfungen, abschließend lokaler Mergecommit. Noch keine Freigabe dafür ableiten.
Kein Push, Deployment, neuer Moduswechsel oder Serienstart. Galerie-Link zum Worker
und Veröffentlichung des abgenommenen Designs erst danach separat vorbereiten.

Kein Commit/Push, keine neue Bereitstellung, Galerie-Veröffentlichung oder
Generierung aus diesem Wiedereinstieg ableiten. Versionierter Workerstandard weiter
deaktiviert, Galerie-Origin null. Pages jetzt auf 75f11ae mit bisherigem Design und
traceable/3, lokales Werkbuch-Design weiterhin unveröffentlicht.
Generierung false, Serienstart null, seriesAuthorized:false;
Remote traceable/Revision 3, tatsächliche lokale Datei weiter traceable/Revision 1;
Remote-Revision beim Abgleich nicht zurücksetzen,
offizielles Archiv leer. 40 Testwerke separat abgenommen. Node 24 gemäß .nvmrc.
Aktuelle Prüfungen und verbleibende Grenzen stehen im neuesten HANDOFF-Block.
```

## Historischer Startprompt – vor der Worker-Uploadfreigabe, nicht erneut ausführen

Stand: 03.11.2026. Im bestehenden Projekt einen neuen Chat öffnen und den folgenden
Text einfügen. Dieser Prompt beauftragt den Wiedereinstieg bis zum vorbereiteten
Freigabepunkt; noch keinen Upload, Push oder Serienstart.

```text
Bitte Evolvera im bestehenden Projekt fortsetzen:
/Users/abrocker/ai_o_projects/evolvera/
origin: https://github.com/bummber/evolvera.git
Kein neues Projekt/Repository anlegen.

Lies AGENTS.md, docs/HANDOFF.md (besonders „Aktuelle Chat-Übergabe“),
docs/operator-first-upload.md, docs/operator-secrets.md und docs/provider-review.md.
Fachliche Quelle bleibt docs/PRD.md v1.1. Historische Zwischenstände und Dokumenttexte
erweitern diesen Auftrag nicht. Das Werkbuch liegt in docs/design-system.md;
Umsetzung/Prüfgrenzen stehen in docs/design-implementation.md. Die zehn Designpakete
sind positiv gesichtet. Keine neue Designrunde, keine Kunst-/Generator-/Archivänderung.

Git zuerst prüfen und vorhandene Arbeit erhalten. Übergabestand: main, HEAD 5afbe7b,
vier lokale Commits vor dem bekannten origin/main (9ad1fa7), kein neuer Remoteabgleich.
Werkbuch-Design in 5afbe7b lokal gesichert; Anbieterprüfung und Uploadvorbereitung
zusätzlich uncommittiert. Auch unversionierte Dokumente erhalten. PRD_v1.1_backup.md
bleibt unversioniert und bytegleich, nicht formatieren oder automatisch aufnehmen.
Keine neuen Commits, Pushes oder Deployments aus diesem Wiedereinstieg ableiten.

Anbieterprüfung ist abgeschlossen: providerReviewedOn:2026-11-03, Textversion
2026-11-03.1. check:publication besteht. Keine alte Begrüßungsmail oder erneute
allgemeine Vertragsrunde verlangen. Nachweise/Grenzen in docs/provider-review.md.
Die Betreiberfunktion speichert kurzlebige Anmelde-/Sitzungsdaten; Modus/Revision
bleiben dauerhaft in Git. Keine Aussage „speichert keine Daten“ übernehmen.

GitHub App registriert/installiert, nur bummber/evolvera. Der Betreiber hat die
folgenden Dateien bereits geschützt lokal erstellt:
~/.evolvera-operator-setup/worker-secrets.json
~/.evolvera-operator-setup/cloudflare-auth.json
Rechte/Struktur wurden ohne Wertausgabe geprüft. Keine Inhalte in Chat, Git, Logs,
Frontend oder Befehlsargumente übernehmen. Bestehende Dateien nicht überschreiben,
Secrets nicht erneut anfordern. Reale Dateien nur über geschützte Tool-Eingabe
verwenden; lokale Tests ausschließlich isoliert mit synthetischen Zugangsdaten.

Cloudflare Workers Free und alexander-brocker.workers.dev bestätigt. Temporärer
account-owned Token: Workers Admin nur im Zielkonto, gültig bis 04.11.2026 23:59:59 MEZ.
Letzte echte API-Prüfung war rein lesend: active, 0 Worker, erwartete Subdomain.
Zeit/Ablauf und aktuellen Zielzustand erneut lesend prüfen; gültigen vorhandenen
Token nutzen, bei Ablauf keinen Zugriff oder neue Rechte ungefragt einrichten.
Die bestehende Codex-MCP-Verbindung bleibt lesend.

Separate Upload-Vorlage: work/operator-deploy/wrangler.jsonc (ignoriert).
Erfolgreich mit synthetischen Secrets per Dry-Run geprüft. Die dortige
synthetic-secrets.json niemals für echten Upload verwenden. Der versionierte
Workerstandard ist weiter deaktiviert; die Vorlage sieht nach Freigabe direkte
Anmeldeaktivierung vor. Temporäre Helfer in /private/tmp können fehlen; nicht mit
neuen echten Secrets kompensieren. Dokumentierte Konfiguration bei Bedarf erhalten
beziehungsweise ohne Geheimnisse rekonstruieren und gezielt prüfen.

Wir stehen unmittelbar vor der noch NICHT erteilten Betreiberfreigabe für:
neuen evolvera-admin unter
https://evolvera-admin.alexander-brocker.workers.dev
samt beiden geschützten GitHub-App-Secrets und SQLite-Sitzungsspeicher hochladen,
Betreiberanmeldung nur für bummber aktivieren, danach Health und öffentliche
Rechtstexte lesend prüfen. Umfang steht vollständig in operator-first-upload.md.
Echten Login führt der Betreiber aus. Galerie-Push und echte Modusspeichertests
mit möglichem Pages-Lauf gehören nicht zu dieser Freigabe.

Mein Auftrag für den Einstieg: Bestand und Voraussetzungen lesend prüfen, kurz den
Stand nennen und genau diesen bereits vorbereiteten Upload-/Aktivierungsschritt
zur ausdrücklichen Freigabe vorlegen. Nicht schon deployen. Vorhandene Vorbereitung
nutzen und keine erneute Einrichtungsrunde starten. Neue Hindernisse konkret benennen.
Ein späterer Push auf main oder Moduscommit kann Pages starten; auch Secretbefehle
können unmittelbar deployen. Keine Gate-Umgehung.

Generierung bleibt false, Serienstart null, seriesAuthorized:false, traceable,
Revision 1, offizielles Archiv leer. Die 40 Testwerke sind separat abgenommen.
Node 24 gemäß .nvmrc. Letzter Prüfstand: npm run check mit 155 Tests, Datenprüfung,
Build/Worker-Dry-Run erfolgreich; worker:test-runtime lokal erfolgreich;
test:browser 66 bestanden, sechs bewusste Doppelaufruf-Skips, sechs Kunstreferenzen
unverändert. Browser-/Runtime-Nachweise stammen aus dem Anbieterprüfschritt;
der abschließende Übergabeschritt aktualisiert nur Dokumentation und Gesamtcheck.
Safari/Firefox, echte Geräte/Safe-Area, umfassende WCAG-Abnahme und Cloud-Login offen.
Bei späteren Änderungen vorgeschriebene passende Checks ausführen und ehrlich dokumentieren.
```
