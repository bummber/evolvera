# Evolvera

Öffentliche Galerie: https://bummber.github.io/evolvera/
Die offizielle Kunstserie entsteht mit einem Werk pro Tag; sie ist am 19.11.2026
mit Generator 0.4.0 neu gestartet. Die Testwerke sind davon getrennt zugänglich.

Vor Website-Veröffentlichungen: `#/impressum` und `#/datenschutz` sowie die öffentlichen
Betreiberangaben in `config/legal.json` prüfen und `npm run check:publication`
ausführen. Die Angaben und das erste Pages-Testdeployment wurden am 02.11.2026
ausdrücklich freigegeben; Durchführung und Ergebnis siehe [Vorbereitung](docs/publication-preparation.md).

Eine wachsende Galerie für reine HTML-/CSS-Kunst. **Stand 19.11.2026: Serie am
19.11.2026 neu gestartet (Generator 0.4.0, Schema 3, Renderer 2), ein offizielles
Werk, tägliche Archivierung und Veröffentlichung über GitHub Actions.** Testphase:
Werke dürfen auf ausdrücklichen Betreiberauftrag gelöscht werden; die Werke vom
04.–18.11.2026 liegen als Testdaten unter `tests/fixtures/legacy-archive/`.
Das abgenommene Werkbuch entwickelt Designrichtung A (experimentelles Kunstmagazin) weiter.
Galerie, Werkdetails und Herkunftsvergleich sind umgesetzt. Die getrennte Kunstsichtung
enthält 40 abgenommene Testwerke in zwei Zwanzigerketten mit beiden Modi und poetischen Titeln.
Betreiberanmeldung und Einstellungsseite (Modus und Generationsprofil) sind
eingerichtet und nachgewiesen.

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
Ohne Sammlungsparameter zeigt die Website ausschließlich das offizielle Archiv.
Die Auswahl ändert keine Betreiberkonfiguration. Alle Testdaten im Januar 2000 sind
simuliert; die offizielle Serie beginnt am 04.11.2026.

Die 40 Werke sind in [docs/art-review.md](docs/art-review.md) einzeln erfasst.
Die 40 Testwerke sind am 28.10.2026 ausdrücklich abgenommen. Startdatum,
Aktivierung und Veröffentlichung der Serie waren davon getrennte Betreiberentscheidungen.

### Frühere lokale Experimente

Das Testatelier enthält zwölf gespeicherte Vorschau-DNA in drei Familien:
geometrische Konstellationen, große Farbfelder und Mosaikraster. Eine Kachel öffnet
die Studie groß. Wähle Familie und Seed und erzeuge weitere unabhängige Vorschauen.
Gleicher Seed, gleiche Familie und Generatorversion ergeben dieselben Parameter.
Die Eingabe ist kein offizieller Generierungslauf und schreibt keine Archivdatei.

Vorschaubilder bleiben im festen Ruhezustand. Bewegung läuft nur im Hauptwerk,
ist pausierbar und startet bei reduzierter Bewegung statisch. Du kannst sie für
die aktuelle Studie ausdrücklich abspielen. Diese Besucheraktion ändert keinen
Betreibermodus. Testwerke erscheinen nie im offiziellen Archiv.

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

`check` umfasst Format, ESLint, Typprüfung, 433 Tests, Config-/Archiv-/Fixtureprüfung
und Build nach `dist/` und `.admin-build/` sowie Worker-Dry-Run ohne Deployment. Es
enthält weder `test:browser` noch `worker:test-runtime`. Die 160 Browserfälle (154
bestanden, sechs bewusste Doppelaufruf-Skips; Stand 19.11.2026) starten den lokalen Produktionspreview
selbst und prüfen Desktop sowie 320px Mobilbreite mit gepinntem Chromium. Sie testen
den gebauten Stand in `dist/`, also vorher bauen.
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
| `npm run test:acceptance`                 | Zusätzliche lokale Browser-/Sitzungsabnahme (drei Engines)   |
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
- `src/art/generator`: PRNG, Previewfamilien, Evolutionskern 0.2.0 und Generatoren 0.3.0 (ganze Ebenen) und 0.4.0 (einzelne Eigenschaften, `v3/traits.ts`) mit Rezeptreplay.
- `src/art/renderer`: Renderer 1 und 2 mit isolierten CSS-Modulen, fester 1000er-Fläche und Ruhezustand.
- `src/art/titles`: deterministischer Titelgenerator mit Lexikon 0.1.0 (Elternfragmente) und 0.2.0 (ganze Elternbausteine, ab Werkdatum 14.11.2026).
- `src/archive`: validierter lesender Zugriff pro Seite/Werk, begrenzter Cache; kein Archivschreiber.
- `src/operator`, `workers/admin`: Snapshot-Helfer, Profilregeln und geschützte Betreiberfunktion (Cloudflare Worker).
- `src/admin`: Einstellungsseite, als Worker-Asset gebaut (`npm run build:admin`), nicht in `dist`.
- `src/series`: datierte Kalenderregeln für Tagesgrenze, Lexikon- und Generatorwechsel.
- `src/automation`: Tagesplanung, Nachholung, Historienprüfung und Git-Archivierung.
- `src/preview`: validierte feste Testsammlung, verzögert geladen.
- `fixtures/preview`: gespeicherte Vorschau-DNA, getrennt vom offiziellen Archiv.
- `public/artworks`: kanonisches offizielles Archiv, eine JSON-Datei pro Werk plus Index; wird vom Tageslauf geschrieben.

Kunst ausschließlich HTML/CSS, ohne SVG, Canvas, WebGL oder Bilddateien.
Bestehende Werke werden nie still neu gewürfelt, überschrieben oder migriert;
gelöscht werden sie nur auf ausdrücklichen Betreiberauftrag (Testphase).
Darstellung liest Endparameter; Generatorupdates ändern kein Archiv. Beschädigte
historische Daten später exakt aus Git wiederherstellen, bei Unsicherheit stoppen.
Historische Renderer erhalten; neue Darstellungsregeln brauchen eine neue Version.
Weitere Architekturentscheidungen: [docs/architecture.md](docs/architecture.md).

## Serienbetrieb und externe Einrichtung

`config/generation.json` (Schema 2): Startdatum `2026-11-19`, Generierung `true`, Modus
`traceable` (Nachvollziehbare Vererbung), Profil „Ruhig“, Revision 8. `free` heißt
Maximale Freiheit. Nur der Betreiber speichert Modus und Profil über die geschützte
Einstellungsseite; Änderungen wirken erst auf den nächsten noch nicht begonnenen
Lauf, niemals auf archivierte Werke.
`config/release.json` enthält `seriesAuthorized: true`, die Kunstabnahmen der
Generatoren 0.2.0 (`artReview`), 0.3.0 (`artReviewV3`) und 0.4.0 (`artReviewV4`,
18.11.2026) sowie die Titelabnahme für Lexikon 0.2.0. Ohne passende Abnahme und
Serienfreigabe erzeugt der Tagesplaner kein Werk. Den Generator wählt der Kalender
nach Werkdatum; ab 19.11.2026 gilt 0.4.0.

Der Workflow `pages.yml` archiviert fällige Werke, prüft, baut und veröffentlicht in
einem Lauf. Er ist an `PAGES_DEPLOYMENT_ENABLED=true`, `EVOLVERA_AUTOMATION_ENABLED=true`,
`main` und ein öffentliches Repository gebunden; beide Variablen sind gesetzt. Ein
manueller Start veröffentlicht nur mit `deploy=true`. Die Automation committet selbst
auf `main` („Archive validated daily artworks“); lokale Stände können deshalb hinter
dem Remote liegen und werden nur per Fast-forward oder Rebase angeglichen.

Tagesgrenze ist seit Werkdatum 06.11.2026 **01:17 Europe/Berlin** mit Nachholversuchen
um 01:47 und 02:23; frühere Werkdaten behalten 04:00. GitHub Actions startet geplante
Läufe ohne Zeitgarantie: Vom 06. bis 10.11.2026 entstanden die Archivcommits zwischen
07:11 und 08:29 Berlin, also sechs bis sieben Stunden nach dem Termin. Details:
[Zeitumstellung](docs/schedule-change.md).

Das Titel-Lexikon 0.2.0 gilt ab Werkdatum 14.11.2026 und vererbt ganze Bausteine statt
Buchstabenresten; frühere Werke und die Testwerke bleiben bei 0.1.0. Regel, Prüfungen
und abgenommene Titelvorschau: [Titel-Lexikon 0.2.0](docs/title-lexicon-0.2.0.md).

Repository: [bummber/evolvera](https://github.com/bummber/evolvera), öffentlich. Ein Push
auf `main` löst CI und den Pages-Workflow aus und ist damit eine Veröffentlichung.
Vorher `#/impressum`, `#/datenschutz` und `config/legal.json` prüfen (siehe oben).
Anbieterprüfung und Datenschutzhinweise sind dokumentiert.

Cloudflare-Worker/SQLite und GitHub App sind eingerichtet, letztere ausschließlich
auf `bummber/evolvera` beschränkt. Die öffentliche Galerie verlinkt die geschützte
Betreiberseite. Echter Login, Logout/Neuanmeldung und mehrere Modusrunden sind
nachgewiesen, auch auf iPhone/Safari im Privatmodus mit eingeschränkten
Drittanbieter-Cookies. Secrets liegen ausschließlich serverseitig, nie im Chat.
[Ergebnis und Grenzen](docs/operator-cookie-check.md).

## Lokale Betreiber- und Betriebsprüfungen

Wrangler **4.154.0** ist als exakte Dev-Abhängigkeit mit Lockfile ergänzt; keine neue
Frontend-Produktionsabhängigkeit. `npm run worker:check` bündelt nur per Dry-Run.
`npm run worker:dev` startet die sicher deaktivierte Betreiberfunktion auf Port 8787.
`npm run worker:test-runtime` prüft atomaren Callback, Sitzung und Logout in echtem
lokalem workerd/SQLite, einschließlich getrennten Objekten und absolutem Ablauf von
Login/Sitzung, ausschließlich mit Testdaten. Keine echten Secrets nötig.

`npm run generate:daily -- --dry-run` liest den gesicherten Git-Commit und vollständige
Historie, plant im Speicher und schreibt nichts. Am 19.11.2026 meldete er ein Werk,
Revision 7 und nichts Fälliges. `--apply` ist dem GitHub-Workflow vorbehalten; kein
lokaler Betriebsstart. Daten und Renderer werden nie still neu gewürfelt oder
überschrieben. Vorgehen bei Fehlern: [Runbook](docs/runbook.md).

## Aktueller Stand und nächster Schritt

Stand und Wiedereinstieg stehen in [docs/HANDOFF.md](docs/HANDOFF.md) und
[docs/NEXT-START.md](docs/NEXT-START.md); zu Beginn zuerst nur lesend prüfen.
Mit der am 19.11.2026 deployten Einstellungsseite sind die Arbeitspakete von EP-01
umgesetzt. Am 20.11. ist die Favoritengalerie (Paket B) umgesetzt: Der Betreiber
markiert Werke unter `/favorites` seines Bereichs, `#/favoriten` zeigt sie mit ihren
direkten Eltern ([Architektur](docs/architecture.md)); live erst nach dem nächsten
freigegebenen Worker-Deployment. Als Nächstes sind ab Generation 3 die Vererbung an
echten Werken zu belegen und Paket C (Serienneustart nach einem Monat) vorzubereiten,
zuerst mit Optionen.

Offen bleiben die Verspätung der geplanten Läufe, eine Firefox-/Safari-Prüfung der
Einstellungsseite, eine vollständige Geräte-/WCAG-/Sitzungsabnahme und
GPU-/FPS-Profiling.
