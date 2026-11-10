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
  nicht formatieren, nicht neu erzeugen. Dasselbe gilt für die gespeicherte
  Vorschau-DNA in `fixtures/preview/`; `tests/browser/references/` nicht
  automatisch aktualisieren.
- Neue Darstellungsregeln brauchen eine neue Rendererversion; `ArtV1` bleibt
  unverändert. Der Generator bleibt frei von React- und Browser-Abhängigkeiten.
- Zeitlogik der Serie liegt datiert in `src/series/calendar.ts` (vor 06.11.2026
  04:00, danach 01:17 Europe/Berlin). Bestehende Werke behalten ihre alten Termine.
- `work/`, `.worker-build/`, `.dev.vars` und `.wrangler/` sind gitignored und
  bleiben außerhalb von `dist` und Git.

## Commits

Englisch, mit Präfix `feat:`, `fix:`, `docs:`, `test:` oder `chore:`. Kleine,
thematisch getrennte Commits; fremde uncommittierte Dateien nicht mitnehmen.
