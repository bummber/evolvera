# Phase 1 – Kunst-DNA und Renderer

Stand: 28.10.2026. Nach der gemeinsamen Sichtung der Phase 0 und der Übernahme von
Design A hat der Betreiber die lokale Weiterarbeit beauftragt. Umgesetzt wurde das
nächste abgegrenzte Paket aus dem PRD: Phase 1. Keine Phase 2, Veröffentlichung oder
Serienfreigabe.

## Ergebnis

Unter `/evolvera/#/atelier` gibt es ein getrenntes Testatelier mit zwölf gespeicherten
unabhängigen Studien (vier pro Familie), einem Seed-Eingabefeld und einem Hauptwerk.
Die Familie ist wählbar. Derselbe Seed und dieselbe Generatorversion liefern genau
dieselben Parameter. Eine Studie im Atelier ist kein offizielles Tageswerk, keine
Elternkette und noch keines der 30–50 Werke aus beiden Modi zur späteren Kunstabnahme.

- **Geometrische Konstellation:** frei verteilte Kreise, Ellipsen, Rechtecke und Linien;
  statische Elemente und zurückhaltende Dreh-/Schwebebewegung.
- **Farbfeld / Minimalismus:** wenige große Flächen, horizontale oder vertikale
  Anordnung; statisch.
- **Mosaik / Raster:** vier bis sieben Spalten mit Wiederholungen und lokalen
  Ordnungsbrüchen; einzelne pulsierende Elemente.

`generateStudy` erzeugt nur Preview-DNA. Er nimmt weder Uhr, Werkdatum, Eltern noch
Einstellungsrevision entgegen und schreibt keine Dateien. Es werden keine Evolution
oder Titel simuliert. Feste Familienbezeichnungen ersetzen keine poetischen Werktitel.
Standardmodus und Einstellungsrevision bleiben im offiziellen Config-Vertrag erhalten;
in Phase 1 gibt es noch keine modusspezifische Generierung.

## Determinismus und Sichtbarkeit

Generatorversion `0.1.0`: FNV-1a über UTF-16-Codeeinheiten hasht die Seed-Zeichenfolge
auf uint32, Mulberry32 erzeugt daraus Werte in `[0,1)`. Die genaue Implementierung
liegt in `random.ts` und wird mit einem festen Referenzvektor gesichert. Das Verfahren
dient der Kunstgenerierung und ist nicht für Sicherheitsentscheidungen geeignet.
Seed, Familienkennung, Generatorversion und Retry-Nummer gehen in den Zufallszustand
ein. `Math.random`, Systemzeit und Browserzustand sind keine Zufallsquellen.

Die DNA wird strikt validiert. Geschlossene Farb-/Formwerte, positive Größen und
begrenzte Positionen verhindern beliebige CSS-Injektionen. Ein abschließender,
oben liegender statischer Akzent mit ausreichender Größe und mindestens 3:1 Kontrast
zum Hintergrund ist eine einfache Sichtbarkeitsleitplanke; kein ästhetisches Urteil.
Ein deterministischer Retrypfad ist auf vier Versuche begrenzt. In den aktuellen
300 geprüften Seed-/Familienfällen war keine erneute Auswahl nötig. Grundrechtecke
bleiben innerhalb der logischen Fläche; gedrehte Formen dürfen am Rand beschnitten
werden. Alle Kompositionen bleiben auf höchstens 50 Formen begrenzt.

Die zwölf Referenz-DNA liegen separat in `fixtures/preview/phase-1.json`.
`npm run validate:data` vergleicht sie mit der Generierung und prüft zusätzlich das
leere offizielle Archiv. Eine Generatoränderung kann gespeicherte Referenzen nicht
still überschreiben. Der Erzeugungsbefehl `npm exec tsx -- scripts/preview-fixtures.ts
--write` erstellt ausschließlich diese neue Previewdatei und verweigert das
Überschreiben einer vorhandenen Datei. Reguläre Prüfung benötigt kein Schreibflag.

## Renderer V1

`ArtRenderer` dispatcht anhand der gespeicherten `rendererVersion`. Unbekannte
Versionen und ungültige DNA zeigen einen Fehler statt einer Ersatzkomposition.
Die Darstellungsparameter stammen ausschließlich aus der DNA. Kein Zufall beim
Rendern und kein erneutes Generieren beim Öffnen.

Die interne Kunstfläche ist 1000 × 1000 logische Einheiten groß. Ein ResizeObserver
skaliert die gesamte Ebene einheitlich anhand der verfügbaren Breite. Positionen,
Größen und Bewegung werden in dieser einen Ebene beschrieben und gemeinsam skaliert.
Bei älteren Umgebungen ohne ResizeObserver existiert ein Window-Resize-Fallback.
Der Renderer benutzt versionierte CSS-Module, explizite Resets, eine begrenzte
Malfläche und getrennte Transformations-/Rotationsregeln. Er setzt keine Bildassets,
SVGs, Canvas oder WebGL ein. Für weitere Rendereränderungen gilt Versionsdisziplin:
keine stillen Änderungen am historischen Aussehen eines archivierten Werks.

`rest` ist der feste, sichtbare Ursprung der gespeicherten Komposition. Vorschaubilder
verwenden immer diesen Zustand und besitzen keine laufenden Animationen. Nur die
Hauptansicht kann animieren. Bei reduzierter Bewegung startet sie statisch. Bewusstes
Abspielen erlaubt eine persönliche Ausnahme; Pausieren hält den aktuellen Moment
fest. Ein Wechsel zur nächsten Studie setzt die Wiedergabe entsprechend der
Systempräferenz neu auf. Keine dieser Besucheraktionen verändert die globale Config.

## Tatsächlich ausgeführte Prüfungen

- `npm run check`: Formatierung, ESLint ohne Warnungen, TypeScript, **55 Tests**,
  Config-/Archivprüfung, deterministischer Vergleich aller zwölf Preview-DNA und Build.
- Generatortests: **300 Seed-/Familienfälle** auf gültige DNA, unterschiedliche
  Resultate, Sichtbarkeitsanker, Größen-/Lastgrenzen; Referenzvektor, keine Systemzeit
  oder `Math.random`, Abweisung ungültiger Eingaben und offizieller Werkaufträge.
- Renderertests: ausschließlich erlaubte DOM-Elemente, strikte Eingabe-/Versionsgrenze,
  gespeicherte Werte, Textescaping und Wiedergabesteuerung.
- `npm run test:browser`: **14 Fälle erfolgreich**, bestehende Shell plus Atelier
  in gepinntem Chromium auf Desktop und 320px Mobilbreite. Geprüft sind feste Ruhe-
  kacheln, Seedwechsel/Reproduktion, Skalierung, reduziertes Startverhalten,
  explizites Abspielen, Pausieren nach Abschluss des Browser-Pausevorgangs,
  keine unerlaubten Kunstelemente, Direktlinks, Navigation und Fehlerzustände.
- **Sechs visuelle Referenzen** für drei Familien auf Desktop/Mobil wurden erstellt,
  gesichtet und danach in einem normalen Browserlauf ohne Updateflag erfolgreich
  verglichen. Sie liegen ausschließlich unter `tests/browser/references` und sind
  kein Produktionsformat. Feste Browser-/Lockfileversion, fester Animationszustand,
  Farbschwelle 0,25 und maximal 1 % abweichende Pixel bilden die Toleranz. Die
  gemeinsamen Dateinamen erlauben denselben Vergleich in CI; der Linux-CI-Lauf ist
  noch nicht ausgeführt und die Betriebssystemtoleranz dort noch zu bestätigen.
- Zusätzliche Sichtung im integrierten Browser. Devserver bleibt für die gemeinsame
  Durchsicht lokal erreichbar. Keine neuen Abhängigkeiten erforderlich.

Der breite Seedtest fand zunächst einzelne unrotierte geometrische Rechtecke knapp
außerhalb der Fläche. Die Begrenzung wurde korrigiert, ohne eine der zwölf gespeicherten
Referenz-DNA zu ändern. Der Pausentest wartet auf den abgeschlossenen browserinternen
Pausevorgang, bevor er den eingefrorenen Moment über weitere Frames vergleicht.

## Grenzen und nächster Schritt

Dies sind erste unabhängige Studien, keine künstlerische Endabnahme. Paletten und
Formfamilien sind ein Ausgangspunkt; neue Oberflächeneffekte, feinere Kompositionen
und spätere Vererbung werden eigene, versionierte Erweiterungen. Es gibt noch keine
Elternbeiträge, Mutation zwischen Werken oder poetischen Titel.

Kein physisches Smartphone-/GPU-Profiling, keine FPS-Zusage und keine vollständige
Mehrbrowser- oder Langzeitarchiv-Abnahme. Die aktiven Formen sind begrenzt, Kacheln
statisch, der Ateliercode wird erst beim Öffnen nachgeladen. Safari/Firefox und
Linux-CI bleiben zusätzliche spätere Prüfungen.

Serienstart bleibt `null`, offizielle Generierung `false`, `traceable` Standard und
Revision 1. Offizieller Index weiterhin leer. PRD-Originale und historische Daten
bleiben erhalten. Nichts gepusht, keine Sichtbarkeitsänderung, kein Deployment und
keine App-/Kontoeinrichtung.

Nächster abgegrenzter Schritt: gemeinsam die drei Familien und Beispiele im Atelier
ansehen. Danach kann Phase 2 (Evolution mit beiden Modi, belegte Elternbeiträge und
deterministische poetische Titel) beauftragt werden. Die offizielle Kunstabnahme mit
30–50 separaten Werken beider Modi folgt erst mit diesen Fähigkeiten.
