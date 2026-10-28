# Evolvera

Eine wachsende Galerie für reine HTML-/CSS-Kunst. **Stand: Phase 2 lokal umgesetzt.**
Designrichtung A (experimentelles Kunstmagazin) ist gewählt und übernommen.
Testatelier und Evolutionslabor zeigen unabhängige Studien sowie zwei Beispielketten
mit beiden Vererbungsmodi und poetischen Titeln. Offizielle Serie und Anmeldung folgen später.

Fachliche Quelle ist [docs/PRD.md](docs/PRD.md), Version 1.1. Die unverändert erhaltene
`Evolvera_PRD_v1.0.md` ist historisch. Aktueller Stand und Wiedereinstieg:
[docs/HANDOFF.md](docs/HANDOFF.md).

## Lokal starten

Node **24.21.0** gemäß `.nvmrc`, npm und Git. `engines` erlaubt kompatible Updates
innerhalb Node 24; CI verwendet dieselbe gepinnte Version. Mit Versionsmanager z. B.
`nvm install && nvm use` oder `fnm use --install-if-missing`.

```sh
cd /Users/abrocker/ai_o_projects/evolvera
npm ci
npm run dev
```

[Startseite](http://127.0.0.1:5173/evolvera/) und
[Testatelier](http://127.0.0.1:5173/evolvera/#/atelier).
Die tatsächlich ausgegebene Adresse verwenden, wenn der Port abweicht.
Bei einem in der Sandbox nicht beschreibbaren npm-Cache:
`npm ci --cache /tmp/evolvera-npm-cache`, ohne `sudo` oder Änderung am persönlichen Cache.
Die lokale Prüfung nutzt Node 24.21.0 / npm 12.2.0. Der Devserver bleibt auf Loopback.

## Was du ausprobieren kannst

Das Testatelier enthält zwölf gespeicherte Vorschau-DNA in drei Familien:
geometrische Konstellationen, große Farbfelder und Mosaikraster. Eine Kachel öffnet
die Studie groß. Wähle Familie und Seed und erzeuge weitere unabhängige Vorschauen.
Gleicher Seed, gleiche Familie und Generatorversion ergeben dieselben Parameter.
Die Eingabe ist kein offizieller Generierungslauf und schreibt keine Archivdatei.

Vorschaubilder bleiben im festen Ruhezustand. Bewegung läuft nur im Hauptwerk,
ist pausierbar und startet bei reduzierter Bewegung statisch. Du kannst sie für
die aktuelle Studie ausdrücklich abspielen. Diese Besucheraktion ändert keinen
Betreibermodus. Die offiziellen Seiten zeigen weiterhin ehrliche Leerzustände.

Das getrennte [Evolutionslabor](http://127.0.0.1:5173/evolvera/#/evolutionslabor)
zeigt je zehn Werke für beide Modi, Eltern-Kind-Vergleich, konkrete Vererbungsbelege
und gespeicherte poetische Titel. Generation 1 und 2 sind unabhängig; danach sind
n−2 und n−1 die Eltern. Datumswerte im Januar 2000 sind simulierte Testmetadaten.
Die Auswahl des Beispielmodus ändert keine globale Betreiberkonfiguration.
Die Beispiele sind noch keine formale Kunstabnahme von 30–50 Werken beider Modi.

## Prüfen und bauen

```sh
npm run check
npx playwright install chromium
npm run test:browser
npm run preview
```

`check` umfasst Format, ESLint, Typprüfung, 71 Tests, Config-/Archiv-/Fixtureprüfung
und Build nach `dist/`. Die 16 Browserfälle starten den lokalen Produktionspreview
selbst und prüfen Desktop sowie 320px Mobilbreite mit gepinntem Chromium.
Unter Linux für einen frischen Runner: `npx playwright install --with-deps chromium`.
Die visuellen Referenzen sind reine Testbelege unter `tests/browser/references`;
sie werden nicht als Kunst ausgeliefert. Plattformübergreifende Toleranzen und noch
offene Prüfungen sind im [Phase-2-Bericht](docs/phase-2-results.md) dokumentiert.

| Befehl                                    | Zweck                                                        |
| ----------------------------------------- | ------------------------------------------------------------ |
| `npm run dev`                             | Lokaler Vite-Devserver                                       |
| `npm run build`                           | Daten/Referenzen und Typen prüfen, Produktionsbuild          |
| `npm run preview`                         | Gebauten Stand lokal ansehen                                 |
| `npm test`                                | Schema, PRNG, Generator, Renderer, Archiv und Routing        |
| `npm run test:browser`                    | Echte Browser-, Wiedergabe- und visuelle Prüfungen           |
| `npm run typecheck` / `npm run lint`      | Strikte Typen / ESLint ohne Warnungen                        |
| `npm run format:check` / `npm run format` | Format prüfen / formatieren                                  |
| `npm run validate:data`                   | Offizielles Archiv und alle gespeicherten Preview-DNA prüfen |

Die PRD-Originale sind absichtlich von der Formatierung ausgenommen.
Kein Test aktualisiert gespeicherte Preview-DNA automatisch. Der initiale Befehl
`npm exec tsx -- scripts/preview-fixtures.ts --write` verweigert das Überschreiben
einer vorhandenen Referenzdatei. Normale Entwicklung nutzt die reine Prüfung.

## Struktur und Erhaltung

- `src/app`, `src/styles`: Shell, Hash-Routen und getrenntes Testatelier.
- `src/art/schema`: Werk-, DNA-, Herkunfts-, Konfigurations- und Previewverträge.
- `src/art/generator`: PRNG, drei Previewfamilien und Evolutionskern 0.2.0 mit Rezeptreplay.
- `src/art/renderer`: V1 mit isolierten CSS-Modulen, fester 1000er-Fläche und Ruhezustand.
- `src/art/titles`: deterministischer Titelgenerator mit Lexikon 0.1.0 und Elternfragmenten.
- `src/archive`: validierter lesender Zugriff; noch kein offizieller Archivschreiber.
- `src/operator`, `workers/admin`: Snapshot-Helfer und geplante Betreiberfunktion.
- `fixtures/preview`: gespeicherte Vorschau-DNA, getrennt vom offiziellen Archiv.
- `public/artworks`: kanonischer offizieller Bereich, derzeit nur leerer Index.

Kunst ausschließlich HTML/CSS, ohne SVG, Canvas, WebGL oder Bilddateien.
Bestehende Werke werden nie still neu gewürfelt, überschrieben oder migriert.
Darstellung liest Endparameter; Generatorupdates ändern kein Archiv. Beschädigte
historische Daten später exakt aus Git wiederherstellen, bei Unsicherheit stoppen.
Historische Renderer erhalten; neue Darstellungsregeln brauchen eine neue Version.
Weitere Architekturentscheidungen: [docs/architecture.md](docs/architecture.md).

## Serienfreigabe und externe Einrichtung

`config/generation.json`: Startdatum `null`, Generierung `false`, Standardmodus
`traceable` (Nachvollziehbare Vererbung), Revision 1. `free` heißt Maximale Freiheit
und ist im getrennten Evolutionslabor umgesetzt. Der Build blockiert weiterhin offizielle Werke,
Aktivierung oder ein gesetztes Startdatum vor Freigabe. Es gibt keinen offiziellen
Generierungsbefehl oder Zeitplan. Einstellungen wirken später erst auf den nächsten
noch nicht begonnenen Lauf, niemals auf archivierte Werke.

Vorhandenes Remote: [bummber/evolvera](https://github.com/bummber/evolvera).
Lokal auf `main` eingerichtet, Ausgangsdateien erhalten. Kein Push, kein Deployment
und keine Sichtbarkeitsänderung. Die vorbereitete CI ist noch nicht remote ausgeführt.
Der manuelle Pages-Workflow kann später bauen; Deploy erfordert zusätzlichen Input,
`PAGES_DEPLOYMENT_ENABLED=true`, `main` und ein öffentliches Repository.

Erster Push und Testdeployment bleiben separat freizugebende Schritte. Spätestens
zum ersten öffentlichen Shell-Testdeployment Repository öffentlich schalten,
Pages/Actions/Environment und rechtliche Betreiberangaben klären. Die voraussichtliche
URL `https://bummber.github.io/evolvera/` ist noch nicht als Live-Website bestätigt.

Cloudflare-Konto, Worker, konsistenter Sitzungsspeicher, GitHub App, Callback und
verifizierte numerische Betreiber-ID später prüfen/einrichten. Secrets ausschließlich
serverseitig, keine Secrets im Chat. Der geplante Top-Level-Worker-Login funktioniert
konzeptionell ohne Drittanbieter-Cookies; echte Anmeldung ist noch nicht implementiert.

## Nächster Schritt

Die beiden Beispielketten gemeinsam sichten. Danach kann Phase 3 separat beauftragt
werden: vollständige Galerie-/Werk-/Nachfolgernavigation und Kunstabnahme von 30–50
getrennten Testwerken beider Modi. Die offizielle Serie bleibt bis zur ausdrücklichen
Abnahme, einem festgelegten Datum und separater Freigabe deaktiviert.

Der neue Kern erzeugt Werkschema 2 (Rezept und Titelherkunft); Werkschema 1 und Renderer
V1 bleiben nutzbar. `npm run validate:data` vergleicht alle gespeicherten Vorschauen
exakt. Die reine Funktion erhält einen Snapshot und eine injizierte Uhr; keine Datei-
oder Git-Schreiboperation. Die echte Lauf-/Aktivierungssteuerung folgt erst später.
