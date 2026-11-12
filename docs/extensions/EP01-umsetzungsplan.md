# Evolvera – EP-01: Angepasster Umsetzungsplan

Stand: 12.11.2026 · Status: EP-01 beauftragt, Umsetzung paketweise; P0 bis P6 veröffentlicht; P7 am 12.11.2026 beauftragt: Kunstabnahme erteilt, Lastgrenzen bestätigt, Aktivierungsplan vorgelegt, lokal und nicht veröffentlicht; Aktivierung nicht freigegeben; P8 und P9 nicht beauftragt

Dieser Plan bildet `docs/extensions/PRD-EP01.md` und das Projektdokument „Mehr
Varianz: Generierungsschalter, Formenkatalog und Vielfaltsregeln“ auf den
tatsächlichen Bestand ab. Er übernimmt die Rolle des in EP-01 vorgesehenen
E0-Ergebnisses. Der Betreiber hat EP-01 am 10.11.2026 beauftragt; der Plan allein
ist trotzdem kein Umsetzungsauftrag: Jedes Arbeitspaket braucht einen eigenen
Auftrag, Push und Aktivierung zusätzlich die passende Freigabe.

Rangfolge bei Widersprüchen: `AGENTS.md` vor EP-01 (Regeln) vor diesem Plan
(Reihenfolge, Bestandsabbildung) vor dem Varianz-Dokument (Beispiele, Namen).

## 1. Ausgangsbefund

Geprüft am 10.11.2026 am lokalen Stand `a258422` (ohne Fetch): Generator, Renderer,
Schemata, Konfiguration, Archiv. Nicht im Volltext gelesen: `docs/HANDOFF.md`,
`PRD_1_2.md`, Worker-Code. Tests wurden für diesen Plan nicht ausgeführt.

- Archiv: sieben Werke (04.–10.11.), Generator 0.2.0, Werkschema 2, Renderer 1,
  alle `traceable`. Sechs von sieben sind Mosaike; es kommen nur Rechtecke und
  Kreise vor, keine Linie, keine Ellipse.
- `src/art/generator/study.ts` erzeugt nur drei Familien (`geometric`,
  `color-field`, `mosaic`). `organic`, `kinetic` und `chaotic` stehen im Schema,
  werden aber nie erzeugt. Linien sind 0,007 breit.
- `ArtRenderer.tsx` kennt je Element genau eine Vollfarbe und `border-radius`
  0 oder 50 %. Die logische Fläche 1000 × 1000 mit `transform: scale()` ist
  bereits umgesetzt.
- `evolve.ts` belegt jeden Elternbeitrag mit einem hintergrundfarbenen Rechteck
  und einer Vollfläche darauf, in einem festen 3×2-Raster (2–6 Blöcke je Werk).
  `isExposed` verlangt dafür Deckkraft 1, Drehung 0 und keine Bewegung. Diese
  Blöcke prägen inzwischen das Bild und gleichen die Werke einander an.
- Farben: acht feste Paletten, je RGB-Kanal um bis zu ±96 verschoben, mit
  Überlauf. Es gibt keine Farbharmonie.
- Wiederholungsschutz: nur exakte DNA-Gleichheit mit dem direkten Vorgänger.
- `configSchema` ist ein striktes Objekt mit `schemaVersion: 1` und dem einzigen
  Gestaltungsschlüssel `inheritanceMode`. Unbekannte Schlüssel lassen Tageslauf,
  Build und Worker heute scheitern.

## 2. Leitentscheidungen dieses Plans

1. **Erst das Vokabular, dann die Schalter.** Schalter über vier Formen bringen
   keine Vielfalt. Renderer 2 und der neue Generator kommen zuerst und laufen mit
   dem festen Standardprofil. Die Betreiberoberfläche folgt als eigenes Paket.
   Der Einstellungssnapshot steht trotzdem von Anfang an im Werkschema 3.
2. **Füllung wird ein eigenes Gen**, getrennt von der Form. Verläufe und Muster
   kosten keine zusätzlichen Elemente und verändern auch einfache Formen.
3. **Das Belegverfahren wird ersetzt.** Elternbeiträge werden an echten
   Gestaltungsmerkmalen belegt (Farbstopp, Verlaufswinkel, Formparameter, Ebene),
   nicht mehr über Belegblöcke im Raster.
4. **Alles Alte bleibt eingefroren.** `study.ts`, `evolve.ts`, `provenance.ts`,
   `ArtRenderer.tsx` und `ArtV1.module.css` werden nicht verändert, sondern über
   einen datierten Versionswechsel ergänzt, wie beim Titel-Lexikon
   (`lexiconChangeDate` in `src/series/calendar.ts`).
5. **Renderer 2 wird vollständig, bevor ein Werk damit archiviert wird.** Ein
   archivierter Renderer ist eingefroren; nachträgliche Elementarten bräuchten
   Renderer 3. Der Generator darf das Vokabular dagegen schrittweise nutzen.
6. **Punktstrukturen ohne Renderer-Mathematik.** Spiralen, Phyllotaxis und
   Lissajous-Figuren schreibt der Generator als einzelne Kreise in die DNA. Eine
   Elementart `dotField`, die der Renderer ausrechnet, entfällt.
7. **Farben bleiben als Hex archiviert.** OKLCH wird nur im Generator gerechnet.
   Farbschema, Kontrastprüfung und Archivvertrag bleiben dadurch unverändert, und
   `color-mix()` wird im Renderer nicht benötigt.

## 3. Versionsplan

| Vertrag              | Bestand      | Neu    | Hinweis                                                 |
| -------------------- | ------------ | ------ | ------------------------------------------------------- |
| Konfigurationsschema | 1            | 2      | Leser akzeptiert 1 und 2; fehlende Schlüssel = Standard |
| Werkschema           | 1, 2         | 3      | Das Varianz-Dokument nennt „2“; die Nummer ist vergeben |
| Renderer             | `1`          | `2`    | Dispatch nach `rendererVersion`                         |
| Generator            | 0.1.0, 0.2.0 | 0.3.0  | Das Varianz-Dokument nennt „2.0.0“; Bestand zählt 0.x   |
| Abstandsmaß          | –            | 1      | eigene Version, im Werk gespeichert                     |
| Titel-Lexikon        | 0.1.0, 0.2.0 | bleibt | kein Teil dieses Pakets                                 |

Der Generatorwechsel wird über ein Werkdatum geschaltet (`generatorChangeDate`).
Vor dem Datum erzeugt weiter 0.2.0, ab dem Datum 0.3.0.

## 4. Datenverträge

### 4.1 Konfiguration (Schema 2)

Schlüssel und Standardwerte wie im Varianz-Dokument, Abschnitt 3 (`variation`,
`features`, `palette`, `families`, `composition`, `motion`, `experimental`).
Abweichungen:

- Familienschlüssel in der Schreibweise des Bestands: `color-field` statt
  `colorField`.
- Ein gemeinsamer Parser liest Schema 1 und 2 und liefert immer das vollständige
  effektive Profil. Schema 1 ergibt das Standardprofil (A-37).
- Die Regeln „mindestens eine Familie, mindestens eine Palettenstrategie“ und die
  Kompatibilitätsmatrix liegen im selben Modul und werden von Generator, Worker
  und Oberfläche geteilt.
- Reihenfolge im Betrieb: Erst muss der veröffentlichte Stand (Pages-Workflow
  und Worker) Schema 2 lesen können. Erst danach darf der Worker Schema 2
  schreiben.

Häufigkeitsstufen zum Start, je Werk und Merkmalsgruppe: `rare` 15 %,
`normal` 40 %, `often` 70 %. Sie gehören zur Generatorversion.

### 4.2 Werk-DNA (Schema 3)

Geschlossenes Vokabular, nur Zahlen, Hex-Farben und Aufzählungen. CSS- und
Pfadstrings setzt ausschließlich der Renderer zusammen.

| Feld      | Inhalt                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------ |
| `layers`  | je Ebene (`background`, `structure`, `accent`) die Familie; feste Reihenfolge                    |
| `kind`    | `rectangle`, `circle`, `ellipse`, `line`, `arc`, `ring`, `polygon`, `blob`, `path`               |
| `layer`   | Ebene des Elements                                                                               |
| Geometrie | `x`, `y`, `width`, `height`, `rotation`, `opacity` wie bisher                                    |
| `shape`   | je Art: Bogenweite und Strichstärke, Punktliste (3–24), acht Radien, Pfadbefehle als Zahlen      |
| `fill`    | `solid`, `linear`, `radial`, `conic` mit 2–4 Farbstopps, oder `pattern` (Art, Winkel, Periode)   |
| `effects` | optional: Blendmodus, Unschärfe, Schatten, Verlaufsmaske; jeweils geschlossene Werte und Grenzen |
| `motion`  | wie bisher                                                                                       |

Muster: Streifen, Raster, Punkte, Ringe, Schachbrett, Truchet-Zelle.
`kinetic` wird nicht mehr erzeugt, bleibt aber für alte Werke gültig.

Zusätzlich im Werk: vollständiger effektiver Einstellungssnapshot (`settings`),
`settingsRevision`, Abstandsversion und Kontextdigest des Ähnlichkeitsfensters.

### 4.3 Herkunftsbelege

Das Format `parentId` / `source` / `target` / `operation` bleibt. Erweiterungen:

- Merkmalspfade für Füllung und Form, zum Beispiel
  `elements.4.fill.stops.1.color`, `elements.4.fill.angle`,
  `elements.2.shape.points.3.x`, sowie `layers.structure.family`.
- Neue Operation `constrained` mit `from`, `to` und auslösender Regel (zum
  Beispiel `features.gradients=off`), neben `copy` und `offset`.
- Quellpfade müssen auch Werke im Schema 2 adressieren, denn die ersten neuen
  Werke haben alte Eltern. Alte Eltern werden nur im Speicher als eine
  Struktur-Ebene mit Vollfarben gelesen; ihre Dateien bleiben unberührt.

Sichtbarkeit eines Beitrags (ersetzt `isExposed` für Schema 3):

- Mindestgröße 0,12 × 0,12 der Fläche, Deckkraft mindestens 0,65, vollständig
  innerhalb der Fläche, im Ruhezustand sichtbar.
- Von keinem späteren Element überdeckt (bestehende Bounding-Box-Prüfung).
- Kontrast mindestens 2 gegenüber dem Hintergrund und gegenüber den Füllfarben
  aller darunterliegenden, überlappenden Elemente.
- Kein Blendmodus, keine Maske und keine Unschärfe auf dem belegenden Element.

Ein Hintergrundpolster ist damit nicht mehr nötig. Kerngene allein beweisen
weiterhin nichts; belegt wird immer ein konkreter Ausgangs- und Zielwert.

## 5. Arbeitspakete

Jedes Paket endet mit `npm run check`, bei Oberflächen- oder Rendereränderungen
zusätzlich `npm run test:browser`, bei Workeränderungen
`npm run worker:test-runtime`, und mit einer gemeinsamen Sichtung.

### P0 – Entscheidungen und Absicherung

- `AGENTS.md` und `NEXT-START.md` an die Entscheidungen aus Abschnitt 7 anpassen
  (EP-01 ist dort noch als „nicht beauftragt“ geführt).
- Der Beleg des Lexikon-Wechsels zum 14.11.2026 bleibt ein eigener Schritt. Er
  ist seit der Betreiberentscheidung vom 10.11.2026 keine Voraussetzung mehr
  für ein Arbeitspaket; Pakete dürfen auf Auftrag schon vorher beginnen.
- Regressionsschutz für das Archiv (A-36): SHA-256 aller Dateien unter
  `public/artworks/`, serialisierte Renderer-Ausgabe aller Archivwerke als
  Testreferenz, je ein Browserbild bei 320 px und Desktop.
- Ergebnis: keine Änderung an Kunst, Betrieb oder Archiv.
- Umgesetzt am 10.11.2026 als eingefrorene Baseline der sieben Werke vom
  04.–10.11. (`tests/archive-baseline.test.tsx`,
  `tests/browser/archive-baseline.spec.ts`,
  `tests/fixtures/archive-baseline/`). Spätere Tageswerke werden geduldet und
  sind erst nach bewusster Erweiterung der Baseline geschützt; `index.json`
  wird nicht per Hash, sondern auf unveränderte eingefrorene Einträge geprüft.

### P1 – Verträge

- `src/art/schema/config.ts`: Schema 2 mit Standardwerten und geteiltem
  Regelmodul; Leser für 1 und 2.
- `src/art/schema/artwork.ts`: `dnaV3Schema`, `artworkV3Schema`, erweiterte
  Belegpfade und `constrained`; V1 und V2 unverändert in der Union.
- Renderer-Dispatch nach Version; Version `2` ist noch leer und meldet „nicht
  darstellbar“.
- Tests: Schema 1 ohne neue Schlüssel wird verarbeitet; alle Archivwerke und
  Fixtures validieren unverändert; unmögliche Profile werden mit verständlicher
  Meldung abgelehnt (A-32, A-37).
- Umgesetzt am 10.11.2026, rein ergänzend (Betreiberentscheidungen vom selben
  Tag):
  - Schlüssel und Standardprofil aus `PRD_1_2.md` Abschnitt 8.4, weil das
    Varianz-Dokument nicht im Projekt liegt; Familienschlüssel `color-field`.
  - `src/art/schema/profile.ts` ist das geteilte Regelmodul. Regelversion 1
    lehnt nur ab: keine aktive Familie, keine Palettenstrategie (dazu doppelt
    genannte Strategien). Weitere Ausschlüsse brauchen eine neue Regelversion,
    sobald P2/P3 zeigen, was technisch nicht geht.
  - `configV2Schema` und `readGenerationConfig` stehen in
    `src/art/schema/config.ts`. Tageslauf, Worker und Generator 0.2.0 lesen
    weiter das strikte Schema 1; die Umstellung folgt in P3/P4 und P8.
  - Werkschema 3 liegt in der neuen Datei `src/art/schema/artwork-v3.ts`, damit
    `artwork.ts` unverändert bleibt. `artworkSchema` bleibt die Union aus 1
    und 2 und damit der Archivvertrag; `anyArtworkSchema` enthält zusätzlich
    Schema 3. Archivleser und Oberfläche wechseln erst in P6.
  - `src/art/renderer/ArtDispatch.tsx` wählt nach `rendererVersion`; Version 2
    meldet „noch nicht darstellbar“. Die Oberfläche benutzt ihn noch nicht.
  - Vorläufig und vor dem ersten archivierten Werk noch änderbar: Wertebereiche
    der Formen, Füllungen und Effekte (P2), das Feld `novelty` für Abstand und
    Kontextdigest (P5) und ein Rezept der Evolution, das Schema 3 noch nicht
    enthält (P4). Von den Lastgrenzen steht nur die Gesamtzahl 120 im Schema.

### P2 – Renderer 2 und Musterbogen

- Neue Dateien `ArtRendererV2.tsx` und `ArtV2.module.css`; `ArtV1` unberührt.
- Alle Elementarten, Füllungen, Muster und Effekte aus 4.2. Kein `<img>`,
  `<svg>`, `<canvas>` und kein `url(...)`.
- Technik je Baustein nachweisen und dokumentieren, insbesondere sichtbare Bögen
  und Kurvenstriche (ein offener Clip-Pfad reicht nicht) sowie die
  Browserunterstützung von `clip-path: path()` und Masken in Chromium, Firefox
  und Safari.
- Handgeschriebener Musterbogen als Fixture (`fixtures/preview/ep01-catalog.json`),
  sichtbar im bestehenden Atelier. Neue Browserreferenzen bei 320 px und Desktop;
  bestehende Referenzen bleiben unverändert (A-34).
- Lastgrenzen messen und festlegen. Startwerte: 120 Elemente gesamt, davon
  höchstens 60 Punkte, 40 Elemente mit `clip-path`, 8 Pfade, 6 Blendmodi,
  4 Masken, 3 Unschärfen. Die Grenzen gelten auch bei `always`.
- **Sichtung 1 mit dem Betreiber:** Formen- und Oberflächenkatalog.
- Umgesetzt am 10.11.2026; Technik, Browserunterstützung, Messung und Grenzen
  stehen in [EP01-renderer-2.md](EP01-renderer-2.md). Abweichungen vom
  Planwortlaut: Alle Umrisse sind berechnete `clip-path: polygon()`, deshalb
  wird `clip-path: path()` nicht benutzt. Referenzen gibt es für Chromium;
  WebKit wurde im Sichtvergleich geprüft, Firefox nicht. Die Lastgrenzen sind
  die Startwerte des Plans und noch nicht auf einem Mobilgerät gemessen.

### P3 – Generator 0.3.0, Teil A: Ursprungswerke

Neues Modul unter `src/art/generator/v3/`, frei von React und Browser.

- Paletten in OKLCH mit den Strategien harmonisch, komplementär, monochrom und
  frei; Gamut-Behandlung dokumentieren; Ausgabe als Hex.
- Füllungsgen für alle Formen.
- Sechs erzeugende Familien: geometrisch, Farbfeld, Mosaik, organisch (Blobs,
  weiche Radialverläufe), generative Strukturen (Phyllotaxis, Spirale, Lissajous,
  Truchet, rekursive Teilung, konzentrische Ringe), chaotisch (Überlagerung).
  Dazu Linienbündel und Schraffuren mit sichtbarer Strichstärke.
- Ebenenmodell mit bis zu drei Ebenen, Maßstabskontrast (dominante Großform neben
  Kleinteilen), Symmetrie und Dichte.
- Häufigkeitsstufen mit dem festen Standardprofil; das Profil wird als Snapshot
  ins Werk geschrieben.
- Sichtbarkeitsanker und Lastgrenzen als harte Prüfungen mit deterministischen
  Retries.
- **Sichtung 2:** 40 unabhängige Probewerke im Atelier, getrennt vom Archiv.
- Umgesetzt am 10.11.2026; Verfahren, Messung und Grenzen stehen in
  [EP01-generator-3.md](EP01-generator-3.md). Sichtung 2 am selben Tag ohne
  Änderungswünsche bestätigt („sehr gut“); die Stufen 15 / 40 / 70 % bleiben.
  Festlegungen und Abweichungen vom Planwortlaut:
  - Die Probewerke haben ein eigenes Vorschauformat
    (`src/art/schema/preview-v3.ts`) ohne Titel, Datum und Kontextdigest; das
    vollständige Werk im Schema 3 entsteht in P4.
  - Merkmalsentscheidungen hängen nur vom Seed ab, nicht vom Versuch. Bis zu
    16 deterministische Versuche statt der zunächst geplanten acht.
  - Der Sichtbarkeitsanker entsteht in vier Stufen (vorhanden, nach vorn
    geholt, versetzt, ergänzt); je Palette gibt es dafür zwei Reservetöne.
  - `curves` umfasst Bögen, Ringe und Kurvenstriche, `generativeShapes`
    Polygone und gefüllte Kurvenflächen. Blobs und Kreise sind Grundformen.
  - Renderer 2 und Schema 3 blieben unverändert. Die Archiv-Baseline wurde
    nicht ergänzt, weil es noch kein Werk nach dem 10.11. gab.

### P4 – Generator 0.3.0, Teil B: Evolution und Belege

- Vererbung je Ebene und je Merkmalsgruppe (übernehmen, mischen, mutieren, neu).
- Neues Belegverfahren aus 4.3; im Modus `traceable` je Elternteil mindestens ein
  sichtbarer, konkret belegter Beitrag, notfalls über Palette oder Geometrie
  (A-31).
- `off` wandelt vererbte Merkmale um und belegt das mit `constrained`; `always`
  erzwingt ein sichtbares Vorkommen (A-30).
- Mutationsstärke und Mutationssprünge.
- Übergang: Werke im Schema 3 mit Eltern im Schema 2.
- Der Seed bindet einen Digest des vollständigen Snapshots statt nur der
  Revision (A-29).
- Tests: Mehrgenerationsketten je Modus, Manipulationstests analog zu
  `tests/evolution.test.ts` (erfundene Quellen, überdeckte Beiträge), Determinismus.
- Umgesetzt am 11.11.2026; Verfahren, Messung und Grenzen stehen in
  [EP01-evolution-3.md](EP01-evolution-3.md). Die Probeketten wurden am selben
  Tag gesichtet; die Startwerte der Vererbung bleiben. Festlegungen und
  Abweichungen vom Planwortlaut (Betreiberentscheidungen vom 11.11.2026):
  - Schema 3 hat das neue Pflichtfeld `evolution.recipe` (Herkunft je Ebene
    und der Palette, Versuch, Mutationssprung, gezogene Merkmale, Ankerweg).
    Es ist eine Zusammenfassung, kein abspielbares Rezept.
  - Startwerte je Ebene und Palette: `traceable` 35 % je Elternteil, 10 %
    gemischt, 20 % neu; `free` 20 / 10 / 50 %, dazu 35 % vollständige Brüche.
    Mutationsstärke 10 / 25 / 45 / 70 % der Formen; Mutationssprung 10 %.
  - Der Seed-Digest ist ein SHA-256 aus einer eigenen, reinen Funktion; keine
    neue Abhängigkeit.
  - Der Beitrag eines Elternteils wird zuerst an vorhandenen Formen sichtbar
    gemacht; eine neue Form ist der letzte Ausweg (gemessen rund 7 %).
  - Effekte und Bewegung werden unter `off` entfernt, nicht umgewandelt und
    nicht belegt. `always` prüft das Vorkommen, nicht die Sichtbarkeit.
  - `novelty` ist bis P5 ein benannter Platzhalter. Renderer 2 blieb
    unverändert; `compose.ts`, `kit.ts` und `checks.ts` wurden ergänzt, ohne
    die Ursprungs-Probewerke zu verändern.

### P5 – Vielfalt und Extremprofile

- Ähnlichkeitsfenster über die letzten N Werke; Abstandsmaß Version 1 über
  Familien je Ebene, Palette (OKLCH-Abstand), Formarten, Füllarten, Dichte und
  Bewegung.
- `src/automation/plan.ts` reicht den Historienkontext an den Generator; der
  Kontextdigest wird im Werk gespeichert. Nachholläufe erweitern den Kontext
  chronologisch.
- Schwelle aus Simulationen ableiten: je Modus 365 Testtage; Ziel ist, dass
  höchstens etwa jeder zehnte Kandidat verworfen wird.
- Extremprofile mit je mindestens 50 Werken pro Modus: alles `off`, alles
  `always`, nur eine Familie, `wild` (A-35).
- Umgesetzt, mit dem Betreiber gesichtet (Schwelle und Extremprofile
  abgenommen) und veröffentlicht am 11.11.2026 (`acd0140`); Verfahren,
  Messung und Grenzen stehen in [EP01-vielfalt-5.md](EP01-vielfalt-5.md).
  Festlegungen und Abweichungen vom Planwortlaut (Bauplan vom Betreiber am
  11.11.2026 freigegeben):
  - Gewichte: Familien 0,25, Palette 0,25, Formarten 0,15, Füllarten 0,15,
    Dichte 0,10, Bewegung 0,10. Mindestabstand 0,02 für beide Modi; damit
    werden im Modus `traceable` 9,3 % der Kandidaten verworfen, im Modus
    `free` 0,3 %.
  - `src/automation/plan.ts` wurde nicht berührt. Der Generator nimmt die
    Historie als Eingabe; die Verdrahtung im Tagesplaner gehört zur
    Aktivierung in P7.
  - Die Historie geht nicht in den Seed ein, sondern wählt unter den
    deterministischen Versuchen. Schema 3 und Renderer 2 blieben unverändert.
  - Kein Extremprofil war unmöglich; die Regelversion 1 bleibt.

### P6 – Galerie und Detailansicht für Schema 3

- Galerie, Heute-Ansicht, Evolution und `WorkProvenance.tsx` stellen Werke im
  Schema 3 dar; Kacheln bleiben statisch.
- Aufklappbarer Abschnitt „Rahmenbedingungen“ aus dem Snapshot. Alte Werke
  zeigen dort „in dieser Version nicht gespeichert“.
- Der Mutationsbericht nennt umgewandelte Merkmale (`constrained`) ausdrücklich.
- Werkbeschreibung (`description`) für die neuen Familien und Ebenen.
- Umgesetzt, vom Betreiber abgenommen und veröffentlicht am 11.11.2026
  (`9cb062c`); Aufbau, Texte und Grenzen stehen in
  [EP01-ansichten-6.md](EP01-ansichten-6.md). Festlegungen und Abweichungen
  vom Planwortlaut (Bauplan vom Betreiber am 11.11.2026 freigegeben):
  - Werke im Schema 3 werden über vier getrennte Testsammlungen gezeigt
    (nachvollziehbar, frei, Übergang, Umwandlungen); im Archiv liegt keines.
  - Die gespeicherte `description` bleibt unverändert, weil sie der Generator
    schreibt. Die Ansicht zeigt sie und ergänzt eine Liste „Aufbau“ aus der
    DNA.
  - Neue kleine Fixture `ep01-constraints.json`, weil die Probeketten aus P4
    keine Umwandlung enthalten. Gleiche Umwandlungen werden in der Ansicht
    zusammengefasst; jeder Einzelbeleg bleibt aufklappbar.
  - Die Datenprüfung liest mit der neuen Funktion `readArchive`; der
    Tageslauf bleibt bis P7 bei `readWorks`. Der Leser im Browser prüft
    Schema 3 ohne Historie.
  - `novelty` erscheint unter „Rahmenbedingungen“ mit Abstand und Vermerk;
    der Kontextdigest wird nicht angezeigt.
  - Zusätzlich aus der Sichtung: Der Titel der Detailansicht richtet seine
    Größe nach dem längsten Wort, auch bei alten Werken.

### P7 – Kunstabnahme und Aktivierung

- 30–50 neue Testwerke im Standardprofil, beide Modi mit Beispielketten, dazu
  kurze Ketten für zwei bis drei abweichende Profile. Ausdrückliche
  Betreiberabnahme; die Abnahme der alten 40 Werke gilt nicht für 0.3.0.
- Lastprüfung auf einem realen Mobilgerät, reduzierte Bewegung, 320 px.
- Aktivierungsplan vorlegen: `generatorChangeDate`, betroffene Dateien,
  Push-Reihenfolge, Kontrolle des ersten neuen Laufs (Run-ID, Archivcommit,
  Versionen, Eltern, Originalbytes der alten Werke).
- Ab hier erzeugt die Serie mit dem Standardprofil. Die Schalter sind noch nicht
  über die Oberfläche änderbar.
- Umgesetzt am 12.11.2026 bis auf die Aktivierung selbst; Abnahme, Messung,
  Plan und Grenzen stehen in [EP01-abnahme-7.md](EP01-abnahme-7.md).
  Festlegungen und Abweichungen vom Planwortlaut (Bauplan vom Betreiber am
  12.11.2026 freigegeben):
  - 58 Abnahmewerke (40 im Standardprofil, drei Profilketten „Ruhig“, „Wild“,
    „Reduziert“) als fünf Sammlungen; am 12.11.2026 abgenommen und per
    SHA-256 eingefroren. Mindestabstand 0,02 bleibt für beide Modi.
  - Lastgrenzen aus P2 nach Messung auf iPhone 13 (Safari) und MacBook
    (Chrome) bestätigt; Firefox bleibt offen.
  - Die Verdrahtung im Tagesplaner ist gebaut, aber inaktiv
    (`generatorChangeDate = null`). Datum, Nachweis in `config/release.json`
    und Push brauchen eine eigene Freigabe.
  - Der Tageslauf liest die Konfiguration weiter strikt als Schema 1 und
    holt nur das Profil über `readGenerationConfig`; Schema 2 im Tageslauf
    folgt mit P8.

### P8 – Betreiberoberfläche

- Worker: Validierung mit dem geteilten Regelmodul, nur freigegebene Schlüssel
  schreibbar, `revision` erhöhen, konfliktfestes Schreiben wie bisher (A-28).
- Sieben Bereiche (Evolution, Formen, Oberfläche, Farbe, Komposition, Bewegung,
  Experimente), ab 320 px, Touch-Flächen ab 44 px, ein Erklärsatz je Schalter.
- Vorschau im Browser mit derselben Generator- und Rendererbibliothek: 6–9
  Probewerke, zwei Probe-Eltern mit mindestens einem Kind, „Neu würfeln“, keine
  Dateien, IDs oder Commits (A-33).
- Änderungszusammenfassung gegenüber der gespeicherten Revision und Warnung bei
  vielfaltverringernden Kombinationen. Erfolg wird erst nach bestätigter
  Speicherung angezeigt.
- Zusätzlicher Vite-Einstieg, ausgeliefert als Worker-Asset in derselben Origin;
  CSP gezielt anpassen. Echte Cloud-Prüfung nur nach eigener Freigabe.

### P9 – Abschluss

`README.md`, `docs/architecture.md`, `docs/runbook.md`, `HANDOFF` und
`NEXT-START` auf den neuen Stand bringen; Restgrenzen ehrlich festhalten.

## 6. Zuordnung der Akzeptanzkriterien

| Kriterium                               | Paket      |
| --------------------------------------- | ---------- |
| A-28 Schalter in der Oberfläche         | P8         |
| A-29 Snapshot und Determinismus         | P3, P4     |
| A-30 `off` / `always` / `constrained`   | P4         |
| A-31 Beiträge beider Eltern             | P4         |
| A-32 unmögliche Kombinationen           | P1, P8     |
| A-33 Vorschau ohne Archivwirkung        | P8         |
| A-34 neue Formen ohne Bild, SVG, Canvas | P2         |
| A-35 Extremprofile                      | P5         |
| A-36 Archiv unverändert                 | P0, danach |
| A-37 alte Konfiguration bleibt gültig   | P1         |

## 7. Betreiberentscheidungen vom 10.11.2026

Alle acht Fragen wurden am 10.11.2026 mit dem Betreiber durchgegangen und
entschieden. Sie sind Vorgaben für die Arbeitspakete, aber kein Auftrag zur
Umsetzung, zum Push oder zur Aktivierung.

| Nr. | Frage                           | Entscheidung                                                                                          |
| --- | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | Serie                           | Datierter Versionswechsel in der laufenden Serie (`generatorChangeDate`); keine neue Serie            |
| 2   | Fachquelle                      | `docs/PRD.md` v1.1 mit EP-01 und diesem Plan; `PRD_1_2.md` bleibt Hintergrund und unversioniert       |
| 3   | Belegblöcke im Raster           | Entfallen im Generator 0.3.0; ersetzt durch das Verfahren in 4.3                                      |
| 4   | Mindestabstand nicht erreichbar | Abstandsstärksten Kandidaten archivieren und im Werk vermerken; kein Stopp des Laufs                  |
| 5   | Reihenfolge                     | Erst Kunst mit festem Standardprofil aktivieren (P7), danach Schalteroberfläche (P8)                  |
| 6   | Häufigkeitsstufen               | Start mit 15 % / 40 % / 70 %; nach Sichtung 2 nachstellen                                             |
| 7   | Lastgrenzen                     | Vorsichtige Startwerte aus P2; endgültig nach Messung auf einem Mobilgerät                            |
| 8   | Einstellungsoberfläche          | Eine Seite mit aufklappbaren Bereichen, Vorschau darunter; Schnellprofile „Standard“, „Ruhig“, „Wild“ |

Zu Nr. 4: Das weicht bewusst von EP-01 Abschnitt 7 ab („stoppt der Lauf ohne
Teilarchivierung“). Sicherheits-, Sichtbarkeits- und Lastgrenzen sowie die
Elternbeiträge im Modus `traceable` bleiben harte Bedingungen; nur der
Mindestabstand darf verfehlt werden. Das Werk speichert dann den erreichten
Abstand und den Vermerk „Mindestabstand nicht erreicht“, und die Detailansicht
zeigt ihn unter „Rahmenbedingungen“.

Weiter offen: das konkrete Werkdatum des Wechsels (Freigabe der Aktivierung).
Entschieden sind Schwelle und Gewichte des Abstandsmaßes (P5, in P7 bestätigt)
und die Lastgrenzen (am 12.11.2026 nach der Gerätemessung bestätigt).

## 8. Risiken

- **Belegverfahren:** Die Sichtbarkeitsprüfung arbeitet mit Bounding-Boxen. Bei
  gedrehten oder beschnittenen Formen ist sie konservativ, nicht exakt. Belegende
  Elemente bleiben deshalb ungedreht und unbeschnitten, bis eine genauere Prüfung
  nachgewiesen ist.
- **Renderer-Einfrieren:** Fehler in Renderer 2 lassen sich nach dem ersten
  archivierten Werk nur über Renderer 3 beheben. P2 braucht deshalb vollständige
  Referenzen in drei Browsern.
- **Renderlast:** Blendmodi, Unschärfe und viele Clip-Pfade kosten auf
  Mobilgeräten Zeit, auch bei wenigen Elementen.
- **Übergangsgenerationen:** Die ersten beiden neuen Werke haben alte Eltern mit
  kleinem Vokabular. Der sichtbare Sprung in der Kette ist gewollt, sollte aber
  in der Detailansicht erklärt werden.
- **Umfang:** P2 bis P5 sind der größte Teil. Sie lassen sich nicht sinnvoll
  parallel zur Serienbetreuung in einem Schritt erledigen; jedes Paket ist ein
  eigener Auftrag.
