# Titel-Lexikon 0.2.0 – Bausteinvererbung

Stand: 10.11.2026. **Umgesetzt, geprüft und veröffentlicht. Der Betreiber hat
die Titelvorschau am 10.11.2026 mit „Titel passen“ abgenommen.** Fachliche Quelle bleibt
[PRD v1.1](PRD.md), Abschnitt 7; dieses Dokument ergänzt das Verfahren aus 7.2.

## Anlass

Lexikon 0.1.0 übernimmt von jedem Elternteil die ersten zwei bis fünf Buchstaben
des ersten Titelworts. Seit „Chromaströmung im Nirgendwo“ (05.11.2026) beginnen
alle Folgetitel mit „Ch“, und die Fragmente verkümmern zu Konsonantenresten
(„Chrchschweben“, „Chrfieber“). Eine Simulation über 365 Tage ergab für 0.1.0
Serien von bis zu 36 Tagen mit gleichem Titelanfang; nur 27 % der Titel begannen
mit einem Lexikonwort.

## Regel ab Lexikon 0.2.0

1. Jeder Elternteil gibt wie bisher mit 65 % Wahrscheinlichkeit etwas weiter,
   aber einen ganzen Lexikonbaustein aus seinem Titel: einen Wortanfang
   (z. B. „Eis“) oder eine Endung (z. B. „rauschen“). Ortswörter nach „im“ sind
   nicht vererbbar.
2. Der Titel hat je einen Platz für Anfang und Endung. Der zweite Elternteil
   füllt nur einen noch freien Platz. Freie Plätze kommen aus dem Lexikon.
3. Das Hauptwort (Anfang + Endung) darf in den letzten 365 Werken nicht
   vorkommen. Eine Sperre über die gesamte Historie wäre mit 1.080 möglichen
   Hauptwörtern nach etwa drei Jahren erschöpft.

Wortlisten, Muster (`compound`, `pair`, `phrase`) und die Struktur der Titel-DNA
bleiben unverändert. Aus den bisherigen „Ch“-Titeln sind nur die Endungen
vererbbar; die „Ch“-Linie endet ohne Eingriff in ein archiviertes Werk.

## Geltung

- Ab Werkdatum **14.11.2026** (`lexiconChangeDate` in `src/series/calendar.ts`),
  nach demselben Muster wie die datierte Zeitregel. Das Datum ist vor der
  Veröffentlichung anzupassen, falls diese später erfolgt.
- Frühere Werkdaten, die beiden Vorschauketten und die 40 abgenommenen
  Testwerke bleiben bei Lexikon 0.1.0. Dessen Algorithmus ist unverändert
  erhalten; der archivierte Titel vom 06.11.2026 wird im Test reproduziert.
- Kein archiviertes Werk wird geändert, migriert oder neu erzeugt. Das
  Werkschema bleibt Version 2 und lässt beide Lexikonversionen zu.
- `config/release.json` weist weiterhin die Kunstabnahme vom 28.10.2026 für
  Lexikon 0.1.0 aus und wurde nicht geändert.

## Prüfungen

Am 10.11.2026 lokal auf dem Stand `fbc5fd4` plus Änderung ausgeführt:

- `npm run check` erfolgreich: Format, ESLint, Typprüfung, **190 Tests** in 14
  Dateien, Daten-/Fixtureprüfung (gespeicherte Vorschau-DNA und Testwerke
  unverändert), Build und Worker-Dry-Run.
- `npm run test:browser` erfolgreich: **72 bestanden, sechs bestehende Skips**.
- `npm run worker:test-runtime` erfolgreich.
- Neue Tests: Kette über 365 Titel ab den sieben echten Archivtiteln
  (deterministisch, Hauptwort eindeutig, jeder Elternbaustein ein ganzer
  Lexikonbaustein, Herkunftsregel wie `validateEvolution`), Reproduktion des
  archivierten Titels vom 06.11.2026 mit 0.1.0 und datierter Wechsel im
  Tagesplaner.
- Simulation außerhalb des Repositorys über 365 und 3.650 Tage: 100 % der
  Titel beginnen mit einem Lexikonwort; längste Serie mit gleichem Anfang fünf
  bzw. acht Tage, mit gleicher Endung sechs bzw. sieben Tage; rund 81 % der
  Titel tragen mindestens einen Elternbaustein.

Nicht geprüft: `npm run test:acceptance` (Firefox/WebKit), GitHub-CI, Pages und
der Livestand. Kein Fetch nach dem Rebase, kein Push, kein Workflowstart.

## Vorschau der Titel zur Abnahme

Erzeugt über den echten Tagesplaner (`prepareRun`) ausgehend vom Archivstand
`fbc5fd4` mit sieben Werken, ohne Schreibzugriff. Titel hängen nur von Seed,
Elterntiteln und bisherigen Titeln ab; für `traceable` und `free` ergab sich
dieselbe Liste. Die Titel für 11.–13.11. entstehen noch mit Lexikon 0.1.0. Die
Liste gilt nur, solange die Werke davor wie vorhergesagt entstehen und das
Wechseldatum bleibt.

| Werkdatum  | Gen. | Lexikon | Titel                            | Elternbausteine               |
| ---------- | ---- | ------- | -------------------------------- | ----------------------------- |
| 11.11.2026 | 8    | 0.1.0   | Chschfieber im Morgen            | Chsch←11-09                   |
| 12.11.2026 | 9    | 0.1.0   | Chwenchschstille / Traumschweben | Chwen←11-10, Chsch←11-11      |
| 13.11.2026 | 10   | 0.1.0   | Chwkante im Zwischenraum         | Chw←11-12                     |
| 14.11.2026 | 11   | 0.2.0   | Azurschweben                     | schweben←11-12                |
| 15.11.2026 | 12   | 0.2.0   | Leuchtkante                      | kante←11-13                   |
| 16.11.2026 | 13   | 0.2.0   | Schattenflimmern im Schweben     | –                             |
| 17.11.2026 | 14   | 0.2.0   | Zeitflimmern / Eismosaik         | flimmern←11-16                |
| 18.11.2026 | 15   | 0.2.0   | Eistanz                          | Eis←11-17                     |
| 19.11.2026 | 16   | 0.2.0   | Ockerschein                      | –                             |
| 20.11.2026 | 17   | 0.2.0   | Ockerschweif im Ungefähren       | Ocker←11-19                   |
| 21.11.2026 | 18   | 0.2.0   | Ockerfragment im Licht           | Ocker←11-19                   |
| 22.11.2026 | 19   | 0.2.0   | Morgenfragment                   | fragment←11-21                |
| 23.11.2026 | 20   | 0.2.0   | Lumifragment im Nebel            | fragment←11-21                |
| 24.11.2026 | 21   | 0.2.0   | Morgenfieber / Zwischenschweif   | Morgen←11-22                  |
| 25.11.2026 | 22   | 0.2.0   | Morgenkante                      | Morgen←11-24                  |
| 26.11.2026 | 23   | 0.2.0   | Wellenschein                     | –                             |
| 27.11.2026 | 24   | 0.2.0   | Morgenschein                     | Morgen←11-25, schein←11-26    |
| 28.11.2026 | 25   | 0.2.0   | Fernafieber / Sonnenschweben     | –                             |
| 29.11.2026 | 26   | 0.2.0   | Raumspur / Morgenflucht          | –                             |
| 30.11.2026 | 27   | 0.2.0   | Raumfalter                       | Raum←11-29                    |
| 01.12.2026 | 28   | 0.2.0   | Morgenbruch                      | Morgen←11-29                  |
| 02.12.2026 | 29   | 0.2.0   | Morgenfalter im Stillstand       | falter←11-30, Morgen←12-01    |
| 03.12.2026 | 30   | 0.2.0   | Lumifalter / Funkelschweben      | falter←12-02                  |
| 04.12.2026 | 31   | 0.2.0   | Zeitfalter / Veluspur            | falter←12-02                  |
| 05.12.2026 | 32   | 0.2.0   | Zeitschweben                     | schweben←12-03                |
| 06.12.2026 | 33   | 0.2.0   | Leuchtspur                       | spur←12-04                    |
| 07.12.2026 | 34   | 0.2.0   | Eiskristall / Fernabruch         | –                             |
| 08.12.2026 | 35   | 0.2.0   | Leuchtkristall                   | Leucht←12-06, kristall←12-07  |
| 09.12.2026 | 36   | 0.2.0   | Fernaschimmer                    | Ferna←12-07                   |
| 10.12.2026 | 37   | 0.2.0   | Leuchtschimmer im Nirgendwo      | Leucht←12-08, schimmer←12-09  |
| 11.12.2026 | 38   | 0.2.0   | Traumschimmer                    | schimmer←12-09                |
| 12.12.2026 | 39   | 0.2.0   | Traumklang                       | Traum←12-11                   |
| 13.12.2026 | 40   | 0.2.0   | Fernadrift im Echo               | –                             |
| 14.12.2026 | 41   | 0.2.0   | Traumdrift / Zeitweben           | Traum←12-12, drift←12-13      |
| 15.12.2026 | 42   | 0.2.0   | Traumrauschen                    | Traum←12-14                   |
| 16.12.2026 | 43   | 0.2.0   | Falterkristall / Funkelbogen     | –                             |
| 17.12.2026 | 44   | 0.2.0   | Morgenbogen / Zinnoberstille     | bogen←12-16                   |
| 18.12.2026 | 45   | 0.2.0   | Fernabogen                       | –                             |
| 19.12.2026 | 46   | 0.2.0   | Ockerstille                      | stille←12-17                  |
| 20.12.2026 | 47   | 0.2.0   | Sonnenbogen im Nirgendwo         | –                             |
| 21.12.2026 | 48   | 0.2.0   | Mirafieber                       | –                             |
| 22.12.2026 | 49   | 0.2.0   | Chromafieber                     | fieber←12-21                  |
| 23.12.2026 | 50   | 0.2.0   | Chromawirbel im Nebel            | Chroma←12-22                  |
| 24.12.2026 | 51   | 0.2.0   | Sonnenweben / Kaleidoflechten    | –                             |
| 25.12.2026 | 52   | 0.2.0   | Chromaflechten / Leuchtrauschen  | flechten←12-24                |
| 26.12.2026 | 53   | 0.2.0   | Kaleidoflechten / Fernaschein    | Kaleido←12-24, flechten←12-25 |
| 27.12.2026 | 54   | 0.2.0   | Noctirauschen / Iribogen         | rauschen←12-25                |
| 28.12.2026 | 55   | 0.2.0   | Kaleidorauschen im Nachhall      | Kaleido←12-26, rauschen←12-27 |
| 29.12.2026 | 56   | 0.2.0   | Flimmerfieber                    | –                             |
| 30.12.2026 | 57   | 0.2.0   | Flimmerrauschen                  | rauschen←12-28, Flimmer←12-29 |
| 31.12.2026 | 58   | 0.2.0   | Flimmerkante im Stillstand       | Flimmer←12-30                 |
| 01.01.2027 | 59   | 0.2.0   | Dämmerkante                      | kante←12-31                   |
| 02.01.2027 | 60   | 0.2.0   | Kaleidoflucht / Funkelschweben   | –                             |

## Veröffentlichung

Am 10.11.2026 als Teil von `4eae70074d6d42e461f8b578fbc31658f3c52bb9` regulär
gepusht (Fast-forward auf `fbc5fd4`).
[CI 42854900251](https://github.com/bummber/evolvera/actions/runs/42854900251)
und [Pages 42854899353](https://github.com/bummber/evolvera/actions/runs/42854899353)
erfolgreich. Beim Push entstand kein neues Werk. Die Live-Website wurde nicht
aufgerufen.

## Offen

- Beleg des ersten Laufs mit Lexikon 0.2.0 für Werkdatum 14.11.2026; erwartet
  ist „Azurschweben“.
- `config/release.json` bleibt vorerst unverändert (Vorschlag vom 10.11.2026,
  noch keine ausdrückliche Betreiberentscheidung): Die Datei belegt die Kunstabnahme der 40 Testwerke mit Lexikon
  0.1.0, die Titelabnahme für 0.2.0 steht in diesem Dokument.
