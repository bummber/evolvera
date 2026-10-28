# Evolvera – aktueller Übergabestand

Stand: 28.10.2026. Aktueller Betreiberauftrag hat Vorrang. Diese Notiz erteilt keine
Freigabe für weitere Phasen, Veröffentlichung oder offizielle Generierung.

## Projekt und bisherige Entscheidungen

- `/Users/abrocker/ai_o_projects/evolvera/`, Branch `main`, bestehendes `origin`
  `https://github.com/bummber/evolvera.git`. Remote zuletzt privat/leer geprüft;
  bisher kein Push oder Deployment. Aktuellen Git-Stand vor Änderungen erneut prüfen.
- Quelle der fachlichen Anforderungen: `docs/PRD.md` v1.1, unverändert übernommen.
  Rootdatei v1.0 ist historisch; Projektregeln in `AGENTS.md` beachten.
- Phase 0 (`59d05ed`), Übergabe (`45d8486`), gewählte/übernommene Designrichtung A
  (`b1a6750`): Kunstmagazin, Papiergrund, große Grotesk, Zinnoberrot und mobiles Menü.
- Phase 1 (`0fcd7c8`): drei unabhängige Familien und Renderer V1.
- Nach positiver Sichtung bat der Betreiber um Weiterarbeit: Phase 2 ist lokal
  umgesetzt, Phase 3 noch nicht begonnen. Keine formale Kunstabnahme erfolgt.

## Jetzt vorhanden

Öffentliche Shell mit Heute, Galerie, Evolution, Werkdetails, Über und Einstellungen;
Hash-Basis `/evolvera/`, ehrliche offizielle Leerzustände und deaktivierte Anmeldung.

`#/atelier`: zwölf gespeicherte unabhängige Phase-1-Studien, eigene Seeds, drei
Familien (Geometrie, Farbfeld, Mosaik), Renderer V1 und Wiedergabesteuerung.

`#/evolutionslabor`: je zehn gespeicherte Beispielwerke für `traceable` und `free`,
Generation 1/2 unabhängig, danach zwei unmittelbare Eltern. Titelgenerator,
Quell-/Zielbelege und Rezeptreplay implementiert. Die Datumswerte 01.–10.01.2000 sind
simulierte Testmetadaten. Beispielmodus-Auswahl ändert keine Betreiberkonfiguration.

Reiner Evolutionskern 0.2.0, Werkschema 2, Lexikon 0.1.0. V1-Werkschema, Generator
0.1.0, Renderer V1, Phase-1-Referenzen und Original-PRD bleiben erhalten. Keine
Bilddateien/SVG/Canvas/WebGL als Kunst. Neues Farbspektrum statt Bindung an die
Phase-1-Beispielpaletten. Sichtbare Mindestbeiträge sind konservativ freigestellte,
prüfbare Farb-/Breitenmerkmale; ihre Ästhetik muss gemeinsam beurteilt werden.

Alle Vorschauen liegen in `fixtures/preview`, niemals im offiziellen Archiv.
Endparameter und Titel sind gespeichert. Generator, Titelgenerator, Renderer,
Archiv, UI und Betreiberfunktion bleiben getrennt. Details: `docs/phase-2-results.md`
und `docs/architecture.md`. Frühere Berichte sind historische Zwischenstände.

## Aktuelle Prüfungen

`npm run check` erfolgreich: Format, Lint, Typen, **71 Tests**, Prüfung der leeren
Serie, deterministischer Vergleich von 12 unabhängigen und 20 Evolutionsvorschauen,
Build. Langzeittests mit je 365 Testtagen pro Modus (730 Werke) inklusive beider
Zeitumstellungen. **16 Playwright-Fälle** auf Desktop/Mobil erfolgreich, einschließlich
sechs unveränderter Renderer-Screenshotreferenzen und neuer Eltern-/Modusnavigation.
Browserstart erfolgt mit Freigabe außerhalb der Sandbox. Alte Blockaden vom
27.10.2026 sind für diese erfolgreichen Läufe aufgehoben.

Linux-Remote-CI, Safari/Firefox, physische mobile Geräte und GPU-/FPS-Profiling sind
noch nicht geprüft. Keine Auth-/Hosting-Ende-zu-Ende-Tests.

## Weiterhin gesperrt und offen

`seriesStartDate: null`, `generationEnabled: false`, Standard `traceable`, Revision 1,
offizieller Index leer. Keine Scheduler, offiziellen Dateischreiber oder laufenden
GitHub-Workflows implementiert. Der reine Generator setzt selbst keine Serienfreigabe.

Push, Sichtbarkeitsänderung, Pages, Cloudflare, GitHub App, verifizierte numerische
Betreiber-ID und serverseitige Secrets sind spätere externe Schritte. Keine Secrets
im Frontend, Git oder Chat. Historische Werke nie still neu würfeln oder überschreiben.
Vor offizieller Serie ausdrücklich 30–50 getrennte Testwerke beider Modi abnehmen
lassen und anschließend Datum/Aktivierung bewusst freigeben.

## Nächster abgegrenzter Schritt

Die beiden Beispielketten gemeinsam sichten. Danach kann Phase 3 (vollständige
Galerie-/Werk-/Eltern-/Nachfolgeransicht und Kunstabnahme) separat beauftragt werden.
Die bestehenden 20 Beispielwerke sind noch keine formale Kunstabnahme.

Für den Wiedereinstieg: `AGENTS.md`, diese Notiz, `docs/PRD.md`,
`docs/phase-2-results.md`, `docs/architecture.md` lesen. Git prüfen, Node 24 gemäß
`.nvmrc` verwenden. Bei fehlenden Abhängigkeiten `npm ci`, bei Cache-Sandboxproblemen
`npm ci --cache /tmp/evolvera-npm-cache`. `npm run dev` startet normalerweise unter
`http://127.0.0.1:5173/evolvera/`; das Labor unter `#/evolutionslabor`.

## Kopierbare Startnachricht

> Wir setzen Evolvera im vorhandenen Projektordner fort. Lies `AGENTS.md`,
> `docs/HANDOFF.md`, `docs/PRD.md` und `docs/phase-2-results.md`. Prüfe Git und starte
> das lokale Evolutionslabor. Wir sehen uns zuerst die beiden Beispielketten an.
> Phase 3 noch nicht beginnen; nichts pushen, veröffentlichen oder offiziell generieren.
