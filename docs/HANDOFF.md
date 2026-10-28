# Evolvera – aktueller Übergabestand

Stand: 28.10.2026. Aktueller Betreiberauftrag hat Vorrang. Diese Notiz ist keine
Freigabe für weitere Phasen, Veröffentlichung oder offizielle Generierung.

## Projekt und Entscheidungen

- Projektordner `/Users/abrocker/ai_o_projects/evolvera/`, Branch `main`.
- Bestehendes Remote `https://github.com/bummber/evolvera.git`; zuletzt privat und
  leer geprüft. Nichts gepusht oder veröffentlicht; vor Änderungen erneut prüfen.
- Fachliche Quelle: `docs/PRD.md` v1.1, unverändert übernommen. Rootdatei v1.0 ist
  historisch. Verbindliche Projektregeln stehen in `AGENTS.md`.
- Phase 0 lokal implementiert (`59d05ed`), Übergabe (`45d8486`). Nach gemeinsamer
  Sichtung wurde Richtung A gewählt und übernommen (`b1a6750`): Kunstmagazin,
  Papiergrund, große Grotesktypografie, Zinnoberrot und mobiles Aufklappmenü.
- Anschließend bat der Betreiber um Weiterarbeit. Das nächste lokale Arbeitspaket,
  Phase 1 gemäß PRD, wurde umgesetzt. Phase 2 ist noch nicht begonnen.

## Jetzt vorhanden

Öffentliche Shell: Heute, Galerie, Evolution, Werkdetails, Über und Einstellungen;
Hash-Routing mit Basis `/evolvera/`. Weiterhin leerer offizieller Index und ehrliche
Leer-/Fehlerzustände, keine echte Anmeldung.

Neu in Phase 1: `#/atelier` mit zwölf getrennt gespeicherten unabhängigen Studien
in drei Familien (Geometrie, Farbfeld, Mosaik), Seed-Eingabe, deterministischem
PRNG und Renderer V1. Nur HTML/CSS, gemeinsame 1000er-Kunstfläche, maximal 50 Formen,
feste Ruhevorschauen, Animation nur im Hauptwerk mit Pause und Reduced-Motion-
Berücksichtigung. Das Atelier zählt noch nicht zur Kunstabnahme beider Modi.

Preview-DNA liegt in `fixtures/preview/phase-1.json`, niemals in `public/artworks`.
Generator, Renderer, Titelvertrag, Archiv, UI und Betreiberfunktion bleiben getrennt.
Details und tatsächliche Ergebnisse: `docs/phase-1-results.md`. Die Phase-0- und
Designberichte sind historische Zwischenstände, keine aktuellen Einschränkungen.

## Aktuelle Prüfung

`npm run check` erfolgreich mit 55 Tests, Lint, Typprüfung, Format, Daten-/Fixture-
Validierung und Build. 14 Playwright-Fälle erfolgreich (Desktop/Mobil), einschließlich
sechs gesichteter Rendererreferenzen. Breiter Generatortest mit 300 Seed-/Familien-
Kombinationen. Chromium wurde mit freigegebenem Browserstart außerhalb der Sandbox
geprüft; die alte Blockade vom 27.10.2026 ist für diesen Stand aufgehoben.

Linux-Remote-CI, Safari/Firefox, echte mobile Geräte und GPU-/FPS-Profiling sind noch
nicht geprüft. Keine echte Betreiberanmeldung, kein Hosting-/Cloudflare-Ende-zu-Ende-Test.

## Unverändert gesperrt

Startdatum `null`, `generationEnabled: false`, Standard `traceable`, Revision 1,
offizielles Archiv leer. Keine Evolution, keine generierten poetischen Titel, kein
Scheduler oder offizieller Generierungsbefehl. Keine Geheimnisse ins Frontend/Chat.
Historische Werke niemals still neu generieren oder überschreiben.

Push, öffentliche Repositorysichtbarkeit, Pages, Cloudflare, GitHub App und
serverseitige Secrets bleiben spätere externe Schritte. Die offizielle Serie darf
erst nach ausdrücklicher Abnahme von 30–50 getrennten Testwerken beider Modi und
bewusster Festlegung des Startdatums aktiviert werden.

## Nächster abgegrenzter Schritt

Testatelier gemeinsam sichten. Danach Phase 2 getrennt beauftragen: unabhängige
Ursprungswerke, anschließende Evolution aus zwei unmittelbaren Eltern, beide Modi,
belegbare Vererbungsentscheidungen und deterministische poetische Titel.

Zum Wiedereinstieg zuerst `AGENTS.md`, diese Notiz, `docs/PRD.md`,
`docs/phase-1-results.md` und `docs/architecture.md` lesen. Aktuellen Git-Stand prüfen,
Node 24 gemäß `.nvmrc` verwenden. Bei fehlenden Abhängigkeiten `npm ci`; bei
Cache-Sandboxproblemen `npm ci --cache /tmp/evolvera-npm-cache`.
`npm run dev` startet normalerweise unter `http://127.0.0.1:5173/evolvera/`.
Das Atelier liegt unter `http://127.0.0.1:5173/evolvera/#/atelier`.

## Kopierbare Startnachricht

> Wir setzen Evolvera im vorhandenen Projektordner fort. Lies `AGENTS.md`,
> `docs/HANDOFF.md`, `docs/PRD.md` und `docs/phase-1-results.md`. Prüfe den aktuellen
> Git-Stand und starte das lokale Testatelier. Wir sehen uns zuerst Phase 1 an.
> Phase 2 noch nicht beginnen; nichts pushen, veröffentlichen oder offiziell generieren.
