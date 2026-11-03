# Werkbuch – Umsetzung der Shell

Stand: 03.11.2026. Grundlage ist die eindeutig gefundene, vollständig gelesene
`docs/design-system.md` („Evolvera Design-System v1 – Werkbuch“), insbesondere
Abschnitt 0. Ursprünglicher Auftrag: Plan für zehn Pakete; ausschließlich Paket 1
und 2 lokal umsetzen und den Stand zeigen. Auf den vorgeschlagenen Folgeauftrag
für Paket 3 antwortete der Betreiber anschließend „ok“; als Freigabe dieses
abgegrenzten Pakets aufgenommen. Danach ausdrücklich „Paket 4 umsetzen, weiterhin
nur lokal.“ beauftragt. Nach der Sichtung „es geht und sieht gut aus“ und dem
Folgeauftrag „ok, leg los“ ausschließlich **Paket 5 (Heute und Bühnenrahmen)** lokal
fortgesetzt. Auf den gezeigten Stand und den Folgeauftrag für Galerie/Werkkarten
antwortete der Betreiber „du kannst starten“; darauf ausschließlich **Paket 6**
lokal umgesetzt. Danach mit „Du kannst starten“ den gezeigten Folgeauftrag für
**Paket 7 (Werkdetail)** lokal fortgesetzt. Mit „Bitte starte 8“ anschließend
**Paket 8 (Evolution)** lokal beauftragt. Mit „bitte starte paket 9“ danach
**Paket 9 (Über und Einstellungen)** lokal fortgesetzt. Nach der Sichtung mit
„ok, mach den Feinschliff“ **Paket 10** lokal beauftragt. Veröffentlichung und
Serienstart bleiben eigenständige spätere Aufträge. Anschließend hat der Betreiber
die Änderungen selbst gesichtet und am 03.11. mit „sie sehen gut aus“ positiv
bestätigt. Der lokale Designstand ist damit zur Zufriedenheit gesichtet; keine
Veröffentlichungs-, Betreiber- oder Serienfreigabe daraus abgeleitet.

## Ausgangsstand und Erhalt

- Bestehender Ordner, Branch `main`, `origin` unverändert
  `https://github.com/bummber/evolvera.git`. Ausgangs-HEAD `8a324da`; drei lokale
  Commits seit dem bekannten `origin/main` erhalten. Kein neuer Remoteabgleich.
- Vor Änderungen nur `docs/design-system.md` und `docs/PRD_v1.1_backup.md`
  unversioniert. PRD und Backup bleiben unverändert. Das Werkbuch wird ausschließlich
  mit Prettier formatiert, damit die vorhandene Gesamtprüfung wieder laufen kann;
  seine fachlichen Vorgaben werden nicht geändert.
- Generator, Titelgenerator, Renderer/ArtStage, Archivformat, Vorschau-/Testwerke,
  sechs Renderer-Referenzbilder, Betreiberlogik und Konfiguration bleiben erhalten.
  Serienstart offen, Generierung aus, offizielles Archiv leer. Keine Anmeldung,
  Generierungsschalter oder Mockup-Daten ergänzt. Keine Commits, Pushes oder Deployments.

## Plan über die zehn Arbeitspakete

| Paket                   | Voraussichtlich betroffene Dateien                                                    | Risiken / Abnahme                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1. Tokens & Schrift     | `src/styles/shell.css`, `package.json`, `package-lock.json`, `public/fonts/*-OFL.txt` | Echte wdth-Achse vor Einbau prüfen; lokale Auslieferung, lange Titel, Schrift-Fallbacks.                     |
| 2. Shell                | `src/app/App.tsx`, `src/styles/shell.css`                                             | Preview-Texte aus Konfiguration, Navigation/aria-current, Skip-Link, Header bei 1024 px, Footerziele ≥44 px. |
| 3. Mobile Navigation    | `App.tsx`, `shell.css`, Menü-Browsertests                                             | Details/Summary erhalten; Overlay/Dock, Escape/Fokus/Linkklick, Scrollsperre und freie Inhaltsfläche.        |
| 4. Bausteine            | `shell.css`, vorhandene Komponenten in `src/app/`                                     | Buttons, Labels, Kontraste, native Felder und Trefferflächen; keine neuen Filterfunktionen.                  |
| 5. Heute & Bühnenrahmen | `ArchivePages.tsx`, `shell.css`                                                       | Leerzustand/Überschriften erhalten, Kunst nicht beschneiden, ArtStage unverändert.                           |
| 6. Galerie & Karten     | `ArchivePages.tsx`, `shell.css`                                                       | Suche/Pagination/URLs erhalten, Kacheln statisch, kein neues Filtern.                                        |
| 7. Werkdetail           | `ArchivePages.tsx`, `WorkProvenance.tsx`, `shell.css`                                 | Diagramm, Merkmalsbelege und Titel-DNA nur aus tatsächlichen Daten; Metadaten unverändert.                   |
| 8. Evolution            | `ArchivePages.tsx`, `shell.css`                                                       | Semantische Liste, echte Beziehungen, dekorative Linien; horizontal nur im vorgesehenen Scrollbereich.       |
| 9. Über & Einstellungen | `App.tsx`, `shell.css`                                                                | Texte/Betreiberlogik erhalten; keine simulierte Sitzung oder Generierungsschalter.                           |
| 10. Feinschliff         | Shell-CSS, nötige UI-Korrekturen, `docs/`                                             | Fünf Breiten, Reduced Motion, Kontraste; keine Erneuerung von Kunstreferenzen.                               |

Übergreifend: exakte h1-Texte, Großschreibung nur per CSS; Navigationsnamen
`Hauptnavigation` / `Mobile Hauptnavigation`; mobiles `<details>` mit `<summary>`;
null `img/svg/canvas`. Dock später `Schnellnavigation` nennen. Nach jedem Paket
`npm run check` und `npm run test:browser`; Prüfgrenzen dokumentieren.

## Paket 1 – Tokens und lokale Schriften

- Vollständige Tokens aus Abschnitt 2 mit bestehenden Aliasnamen übernommen.
  Archivo für Sans, IBM Plex Mono für Metadaten; variable Breiten für Display
  (62 %), Abschnittstitel (75 %) und ab Paket 2 Wortmarken (125 %).
  Typorollen für h1/h2/h3, Absätze, Eyebrow und Intro umgesetzt. Bestehende
  komponentenspezifische Größen werden in den jeweiligen späteren Paketen bearbeitet.
- Neue, exakt gepinnte Abhängigkeiten: `@fontsource-variable/archivo@5.3.0`
  und `@fontsource/ibm-plex-mono@5.3.0`. Begründung: Systemschriften liefern weder
  die verbindliche variable Breite noch die verlangte Mono-Schrift zuverlässig.
  Die Pakete liefern statische Schriftassets ohne zusätzliche JavaScript-Laufzeit.
  Das vorhandene Lockfile wurde nur um diese beiden Pakete ergänzt.
- **Vor Einbau** die echte `archivo-latin-wdth-normal.woff2` aus dem temporär
  heruntergeladenen Paket geprüft: WOFF2 mit Node-Brotli entpackt und binäre
  `fvar`-Tabelle gelesen. Ergebnis: `wght` 100 / Standard 600 / 900;
  `wdth` 62 / Standard 100 / 125. Die reine wght-Datei wird nicht verwendet.
  [Fontsource-Angaben](https://fontsource.org/fonts/archivo/about) stimmen damit überein.
- Eigene lokale `@font-face`-Regeln, `font-display:swap`, Archivo-Fallback Arial.
  Vite bündelt drei WOFF2-Dateien unter `/evolvera/assets/`: Archivo Latin
  ca. 90,10 kB, Plex Mono Latin 400 ca. 14,70 kB und 500 ca. 14,88 kB.
  SIL-OFL-Lizenzen mit Copyright liegen unter `public/fonts/` und werden mitgebaut.
  Keine CDN-/Google-Fonts-Anbindung. Latin deckt die aktuellen deutschen Texte ab;
  weitere Zeichen verwenden den lokalen Fallback.
- Seitenraster und Bühnenbreiten vorerst erhalten; Container-/Gutter-Tokens sind
  vorbereitet. Ihre vollständige Anwendung auf Seitenlayouts erfolgt mit den
  jeweiligen Seitenpaketen, nicht durch einen pauschalen Kunstbühnenumbau.
- Neue Typografie änderte den vertikalen Subpixelursprung der Atelierbühne und
  damit Screenshot-Ausschnitte. Der vorhandene Kunsttest fixiert jetzt **nur während
  der Aufnahme** Position/Breite auf das vermessene bisherige Referenzraster
  (Desktop 660,484375 px; Mobil 280 px). Danach wird der ursprüngliche Inline-Style
  wiederhergestellt. Keine Pixelmasken, keine erhöhten Toleranzen, keine neuen
  Referenzbilder. Die weitere Skalierungsprüfung läuft im tatsächlichen Seitenlayout.

Tatsächlich geprüft: Node 24.21.0/npm 12.2.0; `npm run check` erfolgreich mit
Format, Lint, Typen, 149 Tests, Daten-/Vorschauprüfung, Build und Worker-Dry-Run.
Erster Sandboxlauf am lokalen tsx-Socket gestoppt; Wiederholung mit lokalen
Prozessrechten erfolgreich. Erster Browserlauf: 33 bestanden, zwei Kunstaufnahmen
wegen Subpixelposition fehlgeschlagen, einer übersprungen. Nach Aufnahmefix und
Mono-Fallback-Korrektur: `npm run check` erneut erfolgreich, anschließend
`npm run test:browser`: **35 bestanden, einer bewusst übersprungen** (Workerfall
prüft beide Breiten bereits selbst). Eine zwischenzeitliche Typprüfung verwarf
die nicht unterstützte Screenshot-Option `style`; durch explizite, temporäre
Aufnahmegeometrie ersetzt.

Zusätzlicher Werkbuch-Browserfall: 20 Ansichten × fünf Breiten, also 100 Prüfungen,
ohne horizontalen Überlauf und ohne `img/svg/canvas`; Screenshots in ignorierten
`test-results/`. Geprüft: Heute/Galerie/Evolution offiziell und je Testsammlung,
beide Werkdetails (20.01.2000), Über, Einstellungen, Atelier, Evolutionslabor,
Kunstsichtung, Rechtstexte sowie fehlendes Werk/unbekannte Route. Tatsächliche
Schriftbreiten 62/100/125 % unterschieden, keine externen Requests. Der doppelte
Aufruf dieses Fünf-Breiten-Falls im Mobilprojekt wird bewusst übersprungen.

## Paket 2 – Shell

Preview-Leiste in lokalem Mono, unveränderte konfigurationsabhängige Texte;
Header mit variabler Wortmarke und 44-px-Menüpille samt CSS-Icon. Desktopnavigation
ab 1000 px, 15 px/600, 28 px Abstand, umbrechbar, aktive Unterkante über
`aria-current`. Footer mit großer 125-%-Wortmarke, bestehendem Claim, rechtlicher
Navigation (44-px-Ziele) und dynamischem Mono-Serienstatus; Desktop umbrechend
unten ausgerichtet. Mobiles Dropdown bleibt bis Paket 3 bestehen, noch kein Dock
oder Vollflächenmenü. Kein Navigations-/Sitzungs-/Generierungsverhalten geändert.

Bei kleinen Breiten werden die allgemeinen Seitentitel auf 68–84 px angepasst,
damit etwa „Über Evolvera“ zwei Zeilen behält. Die Heute-Überschrift erhält eine
passende Größe unterhalb des allgemeinen 84-px-Minimums, damit „Zukunft.“ nicht
mitten im Wort getrennt wird (zulässige kleinere Schrift nach Regel 0.10).
Texte und vorhandene Umbrüche bleiben erhalten.

Tatsächlich geprüft: `npm run check` erfolgreich einschließlich 149 Tests,
Datenvalidierung, Build und Worker-Dry-Run. `npm run test:browser`: 36 bestanden,
zwei bewusst übersprungen (doppelte Worker-/Fünf-Breiten-Aufrufe). Alle sechs
Kunstreferenzen erfolgreich mit unveränderten Bildern und Toleranzen verglichen.
Der Werkbuchfall prüft 20 Ansichten bei 320/390/768/1024/1440 CSS-Pixeln:
kein horizontaler Überlauf, keine Bild-/SVG-/Canvas-Knoten, keine externen Requests.
Screenshot-Kontaktbögen aller fünf Breiten und Footer gesichtet. Bei dieser Sichtung
die kleinste Titelgröße nachgebessert und die Aufnahme auf frische Dokumente ab
Seitenanfang umgestellt: Vorher konnte die erste Aufnahme einer neuen Breite noch
die Scrollposition der vorherigen Footeraufnahme zeigen. Der anschließende
Sammelfall erreichte nach 85 Aufnahmen sein 60-Sekunden-Gesamtzeitlimit. Deshalb
in fünf unabhängige Breitenfälle mit unverändertem Prüfumfang aufgeteilt.

**Abschließender Stand:** `npm run check` erneut vollständig erfolgreich mit
149 Tests, Datenvalidierung, Build und Worker-Dry-Run. Danach
`npm run test:browser`: **40 bestanden, sechs bewusst übersprungen** (fünf bereits
im Desktopprojekt geprüfte Breitenfälle und der doppelte Worker-Aufruf). Alle
100 Ansichten erneut ohne horizontalen Überlauf, keine externen Requests oder
`img/svg/canvas`. Frische Kontaktbögen sämtlicher Seiten und die fünf Footeraufnahmen
abschließend gesichtet. Sichtung umfasst die oberen 900 CSS-Pixel jeder Seite und
den Footer; die automatisierte Überlaufmessung erfasst die gesamte Dokumentbreite.
Keine vollständige visuelle Abnahme jedes darunterliegenden Detailabschnitts.
`git diff --check` erfolgreich; PRD-Backup weiterhin bytegleich. Git-Diff für alle
ausgenommenen Kunst-/Daten-/Betreiber-/Konfigurationspfade und Referenzbilder leer.
Beide ausgelieferten OFL-Dateien bytegleich mit den gepinnten Paketen.

Offen bleiben Paket 3–10, vollständige Seitenraster-/Bausteinübernahme (darunter
bisherige kleine Labels und deren Akzentkontrast), vollständige Kontrastabnahme,
Safari/Firefox und physische Geräte. Reduced Motion wurde in der Browserprüfung
verwendet, bestehende Kunst-Bewegungsprüfungen bestanden; kein GPU-/FPS-Profiling.
Kein neuer separater `worker:test-runtime`-Lauf, da kein Worker-/Sitzungscode geändert.
Die vorhandene Browser-Suite nutzt weiterhin ihren isolierten synthetischen Workerfall.
Keine Cloud-Einrichtung, Auth-Abnahme oder Publikationsprüfung aus dem Designcheck
ableiten. Lokale Vorschau auf dem bereits vorhandenen Port 4173 weiterverwendet;
keinen fremden Vorschauprozess beendet. Temporäre Sichtungsbilder liegen außerhalb
von Git, nicht in den Produktionsassets.

## Folgeauftrag für Paket 3 (anschließend bestätigt)

Zuerst den lokalen Stand dieser beiden Pakete gemeinsam sichten. Danach separat
beauftragen: ausschließlich mobile Navigation nach Werkbuch 7.4/7.5 gestalten:
bestehendes Details/Summary als Tinte-Overlay, CSS-/Texticons, echtes Schließen,
Escape mit Summary-Fokus, Linkklick mit Main-Fokus, Scrollsperre; Dock Heute/Galerie/
Evolution/Menü unterhalb 1000 px mit `aria-label="Schnellnavigation"`, aktiven
Zielen aus tatsächlicher Route und gespiegeltem `aria-expanded`. Statuswerte aus
bestehender Konfiguration. Safe-Area und Platz unter Main vorsehen. Exakte h1-Texte,
Navigationsnamen, Kunst, Daten, Betreiberlogik und deaktivierte Serie erhalten.
`npm run check`, `npm run test:browser` und Sichtung bei allen fünf Breiten;
Ergebnisse/Grenzen in `docs/`. Keine weiteren Pakete, Commits, Pushes oder Deployments.

## Paket 3 – mobiles Overlay und Dock

Git vor Fortsetzung erneut geprüft: der uncommittete Stand aus Paket 1/2 liegt
unverändert vor, `origin` bleibt `bummber/evolvera`, HEAD weiterhin `8a324da`.
Änderungen dieses Pakets betreffen ausschließlich Shell, Navigationstests und
diesen Vermerk/HANDOFF. Keine neuen Abhängigkeiten.

- Natives `details.mobile-navigation` mit `summary` erhalten. Offen als dunkle,
  bei Bedarf vertikal scrollbar bleibende Vollfläche; Wortmarke, nummerierte
  Haupt-/Nebenlinks, 44-px-Schließenkreis, Claim und Rechtstexte. Summary ist selbst
  das native Schließenziel und trägt einen passenden zugänglichen Namen.
- Info zeigt den konfigurierten Modus kommender Werke und die Zeitzone. Der
  04:00-Rhythmus stammt wie bisher aus der PRD; bei deaktivierter Serie ausdrücklich
  als geplant bezeichnet. Die Testsammlungswahl täuscht keinen globalen Moduswechsel vor.
- Fokus beim Öffnen auf Summary, Tab/Shift-Tab bleiben im Menü; Escape schließt und
  fokussiert Summary. Linkklick schließt mit Fokus auf Main, auch bei einem Ziel der
  bereits geöffneten Seite. Hintergrund/Skip-Link/Dock über `inert` gesperrt,
  Dokument-/Body-Scroll während des Overlays gesperrt. Menü kann selbst scrollen.
- Menüöffnung ist an die aktuelle Routenadresse gebunden: auch direkte Hashwechsel
  schließen. Beim Wechsel auf ≥1000 px schließen und Main fokussieren; die
  Scrollsperre bleibt nicht auf Desktop zurück.
- Neues Dock unter 1000 px, `aria-label="Schnellnavigation"`, Ziele Heute/Galerie/
  Evolution/Menü. Links erhalten Testsammlungsparameter und `aria-current` aus den
  bestehenden Routen. Echter Menübutton mit `aria-controls`/gespiegeltem
  `aria-expanded`. Ausschließlich CSS-/Texticons, Safe-Area und freier Platz unter
  Main und Footer; Scroll-Padding hält fokussierte Ziele oberhalb des Docks.
- Nur die Öffnung blendet 220 ms ein; bei Reduced Motion ohne Animation.
  Kein Overlay-/Dock-Code greift auf Kunst oder Betreiberfunktion zu.

Bestehende Browsertests bei doppelt vorkommenden „Galerie“-Links auf die jeweilige
Hauptnavigation begrenzt; die gleichen Routen-/Fokus-/Aktivprüfungen bleiben bestehen.
Die vorhandene Einstellungen-Einzelprüfung liest den Modustext gezielt aus Main,
da das geschlossene Menü denselben echten Status enthält. Vier zusätzliche
Browserfälle (zwei Abläufe in beiden Projekten) prüfen Scroll-/Fokusbindung,
Schließen, Rechtstextnavigation, Testsammlungsparameter, freien Footer, kurzen
320×560-Bildschirm, Reduced Motion, Desktopwechsel und direkten Hashwechsel.
Die fünf Breitenfälle ergänzen Overlay-/Menüfuß-Aufnahmen für 320/390/768 px.

Tatsächliche Zwischenprüfungen: Gesamtcheck mit 149 Tests, Datenprüfung, Build und
Worker-Dry-Run erfolgreich. Ein zwischenzeitlicher Typfehler im neuen Test
(JSON-Modus zunächst nur als `string` typisiert) durch Schemaprüfung behoben.
Erster Browserlauf: 42 bestanden, sechs bewusst übersprungen, zwei neue Fälle
am Testselektor gescheitert. Playwright bildet natives Summary hier als generisch
statt `button` ab; die Prüfung verwendet nun Summary direkt und verifiziert seinen
zugänglichen Schließen-Namen. Keine Änderung an der nativen Menüsemantik dafür.
Danach `npm run check` erneut vollständig erfolgreich: Format/Lint/Typen,
149 Tests, Datenvalidierung, Build und Worker-Dry-Run. Abschließender
`npm run test:browser`: **44 bestanden, sechs bewusst übersprungen** (wie zuvor
die fünf doppelt parametrisierten Breitenfälle und der doppelte Worker-Aufruf).
100 Seiten-/Breitenkombinationen bei 320/390/768/1024/1440 px ohne horizontalen
Überlauf, keine externen Requests oder `img/svg/canvas`. Alle sechs Kunstreferenzen
mit unveränderten Bildern/Toleranzen erfolgreich. Kontaktbögen sämtlicher Breiten
gesichtet, zusätzlich Overlay und Menüfuß bei 320/390/768 px sowie Footer mit Dock
kontrolliert. Die automatisierte Dokumentbreite erfasst die ganze Seite; visuell
obere 900 px je Ansicht sowie die gesonderten Menü-/Footeraufnahmen geprüft.
Der kurze 320×560-Fall bestätigt scrollbaren Menüfuß und freie fokussierte Footerlinks.
`git diff --check`, bytegleiches PRD-Backup und unveränderte ausgenommene Pfade geprüft.

Manuelle lokale IAB-Vorschau: den alten Tab zunächst nicht erneut anbinden können;
frischer lokaler Vorschautab erfolgreich. Overlay und Dock sichtbar geprüft, Escape
schließt; Hintergrund verschwindet bei geöffnetem Menü auch aus der zugänglichen
Navigation. Temporären Größenoverride zurückgesetzt. Keine Cloud-/Auth-Abnahme.
Safari/Firefox, physische Geräte und echte Safe-Area-Hardware bleiben ungeprüft;
die CSS-Safe-Area-Regeln wurden mit dem Browserstandardwert 0 ausgeführt.
Kein neuer separater Worker-/Sitzungslauf, da dieser Code unverändert blieb.

Nach Paket 3 blieb Paket 4 zunächst bis zur gemeinsamen Sichtung und eigenem
Folgeauftrag offen; dieser Auftrag ist im folgenden Abschnitt dokumentiert. Kunst, Archiv,
Referenzbilder, Konfiguration und Betreiberlogik bleiben unverändert. Kein Commit,
Push oder Deployment.

## Paket 4 – gemeinsame Bausteine

Auf ausdrücklichen Folgeauftrag nach der gemeinsamen Sichtung von Paket 3 lokal
fortgesetzt. Git vor Änderungen geprüft: bestehende Arbeit aus Paket 1–3 erhalten,
HEAD weiterhin `8a324da`, `origin` unverändert `bummber/evolvera`. Keine neuen
Abhängigkeiten oder Änderungen an der Schriftversorgung.

- Gemeinsame Bausteinstile in `src/styles/components.css`, nach der Shell in
  `src/main.tsx` eingebunden. Dadurch getrennt von Navigation, Seitenrastern und
  unveränderten Kunst-/Renderer-CSS-Dateien. Bisherige Seitenregeln bleiben als
  Ausgangsbasis für die späteren Seitenpakete erhalten.
- Primäraktionen: rote Pille, 16 px/700, mindestens 56 px mobil bzw. 60 px Desktop.
  Sekundäraktionen mit Tinte-Rahmen; Suche und bestehender Betreiberzugang dunkel.
  Mobile Primär-/Sekundäraktionen stehen untereinander in voller Breite.
  Bestehende Texte, zugängliche Linknamen, Ziele, Ereignisse und Disabled-Verhalten
  erhalten; Pfeile der Primärlinks in dekorativen Spans rechts ausgerichtet.
- Vorhandene Datum-/Moduswerte als Mono-Infochips; eckige dunkle Badges,
  „Nachgeholt“ nur bei tatsächlichem Werkflag in Akzent. Kleine Vorschauhinweise
  nutzen den kontrastreicheren `--accent-text`. Eltern-Tags im Herkunftsdiagramm
  gehören weiterhin zum späteren Werkdetailpaket, keine erfundenen Tags ergänzt.
- Labels in Mono 11 px, Felder in Papier hell mit Tinte-Rahmen, mindestens 52 px.
  Eingaben lokal in Mono 16 px, native Selects Sans 16 px/600. Fokus nach Tokens.
  Suchfeld und Suchknopf bleiben dieselben, einschließlich „Suchen“, Enter,
  Such-/Sammlungs-URLs und nativer Auswahl. Bestehende Generationstasten im
  Evolutionslabor als 44-px-Pillen; kein neuer Modusfilter.
- Leere Galerie/Evolution, fehlende Treffer und leere Eltern-/Nachfolgerbereiche:
  gestrichelter Tinte-Rahmen und dekoratives 52-px-Fragezeichen. Texte und echte
  Beziehungen erhalten. Die bestehende leere Heute-Bühne bleibt für Paket 5
  unverändert. Fehlende Werkkacheln erhalten keine erfundene Kunst.
- Vorhandene `.notice`-Hinweise bekommen einen vollständigen Rahmen und hellen
  Papiergrund; ausführliche Fehlermeldungen zusätzlich das Mono-Label „Fehler“.
  Rechtstexte/Entwurfsstatus inhaltlich unverändert, keine neue Datenschutzversion.
  UI-Hover reagiert auf Zustandswechsel; Reduced Motion deaktiviert die Übergänge.
  ArtStage-Datei, Wiedergabelogik und Kunst bleiben unverändert.

Zusätzlicher Browserfall in beiden Projekten: erfolglose Suche ist kein Fehler,
Rückkehr zu allen zwölf Kacheln erhält die Testsammlung; ein 503 des offiziellen
Index bleibt dagegen ein echter Alert mit nutzbarer Wiederholungsaktion. Aufnahme
der beiden Zustände zur Sichtung. Bestehende Prüfungen von Suche, Pagination,
Seed-Eingabe, Animation, Betreiber-Sperre, Menü und Kunstreferenzen bleiben bestehen.

Tatsächliche Zwischenprüfung: `npm run check` erfolgreich mit 149 Tests,
Datenvalidierung, Build und Worker-Dry-Run. Erste Browserrunde: 44 bestanden,
sechs doppelte Aufrufe bewusst übersprungen, zwei vorhandene Fälle fehlgeschlagen:
Der exakte Fehlerkacheltext war durch ein zusätzliches „Fehler“-Label erweitert.
Dieses Label an der Kachel entfernt; „Werkdaten nicht verfügbar“ bleibt exakt
erhalten. Das Label an ausführlichen `.notice`-Fehlern bleibt gemäß Werkbuch bestehen.
Keine Toleranz oder Assertion dafür abgeschwächt. Anschließend Gesamtcheck erneut
erfolgreich.

**Abschluss:** `npm run check` vollständig erfolgreich mit Format/Lint/Typen,
149 Tests, Datenvalidierung, Build und Worker-Dry-Run. Danach
`npm run test:browser`: **46 bestanden, sechs bewusst übersprungen** (fünf bereits
im Desktopprojekt geprüfte Breitenfälle und der doppelte Worker-Aufruf).
Alle sechs Kunstreferenzen mit unveränderten Bildern und Toleranzen erfolgreich.
100 Seiten-/Breitenkombinationen bei 320/390/768/1024/1440 CSS-Pixeln ohne
horizontalen Überlauf und ohne externe Requests oder `img/svg/canvas`.
Kontaktbögen aller fünf Breiten sowie zusätzliche Leer-/Fehleraufnahmen auf Desktop
und Mobil gesichtet. Wie zuvor visuell die oberen 900 px der 20 Ansichten und
gesonderte Zustandsaufnahmen; keine komplette visuelle Abnahme sämtlicher darunter
liegender Detailabschnitte. Die Überlaufmessung erfasst die gesamte Dokumentbreite.

Kontraste der verwendeten Bausteinfarben lokal mit sRGB-Luminanzformel nachgerechnet:
Tinte/Papier 14,68:1, Sekundärtext/Papier 5,93:1, Sekundärtext/Papier hell 6,37:1,
kleiner Akzenttext/Papier 5,69:1, Weiß/Akzent 5,17:1, Papier hell/Tinte 15,77:1.
Keine vollständige WCAG-Abnahme der gesamten Anwendung daraus ableiten; die
bisherige kleine Bühnenbeschriftung gehört weiterhin in Paket 5/Feinschliff.

Lokale IAB-Suche zusätzlich ausgeführt und Rückkehr zu den 20 Testsammlungswerken
bestätigt. Vorhandenen Tab nicht erneut anbinden können; temporären neuen
Vorschautab verwendet und anschließend geschlossen. Die bestehenden Tabs erhalten.
Keinen neuen Vorschauprozess oder Dienst eingerichtet; vorhandenen Buildserver
auf 4173 weiterverwendet. `git diff --check`, bytegleiches PRD-Backup und leerer
Git-Diff der ausgeschlossenen Kunst-/Daten-/Konfigurations-/Betreiberpfade geprüft.
Auch `src/styles/shell.css` bytegleich zum Beginn dieses Pakets erhalten.

Grenzen: noch keine neue Seitenkomposition, Filterfunktion, Titel-DNA-/Elternanzeige
oder Einstellungsauswahl. Paket 5 und folgende beginnen erst nach gemeinsamer
Sichtung und eigenem Auftrag. Safari/Firefox, physische Geräte und echte Safe-Area
bleiben offen. Keine Worker-/Sitzungsänderung, kein separater Runtime-Lauf nötig.
Kunst, Daten, sechs Referenzbilder, Betreiberlogik und Konfiguration unverändert;
Serie/Generierung weiterhin aus. Keine Commits, Pushes oder Deployments.

## Paket 5 – Heute und Bühnenrahmen

Nach der bestätigten Sichtung von Paket 4 („es geht und sieht gut aus“) und dem
anschließenden Folgeauftrag „ok, leg los“ ausschließlich Paket 5 lokal umgesetzt.
Git-Zustand vor Änderungen geprüft; die uncommittierte Arbeit aus Paket 1–4 erhalten.
`main`, HEAD `8a324da`, vorhandenes `origin` unverändert. Keine neue Abhängigkeit.

- Eigener Shell-Wrapper `src/app/StageFrame.tsx`: vier CSS-Schnittmarken,
  Materialetikett, bei vorhandenem Werk roter Generationsaufkleber. Ziffer aus
  `work.generation`, dekorativ und zusätzlich im zugänglichen Text vorhanden.
  Ohne Werk kein Aufkleber und keine erfundene Generation. Die leere Innenfläche
  bleibt quadratisch mit dem bestehenden Hinweistext und gestricheltem Rahmen.
- `src/styles/today.css` nach den Bausteinstilen eingebunden. Mobil und Tablet
  Bühne vor dem Text; ab 1000 px zwei Spalten, Text links unten, Bühne rechts.
  Die DOM-Reihenfolge behält die Überschrift vor dem Werk. Typografie, Meta-Zeile,
  Schnittmarken und 10-/16-px-Abstand nach Werkbuch; kein Eingriff in die Kunstebene.
- Heute mit gespeichertem Werk verwendet den bestehenden `ArtStage` unverändert.
  Titel, Datum und Generation aus den Werkdaten; Testsammlungen nennen ausdrücklich
  „Letztes Testwerk“ und „Simuliertes Testdatum“. Herkunfts-/Detail-/Galerieziele
  einschließlich Sammlung erhalten. Metadaten und `WorkProvenance` bleiben vorhanden.
  Werkdetail und Evolution behalten ihre bisherige Seitenkomposition ohne neuen Rahmen.
- Bestehende Serieninfo als gemeinsame reine Darstellung extrahiert und dunkel
  gestaltet; auch bei Testwerken sichtbar, solange Generierung deaktiviert ist.
  Startdatum bleibt offen, kein Countdown oder Generierungsschalter ergänzt.
  Herkunftsdiagramm/Vererbungsliste und „Zuletzt“-Karten bleiben den Paketen 7 bzw. 6
  zugeordnet. Bestehende Eltern-/Nachfolgerlinks bleiben erhalten.

Neue Browserprüfung in beiden Projekten: Leerzustand und beide echten Testsammlungen,
mobile/Desktop-Anordnung, quadratische Bühne, unveränderte Skalierung der 1000er
Kunstebene, tatsächliche Generationsnummer und erhaltene Herkunftsziele. Keine neuen
Renderer-Snapshots oder Änderungen an Bildreferenzen/Toleranzen.

Tatsächliche Zwischenfehler: erste Gesamtprüfung stoppte an der Formatierung der
neuen Testdatei; korrigiert. Der erste Browserstart scheiterte am JSON-Import des
Browsermoduls in Playwrights Node-Prozess. Fixtures danach wie in den vorhandenen
Galerietests per Dateilesen geladen; Build validiert diese unveränderten Daten.
Anschließend 46 bestanden, sechs übersprungen, die beiden neuen Fälle scheiterten
an einer angenommenen URL-Parameterreihenfolge. Jetzt werden beide Parameterwerte
einzeln geprüft; Routing und Produktcode dafür nicht geändert.

Abschließender Browserlauf: **48 bestanden, sechs bewusste Doppelaufruf-Skips**.
Alle sechs Kunstreferenzen unverändert erfolgreich. 100 Seiten-/Breitenkombinationen
bei 320/390/768/1024/1440 CSS-Pixeln ohne horizontalen Überlauf, externe Requests
oder `img/svg/canvas`. Gesamtcheck mit 149 Tests, Build und Worker-Dry-Run erfolgreich;
abschließend nach Test-/Dokumentationskorrektur erneut vollständig ausgeführt.
Kontaktbögen aller fünf Breiten (je 20 Ansichten, obere 900 px) sowie die volle
Vor-Serienstart-Seite auf Desktop/Mobil und zusätzliche Testwerk-Heroaufnahmen
gesichtet. Die Überlaufmessung erfasst die gesamte Dokumentbreite; keine vollständige
visuelle Abnahme aller tiefer liegenden Abschnitte sämtlicher Routen behauptet.
`git diff --check`, bytegleiches PRD-Backup und leerer Diff der ausgeschlossenen
Kunst-/Daten-/Konfigurations-/Betreiberpfade geprüft. Lokale Vorschau auf 4173
erreichbar; bestehenden Prozess weiterverwendet.

Grenzen: Chromium auf Desktop und mit mobilem Viewport; Safari/Firefox, physische
Geräte und echte Safe-Area-Hardware bleiben offen. Keine vollständige WCAG-Abnahme.
Worker-/Sitzungscode unverändert, deshalb kein separater Runtime-Lauf. Generator,
Titelgenerator, ArtStage/Renderer, Daten, Referenzbilder und Betreiberlogik erhalten.
Alles lokal; kein Commit, Push, Deployment oder Serienstart.

Nächster abgegrenzter Auftrag nach gemeinsamer Sichtung: **Paket 6 – Galerie und
Werkkarten** nach Werkbuch 7.11 und 8 gestalten. Bestehende Suche, Pagination,
Sammlungs-URLs und ruhige Kunstkacheln erhalten; keine neue Filterfunktion oder
Mockup-Daten. Wieder Gesamtcheck, Browsersuite und fünf Breiten prüfen, dokumentieren
und lokal zeigen. Paket 7 und folgende bleiben außerhalb dieses Folgeauftrags.

## Paket 6 – Galerie und Werkkarten

Nach gezeigtem Paket 5 und abgegrenztem Folgeauftrag mit „du kannst starten“
freigegeben. Vor Änderungen Git geprüft: bestehende uncommittierte Arbeit aus
Paket 1–5 erhalten, `main`, HEAD `8a324da`, `origin` weiterhin `bummber/evolvera`.
Keine neue Abhängigkeit oder Änderung an den lokalen Schriften.

- `src/app/ArchivePages.tsx`: Galerie erhält eigene Shell-Container für Titel,
  Lead/Suche und Karteninhalt. Ab 1000 px Titel links, Lead und bestehende Suche
  rechts. Exaktes h1 „Galerie“, Kicker, Suchlabel, Suchbutton und Leer-/Fehlertexte
  erhalten. Zähler bleibt `role="status"`, nun zwischen zwei Linien.
- Jeweils erstes Werk der angezeigten, bereits sortierten Seite/Suche hervorgehoben.
  Keine zusätzliche Anfrage, kein dupliziertes Werk und kein vorgezogener Indexeintrag.
  Ab Desktop vier Rasterspalten, Hervorhebung über zwei Spalten und zwei Zeilen.
  Unter 1000 px Hervorhebung voll breit, normale Karten in zwei Spalten, rechte
  Spalte um 56 px versetzt. Spezifische mobile Kartenregel aus 7.11 angewendet.
- Neue Wrapper `.card-art` und `.card-body` sowie eigenes `src/styles/gallery.css`
  (in `src/main.tsx` eingebunden). Normale Titel 15–19 px/700, Hervorhebung als
  Displaytitel, Meta-/Moduswerte Mono. Bestehende Generations- und Datumsbeschriftung
  erhalten. Ganze Karte bleibt genau ein Link mit ursprünglichem zugänglichem Namen;
  Fokusregel bleibt wirksam, Hover färbt den Titel mit `--accent-text`.
- 4:5-Kartenfläche mit zentrierter, vollständiger quadratischer Kunst. Mobile
  Kartenflächen wechseln mit 1:1 ab; Hervorhebung immer 1:1. Das verbindliche
  Rendererformat hat Vorrang vor dem Kartenformat: keine Streckung, Beschneidung
  oder Änderung der Kunstebene. Ruhige `ArtRenderer`-Vorschau unverändert.
- Suchlogik, zwölf plus acht Werke pro Testsammlung, Pagination, URL-Parameter,
  Fehlermeldungen und Wiederholungswege unverändert. Bestehende Seitentasten als
  Pillen zwischen Linien. Kein Modusfilter, keine zusätzliche „Zuletzt“-Datenabfrage
  oder neue Heute-Sektion. Detail, Evolution und ihre Beziehungskarten unverändert.

Neue Browserprüfung in beiden Projekten mit beiden Testsammlungen: zwölf Karten
in ursprünglicher Datumsreihenfolge; genau ein sammlungserhaltender Link je Karte;
vollständige quadratische Kunst innerhalb der Rahmen; unveränderte Breite der
inneren Kunstebene; Ruhezustand ohne laufende Animation. Hervorhebung größer auf
Desktop, erster Link per Fokus/Enter erreichbar. Ganze Galerieaufnahmen gesichert.
Die vorhandenen Such-, Pagination-, Lade-, Fehler-, Navigation-, Datenschutz- und
Kunstreferenzprüfungen bleiben unverändert. Keine neue Referenz oder Toleranz.

**Prüfstand:** `npm run check` vollständig erfolgreich mit Format/Lint/Typen,
149 Tests, Datenvalidierung, Build und Worker-Dry-Run. `npm run test:browser`:
**50 bestanden, sechs bewusste Doppelaufruf-Skips** (fünf Breiten bereits im
Desktopprojekt, ein Worker-Aufruf). Alle sechs Kunstreferenzen unverändert bestanden.
100 Seiten-/Breitenkombinationen bei 320/390/768/1024/1440 CSS-Pixeln ohne
horizontalen Überlauf, externe Requests oder `img/svg/canvas`. Kontaktbögen aller
fünf Breiten mit den oberen 900 px je Ansicht und vollständige Galerieaufnahmen
auf Desktop/Mobil gesichtet. Überlaufmessung erfasst das ganze Dokument; keine
vollständige visuelle Abnahme sämtlicher tiefer liegender Abschnitte aller Routen.

`git diff --check`, bytegleiches PRD-Backup und leerer Diff der ausgeschlossenen
Kunst-/Archiv-/Daten-/Konfigurations-/Betreiberpfade geprüft. Keine Worker- oder
Sitzungsänderung, deshalb kein separater Runtime-Lauf. Safari/Firefox, physische
Geräte und echte Safe-Area-Hardware bleiben offen; keine vollständige WCAG-Abnahme.
Weiterhin nur lokal, keine Commits, Pushes, Deployments oder Serienfreigabe.

Nächster abgegrenzter Auftrag nach gemeinsamer Sichtung: **Paket 7 – Werkdetail**
nach Werkbuch 7.13–7.15, 7.19 und 8 gestalten. Herkunft/Eltern, Merkmalsbelege,
Titel-DNA und Metadaten ausschließlich aus vorhandenen Daten. ArtStage/Renderer,
Werke, Archivformat und Betreiberlogik erhalten. Keine neue Teilenfunktion oder
Generierung. Danach Gesamtcheck, Browsersuite und fünf Breiten prüfen und lokal
zeigen; Paket 8 und folgende bleiben außerhalb dieses Folgeauftrags.

## Paket 7 – Werkdetail, Herkunft und Werkdaten

Auf den gezeigten Stand von Paket 6 und den abgegrenzten Werkdetail-Folgeauftrag
antwortete der Betreiber „Du kannst starten“. Ausschließlich Paket 7 lokal
umgesetzt. Vor Änderungen Git und Remote geprüft: uncommittierte Pakete 1–6
erhalten, weiterhin `main`, HEAD `8a324da`, `origin` `bummber/evolvera`.
Keine neue Abhängigkeit, keine Schrift-/Konfigurationsänderung.

- Eigene `.work-detail`-Darstellung in `src/app/ArchivePages.tsx` und Styles in
  `src/styles/detail.css`, eingebunden über `src/main.tsx`. Zurück-Link und echte
  Generation über dem Werk; keine Teilenfunktion oder simulierte Aktion. Mobil
  Bühne vor dem Text, ab 1000 px Bühne links (1,3), Titel/Chips/Aktionen rechts (1).
  DOM-Reihenfolge behält die Überschrift vor der Bühne. Ursprüngliche Linknamen,
  Ziele, Sammlungsparameter, Nachholkennzeichnung und exakter h1-Text erhalten.
  Detailtitel nach Sichtprüfung auf 52 px bei schmalen Ansichten, ab 390 px mindestens
  60 px, auf Desktop bis 90 px abgestimmt, damit lange gespeicherte Namen besser passen.
- Bestehender `StageFrame` um den unveränderten `ArtStage`, mit Schnittmarken und
  tatsächlichem Generationsaufkleber. Shell-Fläche hochformatig 4:5, vollständiges
  Werk nach verbindlichem Rendererformat weiterhin 1:1. Bei zusätzlichem Platzbedarf
  für Steuerung wächst die Shell; Kunst wird weder gestreckt noch beschnitten.
- Eltern-Klammer als reine Darstellung der bereits geladenen zwei Eltern. A/B aus
  `work.parentIds`, bestehende sammlungserhaltende Elternlinks und ruhige Vorschauen.
  Linien dekorativ, Beziehung zusätzlich als Text. Kindpille nennt „Dieses Werk“,
  keine Behauptung „Heute“ bei historischen Testdaten. Kleine echte Kindvorschau
  vollständig innerhalb eines runden Rahmens. Bei Ursprung keine Klammer, bestehende
  Ursprungserklärung und tatsächliche Nachfolgerlinks erhalten.
- `src/app/WorkTitle.tsx`: Markierung und Legende ausschließlich aus gespeicherten
  V2-Elternfragmenten und tatsächlichen Eltern-IDs. Groß-/Kleinschreibung des
  Werktitels bleibt im Text erhalten, Versalien nur durch CSS. Unterstreichung nur
  bei genau einer passenden, nicht überlappenden Fundstelle. Daten enthalten keine
  Positionen: bei Mehrdeutigkeit keine Stelle raten, Legende des gespeicherten
  Fragments bleibt. V1 und Titel ohne Fragmente erhalten keine Zuordnung.
- `WorkProvenance` erhält eine optionale, nur im Werkdetail verwendete Dekoration:
  A/B-Kreis 28 px, Aussagen 15 px und Werte in Mono 13 px; dekorative Farb-, Drehungs-,
  Breiten-/Höhenvorschau aus dem tatsächlichen Zielwert. Sonstige Merkmale bleiben
  textuell belegt. Keine zusätzlichen Übernahmen oder „NEU“-Belege erfunden;
  gespeicherte Ergänzungen bleiben in der vorhandenen Kompositionsauskunft.
  Vollständige Quelle/Ziel/Operator-Auskunft bleibt natives „Beleg ansehen“-Details.
- Eltern und Vererbung nebeneinander auf Desktop, untereinander mobil. Anschließend
  Werkdaten standardmäßig offen mit nativer Tastaturbedienung, Plus/Minus und
  responsivem dl-Raster. Alle neun Felder, Werte und bisheriger Summary-Text
  „Werkdaten ansehen“ erhalten. Seed in Mono. Direkte Nachfolger folgen darunter.
  Heute und Evolution behalten ihren Aufbau, geschlossene Metadaten und unmarkierte
  Titel; die neue Herkunftsdekoration wird dort nicht aktiviert. Paket 8 bleibt offen.

Vier neue Unit-Fälle prüfen exakten Titel, Zuordnung über IDs, wiederholte und
überlappende Fundstellen sowie Ursprung/V1 ohne erfundene Titelherkunft. Synthetische
Titelvarianten werden ausschließlich im Speicher der Tests verändert, keine
gespeicherte Datei. Bestehende V1-Merkmals-/Einheitenprüfungen bestehen unverändert.

Neue Browserprüfung auf Desktop und Mobil: beide Testsammlungen mit tatsächlichen
Fragmentlegenden, quadratischer unverzerrter Kunst und korrekter Layoutanordnung;
Elternlinks und ruhige Vorschauen; Quelle/Ziel per Tastatur öffnen, alle neun
Werkdatenfelder sowie Seed/Revision und natives Schließen/Öffnen. Ursprung ohne
Klammer und Belege; freie Neuschöpfung ohne behauptete sichtbare Übernahme.
Evolution bleibt ohne Detailgestaltung. Keine Assertion oder Referenztoleranz
abgeschwächt, keine Kunstreferenz ersetzt.

**Prüfstand:** `npm run check` vollständig erfolgreich mit Format/Lint/Typen,
**153 Tests**, Datenvalidierung, Build und Worker-Dry-Run. `npm run test:browser`:
**52 bestanden, sechs bewusste Doppelaufruf-Skips**. Alle sechs Kunstreferenzen
unverändert erfolgreich. 100 Seiten-/Breitenkombinationen bei 320/390/768/1024/1440
CSS-Pixeln ohne horizontalen Überlauf, externe Requests oder `img/svg/canvas`.
Erste Browserrunde ebenfalls grün. Ganzseitenbilder nach Tastaturprüfung zunächst
mit gescrolltem Viewport aufgenommen: fixierte Elemente dadurch an der vorherigen
Scrollposition im Gesamtbild. Testaufnahme auf Scrollstand 0 korrigiert, ohne
Produktänderung; vollständige Browsersuite danach erneut ausgeführt.

Kontaktbögen aller fünf Breiten mit den oberen 900 px der jeweils 20 Ansichten
gesichtet, außerdem ganze Detailseiten auf Desktop/Mobil mit geöffnetem Beleg und
Werkdaten sowie freie Neuschöpfung. Die letzte Titelanpassung zusätzlich in den
erneuten Detailaufnahmen kontrolliert. Überlaufmessung erfasst das gesamte Dokument;
keine vollständige visuelle Abnahme aller tiefer liegenden Abschnitte sämtlicher Routen.
`git diff --check`, bytegleiches PRD-Backup und unveränderte ausgeschlossene
Kunst-/Daten-/Konfigurations-/Betreiberpfade geprüft. Bestehenden lokalen
Vorschauprozess weiterverwendet; Erreichbarkeit vor Übergabe geprüft.

Grenzen: Chromium auf Desktop und mobilem Viewport; Safari/Firefox, physische Geräte
und echte Safe-Area-Hardware bleiben offen. Keine vollständige WCAG-Abnahme.
Kein Worker-/Sitzungsumbau, deshalb kein separater Runtime-Lauf. Kunst, Renderer,
Generatoren, Archiv, Testwerke, Konfiguration und Betreiberlogik unverändert.
Keine Commits, Pushes, Deployments oder Serienfreigabe; Generierung bleibt aus.

Nächster abgegrenzter Auftrag nach gemeinsamer Sichtung: **Paket 8 – Evolution**
nach Werkbuch 7.18 und 8 gestalten. Bestehende Auswahl, echte Eltern-Kind-Beziehungen,
Ursprungserklärungen und Sammlungs-URLs erhalten; dekorative Linien, keine neue
Berechnung oder Generierung. Nach Gesamtcheck, Browsersuite und fünf Breiten lokal
zeigen. Paket 9 und folgende bleiben außerhalb dieses Folgeauftrags.

## Paket 8 – Evolution

Auf ausdrücklichen Auftrag „Bitte starte 8“ lokal umgesetzt. Git vor Änderungen
geprüft, bestehende uncommittierte Pakete 1–7 erhalten; `main`, HEAD `8a324da` und
`origin` `bummber/evolvera` unverändert. Keine neue Abhängigkeit oder Konfiguration.

- `src/app/EvolutionBraid.tsx` und `src/styles/evolution.css` ergänzen einen Zopf
  aus dem bereits geladenen, validierten `WorkContext`: ausgewähltes Werk und
  seine bis zu zwei tatsächlichen Eltern. Semantische `ol`, rein dekorative
  CSS-Linien mit `aria-hidden`, reale ruhige `ArtRenderer`-Vorschauen. Jeder Knoten
  einschließlich Beschriftung ist ein sammlungserhaltender Werklink. Ausgewähltes
  Werk mit Akzent-Outline und zusätzlicher Textkennzeichnung, A/B in Text und Legende.
- Mobil neueste Generation oben, Knoten 44 px, Zeilenhöhe 96 px. Ab 1000 px älteste
  links, Knoten 96 px, Abstand 160 px, Spur 380 px hoch. DOM-Reihenfolge bleibt
  neueste zuerst; Desktop kehrt die visuelle Anordnung per CSS um. Fokusfähige,
  beschriftete Region mit lokalem `overflow-x: auto`. Im aktuellen Ausschnitt passen
  die maximal drei Desktopknoten ohne nötigen horizontalen Scrollweg in die Seite.
- **Daten haben Vorrang vor der Skizze:** Im validierten Archiv ist A der erste
  Eintrag (`n−2`), B der zweite (`n−1`). Die Skizze 7.18 beschreibt es umgekehrt.
  A/B werden ausschließlich über `work.parentIds` zugeordnet; Form der Linie
  folgt dem tatsächlichen Knotenabstand. Daher im gezeigten Ausschnitt A als
  Tinte-Bogen, B als rote Gerade. Keine Umbenennung oder Änderung gespeicherter Daten.
- **Begrenzter Kontext:** Kein Gesamtarchiv-Zopf und keine zusätzlichen Werkabrufe.
  Indexzeilen enthalten keine Kunst oder Elternreferenzen; ein vollständiges Geflecht
  würde einen zusätzlichen Lade-/Navigationsauftrag brauchen. Beschriftung nennt
  ausdrücklich das ausgewählte Werk und seine Eltern. Weitere Herkunft bleibt über
  die bestehenden Werklinks erreichbar. Kein Pfad bis Generation 1/2 wird vorgetäuscht.
- `ArchivePages.tsx`: Desktopkopf mit bestehendem Werktitel links, Lead und nativer
  Auswahl rechts; mobil untereinander. Abschnitt 0.10 hat Vorrang vor Blueprint 8:
  bei vorhandenem Werk exakter bisheriger h1-Werktitel, bei leerer Evolution weiterhin
  exakt „Evolution“. URLs und Auswahlhandler unverändert. Der Select bleibt auch
  beim Laden und bei beschädigtem Werk nutzbar.
- Unter dem Zopf drei Desktopkarten: ausgewähltes Hauptwerk auf Tinte und beide
  Eltern auf Papier. Mobil untereinander, Elternvorschauen nebeneinander. Hauptwerk
  weiterhin unveränderter `ArtStage` mit bestehenden Animationskontrollen; alle
  kleinen Vorschauen ruhig, Kunst vollständig und quadratisch. Belege, native
  Metadatenauskunft und echte Nachfolgerlinks bleiben verfügbar. Keine duplizierte
  zweite Elternsektion. Ursprung 1/2 ohne Kanten oder erfundene Eltern; leerer
  offizieller Zustand unverändert. Evolutionslabor, Heute und Werkdetail erhalten.

Zwei neue Unit-Fälle prüfen ID-basierte A/B-Zuordnung bei umgekehrt gelieferten
Vorschauen und Generation 2 ohne Beziehung zu Generation 1. Zwei neue Browserfälle
je Projekt prüfen beide Testsammlungen, echte Elternlinkziele, vertikale/horizontale
Anordnung, Knotengrößen, Tastaturfokus und Enter, ruhige Vorschauen und unverzerrtes
Hauptwerk, Ursprünge und leeres offizielles Archiv. Zweiter Fall: 503 eines Werkes,
Auswahl weiterhin erreichbar und Wechsel zu einem gültigen Werk. Aufgezeichnete
Requests bestätigen ausschließlich die bestehenden Kontextabrufe (Werk, Eltern,
Kandidaten für direkte Nachfolger), keine zusätzliche Archivladung.

**Prüfstand:** `npm run check` vollständig erfolgreich mit Format/Lint/Typen,
**155 Tests**, Datenvalidierung, Build und Worker-Dry-Run. `npm run test:browser`:
**56 bestanden, sechs bewusste Doppelaufruf-Skips**. Alle sechs Kunstreferenzen
unverändert. 100 Seiten-/Breitenkombinationen bei 320/390/768/1024/1440 CSS-Pixeln
ohne horizontalen Dokumentüberlauf, externe Requests oder `img/svg/canvas`.
Kontaktbögen aller fünf Breiten mit den oberen 900 px der jeweils 20 Ansichten und
ganze Evolutionsseiten auf Desktop/Mobil gesichtet. Nach Sichtung Datumsdarstellung
unter Desktopknoten ohne Trennung des Datums und Belegtexte etwas größer abgestimmt;
Gesamtcheck und Browsersuite danach abschließend wiederholt. Keine Referenzen,
Toleranzen oder bestehenden Assertions abgeschwächt.

Überlaufmessung erfasst das ganze Dokument; keine vollständige visuelle Abnahme
aller tiefer liegenden Abschnitte sämtlicher Routen. Chromium geprüft; Safari/Firefox,
physische Geräte, echte Safe-Area und ein umfangreiches scrollendes Gesamtgeflecht
bleiben offen. Kein umfassendes WCAG-Audit. Kein Worker-/Sitzungsumbau, deshalb kein
separater Runtime-Lauf. Ausgeschlossene Kunst-/Archiv-/Daten-/Konfigurations-/
Betreiberpfade unverändert, PRD-Backup bytegleich und `git diff --check` geprüft.
Lokale Vorschau vor Übergabe auf Erreichbarkeit geprüft. Generierung und Serie aus;
keine Commits, Pushes oder Deployments.

Nächster abgegrenzter Auftrag nach gemeinsamer Sichtung: **Paket 9 – Über und
Einstellungen** nach Werkbuch 8 und 7.21–7.24 innerhalb der bestehenden Logik gestalten.
Texte, vorhandene Felder, gespeicherte Werte und Betreiber-Sperre erhalten; keine
neuen Generierungsschalter, Anmeldung, Sitzung oder Speicherfunktion. Gesamtcheck,
Browsersuite und fünf Breiten prüfen und den Stand lokal zeigen. Paket 10 und
Veröffentlichung bleiben außerhalb dieses Folgeauftrags.

## Paket 9 – Über und Einstellungen

Ausdrücklich mit „bitte starte paket 9“ freigegeben. Vor Änderungen Git und Remote
geprüft; uncommittierte Pakete 1–8 erhalten. Weiterhin `main`, HEAD `8a324da`,
`origin` `bummber/evolvera`. Keine neuen Abhängigkeiten oder externen Ressourcen.

- `src/app/App.tsx`: Über-Seite mit fünf nummerierten Kapiteln und einem
  Kapitelverzeichnis. Mobil als umgebrochene Pille-Reihe, ab 1000 px als statisches
  linkes Verzeichnis; Kapiteltext und Erklärungsgrafik daneben. Letztes Kapitel als
  Tinte-Fläche mit Links zur bestehenden Kunstsichtung und zum Testatelier.
  Exakte h1-/h2-Texte und alle ursprünglichen Absätze erhalten. Acht reine Textabsätze
  vor/nach Änderung per normalisiertem Quelltextvergleich vollständig bestätigt.
- Kapitelziele als echte Hash-Router-Links (`#/ueber#about-…`), bestehende Suchparameter
  bleiben erhalten. Lokaler Fokus-/Scroll-Effekt für Sprungmarken, Reload und
  erneuten Klick auf das aktuelle Kapitel; keine Änderung der globalen Routen oder
  des mobilen Menüs. Der App-Abschnitt ab `NotFound` ist zum Paketbeginn bytegleich.
- `src/app/AboutIllustration.tsx`: reine HTML/CSS-Prinzipdarstellungen für Material,
  zwei unabhängige Ursprünge/erstes Werk mit Eltern, Modusdefinitionen und Nachholung.
  Keine Kunstwerke, Rendereraufrufe, erfundenen Archivdaten oder Serientermine.
  Zahlen 01/02/03 erklären ausschließlich die bereits spezifizierten Serientage.
  Keine generierte Kunst als Dekoration eingebaut.
- `src/styles/information.css`, über `src/main.tsx` eingebunden: eigene Seitenraster,
  Kapitelziffern, Chips, Schema-Klammer, Moduskarten und Prinzip-Zeitleiste. Alle
  Stile auf diese Informationsbausteine begrenzt. Inhalte anderer Seiten bleiben erhalten.
- Einstellungen mit Status-/Hinweisspalte und Zugangs-/Modusspalte auf Desktop.
  Alle drei bisherigen Statusfelder, Werte, Hinweistexte und Auth-Bedingungen erhalten.
  Geschützter Zugang als dunkle Karte. Button bleibt bei fehlender `adminOrigin`
  deaktiviert; vorhandener echter Link bei konfigurierter Origin unverändert.
- Zwei native Radios in deaktiviertem `fieldset`, Auswahl ausschließlich aus
  `initialSettings.inheritanceMode`. Keine lokalen Änderungs- oder Speicherhandler.
  Die öffentliche Galerie bleibt auch bei konfigurierter Betreiberadresse gesperrt;
  echte Anmeldung und Moduswahl gehören weiterhin zur separaten geschützten Seite.
  Kein grüner Anmeldestatus, keine Speicherleiste und keine Generierungsschalter.

Bestehender Routingtest prüft die gespeicherte Modusbezeichnung nun gezielt im
Status-dl, weil der Modusname zusätzlich auf der neuen Karte vorkommt. Prüfung der
Betreiber-Sperre und fehlenden Combobox unverändert. Zwei neue Browserfälle je
Projekt: fünf Kapitel, Tastaturfokus/Enter, Direktlink, Reload, erneuter Sprung zum
aktuellen Kapitel, erhaltene Suchparameter und echter Kunstsichtungslink. Außerdem
nativ gesperrte Radios mit tatsächlichem Konfigurationswert, Mausklick auf andere
Karte ohne Wertänderung, Reload, Revision, unveränderte Zugangssperre und keine
Schreibanfragen, externen Requests oder Cookies. Konfigurierte Betreiber-Origin
wird im aktuellen Stand nicht live geprüft (`adminOrigin:null`).

Tatsächliche Zwischenprüfung: erste Browsersuite **58 bestanden, sechs übersprungen,
zwei neue Fälle fehlgeschlagen**. Ein verschachtelter `has`-Lokator suchte den
übergeordneten Fieldset-Kontext innerhalb des Labels und fand kein Ziel. Relativen
Lokator korrigiert; Kartenklick mit nativer Maus an sichtbarer Position ausgeführt,
ohne die Disabled-Assertions zu umgehen. Produktlogik dafür unverändert.
Bei der Sichtung außerdem zu schwachen Textkontrast einer dunklen Moduserklärung
gefunden: geerbte dt-Farbe/Schrift durch explizite Sans-/Tinte-/auf-Tinte-Tokens
ersetzt. Zusätzliche Browsermessung bestätigt beide Modusüberschriften mit mindestens
4,5:1 Kontrast. Ein Zwischencheck stoppte an der Testformatierung; gezielt korrigiert.

**Prüfstand:** `npm run check` vollständig erfolgreich mit Format/Lint/Typen,
**155 Tests**, Datenvalidierung, Build und Worker-Dry-Run. `npm run test:browser`:
**60 bestanden, sechs bewusste Doppelaufruf-Skips**. Alle sechs Kunstreferenzen
unverändert. 100 Seiten-/Breitenkombinationen bei 320/390/768/1024/1440 CSS-Pixeln
ohne horizontalen Überlauf, externe Requests oder `img/svg/canvas`. Kontaktbögen
aller fünf Breiten (obere 900 px je Ansicht) und ganze Über-/Einstellungsseiten
auf Desktop/Mobil gesichtet. Ganzseitenaufnahme nach Kartenklick auf Scrollstand 0
gesetzt; abschließend Gesamtcheck und Browsersuite erneut ausgeführt.

Grenzen: Überlaufmessung erfasst das ganze Dokument, die Kontaktbögen nur den oberen
Ansichtsausschnitt. Keine vollständige visuelle Abnahme aller Abschnitte aller Routen.
Chromium geprüft, Safari/Firefox, physische Geräte und echte Safe-Area weiter offen.
Kontrastmessung einzelner Bausteine ist kein vollständiges WCAG-Audit. Keine echte
Sitzung, Anmeldung oder Cloud-/Worker-Einrichtung geprüft oder verändert. Worker- und
Sitzungscode unverändert, deshalb kein separater Runtime-Lauf. Kunst, Renderer,
Generatoren, Archiv, Testwerke, Referenzbilder, Konfiguration und Betreiberlogik
unverändert; `git diff --check` und bytegleiches PRD-Backup geprüft. Lokale Vorschau
vor Übergabe auf Erreichbarkeit geprüft. Kein Commit, Push, Deployment oder Serienstart.

Nächster abgegrenzter Auftrag nach gemeinsamer Sichtung: **Paket 10 – Feinschliff**.
Bestehende Shell über alle fünf Breiten, Tastatur/Fokus, Reduced Motion, lange Titel,
Kontraste und freie Inhalte oberhalb des Docks sichten; nur konkret gefundene
Gestaltungsfehler beheben. Kunst, Daten, Renderer-Referenzen, Betreiberlogik und
sämtliche Gates erhalten. Gesamtcheck und Browsersuite ausführen, Grenzen in docs
festhalten und lokal zeigen. Veröffentlichung und Serienstart sind kein Teil davon.

## Paket 10 – Feinschliff

Nach gemeinsamer Sichtung ausdrücklich mit „ok, mach den Feinschliff“ beauftragt.
Git-Zustand und vorhandene Pakete 1–9 vor Änderungen geprüft und erhalten: `main`,
HEAD `8a324da`, `origin` weiterhin `bummber/evolvera`. Node **24.21.0**; keine
neue Abhängigkeit oder externe Ressource.

Zwei konkrete typografische Befunde korrigiert:

- `src/styles/information.css`: ausgeglichener h1-Umbruch für Über/Einstellungen.
  Bei 390 px hatte „Einstellungen“ zuvor nur „en“ in der letzten Zeile.
  `text-wrap: balance` verteilt die Zeilen gleichmäßiger; Überschrift und Schriftgröße
  erhalten.
- `src/styles/today.css`, `detail.css`, `evolution.css`: gespeicherte Werktitel mit
  ausgeglichenem Umbruch und begrenzter automatischer Worttrennung
  (`hyphenate-limit-chars: 8 4 4`). So beginnt das lange erfundene Kompositum nicht
  mit einer isolierten kurzen Silbe. Eine Zwischenvariante ohne automatische
  Trennung hinterließ in „Zwischenraum“ einen einzelnen Schlussbuchstaben und wurde
  verworfen. Keine Trennzeichen im Text gespeichert; Titel, DNA-Markierungen,
  Werkdaten, Bühnenmaße und Kunst bleiben erhalten.

`tests/browser/polish.spec.ts` ergänzt drei Fälle in beiden Chromium-Projekten:

- **30 native Tab-Durchläufe:** Über, Einstellungen, Atelier, Galerie/free,
  Werkdetail/traceable und Evolution/free bei allen fünf Breiten, jeweils 740 px hoch.
  Von `main` bis zum Footer; sichtbare Outline und Fokus oberhalb des Docks geprüft.
  Karten, die höher als die freie Ansicht sind, müssen mindestens 44 px sichtbar
  bleiben. Der vorhandene Scrollabstand auf `html` genügt; kein zusätzlicher Umbau.
- **15 lange Titelansichten:** die drei längsten tatsächlichen Titel aus den 40
  Testwerken, jeweils bei 320/390/768/1024/1440 px. Exakten h1-Text, mindestens vier
  Zeichen in der ersten und drei in der letzten Zeile, Dokumentbreite, quadratische
  Bühne und identische Skalierung ihrer inneren Zeichenfläche geprüft. Zusätzlich
  Schlusszeile von „Einstellungen“ geprüft und Aufnahme bei 390 px erstellt.
- **Reduced Motion und Menügrenze:** Hauptwerk bei reduzierter Bewegung ruhig,
  Buttonübergang 0 s, Wechsel der Medienpräferenz wirksam und kleine Vorschauen ohne
  Animation. Natives Menü bei 999 px geöffnet, bei 1000 px geschlossen mit Fokus auf
  `main`, Desktopnavigation sichtbar und Scrollsperre gelöst. Erneutes Öffnen bei
  390 px und Escape mit Fokus auf Summary geprüft; weiterhin keine `img/svg/canvas`.

Zusätzliche einmalige lokale Chromium-Diagnostik: Bei 390 × 740 px direkte sichtbare
Texte auf 15 offiziellen/Test-Routen anhand berechneter Vorder-/Hintergrundfarben
mit Alpha-Komposition gegen 4,5:1 beziehungsweise 3:1 bei großem Text geprüft;
keine Unterschreitung im erfassten Umfang. Kunst, dekorative/verborgene/inaktive
Inhalte, deaktivierte Felder und Text über Verläufen ausgeschlossen. Trefferflächen
auf neun Routen bei 320 × 560 px geprüft: keine eigenständigen aktiven Ziele unter
44 × 44 px. Inline-Fließtext-/Rechtstextlinks und deaktivierte Elemente ausgenommen.
Diese Stichproben prüfen weder sämtliche Zustände und Farbhintergründe noch alle
Zielabstände; sie sind kein vollständiges WCAG-Audit.

Tatsächliche Zwischenprüfungen: Der erste Gesamtcheck stoppte an der Formatierung
der neuen Testdatei. Eine versehentlich bereits gestartete Browsersuite lief deshalb
noch auf dem vorherigen Build: **65 bestanden, sechs übersprungen, ein neuer
Überschriftentest fehlgeschlagen**. Nach Formatkorrektur und neuem Build **66 bestanden,
sechs übersprungen**. Die anschließende Bildsichtung führte zur oben beschriebenen
Korrektur der langen Titel und einer zusätzlichen Schlusszeilen-Assertion.

**Abschließender Prüfstand:** `npm run check` mit Format/Lint/Typen, **155 Tests**,
Datenvalidierung, Build und Worker-Dry-Run erfolgreich. `npm run test:browser`:
**66 bestanden, sechs bewusste Doppelaufruf-Skips**. Alle sechs Kunstreferenzen mit
unveränderten Bildern und Toleranzen bestanden. Bestehende Prüfungen für 100
Seiten-/Breitenkombinationen bei 320/390/768/1024/1440 CSS-Pixeln ohne horizontalen
Dokumentüberlauf, externe Requests oder `img/svg/canvas`. Kontaktbögen aller fünf
Breiten (obere 900 px je Ansicht), die 15 langen Detailtitel und die ausgeglichene
Einstellungsüberschrift gesichtet. Überlaufmessung erfasst das ganze Dokument;
keine vollständige visuelle Prüfung aller tieferen Abschnitte sämtlicher Routen.

Safari/Firefox, physische Geräte, echte Safe-Area und umfassende WCAG-Abnahme bleiben
offen. Auch die in Paket 8 genannte Grenze des Gesamtarchiv-Geflechts bleibt bestehen.
Keine echte Anmeldung oder externe Betreiber-/Cloudprüfung. Worker-/Sitzungscode
unverändert, deshalb kein separater Runtime-Lauf. Kunst-/Generator-/Renderer-/Archiv-/
Testwerk-/Referenz-/Konfigurations-/Betreiberpfade unverändert, PRD-Backup bytegleich,
`git diff --check` erfolgreich. Lokale Vorschau vor Übergabe erreichbar.
Alles weiterhin lokal: kein Commit, Push, Deployment, Serienstart oder Generierung.

Die zehn Gestaltungspakete sind damit lokal umgesetzt. Die zunächst vorgesehene
gemeinsame Sichtung ist anschließend durch die positive Betreiber-Rückmeldung
„Ich habe mir die Änderungen angeschaut und sie sehen gut aus“ erfolgt.
Alle Änderungen bleiben uncommittiert; kein weiteres Paket, Veröffentlichung oder
Betreiber-Einrichtung wird daraus automatisch gestartet.

Auf anschließenden Auftrag nur Übergabe und [Startprompt](NEXT-START.md) dokumentiert.
`npm run check` hierfür erneut erfolgreich mit 155 Tests, Build und Worker-Dry-Run;
`git diff --check` und bytegleiches PRD-Backup geprüft. `check:publication` erneut
erwartet gesperrt, ausschließlich wegen offener Cloudflare-Vertrags-/Kontoprüfung.
Keine UI-/Routing-/Workeränderung, deshalb keine erneute Browser- oder Runtime-Suite;
der oben genannte Browserstand stammt aus dem abgeschlossenen Feinschliff.

## Lokaler Werkbuch-Checkpoint – 03.11.2026

Nach reinem Wiedereinstieg den vorgeschlagenen lokalen Sicherungsschritt mit
„Mach weiter“ beauftragt. Bestehende Implementierung aus allen zehn Paketen
unverändert erhalten; keine neue Gestaltung oder Funktion. Ausgangs-HEAD `8a324da`,
`main`, drei lokale Commits vor dem bekannten `origin/main`; Remote nicht neu geprüft.
Gezielte Sicherung unter `chore: checkpoint reviewed Werkbuch design locally`,
einschließlich bisher unversionierter Komponenten, Styles, Tests, OFL-Lizenzen und
Designdokumente. PRD-Backup bleibt unversioniert und bytegleich, generierte Ausgaben
bleiben außerhalb von Git; Workerausgaben außerdem außerhalb von `dist`.

Erneut tatsächlich geprüft: Node 24.21.0/npm 12.2.0; `npm run check` vollständig
erfolgreich mit **155 Tests**, Datenvalidierung, Build und Worker-Dry-Run.
Anschließend `npm run test:browser` am gebauten Stand: **66 bestanden, sechs bewusste
Doppelaufruf-Skips**, sechs Kunstreferenzen unverändert. 100 Seiten-/Breitenkombinationen
bei 320/390/768/1024/1440 px ohne horizontalen Dokumentüberlauf, externe Requests oder
`img/svg/canvas`; bestehende Fokus-/Tastatur-, Titel-, Reduced-Motion- und
999/1000-px-Menüprüfungen bestanden. Keine neue manuelle Sichtung der Screenshots.
Keine UI-/Routing-/Workeränderung in diesem Checkpoint; nach der Dokumentation den
Gesamtcheck abschließend erneut vollständig erfolgreich ausgeführt.
Separater Worker-Runtime-Lauf nicht wiederholt;
der vorhandene Browserfall nutzte isolierten lokalen Speicher und synthetische Daten.

Publikationsgate erneut erwartungsgemäß Exit 1 ausschließlich wegen offener
Cloudflare-Vertrags-/Kontoprüfung. Keine Secrets, externe Einrichtung, Pushes oder
Deployments. Sämtliche Seriengates unverändert, keine offiziellen Werke.
Safari/Firefox, physische Geräte, echte Safe-Area und vollständige WCAG-Abnahme
weiterhin offen; Evolution bleibt auf ausgewähltes Werk und geladene Eltern begrenzt.
