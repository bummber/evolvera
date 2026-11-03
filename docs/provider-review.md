# Cloudflare – lokale Anbieterprüfung am 03.11.2026

## Auftrag und Ergebnis

Nach der lokalen Werkbuch-Sicherung hat der Betreiber im Chat **Workers Free**
mit Screenshot („Active“) bestätigt, die vorhandene Subdomain
`alexander-brocker.workers.dev` bestätigt und die direkte Anmeldung bei Cloudflare
über sein GitHub-Konto erläutert. Keine Registrierungs-/Begrüßungsmail verfügbar.
Anschließend: „Ich habe 6.1. gelesen. [...] Aus meiner Sicht kann es jetzt weitergehen.“
Dies beauftragt die Fortsetzung der Vorbereitung; keine Secrets, Bereitstellung,
Veröffentlichung oder Serienaktivierung daraus ableiten.

Die lokale sachliche Anbieterprüfung ist abgeschlossen. `providerReviewedOn` wird
auf `2026-11-03` gesetzt. Sie beruht auf dem bestätigten Konto-/Tarifstand, der
veröffentlichten Self-Serve-Vertragsgrundlage, dem tatsächlichen Datenfluss und der
vorbereiteten Logging-Konfiguration. Keine anwaltliche Freigabe, keine historische
Zustimmung oder individuelle Vertragsurkunde behauptet. Die Betreiberbestätigung
betrifft ausdrücklich Abschnitt 6.1; keine vollständige persönliche DPA-Lektüre
behauptet. Das fehlende Begrüßungsschreiben ist kein eigenes technisches Gate.

## Vertragsgrundlage und Grenzen des Nachweises

- [Self-Serve Subscription Agreement](https://www.cloudflare.com/terms/), aktuell
  Stand 12.09.2025: Geltung laut Einleitung durch Zustimmung, Nutzung oder Zugriff;
  Abschnitt 6.1 bindet das DPA für erfasste personenbezogene Inhalte ein.
  Anbieter laut Abschnitt 20: Cloudflare, Inc., 101 Townsend St., San Francisco,
  CA 94107, USA.
- [Data Processing Addendum](https://www.cloudflare.com/cloudflare-customer-dpa/),
  Version 6.4, wirksam seit 03.04.2026: beschreibt Auftragsverarbeitung, internationale
  Übermittlungen und Schutzmechanismen. Keine gesonderte Unterschrift oder neue
  Vereinbarung für dieses Projekt ausgeführt. Die Zuordnung zum üblichen
  Self-Service-Konto ist eine Einordnung aus dem bestätigten Anmelde-/Tarifweg,
  kein aus einer nicht vorhandenen Kontourkunde gelesener Nachweis.
- [Datenschutzerklärung](https://www.cloudflare.com/privacypolicy/), insbesondere
  End Users/Network Data, Anbieterrollen, internationale Übermittlung und
  Aufbewahrung: eigene Netzwerk-/Sicherheitsverarbeitung bleibt von anvertrauten
  Sitzungsinhalten getrennt. Keine Zusage ausschließlich europäischer Verarbeitung
  oder fester Anbieter-Löschfristen.

Die aktuellen offiziellen Texte wurden am 03.11.2026 erneut gelesen. Keine neue
Kontoabfrage, kein Supportfall, keine Kontaktnachricht und keine Vereinbarung im Namen
des Betreibers ausgelöst. Die bestätigten Kontoangaben stammen aus dem Chat und dem
Tarif-Screenshot; keine E-Mail-/Account-/Tokenkennungen ins Repository übernommen.

## Tatsächliche Daten und Logging

Die Aussage des Betreibers „Die Applikation speichert keine Daten“ trifft für die
vorbereitete Betreiberfunktion nicht zu; das wurde im Chat ausdrücklich klargestellt:

- Galerie ohne Besucherkonten, eigenes Tracking oder automatische Workerabfrage.
- Anmeldevorgang: State und PKCE-Verifier höchstens zehn Minuten verwendbar.
- Sitzung: numerische GitHub-Betreiber-ID, CSRF-Wert und Ablaufzeit höchstens eine
  Stunde verwendbar, mit zufälliger Kennung im sicheren Cookie. Logout widerruft die
  Sitzung, Alarm sieht abgelaufene Datensätze zur Löschung vor. Keine sofortige
  physische Löschung in Cloudflare-Backups behauptet.
- Modus/Revision und Commitmetadaten werden dauerhaft in Git gespeichert.
  Keine GitHub-Zugriffstokens in Browser, Sitzung oder Git.
- `workers/admin/wrangler.jsonc`: `observability.enabled:false`; im Worker keine
  eigenen Requestlogs. Der tatsächliche Cloudzustand kann vor erster Bereitstellung
  nicht geprüft sein. Beim gesondert beauftragten Deployment diese Konfiguration
  erneut gegenprüfen; Cloudflare aktiviert Workers Logs für neue Worker standardmäßig.
  [Logging-Dokumentation](https://developers.cloudflare.com/workers/observability/logs/workers-logs/).

Die bestehende gemeinsame Datenschutzfassung `2026-11-03.1` beschreibt genau diese
Verarbeitung; Inhalt, Version und frühere Textdurchsicht bleiben unverändert.

## Folgeschritt

Zuerst diesen Stand gemeinsam sichten. Danach den sicheren GitHub-App-Schlüssel- und
Secret-Ablauf aus [operator-secrets.md](operator-secrets.md) konkret beauftragen.
Vor echtem Upload weiterhin passende Cloudflare-Schreibrechte, Zielkonfiguration,
Logging und konkrete Deployment-/Aktivierungsfreigabe prüfen. Technisch erfüllte
Publikationsangaben sind keine Veröffentlichungserlaubnis. `ENABLED=false`,
`workers_dev:false`, leere ausführbare Betreiber-Origin, Galerie-Origin null,
Generierung aus, Startdatum null, Serienfreigabe false und offizielles Archiv leer.

## Tatsächlich geprüft

- `npm run check` erfolgreich: Format/Lint/Typen, **155 Tests**, Daten-/Vorschauprüfung,
  Build und lokaler Worker-Dry-Run. Keine neue Abhängigkeit.
- `npm run check:publication` jetzt **Exit 0**. Diese technische Angabenprüfung
  ersetzt weder Rechtsprüfung noch gesonderten Veröffentlichungsauftrag.
- `npm run worker:test-runtime` mit isolierter lokaler workerd-/SQLite-Laufzeit und
  synthetischen Zugangsdaten erfolgreich, einschließlich Deaktivierung und Datenschutzgate.
- `npm run test:browser` am gebauten Stand: **66 bestanden, sechs bewusste
  Doppelaufruf-Skips**; sechs Kunstreferenzen unverändert. 100 Seiten-/Breitenkombinationen
  bei 320/390/768/1024/1440 px ohne horizontalen Dokumentüberlauf, externe Requests oder
  `img/svg/canvas`. Galerie-Datenschutz zeigt nun keinen offenen Entwurfsstatus;
  Datenverarbeitungshinweise bleiben sichtbar, ohne Cookies oder Workeraufruf.
  Die negativen Gatefälle in den vorhandenen Unit-/Runtime-Tests bleiben erhalten.
- `git diff --check`, unveränderte geschützte Kunst-/Archiv-/Generierungs-/Betreiberpfade,
  Seriengates und bytegleiches, unversioniertes PRD-Backup geprüft. Keine neue manuelle
  Bildsichtung. Safari/Firefox, reale Geräte und echte Anmeldung bleiben offen.

Alle Änderungen dieses Prüfschritts bleiben lokal uncommittiert. Kein Push, Upload,
Deployment oder Serienstart; kein neues Konto, keine Secrets und keine neuen Rechte.
