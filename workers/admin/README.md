# Betreiberfunktion – lokal implementiert, extern deaktiviert

GitHub-App-Login mit PKCE/State und numerischer Betreiber-ID, SQLite-Durable-Object-
Sitzungen, CSRF/Origin, Logout und bedingte Git-Modusänderung implementiert. Keine
Zugangsdaten, öffentliche Route oder Cloud-Abnahme vorhanden. `ENABLED=false` bleibt
Standard. Frontend-Origin in `config/operator.json` derzeit null.

Siehe [Runbook](../../docs/runbook.md) und [Prüfbericht](../../docs/phase-4-results.md).
Konkrete externe Vorbereitung: [Einrichtungsvorlage](../../docs/operator-setup.md)
und [Datenschutzentwurf](../../docs/operator-privacy-draft.md), ohne Aktivierungsfreigabe.
Node 24 / Wrangler 4.154.0. `npm run worker:check` baut nur lokal per Dry-Run;
`npm run worker:test-runtime` prüft echten lokalen SQLite-Speicher. Test-GitHub-Antworten
sind kein Nachweis erfolgreicher Anmeldung bei GitHub. Secrets nur serverseitig über
geschützte Einrichtung, niemals Git, Frontend, Logs oder Chat.
