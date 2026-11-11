# Evolvera – aktueller Übergabestand

## Aktueller Abschluss – 11.11.2026, EP-01 P5 „Vielfalt und Extremprofile“ umgesetzt, gesichtet und veröffentlicht

Der Betreiber hat P5 am 11.11.2026 beauftragt. Sichtung vor Beginn (18:34
Berlin): lokal und Remote synchron auf `b6f0b05` (Korrektur des
P5-Startprompts; CI 43068013686 und Pages 43068013550 erfolgreich), acht
Werke 04.–11.11., nichts fällig. Bauplan freigegeben, Ergebnis am selben Tag
gemeinsam gesichtet.
[Verfahren, Messung und Grenzen](extensions/EP01-vielfalt-5.md).

- **Veröffentlicht am 11.11.2026, 22:23 Berlin** (Betreiberfreigabe; Remote
  stand unverändert auf `b6f0b05`, reiner Fast-forward, kein Fetch nötig):
  `1d29baa` (Abstandsmaß und Fenster), `d5c18a0` (Probeketten und zwei
  Kettenbilder) und `acd0140` (Doku zu P5). `1d29baa` allein ist nicht grün,
  weil die Datenprüfung die neu erzeugte Ketten-Fixture aus `d5c18a0`
  braucht; beide gehören zusammen. Beide Push-Läufe erfolgreich: CI
  43102561677 mit `npm run check` (366 Tests),
  `npm run worker:test-runtime` und `npm run test:browser` (138 bestanden,
  sechs Skips) sowie Pages 43102561790. Damit sind die zwei ersetzten
  Kettenbilder auch auf dem Linux-Runner bestätigt. Der Nachtrag dieser
  Veröffentlichung in HANDOFF, NEXT-START, Plan und Bericht ist ein eigener
  Doku-Commit danach.
- **Archiv-Baseline (Schritt 1): nichts ergänzt.** Seit dem 11.11. gibt es
  kein neues Werk; das Werk vom 12.11. ist erst ab 01:17 fällig. Die
  Ergänzung ist der erste Schritt von P6.
- **Neustart der Serie zurückgestellt:** Der Betreiber hat am 11.11. gefragt,
  ob alle bisherigen Werke gelöscht werden können, damit die Serie mit der
  Neuentwicklung neu beginnt, und sich dann entschieden, vorerst ohne
  Löschen weiterzumachen. Kein Auftrag; nichts gelöscht. Empfehlung aus dem
  Gespräch: falls gewünscht, als Teil der Aktivierung in P7 und nur mit
  ausdrücklicher Freigabe, weil es `AGENTS.md` (historische Werke erhalten),
  Betreiberentscheidung 1 (keine neue Serie) und die Archiv-Baseline berührt.
- **Neu:** `src/art/generator/v3/distance.ts`,
  `src/art/generator/novelty-simulation.ts`, `scripts/novelty-simulation.ts`
  (nicht Teil von `npm run check`), `tests/novelty-v3.test.ts`,
  `docs/extensions/EP01-vielfalt-5.md`.
- **Geändert:** `evolve.ts`, `provenance.ts` und `parents.ts` unter
  `src/art/generator/v3/`, `preview-chain-v3.ts`,
  `tests/evolution-v3.test.ts`.
- **Umfang:** Abstandsmaß Version 1 (Familien 0,25, Palette 0,25, Formarten
  0,15, Füllarten 0,15, Dichte 0,10, Bewegung 0,10; auch gegenüber Schema 1
  und 2). Der Generator nimmt die geordnete Historie als Eingabe (höchstens
  30 Werke, endet mit den Eltern), nimmt in 16 Versuchen den ersten gültigen
  Kandidaten über dem Mindestabstand, sonst den abstandsstärksten mit
  `minimumReached: false`. Das Feld `novelty` ist echt; der Platzhalter
  `NOVELTY_PLACEHOLDER` ist entfallen. `validateEvolutionV3` rechnet Digest,
  Abstand und Vermerk nach. Die Historie geht nicht in den Seed ein.
- **Betreiberentscheidungen zu P5:** Bauplan freigegeben; **Mindestabstand
  0,02 für beide Modi** (keine eigene Schwelle für `free`; in P7 an den
  Abnahmewerken noch einmal ansehen); Extremprofile abgenommen, Profilregeln
  unverändert; `src/automation/plan.ts` bleibt bis P7 unberührt.
- **Messung** (vier Ketten × 365 Tage je Modus): bei 0,02 werden im Modus
  `traceable` 9,3 % der Kandidaten verworfen, im Modus `free` 0,3 %; der
  Mindestabstand wird nie verfehlt, höchstens der sechste Versuch ist nötig.
  Bei 0,22 wären es 60,4 % und 9,5 %.
- **Extremprofile** (18 Ketten mit je 52 Werken): alle fehlerfrei und vom
  strengen Prüfer bestätigt, kein Profil unmöglich, Mindestabstand nie
  verfehlt. Auffällig nur alles `off` im Modus `traceable` mit 27 %
  verworfenen Kandidaten.
- **Probeketten neu erzeugt** (`fixtures/preview/ep01-chains.json`): alle 24
  Werke haben neuen Digest und Abstand; in der Gestalt verändert sind sechs
  (`traceable` Gen. 8–10, Übergangskette Gen. 12–14). Ersetzt wurden nur die
  zwei Bilder `generator-v3-chain-traceable-10.png`; die übrigen zwölf
  Kettenbilder und alle anderen Referenzen sind unverändert.
  `ep01-origins.json` wurde nicht neu erzeugt und reproduziert unverändert.
- **Prüfungen lokal am 11.11.2026:** `npm run check` erfolgreich mit
  **366 Tests** (334 + 32); Datenprüfung mit acht Werken, 40
  Ursprungs-Probewerke und 24 Kettenwerke reproduziert.
  `CI=true npm run test:browser` gegen den frischen Build: **138 bestanden**,
  sechs bestehende Skips. Nach den Nachträgen in Plan, Bericht, HANDOFF und
  NEXT-START wurde nur `npm run check` wiederholt.
- **Nicht geprüft:** Firefox, Safari und echte Geräte; Renderlast auf einem
  Mobilgerät (P7); Live-Website; `npm run worker:test-runtime` (Worker
  unberührt).
- **Grenzen:** siehe Bericht; insbesondere prüft der Generator nicht, ob der
  Aufrufer genug Historie mitgibt (Verdrahtung in P7), die Übergangskette
  kennt nur ihre zwei alten Eltern, und das Abstandsmaß sieht weder Lage
  noch Größe der Formen.
- **Unverändert:** `study.ts`, `evolve.ts` und `provenance.ts` von Generator
  0.2.0, Titelgenerator, `ArtV1`, `artwork.ts`, `artwork-v3.ts`,
  `profile.ts`, Renderer 2, Konfiguration, `src/automation/plan.ts`, Worker,
  Workflows, Archivdateien, Archiv-Baseline, `fixtures/preview/phase-*.json`,
  Atelier, `package.json`, Lockfile.

Als Nächstes: P6 „Galerie und Detailansicht für Schema 3“ auf
ausdrücklichen Auftrag in einer neuen Sitzung, beginnend mit der Ergänzung
der Archiv-Baseline um die Werke ab 12.11.; unabhängig davon den Lauf für
**Werkdatum 14.11.2026** belegen. [Aktueller Startprompt](NEXT-START.md).

## Vorheriger Abschluss – 11.11.2026, EP-01 P4 „Generator 0.3.0, Teil B“ umgesetzt und veröffentlicht

Der Betreiber hat P4 am 11.11.2026 beauftragt. Sichtung vor Beginn (07:51
Berlin): lokal `8ef9dbb` (Doku-Commit zu P3, ungepusht), Remote-main `3f1b6a1`
mit dem Archivcommit des Tageslaufs. Auf Betreiberfreigabe Fetch und Rebase
des Doku-Commits auf `3f1b6a1` (jetzt `8fe6e6d`); kein Push.
**Die Probeketten sind gesichtet:** Der Betreiber hat sie am 11.11.2026
gesichtet; die Startwerte der Vererbung bleiben. Das ist keine Kunstabnahme
für Generator 0.3.0 (P7) und keine Geräteabnahme.
[Verfahren, Messung und Grenzen](extensions/EP01-evolution-3.md).

- **Tageslauf 11.11.:** Schedule-Lauf 42974147412 erfolgreich, gestartet
  07:41 Berlin, Archivcommit `3f1b6a1` um 07:43: Gen. 8 „Chschfieber im
  Morgen“, Eltern 09.11. und 10.11., `traceable`/6, Generator 0.2.0,
  Renderer 1, Lexikon 0.1.0; Titel wie im Lexikonbericht vorhergesagt. Das
  war der erste Schedule-Lauf mit dem Stand P0 bis P3. Start wieder gut sechs
  Stunden nach 01:17.
- **Archiv-Baseline:** um das Werk vom 11.11. ergänzt (`7c81407`); die sieben
  bestehenden Einträge und 14 Bilder sind unverändert.
- **Neu:** `evolve.ts`, `inherit.ts`, `parents.ts`, `provenance.ts` und
  `sha256.ts` unter `src/art/generator/v3/`;
  `src/art/generator/preview-chain-v3.ts`; `src/art/schema/chains-v3.ts`;
  `scripts/chain-fixtures.ts`; `fixtures/preview/ep01-chains.json` mit 24
  Kettenwerken; `src/app/EvolutionChains.tsx`; `tests/evolution-v3.test.ts`,
  `tests/browser/chains.spec.ts` und 14 neue Referenzbilder
  `generator-v3-chain-<Kette>-<Generation>.png`.
- **Geändert:** `artwork-v3.ts` hat das neue Pflichtfeld `evolution.recipe`
  (Betreiberentscheidung; Testfixture und ein Test dazu angepasst);
  `compose.ts` ist in wiederverwendbare Teile zerlegt, `kit.ts` und
  `checks.ts` haben je eine Ergänzung; `Atelier.tsx` zeigt den neuen
  Abschnitt, `shell.css` hat dafür eigene Klassen (`chainv3-*`);
  `package.json` ruft in `validate:data` zusätzlich
  `scripts/chain-fixtures.ts` auf.
- **Umfang:** vollständige Werke im Schema 3 als Ursprung oder Kind zweier
  Eltern; Vererbung je Ebene und Merkmalsgruppe; Belege nur an sichtbaren
  Formen, ohne Raster und Polster; `off` mit `constrained`, `always`;
  Mutationsstärke und Mutationssprünge; Eltern im Schema 2 nur im Speicher;
  Seed mit SHA-256 des vollständigen Snapshots; strenger Prüfer
  `validateEvolutionV3`. `novelty` ist bis P5 ein benannter Platzhalter.
- **Betreiberentscheidungen zu P4:** Bauplan freigegeben; kleines Feld
  `evolution.recipe` im Schema 3; zusätzliche Übergangskette aus vier Werken;
  Startwerte der Vererbung wie im Bericht, nach der Sichtung bestätigt.
- **Prüfungen lokal am 11.11.2026:** `npm run check` erfolgreich mit
  **334 Tests** (317 + 2 für die Baseline + 15); Datenprüfung mit acht
  Werken, Archiv-Baseline grün, 40 Ursprungs-Probewerke und 24 Kettenwerke
  deterministisch reproduziert. `CI=true npm run test:browser` gegen den
  frischen Build: **138 bestanden** (118 + 2 für die Baseline + 18), sechs
  bestehende Skips, kein Wiederholungsversuch; alle bisherigen Referenzen
  unverändert. Messung über je 5 000 Kinder pro Modus im Standardprofil: kein
  Fehlschlag, höchstens der siebte Versuch nötig. Nach den Nachträgen in
  Plan, HANDOFF und NEXT-START wurde nur `npm run check` wiederholt.
- **Veröffentlicht am 11.11.2026, 18:07 Berlin** (Betreiberfreigabe; Remote
  stand unverändert auf `3f1b6a1`, kein Rebase nötig): `8fe6e6d` (Doku zu
  P3), `7c81407` (Baseline), `3358cd7` (Rezept im Schema 3), `a78aed6`
  (Evolution und Belege), `00a25c6` (Probeketten im Atelier) und `bebaca5`
  (Doku zu P4). Beide Push-Läufe erfolgreich: CI 43065133460 mit
  `npm run check` (334 Tests), `npm run worker:test-runtime` und
  `npm run test:browser` (138 bestanden, sechs Skips) sowie Pages 43065133417. Damit sind die 14 neuen Kettenbilder auch auf dem
  Linux-Runner bestätigt. Der Nachtrag dieser Veröffentlichung in HANDOFF,
  NEXT-START, Plan und Bericht ist ein eigener Doku-Commit danach.
- **Lehre:** Ein erster Entwurf holte für den zweiten Elternteil fast immer
  eine neue Belegform dazu (46 % der Beiträge). Erst die Messung zeigte das;
  jetzt tragen zuerst vorhandene Formen den Beitrag (neue Form rund 7 %).
  Außerdem: Neue Kachelraster im Atelier verlängern den Tastaturweg; die
  Ketten sind deshalb je ein Tab-Halt mit Pfeiltasten.
- **Nicht geprüft:** Firefox, Safari und echte Geräte; Renderlast auf einem
  Mobilgerät (P7); Live-Website nicht aufgerufen; `npm run worker:test-runtime`
  lokal nicht ausgeführt (Worker unberührt; in der CI gelaufen).
- **Grenzen:** siehe Bericht; insbesondere Versatzbelege, gemeinsame Farben
  beider Eltern, entfernte Effekte unter `off`, Determinismus nur unter
  Node 24. Die Ketten-Fixture ist bis P7 nicht eingefroren.
- **Unverändert:** `study.ts`, `evolve.ts` (0.2.0), `provenance.ts` (0.2.0),
  Titelgenerator, `ArtRenderer.tsx`, `ArtV1`, `artwork.ts`, Renderer 2,
  Konfiguration, Worker, Workflows, Archivdateien,
  `fixtures/preview/phase-*.json`, `ep01-origins.json`, Musterbogen,
  bestehende Browserreferenzen, Lockfile.

Als Nächstes: P5 „Vielfalt und
Extremprofile“ auf ausdrücklichen Auftrag in einer neuen Sitzung; unabhängig
davon den Lauf für **Werkdatum 14.11.2026** belegen, sobald er stattgefunden
hat. [Aktueller Startprompt](NEXT-START.md).

## Vorheriger Abschluss – 11.11.2026, EP-01 P3 „Generator 0.3.0, Teil A“ umgesetzt und veröffentlicht

Der Betreiber hat P3 am 10.11.2026 beauftragt. Sichtung vor Beginn (23:25
Berlin) und bei Abschluss (23:56 Berlin, API): HEAD/main und Remote-main
`388afd6`, sieben Werke, nichts fällig, kein neuer Lauf. `388afd6` ist der
Doku-Commit nach P2 (CI 42912901856, Pages 42912901879 erfolgreich).
**Sichtung 2 ist erfolgt:** Der Betreiber hat die 40 Probewerke am 10.11.2026
gesichtet und mit „sehr gut“ ohne Änderungswünsche bestätigt. Das ist keine
Kunstabnahme für Generator 0.3.0 (P7) und keine Geräteabnahme.
[Verfahren, Gamut-Behandlung, Messung und Grenzen](extensions/EP01-generator-3.md).

- **Neu:** `src/art/generator/v3/` (`index.ts`, `compose.ts`, `families.ts`,
  `kit.ts`, `palette.ts`, `fills.ts`, `checks.ts`), frei von React, Browser
  und Uhrzeit; `src/art/schema/preview-v3.ts`; `scripts/origin-fixtures.ts`;
  `fixtures/preview/ep01-origins.json` mit 40 Probewerken;
  `src/app/OriginStudies.tsx`; `tests/generator-v3.test.ts`,
  `tests/generator-v3-palette.test.ts`, `tests/browser/origins.spec.ts` und
  zwölf neue Referenzbilder `generator-v3-<id>.png` (sechs Werke, je eine
  Familie, bei 320 px und Desktop).
- **Geändert:** `Atelier.tsx` zeigt den neuen Abschnitt unten im Testatelier;
  `shell.css` hat dafür eigene Klassen (`origin-*`), damit die Tests des
  bisherigen Ateliers unberührt bleiben; `package.json` ruft in
  `validate:data` zusätzlich `scripts/origin-fixtures.ts` auf.
- **Umfang:** nur unabhängige Ursprungswerke im Schema 3. OKLCH-Paletten mit
  vier Strategien und Hex-Ausgabe, Füllungsgen, sechs Familien, Linienbündel
  und Schraffuren, bis zu drei Ebenen, Symmetrie, Dichte, Häufigkeitsstufen
  15 / 40 / 70 %, Einstellungssnapshot im Probewerk, Sichtbarkeitsanker und
  Lastgrenzen als harte Prüfungen mit bis zu 16 deterministischen Versuchen.
- **Betreiberentscheidungen zu P3:** schlankes Vorschauformat statt
  vollständiger Werke (die entstehen in P4); 40 fortlaufende Seeds ohne
  Auswahl; Referenzbilder nur für sechs Werke; ein zusätzlicher Prüfaufruf in
  `package.json`.
- **Prüfungen lokal am 10.11.2026:** `npm run check` erfolgreich mit
  **317 Tests** (292 + 25); Datenprüfung mit sieben Werken, Archiv-Baseline
  grün, 40 Probewerke deterministisch reproduziert.
  `CI=true npm run test:browser` gegen den frischen Build: **118 bestanden**
  (102 + 16), sechs bestehende Skips, kein Wiederholungsversuch; alle
  bisherigen Referenzen unverändert. Messung über 20 000 Seeds im
  Standardprofil: kein Fehlschlag, 92,9 % im ersten Versuch, höchstens der
  siebte Versuch nötig. Nach den Nachträgen in Plan, HANDOFF und NEXT-START
  wurde nur `npm run check` wiederholt.
- **Veröffentlicht am 11.11.2026, 00:10 Berlin: f4e292b77c00c9e21c4635ac42b9406abc4e3d94**,
  in drei regulären Fast-forward-Pushes auf Betreiberfreigabe (Remote jeweils
  vorher per API unverändert bestätigt, kein Fetch nötig). Sechs Commits:
  `28092ab` (Paletten und Füllungen), `2d98046` (Generator), `a45da38`
  (Probewerke im Atelier, Tests, zwölf Bilder), `6ab3f45` (Berichte),
  `fbac451` und `f4e292b` (Korrekturen, siehe unten).
  [CI 42921134780](https://github.com/bummber/evolvera/actions/runs/42921134780)
  und [Pages 42921134852](https://github.com/bummber/evolvera/actions/runs/42921134852)
  (Build und Deploy) erfolgreich: je **118 Browserfälle bestanden/sechs
  bestehende Skips**, 40 Probewerke reproduziert. Damit bestehen die auf macOS
  erzeugten zwölf Bilder auch auf dem Linux-Runner. Beim Push kein neues Werk
  und kein Archivcommit; Remote-main danach `f4e292b`.
- **Zwei Fehlversuche davor, main war von 23:59 bis 00:17 Berlin rot:**
  Push 1 (`6ab3f45`, 23:59): CI 42919429281 und Pages 42919429410 im Build
  gescheitert, Deploy übersprungen. Ein Massentest des Generators (1500 Seeds)
  brauchte auf dem Runner 7 s und überschritt das Standardlimit von 5 s;
  behoben in `fbac451` (Zeitlimit 120 s für diese Testgruppe). Push 2
  (`fbac451`, 00:05): CI 42920330470 und Pages 42920330440 erneut im Build
  gescheitert. `tests/routing.test.tsx` fand beim Direktlink `#/atelier` die
  Überschrift nicht rechtzeitig, weil das Atelier beim Laden die 40 Probewerke
  mitprüfte; behoben in `f4e292b`: Der Abschnitt wird nachgeladen
  (`OriginStudies` als eigener Chunk, Atelier-Paket 101 kB statt 411 kB). In
  beiden Fehlversuchen wurde nichts veröffentlicht und nichts archiviert.
  Lehre: Lokale Laufzeiten sagen wenig über den Runner; neue Massentests
  brauchen ein eigenes Zeitlimit, große Fixtures einen eigenen Chunk.
- **Nicht geprüft:** Firefox, Safari und echte Geräte; Renderlast der
  erzeugten Werke auf einem Mobilgerät (P7); Live-Website nicht aufgerufen. Der erste Schedule-Lauf
  seit P0 (Werkdatum 11.11.) stand bei Abschluss noch aus.
- **Grenzen:** Determinismus ist nur unter Node 24 geprüft; Zahlen sind auf
  sechs Nachkommastellen gerundet, Winkelfunktionen sind zwischen Engines
  nicht garantiert bitgleich. Bei rund jedem fünften Werk kommt für den Anker
  eine eigene Form dazu. Die Fixture ist bis P7 nicht eingefroren.
- **Unverändert:** `study.ts`, `evolve.ts`, `provenance.ts`, Titelgenerator,
  `ArtRenderer.tsx`, `ArtV1`, `artwork.ts`, `artwork-v3.ts`, Renderer 2,
  Konfiguration, Worker, Workflows, Archivdateien,
  `fixtures/preview/phase-*.json`, Musterbogen, bestehende Browserreferenzen,
  Lockfile. Archiv-Baseline nicht erweitert (noch kein Werk nach dem 10.11.).

Als Nächstes: P4 „Generator 0.3.0, Teil B“ auf
ausdrücklichen Auftrag in einer neuen Sitzung; unabhängig davon den Lauf für
**Werkdatum 14.11.2026** belegen, sobald er stattgefunden hat.
[Aktueller Startprompt](NEXT-START.md).

## Vorheriger Abschluss – 10.11.2026, EP-01 P2 „Renderer 2 und Musterbogen“ umgesetzt und veröffentlicht

Der Betreiber hat P2 am 10.11.2026 beauftragt. Stand vor Beginn (21:31 Berlin)
und bei Abschluss (22:51 Berlin, API): HEAD/main und Remote-main `2a24d64`,
sieben Werke, kein neuer Lauf. P2 ist umgesetzt und veröffentlicht (siehe unten).
**Sichtung 1 ist erfolgt:** Der Betreiber hat den Formen- und
Oberflächenkatalog am 10.11.2026 gesichtet und mit „Das Ergebnis ist gut“ ohne
Änderungswünsche bestätigt. Das ist keine Kunstabnahme für Generator 0.3.0
(P7) und keine Geräteabnahme.
[Technik, Browserunterstützung, Messung und Grenzen](extensions/EP01-renderer-2.md).

- **Neu:** `ArtRendererV2.tsx`, `ArtV2.module.css`, `v2/geometry.ts`,
  `v2/paint.ts` und `motion.ts` unter `src/art/renderer/`;
  `src/art/schema/catalog.ts`; Musterbogen `fixtures/preview/ep01-catalog.json`
  mit sieben Bögen; `tests/renderer-v2.test.tsx`,
  `tests/browser/catalog.spec.ts` und 14 neue Referenzbilder
  `renderer-v2-<Bogen>.png` (320 px und Desktop).
- **Geändert:** `ArtDispatch.tsx` gibt Version 2 an Renderer 2; `ArtStage.tsx`
  benutzt den Dispatch und kann seinem Abspielschalter einen Namen geben, weil
  das Atelier jetzt mehrere Bühnen zeigt; `Atelier.tsx` und `shell.css` zeigen
  den Musterbogen unten im Testatelier; `artwork-v3.ts` prüft Lastgrenzen,
  Musterwinkel und Maskenrichtung; ein Dispatch-Test in
  `tests/artwork-v3.test.tsx` angepasst.
- **Technik:** Alle Umrisse sind berechnete `clip-path: polygon()` oder
  `border-radius`, Füllungen und Muster sind CSS-Verläufe, ein DOM-Knoten je
  Element, kein `<img>`, `<svg>`, `<canvas>`, kein `url(...)` (A-34 durch Tests
  belegt). `clip-path: path()` wird nicht benutzt.
- **Prüfungen lokal am 10.11.2026:** `npm run check` erfolgreich mit
  **292 Tests** (265 + 27), Datenprüfung mit sieben Werken, Archiv-Baseline
  grün. `CI=true npm run test:browser` gegen den frischen Build:
  **102 bestanden** (86 + 16), sechs bestehende Skips; alle bisherigen
  Referenzen unverändert. `npm run worker:test-runtime` erfolgreich. Nach den
  Nachträgen in HANDOFF und NEXT-START wurde nur `npm run check` wiederholt.
- **Browser:** Chromium und WebKit (Playwright) zeigen alle Bögen ohne
  Seitenfehler und im Sichtvergleich übereinstimmend. **Firefox nicht
  geprüft** (startet in der Sandbox der Sitzung nicht), echte Geräte nicht
  geprüft. Unterstützung laut MDN Browser Compat Data im Technikbericht.
- **Lastgrenzen:** Startwerte des Plans als harte Schemaprüfung. Messung in
  Chromium ohne Bildschirm mit CPU-Drosselung bis Faktor 6 ohne Auffälligkeit;
  sie misst nur den Hauptthread und ersetzt keine Messung auf einem
  Mobilgerät (P7).
- **Veröffentlicht am 10.11.2026, 23:00 Berlin: e4567f2a662988741d5898493882093e60e0502a**,
  regulärer Fast-forward-Push von `2a24d64` (Remote vorher per API unverändert
  bestätigt, kein Fetch nötig). Drei Commits: `34355fb` (Renderer 2),
  `9f2a0fa` (Musterbogen im Atelier, Tests, 14 Bilder), `e4567f2` (Berichte).
  [CI 42910501876](https://github.com/bummber/evolvera/actions/runs/42910501876)
  und [Pages 42910501402](https://github.com/bummber/evolvera/actions/runs/42910501402)
  (Build und Deploy) erfolgreich: je **292 Tests** und **102 Browserfälle
  bestanden/sechs bestehende Skips**, ohne Wiederholungsversuch. Damit bestehen
  die auf macOS erzeugten Musterbogen-Bilder auch auf dem Linux-Runner. Beim
  Push kein neues Werk und kein Archivcommit; Remote-main danach `e4567f2`.
  Der Musterbogen ist seitdem auch im veröffentlichten Testatelier sichtbar.
- **Nicht geprüft:** Live-Website nicht aufgerufen. Der erste Schedule-Lauf
  seit P0 (Werkdatum 11.11.) steht aus.
- **Unverändert:** Generator, Titelgenerator, `ArtRenderer.tsx`, `ArtV1`,
  `artwork.ts`, Konfiguration, Worker, Workflows, Archivdateien,
  `fixtures/preview/phase-*.json`, bestehende Browserreferenzen, Lockfile.
  Archiv-Baseline nicht erweitert (noch kein Werk nach dem 10.11.).

Als Nächstes: P3 „Generator 0.3.0, Teil A“ auf ausdrücklichen Auftrag in einer
neuen Sitzung; unabhängig davon den Lauf für **Werkdatum 14.11.2026** belegen,
sobald er stattgefunden hat. [Aktueller Startprompt](NEXT-START.md).

## Vorheriger Abschluss – 10.11.2026, EP-01 P1 „Verträge“ umgesetzt und veröffentlicht

Der Betreiber hat am 10.11.2026 den Lexikon-Beleg als Voraussetzung aufgehoben
und P1 beauftragt. Stand vor Beginn: HEAD/main und Remote-main `48f55fc`
(API, 21:12 Berlin), danach lokal `dafd124` (Aufhebung der Voraussetzung in
Plan, HANDOFF und NEXT-START; noch nicht gepusht). P1 ist rein ergänzend: Die
laufende Serie benutzt keinen der neuen Verträge.

- **Betreiberentscheidungen zu P1:** Schlüssel und Standardprofil aus
  `PRD_1_2.md` Abschnitt 8.4 (das im Plan genannte Varianz-Dokument liegt nicht
  im Projekt); Regelversion 1 nur mit den zwei Pflichtregeln; neuer Leser nur
  ergänzen, bestehende Stellen nicht umstellen.
- **Neu:** `src/art/schema/profile.ts` (Profil, Standardprofil, Regelmodul),
  `configV2Schema` und `readGenerationConfig` in `src/art/schema/config.ts`,
  `src/art/schema/artwork-v3.ts` (DNA und Werk im Schema 3, Belegpfade,
  `constrained`, `validateArtworkV3`, `anyArtworkSchema`),
  `src/art/renderer/ArtDispatch.tsx`. Tests: `tests/config-v2.test.ts`,
  `tests/artwork-v3.test.tsx`, Fixture `tests/fixtures/artworks-v3.ts`.
- **Einzige geänderte Bestandsdatei im Code:** `src/art/schema/config.ts`,
  nur Ergänzungen am Dateiende und ein Import; `configSchema` (Schema 1) ist
  unverändert. Der Worker bündelt diese Datei mit (Dry-run 805,92 KiB statt
  801,32 KiB), benutzt die Ergänzungen aber nicht.
- **Abweichungen vom Planwortlaut**, im Plan unter P1 festgehalten: Schema 3
  in eigener Datei statt in `artwork.ts`; `artworkSchema` bleibt die Union aus
  1 und 2, Schema 3 kommt über `anyArtworkSchema` dazu; Dispatch und Leser sind
  noch nirgends eingebaut. Vorläufig bis P2/P4/P5: Wertebereiche des
  Vokabulars, Feld `novelty`, fehlendes Evolutionsrezept, Lastgrenzen über 120
  Elemente hinaus.
- **Prüfungen lokal am 10.11.2026:** `npm run check` erfolgreich mit
  **265 Tests** (207 + 58); alle sieben Archivwerke und die 40 Testwerke
  validieren unverändert, Archiv-Baseline grün. `CI=true npm run test:browser`
  gegen den frischen Build: **86 bestanden**, sechs bestehende Skips.
  `npm run worker:test-runtime` erfolgreich. Nach den Nachträgen in Plan,
  HANDOFF und NEXT-START wurde nur `npm run check` wiederholt.
- **Veröffentlicht am 10.11.2026, 21:24 Berlin: 2a24d646856b49af64b3be141f6b227c2e2f1cb6**,
  regulärer Fast-forward-Push von `48f55fc` (Remote vorher per API unverändert
  bestätigt, kein Fetch nötig). Vier Commits: `dafd124` (Voraussetzung
  aufgehoben), `16f9a3f` (Profil und Konfigurationsschema 2), `019d2ce`
  (Werkschema 3 und Dispatch), `2a24d64` (Plan, HANDOFF, NEXT-START).
  [CI 42894962254](https://github.com/bummber/evolvera/actions/runs/42894962254)
  und [Pages 42894962290](https://github.com/bummber/evolvera/actions/runs/42894962290)
  (Build und Deploy) erfolgreich: je **265 Tests** und **86 Browserfälle
  bestanden/sechs bestehende Skips**, Datenprüfung mit sieben Werken. Beim
  Push kein neues Werk und kein Archivcommit; Remote-main danach `2a24d64`.
- **Nicht geprüft:** Live-Website und echter Worker (kein Worker-Upload; der
  veröffentlichte Worker ist unverändert). Der erste Schedule-Lauf mit der
  Archiv-Baseline und dem P1-Stand (Werkdatum 11.11.) steht noch aus.
- **Unverändert:** Generator, Titelgenerator, `ArtRenderer.tsx`, `ArtV1`,
  `artwork.ts`, Konfigurationsdateien, Worker-Code, Workflows, Archivdateien,
  `fixtures/preview`, Browserreferenzen, Lockfile. Die Archiv-Baseline wurde
  nicht erweitert, weil es noch kein Werk nach dem 10.11. gibt.

Als Nächstes: P2 „Renderer 2 und Musterbogen“ nur auf ausdrücklichen Auftrag;
unabhängig davon den Lauf für **Werkdatum 14.11.2026** belegen, sobald er
stattgefunden hat. [Aktueller Startprompt](NEXT-START.md).

## Vorheriger Abschluss – 10.11.2026, EP-01 beauftragt, P0 umgesetzt und veröffentlicht

Lesende Sichtung am 10.11.2026 um 18:35 Berlin: HEAD/main und Remote-main
(GitHub-API, ohne Fetch) beide `a258422`, sieben Werke 04.–10.11., `traceable`/6,
nichts fällig, letzte acht Läufe (Push, CI und Pages) erfolgreich. Der Betreiber
hat EP-01 und daraus ausschließlich das Arbeitspaket P0 beauftragt.
[Umsetzungsplan](extensions/EP01-umsetzungsplan.md), Betreiberentscheidungen in
Abschnitt 7.

- **Regeln angepasst:** `AGENTS.md` führt EP-01 als beauftragt, nennt die
  Fachquelle (PRD v1.1 mit EP-01 und Umsetzungsplan; `PRD_1_2.md` Hintergrund,
  unversioniert), die paketweise Arbeit mit Sichtung und die Archiv-Baseline.
  Im Plan steht jetzt, dass der Lexikon-Beleg zum 14.11. Voraussetzung für P1
  ist, nicht für P0.
- **Archiv-Baseline (A-36), eingefroren bis 10.11.2026:**
  `tests/fixtures/archive-baseline/manifest.json` hält SHA-256, Generation und
  Titel der sieben Werkdateien; `markup/<Datum>.txt` die serialisierte Ausgabe
  von Renderer 1 je Werk. `tests/archive-baseline.test.tsx` prüft Bytes,
  Renderer-Ausgabe, den Index und unerwartete Dateien (17 Tests).
  `tests/browser/archive-baseline.spec.ts` vergleicht je Werk ein Bild bei
  320 px und Desktop: 14 neue Bilder `archive-<Datum>.png`; die sechs
  bestehenden Referenzen `renderer-v1-*` sind unverändert.
- **Verträglichkeit mit dem Tageslauf:** Zusätzliche Werkdateien mit späterem
  Datum werden geduldet. `index.json` wird nicht per Hash geprüft, weil sie sich
  täglich ändert, sondern darauf, dass die eingefrorenen Einträge unverändert
  enthalten sind. Die CSS-Modul-Suffixe des Testlaufs hängen vom Pfad des
  Checkouts ab und werden deshalb aus dem Vergleich herausgenommen. In einer
  isolierten Kopie geprüft: ein zusätzliches Werk 11.11. samt Indexzeile
  besteht; ein geändertes Byte, eine fremde ältere Datei und ein geänderter
  Indextitel schlagen jeweils gezielt fehl.
- **Grenze der Baseline:** Werke ab dem 11.11. sind erst geschützt, wenn die
  Baseline bewusst ergänzt wird (Befehl im Kopf der Testdatei). Das ist als
  erster Schritt von P1 vorgesehen.
- **Prüfungen lokal am 10.11.2026:** `npm run check` erfolgreich mit
  **207 Tests** (190 + 17), Datenprüfung mit sieben Werken, Build und
  Worker-Dry-run. `CI=true npm run test:browser` gegen den frischen Build:
  **86 bestanden** (72 + 14), sechs bestehende Skips. Nach den abschließenden
  Nachträgen in HANDOFF und NEXT-START wurde `npm run check` wiederholt, die
  Browsersuite nicht.
- **Veröffentlicht am 10.11.2026, 20:56 Berlin: 834845273023efea10099600ef69cc6f4c6161f8**,
  regulärer Fast-forward-Push von `a258422` (Remote vorher per API unverändert
  bestätigt, kein Fetch nötig). Vier Commits: `5949b0e` (future-series),
  `bb66924` (Umsetzungsplan), `b8095bd` (Archiv-Baseline), `8348452` (Regeln,
  HANDOFF, NEXT-START).
  [CI 42890298475](https://github.com/bummber/evolvera/actions/runs/42890298475)
  und [Pages 42890298848](https://github.com/bummber/evolvera/actions/runs/42890298848)
  (Build und Deploy) erfolgreich: je **207 Tests** und **86 Browserfälle
  bestanden/sechs bestehende Skips**, darunter alle 14 neuen Bildvergleiche auf
  dem Linux-Runner ohne Wiederholungsversuch. Beim Push kein neues Werk und
  kein Archivcommit; Remote-main danach `8348452`.
- **Nicht geprüft:** Der erste Schedule-Lauf mit der Baseline (Werkdatum
  11.11.) steht noch aus; die Verträglichkeit mit einem neuen Tageswerk ist
  bisher nur lokal simuliert. `npm run worker:test-runtime` lokal nicht
  ausgeführt (keine Workeränderung). Live-Website nicht aufgerufen.
- **Unverändert:** Generator, Titelgenerator, Renderer, Schemata,
  Konfiguration, Worker, Workflows, Archivdateien, `fixtures/preview`,
  Lockfile. Kein Fetch, Pull, Workflowstart oder Deployment.
- `docs/future-series.md` enthält den vorgemerkten Wunsch Favoriten,
  Löschschalter und Serienneustart vom 10.11.; er ist kein Teil von EP-01.

Nachtrag 10.11.2026: Der Betreiber hat den Lexikon-Beleg zum 14.11. als
Voraussetzung für P1 aufgehoben. Der Beleg bleibt ein eigener Schritt, sobald
der Lauf stattgefunden hat; Arbeitspakete dürfen auf Auftrag schon vorher
beginnen und veröffentlicht werden. Folge: Weicht der Titel am 14.11. ab, ist
zuvor veröffentlichter Code, den der Tageslauf benutzt, als mögliche Ursache
mitzuprüfen. Doku-Push `48f55fc` (CI 42891194079, Pages 42891193825) erfolgreich.

Als Nächstes: P1 „Verträge“ auf ausdrücklichen Auftrag; unabhängig davon den
Lauf für **Werkdatum 14.11.2026** belegen. [Aktueller Startprompt](NEXT-START.md).
P1 bis P9 sind nicht begonnen.

## Vorheriger Abschluss – 10.11.2026, sieben Werke und Titel-Lexikon 0.2.0 veröffentlicht

Lesende Sichtung am 10.11.2026 um 17:11 Berlin, danach auf Betreiberauftrag
Fetch, Rebase zweier lokaler Commits auf den Remote-Archivstand, Umsetzung der
Titelregel und regulärer Push. Kein Force-Push, kein manueller Workflowstart,
kein Gate-/Moduswechsel, kein Worker-Upload.

- **Archiv: sieben Werke, lückenlos 04.11.–10.11.2026.** Die fünf neuen
  Werke stammen aus Schedule-Läufen und liegen in den Archivcommits fc37f32
  (06.11., Gen. 3 „Chrauschen“), ad1fc8d (07.11., Gen. 4 „Chrchschweben im
  Stillstand“), 4d3c975 (08.11., Gen. 5 „Chrfieber“), f834f58 (09.11., Gen. 6
  „Chschweif / Eisweben“) und fbc5fd4 (10.11., Gen. 7 „Chwende im Ungefähren“).
  Alle `traceable`, Revision 6, Familie mosaic. Startdatum 04.11., Generierung
  und Serienfreigabe unverändert true.
- **Der Zeitplan 01:17 startet nicht pünktlich.** Täglich drei erfolgreiche
  Schedule-Läufe, der erste archiviert. Archivcommits um 07:58 (06.11.), 07:11,
  07:17, 07:49 und 08:29 Berlin (10.11.), also sechs bis sieben Stunden nach
  dem geplanten Termin. `isCatchUp` ist bei 06.11. und 10.11. `false`, weil der
  Lauf im selben Berliner Tageszyklus startet. GitHub Actions bleibt best effort.
- **Erster Vererbungsnachweis erbracht.** Unabhängig vom Projektvalidator
  nachgerechnet: Bei allen fünf Werken sind die Eltern n−2 und n−1, alle
  Quellwerte stehen in der Eltern-DNA, alle Zielwerte in der Kind-DNA, die
  Operatoren gehen auf. Gen. 3 erbt je ein sichtbares Merkmal: Breite vom 04.11.
  (0,247285 → 0,25, Offset) und Farbe `#3c47b4` vom 05.11. (Kopie); die Basis
  ist eine Neuschöpfung mit 21 Formen. Belege je Werk (A/B): 1/1, 1/3, 3/3,
  4/2, 1/1. Nicht geprüft: Bytegleichheit zwischen Git, Pages-Artefakt und
  Livestand für die neuen Werke.
- **Titel-Lexikon 0.2.0 ab Werkdatum 14.11.2026.** Lexikon 0.1.0 vererbte
  Buchstabenreste und hielt alle Titel bei „Ch“ fest. Die neue Regel vererbt
  ganze Bausteine; 0.1.0 bleibt für frühere Werkdaten, Vorschauketten und die
  40 Testwerke unverändert. Kein Archivwerk, `config/release.json` oder PRD
  geändert. Der Betreiber hat die Titelvorschau mit „Titel passen“ abgenommen.
  [Maßgeblicher Bericht](title-lexicon-0.2.0.md).
- **Veröffentlicht: 4eae70074d6d42e461f8b578fbc31658f3c52bb9**, Fast-forward
  auf fbc5fd4, fünf Commits: Claude-Code-Einrichtung (`CLAUDE.md`, Formathook,
  Skill `/sichtung`), `PRD_1_2.md` in `.prettierignore`, Titelregel, Bericht und
  Abnahmenachtrag. Lokal vorher `npm run check` mit **190 Tests**, Browser
  **72 bestanden/sechs bestehende Skips** und workerd-/SQLite-Test erfolgreich.
  [CI 42854900251](https://github.com/bummber/evolvera/actions/runs/42854900251)
  und [Pages 42854899353](https://github.com/bummber/evolvera/actions/runs/42854899353)
  (Build und Deploy) erfolgreich. Beim Push kein neues Werk und kein
  Archivcommit. Die Live-Website wurde nicht aufgerufen;
  `npm run test:acceptance` nicht ausgeführt.
- Dieser Abschnitt und die Nachträge vom 05.11. wurden am 10.11.2026 auf
  Betreiberauftrag als reiner Docs-Push nachgereicht.
  `docs/PRD_v1.1_backup.md` wurde am 10.11.2026 versehentlich mit Commit
  2196c38 versioniert und veröffentlicht; der Betreiber hat entschieden, dass
  die Datei im Repository bleibt. `PRD_1_2.md` bleibt unversioniert und
  unverändert; ihre Rolle ist nicht geklärt.

Als Nächstes den Lauf für **Werkdatum 14.11.2026** belegen: erwartet ist
Gen. 11 „Azurschweben“ mit `lexiconVersion` 0.2.0 und Elternbaustein „schweben“
vom 12.11. Davor sind für 11.–13.11. noch drei Titel mit 0.1.0 vorhergesagt
(„Chschfieber im Morgen“, „Chwenchschstille / Traumschweben“, „Chwkante im
Zwischenraum“). Weicht ein Titel ab, zuerst Ursache klären, nichts neu erzeugen.
README und `docs/architecture.md` wurden am 10.11.2026 auf den Betriebsstand
gebracht; ältere Phasenabschnitte der Architektur bleiben als historisch stehen.

Nachtrag 10.11.2026, auf Betreiberauftrag gepusht: `config/release.json` weist
die Titelabnahme als `titleReview` aus, und der Tagesplaner verlangt sie für
Lexikon 0.2.0 ([Bericht](title-lexicon-0.2.0.md)).

Der Betreiber hat am 10.11.2026 angekündigt, dass zu einem noch offenen
Zeitpunkt alle bestehenden Werke gelöscht werden sollen, weil das Projekt
umgebaut wird. Dafür liegt noch kein Auftrag vor; bis dahin gelten die
Erhaltungsregeln aus `AGENTS.md` unverändert.

## Vorheriger Abschluss – 05.11.2026, Zeitumstellung veröffentlicht

Der Betreiber hat die konkrete Veröffentlichung mit **„Freigegeben“** genehmigt.
Den geprüften Remote-Archivcommit **d50f685** ausschließlich per Fetch/Fast-forward
übernommen; beide Ursprungswerke und alle vorhandenen Arbeitsdateien erhalten.
Danach exakt die 20 freigegebenen Dateien in **c85811308896ffada595aea4c10605c3a0e6be6b**
committed und regulär gepusht. Direkter Elterncommit d50f685, vollständiger
173-Dateien-Commitbaum bytegleich zum isoliert geprüften Kandidaten.
Kein Force-Push, zusätzlicher manueller Workflow, Gate-/Moduswechsel oder Worker-Upload.

- **Ab Werkdatum 06.11.2026: 01:17 Europe/Berlin**, Nachholversuche 01:47/02:23.
  Die beiden bisherigen Werke behalten ihre 04:00-Termine und Originalbytes.
  Startdatum 04.11., traceable/6, Generierung/Serienfreigabe und beide
  Repositoryschalter weiterhin true. Genau zwei offizielle Werke; beim Push
  keine neue Generation und kein weiterer Archivcommit.
- [CI 42010783208](https://github.com/bummber/evolvera/actions/runs/42010783208)
  und [Pages 42010782945](https://github.com/bummber/evolvera/actions/runs/42010782945)
  erfolgreich. Je **187 Tests**, **72 Browserfälle/sechs bestehende bewusste Skips**,
  workerd-/SQLite-Test und deaktivierter Worker-Dry-run erfolgreich.
  Gebaut und veröffentlicht wurde tatsächlich c858113.
- Pages-Artefakt **13406488686**, ZIP-SHA-256
  `7ebd24d85c550015174906ff5a904f5902087823e985016a0d60e405fbea0be2`.
  Alle **24 öffentlichen Dateien** bytegleich zum Artefakt und geprüften lokalen
  Build; beide Werkdateien und Index gleichzeitig bytegleich zum Git-Stand.
  Deployment **7571197263**, erfolgreich um **11:31:44 Berlin**.
- Anonyme Liveprüfung **zehn Kombinationen bei 320/1440 Pixeln**: Heute, Galerie,
  beide Werkdetails und Herkunft passen zum Zwei-Werke-Archiv. Rhythmusangabe
  01:17 im DOM; historische Werktermine weiterhin 04:00. Keine Überläufe,
  Seitenfehler, Bild-/SVG-/Canvas-Kunst, fremden Abrufe oder Schreibrequests.
- HEAD/main und gespeichertes origin/main nach Push auf c858113. Ursprüngliches
  zusätzliches PRD-Backup unverändert/unversioniert, nicht in den 20 Dateien.
  Die fünf früher uncommittierten Ergebnisdokumente sind jetzt mitgesichert.
  Vier neue Abschlussnachträge (dieser Bericht, HANDOFF, NEXT-START, Runbook)
  bleiben anschließend lokal uncommittiert; kein weiterer Ergebniscommit/Push.

Der erste Lauf mit dem neuen Zeitplan ist erst **06.11.2026 ab 01:17 Berlin**
fällig: Generation 3 mit den beiden Ursprüngen als Eltern. Die Veröffentlichung
belegt noch keinen pünktlichen Start oder Zuverlässigkeitsgewinn dieses Fensters.
Der frühere Schedule-Lauf 42007979961 um 11:06 Berlin belegt nur den stark
verspäteten alten Zeitplan. Vor einem nächsten Arbeitspaket zuerst gemeinsam
frisch lesend sichten; keine pauschale Wiederholung alter Kunst-/Login-/Cookieabnahmen,
neue Designrunde, Phase 5 oder EP-01. Worker, Secrets und Sitzungen erhalten.

## Historische Vorbereitung dieser Veröffentlichung

## Aktuell – 05.11.2026, Zeitumstellung lokal vorbereitet

Auf Betreiberauftrag Tageswechsel ab Werkdatum **06.11.2026 auf 01:17 Berlin**
umgestellt; Nachholtermine 01:47/02:23. [Maßgeblicher Bericht](schedule-change.md).
Isoliert geprüft: Gesamtcheck **187 Tests**, Build und Worker-Dry-run erfolgreich;
Browser **72 bestanden/sechs bestehende Skips**, Kunstreferenzen unverändert.
Originalwerke bytegleich; keine neue reale Generation durch lokale Prüfungen.
Noch nicht veröffentlicht: kein neuer Commit, Fetch/Merge/Pull, Push oder
Deployment der Zeitumstellung. Lokaler HEAD und gespeichertes origin/main 7e19cdf;
tatsächliches Remote zuletzt d50f685 mit zwei echten Ursprungswerken.
Manuelle Nachholung 42006857612 und später Schedule 42007979961 erfolgreich;
Schedule erst um 11:06 Berlin angelegt. Keine pünktliche Automatik behaupten.
Beide Originalwerke, Startdatum, traceable/6 und aktive Gates erhalten.

Zuerst Bericht/Prüfstand lesen und Bestand frisch lesend sichten. Ein nächster
Veröffentlichungsschritt muss den neueren Remote-Archivstand erhalten und ist
konkret freizugeben. Keine alte lokale Archivversion pushen. Die nachfolgenden
Übergaben/Prüfprompts bleiben historische Nachweise, keine neuen Aufträge.
PRD-Backup unverändert als ursprünglichen PRD-Stand erhalten; das aktuelle PRD
enthält nun die gezielte Zeitergänzung. Keine weitere Sicherung, Modusrunde,
Designrunde, Worker-/Secret-/Sitzungsänderung, Phase 5 oder EP-01.

Stand: 04.11.2026. Aktueller Betreiberauftrag hat Vorrang. Die öffentliche
**Galerie und offizielle Serie mit abgenommenem Werkbuch-Design sind veröffentlicht und geprüft**.
Der Betreiberworker ist seit
03.11.2026 separat veröffentlicht und aktiviert; der Betreiber hat den erfolgreichen
GitHub-Login, Abmelden/Neuanmelden und inzwischen die Modusrunde bis traceable/5
bestätigt. Einzelne Nachweise und Grenzen stehen im neuesten Block unten.
Cloudflare-Konto und lesende Codex-MCP-Verbindung
sind inzwischen vorhanden und geprüft. Offizieller Serienstart am 04.11.2026; siehe neuesten Block.
Die GitHub App wurde am 03.11. separat freigegeben, registriert und ausschließlich
auf `bummber/evolvera` installiert; die lokale Secret-Ablage ist inzwischen bestätigt,
der Worker ist inzwischen samt beiden Secrets und SQLite-Sitzungsspeicher eingerichtet.
Auf anschließenden Fortsetzungsauftrag sind Datenschutzhinweise und unabhängige
Pages-/Worker-Aktivierungsgates lokal umgesetzt. Die Textdurchsicht für die gewählte
Worker-Adresse wurde anschließend ausdrücklich bestätigt; lokale Anbieterprüfung
inzwischen abgeschlossen. Lokale Integration und aktueller Auftragsumfang siehe unten.

## Aktuelle Chat-Übergabe – 04.11.2026, Status für den neuen Chat am 05.11. notiert

Auf Betreiberwunsch ausschließlich den aktuellen Abschluss und den Prüfauftrag für
morgen dokumentiert. Kopierbarer [Startprompt für den 05.11.](NEXT-START.md).
Lokaler lesender Abgleich bei dieser Übergabe (04.11.2026, 18:01:17 MEZ): HEAD/main und
gespeichertes origin/main weiter **`7e19cdf17eeac668ab884743e81400096c310358`**,
traceable/6, Startdatum 04.11.2026, Generierung/Serienfreigabe true, lokal genau ein
Werk „Irifalter“, Generation 1 ohne Eltern. Keine neue Remote-/Actions-/Liveprüfung
in diesem reinen Übergabeschritt. Letzter tatsächlicher Remote-/Gate-Endabgleich
bleibt **04.11.2026, 17:53:45 MEZ** aus dem nachfolgenden Startabschluss.

- Fünf uncommittierte Ergebnisdokumente samt zusätzlichem unversioniertem
  bytegleichem PRD-Backup erhalten. Jetzt nur HANDOFF und NEXT-START ergänzt;
  kein Commit, Fetch/Merge, Push, Workflowstart, Deployment oder Gatewechsel.
  Vier Sicherungsarchive erhalten; die fünf Ergebnisdateien sind darin noch nicht
  als anschließender Ergebnisstand gesichert. Kein neuer Sicherungsauftrag.
- Morgen **zuerst nur lesen**: tatsächlichen Remote getrennt vom lokalen Stand
  abgleichen; der geplante Tageslauf darf Remote-main weitergeschrieben haben.
  Ablauf mit event:schedule, Archivcommit, gebautem Stand und Pages nachweisen.
  Erwartet für 05.11. ab 04:00 Berlin: zweites unabhängiges Ursprungswerk ohne
  Eltern, unveränderte Originalbytes des ersten Werks, passender Index/Live-Stand.
  Vor 04:00 noch nicht fällig; Best-effort-/Nachholtermine einordnen, keine
  zusätzlichen Läufe oder Rücksetzungen zur Diagnose starten.
- Nächste offene Nachweise: erster zeitgesteuerter Betrieb am 05.11., erste
  tatsächliche Vererbung mit Generation 3 am 06.11.; später nur bei gesondertem
  Auftrag Wirkung eines Moduswechsels auf ein Folgewerk. Kein solcher Wechsel
  jetzt beauftragt. Die fünf Ergebnisdokumente separat sichern/versionieren wäre
  ein eigener nächster Schritt, keine stillschweigende Ausführung durch den Prompt.
- Erfolgreichen Start samt Wiederholung, Kunst-/Geräte-/Cookieprüfungen erhalten;
  keine pauschale Wiederholung. Keine neue Designrunde, Phase 5, EP-01, Worker-/
  Secret-/Sitzungsänderung oder Neubeauftragung eines Chat-Monitors.

Die bestehende ausdrückliche Serienfreigabe gilt; die alten Regeln „Startdatum offen,
Generierung aus“ sind Vorstartstände. Nicht ungefragt wiederherstellen. Ein neueres
Remote-Archiv niemals mit dem lokalen Archiv oder synthetischen Prüfdaten überschreiben.
Dokumentationscheck dieses Übergabeschritts im isolierten Klon des echten
Archivcommits erfolgreich: `npm run check`, **167 Tests**, Format/Lint/Typen,
Daten-/Fixtureprüfung, Build und deaktivierter Worker-Dry-Run. Alle **23 Builddateien
bytegleich** zum bereits veröffentlichten Startartefakt. Kein zusätzlicher lokaler
Browser-/Runtime-Lauf für reine Dokumentation. Alle übrigen Arbeitsdateien,
Konfigurationen, Archivbytes, lokaler HEAD und gespeichertes origin/main gegenüber
dem Schrittanfang unverändert, PRD-Backup weiter bytegleich. Abschließenden reinen
Prüfvermerk anschließend gezielt format-/diffgeprüft; keinen weiteren Gesamtcheck
nach diesem Vermerk behaupten. Belege temporär unter
`/private/tmp/evolvera-next-chat-20261105-5fnsy2u0`.

## Vorherige Chat-Übergabe – 04.11.2026, offizielle Serie gestartet und geprüft

Die vorgelegte vollständige Serienstart-Vorlage wurde mit **„Freigabe erteilt“**
ausdrücklich genehmigt und ausgeführt. [Dauerhafter Startbericht](series-start-preparation.md).

- Aktivierungscommit `4406b4f0b15d4932ab778f3968c7530cfa8d27e9` mit exakt 15 Dateien regulär veröffentlicht;
  neue verifizierte Sicherung `2026-11-04-pre-series-52e4342.tar.gz`,
  117215 Bytes, SHA-256 `09b95288605248132579b58b2c32fe871ec90fc5ba7e06967a9f1212c7c66a73`.
  Drei ältere Sicherungen und zusätzliches bytegleiches PRD-Backup erhalten.
- Echt jetzt **traceable/6**, Startdatum **2026-11-04**, Generierung **true**,
  `seriesAuthorized:true`, Pages **true**, Automatisierung **true**.
  Erster Archivcommit **`7e19cdf17eeac668ab884743e81400096c310358`**, genau zwei Archivdateien:
  **„Irifalter“**, Werkdatum 04.11.2026, Generation 1, keine Eltern, traceable/6,
  geplant 04:00 MEZ, erzeugt 17:41:11.767 MEZ, keine mehrtägige Nachholung.
- CI 41869682779 und Pages 41869682632 erfolgreich. Pages tatsächlich vom
  Archivcommit gebaut/veröffentlicht; je 167 Tests, 70 Browserfälle/sechs
  bestehende Skips und workerd/SQLite erfolgreich. Artefakt 13343412899,
  alle 23 öffentlichen Dateien bytegleich. Zwölf anonyme Livefälle bei 320/1440
  bestanden, keine Fremdabrufe/Schreibrequests/Cookies/Seitenfehler/Überläufe.
- Wiederholung 41870657793 mit deploy:false erfolgreich: kein neues Werk, kein
  Archivcommit, Head/Originalbytes unverändert, Deployment übersprungen. Gleiche
  Testzählungen, alle 23 Build- und öffentlichen Dateien bytegleich.
- Exakt geprüften Archivcommit lokal per Fetch/Fast-forward übernommen, keine
  unsichtbaren Fremdänderungen und kein weiterer Commit. **HEAD/main und origin/main
  synchron `7e19cdf17eeac668ab884743e81400096c310358`**. Nicht wieder auf leeres Archiv oder Revision 5 zurücksetzen.
- Genau fünf neue Ergebnisdokumente bleiben uncommittiert: series-start-preparation,
  HANDOFF, NEXT-START, pre-series-acceptance, Runbook. PRD-Backup zusätzlich
  unversioniert/bytegleich. Keine weitere Commit-/Pushfreigabe aus dem Abschluss.

Der nächste vorgesehene Tageslauf ist **05.11.2026 ab 04:00 Berlin**, zweiter
unabhängiger Ursprung. Künftigen Lauf nicht als bereits nachgewiesen behandeln;
Actions best effort. Keine neue Designrunde, Phase 5, EP-01, Worker-/Secret-/
Sitzungsänderung oder Modusrunde. Alte Abnahmen und bekannte Restgrenzen erhalten.
Keine Vollzertifizierung durch begrenzte Tests. Neue Ergebnisdokumente sind noch
nicht in der Sicherung vor Aktivierung enthalten. Abschließender Gesamtcheck aller
fünf Ergebnis-/Startdokumente im isolierten Klon des echten Archivcommits erfolgreich:
`npm run check`, 167 Tests, Format/Lint/Typen, Daten-/Fixtureprüfung, Build und
deaktivierter Worker-Dry-Run. Alle 23 Builddateien bytegleich zum veröffentlichten
Artefakt und Wiederholungsbuild. Keine zusätzliche lokale Browser-/Runtime-Suite
für diese Dokumente. Frischer lesender Endabgleich 17:53:45 MEZ: beide lokalen und
Remote-Head 7e19cdf, aktive Gates, traceable/6 und genau ein Werk unverändert;
alle vier Sicherungen per SHA-256 und PRD-Backup bytegleich bestätigt. Reinen
abschließenden Ergebnisnachtrag gezielt format-/diffgeprüft, kein weiterer
Gesamt-/Browser-/Runtime-Lauf danach behauptet.

## Vorherige Chat-Übergabe – 04.11.2026, Serienstart mit Datum heute vorbereitet

Auf „Mach weiter“ die nächste eigenständige Serienstart-Vorlage isoliert geprüft.
Der Betreiber wählte auf die konkrete Datumsrückfrage **„heute“ = 04.11.2026 Berlin**.
Das erlaubt noch keine Aktivierung oder Veröffentlichung. Maßgebliche neue Vorlage:
[series-start-preparation.md](series-start-preparation.md), genaue 15-Dateien-Auswahl,
Sicherungsvorschlag, Gateänderungen und Ausführungs-/Stoppplan.

Echtes HEAD/main weiter `52e4342`, traceable/5, Generierung false, Startdatum null,
Serienfreigabe false, Archiv leer. Kein echter Commit, Fetch/Merge, Push, Deployment,
Workflowstart, Variablenwechsel oder neuer Moduswechsel. Die fünf bisherigen
Ergebnisdokumente und das unversionierte bytegleiche PRD-Backup erhalten.

Im isolierten Klon ohne Remote aktive Revision 6/Datum 04.11./Serienfreigabe mit
synthetischem Erstwerk geprüft: Gesamtcheck 167 Tests, Browser 70 bestanden/sechs
bestehende Skips, zusätzliche anonyme Anzeigeprüfung je sechs Kombinationen bei
320/1440. Reiner Laufplan: heute genau ein unabhängiger Ursprung, Wiederholung ohne
Änderungen, zweiter unabhängiger Ursprung erst 05.11. ab 04:00, Originalbytes und
Snapshot erhalten. Synthetische Konfiguration/Werke niemals ins echte Archiv kopieren.

Startblocker korrigiert: Formatierung überspringt kanonische Archivbytes mit
positivem/negativem Regressionstest; zwei Leerzustands-Browsertests verwenden einen
explizit leeren Index; Statusaussagen von Heute/Über/Testwerken folgen der
Konfiguration. Sieben Korrekturdateien auch lokal übernommen, ohne echte Gates zu
ändern. Kein Renderer-/Kunst-/Generator-/Worker-Eingriff oder Designpaket.

Zweiter isolierter Klon mit allen 13 Arbeitsdateien, echten weiterhin geschlossenen
Gates und leerem Archiv: `npm run check` mit 167 Tests sowie die drei geänderten
Browserdateien gegen den Build mit zehn bestandenen Fällen. Kein zusätzlicher
vollständiger Browser-/Runtime-Lauf für diesen Stand. Publikationsgate am aktiven
Kandidaten technisch erfolgreich. Abschließend Remote/Dateien/Flags um 17:26:56 MEZ
ausschließlich lesend bestätigt: beide Heads 52e4342, traceable/5, false/null/false,
Archiv leer, Pages true, Automation nicht gesetzt. 13 Arbeitsdateien plus PRD-Backup
bleiben uncommittiert; ein Aktivierungscommit würde genau 15 Dateien umfassen. Belege temporär unter `/private/tmp/evolvera-series-prep-20261104-ojraw5iz`;
der dauerhafte Bericht bleibt maßgeblich. Alte Kunst-/Cookie-/Gerätetests erledigt,
keine neue umfassende externe Abnahme. Heute nach 04:00 hieße Aktivierung sofortiges
Erstwerk. Vorlage verfällt bei Berliner Datumswechsel; keine ungefragte Nachholung.
Vor einer externen Aktion genaue Aktivierungs-/Publikationsfreigabe einholen.

## Vorherige Chat-Übergabe – 04.11.2026, L-01 veröffentlicht und geprüft

Der Betreiber hat die genaue Sieben-Dateien-Sicherung, einen lokalen Commit,
regulären Push samt zwei vorhandenen Commits und die ausgelösten CI-/Pages-Läufe
mit Nachkontrolle durch **„ja“** freigegeben. Dieser Umfang ist erledigt.
[Dauerhafter Veröffentlichungsbericht](gallery-publication-preparation.md).

- HEAD/main und origin/main synchron auf **`52e43423d8ccfa40ff07e55bd10c0318eb609d3b`**,
  Elterncommit `02f9d6f`. Genau sieben freigegebene Dateien committed, regulärer
  Fast-forward-Push von `a66d0b4` samt `2ffb420`/`02f9d6f`, insgesamt 19 Dateidifferenzen.
  Keine Historienumschreibung, kein weiterer Commit oder Push aus dieser Freigabe.
- Neue verifizierte Sicherung:
  `/Users/abrocker/ai_o_projects/evolvera-local-backups/2026-11-04-pre-pages-L01-02f9d6f.tar.gz`,
  91.796 Bytes, SHA-256
  `66b9e1ad151f2735ee243a882e57854eb7fa333c2ae1396cc798ad51f403bd98`.
  Sieben Dateien plus Manifest byteweise geprüft; beide älteren Archive erhalten.
  PRD-Backup weiter zusätzlich unversioniert und bytegleich, in keinem Archiv/Commit
  aufgenommen. Neues Archiv enthält noch nicht die fünf jetzigen Ergebnisnachträge.
- [CI 41857781816 erfolgreich](https://github.com/bummber/evolvera/actions/runs/41857781816),
  [Pages 41857781840 Build/Deploy erfolgreich](https://github.com/bummber/evolvera/actions/runs/41857781840),
  exakt für `52e4342`. Beide Läufe: 166 Tests, 70 Browserfälle, sechs bewusste Skips;
  workerd/SQLite erfolgreich. Tatsächliche Laufzählungen verifiziert, Generierung
  im Pages-Lauf übersprungen. Keine erneute opt-in-Drei-Engine- oder Kunstabnahme.
- Artefakt `13337733414`: alle 22 öffentlichen Dateien bytegleich zum Laufartefakt
  und zum geprüften lokalen Build. Anonyme Liveprüfung zehn Ansichts-/Breitenkombinationen
  bei 320/1440 Pixeln plus verzögerter Ladestatus bei 320 bestanden; korrekter Link,
  Revision 5, leeres offizielles Archiv, keine Fremdabrufe/Schreibrequests/Cookies/
  Seitenfehler/Überlauf. Heute 320 und Einstellungen 1440 sichtbar gesichtet.
  Ein Request-Aufräumfehler des temporären Prüfskripts vor dem endgültigen Erfolg
  korrigiert; keine Produktänderung oder zweite Veröffentlichung dafür.
- Remote-Endstand frisch per Git und GitHub-Dateien/Gates bestätigt: traceable/5,
  Generierung false, Startdatum null, `seriesAuthorized:false`, Archiv leer,
  Pages true, Tagesautomatisierungsvariable nicht gesetzt. Worker, Secrets und
  Sitzungen administrativ unverändert; keine echte Anmeldung oder Modusspeicherung.
- Genau fünf neue Ergebnis-/Startdokumentupdates bleiben uncommittiert: HANDOFF,
  NEXT-START, gallery-publication-preparation, pre-series-acceptance und Runbook.
  CSS und neuer Ladetest sind veröffentlicht und bleiben unverändert. Kein zusätzlicher
  Ergebniscommit/Push, keine neue Sicherungsfreigabe aus diesem Abschluss ableiten.

Dokumentations-Gesamtcheck der fünf Ergebnisnachträge im isolierten Klon des
veröffentlichten Commits erfolgreich: `npm run check`, **166 Tests**, Format/Lint/
Typen, Daten-/Vorschauprüfung, Build und deaktivierter Worker-Dry-Run. Alle 22
Builddateien weiterhin bytegleich zum veröffentlichten Artefakt. Keine zusätzliche
lokale Browser-/Runtime-Suite für diese reinen Dokumente. Reinen Ergebnisnachtrag
anschließend gezielt format-/diffgeprüft, kein weiterer Gesamtcheck danach behauptet.
Temporäre Belege unter `/private/tmp/evolvera-release-L01-20261104-a47ypnzd` sind
keine dauerhafte Ablage. Der Bericht und Git enthalten den maßgeblichen Stand.
Keine zusätzliche lokale Browser-/Runtime-Runde für diese reinen Dokumente behaupten.

Vor dem nächsten Paket gemeinsam den veröffentlichten Stand und die Restgrenzen
sichten. Kleine Schriftverschiebungen, keine umfassende WCAG-/Sitzungs-/GPU-/Feldabnahme
und die frühere ungeklärte Konfliktursache bleiben ausgewiesen. Erst danach eine
spätere eigenständige Serienfreigabe mit zukünftigem Datum, aktueller Revision,
genauen Dateien und Actions-Schalter vorbereiten. Keine Aktivierung, neue Designrunde,
Phase 5 oder EP-01. Die bisherigen Kunst-/Geräte-/Login-/Cookie-Modustests sind erledigt.

## Vorherige Chat-Übergabe – 04.11.2026, Veröffentlichung konkret vorbereitet

Auf **„Mach weiter“** nach dem Korrekturabschluss den im vorigen Block benannten
Sicherungs-/Commit-/Push-/Pages-Umfang konkret vorbereitet. Vollständige Vorlage
und Dateiauswahl in [gallery-publication-preparation.md](gallery-publication-preparation.md).
Noch keine Freigabe oder Ausführung von Sicherung, Commit, Fetch/Merge, Push oder
Deployment. Keine externe Einstellung geändert.

- HEAD/main weiterhin `02f9d6f6595d7ed0d783c32eb865f3c4758e889a`, gespeichertes
  origin/main `a66d0b4`. Remote-main jetzt frisch per `git ls-remote` und Branch-API
  ebenfalls `a66d0b49041149d3734a2e5bee2b56a5fc6f30b6`, kein Ref-Update.
- Repository öffentlich, main Standardbranch und laut Branch-API nicht geschützt.
  Pages ist als Workflow-Veröffentlichung eingerichtet. Umgebung github-pages
  erlaubt main; nur Branchregel, keine gelesene Reviewer-/Wartezeitregel.
  Pages-Schalter true, Tagesautomatisierungsvariable nicht gesetzt. Keine neuen
  CI-/Deploy-/Liveworker-/Cookie-/Sitzungsnachweise aus diesen Metadaten ableiten.
- Genau sieben lokale Arbeitsdateien uncommittiert: HANDOFF, NEXT-START,
  gallery-publication-preparation, pre-series-acceptance und Runbook unter docs,
  src/styles/shell.css sowie neuer tests/browser/loading-stability.spec.ts.
  Die sechs vorherigen Arbeiten erhalten, nur den Veröffentlichungsbericht
  zusätzlich fortgeschrieben. PRD-Backup extra unversioniert/bytegleich.
- Zur Freigabe: neue Sicherung
  `/Users/abrocker/ai_o_projects/evolvera-local-backups/2026-11-04-pre-pages-L01-02f9d6f.tar.gz`
  mit genau sieben Dateien plus Manifest/Byteprüfung; vorhandene Archive erhalten.
  Danach genau ein lokaler Sieben-Dateien-Commit auf 02f9d6f und regulärer
  Fast-forward-Push einschließlich `2ffb420`/`02f9d6f`, insgesamt drei lokale Commits.
  Vollständiger Unterschied zu Remote umfasst 19 Dateien, nicht nur den CSS-Fix.
- Push startet beide vorhandenen CI-/Pages-Workflows. Bei unveränderten Gates
  Generierungsschritt übersprungen; kein Serienwerk, keine Modusrevisionserhöhung,
  kein Worker-Upload. Frischer Vorabgleich bleibt Teil der späteren Ausführung;
  bei Abweichung stoppen, keine Historienumschreibung oder blinde Integration.
- CSS und neuer Ladetest bytegleich zum zuvor geprüften Korrekturstand mit
  166 Tests und 70 bestandenen Browserfällen/sechs bewussten Skips, sechs
  unveränderten Kunstreferenzen. Die neun Kaltstartmessungen bleiben gültig;
  keine neue lokale Browser-/Runtime-/Kunst-/Geräte-/Cookie-Runde nur für diese Texte.
  Konfiguration, Worker, Workflows, Archiv, Lockfile und PRD bytegleich zu Remote;
  traceable/5, Generierung false, Startdatum null, Serienfreigabe false, Index leer.

Prüfung dieser Veröffentlichungsvorbereitung im isolierten Klon bestanden:
`npm run check:publication` und `npm run check` mit **166 Tests**, Format/Lint/Typen,
Daten-/Vorschauprüfung, Build und deaktiviertem Worker-Dry-Run. Alle **22 Builddateien
bytegleich** zum mit 70 Browserfällen geprüften Korrekturstand. Kein neuer lokaler
Browser-/Runtime-Lauf für diese Texte; reinen Ergebnisnachtrag anschließend gezielt
format-/diffgeprüft, keinen weiteren Gesamtcheck danach behauptet.
Keine vollständige WCAG-/Sitzungs-/GPU-/Feldabnahme oder neue Serienfreigabe. Kleine schriftbedingte
Restverschiebungen und frühere ungeklärte Konfliktursache bleiben dokumentiert.
Nächster Schritt: genau diese Vorlage gemeinsam sichten und die sieben Dateien,
Sicherung, drei zu pushenden Commits sowie ausgelöste CI-/Pages-Nachkontrolle
ausdrücklich freigeben lassen. Keine Aktivierung, Designrunde, Phase 5 oder EP-01.

## Vorherige Chat-Übergabe – 04.11.2026, L-01 lokal korrigiert

Der Betreiber hat den konkret vorgelegten lokalen Korrektur-/Prüfumfang mit
**„Freigegeben“** beauftragt. Ergebnis: zusätzliche Platzreservierung ausschließlich
während der Ladezustände in shell.css und neuer Regressionstest; App.tsx/index.html
bleiben nach Variantenvergleich unverändert. Keine neue Designrunde oder Abhängigkeit.
[Vollständiger Vergleich und Grenzen](pre-series-acceptance.md#lokale-korrektur-l-01--04112026).

- Dominanter Footer-Sprung in den drei gemessenen Szenarien beseitigt. Je drei
  abschließende Kaltstarts unter denselben Bedingungen wie zuvor: CLS Heute
  `0,10348 → 0,00140`, Galerie `0,12316 → 0,02108`, bewegtes Testwerk
  `0,10648 → 0,00018`. Ansichtsbereitschaft Median `1,953 / 2,562 / 2,573 s`,
  gegenüber vorher −4 bis +8 ms Unterschied. Kleine Restverschiebungen dokumentiert;
  keine Feld-/GPU-/INP-Abnahme oder vollständige Restabnahme daraus ableiten.
- Nur vier zusätzliche CSS-Zeilen in `src/styles/shell.css`. Direkter Ladestatus
  im main reserviert `100svh` für beide Phasen (Routenmodul und Archivdaten).
  Nach Laden gilt wieder das bestehende Layout. Vorhandene Archivo-Schrift als
  preload isoliert geprüft: CLS null, aber im orientierenden Heute-Lauf rund
  eine halbe Sekunde langsamere Ansichtsbereitschaft; deshalb nicht übernommen.
- `tests/browser/loading-stability.spec.ts` neu: neun Ansichts-/Breitenkombinationen
  und 18 kontrollierte Ladephasen bei 320/390/1440 Pixeln. Gegenprobe am unveränderten
  Vorher-Build scheitert am tatsächlichen Footerfehler (784 statt mindestens 900 Pixel).
  Mit Korrektur beide Projektfälle bestanden. Testnavigation auf eindeutige
  Dokument-Queries berichtigt, damit jeder Fall tatsächlich das Modul neu lädt.
- HEAD/main weiter `02f9d6f6595d7ed0d783c32eb865f3c4758e889a`, gespeichertes
  origin/main `a66d0b4`, main zwei lokale Commits voraus. Sechs lokale Arbeitsdateien:
  die vier erhaltenen Dokumentupdates plus shell.css und neuer Browsertest.
  Zusätzlich PRD-Backup unversioniert/bytegleich. Bestehende Sicherungsarchive
  unverändert, enthalten diese sechs Updates nicht. Keine neue Sicherungsfreigabe.
- Generator, Titelgenerator, Renderer, Archiv, Kunstdateien, Referenzen, Worker,
  Konfiguration und Lockfile unverändert. Kein echter Login-/Modus-/Cookiezugriff,
  kein Remote-/Variablenabgleich, Git-Commit, Fetch/Merge, Push oder Deployment.
  Weiter traceable/5, Generierung false, Startdatum null, `seriesAuthorized:false`,
  offizielles Archiv leer. Frühere Konfliktursache weiter ungeklärt.

Abschließende Prüfungen dieses Korrekturpakets bestanden: `npm run check` mit
**166 Tests**, Format/Lint/Typen, Daten-/Vorschauprüfung, Build und deaktiviertem
Worker-Dry-Run. Danach `CI=true npm run test:browser`: **70 bestanden**, sechs
bewusste Skips, alle sechs Kunstreferenzen unverändert. Geladene Heute-/Galerie-
Screenshots außerdem bytegleich zum Vorherstand. Isolierter Klon, synthetische
Zugänge, keine kopierten Secret-Dateien; Workerausgaben außerhalb dist/Git.
Reiner Ergebnisnachtrag danach gezielt format-/diffgeprüft, kein weiterer Gesamt-/
Browserlauf danach behauptet. Keine zusätzliche Worker-Runtime-/Drei-Engine-Suite.
Varianten, Gegenprobe und Messungen nur temporär unter
`/private/tmp/evolvera-loading-fix-20261104-dmbutejs`, dauerhafte Ergebnisse im Bericht.

Nächster Schritt nach gemeinsamer Sichtung: genauen lokalen Sicherungs-/Commit-/
Push-/Pages-Umfang des gesamten Standes vorbereiten und separat freigeben lassen.
Diese Korrekturfreigabe enthält keinen solchen Auftrag. Keine erneuten Kunst-,
Geräte- oder Cookie-Modustests; keine Phase 5, EP-01 oder Serienaktivierung.

## Vorherige Chat-Übergabe – 04.11.2026, gezielte Restabnahme mit Befund L-01

Nach konkreter Vorlage hat der Betreiber das lokale Prüf-/Berichtspaket mit
**„Freigegeben“** beauftragt. Zugänglichkeit, Zuordnung vorhandener Autorisierungs-
nachweise und Leistung wurden im vereinbarten Umfang geprüft. Ergebnisse und
Messmethoden stehen in der [Abnahmematrix](pre-series-acceptance.md#gezielte-lokale-restabnahme-am-04112026).
Produktänderungen sind ausdrücklich anschließend vorzulegen; keine bereits erteilte
Freigabe für den unten vorgeschlagenen Korrekturschritt.

- Git unverändert: HEAD/main `02f9d6f6595d7ed0d783c32eb865f3c4758e889a`, gespeichertes
  origin/main `a66d0b4`, main zwei lokale Commits voraus. Die vier bisherigen
  Dokumentupdates bleiben uncommittiert und wurden um die Ergebnisse ergänzt.
  PRD-Backup zusätzlich unversioniert/bytegleich, beide Sicherungsarchive erhalten.
  Keine neue Git-/Remote-/Cloudaktion oder echte Modusspeicherung.
- Isolierter Repositoryklon, nur vorhandene Testwerke, Node 24.21.0 und installiertes
  Playwright/Chromium. Build erfolgreich, erster Versuch durch Sandbox-EPERM am
  tsx-Socket blockiert, Wiederholung mit lokalen Prozessrechten erfolgreich.
  Keine Secret-Dateien übernommen, keine Abhängigkeit oder Kunstreferenz geändert.
- Zugänglichkeit: 15 Seiten-/Breitenkombinationen bei 320/390/1440 Pixeln sowie
  zwei Mobilmenüs. 1.235 Textkontrastmessungen ohne Unterschreitung, 302 Seiten-
  und 50 Menü-Fokusbeobachtungen; mobile Ziele mindestens 44 × 44 Pixel. Beschreibungen
  beider Hauptwerke in sechs Chromium-Zugänglichkeitsbäumen bestätigt. Kein
  bestätigter Fehler im geprüften Umfang, keine vollständige WCAG-/Screenreader-
  oder neue Geräteabnahme. Menüselektor und Dock-Überdeckungsannahme des ad-hoc-
  Skripts wurden korrigiert, keine Produktänderung oder gelockerte Anforderung.
- Autorisierung: PRD 9.5/A-19/A-21/A-25 mit Code und den bestehenden Tests zugeordnet;
  keine neue konkrete Lücke erkannt, kein zusätzlicher Login-/Sitzungs-/Cloudlauf.
  Frühere Konfliktursache weiter ungeklärt; bestehende Cookie-/Modusrunde bleibt erledigt.
- Leistung: je drei Kaltstarts von Heute, Galerie und vorhandenem bewegtem Werk,
  390 × 844 Pixel, 150 ms Latenz, 1,6 Mbit/s Download, 0,75 Mbit/s Upload, CPU-Faktor 4.
  Ansichtsbereitschaft im Median 1,945 / 2,566 / 2,571 s; LCP 1,620 / 2,048 / 1,396 s.
  **Offen L-01:** reproduzierbare Layoutverschiebung, CLS 0,10348 / 0,12316 / 0,10648.
  Zusätzlicher Diagnoselauf je Szenario: größter sichtbarer Sprung am Footer beim
  Nachladen, weitere an Wortmarke/Überschrift bzw. gallery-tools. Keine Kausalanteile
  durch Variantenvergleich bewiesen. Konkreter Ansatz: Ladeplatzhalter/Platzreservierung
  und Schriftwechsel in App.tsx/shell.css; noch keine Korrektur umgesetzt.
- Galerie zwölf ruhende Kacheln, bewegtes Hauptwerk 54 Elemente/21 laufend, zusätzliche
  Vorschauen ruhend. Drei-Sekunden-rAF-Stichprobe ohne Abstand über 50 ms; keine
  tatsächliche GPU-/Geräte-FPS-Messung oder INP-Abnahme. Fremdabrufe, Schreibrequests,
  Cookies und Seitenfehler in den lokalen Messläufen null. Keine neue Designrunde,
  Kunst-, Cookie-, Geräte- oder vollständige Browser-/Worker-Runtime-Runde.

Dokumentations-Gesamtcheck dieses Ergebnispakets im isolierten Klon erfolgreich:
`npm run check`, **166 Tests** einschließlich bestehender synthetischer
Autorisierungstests, Format/Lint/Typen, Daten-/Vorschauprüfung, Build und deaktivierter
Worker-Dry-Run. Reiner Ergebnis-/Präzisierungsnachtrag danach gezielt format-/diffgeprüft;
kein weiterer Gesamtcheck oder regulärer Browser-/Runtime-Lauf danach behauptet.
Messskripte, JSON, Screenshots und Playwright-Traces liegen nur temporär unter
`/private/tmp/evolvera-rest-review-20261104-0o8rdrwo`; der Abnahmebericht enthält den
dauerhaften Ergebnisstand. Kein vollständiger Chrome-Performance-/GPU-Trace.

Nächster abgegrenzter Schritt nach gemeinsamer Sichtung: Korrekturvorschlag L-01
für `src/app/App.tsx`, `src/styles/shell.css` und einen gezielten verzögerten
Lade-Browsertest konkret freigeben lassen. Anschließend wäre der gleiche lokale
Messvergleich samt vorgeschriebenen Checks sinnvoll. Veröffentlichung und Serien-
freigabe bleiben getrennte spätere Aufträge. Aktuell weiter traceable/5,
Generierung false, Startdatum null, `seriesAuthorized:false`, Archiv leer.
Kein neuer Commit, Push, Deployment, Moduswechsel, Phase 5 oder EP-01.

## Vorherige Chat-Übergabe – 04.11.2026, Revision 5 lokal integriert

Nach genauer Vorlage hat der Betreiber mit **„ja“** eine neue Sicherung, einen
gezielten Fetch und genau zwei lokale Commits freigegeben. Dieser Umfang ist erledigt.
Die anschließende Freigabe **„Freigegeben“** gilt ausschließlich dem Dokumentations-
abschluss in HANDOFF, NEXT-START, Runbook und Abnahmematrix sowie der konkreten
Restabnahmeliste mit `npm run check`. Kein weiterer Commit, Push, Deployment,
Moduswechsel oder Serienstart ist daraus beauftragt.

- Sicherungscommit `2ffb420619d7e8fc42d4f0b0eaa8338e84d2e36c` enthält exakt die
  17 zuvor benannten Arbeitsdateien. Alle Eingangsbytes sind darin erhalten;
  das zusätzliche PRD-Backup wurde nicht aufgenommen.
- Gezielter Fetch von `origin/main`: `a66d0b49041149d3734a2e5bee2b56a5fc6f30b6`.
  Elternfolge `d844e3f → 2534192 → a66d0b4` geprüft; beide Remotecommits ändern
  ausschließlich Modus/Revision in `config/generation.json`. Unmittelbar vor dem
  lokalen Merge denselben Remote-HEAD nochmals mit `git ls-remote` bestätigt.
- Lokales HEAD/main jetzt `02f9d6f6595d7ed0d783c32eb865f3c4758e889a`, Mergeeltern
  `2ffb420` und `a66d0b4`. Gespeichertes `origin/main` auf `a66d0b4`, main zwei
  lokale Commits voraus. Kein Push. Im jetzigen Dokumentationspaket kein neuer
  Fetch oder Remoteabgleich; gespeicherte Referenz und letzter Livebefund unterscheiden.
- Unabhängiger temporärer Repositoryklon ohne übernommene Secret-Dateien, nur
  synthetische Testzugänge. Kandidat konfliktfrei; alle 17 Dateien bytegleich.
  Geprüfter Kandidat und finaler Mergecommit haben denselben Git-Baum
  `baa7b8621e333ddb865b8236779f2d80dcb27560`. Zusätzlich zum Sicherungscommit wurde
  ausschließlich die Remote-Modusdatei übernommen, Blob
  `488c9842d8dc53e66a70c251227a5b3140bed98c`.
- Lokal jetzt **traceable/Revision 5**, Generierung false, Startdatum null,
  `seriesAuthorized:false`, offizielles Archiv leer. Produktionscode, Worker,
  Generator, Renderer, Kunst, Referenzen und Lockfile unverändert. Liveworker,
  Secrets und SQLite-Sitzungen erhalten; kein Worker-Upload oder Livezugang.
- Neue Sicherung:
  `/Users/abrocker/ai_o_projects/evolvera-local-backups/2026-11-04-pre-integration-d844e3f.tar.gz`,
  86.264 Bytes, SHA-256
  `7acadd0aa8c38e3919a28991b72053114d4b70154a844d2c1d49ccdaa46ff281`.
  Exakt 17 Dateien plus Manifest, anschließend byteweise geprüft. Das alte Archiv
  mit SHA-256 `a5e4da144a884eff2ece43028a2d1f343e1c51d2807c76dd9fb4ef996810e932`
  bleibt unverändert. Beide Archive enthalten nicht die jetzt folgenden vier
  Dokumentupdates. PRD-Backup weiterhin unversioniert und bytegleich zu PRD.md.
- Tatsächlich am Integrationskandidaten bestanden: `npm run check:publication`,
  `npm run check` mit **166 Tests**, Datenprüfung, Build und deaktiviertem Worker-
  Dry-Run; `npm run worker:test-runtime` mit echtem lokalem workerd/SQLite;
  `CI=true npm run test:browser` mit **68 bestanden**, sechs bewussten Skips,
  Kunstreferenzen unverändert. Erster Publikationsprüfversuch durch Sandbox-EPERM
  am tsx-IPC-Socket blockiert; mit lokalen Prozessrechten erfolgreich wiederholt.
  Die Zusatzsuite in drei Engines, Kunst-, Geräte- und echten Cookie-/Speichertests
  wurden nicht erneut ausgeführt; ihre bisherigen Nachweise gelten weiter.

Prüfung dieses Dokumentationspakets: `npm run check` mit **166 Tests**, Format/Lint/
Typen, Daten-/Vorschauprüfung, Build und deaktiviertem Worker-Dry-Run erfolgreich.
Ausgeführt im unabhängigen temporären Repositoryklon mit genau den vier Dokument-
updates, ohne kopierte Secret-Dateien, nur synthetischen Testzugängen und Worker-
ausgaben außerhalb dist/Git. Kein zusätzlicher Browser-/Runtime-/Cloudlauf für diese
Dokumentation. Reiner Ergebnisnachtrag anschließend gezielt format-/diffgeprüft;
kein weiterer Gesamtcheck danach behauptet. Die vier Ergebnis-/Starttexte bleiben
lokal uncommittiert. Temporäre Integrationsbelege unter
`/private/tmp/evolvera-integration-20261104-s6zeie_9` sind keine dauerhafte Ablage;
dieser Bericht und Git enthalten den maßgeblichen Ergebnisstand.

Nächster abgegrenzter Schritt: die [konkrete Restabnahmeliste](pre-series-acceptance.md#konkrete-restabnahmeliste-nach-lokaler-integration)
gemeinsam sichten. Sie benennt vorhandene Nachweise, noch gezielt zu klärende
PRD-Anforderungen, spätere Stabilisierung und erst nach Aktivierung mögliche
Betriebsnachweise. Keine neue Prüfung oder Abnahme allein durch diese Liste.
Veröffentlichung der lokalen Commits und eine spätere Serienfreigabe jeweils
separat mit genauen Dateien, Revisionen und Folgen vorbereiten. Keine neue
Designrunde, Phase 5 oder EP-01. [Aktueller Startprompt](NEXT-START.md).

## Vorherige Chat-Übergabe – 04.11.2026, echte Modusrunde und Sicherung abgeschlossen

Der Betreiber hat nach konkreter Vorlage mit **„Leg los“** A (zwei Moduswechsel samt
Git-/CI-/Pages-Folgen) und B (genau benanntes lokales Sicherungsarchiv) freigegeben.
Beide Schritte sind vollständig erledigt. Der folgende Auftrag fragt nach Sicherung
und neuem Startprompt; deshalb jetzt ausschließlich Ergebnis-/Übergabedokumentation.
Kein neuer Remoteabgleich in diesem abschließenden Übergabeschritt. Frühere Freigaben
sind erledigt und erteilen keinen weiteren Speicher-, Commit-, Push- oder Deployauftrag.

- Betreiber bestätigt im privaten iPhone-Safari-Ablauf free/4 und danach traceable/5.
  Cookieeinstellung gemäß Durchführung nach Anleitung; keine eigene Cookie-/Sitzungseinsicht.
  [Vollständiger Ergebnisbericht](operator-cookie-check.md). Echte Geräte-/Kunst-/
  Login-/Logoutprüfungen und diesen Speichertest nicht pauschal wiederholen.
- Hinwechsel: `25341921a5224d8addc70965b40ad695a6780523`, Elterncommit `d844e3f`,
  04.11.2026 14:15:41 MEZ; Rückwechsel: `a66d0b49041149d3734a2e5bee2b56a5fc6f30b6`,
  Elterncommit `2534192`, 14:24:12 MEZ. Beide ändern nur Modus/Revision in
  `config/generation.json`. Beide CI-/Pages-Läufe erfolgreich, Generierung jeweils
  übersprungen; je 22 öffentliche Dateien bytegleich zum jeweiligen Laufartefakt.
  Worker-Health danach HTTP 200, configurationReady:true; kein Worker-Upload.
- **Remote zuletzt traceable/Revision 5**, Generierung false, Startdatum null,
  seriesAuthorized:false, offizielles Archiv leer. Pages-Schalter true,
  Automatisierungsschalter beim Speichertest nicht gesetzt. Kein offizielles Folgewerk.
- **Lokal HEAD/main und gespeichertes origin/main weiterhin exakt**
  `d844e3fd623c19ce3185e1e9f165536aab0b5606`, lokale Konfiguration traceable/3.
  origin unverändert `https://github.com/bummber/evolvera.git`. Kein Fetch/Pull/Merge/
  Reset oder lokaler Commit. Zwei Remote-Moduscommits noch bewusst zu integrieren;
  Revision 5 niemals mit der lokalen Revision 3 überschreiben. Git-status-Vergleich
  mit dem gespeicherten origin/main beweist aktuell keine Remote-Synchronität.
- Alle 17 Arbeitsdateien bleiben uncommittiert (12 versioniert geändert, 5 neu);
  PRD-Backup zusätzlich unversioniert/bytegleich. Bestehende Test-/Ergebnisarbeiten
  erhalten. Übergabe aktualisiert nur sieben bereits enthaltene Dokumente: README,
  HANDOFF, NEXT-START, Cookiebericht, Abnahmematrix, Phase-4-Bericht und Runbook.
  Produktionscode, Konfiguration, Lockfile und Kunst unverändert.
- **Lokales Sicherungsarchiv freigegeben, erstellt und verifiziert:**
  `/Users/abrocker/ai_o_projects/evolvera-local-backups/2026-11-04-stand-d844e3f.tar.gz`,
  82.061 Bytes, SHA-256
  `a5e4da144a884eff2ece43028a2d1f343e1c51d2807c76dd9fb4ef996810e932`.
  Genau 17 Arbeitsdateien plus BACKUP-MANIFEST.json mit Basiscommit/Prüfsummen;
  Inhalt byteweise geprüft, PRD-Backup ausgeschlossen. Vor dem jetzigen Dokumentations-
  nachtrag erneut alle 17 Dateien bytegleich zum Archiv bestätigt. Dieses Archiv
  wird nicht überschrieben und enthält noch nicht die jetzigen sieben Dokumentupdates.
  Keine zusätzliche Archiv- oder lokale Commitfreigabe daraus ableiten.
- Vorherige lokale Prüfungen: 166 Tests/Gesamtcheck, vollständige Zusatzsuite sechs
  bestanden in drei Engines, zwei reguläre Formularfälle zusätzlich; reguläre
  68er-Suite mit sechs bewussten Skips/sechs unveränderten Kunstreferenzen und
  workerd/SQLite als frühere Nachweise. Die neuen Remote-Läufe verwenden den
  versionierten Remote-Code; die 17 lokalen Arbeiten/opt-in-Zusatzsuite sind dort
  nicht veröffentlicht. Keine lokalen Testzahlen auf die Remote-Läufe übertragen.
- Restgrenzen: frühere zusätzliche Konfliktursache ungeklärt, umfassende WCAG-/
  Sitzungs-/Performanceabnahme und offizieller Betriebsnachweis offen. Logout nach
  der neuen Modusrunde nur empfohlen, nicht zusätzlich bestätigt; früherer echter
  Login-/Logout-/Reloadnachweis bleibt erledigt. Keine neue Designrunde, Phase 5,
  EP-01 oder Aktivierung. Bestehenden Worker/Secrets/SQLite-Sitzungen erhalten.

Nächster abgegrenzter Schritt nach gemeinsamer Sichtung: sicheren lokalen Abgleich
mit den zwei Remote-Moduscommits vorbereiten, sämtliche 17 Dateien erhalten und
konkreten Sicherungs-/Integrationsumfang samt Prüfungen vorlegen. Ein zusätzlicher
lokaler Sicherungscommit oder die Integration braucht den passenden Folgeauftrag;
kein Push/Deployment aus diesem Startprompt. Erst danach verbleibende Abnahmegrenzen
und eine spätere eigenständige Serienfreigabe gemeinsam sichten.
[Aktueller kopierbarer Startprompt](NEXT-START.md).

Prüfung der sieben Übergabedokumente: `npm run check` vollständig erfolgreich mit
**166 Tests**, Format/Lint/Typen, Daten-/Vorschauprüfung, Build und deaktiviertem
Worker-Dry-Run. Erster Sandboxlauf nach bestandenen 166 Tests am lokalen tsx-IPC-Socket
mit EPERM blockiert; Wiederholung mit lokalen Prozessrechten erfolgreich. Kein neuer
lokaler Browser-/Worker-Runtime-Lauf und kein Remoteabgleich für diese reinen Dokumente.
Archivprüfsumme unverändert; genau sieben Dokumente unterscheiden sich jetzt vom
Archiv, übrige zehn Arbeitsdateien bytegleich. Dateiauswahl/Git-Zustand unverändert,
PRD-Backup unversioniert und bytegleich. Diese Ergebniszeile danach gezielt format-/
diffgeprüft; kein weiterer Gesamtcheck nach dem reinen Ergebnisnachtrag behauptet.

Vollständiger lokaler Arbeitsbestand außerhalb des PRD-Backups (17 Dateien):

```text
README.md
docs/HANDOFF.md
docs/NEXT-START.md
docs/gallery-publication-preparation.md
docs/operator-cookie-check.md
docs/phase-4-results.md
docs/pre-series-acceptance.md
docs/publication-preparation.md
docs/runbook.md
package.json
playwright.acceptance.config.ts
scripts/test-worker-runtime.ts
tests/acceptance/prestart.spec.ts
tests/browser/operator-forms.spec.ts
tests/fixtures/browser.ts
tests/operator.test.ts
tests/runtime/worker.ts
```

## Vorherige Chat-Übergabe – 04.11.2026, Wechsel in neuen Chat vorbereitet

Betreiber fragt nach Fortsetzung und einem neuen Startprompt. Dieser Schritt umfasst
ausschließlich Übergabedokumentation; keine neue Prüfung am Livezugang, kein
Modusspeichern, Commit, Push, Deployment oder Serienstart daraus ableiten.
[Aktueller kopierbarer Startprompt](NEXT-START.md). Frühere Startprompts/Freigaben
sind historisch und erweitern den Auftrag nicht.

- Lokales main/HEAD und gespeicherte origin/main-Referenz exakt
  **`d844e3fd623c19ce3185e1e9f165536aab0b5606`**. origin unverändert
  `https://github.com/bummber/evolvera.git`. Kein neuer Remoteabgleich in diesem
  Übergabeschritt; bei Bedarf frisch lesend prüfen, keinen Fetch/Pull/Reset erzwingen.
- Werkbuch samt Betreiber-Link öffentlich veröffentlicht; CI/Pages und alle 22
  öffentlichen Builddateien für d844e3f geprüft. Aktuelle lokale Restabnahme ändert
  weder Produktbuild noch Kunst/Generator/Renderer/Daten/Konfiguration/Lockfile.
- **Sämtliche lokalen Restabnahme- und Ergebnisarbeiten bleiben uncommittiert.**
  Genau 17 Arbeitsdateien zusätzlich zum bewusst unversionierten bytegleichen
  PRD-Backup; siehe Liste unten. Frühere fünf Veröffentlichungs-Ergebnisdokumente
  sind darin erhalten und weitergeführt. Kein Sicherungscommit aus diesem
  Übergabeauftrag ableiten. Ein sinnvoller späterer lokaler Sicherungsschritt muss
  zuerst mit genauem Umfang zur eigenen Freigabe vorgelegt werden.
- Kunstabnahme der 40 Testwerke und zehn Designpakete abgeschlossen. Echte iPhone-/
  Safari-Prüfung einschließlich gespeicherter Webapp ohne Auffälligkeiten bestätigt.
  Anschließend echter Login/Logout nach Cookieprüfanleitung im privaten iPhone-
  Safari bestätigt; Reload nach Logout zeigt das Formular nicht wieder. Diese
  Prüfungen nicht pauschal erneut verlangen. Keine umfassende Offline-/WCAG- oder
  Sitzungsabnahme daraus ableiten.
- Firefox-Profilstartfehler behoben durch ausschließlich temporäre eigene
  MOZ_APP_DATA-Ablage in tests/fixtures/browser.ts für macOS/Firefox; keine private
  Profilnutzung, HOME-Änderung oder zusätzlichen Schutzrechte. Vorhandene gepinnte
  Firefox-/WebKit-Testbrowser installiert; keine normale Firefox-Installation nötig.
- Letzte Nachweise: Gesamtcheck/Publikationsprüfung mit **166 Tests**, Datenprüfung,
  Build und deaktiviertem Worker-Dry-Run erfolgreich. Vollständige Zusatzsuite
  **sechs bestanden** in Chromium/Firefox/WebKit (120 Seiten-/Breitenkombinationen,
  drei synthetische Login-/Formularläufe). Zwei gezielte reguläre Chromium-
  Formularfälle zusätzlich bestanden. Die reguläre 68er-Suite mit sechs bewussten
  Skips/sechs unveränderten Kunstreferenzen und echte workerd-/SQLite-Runtime sind
  vorherige erfolgreiche Nachweise, kein neuer Voll-/Runtime-Lauf nach den reinen
  Ergebnisnachträgen. Erneut erforderliche Checks passend zum tatsächlichen Schritt.
- Noch getrennt offen: **echte Modusspeicherung unter derselben Cookieeinstellung**.
  Frühere echte Modusrunde traceable/1 → free/2 → traceable/3 ist nachgewiesen;
  zusätzliche damalige Konfliktanzeige nicht abschließend erklärt. Lokale Stale-
  Formularfälle reproduzieren eine Möglichkeit, beweisen aber nicht den damaligen
  Auslöser. Kein weiterer echter Speichervorgang beauftragt; er könnte Git-Commit
  und Pages auslösen. Erst konkreten Ablauf samt Rückwechsel, erwarteten Revisionen,
  Remote-/CI-/Pages-Nachweisen und eigenständiger Freigabe vorbereiten.
- Generierung false, Startdatum null, traceable/Revision 3, Serienfreigabe false,
  offizielles Archiv leer. Spätere Serienfreigabe/Datum/Actions-Schalter unabhängig.
  Erster offizieller geplanter Lauf und Wiederholung erst nach Aktivierung prüfbar.
  Kein Phase-5-/EP-01-Start oder neue Designrunde aus diesem Startprompt.
- Worker/Secrets/Sitzungen unverändert erhalten; Anmeldung und Anbieterprüfung sind
  eingerichtet, keine neue allgemeine Einrichtungs-/Secret-Runde. Für den nächsten
  Galerie-/Speichertest kein Worker-Upload oder Cloudflare-Verwaltungstoken nötig.
  Befristeter Verwaltungstoken endet am 04.11.2026 um 23:59:59 MEZ; falls später
  tatsächlich erforderlich, Gültigkeit vorher frisch lesend prüfen. Keine Rechte/
  Tokens neu einrichten oder Ablauf umgehen; MCP bleibt lesend.

Für diesen reinen Übergabeschritt `npm run check` erneut vollständig erfolgreich:
166 Tests, Datenprüfung, Build und deaktivierter Worker-Dry-Run. Format-/Diff-/
Backupprüfung erfolgreich, alle 17 Arbeitsdateien erhalten. Kein neuer Browser-/
Runtime-/Remote-Nachweis; abschließende Ergebniszeile gezielt formatgeprüft.

Vollständiger lokaler Bestand außerhalb des PRD-Backups (17 Dateien):

```text
README.md
docs/HANDOFF.md
docs/NEXT-START.md
docs/gallery-publication-preparation.md
docs/operator-cookie-check.md
docs/phase-4-results.md
docs/pre-series-acceptance.md
docs/publication-preparation.md
docs/runbook.md
package.json
playwright.acceptance.config.ts
scripts/test-worker-runtime.ts
tests/acceptance/prestart.spec.ts
tests/browser/operator-forms.spec.ts
tests/fixtures/browser.ts
tests/operator.test.ts
tests/runtime/worker.ts
```

## Vorherige Chat-Übergabe – 04.11.2026, Restabnahme lokal ergänzt

Neuester Betreiberbefund am 04.11.: Echten Cloudtest auf iPhone/Safari im Privatmodus
nach der Cookieprüfanleitung durchgeführt. Anmelden und Abmelden funktionieren;
auch Reload nach Logout zeigt das Formular nicht wieder. Dieser begrenzte Cloudtest
ist damit bestätigt. Keine eigene Sitzungs-/Cookieeinsicht oder Speicherung durch
den Agenten; Modusspeichern unter dieser Cookieeinstellung nicht bestätigt oder
beauftragt. [Ergebnis](operator-cookie-check.md). Generierung/Serienstart unverändert aus.
Reiner Ergebnisnachtrag: `npm run check` danach mit 166 Tests, Datenprüfung, Build
und deaktiviertem Worker-Dry-Run erfolgreich; kein neuer Browser-/Runtime-Lauf.

Neuester Nachtrag: Firefox-Startproblem gezielt eingegrenzt und im Testaufbau mit
eigenen temporären Anwendungsdaten (`MOZ_APP_DATA`, nur macOS/Firefox) behoben.
`tests/fixtures/browser.ts` bereinigt die Daten nach Browserende; keine persönlichen
Profile oder macOS-Schutzrechte geändert, keine zusätzliche Installation nötig.
Vollständiges `CI=true npm run test:acceptance` nun **sechs bestanden** in Chromium,
Firefox und WebKit: 120 Seiten-/Breitenkombinationen und drei synthetische Login-/
Formularläufe. Historische Vier-Fälle-/Firefox-Fehlerhinweise weiter unten sind überholt.
[Eingegrenzte Ursache und Nachweise](pre-series-acceptance.md#firefox-startproblem--isoliert-behoben).
[Anleitung und inzwischen bestätigtes Cloud-Ergebnis](operator-cookie-check.md)
liegen vor; Anmeldung/Callback/Logout ohne echte Modusspeicherung.
Publikationsprüfung und Gesamtcheck mit 166 Tests, Build und deaktiviertem
Worker-Dry-Run erneut erfolgreich. Die gemeinsame Fixture zusätzlich mit den
zwei regulären Chromium-Formularfällen geprüft. Kein erneuter 68er-Voll- oder
Worker-Runtime-Lauf; deren bestehende Nachweise bleiben erhalten. Firefox-Testdaten
vollständig bereinigt, Produktbuild weiterhin bytegleich; nur lokale Tests/Docs geändert.

Nachtrag am 04.11.: Betreiber bestätigt **„Auf iphone mit Safari getestet und als
Webapp gespeichert. Keine Auffälligkeiten“**. Echte iPhone-/Safari-Durchsicht damit
als Betreiberbefund dokumentiert; kein offener Smartphonecheck mehr. Keine umfassende
Safe-Area-/Offline-Abnahme daraus ableiten. Firefox und Cloud-Anmeldung/Logout
sind inzwischen durch die neueren Nachträge belegt, Seriengates unverändert.
Nur Dokumentation angepasst.
Danach `npm run check` mit 166 Tests, Datenprüfung, Build und deaktiviertem
Worker-Dry-Run erneut erfolgreich; keine neue Browser-/Runtime-Suite.

Nach gemeinsamer Sichtung auf „Bitte mach weiter“ ausschließlich lokale Restabnahme
ergänzt. HEAD/main und gespeichertes origin/main weiter `d844e3f`; fünf vorherige
Ergebnisdokumente erhalten. Keine Produktions-/Design-/Kunst-/Generatoränderung,
kein neuer Commit/Push/Deployment, kein Zugriff auf reale Secrets oder Sitzungen.
Generierung false, Startdatum null, traceable/Revision 3, Serienfreigabe false,
offizielles Archiv leer. In diesem Paket kein neuer GitHub-Head-/Verwaltungsabgleich.

[Neue Abnahmematrix A-01 bis A-27, Ergebnisse, offene Punkte und Start-/Fehlerplan](pre-series-acceptance.md).
README und Phase-4-Bericht auf den veröffentlichten Stand gebracht; historische
Einrichtungsanweisungen im Runbook ausdrücklich markiert. Serienstart nur als
gesondert freizugebenden späteren Ablauf konkretisiert, ohne Datum oder Gateänderung.

Gezielt ergänzt: Doppelabsenden nach erfolgreichem Commit ergibt Konflikt ohne
zweiten PUT; echter workerd/SQLite prüft Objekttrennung und absoluten Login-/
Sitzungsablauf. Synthetischer Top-Level-Login über zwei lokale Origins mit PKCE,
nativen Formularen, veraltetem Zweittab, Logout und abgelaufener Sitzung.
Neue opt-in Abnahme `npm run test:acceptance`, bestehende Referenzsuite unverändert.
Chromium mit eingeschränkten Drittanbieter-Cookies und WebKit: vier Fälle bestanden,
80 zusätzliche Seiten-/Breitenkombinationen. 166 Unit-/Integrationstests, Runtime
und reguläre 68 Browserfälle erfolgreich; sechs bewusste Skips und unveränderte
sechs Kunstreferenzen. Details und Zwischenfehler des Testaufbaus im neuen Bericht.

Native öffentliche Desktop-Safari-Stichprobe erfolgreich: Heute, Einstellungen,
Werkdetails beider Modi, Herkunftsnavigation, Animationspause und Datenschutz;
eigener Prüftab geschlossen. Kein Cloudlogin/Modusspeichern. Der frühere Firefox-
Profilstartfehler trotz leerem Profil ist durch obigen Nachtrag im isolierten
Testaufbau behoben; keine Schutzfunktionen deaktiviert. Der zunächst noch
ungeprüfte Smartphonecheck ist durch obigen iPhone-/Safari-Nachtrag inzwischen bestätigt.
Echte Modusspeicherung unter der Cookieprüfeinstellung, umfassende Geräte-/WCAG-/Sitzungs-/Performanceabnahme
und Nachweise des offiziellen Betriebs bleiben offen. Die frühere zusätzliche
Konfliktanzeige ist trotz lokal reproduzierbarer Möglichkeit nicht abschließend erklärt.

Alle Arbeiten einschließlich Tests/Statusdokumenten bleiben uncommittiert; Backup
weiter unversioniert und bytegleich. Bestehende gepinnte Playwright-Version und Lockfile
erhalten; nur passende Testbrowser im lokalen Cache ergänzt. Nach Ergebnisdokumenten
Gesamtcheck erneut erfolgreich mit 166 Tests, Build und deaktiviertem Worker-Dry-Run;
endgültige Zusatzabnahme vier bestanden. Abschließende Ergebniszeile gezielt auf
Format/Diff geprüft, Backup bytegleich; kein neues Arbeitspaket oder
Phase-5-/EP-01-/Serienstart daraus ableiten.

## Vorherige Chat-Übergabe – 04.11.2026, Werkbuch veröffentlicht

Betreiber hat den konkret vorgelegten Commit-/Push-/Pages-Umfang mit
**„Die Freigabe ist erteilt“** beauftragt. Genau acht benannte Dateien lokal in
**`d844e3fd623c19ce3185e1e9f165536aab0b5606`** gesichert, Elterncommit `53b7521`;
anschließend regulärer Fast-forward-Push samt allen sechs vorhandenen lokalen
Commits von `f793247` auf `d844e3f`. Kein Force-Push, kein weiterer Commit.
Lokales main und origin/main synchron, Remote nach Liveprüfung frisch bestätigt.

[CI](https://github.com/bummber/evolvera/actions/runs/41784921705) und
[Pages](https://github.com/bummber/evolvera/actions/runs/41784921688) für genau diesen
Commit erfolgreich. Build/Deploy abgeschlossen, Generierung ausdrücklich übersprungen.
Die [öffentliche Galerie](https://bummber.github.io/evolvera/) zeigt jetzt das
abgenommene Werkbuch-Design; Einstellungen führen zum bestehenden Betreiberworker.
Alle **22 öffentlichen Builddateien bytegleich** zum freigegebenen lokalen Build.
Anonyme Live-Chromium-Prüfung von Heute/Einstellungen/Über/Datenschutz bei 320/1440 px
erfolgreich, korrektes Linkziel, keine automatischen Fremdabrufe, Schreibzugriffe,
Cookies, Seitenfehler oder horizontaler Überlauf. Zwei Liveaufnahmen sichtbar gesichtet.
Pages-Browsersuite: **68 bestanden**, sechs bewusste Skips. Bisheriger lokaler
Gesamtcheck mit 165 Tests und echter Runtime erfolgreich; Details im Bericht.

traceable/Revision 3, Generierung false, Serienstart null, Serienfreigabe false,
offizielles Archiv leer. Worker-Health nach Veröffentlichung configurationReady:true;
kein Worker-Upload, Zugriff auf Secrets/Verwaltungstoken, Login oder Modusspeichern.
Safari/Firefox, reale Geräte/Safe-Area, umfassende WCAG-/Sitzungsabnahme bleiben offen;
frühere zusätzliche Konfliktanzeige nicht abschließend erklärt. GitHub-Hinweise zu
Actions-Nodeversion/Ubuntu-Migration sind nicht blockierend; keine ungeprüften Updates.

[Vollständiger Veröffentlichungsbericht und Grenzen](gallery-publication-preparation.md).
Nur diese Ergebnisdokumentation samt NEXT-START/Runbook/Publikationsbericht bleibt
nach dem freigegebenen Push zusätzlich uncommittiert; PRD-Backup weiterhin
unversioniert und bytegleich. Kein zweiter Commit/Push aus der erledigten Freigabe.
Nach der Ergebnisdokumentation `npm run check` mit **165 Tests**, Datenprüfung,
Build und deaktiviertem Worker-Dry-Run erneut erfolgreich; Format-/Diff-/Backupprüfung
erfolgreich. Keine zusätzliche Browser-/Runtime-Suite für die reinen Dokumente.
Abschließende Ergebniszeile anschließend gezielt formatgeprüft.
Vor dem nächsten Arbeitspaket gemeinsam den veröffentlichten Stand sichten.

## Vorherige Chat-Übergabe – 04.11.2026, Galerie lokal vorbereitet

Nach lesendem Wiedereinstieg und gemeinsamer Sichtung mit „Fahre fort“ ausschließlich
lokale Vorbereitung umgesetzt: `config/operator.json` verweist auf den bestehenden
geprüften Betreiberworker; vorhandener Link öffnet dessen `/settings`. Veraltete
Galerie-Statushinweise in App/Datenschutz korrigiert, Einstellungsanzeige als Stand
dieser Galerieversion erklärt. Keine neue Designrunde; gemeinsamer Datenschutztext,
Version und Durchsichtsdaten unverändert. Kein neuer Worker-Upload erforderlich.

HEAD bleibt `53b7521`, main sechs Commits vor dem heute lesend bestätigten Remote
`f793247`; CI/Pages dort erfolgreich. Pages-Schalter true, Automatisierungsschalter
nicht gesetzt. Öffentliche Galerie und Worker-Routen mit Browser-User-Agent HTTP 200,
Health `configurationReady:true`; keine neue Anmeldung oder Speicherung.
Erste Python-Abrufe ergaben 403, erfolgreiche curl-Kontrollabrufe davon getrennt.
Keine aktuelle Worker-Versionskennung oder vollständige Sitzungsabnahme behauptet.

Neu geprüft: `check:publication` erfolgreich, `npm run check` mit **165 Tests**,
Datenprüfung, Build und deaktiviertem Worker-Dry-Run erfolgreich. Erster Sandboxversuch
am tsx-Socket blockiert, Wiederholung mit lokalen Prozessrechten erfolgreich.
Lokaler `worker:test-runtime` erfolgreich; `CI=true npm run test:browser` am neuen
Build **68 bestanden**, sechs bewusste Doppelaufruf-Skips, sechs Kunstreferenzen
unverändert. Einstellungsaufnahmen aller fünf Breiten sowie vollständige Desktop-/
320px-Ansicht gesichtet. Übliche Geräte-/WCAG-/Sitzungsgrenzen bleiben offen.

[Vollständiger Kandidat, acht lokale Dateien und späterer Freigabeumfang](gallery-publication-preparation.md).
Die vorhandenen Pausenänderungen erhalten und weitergeführt; Backup unversioniert
und bytegleich. Kein Commit, Push, Deployment, Zugriff auf Secrets oder Moduswechsel.
`traceable`/3, Generierung false, Startdatum null, Serienfreigabe false, Archiv leer.
Ein späterer main-Push würde auch alle sechs bisherigen lokalen Commits veröffentlichen
und Pages auslösen; dafür liegt weiterhin keine Freigabe vor.

## Vorherige Chat-Übergabe – Pause am 03.11.2026, Wiedereinstieg am 04.11.

Betreiber möchte pausieren und morgen in einem neuen Chat fortsetzen. Dieser
Auftrag umfasst ausschließlich Standdokumentation und einen neuen Startprompt;
**keine weiteren Commits, Pushes, Deployments oder Produktänderungen**.
[Aktueller kopierbarer Startprompt](NEXT-START.md). Historische Blöcke erweitern
den Auftrag nicht; zuerst diesen neuesten Stand verwenden.

- Bestehendes Projekt `/Users/abrocker/ai_o_projects/evolvera`, `origin`
  `https://github.com/bummber/evolvera.git`. Lokales `main` jetzt exakt auf
  **`53b7521cf027964c34091646432ba721514bd3c1`** (Mergecommit), sechs Commits
  vor `origin/main` **`f7932479a839a6176160eabe4edc675133aacafb`**. Eltern
  `238cbdaee1eab859b7e12cbd097abcbc35126e74` (Sicherungscommit mit exakt 22 Dateien)
  und `f793247`. Alle vier früheren lokalen Commits und Arbeiten erhalten.
- Vor diesem Pausenauftrag war der versionierte Arbeitsbaum sauber; einzig
  `docs/PRD_v1.1_backup.md` bewusst unversioniert und bytegleich. Dieser Nachtrag
  und NEXT-START bleiben **zusätzlich uncommittiert**. Kein dritter lokaler Commit
  aus den bereits vollständig ausgeführten zwei Commitfreigaben ableiten.
- **Lokale und Remote-Modusdatei traceable/Revision 3**, Generierung false,
  Serienstart null, Serienfreigabe false, offizielles Archiv leer. 40 Testwerke
  separat abgenommen. Keine Kunst-/Generator-/Archivänderung und keine neue Designrunde.
- Zehn Werkbuch-Designpakete bereits positiv gesichtet, lokal gesichert und
  integriert, aber **noch nicht veröffentlicht**. Öffentliche Pages-Galerie zuletzt
  auf `f793247` mit bisherigem Design. CI/Pages erfolgreich, Generierung übersprungen;
  öffentliches HTML und vier Startassets gegen isolierten Remote-Build geprüft.
  Keine neue Remote-/Liveprüfung in diesem reinen Pausenauftrag behaupten.
- Liveworker `https://evolvera-admin.alexander-brocker.workers.dev` zuletzt Version
  `08317969-9743-4a86-84c2-a57afd3b7e75`. Login, Abmelden/Neuanmeldung und echte
  Modusrunde traceable/1 → free/2 → traceable/3 bestätigt. Zusätzliche Konfliktanzeige
  beim Hinwechsel nicht abschließend erklärt; gültiger Moduscommit nachgewiesen.
  Snapshot-Testfehler gezielt auf GitHub behoben. Details in `operator-form-fix.md`
  und `operator-mode-test.md`. Kein weiterer Worker-Upload erforderlich.
- Galerie-`adminOrigin:null` und versionierter Workerstandard bewusst deaktiviert;
  Liveworker separat über ignorierte Vorlage bereitgestellt. Anmeldung nicht als Demo
  darstellen. Nächstes Arbeitspaket: nach gemeinsamer Bestandssichtung den Galerie-Link
  zum geprüften Betreiberworker und die separate Veröffentlichung des abgenommenen
  Werkbuch-Designs vorbereiten. Noch keine Publikationsfreigabe; zuerst den vollständigen
  konkreten Umfang prüfen und vorlegen. Kein Serienstart daraus ableiten.
- Anbieterprüfung und Datenschutzfassung `2026-11-03.1` abgeschlossen/dokumentiert;
  `providerReviewedOn:2026-11-03`. Keine neue allgemeine Vertrags- oder Secret-Runde.
  Private Originaldateien außerhalb des Repositories unter
  `~/.evolvera-operator-setup/` erhalten, keine Werte ausgeben oder erneut anfordern.
  Befristeter Cloudflare-Verwaltungstoken läuft **04.11.2026, 23:59:59 MEZ** ab.
  Morgen vor einer nötigen Verwendung Zeit/Gültigkeit und Zielzustand lesend prüfen;
  keinen Ablauf umgehen, keine Rechte oder neuen Tokens ungefragt einrichten.
  Für die nächste Galerie-/Pages-Vorbereitung keinen Worker-Upload erzwingen.
- Letzter vollständiger Nachweis im tatsächlichen zusammengeführten Stand vor dem
  Mergecommit: `check:publication` Exit 0, `npm run check` mit **165 Tests**, Datenprüfung,
  Build/Worker-Dry-Run erfolgreich; echter lokaler `worker:test-runtime` erfolgreich;
  `test:browser` am gebauten Stand mit `CI=true`: **68 bestanden**, sechs bewusste
  Doppelaufruf-Skips, sechs Kunstreferenzen unverändert. Ergebnisdokumentation danach
  gezielt format-/diffgeprüft. Node 24.21.0 gemäß `.nvmrc`, Lockfile unverändert.
  Safari/Firefox, reale Geräte/Safe-Area, umfassende WCAG-/Sitzungs-/Negativfallabnahme
  bleiben offen. Temporäre Kopien/Protokolle unter `/private/tmp` sind nicht dauerhaft
  garantiert; erforderliche Nachweise stehen in den Projektberichten.

In diesem Pausenschritt ausschließlich HANDOFF und NEXT-START aktualisiert.
`npm run check` erneut vollständig erfolgreich mit **165 Tests**, Datenprüfung,
Build und deaktiviertem Worker-Dry-Run; Format-/Diff-/Backupprüfung erfolgreich.
Keine neue Browser-/Runtime-Suite für die reine Dokumentation; deren letzter
Nachweis stammt aus dem tatsächlichen Integrationsschritt vor `53b7521`.
Keine neue GitHub-/Cloud-Zustandsprüfung, keine weiteren Commits oder Veröffentlichungen.

## Vorheriger Stand – 03.11.2026, lokaler Stand zusammengeführt

Betreiber hat genau die zwei vorgelegten lokalen Commits mit **„Freigabe erteilt“**
beauftragt; Push/Deployment bleiben ausgenommen. Zuerst Sicherungscommit
**`238cbdaee1eab859b7e12cbd097abcbc35126e74`** mit exakt 22 benannten Dateien
erstellt. Alle vorherigen vier lokalen Commits und Arbeiten erhalten; PRD-Backup
ausgeschlossen und bytegleich.

Danach frischer GitHub-Head-/Konfigurationsabgleich, Fetch von `origin/main` auf
**`f7932479a839a6176160eabe4edc675133aacafb`** im bestehenden Repository und
konfliktfreie Zusammenführung mit `--no-commit --no-ff`. Testfix bereits identisch;
nur die Modusdatei wurde zusätzlich bytegleich von Remote übernommen. **Auch die
reale lokale Konfiguration jetzt traceable/Revision 3.** Generierung false,
Startdatum null, Serienfreigabe false, Archiv leer, Galerie-Origin null und
versionierter Worker deaktiviert.

Abschließender lokaler Mergecommit hat die Eltern `238cbda` und `f793247`;
aktuellen Hash mit `git log -1` lesen. Keine Historienumschreibung, kein Pull/Reset
oder Force-Push. Nach Abschluss ist lokales main sechs Commits vor origin/main.
[Vollständiger Bericht und frühere isolierte Nachweise](integration-preparation.md).
Die alten Hinweise „ungefetchtes origin/main“ und „lokal Revision 1“ in den
folgenden historischen Blöcken sind erledigt.

Kein Push, Pages-/Worker-Deployment oder weiterer Moduswechsel. Die bestehende
öffentliche Galerie bleibt auf `f793247`, das neue Werkbuch-Design weiterhin lokal;
Liveworker zuletzt `08317969-9743-4a86-84c2-a57afd3b7e75`. Keine Secrets gelesen
oder verändert. PRD-Backup unversioniert erhalten.

Vor dem nächsten Arbeitspaket gemeinsam den gesicherten Stand sichten. Danach
Galerie-Link zum geprüften Betreiberworker und die separate Veröffentlichung des
bereits abgenommenen Designs vorbereiten. Keine neue Designrunde und keine
Serienfreigabe daraus ableiten.

Im tatsächlichen zusammengeführten Arbeitsbaum vor dem Mergecommit geprüft:
`check:publication` Exit 0, `npm run check` mit **165 Tests**, Datenprüfung, Build
und Worker-Dry-Run erfolgreich. `worker:test-runtime` erfolgreich;
`test:browser` am gebauten Stand mit `CI=true`: **68 bestanden**, sechs bewusste
Doppelaufruf-Skips, sechs Kunstreferenzen unverändert. Kein neuer manueller
Design-/Gerätenachweis. Ergebnisdokumentation danach gezielt format-/diffgeprüft.
Alle 22 Eingangsdateien bytegleich im Sicherungscommit erhalten; weitere
Eingangsdateien ausser freigegebener Modus-/Statusanpassung unverändert.

## Vorheriger Stand – 03.11.2026, lokale Zusammenführung isoliert geprüft

Auf „Wie geht es weiter“ den lokalen Abgleich vorbereitet, ohne Commit, Push oder
Deployment. GitHub rein lesend bestätigt: weiterhin `f793247`, drei Commits seit
`9ad1fa7`, insgesamt nur Modusdatei und Snapshot-Test verändert. Lokales HEAD bleibt
`5afbe7b` mit vier lokalen Commits und allen bisherigen uncommittierten Arbeiten.

In temporärer Kopie des vorhandenen Repositories beide vorhandenen Historien ohne
neue Commits per `git merge-tree` konfliktfrei kombiniert, alle berücksichtigten
lokalen Arbeitsdateien bytegleich überlagert und Remote traceable/Revision 3 erhalten.
Unversioniertes PRD-Backup ausgeschlossen und im eigentlichen Projekt bytegleich
erhalten. **Eigentlicher Arbeitsbaum weiterhin traceable/1; noch kein tatsächlicher Merge.**

Kombinierter Kandidat geprüft: `check:publication` Exit 0, `npm run check` mit
**165 Tests**, Datenprüfung, Build und Worker-Dry-Run erfolgreich; echter lokaler
workerd-/SQLite-Test erfolgreich; Browser am kombinierten Build **68 bestanden,
sechs bewusste Doppelaufruf-Skips**, sechs Kunstreferenzen unverändert. Nur
synthetische Daten und isolierte Test-Repositories, keine neue Designrunde.

[Vollständiger Kandidat, Prüfnachweise und genaue Dateiauswahl](integration-preparation.md).
Nächster Freigabepunkt: **genau zwei lokale Commits** – Sicherung der benannten
22 Dateien, danach kontrollierte Zusammenführung mit Remote einschließlich Revision 3
und erforderlicher Prüfungen in einem Mergecommit. Kein Push oder Deployment,
kein Galerie-Link oder Serienstart aus dieser Vorbereitung ableiten.
Die bestehende Sperre für lokale Commits bleibt bis zur ausdrücklichen Freigabe.

Nach der Vorbereitung Statusdokumente auch im isolierten Kandidaten aktualisiert
und dort Formatprüfung erfolgreich. Im eigentlichen Projekt `npm run check` nach
Dokumentation erneut erfolgreich mit **165 Tests**, Datenprüfung, Build und
deaktiviertem Worker-Dry-Run. Keine neue Browser-/Runtime-Suite nach den reinen
Dokumentationsänderungen; obige Nachweise stammen aus dem kombinierten Kandidaten.

## Vorheriger Stand – 03.11.2026, Rückwechsel traceable/3 gespeichert

Betreiber hat den einmaligen Rückwechsel free/2 → traceable/3 samt Moduscommit und
CI-/Pages-Folge mit **„ja“** freigegeben, selbst gespeichert und meldet
**„Nachvollziehbare Vererbung Revision 3“**. Lesend auf GitHub bestätigt:
[`f793247`](https://github.com/bummber/evolvera/commit/f7932479a839a6176160eabe4edc675133aacafb),
03.11.2026, **23:02:39 Uhr MEZ**, Elterncommit `75f11ae`, ausschließlich
`config/generation.json` geändert. Remote **traceable/Revision 3**, Generierung false,
Startdatum null, Serienfreigabe false. Keine Speicherung durch den Agenten.

[CI](https://github.com/bummber/evolvera/actions/runs/41727228799) und
[Pages](https://github.com/bummber/evolvera/actions/runs/41727228841) für genau diesen
Commit **erfolgreich**; Build/Deploy erfolgreich, Generierung korrekt übersprungen.
Öffentlich HTTP 200, HTML und vier initiale Assets bytegleich zum isolierten
Remote-Build mit traceable/3; Archiv weiter leer. Remote-main und Seriengates erneut
lesend bestätigt. Keine neue manuelle Browser-/Geräteabnahme.
[Vollständiger Modusbericht](operator-mode-test.md).

Lokales HEAD `5afbe7b`, vier lokale Commits seit `9ad1fa7`, ungefetchte
`origin/main`-Referenz weiterhin `9ad1fa7`. Tatsächliches Remote inzwischen drei
Commits weiter (Hinwechsel, Testfix, Rückwechsel). Lokale Modusdatei weiter
traceable/1; **Remote-Revision 3 beim späteren Abgleich erhalten**. Alle bisherigen
Arbeiten und PRD-Backup erhalten. Kein lokaler Commit/Push/Merge/Reset, kein
Worker-Update oder Serienstart aus diesem Prüfschritt.

Nach Abschluss der Nachprüfung nächsten Arbeitsschritt gemeinsam sichten:
lokalen Stand mit Remote-Änderungen geordnet zusammenführen und separat eine
Veröffentlichung des bereits abgenommenen Werkbuch-Designs vorbereiten.
Keine neue Designrunde und keine implizite Publikationsfreigabe.

Nach Statusdokumentation `npm run check` erneut erfolgreich mit **165 Tests**,
Format/Lint/Typen, Datenprüfung, Build und deaktiviertem Worker-Dry-Run.
Keine neue lokale Browser-/Runtime-Suite für die reine Dokumentationsänderung;
GitHub-Läufe und öffentliche HTTP-/Byteprüfungen sind die neuen externen Nachweise.

## Vorheriger Stand – 03.11.2026, gezielter CI-Testfix veröffentlicht

Betreiber hat ausschließlich den Ein-Datei-Testfix samt CI-/Pages-Folge mit
**„Freigabe erteilt“** beauftragt. Einmalig via GitHub-Contents-API als
[`75f11ae`](https://github.com/bummber/evolvera/commit/75f11aed4481a56b67ece6bdff67354053857ab6)
übernommen; Elterncommit `4f1186f8280d9db25b261a9de13dc081cd35e060`.
Vorher frischer Head-/Datei-SHA-Abgleich, danach genau eine geänderte Datei
`tests/evolution.test.ts` und bytegleicher geprüfter Inhalt bestätigt.

Keine lokalen Design-/Worker-/Dokumentationsdateien mit veröffentlicht, kein
weiteres Worker-Deployment. Modusdatei auf GitHub bytegleich: **free/Revision 2**,
Generierung aus, Startdatum null. Lokale Modusdatei weiter traceable/1.
[CI](https://github.com/bummber/evolvera/actions/runs/41726299381) und
[Pages](https://github.com/bummber/evolvera/actions/runs/41726299386) **erfolgreich**
für genau diesen Commit. Pages-Build/Deploy erfolgreich, Generierungsschritt korrekt
übersprungen. Öffentliche Pages-GETs HTTP 200; HTML und vier initiale Assets bytegleich
zum isolierten Remote-Build mit free/2 und Testfix, offizieller Index weiter leer.
Remote-main und unveränderte Modusdatei danach erneut lesend bestätigt.
[Vollständiger Bericht](operator-mode-test.md).

Lokales HEAD `5afbe7b` und alle Arbeiten erhalten, keine lokale Git-Mutation;
`origin/main` weiter ungefetchter Stand `9ad1fa7`, tatsächliches Remote jetzt zwei
Commits weiter. Nicht blind pullen, zurücksetzen oder force-pushen. Kein weiterer
Moduswechsel, Rückwechsel oder Serienstart aus dieser Freigabe ableiten.

Nach Statusdokumentation lokal `npm run check` erneut erfolgreich mit **165 Tests**,
Format/Lint/Typen, Datenprüfung, Build und deaktiviertem Worker-Dry-Run. Keine neue
lokale Browser-/Runtime-Suite für diese reine Dokumentationsänderung. Erfolgreiche
GitHub-Läufe und HTTP-/Bytevergleich sind die neuen externen Nachweise.

## Vorheriger Stand – 03.11.2026, free/2 gespeichert, CI-Testfix lokal

Betreiber meldet Speicherkonflikt und bestätigt nach erneutem Laden **„Maximale
Freiheit Revision 2“**. GitHub ausschließlich lesend geprüft: `main` jetzt
`4f1186f8280d9db25b261a9de13dc081cd35e060`, Commit 03.11., 22:45:47 Uhr MEZ,
nur `config/generation.json` geändert. **Remote: free/Revision 2**; Generierung false,
Startdatum null, Serienfreigabe false, offizieller Index leer. Kein weiterer
Speicherversuch oder Rückwechsel durch den Agenten; keine Freigabe dafür abgeleitet.

Konfliktursache nicht abschließend nachgewiesen; ein zweites Absenden der alten
Revision ist plausibel, aber nicht als Tatsache dokumentiert. Der Moduscommit selbst
ist nachgewiesen. Beide ausgelösten Workflows scheitern an einem Test, der die echte
Betreiberkonfiguration übernimmt, aber fest traceable/1 erwartet. Pages-Deploy wurde
übersprungen, bisherige Veröffentlichung bleibt bestehen.

Lokal nur `tests/evolution.test.ts` auf feste synthetische Einstellungen umgestellt.
Keine Generator-/Kunst-/Archiv-/Worker- oder Konfigurationsänderung in diesem Schritt.
Auf altem Remote-Code in isoliertem Git-Repository mit synthetischem free/2 exakt
reproduziert; nach dem Testfix 131 Tests, Build/Datenprüfung, separater Worker-Dry-Run,
Runtime und 32 Browserfälle erfolgreich. Danach synthetisch traceable/3: 131 Tests
erfolgreich. Relativer Worker-Ausgabepfad im isolierten Gesamtcheck zunächst blockiert,
separater absoluter Ausgabepfad innerhalb des Testrepos erfolgreich.
[Vollständige Nachweise und konkreter Freigabevorschlag](operator-mode-test.md).

Abschließend im aktuellen Projekt `npm run check` erfolgreich: **165 Tests**,
Format/Lint/Typen, Datenprüfung, Build und deaktivierter Worker-Dry-Run.
Keine neue aktuelle Browser-/Runtime-Suite für die reine Test-/Dokumentationsänderung;
die oben genannten neuen 32 Browserfälle/Runtime stammen ausdrücklich aus dem
isolierten alten Remote-Code. Format-/Diff-/Backupprüfung erfolgreich.

**Testfix noch nicht auf GitHub.** Nächster gesonderter Vorschlag: ausschließlich
die eine Testdatei auf Remote-main übernehmen, samt einem Commit und möglichen
CI-/Pages-Läufen. Keine lokale Design-/Worker-Veröffentlichung, kein Modusrückwechsel
oder Serienstart daraus ableiten. Bis dahin nicht erneut speichern.

Lokales HEAD weiter `5afbe7b`, reale lokale Konfiguration weiter traceable/1.
Die lokale `origin/main`-Referenz bleibt ungefetchter Stand `9ad1fa7`; tatsächliches
Remote ist nun einen Moduscommit weiter, lokale vier Commits und uncommittierte
Arbeiten vollständig erhalten. Kein Pull/Reset/Merge/Commit/Push ausgeführt.

## Vorheriger Stand – 03.11.2026, Live-Logout bestätigt

Nach Veröffentlichung des Formular-Fixes hat der Betreiber auf den vorgelegten
Testablauf (Einstellungen frisch laden, abmelden, erneut laden, dann neu anmelden)
mit **„Funktioniert“** geantwortet. Der Abmelde-/Neuanmeldetest ist damit durch den
Betreiber bestätigt. Aktive zuletzt geprüfte Cloudversion bleibt
`08317969-9743-4a86-84c2-a57afd3b7e75`; kein weiteres Deployment erforderlich.

Dieser Nachtrag dokumentiert ausschließlich die Rückmeldung, keine eigene
Sitzungseinsicht oder neue Cloudprüfung. Die frühere Logoutstörung ist für diesen
Praxisablauf behoben bestätigt. Umfassende Sitzungsabnahme, Ablauf, Konflikte,
negative Cloud-Authentifizierungsfälle und Safari/Firefox bleiben offen.

Echte Modusspeicherung bleibt ungeprüft und nicht freigegeben; ein solcher Test
kann Git-Commits und Pages-Läufe auslösen und wird vor Durchführung gesondert
vorgelegt. Nächsten Arbeitsschritt gemeinsam sichten. Kein Commit/Push,
Pages-Update, Tokenwiderruf oder Serienstart aus der Rückmeldung ableiten.
Generierung false, Serienstart null, Serienfreigabe false, traceable/Revision 1,
leeres offizielles Archiv und Galerie-Origin null unverändert. Alle Arbeiten erhalten.

Für diesen reinen Dokumentationsnachtrag `npm run check` erneut erfolgreich mit
**165 Tests**, Datenprüfung, Build und deaktiviertem Worker-Dry-Run. Keine externe
Abfrage und keine neue Browser-/Runtime-Suite; Format-/Diff-/Backupprüfung erfolgreich.

## Vorheriger Stand – 03.11.2026, Formular-Fix veröffentlicht

Betreiber hat das konkrete Worker-Code-Update mit **„Freigabe erteilt“** beauftragt.
Einmalig auf dem bestehenden `evolvera-admin` ausgeführt, am **03.11.2026 um
22:38 Uhr MEZ**, Exit 0. Aktive Version `08317969-9743-4a86-84c2-a57afd3b7e75`,
100 Prozent Traffic; Deployment-ID `7b452a7b-678c-4444-a98c-e82f46ff8d85`.
[Bericht, Ursache, Tests und Grenzen](operator-form-fix.md).

- Vorher Token/Gültigkeit, erwartete alte Liveversion, Variablen, Secret-Bindings,
  SQLite und Logging nur lesend bestätigt. Token aktiv bis 04.11.2026, 23:59:59 MEZ.
- Nur Code mit vorhandener ignorierter Vorlage hochgeladen, keine Secretdatei
  gelesen/hochgeladen und keine Rotation. Danach beide bisherigen Secret-Bindings,
  **derselbe SQLite-Namespace**, Migration `v1`, Variablen und Laufzeitdatum bestätigt.
  workers.dev aktiv; Preview URLs/Logpush aus, keine Tail-Consumer, Observability
  weiterhin deaktiviert/API `null`. Wrangler-Dateilogs und Telemetrie aus.
- `/health`, `/privacy`, `/imprint` per öffentlichem curl-GET: jeweils HTTP 200,
  keine Cookies, `no-store`, `no-referrer` und Schutzheader bestätigt. Health bereit;
  Rechtstextfragmente exakt gleich zur durchgesehenen Fassung `2026-11-03.1`.
- **Echter Logout des korrigierten Workers noch offen.** Betreiber soll die
  Einstellungen frisch laden, abmelden und erneut laden: danach muss die
  Anmeldeansicht erscheinen. Anschließend selbst erneut anmelden, nichts speichern.
  Keine Sitzung/Cookies/Codes vom Agenten gelesen, kein Live-Modusschreibtest.
- Kein Commit/Push, Pages-Update oder Generierung. Alle lokalen Arbeiten erhalten;
  HEAD `5afbe7b`, vier lokale Commits vor bekanntem `origin/main`, kein GitHub-Abgleich.
  Galerie-Origin null; Generierung false, Startdatum null, Serienfreigabe false,
  traceable/Revision 1 und offizielles Archiv leer. Private Originaldateien erhalten.

Der vorige Reparaturschritt prüfte unveränderten Code mit 165 Tests, echtem lokalen
workerd/SQLite und 68 bestandenen Browserfällen (sechs bewusste Doppelaufruf-Skips).
Dieses Deployment ändert daran keine Implementierung. Die hier neue Cloudprüfung
ist ausschließlich lesend; umfassende Sitzungsabnahme und Safari/Firefox bleiben offen.

Nach der Deployment-Dokumentation `npm run check` erneut vollständig erfolgreich
mit **165 Tests**, Datenprüfung, Build und deaktiviertem Worker-Dry-Run.
Keine neue Browser-/Runtime-Suite; deren Nachweis stammt aus dem Reparaturschritt.
Dateivergleich seit Beginn dieses Deploymentauftrags: ausschließlich die fünf
zugehörigen Statusdokumente geändert, keine Dateien gelöscht; Format-/Diff- und
bytegleiche PRD-Backupprüfung erfolgreich.

## Vorheriger Stand – 03.11.2026, Logoutfehler lokal behoben

Nach erfolgreichem Login meldet der Betreiber beim Abmelden „Vorgang nicht bestätigt.“;
„Einstellungen neu laden“ zeigt die weiterhin gültige Sitzung. **Kein erfolgreicher
Logout.** Lokal mit echtem Chromium reproduziert: native Formular-POSTs unter
`no-referrer` senden `Origin:null`; die bisherige Originprüfung weist sie mit
HTTP 403 ab, bevor ein Widerruf stattfindet. Auch Modusspeicherung betroffen;
kein echter Modusschreibversuch erfolgt.

Lokal korrigiert: zusätzlich zur exakten Origin nur `Origin:null` zusammen mit
`Sec-Fetch-Site:same-origin`, `Sec-Fetch-Mode:navigate` und
`Sec-Fetch-Dest:document` akzeptieren. Sitzung und CSRF bleiben verpflichtend,
`no-referrer` und Datenschutzfassung unverändert. Neue negative Unitfälle,
workerd-/SQLite-Nachweise und native Browserformulare mit synthetischen Daten.
[Ursache, Prüfumfang und konkretes Update](operator-form-fix.md).

Tatsächlich geprüft: `npm run check` mit **165 Tests**, Datenprüfung, Build und
Worker-Dry-Run erfolgreich; `worker:test-runtime` einschließlich Formularlogout
und abgewiesener fremder Herkunft erfolgreich. `test:browser` am gebauten Stand:
**68 bestanden, sechs bewusste Doppelaufruf-Skips**, sechs Kunstreferenzen unverändert.
Aktive Upload-Vorlage mit synthetischen Secrets erneut per Dry-Run erfolgreich.
Keine neue Cloudprüfung; Browsernachweis Chromium Desktop/320px, nicht Safari/Firefox.

**Korrektur noch nicht veröffentlicht.** Cloudworker unverändert; bis zum
freigegebenen Update keinen Modus speichern. Nächster Freigabepunkt ist nur das
beschriebene Code-Update mit bestehenden Secrets/Speicher, danach lesende
Health-/Rechtstextprüfung und Logouttest durch den Betreiber. Kein Commit/Push,
Pages-Update oder Serienstart. Vorhandene Arbeiten und bytegleiches PRD-Backup
erhalten. HEAD weiter `5afbe7b`, vier lokale Commits vor bekanntem `origin/main`;
keine Remoteabfrage in diesem Reparaturschritt.

## Vorheriger Stand – 03.11.2026, Betreiberlogin bestätigt

Der Betreiber meldet: **„Die Authorisierung per Github war erfolgreich. Ich sehe
die Einstellungen und habe nichts gespeichert“**. Damit ist der erste echte Login
bis zur Einstellungsansicht durch den Betreiber bestätigt. Kein eigener Zugriff
des Agenten auf Sitzung, Cookies, Callback-Code oder Tokens; keine Geheimnisse
angefordert oder ausgegeben. Laut vorhandener Implementierung setzt die sichtbare
Einstellungsansicht auch das erfolgreiche Lesen der GitHub-Moduskonfiguration voraus.
Dies ist ein positiver Praxisnachweis aus der Betreiberbestätigung, keine neue
automatisierte Cloudprüfung und keine umfassende Sitzungsabnahme.

Kein Modus gespeichert; kein Speichertest oder weiterer Pages-Lauf beauftragt.
Abmelden/Widerruf, Ablauf, Konflikte und reale negative Authentifizierungsfälle
bleiben offen. Nächsten Arbeitsschritt gemeinsam sichten; eine Modusspeicherprüfung
mit möglichem Git-Commit/Pages-Lauf benötigt einen passenden weiteren Auftrag.
Galerie-Veröffentlichung, Commit/Push, Tokenwiderruf, Generierung und Serienstart
sind aus dieser Rückmeldung nicht freigegeben. Alle bisherigen Arbeiten erhalten;
nur die lokale Statusdokumentation aktualisiert. Seriengates unverändert gesperrt.

Für diesen Statusnachtrag `npm run check` erneut vollständig erfolgreich mit
**155 Tests**, Datenprüfung, Build und deaktiviertem Worker-Dry-Run. Keine externe
Abfrage, neue Bereitstellung oder Browser-/Runtime-Suite; Implementierung unverändert.
Format-/Diffprüfung erfolgreich, PRD-Backup bytegleich erhalten.

## Vorheriger Stand – 03.11.2026, Worker veröffentlicht

Der Betreiber hat die konkret vorgelegten drei Schritte mit **„Ich gebe die Schritte
frei“** beauftragt: erstmaliger gemeinsamer Worker-/Secret-Upload, SQLite-Speicher
und Anmeldeaktivierung nur für `bummber`, anschließend lesende Nachprüfung.
Diese Freigabe wurde ausgeführt; **keinen weiteren Erstupload wiederholen**.

- Neuer `evolvera-admin` unter
  `https://evolvera-admin.alexander-brocker.workers.dev`, Deployment am
  **03.11.2026 um 22:12 Uhr MEZ**. Deployment-ID
  `ea0224e4-267b-4605-bb03-b6ccc8a09080`, aktive Version
  `86dadc05-c9fd-4a9c-ab23-15a3494a58ee` mit 100 Prozent Traffic.
- Vorher erneut ausschließlich GET: Token aktiv bis **04.11.2026, 23:59:59 MEZ**,
  Zielworker noch nicht vorhanden, erwartete Account-Subdomain. Danach einmaliger
  Upload mit projektlokalem Wrangler 4.154.0 und der bestehenden ignorierten Vorlage
  `work/operator-deploy/wrangler.jsonc`; beide echten Secrets gemeinsam über die
  geschützte externe JSON-Datei. Wrangler-Dateilogs und Telemetrie deaktiviert;
  keine Secretwerte oder rohen Wrangler-Ausgaben ausgegeben. Exit 0.
- Cloudzustand lesend bestätigt: genau ein Worker; beide Secret-Bindings vorhanden,
  Variablen entsprechen der Vorlage, feste Betreiber-ID `46008719`, Binding
  `SESSIONS`/Klasse `Sessions`, SQLite-Namespace, Migration `v1`, Laufzeitdatum
  `2026-10-28`. workers.dev aktiv, Preview URLs aus, Logpush aus, keine Tail-Consumer.
  Deaktivierte Observability wird von der API als fehlendes Feld beziehungsweise
  `null` zurückgegeben, nicht als explizites `false`. Gegen separate Script-Settings
  und die Behandlung fehlender Observability im installierten Wrangler geprüft;
  keine zusätzliche Änderung oder zweites Deployment erforderlich.
- Öffentliche GETs auf `/health`, `/privacy`, `/imprint`: jeweils **HTTP 200**,
  keine Cookies, `no-store`, `no-referrer` und Sicherheitsheader bestätigt.
  Health meldet `configurationReady:true`. Rechtstextfragmente SHA-256-gleich zur
  lokalen, durchgesehenen gemeinsamen Fassung `2026-11-03.1`; kein Entwurfshinweis.
  Alle drei Seiten zusätzlich im nativen Browser sichtbar geprüft. Python-urllib
  erhielt zuvor Cloudflare 1010/HTTP 403; normale Browsernavigation und curl
  funktionieren. Keine Schutzregel abgeschwächt.
- Echten Login **nicht gestartet**, keine OAuth-/Sitzungsabnahme und kein
  Modusspeichertest behauptet. Nächster Schritt ist der direkte Login durch den
  Betreiber über `/login`; noch keinen Modus speichern. GitHub-App-Schlüsselpaar,
  Callback und echte Sitzungen sind erst damit praktisch nachweisbar.
- `main`/HEAD `5afbe7b`, vier lokale Commits vor bekanntem `origin/main` erhalten;
  kein neuer Remoteabgleich, Commit oder Push. Alle vorhandenen Arbeiten erhalten.
  Nur Dokumentation zum erfolgten Upload fortgeschrieben. Versionierter
  Workerstandard bleibt deaktiviert; Galerie-`adminOrigin:null`. Kein Pages-Update.
- Generierung `false`, Serienstart `null`, `seriesAuthorized:false`, Modus
  `traceable`, Revision 1, offizielles Archiv leer. Die 40 Testwerke bleiben separat
  abgenommen. Keine Kunst-, Generator-, Archiv-, UI- oder Sitzungscodeänderung.
- Private Originaldateien nicht überschrieben oder gelöscht. Der temporäre Token
  bleibt bis zum dokumentierten Ablauf unverändert; Aufräumen/Widerruf ist ein
  gesonderter Betreiberauftrag, keine neuen Zugangsdaten anfordern.

[Uploadbericht und Prüfgrenzen](operator-first-upload.md),
[aktueller Wiedereinstieg](NEXT-START.md). Frühere offene Uploadfreigaben und
Erstupload-Anweisungen in den folgenden historischen Blöcken sind erledigt.

Abschließend `npm run check` vollständig erfolgreich: Format/Lint/Typen,
**155 Tests**, Daten-/Vorschauprüfung, Build und Worker-Dry-Run des deaktivierten
Projektstandards. `check:publication` unmittelbar vor dem Upload erfolgreich.
Keine neue Browserregressions- oder synthetische Worker-Runtime-Suite, da nur
Dokumentation geändert wurde; die drei öffentlichen Worker-Seiten wurden wie oben
beschrieben live geprüft. Letzter lokaler Runtime-/Galerie-Browsernachweis bleibt
der Anbieterprüfschritt mit 66 Browserfällen und sechs bewussten Doppelaufruf-Skips.
Safari/Firefox, echte Geräte/Safe-Area, umfassende WCAG-Abnahme und Cloud-Login offen.

## Vorherige Chat-Übergabe – 03.11.2026, vor Uploadfreigabe

Auf Betreiberwunsch aktuellen Stand und Startprompt für einen neuen Chat festhalten.
**Dieser Übergabeauftrag erteilt keine Upload-/Aktivierungsfreigabe.** Es wurde zuvor
konkret um diese Freigabe gebeten, der Betreiber hat stattdessen die Übergabe gewünscht.
Im neuen Chat an genau diesem Punkt fortsetzen; keine neue Design-, Vertrags- oder
Secret-Eingaberunde beginnen. [Kopierbarer Startprompt](NEXT-START.md).

- Bestehendes Projekt `/Users/abrocker/ai_o_projects/evolvera`, `main`, HEAD
  **`5afbe7b`**, vier lokale Commits vor dem bekannten `origin/main` (`9ad1fa7`).
  `origin` bleibt `https://github.com/bummber/evolvera.git`. Kein neuer Remoteabgleich.
  Die zehn positiv gesichteten Werkbuch-Pakete sind in `5afbe7b` lokal gesichert;
  das Werkbuch-Design ist nicht veröffentlicht. Die nachfolgenden Anbieter-/Upload-
  Vorbereitungen liegen **uncommittiert** vor, einschließlich `provider-review.md`
  und `operator-first-upload.md`. Sämtliche Änderungen und unversionierten Dateien
  erhalten. PRD-Backup unversioniert und bytegleich; nicht aufnehmen/formatieren.
- Lokale Anbieterprüfung abgeschlossen, `providerReviewedOn:2026-11-03`;
  Betreiber-Datenschutzfassung `2026-11-03.1` mit bestätigter Textdurchsicht.
  `npm run check:publication` zuletzt **Exit 0**. Keine alte Begrüßungsmail oder
  zusätzliche Vertragsurkunde verlangen. Nachweise/Grenzen in [provider-review.md](provider-review.md).
  Keine anwaltliche Freigabe oder vollständige persönliche DPA-Lektüre behaupten.
- GitHub App ist registriert und nur auf `bummber/evolvera` installiert.
  Der Betreiber hat beide GitHub-App-Geheimnisse lokal geschützt abgelegt:
  `~/.evolvera-operator-setup/worker-secrets.json`. Befristeter Cloudflare-Zugang:
  `~/.evolvera-operator-setup/cloudflare-auth.json`. Beide Dateien außerhalb von Git;
  0700/0600 und erwartete Struktur ohne Wertausgabe geprüft. Keine Secrets erneut
  anfordern oder anzeigen; kein `cat`, kein Debugtrace, keine Werte in Befehlsargumenten.
- Token-Policy vor manueller Erstellung im Browser geprüft: ausschließlich
  **Workers Admin im Zielkonto**. Echte lesende API-Prüfung danach: Token active,
  Ablauf **04.11.2026 23:59:59 MEZ**, 0 Worker, erwartete Account-Subdomain.
  Im neuen Chat Uhrzeit/Ablauf sowie aktuellen Zielzustand erneut nur lesend prüfen.
  Vorhandenen gültigen Token nutzen, abgelaufenen nicht umgehen; MCP bleibt lesend.
- Der versionierte Workerstandard ist **deaktiviert**. Die separate ignorierte
  Upload-Vorlage `work/operator-deploy/wrangler.jsonc` ist synthetisch per Dry-Run
  geprüft und sieht die direkte Anmeldeaktivierung vor. `synthetic-secrets.json`
  dort ist ausschließlich Testmaterial, niemals für einen echten Upload verwenden.
  Reale Dateien ausschließlich über geschützte Tool-Eingabe verwenden. Lokale
  Runtime-/Auth-Tests bleiben isoliert und verwenden ausschließlich synthetische Daten.
  Echte lesende Anbieterprüfungen sind davon getrennt.
- Bereits konkret vorgelegter Umfang: neuen `evolvera-admin` unter
  `https://evolvera-admin.alexander-brocker.workers.dev` samt beiden GitHub-App-Secrets
  und SQLite-Sitzungsspeicher bereitstellen, Anmeldung nur für Betreiber `bummber`
  aktivieren; danach Health und öffentliche Rechtstexte lesend prüfen. **Offene
  Betreiberfreigabe für genau diesen Upload-/Aktivierungsschritt.** Keine Galerie-
  Veröffentlichung oder Modus-Speichertests daraus ableiten; Moduscommits auf `main`
  können Pages auslösen. Details in [operator-first-upload.md](operator-first-upload.md).
- Letzter tatsächlicher Prüfstand: `npm run check` mit **155 Tests**, Datenprüfung,
  Build und Worker-Dry-Run; im Anbieterprüfschritt zudem lokaler
  `npm run worker:test-runtime` erfolgreich und `npm run test:browser` mit **66
  bestanden, sechs bewussten Doppelaufruf-Skips**. Sechs Kunstreferenzen unverändert;
  100 Seiten-/Breitenkombinationen ohne horizontalen Dokumentüberlauf. Keine neue
  manuelle Bildsichtung. Safari/Firefox, reale Geräte/Safe-Area, umfassende WCAG-
  Abnahme und echte Anmeldung bleiben offen; Evolution zeigt Werk und geladene Eltern.
- Generierung `false`, Startdatum `null`, `seriesAuthorized:false`, Modus `traceable`,
  Revision 1, offizielles Archiv leer. Kunstabnahme der 40 Testwerke bleibt separat
  erhalten. Galerie-Origin null; kein Worker-Upload, Git-Push oder Tarifwechsel.

In diesem Übergabeschritt ausschließlich HANDOFF und NEXT-START aktualisiert.
`npm run check` erneut vollständig erfolgreich mit **155 Tests**, Datenprüfung,
Build und Worker-Dry-Run; Format-/Diff-/Backupprüfung erfolgreich. Keine neue
Browser-/Runtime-Suite für die reine Dokumentation; deren letzter Nachweis ist oben
ausdrücklich zugeordnet.
Keine neuen Commits, externen Aufrufe, Ressourcen, Rechte oder Deployments.
Temporäre Helfer und generierte Typen unter `/private/tmp` sind nicht dauerhaft
garantiert. Die private Secret-Ablage liegt dagegen im Benutzerverzeichnis und ist
kein Projektartefakt; vorhandene Dateien vor einer Neuerzeugung ohne Wertausgabe prüfen.

## Vorheriger Stand – Uploadzugang lesend geprüft am 03.11.2026

Betreiber bestätigt lokal abgelegten Cloudflare-Token. Ordner-/Dateirechte 0700/0600,
Eigentümer, Struktur und Zielkonto-Zuordnung ohne Wertausgabe geprüft. Ausschließlich
GET-Prüfungen mit dem echten Token: **active**, gültig bis **04.11.2026 23:59:59 MEZ**,
**0 Worker**, `evolvera-admin` noch nicht vorhanden; Account-Subdomain passt.
`npm run check:publication` erneut Exit 0. Kein externer Schreibaufruf.
[Vollständiger Umfang und Prüfgrenzen](operator-first-upload.md#lesende-vorprüfung-mit-dem-bereitgestellten-token).

Vorbereiteter nächster Auftrag: neuen `evolvera-admin` mit beiden geschützten GitHub-
App-Secrets, SQLite-Sitzungsspeicher und öffentlicher workers.dev-Route hochladen,
direkte Betreiberanmeldung aktivieren, danach Health/Rechtstexte lesend prüfen.
**Diesen Upload-/Aktivierungsauftrag noch nicht erteilt.** Galerie-Push und echte
Modusspeichertests mit möglichem Pages-Lauf sind ausgenommen. Keine neue Serie oder
Generierung; übrige Gates erhalten. Vor Upload Zielzustand frisch lesen.
Änderungen weiterhin lokal uncommittiert; kein Push/Deployment oder neue MCP-Rechte.
Token und GitHub-App-Secrets nie im Chat, Git, Logs oder lokalen Tests verwenden.
Die strukturelle Prüfung und die genannten echten lesenden Anbieteraufrufe sind
keine synthetischen Runtime-Tests und kein Login-Nachweis.

## Vorheriger Stand – Secret-Ablage bestätigt, Upload vorbereitet am 03.11.2026

Betreiber meldet „Die lokale Secret-Datei ist erstellt“. Ordner 0700, Datei 0600,
Eigentümer und erwartete JSON-/PKCS#8-Hüllenstruktur ohne Wertausgabe geprüft.
Keine echte Authentifizierung oder Verwendung der Secrets in lokalen Tests.
[Konkrete Upload-Vorlage, Tokenumfang und Prüfgrenzen](operator-first-upload.md).

Die separate Vorlage unter ignoriertem `work/operator-deploy/` ist synthetisch per
Worker-Dry-Run geprüft und sieht nach gesondertem Auftrag direkte Anmeldung am
Worker vor. Der versionierte Workerstandard ist weiterhin deaktiviert; Galerie-
Origin null. Noch kein Uploadtoken vorhanden oder externe Ressource angelegt.
Vorschlag für die erstmalige Anlage: befristeter account-owned Token, nur Zielkonto,
Workers-Produktrolle Admin; anschließend Editor nur auf dem angelegten Worker.
Vor Tokenanlage den Umfang zeigen, Tokenwert ausschließlich lokal unsichtbar eingeben.
Keine neue MCP-Berechtigung, kein breites Wrangler-OAuth oder Tarifwechsel.

Anbieterprüfung und frühere Tests bleiben erhalten. Keine Commits, Pushes,
Deployments, Generierung oder Serienaktivierung. Der nächste Betreiberauftrag
muss Tokenanlage und anschließend den konkreten Upload-/Aktivierungsumfang abdecken;
Modusspeichertest mit möglichem Pages-Lauf bleibt separat. PRD-Backup erhalten.

## Vorheriger Stand – lokale Anbieterprüfung am 03.11.2026

Nach Checkpoint `5afbe7b` Konto-/Vertragsprüfung auf Fortsetzungsauftrag abgeschlossen.
Betreiber bestätigt Workers Free per Screenshot, vorhandene Subdomain und direkte
GitHub-Anmeldung bei Cloudflare; keine Begrüßungsmail vorhanden. Abschnitt 6.1
persönlich gelesen und weitere Vorbereitung gewünscht. Die öffentlichen
Self-Serve-/DPA-/Datenschutztexte und der tatsächliche Datenfluss wurden erneut
geprüft. [Nachweise und Grenzen](provider-review.md).

`providerReviewedOn:2026-11-03` lokal dokumentiert; gemeinsame Datenschutzfassung
und Textversion unverändert. Keine vollständige persönliche DPA-Lektüre oder
historische Vertragsannahme aus der Rückmeldung abgeleitet. Die Betreiberfunktion
speichert kurzlebige Anmelde-/Sitzungsdaten; die gegenteilige Annahme des Betreibers
im Chat ausdrücklich korrigiert. Keine externe Einrichtung daraus abgeleitet.

Nächster abgegrenzter Schritt nach Sichtung: sicherer GitHub-App-Schlüssel-/Secret-Ablauf
gemäß [operator-secrets.md](operator-secrets.md), gesondert konkret beauftragen.
Keine neuen Schlüssel, Secrets, Cloudflare-Schreibrechte, Workerroute, Commits,
Pushes oder Deployments in diesem Prüfschritt. Galerie-Origin null, Worker aus,
Generierung aus, Startdatum null und Serienfreigabe false unverändert.
Öffentlicher Stand nicht neu geprüft oder verändert. Die folgenden Vermerke
beschreiben die früheren Prüfstände mit damals noch offener Anbieterprüfung.

Tatsächlich geprüft: `npm run check` mit **155 Tests**, Build und Worker-Dry-Run;
`npm run worker:test-runtime` lokal mit isoliertem Speicher/synthetischen Daten;
`npm run test:browser`: **66 bestanden, sechs bewusste Doppelaufruf-Skips**, sechs
Kunstreferenzen unverändert. `npm run check:publication` jetzt **Exit 0**.
Kein Abschwächen der Gates; negative Unit-/Runtime-Fälle bleiben erhalten.
Alle Änderungen dieses Prüfschritts uncommittiert. PRD-Backup bytegleich erhalten.

## Vorheriger Stand – lokaler Werkbuch-Checkpoint am 03.11.2026

Nach dem Wiedereinstieg wurde ein ausschließlich lokaler Werkbuch-Checkpoint
vorgeschlagen: bestehende Browsersuite am gebauten Stand ausführen, Dateiauswahl
sichten und lokal sichern. Der Betreiber hat diesen nächsten Schritt mit
„Mach weiter“ beauftragt. Dies erweitert den vorherigen reinen Bestandsauftrag
um die lokale Sicherung, nicht um Push, Veröffentlichung oder externe Einrichtung.
Die positive Designsichtung bleibt abgeschlossen; keine neue Designrunde.

- Ausgangsstand erneut geprüft: bestehendes Projekt, `main`, HEAD `8a324da`,
  drei lokale Commits vor dem bekannten `origin/main`, `origin` unverändert
  `https://github.com/bummber/evolvera.git`. Kein neuer Remoteabgleich.
- Die vorhandene Werkbuch-Umsetzung einschließlich Komponenten, CSS, lokalen
  Schriftpaketen/OFL-Lizenzen, Tests und Designdokumentation wird gezielt mit
  Commit-Titel `chore: checkpoint reviewed Werkbuch design locally` gesichert.
  Den resultierenden Hash mit `git log -1` lesen. Das PRD-Backup bleibt
  unversioniert und bytegleich; Build-, Browser- und Workerausgaben bleiben ignoriert.
  In diesem Checkpoint keine Produkt-, Kunst-, Daten- oder Konfigurationsänderung;
  nur der bestehende Stand und aktualisierte Übergabedokumentation.
- Node 24.21.0/npm 12.2.0. `npm run check` erneut vollständig erfolgreich:
  Format/Lint/Typen, **155 Tests**, Datenprüfung, Produktionsbuild und lokaler
  Worker-Dry-Run. Nach dem Build `npm run test:browser`: **66 bestanden, sechs
  bewusste Doppelaufruf-Skips**. Sechs unveränderte Kunstreferenzen bestanden;
  100 Seiten-/Breitenkombinationen bei 320/390/768/1024/1440 px ohne horizontalen
  Dokumentüberlauf, externe Requests oder `img/svg/canvas`. Tastatur/Fokus,
  lange Titel, Reduced Motion und Menügrenze erneut automatisiert geprüft.
  Keine neue manuelle Bildsichtung oder Designabnahme daraus ableiten.
- Worker-/Sitzungscode unverändert; kein separater `worker:test-runtime`-Lauf.
  Der bestehende Browserfall nutzte einen isolierten lokalen Worker mit
  temporärem Speicher und synthetischen Daten. Safari/Firefox, physische Geräte,
  echte Safe-Area und vollständige WCAG-Abnahme bleiben offen.
- `npm run check:publication` erneut erwarteter Exit 1, ausschließlich
  „Cloudflare-Vertrag und Kontoeinstellungen noch zu prüfen.“
  `providerReviewedOn:null`; Secrets, Worker-Bereitstellung und echte Anmeldung
  weiterhin offen. Keine externe Prüfung oder Einrichtung in diesem Schritt.
- Generierung `false`, Startdatum `null`, `seriesAuthorized:false`, Modus
  `traceable`, Revision 1 und offizielles Archiv leer. Kunstabnahme der 40
  Testwerke bleibt separat erhalten. Geschützte Kunst-/Archiv-/Daten-/Betreiber- und
  Konfigurationspfade sowie Referenzbilder gegenüber dem Ausgangs-HEAD unverändert.

Nächster Vorschlag nach gemeinsamer Sichtung des Checkpoints: die offene
Cloudflare-Vertrags-/Kontoprüfung als eigenen **lesenden** Auftrag abgrenzen
(tatsächlicher Vertragspartner, wirksame Bedingungen/DPA, Logging-Einstellungen).
Keine Vereinbarung annehmen, Rechte erweitern, Secrets erzeugen oder deployen.
Eine tatsächliche Durchsicht erst nach ihrem Nachweis dokumentieren; gegebenenfalls
Textversion und Textdurchsicht erneuern. Veröffentlichung und Betreiber-Einrichtung
bleiben eigene Aufträge. Ein Push auf `main` kann Pages starten.

## Vorheriger Wiedereinstieg nach positiver Designsichtung – 03.11.2026

Der Betreiber hat nach Abschluss von Paket 10 bestätigt: „Ich habe mir die Änderungen
angeschaut und sie sehen gut aus.“ Der lokale gestalterische Stand der **zehn
Werkbuch-Pakete ist damit positiv gesichtet**. Der anschließende Auftrag umfasst nur
die Statusdokumentation und einen Startprompt für einen neuen Chat im selben Projekt.
Keine weitere Gestaltung, Implementierung, Sicherungscommits oder Veröffentlichung
aus dieser Rückmeldung ableiten. Frühere Vorschläge zur gemeinsamen Designsichtung
in der folgenden Paketchronik sind durch diese Rückmeldung erledigt.

- Bestehender Ordner `/Users/abrocker/ai_o_projects/evolvera`, `main`, HEAD `8a324da`,
  `origin` `https://github.com/bummber/evolvera.git`. Drei lokale Commits seit dem
  bekannten `origin/main`; kein neuer Remoteabgleich. Sämtliche Designänderungen,
  Schriften, neuen Komponenten, CSS- und Testdateien liegen **uncommittiert** vor.
  Auch unversionierte Dateien erhalten; insbesondere PRD-Backup nicht aufnehmen
  oder formatieren. Dies ist eine dokumentierte Übergabe, kein neuer Git-Checkpoint.
- Letzter UI-Prüfstand aus Paket 10: **155 Tests** im Gesamtcheck; **66 Browserfälle
  bestanden, sechs bewusste Doppelaufruf-Skips**. 100 Seiten-/Breitenkombinationen
  bei 320/390/768/1024/1440 px ohne horizontalen Dokumentüberlauf, sechs unveränderte
  Kunstreferenzen. Details und Einschränkungen in [design-implementation.md](design-implementation.md#paket-10--feinschliff).
  Safari/Firefox, physische Geräte, echte Safe-Area und vollständige WCAG-Abnahme offen;
  Evolution zeigt bewusst das ausgewählte Werk mit bereits geladenen Eltern,
  kein vollständiges Gesamtarchiv-Geflecht.
- Generierung `false`, Startdatum `null`, `seriesAuthorized:false`, Modus `traceable`,
  Revision 1, offizielles Archiv leer. Die frühere Abnahme der 40 Testwerke bleibt
  unabhängig von der Designsichtung und Serienfreigabe erhalten.
- Öffentlicher Pages-Stand zuletzt dokumentiert `9ad1fa7`; das neue Werkbuch-Design
  ist ausschließlich lokal. GitHub App registriert/installiert; Secrets, Worker-
  Bereitstellung und echte Anmeldung weiterhin offen. Keine externe Einrichtung
  in diesem Dokumentationsschritt erneut geprüft.
- Textdurchsicht für die geplante Betreiber-Origin/Version bestätigt;
  `providerReviewedOn:null`. `npm run check:publication` jetzt erneut ausgeführt:
  erwarteter Exit 1, ausschließlich „Cloudflare-Vertrag und Kontoeinstellungen noch
  zu prüfen.“ Ein späterer Push auf `main` kann den vorhandenen Pages-Workflow starten;
  weder Push noch Secretbefehle oder Deployment sind aus diesem Stand freigegeben.
- In diesem Übergabeschritt nur Dokumentation geändert. `npm run check` mit 155 Tests,
  Build und Worker-Dry-Run erneut erfolgreich; Formatierung und `git diff --check`
  geprüft. Kein neuer Browser-/Worker-Runtime-Lauf, da UI/Routing und Worker unverändert.
  PRD-Backup weiterhin bytegleich; geschützte Kunst-/Daten-/Betreiberpfade unverändert.

[Kopierbarer Startprompt für den nächsten Chat](NEXT-START.md). Zunächst Bestand
prüfen und den nächsten abgegrenzten Schritt vorschlagen. Externe Voraussetzungen
und technische Restprüfungen getrennt benennen; aus der Designsichtung keine
Veröffentlichungs-, Anmelde- oder Serienfreigabe ableiten.

## Werkbuch-Designauftrag – 03.11.2026

Der anschließende ausdrückliche Designauftrag ersetzt die frühere Warteanweisung
unten: zehn Pakete planen, ausschließlich **Paket 1 (Tokens/lokale Schrift) und
2 (Preview-Leiste/Header/Desktopnavigation/Footer)** lokal umsetzen. Quelle eindeutig
`docs/design-system.md`, vollständig gelesen und nur mit Prettier formatiert.
[Umsetzungsstand, Schriftbegründung, Prüfungen und Folgeauftrag](design-implementation.md).
Die Schriftdatei wurde vor dem Einbau binär auf `wdth` 62–125 geprüft. Kunst,
Generatoren, Daten, Referenzbilder, Betreiberlogik und sämtliche Gates bleiben erhalten.
PRD-Backup unverändert und unversioniert; keine Commits, Pushes oder Deployments.
Vor **Paket 3 (mobiles Overlay und Dock)** den Stand gemeinsam sichten; kein weiterer
Designumfang aus diesem Vermerk ableiten. Externe Einrichtung weiterhin zurückgestellt.
Abschließend `npm run check` mit 149 Tests, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: 40 bestanden, sechs doppelte Aufrufe bewusst übersprungen.
100 Ansichten über alle fünf Breiten ohne horizontalen Überlauf; Kontaktbögen und
Footer gesichtet. Sechs Kunstreferenzen unverändert bestanden. Prüfgrenzen und
Testkorrekturen stehen im verlinkten Umsetzungsvermerk.

**Anschließender Folgeauftrag:** Nach gezeigtem Stand und vorgeschlagenem Auftrag
für Paket 3 antwortete der Betreiber „ok“. Darauf ausschließlich **Paket 3** lokal
fortgesetzt: dunkles natives Details-Overlay, Fokus-/Scrollbindung, Dock unter
1000 px mit erhaltenen Testsammlungslinks, Safe-Area und Platz unter dem Inhalt.
Generatoren, Kunst, Daten, Betreiberlogik und sämtliche Gates bleiben erhalten;
keine neuen Abhängigkeiten, Commits, Pushes oder Deployments. Prüfstand und
Grenzen im [Umsetzungsvermerk](design-implementation.md#paket-3--mobiles-overlay-und-dock).
Paket 3 abschließend geprüft: `npm run check` mit 149 Tests, Build und Worker-Dry-Run;
`npm run test:browser` mit **44 bestanden, sechs bewussten Doppelaufruf-Skips**.
Alle fünf Breiten ohne horizontalen Überlauf; Overlay/Dock und Kontaktbögen gesichtet,
sechs Kunstreferenzen unverändert. Safari/Firefox, echte Geräte/Safe-Area offen.
Vor Paket 4 gemeinsam sichten und neuen abgegrenzten Auftrag entgegennehmen.

**Paket 4 anschließend ausdrücklich lokal beauftragt:** gemeinsame Buttons/Links,
Infochips/Badges, native Felder und Leer-/Fehlerzustände nach Werkbuch 7.6–7.9/7.20.
Umsetzung in separatem Shell-Baustein-CSS und vorhandenen UI-Komponenten. Texte,
Routen, Bedienelemente und Betreiber-Sperre erhalten; keine Filterfunktion, keine
neuen Abhängigkeiten, keine Kunst-/Daten-/Renderer-/Konfigurationsänderung.
Prüfungen und Grenzen im [Umsetzungsvermerk](design-implementation.md#paket-4--gemeinsame-bausteine).
Paket 4 abgeschlossen: `npm run check` mit 149 Tests, Build und Worker-Dry-Run;
`npm run test:browser`: **46 bestanden, sechs bewusste Doppelaufruf-Skips**.
Alle fünf Breiten ohne horizontalen Überlauf, Kontaktbögen und Leer-/Fehlerzustände
gesichtet; sechs Kunstreferenzen unverändert. Grenzen wie Safari/Firefox und echte
Geräte weiter offen; keine vollständige WCAG-Abnahme behauptet.
Paket 5 erst nach gemeinsamer Sichtung und neuem Auftrag. Alles weiterhin lokal,
kein Commit, Push oder Deployment; Veröffentlichung und Seriengates unverändert.

**Paket 5 anschließend lokal fortgesetzt:** Nach „es geht und sieht gut aus“ und
„ok, leg los“ ausschließlich Heute und Bühnenrahmen umgesetzt. Mobile Bühne vor
dem Text, ab 1000 px rechts; CSS-Schnittmarken, Materialetikett und tatsächliche
Generation bei vorhandenen Werken. Bestehende Leertexte/Überschriften erhalten,
Serieninfo dunkel gestaltet. Kein Countdown, keine neue Funktion oder Abhängigkeit.
ArtStage, Kunst, Daten, Referenzbilder und Betreiberlogik unverändert. Details und
Evolution behalten ihren bisherigen Aufbau. Prüfstand und Grenzen im
[Umsetzungsvermerk](design-implementation.md#paket-5--heute-und-bühnenrahmen).
`npm run check` mit 149 Tests, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: **48 bestanden, sechs Doppelaufruf-Skips**. 100 Ansichten
über fünf Breiten ohne horizontalen Überlauf; Kontaktbögen und volle leere Heute-Seite
sowie Testwerk-Heroaufnahmen gesichtet. Alle sechs Kunstreferenzen unverändert.
Safari/Firefox, physische Geräte und echte Safe-Area bleiben offen.
Vor Paket 6 gemeinsam sichten: nächster abgegrenzter Auftrag ist Galerie und
Werkkarten, mit erhaltenen Such-/Seiten-/Sammlungs-URLs und ruhiger Kunst. Kein
neuer Filter. Alles weiterhin lokal, kein Commit, Push, Deployment oder Serienstart.

**Paket 6 danach mit „du kannst starten“ freigegeben:** Galerie und Werkkarten
lokal gestaltet. Zweispaltiger Desktopkopf, Linien am Zähler, erstes Werk der
jeweiligen Seite/Suche hervorgehoben, vier Desktopspalten und zwei versetzte mobile
Kartenspalten. Hochformatige Kartenrahmen zeigen die quadratische Kunst vollständig;
ArtRenderer unverändert. Suche, zwölf plus acht Werke, Pagination, Fehlerzustände,
Sammlungslinks und zugängliche Kartennamen erhalten. Keine zusätzliche Datenabfrage,
Filterfunktion oder neue Abhängigkeit. Prüfstand im
[Umsetzungsvermerk](design-implementation.md#paket-6--galerie-und-werkkarten).
`npm run check` mit 149 Tests, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: **50 bestanden, sechs Doppelaufruf-Skips**. Alle fünf
Breiten und volle Galerieaufnahmen gesichtet; 100 Ansichten ohne horizontalen
Überlauf. Sechs Kunstreferenzen unverändert. Safari/Firefox und echte Geräte offen.
Nächster Vorschlag nach gemeinsamer Sichtung: Paket 7, Werkdetail mit Herkunft,
Titel-DNA und Werkdaten aus vorhandenen Werten. Kein Paket 8, keine neue Funktion.
Alles weiterhin lokal, Serie aus; kein Commit, Push oder Deployment.

**Paket 7 danach mit „Du kannst starten“ freigegeben:** Werkdetail lokal gestaltet,
mobil Bühne zuerst, auf Desktop links; Eltern-Klammer aus tatsächlichen Referenzen,
Merkmalsbelege mit A/B und dekorativen Zielwertvorschauen, Titel-DNA nur aus
gespeicherten Fragmenten. Mehrdeutige/überlappende Fundstellen bleiben unmarkiert,
Legende bleibt. Neun Werkdatenfelder unverändert und standardmäßig offen.
Keine Teilenfunktion; ArtStage, Kunst, Daten und Betreiberlogik unverändert.
Heute und Evolution behalten ihre Darstellung; keine neuen Abhängigkeiten.
[Umsetzungsstand und Grenzen](design-implementation.md#paket-7--werkdetail-herkunft-und-werkdaten).
`npm run check`: **153 Tests**, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: **52 bestanden, sechs Doppelaufruf-Skips**. Sechs
Kunstreferenzen unverändert. Alle fünf Breiten ohne horizontalen Überlauf;
Kontaktbögen und zusätzliche ganze Detailaufnahmen gesichtet. Safari/Firefox,
physische Geräte und echte Safe-Area weiter offen.
Vor Paket 8 gemeinsam sichten: Vorschlag Evolution nach Werkbuch mit bestehender
Auswahl, tatsächlichen Beziehungen und Sammlungslinks. Kein Paket 9, keine neue
Funktion oder Generierung. Alles lokal, kein Commit, Push, Deployment oder Serienstart.

**Paket 8 danach mit „Bitte starte 8“ beauftragt:** Evolution lokal als vertikaler/
horizontaler Zopf des ausgewählten Werks mit seinen bereits geladenen Eltern.
Semantische Liste, CSS-Linien, ruhige echte Vorschauen, drei Desktopkarten und
erhaltene Auswahl/Belege/Metadaten/Nachfolger. A/B aus tatsächlichen Eltern-IDs;
abweichende Zuordnung der Werkbuch-Skizze nicht übernommen. Kein Gesamtarchiv-Laden
oder vorgetäuschter durchgehender Pfad zu den Ursprüngen. Ursprung 1/2 ohne Kanten;
Werkauswahl auch bei Ladefehler nutzbar. h1-Texte erhalten, ArtStage/Renderer unverändert.
[Umsetzung und Grenzen](design-implementation.md#paket-8--evolution).
`npm run check`: **155 Tests**, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: **56 bestanden, sechs Doppelaufruf-Skips**. Sechs
Kunstreferenzen unverändert, 100 Ansichten über fünf Breiten ohne horizontalen
Dokumentüberlauf. Kontaktbögen und ganze Evolutionsansichten gesichtet. Safari/Firefox,
echte Geräte und Gesamtarchiv-Geflecht offen. Keine neuen Abhängigkeiten oder
Änderungen an Kunst, Daten, Konfiguration oder Betreiberlogik. Alles lokal, kein
Commit, Push, Deployment oder Serienstart.
Nach gemeinsamer Sichtung nächster Vorschlag: Paket 9, Über und Einstellungen im
Rahmen bestehender Logik. Keine neue Anmeldung, Speicherfunktion oder Generierungsschalter.

**Paket 9 danach mit „bitte starte paket 9“ beauftragt:** Über-Seite mit fünf
Kapiteln, Hash-Router-Sprungmarken und rein erklärenden HTML/CSS-Diagrammen;
Originaltexte und Überschriften erhalten. Einstellungen als Status-/Zugangsansicht
mit zwei nativen gesperrten Moduskarten aus dem tatsächlichen Konfigurationswert.
Bestehende Auth-Bedingung und Betreiber-Sperre erhalten; keine Sitzung, Speicherung
oder Generierungsschalter. Keine neuen Abhängigkeiten, Kunst-/Daten-/Backendänderung.
[Umsetzung und Prüfgrenzen](design-implementation.md#paket-9--über-und-einstellungen).
`npm run check`: **155 Tests**, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: **60 bestanden, sechs Doppelaufruf-Skips**. Alle fünf
Breiten ohne horizontalen Überlauf, sechs Kunstreferenzen unverändert. Kontaktbögen
und ganze Informationsseiten auf Desktop/Mobil gesichtet. Sprungmarken mit Fokus,
Reload und gleichem Ziel geprüft; Moduskarten ändern beim Klick nichts. Safari/Firefox,
echte Geräte, Safe-Area und echte Betreiberanmeldung weiter offen.
Nach gemeinsamer Sichtung Paket 10 vorschlagen: Feinschliff der bestehenden Shell,
Tastatur/Fokus, Reduced Motion und Kontraste. Alles weiterhin lokal, kein Commit,
Push, Deployment oder Serienstart.

**Paket 10 mit „ok, mach den Feinschliff“ lokal beauftragt:** ausgeglichene
Informationsüberschriften und begrenzte automatische Worttrennung langer Werktitel.
Originaltexte, Titel-DNA und Kunst erhalten. Drei neue Browserfälle je Projekt
prüfen 30 Tastaturdurchläufe bis zum Footer über fünf Breiten, 15 lange Titelansichten,
Reduced Motion und die Menügrenze 999/1000 px. Kontrast-/Trefferflächenstichproben
ohne Befund im erfassten Umfang; kein vollständiges WCAG-Audit.
[Prüfungen, Zwischenstände und Grenzen](design-implementation.md#paket-10--feinschliff).
`npm run check`: **155 Tests**, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: **66 bestanden, sechs Doppelaufruf-Skips**. Alle fünf
Breiten ohne horizontalen Dokumentüberlauf; Kontaktbögen und lange Titel gesichtet.
Sechs Kunstreferenzen unverändert. Safari/Firefox, echte Geräte/Safe-Area, vollständige
WCAG-Abnahme und externe Betreiberprüfung bleiben offen. Keine neuen Abhängigkeiten
oder Änderungen an Kunst, Generatoren, Daten, Konfiguration oder Betreiberlogik.
Zehn Gestaltungspakete lokal umgesetzt; nächster Schritt ist gemeinsame Sichtung
und Designabnahme. Kein weiteres Paket automatisch starten, kein Commit, Push,
Deployment, Serienstart oder Generierung aus diesem Stand ableiten.

## Übergabe an den neuen Design-Chat – 03.11.2026 (vorheriger Stand)

**Aktueller Betreiberauftrag:** Den erreichten Stand sichern. Der Betreiber möchte
vor der nächsten Veröffentlichung das Design anpassen und gibt den konkreten
Designprompt in einem neuen Chat. **Jetzt keine Designänderung beginnen.**
Cloudflare-Vertragsprüfung, Secret-Anlage und Deployment sind vorerst nicht das
nächste Arbeitspaket; erst den neuen Designauftrag entgegennehmen und den Stand
gemeinsam sichten. Die bereits öffentliche Pages-Testversion bleibt auf `9ad1fa7`;
eine neue Veröffentlichung oder ein Serienstart ist nicht freigegeben.

Der gesamte in diesem Chat erarbeitete lokale Stand wird als Sicherungscommit
mit Titel `chore: checkpoint operator privacy work before design handoff` erhalten.
Er enthält App-Einrichtungsnachweis, Datenschutzvorbereitung/-gates, Tests und die
bestätigte Textdurchsicht. Kein Push. Vor der Sicherung: `main`, zwei lokale Commits
`5056ed7`/`d9f921b` vor `origin/main`; nach der Sicherung den neuen Commit zusätzlich
über `git log` prüfen. `origin` bleibt `https://github.com/bummber/evolvera.git`.

Für den neuen Chat maßgeblich:

- `AGENTS.md`, diese HANDOFF und `docs/PRD.md` v1.1 lesen. Der neue Designprompt
  bestimmt den Designumfang. Die frühere Auswahl Design A darf nicht als bereits
  erteilter Auftrag für die neue Gestaltung behandelt werden. EP-01 bleibt zurückgestellt.
- `docs/design-system.md` wurde während dieser Arbeit unversioniert vorgefunden,
  weder inhaltlich ausgewertet noch geändert oder als verbindliche Quelle übernommen.
  Es bleibt **außerhalb des Sicherungscommits**. Erst anhand des neuen Prompts klären,
  welche Rolle es spielen soll. `docs/PRD_v1.1_backup.md` ebenfalls unversioniert
  erhalten und bytegleich mit der PRD; nicht automatisch aufnehmen oder formatieren.
- Lokal enthält `config/legal.json` den vorbereiteten Scope `pages-and-operator`.
  Textdurchsicht für die ausgewählte Worker-Origin ist am 03.11. mit Version
  `2026-11-03.1` bestätigt. `providerReviewedOn:null` bleibt offen; Veröffentlichung
  und Worker-Anmeldung deshalb weiterhin gesperrt. Ändert der Designauftrag auch
  Datenschutztext oder Datenfluss, Version/Durchsicht entsprechend erneuern.
- GitHub App registriert und nur auf `bummber/evolvera` installiert. Noch keine
  Secrets, privaten Schlüssel, zusätzliche Cloudflare-Rechte oder Worker-Bereitstellung.
  Galerie-Origin null, `ADMIN_ORIGIN` leer, `ENABLED=false`. Serienstart null,
  Generierung aus, Serienfreigabe false, Modus `traceable`, Revision 1, Archiv leer.
- Kunst bleibt HTML/CSS. Generator-/Rendererhistorie, archivierte Daten und die
  abgenommenen 40 Testwerke erhalten. UI-Designänderungen dürfen alte Kunst nicht
  unbeabsichtigt verändern; bestehende sechs Kunstreferenzen nicht still ersetzen.
- Letzte Einzelprüfungen erfolgreich: Lint, Typen, **149 Tests**, Datenprüfung, Build,
  Worker-Dry-Run und **35 Browserfälle**, ein doppelter Worker-Aufruf bewusst übersprungen.
  Echter workerd-/SQLite-Lauf zuletzt im Datenschutzpaket erfolgreich. Der Gesamtcheck
  stoppt aktuell bereits bei Prettier an `docs/design-system.md`, beim Sichern erneut
  genauso ausgeführt. Formatprüfung dieser HANDOFF und `git diff --check` erfolgreich.
  `check:publication` stoppt nur an der offenen Cloudflare-Kontoprüfung.
  Für diese reine Sicherung keine neuen UI-/Worker-Laufzeitnachweise behaupten.
- Lokale Vorschauprozesse wurden auf 4173 (gebauter Galeriestand) und 8787
  (deaktivierter Worker) gestartet. Im neuen Chat Erreichbarkeit prüfen; Persistenz
  über den Chat-/App-Wechsel nicht voraussetzen. Bei Bedarf Projektbefehle verwenden.

## Öffentliche Vorschau und Git

- Live: https://bummber.github.io/evolvera/
- 40 getrennte Testwerke: https://bummber.github.io/evolvera/#/kunstpruefung
- Bestehender Ordner `/Users/abrocker/ai_o_projects/evolvera/`, Branch `main`,
  `origin` `https://github.com/bummber/evolvera.git`. Repository öffentlich.
- Veröffentlichter Commit: `9ad1fa797210680e4348e2da5c487c2b37037960`.
- [Normale GitHub-CI erfolgreich](https://github.com/bummber/evolvera/actions/runs/41524513299).
- [Erstes Pages-Deployment erfolgreich](https://github.com/bummber/evolvera/actions/runs/41524588435),
  inklusive Build, Tests, Upload, Prüfung des aktuellen Commits und Deploy.
- Pages-Quelle `workflow`, HTTPS erzwungen. `PAGES_DEPLOYMENT_ENABLED=true` gesetzt.
  Dadurch sind künftige freigegebene Pushes auf `main` auch Veröffentlichungsvorgänge.
  `EVOLVERA_AUTOMATION_ENABLED` nicht gesetzt, geplante Tagesläufe bleiben aus.
- Dokumentationsnachtrag `5056ed7` und die anschließende Einrichtungsvorbereitung
  werden nur lokal versioniert. Kein weiterer Push/Pages-Lauf beauftragt.
  Git und Umfang der lokalen Folgecommits vor dem Wiedereinstieg prüfen.
- Unversionierte `docs/PRD_v1.1_backup.md` ist identisch mit `docs/PRD.md` und wurde
  erhalten; nicht still in einen Commit aufnehmen.

## Betreiberentscheidungen und Quellen

Quelle bleibt `docs/PRD.md` v1.1; Root-v1.0 historisch. `AGENTS.md` beachten.
Design A ist ausgewählt. Die 40 bisherigen Testwerke beider Modi sind ausdrücklich
abgenommen; Versionen/Digests in `config/release.json` und `docs/art-review.md`.

Am 02.11. wurden nacheinander ausdrücklich freigegeben: erster privater Push samt
CI, öffentliche Repositorysichtbarkeit, dann Push der Impressums-/Datenschutzseiten
und erstes Pages-Testdeployment. Der letzte Auftrag umfasst die bestätigten Angaben
in `config/legal.json`. Deutschland, Kunst ohne Einnahmen; Kontaktdaten nicht aus
Profilen abgeleitet. `reviewedOn:2026-11-02`. Keine anwaltliche Rechtsprüfung behauptet;
Erreichbarkeit des neuen E-Mail-Postfachs nicht durch Testversand des Agenten geprüft.

Die neue PRD v1.2 aus dem anderen Ordner wurde ausschließlich ausgewertet. Das
abgeleitete [Erweiterungspaket EP-01](extensions/PRD-EP01.md) bleibt für später
vorgemerkt: höhere Varianz, Verläufe, Linien und Kurven. Nicht implementieren,
keine neue Serie und keine Neugenerierung alter Werke. Siehe `docs/future-series.md`.

## Verfügbarer Funktionsstand

Heute, Galerie mit Suche/Pagination, Werkdetails, Herkunft mit tatsächlichen Eltern
und Nachfolgern, Über-Seite, deaktivierter Betreiberzugang, Impressum und Datenschutz.
`#/kunstpruefung` zeigt 20 Werke je Modus; `#/atelier` und `#/evolutionslabor` bleiben.
Testdaten liegen separat, simulierte Januar-2000-Daten, nie offizielles Archiv.
Hash-Query `sammlung=traceable|free` wählt nur die Testsammlung, keine Konfiguration.
Kunst ausschließlich HTML/CSS, Hauptwerk mit Pause/reduzierter Bewegung, Kacheln statisch.
Bestehende Generatoren/Renderer, Daten und sechs Kunstreferenzen unverändert erhalten.

Worker lokal implementiert: GitHub-App-PKCE/State, feste numerische Betreiber-ID,
SQLite-Sitzung, CSRF/Origin, Logout, eingeschränkte Git-Modusspeicherung mit
SHA/Revision und Commitverifikation. Reale GitHub App inzwischen registriert und
installiert; noch keine Secrets oder Workerroute, kein echter Login-Nachweis.
Lokal ergänzte Worker-Routen `/privacy` und `/imprint` funktionieren auch deaktiviert
ohne Anmeldung. Die gemeinsame Datenschutzfassung wird ebenfalls in der Galerie
gerendert. Fehlende Durchsicht blockiert Pages-Publikation und direkte Worker-Anmeldung.

Tagesplaner/Git-Adapter lokal implementiert: Berliner 04:00-Zyklus, Nachholung,
Snapshot, unabhängige Ursprünge, ganze Historie prüfen, Originalbytes restaurieren,
atomarer Archivcommit und begrenzter Konflikt-Retry ohne Force-Push. Heute liest
bei Fokus/Rückkehr und in sichtbaren Tabs alle 60 Sekunden neu.

## Prüfstand der veröffentlichten Pages-Fassung vom 02.11.

Node 24.21.0, npm 12.2.0. Lokal `npm run check` mit **131 Tests**, Format, Lint,
Typen, Daten-/Vorschauprüfung, Build und Worker-Dry-Run erfolgreich.
`npm run test:browser`: **32 Fälle** Desktop/320px Chromium, bestehende sechs
Kunstreferenzen unverändert. `npm run check:publication` nach Freigabe erfolgreich.

Dieselben Prüfungen einschließlich echtem workerd-/SQLite-Laufzeittest auch auf
GitHub erfolgreich. Der Archiv-/Generierungsschritt wurde dort korrekt übersprungen.
Frühere reine Logiktests nutzen isolierte Git-Repositories und synthetische Secrets,
keine echten GitHub-Schreibzugriffe. 365 Testtage je Modus weiterhin enthalten.

Live zusätzlich ohne Anmeldung geprüft: HTTPS/HTTP 200, HTML und initiale JS-/CSS-
Assets bytegenau zum lokalen Build, `artworks/index.json` HTTP 200 mit richtigem
JSON-Typ und null Werken. Im Browser Startseite, Footer/Impressum/Datenschutz,
Testübersicht, nachvollziehbare Galerie und Werkdetails beider Modi samt Elternbelegen.
Bei gemessenen 320 CSS-Pixeln kein horizontaler Überlauf der geprüften Werkansicht,
keine `img`-/`svg`-/`canvas`-Knoten. Temporäre Browsergrößen zurückgesetzt.

GitHub meldet eine nicht blockierende Node-20-Abkündigung innerhalb der verschachtelten
Upload-Action; Lauf verwendet erzwungen Node 24 und ist erfolgreich. Runner-Image-Migration
ebenfalls nur Hinweis. Keine ungeprüfte Abhängigkeitsänderung vorgenommen.

## Weiterhin gesperrt und offen

`seriesAuthorized:false`, Startdatum `null`, Generierung `false`, Standard `traceable`,
Revision 1, offizieller Index leer. Betreiber-Origin `null`, Worker `ENABLED=false`.
Keine Cloudflare-Ressourcen oder Secrets eingerichtet. Keine Secrets in Frontend,
Git, Logs oder Chat; niemals im Chat anfordern.

Das Cloudflare-Konto wurde vom Betreiber selbst angelegt. Die erfolgreiche
MCP-Anmeldung verbindet Codex mit Cloudflare; sie ist **nicht** die spätere
GitHub-Betreiberanmeldung von Evolvera. Worker, App-Secrets und öffentliche
Worker-Origin sind weiterhin nicht eingerichtet. Workers Free und vorhandene
Account-Subdomain wurden am 03.11. lesend im Dashboard verifiziert; siehe unten.
2FA-Status weiterhin nicht geprüft.

Offen: echte Betreiberanmeldung und Modusspeicherung über GitHub/Cloudflare,
blockierte Drittanbieter-Cookies, reale Konflikt-/Sitzungstests, geplanter Tageslauf
und Nachholung nach späterer Aktivierung. Safari/Firefox, physische Smartphones und
GPU-/FPS-Profiling noch offen. Kein lokales `actionlint`. Keine vollständige Phase-4-
Cloud-Abnahme, kein Phase-5-Start. Erstes Pages-Deployment ist keine Serienfreigabe.

## Nächster abgegrenzter Schritt

Am 02.11.2026 wurde auf Folgeauftrag ausschließlich lokal die echte Betreiberanmeldung
vorbereitet. [Einrichtungsvorlage](operator-setup.md) enthält konkrete App-Felder,
Rechte, noch offene Kontowerte und getrennte Freigaben; der
[Datenschutzentwurf](operator-privacy-draft.md) dokumentiert Datenfluss, Cookies und
die noch erforderliche Ergänzung der öffentlichen Hinweise/Publikationsprüfung.
Runbook aktualisiert, bestehende Implementierung und sämtliche Konfiguration erhalten.
Die Vorbereitung wird auf Wunsch des Betreibers vor der Unterbrechung bis morgen
als weiterer lokaler Dokumentationscommit gesichert. `5056ed7` bleibt erhalten.
Kein Push oder Deployment; PRD-Backup nicht mitversionieren.

Lesend über GitHub-API bestätigt: Remote weiterhin `9ad1fa7`, Repository öffentlich,
Pages-Variable true, Tagesautomatisierungsvariable fehlt, `main` ungeschützt und keine
Rulesets. Betreiber `bummber` hat numerische ID `46008719`; bei Einrichtung gegen
das tatsächlich angemeldete Konto prüfen. Diese GitHub-Leseprüfung erfolgte vor
der späteren MCP-Einrichtung; keine neue Remoteprüfung beim Sichern behauptet.
Keine Secrets gelesen. PRD-Backup weiterhin unversioniert und bytegleich.

Erneut tatsächlich geprüft: `npm run check` mit 131 Tests, Build und Worker-Dry-Run;
`npm run worker:test-runtime` mit echtem lokalem workerd/SQLite;
`npm run check:publication` für den bisherigen Pages-only-Umfang. Alles erfolgreich.
`npm run generate:daily -- --dry-run`: 0 neue, 0 restaurierte, 0 offizielle Werke.
Der erste Check wurde beim lokalen tsx-Socket von der Sandbox gestoppt; Wiederholung
mit lokalen Prozessrechten erfolgreich. Kein neuer Browserlauf, da nur Dokumentation
geändert wurde; bisherige 32 Browserfälle sind der vorherige Nachweis.
Vor dem abendlichen Sicherungscommit nochmals `npm run check` erfolgreich ausgeführt;
kein neuer Browser- oder Worker-Sitzungslauf für die reinen Dokumentationsänderungen.

## Cloudflare-MCP und lokale Entwicklungswerkzeuge

Auf ausdrücklichen Folgeauftrag die
[offizielle Cloudflare-Agent-Anleitung](https://developers.cloudflare.com/agent-setup/prompt.md)
abgerufen und den Codex-Teil eingerichtet:

- 19 offizielle Skills aus `cloudflare/skills`, Quellcommit
  `1a33048817d06df12882cb881dfc754e7039954a`, unter
  `/Users/abrocker/.codex/skills/` installiert; vorhandene Skills erhalten.
- MCP `cloudflare` mit URL `https://mcp.cloudflare.com/mcp` in der persönlichen
  Codex-Konfiguration registriert. Bestehende MCP-Einträge unverändert.
- Nach Abbruch des standardmäßig zu breiten OAuth-Dialogs nur `offline_access`,
  `user:read`, `account:read` gewählt. Betreiber hat die Verbindung im Browser
  bestätigt. CLI meldete erfolgreichen OAuth-Abschluss; keine Tokens dokumentiert.
- Codex wurde anschließend vom Betreiber neu gestartet. Alle vier MCP-Werkzeuge
  tatsächlich erfolgreich geprüft: `whoami` erkennt eine Benutzeridentität,
  `execute` mit `GET /accounts` liefert Erfolg und genau ein Konto, `search` findet
  API-Endpunkte/Berechtigungen, `docs` liefert Dokumentationssuchergebnisse.
- Bei der anschließenden MCP-Funktionsprüfung keine Schreibaufrufe, Ressourcenerstellung,
  zusätzlichen Rechte, Tarifänderung oder Deployments. Die optionale `cf`-CLI wurde
  nicht installiert; Wrangler bleibt
  projektlokal gepinnt. Konto-/Profilkennungen, E-Mail und OAuth-Daten nicht ins Repo.

Die Skills/MCP-Konfiguration und OAuth-Anmeldedaten liegen außerhalb des
Projekt-Repositories und werden durch dessen Git-Commit nicht mitgesichert.
Ein MCP-Lesetest belegt weder den Workers-Free-Tarif noch Worker-Deploymentbereitschaft.

## Wiedereinstieg – 03.11.2026

Auf Auftrag anhand dieses Vermerks fortgesetzt. Git vor Änderungen geprüft: `main`
mit zwei lokalen Dokumentationscommits `5056ed7`/`d9f921b` vor `origin/main`, nur das
unversionierte PRD-Backup vorhanden und bytegleich erhalten. GitHub-API am 03.11.
erneut lesend geprüft: Remote bleibt `9ad1fa797210680e4348e2da5c487c2b37037960`;
angemeldetes Konto `bummber`, numerische ID `46008719`. Keine erneute Prüfung von
Pages-Variable, Branchschutz oder Rulesets in diesem Schritt behauptet.

MCP `GET /accounts` erneut erfolgreich, genau ein Konto. API-Schema nennt für
Abonnements Billing Read und für Subdomain Workers Scripts Read; diese Aufrufe
nicht ausgeführt und keine zusätzlichen Rechte angefordert. Stattdessen vorhandenes
Cloudflare-Dashboard lesend geöffnet: **Workers Free**, „Current plan“, 0 US-Dollar,
100.000 Requests/Tag, 10 ms CPU pro Aufruf. Vorhandene Account-Subdomain
`alexander-brocker.workers.dev`; Workers-&-Pages-Übersicht meldet keine Projekte.
Keine Konto-/Profilkennung oder E-Mail ins Projekt übernommen.

Der Betreiber hat für die Einrichtungsvorlage
`https://evolvera-admin.alexander-brocker.workers.dev` ausgewählt. Noch keine Worker-
Adresse eingerichtet oder Erreichbarkeit geprüft. `ADMIN_ORIGIN` bleibt leer,
Galerie-Origin null, `ENABLED=false`; alle Seriengates unverändert. Nur lokale
Dokumentation fortgeschrieben, kein Commit/Push, keine Secrets oder Deployments.
Die [Einrichtungsvorlage](operator-setup.md) enthält die aktualisierten Werte.

Am 03.11. tatsächlich neu geprüft: Node 24.21.0/npm 12.2.0, `npm run check`
erfolgreich mit 131 Tests, Format/Lint/Typen, Daten-/Vorschauprüfung, Build und
lokalem Worker-Dry-Run. Erster Sandboxlauf nach bestandenen Tests am tsx-Socket
blockiert, Wiederholung mit lokalen Prozessrechten erfolgreich. Kein neuer Browser-
oder Worker-Sitzungstest, da nur Dokumentation geändert wurde. PRD-Backup bytegleich,
keine offizielle Generierung und keine Änderung an Implementierung/Konfiguration.

## GitHub App – separat freigegeben und eingerichtet am 03.11.

Nach konkreter Vorlage ausdrücklich Registrierung und Installation freigegeben;
Secrets, Worker-Deployment und Push waren ausgenommen. GitHub verlangte Sudo-
Bestätigung, die der Betreiber selbst im Browser vorgenommen hat.

- App **Evolvera Betreiber bummber**, Slug `evolvera-betreiber-bummber`, Eigentümer
  `bummber`, Installierbarkeit **Only on this account**.
- App-ID `5595636`, Client-ID `Iv23liYblHBrFsNZZllG`, Installations-ID `178198041`.
  Diese Kennungen sind nicht geheim; nur dokumentiert, keine Worker-Konfiguration geändert.
- Homepage `https://bummber.github.io/evolvera/`; einziger Callback
  `https://evolvera-admin.alexander-brocker.workers.dev/auth/callback`, Wildcards aus.
- Webhooks aus, keine Events, Device Flow aus, OAuth während Installation aus,
  Setup URL leer; ablaufende User-Tokens bei Registrierung aktiviert gelassen.
- GitHub meldet erfolgreiche Installation auf `bummber`. Persistierte Installation
  zeigt **Only select repositories**, genau **`bummber/evolvera`** und ausschließlich
  **Contents read/write**, **Metadata read-only**. Keine App-Installation auf anderen
  Repositories; keine Administration-/Actions-/Workflows-/Pages-Rechte oder Bypässe.
- Kein privater Schlüssel und kein Client-Secret erzeugt, gelesen oder übertragen;
  GitHub ließ die Installation trotz vorherigem Hinweis auf den noch fehlenden
  privaten Schlüssel abschließen. Keine Authentifizierungs- oder Schreibprüfung.
- [App-Einstellungen](https://github.com/settings/apps/evolvera-betreiber-bummber),
  [Installation](https://github.com/settings/installations/178198041).

Contents gilt repositoryweit; der Worker begrenzt den Schreibpfad zusätzlich im Code.
Keine Cloudflare-Berechtigung erweitert, keine Anmeldung aktiviert, kein Deployment,
Push oder offizielles Werk. PRD-Backup erhalten. Nur lokale Dokumentation angepasst;
anschließend erneut `npm run check` mit 131 Tests, Daten-/Vorschauprüfung, Build
und Worker-Dry-Run erfolgreich. `git diff --check` erfolgreich, PRD-Backup weiterhin
bytegleich. Kein neuer App-Browserregressions- oder Worker-Sitzungslauf, da weder
UI/Routing noch Worker-/Sitzungscode geändert; GitHub-Einrichtung im Browser geprüft.

## Datenschutz lokal vorbereitet – weiterer Auftrag am 03.11.

Hinweise zu Anmeldung, Datenfluss, Cookies, Cloudflare/Empfängern, Speicherdauer,
Rechten und Rechtsgrundlagen lokal umgesetzt. Gemeinsamer Text in
`src/site/operator-privacy-content.ts`; eigene Durchsicht in neuer
`config/operator-privacy.json`, an die geplante Worker-Origin und Textversion
`2026-11-03.1` gebunden. Alle drei Nachweise waren zunächst null. Nach ausdrücklicher
Betreiberbestätigung ist `reviewedOn:2026-11-03`, `reviewedVersion:2026-11-03.1`
gesetzt; `providerReviewedOn` bleibt null. `config/legal.json` lokal auf
`privacyScope:pages-and-operator` vorbereitet;
bestätigter Kontakt und früheres Pages-Durchsichtsdatum unverändert erhalten.
Keine Durchsicht, Vertragsannahme oder Rechtsprüfung aus dem Auftrag abgeleitet.

Pages-Prüfung verlangt die neue Durchsicht und Cloudflare-Vertrags-/Kontoprüfung.
Auch bei vollständigen technischen Zugangswerten sperrt der Worker ohne passenden
Nachweis `/login`; `/health` liefert 503. Rechtstexte auf `/privacy` und `/imprint`
bleiben ohne Sitzung/Cookies und ohne GitHub-Aufruf erreichbar. Alle Worker-HTML-Seiten
verlinken sie. Eingesetzte Texte werden vor HTML-Ausgabe maskiert; Schemaauswertung
läuft in workerd ohne dynamischen JIT-Code. Kein erweiterter Git-Zugriff.

Tatsächlich geprüft: `npm run check` mit **149 Tests**, Format/Lint/Typen, Datenprüfung,
Build und Worker-Dry-Run erfolgreich. `npm run worker:test-runtime` mit lokalem
workerd/SQLite erfolgreich, einschließlich Rechtstextrouten und Datenschutzgate.
`npm run test:browser`: **35 bestanden, 1 bewusst übersprungen**. Der neue synthetische
Worker-Browserfall prüft Desktop und 320px gemeinsam; deshalb keine Verdopplung im
Mobilprojekt. Sechs bestehende Kunstreferenzen unverändert. Keine Cloud-Auth-Abnahme.
`npm run check:publication` erwartungsgemäß Exit 1 mit genau den zwei offenen Durchsichten.

Zusätzlich gebaute Galerie-Datenschutzfassung und deaktivierte Worker-Datenschutzseite
im lokalen Chrome geöffnet und sichtbar geprüft. Lokale Vorschauen zur Durchsicht:
`http://127.0.0.1:4173/evolvera/#/datenschutz` und `http://127.0.0.1:8787/privacy`.
Keine veröffentlichten URLs. Automatisierte Worker-Tests verwenden isolierten
temporären SQLite-Speicher und synthetische Zugangsdaten.

Der [vorbereitete Secret-Ablauf](operator-secrets.md) sieht später eine geschützte
JSON-Datei außerhalb des Repositories vor. Lokales Wrangler 4.154.0 bestätigt
`deploy --secrets-file` für einen gemeinsamen Code-/Secret-Upload; nur Hilfe/Anleitung
gelesen, kein Upload. Keine Schlüssel, Secrets, zusätzlichen Rechte, Commits, Pushes
oder Deployments; alle Seriengates, Archiv und Betreiberkonfiguration unverändert.
PRD-Backup bleibt unversioniert und bytegleich.

Die ausdrückliche Betreiberbestätigung lautet: „Ich bestätige die Textdurchsicht der
Datenschutzhinweise für die Betreiberanmeldung unter
evolvera-admin.alexander-brocker.workers.dev.“ Nur diese Textdurchsicht dokumentiert;
keine Anbieter-/Kontoprüfung, Vertragsannahme oder Veröffentlichung daraus abgeleitet.
Datenschutztext und Textversion selbst unverändert. Zusätzlich vorgefundene
unversionierte `docs/design-system.md` erhalten, nicht verändert oder mitversioniert.

Nach Textbestätigung erneut geprüft: `check:publication` Exit 1 ausschließlich wegen
offener Cloudflare-Vertrags-/Kontoprüfung. `npm run check` stoppt bei Prettier an der
neu vorgefundenen `docs/design-system.md`; deren Formatierung nicht ungefragt geändert.
Formatprüfung der eigenen geänderten Dateien und `git diff --check` erfolgreich.
Die übrigen Prüfungen separat erfolgreich: Lint, Typen, 149 Tests, Datenprüfung,
Build, Worker-Dry-Run und 35 Browserfälle (1 Doppelaufruf bewusst übersprungen).
Kein neuer Worker-Sitzungslauf, da nur Durchsichtsdaten/Dokumentation und die erwartete
verbleibende Browsermeldung geändert wurden. Keine zusätzliche Freigabe dokumentiert.

**Späterer Einrichtungsschritt nach dem nun gewünschten Designpaket:** Zum Cloudflare-Konto
gehörenden Vertragspartner, wirksame Bedingungen/DPA und Logging-Vorgaben konkret
prüfen; erst danach die Durchsicht dokumentieren. Sicherer Secret-Ablauf und konkretes
Deployment bleiben gesondert zu beauftragen. Bei Textänderungen Version/Durchsicht
erneuern. Das Runtimegate verhindert keine direkten Code-Uploads.
Cloudflare nennt für Worker-Neuanlage Workers-Admin auf Produktebene, für spätere
Updates genügt Worker-Editor. Keine zusätzlichen Rechte allein aus diesem Vermerk ableiten.

Die Textdurchsicht gilt für die gemeinsame Fassung in Galerie und Worker an der
genannten Origin. `check:publication` blockiert wegen der offenen Kontoprüfung weiterhin,
aber keinen direkten Worker-Code-Upload.
`wrangler secret put/delete` deployt unmittelbar; echte Moduscommits auf `main`
lösen Pages aus. Beides deshalb nur mit konkretem Auftrag. Eine deaktivierte
Bereitstellung/Healthprüfung ist noch kein Login-Nachweis. Echte Geräteprüfung der
öffentlichen Vorschau bleibt ebenfalls offen.

Kontoregistrierung, Sicherheitsberechtigungen und konkrete externe Einrichtung nicht
allein aus diesem Dokument ableiten. Serienstartdatum und Generierung bleiben eine
spätere eigenständige Entscheidung. EP-01 bleibt zurückgestellt.

## Wiedereinstieg

`AGENTS.md`, diesen Vermerk, `docs/PRD.md`, `docs/runbook.md`,
`docs/first-pages-deployment.md` und `docs/publication-preparation.md` lesen; Git prüfen.
Lokal `npm run dev`. `npm run generate:daily -- --dry-run` liest den Git-Commit,
ändert weder Dateien noch Remote. Historische Schäden niemals neu auswürfeln.
