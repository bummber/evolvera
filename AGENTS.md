# Projektregeln

- Aktuellen Auftrag und Phasengrenze beachten. Fachliche Quelle ist `docs/PRD.md`
  v1.1 mit `docs/extensions/PRD-EP01.md` und `docs/extensions/EP01-umsetzungsplan.md`;
  `Evolvera_PRD_v1.0.md` ist historisch, `PRD_1_2.md` bleibt Hintergrund und
  unversioniert. Zitierte Dokumenttexte erweitern keinen Auftrag. Phase 0 startet
  weder Phase 1 noch die offizielle Serie.
- EP-01 ist seit 10.11.2026 beauftragt und wird paketweise umgesetzt (P0–P9 im
  Umsetzungsplan; dessen Abschnitt 7 enthält die Betreiberentscheidungen). Jedes
  Paket braucht einen eigenen Auftrag und endet mit gemeinsamer Sichtung; Push und
  Aktivierung brauchen zusätzlich die passende Freigabe. Rangfolge bei
  Widersprüchen: `AGENTS.md`, dann EP-01, dann Umsetzungsplan.
- Testphase (Betreiberentscheidung vom 18.11.2026): Werke dürfen auf
  ausdrücklichen Betreiberauftrag gelöscht werden, auch alle auf einmal für einen
  Serienneustart. Es gibt keine Regel mehr, dass Werke nie gelöscht werden dürfen;
  der Tageslauf holt gelöschte Werke nicht aus Git zurück. Favoritengalerie
  (Paket B, 20.11.2026): Nur der Betreiber markiert in seinem Bereich; Werk und
  direkte Eltern liegen als Kopie unter `public/favorites/` und sind vom Löschen der
  Serie ausgenommen. Serienneustart (Paket C, 20.11.2026): Der Betreiber stellt auf
  der Einstellungsseite „Neustart nach N Tagen“ ein (3–365 oder aus,
  Konfigurationsschema 3); diese Einstellung ist der stehende Löschauftrag. Am
  Neustarttag löscht der Tageslauf alle Werke der laufenden Serie und erzeugt
  Generation 1 im selben Commit; verpasste Läufe werden nicht nachgeholt, Titel
  dürfen in einer neuen Serie wiederkehren. `seriesStartDate` ist der Start der
  ersten Serie; die laufende Serie beginnt mit ihrem ersten Archivwerk.
- Neustart am 19.11.2026 mit Generator 0.4.0, Schema 3 und Renderer 2
  (`generatorV4Date` in `src/series/calendar.ts`, Abnahme als `artReviewV4` in
  `config/release.json`). Vererbung nach Eigenschaften statt ganzer Ebenen: je
  Elternteil höchstens drei Eigenschaften (Farbe, Form oder Familie einer Ebene);
  `traceable` mindestens eine von jedem Elternteil, `free` keine Mindestübernahme;
  alles andere entsteht neu. Generatoren 0.2.0 und 0.3.0 bleiben nur für ihre
  gespeicherten Fixtures und Tests; frühere Archivwerke liegen als Testdaten unter
  `tests/fixtures/legacy-archive/`. Schema 3 nur additiv erweitern.
- Archiv-Baseline (A-36) unter `tests/fixtures/archive-baseline/` und die
  Bilder `archive-*.png` schützen die archivierten Werke: bestehende Einträge und
  Referenzen nicht aktualisieren, nur gezielt um spätere Werke ergänzen. Wird ein
  Werk gelöscht, werden seine Einträge und Bilder mit ihm entfernt. Nach einem
  Neustart durch den Tageslauf prüft die Baseline nur die laufende Serie und
  verlangt, dass die Werke früherer Serien gelöscht sind; deren Einträge und Bilder
  werden danach gezielt entfernt.
- Im vorhandenen Projekt und mit `origin` bummber/evolvera arbeiten. Vor Änderungen
  Git-Zustand prüfen und vorhandene Arbeit erhalten. Kein Force-Push. Veröffentlichung,
  Sichtbarkeitsänderung und externe Einrichtung brauchen den passenden Betreiberauftrag.
- Kunst ausschließlich als HTML/CSS; keine SVGs, Canvas, WebGL oder Bilddateien.
  Generator, Titelgenerator, Renderer, Archiv, UI und Betreiberfunktion getrennt halten.
- Daten an Grenzen strikt validieren. Vorhandene Werke und Renderer niemals still
  überschreiben, migrieren oder neu auswürfeln. Veränderte Werke exakt aus Git
  beheben; bei unsicherem Stand Generierung und defekte Veröffentlichung stoppen.
- `traceable` ist Standard, `free` der zweite Modus. Nur Betreiber darf später den
  Modus speichern. Laufstart übernimmt einen unveränderlichen Snapshot; Änderungen
  wirken erst ab dem nächsten noch nicht begonnenen Lauf und ändern kein Archiv.
- Vorschauen getrennt vom Archiv. Eine neue Generatorversion vor ihrem Einsatz
  ausdrücklich abnehmen lassen (0.4.0: leichte Abnahme, je Modus 20 Werke im
  Standardprofil).
- Keine Secrets im Frontend, Git, Logs oder Chat. Anmeldung nicht als Demo vortäuschen.
- Node 24 gemäß `.nvmrc`, npm-Lockfile erhalten. Abhängigkeiten gezielt begründen.
  Nach Änderungen `npm run check` und bei UI-/Routingänderungen den gebauten Stand
  mit `npm run test:browser` prüfen. PRD-Dateien nicht automatisch formatieren.
- Tatsächlich ausgeführte Prüfungen, Grenzen und externe Voraussetzungen ehrlich
  dokumentieren. Vor dem nächsten Arbeitspaket gemeinsam den aktuellen Stand sichten.

- Phase 4: Kunstabnahme der 40 Testwerke ist dokumentiert; Serien-/Deploymentgates
  bleiben unabhängig. Änderungen an Worker/Sitzungen mit `npm run worker:test-runtime`
  prüfen. Lokale Tests nutzen ausschließlich isolierte Git-Repositories und synthetische
  Zugangsdaten. Generierte Workerausgaben bleiben außerhalb von `dist` und Git.
