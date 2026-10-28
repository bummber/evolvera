# Architektur – Phase 0

Stand: 28.10.2026 (Betreiberarchitektur weiterhin Entwurf). Fachliche Quelle: [PRD v1.1](PRD.md). Der aktuelle Auftrag
umfasst inzwischen die lokale Phase 1 mit getrenntem Testatelier. Die folgenden Betriebsabläufe sind ein Entwurf,
keine implementierte Anmeldung, offizielle Tagesgenerierung oder getestete Cloud-Infrastruktur.

## Lokale Entscheidungen

React, Vite und TypeScript liefern eine statische mobile-first Shell. React Router
verwendet `HashRouter`; Werklinks haben das Format `/evolvera/#/werk/YYYY-MM-DD`.
Vite setzt `base: '/evolvera/'`. Alle öffentlichen Datenpfade gehen über `dataPath`
und `import.meta.env.BASE_URL`, z. B. `/evolvera/artworks/index.json`. Es gibt keine
Root-relative Annahme `/artworks/`. Ein Direktlink benötigt keinen SPA-Fallback.

CSS ist für die Oberfläche getrennt organisiert. Die zukünftige Kunst erhält
eigene, versionierte und abgeschirmte Styles. Die am 28.10.2026 ausgewählte Richtung A verwendet warme Papierfarben, große
Grotesktypografie, Zinnoberrot und ein redaktionelles Raster; mobil gibt es ein
tastaturbedienbares Aufklappmenü. Die Shell enthält keine Beispielkunst,
sondern eine beschriftete leere Bühne. Es werden keine externen Fonts, Bilder oder
Tracking-Dienste geladen. SVG, Canvas, WebGL und Bilddateien sind als Kunst verboten.

Node 24 LTS ist die Projektlinie, lokal geprüft mit 24.21.0; `.nvmrc` und CI nutzen
diese reproduzierbare Version, `engines` erlaubt kompatible Node-24-Updates. Sie
erfüllt die Engine-Anforderungen der installierten Vite-/Vitest-/ESLint-Versionen.
Ein späteres Sicherheitsupdate erfolgt ausdrücklich zusammen mit den Prüfungen.

Zod liefert strikte Laufzeitvalidierung und daraus abgeleitete TS-Typen; Vitest und
Testing Library prüfen Datenverträge und Navigation; Playwright prüft den echten
Produktionsbuild auf Desktop und 320px Mobilbreite. ESLint und Prettier halten den
Code konsistent. Abhängigkeiten sind exakt gepinnt, das npm-Lockfile wird versioniert.

## Modulgrenzen

| Modul                      | Verantwortung / Stand                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `src/app`, `src/styles`    | Shell, Testatelier, Navigation und Layout A; implementiert                               |
| `src/art/schema`           | Werk-, DNA-, Herkunfts-, Konfigurations- und getrennte Previewverträge                   |
| `src/art/generator`        | Preview-Generator 0.1.0 mit PRNG und drei Familien; kein offizieller Lauf oder Evolution |
| `src/art/titles`           | Separater Titelvertrag; noch kein Lexikon oder Algorithmus                               |
| `src/art/renderer`         | Renderer V1 mit gemeinsamer Kunstfläche, festen Ruhevorschauen und Wiedergabesteuerung   |
| `src/archive`              | Validierter Indexzugriff; noch kein schreibendes Archivmodul                             |
| `src/operator`             | Validierte öffentliche Voreinstellung und reiner Snapshot-Helfer                         |
| `workers/admin`            | Reservierter Ort mit README; noch kein Worker, Auth oder API                             |
| `scripts/validate-data.ts` | Config-/Archivprüfung und Serienfreigabesicherung; Previewvergleich separat ergänzt      |

Das Frontend darf weder generieren noch archivieren. Der Generator darf keine React-
oder Browser-Abhängigkeit benötigen. Archivdateien speichern die finalen Parameter;
Frontend und Renderer würfeln sie nicht neu aus. `tests/fixtures` enthält nur
synthetische Schema-Prüfdaten und wird weder publiziert noch in den Index aufgenommen.
Die späteren 30–50 Testwerke sind ein eigener, noch nicht begonnener Arbeitsschritt.

## Datenverträge und Grenzen der Validierung

`schemaVersion`, `generatorVersion`, `rendererVersion` und `lexiconVersion` sind
explizit. Werkdatum (`id`), geplanter Termin (`scheduledFor`), Laufstart
(`runStartedAt`) und tatsächliche Erstellung (`generatedAt`) sind getrennt. Alle
Termine haben einen Offset; `scheduledFor` muss um 04:00 am Werkdatum in
`Europe/Berlin` liegen. `isCatchUp` richtet sich nach dem Laufstart im nächsten
Berliner Tageszyklus, einschließlich Sommer-/Winterzeit. Spätes Fertigstellen
allein macht ein Werk nicht zu einer Nachholung. Das ist Metadatenprüfung, noch
keine Berechnung fälliger Werke oder Automatisierung.

Der initiale DNA-Vertrag beschränkt sich auf benannte Formen, Hexfarben und
begrenzte Zahlen. Freies CSS, URLs, Markup und ausführbarer Inhalt sind nicht
zulässig. Der Vertrag begrenzt auf 120 Elemente und schließt Nullflächen und
vollständige Transparenz aus. Erweiterungen erfolgen später versionsbewusst.

Generation 1 und 2 sind unabhängig. Danach sind genau zwei unterschiedliche,
chronologisch ältere Eltern nötig. `validateArtwork` prüft zusätzlich geladene
Eltern gegen die beiden unmittelbar vorherigen Generationsnummern. Auch `free`
protokolliert beide ausgewerteten Eltern; eine Mindestübernahme gilt dort nicht.

Vererbungsbelege enthalten Eltern-ID, konkrete Quell-/Zielpfade und Werte sowie
einen überprüfbaren Kopier- oder numerischen Offset-Operator. Quellwerte werden mit
der gespeicherten Eltern-DNA verglichen, Zielwerte mit dem Kind. Nur sichtbare
Gestaltungsfelder kommen als Belegpfade infrage; Titel oder bloße IDs zählen nicht.
`traceable` fordert Belege beider Eltern. Die vollständig sichtbare Wirkung, Kontrast,
Überdeckung und die Prüfung nach Qualitäts-Retries müssen in Phase 1/2 zusätzlich
mit Renderer und Generator nachgewiesen werden. Das Schema allein behauptet keine
visuelle Garantie. Neue Operatoren und Gestaltungsfelder brauchen eigene Prüfungen.

Historische Renderer müssen archivierte Komposition, Farben, Bewegungsregeln und
sichtbaren Ruhezustand erhalten. Eine gemeinsame logische 1:1-Fläche skaliert später
auch Blur, Schatten, Linien und Bewegung mit. Alte Daten werden nicht still migriert.

## Vorgesehene Betreiberanmeldung (spätere Phase 4)

Entscheidung: Die Galerie verlinkt über eine **Navigation auf oberster Ebene** zur
kleinen Oberfläche auf der Worker-Origin, beispielsweise `https://<worker>/settings`.
Keine eingebettete Anmeldung, kein iframe, keine Cookie-abhängigen Cross-Origin-
Browseraufrufe. Der Worker enthält einen festen Rücklink zur öffentlichen Galerie.
So bleiben Login, Callback, Sitzung und Speichern in derselben Worker-Origin und
benötigen keine Drittanbieter-Cookies. In Phase 0 existiert noch kein solcher Link,
weil keine echte Worker-Adresse eingerichtet wurde.

Vorgesehener Ablauf:

1. `GET /login` erzeugt kryptografisch zufälliges, kurzlebiges und einmaliges `state`
   und einen PKCE-S256-Verifier. Die Bindung an den Browser wird serverseitig in
   einem konsistenten Sitzungsspeicher gehalten; eine sichere Cookie-Kennung verweist
   darauf. Der Wechsel zu GitHub erfolgt als Top-Level-Navigation.
2. GitHub liefert den Authorization Code an einen fest registrierten HTTPS-Callback
   **am Worker** (`/auth/callback`), nicht an ein Hash-Fragment der Galerie. Der
   Worker prüft State-Bindung, Ablauf und Einmalverwendung und tauscht den Code nur
   serverseitig aus. PKCE-Unterstützung und exakte Anbieterparameter werden vor der
   Implementierung erneut anhand aktueller Dokumentation geprüft.
3. Der Worker fragt die GitHub-Identität serverseitig ab. Nur die bei Einrichtung
   verifizierte **numerische Konto-ID des Betreibers** ist zugelassen. Der Name
   `bummber` ist ein Hinweis, keine ausreichende Autorisierungsprüfung. Alle anderen
   GitHub-Konten erhalten keinen Betreiberzugang.
4. Geplant ist eine kurzlebige, widerrufbare opaque Sitzung mit zufälliger ID.
   `__Host-`-Cookie: `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, keine Domain.
   Transaktions-/Sitzungszustand soll konsistent serverseitig verwaltet werden
   (z. B. ein Durable Object; Free-Limits und Einrichtung vorab prüfen). Tokens
   bleiben ausschließlich serverseitig; ein Browsercookie trägt nur eine Zufalls-ID.
   Code-/Token-URLs werden unmittelbar auf eine saubere URL umgeleitet; sensible
   Antworten nutzen `Cache-Control: no-store`, keine Tokens in Logs oder Referrern.
5. Jeder Schreibendpunkt prüft aktive Sitzung, Betreiber-ID, CSRF-Token und eine
   exakte erlaubte Origin. Nur `POST /settings/mode` mit streng validiertem Modus
   und erwarteter Revision; keine fremden Pfade oder generischen Repo-Schreib-APIs.
   `POST /logout` invalidiert die serverseitige Sitzung und entfernt den Cookie.
   Abgelaufene/widerrufene Sitzungen dürfen nicht mehr schreiben.

Eine ausschließlich auf `bummber/evolvera` installierte GitHub App wird vorgesehen.
Berechtigung nur soweit benötigt: Repository Contents read/write und notwendige
Metadaten. Keine Administration, Workflows oder Rechte auf andere Repositories.
Für Repositoryschreiben verwendet der Worker kurzlebige Installationstokens; die
Benutzerautorisierung und die feste ID-Prüfung bleiben davon getrennt. GitHub kann
Contents-Rechte nicht auf einen Dateipfad beschränken: Die zusätzliche Pfadgrenze
`config/generation.json` muss zwingend im Worker-Code durchgesetzt und getestet werden.
App-Schlüssel, Client Secret und Sitzungsschlüssel kommen in Worker-Secrets, niemals
in `VITE_*`, Git, Werkdaten, Logs oder `localStorage`. Secrets nicht im Chat erfragen.

## Konfliktfeste Git-Speicherung des Modus

Der Worker liest vor dem Schreiben die aktuelle Datei samt Blob-SHA vom festen
Branch `main`. Er validiert Schema und erwartete `revision`. Nur `inheritanceMode`
wird geändert, `revision` um eins erhöht. Startdatum, Aktivierung, Zeitzone und
sämtliche Archivdateien bleiben identisch. Bedingtes Schreiben über die GitHub
Contents API sendet die zuvor gelesene SHA. Konflikte, veraltete Revisionen und
unklare Antworten ergeben einen sichtbaren Fehler, keine Erfolgsmeldung. Die
Oberfläche bestätigt erst den serverseitig verifizierten neuen Git-Stand und nennt
„Ab dem nächsten Generierungslauf“. Keine lokalen Browser-Schalter als Ersatz.

Bei einem Konflikt frischen Stand lesen und dem Betreiber erneut anzeigen; keine
blinde Wiederholung mit neuer SHA, keine Force-Pushes und kein Überschreiben fremder
Änderungen. Ein Worker-Ausfall darf Galerie und Generator nicht blockieren: Git bleibt
die dauerhafte Quelle der zuletzt gültigen Einstellung.

## Snapshot am Generierungsstart und späterer Betrieb

Nach dem Erhalt einer gemeinsamen exklusiven Generator-/Publish-Sperre lädt der
Runner einen **frischen** `main`-Stand, prüft die Konfiguration und friert Modus und
Revision genau einmal ein. `snapshotSettings` ist jetzt nur der reine, eingefrorene
Kopierhelfer; Lock, frischer Checkout und Runstart sind noch nicht implementiert.
Der Snapshot gilt auch für alle Werke eines Nachhollaufs. Änderungen während dieses
Laufs gelten erst für einen späteren Lauf. Jedes Werk speichert verwendeten Modus
und Revision; Archivdetails lesen sie aus dem Werk, nicht aus der aktuellen Config.

Der spätere Workflow berechnet fällige Berliner Tage, prüft Archiv und volle
Git-Historie, stellt bereits archivierte beschädigte/gelöschte Dateien exakt wieder
her und erzeugt nur nie archivierte fällige Werke chronologisch. Auch am Serienende
sind gelöschte Dateien Schäden, kein Grund für Neuauswürfelung. Bei unsicherer
Wiederherstellung stoppen Generierung und defekte Veröffentlichung.

Vor Commit werden alle neuen Dateien/Index gemeinsam validiert. Bei parallel
geändertem Branch wird einmal kontrolliert neu integriert; bereits begonnene
Generierung behält ihren Snapshot. Keine Teilstände, keine Force-Pushes. Derselbe
Workflow archiviert **und** baut/deployt den validierten Commit, weil ein
`GITHUB_TOKEN`-Push keinen weiteren Publish-Lauf zuverlässig auslöst. Fehlerhaftes
Deployment wird mit denselben archivierten Werken wiederholt. Die letzte funktionierende
Veröffentlichung bleibt erhalten.

Geplanter Tageszeitpunkt ist 04:00 `Europe/Berlin`, ohne harte Verfügbarkeitsgarantie.
Phase 0 enthält absichtlich **keinen** Schedule, Generatorstart oder Repo-Schreiber.

## Vorbereitete CI und Pages

`ci.yml` prüft Installierbarkeit, Format, Lint, Typen, Tests, Daten und Build sowie
den gebauten Stand in Chromium. `pages.yml` kann später manuell denselben Stand
bauen und ein Pages-Artefakt vorbereiten. Tatsächlicher Deploy ist dreifach gesperrt:
manueller Input `deploy=true`, Repositoryvariable `PAGES_DEPLOYMENT_ENABLED=true`
und öffentliches Repository; zusätzlich nur `main`. Die Variable wurde nicht gesetzt.
Der Workflow prüft vor dem Deployment auf einen neueren Branch-Stand. Es gab keine
Remote-CI und kein Deployment in Phase 0. Der spätere Generator-/Publish-Workflow
benötigt zusätzlich den oben beschriebenen Snapshot-/Konfliktablauf.

## Externe Voraussetzungen – ausdrücklich offen

- Separat freizugebender erster Push; spätestens zum ersten öffentlichen Shell-
  Testdeployment Repository öffentlich schalten. Aktuell privat und remote leer.
- GitHub Pages auf GitHub Actions konfigurieren, Environment/Branchschutz und Rechte
  prüfen; anschließend erst die Deploy-Sperre bewusst freigeben. Die mögliche spätere
  URL `https://bummber.github.io/evolvera/` ist noch nicht veröffentlicht/geprüft.
- Rechtliche Betreiber-/Datenschutzangaben vor öffentlichem Betrieb klären.
- Cloudflare-Konto, Worker-Adresse, konsistenter Sitzungsspeicher und kostenlose
  Nutzungslimits prüfen. Keine kostenpflichtige Aktivierung ohne Entscheidung.
- GitHub App, Callback, Installation ausschließlich auf dieses Repository,
  numerische Betreiber-ID und Secrets außerhalb des Chats einrichten.
- Echte Autorisierung, CSRF, Logout, Konflikte und blockierte Drittanbieter-Cookies
  vor Auth-Abnahme Ende zu Ende testen.
- Vor offiziellem Serienstart 30–50 getrennte Testwerke aus beiden Modi mit
  Beispielketten ausdrücklich abnehmen; erst danach Datum und Aktivierung festlegen.

## Technische Quellen

Am 27.10.2026 zur Architekturplanung geprüft; vor der jeweiligen Einrichtung erneut
prüfen. Die Kombination zu diesem Ablauf ist eine eigene Architekturentscheidung,
kein bereits getesteter Anbieter-Workflow.

- [Vite – Einstieg und Node-Anforderungen](https://vite.dev/guide/)
- [Node – Releaseplan der unterstützten Linien](https://github.com/nodejs/Release)
- [GitHub – benutzerdefinierte Pages-Workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub – GitHub-App-Benutzertokens und Web-Flow](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub – Contents API und bedingtes Schreiben mit SHA](https://docs.github.com/en/rest/repos/contents)
- [Cloudflare – Worker-Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

## Ergänzung Phase 1 – lokale Preview-Pipeline

`generateStudy` ist eine reine TypeScript-Funktion mit Seed und Familie als Eingaben.
Generator 0.1.0 benutzt FNV-1a/Mulberry32 und gibt validierte, datumslose Preview-DNA
zurück. Drei Familien und zwölf gespeicherte Beispiele liegen getrennt vom Archiv
in `fixtures/preview`. Der reguläre Build vergleicht diese Referenzen deterministisch.
Die offizielle Generierung bleibt deaktiviert; es gibt keine Evolution oder Titel.

Renderer V1 ist jetzt implementiert: CSS-Module mit expliziten Resets, eine logische
1000×1000-Fläche mit einheitlichem Skalierungsfaktor und feste Ruhevorschauen.
Geometrie und Bewegung werden auf derselben Ebene skaliert. Animationen nur im
Hauptwerk, reduzierte Bewegung und manuelles Pausieren werden beachtet. Die Preview-
route lädt Generator/Renderer und Vorschau-DNA erst bei Bedarf. V1 und seine
Referenzdaten müssen bei späteren Erweiterungen erhalten werden.

Implementierungsdetails und Prüfgrenzen stehen in `docs/phase-1-results.md`.
