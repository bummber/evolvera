# Betreiberanmeldung – konkrete Einrichtungsvorlage

Aktueller Stand 03.11.2026: Der separat freigegebene erste Worker-Upload ist
abgeschlossen. `evolvera-admin` ist mit beiden Secrets, SQLite-Sitzungsspeicher und
Anmeldeaktivierung nur für `bummber` öffentlich erreichbar. Health meldet bereit,
Rechtstexte geprüft. Der Betreiber bestätigt den erfolgreichen GitHub-Login und
sichtbare Einstellungen, ohne etwas gespeichert zu haben. Modusspeicherung und
umfassende Sitzungsprüfung bleiben offen.
[Ergebnis und genaue Grenzen](operator-first-upload.md#freigegeben-und-ausgeführt--03112026).
Die folgenden Abschnitte dokumentieren frühere Vorbereitungsstände; deren
Erstuploadfreigabe ist erledigt. Galerie-Origin bleibt null, kein Pages-Push.

Vorheriger Nachtrag 03.11.2026: [Lokale Anbieterprüfung abgeschlossen](provider-review.md),
`providerReviewedOn:2026-11-03`. Textfassung und Origin unverändert. Die unten
beschriebene offene Kontoprüfung ist damit für die lokale Vorbereitung erledigt;
Secrets, Schreibrechte, Upload und Aktivierung bleiben separat zu beauftragen.

Stand: 03.11.2026. **GitHub App separat freigegeben, registriert und installiert;
keine Worker-/Secret-Einrichtung oder Aktivierungsfreigabe.** Das Cloudflare-Konto besteht; die lesende
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
- GitHub `/user` am 03.11.2026: angemeldetes Konto **`bummber`**, numerische ID
  **`46008719`**. Remote-Commit erneut lesend als `9ad1fa7` bestätigt.
- `ENABLED=false`, `ADMIN_ORIGIN` leer, Galerie-`adminOrigin:null`. Keine produktive
  Worker-Konfiguration eingerichtet. GitHub App am 03.11. separat beauftragt und nur
  auf `bummber/evolvera` installiert; Kennungen und Nachweis unten. Cloudflare-MCP
  liest am 03.11. erneut erfolgreich genau ein Konto. Im vorhandenen Dashboard ist
  **Workers Free** als „Current plan“ bestätigt: 0 US-Dollar, 100.000 Requests/Tag,
  10 ms CPU pro Aufruf. Keine Tarifänderung oder zusätzlichen MCP-Rechte.
  Keine Secrets gelesen.
- Generation aus, Startdatum null, Serienfreigabe false, Modus `traceable`, Revision 1.
  Die unversionierte `PRD_v1.1_backup.md` bleibt erhalten und außerhalb des Commits.

## Vorschlag und benötigte Rechte

Im Dashboard ist `alexander-brocker.workers.dev` bereits als Account-Subdomain vorhanden;
die Workers-&-Pages-Übersicht meldet noch keine Projekte. Der Betreiber hat am 03.11.
für die Einrichtungsvorlage die Adresse
`https://evolvera-admin.alexander-brocker.workers.dev` ausgewählt. Die vollständige
Worker-Adresse ist noch nicht eingerichtet oder auf Erreichbarkeit geprüft.
Das braucht keine eigene Domain und keine DNS-Umstellung.
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
| Cloudflare-Konto / Tarif             | Konto per MCP lesend erkannt; Workers Free am 03.11.2026 im Dashboard als aktueller Tarif bestätigt, kein kostenpflichtiger Wechsel                                     |
| Worker / Speicher                    | `evolvera-admin`; Binding `SESSIONS`, Klasse `Sessions`, Migration `v1`, `new_sqlite_classes` bereits vorhanden; keine D1-/KV-Datenbank anlegen                         |
| `ADMIN_ORIGIN`                       | Für die Vorlage ausgewählt: `https://evolvera-admin.alexander-brocker.workers.dev`; ausführbare Konfiguration weiterhin leer                                            |
| App-Name                             | `Evolvera Betreiber bummber`, registriert im Konto `bummber`; Slug `evolvera-betreiber-bummber`                                                                         |
| Homepage URL                         | `https://bummber.github.io/evolvera/`                                                                                                                                   |
| Callback URL                         | Exakt `<ADMIN_ORIGIN>/auth/callback`; kein Pages-Hash und keine zusätzliche Test-URL                                                                                    |
| Oberfläche / Login                   | `<ADMIN_ORIGIN>/settings` / `<ADMIN_ORIGIN>/login`, jeweils Top-Level-Navigation                                                                                        |
| App-Optionen                         | Webhooks inaktiv, keine Events, Device Flow aus, Setup URL leer; OAuth während Installation aus, Login später explizit starten; ablaufende User-Tokens aktiviert lassen |
| `OWNER_ID`                           | `46008719`, am 03.11.2026 gegen das tatsächlich angemeldete GitHub-Konto `bummber` abgeglichen                                                                          |
| `GITHUB_CLIENT_ID` / `GITHUB_APP_ID` | `Iv23liYblHBrFsNZZllG` / `5595636`, nach erfolgreicher Registrierung bei GitHub abgelesen                                                                               |
| `GITHUB_INSTALLATION_ID`             | `178198041`; erfolgreiche Installation auf `bummber`, ausgewählt ausschließlich `bummber/evolvera`                                                                      |
| `GITHUB_CLIENT_SECRET`               | Ausschließlich Cloudflare-Secret, Wert nicht dokumentieren                                                                                                              |
| `GITHUB_PRIVATE_KEY_PKCS8`           | Ausschließlich Cloudflare-Secret, RSA-Schlüssel in PKCS#8; geschützte lokale Konvertierung siehe Runbook                                                                |
| `ENABLED` / Galerie-Link             | Bleiben `false` / `null` bis zur jeweiligen Aktivierungs-/Veröffentlichungsfreigabe                                                                                     |

App-Registrierung und Installation wurden ausdrücklich freigegeben und am 03.11.
abgeschlossen. GitHub bestätigt die Installation; die persistierte Einstellungsseite
zeigt **Only select repositories**, genau **bummber/evolvera**, **Metadata read-only**
und **Contents read/write**. Keine weiteren Rechte oder Repositories ausgewählt.
Die App ist nur auf dem eigenen Konto installierbar. Nach GitHub-Sudo-Abfrage hat
der Betreiber die erneute Anmeldung selbst durchgeführt.

[App-Einstellungen](https://github.com/settings/apps/evolvera-betreiber-bummber),
[persistierte Installation](https://github.com/settings/installations/178198041).
GitHub ließ die Installation ohne privaten Schlüssel abschließen. Kein privater
Schlüssel oder Client-Secret erzeugt, gelesen oder übertragen; keine echte
Anmeldung oder GitHub-Schreibprüfung. Kennungen und ausgewählte Origin nur hier
dokumentiert; ausführbare Konfiguration weiterhin unverändert. Secretanlage,
Cloudflare-Berechtigungen, Veröffentlichung und Aktivierung nicht beauftragt.

## Reihenfolge der getrennt freizugebenden Aktionen

1. **Am 03.11. erledigt:** Workers Free und vorhandene Account-Subdomain im Dashboard
   lesend geprüft; Betreiber hat die oben genannte Worker-Origin für die Vorlage
   ausgewählt. MCP behält ausschließlich die Basisrechte `offline_access`, `user:read`,
   `account:read`; Tarif-/Worker-API mit zusätzlichen Rechten nicht verwendet.
   Keine Berechtigungserweiterung oder Tarifänderung aus dieser Vorlage ableiten.
2. **App-Einrichtung am 03.11. erledigt:** Nach ausdrücklicher Freigabe registriert,
   ausschließlich auf `evolvera` installiert, IDs und persistierten Umfang geprüft.
   Privaten Schlüssel und Client-Secret erst im noch gesondert freizugebenden sicheren
   Ablauf erzeugen/übertragen. Kein Worker-Deployment oder Repository-Push freigegeben.
3. **Datenschutz vor Aktivierung:** [Datenfluss und Textentwurf](operator-privacy-draft.md)
   mit dem tatsächlichen Konto, Anbieterrollen, Bedingungen und Origin vervollständigen.
   Hinweise sind lokal in Galerie **und auf der Worker-Seite vor dem Login** umgesetzt.
   Publikationsschema/-prüfung und direktes Worker-Aktivierungsgate sind ergänzt;
   die Pages-Durchsicht vom 02.11. gilt dafür nicht automatisch. Die fertige Fassung
   vor Aktivierung gezielt durchsehen und zur Veröffentlichung freigeben lassen.
   Die Textdurchsicht ist am 03.11. ausdrücklich bestätigt: `reviewedOn:2026-11-03`,
   `reviewedVersion:2026-11-03.1`. `providerReviewedOn` bleibt bis zur tatsächlichen
   Vertrags-/Kontoprüfung null. Keine Veröffentlichung daraus ableiten.
   Sichere Secret-Anlage/-Übertragung ist [konkret vorbereitet](operator-secrets.md),
   aber nicht ausgeführt oder freigegeben.
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
