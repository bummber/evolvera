# Tageswechsel auf 01:17 Berlin – lokaler Umstellungsstand

Stand: 05.11.2026. Der Betreiber hat die empfohlene Umstellung beauftragt.
Lokale Implementierung; noch kein neuer Commit, Fetch/Merge/Pull, Push oder
Deployment dieser Änderung. Keine externe Einrichtung, Secrets oder Modusänderung.

## Regel und historischer Bestand

- Ab Werkdatum **06.11.2026**: täglich ab **01:17 Europe/Berlin**;
  Nachholversuche **01:47 und 02:23**. Der 02:23-Termin kann an der
  Frühjahrsumstellung nach GitHubs DST-Regel verschoben werden; der Haupttermin
  01:17 liegt vor beiden jährlichen Zeitumstellungen.
- Vorherige Werkdaten behalten **04:00**. Generator, Schema, Vorschauketten,
  Laufplanung und öffentliche Tagesanzeige nutzen dieselbe datierte Kalenderregel.
  Werkansichten lesen ihren geplanten Termin weiterhin aus den archivierten Daten.
- Startdatum 04.11.2026, traceable/6 und alle Aktivierungsgates bleiben unverändert.
  Keine Renderer-/Kunst-/Titeländerung, Migration oder neue Kunstabnahme.
- Die Regel ändert die Fälligkeit ab dem nächsten Werkdatum. Eine bloße
  Cron-Vorverlegung ohne Anpassung der Tagesgrenze hätte kein neues Werk erzeugt.
- 01:17 ist ein Versuch außerhalb voller Stunden, kein belegter Zuverlässigkeitsgewinn.

## Frisch belegter Ausgangspunkt

Lokal HEAD/main und gespeichertes origin/main weiterhin **7e19cdf**. Remote am
05.11.2026 um 11:12 Berlin **d50f68592918cc449a4820ea665515ecc2689bbf**.
Kein Zurückschreiben des lokal älteren Archivs.

Freigegebene manuelle Nachholung **42006857612** erfolgreich: Generation 2
**„Chromaströmung im Nirgendwo“**, 05.11., traceable/6, ohne Eltern, erzeugt
10:59:59 Berlin. Exakt zwei Dateien im Archivcommit: neues Werk und Index.
167 Tests, 70 Browserfälle/sechs bestehende Skips und workerd/SQLite bestanden;
24 öffentliche Dateien bytegleich zum Artefakt 13405615855, zehn anonyme
Livekombinationen bei 320/1440 erfolgreich. Das war eine manuelle Nachholung,
kein Nachweis eines pünktlichen Schedule-Starts.

Danach echter **Schedule-Lauf 42007979961**, angelegt 05.11. um **11:06:54 Berlin**,
Build/Deploy erfolgreich, Head weiterhin d50f685. Erster tatsächlicher
zeitgesteuerter Betrieb damit verspätet belegt. Die genaue GitHub-interne
Verzögerungsursache und ein Zuverlässigkeitsgewinn um 01:17 bleiben unbelegt.

Unveränderte Originaldateien (SHA-256):

- 04.11. „Irifalter“: `d87e21262e4b1e9ebabc2647418629118cca1f13d632eebfe3d2c1a0acd25b77`
- 05.11. „Chromaströmung im Nirgendwo“: `420302a71c72d12df3271c2d102171bc6c4ee82e969821f8a3d0102096395055`

Die fünf bisherigen Ergebnisdokumente bleiben mit ihren alten Nachweisen erhalten.
HANDOFF/NEXT-START/Runbook erhalten gezielte neue Abschnitte; die übrigen beiden
bleiben unverändert. Das zusätzliche unversionierte PRD-Backup bleibt bytegleich
zum ursprünglichen PRD-Stand (SHA-256 `7277fc4a98adf388f7bdb7452e3561e60d73e2203160d9cf311d9a5c27ba4e1e`).
Das gezielt geänderte PRD enthält nun die beauftragte Zeitergänzung; das Backup
wird deshalb nicht mehr als bytegleich zur aktuellen PRD bezeichnet. Keine
automatische PRD-Formatierung und keine neue Sicherung aus diesem Auftrag.

## Prüfstand

Am isolierten Kandidaten erfolgreich ausgeführt:

- `npm run check`: **187 Tests** in 14 Dateien, Format/Lint/Typen,
  Daten-/Fixtureprüfung, Build und deaktivierter Worker-Dry-run erfolgreich.
  Beide echten Archivwerke werden validiert; 12 Vorschauen, 20 Evolutionsvorschauen
  und alle 40 abgenommenen Testwerke exakt reproduziert.
- `CI=true npm run test:browser`: **72 bestanden, sechs bestehende bewusste Skips**.
  Neuer Fall je Desktop/320px: vor 01:17 kein vorgezogenes Werk, bei Fokus ab
  01:17 Generation 3, neue Zeitangabe und historischer 04:00-Termin erhalten.
  Sechs bestehende Kunstreferenzen unverändert.
- Reiner Laufplan auf Kopien der beiden echten Werke: 05.11. mittags und
  06.11. um 01:16:59 keine neue Generation; um 01:17 genau Generation 3
  mit Eltern 04.11./05.11. Beide Originalbytes bei allen drei Plänen unverändert.
- Unitfälle für Umstellungsdatum, minutengenaue Grenze, Jahreswechsel,
  Sommer-/Winterzeit 2027 vor der jeweiligen Uhrenumstellung, strikte
  Termin-/Nachholvalidierung, unveränderte Ursprünge und idempotente Wiederholung.
- `git diff --check` erfolgreich. PRD nicht automatisch formatiert;
  PRD-Backup und lokale Archivbytes unverändert.

Erste Prüfversuche konkret abgegrenzt: neue Testdatei benötigte Node statt jsdom;
Node-Testumgebung korrigiert. Anschließend Sandbox-EPERM am tsx-IPC-Socket;
Wiederholung mit lokalen Prozessrechten. Der unveränderte relative
Worker-Ausgabepfad zeigte beim direkt unter /private/tmp liegenden Kandidaten
auf /private/.worker-build; Kandidat deshalb zwei Ebenen tiefer verschachtelt,
keine Produkt-/Worker-Konfiguration dafür geändert. Ein erster Browserstart
scheiterte vor den Fällen am Node-JSON-Import über den Generator; synthetische
Browserdaten werden nun gezielt im tsx-Teilprozess erzeugt. Die oben angegebenen
Erfolgszahlen stammen aus den abschließenden erfolgreichen Läufen.

Temporärer Kandidat ohne externe Remotes:
`/private/tmp/evolvera-schedule-candidate-20261105-feb1keex/workspace/repo`.
Er enthält einen synthetischen lokalen Ausgangscommit mit unveränderten, per
GitHub-API am Remote-Commit d50f685 gelesenen Archivbytes; keinen echten
Projektcommit. Worker-Dry-run-Ausgabe außerhalb dieses Repositories unter
`/private/tmp/evolvera-schedule-candidate-20261105-feb1keex/.worker-build`.
Kein neuer `worker:test-runtime`-Lauf, da Worker-/Sitzungscode unverändert;
Worker-Dry-run und reguläre synthetische Worker-Browserfälle sind enthalten.

Alle Tests erfolgen in isolierten temporären Git-Repositories ohne externe
Remotes; Zugänge sind synthetisch. Keine Cloud-Login-/Cookie-/Kunstabnahme,
Phase 5 oder EP-01. Workerausgaben bleiben außerhalb dist und Git.

## Exakte Dateiauswahl für eine Veröffentlichung

Die folgende Auswahl enthält **20 Dateien**, einschließlich der fünf zuvor
uncommittierten Ergebnisdokumente mit erhaltenen bisherigen Nachweisen.
Das unversionierte PRD-Backup gehört nicht dazu; beide Archivdateiänderungen
stammen bereits aus dem gesonderten Remote-Archivcommit d50f685.

```text
.github/workflows/pages.yml
docs/HANDOFF.md
docs/NEXT-START.md
docs/PRD.md
docs/architecture.md
docs/pre-series-acceptance.md
docs/runbook.md
docs/schedule-change.md
docs/series-start-preparation.md
src/app/App.tsx
src/app/ArchivePages.tsx
src/archive/reader.ts
src/art/generator/evolve.ts
src/art/generator/preview-chain.ts
src/art/schema/artwork.ts
src/automation/calendar.ts
src/series/calendar.ts
tests/browser/gallery.spec.ts
tests/reader.test.ts
tests/schedule-change.test.ts
```

## Vor Veröffentlichung

Die vorherige Freigabe galt genau einem manuellen Nachhollauf. Ein neuer
Commit/Push samt Pages-Deployment und Übernahme des neueren Remote-Archivs ist
noch gesondert konkret freizugeben. Vorher Remote und Berliner Datum frisch
prüfen, beide Originalbytes erhalten und nur Fast-forward integrieren. Konkret:
geprüften Remote-Archivcommit fetch/fast-forward übernehmen, die exakt 20
Dateien lokal committen und regulär pushen, ausgelöste CI/Pages abschließen
lassen und Live-/Artefaktbytes samt Originalwerken prüfen. Kein Force-Push,
zusätzlicher manueller Workflow, Gate-/Moduswechsel oder Worker-Upload.
Bei Veröffentlichung noch am 05.11. nach jetzigem Archivstand entsteht kein
weiteres Werk; ab 06.11. 01:17 ist Generation 3 fällig. Abweichenden neueren
Remote-Stand vor jedem Schreiben erneut sichten.
Erwarteter nächster Werktermin nach rechtzeitiger Veröffentlichung:
**06.11.2026, 01:17 Berlin**, Generation 3 mit beiden Ursprungswerken als Eltern.
Eine verspätete Veröffentlichung erzeugt nur dann bereits fällige neue Tage;
keine weiteren Workflowstarts oder Moduswechsel daraus ableiten.

## Anbieterquellen

Am 05.11.2026 gelesen:

- [GitHub Schedule: Zeitzonen, DST und Best effort](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
- [GitHub: Verzögerungen und ausgefallene geplante Starts](https://docs.github.com/en/actions/how-tos/troubleshoot-workflows#scheduled-workflows-running-at-unexpected-times)
