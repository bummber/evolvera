# Betreiberanmeldung – Datenschutzvorbereitung

Stand: 02.11.2026. **Technischer Textentwurf zur Durchsicht, nicht veröffentlicht
oder abgenommen.** Die öffentliche Datenschutzerklärung und `privacyScope:pages-only`
bleiben unverändert. Die Anmeldung ist aus. Dieser Entwurf ist kein Beleg einer
rechtlichen Prüfung und schaltet das Veröffentlichungsgate nicht frei.

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

Nach Vervollständigung in `src/app/LegalPages.tsx` einarbeiten und auf der
Worker-Oberfläche bereits vor `/login` verlinken. Den bisherigen Satz „derzeit nicht
eingerichtet“ und den Stand dann passend zum tatsächlichen Betrieb aktualisieren.

> Die öffentliche Galerie bleibt ohne Anmeldung nutzbar. Nur wenn du den
> Betreiberbereich öffnest, wird dessen Cloudflare-Worker aufgerufen. Die
> GitHub-Anmeldung ist ausschließlich zur Verwaltung durch den Betreiber vorgesehen.
> Sie dient dazu, das berechtigte Konto zu erkennen und den Vererbungsmodus für
> zukünftige Generierungen sicher zu speichern. Andere Konten werden abgewiesen.
>
> Der Betreiberbereich wird unter **[bestätigte Worker-Origin ergänzen]** bei
> Cloudflare bereitgestellt. Beim Aufruf verarbeitet Cloudflare technische
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

Aktuell blockiert `publicationIssues` jede gesetzte Betreiber-Origin; das ist korrekt
und bleibt in diesem Vorbereitungspaket bestehen. Die Prüfung erfasst nur den
Pages-Publish-Prozess, **keine direkten Worker-Deployments**. Ein nicht verlinkter,
aktivierter Worker braucht ebenfalls die fertigen Hinweise und Freigabe.

Im nächsten beauftragten lokalen Paket den neuen Prüfumfang nur zusammen mit
tatsächlich gerenderten Hinweisen einführen. Eine eigenständige, explizite
Betreiber-Durchsicht für die Anmeldung erfassen, an die bestätigte Worker-Origin
binden und die vorhandene Pages-Durchsicht nicht übernehmen. Fehlende Durchsicht,
Origin-Abweichung oder bloße Scope-Umschaltung müssen das Gate weiter blockieren.
Mit synthetischen Daten testen und UI-/Worker-Laufzeitprüfungen ausführen. Erst die
fertige Fassung zur externen Veröffentlichung/Aktivierung vorlegen.

## Anbieterquellen, am 02.11.2026 gelesen

- [Cloudflare-Datenschutz, insbesondere End Users und Anbieterrollen](https://www.cloudflare.com/privacypolicy/).
- [Cloudflare-DPA, insbesondere internationale Übermittlungen](https://www.cloudflare.com/cloudflare-customer-dpa/).
- [GitHub-User-Tokens und Ablauf](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app).

Technische Zeiträume/Cookieattribute stammen aus `workers/admin/index.ts` und
`workers/admin/store.ts`; Tokens/Schreibpfad aus `workers/admin/github.ts`. Externe
Aufbewahrung ist damit nicht abgedeckt.
