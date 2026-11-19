# Betreiberfunktion

Stand 19.11.2026: Live unter `https://evolvera-admin.alexander-brocker.workers.dev`
seit 03.11.2026; die Einstellungsseite (EP-01 P8) ist seit 19.11.2026 deployt
(Version `6b7e4354-d8b4-4307-b922-24421ef6c20c`). Vorgehen, Tokenrolle und Prüfungen
eines Deployments: [Runbook](../../docs/runbook.md#worker-deployment). Im Repository
bleibt `wrangler.jsonc` der sicher deaktivierte Standard (`ENABLED=false`); deployt
wird mit der ignorierten Vorlage `work/operator-deploy/wrangler.jsonc`, die den
`assets`-Block enthalten muss.

Die folgenden Absätze beschreiben den Einrichtungsstand vom 03.11.2026:

GitHub-App-Login mit PKCE/State und numerischer Betreiber-ID, SQLite-Durable-Object-
Sitzungen, CSRF/Origin, Logout und bedingte Git-Modusänderung implementiert. Keine
Zugangsdaten, öffentliche Route oder Cloud-Abnahme vorhanden. GitHub App am 03.11.
separat freigegeben und ausschließlich auf `bummber/evolvera` installiert; Kennungen
in der Einrichtungsvorlage. Keine privaten Schlüssel oder Secrets erzeugt. `ENABLED=false` bleibt
Standard. Frontend-Origin in `config/operator.json` derzeit null.

Siehe [Runbook](../../docs/runbook.md) und [Prüfbericht](../../docs/phase-4-results.md).
Konkrete externe Vorbereitung: [Einrichtungsvorlage](../../docs/operator-setup.md)
und [Datenschutzentwurf](../../docs/operator-privacy-draft.md), ohne Aktivierungsfreigabe.
Lokal liefern `/privacy` und `/imprint` auch deaktiviert Hinweise vor Login;
derselbe Betreiber-Datenschutztext wird in der Galerie gerendert. Die neue
`config/operator-privacy.json` bindet eine eigene Durchsicht an Origin/Textversion.
Fehlende Durchsicht sperrt direkte Anmeldung und Healthbereitschaft auch bei
vollständigen Zugangswerten. Keine Sperre gegen Code-Uploads ableiten; Deployment
braucht weiter den passenden Auftrag. [Secret-Ablauf](../../docs/operator-secrets.md)
vorbereitet, noch nicht ausgeführt.
Node 24 / Wrangler 4.154.0. `npm run worker:check` baut nur lokal per Dry-Run;
`npm run worker:test-runtime` prüft echten lokalen SQLite-Speicher. Test-GitHub-Antworten
sind kein Nachweis erfolgreicher Anmeldung bei GitHub. Secrets nur serverseitig über
geschützte Einrichtung, niemals Git, Frontend, Logs oder Chat.

## Einstellungsseite (EP-01 P8)

Seit P8 liefert der Worker statt des Modusformulars eine Einstellungsseite für
Modus und Generationsprofil aus:

- `GET /settings` gibt nur mit gültiger Sitzung eine Seitenhülle ohne
  Inline-Code aus (CSP `script-src 'self'; style-src 'self'; connect-src
'self'`). Die Seite selbst (`/assets/admin.js`, `/assets/admin.css`) baut
  `npm run build:admin` nach `.admin-build/` (gitignored, nicht in `dist`);
  `wrangler.jsonc` bindet den Ordner als `ASSETS` mit `run_worker_first`.
  Vor einem Deployment daher immer zuerst `npm run build:admin`
  (`npm run build` und `npm run worker:check` tun das mit).
- `GET /api/settings` liefert Revision, Regelversion, Modus mit effektivem
  Profil und das CSRF-Token der Sitzung.
- `POST /api/settings` nimmt JSON bis 8 KiB mit `csrf`, `revision` und
  `settings` (Modus plus vollständiges Profil) an. Nur mit exakter Origin.
  Unmögliche Kombinationen (Regelversion 2) werden mit 422 und Meldung
  abgelehnt, bevor Git gelesen wird. Startdatum, Generierungsschalter und
  Zeitzone sind nicht schreibbar. Gespeichert wird als Schema 2 mit
  `revision + 1`, nur bei Änderung, konfliktfest (409) und mit Nachlesen des
  Commits.
- `npm run admin:review` startet eine lokale Sichtung der Seite ohne
  Anmeldung mit dem Stand aus `config/generation.json`; Speichern ist dort
  gesperrt.

Am 19.11.2026 mit Freigabe des Betreibers deployt; jedes weitere Deployment braucht
eine eigene Freigabe.
