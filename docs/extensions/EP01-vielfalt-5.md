# Evolvera – EP-01: Vielfalt und Extremprofile (P5)

Stand: 11.11.2026 · Status: lokal umgesetzt und committet, nicht veröffentlicht; Schwelle, Verwerfungsrate und Extremprofile am 11.11.2026 mit dem Betreiber gesichtet und abgenommen (Mindestabstand 0,02 für beide Modi, in P7 an den Abnahmewerken erneut ansehen)

Generator 0.3.0 prüft jetzt jeden Kandidaten gegen die letzten Werke seiner
Kette und speichert das Ergebnis im Werk. Es gibt weiterhin keine Galerie-
oder Detailansicht für Schema 3 (P6), keinen Einbau in den Tageslauf, kein
`generatorChangeDate` und kein Werk im Schema 3 im Archiv. Generator 0.2.0,
Titelgenerator, Schema 3, Renderer 2 und `src/automation/plan.ts` sind
unverändert.

## Aufbau

| Datei                                     | Aufgabe                                                             |
| ----------------------------------------- | ------------------------------------------------------------------- |
| `src/art/generator/v3/distance.ts` (neu)  | Abstandsmaß Version 1, Fenster, Kontextdigest, Prüfung der Historie |
| `src/art/generator/v3/evolve.ts`          | neue Eingabe `history`, Auswahl unter den Versuchen, Feld `novelty` |
| `src/art/generator/v3/provenance.ts`      | `validateEvolutionV3` rechnet Digest, Abstand und Vermerk nach      |
| `src/art/generator/v3/parents.ts`         | `viewOfDna` aus `readParent` herausgelöst, ohne Verhaltensänderung  |
| `src/art/generator/preview-chain-v3.ts`   | Probeketten reichen die Historie weiter                             |
| `src/art/generator/novelty-simulation.ts` | Simulation und die Extremprofile, von Test und Skript geteilt       |
| `scripts/novelty-simulation.ts` (neu)     | Messung; läuft nicht in `npm run check` und schreibt nichts         |

Alles unter `v3/` bleibt frei von React, Browser, Uhrzeit und Dateizugriff
(derselbe Test wie in P3 und P4).

## Abstandsmaß Version 1

Jedes Werk wird auf eine Signatur reduziert. Werke im Schema 1 und 2 werden
wie Eltern in P4 nur im Speicher gelesen: eine Struktur-Ebene mit Vollfarben,
ohne die Polsterflächen der alten Belegblöcke. Der Abstand zweier Werke ist
eine gewichtete Summe zwischen 0 und 1, gerundet auf sechs Nachkommastellen:

| Merkmal           | Gewicht | Berechnung                                                                                                                                                |
| ----------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Familien je Ebene | 0,25    | Anteil der Ebenenplätze mit anderer Familie oder nur einseitig vorhandener Ebene                                                                          |
| Palette           | 0,25    | OKLab-Abstand, je zur Hälfte Hintergrund und die fünf flächenstärksten Farben (jede zur nächsten Farbe des anderen Werks, beide Richtungen); voll ab 0,25 |
| Formarten         | 0,15    | halbe Summe der Anteilsunterschiede je Elementart                                                                                                         |
| Füllarten         | 0,15    | dasselbe für Vollfarbe, linear, radial, konisch, Muster                                                                                                   |
| Dichte            | 0,10    | Verhältnis der Elementzahlen, logarithmisch; voll ab Faktor 8                                                                                             |
| Bewegung          | 0,10    | halbe Summe der Anteilsunterschiede je Bewegungsart, einschließlich unbewegt                                                                              |

Der Abstand eines Kandidaten zu seinem Fenster ist der kleinste Abstand zu
einem der Fensterwerke. Gewichte, Deckel und Schwelle gehören zur
Abstandsversion 1; das Werk speichert nur die Version.

## Historienkontext und Digest

- `generateArtworkV3` nimmt `history`: die Werke derselben Kette unmittelbar
  vor dem neuen Werk, älteste zuerst, höchstens 30. Geprüft wird, dass die
  Folge lückenlos und geordnet ist und mit den beiden Eltern endet.
- Das Fenster sind die letzten `variation.noveltyWindow` Werke daraus, bei
  kürzeren Ketten alle. Dass der Aufrufer genug Werke mitgibt, kann der
  Generator nicht prüfen; das ist Sache der Verdrahtung in P7.
- Der Kontextdigest ist ein SHA-256 über die Abstandsversion und je
  Fensterwerk Kennung und SHA-256 der DNA, in Reihenfolge. Titel und Zeiten
  gehören nicht dazu.
- Die Historie geht nicht in den Seed ein. Sie verändert keinen Kandidaten,
  sondern entscheidet nur, welcher der deterministischen Versuche genommen
  wird.
- Das erste Werk einer Kette hat ein leeres Fenster: `distance: null`,
  `minimumReached: true`. Das zweite Ursprungswerk bleibt elternlos, wird
  aber gegen das erste gemessen.

## Versuche und verfehlter Mindestabstand

Es bleibt bei höchstens 16 deterministischen Versuchen. Genommen wird der
erste Kandidat, der alle harten Prüfungen besteht und den Mindestabstand
erreicht. Erreicht ihn keiner, wird der gültige Kandidat mit dem größten
Abstand genommen (bei Gleichstand der frühere) und das Werk speichert
`minimumReached: false` (Betreiberentscheidung 4); der Lauf stoppt nicht.
Lastgrenzen, Sichtbarkeitsanker, Einstellungen und die Elternbeiträge im
Modus `traceable` bleiben harte Bedingungen: Gibt es keinen gültigen
Kandidaten, endet die Erzeugung wie bisher mit einem Fehler.

`validateEvolutionV3(work, parents, history)` rechnet Digest und Abstand aus
der Historie nach und prüft, dass der Vermerk zum gespeicherten Abstand
passt. Ohne Historie ist nur diese letzte Prüfung möglich.

## Schwelle

Messung lokal, Node 24, Standardprofil, je Modus vier Ketten über 365 Tage
(`npx tsx scripts/novelty-simulation.ts`).

**Verteilung ohne Schwelle** (Abstand des ersten gültigen Kandidaten zum
Fenster, je 1 456 Werke):

| Modus       | kleinster | 5 %   | 10 %  | 25 %  | Median | 75 %  | größter |
| ----------- | --------- | ----- | ----- | ----- | ------ | ----- | ------- |
| `traceable` | 0,000     | 0,009 | 0,020 | 0,091 | 0,162  | 0,236 | 0,755   |
| `free`      | 0,000     | 0,178 | 0,218 | 0,300 | 0,384  | 0,455 | 0,754   |

Mittlerer Beitrag je Merkmal zum nächsten Fensterwerk, `traceable` / `free`:
Familien 0,30 / 0,60, Palette 0,18 / 0,39, Formarten 0,17 / 0,43, Füllarten
0,07 / 0,16, Dichte 0,09 / 0,21, Bewegung 0,06 / 0,14.

Die Modi liegen weit auseinander: Ein Kind im Modus `traceable` übernimmt
Ebenen und Palette seiner Eltern, und die Eltern stehen selbst im Fenster.

**Wirkung verschiedener Schwellen** (dieselben Ketten, mit aktiver Schwelle
neu erzeugt):

| Schwelle | `traceable` verworfen | verfehlt  | höchster Versuch | `free` verworfen | verfehlt |
| -------- | --------------------- | --------- | ---------------- | ---------------- | -------- |
| 0,02     | 9,3 %                 | 0         | 6                | 0,3 %            | 0        |
| 0,05     | 16,0 %                | 0         | 7                | 1,1 %            | 0        |
| 0,10     | 24,6 %                | 0         | 8                | 2,1 %            | 0        |
| 0,22     | 60,4 %                | 8 (0,5 %) | 16               | 9,5 %            | 0        |

**Festgelegt: `NOVELTY_MINIMUM = 0,02`**, eine Konstante für beide Modi. Sie
ist die größte der geprüften Schwellen, bei der in keinem Modus mehr als etwa
jeder zehnte Kandidat verworfen wird. Im Modus `traceable` entfernt sie die
Beinahe-Wiederholungen (kleinster Abstand danach 0,020 statt 0,000, Median
0,181 statt 0,162). Im Modus `free` greift sie fast nie.

In der Sichtung am 11.11.2026 entschieden: Es bleibt bei einer Schwelle.
Eine eigene Schwelle je Modus (`free` etwa 0,22) würde auch dort etwa jeden
zehnten Kandidaten verwerfen, ist aber nicht umgesetzt; in P7 wird das an
den Abnahmewerken noch einmal angesehen.

## Extremprofile (A-35)

Je Profil und Modus eine Kette mit 52 Werken, Schwelle 0,02
(`npx tsx scripts/novelty-simulation.ts --extremes`). „Alles“ umfasst die
neun Merkmale und die Symmetrie.

| Profil            | Modus       | verworfen | Mindestabstand verfehlt | höchster Versuch | Median Abstand | Elemente bis |
| ----------------- | ----------- | --------- | ----------------------- | ---------------- | -------------- | ------------ |
| alles `off`       | `traceable` | 27,1 %    | 0                       | 4                | 0,129          | 63           |
| alles `off`       | `free`      | 0,0 %     | 0                       | 1                | 0,285          | 61           |
| alles `always`    | `traceable` | 10,5 %    | 0                       | 3                | 0,180          | 97           |
| alles `always`    | `free`      | 1,9 %     | 0                       | 3                | 0,334          | 74           |
| nur `geometric`   | `traceable` | 8,9 %     | 0                       | 5                | 0,142          | 32           |
| nur `geometric`   | `free`      | 1,9 %     | 0                       | 2                | 0,275          | 51           |
| nur `color-field` | `traceable` | 7,3 %     | 0                       | 8                | 0,143          | 35           |
| nur `color-field` | `free`      | 0,0 %     | 0                       | 4                | 0,240          | 35           |
| nur `mosaic`      | `traceable` | 12,1 %    | 0                       | 3                | 0,133          | 66           |
| nur `mosaic`      | `free`      | 0,0 %     | 0                       | 3                | 0,272          | 66           |
| nur `organic`     | `traceable` | 8,9 %     | 0                       | 3                | 0,121          | 38           |
| nur `organic`     | `free`      | 0,0 %     | 0                       | 2                | 0,231          | 27           |
| nur `generative`  | `traceable` | 10,5 %    | 0                       | 4                | 0,112          | 93           |
| nur `generative`  | `free`      | 0,0 %     | 0                       | 4                | 0,232          | 104          |
| nur `chaotic`     | `traceable` | 8,9 %     | 0                       | 4                | 0,139          | 51           |
| nur `chaotic`     | `free`      | 0,0 %     | 0                       | 3                | 0,246          | 61           |
| `wild`            | `traceable` | 5,6 %     | 0                       | 6                | 0,234          | 50           |
| `wild`            | `free`      | 0,0 %     | 0                       | 4                | 0,439          | 61           |

Alle 18 Ketten entstehen ohne Fehler; jedes Werk besteht den strengen Prüfer
samt Historie. Kein Profil hat sich als unmöglich erwiesen, deshalb bleibt
die Regelversion 1 in `profile.ts` unverändert. Abgelehnt werden weiterhin
nur Profile ohne Familie oder ohne Palettenstrategie, mit verständlicher
Meldung und ohne stillen Fallback (Test).

Auffällig: Bei „alles `off`“ im Modus `traceable` wird gut jeder vierte
Kandidat verworfen, weil ohne Verläufe, Muster, Linien und Kurven wenig
bleibt, worin sich Kinder von ihren Eltern unterscheiden. Der Mindestabstand
wird trotzdem immer erreicht. Die Stichprobe von 52 Werken je Kette ist
klein; die Raten sind Größenordnungen, keine festen Werte.

## Tests

`tests/novelty-v3.test.ts` (32 neue Tests, Massentests mit eigenem Zeitlimit
von 300 s):

- Abstandsmaß: Gewichte, Wertebereich, Symmetrie, jedes Merkmal einzeln,
  OKLab-Umrechnung, Werke im Schema 2 ohne Veränderung der Eingaben.
- Fenster und Digest: letzte N Werke, kleineres Fenster im Profil, Bindung an
  Reihenfolge, Kennung und DNA.
- Determinismus mit Historie: gleiche Eingabe, gleiches Werk; frühere Werke
  werden aus ihrer eigenen Historie unverändert reproduziert; eine andere
  Historie ändert den Digest.
- Strenger Prüfer: falsche, gekürzte oder umgedrehte Historie, geschönter
  Abstand, versteckter Vermerk.
- Retry-Grenze: mit unerreichbarer Schwelle werden höchstens 16 Versuche
  geprüft, der abstandsstärkste gewinnt, der Vermerk steht im Werk, alle
  harten Bedingungen gelten weiter.
- Nachholung: drei fällige Tage in einem verspäteten Lauf; jedes Werk hat
  das Werk des Vortags im Fenster und gleicht bis auf die Laufzeiten dem
  Werk eines pünktlichen Laufs.
- 365 Testtage je Modus mit strenger Prüfung jedes Werks; Verwerfungsrate
  höchstens 13 %, kein verfehlter Mindestabstand.
- Extremprofile: 18 Ketten mit je 52 Werken; Lastgrenzen, Anker, `off` und
  `always`, Familien, Elternbeiträge und Ähnlichkeitsvermerk.

`tests/evolution-v3.test.ts` wurde an die neue Eingabe angepasst; der Test
des Platzhalters prüft jetzt den Vermerk des ersten Kettenwerks.

## Probeketten und Referenzbilder

`fixtures/preview/ep01-chains.json` wurde **neu erzeugt**, weil das Fenster
die Ketten verändert. Alle 24 Werke haben einen neuen Kontextdigest und einen
Abstand. In Gestalt verändert sind sechs Werke: `traceable` Generation 8, 9
und 10 sowie die Übergangskette Generation 12, 13 und 14. In Generation 8
und 12 wurden zwei Kandidaten verworfen; die Werke danach haben dadurch
andere Eltern. Die Kette `free` ist bis auf das Feld `novelty` unverändert.

Von den 14 Kettenbildern aus P4 wurden **zwei ersetzt**
(`generator-v3-chain-traceable-10.png`, 320 px und Desktop). Die übrigen
zwölf und alle anderen Referenzen sind unverändert.
`fixtures/preview/ep01-origins.json` wurde nicht neu erzeugt; die Datenprüfung
reproduziert die 40 Ursprungs-Probewerke unverändert.

## Abweichungen und Grenzen

- **`src/automation/plan.ts` nicht berührt** (im Bauplan freigegeben). Der
  Plan sah vor, dass der Tagesplaner den Kontext schon in P5 reicht.
  Generator 0.3.0 hat bis P7 keinen Aufrufer im Tageslauf; die Verdrahtung
  gehört zur Aktivierung. Die chronologische Erweiterung bei Nachholung ist
  an den Probeketten und einem eigenen Test gezeigt.
- **Eine Schwelle für beide Modi:** Im Modus `free` greift sie kaum.
- **Fenster enthält die Eltern:** Im Modus `traceable` misst das Fenster
  damit auch die Nähe zu den eigenen Eltern. Das ist gewollt (keine
  Beinahe-Kopie), begrenzt aber, wie hoch die Schwelle dort sein kann.
- **Übergangskette:** Ihr Kontext beginnt mit den zwei alten Eltern; die
  früheren Werke der Phase-2-Kette stehen nicht in der Fixture.
- **Simulationsparameter:** `generateArtworkV3` hat einen dritten, optionalen
  Parameter für Messungen (andere Schwelle, Beobachter). Offizielle Aufrufer
  übergeben ihn nicht.
- **Abstandsmaß:** Es sieht Anteile und Farben, keine Lage und keine Größe
  der Formen. Zwei Werke mit gleichen Zutaten in anderer Anordnung gelten
  als ähnlich.
- **Determinismus:** wie in P3 und P4 nur unter Node 24 geprüft; `Math.cbrt`
  und `Math.log` sind zwischen Engines nicht garantiert bitgleich, der
  Abstand ist deshalb auf sechs Nachkommastellen gerundet.
- **Nicht geprüft:** Firefox, Safari und echte Geräte; Renderlast auf einem
  Mobilgerät (P7); `npm run worker:test-runtime` (Worker unberührt).

## Unverändert

`study.ts`, `evolve.ts` und `provenance.ts` von Generator 0.2.0,
Titelgenerator, `ArtRenderer.tsx`, `ArtV1`, `artwork.ts`, `artwork-v3.ts`,
`profile.ts`, Renderer 2, `config/*.json`, `src/automation/plan.ts`, Worker,
Workflows, Archivdateien, Archiv-Baseline, `fixtures/preview/phase-*.json`,
`ep01-origins.json`, Musterbogen, Atelier, `package.json`, Lockfile. Keine
neue Abhängigkeit.
