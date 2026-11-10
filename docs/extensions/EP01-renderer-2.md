# Evolvera – EP-01: Renderer 2 und Musterbogen (P2)

Stand: 10.11.2026 · Status: veröffentlicht (e4567f2); Sichtung 1 am 10.11.2026 ohne Änderungswünsche bestätigt

Renderer 2 stellt Werke im Schema 3 dar (`rendererVersion: "2"`). Er ist noch
nicht eingefroren: Solange kein Werk mit ihm archiviert ist (frühestens P7),
dürfen Technik, Wertebereiche und Lastgrenzen noch geändert werden. Renderer 1
(`ArtRenderer.tsx`, `ArtV1.module.css`) ist unverändert.

## Aufbau

- `src/art/renderer/ArtRendererV2.tsx` und `ArtV2.module.css`: Rahmen, logische
  Fläche 1000 × 1000 mit einheitlicher Skalierung wie bei Renderer 1, ein
  DOM-Knoten je Element, keine Wrapper.
- `src/art/renderer/v2/geometry.ts`: rechnet Formgene in Polygonpunkte um.
- `src/art/renderer/v2/paint.ts`: baut Füllungen und Effekte als CSS-Werte.
- `src/art/renderer/ArtDispatch.tsx` wählt nach `rendererVersion`;
  `ArtStage.tsx` benutzt den Dispatch und erkennt Bewegung über
  `src/art/renderer/motion.ts` in beiden Versionen.
- CSS-Werte entstehen ausschließlich aus validierten Zahlen, Hex-Farben und
  Aufzählungen. Kein `<img>`, `<svg>`, `<canvas>`, kein `url(...)` (A-34).

Der Elementknoten trägt Position, Drehung, Deckkraft, Blendmodus, Filter,
Maske und Bewegung. Umriss und Füllung liegen auf seinem Pseudoelement
`::before`. Dadurch schneidet der Umriss Unschärfe und Schatten nicht ab, und
es entsteht kein zusätzlicher DOM-Knoten.

## Technik je Baustein

| Baustein                        | Technik                                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Rechteck, Linie                 | Fläche ohne Umriss; die Linie ist ein Rechteck, ihre Höhe ist die Strichstärke                           |
| Kreis, Ellipse                  | `border-radius: 50%`                                                                                     |
| Blob                            | `border-radius` mit acht Radien                                                                          |
| Polygon                         | `clip-path: polygon()` aus den gespeicherten Punkten                                                     |
| Ring                            | `clip-path: polygon(evenodd, …)`: äußere und innere Ellipse, das Innere bleibt frei                      |
| Bogen, Halbkreis                | geschlossenes Polygon zwischen äußerem und innerem Ellipsenbogen; 0° oben, im Uhrzeigersinn              |
| Geschlossener Pfad              | Kurven in je zwölf Teilstrecken geglättet, als Polygon gefüllt                                           |
| Kurvenstrich (offener Pfad)     | Umriss der geglätteten Linie in voller Strichstärke als geschlossenes Polygon, Stöße abgeschrägt         |
| Vollfarbe, Verläufe             | `background` mit `linear-`, `radial-` und `conic-gradient`, zwei bis vier Farbstopps                     |
| Streifen, Raster                | `repeating-linear-gradient`, mit eigenem Winkel                                                          |
| Punkte, Schachbrett, Truchet    | gekachelte `radial-`/`conic-gradient`; kein eigener Winkel, sie drehen sich mit dem Element              |
| Ringe                           | `repeating-radial-gradient`                                                                              |
| Blendmodus                      | `mix-blend-mode` (fünf Werte); die Fläche trägt den Hintergrund, damit innerhalb des Werks gemischt wird |
| Unschärfe, Schatten             | `filter: blur()` und `drop-shadow()` am Elementknoten                                                    |
| Verlaufsmaske                   | `mask-image` (zusätzlich `-webkit-mask-image`) mit linearem oder radialem Verlauf                        |
| Bewegung                        | dieselben drei Animationen wie Renderer 1; Kacheln ruhen, `prefers-reduced-motion` wird beachtet         |
| Spirale, Phyllotaxis, Lissajous | keine Renderer-Mathematik: der Generator schreibt einzelne Kreise in die DNA                             |

Sichtbare Bögen und Kurvenstriche: Ein offener Clip-Pfad hätte keine Fläche.
Deshalb rechnet der Renderer jeden Strich als geschlossene Fläche aus (Bogen:
Band zwischen zwei Ellipsen; Pfad: Umriss der Linie). Gestrichene Pfade werden
um die halbe Strichstärke nach innen gesetzt, damit der Strich vollständig in
der Elementfläche liegt. `clip-path: path()` und `shape()` werden nicht
benötigt, ebenso keine Rückfallebene.

## Browserunterstützung

Quelle: MDN Browser Compat Data (`mdn/browser-compat-data`, Zweig `main`,
gelesen am 10.11.2026). Angegeben ist jeweils die erste Version ohne Präfix.

| Technik                                 | Chrome | Firefox | Safari |
| --------------------------------------- | ------ | ------- | ------ |
| `clip-path` mit `polygon()`             | 55     | 54      | 10.1   |
| `conic-gradient`                        | 69     | 83      | 12.1   |
| `repeating-linear-/radial-gradient`     | 26     | 16      | 7      |
| `mix-blend-mode`                        | 41     | 32      | 8      |
| `filter`                                | 53     | 35      | 9.1    |
| `mask-image` (davor mit `-webkit-`)     | 120    | 53      | 15.4   |
| `rotate` (schon von Renderer 1 benutzt) | 104    | 72      | 14.1   |

Zum Vergleich, bewusst nicht benutzt: `clip-path: path()` (88 / 71 / 13.1) und
`shape()` (135 / 148 / 18.4).

Tatsächlich geprüft am 10.11.2026 mit den lokal installierten
Playwright-Browsern: Chromium und WebKit zeigen alle sieben Bögen ohne
Seitenfehler und im Bild übereinstimmend (Sichtvergleich von Effekten,
Mustern und Komposition). **Firefox wurde nicht geprüft**: Er startet in der
Sandbox dieser Sitzung nicht. Safari und Firefox auf echten Geräten sind
ebenfalls offen.

## Musterbogen

`fixtures/preview/ep01-catalog.json`, von Hand entworfen (nicht aus dem
Generator), geprüft durch `src/art/schema/catalog.ts`, sichtbar unten im
Testatelier (`#/atelier`). Sieben Bögen: Formen, Füllungen, Muster, Effekte,
Linien und Bögen, Ebenen und Bewegung, Lastgrenze. Zusammen decken sie alle
neun Formarten, fünf Füllarten, sechs Muster, fünf Blendmodi, Unschärfe,
Schatten, beide Masken und alle Bewegungsarten ab; ein Test stellt das sicher.
Neue Referenzbilder `renderer-v2-<Bogen>.png` bei 320 px und Desktop.

## Lastgrenzen

Im Schema 3 als harte Prüfung (`loadLimitsV3` in
`src/art/schema/artwork-v3.ts`), mit den Startwerten des Plans:

| Grenze                           | Wert |
| -------------------------------- | ---- |
| Elemente gesamt                  | 120  |
| davon Punkte (Kreise bis 0,04)   | 60   |
| Elemente mit Clip-Pfad           | 40   |
| Pfade                            | 8    |
| Blendmodi                        | 6    |
| Masken                           | 4    |
| Unschärfen und Schatten zusammen | 3    |

Der Bogen „Lastgrenze“ liegt genau an allen sieben Grenzen. Messung am
10.11.2026 in Chromium ohne Bildschirm, 390 × 844 Pixel, Gerätepixel 3, fünf
Sekunden je Lauf, 48 laufende Animationen: Abstand der Bildaufrufe im Median
16,7 ms, 95 % bis 16,8 ms, kein Abstand über 50 ms, auch bei CPU-Drosselung
Faktor 4 und 6.

Grenzen dieser Messung: Sie misst nur den Takt des Hauptthreads, nicht das
Zeichnen und Zusammensetzen auf einer Grafikkarte, und sie lief nicht auf
einem Mobilgerät. Sie widerlegt die Startwerte nicht, bestätigt sie aber auch
nicht endgültig. Die Werte bleiben deshalb Startwerte; die Entscheidung fällt
nach der Messung auf einem realen Mobilgerät in P7 (Betreiberentscheidung 7).

## Änderungen am Schema 3 in P2

- Lastgrenzen als Prüfung der DNA.
- Gekachelte Muster (Punkte, Ringe, Schachbrett, Truchet) tragen den Winkel 0;
  nur Streifen und Raster haben eine eigene Richtung. So gibt es kein
  gespeichertes Merkmal ohne sichtbare Wirkung.
- Eine Verlaufsmaske blendet von `from` nach `to` aus; `from` liegt vor `to`.
