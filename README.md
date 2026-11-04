# Evolvera

Öffentliche Testversion: https://bummber.github.io/evolvera/
Die 40 Testwerke sind separat zugänglich; die offizielle Kunstserie ist noch nicht gestartet.

Vor Website-Veröffentlichungen: `#/impressum` und `#/datenschutz` sowie die öffentlichen
Betreiberangaben in `config/legal.json` prüfen und `npm run check:publication`
ausführen. Die Angaben und das erste Pages-Testdeployment wurden am 02.11.2026
ausdrücklich freigegeben; Durchführung und Ergebnis siehe [Vorbereitung](docs/publication-preparation.md).

Eine wachsende Galerie für reine HTML-/CSS-Kunst. **Stand 04.11.2026: Werkbuch-Galerie und geschützter Betreiberworker veröffentlicht; Restabnahme und Serienstart offen.**
Das abgenommene Werkbuch entwickelt Designrichtung A (experimentelles Kunstmagazin) weiter.
Galerie, Werkdetails und Herkunftsvergleich sind umgesetzt. Die getrennte Kunstsichtung
enthält 40 abgenommene Testwerke in zwei Zwanzigerketten mit beiden Modi und poetischen Titeln.
Die Betreiberanmeldung und Modusrunde sind nachgewiesen; die offizielle Serie bleibt aus.

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
[Kunstsichtung mit 40 Testwerken](http://127.0.0.1:5173/evolvera/#/kunstpruefung).
Die tatsächlich ausgegebene Adresse verwenden, wenn der Port abweicht.
Bei einem in der Sandbox nicht beschreibbaren npm-Cache:
`npm ci --cache /tmp/evolvera-npm-cache`, ohne `sudo` oder Änderung am persönlichen Cache.
Die lokale Prüfung nutzt Node 24.21.0 / npm 12.2.0. Der Devserver bleibt auf Loopback.

## Was du ausprobieren kannst

Starte mit der **Kunstsichtung**. Wähle eine der beiden Testsammlungen und blättere
in der Galerie (zwölf, dann acht Werke) oder suche nach Titel/ISO-Werkdatum.
Ein Werk öffnet groß mit gespeicherten Angaben, Herkunftsbelegen, Eltern und
vorhandenen direkten Nachfolgern. Über „Evolution“ lässt sich der Vergleich wechseln.
Kacheln bleiben statisch; nur das Hauptwerk kann animiert sein.

Die ausgewählte Testsammlung steht im Hash-Link, z. B.
`#/galerie?sammlung=traceable&seite=2` oder
`#/werk/2000-01-03?sammlung=free`. Reload und Browser-Zurück erhalten die Auswahl.
Ohne Sammlungsparameter zeigt die Website ausschließlich das leere offizielle Archiv.
Die Auswahl ändert keine Betreiberkonfiguration. Alle Testdaten im Januar 2000 sind
simuliert; die offizielle Serie hat kein Startdatum.

Die 40 Werke sind in [docs/art-review.md](docs/art-review.md) einzeln erfasst.
Die 40 Testwerke sind am 28.10.2026 ausdrücklich abgenommen. Das startet keine Serie;
Datum, Aktivierung und Veröffentlichung bleiben separate Betreiberentscheidungen.

### Frühere lokale Experimente

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
Diese 20 Beispiele gehören zur abgenommenen 40er-Testsammlung.

## Prüfen und bauen

```sh
npm run check
npx playwright install chromium
npm run test:browser
npm run worker:test-runtime
npm run generate:daily -- --dry-run
npm run preview
```

`check` umfasst Format, ESLint, Typprüfung, 166 Tests, Config-/Archiv-/Fixtureprüfung
und Build nach `dist/` sowie Worker-Dry-Run ohne Deployment. Die 68 Browserfälle (sechs bewusste Doppelaufruf-Skips) starten den lokalen Produktionspreview
selbst und prüfen Desktop sowie 320px Mobilbreite mit gepinntem Chromium.
Unter Linux für einen frischen Runner: `npx playwright install --with-deps chromium`.
Die visuellen Referenzen sind reine Testbelege unter `tests/browser/references`;
sie werden nicht als Kunst ausgeliefert. Plattformübergreifende Toleranzen und noch
offene Prüfungen sind in der [Abnahme vor Serienstart](docs/pre-series-acceptance.md) dokumentiert.

Die zusätzliche lokale Abnahme `npm run test:acceptance` nutzt Chromium mit
eingeschränkten Drittanbieter-Cookies, Firefox und WebKit. Browser passend zur
gepinnten Playwright-Version ergänzen: `npx playwright install firefox webkit --no-remove`.
Sie prüft die gebaute Galerie auf Port 4174 und synthetische Top-Level-Anmeldung,
Logout, alte Formularstände und Sitzungsende ohne echte GitHub-Schreibzugriffe.
Die vollständige Zusatzsuite besteht lokal mit sechs Fällen in allen drei Engines
(120 Seiten-/Breitenkombinationen und drei synthetische Login-/Formularläufe).
Firefox nutzt auf macOS über `tests/fixtures/browser.ts` ein eigens angelegtes
temporäres Anwendungsdatenverzeichnis. Damit ist der frühere Profilstartfehler
behoben; persönliche Profile und Schutzrechte bleiben unberührt.
Playwright-WebKit ersetzt keine vollständige Safari-/iPhone-Abnahme.

| Befehl                                    | Zweck                                                        |
| ----------------------------------------- | ------------------------------------------------------------ |
| `npm run dev`                             | Lokaler Vite-Devserver                                       |
| `npm run build`                           | Daten/Referenzen und Typen prüfen, Produktionsbuild          |
| `npm run preview`                         | Gebauten Stand lokal ansehen                                 |
| `npm test`                                | Schema, PRNG, Generator, Renderer, Archiv und Routing        |
| `npm run test:browser`                    | Echte Browser-, Wiedergabe- und visuelle Prüfungen           |
| `npm run test:acceptance`                 | Zusätzliche lokale Browser-/Sitzungsabnahme vor Serienstart  |
| `npm run typecheck` / `npm run lint`      | Strikte Typen / ESLint ohne Warnungen                        |
| `npm run format:check` / `npm run format` | Format prüfen / formatieren                                  |
| `npm run validate:data`                   | Offizielles Archiv und alle gespeicherten Preview-DNA prüfen |

Die PRD-Originale sind absichtlich von der Formatierung ausgenommen.
Kein Test aktualisiert gespeicherte Preview-DNA automatisch. Der initiale Befehl
`npm exec tsx -- scripts/preview-fixtures.ts --write` verweigert das Überschreiben
einer vorhandenen Referenzdatei. Normale Entwicklung nutzt die reine Prüfung.

## Struktur und Erhaltung

- `src/app`, `src/styles`: Shell, Hash-Routen, Galerie, Werkansichten und getrennte Kunstsichtung.
- `src/art/schema`: Werk-, DNA-, Herkunfts-, Konfigurations- und Previewverträge.
- `src/art/generator`: PRNG, drei Previewfamilien und Evolutionskern 0.2.0 mit Rezeptreplay.
- `src/art/renderer`: V1 mit isolierten CSS-Modulen, fester 1000er-Fläche und Ruhezustand.
- `src/art/titles`: deterministischer Titelgenerator mit Lexikon 0.1.0 und Elternfragmenten.
- `src/archive`: validierter lesender Zugriff pro Seite/Werk, begrenzter Cache; kein Archivschreiber.
- `src/operator`, `workers/admin`: Snapshot-Helfer und lokal implementierte Betreiberfunktion.
- `src/automation`: Tagesplanung, Nachholung, Historienprüfung und Git-Archivierung.
- `src/preview`: validierte feste Testsammlung, verzögert geladen.
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
`traceable` (Nachvollziehbare Vererbung), lokal noch Revision 3. Remote ist nach dem
freigegebenen Speichertest traceable/Revision 5 gespeichert; die zwei Moduscommits sind
lokal noch nicht übernommen. Revision 5 beim späteren Abgleich erhalten.
`free` heißt Maximale Freiheit
und ist im getrennten Evolutionslabor umgesetzt. Der Build blockiert weiterhin offizielle Werke,
Aktivierung oder ein gesetztes Startdatum vor Freigabe. Tagesbefehl und Zeitplan sind lokal vorbereitet,
aber die offizielle Generierung ist noch nicht freigegeben oder gestartet. Einstellungen wirken erst auf den nächsten
noch nicht begonnenen Lauf, niemals auf archivierte Werke.

Vorhandenes Remote: [bummber/evolvera](https://github.com/bummber/evolvera).
Lokal auf `main` eingerichtet, Ausgangsdateien erhalten. Öffentliche Galerie und
Betreiberworker sind nach gesonderten Aufträgen eingerichtet. Werkbuch-Commit
`d844e3f` mit erfolgreichen CI-/Pages-Läufen am 04.11. veröffentlicht.
Der gemeinsame Tages-/Pages-Workflow ist hinter `PAGES_DEPLOYMENT_ENABLED=true`,
`main` und öffentlichem Repository gesperrt; ein manueller Deploy verlangt zusätzlich
`deploy=true`. Automatisierung braucht eine weitere ausdrückliche Freigabe.

Galerie: [bummber.github.io/evolvera](https://bummber.github.io/evolvera/).
Alle 22 öffentlichen Builddateien wurden bytegleich zum freigegebenen Build geprüft.
Anbieterprüfung und gemeinsame Datenschutzhinweise sind dokumentiert. Neue
Veröffentlichungen und die Serienaktivierung brauchen weiterhin den passenden Auftrag.

Cloudflare-Worker/SQLite und GitHub App sind eingerichtet, letztere ausschließlich
auf `bummber/evolvera` beschränkt. Die öffentliche Galerie verlinkt die geschützte
Betreiberseite. Echter Login, Logout/Neuanmeldung und traceable/1 → free/2 → traceable/3
sind nachgewiesen. Secrets ausschließlich serverseitig, keine Secrets im Chat.
Die lokale synthetische Top-Level-Anmeldung besteht mit eingeschränkten
Drittanbieter-Cookies. Echte Anmeldung und Logout nach Cookieprüfanleitung sind
auf iPhone/Safari im Privatmodus vom Betreiber bestätigt; nach Reload nach Logout
bleibt das Formular gesperrt. Auch die separat freigegebene Modusrunde traceable/3 →
free/4 → traceable/5 unter dieser Cookieeinstellung ist bestätigt; beide Git-/CI-/
Pages-Nachweise und je 22 ausgelieferte Dateien geprüft.
[Ergebnis und Grenzen](docs/operator-cookie-check.md).

## Lokale Betreiber- und Betriebsprüfungen

Wrangler **4.154.0** ist als exakte Dev-Abhängigkeit mit Lockfile ergänzt; keine neue
Frontend-Produktionsabhängigkeit. `npm run worker:check` bündelt nur per Dry-Run.
`npm run worker:dev` startet die sicher deaktivierte Betreiberfunktion auf Port 8787.
`npm run worker:test-runtime` prüft atomaren Callback, Sitzung und Logout in echtem
lokalem workerd/SQLite, einschließlich getrennten Objekten und absolutem Ablauf von
Login/Sitzung, ausschließlich mit Testdaten. Keine echten Secrets nötig.

`npm run generate:daily -- --dry-run` liest den gesicherten Git-Commit und vollständige
Historie, plant im Speicher und schreibt nichts. Aktuell null offizielle Werke und
Generierung deaktiviert. `--apply` ist für den separat freigegebenen GitHub-Workflow
reserviert; kein lokaler Betriebsstart. Kunstabnahme und Referenz-Digests stehen in
`config/release.json`, `seriesAuthorized` bleibt false. Daten/Renderer werden nie still
neu gewürfelt oder überschrieben. Vorgehen bei Fehlern: [Runbook](docs/runbook.md).

## Nächster Schritt

Die [Restabnahme und den vorbereiteten Startablauf](docs/pre-series-acceptance.md)
gemeinsam sichten. Die iPhone-/Safari-Prüfung einschließlich gespeicherter Webapp
ist am 04.11. vom Betreiber ohne Auffälligkeiten bestätigt. Die lokale Firefox-Abnahme
ist ebenfalls erfolgreich. Echte Cloud-Anmeldung und Logout im privaten Safari
auf dem iPhone sind nach Anleitung bestätigt; Reload nach Logout zeigt kein Formular.
Auch der echte Modusspeichertest ist abgeschlossen:
[Ergebnis und Ablauf](docs/operator-cookie-check.md). Zuerst den lokalen Stand
`d844e3f` samt uncommittierten Arbeiten und den Remote-Stand `a66d0b4`/Revision 5
bewusst abgleichen; kein blindes Pull oder Überschreiben der lokalen Arbeiten.
[Übergabe und Startprompt](docs/NEXT-START.md).
Danach verbleibende Abnahmegrenzen sichten, Startdatum und Aktivierung
gesondert freigeben; der erste geplante Archiv-/Deploymentlauf lässt sich erst nach
Aktivierung nachweisen. Bestehende Ergebnisdokumente und das unversionierte
PRD-Backup bleiben erhalten.

Ein Desktop-Safari-Stichprobenlauf ist erfolgt; vollständige Geräte-/WCAG-/
Sitzungsabnahme und GPU-/FPS-Profiling bleiben offen. Remote-CI ist erfolgreich.
Phase 5 ist nicht begonnen. Eine spätere weitere Serie mit mehr Varianz, Verläufen,
Linien und Kurven bleibt ein [gesonderter Folgeauftrag](docs/future-series.md).
