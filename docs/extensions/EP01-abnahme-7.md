# Evolvera – EP-01: Kunstabnahme, Geräteprüfung und Aktivierungsplan (P7)

Stand: 12.11.2026 · Status: Abnahmewerke am 12.11.2026 vom Betreiber abgenommen und eingefroren; Lastgrenzen nach Messung auf iPhone 13 und MacBook bestätigt; inaktiver Stand am 12.11.2026 veröffentlicht (`b98b4a9`, CI 43194138740 und Pages 43194138581 erfolgreich); **Aktivierung nicht freigegeben**

Generator 0.3.0 ist weiterhin nicht aktiv: `generatorChangeDate` ist `null`,
im Archiv liegt kein Werk im Schema 3, `config/generation.json` und
`config/release.json` sind unverändert. Generator 0.2.0 und 0.3.0,
Titelgenerator, Renderer 1 und 2, Schema 3, Worker und Workflows sind
unverändert.

## Teil A – Abnahmewerke

58 neue Werke, ohne Auswahl aus fortlaufenden Seeds
(`evolvera:ep01:review:<Kette>:<Generation>`), erzeugt von
`src/art/generator/acceptance-v3.ts` über `scripts/acceptance-fixtures.ts`.

| Sammlung (`sammlung=`) | Datei                       | Inhalt                                                              |
| ---------------------- | --------------------------- | ------------------------------------------------------------------- |
| `abnahme-traceable`    | `ep01-review.json`          | 20 Werke, Standardprofil, nachvollziehbare Vererbung                |
| `abnahme-free`         | `ep01-review.json`          | 20 Werke, Standardprofil, maximale Freiheit                         |
| `abnahme-ruhig`        | `ep01-review-profiles.json` | 6 Werke: Mutationsstärke `calm`, Dichte `sparse`, Bewegung `subtle` |
| `abnahme-wild`         | `ep01-review-profiles.json` | 6 Werke: `wild`, Mutationssprünge an, alle neun Merkmale `often`    |
| `abnahme-reduziert`    | `ep01-review-profiles.json` | 6 Werke: nur `organic` und `color-field`, höchstens zwei Ebenen     |

Die Profilketten laufen im Modus `traceable`. Alle Sammlungen stehen im
Auswahlfeld „Sammlung ansehen“ und benutzen Galerie, Detailansicht, Herkunft,
Rahmenbedingungen und Evolution aus P6. Jede Fixture ist ein eigener,
nachgeladener Chunk. `npm run validate:data` reproduziert beide Dateien; der
strenge Archivleser bestätigt jedes Werk mit voller Historie (Test).

**Schwelle** (`npx tsx scripts/acceptance-fixtures.ts --report`): In keiner
der fünf Ketten wurde ein Kandidat wegen des Mindestabstands 0,02 verworfen.
Kleinster Abstand: `traceable` 0,069, `free` 0,250, „Reduziert“ 0,048. Die
Kette `free` fiele mit einer Schwelle von 0,10 oder 0,22 Werk für Werk gleich
aus; eine eigene Schwelle für `free` hätte an diesen 20 Werken also nichts
geändert. Die Messung aus P5 (0,3 % verworfen bei 0,02, 9,5 % bei 0,22) gilt
unverändert.

**Abnahme am 12.11.2026:** Der Betreiber hat alle 58 Werke ausdrücklich
abgenommen („Die Werke sind so abgenommen“), ohne Änderungswünsche; spätere
Änderungswünsche will er gesondert besprechen. Zur Schwelle hat er keine
Änderung verlangt: Es bleibt bei `NOVELTY_MINIMUM = 0,02` für beide Modi,
ohne eigene Schwelle für `free`. Generator 0.3.0, Renderer 2 und Schema 3
wurden für die Abnahme nicht verändert.

Vor der Abnahme benannt: In der Kette `traceable` sehen sich Generation 16
und 18 sowie 17 und 19 im Bild sehr ähnlich, obwohl der gemessene Abstand
0,11 bis 0,28 beträgt (das Abstandsmaß sieht keine Anordnung). In der Kette
„Ruhig“ hat Generation 2 trotz Dichte `sparse` 62 Elemente.

**Eingefroren** (SHA-256, geprüft in `tests/acceptance-v3.test.tsx`):

- `ep01-review.json`: `2d4e5f3eb7c43606edb054f5622e8462b305f61c6949941c20fec38b4f206784`
- `ep01-review-profiles.json`: `e5aa7862d852a3571eae6037e0029b58bf5e36728e611bb6578fd07295f7ad7d`

Eine Abweichung ist ein Befund; geänderte Werke brauchen eine neue Abnahme.
In `config/release.json` kommt der Nachweis erst mit der Aktivierung.

## Teil B – Geräte

**Messseite** `#/messung` (`src/app/LoadMeasure.tsx`, eigener Chunk, nicht in
der Navigation): zeigt nacheinander den Musterbogen „Lastgrenze“ (liegt an
allen sieben Grenzen) und die fünf aufwendigsten bewegten Abnahmewerke in
voller Größe und misst je zehn Sekunden den Abstand der Bilder (Median, 95 %,
längster, Anteil über 33 ms und über 50 ms). Das Ergebnis ist ein Text zum
Kopieren; nichts wird gespeichert oder gesendet. Bei „Bewegung reduzieren“
ruhen die Werke, und der Bericht vermerkt das. `?dauer=<1–30>` ändert die
Messdauer.

**Maßstab:** Die Lastgrenzen gelten als bestätigt, wenn beim Musterbogen
„Lastgrenze“ der Median höchstens 20 ms und 95 % höchstens 33 ms betragen
und der Betreiber kein Ruckeln sieht.

**Geprüft am 12.11.2026:**

- Chromium (Playwright), 320 px und Desktop: Abnahmesammlungen, Detailansicht
  mit reduzierter Bewegung, Messseite mit und ohne reduzierte Bewegung.
- WebKit (Playwright), Desktop und 320 px: Abnahmesammlungen, Ansichten für
  Schema 3, Musterbogen und Messseite ohne Fehler (46 Fälle, ohne
  Bildvergleich, weil es nur Chromium-Referenzen gibt).
- **Firefox: nicht geprüft.** Er startet in der Sandbox der Sitzung weiterhin
  nicht. Bleibt ausdrücklich offen.

**Messung des Betreibers am 12.11.2026** (je 10 s, Bewegung nicht reduziert):

| Gerät                                          | Werk                       | Median  | 95 %      | längster | über 33 ms | über 50 ms |
| ---------------------------------------------- | -------------------------- | ------- | --------- | -------- | ---------- | ---------- |
| MacBook, Chrome 157, 1710 × 952, Gerätepixel 2 | Musterbogen „Lastgrenze“   | 16,7 ms | 16,8 ms   | 17,7 ms  | 0 %        | 0 %        |
| MacBook, Chrome 157                            | fünf Abnahmewerke          | 16,7 ms | ≤ 17,6 ms | 17,7 ms  | 0 %        | 0 %        |
| iPhone, Safari 27.2, 390 × 739, Gerätepixel 3  | Musterbogen „Lastgrenze“   | 17 ms   | 17 ms     | 45 ms    | 0,3 %      | 0 %        |
| iPhone, Safari 27.2                            | vier der fünf Abnahmewerke | 17 ms   | 17 ms     | ≤ 64 ms  | ≤ 0,2 %    | ≤ 0,2 %    |

Auf beiden Geräten liefen beim Musterbogen 48 Animationen. Nach dem
vorgeschlagenen Maßstab (Median höchstens 20 ms, 95 % höchstens 33 ms) sind
die Lastgrenzen damit eingehalten. Einzelne längere Abstände auf dem iPhone:
einmal 45 ms beim Musterbogen, einmal 64 ms bei „Leuchtstille / Fernaschlag“.

Ein Lauf auf dem iPhone ist nicht verwertbar: Bei „Noctikristall im
Ungefähren“ (17 Elemente) wurden nur 324 Bilder gezählt, mit einem einzelnen
Abstand von 15,7 s. Das ist eine Unterbrechung der Seite (Browser im
Hintergrund oder Bildschirm aus), keine Renderlast; Median und 95 % lagen
auch dort bei 17 ms.

Das iPhone ist ein iPhone 13. Augenschein des Betreibers: „flüssig und
gut“. Zum Lauf mit „Bewegung reduzieren“ auf dem iPhone hat der Betreiber
„ok“ gemeldet; ein Messtext dazu liegt nicht vor. Im Browsertest ruhen dabei
alle sechs Werke ohne laufende Animation.

**Entscheidung (Betreiberentscheidung 7):** Der Betreiber hat die
Lastgrenzen am 12.11.2026 bestätigt. Es bleibt bei den Werten aus P2 (120
Elemente, 60 Punkte, 40 Clip-Pfade, 8 Pfade, 6 Blendmodi, 4 Masken, 3
Unschärfen und Schatten); Schema 3 und Renderer 2 bleiben unverändert.

**Offen:** Firefox; andere und ältere Mobilgeräte.

**Grenze:** Die Bildabstände zeigen nur den Takt des Hauptthreads, nicht das
Zeichnen und Zusammensetzen auf der Grafikkarte. Der Augenschein auf dem
Gerät gehört deshalb zum Ergebnis.

## Teil C – Aktivierungsplan

### Was schon gebaut ist (inaktiv)

| Datei                       | Änderung                                                                                                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/series/calendar.ts`    | `generatorChangeDate = null` und `generatorVersionFor(id)`                                                                                                                             |
| `src/automation/plan.ts`    | Generator 0.3.0 ab dem Datum; Historie der letzten höchstens 30 Werke; Profil aus `readGenerationConfig`; liest mit `readArchive` und prüft, dass Schema 3 genau ab dem Datum vorkommt |
| `src/automation/release.ts` | optionales Feld `artReviewV3` und `assertGeneratorGate`                                                                                                                                |
| `src/automation/git.ts`     | `planAt` reicht das Testdatum durch                                                                                                                                                    |
| `scripts/validate-data.ts`  | prüft die Hashes der Abnahme-Fixtures, sobald `artReviewV3` eingetragen ist                                                                                                            |

Solange das Datum `null` ist, erzeugt der Tageslauf wie bisher: Der neue
Planer sagt für den 13.11. „Chwkante im Zwischenraum“ und für den 14.11.
„Azurschweben“ (Lexikon 0.2.0) voraus, genau wie der Lexikonbericht. Ein Werk
im Schema 3 im Archiv stoppt den Lauf, solange kein passendes Datum gesetzt
ist. Das Worker-Bundle ist unverändert (805,92 KiB).

Festlegungen:

- Seed der neuen Werke: `evolvera:0.3.0:<Werkdatum>`, vom Generator an den
  Digest des Snapshots gebunden.
- Snapshot: Modus aus der Konfiguration plus Standardprofil;
  `settingsRevision` ist die Revision der Konfiguration.
- Die Konfiguration bleibt Schema 1. Der Tageslauf liest sie weiter strikt
  und holt nur das Profil über `readGenerationConfig`; Schema 2 im Tageslauf
  kommt mit P8.
- Die ersten zwei neuen Werke haben Eltern im Schema 2; die Generation zählt
  weiter.

### Was die Aktivierung selbst ändert (braucht eigene Freigabe)

1. `src/series/calendar.ts`: `generatorChangeDate` auf das Werkdatum D.
2. `config/release.json`: `artReviewV3` mit Abnahmedatum, Zahl der Werke (40),
   Wortlaut der Abnahme und SHA-256 beider Fixtures.
3. `tests/activation.test.ts`: der Test „ist im veröffentlichten Stand nicht
   gesetzt“ wird auf D umgestellt; die Datei liest das echte Archiv mit
   `readWorks` und muss auf `readArchive` wechseln, sobald das erste Werk im
   Schema 3 archiviert ist.
4. `AGENTS.md`, HANDOFF, NEXT-START, dieser Bericht.
5. Nach dem ersten neuen Werk: `tests/archive-baseline.test.tsx` und die
   zugehörige Browserprüfung rendern heute fest mit Renderer 1. Bevor Werke
   im Schema 3 in die Baseline kommen, brauchen beide den Dispatch.

Nicht berührt: `config/generation.json`, Worker, Workflows, Generator 0.2.0,
alle Archivdateien.

### Offene Betreiberentscheidungen

- **Werkdatum D.** Es muss nach dem letzten archivierten Werk liegen.
  Empfehlung: frühestens 16.11.2026, damit der Lexikon-Beleg zum 14.11. vorher
  ungestört erbracht wird, und mindestens zwei Tage nach dem
  Aktivierungs-Push, damit noch ein Lauf mit Generator 0.2.0 auf dem neuen
  Stand zu sehen ist.
- **Serienneustart mit Löschung aller Werke** (am 11.11. zurückgestellt):
  nicht Teil dieses Plans. Falls gewünscht, braucht er einen eigenen Auftrag,
  weil er `AGENTS.md` (historische Werke erhalten), Betreiberentscheidung 1
  und die Archiv-Baseline berührt.

### Push-Reihenfolge

Der Pages-Workflow führt bei jedem Push auch den Tageslauf aus. Deshalb nur
pushen, wenn nichts fällig ist (das Tageswerk ist archiviert und lokal
übernommen).

1. **Push 1 – inaktiver Stand:** Baseline 12.11., Abnahme-Fixtures und
   Sammlungen, Messseite, inaktive Verdrahtung mit Tests, Doku. Verhalten des
   Tageslaufs unverändert. Danach CI und Pages grün abwarten und den nächsten
   Schedule-Lauf belegen (Titel wie vorhergesagt, Generator 0.2.0).
2. **Push 2 – Aktivierung:** die Punkte 1 bis 4 oben in einem Commit, nach
   ausdrücklicher Freigabe, vorher `npm run check`, `npm run test:browser`
   und `npm run worker:test-runtime`. Vor dem Push Remote prüfen und
   Archivcommits per Fast-forward bzw. Rebase übernehmen.

Liegt D versehentlich auf oder vor einem archivierten Werk, stoppt der Lauf
ohne Archivierung („Archivwerk passt nicht zum datierten Generatorwechsel“).

### Kontrolle des ersten neuen Laufs (Werkdatum D)

- Run-ID, Auslöser, Startzeit, Status; Archivcommit.
- Der Archivcommit enthält genau eine neue Werkdatei und die geänderte
  `index.json` (`git diff --name-status`).
- Werk: `schemaVersion` 3, `generatorVersion` 0.3.0, `rendererVersion` 2,
  `lexiconVersion` 0.2.0, Abstandsversion 1, `settingsRevision` der
  Konfiguration, Snapshot gleich Standardprofil mit dem gespeicherten Modus,
  `parentIds` gleich D−2 und D−1, Generation fortlaufend, Abstand und
  Vermerk in `novelty`.
- Originalbytes: SHA-256 aller älteren Werkdateien gegen das Manifest der
  Archiv-Baseline; Archiv-Baseline in CI grün.
- Datenprüfung des Pages-Laufs erfolgreich (sie rechnet Belege, Digest und
  Abstand mit voller Historie nach).
- Detailansicht des Werks auf der Live-Website: Herkunft mit Eltern im
  Schema 2, Rahmenbedingungen.

Ab dem ersten archivierten Werk sind Renderer 2 und Schema 3 eingefroren.
Zeigt das erste Werk einen Fehler: nichts löschen und nichts neu erzeugen,
Generierung über die Betreiberfunktion anhalten und gemeinsam entscheiden.

## Tests zum Plan

`tests/activation.test.ts` (8 Tests, ohne Aktivierung; das Datum wird nur im
Test gesetzt, alle Schreibvorgänge laufen in temporären Repositories mit
lokalem Remote):

- Im veröffentlichten Stand ist kein Datum gesetzt und keine Abnahme von
  0.3.0 eingetragen.
- Ohne Datum: sechs weitere Tage mit Generator 0.2.0, alte Bytes unverändert.
- Mit Datum: drei Tage 0.2.0, dann drei Tage 0.3.0 im Schema 3 mit
  Standardprofil, fortlaufender Generation und Eltern im Schema 2; die Werke
  vor dem Datum hängen nicht vom Datum ab.
- Nachholung über das Datum hinweg ergibt dieselben Werke wie sechs
  pünktliche Tagesläufe.
- Ohne dokumentierte Abnahme stoppt der Lauf vor dem ersten Werk von 0.3.0.
- Ein Datum, das nicht zum Archiv passt, stoppt den Lauf.
- 36 Tage am Stück: Der strenge Leser bestätigt jedes Werk aus den 30 Werken
  davor (eigenes Zeitlimit).
- Echtes isoliertes Git-Repository mit einer Kopie des Archivs: Lauf vor dem
  Datum, verspäteter Lauf danach, nur neue Dateien und `index.json` geändert,
  jede alte Datei mit derselben Objekt-ID, Wiederholung archiviert nichts,
  ein gelöschtes Werk im Schema 3 kommt bytegenau aus Git zurück.

Dazu `tests/acceptance-v3.test.tsx` (10), `tests/frame-stats.test.ts` (3) und
`tests/browser/acceptance.spec.ts` (8 Fälle je Projekt, ohne Referenzbilder).

## Prüfungen

Lokal am 12.11.2026: `npm run check` erfolgreich mit **408 Tests** (385 + 2
für die Baseline + 21), Datenprüfung mit neun Werken, alle Fixtures
reproduziert. `CI=true npm run test:browser` gegen den frischen Build:
**170 bestanden** (152 + 2 + 16), sechs bestehende Skips; kein bestehendes
Referenzbild verändert. `npm run generate:daily -- --dry-run`: nichts fällig,
neun Werke.

Nicht geprüft: Firefox; Live-Website;
`npm run worker:test-runtime` (Worker unberührt, Bundle unverändert).

## Grenzen

- Der Tageslauf prüft nicht, ob das Wechseldatum sinnvoll gewählt ist; er
  stoppt nur, wenn es dem Archiv widerspricht.
- `tests/activation.test.ts` rechnet relativ zum letzten archivierten Werk
  und wächst mit dem Archiv mit, solange dort nur Werke im Schema 1 und 2
  liegen.
- Die Messseite wählt die „aufwendigsten“ Werke nach einer einfachen
  Gewichtung der Effekte, nicht nach gemessener Last.
- Die Abnahmewerke zeigen keine Übergangskette aus dem echten Archiv; den
  Übergang von alten Eltern zeigt weiter die Sammlung `ep01-transition`.
