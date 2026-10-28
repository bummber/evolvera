# Phase 3 – Galerie, Evolution und vorbereitete Kunstsichtung

Stand: 28.10.2026. Auftrag: Nach positiver Rückmeldung zum bisherigen Stand lokal
weiterarbeiten. Technische Phase 3 umgesetzt; **ausdrückliche Kunstabnahme offen**.
Phase 4 ist nicht begonnen. Keine Veröffentlichung und kein offizieller Serienstart.

## Lokal vorhanden

- `#/kunstpruefung`: Einstieg zur gemeinsamen Durchsicht von **40 getrennten
  Testwerken**, 20 je Modus. Verlinkt beide Galerien und die letzten Testwerke.
- `#/galerie`: neueste Werke zuerst, zwölf Kacheln pro Seite, weitere acht auf
  Seite 2 der jeweiligen Testsammlung. Suche nach Titel oder ISO-Werkdatum.
  Seite, Suche und Sammlung stehen im Hash-Link; Reload und Browser-Zurück funktionieren.
- `#/werk/YYYY-MM-DD`: Hauptwerk, unveränderter gespeicherter Titel, Datum, Modus,
  Einstellungsrevision, Herkunftsbelege, Zeitpunkte und Nachholstatus.
- `#/evolution`: Auswahl eines Werks, Eltern und bis zu zwei direkte Nachfolger.
  Nachfolger werden über tatsächliche Elternreferenzen bestimmt. Generation 1 hat
  nur Generation 3 als Kind; Generation 2 hat 3 und 4. Am Kettenende erscheinen
  ausschließlich vorhandene Nachfolger.
- `#/`: im offiziellen Leerzustand weiterhin ehrliche leere Bühne; in einer
  Testsammlung das letzte Testwerk. Bei gespeisten offiziellen Lesedaten Datum
  und „Aktuelles Tageswerk“ oder „Zuletzt veröffentlicht“, ohne ein älteres Werk
  fälschlich als heute erzeugt auszugeben.
- Über-Seite aktualisiert. Einstellungen weiterhin deaktiviert; kein Demo-Login.

Testsammlungen werden ausdrücklich mit `?sammlung=traceable` oder `?sammlung=free`
**innerhalb des Hashes** ausgewählt. Die Sammlung bleibt in Werk-, Herkunfts- und
Galerielinks erhalten. Ohne Parameter wird ausschließlich das offizielle Archiv
angefragt. Unbekannte/mehrdeutige Sammlungen zeigen einen Fehler und keinen stillen
Fallback. Die Auswahl speichert keine Betreiberkonfiguration oder Besucherpräferenz.

## Erhaltung und Datenzugriff

Die bisherigen 20 Phase-2-Werke bleiben bytegenau erhalten. `phase-3.json` enthält
nur die 20 Ergänzungen (Generation 11–20 je Modus). Zur Anzeige werden beide Pakete
zu zwei validierten Zwanzigerketten verbunden. Generator 0.2.0, Titelgenerator
0.1.0, Schemata, Renderer V1 und die zwölf Phase-1-Studien wurden nicht geändert.

`review-fixtures.ts` prüft die bisherigen Werke gegen ihre Referenzen, reproduziert
die neuen exakt und prüft alle 40 einschließlich Quellen und Rezepten. `--write`
verweigert vorhandene Dateien. Die Testsammlung ist im Sichtungsbogen
`docs/art-review.md` einzeln erfasst und bleibt außerhalb von `public/artworks`.

`src/archive/reader.ts` ist ausschließlich lesend. Offizielle Werkdateien werden
unter `/evolvera/artworks/YYYY/YYYY-MM-DD.json` bei Bedarf geladen; der Index enthält
keine Kunst-DNA. Eine Galerieseite lädt höchstens zwölf angeforderte Werke. Ein
Werkvergleich benötigt das Werk, bis zu zwei Eltern und bis zu zwei mögliche
Nachfolger. Indexreihenfolge/-nummern, Identität, Titel und unmittelbare Eltern
werden geprüft; in der Kontextansicht zusätzlich Herkunft und für V2 Rezeptreplay.
V1 bleibt mit seinem bisherigen Werkvertrag lesbar. Der erfolgreiche Cache ist
auf 48 Werke beschränkt; Fehler und abgebrochene Anfragen werden nicht gecacht.

Die feste kleine Testsammlung wird dagegen als eigenes, verzögert geladenes
Preview-Bundle gelesen und vollständig validiert. Ihre gesamte DNA wird bei
Auswahl geladen, nicht schon im offiziellen Leerbereich. Pagination begrenzt dort
wie im offiziellen Weg die gleichzeitig gerenderten Kunstwerke. Das Preview-Bundle
ist bewusst keine Speicherstrategie für ein mehrjähriges offizielles Archiv.

Vor 04:00 werden im offiziellen Lesepfad auch versehentlich im Index liegende
zukünftige Datumsschlüssel ausgeblendet. Kalenderarithmetik berücksichtigt Berlin
und Sommer-/Winterzeit. Das ist Anzeigeschutz, kein Scheduler. Ein dauerhaft
geöffneter Tab fragt nach 04:00 nicht selbständig neu ab; ein neuer Seitenaufruf
oder Reload liest den Index erneut. Die automatische Aktualisierung ist vor dem
Tagesbetrieb noch festzulegen und zu prüfen.

HTTP-/Schemafehler ergeben Fehlerkacheln bzw. einen Fehlerzustand. Sie werden nicht
als leere Sammlung ausgegeben; Daten werden niemals als Reparatur neu generiert.
Abgebrochene Anfragen dürfen nach Sammlungswechsel keine neuere Ansicht ersetzen.

## Tatsächlich ausgeführte Prüfungen

- `npm run check`: Format, ESLint ohne Warnungen, Typen, **91 Tests**, Datenprüfungen
  und Produktionsbuild erfolgreich unter Node 24.21.0 / npm 12.2.0.
- `npm run test:browser`: **30 Fälle** in gepinntem Chromium, Desktop und 320px Mobil.
- Neue Prüfungen decken Pagination/Suche/Reload/Zurück, alle Herkunfts-Sonderfälle,
  gespeicherten Modus, statische Kacheln, Hauptwerk-Play/Pause, verzögerte Anfragen,
  falsche Seiten/Adressen, fehlende/beschädigte Werkdateien und ehrliche Daten ab.
- Der spätere offizielle JSON-Leseweg wurde über abgefangene HTTP-Testantworten
  im gebauten Stand geprüft. Diese Antworten sind keine offiziellen Archivdateien.
- Berliner 04:00-Grenze vor/nach Wechsel im Browser, Zeitumstellungen und Jahresgrenze
  in Unit-Tests. Bestehende Mehrgenerationstests (730 Werke) weiterhin erfolgreich.
- Sechs vorhandene Renderer-Screenshotreferenzen unverändert bestanden. Historische
  V1-Herkunftsangaben bleiben mit passenden Einheiten darstellbar.
- Zusätzliche Sichtprüfung im integrierten Browser; keine Bildassets als Kunst.

Der erste neue Browserlauf stoppte wegen eines Node-JSON-Imports in der Testdatei.
Korrigiert durch explizites Lesen der lokalen Testdaten; die folgenden Läufe sind grün.
Keine neuen Abhängigkeiten, keine Änderung am Lockfile oder an den Kunstreferenzen.

## Ausstehende Abnahme und Grenzen

40 Werke liegen zur Durchsicht bereit; keine automatische oder stellvertretende
Kunstabnahme. Das bisherige „gefällt mir“ bestätigt die Richtung. Es ersetzt keine
ausdrückliche Freigabe der gesamten Bandbreite. Sichtungsbogen weiterhin offen.
Besonders gemeinsam prüfen: freigestellte Vererbungsmerkmale, Vielfalt trotz
verwandter Basis sowie teils ungewöhnliche Konsonantenfolgen aus Titelvererbung.
Eine nötige Generatorüberarbeitung müsste neue Versionen/Testwerke erzeugen;
vorhandene Daten würden dabei erhalten.

Physische Smartphones, Safari/Firefox, GPU-/FPS-Profiling, Linux-Remote-CI und echte
Hosting-/Auth-Ende-zu-Ende-Prüfungen sind offen. Keine flüssige Darstellung auf jeder
Hardware behauptet. Rechtliche Betreiberangaben, öffentliches Repository, Pages,
Cloudflare, GitHub App, Betreiber-ID und Secrets bleiben spätere externe Schritte.

Offizielles Archiv leer, Startdatum `null`, Generierung `false`, Standard `traceable`,
Revision 1 unverändert. Kein Push, Deployment oder Sichtbarkeitswechsel. Nächster
Schritt: die 40 Testwerke gemeinsam sichten und Anpassungen oder ausdrückliche
Kunstabnahme dokumentieren. Phase 4 separat beauftragen.
