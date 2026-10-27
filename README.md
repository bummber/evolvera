# Evolvera

Eine täglich wachsende Galerie für reine HTML-/CSS-Kunst. **Stand: lokale Phase 0.**
Die Oberfläche, Navigation und Datenverträge sind eingerichtet. Kunstgenerator,
Renderer, Evolution, Titelgenerator, Anmeldung und tägliche Automatisierung folgen
in späteren Phasen. Es gibt noch keine offiziellen Werke und keine Live-Website.

Fachliche Quelle ist **[docs/PRD.md](docs/PRD.md), Version 1.1**. Die unverändert
aufbewahrte `Evolvera_PRD_v1.0.md` ist ausschließlich historischer Ausgangsstand und
wird fachlich durch v1.1 ersetzt.

## Lokal starten

Voraussetzung: Node **24.21.0** (Node-24-LTS-Linie), npm und Git. Die eingesetzte
Node-Linie passt zu den installierten Werkzeugen; `.nvmrc`, `engines` und CI stimmen
überein. Mit einem Node-Versionsmanager zunächst die `.nvmrc` aktivieren, z. B.
`nvm install && nvm use` oder `fnm use --install-if-missing`.

```sh
cd /Users/abrocker/ai_o_projects/evolvera
npm ci
npm run dev
```

Die ausgegebene lokale Adresse mit Projektbasis öffnen, normalerweise
[http://127.0.0.1:5173/evolvera/](http://127.0.0.1:5173/evolvera/).
Ein Direktlink ist beispielsweise
[http://127.0.0.1:5173/evolvera/#/einstellungen](http://127.0.0.1:5173/evolvera/#/einstellungen).
`npm install` ist ebenfalls möglich; reproduzierbare Installationen nutzen `npm ci`.

Falls die lokale Sandbox den persönlichen npm-Cache nicht beschreiben darf:
`npm ci --cache /tmp/evolvera-npm-cache`. Kein `sudo` nötig und keine Änderung am
persönlichen Cache. Lokale Prüfung hier mit Node 24.21.0 / npm 12.2.0.

## Prüfen und bauen

```sh
npm run check
npx playwright install chromium
npm run test:browser
npm run preview
```

`check` umfasst Formatkontrolle, ESLint, Typprüfung, Vitest sowie Datenprüfung und
Produktionsbuild. Die Browserprüfungen verwenden den vorher gebauten `dist/`-Stand
und starten den lokalen Previewserver selbst. Sie testen Desktop und 320px Breite
in Chromium. Unter Linux für einen frischen CI-Runner:
`npx playwright install --with-deps chromium`.

| Befehl                                    | Zweck                                                      |
| ----------------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                             | Vite-Devserver, nur auf Loopback                           |
| `npm run build`                           | Konfiguration/Archiv prüfen, Typen prüfen, `dist/` bauen   |
| `npm run preview`                         | Gebauten Stand lokal unter `/evolvera/` ansehen            |
| `npm test`                                | Schema-, Herkunfts-, Snapshot-, Archiv- und Routingtests   |
| `npm run test:browser`                    | Direktlinks, JSON-Basis, Fehler, Navigation, mobile Breite |
| `npm run typecheck`                       | Strikte TypeScript-Prüfung                                 |
| `npm run lint`                            | ESLint ohne Warnungen                                      |
| `npm run format:check` / `npm run format` | Format prüfen / formatieren                                |
| `npm run validate:data`                   | Offizielles Archiv und Phase-0-Sperre prüfen               |

PRD v1.1 und die historische Originaldatei sind von der automatischen Formatierung
ausgenommen, um sie unverändert zu erhalten. `dist/`, Abhängigkeiten, lokale
Browserberichte und Secrets sind nicht Teil des Repositoryinhalts.

## Was jetzt funktioniert

Heute, Galerie, Evolution, Über Evolvera und Einstellungen sind über Hash-Navigation
erreichbar; Werkdetail-Adressen und unbekannte Adressen haben klare Leer- bzw.
Fehlerzustände. Alle Werkdatenpfade verwenden `/evolvera/`. Das echte offizielle
Archiv ist leer. Ladefehler werden von einem leeren Archiv unterschieden.
Einstellungen zeigen die validierte Voreinstellung `traceable` (Nachvollziehbare
Vererbung), Revision 1. `free` heißt Maximale Freiheit. Es gibt keinen scheinbaren
Login oder lokalen Speicherschalter.

`config/generation.json` hat `seriesStartDate: null` und `generationEnabled: false`.
Die Datenprüfung blockiert in Phase 0 einen gesetzten Serienstart, aktivierte
Generierung oder Werke im offiziellen Archiv. Die Sperre wird erst im passenden,
ausdrücklich freigegebenen späteren Arbeitspaket entfernt. Es existiert kein
Generierungsbefehl und kein Zeitplan. Noch keine manuelle Generierung ausführen.

## Struktur und Regeln

- `src/app`, `src/styles`: Oberfläche, Routing und Layout.
- `src/art/schema`: strikte Werk-, DNA-, Herkunfts- und Konfigurationsverträge.
- `src/art/generator`, `titles`, `renderer`: getrennte, noch nicht implementierte Verträge.
- `src/archive`: öffentlicher lesender Indexzugriff.
- `src/operator`, `workers/admin`: Snapshot-Grenze und reservierte Betreiberfunktion.
- `public/artworks`: ausschließlich kanonisches Archiv; derzeit nur leerer Index.
- `tests/fixtures`: synthetische Prüfdaten, keine offiziellen oder abgenommenen Testwerke.

Kunst bleibt HTML/CSS: keine SVGs, Canvas, WebGL oder Bilddateien. Historische Werke
werden niemals neu gewürfelt oder still überschrieben. Beschädigte historische Daten
müssen später exakt aus Git wiederhergestellt werden; bei Unsicherheit stoppen.
Der Index ist aus Werkdateien ableitbar. Im leeren Phase-0-Archiv gibt es noch keine
Wiederherstellung oder Index-Neuaufbau-Routine; keine scheinbar fertige Reparatur.

Einstellungen gelten ab dem nächsten noch nicht begonnenen Generierungslauf.
Laufstart friert Modus/Revision ein; historische Werke behalten ihren eigenen Modus.
Der heutige Snapshot-Helfer ist rein lokal und implementiert noch keine Lauf-Sperre.
Details, Grenzen der Schema-Belege und der sichere geplante Anmelde-/Schreibweg
stehen in [docs/architecture.md](docs/architecture.md).

## Git, CI und spätere Veröffentlichung

Das lokale Repository verwendet `main` und das vorhandene Remote
[github.com/bummber/evolvera](https://github.com/bummber/evolvera). Beim Start erneut
geprüft: privat, leer; lokal nur PRD v1.0, noch kein Git. Es wurde vor Ort initialisiert,
kein neuer Unterordner und kein neues GitHub-Repository angelegt. Vorhandene Dateien
blieben erhalten. **Kein Push, keine Sichtbarkeitsänderung, kein Deployment.**

Die vorbereitete CI führt die lokalen Qualitätsprüfungen plus Browsertests aus.
Der Pages-Workflow ist nur manuell startbar. Er baut zunächst; Deployment erfordert
zusätzlich den manuellen Deploy-Input, `PAGES_DEPLOYMENT_ENABLED=true`, `main` und ein
öffentliches Repository. Diese externe Freigabe ist nicht eingerichtet. Es gibt
keinen automatischen Tageslauf. Eine lokale grüne Prüfung belegt keinen Remote-CI-
oder Hosting-Erfolg.

Vor einem späteren öffentlichen Shell-Testdeployment: ersten Push separat freigeben,
Repository spätestens dann öffentlich schalten, Pages/Actions/Environment konfigurieren,
rechtliche Betreiberangaben klären und den Deployment-Schalter bewusst freigeben.
Die voraussichtliche spätere URL ist `https://bummber.github.io/evolvera/`; aktuell
nicht als funktionierende Website bestätigt. Build und Archivdateien liegen in
`dist/`, ohne zusätzliche Domainkonfiguration.

Cloudflare-Konto, Worker, GitHub App, feste numerische Betreiber-ID und serverseitige
Secrets sind später einzurichten. Der Browser bekommt keine Secrets. Keine Secrets
im Chat senden. Drittanbieter-Cookies sind für den geplanten Top-Level-Worker-Login
nicht erforderlich; dieser Ablauf ist noch nicht implementiert oder Ende zu Ende geprüft.

## Ergebnis und nächster Schritt

Für den Wiedereinstieg in diesem oder einem neuen Chat siehe
[docs/HANDOFF.md](docs/HANDOFF.md). Die Notiz enthält Stand, Grenzen und einen
kopierbaren Startauftrag für die gemeinsame Sichtung.

Die tatsächlichen lokalen Prüfergebnisse und offenen Grenzen stehen in
[docs/phase-0-results.md](docs/phase-0-results.md).
Nach der gemeinsamen Sichtung folgt als separat freizugebender Einrichtungsschritt
das öffentliche Testdeployment dieser Vorschau-Shell. **Phase 1 wird jetzt nicht
begonnen.** Deren späteres Arbeitspaket umfasst PRNG, mindestens drei Familien und
einen versionierten HTML-/CSS-Renderer mit reproduzierbarem Ruhezustand, weiterhin
getrennt vom offiziellen Archiv. Die offizielle Serie startet erst nach ausdrücklicher
Abnahme von 30–50 separaten Testwerken beider Modi und Festlegung des Startdatums.
