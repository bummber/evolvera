# Phase 0 – lokales Ergebnis

Stand: 27.10.2026. Projekt: `/Users/abrocker/ai_o_projects/evolvera/`.

## Umgesetzt

- Bestehenden Ordner und alle übergeordneten anwendbaren Projektanweisungen geprüft;
  keine vorhandenen `AGENTS.md` gefunden. Im Projekt lag nur `Evolvera_PRD_v1.0.md`.
- Remote erneut gelesen: `bummber/evolvera` privat und leer, keine Branch-Historie.
  Lokal war kein Git vorhanden. Git vor Ort auf `main` initialisiert und `origin`
  auf `https://github.com/bummber/evolvera.git` gesetzt. Kein Klon/Unterprojekt.
- Fachlich abgestimmtes PRD v1.1 vollständig gelesen und bytegleich als
  `docs/PRD.md` übernommen. Ausgangsversion v1.0 unverändert erhalten und in README
  ausdrücklich als historisch eingeordnet. Aktueller Auftrag bestimmt den Scope.
- React/Vite/TypeScript-Shell mit Heute, Galerie, Evolution, Werkdetail-Adressen,
  Über Evolvera und Einstellungen; Hash-Routing, mobile-first, klar als Vorschau.
- Validierbare, versionierte Werk-/DNA-/Herkunfts-/Konfigurationsverträge. Beide Modi,
  konkrete Quell-/Zielbelege, Elternprüfung, Werkdatum, Laufstart, Erstellungszeit,
  Nachholkennzeichnung und Einstellungssnapshot. Kein Kunstgenerator/Renderer.
- Modulgrenzen, Betreiberarchitektur, README, Projektregeln, exaktes Lockfile und
  vorbereitete CI-/gesperrte Pages-Konfiguration.

## Tatsächlich ausgeführte Prüfungen

| Prüfung                                                        | Ergebnis                                                                                                                         |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `npm install`, danach `npm ci --cache /tmp/evolvera-npm-cache` | Erfolgreich mit Node 24.21.0 / npm 12.2.0                                                                                        |
| `npm run format:check`                                         | Erfolgreich                                                                                                                      |
| `npm run lint`                                                 | Erfolgreich, keine Warnungen                                                                                                     |
| `npm run typecheck`                                            | Erfolgreich                                                                                                                      |
| `npm test`                                                     | 39 Tests in 3 Dateien erfolgreich                                                                                                |
| `npm run validate:data`                                        | Gültige deaktivierte Konfiguration, 0 offizielle Werke, konsistenter Index                                                       |
| `npm run build`                                                | Erfolgreich; HTML, CSS, JavaScript und Archivindex in `dist/`                                                                    |
| `npm run check`                                                | Gesamte lokale Prüfkette erfolgreich                                                                                             |
| `npm run dev -- --port 5173 --strictPort`                      | Vite startet; HTML und JSON HTTP 200; Oberfläche im integrierten Browser geprüft                                                 |
| `npm run preview -- --port 4173 --strictPort`                  | Produktionsbuild lokal erreichbar und im integrierten Browser geprüft                                                            |
| `npm run test:browser`                                         | Versucht; alle 6 Fälle durch Sandbox beim Chromium-Start blockiert, keine erfolgreiche Playwright-Ausführung                     |
| Integrierter Browser, tatsächliche 320 CSS-Pixel               | Alle Hauptseiten, aktive Navigation, deaktivierter Login und Werk-/Fehlerdirektlinks geprüft, jeweils kein horizontaler Überlauf |
| Originaldatei-/PRD-Vergleich                                   | v1.0-Hash unverändert, `cmp` von v1.1 gegen `docs/PRD.md` erfolgreich                                                            |

Zusätzlich geprüft: Auf der Desktop-DOM-Breite von 1280 CSS-Pixeln gibt es keinen
horizontalen Überlauf. Der Skip-Link ist per Tab/Enter erreichbar und setzt den
Fokus auf den Hauptinhalt. Die Git-Whitespaceprüfung des neuen Codes ist ohne
Befund; die unverändert übernommenen PRD-Dateien enthalten beabsichtigte
Markdown-Zeilenumbrüche mit zwei abschließenden Leerzeichen.

Die 39 Tests prüfen sinnvolle Vertragsfehler, konkrete Herkunftsbelege, beide Modi,
unmittelbare Vorgänger, unveränderlichen Konfigurationssnapshot, Berliner
Nachholmetadaten einschließlich beider Zeitumstellungen, Projektbasis, Archivfehler
und Hash-Direktnavigation. Das sind keine Generator-, Auth- oder Renderer-Abnahmetests.

Beim ersten Testlauf war die Vitest-Umgebung noch nicht auf `/evolvera/` gesetzt;
das wurde korrigiert. Ein Typfehler in einem Testselektor wurde ebenfalls behoben.
Nach der Neuinstallation wurde der laufende Devserver mit frischer
Abhängigkeitsoptimierung neu gestartet; danach war auch die Devansicht sichtbar.
Die oben erfolgreichen Prüfungen beziehen sich auf den korrigierten Stand.

## Konkrete Grenzen

Die macOS-Sandbox verweigert Chromiums Mach-Port-Registrierung
(`bootstrap_check_in … Permission denied`). Dadurch scheitern die sechs vorbereiteten
Playwright-Fälle vor dem eigentlichen Test. Sie müssen außerhalb dieser Sandbox
oder später in CI nochmals laufen. Die zusätzlichen integrierten Browserprüfungen
sind erfolgreich, ersetzen aber keinen grünen Playwright-Lauf. Browser-Archivfehler
sind nur in den erfolgreichen UI-Unit-Tests geprüft; die automatischen echten
Browserfehlerfälle sind noch offen. Kein Safari-/Firefox-Test, keine echte
Betreiberanmeldung, kein Cloudflare-/GitHub-Pages-Ende-zu-Ende-Test.

Der persönliche npm-Cache war in dieser Sandbox nicht beschreibbar; verwendet wurde
stattdessen ein Cache unter `/tmp`. npm 12 meldete blockierte Lifecycle-Skripte für
`esbuild` und `fsevents`; die benötigten Plattformpakete lagen dennoch vor und
Installation, Tests, Devserver und Build funktionierten ohne Freigabe dieser Skripte.
Die npm-Installationen meldeten 0 bekannte Schwachstellen zum Prüfzeitpunkt.

Das Schema prüft nachvollziehbare Datenbelege. Vollständige visuelle Sichtbarkeit,
Überdeckung und Kontrast müssen erst mit Renderer/Generator geprüft werden.
Die UI ist eine ehrliche Shell; Werkdarstellung, Pagination, Bewegung, echte
Abstammungsansicht und Titelgenerierung sind noch nicht implementiert.

## Extern offen

Erster Push und öffentliches Testdeployment benötigen einen späteren Auftrag.
Spätestens dafür Repository öffentlich schalten, Pages/Actions/Environment einrichten
und die dokumentierte Deploy-Sperre bewusst freigeben. Die Remote-CI wurde noch nicht
ausgeführt. Vor öffentlicher Veröffentlichung rechtliche Betreiberangaben klären.

Für die spätere Betreiberfunktion fehlen eine geprüfte Cloudflare-/Worker-Einrichtung,
GitHub App mit minimalen Rechten, Callback, verifizierte numerische Betreiber-ID und
serverseitige Secrets. Es wurde nichts registriert und keine Secrets angefordert.
Sie blockieren die lokale Phase 0 nicht. Architektur und Snapshot-/Konfliktregeln
stehen in `docs/architecture.md`.

## Erhaltener Zustand und nächster Schritt

Kein Push, kein Deployment, keine Sichtbarkeitsänderung und keine externe
Registrierung. `seriesStartDate` bleibt `null`, `generationEnabled` bleibt `false`,
Standardmodus `traceable`, Revision 1 und offizielles Archiv leer. Eine zusätzliche
Phase-0-Datenprüfung verhindert versehentliche Aktivierung oder Archivbefüllung.
Die offizielle Serie bleibt bis zur ausdrücklichen Abnahme von 30–50 separaten
Testwerken beider Modi und einer bewussten Startfreigabe gesperrt.

Nächster abgegrenzter Schritt: die lokale Phase-0-Vorschau gemeinsam sichten und die
blockierten Browserfälle in einer geeigneten Umgebung nachprüfen. Danach kann das
öffentliche Shell-Testdeployment separat freigegeben werden. Phase 1 (PRNG, mindestens
drei Kunstfamilien und versionierter HTML-/CSS-Renderer mit festem Ruhezustand) wird
hier ausdrücklich **nicht begonnen**.
