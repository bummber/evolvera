# Abnahme vor Serienstart

Stand: 04.11.2026. Auf „Bitte mach weiter“ das nach gemeinsamer Sichtung vorgeschlagene
lokale Restabnahmepaket durchgeführt. Keine neue Designrunde, Produktionsänderung,
offizielle Generierung, Aktivierung, Registrierung, echte Modusspeicherung oder
Veröffentlichung. Die fünf vorhandenen Ergebnisdokumente und das PRD-Backup erhalten.

Ausgangspunkt: HEAD/main und gespeichertes origin/main `d844e3f`, veröffentlichte
Werkbuch-Galerie, bestehender Betreiberworker und nachgewiesene Modusrunde bis
traceable/Revision 3. Vorige Veröffentlichungsnachweise stehen im
[Publikationsbericht](gallery-publication-preparation.md). In diesem Restabnahmepaket
kein neuer GitHub-Head-/Cloudflare-Verwaltungsabgleich; kein Verwaltungstoken benutzt.

Aktueller Nachtrag: Der oben beschriebene lokale Restabnahmeschritt ist vom später
separat freigegebenen echten Speichertest zu unterscheiden. Remote zuletzt `a66d0b4`,
traceable/5; lokal HEAD/main und gespeichertes origin/main weiter `d844e3f`, traceable/3.
Im reinen Übergabeschritt kein neuer Remoteabgleich und keine Integration.

## Entscheidung vor Serienstart

**Noch keine vollständige externe Phase-4-Abnahme und keine Serienfreigabe.**
Die lokalen Prüfungen wurden gezielt ergänzt. Die echte iPhone-/Safari-Prüfung
einschließlich gespeicherter Webapp wurde am 04.11. vom Betreiber ohne Auffälligkeiten
bestätigt. Auch die Firefox-Abnahme ist mit isolierten temporären Anwendungsdaten
inzwischen erfolgreich. Der Betreiber bestätigt auch echte Anmeldung und Abmelden
auf dem iPhone in Safari im Privatmodus nach Cookieprüfanleitung; nach Reload bleibt
das Speicherformular gesperrt. Inzwischen ist auch die separat freigegebene echte
Modusrunde traceable/3 → free/4 → traceable/5 unter derselben Cookieeinstellung
bestätigt: beide Moduscommits, CI-/Pages-Läufe und je 22 öffentliche Builddateien
geprüft. [Konkrete Nachweise und Grenzen](operator-cookie-check.md). Der erste geplante
offizielle Archiv-/Deploymentlauf und seine Wiederholung können erst nach einer
später gesondert beauftragten Aktivierung nachgewiesen werden.

## PRD-Abnahmematrix A-01 bis A-27

„Lokal“ umfasst isolierte Git-Repositories, synthetische Zugänge beziehungsweise
Testdaten und Browserläufe gegen den gebauten Stand. Es ist kein Beleg für einen
offiziellen Tageslauf. „Cloud“ bezeichnet ausschließlich bereits dokumentierte
reale Ergebnisse; historische Berichtsdaten bleiben erhalten.

| Kriterium                          | Vorhandener Nachweis                                                                                                                                                                    | Verbleibende Grenze                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| A-01 Projektstart                  | Node 24.21.0, bestehende Installation, Gesamtcheck/Build/Preview; frühere Installationsnachweise                                                                                        | Keine neue Installation erforderlich                                            |
| A-02 Freigabe und zwei Starttage   | `automation.test.ts`: Gates, 03:59/04:00, Gen. 2 erst am Folgetag                                                                                                                       | Offizieller Start noch aus                                                      |
| A-03 Unmittelbare Eltern           | `evolution.test.ts`, `automation.test.ts`, getrennte Beispielketten                                                                                                                     | Echte offizielle Kette erst nach Start                                          |
| A-04 Determinismus                 | Rezeptreplay, feste Snapshots, Fixtureprüfung beider Modi                                                                                                                               | Keine Neuberechnung alter Werke                                                 |
| A-05 Idempotenz                    | `automation.test.ts`: gleicher Tag und erneuter Lauf ohne Änderungen                                                                                                                    | Echter manueller Wiederholungslauf erst nach Start                              |
| A-06 Nachholung                    | Mehrere fehlende Tage, Kennzeichnung und Elternfolge lokal geprüft                                                                                                                      | Kein offizieller Ausfall absichtlich erzeugt                                    |
| A-07 Berlin/DST                    | `automation.test.ts`: Sommer-/Winterwechsel und 04:00-Termine                                                                                                                           | Zeitplan bleibt best effort                                                     |
| A-08 Neues Werk sichtbar           | `today.spec.ts`, `gallery.spec.ts`: Tageswechsel, Fokus und Nachholhinweis mit Testdaten                                                                                                | Erstes echtes Tageswerk fehlt noch                                              |
| A-09 HTML/CSS                      | Browserprüfung ohne img/svg/canvas, unveränderte Renderer                                                                                                                               | Keine Bildkunst ergänzt                                                         |
| A-10 Historische Darstellung       | Sechs unveränderte Chromium-Kunstreferenzen, gespeicherte Endparameter                                                                                                                  | Browserabweichungen nicht als pixelidentisch zugesagt                           |
| A-11 Werk-/Elternnavigation        | Galerie-/Detail-/Evolutionstests; native Safari-Stichprobe; iPhone-/Safari-Betreiberbefund ohne Auffälligkeiten                                                                         | Keine umfassende Prüfung sämtlicher Geräte                                      |
| A-12 Bewegung                      | Reduced Motion und Pause/Play im regulären Browserpaket; native Safari-Pause geprüft                                                                                                    | Kein GPU-/FPS-Profiling                                                         |
| A-13 Mobile Bedienung              | 100 reguläre und 120 zusätzliche Seiten-/Breitenkombinationen; iPhone mit Safari und gespeicherter Webapp ohne Auffälligkeiten                                                          | Kein umfassender Safe-Area-/Mehrgeräte-Prüfnachweis                             |
| A-14 Titelstabilität               | Fixtureprüfung, Titel-DNA-Tests und Reload-/Detailprüfungen                                                                                                                             | Offizielle Titel erst nach Start                                                |
| A-15 Datenfehler                   | Schema-, Archiv-, Reader- und Historientests stoppen bei Schäden                                                                                                                        | Kein reales Archiv beschädigt                                                   |
| A-16 Archivierung und Deployment   | Bestehender gemeinsamer Workflow, erfolgreiche Pages-Veröffentlichung bei übersprungener Generierung                                                                                    | Erster geplanter aktiver Archiv-/Deploylauf offen                               |
| A-17 Betriebsdokumentation         | README, aktualisiertes Runbook und dieser Start-/Fehlerablauf                                                                                                                           | Nach Aktivierung echte Lauf-IDs ergänzen                                        |
| A-18 Modi/Kunst                    | Abnahme der 40 Werke, belegte Elternbeiträge, 365 Testtage je Modus                                                                                                                     | EP-01 bleibt separater Auftrag                                                  |
| A-19 Betreiberautorisierung        | Numerische ID, Fremdidentität und fehlende Sitzung lokal abgewiesen; eigener echter Login dokumentiert                                                                                  | Kein zusätzliches echtes Fremdkonto geprüft                                     |
| A-20 Gespeicherter Modus/Snapshot  | Echte Modusrunde; lokale Tests für Snapshot trotz parallelem Moduscommit                                                                                                                | Wirkung auf ein offizielles Folgewerk erst nach Start                           |
| A-21 Fehler/Konflikte              | Stale Revision, Git-Konflikt, Commitverifikation; neuer Doppelabsende- und Zweittabtest                                                                                                 | Auslöser der früheren echten Konfliktanzeige weiterhin nicht bewiesen           |
| A-22 Ruhige Kacheln                | Galerie-/Renderer-/Wiedergabetests, sechs Referenzen unverändert                                                                                                                        | Keine Renderermigration                                                         |
| A-23 Historische Wiederherstellung | Isolierte Git-Repos: erste Originalbytes, gelöschtes Ende, kaputter Erststand, Abbruch                                                                                                  | Keine Schadensübung am echten Repository                                        |
| A-24 Kunstabnahme                  | `release.json`: 40 Werke ausdrücklich am 28.10.2026 abgenommen                                                                                                                          | Keine erneute Kunstabnahme für unveränderten Generator nötig                    |
| A-25 Zugang/Cookies/Logout         | Echte Anmeldung/Logout/Reload auf iPhone/Safari privat und freigegebene Modusrunde traceable/3 → free/4 → traceable/5 unter derselben Cookieeinstellung; beide Git-/CI-/Pages-Nachweise | Begrenzter Cloudtest bestanden; keine vollständige Sitzungs-/Negativfallabnahme |
| A-26 Projektbasis/Fehlzustände     | Reguläre Browserfälle, Chromium/Firefox/WebKit, Liveprüfung und iPhone-/Safari-Rückmeldung                                                                                              | Nachweise gelten für den jeweils geprüften Umfang                               |
| A-27 Konkurrenz/Deployfehler       | `automation.test.ts`: zwei Läufe, Codekonflikt, Moduscommit während Lauf, erneuter Build ohne Duplikat                                                                                  | Keine absichtlichen Produktionskonflikte                                        |

## Ergänzte Prüfungen und tatsächliche Ergebnisse

- **Echte Modusrunde am 04.11.2026 bestanden:** Betreiber bestätigt free/4 und
  traceable/5 im freigegebenen iPhone-/Safari-Ablauf. Beide Moduscommits ändern nur
  die Modusdatei; CI, Worker-Laufzeit-/Browsertestschritte sowie Pages-Build/Deploy
  erfolgreich. Je 22 öffentliche Dateien bytegleich zum Laufartefakt. Kein neuer
  lokaler Browser-/Runtime-Lauf für diese Ergebnisdokumentation. Die folgenden
  früheren Login-/Testaufbau-Nachweise behalten ihren damaligen Umfang.

- **Echte Cloud-Anmeldung/Logout am 04.11.2026 bestanden, Betreiberbefund:** Test auf
  dem iPhone in Safari im Privatmodus nach Anleitung durchgeführt. Anmeldung und
  Abmelden funktionieren; auch nach Reload nach Logout erscheint das Formular nicht
  wieder. Cookieeinstellung aufgrund der bestätigten Durchführung nach Anleitung,
  keine eigene Cookie-/Sitzungseinsicht. Kein neuer Modusspeichernachweis oder
  Serienfreigabe daraus abgeleitet. [Ergebnis und Ablauf](operator-cookie-check.md).
- Betreiberbestätigung vom **04.11.2026**: **„Auf iphone mit Safari getestet und als
  Webapp gespeichert. Keine Auffälligkeiten“**. Damit ist die angefragte reale
  Smartphone-Durchsicht als Betreiberbefund dokumentiert. Gerätemodell und iOS-Version
  wurden nicht angegeben; kein eigenständiger Offline- oder umfassender Safe-Area-
  Prüfnachweis daraus abgeleitet. Keine erneute Geräteprüfung wegen dieser Rückmeldung
  erforderlich. Firefox, Cloud-Cookieprüfung und Serienfreigabe bleiben unabhängig.
  Nach diesem reinen Dokumentationsnachtrag `npm run check` mit 166 Tests,
  Datenprüfung, Build und deaktiviertem Worker-Dry-Run erneut erfolgreich;
  keine zusätzliche Browser-/Runtime-Suite dafür ausgeführt.

- `npm run check:publication` und `npm run check`: erfolgreich, **166 Tests**,
  Datenprüfung, Build und deaktivierter Worker-Dry-Run. Regulär am gebauten Stand
  `CI=true npm run test:browser`: **68 bestanden**, sechs bewusste Doppelaufruf-Skips,
  alle sechs Kunstreferenzen unverändert. Gesamtcheck nach den Ergebnisdokumenten
  nochmals erfolgreich mit 166 Tests, Datenprüfung, Build und deaktiviertem Worker-
  Dry-Run. Dieser frühere Zusatzstand mit vier Fällen ist durch den vollständigen
  Sechs-Fälle-Lauf einschließlich Firefox weiter unten ergänzt.
  Anschließende reine Ergebniszeile gezielt format-/diffgeprüft; kein weiterer
  Browser-/Runtime-Lauf danach.
- `tests/operator.test.ts`: derselbe Formularstand wird einmal erfolgreich gespeichert;
  ein zweites Absenden ergibt 409, ohne zweiten PUT. Reload zeigt die bereits
  gespeicherte Revision. Das reproduziert eine mögliche Erklärung der früheren
  Konfliktanzeige, **beweist deren damaligen Auslöser aber nicht**.
- `tests/runtime/worker.ts` / `worker:test-runtime`: echte workerd-/SQLite-Objekte
  bleiben getrennt, ein Widerruf betrifft kein anderes Objekt, Lesen verlängert die
  absolute Ablaufzeit nicht, abgelaufener Login ist nicht konsumierbar und eine
  abgelaufene Sitzung nicht lesbar. Erfolgreich. Der erste neue Ablauf-Test überschritt
  den alten 500-ms-Abruf-Timeout des Testhelfers; nach Anpassung auf fünf Sekunden
  erfolgreich. Die produktive Ablaufdauer und Implementierung sind unverändert.
- `tests/browser/operator-forms.spec.ts`: echter lokaler HTTPS-Socket mit zwei
  lokalen Origins, synthetischem Anbieter, PKCE-Verifikation und Original-Workerlogik.
  Login-Cookie wird beim Callback entfernt, sichere HttpOnly-Sitzung entsteht,
  Logout widerruft sie. Alter Zweittab zeigt Konflikt ohne weiteres Schreiben;
  Reload zeigt die gespeicherte Revision. Ein synthetisch serverseitig abgelaufener
  Datensatz erlaubt auch mit noch vorhandenem Browsercookie kein Speichern.
- `playwright.acceptance.config.ts`, `tests/acceptance/prestart.spec.ts`:
  opt-in `npm run test:acceptance`, eigener Preview auf Port 4174, reguläre
  Chromium-/Referenzsuite unverändert. Fünf Breiten, acht Routen inklusive beider
  Werkmodi, Tastatur, Linkziel, keine Fremdabrufe/Schreibzugriffe/Cookies/Seitenfehler,
  keine img/svg/canvas-Knoten oder horizontaler Dokumentüberlauf.
- Zunächst Chromium mit `--test-third-party-cookie-phaseout` und WebKit: **vier Fälle
  bestanden**, davon 80 Seiten-/Breitenkombinationen und je ein synthetischer
  Login-/Formularlauf. macOS-WebKit verwendet für Links Option-Tab; es wurde keine
  Benutzereinstellung geändert. Dieser Test ist kein vollständiges WCAG-Audit.
- Firefox 157.0 / Playwright-Build 1555: Erster Start scheiterte vor Seitenaufruf mit
  `Could not find profile folder`, auch unabhängig vom Projekt mit nachweislich
  vorhandenem leerem Profil unter `/private/tmp`. Nicht als bestanden/übersprungen
  gewertet. Dieser historische Befund ist durch die unten beschriebene isolierte
  Anwendungsdatenablage behoben. Keine Sicherheitsfunktion deaktiviert oder
  persönliches Profil benutzt.
- Passende Firefox-/WebKit-Binaries aus offizieller Playwright-Quelle ergänzt,
  vorhandene Browser mit `--no-remove` erhalten. Kein Paketupgrade, Lockfile unverändert.
- Nativer Safari auf diesem Mac: öffentliche Startseite, Einstellungen mit echter
  Linkadresse und deaktivierter Generierung, Werk 20 beider Modi, Herkunftsnavigation,
  Animationspause sowie Datenschutz sichtbar geprüft. Eigener Prüftab danach geschlossen.
  Desktop-Stichprobe, kein iPhone-/Safe-Area-Test und kein Betreiber-Login.

Zwischenfehler des neuen Testaufbaus wurden eingegrenzt: Die ursprüngliche
Konfigurationsvererbung startete zusätzlich den bereits vorhandenen Preview-Port;
die neue Suite überschreibt ihn jetzt vollständig. Der erste synthetische Loginlauf
fing eine Autorisierungsweiterleitung nicht ab und erreichte GitHub mit erfundenem
Client/State/PKCE; keine echten Zugangsdaten, Sitzung oder Schreibvorgang beteiligt.
Der Adapter ersetzt diese Weiterleitung jetzt **vor** der Browserantwort durch die
lokale Anbieter-Origin. Mehrere Set-Cookie-Header werden separat übertragen statt
zusammengefaltet. Abschließende Läufe prüfen ausdrücklich null Fremdabrufe.
Diese Korrekturen betreffen ausschließlich die Testumgebung, nicht den Liveworker.

## Firefox-Startproblem – isoliert behoben

Am 04.11.2026 mit macOS 27.0.1/arm64, Playwright 1.64.1 und gepinntem Firefox
157.0 (Build 1555) geprüft. Das Fehlerbild passt zum dokumentierten
[Playwright-Issue #42768](https://github.com/microsoft/playwright/issues/42768)
und [Mozilla-Bug 2060476](https://bugzilla.mozilla.org/show_bug.cgi?id=2060476):
Das separate Testprofil isoliert nicht automatisch den Anwendungsdatenpfad.
Eine vollständige lokale OS-Ursachenanalyse oder Durchsicht persönlicher Daten
wurde nicht durchgeführt. Der Browser startet mit neuer leerer App-Datenablage;
der funktionierende Vergleich ist direkt nachgewiesen.

`tests/fixtures/browser.ts` setzt `MOZ_APP_DATA` ausschließlich für den Firefox-
Testprozess auf macOS auf ein mit mkdtemp neu erzeugtes Verzeichnis. Nach Browserende
wird dieses eigene Verzeichnis entfernt. HOME bleibt erhalten, keine TCC-/Datei-
rechte oder Sicherheitsfunktionen verändert, keine privaten Profile gelesen oder
umbenannt, kein Browser-/Paketupgrade. Chromium und WebKit behalten ihre bisherigen
Launchoptionen. Beide betreffenden Testdateien verwenden dieselbe Fixture.

Vollständiger Lauf **CI=true npm run test:acceptance: sechs bestanden** in 1,4 Minuten:
40 Seiten-/Breitenkombinationen je Engine und je ein synthetischer Top-Level-
Login-/Formularlauf. Kein Skip oder gelockerte Assertion für Firefox. Die zuvor
fehlgeschlagenen Versuche bleiben oben als historische Zwischenstände erkennbar.

Danach Publikationsprüfung und `npm run check` mit **166 Tests**, Datenprüfung,
Build und deaktiviertem Worker-Dry-Run erfolgreich. Gemeinsame Fixture zusätzlich
in den beiden regulären Chromium-Formularfällen geprüft. Die vollständige reguläre
68er-Suite und sechs Kunstreferenzen sind der vorige Nachweis, kein erneuter
Voll-/Runtime-Lauf für diese reine Testumgebungsänderung behauptet.
Temporäre Firefox-Anwendungsdaten nach Suiteende vollständig bereinigt
(null verbleibende Testverzeichnisse). 22 Builddateien bytegleich zum bereits
veröffentlichten Produktstand, Revision 3 und sämtliche Seriengates unverändert.
Echte Cloud-Cookieprüfung für Anmeldung/Logout inzwischen durch den Betreiber
bestätigt; Modusspeicherung bleibt separat. Ergebnis in `operator-cookie-check.md`.

## Gemeinsame/externe Prüfungen – aktueller Status

1. **Echtes Smartphone – erledigt als Betreiberprüfung:** iPhone mit Safari geprüft
   und als Webapp gespeichert, Rückmeldung am 04.11.2026 ohne Auffälligkeiten.
   Die zuvor angefragte Durchsicht betraf Menü/Footer, Testgalerie, Werkansicht,
   Pause und Herkunft. Kein gesonderter Betreiber-Login oder Modusspeichervorgang
   in dieser Rückmeldung bestätigt; die Cloud-Cookieprüfung bleibt eigener Punkt.
2. **Firefox – lokal erfolgreich:** Beide vorgesehenen Abnahmefälle auf diesem Mac
   mit gepinntem Firefox 157.0 und temporären Anwendungsdaten bestanden; dieselben
   Assertions beibehalten. Keine normale Firefox-Installation oder neuen Rechte nötig.
3. **Echte Cloud-Cookieprüfung – begrenzter Test bestanden:** Betreiber bestätigt
   Anmeldung/Logout/Reload im privaten iPhone-Safari nach Anleitung. Danach zwei
   Speicherwechsel separat freigegeben und durchgeführt: traceable/3 → free/4 →
   traceable/5. Beide Git-Commits und CI-/Pages-Läufe erfolgreich, jeweils 22 öffentliche
   Builddateien bytegleich zum Laufartefakt. Keine eigene Einsicht in Cookies, Codes
   oder Tokens. Frühere Konfliktursache und umfassende Sitzungsabnahme bleiben offen;
   keine erneuten Speicherwechsel aus dieser erledigten Freigabe ableiten.
   [Bestätigtes Ergebnis und Ablauf](operator-cookie-check.md).

Vollständige WCAG-, Sitzungs-/Negativfall- und Performanceabnahme bleiben als Grenzen
ausgewiesen. Keine neue Designrunde oder pauschale Sicherheitsumstellung daraus ableiten.
Fehlende Logs sind eine bewusste Datenschutzentscheidung; keine Observability aktivieren.

## Vorbereiteter späterer Start – keine Aktivierung durchgeführt

1. Restabnahme gemeinsam sichten und offene Befunde schließen. Frischen Remote-Head,
   vollständige Historie, gespeicherte Modusrevision, Freigaben und Repositoryvariablen
   lesend prüfen. Kein unbesehenes Übernehmen alter Konfiguration.
2. Betreiber bestimmt ausdrücklich ein **zukünftiges Berliner Startdatum**. Ein Datum
   in der Vergangenheit würde Nachholung auslösen und darf nicht still gewählt werden.
   Die zwei unabhängigen Ursprungswerke entstehen an zwei verschiedenen Serientagen.
3. Konkreten Kandidaten für genau `config/generation.json` und `config/release.json`
   vorlegen: Startdatum setzen, Generierung true, Serienfreigabe true, traceable erhalten.
   Den neuen Einstellungssnapshot mit nächster Revision aus dem dann aktuellen Stand
   ableiten; zuletzt Remote-Revision 5, lokal noch Revision 3. Vorher bewusst abgleichen,
   keinen Rückschritt auf Revision 3 schreiben. Kunstabnahme/Digests erhalten.
4. Kandidaten isoliert mit synthetischen Repositories und festem Testzeitpunkt prüfen:
   vor 04:00 kein vorgezogenes Werk, erster/zweiter Tag unabhängig, erneuter Lauf
   unverändert, Snapshot und Originalbytes erhalten. Vorgeschriebene Checks und
   genaue Dateiauswahl abschließen; erst dann ausdrücklich Commit/Push/Aktivierung
   samt möglicher Archivierung und Veröffentlichung freigeben lassen.
5. Nur nach dieser gesonderten Freigabe ausführen. Pages bleibt eingerichtet;
   `EVOLVERA_AUTOMATION_ENABLED=true` ist ein zusätzlicher externer Schalter und
   Bestandteil der vorzulegenden Freigabe. Der Betreiberworker kann diese Gates
   weder ändern noch starten. Kein Worker-Upload oder neuer Token für die Serie nötig.
6. Ersten geplanten GitHub-Lauf ab 04:00 Europe/Berlin beobachten, Commit/Lauf-ID,
   Werkdatum, Snapshot/Revision, Archiv und Pages festhalten. 04:17/05:13 sind
   Nachholversuche, keine Pünktlichkeitsgarantie. Danach einmalige gesondert
   freigegebene Wiederholung ohne Duplikat und später die Wirkung eines freigegebenen
   Moduswechsels auf ein noch nicht begonnenes Folgewerk nachweisen.

## Startabbruch, Fehler und Wiederanlauf

- Vor Aktivierung bei offenem Gate, abweichendem Remote oder unsicherer Historie
  stoppen; Datum/Generierung nicht setzen, keine offiziellen Testwerke erzeugen.
- Bei Produktionsstörung zunächst Lauf-/Git-/Pages-Zustand lesen. Falls nötig als
  konkreten Betreiberauftrag zuerst Automatisierung abschalten und neue Generierung
  deaktivieren; keinen weiteren Archivlauf als Diagnose starten. Bereits begonnene
  Läufe behalten ihren Snapshot, ein ausgeschalteter Schalter bricht sie nicht rückwirkend ab.
- Archiv schon geschrieben, Deployment fehlgeschlagen: validierten selben Stand
  erneut bauen/veröffentlichen, nicht neu auswürfeln. Letzte funktionierende Website
  erhalten; Wiederveröffentlichung passend beauftragen lassen.
- Historische Schäden: erste nachweisbar intakte Originalbytes aus vollständigem
  Git wiederherstellen. Ist die kanonische Quelle unsicher, stoppen. Kein Reset,
  Force-Push, manuelles Reparieren von Enddaten oder neuer Seed.
- Moduskonflikt: frisch laden und gespeicherte Revision prüfen; ein Fehler kann
  nach einem bereits wirksamen Commit auftreten. Nicht blind erneut speichern.

## Quellen für den ergänzten Testaufbau

- [Playwright-Browser und Abgrenzung zu Safari/Firefox](https://playwright.dev/docs/browsers)
- [Chromium-Testflag für eingeschränkte Drittanbieter-Cookies](https://www.chromium.org/Home/chromium-privacy/privacy-sandbox/third-party-cookie-phaseout/)
- [Apple: Tastaturnavigation mit Option-Tab](https://support.apple.com/de-de/guide/safari/cpsh003/mac)
- [Cloudflare: Tests für Durable Objects](https://developers.cloudflare.com/durable-objects/examples/testing-with-durable-objects/)

Bestehende lokale Runtime-Konfiguration statt neuer Testintegration verwendet;
kein neuer Cloudflare-Vitest-Pool oder Produktionsbinding erforderlich.

Temporäre frühere erfolgreiche Abnahmeaufnahmen unter
`/private/tmp/evolvera-prestart-evidence-fax0dfz7/acceptance`; endgültige Zusatzaufnahmen
im ignorierten `test-results/acceptance`. Beide sind keine dauerhaft garantierte
Ablage. Dieser Bericht enthält den maßgeblichen Ergebnisstand. Neue und erhaltene
Arbeiten bleiben lokal uncommittiert; kein weiterer Commit/Push aus älteren Freigaben.
