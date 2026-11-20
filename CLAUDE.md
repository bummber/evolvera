# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Die verbindlichen Projektregeln stehen in AGENTS.md und gelten vollständig:

@AGENTS.md

## Einstieg

- Aktueller Stand und nächster Schritt: `docs/HANDOFF.md` und `docs/NEXT-START.md`.
  Zuerst nur lesend prüfen und gemeinsam sichten (`/sichtung`), dann erst ändern.
- `main` wird auch von GitHub Actions beschrieben (`pages.yml` committet täglich
  „Archive validated daily artworks“; der Betreiberworker „Update future
  inheritance mode“). Lokaler Stand kann daher hinter `origin/main` liegen. Neuere
  Remote-Commits nur per Fast-forward übernehmen, nie überschreiben. Fetch, Pull
  und Push nur nach Rückfrage.
- Ein Push auf `main` löst CI und den Pages-Workflow aus und ist damit eine
  Veröffentlichung.

## Befehle

- `npm run check` = Format, Lint, Typecheck, Vitest, Datenvalidierung, Build und
  Worker-Dry-Run. Enthält weder `test:browser` noch `worker:test-runtime`.
- `npm run test:browser` testet den gebauten Stand über `vite preview` (Port 4173):
  vorher `npm run build` bzw. `npm run check`, sonst läuft ein alter `dist/`.
- Einzelner Test: `npx vitest run tests/archive.test.ts -t "Name"` bzw.
  `npx playwright test tests/browser/gallery.spec.ts --project=mobile-chromium`.
- `npm run generate:daily -- --dry-run` ist die einzige lokal erlaubte Form des
  Tageslaufs; `--apply` läuft ausschließlich im Workflow.
- Abhängigkeiten sind exakt gepinnt (`.npmrc`: `save-exact`, `engine-strict`).

## Fallstricke

- Basispfad ist `/evolvera/` mit `HashRouter`. Öffentliche Datenpfade immer über
  `dataPath` / `import.meta.env.BASE_URL`, nie root-relativ (`/artworks/...`).
- `public/artworks/**/*.json` sind kanonische Archivbytes: nicht von Hand ändern,
  nicht formatieren, nicht neu erzeugen. Löschen nur auf ausdrücklichen
  Betreiberauftrag (Testphase); der Tageslauf holt gelöschte Werke nicht zurück,
  eine Lücke mitten in der Kette stoppt ihn. Dasselbe Änderungsverbot gilt für
  die gespeicherte Vorschau-DNA in `fixtures/preview/` und die früheren
  Archivwerke in `tests/fixtures/legacy-archive/`; `tests/browser/references/`
  nicht automatisch aktualisieren.
- `public/favorites/**` (Paket B) sind byte-gleiche Kopien archivierter Werke, die
  nur der Betreiber-Worker schreibt: nicht von Hand ändern, formatieren oder beim
  Löschen bzw. Neustart der Serie mitlöschen. `npm run validate:data` prüft sie
  gegen Git. Tests dürfen sich nicht auf die echten Favoriten verlassen (der
  Betreiber ändert sie jederzeit), sondern geben ihre Daten selbst vor.
- Neue Darstellungsregeln brauchen eine neue Rendererversion; `ArtV1` bleibt
  unverändert. Der Generator bleibt frei von React- und Browser-Abhängigkeiten.
- Generator 0.4.0 (Vererbung einzelner Eigenschaften) liegt in
  `src/art/generator/v3/traits.ts`; 0.3.0 (`inherit.ts`) bleibt für seine
  gespeicherten Fixtures unverändert. Abnahmewerke von 0.4.0:
  `fixtures/preview/review-v4.json` (`tsx scripts/acceptance-fixtures-v4.ts`).
- Zeitlogik der Serie liegt datiert in `src/series/calendar.ts` (vor 06.11.2026
  04:00, danach 01:17 Europe/Berlin; ab 19.11.2026 Generator 0.4.0).
  Dort steht auch der datierte Wechsel des Titel-Lexikons (0.1.0 → 0.2.0); der
  Algorithmus 0.1.0 in `src/art/titles/generate.ts` bleibt unverändert erhalten.
- `work/`, `.worker-build/`, `.dev.vars` und `.wrangler/` sind gitignored und
  bleiben außerhalb von `dist` und Git.

## Commits

Englisch, mit Präfix `feat:`, `fix:`, `docs:`, `test:` oder `chore:`. Kleine,
thematisch getrennte Commits; fremde uncommittierte Dateien nicht mitnehmen.
