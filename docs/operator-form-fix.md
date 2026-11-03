# Betreiberformulare – geprüfte Korrektur veröffentlicht

## Freigegeben und veröffentlicht – 03.11.2026, 22:38 Uhr MEZ

Der Betreiber hat das konkret vorgelegte Code-Update mit **„Freigabe erteilt“**
beauftragt. Einmalig auf dem bestehenden `evolvera-admin` ausgeführt, Exit 0.
Neue aktive Version **`08317969-9743-4a86-84c2-a57afd3b7e75`**, 100 Prozent Traffic;
Deployment `7b452a7b-678c-4444-a98c-e82f46ff8d85`, Zeit
`2026-11-03T21:38:31.92242Z`. Vorherige Version
`86dadc05-c9fd-4a9c-ab23-15a3494a58ee` bleibt historischer Nachweis.

Unmittelbar vorher Token aktiv bis 04.11.2026, 23:59:59 MEZ, erwartete Liveversion,
Variablen, Secret-Bindings, SQLite und Logging ausschließlich lesend bestätigt.
Code-Update mit derselben ignorierten Vorlage und projektlokalem Wrangler 4.154.0;
keine Secrets-Datei gelesen oder erneut hochgeladen. Vorhandene Secrets erhalten,
derselbe SQLite-Namespace anschließend bestätigt; keine neue Migration oder Löschung.
Wrangler-Dateilogs/Telemetrie deaktiviert, rohe Prozessausgaben nicht ausgegeben.

Anschließend lesende API-Prüfung der neuen aktiven Version sowie aller bisherigen
Variablen/Bindings, Route und Logging-Einstellungen erfolgreich. Preview URLs und
Logpush aus, keine Tail-Consumer; deaktivierte Observability weiterhin `null`.
Öffentliche GETs per curl auf `/health`, `/privacy`, `/imprint`: jeweils HTTP 200,
keine Cookies, Schutzheader unverändert; `configurationReady:true`.
Rechtstextfragmente SHA-256-gleich zur geprüften Fassung `2026-11-03.1`.

**Live-Logout durch den Betreiber bestätigt:** Auf den Testablauf „Einstellungen
frisch laden, abmelden, erneut laden (Anmeldeansicht erwartet), erneut anmelden“
antwortet der Betreiber am 03.11.2026 **„Funktioniert“**. Positiver Praxisnachweis
dieses Ablaufs, keine eigene Sitzungseinsicht des Agenten und keine neue Cloudprüfung.
Kein Live-Modusschreibtest ausgeführt oder freigegeben. Umfassende Sitzungsabnahme,
Ablauf, Konflikte und negative Cloud-Auth-Fälle bleiben offen.

Kein Commit/Push, Pages-Update oder Serienstart. Alle Seriengates unverändert,
private Originaldateien und bisherige Arbeiten erhalten. Die folgenden Abschnitte
dokumentieren die Reproduktion und die zuvor lokal geprüfte Korrektur.

Nach der Deployment-Dokumentation `npm run check` erneut vollständig erfolgreich
mit **165 Tests**, Datenprüfung, Build und deaktiviertem Worker-Dry-Run.
Keine neue Browser-/Runtime-Suite in diesem Deploymentschritt, da der bereits
geprüfte Code unverändert blieb. Format-/Diff-/Backupprüfung erfolgreich.

## Ausgangslage vor der Korrektur

Am 03.11.2026 nach erfolgreichem GitHub-Login meldet der Betreiber beim Abmelden
**„Vorgang nicht bestätigt.“**. „Einstellungen neu laden“ zeigt die geschützte
Oberfläche wieder. Das war ein fehlgeschlagener Logout im ursprünglichen Cloudworker.

## Ursache und Reproduktion

Native POST-Formulare mit `Referrer-Policy: no-referrer` senden nach dem
[Fetch Standard](https://fetch.spec.whatwg.org/#append-a-request-origin-header)
`Origin: null`. Die bisherige Prüfung vor Logout und Modusspeicherung verlangt
ausschließlich die ausgeschriebene Betreiber-Origin und weist deshalb legitime
Formularanfragen mit HTTP 403 ab. Dabei wird die Sitzung nicht widerrufen.

Vor der Korrektur mit echtem Chromium und synthetischer Sitzung reproduziert:
Abmelden liefert HTTP 403, „Vorgang nicht bestätigt.“ und den Link zum erneuten Laden.
Bestehende Unit-/SQLite-Tests hatten die Origin manuell gesetzt und deckten die
Headerbildung des Browsers nicht ab. Das ist ein zuvor übersehener Browserfall.
Auch das Modusformular ist betroffen; kein echter Modusspeichertest ausgeführt.

Der neue Browsertest nutzt einen echten Loopback-HTTPS-Socket mit kurzlebigem
synthetischem Zertifikat. Reines Playwright-Interception/Fulfill genügt nicht, weil
Chromium Fetch Metadata erst im anschließenden Netzwerkpfad ergänzt.
`tsx/esm/api` aus der vorhandenen gepinnten Abhängigkeit lädt die bestehenden
TypeScript-/JSON-Imports; keine neue Abhängigkeit. GitHub-Antworten und Moduscommits
werden im Testprozess simuliert. Keine realen Zugangsdaten, Sitzungen, Repositories
oder Cloudressourcen verwendet. Dateisystembasierte Git-Tests des Projekts bleiben
in isolierten Test-Repositories; temporäre Testzertifikate werden aufgeräumt.

## Vorbereitete Korrektur

`workers/admin/index.ts` behält `no-referrer`, Sitzung, CSRF-Prüfung, feste
Betreiberkennung und die Prüfung einer exakten Origin bei. Zusätzlich wird nur
diese vollständige Kombination akzeptiert:

- `Origin: null`
- `Sec-Fetch-Site: same-origin`
- `Sec-Fetch-Mode: navigate`
- `Sec-Fetch-Dest: document`

Die [Fetch-Metadata-Spezifikation](https://www.w3.org/TR/fetch-metadata/) beschreibt
die vom Browser gesetzten Header. Der Ersatznachweis ist auf Navigation aus
derselben Origin begrenzt: `same-site`, `cross-site`, `none`, fehlende Header,
falscher Modus, iframe-Ziel oder eine fremde explizite Origin genügen nicht.
Eine gültige Betreibersitzung und der passende CSRF-Wert bleiben erforderlich.
Header allein erlauben keine Anmeldung. Browser ohne den erforderlichen Nachweis
bleiben für diesen Fall gesperrt. Datenschutzfassung und Version unverändert.

Neue Regressionen prüfen Widerruf, Cookieentfernung, fehlenden Zugriff nach Neuladen,
synthetische Modusspeicherung, falsche Herkunft und falschen CSRF-Wert. Der echte
workerd-/SQLite-Test prüft Formularherkunft vor dem Widerruf; der native Browserfall
besteht auf Desktop und 320px Chromium. Keine echte Betreibersitzung gelesen,
keine Cookies/Codes angefordert und keine Logs aktiviert.

Tatsächlich ausgeführt: `npm run check` vollständig erfolgreich mit **165 Tests**,
Datenprüfung, Build und deaktiviertem Worker-Dry-Run; `npm run worker:test-runtime`
erfolgreich mit beiden zusätzlichen Formular-/Widerrufsfällen. Danach am gebauten
Stand `npm run test:browser`: **68 bestanden, sechs bewusste Doppelaufruf-Skips**;
sechs Kunstreferenzen unverändert. Die vorgesehene aktive Upload-Vorlage zusätzlich
mit ausschließlich synthetischen Secrets erfolgreich per Dry-Run paketiert.
Format-/Diffprüfung und bytegleiches PRD-Backup geprüft. Der neue Browserfall benötigt
das vorhandene OpenSSL-Kommando für sein temporäres Testzertifikat. Keine neue
Cloudprüfung, kein Safari-/Firefox-Nachweis und keine Aussage zum behobenen Livezustand.

## Historischer, inzwischen freigegebener und ausgeführter Updateumfang

Nur den bestehenden `evolvera-admin` im bestätigten Konto mit dem korrigierten Code
aktualisieren: dieselbe ignorierte Upload-Vorlage, unveränderte Variablen, Route,
Logging-Einstellungen, SQLite-Klasse und Migration. Vorhandene Secrets erhalten;
keine Rotation oder neue Secret-Eingabe. Vorher Token/Gültigkeit und aktuellen
Zielstand ausschließlich lesend prüfen, keinen Erstupload wiederholen.
Danach Deploymentmetadaten, `/health`, `/privacy` und `/imprint` lesend prüfen.
Anschließend testet der Betreiber das echte Abmelden und erneute Anmelden selbst.

Der Auftrag für dieses weitere Deployment wurde inzwischen erteilt und wie oben
beschrieben ausgeführt. Kein Commit/Push, Pages-Update,
echtes Modusschreiben oder Serienstart. Generierung false, Startdatum null,
Serienfreigabe false, traceable/Revision 1, offizielles Archiv leer und Galerie-Origin
null erhalten. Alle früheren Arbeiten einschließlich unversioniertem PRD-Backup
erhalten. Damalige Cloudversion: `86dadc05-c9fd-4a9c-ab23-15a3494a58ee`.
Der Live-Logout ist inzwischen wie oben durch den Betreiber bestätigt; diese
Rückmeldung ist vom lokalen automatisierten Prüfnachweis getrennt.
