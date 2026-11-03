# Startprompt – lokal gesichert und zusammengeführt, vor Veröffentlichung

Stand 03.11.2026. Zwei lokale Commits ausdrücklich freigegeben; kein Push oder
Deployment. Der aktive Prompt unten ersetzt die früheren Zwischenanweisungen.
Die vorherige vollständige Promptfassung ist im Sicherungscommit `238cbda` erhalten;
der ursprüngliche historische Startprompt bleibt zusätzlich unten stehen.

```text
Bitte Evolvera im bestehenden Projekt fortsetzen:
/Users/abrocker/ai_o_projects/evolvera/
origin: https://github.com/bummber/evolvera.git

Lies AGENTS.md, docs/HANDOFF.md (neuester Block), docs/integration-preparation.md
und docs/operator-mode-test.md. Fachliche Quelle ist docs/PRD.md v1.1.
Git zuerst prüfen und alle Arbeiten erhalten. Keine neue Designrunde: zehn Pakete
und Werkbuch-Design sind bereits positiv gesichtet.

Der Betreiber hat genau zwei lokale Commits ohne Push mit „Freigabe erteilt“
beauftragt: Sicherungscommit 238cbdaee1eab859b7e12cbd097abcbc35126e74 mit exakt
22 benannten Dateien erstellt; danach origin/main auf f7932479a839a6176160eabe4edc675133aacafb
gefetcht und konfliktfrei zusammengeführt. Lokales main/HEAD ist der abschließende
Mergecommit mit Eltern 238cbda und f793247; aktuellen Hash mit git log -1 lesen.
Sechs lokale Commits vor origin/main. Alle früheren vier lokalen Commits erhalten.
Kein Pull/Reset oder Force-Push. PRD_v1.1_backup.md unversioniert und bytegleich
belassen; nicht aufnehmen oder formatieren. Ein sauberer Arbeitsbaum darf dieses
bewusst unversionierte Backup weiterhin anzeigen.

Remote und reale lokale config/generation.json jetzt beide traceable/Revision 3.
Generierung false, Serienstart null, seriesAuthorized:false, offizielles Archiv leer;
40 Testwerke separat abgenommen. Revision beim nächsten Schritt erhalten.
Snapshot-Testfix war bereits identisch vorhanden. Keine Kunst-/Generatoränderung.

Tatsächlicher zusammengeführter Stand vor Mergecommit neu geprüft:
check:publication erfolgreich, npm run check mit 165 Tests, Datenprüfung, Build und
Worker-Dry-Run erfolgreich; worker:test-runtime erfolgreich; test:browser am gebauten
Stand mit CI=true: 68 bestanden, sechs bewusste Doppelaufruf-Skips, sechs bestehende
Kunstreferenzen unverändert. Node 24.21.0 gemäß .nvmrc. Ergebnisdokumentation danach
nur format-/diffgeprüft. Safari/Firefox, echte Geräte/Safe-Area, umfassende WCAG-
und Sitzungs-/Negativfallabnahme bleiben offen.

Pages öffentlich weiterhin auf f793247 mit bisherigem Design und traceable/3;
CI-/Pages-Läufe des Rückwechsels erfolgreich, Generierung übersprungen und
öffentliches HTML/Startassets gegen isolierten Remote-Build geprüft.
Das neue lokale Werkbuch-Design ist noch nicht veröffentlicht.
Galerie-Origin weiterhin null; versionierter Workerstandard bewusst deaktiviert.

Liveworker https://evolvera-admin.alexander-brocker.workers.dev zuletzt Version
08317969-9743-4a86-84c2-a57afd3b7e75, Betreiberanmeldung nur bummber/46008719.
Login, Logout/Neuanmeldung und Modusrunde traceable/1 -> free/2 -> traceable/3 durch
Betreiber und GitHub-Nachweise bestätigt. Auslöser der zusätzlichen Konfliktanzeige
beim ersten Wechsel nicht abschließend bewiesen; nicht als behoben verallgemeinern.
Kein neues Worker-Deployment nötig. Vorhandene SQLite-Sitzungen und Secrets erhalten;
Observability/Logpush/Preview URLs aus. Keine Secrets in Chat/Git/Frontend/Logs.
Private Originaldateien bleiben unter ~/.evolvera-operator-setup/ geschützt;
nichts erneut anfordern oder automatisch löschen. Temporärer Cloudflare-Token läuft
04.11.2026 um 23:59:59 MEZ ab; vor späterer Verwendung Zeit/Gültigkeit lesend prüfen,
keinen Ablauf umgehen und keine Rechte ungefragt erweitern. MCP bleibt lesend.
Lokale Tests ausschließlich synthetisch und in isolierten Git-Repositories.

Nächster Schritt: zuerst gemeinsam den gesicherten Stand sichten. Danach die
separate Veröffentlichungsvorbereitung des bereits abgenommenen Werkbuch-Designs
samt Galerie-Link zum geprüften Betreiberworker abgrenzen. Die bisherigen Freigaben
sind für die lokalen Commits und früheren einzelnen Remoteaktionen erteilt worden;
keinen weiteren Push, Pages-/Worker-Upload, Moduswechsel oder Serienstart ableiten.
Vor konkreter Veröffentlichung alle notwendigen Vorbereitungen und Prüfungen
abschließen und genau den resultierenden Umfang zur Freigabe vorlegen.
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
