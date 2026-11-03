# Betreiberfunktion – lokal implementiert, extern deaktiviert

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
