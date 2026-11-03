# Betreiber-Secrets – vorbereiteter sicherer Ablauf

Aktueller Stand 03.11.2026: Der konkret freigegebene gemeinsame Upload beider
Secrets und des Workers ist erfolgreich ausgeführt. Beide Secret-Bindings sind
lesend bestätigt; keine Werte ausgegeben. Private Originaldateien unverändert
erhalten, Wrangler-Dateilogs beim Upload deaktiviert. Der Betreiber bestätigt den
erfolgreichen GitHub-Login bis zur Einstellungsansicht, ohne zu speichern;
kein erneuter Secret-Upload ohne passenden Auftrag.
[Deployment und Prüfgrenzen](operator-first-upload.md#freigegeben-und-ausgeführt--03112026).
Die folgenden Abschnitte dokumentieren die frühere Vorbereitung.

Vorheriger Nachtrag 03.11.2026: Betreiber meldet lokale Secret-Datei erstellt.
Ordner-/Dateirechte 0700/0600, erwartete JSON-Struktur und PKCS#8-Hülle ohne
Wertausgabe geprüft. Keine echten Zugangsdaten in Chat/Git oder für lokale Tests.
Upload-Vorlage synthetisch per Dry-Run geprüft; befristeter Cloudflare-Token inzwischen
lokal abgelegt und ausschließlich lesend geprüft (active, Zielkonto/Subdomain passen,
0 Worker). Echter Upload-/Aktivierungsauftrag weiterhin offen.
[Konkreter nächster Schritt und Umfang](operator-first-upload.md).
Die folgenden Abschnitte dokumentieren die vorherige Vorbereitung.

Stand: 03.11.2026. **Nur lokal vorbereitet.** Es wurden keine echten Secrets,
privaten Schlüssel oder Cloudflare-Schreibberechtigungen angelegt. Der Auftrag für
die GitHub-App-Registrierung/Installation umfasste diese Schritte nicht.

## Vor der Durchführung konkret freigeben

Ziel ist ausschließlich `evolvera-admin` im bestehenden Cloudflare-Konto, später
`https://evolvera-admin.alexander-brocker.workers.dev`. Kein kostenpflichtiger
Tarifwechsel, keine GitHub-Buildintegration. Die Codex-MCP-Verbindung bleibt lesend.
Für eine erste Workeranlage sind passende Workers-Rechte im Zielkonto erforderlich;
Anbieterrolle, Werkzeug und befristete lokale Authentifizierung vorab konkret prüfen.
Kein breites Wrangler-OAuth oder neues Token ungefragt einrichten.

Zwei getrennte Schritte bleiben ausdrücklich zu beauftragen:

1. Client-Secret und privaten Schlüssel der bereits angelegten GitHub App erzeugen
   und geschützt lokal ablegen. Die jeweiligen Eingaben/Downloads im Konto übernimmt
   der Betreiber. Keine Werte in Chat, Screenshots, Terminalausgaben oder Git.
2. Den konkret geprüften Worker samt beiden Secrets bei Cloudflare hochladen.
   Deployment/Aktivierung und eine spätere Pages-Veröffentlichung sind eigene Freigaben.
   Auch ein deaktivierter öffentlich bereitgestellter Worker benötigt die durchgesehenen
   Rechtstexte. Vor echtem Login müssen sämtliche Datenschutzgates erfüllt sein.

## Geschützte Übergabe vorbereiten

- Außerhalb des Repositories ein privates Verzeichnis mit Modus `0700` verwenden,
  Dateien mit `0600` und restriktiver `umask 077`. Einen späteren Aufräumzeitpunkt
  vorab vereinbaren; erforderliche Originale nur in der eigenen sicheren Ablage behalten.
- Einen von GitHub heruntergeladenen RSA-Schlüssel gegebenenfalls lokal mittels
  `openssl pkcs8 -topk8 -nocrypt` aus PKCS#1 in PKCS#8 umwandeln. Nur geschützte
  Dateipfade übergeben, niemals Schlüsselinhalte als Kommandoargumente. Nicht anzeigen.
- Zwei Werte über einen lokalen sicheren Eingabeweg in einer geschützten **JSON**-Datei
  zusammenführen: `GITHUB_CLIENT_SECRET` und `GITHUB_PRIVATE_KEY_PKCS8`. Keine `.env`-
  Interpolation verwenden. JSON korrekt serialisieren; Zeilenumbrüche des PEM erhalten.
  Inhalt nicht durch Agentenwerkzeuge lesen oder in deren Ausgaben zurückgeben.
- Nur Dateirechte und strukturelle Gültigkeit mit nicht ausgebenden Prüfungen
  kontrollieren. Kein `cat`, keine Debug-/Shell-Traces, kein Token in Kommandoargumenten.
  Cloudflare-Authentifizierung getrennt davon lokal oder im Anbieterworkflow handhaben.

## Ein gemeinsamer Upload statt einzelner Secret-Deployments

Im Projekt gepinntes Wrangler **4.154.0** unterstützt laut tatsächlich aufgerufenem
`wrangler deploy --help` den Parameter `--secrets-file`. Damit lassen sich Code und
beide Secrets in einer Worker-Version gemeinsam bereitstellen. **Kein solcher Befehl
wurde ausgeführt.** Die genaue Konfiguration wird vor dem späteren Auftrag vorgelegt:
Konto, Workername, Origin, App-/Installations-ID, SQLite-Migration, Routen, Logging,
Datenschutzdurchsicht und gewünschter deaktivierter/aktivierter Zustand.

Die Secrets-Datei bleibt außerhalb von Git und `dist`. Nicht in `vars`, `VITE_*`,
Archiv, Testfixtures oder öffentliche Artefakte kopieren. Nicht angegebene vorhandene
Secrets werden laut Anbieter beim Upload erhalten; der tatsächliche Zielzustand muss
deshalb vor Wiederholungen geprüft werden. Keine Schlüssel automatisch rotieren oder
löschen. Bei unklarer Antwort zuerst den Deploymentstand prüfen, nicht blind erneut starten.

`wrangler secret put/delete` deployt unmittelbar. `wrangler versions secret put`
erzeugt hingegen eine noch nicht deployte Version, ist aber bereits ein externer
Schreibvorgang. Es ist kein Ausweg aus der erforderlichen Beauftragung. Keiner dieser
Befehle ist für die jetzige lokale Vorbereitung nötig.

## Tatsächlich geprüft und weiterhin offen

Aktuelle Anbieteranleitung und lokale Hilfe vom 03.11. gelesen; keine echten Secrets
zum Prüfen angelegt. Tests verwenden ausschließlich synthetische Zugangsdaten.
Der einmalige sichere Eingabe-/Uploadablauf selbst ist noch nicht ausgeführt oder
mit echten Geheimnissen abgenommen. Keine Deploymentbereitschaft aus einem Dry-Run
oder der vorhandenen MCP-Anmeldung ableiten.

- [Cloudflare-Secrets: unmittelbares Deployment und gemeinsamer Upload](https://developers.cloudflare.com/workers/configuration/secrets/)
- [GitHub-App-Schlüssel verwalten](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/managing-private-keys-for-github-apps)
