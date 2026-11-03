# Modusspeicherung – gespeicherter Stand und gezielt veröffentlichter CI-Testfix

Späterer lokaler Abgleich: Sicherungscommit `238cbda`, danach Remote `f793247`
konfliktfrei zusammengeführt. Lokale Modusdatei jetzt ebenfalls traceable/Revision 3;
frühere Hinweise auf lokales traceable/1 unten sind historisch.
[Aktueller lokaler Integrationsbericht](integration-preparation.md). Kein Push.

## Freigegebener Rückwechsel gespeichert – 03.11.2026

Der Betreiber hat den einmaligen Rückwechsel von free/2 auf traceable/3 samt
Moduscommit und CI-/Pages-Lauf mit **„ja“** freigegeben und anschließend selbst
gespeichert. Rückmeldung: **„Nachvollziehbare Vererbung Revision 3“**.
GitHub lesend bestätigt: [Commit `f793247`](https://github.com/bummber/evolvera/commit/f7932479a839a6176160eabe4edc675133aacafb),
03.11.2026 um **23:02:39 Uhr MEZ**, einziger Elterncommit `75f11ae`, ausschließlich
`config/generation.json` geändert. **Remote traceable/Revision 3**,
Generierung false, Startdatum null und Serienfreigabe false.

[CI](https://github.com/bummber/evolvera/actions/runs/41727228799) und
[Pages](https://github.com/bummber/evolvera/actions/runs/41727228841) für genau diesen
Commit **erfolgreich abgeschlossen**. Build/Deploy erfolgreich, Generierungsschritt
korrekt übersprungen. Ausschließlich lesend geprüft. Kein eigener Zugriff
auf Betreibersitzung oder Speichern durch den Agenten. Keine weitere Speicherung,
kein zusätzlicher Commit, Push oder Worker-Upload aus dieser Bestätigung abgeleitet.

Die Modusrunde ist damit in Git dokumentiert: traceable/1 → free/2 → traceable/3.
Die zusätzliche Konfliktanzeige des ersten Wechsels bleibt hinsichtlich ihres
genauen Auslösers ungeklärt; erfolgreiche gespeicherte Stände davon getrennt.
Umfassende Sitzungsabnahme, Ablauf, Konflikt-/Negativfälle und Safari/Firefox bleiben offen.

Öffentliche Pages-Version HTTP 200; HTML und vier initiale Assets bytegleich zum
erneut isoliert gebauten Remote-Code mit traceable/3. Offizielles Archiv weiter leer,
Remote-main und Seriengates danach erneut lesend bestätigt. Kein Werkbuch-Design
veröffentlicht und keine neue manuelle Browser-/Geräteabnahme.
Nach Statusdokumentation im aktuellen Projekt `npm run check` mit **165 Tests**,
Format/Lint/Typen, Datenprüfung, Build und deaktiviertem Worker-Dry-Run erfolgreich.
Keine erneute lokale Browser-/Runtime-Suite für die reine Dokumentationsänderung.

Lokales `main` weiterhin `5afbe7b` mit vier lokalen Commits seit `9ad1fa7` und
allen uncommittierten Arbeiten; `origin/main` bleibt ungefetchter Stand `9ad1fa7`.
Remote jetzt drei Commits seitdem (Hinwechsel, Testfix, Rückwechsel).
Lokale Modusdatei weiter traceable/1; **Remote-Revision 3 nicht zurücksetzen**.
Vor dem nächsten Arbeitspaket gemeinsam den lokalen und externen Stand sichten;
keine automatische Zusammenführung oder Designveröffentlichung. Seriengates bleiben aus.

## Gezielter Testfix freigegeben und übernommen – 03.11.2026

Der Betreiber hat die konkrete Übernahme ausschließlich von `tests/evolution.test.ts`
samt CI-/Pages-Läufen mit **„Freigabe erteilt“** beauftragt. Einmalig über die
GitHub-Contents-API ausgeführt, mit frischem Remote-Head- und Datei-SHA-Abgleich.
[Commit `75f11ae`](https://github.com/bummber/evolvera/commit/75f11aed4481a56b67ece6bdff67354053857ab6)
hat genau den Elterncommit `4f1186f8280d9db25b261a9de13dc081cd35e060` und ändert
**ausschließlich die freigegebene Testdatei**. Anschließend bytegleich zum lokal
geprüften Testfix bestätigt. Kein Commit/Push des lokalen Arbeitsstands.

`config/generation.json` ist bytegleich geblieben: **Remote free/Revision 2**,
Generierung false und Startdatum null. Keine lokale Design-, Worker- oder
Dokumentationsdatei veröffentlicht. Kein weiteres Worker-Deployment oder Modusschreiben.

[CI](https://github.com/bummber/evolvera/actions/runs/41726299381) und
[Pages](https://github.com/bummber/evolvera/actions/runs/41726299386) für genau diesen
Commit **erfolgreich abgeschlossen**. Pages-Build und Deploy erfolgreich,
Generierungsschritt korrekt übersprungen. Abschluss ausschließlich lesend geprüft.
Keinen erneuten Testfix-Commit oder Workflowstart aus der früheren Vorlage ableiten.

Öffentliche Pages-Version per GET geprüft: HTTP 200, HTML und alle vier initialen
Assets bytegleich zum isolierten Build des bisherigen Remote-Codes mit free/2 und
Testfix. Offizieller Index weiter leer. Remote-main weiterhin `75f11ae`, Modusdatei
bytegleich free/2, Serienfreigabe false und Startdatum null. Das lokale Werkbuch-Design
ist weiterhin nicht veröffentlicht. Keine neue manuelle Browser- oder Geräteabnahme.

Im aktuellen Projekt nach der Statusdokumentation `npm run check` erneut erfolgreich:
**165 Tests**, Format/Lint/Typen, Datenprüfung, Build und deaktivierter Worker-Dry-Run.
Keine neue lokale Browser-/Runtime-Suite für die reine Dokumentationsänderung;
deren vorherige Nachweise bleiben getrennt von den jetzt erfolgreichen GitHub-Läufen.

Lokales HEAD bleibt `5afbe7b`, `origin/main` ungefetchter Stand `9ad1fa7`; Remote
hat seitdem zwei zusätzliche Commits (Modus und Testfix). Alle vier lokalen Commits
und uncommittierten Arbeiten erhalten. Lokale Modusdatei weiter traceable/1.
Beide Entwicklungslinien vor späterer Veröffentlichung bewusst zusammenführen;
kein automatischer Pull, Reset, Merge oder Force-Push. Die folgenden Abschnitte
dokumentieren die vorherige Diagnose und Freigabevorbereitung.

## Ausgangslage vor dem gezielten Testfix

Stand 03.11.2026. Der Betreiber meldet „Speicherkonflikt“ und bestätigt nach
„Einstellungen neu laden“ die Anzeige **„Maximale Freiheit Revision 2“**.
Das ist kein Beleg für einen vollständig fehlgeschlagenen Speicherablauf:
der neue Modus ist bereits in GitHub angekommen. Kein weiterer Speicherauftrag
oder Rückwechsel aus dieser Rückmeldung abgeleitet.

## Ausschließlich lesend bestätigter Remote-Stand

- `main`: **`4f1186f8280d9db25b261a9de13dc081cd35e060`**, einziger Elterncommit
  `9ad1fa797210680e4348e2da5c487c2b37037960`.
- Commit „Update future inheritance mode“, 03.11.2026 um **22:45:47 Uhr MEZ**;
  ausschließlich `config/generation.json` geändert. `inheritanceMode:free`,
  Revision **2**, `generationEnabled:false`, `seriesStartDate:null`.
- Serienfreigabe weiter false, offizieller Index leer. Pages-Variable true,
  Tagesautomatisierungsvariable beim unmittelbar vorherigen Lesecheck nicht gesetzt.
- [CI-Lauf](https://github.com/bummber/evolvera/actions/runs/41724715587) fehlgeschlagen,
  [Pages-Lauf](https://github.com/bummber/evolvera/actions/runs/41724715591) ebenfalls
  im Testschritt fehlgeschlagen; **deploy übersprungen**. Kein erfolgreiches
  Pages-Update aus diesem Commit behauptet; die frühere Veröffentlichung bleibt bestehen.

Die Ursache der zusätzlichen Konfliktanzeige ist nicht abschließend nachgewiesen.
Ein zweiter Aufruf mit der alten Formularrevision ist plausibel; der Worker weist
solche veralteten Revisionen absichtlich ab. Keine echte Sitzung, Cookies, Codes
oder Request-Bodies gelesen und keine Logs dafür aktiviert. Die Bestätigung des
gespeicherten Standes ist von dieser Vermutung getrennt. Vorerst nicht erneut speichern.

## Tatsächlicher CI-Fehler und vorbereiteter Testfix

`tests/evolution.test.ts` übernimmt für einen deterministischen Snapshot-Test
`initialSettings` aus der veränderlichen Betreiberkonfiguration, erwartet danach
aber fest `traceable` und Revision 1. Mit dem gültigen neuen Stand `free`/2 schlägt
dieser Test fehl: **expected 'free' to be 'traceable'**, Zeile 164 des Remote-Stands.
Auch ein Rückwechsel auf traceable/3 würde die feste Revisionserwartung nicht lösen.
Das ist eine falsche Testabhängigkeit, kein nachgewiesener Generatorfehler.

Lokal ausschließlich diesen Test auf feste synthetische `fixtureSettings`
umgestellt. Die bisherigen Snapshot-, Mutations-, DNA- und Historienprüfungen bleiben
erhalten. Keine Produktionslogik, kein Renderer, Generator, Archiv oder tatsächliche
Moduskonfiguration geändert. Keine neue Abhängigkeit. Der Testfix ist als einzelne
Datei unabhängig von den lokalen Design-/Workeränderungen auf den Remote-Stand
anwendbar: 14 hinzugefügte und fünf entfernte Zeilen in `tests/evolution.test.ts`.

In isoliertem temporärem Git-Repository mit synthetischer Git-Identität und ohne
Remote aus lokal vorhandenem ursprünglichem Remote-Code `9ad1fa7` geprüft. Dort
`free`/2 synthetisch gesetzt, was dem gelesenen Moduscommit entspricht:

- Alter Test reproduziert exakt den CI-Fehler; nach ausschließlich dem Testfix
  **131 Tests**, Format/Lint/Typen, Datenprüfung und Build erfolgreich.
- Der abschließende Worker-Dry-Run im Gesamtcheck scheiterte zunächst am relativen
  Ausgabepfad außerhalb des temporären Repositories. Separat mit absolutem Pfad
  innerhalb des isolierten Repositories erfolgreich paketiert; keine Lintregel oder
  Produktionskonfiguration abgeschwächt. Der erste Vorbereitungsversuch brauchte
  außerdem eine Anpassung an die ältere lokale Python-tarfile-API.
- Dortiger echter lokaler workerd-/SQLite-Test und **32 Browserfälle** am gebauten
  alten Remote-Code erfolgreich. Nur synthetische Zugangsdaten, keine echten Kontozugriffe.
- Anschließend synthetisch traceable/3: erneut sämtliche **131 Tests** erfolgreich.
  Reale lokale `config/generation.json` währenddessen unverändert auf traceable/1.

Isolierte Nachweise unter `/private/tmp/evolvera-mode-ci-regression-lqo3162t`;
temporär, keine dauerhafte externe Einrichtung. Tests im aktuellen Projekt werden
getrennt dokumentiert. Im aktuellen Projekt abschließend `npm run check` mit
**165 Tests**, Format/Lint/Typen, Datenprüfung, Build und deaktiviertem Worker-Dry-Run
erfolgreich. Keine erneute aktuelle Browser-/Runtime-Suite für die reine Teständerung;
deren vorige 68 Browserfälle und Runtime-Nachweise bleiben erhalten. Diff-/Format-
und bytegleiche PRD-Backupprüfung erfolgreich.
Kein Remote-Testfix, Commit, Push, Workflow-Neustart oder
weiteres Worker-Deployment ausgeführt.

## Historischer Git-Stand und inzwischen erteilte Freigabe

Lokales `main` bleibt auf `5afbe7b`, vier lokale Commits seit `9ad1fa7`, zusätzlich
alle bisherigen uncommittierten Arbeiten. Die lokale Referenz `origin/main` ist
weiter ungefetchter Stand `9ad1fa7`; GitHub ist inzwischen einen Moduscommit weiter.
Beide Entwicklungslinien erhalten; nicht blind pullen, zurücksetzen oder force-pushen.
PRD-Backup bytegleich und unversioniert erhalten.

Vorschlag zur gesonderten Freigabe: **nur `tests/evolution.test.ts`** als gezielten
Testfix auf dem vorhandenen Remote-`main` übernehmen, mit erneutem lesendem
Stand-/Datei-SHA-Abgleich unmittelbar davor. Ein neuer Git-Commit und ausgelöste
CI-/Pages-Läufe sind dabei ausdrücklich Teil der Freigabe. Keine lokalen
Design-/Worker-/Dokumentationsdateien mit veröffentlichen. Modus bleibt dabei free/2;
Generator und Serienstart bleiben aus. Anschließend CI-/Pages-Ergebnis lesend prüfen.
Rückwechsel auf traceable mit neuer Revision separat abgrenzen, noch nicht ausführen.
