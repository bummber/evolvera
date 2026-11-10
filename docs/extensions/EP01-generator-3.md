# Evolvera – EP-01: Generator 0.3.0, Teil A – Ursprungswerke (P3)

Stand: 11.11.2026 · Status: veröffentlicht (f4e292b am 11.11.2026); Sichtung 2 am 10.11.2026 ohne Änderungswünsche bestätigt

Generator 0.3.0 erzeugt in diesem Paket nur unabhängige Ursprungswerke im
Schema 3 für Renderer 2. Es gibt noch keine Vererbung und keine Belege (P4),
kein Ähnlichkeitsfenster (P5), keinen Einbau in den Tageslauf und kein
`generatorChangeDate`. Kein Werk im Schema 3 liegt im Archiv. Generator 0.1.0
und 0.2.0 (`study.ts`, `evolve.ts`, `provenance.ts`) sind unverändert.

## Aufbau

Alles liegt unter `src/art/generator/v3/` und ist frei von React, Browser,
Uhrzeit und Dateizugriff (durch einen Test belegt). Zufallsquelle ist das
vorhandene `random.ts` (FNV-1a und Mulberry32), unverändert.

| Datei         | Aufgabe                                                                         |
| ------------- | ------------------------------------------------------------------------------- |
| `index.ts`    | Einstieg `generateOriginV3({ seed, settings })`, Versuche, Beschreibung         |
| `compose.ts`  | Merkmalsentscheidungen, Ebenenplan, Füllungsgarantien, Anker, Effekte, Bewegung |
| `families.ts` | sechs Familien, dazu Linienbündel, Kurvensatz und Polygonsatz                   |
| `kit.ts`      | Elementbau, Spiegelung, Lastbudget, Ebenenkontext                               |
| `palette.ts`  | OKLCH-Paletten, Gamut-Behandlung, Kontrast                                      |
| `fills.ts`    | Füllungsgen: Vollfarbe, drei Verlaufsarten, sechs Muster                        |
| `checks.ts`   | Sichtbarkeitsanker, Überdeckungsprüfung, Merkmalszählung                        |

Abweichung vom Bauplan: Die Familien stehen in einer Datei statt in sechs, und
die Häufigkeitsstufen stehen in `compose.ts` statt in einer eigenen Datei.

Jede Entscheidungsgruppe (Merkmale, Palette, Ebenenplan, jede Ebene, Ergänzungen,
Füllungen, Anker, Effekte, Bewegung) zieht aus einem eigenen, aus dem Seed
abgeleiteten Zufallsstrom. Eine spätere Änderung an einer Familie verschiebt
dadurch nicht alle anderen Entscheidungen.

## Vorschauvertrag

`src/art/schema/preview-v3.ts`: Ein Probewerk enthält Seed, Generator- und
Rendererversion, Versuchsnummer, den vollständigen Einstellungssnapshot
(`inheritanceMode` und das ganze Profil), ein Rezept (Palettenstrategie,
gezogene Merkmale, Herkunft des Ankers), eine Beschreibung und die DNA. Es hat
bewusst keinen Titel, kein Datum, keine Eltern und keine Werk-ID; das
vollständige Werk im Schema 3 entsteht mit der Evolution in P4
(Betreiberentscheidung vom 10.11.2026).

## Paletten und Gamut

Eine Palette besteht aus Hintergrund und fünf Farben, gerechnet in OKLCH:

- **harmonisch:** fünf benachbarte Farbtöne in einem Fächer von 40° bis 70°.
- **komplementär:** zwei gegenüberliegende Tongruppen (drei und zwei Farben).
- **monochrom:** ein Farbton (±4°), gestaffelt in Helligkeit und Sättigung.
- **frei:** fünf unabhängige Farbtöne.

Der Grund ist dunkel (45 %), hell (45 %) oder ein gesättigter Mittelton
(10 %). Der Schalter „Kontrast“ legt die Helligkeitsspanne der fünf Farben
fest: `low` 0,25, `high` 0,6, `varied` je Werk zwischen beiden. Die stärkste
Farbe erreicht gegen den Grund immer mindestens Kontrast 3 (WCAG-Verhältnis).

**Gamut-Behandlung:** OKLCH wird über OKLab (Matrizen von Björn Ottosson) in
lineares sRGB umgerechnet. Liegt eine Farbe außerhalb von sRGB (Toleranz
0,0001 je Kanal), bleiben Helligkeit und Farbton erhalten; nur die Sättigung
wird in 20 Bisektionsschritten so weit gesenkt, bis die Farbe passt. Danach
wird jeder Kanal begrenzt, gammakodiert und auf 8 Bit gerundet. Das ist die
vereinfachte Form des Verfahrens aus CSS Color 4 (dort zusätzlich mit einer
Wahrnehmungsschwelle). Archiviert wird ausschließlich Hex; der Renderer
rechnet keine Farbe neu. Tests prüfen die sRGB-Grundfarben, das Verhalten
außerhalb des Gamuts und ein Raster über den ganzen Raum.

Zu jeder Palette gehören zwei Reservetöne (sehr dunkel und sehr hell im
Grundfarbton). Sie werden nur für den Sichtbarkeitsanker benutzt, und nur
dort, wo keine Palettenfarbe gegen den Untergrund lesbar ist.

## Häufigkeitsstufen und Merkmale

Je Werk und Merkmalsgruppe: `off` 0 %, `rare` 15 %, `normal` 40 %,
`often` 70 %, `always` 100 %. Die Entscheidung hängt nur vom Seed ab, nicht
vom Versuch: Eine Wiederholung komponiert anders, ändert aber nie, was
gezogen wurde. Was gezogen wurde, kommt im Werk sicher vor; was nicht gezogen
wurde, kommt nicht vor. Eine Zählung der fertigen DNA prüft beides.

| Merkmal            | Bedeutung in der DNA                                                  |
| ------------------ | --------------------------------------------------------------------- |
| `gradients`        | lineare, radiale oder konische Füllung                                |
| `patterns`         | Musterfüllung (Streifen, Raster, Punkte, Ringe, Schachbrett, Truchet) |
| `masks`            | Verlaufsmaske auf ein bis zwei Elementen                              |
| `blendModes`       | Blendmodus auf ein bis drei Elementen                                 |
| `blurShadow`       | Unschärfe oder Schatten auf ein bis zwei Elementen                    |
| `lines`            | Elementart `line`; immer als Bündel, Schraffur oder Fächer            |
| `curves`           | Bögen, Ringe und Kurvenstriche (gestrichene Pfade)                    |
| `generativeShapes` | Polygone und gefüllte Kurvenflächen                                   |
| `animation`        | mindestens ein bewegtes Element; Anteil und Ausschlag nach Intensität |
| Symmetrie          | Spiegelung an der senkrechten Mittelachse                             |

Kreise, Ellipsen, Rechtecke und Blobs sind Grundformen und von keinem Schalter
abhängig. Linien haben eine Strichstärke von mindestens 0,006 der Fläche
(rund 1,7 Gerätepixel bei 280 Pixel Werkbreite).

## Familien und Ebenen

- **geometrisch:** eine dominante Großform neben kleinen Teilen
  (Maßstabskontrast), wahlweise an einem lockeren Raster ausgerichtet.
- **Farbfeld:** randlose Bänder oder gestapelte Felder mit Rand.
- **Mosaik:** Raster aus Rechtecken, Kreisen, Bögen oder Dreiecken, einheitlich
  oder gemischt, mit Lücken.
- **organisch:** Blobs mit weichen Radialverläufen, Kurvenflächen, Kurvenstriche.
- **generative Strukturen:** Phyllotaxis, Spirale, Lissajous (als einzelne
  Kreise in der DNA), Truchet-Kacheln, rekursive Teilung, konzentrische Ringe.
- **chaotisch:** Überlagerung vieler gedrehter, durchscheinender Formen.

Ein Werk hat eine Ebene (25 %), zwei (45 %) oder drei (30 %), begrenzt durch
`maxLayers`. Jede Ebene bekommt eine Familie; die Rolle der Ebene gewichtet
die Auswahl, und ein Werk benutzt nach Möglichkeit keine Familie doppelt.
Hintergründe sind ruhiger und nehmen die schwächeren Farben, Akzente sind
kleiner und nehmen die stärksten. Die Dichte (`sparse`, `varied`, `dense`)
steuert die Elementzahl je Familie.

## Harte Prüfungen

- **Lastgrenzen:** Ein gemeinsames Budget zählt beim Hinzufügen mit; ein
  Element, das eine Grenze aus `loadLimitsV3` überschreiten würde, entsteht
  nicht. Zusätzlich prüft das Schema die fertige DNA.
- **Sichtbarkeitsanker** nach Plan 4.3: mindestens 0,12 × 0,12, Deckkraft ab
  0,65, vollständig in der Fläche, ungedreht, ohne Clip-Pfad, ohne Effekt,
  unbewegt, von keinem späteren Element überdeckt, Kontrast mindestens 2 gegen
  den Hintergrund und gegen alle Füllfarben überlappender Elemente darunter.
  Die Überdeckung wird für gedrehte Rechtecke und Linien exakt geprüft
  (Trennachsenverfahren); andere Umrisse gelten vorsichtig als ihr Kasten.
- **Weg zum Anker**, in dieser Reihenfolge: eine Form erfüllt die Regeln
  bereits (`natural`); eine Form der obersten Ebene kommt nach vorn und wird
  gerade gestellt, bei Bedarf umgefärbt (`promoted`); eine Form der obersten
  Ebene wandert an einen lesbaren Platz und wächst höchstens bis zur
  Mindestgröße (`moved`); erst danach kommt eine neue Form dazu (`added`).
  Der Platz wird unter allen gut lesbaren Plätzen zufällig gezogen.
- **Versuche:** Scheitert eine Prüfung, folgt der nächste Versuch mit dem
  Seed-Zusatz `retry-n`, höchstens 16 Versuche, danach ein Fehler. Nichts
  wird gelockert.

## Messung

20 000 Seeds im Standardprofil (lokal, Node 24): kein Fehlschlag. 92,9 %
gelingen im ersten Versuch, 5,9 % im zweiten; der höchste benötigte Versuch
war der siebte. Anker: 28 % `natural`, 29 % `promoted`, 24 % `moved`, 19 %
`added`. Rund 2,6 ms je Werk.

Extremprofile sind erst Teil von P5 (A-35). Vorab durch Tests belegt: je 300
Werke mit allen Merkmalen auf `off` und auf `always`, je 150 Werke mit nur
einer der sechs Familien, dazu eine Ebene, eine Palettenstrategie, Dichte und
Bewegungsintensität.

## Probewerke

`fixtures/preview/ep01-origins.json`: 40 Probewerke aus den fortlaufenden
Seeds `evolvera:ep01:origin:1` bis `…:40` im Standardprofil, ohne Auswahl.
`scripts/origin-fixtures.ts` erzeugt sie (`--write`) und prüft in
`npm run validate:data`, dass der Generator sie unverändert reproduziert.
Sichtbar unten im Testatelier (`#/atelier`), getrennt vom Archiv. Der Abschnitt
wird als eigener Chunk nachgeladen, damit das Atelier nicht auf die Prüfung
der 40 Werke wartet.

| Merkmal der 40    | Verteilung                                                                                                                                |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Ebenen            | eine: 9, zwei: 22, drei: 9                                                                                                                |
| Familien (Ebenen) | geometrisch 20, Mosaik 16, Farbfeld 13, generativ 11, organisch 10, chaotisch 10                                                          |
| Palette           | komplementär 18, frei 11, harmonisch 7, monochrom 4                                                                                       |
| Merkmale          | Symmetrie 20, Verläufe 15, Linien 15, Bewegung 13, Muster 11, generative Formen 11, Blendmodi 8, Unschärfe/Schatten 8, Masken 6, Kurven 4 |
| Anker             | natural 13, promoted 11, moved 8, added 8                                                                                                 |
| Versuche          | erster: 38, zweiter: 2                                                                                                                    |
| Elemente          | 4 bis 60                                                                                                                                  |

Die Fixture ist bis zur Kunstabnahme (P7) nicht eingefroren: Nach einer
bewussten Änderung am Generator wird sie neu erzeugt und neu gesichtet.

Neue Browserreferenzen: zwölf Bilder `generator-v3-<id>.png`, je eines pro
Familie bei 320 px und Desktop. Alle 40 Werke werden im Browser auf
vollständige Darstellung, Ruhezustand und fehlende Bild-, SVG- oder
Canvas-Kunst geprüft.

## Grenzen

- **Determinismus zwischen Laufzeiten:** `Math.sin`, `Math.cos` und
  Potenzen sind zwischen JavaScript-Engines nicht garantiert bitgleich. Alle
  Zahlen der DNA sind auf sechs Nachkommastellen gerundet, Farben auf 8 Bit;
  das fängt Abweichungen praktisch ab, ist aber kein Beweis. Geprüft ist nur
  Node 24. Für die Vorschau im Browser (P8) ist das erneut zu prüfen.
- **Spiegelung:** Gekachelte Muster (Punkte, Ringe, Schachbrett, Truchet)
  werden nicht gespiegelt; ein Verlauf auf einer Form genau auf der Achse
  bleibt einseitig. Ein Anker auf der Achse steht ohne Spiegelbild.
- **Anker:** Bei rund jedem fünften Werk kommt eine eigene Form für den Anker
  dazu. In Sichtung 2 wurde das nicht beanstandet.
- **Häufigkeiten:** Die Stufen 15 / 40 / 70 % sind Startwerte
  (Betreiberentscheidung 6). In Sichtung 2 wurde keine Änderung gewünscht;
  sie bleiben bis auf Weiteres.
- **Nicht geprüft:** Firefox, Safari und echte Geräte; Renderlast der
  erzeugten Werke auf einem Mobilgerät (P7).

## Unverändert

`study.ts`, `evolve.ts`, `provenance.ts`, Titelgenerator, `ArtRenderer.tsx`,
`ArtV1`, `artwork.ts`, `artwork-v3.ts`, Renderer 2, `config/*.json`, Worker,
Workflows, Archivdateien, `fixtures/preview/phase-*.json`, der Musterbogen und
alle bestehenden Browserreferenzen. Keine neue Abhängigkeit. Geändert wurden
an Bestandsdateien nur `src/app/Atelier.tsx` (ein Abschnitt), `shell.css`
(eigene Klassen für diesen Abschnitt) und `package.json` (ein zusätzlicher
Prüfaufruf in `validate:data`).
