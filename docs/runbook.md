# Betrieb und spätere Einrichtung

## Aktuell – 05.11.2026, Zeitumstellung veröffentlicht

Freigegeben und mit **c858113** regulär veröffentlicht; HEAD/main und origin/main
synchron. Ab Werkdatum **06.11.2026 01:17 Europe/Berlin**, Nachholversuche 01:47/02:23.
Genau zwei Originalwerke, unverändert mit ihren 04:00-Terminen, traceable/6 und
aktive Gates erhalten. CI 42010783208 und Pages 42010782945 erfolgreich:
je 187 Tests, 72 Browserfälle/sechs bestehende Skips und workerd/SQLite.
Alle 24 öffentlichen Dateien bytegleich zu Artefakt 13406488686 und lokalem Build;
zehn anonyme Livefälle bei 320/1440 bestanden.
[Maßgeblicher vollständiger Abschlussbericht](schedule-change.md).

Nächster tatsächlicher Nachweis: erster Lauf des neuen Zeitplans am 06.11. ab
01:17 Berlin, Generation 3 mit beiden Ursprüngen als Eltern. Nicht als schon
bestanden melden. Actions bleibt best effort. Vier neue Ergebnisnachträge bleiben
lokal uncommittiert; PRD-Backup zusätzlich unverändert. Keine zusätzliche
Veröffentlichung oder neue Sicherung allein aus diesem Vermerk.
Nachfolgende Vorbereitungs-/Startstände sind historisch.

## Aktuell – Zeitumstellung am 05.11.2026 lokal vorbereitet

Ab Werkdatum **06.11.2026** ist lokal **01:17 Europe/Berlin** vorgesehen,
mit Nachholversuchen **01:47/02:23**. Veröffentlichung noch ausstehend;
[Umstellungsbericht und Prüfstand](schedule-change.md) sind maßgeblich.
Die beiden echten Ursprungswerke behalten ihre ursprünglichen 04:00-Termine.
Die früheren Abschluss-/Vorbereitungsblöcke unten bleiben historische Nachweise.

## Aktuell – Serie seit 04.11.2026 aktiviert und erstes Werk veröffentlicht

**traceable/6, Startdatum 2026-11-04, Generierung true, Serienfreigabe true.**
Pages und Tagesautomatisierungsvariable true. Aktuelles HEAD/main und origin/main
`7e19cdf17eeac668ab884743e81400096c310358`. Aktivierung `4406b4f0b15d4932ab778f3968c7530cfa8d27e9` mit genau 15 Dateien regulär gepusht;
der echte Tageslauf hat separat das erste Werk „Irifalter“ und den Index committed.
Nur diesen geprüften Archivcommit lokal per Fast-forward integriert.
[Dauerhafter Startbericht](series-start-preparation.md).

Neue byteweise geprüfte Vorstartsicherung `2026-11-04-pre-series-52e4342.tar.gz`,
117215 Bytes, 15 Dateien plus Manifest, SHA-256
`09b95288605248132579b58b2c32fe871ec90fc5ba7e06967a9f1212c7c66a73`. Drei ältere Archive und PRD-Backup erhalten.
Genau fünf anschließende Ergebnisdokumente bleiben uncommittiert und sind im neuen
Archiv noch nicht enthalten; kein zusätzlicher Ergebniscommit/Push beauftragt.

CI 41869682779, Pages 41869682632 und genau eine deploy:false-Wiederholung 41870657793
erfolgreich: je 167 Tests, 70 Browserfälle/sechs bestehende Skips, workerd/SQLite.
Erstes Werk Generation 1 ohne Eltern; Wiederholung ohne neue Werke/Commits oder
veränderte Originalbytes. Alle 23 öffentlichen Dateien bytegleich zum ersten und
wiederholten Build; zwölf anonyme Livefälle bei 320/1440 bestanden.

Nächster vorgesehener Lauf **05.11.2026 ab 04:00 Berlin**, zweiter unabhängiger
Ursprung. Nicht vorziehen oder als schon bestanden dokumentieren. Actions best
effort, keine exakte Veröffentlichungsgarantie. Nicht auf alte Revisionen/leeres
Archiv zurücksetzen oder historische Vorstartgates ungefragt wiederherstellen.
Kein weiterer Modus-/Cookie-/Worker-/Secret-/Sitzungsauftrag, Design, Phase 5 oder EP-01.
Die nachfolgenden Vorbereitungsstände sind historisch; aktuell gelten dieser
Abschnitt, der neueste HANDOFF und der Startbericht samt Restgrenzen.

## Aktuell – Serienstartvorlage 04.11.2026, noch gesperrt

Auf „Mach weiter“ und die Datumsauswahl „heute“ ist die eigenständige
[Serienstartvorlage](series-start-preparation.md) mit genau 15 vorgeschlagenen
Commitdateien vorbereitet. 13 Arbeitsdateien liegen lokal vor; echte Konfigurationen
bleiben unverändert traceable/5, false/null/false, Archiv leer. Keine neue Sicherung,
echter Commit/Push, Variable, Workflowauslösung oder Veröffentlichung.

Der isolierte aktive Kandidat mit synthetischem Erstwerk besteht Gesamtcheck
(167 Tests) und Browser (70 bestanden/sechs bestehende Skips). Die sieben nötigen
Startkorrekturen liegen lokal vor, ohne echte Gates zu öffnen. Isolierte Probe
bestätigt genau ein erstes Ursprungswerk heute und unveränderte Wiederholung;
Generation 2 erst am 05.11. ab 04:00. Vorlage nach Berliner Datumswechsel nicht
ungefragt ausführen. Erst konkrete separate Betreiberfreigabe für sofortigen Erstlauf,
Tagesautomatisierung, Sicherung/Commit/Push/Pages und deploy:false-Wiederholung.
Deaktivierter Stand zusätzlich im isolierten Klon mit Gesamtcheck (167 Tests) und
zehn Fällen der drei geänderten Browserdateien geprüft. Remote-/Gateabgleich um
17:26:56 MEZ unverändert. Tatsächliche Prüfungen und Grenzen im neuesten HANDOFF
und der Vorlage beachten.

## Aktueller Stand – L-01 am 04.11.2026 veröffentlicht

Der konkret vorgelegte Sicherungs-/Sieben-Dateien-Commit-/Push-/Pages-Umfang ist
auf **„ja“** erledigt. HEAD/main und origin/main synchron `52e4342`, Elterncommit
`02f9d6f`; regulärer Fast-forward von `a66d0b4` einschließlich `2ffb420`/`02f9d6f`,
insgesamt 19 Dateidifferenzen. [Vollständiger Veröffentlichungsbericht](gallery-publication-preparation.md).
Keine zusätzliche Commit-/Pushfreigabe aus diesem Ergebnis.

Neue lokale Sicherung `2026-11-04-pre-pages-L01-02f9d6f.tar.gz`: sieben Dateien plus
Manifest byteweise geprüft, SHA-256
`66b9e1ad151f2735ee243a882e57854eb7fa333c2ae1396cc798ad51f403bd98`.
Beide älteren Archive und PRD-Backup erhalten; Backup weiterhin unversioniert/bytegleich.
Die fünf anschließenden Ergebnisdokumente sind im Archiv noch nicht enthalten.

CI 41857781816 und Pages 41857781840 für diesen Commit erfolgreich: je 166 Tests,
70 Browserfälle/sechs bewusste Skips; workerd/SQLite erfolgreich. Generierung
übersprungen. Alle 22 öffentlichen Dateien bytegleich zum Pages-Artefakt 13337733414
und geprüften lokalen Build. Anonyme Liveprüfung zehn Kombinationen bei 320/1440
und verzögerter Ladestatus bestanden; Linkziel/Revision 5 korrekt, keine automatischen
Fremdabrufe, Schreibrequests, Cookies oder Seitenfehler. Kein Login/Modusspeichern.

Remote-Endstand und Gates nach Veröffentlichung frisch gelesen: traceable/5,
Generierung false, Startdatum null, Serienfreigabe false, offizielles Archiv leer;
Pages true, Tagesautomatisierungsvariable nicht gesetzt. Kein Worker-Upload,
Secret-/Sitzungszugriff oder neue Einrichtung. Kleine Schriftverschiebungen und
weitere Abnahmegrenzen bleiben dokumentiert; keine Serienfreigabe daraus ableiten.

Fünf Ergebnis-/Startdokumentupdates bleiben uncommittiert, CSS/Test unverändert.
Abschließenden Dokumentationscheck im neuesten HANDOFF lesen; keine zusätzliche
lokale Browser-/Runtime-Runde für reine Ergebnisdokumente. Vor dem nächsten Paket
gemeinsam sichten, spätere Serienfreigabe mit Datum/Revision/Dateien/Actions-Schalter
gesondert vorbereiten. Keine Aktivierung, neue Designrunde, Phase 5 oder EP-01.

## Vorheriger Stand – Veröffentlichung am 04.11.2026 vorbereitet

Auf „Mach weiter“ den genauen nächsten Sicherungs-/Commit-/Push-/Pages-Umfang
vorbereitet, noch nicht ausgeführt oder freigegeben. [Konkrete Vorlage](gallery-publication-preparation.md)
mit sieben benannten Arbeitsdateien, neuem Archivpfad, einem zusätzlichen lokalen
Commit und regulärem Push samt den beiden vorhandenen lokalen Commits. Gegenüber
Remote insgesamt 19 Dateidifferenzen, einschließlich der bisherigen lokalen Tests
und Berichte. PRD-Backup bleibt zusätzlich unversioniert/bytegleich und ausgeschlossen.

Remote-main frisch `a66d0b4`, lokal main weiter `02f9d6f`, zwei lokale Commits voraus.
Repository öffentlich/main Standardbranch, Pages per Workflow, Umgebung erlaubt main;
PAGES_DEPLOYMENT_ENABLED=true, EVOLVERA_AUTOMATION_ENABLED nicht gesetzt. Nur gelesen,
keine externen Einstellungen geändert. Vor Ausführung erneut abgleichen; bei
abweichendem Remote/Gates stoppen, keine blinde Integration oder Historienumschreibung.

Push würde beide bestehenden Workflows auslösen und bei erfolgreichen Prüfungen
die Vorschau veröffentlichen. Generierungsschritt bei unveränderten Gates übersprungen;
dateibasierte Seriengates bleiben ebenso geschlossen, traceable/5 und Archiv leer.
Kein Worker-Upload oder echter Modus-/Login-/Sitzungszugriff vorgesehen. Nachkontrolle
mit tatsächlichen Lauf-IDs, Artefaktvergleich und anonymer 320/1440px-Stichprobe
separat im Freigabeumfang; kein neuer Erfolg vor Ausführung behauptet.

CSS/Regressionstest unverändert zum bereits geprüften Korrekturstand. Für die reinen
Vorbereitungstexte Publikationsprüfung und Gesamtcheck isoliert mit 166 Tests bestanden;
22 Builddateien bytegleich zum browsergeprüften Korrekturstand. Reiner Ergebnisnachtrag
danach gezielt geprüft; Details im neuesten HANDOFF. Keine pauschale neue Browser-/
Runtime-/Kunst-/Geräte-/Cookie-Runde.
Sieben lokale Arbeitsdateien uncommittiert erhalten, beide bisherigen Archive unverändert.
Noch kein neuer Sicherungs-/Commit-/Push-/Deployauftrag, kein Startdatum, Phase 5 oder EP-01.

## Vorheriger Stand – L-01 am 04.11.2026 lokal korrigiert

Auf separat freigegebenen lokalen Korrekturauftrag reserviert main während eines
direkten Ladestatus nun mindestens `100svh`. Routenmodul und Archivdaten laden so,
dass der Footer beim Kaltstart nicht zunächst im ersten Sichtbereich erscheint.
Geladene Ansichten behalten die bisherigen Regeln. Nur vier CSS-Zeilen in shell.css;
kein App.tsx-/index.html-/Font-/Renderer-/Generator-/Worker-/Konfigurationswechsel.
Ausprobierter Fontpreload wegen langsamerer erster Ansicht nicht übernommen.

Neuer gezielter Browsertest unter `tests/browser/loading-stability.spec.ts`:
neun Ansichts-/Breitenkombinationen, zwei separat blockierte Ladephasen pro Fall.
Erkennt den ursprünglichen Fehler im isolierten Vorher-Build; beide Projektfälle
mit Korrektur bestanden. Neun abschließende Kaltstartmessungen: CLS Heute
`0,00140`, Galerie `0,02108`, bewegtes Werk `0,00018`, zuvor `0,10348 / 0,12316 /
0,10648`. Kleine Restverschiebungen bleiben dokumentiert; keine tatsächliche Feld-/
GPU-/INP-Abnahme. [Vergleich und Grenzen](pre-series-acceptance.md#lokale-korrektur-l-01--04112026).
Abschließend Gesamtcheck mit 166 Tests und reguläre Browserprüfung mit 70 bestandenen
Fällen/sechs bewussten Skips erfolgreich; sechs Kunstreferenzen unverändert.
Reinen Ergebnisnachtrag anschließend gezielt geprüft; Details im neuesten HANDOFF.

Sechs lokale Arbeitsdateien uncommittiert erhalten: vier bisherige Statusdokumente,
shell.css und neuer Browsertest. PRD-Backup zusätzlich unversioniert/bytegleich;
beide Archive unverändert, neue Updates darin nicht enthalten. HEAD/main `02f9d6f`,
gespeichertes origin/main `a66d0b4`, zwei lokale Commits voraus. Vor dem nächsten
Paket gemeinsam sichten; danach genauen Sicherungs-/Commit-/Push-/Pages-Umfang
separat vorbereiten. Keine solche Freigabe aus dem Korrekturauftrag ableiten.
Generierung false, Startdatum null, traceable/5, Serienfreigabe false, Archiv leer.
Keine neue Einrichtung, Modusrunde, Veröffentlichung, Designrunde, Phase 5 oder EP-01.

## Vorheriger Stand – gezielte Restabnahme am 04.11.2026

Nach separater Freigabe das lokale Prüf-/Berichtspaket ausgeführt. Zugänglichkeit
auf 15 Seiten-/Breitenkombinationen plus zwei Mobilmenüs im beschriebenen Umfang
ohne bestätigten Fehler; Autorisierung anhand vorhandener Tests PRD 9.5/A-19/A-21/
A-25 zugeordnet. Drei Kaltstarts je Leistungsszenario und je ein zusätzlicher
Diagnoselauf ausschließlich gegen den isolierten lokalen Build. Bedingungen und
dauerhafte Ergebnisse im [Abnahmebericht](pre-series-acceptance.md#gezielte-lokale-restabnahme-am-04112026).

**Offener Befund L-01:** CLS 0,10348–0,12316 bei 390 × 844 Pixeln, 150 ms Latenz,
1,6 Mbit/s Download und CPU-Faktor 4. Größter beobachteter Sprung am Footer während
des Nachladens, kleinere an Wortmarke/Überschrift/gallery-tools. Ladeplatzhalter,
Platzreservierung und Schriftwechsel sind konkrete Ansatzpunkte. Kein Produktfix
beauftragt oder umgesetzt. Nächster Schritt: begrenzten Vorschlag in App.tsx,
shell.css und einem gezielten verzögerten Lade-Browsertest gemeinsam sichten.
Keine neue Designrunde oder Phase 5.

HEAD/main weiter `02f9d6f`, gespeichertes origin/main `a66d0b4`, main zwei lokale
Commits voraus. Ausschließlich die vier vorhandenen Dokumentupdates um Ergebnisse
ergänzt; uncommittiert erhalten. Prüfstand nach Dokumentation im neuesten HANDOFF.
Keine neue vollständige Browser-/Runtime-/Drei-Engine-Suite, kein echter Login oder
Moduswechsel, keine Remote-/Variablenprüfung. Vorhandene Betreiber-/Kunst-/Geräte-
nachweise erhalten. Die lokalen Messungen sind keine vollständige WCAG-/Sitzungs-/
GPU-/Feldabnahme. Bestehende Sicherungen und PRD-Backup unverändert.

Weiter traceable/5, Generierung false, Startdatum null, Serienfreigabe false, Archiv
leer. Kein neuer Commit, Fetch/Merge, Push, Deployment oder Serienstart.

## Vorheriger Stand – lokale Integration am 04.11.2026 abgeschlossen

Lokales HEAD/main `02f9d6f6595d7ed0d783c32eb865f3c4758e889a`, Eltern
`2ffb420` (exakt 17 zuvor uncommittierte Dateien) und `a66d0b4` (Remote-Modusrunde).
Gespeichertes origin/main `a66d0b4`, main zwei lokale Commits voraus, kein Push.
Die zwei Remotecommits ändern ausschließlich Modus/Revision; sie sind integriert.
Lokal **traceable/5**, Generierung false, Startdatum null, Serienfreigabe false,
offizielles Archiv leer. Revision 5 nicht auf 3 zurücksetzen. Letzter frischer
Remoteabgleich vor dem Merge bestätigte `a66d0b4`; für die folgenden Dokumentupdates
kein neuer Cloud-/Variablenabgleich. Gespeicherte Refs sind kein aktueller Livebefund.

Sicherung, vollständige Commit-/Baumnachweise und Prüfsummen im
[neuesten HANDOFF](HANDOFF.md). Neue Sicherung
`2026-11-04-pre-integration-d844e3f.tar.gz`: 17 Dateien plus Manifest byteweise geprüft,
SHA-256 `7acadd0aa8c38e3919a28991b72053114d4b70154a844d2c1d49ccdaa46ff281`.
Alte Sicherung erhalten. Alle 17 Dateien im Sicherungs-/Mergecommit bytegleich;
PRD-Backup weiterhin zusätzlich unversioniert und bytegleich. Beide Sicherungsarchive
enthalten nicht die vier anschließenden Dokumentupdates.

Integrationskandidat: Publikationsprüfung, Gesamtcheck mit 166 Tests, Datenprüfung,
Build, deaktivierter Worker-Dry-Run und lokaler workerd-/SQLite-Test erfolgreich.
Browser am gebauten Kandidaten: 68 bestanden, sechs bewusste Skips, Kunstreferenzen
unverändert. Finaler Git-Baum exakt wie geprüft. Keine neue Remote-CI/Pages-Runde
für diese lokalen Commits. Ergebnis des anschließenden reinen Dokumentationschecks
im neuesten HANDOFF; dafür kein neuer Browser-/Runtime-Lauf.

Aktuell freigegeben ist ausschließlich der Dokumentationsabschluss in HANDOFF,
NEXT-START, Runbook und Abnahmematrix mit konkreter Restabnahmeliste und Gesamtcheck.
Diese vier Updates bleiben uncommittiert. Nächster Schritt ist die gemeinsame
[Sichtung der Restabnahmeliste](pre-series-acceptance.md#konkrete-restabnahmeliste-nach-lokaler-integration).
Noch keine technische Prüfung aus dieser Liste beauftragt, keine vollständige
Abnahme oder Risikofreigabe erteilt. Kunst-, Geräte-, Login- und Cookie-Modustests
bleiben erledigt. Bestehenden Liveworker, Secrets und Sitzungen erhalten.
Veröffentlichung und spätere Serienaktivierung jeweils separat mit genauen Dateien,
Revisionen und möglichen CI-/Pages-/Archivfolgen vorbereiten; kein neuer Commit,
Push, Deployment, Moduswechsel, Startdatum, Phase 5 oder EP-01 aus diesem Paket.

## Historische Abschlüsse und Vorbereitungen

Die folgenden Absätze dokumentieren ihre damaligen Stände. Aussagen wie „lokal
Revision 3“, „uncommittierte 17 Dateien“ oder „Integration offen“ sind durch den
aktuellen Stand oben erledigt und erteilen keinen neuen Auftrag.

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
wird mit der Galerie aus gemeinsamem Inhalt erzeugt; die Textdurchsicht und
bestehende Veröffentlichung sind dokumentiert, nicht erneut als Entwurf behandeln.
Keine Demo-Sitzung, keine Demo-Speicherung und kein lokaler Ersatz für GitHub.
Die bestehende echte Betreiberoberfläche wird über ihre eingerichtete HTTPS-Origin geöffnet.

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
traceable/5 nachgewiesen; lokal ebenfalls traceable/5, Integration in `02f9d6f` erledigt. Keine Wiederholung
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
Revision einmal ein. Erzeugung gemäß datierter Tagesgrenze (ab Werkdatum
06.11.2026 01:17 Berlin, vorher 04:00), zwei unabhängige Starttage, danach
unmittelbare Eltern. Nachholtage werden kalenderweise chronologisch erzeugt.

Erst der vollständig validierte Plan wird als ein Git-Commit vorbereitet und ohne
Force-Push archiviert. Ein paralleler reiner Moduscommit kann einmal integriert werden;
der begonnene Lauf behält dabei seinen Snapshot. Code-/Archivkonflikte stoppen.
Build und Pages-Deployment erfolgen im selben Workflow. Vor Upload und unmittelbar
vor Deployment wird der Remote-Commit erneut geprüft. Eine Änderung danach ist nicht
atomar mit GitHub Pages sperrbar; spätere Worker-Commits lösen den nächsten Lauf aus.

Lokal vorbereitete Starts: 01:17, 01:47 und 02:23 `Europe/Berlin`; best effort, keine sekundengenaue
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
  geplante offizielle Archivlauf wurde am 05.11. verspätet um 11:06 Berlin
  erfolgreich ausgeführt (42007979961); lokale/synthetische
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
