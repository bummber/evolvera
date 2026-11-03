# Betreiberanmeldung – Datenschutzvorbereitung

Stand: 03.11.2026. **Textdurchsicht ausdrücklich bestätigt; Cloudflare-Vertrags-/
Kontoprüfung noch offen, nicht veröffentlicht.** Lokal ist `privacyScope:pages-and-operator` vorbereitet. Die
öffentliche Pages-Fassung bleibt unverändert auf dem bisherigen Remote-Stand.
Die Anmeldung ist aus. Dieser Entwurf ist kein Beleg einer rechtlichen Prüfung
und schaltet das Veröffentlichungsgate nicht frei.

## Lokal umgesetzt am 03.11.

Die Galerie zeigt unter `#/datenschutz` die ergänzten Texte zu Anmeldung, Cookies,
Speicherung, Cloudflare und Empfängern. Der Worker liefert `/privacy` und `/imprint`
auch ohne Anmeldung, Cookie, Secrets oder Aktivierung. Alle Worker-HTML-Seiten
verlinken diese lokalen Rechtstext-Routen. Gemeinsamer Text in
`src/site/operator-privacy-content.ts`; React und Worker rendern denselben Inhalt,
der Worker maskiert sämtliche eingesetzten Daten als HTML.

Die neue `config/operator-privacy.json` bindet die gesonderte Durchsicht an
`https://evolvera-admin.alexander-brocker.workers.dev` und Textversion `2026-11-03.1`.
Nach ausdrücklicher Bestätigung durch den Betreiber ist `reviewedOn:2026-11-03`
und `reviewedVersion:2026-11-03.1` dokumentiert. `providerReviewedOn` bleibt **null**.
Die Pages-Durchsicht vom 02.11. wurde nicht übernommen. Eine andere Origin oder veraltete
Textversion sperrt ebenfalls. Bei Änderungen am geprüften Text oder Datenfluss die
Version bewusst erhöhen und die neue Durchsicht erneut einholen.

Noch zu prüfen: zum Konto gehörender Vertragspartner und wirksame Bedingungen/DPA,
Anbieterrollen und konkrete Logging-Einstellungen vor Deployment. Die gelesene
Textfassung wurde bestätigt; Änderungen nach der Kontoprüfung benötigen eine neue
Textversion und Durchsicht.
Die gelesene Self-Serve-Vereinbarung bezieht das DPA in Abschnitt 6.1 für erfasste
personenbezogene Inhalte ein. Das ersetzt keinen Nachweis für die tatsächlichen
Kontobedingungen dieses Projekts. Keine neue Vereinbarung angenommen.

## Datenfluss aus der vorhandenen Implementierung

| Schritt               | Daten und Empfänger                                                                                                  | Anwendungsseitige Speicherung                                                                                                                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Galerie               | Statische Inhalte bei GitHub Pages; kein automatischer Aufruf des Workers                                            | Keine Besucher-Sitzung oder Profildaten                                                                                                                                                                                 |
| Worker öffnen         | Cloudflare erhält die HTTP-Verbindung einschließlich IP-Adresse und HTTP-Metadaten                                   | Keine eigenen Requestlogs im Code; Worker-Observability derzeit aus. Anbieterbetrieb und Sicherheitsdaten davon getrennt prüfen                                                                                         |
| GitHub-Login          | Browser navigiert zu GitHub mit Client-ID, Callback, State und PKCE-Challenge; GitHub führt Anmeldung/Zustimmung aus | Worker hält State und PKCE-Verifier in SQLite-Durable-Object, gebunden an zufällige Browserkennung, höchstens zehn Minuten gültig                                                                                       |
| Callback              | GitHub sendet kurzlebigen Code/State an Worker; serverseitiger Tausch gegen User-Token, anschließend GitHub `/user`  | Antwort kann Profilfelder enthalten; Code übernimmt nur numerische ID zur Prüfung. User-Token wird nur im Arbeitsspeicher verwendet, nicht in Sitzung/Git/Browser gespeichert. Kein aktiver Tokenwiderruf implementiert |
| Sitzung               | Zufallskennung im HttpOnly-Cookie, numerische Betreiber-ID, CSRF-Wert, Ablaufzeit im Cloudflare-Speicher             | Absolut eine Stunde gültig, keine gleitende Verlängerung; Widerruf beim Logout. Alarm räumt abgelaufene Daten auf; keine Garantie sofortiger physischer Löschung bei Cloudflare                                         |
| Modus lesen/schreiben | Worker erzeugt kurzlebiges Installationstoken, liest/schreibt GitHub `config/generation.json`                        | Modus, Revision und Git-Commitmetadaten bleiben öffentlich in der Git-Historie. Keine Sitzung, OAuth-Codes, Tokens oder Schlüssel im Commit                                                                             |

Die Callback-Anfrage enthält zwangsläufig Code/State in der URL. Nach erfolgreicher
Anmeldung leitet der Worker zu `/settings` ohne diese Parameter weiter; `no-store`
und `no-referrer` sind gesetzt. Daraus keine Zusage ableiten, dass Anbieter oder
Browser niemals Verbindungs-/Verlaufsdaten verarbeiten.

## Textbaustein für die spätere Datenschutzerklärung

Der folgende ursprüngliche Baustein dokumentiert die Vorbereitung vom 02.11.;
maßgeblich zur neuen Durchsicht ist die tatsächlich lokal gerenderte Fassung.

> Die öffentliche Galerie bleibt ohne Anmeldung nutzbar. Nur wenn du den
> Betreiberbereich öffnest, wird dessen Cloudflare-Worker aufgerufen. Die
> GitHub-Anmeldung ist ausschließlich zur Verwaltung durch den Betreiber vorgesehen.
> Sie dient dazu, das berechtigte Konto zu erkennen und den Vererbungsmodus für
> zukünftige Generierungen sicher zu speichern. Andere Konten werden abgewiesen.
>
> Der Betreiberbereich wird unter **[bestätigte Worker-Origin ergänzen]** bei
> Cloudflare bereitgestellt. Die ausgewählte Adresse ist
> `https://evolvera-admin.alexander-brocker.workers.dev`, noch nicht bereitgestellt.
> Beim Aufruf verarbeitet Cloudflare technische
> Verbindungsdaten. Für die Anmeldung wirst du zu GitHub weitergeleitet. Der Worker
> prüft die von GitHub erhaltene numerische Konto-ID. Dein GitHub-Passwort erhält
> Evolvera nicht. GitHub-Zugriffstokens und App-Schlüssel gelangen nicht in die
> öffentliche Galerie oder die Sitzungscookies.
>
> Der Betreiberbereich verwendet zwei technisch auf die Anmeldung begrenzte Cookies:
> `__Host-evolvera-login` bindet den Anmeldevorgang für höchstens zehn Minuten an
> deinen Browser; `__Host-evolvera-session` enthält eine zufällige Sitzungskennung und
> ist höchstens eine Stunde gültig. Beide gelten nur für die Worker-Adresse, sind
> `Secure`, `HttpOnly`, `SameSite=Lax` und enthalten keine GitHub-Tokens. Bei
> erfolgreichem Login wird das Login-Cookie gelöscht, beim Abmelden die Sitzung
> widerrufen und ihr Cookie gelöscht. Ohne die nötigen Cookies funktioniert die
> Betreiberanmeldung nicht. Die Galerie bleibt zugänglich.
>
> Kurzlebige Anmeldedaten und Sitzungen liegen in Cloudflares SQLite-Durable-Objects.
> Anmeldevorgänge sind höchstens zehn Minuten, Sitzungen höchstens eine Stunde
> verwendbar; abgelaufene Datensätze werden anwendungsseitig automatisch zur Löschung
> vorgesehen. Ein erfolgreicher Moduswechsel wird dagegen dauerhaft mit Revision
> und Commitmetadaten im öffentlichen GitHub-Repository dokumentiert. Er enthält
> keine Anmeldetokens und verändert keine bisherigen Kunstwerke.

## Vor Verwendung konkret ergänzen und bestätigen

- Tatsächliche Worker-Origin, Cloudflare-Vertragspartner/Anschrift und Rollen im
  konkreten Konto prüfen. Cloudflare beschreibt sowohl eigene Verarbeitung von
  Netzwerkdaten als auch Auftragsverarbeitung bestimmter Kundendaten. Die öffentlich
  angebotenen Datenschutz-/DPA-Texte belegen noch keinen abgeschlossenen Vertrag
  dieses Projekts.
- Rechtsgrundlage und berechtigtes Interesse für Zugangsschutz/Verwaltung sowie
  Einordnung der erforderlichen Cookies anhand des konkreten Betriebs prüfen und
  in den finalen Text aufnehmen. Keine pauschale Einwilligungsfreiheit behaupten.
- Anbieterinformationen zu Speicherdauer, Empfängern, Unterauftragnehmern und
  internationalen Übermittlungen ergänzen; keine reine EU-Verarbeitung oder feste
  Anbieter-Löschfrist versprechen. Tatsächliche Kontoeinstellungen zu Logging prüfen.
- Bestehende Angaben zu Verantwortlichem, Kontakt und Rechten bleiben zentral;
  Rechte-/Kontaktabschnitt um Cloudflare passend ergänzen. Keine Kontaktdaten aus
  anderen Profilen übernehmen. Keine Zugangscodes oder Sitzungscookies als Testbelege
  in Screenshots, Git, Logs oder Chat aufnehmen.

## Veröffentlichungsgate vor Aktivierung erweitern

`publicationIssues` prüft nun den neuen Scope und dessen eigenständige Nachweise.
`npm run check:publication` scheiterte vor der Textbestätigung an zwei offenen Punkten.
Nach Dokumentation der Textdurchsicht bleibt die Cloudflare-Vertrags-/Kontoprüfung offen.
Erneut tatsächlich ausgeführt: Exit 1 ausschließlich mit dieser verbleibenden Meldung.
Bloßer Scope-Wechsel, alte Pages-Durchsicht, fehlende Angaben oder Origin-Abweichung
genügen nicht. Auch der Worker selbst sperrt `/login` und meldet `/health` 503, wenn
diese Nachweise fehlen, unabhängig von einem Galerie-Link und selbst bei vollständig
gesetzten technischen Zugangswerten. Rechtstexte bleiben vor Login lesbar.

Das Runtimegate verhindert keine direkten Code-Uploads: Auch ein deaktivierter
öffentlich hochgeladener Worker würde die Rechtstexte ausliefern. Ein solcher Upload
braucht weiterhin geprüfte Texte und einen konkreten Deploymentauftrag. Kein
Deployment-/Freigabeersatz durch den eingebauten Aktivierungscheck.

Erfolgreich geprüft: `npm run check` mit 149 Tests, Build und Worker-Dry-Run;
`npm run worker:test-runtime` mit echter lokaler workerd-/SQLite-Laufzeit, synthetischen
Zugangsdaten, Rechtstexten und Datenschutzgate; `npm run test:browser` mit 35 bestandenen
und einem bewusst übersprungenen Fall. Der zusätzliche Worker-Browserfall prüft bereits
Desktop und 320px in einem isolierten synthetischen Lauf, deshalb keine doppelte
Ausführung im Mobilprojekt. Bestehende sechs Kunstreferenzen unverändert erfolgreich.

## Anbieterquellen, am 03.11.2026 erneut gelesen

- [Cloudflare-Datenschutz, insbesondere End Users und Anbieterrollen](https://www.cloudflare.com/privacypolicy/).
- [Cloudflare-DPA, insbesondere internationale Übermittlungen](https://www.cloudflare.com/cloudflare-customer-dpa/).
- [Self-Serve-Vertrag, insbesondere Abschnitt 6.1](https://www.cloudflare.com/terms/).
- [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html).
- [GitHub-User-Tokens und Ablauf](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app).

Technische Zeiträume/Cookieattribute stammen aus `workers/admin/index.ts` und
`workers/admin/store.ts`; Tokens/Schreibpfad aus `workers/admin/github.ts`. Externe
Aufbewahrung ist damit nicht abgedeckt.
