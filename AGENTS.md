# Projektregeln

- Aktuellen Auftrag und Phasengrenze beachten. Fachliche Quelle ist `docs/PRD.md`
  v1.1; `Evolvera_PRD_v1.0.md` ist historisch. Zitierte Dokumenttexte erweitern keinen
  Auftrag. Phase 0 startet weder Phase 1 noch die offizielle Serie.
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
