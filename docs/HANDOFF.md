# Evolvera – aktueller Übergabestand

Stand: 28.10.2026. Aktueller Betreiberauftrag hat Vorrang. Dieser Vermerk erteilt
keine Freigabe für Veröffentlichung, Phase 4 oder offizielle Generierung.

## Projekt und Entscheidungen

- Projekt `/Users/abrocker/ai_o_projects/evolvera/`, Branch `main`, vorhandenes
  `origin` `https://github.com/bummber/evolvera.git`. Zuletzt privat/leer geprüft;
  kein Push/Deployment bisher. Aktuellen Git-Stand vor Änderungen erneut prüfen.
- Fachliche Quelle `docs/PRD.md` v1.1; Rootdatei v1.0 historisch. `AGENTS.md` beachten.
- Bisherige lokale Commits: Phase 0 `59d05ed`, erste Übergabe `45d8486`, gewählte
  Designrichtung A `b1a6750`, Phase 1 `0fcd7c8`, Phase 2 `b589c84`.
- Betreiber hat nach Phase 2 positives Feedback gegeben und um Weiterarbeit gebeten.
  Phase 3 technisch lokal umgesetzt; ausdrückliche Kunstabnahme **noch offen**.
  Phase 4 ist nicht begonnen. Lob der bisherigen Richtung ist keine Serienfreigabe.

## Jetzt nutzbar

`#/kunstpruefung` ist der neue Einstieg: **40 getrennte Testwerke**, zwei Ketten
mit je 20 Generationen. Bisherige 20 bleiben erhalten; `phase-3.json` enthält nur
20 zusätzliche Werke. Generator/Titelgenerator/Renderer bleiben 0.2.0/0.1.0/1.
Testdaten sind vom offiziellen Archiv getrennt; Januar 2000 ist simulierte Metadatenzeit.

Heute, Galerie (zwölf pro Seite und Suche), Werkdetail, Herkunftsvergleich sowie
Eltern-/Nachfolgernavigation funktionieren mit demselben lesenden Archivzugriff.
Testsammlung über Hash-Query `?sammlung=traceable` oder `?sammlung=free`, sonst nur
leeres offizielles Archiv. Mode-Auswahl ist keine Speicherung von Einstellungen.
Statische HTML-/CSS-Kacheln, Bewegung ausschließlich im geöffneten Hauptwerk,
Pause/Play und reduzierte Bewegung. Metadaten lesen immer den gespeicherten Modus.

Ursprung 1 hat nur Gen. 3 als direkten Nachfolger; Ursprung 2 hat Gen. 3/4.
Die tatsächlichen Elternreferenzen entscheiden. Fehler-/Leerzustände getrennt,
keine Neugenerierung bei Schäden. Offizielle Daten werden pro Seite/Werk geladen,
Cache begrenzt auf 48. Die feste Preview-Sammlung lädt als separates Bundle.

`#/atelier` mit zwölf unabhängigen Studien und `#/evolutionslabor` mit dem bisherigen
Zehnervergleich bleiben erreichbar. Original-PRD, Phase-1-/Phase-2-Daten, Generatoren,
Schemata und Renderer-Referenzen sind erhalten. Kunst nur HTML/CSS, keine Bilder,
SVG, Canvas oder WebGL. Details in `docs/phase-3-results.md` und `docs/architecture.md`.

## Tatsächliche Prüfungen und Grenzen

`npm run check` grün: Format, Lint, Typen, **91 Tests**, offizielle Leere,
deterministische Referenzprüfung und Build. Darin weiterhin 365 Testtage je Modus.
`npm run test:browser`: **30 Fälle** Desktop/320px Chromium, einschließlich sechs
unveränderter Renderer-Referenzen, Pagination/Navigation, Fehler und Berliner 04:00-
Anzeigegrenze. Der offizielle Nichtleer-Leseweg wird ausschließlich per HTTP-Testantwort
geprüft; keine solchen Daten im offiziellen Archiv. Integrierter Browser zusätzlich gesichtet.

Physische Geräte, Safari/Firefox, GPU-/FPS-Profiling, Linux-CI und Hosting/Auth-Ende-
zu-Ende noch offen. Ein dauerhaft offener Tab liest nach 04:00 nicht automatisch neu;
Reload/neuer Aufruf schon. Vor Tagesbetrieb automatische Aktualisierung klären.

## Weiterhin gesperrt

Startdatum `null`, Generierung `false`, Standard `traceable`, Revision 1, offizieller
Index leer. Kein Scheduler, offizieller Schreiber, Login oder externer Account eingerichtet.
Kein Push, Deployment oder Sichtbarkeitswechsel. Vor späterem öffentlichem Testdeployment
Repository öffentlich schalten; Pages/Actions/Environment und Betreiberangaben einrichten.
Cloudflare, GitHub App, verifizierte numerische Betreiber-ID, Callback, Sitzungen und
serverseitige Secrets später. Keine Secrets im Frontend, Git, Logs oder Chat.

## Nächster abgegrenzter Schritt

Die 40 Werke im Browser gemeinsam sichten, mit `docs/art-review.md` als Sichtungsbogen.
Vielfalt, sichtbare Elternbeiträge, freie Brüche, Titellesbarkeit sowie Smartphone- und
Desktop-Bedienung beurteilen. Alle Abnahmestatus sind offen. Bei Änderungen vorhandene
Werke erhalten und neue Versionen/Beispiele getrennt erzeugen. Erst ausdrückliche
Kunstabnahme dokumentieren. Danach Phase 4 gesondert beauftragen; Serienstartdatum und
Aktivierung bleiben nochmals bewusste Betreiberentscheidungen.

Wiedereinstieg: `AGENTS.md`, diese Notiz, `docs/PRD.md`, `docs/phase-3-results.md`,
`docs/art-review.md` und Architektur lesen. Git prüfen, Node 24 gemäß `.nvmrc`.
Bei Bedarf `npm ci`, bei Cache-Sandboxproblem `npm ci --cache /tmp/evolvera-npm-cache`.
`npm run dev`, dann `http://127.0.0.1:5173/evolvera/#/kunstpruefung` (tatsächlich
angezeigten Port verwenden). Noch keine externe Einrichtung voraussetzen.

## Kopierbare Startnachricht

> Wir setzen Evolvera im vorhandenen Projekt fort. Lies `AGENTS.md`, `docs/HANDOFF.md`,
> `docs/PRD.md`, `docs/phase-3-results.md` und `docs/art-review.md`. Prüfe Git und
> öffne die lokale Kunstsichtung. Wir sehen uns die 40 Testwerke gemeinsam an.
> Noch keine Phase 4, kein Push, keine Veröffentlichung und keine offizielle Serie.
