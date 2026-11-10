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
- Archiv-Baseline (A-36) unter `tests/fixtures/archive-baseline/` und die
  Bilder `archive-*.png` schützen eingefrorene Werke: bestehende Einträge und
  Referenzen nie aktualisieren, nur gezielt um spätere Werke ergänzen.
- Im vorhandenen Projekt und mit `origin` bummber/evolvera arbeiten. Vor Änderungen
  Git-Zustand prüfen und vorhandene Arbeit erhalten. Kein Force-Push. Veröffentlichung,
  Sichtbarkeitsänderung und externe Einrichtung brauchen den passenden Betreiberauftrag.
- Kunst ausschließlich als HTML/CSS; keine SVGs, Canvas, WebGL oder Bilddateien.
  Generator, Titelgenerator, Renderer, Archiv, UI und Betreiberfunktion getrennt halten.
- Daten an Grenzen strikt validieren. Historische Werke/Renderer erhalten, niemals
  still überschreiben, migrieren oder neu auswürfeln. Schäden exakt aus Git beheben;
  bei unsicherem Stand Generierung und defekte Veröffentlichung stoppen.
- `traceable` ist Standard, `free` der zweite Modus. Nur Betreiber darf später den
  Modus speichern. Laufstart übernimmt einen unveränderlichen Snapshot; Änderungen
  wirken erst ab dem nächsten noch nicht begonnenen Lauf und ändern kein Archiv.
- Startdatum bleibt offen, Generierung aus. Vorschauen getrennt vom Archiv. Vor
  Serienfreigabe 30–50 Testwerke beider Modi ausdrücklich abnehmen lassen.
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
