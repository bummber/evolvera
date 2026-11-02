# Betreiberanmeldung – konkrete Einrichtungsvorlage

Stand: 02.11.2026. **Nur Vorbereitung der Betreiberfunktion, keine Worker-/App-Einrichtung
oder Aktivierungsfreigabe.** Das Cloudflare-Konto besteht inzwischen; die lesende
Codex-MCP-Verbindung wurde separat beauftragt und erfolgreich geprüft. Details im
[Übergabestand](HANDOFF.md#cloudflare-mcp-und-lokale-entwicklungswerkzeuge).
Die vorhandene Implementierung in `workers/admin` wird
weiterverwendet. Phase 4 bleibt offen; Serienstart und EP-01 gehören nicht hierzu.

## Geprüfter Ausgangsstand

- `origin`: `https://github.com/bummber/evolvera.git`, `main`. GitHub-API bestätigt
  öffentliches Repository und Remote-Commit `9ad1fa797210680e4348e2da5c487c2b37037960`.
  Lokal liegen Dokumentationscommit `5056ed7` und die anschließende Vorbereitung
  zusätzlich vor; nicht gepusht. Den genauen Commitstand mit Git prüfen.
- GitHub-API: `PAGES_DEPLOYMENT_ENABLED=true`, Tagesautomatisierungsvariable nicht
  gesetzt. `main` meldet `protected:false`, keine Repository-Rulesets. Keine
  Schutzregeln verändert; später bei Einrichtung erneut lesen.
- `users/bummber`: Typ `User`, numerische ID **`46008719`**. Vor Hinterlegung mit
  dem tatsächlich angemeldeten Betreiberkonto abgleichen; nicht aus dem Namen ableiten.
- `ENABLED=false`, `ADMIN_ORIGIN` leer, Galerie-`adminOrigin:null`. Keine produktive
  Worker-Konfiguration oder GitHub-App-Installation eingerichtet. Cloudflare-MCP
  liest erfolgreich genau ein Konto; der Workers-Tarif ist noch nicht geprüft.
  Keine Secrets gelesen.
- Generation aus, Startdatum null, Serienfreigabe false, Modus `traceable`, Revision 1.
  Die unversionierte `PRD_v1.1_backup.md` bleibt erhalten und außerhalb des Commits.

## Vorschlag und benötigte Rechte

Für das nichtkommerzielle Testprojekt bietet sich die Adresse
`https://evolvera-admin.<bestätigte-account-subdomain>.workers.dev` an. Die tatsächliche
Subdomain ist offen. Das braucht keine eigene Domain und keine DNS-Umstellung.
`workers_dev:false` wird erst bei beauftragtem Deployment bewusst geändert;
`preview_urls:false` bleibt bestehen. Keine zusätzliche Cloudflare-GitHub-Buildintegration.

| Dienst                | Konkreter Umfang der späteren Freigabe                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare            | Bestehendes Konto und Workers-Free-Tarif zuerst lesend prüfen. Für die erstmalige Workeranlage nennt Cloudflare Workers-`Admin` auf Produktebene im gewählten Konto; nach Anlage genügt für Updates `Editor` nur auf `evolvera-admin`. Durable Objects folgen den Rechten des implementierenden Workers. Keine neue Rolle oder API-Token ohne gesonderte Freigabe erstellen. |
| GitHub App            | Registrierung im persönlichen Konto `bummber`, Installierbarkeit **Only on this account**. Installation **Only select repositories → evolvera**. Repository **Contents: Read and write**, automatisch erforderliche **Metadata: Read-only**; keine weiteren Repository-, Konto- oder Organisationsrechte.                                                                    |
| GitHub-Administration | Der Betreiber registriert/installiert die App mit seinem vorhandenen Konto. Die App selbst erhält keine Administration-, Actions-, Workflows- oder Pages-Rechte und keinen Branchschutz-Bypass.                                                                                                                                                                              |
| Secrets               | Später zwei Worker-Secrets eingeben und App-Schlüssel erzeugen; sichere Eingabe beim Anbieter bzw. lokal, niemals im Chat. Secretänderungen können ein Deployment auslösen und brauchen deshalb eine entsprechende Freigabe.                                                                                                                                                 |

GitHubs `Contents`-Recht ist **keine Dateipfadberechtigung**. Die App kann damit
Repository-Inhalte weitergehend verändern, als es der Worker zulässt. Unser Code
begrenzt den Schreibpfad auf `config/generation.json` in `main`, Modus und Revision;
das ersetzt keine Beschränkung auf Anbieterseite. Diesen verbleibenden Umfang bei
der App-Freigabe ausdrücklich berücksichtigen. Ein PAT ist hierfür nicht vorgesehen.

## Auszufüllende Einrichtungskarte

| Feld                                 | Wert / Herkunft                                                                                                                                                         |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare-Konto / Tarif             | Konto vorhanden und per MCP lesend erkannt; konkreter Workers-Free-Tarif noch zu prüfen, kein kostenpflichtiger Wechsel                                                 |
| Worker / Speicher                    | `evolvera-admin`; Binding `SESSIONS`, Klasse `Sessions`, Migration `v1`, `new_sqlite_classes` bereits vorhanden; keine D1-/KV-Datenbank anlegen                         |
| `ADMIN_ORIGIN`                       | Bestätigte vollständige HTTPS-Origin ohne Pfad oder abschließenden Slash                                                                                                |
| App-Name                             | Vorschlag `Evolvera Betreiber bummber`; weltweite Verfügbarkeit bei Registrierung prüfen                                                                                |
| Homepage URL                         | `https://bummber.github.io/evolvera/`                                                                                                                                   |
| Callback URL                         | Exakt `<ADMIN_ORIGIN>/auth/callback`; kein Pages-Hash und keine zusätzliche Test-URL                                                                                    |
| Oberfläche / Login                   | `<ADMIN_ORIGIN>/settings` / `<ADMIN_ORIGIN>/login`, jeweils Top-Level-Navigation                                                                                        |
| App-Optionen                         | Webhooks inaktiv, keine Events, Device Flow aus, Setup URL leer; OAuth während Installation aus, Login später explizit starten; ablaufende User-Tokens aktiviert lassen |
| `OWNER_ID`                           | `46008719`, nach Betreiberabgleich                                                                                                                                      |
| `GITHUB_CLIENT_ID` / `GITHUB_APP_ID` | Nichtgeheime Kennungen aus der neu freigegebenen App-Registrierung                                                                                                      |
| `GITHUB_INSTALLATION_ID`             | Tatsächliche Installation für `bummber/evolvera` prüfen; nicht mit App-ID verwechseln                                                                                   |
| `GITHUB_CLIENT_SECRET`               | Ausschließlich Cloudflare-Secret, Wert nicht dokumentieren                                                                                                              |
| `GITHUB_PRIVATE_KEY_PKCS8`           | Ausschließlich Cloudflare-Secret, RSA-Schlüssel in PKCS#8; geschützte lokale Konvertierung siehe Runbook                                                                |
| `ENABLED` / Galerie-Link             | Bleiben `false` / `null` bis zur jeweiligen Aktivierungs-/Veröffentlichungsfreigabe                                                                                     |

App-ID, Client-ID, Installation und Worker-Origin existieren noch nicht als bestätigte
Einrichtungswerte. Keine erfundenen Werte in die ausführbare Konfiguration eintragen.

## Reihenfolge der getrennt freizugebenden Aktionen

1. **Als Nächstes besprechen:** Im nun vorhandenen Cloudflare-Konto den konkreten
   Workers-Free-Tarif und die gewünschte Account-Subdomain prüfen. MCP ist mit den
   Basisrechten `offline_access`, `user:read`, `account:read` verbunden; weitergehende
   Lese-/Schreibrechte sind nicht freigegeben. Tarif alternativ im Dashboard ansehen.
   Keine Berechtigungserweiterung oder Tarifänderung aus dieser Vorlage ableiten.
2. **App-Einrichtung:** Nach Bestätigung der Origin und der oben genannten Rechte
   App registrieren, nur auf `evolvera` installieren, IDs abgleichen. Privaten Schlüssel
   und Client-Secret nur im freigegebenen sicheren Ablauf erzeugen/übertragen. Diese
   Freigabe umfasst noch kein Worker-Deployment und keinen Repository-Push.
3. **Datenschutz vor Aktivierung:** [Datenfluss und Textentwurf](operator-privacy-draft.md)
   mit dem tatsächlichen Konto, Anbieterrollen, Bedingungen und Origin vervollständigen.
   Hinweise in Galerie **und auf der Worker-Seite vor dem Login** erreichbar machen.
   Publikationsschema/-prüfung um diesen eigenständig bestätigten Prüfumfang ergänzen;
   die Pages-Durchsicht vom 02.11. gilt dafür nicht automatisch. Die fertige Fassung
   vor Aktivierung gezielt zur Veröffentlichung freigeben lassen.
4. **Deployment gesondert:** Prüfergebnis und konkrete Worker-Konfiguration zeigen;
   erst nach Auftrag hochladen. Falls zunächst deaktiviert bereitgestellt, liefert
   `/health` weiterhin 503/`configurationReady:false`. `wrangler secret put` und
   `wrangler secret delete` deployen laut Anbieter sofort; auch Dashboard-Secretänderungen
   benötigen dort Deploy. Sie sind kein rein lokaler Vorbereitungsschritt.
5. **Direkte Anmeldeprüfung gesondert:** Nach Datenschutzfreigabe und ausdrücklicher
   Aktivierungsfreigabe `ENABLED=true` setzen; Galerie-Origin kann für die direkte
   Workerprüfung noch null bleiben. Erst jetzt ist ein echter Login möglich. Ein
   vorheriger 503-Test ist keine Auth-Abnahme. `/health` 200 bestätigt nur strukturelle
   Konfiguration, nicht GitHub-Rechte oder erfolgreichen Login.
6. **Speichertest und Pages gesondert:** Ein echter Moduswechsel schreibt auf `main`
   und löst derzeit automatisch CI/Pages aus. Vorher den konkreten Test samt
   Veröffentlichungsfolge freigeben lassen. Beispielsweise `traceable → free → traceable`
   mit zwei dauerhaften Revisionsschritten; keine History-Umschreibung zum Aufräumen.
   Gleichen Modus erneut speichern erzeugt keinen Commit und prüft den Schreibzugriff
   nicht vollständig. Auch Push der Datenschutz-/Galerie-Origin-Änderungen ist eine
   Veröffentlichung und braucht Freigabe, einschließlich des bisher lokalen Nachtrags.

## Abnahme und Abbruch

Live offen: nur Betreiber-ID zugelassen, fremdes echtes Konto abgewiesen (falls
verfügbar), PKCE/State/Einmalverbrauch, Ablauf nach einer Stunde und Logout,
CSRF/exakte Origin, Git-SHA-/Revisionskonflikt und Commitverifikation. Ablauf mit
blockierten Drittanbieter-Cookies wiederholen; Sitzung bleibt auf der Worker-Origin.
Fremdkonto oder Fehlerpfade nicht ungefragt durch neue Konten oder Produktionsschäden
herstellen. Fehlende reale Nachweise als offen dokumentieren.

Kein Abschwächen von Berechtigungs-/Branchschutz bei Fehlern, kein automatisches
Tarifupgrade. Bei fehlgeschlagenem Speichern zuerst Git-Stand prüfen; ein Commit kann
trotz fehlender Bestätigung existieren. Worker deaktivieren/Route zurücknehmen nur
im passenden Betreiberauftrag, App-Installation bei Bedarf sperren. Galerie bleibt
unabhängig erreichbar. Archiv und Seriengates bleiben bei sämtlichen Tests erhalten.

## Anbietergrundlagen, am 02.11.2026 gelesen

- [Workers Free](https://developers.cloudflare.com/workers/platform/pricing/): 100.000 Requests/Tag, 10 ms CPU pro Aufruf; reale Auth-Last noch nicht gemessen.
- [SQLite-Durable-Objects Free](https://developers.cloudflare.com/durable-objects/platform/pricing/): 100.000 Requests/Tag, 13.000 GB-s/Tag, 5 Mio. gelesene und 100.000 geschriebene Zeilen/Tag, 5 GB insgesamt. Bei Limitüberschreitung schlagen weitere Operationen fehl.
- [Workers-Rollen](https://developers.cloudflare.com/workers/authorization/workers/) und [Durable-Objects-Rechte](https://developers.cloudflare.com/workers/authorization/durable-objects/): konkrete Konto-/Werkzeugunterstützung beim Einrichten abgleichen; keine pauschale OAuth-Zustimmung ungeprüft erteilen.
- [workers.dev](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/): für persönliche Hobbyprojekte geeignet; hier vorgeschlagen, noch nicht ausgewählt.
- [Worker-Secrets und unmittelbare Deployments](https://developers.cloudflare.com/workers/configuration/secrets/).
- [GitHub-App registrieren](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app), [minimale Rechte](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app) und [User-Login mit PKCE](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app).
