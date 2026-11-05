# Serienstart ausgeführt – 4. November 2026

**Die offizielle Serie ist aktiviert und das erste Werk veröffentlicht.** Der
Betreiber hat die vorgelegte vollständige 15-Dateien-Sicherung, Revision 6,
Commit/Push, Pages, tägliche Generierung und deploy:false-Wiederholung mit
**„Freigabe erteilt“** ausdrücklich freigegeben. Die unten erhaltene Vorlage war
der konkret freigegebene Umfang und ist jetzt ein historischer Vorbereitungsstand.

- Aktivierungscommit **`4406b4f0b15d4932ab778f3968c7530cfa8d27e9`**, Elterncommit `52e4342`, exakt 15 ausgewählte
  Dateien. PRD-Backup und Archivdateien nicht aufgenommen. Regulärer Fast-forward-
  Push, keine Historienumschreibung, kein Force-Push oder weiterer Moduswechsel.
- Neue Sicherung [2026-11-04-pre-series-52e4342.tar.gz](/Users/abrocker/ai_o_projects/evolvera-local-backups/2026-11-04-pre-series-52e4342.tar.gz),
  **117.215 Bytes**, 15 Dateien plus Manifest byteweise geprüft.
  SHA-256 `09b95288605248132579b58b2c32fe871ec90fc5ba7e06967a9f1212c7c66a73`.
  Beide Konfigurationen sind darin noch im gesperrten Ausgangsstand 5 enthalten.
  Alle drei älteren Archive sowie das zusätzliche unversionierte bytegleiche
  PRD-Backup erhalten. Die fünf jetzigen Ergebnisnachträge sind nicht darin enthalten.
- `EVOLVERA_AUTOMATION_ENABLED=true` gesetzt, solange die Remote-Dateigates noch
  geschlossen waren; anschließend den Aktivierungscommit gepusht. Pages bleibt
  true. Laufender Stand: **traceable/6**, Startdatum **2026-11-04**, Generierung
  **true**, `seriesAuthorized:true`. Keine andere externe Einstellung verändert.
- Erster echter Archivcommit **`7e19cdf17eeac668ab884743e81400096c310358`**, direkter Nachfolger des
  Aktivierungscommits. Genau zwei Dateien: `public/artworks/2026/2026-11-04.json`
  und `public/artworks/index.json`. Werk **„Irifalter“**, Generation **1**,
  Eltern **[]**, Modus **traceable**, Einstellungsrevision **6**,
  `scheduledFor:2026-11-04T04:00:00+01:00`,
  `generatedAt:2026-11-04T16:41:11.767Z`, `isCatchUp:false`.
  Werkdatei SHA-256 `d87e21262e4b1e9ebabc2647418629118cca1f13d632eebfe3d2c1a0acd25b77`.
  Kein synthetisches Werk übernommen und keine vorhandenen Werkbytes neu erzeugt.
- [CI 41869682779 erfolgreich](https://github.com/bummber/evolvera/actions/runs/41869682779)
  für den Aktivierungscommit;
  [Pages 41869682632 erfolgreich](https://github.com/bummber/evolvera/actions/runs/41869682632),
  Archivierung ausgeführt und der tatsächliche Archivcommit ausgecheckt/gebaut.
  Tatsächliche Protokolle: jeweils **167 Tests**, **70 Browserfälle**, **sechs
  bestehende bewusste Skips**, workerd-/SQLite-Test erfolgreich. Pages prüfte
  zusätzlich vor und nach der Archivierung. Keine neue lokale Runtime-Abnahme.
- Pages-Artefakt **13343412899**, ZIP-SHA-256
  `02c02fb6443bcb1c0661ae0230e4081d99c3e725131ef18f6b61fa4114c8d12c`. Alle **23 öffentlichen Dateien** bytegleich zum
  Artefakt, beide Archivdateien zugleich bytegleich zum echten Git-Stand.
  Anonyme Liveprüfung **zwölf Kombinationen bei 320/1440 Pixeln**: Heute, Galerie,
  Werkdetail, Evolution, Einstellungen und Über-Status korrekt; kein Überlauf,
  keine Bild-/SVG-/Canvas-Kunst, Fremdabrufe, Schreibrequests, Cookies oder
  Seitenfehler. Öffentliche Desktop-Erstwerkansicht visuell gesichtet.
- Genau ein [manueller Wiederholungslauf 41870657793](https://github.com/bummber/evolvera/actions/runs/41870657793) mit
  **deploy:false** erfolgreich: Generierungsschritt ausgeführt, **null neue Werke,
  null Archivcommits**, Head und Originalbytes unverändert; Deployment bewusst
  übersprungen. Wiederum 167 Tests, 70 Browserfälle/sechs bestehende Skips und
  workerd-/SQLite erfolgreich. Wiederholungsartefakt **13343838314**
  in sämtlichen **23 Builddateien bytegleich** zum ersten Artefakt; alle 23
  öffentlichen Dateien anschließend weiterhin bytegleich. Keine zweite Veröffentlichung.
- Den exakt geprüften Zwei-Dateien-Archivcommit anschließend nach frischem
  Head-/Byteabgleich lokal gefetcht und ausschließlich **per Fast-forward**
  übernommen; kein zusätzlicher lokaler Commit. **HEAD/main und origin/main
  `7e19cdf17eeac668ab884743e81400096c310358`**. Alle übrigen vorhandenen Datei-/Fixturebytes erhalten.

Die nächste fällige Generation ist das zweite, unabhängige Ursprungswerk für
**05.11.2026 ab 04:00 Uhr Europe/Berlin**. Dieser künftige geplante Lauf wurde
noch nicht ausgeführt oder als erfolgreich behauptet. Erst ab Generation 3 werden
Eltern verwendet. GitHub Actions bleibt best effort, ohne exakte Zeitgarantie.
Kein automatischer zusätzlicher Chat-/Überwachungsauftrag.

Worker, Secrets, SQLite-Sitzungen und bestehende Betreiberanmeldung administrativ
unverändert; keine Cookie-/Token-/Logeinsicht am Liveworker, keine neue Modusrunde,
Kunstabnahme oder Designrunde. Bekannte Restgrenzen (kleine Schriftverschiebungen,
keine vollständige WCAG-/GPU-/Feld-/Sitzungsabnahme, frühere ungeklärte
Konfliktursache) bleiben dokumentiert und sind durch die konkrete Serienfreigabe
nicht zu umfassenden Zertifizierungen geworden. Kein Start von Phase 5 oder EP-01.

Genau fünf Ergebnis-/Startdokumente bleiben anschließend uncommittiert: dieser
Bericht, HANDOFF, NEXT-START, pre-series-acceptance und Runbook. Kein zusätzlicher
Ergebniscommit oder Push aus dem bereits erledigten Umfang. PRD-Backup weiterhin
zusätzlich unversioniert/bytegleich. Abschließender Gesamtcheck der fünf Ergebnis-
und Startdokumente im isolierten Klon des echten Archivcommits erfolgreich:
`npm run check`, **167 Tests**, Format/Lint/Typen, Daten-/Fixtureprüfung, Build und
deaktivierter Worker-Dry-Run. Sämtliche **23 Builddateien bytegleich zum
veröffentlichten Artefakt** und Wiederholungsbuild. Keine zusätzliche lokale
Browser-/Runtime-Suite für reine Ergebnisdokumente. Endabgleich um **17:53:45 MEZ**
rein lesend: beide lokalen und tatsächlicher Remote-Head 7e19cdf, aktive Gates,
traceable/6 und genau ein Werk unverändert. Alle vier Sicherungsarchive per
SHA-256 und das PRD-Backup auf Bytegleichheit bestätigt. Diesen abschließenden
Ergebnisnachtrag anschließend gezielt format-/diffgeprüft; kein weiterer
Gesamt-/Browser-/Runtime-Lauf nach dem Nachtrag behauptet.

Temporäre technische Belege unter
`/private/tmp/evolvera-series-start-20261104-6o5ge959` sind keine dauerhafte Ablage;
dieser Bericht, die benannten Git-Commits, Sicherungen und Actions-Läufe tragen
den maßgeblichen Nachweis. Frühere Vorbereitung und isolierte Tests bleiben unten
als historische Nachweise erhalten.

## Historische Serienstart-Vorlage – 4. November 2026

Stand: 04.11.2026. **Vorbereitet, nicht aktiviert oder veröffentlicht.** Auf die
Rückfrage nach dem Datum für den isolierten Prüfkandidaten antwortete der Betreiber
„heute“. Gemeint ist **2026-11-04, Europe/Berlin**. Diese Datumsauswahl ist noch
keine Aktivierungs-, Commit-, Push- oder Veröffentlichungsfreigabe.

## Tatsächlicher Ausgangspunkt

HEAD/main und zuletzt lesend bestätigtes Remote-main:
`52e43423d8ccfa40ff07e55bd10c0318eb609d3b`. Im echten Projekt weiter traceable/5,
`generationEnabled:false`, `seriesStartDate:null`, `seriesAuthorized:false`,
offizielles Archiv leer. Pages-Schalter true, `EVOLVERA_AUTOMATION_ENABLED` nicht
gesetzt. Erneuter ausschließlich lesender Remote-/Datei-/Variablenabgleich am
04.11.2026 um 17:26:56 MEZ bestätigt genau diesen Stand. Kein weiterer echter Commit, Fetch/Merge, Push, Workflowstart,
Variablenwechsel, Deployment oder Moduswechsel in diesem Vorbereitungspaket.

Die fünf uncommittierten Ergebnisdokumente der Veröffentlichung sind erhalten;
die neuen Übergabeabschnitte stehen vor den bisherigen Nachweisen. Die 17 früheren
Arbeitsdateien sind bereits gesichert/in Git integriert und veröffentlicht.
Alle drei bestehenden Sicherungsarchive bleiben erhalten. Das zusätzliche
`docs/PRD_v1.1_backup.md` bleibt unversioniert und bytegleich zu `docs/PRD.md`;
beide PRD-Dateien werden nicht formatiert oder aufgenommen.

## Geprüfte Korrekturen vor einem Start

Der isolierte Kandidat enthält aktive Revision 6 und genau ein synthetisches
Ursprungswerk. Dabei wurden konkrete Startblocker gefunden und lokal korrigiert:

- Kanonische, vom Tageslauf geschriebene Werk-JSON-Dateien erfüllen die allgemeine
  Prettier-Formatierung nicht. Der Workflow hätte nach dem Archivcommit im
  Gesamtcheck abgebrochen. `.prettierignore` nimmt ausschließlich
  `public/artworks/**/*.json` von Formatierung aus. Strikte Datenvalidierung,
  Historien-/Elternprüfung und Rezeptreplay bleiben bestehen. Keine Werkbytes
  wurden umformatiert. Ein neuer Regressionstest prüft unveränderte kanonische
  Bytes sowie eine absichtlich falsch formatierte sonstige JSON-Datei als
  Negativkontrolle; deren Formatprüfung muss weiterhin fehlschlagen.
- Zwei Browsertests setzten ein dauerhaft leeres echtes Archiv voraus. Ihre
  Leerzustände bekommen nun ausdrücklich einen leeren Index als Testantwort.
  Die bestehenden Layout-/Leerzustandsprüfungen bleiben bestehen.
- Heute, Über-Seite und Testwerkhinweise enthielten festgeschriebene Aussagen über
  einen noch nicht erfolgten Start. Diese Texte folgen jetzt der Konfiguration.
  Aktiviert, aber noch ohne Veröffentlichung wird als wartender Erstlauf erklärt;
  eine deaktivierte Konfiguration mit gesetztem Datum als pausiert. Die
  Statusprüfungen in Heute/Einstellungen/Über unterscheiden die Zustände. Keine
  neue Designrunde, kein Eingriff in Renderer, Kunst, Generator oder Worker.

Die sieben Korrekturdateien liegen auch im echten Arbeitsverzeichnis; die echten
Konfigurations- und Archivdateien wurden dabei nicht angefasst.

## Isolierte Nachweise und Grenzen

Temporäre Prüfumgebung:
`/private/tmp/evolvera-series-prep-20261104-ojraw5iz`.
Der aktive Kandidat ist ein eigener Klon ohne Remote; seine beiden lokalen
synthetischen Commits sind keine Projektcommits. Testzugänge sind synthetisch.
Sein erstes Werk und seine Konfiguration dürfen niemals in das echte Archiv oder
als fertiger Aktivierungsstand kopiert werden.

- `npm run check` am aktiven Kandidaten mit gespeichertem synthetischem Werk:
  **167 Tests erfolgreich**, Format/Lint/Typen, Daten-/Fixtureprüfung, Build und
  deaktivierter Worker-Dry-Run erfolgreich.
- `npm run test:browser` gegen diesen gebauten Stand: **70 bestanden, sechs
  bestehende bewusste Skips**. Zuvor reproduziert: vier Fehlfälle, weil die beiden
  Leerzustandstests bei vorhandenem Werk je zweimal fehlschlugen. Nach Korrektur
  kein Skip hinzugefügt und keine Layoutbehauptung entfernt.
- Zusätzliche anonyme Prüfung von sechs Routen-/Statuskombinationen je 320/1440:
  erstes offizielles Ursprungswerk sichtbar, Generation 001, Herkunft ohne Eltern,
  Einstellungen Revision 6/Startdatum, Über-Status, getrennte Testsammlung sowie
  aktiver Leerzustand korrekt. Keine Fremdabrufe, Schreibrequests, Cookies oder
  Seitenfehler; kein Überlauf im geprüften Leerzustand. Wartende Desktopansicht und
  mobile Erstwerkansicht visuell gesichtet. Ein Paketpfadfehler des temporären
  Prüfskripts wurde vor diesem erfolgreichen Lauf korrigiert.
- Reiner Laufplan: gesperrter Ausgangsstand ohne Änderungen; aktive Konfiguration
  ohne Serienfreigabe abgewiesen; 03:59 kein vorgezogenes Werk, ab 04:00 genau ein
  Ursprungswerk für den 04.11.; Wiederholung bytegleich ohne Änderungen;
  zweites unabhängiges Ursprungswerk erst 05.11. ab 04:00; erstes Werk unverändert;
  Snapshot bleibt trotz veränderter Eingabe traceable/6.

Der weiterhin deaktivierte lokale Stand wurde in einem zweiten isolierten Klon
mit allen 13 Arbeitsdateien geprüft: `npm run check` mit **167 erfolgreichen Tests**
sowie die drei geänderten Browserdateien gegen diesen Build mit **zehn bestandenen
Fällen**, ohne Skips in dieser Auswahl. Kein zweiter vollständiger Browserlauf
für den deaktivierten Stand behauptet. `npm run check:publication` am aktiven
Kandidaten erfolgreich (technische Angabenprüfung, keine Rechtsprüfung). Keine neuen echten
Cookie-/Login-/Modustests oder Worker-/Sitzungsänderungen. Die vorhandenen
Kunst-/Geräte-/Cookieabnahmen werden nicht pauschal wiederholt. Keine neue
vollständige WCAG-/GPU-/Feld-/Sitzungsabnahme. Erster echter Archiv-/Pages-Lauf und
seine Idempotenz sind weiterhin erst nach ausdrücklich freigegebener Aktivierung
nachweisbar. GitHub Actions bleibt best effort, ohne exakte Zeitgarantie.

## Exakte Auswahl für eine spätere Freigabe

**13 Arbeitsdateien** sind lokal vorbereitet. Ein künftiger Aktivierungscommit
würde zusätzlich **genau zwei Konfigurationsdateien**, insgesamt **15 Dateien**,
umfassen:

```text
.prettierignore
config/generation.json
config/release.json
docs/HANDOFF.md
docs/NEXT-START.md
docs/gallery-publication-preparation.md
docs/pre-series-acceptance.md
docs/runbook.md
docs/series-start-preparation.md
src/app/App.tsx
src/app/ArchivePages.tsx
tests/automation.test.ts
tests/browser/evolution-layout.spec.ts
tests/browser/information-layout.spec.ts
tests/browser/today.spec.ts
```

Vorgeschlagene Konfigurationsdifferenz, bisher ausschließlich im isolierten Kandidaten:

| Datei                  | Feld              | Echt unverändert | Vorgeschlagener Startstand |
| ---------------------- | ----------------- | ---------------- | -------------------------- |
| config/generation.json | revision          | 5                | 6                          |
| config/generation.json | seriesStartDate   | null             | 2026-11-04                 |
| config/generation.json | generationEnabled | false            | true                       |
| config/release.json    | seriesAuthorized  | false            | true                       |

`traceable`, Zeitzone, Schemaversion und vollständige Kunstabnahme bleiben erhalten.
`EVOLVERA_AUTOMATION_ENABLED=true` wäre eine zusätzlich ausdrücklich freizugebende
GitHub-Repositoryvariable; Pages bleibt true. Keine andere externe Einstellung.
Kein Worker-Upload, keine Secrets, Sitzungs-/Cookieeinsicht oder Modusspeicherung.

Der erste echte Tageslauf erzeugt separat und ausschließlich durch den bestehenden
Workflow `public/artworks/2026/2026-11-04.json` und aktualisiert
`public/artworks/index.json`. Er erstellt seinen eigenen Archivcommit. Diese
Dateien gehören nicht zum lokalen 15-Dateien-Aktivierungscommit. Keine Übernahme
synthetischer Werkdaten. Ein idempotenter Wiederholungslauf erstellt keinen weiteren
Archivcommit und schreibt kein vorhandenes Werk um.

## Ausführung erst nach konkreter Betreiberfreigabe

1. Datum/Uhrzeit Berlin, realen lokalen und Remote-Head, Revision 5, traceable,
   alle drei geschlossenen Dateigates und leeren Index frisch lesend vergleichen.
   Erwartet wird `52e4342`; jede Abweichung zuerst sichten. Die Vorlage gilt nur
   am **04.11.2026**. Nach Mitternacht nicht ungefragt nachholen oder umdatieren.
   Ein verspäteter erster Start ab 05.11. 04:00 könnte sonst beide fälligen
   Ursprungswerke in einem Lauf erzeugen.
2. Die exakt 15 ausgewählten Dateien im ursprünglichen Zustand vor Aktivierung
   samt Manifest (Pfade, SHA-256, HEAD/Remote und Gatewerte) in einer neuen lokalen
   Sicherung archivieren. Vorgeschlagener, noch nicht angelegter Pfad:
   `/Users/abrocker/ai_o_projects/evolvera-local-backups/2026-11-04-pre-series-52e4342.tar.gz`.
   Bei vorhandenem Pfad stoppen, nichts überschreiben; Inhalt byteweise prüfen.
   Die beiden Konfigurationen enthalten dort den weiterhin gesperrten Stand 5.
3. Nur die oben ausgewiesenen zwei Konfigurationen auf Revision 6/Datum/true
   ändern. Vollständigen Index und alle übrigen Konfigurationsfelder byteweise
   gegen den erwarteten Ausgangsstand vergleichen. Exakte Auswahl prüfen,
   PRD-Backup ausschließen; einen lokalen Aktivierungscommit erstellen.
4. Externen Automatisierungsschalter auf true setzen, solange die Remote-Dateigates
   noch geschlossen sind. Direkt vor dem regulären Push Remote-Head und Berliner
   Datum erneut prüfen; kein blindes Pull, Reset, Rebase oder Force-Push.
   Push nur als Fast-forward vom erwarteten Stand. Ein parallel gespeicherter
   Modus-/Revisionsstand darf nicht überschrieben werden.
5. Ausgelöste CI- und Pages-Läufe bis zum Abschluss verfolgen. Der Pages-Lauf
   erzeugt bei heutigem Laufstart das bereits fällige erste Ursprungswerk, archiviert es per separatem
   Commit und prüft den tatsächlichen Archivstand vor dem Deployment. Datum,
   Generation 1, leere Eltern, traceable/6, Metadaten, unveränderte Testwerke,
   Archivcommit, gebauter Commit und Live-/Artefaktbytes nachweisen. Fehler nicht
   als Erfolg dokumentieren; bei Bedarf Automatisierung sicher ausschalten,
   vorhandene Archivdaten erhalten und den konkreten Fehler zuerst sichten.
6. Anschließend genau einen manuellen Wiederholungslauf mit `deploy:false`
   freigeben/starten: keine neuen Werkdateien, keine geänderten Originalbytes,
   kein weiterer Archivcommit; erfolgreichen Build und unveränderten öffentlichen
   Stand nachweisen. Das ist kein weiterer Moduswechsel. Ergebnisse und Grenzen
   dauerhaft nachtragen. Der zweite Ursprung folgt regulär am nächsten Berliner
   Tag ab 04:00, ohne vorgezogenen zweiten Start.

Eine Freigabe muss den sofortigen Erstlauf **heute**, die laufende tägliche
Automatisierung ab 04:00 Berlin, Sicherung, genaue 15-Dateien-Auswahl, Commit/Push,
CI/Pages-Veröffentlichung und den abgesicherten Wiederholungslauf ausdrücklich
umfassen. Sie akzeptiert die im Abnahmebericht benannten Restgrenzen; sie startet
keine neue Designrunde, Phase 5 oder EP-01. Bisher ist nur die Vorbereitung und
die Datumsvorlage beauftragt.
