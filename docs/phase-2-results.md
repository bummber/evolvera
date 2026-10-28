# Phase 2 – Evolution, Modi und poetische Titel

Stand: 28.10.2026. Nach Abschluss und positiver Sichtung von Phase 1 hat der
Betreiber die Weiterarbeit beauftragt. Umgesetzt ist das nächste lokale Paket
laut PRD: Phase 2. Keine offizielle Serie, Veröffentlichung oder Betreiberanmeldung.

## Jetzt lokal nutzbar

`/evolvera/#/evolutionslabor` zeigt zwei separate, reproduzierbare Beispielketten
mit jeweils zehn Werken: `traceable` (Nachvollziehbare Vererbung) und `free`
(Maximale Freiheit). Auswahl von Generation 1–10, statische Elternkacheln, Hauptwerk
mit vorhandener Wiedergabesteuerung, gespeicherter Titel und prüfbare Quell-/Zielwerte.
Generation 1 und 2 sind unabhängig. Ab 3 sind die Eltern genau n−2 und n−1.

Die Ketten liegen ausschließlich in `fixtures/preview/phase-2.json` und werden
als Vorschau gekennzeichnet. Datumsschlüssel 01.–10.01.2000, Laufstart und Erstellung
sind simulierte Testmetadaten. Sie setzen kein Serienstartdatum. Die Auswahl des
Beispielmodus ändert weder globale Konfiguration noch bereits gespeicherte Daten.
Die zwölf Phase-1-Studien bleiben unverändert im separaten Testatelier erhalten.

## Generator und nachvollziehbares Rezept

Der reine TypeScript-Kern `generateArtwork(input, clock)` hat Version **0.2.0**.
Er validiert Eltern, ihre Generationen/Reihenfolge und Datumsschlüssel sowie einen
übergebenen Einstellungssnapshot. Systemzeit wird über die injizierte Uhr nur in
`generatedAt` aufgenommen; DNA und Titel hängen nicht von dieser Uhr ab.
`runStartedAt`, `scheduledFor`, Werkdatum und Nachholkennzeichnung bleiben getrennt.
Die Funktion liest/schreibt weder Repository noch Config und startet keinen Workflow.
Der spätere offizielle Aufrufer muss Aktivierung, exklusiven Laufstart und Archivschutz
zusätzlich erzwingen; diese Orchestrierung ist noch nicht implementiert.

Pro Werk wird eine neue oder aus Elternteil A/B kopierte Ausgangskomposition gewählt.
Neue Grundkompositionen nutzen den eingefrorenen Phase-1-Generator als Basis.
Seed-gesteuerte RGB-Kanalverschiebungen öffnen deren Palette; die Evolution bleibt
nicht auf die acht damaligen Beispielpaletten beschränkt. Die Mutationsstärke wird
für jedes Werk neu gezogen. Farben, Geometrie, Deckkraft und Bewegung können sich
ändern. Die Grundkomposition ist auf 50 Formen begrenzt; mit den sichtbar belegten
Ergänzungen entstehen höchstens 62 Formen im Hauptwerk. Kein festes Mischverhältnis.

Das gespeicherte Rezept nennt die Ausgangsquelle und den Seed der neuen Basis,
protokolliert jede ausgeführte Parameteränderung mit Ausgangs-/Zielwert und Operator
und speichert ergänzte Endparameter. `replayRecipe` rekonstruiert daraus exakt die
DNA, ohne den aktuellen Evolutionsgenerator erneut auszuführen. Bei Elternbasen wird
die ursprüngliche DNA kopiert, auf die ersten 50 Formen begrenzt und anschließend das
Rezept angewandt. Neue Basen beziehen sich auf den unveränderten Generator 0.1.0.
Die Darstellungswahrheit bleibt die archivierte End-DNA; das Rezept dient der Prüfung.

## Sichtbare Vererbungsbelege

Im Modus `traceable` wird von jedem Elternteil mindestens eine tatsächlich sichtbare
Farbe oder Breite übernommen oder nachvollziehbar verändert. Es gibt zwei bis sechs
Einzelbeiträge pro Kind mit variabler Zuordnung. Die restliche Komposition kann
weitgehend neu oder stark aus einer Elternbasis übernommen sein. Weitere
Merkmalsgruppen sind über die Rezeptbasis und protokollierte Änderungen nachvollziehbar;
die sichtbaren Einzelbelege sind ausdrücklich keine feste prozentuale Gesamtbewertung.

Für den sichtbaren Mindestnachweis verwendet Version 0.2.0 eine bewusst konservative
Konstruktion: unbewegte, deckende Formen ausreichender Größe mit einer Freistellung
in Hintergrundfarbe. Quell- und Zielmerkmale liegen innerhalb der Kunstfläche,
kontrastieren mindestens 2:1 mit ihrer Freistellung und sind durch spätere Formen
nicht überdeckt. Bei möglichen verdeckenden Drehungen/Bewegungen werden konservative
Malgrenzen verwendet. Verdeckte Formen, reine Eltern-IDs oder Titelwörter zählen
nicht als sichtbarer Beitrag. Diese gestalterische Leitplanke ist technisch prüfbar,
aber noch kein Urteil über künstlerische Qualität oder die spätere Bandbreite.

`validateEvolution` prüft den Werkvertrag, die wirklichen Quell-/Zielwerte,
Kopier-/Offset-Operatoren, das vollständige Rezept und die Sichtbarkeit. Die Prüfung
erfolgt auf dem fertigen Ergebnis. Ein begrenzter deterministischer Retrypfad schützt
vor identischer DNA zum unmittelbaren Vorgänger; fehlende valide Quellen führen zu
einem Fehler statt zu behaupteter Vererbung. V2-Elternketten werden vollständig von
Anfang an geprüft. Beliebige alte Daten ohne belegbar sichtbares Quellmerkmal sind
nicht automatisch als neue Evolutionsquelle freigegeben.

Im Modus `free` werden beide validierten Eltern-DNA als Eingaben ausgewertet. Die
Übernahme eines Mindestmerkmals entfällt. Ein vollständig neuer gestalterischer
Ansatz ist erlaubt. Bei einer neuen Basis ohne übernommene Einzelmerkmale behauptet
die Oberfläche keine Übernahme. Eine kopierte Elternbasis wird im Rezept benannt,
auch wenn keine zusätzlichen sichtbaren Einzelbelege gespeichert wurden. Ursprünge
bleiben unabhängig, unabhängig vom mitgespeicherten Modus.

## Titel und Versionserhaltung

Der getrennte, lokale Titelgenerator nutzt Lexikonversion **0.1.0**, Wort-/Silben-
Bausteine und drei Muster (Kompositum, Wortpaar, Phrase). Ab Generation 3 können
Fragmente beider Elterntitel gekürzt und verschmolzen werden. Die konkreten Fragmente
und Elternreferenzen sind gespeichert und werden gegen Quelle und Titel geprüft.
Vergleich gegen bisherige Titel verhindert offensichtliche Wiederholungen über einen
begrenzten deterministischen Retrypfad. Titel sind Text, kein HTML und kein API-/LLM-
Ergebnis. Der gespeicherte Titel bleibt beim erneuten Öffnen unverändert.

Neue Werke verwenden **Werkschema 2** (Rezept und Titelherkunft). Werkschema 1 bleibt
mit den bisherigen Prüfungen lesbar. Beide verwenden unverändert Renderer **1**.
Die ursprüngliche Phase-1-DNA, Generator 0.1.0, Renderer-CSS und sämtliche sechs
visuellen Referenzen bleiben erhalten. Keine stille Migration oder Neugenerierung.
`npm run validate:data` prüft offizielle Leere und beide gespeicherten Previewpakete.
Der neue Erzeugungsbefehl mit `--write` verweigert vorhandene Referenzdateien.

## Tatsächlich geprüfter Stand

- `npm run check`: Format, Lint ohne Warnungen, Typprüfung, **71 Tests**, Datenprüfung
  und Produktionsbuild erfolgreich. Keine neuen Abhängigkeiten oder Lockfileänderung.
- Zwei unveränderte Zehnerketten werden bei der Datenprüfung exakt reproduziert.
- Langzeittests: je **365 aufeinanderfolgende Testtage pro Modus**, zusammen 730 Werke,
  einschließlich beider Zeitumstellungen. Geprüft sind Schema, Datum, Generationen,
  unmittelbare Eltern, Rezeptreplay, eindeutige Titel, sichtbare Mindestbeiträge,
  unterschiedliche DNA, offene Farbvariation und maximal 62 Formen.
- Zusätzlich: Unabhängigkeit beider Ursprünge, vollständige Brüche in `free`, variable
  Beitragszahlen, unveränderliche Eingabedaten, Uhr-/Inhaltstrennung, Nachholmetadaten,
  Konfigurationssnapshot und Moduswechsel ohne Änderung der Eltern/alten Werke.
- Manipulationsfälle: vertauschte/fehlende Eltern, Datumslücken, Titelduplikate,
  erfundene Quellen, falsche Rezepte sowie unsichtbare/überdeckte Beiträge werden
  abgewiesen. Unicode, Titelvielfalt, beide Eltern als Wortquellen und Wiederholungs-
  vermeidung sind geprüft.
- `npm run test:browser`: **16 Fälle erfolgreich** in gepinntem Chromium auf Desktop
  und 320px Mobilbreite. Bestehende Shell-/Rendererprüfungen einschließlich sechs
  unveränderter visueller Referenzen plus Elternauswahl, unabhängige Ursprünge,
  Moduswechsel, Generationengrenzen, statische Elternkacheln und kein Layoutüberlauf.
- Zusätzliche Sichtung im integrierten Browser, ohne Bildassets für die Kunst.

## Grenzen und nächster Schritt

Das ist der technische Phase-2-Stand, keine vollständige Galerie oder Kunstabnahme.
Die konservativ freigestellten Herkunftsmerkmale und die Kompositionsvielfalt müssen
in Phase 3 gemeinsam gestalterisch beurteilt werden. Noch offen: vollständige
Galerie-/Werk-/Nachfolgernavigation, 30–50 abgenommene Testwerke beider Modi,
physische Geräte, Safari/Firefox, GPU-/FPS-Profiling und Linux-Remote-CI.

Erst danach folgen Betreiberanmeldung, echte Git-Speicherung von Einstellungen,
Scheduler, Ausfall-/Wiederherstellungslogik und Veröffentlichung. Die Simulation
ersetzt keinen getesteten täglichen Workflow. Externe Konten und Secrets wurden
nicht eingerichtet oder angefordert.

Offizieller Index weiterhin leer; `seriesStartDate: null`, `generationEnabled: false`,
Standard `traceable`, Revision 1 unverändert. Kein Push, kein Deployment und keine
Sichtbarkeitsänderung. Nächster abgegrenzter Schritt: Beispielketten gemeinsam sichten,
danach Phase 3 (Galerie, Evolution und Kunstabnahme) separat beauftragen.
