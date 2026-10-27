# Evolvera – Übergabe für die nächste Sitzung

Stand: 27.10.2026. Diese Notiz dient dem Wiedereinstieg und erteilt keine Freigabe
für eine weitere Phase oder Veröffentlichung. Aktueller Nutzerauftrag hat Vorrang.

## Projekt und Ausgangspunkt

- Projektordner: `/Users/abrocker/ai_o_projects/evolvera/`.
- Vorhandenes Remote: `https://github.com/bummber/evolvera.git`, zuletzt privat und
  leer geprüft. Kein Push, kein Deployment und keine externe Registrierung erfolgt.
- Phase 0 ist lokal als Commit `59d05ed` umgesetzt. Diese Übergabenotiz wird in einem
  separaten Dokumentationscommit ergänzt. Zu Beginn den aktuellen Git-Stand prüfen.
- Fachliche Quelle: `docs/PRD.md`, Version 1.1. Die erhaltene Rootdatei v1.0 ist
  historisch. Projektregeln stehen in `AGENTS.md`.

## Was lokal vorliegt

React/Vite/TypeScript-Grundgerüst mit mobile-first Layout, Hash-Routing für Heute,
Galerie, Evolution, Werkdetails, Über Evolvera und Einstellungen. Projektbasis ist
`/evolvera/`. Versionierte Zod-Schemata für Werke, konkrete Herkunftsbelege und
Konfiguration; getrennte Modulverträge für Generator, Titel und Renderer.
Architektur der späteren Betreiberfunktion ist dokumentiert, nicht implementiert.

Node 24.21.0, npm-Lockfile, Lint, Formatierung, Typprüfung, Tests und vorbereitete,
gegen Veröffentlichung gesperrte Pages-Konfiguration sind vorhanden.

## Tatsächliche Prüfungen

Installation, Devserver, Produktionsbuild und `npm run check` erfolgreich;
39 Vitest-Tests bestanden. Im integrierten Browser sind Navigation, Direktlinks,
Tastaturzugang und die Darstellung bei 320 CSS-Pixeln geprüft.

`npm run test:browser` wurde versucht, aber die sechs Playwright-Fälle wurden beim
Chromium-Start von der macOS-Sandbox blockiert. Kein erfolgreicher automatischer
Browserlauf und keine ausgeführte Remote-CI. Details: `docs/phase-0-results.md`.
Die lokalen Prüfserver wurden am Sitzungsende beendet.

## Weiterhin geltende Grenzen

- `seriesStartDate: null`, `generationEnabled: false`, Standardmodus `traceable`,
  Einstellungsrevision 1, offizielles Archiv leer.
- Keine vollständige Kunstgenerierung, kein Renderer, keine Evolution, keine echte
  Anmeldung und keine tägliche Automatisierung implementiert. Phase 1 nicht begonnen.
- Kunst ausschließlich HTML/CSS, ohne SVG, Canvas, WebGL oder Bilddateien.
- Bestehende Werke erhalten; Einstellungen wirken nur auf den nächsten noch nicht
  begonnenen Lauf. Keine Geheimnisse ins Frontend oder in den Chat.
- Vor Serienstart 30–50 getrennte Testwerke beider Modi ausdrücklich abnehmen lassen.
- Push, öffentliche Sichtbarkeit, Pages-Veröffentlichung und Cloudflare-/GitHub-App-
  Einrichtung sind weiterhin separat freizugebende spätere Schritte.

## Nächster abgegrenzter Auftrag

Zuerst die lokale Phase-0-Vorschau gemeinsam mit dem Betreiber sichten und die
blockierten Browserfälle in einer geeigneten Umgebung nachprüfen. Noch keine
weitere Phase, keinen Push und keine Veröffentlichung automatisch starten.

Zum Wiedereinstieg:

1. `AGENTS.md`, diese Notiz, `docs/PRD.md`, `docs/architecture.md` und
   `docs/phase-0-results.md` lesen; Dateien und Git-Stand erneut prüfen.
2. Node-Version gemäß `.nvmrc` verwenden. Falls Abhängigkeiten fehlen:
   `npm ci` (bei Cache-Sandboxproblemen `npm ci --cache /tmp/evolvera-npm-cache`).
3. Für die gemeinsame Sichtung `npm run dev` starten und die ausgegebene Adresse
   unter `/evolvera/` öffnen. Aktuelle Ergebnisse von früheren Prüfungen unterscheiden.
4. Nach der Sichtung über den separat freizugebenden nächsten Schritt entscheiden.
   Ein öffentliches Shell-Testdeployment startet keine offizielle Kunstserie.

Späteres Phase-1-Paket: PRNG, mindestens drei Kunstfamilien und versionierter
HTML-/CSS-Renderer mit reproduzierbarem Ruhezustand, getrennt vom offiziellen Archiv.
Das ist eine Vorschau auf den späteren Umfang, kein aktueller Implementierungsauftrag.

## Startnachricht für einen neuen Chat

> Wir setzen Evolvera im vorhandenen Ordner
> `/Users/abrocker/ai_o_projects/evolvera/` fort. Lies zuerst `AGENTS.md`,
> `docs/HANDOFF.md`, `docs/PRD.md`, `docs/architecture.md` und
> `docs/phase-0-results.md`. Prüfe den aktuellen Git-Stand. Heute möchte ich zunächst
> Phase 0 gemeinsam sichten und die offenen Browserprüfungen klären. Starte dafür
> die lokale Vorschau. Beginne Phase 1 noch nicht; nichts pushen, veröffentlichen,
> an der Repositorysichtbarkeit ändern oder offiziell generieren.
