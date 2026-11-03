# Betreiberworker – konkrete Upload-Vorbereitung

Aktueller Nachtrag: Nach erfolgreichem Login gemeldeter Logoutfehler ist lokal
reproduziert, korrigiert und auf separaten Auftrag am 03.11.2026 um 22:38 Uhr MEZ
als Code-Update veröffentlicht. **Live-Logout-/Neuanmeldetest durch Betreiber bestätigt**;
Modusspeichern vorerst nicht testen. [Formular-Fix und Deploymentbericht](operator-form-fix.md).
Der folgende Bericht zum ersten Upload und Login bleibt als Nachweis erhalten.

## Betreiberlogin bestätigt – 03.11.2026

Nach dem freigegebenen Upload hat der Betreiber selbst die GitHub-Autorisierung
ausgeführt und bestätigt: **„Die Authorisierung per Github war erfolgreich. Ich sehe
die Einstellungen und habe nichts gespeichert“**. Positiver Praxisnachweis bis zur
Einstellungsansicht; deren Ausgabe setzt laut Implementierung eine gültige Sitzung
und erfolgreiches Lesen der GitHub-Moduskonfiguration voraus. Keine eigene
Sitzungseinsicht oder zusätzliche Cloudprüfung durch den Agenten.

Nichts gespeichert; Modusspeicherung mit möglichem Git-/Pages-Schreibvorgang bleibt
ungeprüft und separat zu beauftragen. Logout/Widerruf, Ablauf, Konflikte und negative
Auth-Fälle sind ebenfalls keine daraus abgeleiteten Nachweise. Der folgende
Uploadbericht beschreibt den zuvor durch den Agenten geprüften Stand; dessen
damals noch offener Login ist mit dieser Betreiberbestätigung erledigt.

## Freigegeben und ausgeführt – 03.11.2026

Die ausdrückliche Betreiberantwort **„Ich gebe die Schritte frei“** umfasst den
vorbereiteten gemeinsamen Worker-/Secret-Upload, SQLite-Sitzungsspeicher,
Anmeldeaktivierung nur für `bummber` und anschließende lesende Nachprüfung.
Der Erstupload wurde **einmalig erfolgreich** ausgeführt; die frühere Vorbereitung
und die damalige offene Freigabe darunter sind historische Nachweise.

- Live: `https://evolvera-admin.alexander-brocker.workers.dev`.
  Deployment am 03.11.2026 um **22:12 Uhr MEZ**, ID
  `ea0224e4-267b-4605-bb03-b6ccc8a09080`, Version
  `86dadc05-c9fd-4a9c-ab23-15a3494a58ee`, 100 Prozent Traffic.
- Unmittelbare GET-Vorprüfung: Token aktiv bis 04.11.2026, 23:59:59 MEZ,
  Zielworker nicht vorhanden und Account-Subdomain passend. Geschützte Ablage und
  exakte Uploadkonfiguration erneut ohne Wertausgabe validiert;
  `check:publication` erfolgreich.
- Projektlokales Wrangler 4.154.0, bestehende ignorierte Upload-Vorlage,
  `deploy --secrets-file` mit beiden echten Secrets aus der geschützten externen
  JSON-Datei gemeinsam ausgeführt. Zugang ausschließlich intern als Prozessumgebung;
  keine Werte in Befehlsargumenten. Wrangler-Dateilogs über die in der installierten
  Implementierung geprüfte Option `WRANGLER_WRITE_LOGS=false` abgeschaltet,
  Sanitizing aktiv, Telemetrie aus; rohe Prozessausgaben nicht ausgegeben. Exit 0.
- Cloudzustand anschließend lesend geprüft: genau ein Worker, beide erwarteten
  Secret-Bindings, alle nichtgeheimen Variablen passend, SQLite-Namespace für
  `SESSIONS`/`Sessions`, Migration `v1`, Laufzeitdatum `2026-10-28`.
  workers.dev aktiv, Preview URLs aus, Logpush aus, keine Tail-Consumer.
  API liefert deaktivierte Observability als `null` beziehungsweise fehlendes Feld;
  separate Script-Settings und Wrangler-Behandlung dieses Zustands geprüft.
  Die anfängliche Prüfung auf ausschließlich explizites `false` wurde deshalb
  lesend geklärt; kein zweiter Upload und keine Loggingänderung.
- `/health`, `/privacy`, `/imprint` per gewöhnlichem curl-GET: jeweils **HTTP 200**,
  keine Set-Cookie-Header, `no-store`, `no-referrer`, HSTS, nosniff und Frame-Schutz.
  Health: `configurationReady:true`. Rechtstextfragmente SHA-256-gleich zur lokal
  gerenderten durchgesehenen Fassung `2026-11-03.1`, CSP vorhanden. Alle drei Seiten
  zusätzlich im nativen Browser sichtbar geprüft. Python-urllib erhielt vorher
  Cloudflare 1010/HTTP 403; keine Sicherheitsregel gelockert.

**Grenze:** Health belegt Konfigurationsbereitschaft, nicht die echte GitHub-Anmeldung
oder die Funktionsfähigkeit des Schlüsselpaares. Kein `/login` aufgerufen, keine
Sitzung erzeugt, kein Modus gespeichert. Als nächster Schritt führt der Betreiber
den direkten Login selbst aus. Modusspeicherung mit möglichem Pages-Lauf bleibt ein
eigener Auftrag. Keine weitere Bereitstellung aus einem Loginproblem ableiten;
zuerst den tatsächlichen Fehler und Cloudzustand lesend prüfen.

Kein Commit/Push, Pages-Update oder Tarifwechsel. Galerie-Origin null, versionierter
Workerstandard deaktiviert, Generierung false, Startdatum null, Serienfreigabe false,
traceable/Revision 1 und offizielles Archiv leer. Private Originaldateien erhalten;
Token läuft zum genannten Zeitpunkt ab. Widerruf/Aufräumen nicht automatisch ausgeführt.
Alle bisherigen Arbeiten erhalten; nur Dokumentation fortgeschrieben. Der bisherige
synthetische Dry-Run und die früheren Tests bleiben getrennte Nachweise.

Nach der Dokumentationsaktualisierung `npm run check` vollständig erfolgreich:
Format/Lint/Typen, **155 Tests**, Datenprüfung, Build und Dry-Run des deaktivierten
versionierten Workers. Keine erneute Browserregressions- oder Worker-Runtime-Suite,
weil UI/Routing und Worker-/Sitzungscode unverändert blieben. Die oben genannten
öffentlichen Browser-/HTTP-Prüfungen sind der neue Cloudnachweis; kein Loginbeleg.

## Historische Vorbereitung vor der Freigabe

Stand 03.11.2026. **Uploadzugang lesend geprüft; Upload/Aktivierung noch nicht
freigegeben oder ausgeführt.** Nach Bestätigung
der lokal erstellten Secret-Datei wurden ausschließlich Dateirechte und Struktur
ohne Wertausgabe geprüft: privater Ordner 0700, JSON-Datei 0600, eigener Benutzer,
genau zwei erwartete Schlüssel und PKCS#8-PEM-Hülle. Dies belegt weder die Zuordnung
zum GitHub-App-Schlüsselpaar noch einen erfolgreichen Login.

## Vorgesehener Upload

Die separate lokale Vorlage liegt unter dem ignorierten
`work/operator-deploy/wrangler.jsonc`. Der versionierte Workerstandard bleibt
deaktiviert. Die Vorlage ist ein Vorschlag für den anschließend gesondert
freizugebenden Upload samt direkter Anmeldeaktivierung:

| Einstellung                            | Vorgesehener Wert                                                                            |
| -------------------------------------- | -------------------------------------------------------------------------------------------- |
| Worker                                 | `evolvera-admin`, bestehendes bestätigtes Cloudflare-Konto                                   |
| Origin                                 | `https://evolvera-admin.alexander-brocker.workers.dev`                                       |
| Galerie-Origin                         | Weiterhin null; kein Pages-Push in diesem Schritt                                            |
| `ENABLED` / `workers_dev`              | `true` / `true` ausschließlich in der Upload-Vorlage                                         |
| Preview URLs / Observability / Logpush | Jeweils aus                                                                                  |
| Betreiber-ID                           | `46008719`                                                                                   |
| GitHub Client-ID                       | `Iv23liYblHBrFsNZZllG`                                                                       |
| App-ID / Installations-ID              | `5595636` / `178198041`                                                                      |
| Sitzungsspeicher                       | Binding `SESSIONS`, Klasse `Sessions`, SQLite-Migration `v1`                                 |
| Secret-Upload                          | Beide Werte gemeinsam via `--secrets-file`, geschützte JSON-Datei außerhalb des Repositories |
| Laufzeitdatum / Wrangler               | Unverändert `2026-10-28` / projektlokal `4.154.0`                                            |

Kein neuer Tarif, keine Zone, Domain, DNS-Änderung, D1/KV-Datenbank, GitHub-
Buildintegration oder geplante Generierung. Öffentlich ausgelieferte Rechtstexte
entsprechen der bestehenden gemeinsamen Fassung; der bisherige Pages-Stand bleibt
unverändert. Ein erster direkter Login ist separat vom Modusspeichertest zu prüfen:
Moduscommits auf `main` können Pages auslösen und brauchen einen passenden Auftrag.

## Cloudflare-Zugang für den Upload

Die vorhandene MCP-Verbindung wurde erneut ausschließlich lesend geprüft: genau
ein Konto, Zuordnung zum vom Betreiber genannten Dashboardkonto bestätigt.
Keine zusätzlichen MCP-Rechte angefordert. Der Betreiber hat den anschließend im
Dashboard erstellten befristeten Token lokal geschützt abgelegt. Zugang nun mit
dem echten Token ausschließlich lesend geprüft, siehe Nachweis unten.

Vorschlag: kurz befristeter **account-owned API token**, nur im Zielkonto,
Produktbereich **Workers**, Rolle **Admin**. Die Produktrolle ist zur Neuanlage
erforderlich, weil ein noch nicht vorhandener Worker nicht individuell auswählbar
ist. Sie ermöglicht innerhalb dieses Kontos auch die Verwaltung anderer Workers;
der Umfang ist deshalb ausdrücklich breiter als nur der geplante Name.
Keine Developer-Platform-weite Adminrolle, Zone-/DNS- oder Abrechnungsrechte.
Nach der Anlage für spätere Updates stattdessen Editor nur auf `evolvera-admin`
vorsehen. Ein Ablaufdatum spätestens 04.11.2026 ist für die erste Einrichtung
vorgesehen; Tokenanlage durch den Betreiber im Dashboard, keine Werte im Chat.

Aktuelle Quellen:

- [Workers-Rollen und Wrangler](https://developers.cloudflare.com/workers/authorization/workers/):
  Neuanlage mit Admin auf Workers-Produktebene, spätere Updates mit Editor.
- [Account API tokens](https://developers.cloudflare.com/fundamentals/api/get-started/account-owned-tokens/):
  Dashboard Manage account → Account API tokens, Ablaufdatum und Rechte beim Erstellen.
- [Durable-Objects-Rechte](https://developers.cloudflare.com/changelog/post/2026-09-15-granular-worker-permissions/):
  folgen dem implementierenden Worker.

Der temporäre Eingabehelfer `/private/tmp/evolvera-prepare-cloudflare-auth.py`
speichert den vom Betreiber eingegebenen Token samt Zielkonto unter dessen privater
lokaler Ablage als `cloudflare-auth.json`, ohne API-Aufruf oder Upload. Unsichtbare
Terminaleingabe, 0700/0600, kein Überschreiben; lediglich mit synthetischen Werten
geprüft. Der Helfer enthält keine echten Zugangsdaten, kann nach Betriebssystem-
Bereinigung von `/private/tmp` neu vorbereitet werden. Echte Tokenanlage/-Eingabe
inzwischen vom Betreiber bestätigt und Rechte/Struktur ohne Wertausgabe geprüft.
Aufräumen/Widerruf nach Abschluss der Einrichtung konkret
vereinbaren; keine Originalschlüssel oder Tokens automatisch löschen.

## Tatsächlich lokal geprüft

- Projektzustand und bestehende Arbeit erhalten, keine neuen Commits oder Pushes.
- Strukturprüfung der realen lokalen Secret-Datei ohne Wertausgabe; nicht für
  lokale Auth-/Laufzeittests verwendet.
- Upload-Vorlage mit **ausschließlich synthetischer** Secret-Datei erfolgreich per
  `wrangler deploy --dry-run --secrets-file` gebaut. Beide Secrets als hidden
  gemeldet. Kein Upload, keine Ressourcenerstellung und keine GitHub-Authentifizierung.
- Typen zur separaten Upload-Vorlage außerhalb des Repositories unter
  `/private/tmp/evolvera-operator-worker-configuration.d.ts` erzeugt. Eine zunächst
  unter `work/` erzeugte Runtime-Deklaration wurde vom rekursiven ESLint erfasst
  (zwei Warnungen in generiertem Code); die eigene generierte Datei deshalb aus
  dem Projekt entfernt. Keine Lintregel abgeschwächt.
  Zwischenversuche durch lokale Sandbox-/Logpfad- und tsconfig-Auflösung gestoppt;
  tsconfig-Override anschließend entfernt. Der erfolgreiche abschließende Dry-Run
  verwendet wie der Projektstandard die automatische Projektauflösung.
- Token-Eingabehelfer nur synthetisch auf JSON-Struktur, private Rechte,
  Überschreib-/Symlink-Schutz und Verweigerung ohne interaktives Terminal geprüft.
- Abschließend `npm run check` vollständig erfolgreich: Format/Lint/Typen,
  **155 Tests**, Datenprüfung, Build und Worker-Dry-Run des unverändert deaktivierten
  Projektstandards. `git diff --check`, bytegleiches PRD-Backup und Ignorierung der
  Uploadvorlage, synthetischen Datei und Workerausgaben geprüft. Kein neuer Browser-
  oder Worker-Runtime-Lauf; UI/Routing und Worker-/Sitzungscode in diesem Schritt
  unverändert. Die vorher dokumentierten 66 Browserfälle bleiben der letzte Nachweis.

Ein Dry-Run belegt keine tatsächlichen Tokenrechte, Cloudflare-Tariflimits unter
Auth-Last oder funktionierende Anmeldung. Vor dem Upload aktuellen Zielzustand mit
dem befristeten Token lesend prüfen; einen bereits vorhandenen gleichnamigen Worker
nicht blind überschreiben. Erst nach konkretem Auftrag Code und beide Secrets
gemeinsam hochladen, dann Rechtstexte, Health und direkte Anmeldung prüfen.
Serienstart, Generierung und Archiv bleiben dabei gesperrt.

## Lesende Vorprüfung mit dem bereitgestellten Token

Am 03.11.2026 hat der Betreiber „Cloudflare-Token ist lokal abgelegt“ bestätigt.
Private Rechte und feste Zielkonto-Zuordnung ohne Wertausgabe geprüft. Danach über
die offizielle Cloudflare-API ausschließlich drei GET-Abfragen ausgeführt:

- Account-Tokenprüfung: Status **active**, Ablauf `2026-11-04T22:59:59Z`, also
  **04.11.2026, 23:59:59 MEZ**. Tokenkennung und Tokenwert nicht dokumentiert.
- Worker-Skriptliste im Zielkonto: **0 Worker**, `evolvera-admin` nicht vorhanden.
  Es würde ein neuer Worker angelegt; kein vorhandener Stand zu überschreiben.
- Vorhandene Account-Subdomain entspricht `alexander-brocker.workers.dev`.

Die Policy-Zusammenfassung im Dashboard zeigte vor manueller Erstellung ausschließlich
Workers Admin im bestätigten Konto und Ablauf am 04.11.2026. Der eigentliche Tokenwert
wurde durch den Betreiber ohne Anzeige im Chat lokal eingegeben. Die bestehenden
MCP-Rechte bleiben unverändert. Die lesenden API-Aufrufe bestätigen Gültigkeit und
Lesezugriff, sind kein ausgeführter Schreibtest oder Deploymentnachweis.

`npm run check:publication` erneut **Exit 0**. `npm run check` abschließend erneut
vollständig erfolgreich mit 155 Tests, Datenprüfung, Build und Worker-Dry-Run.
Kein Code-/Konfigurationswechsel seit
dem erfolgreichen synthetischen Upload-Dry-Run. Die Freigabevorlage umfasst jetzt
konkret: erstmaliger Upload des vorbereiteten `evolvera-admin` samt beiden lokalen
GitHub-App-Secrets, SQLite-Sitzungsspeicher, öffentliche workers.dev-Route und direkte
Anmeldeaktivierung nur für die feste Betreiber-ID. Anschließend ausschließlich Health
und öffentliche Rechtstexte lesend prüfen. Echte Anmeldung führt der Betreiber aus;
Modusspeichertests und deren mögliche Git-/Pages-Schreibfolge bleiben ausgenommen.

Keine Secrets ausgegeben, kein externer Schreibaufruf, kein weiterer Commit/Push,
kein Deployment, keine Generierung. Expliziten Betreiberauftrag für genau diesen
Upload-/Aktivierungsschritt abwarten; vorher unmittelbar den Zielzustand erneut lesen.
