# Evolvera – EP-01: Galerie und Detailansicht für Schema 3 (P6)

Stand: 11.11.2026 · Status: umgesetzt, am 11.11.2026 vom Betreiber abgenommen (Ansichten und Texte) und veröffentlicht (`9cb062c`, CI 43108814933 und Pages 43108814953 erfolgreich)

Galerie, Heute-Ansicht, Evolution und Detailansicht stellen jetzt auch Werke
im Schema 3 dar. Es gibt weiterhin kein Werk im Schema 3 im Archiv, kein
`generatorChangeDate` und keinen Einbau von Generator 0.3.0 in den Tageslauf.
Generator 0.2.0 und 0.3.0, Titelgenerator, Renderer 1 und 2, Schema 3 und
`src/automation/plan.ts` sind unverändert.

## Aufbau

| Datei                                  | Aufgabe                                                                |
| -------------------------------------- | ---------------------------------------------------------------------- |
| `src/archive/reader.ts`                | liest mit `anyArtworkSchema`; vier neue Sammlungen; Prüfung Schema 3   |
| `src/preview/ep01.ts` (neu)            | Leser der EP-01-Sammlungen aus den gespeicherten Fixtures              |
| `src/automation/archive.ts`            | neue Funktion `readArchive` neben dem unveränderten `readWorks`        |
| `scripts/validate-data.ts`             | benutzt `readArchive`                                                  |
| `src/app/ArchivePages.tsx`             | Kacheln und Elternkarten über `ArtDispatch`; neue Abschnitte und Texte |
| `src/app/EvolutionBraid.tsx`           | Miniaturen über `ArtDispatch`                                          |
| `src/app/WorkProvenance.tsx`           | gibt Werke im Schema 3 an die neue Ansicht weiter                      |
| `src/app/WorkProvenanceV3.tsx` (neu)   | Herkunft und Mutationsbericht für Schema 3                             |
| `src/app/WorkConditions.tsx` (neu)     | Abschnitt „Rahmenbedingungen“                                          |
| `src/app/WorkComposition.tsx` (neu)    | gespeicherte Beschreibung und Liste „Aufbau“                           |
| `src/app/WorkTitle.tsx`                | Titelfragmente auch im Schema 3; Länge des längsten Worts              |
| `scripts/constraint-fixtures.ts` (neu) | erzeugt und reproduziert `ep01-constraints.json`                       |

Für `rendererVersion: "1"` liefert `ArtDispatch` genau den bisherigen
`ArtRenderer`; die Archiv-Baseline bleibt grün.

## Archivleser und Datenprüfung

- `artworkSchema` bleibt die Union aus Schema 1 und 2. Der Leser im Browser
  nimmt `anyArtworkSchema`.
- Ein Werk im Schema 3 wird beim Öffnen mit `validateEvolutionV3(work,
parents)` geprüft: Seed und Snapshot, Belege, Sichtbarkeit, `off` und
  `always`. Der Prüfer wird erst dann nachgeladen. Kontextdigest und Abstand
  werden im Browser nicht nachgerechnet, weil dafür bis zu 30 Werke zu laden
  wären.
- `readArchive` prüft Werke im Schema 3 mit vollständiger Historie
  (höchstens 30 Werke davor) und ältere Werke wie `readWorks`. Ein Werk im
  Schema 1 oder 2 mit einem Elternwerk im Schema 3 wird abgelehnt.
- `readWorks` ist wörtlich unverändert und lehnt Schema 3 weiter ab. Der
  Tageslauf benutzt es bis zur Aktivierung in P7.

## Testsammlungen

Im Auswahlfeld „Sammlung ansehen“, neben dem offiziellen Archiv und den zwei
abgenommenen Testsammlungen:

| Schlüssel (`sammlung=`) | Inhalt                                                     |
| ----------------------- | ---------------------------------------------------------- |
| `ep01-traceable`        | 10 Kettenwerke aus `ep01-chains.json`                      |
| `ep01-free`             | 10 Kettenwerke im Modus `free`                             |
| `ep01-transition`       | 10 Werke der Phase-2-Kette (Schema 2) und 4 Übergangswerke |
| `ep01-constraints`      | 6 Werke aus `ep01-constraints.json`                        |

Die gespeicherten alten Eltern der Übergangskette sind bytegleich mit
Generation 9 und 10 der Phase-2-Kette; der Leser prüft das beim Laden.

`fixtures/preview/ep01-constraints.json` ist neu: zwei Ursprünge im
Standardprofil, ab Generation 3 stehen Verläufe, Muster, Linien, Kurven und
generative Formen auf `off` (Revision 2). Die Kette enthält 55 Umwandlungen
aus allen fünf Regeln. Sie wird in `npm run validate:data` reproduziert und
ist wie die Probeketten bis P7 nicht eingefroren.

## Ansichten

**Rahmenbedingungen.** Aufklappbar, standardmäßig zu, in Detail-, Heute- und
Evolutionsansicht. Für Schema 3 aus dem Snapshot des Werks: Evolution,
Formen, Oberfläche, Farbe, Komposition, Bewegung, Experimente und die
Ähnlichkeitsprüfung (Abstand, Version des Abstandsmaßes, „Mindestabstand
erreicht“ oder „Mindestabstand nicht erreicht“). Der Kontextdigest wird nicht
angezeigt. Alte Werke zeigen Modus, Revision und den Satz „Weitere
Rahmenbedingungen sind in dieser Version nicht gespeichert.“

**Herkunft.** Elternbeiträge wie bisher als Liste, mit lesbarem Merkmal, Form
und Ebene; jeder Beleg nennt Quelle, Ziel und Operator. Umwandlungen stehen
in einer eigenen Liste „Durch Rahmenbedingungen umgewandelt.“ und zählen
ausdrücklich nicht als Elternbeitrag. Gleiche Umwandlungen (gleicher
Elternteil, gleiche Werte, gleiche Regel) sind zu einer Zeile mit Anzahl
zusammengefasst; die Einzelbelege bleiben aufklappbar. Bei Eltern im Schema 2
erklärt ein Satz, dass sie als eine Struktur-Ebene mit Vollfarben gelesen
werden; die Belege nennen die alten Pfade.

**Werkbeschreibung.** Nur bei Schema 3: die gespeicherte `description`
unverändert und eine Liste „Aufbau“ je Ebene mit Familie und Zahl der Formen.

**Titel.** In der Detailansicht richtet sich die Schriftgröße nach dem
längsten Wort, damit es nicht mitten im Wort umbricht. Das wirkt auch auf
alte Werke mit Wörtern ab etwa elf Buchstaben.

## Tests

- `tests/archive-v3.test.tsx` (19 Tests): Sammlungen, gemischte Kette,
  Prüfung jedes Werks aller vier Sammlungen, erfundener Elternbeleg,
  synthetisches Archiv rein und gemischt, geschönter Abstand, unverändertes
  `readWorks`, Herkunft mit Kopie, Versatz und Umwandlung, Eltern im
  Schema 2, Rahmenbedingungen für Schema 3 und alte Werke, verfehlter
  Mindestabstand, Beschreibung, Titelfragmente.
- `tests/browser/schema3-views.spec.ts` (7 Fälle je Projekt): Galerie der
  gemischten Kette, Detailansicht mit Tastaturweg und reduzierter Bewegung,
  Umwandlungen, Heute und Evolution, je bei 320 px und Desktop. Sechs neue
  Referenzbilder `schema3-detail-<Sammlung>-<Generation>.png`; alle
  bestehenden Referenzen sind unverändert.

Lokal am 11.11.2026: `npm run check` mit 385 Tests und
`CI=true npm run test:browser` mit 152 bestandenen Fällen und sechs
bestehenden Skips.

## Grenzen

- **Verfehlter Mindestabstand:** nur an einem synthetisch veränderten Werk im
  Komponententest gezeigt; der Generator erzeugt bei 0,02 keines.
- **Übergangssammlung:** Ihr gespeicherter Kontext kennt nur die zwei alten
  Eltern. Sie besteht deshalb die Prüfung im Browser, aber nicht
  `readArchive` mit voller Historie; der Test der Datenprüfung erzeugt seine
  gemischte Kette selbst.
- **Bündelgröße:** Der Chunk der Archivseiten wächst von 29,6 auf rund
  42 kB, dazu kommen 18 kB für das Schema 3. Die EP-01-Sammlungen und der
  Prüfer sind eigene, nachgeladene Chunks.
- **Titelgröße:** Der Faktor 0,52 je Großbuchstabe ist an der Schrift
  gemessen, nicht berechnet; sehr breite Wörter können knapp werden.
- **Nicht geprüft:** Firefox, Safari und echte Geräte; Renderlast auf einem
  Mobilgerät (P7).
