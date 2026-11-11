# Evolvera – EP-01: Generator 0.3.0, Teil B – Evolution und Belege (P4)

Stand: 11.11.2026 · Status: umgesetzt und am 11.11.2026 veröffentlicht (`bebaca5`); Probeketten am 11.11.2026 gesichtet, Startwerte bleiben

Generator 0.3.0 erzeugt jetzt vollständige Werke im Schema 3: Ursprungswerke
und Kinder der beiden unmittelbaren Vorgänger. Es gibt weiterhin kein
Ähnlichkeitsfenster (P5), keine Galerie- oder Detailansicht für Schema 3 (P6),
keinen Einbau in den Tageslauf, kein `generatorChangeDate` und kein Werk im
Schema 3 im Archiv. Generator 0.1.0 und 0.2.0 (`study.ts`, `evolve.ts`,
`provenance.ts`) und der Titelgenerator sind unverändert.

## Aufbau

Neu unter `src/art/generator/v3/`, frei von React, Browser, Uhrzeit und
Dateizugriff (derselbe Test wie in P3 prüft alle Dateien des Ordners):

| Datei           | Aufgabe                                                                    |
| --------------- | -------------------------------------------------------------------------- |
| `evolve.ts`     | Einstieg `generateArtworkV3(input, clock)`, Seed-Digest, Titel, Werkaufbau |
| `inherit.ts`    | ein Kind aus zwei Eltern: Vererbung je Ebene und Merkmalsgruppe, Belege    |
| `parents.ts`    | Eltern lesen (Schema 3 wie gespeichert, Schema 1/2 nur im Speicher)        |
| `provenance.ts` | strenger Prüfer `validateEvolutionV3(work, parents)`                       |
| `sha256.ts`     | SHA-256 und kanonisches JSON als reine, synchrone Funktionen               |

Dazu `src/art/generator/preview-chain-v3.ts` (Probeketten, mit simulierten
Daten wie die Ketten aus Phase 2) und `src/art/schema/chains-v3.ts`.

`compose.ts` aus P3 wurde in wiederverwendbare Teile zerlegt (Füllungsgarantie,
Anker, Effekte und Bewegung), `kit.ts` und `checks.ts` haben je eine Ergänzung.
Die 40 Ursprungs-Probewerke aus P3 werden unverändert reproduziert; die
Datenprüfung stellt das sicher. `fixtures/preview/ep01-origins.json` wurde
nicht neu erzeugt.

## Vererbung

**Je Ebene.** Der Ebenenplan entsteht wie bei einem Ursprungswerk. Für jede
Ebene wird dann gezogen: vom älteren Elternteil, vom jüngeren, gemischt (Formen
des einen, Füllungen des anderen) oder neu (mit den Familien aus P3).

| Modus       | je Elternteil | gemischt | neu  | Besonderheit                                          |
| ----------- | ------------- | -------- | ---- | ----------------------------------------------------- |
| `traceable` | 35 %          | 10 %     | 20 % | mindestens eine Ebene stammt von einem Elternteil     |
| `free`      | 20 %          | 10 %     | 50 % | in 35 % der Werke ein vollständiger Bruch ohne Belege |

Hat ein Elternteil die Ebene nicht, entfällt sein Anteil. Dieselben Gewichte
gelten für die Palette (von einem Elternteil, aus beiden gemischt, neu).

**Je Merkmalsgruppe.**

- Palette: Die Palette eines Elternteils wird aus seiner DNA gelesen (die fünf
  Farben mit der größten Fläche). Übernommene Ebenen werden auf die Palette
  des Kindes umgefärbt, Rang für Rang.
- Geometrie, Füllung, Effekte, Bewegung: Eine übernommene Form behält sie,
  soweit die Einstellungen es erlauben. Gespiegelte Paare bleiben Paare.
- Mutation: Je Form wird mit dem Anteil der Mutationsstärke eines verändert:
  Lage, Größe, Drehung oder eine neue Füllung.

| Mutationsstärke | Anteil der Formen | größter Ausschlag |
| --------------- | ----------------- | ----------------- |
| `calm`          | 10 %              | ±3 %              |
| `medium`        | 25 %              | ±6 %              |
| `high`          | 45 %              | ±10 %             |
| `wild`          | 70 %              | ±16 %             |

**Mutationssprung** (im Standardprofil aus): in 10 % der Werke wird eine
geerbte Ebene in einer Familie neu gebaut, die keiner der Eltern dort zeigt,
und die Palette wird neu gezogen.

Merkmale, die für das Werk gezogen wurden (Häufigkeitsstufen wie in P3),
kommen sicher vor; was die Eltern schon mitbringen, wird nicht doppelt
ergänzt. Geerbte Merkmale bleiben auch dann, wenn sie nicht gezogen wurden;
nur `off` schließt sie aus.

## Belegverfahren

Belegt wird ausschließlich an sichtbaren Formen. Sichtbar heißt: Die Form
erfüllt die Ankerregeln aus `checks.ts` (mindestens 0,12 × 0,12, Deckkraft ab
0,65, in der Fläche, ungedreht, ohne Clip-Pfad, ohne Effekt, unbewegt, von
nichts überdeckt, Kontrast mindestens 2 gegen alles darunter). Jeder Beleg
nennt den gespeicherten Pfad und Wert im Elternwerk und den Zielwert im Kind,
als Kopie oder als Versatz. Es gibt keine Belegblöcke, kein Raster und kein
Hintergrundpolster.

Belegbare Merkmale: eine Vollfarbe, die der Elternteil speichert; Farbstopps,
Winkel, Mittelpunkt und Periode einer übernommenen Füllung; Breite und Höhe
(Kopie oder Versatz) sowie Lage (nur Kopie) einer übernommenen Form. Je
Elternteil werden höchstens drei Formen mit je vier Merkmalen protokolliert.

Im Modus `traceable` braucht jeder Elternteil mindestens einen solchen Beleg.
Der Weg dahin, in dieser Reihenfolge:

1. Eine Form oder Farbe dieses Elternteils ist schon sichtbar.
2. Eine Form dieses Elternteils kommt nach vorn und wird gerade gestellt.
3. Eine andere Form kommt nach vorn und bekommt eine Farbe dieses Elternteils.
4. Eine Form wandert an einen Platz, an dem eine Farbe des Elternteils lesbar
   ist.
5. Letzter Ausweg (A-31): Eine neue Form mit einem Maß und, wo lesbar, einer
   Farbe des Elternteils kommt dazu, frei platziert.

`free` verlangt nichts davon; sichtbare Übernahmen werden trotzdem
protokolliert, ein vollständiger Bruch behauptet keine.

**`off` und `always` (A-30).** `off` wandelt geerbte Merkmale um: Verlauf und
Muster werden zur Vollfarbe, Bogen und Kurvenstrich zur Linie, Ring zum Kreis,
Polygon zum Rechteck, Kurvenfläche zur Ellipse, Linie zum Balken. Jede
Umwandlung steht als `constrained` mit Quelle, Ziel und auslösender Regel im
Werk und zählt nie als Elternbeitrag. Effekte und Bewegung haben kein
erlaubtes Gegenstück und werden ohne Beleg entfernt; das Schema kennt dafür
auch keinen Merkmalspfad. Eine abgeschaltete Familie führt dazu, dass die
Ebene neu gebaut wird (ebenfalls `constrained`). `always` erzwingt wie in P3
das Vorkommen im Werk.

**Strenger Prüfer.** `validateEvolutionV3` prüft zusätzlich zum Schema: Seed
und Einstellungssnapshot gehören zusammen; Ebenenzahl und Familien passen zu
den Einstellungen; `off` und `always` sind eingehalten; das Werk hat einen
sichtbaren Anker; jede Kopie und jeder Versatz liegt auf einer sichtbaren
Form; `traceable` hat je Elternteil einen sichtbaren Beitrag; jede Umwandlung
beruft sich auf eine Regel, die im Snapshot wirklich gilt; Titelfragmente
stammen aus den Elterntiteln.

## Eltern im Schema 2

Alte Werke werden nur im Speicher gelesen: als eine Struktur-Ebene mit
Vollfarben. Die hintergrundfarbenen Polsterflächen der alten Belegblöcke
werden nicht vererbt. Belege verweisen auf die alten Pfade
(`elements.N.color`, `elements.N.width`). Die Dateien bleiben unberührt; ein
Test friert die Eingaben ein und vergleicht sie danach.

## Seed und Snapshot (A-29)

Über den vollständigen Einstellungssnapshot samt Revision wird ein SHA-256
gebildet (kanonisches JSON mit sortierten Schlüsseln). Er geht zusammen mit
einem Digest der Eltern in alle Zufallsströme ein. Der gespeicherte Seed ist
`<Seed des Laufs>:settings-<Digest>`; der Prüfer rechnet den Digest aus dem
gespeicherten Snapshot nach. Ein geänderter Schalter ergibt damit ein anderes
Werk, auch wenn die Revision gleich bleibt, und ein nachträglich geänderter
Snapshot fällt auf.

## Vollständiges Werk

`artworkV3Schema`, erzeugt von `generateArtworkV3`. Der Titelgenerator wird
nur aufgerufen (Lexikon 0.2.0 als Vorgabe).

**Platzhalter bis P5:** `novelty` enthält `distanceVersion: 1`,
`distance: null`, `minimumReached: true` und als `contextDigest` den Digest
eines leeren Historienkontexts (`NOVELTY_PLACEHOLDER` in `evolve.ts`). Es wird
noch kein Abstand gerechnet und kein Fenster ausgewertet.

**Änderung am Schema 3** (Betreiberentscheidung vom 11.11.2026): neues
Pflichtfeld `evolution.recipe` mit Versuch, Herkunft der Palette, Herkunft je
Ebene, Mutationssprung, gezogenen Merkmalen und Ankerweg. Es ist eine
Zusammenfassung für die spätere Herkunftsansicht (P6), kein abspielbares
Rezept: Reproduziert wird ein Werk aus seinen vollständigen Eingaben.
Renderer 2 ist unverändert.

## Probeketten

`fixtures/preview/ep01-chains.json`, erzeugt und geprüft von
`scripts/chain-fixtures.ts` (in `npm run validate:data`): je zehn Generationen
`traceable` und `free` im Standardprofil und eine Übergangskette aus vier
Werken, deren erste Eltern die beiden letzten Werke der Phase-2-Kette im
Schema 2 sind. Sichtbar unten im Testatelier (`#/atelier`), getrennt vom
Archiv, als eigener nachgeladener Abschnitt. Jede Kette ist ein einziger
Tab-Halt; Pfeiltasten wechseln innerhalb der Kette. Neue Browserreferenzen:
14 Bilder `generator-v3-chain-<Kette>-<Generation>.png` (je drei Werke der
beiden Modi und eines der Übergangskette, bei 320 px und Desktop).

Die Fixture ist bis zur Kunstabnahme (P7) nicht eingefroren.

## Messung

Lokal, Node 24, Standardprofil, je 100 Ketten mit 52 Generationen:

- 5 000 Kinder im Modus `traceable`: kein Fehlschlag; 91,6 % im ersten
  Versuch, höchstens der siebte Versuch nötig; rund 12 ms je Werk.
- Weg zum sichtbaren Beitrag (je Elternteil, einschließlich verworfener
  Versuche): 30 % schon sichtbar, 43 % nach vorn geholt, 20 % versetzt,
  7 % neue Form.
- 5 000 Kinder im Modus `free`: 42 % mit protokollierter sichtbarer Übernahme.

Eine erste Fassung holte für den zweiten Elternteil fast immer eine neue Form
dazu (46 %); die Schritte 3 und 4 oben haben das auf 7 % gesenkt. Für den
letzten Ausweg gibt es zwei neutrale Mitteltöne als weitere Reserve, weil über
hell-dunklen Verläufen weder ein heller noch ein sehr dunkler Ton lesbar ist.

## Grenzen

- **Sichtbarkeit von `always`:** Geprüft wird wie in P3 das Vorkommen im
  Werk, nicht die Sichtbarkeit jedes verlangten Merkmals.
- **Versatzbelege:** Ein Versatz belegt Ausgangs- und Zielwert, sagt aber
  nichts über die Größe der Änderung. Er wird nur für Breite und Höhe einer
  tatsächlich übernommenen oder aus ihr abgeleiteten Form geschrieben.
- **Farbbelege:** Eine Farbe gilt als Beitrag eines Elternteils, wenn er
  genau diesen Wert speichert. Teilen sich beide Eltern eine Palette, kann
  dieselbe Farbe beide belegen.
- **Belegformen:** Bei rund 7 % der Elternbeiträge kommt eine eigene Form
  dazu, selten in neutralem Grau. Nach vorn geholte Formen verlieren Drehung,
  Effekt und Bewegung.
- **Effekte und Bewegung unter `off`:** werden entfernt, nicht umgewandelt
  und nicht belegt.
- **Extremprofile** sind Teil von P5 (A-35). Vorab durch Tests belegt: alle
  Merkmale `off` und alle `always` über beide gespeicherten Ketten, nur eine
  Familie mit einer Ebene, alle vier Mutationsstärken, Mutationssprünge.
- **Determinismus:** wie in P3 nur unter Node 24 geprüft.
- **Nicht geprüft:** Firefox, Safari und echte Geräte; Renderlast auf einem
  Mobilgerät (P7).
