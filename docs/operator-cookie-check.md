# Echte Cloud-Cookieprüfung – Anmeldung, Modusspeichern und Abmelden

## Aktueller Abschluss – 04.11.2026

Nach konkreter Vorlage hat der Betreiber mit **„Leg los“** die zwei Speicherwechsel
samt Git-/CI-/Pages-Folgen und das genau benannte lokale Sicherungsarchiv freigegeben.
Die Speicherschritte wurden nach Anleitung im privaten iPhone-Safari unter derselben
Cookieeinstellung durchgeführt: „Cross-Sitetracking verhindern“ aktiv, keine Ausnahme.
Cookieeinstellung als Betreiberbefund gemäß Durchführung; keine eigene Einsicht des
Agenten in Sitzung, Cookies, Callbackparameter oder Zugangsdaten.

Der Betreiber bestätigt nach dem Hinwechsel **„Maximale Freiheit Version 4 wird
angezeigt“**, nach der lesenden Zwischenprüfung und dem Rückwechsel
**„Nachvollziehbare Vererbung Revision 5 wird angezeigt“**. Der gespeicherte Stand
wurde unabhängig davon anhand der konkreten Git-Commits verifiziert.

| Wechsel              | Commit / Zeitpunkt MEZ am 04.11.2026                                                                                                      | CI                                                                          | Pages                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| traceable/3 → free/4 | [25341921a5224d8addc70965b40ad695a6780523](https://github.com/bummber/evolvera/commit/25341921a5224d8addc70965b40ad695a6780523), 14:15:41 | [erfolgreich](https://github.com/bummber/evolvera/actions/runs/41836487323) | [Build/Deploy erfolgreich](https://github.com/bummber/evolvera/actions/runs/41836487402) |
| free/4 → traceable/5 | [a66d0b49041149d3734a2e5bee2b56a5fc6f30b6](https://github.com/bummber/evolvera/commit/a66d0b49041149d3734a2e5bee2b56a5fc6f30b6), 14:24:12 | [erfolgreich](https://github.com/bummber/evolvera/actions/runs/41837771591) | [Build/Deploy erfolgreich](https://github.com/bummber/evolvera/actions/runs/41837771726) |

Beide Commits ändern ausschließlich Modus und Revision in `config/generation.json`.
Elternfolge: `d844e3f → 2534192 → a66d0b4`. Erwartete Git-Dateiblobs bestätigt:
free/4 `97935748d4488e772dafad77282739bf6316e196`,
traceable/5 `488c9842d8dc53e66a70c251227a5b3140bed98c`.
Nach beiden Deployments jeweils alle **22 öffentlichen Builddateien bytegleich**
zum zugehörigen erfolgreichen Pages-Artefakt geprüft (Artefakt-IDs `13325403006`
und `13326652978`). Archiv leer, Generierungsschritt jeweils übersprungen.
Worker-Health danach HTTP 200 mit `configurationReady:true`; kein Worker-Upload.

Remote-Endstand des Tests: **traceable/Revision 5**, Generierung false, Startdatum
null, `seriesAuthorized:false`, offizieller Index leer. Pages-Schalter true,
Automatisierungsschalter beim Test nicht gesetzt. Lokales HEAD/main und gespeichertes
origin/main bleiben `d844e3fd623c19ce3185e1e9f165536aab0b5606`, lokale Konfiguration
weiter traceable/3. Kein Fetch, Pull, Merge oder lokaler Commit; Revision 5 später
bewusst erhalten und niemals mit der lokalen Revision 3 überschreiben.

Damit ist der begrenzte echte Modusspeichernachweis unter der Cookieprüfeinstellung
erbracht. Die vorherige Anmeldung-/Logoutprüfung bleibt separat bestätigt; ein erneutes
Logout nach dieser Modusrunde wurde nur empfohlen, nicht als ausgeführt bestätigt.
Die frühere zusätzliche Konfliktanzeige ist weiterhin nicht abschließend erklärt.
Keine vollständige Sitzungs-/Negativfallabnahme, Wirkung auf ein offizielles Folgewerk
oder Serienfreigabe daraus ableiten. Die konkrete Speicherfreigabe ist erledigt.

Im anschließenden Übergabeschritt kein neuer Remoteabgleich, Livezugang oder
Speichervorgang; lediglich Dokumentation fortgeschrieben.

## Historische Anleitung und vorheriges Login-/Logoutergebnis

Die folgende ursprüngliche Anleitung bezog sich ausschließlich auf Anmeldung und
Logout vor dem separat freigegebenen Speichertest. Ihre damaligen offenen Punkte
und Revision 3 sind historisch; sie erteilt keinen weiteren Speicherauftrag.

**Anmeldung und Logout am 04.11.2026 durch den Betreiber erfolgreich geprüft.**
Der Betreiber bestätigt die Durchführung auf dem iPhone in Safari im Privatmodus
nach dieser Anleitung: Anmelden und Abmelden funktionieren; nach Reload nach dem
Abmelden erscheint das Speicherformular nicht wieder. Damit ist dieser begrenzte
echte Cloudtest bestanden. Cookieeinstellung gemäß Durchführung nach Anleitung,
kein eigener Zugriff des Agenten auf Browserzustand, Cookies oder Sitzung.
Eine Modusspeicherung unter dieser Einstellung wurde nicht bestätigt oder beauftragt.

Die folgende am 04.11. vorbereitete Anleitung dokumentiert den ausgeführten Ablauf.
Diese Anleitung prüft ausschließlich den bereits eingerichteten Betreiberzugang.
Keine neue Einrichtung, Secret-Eingabe, Modusspeicherung, Veröffentlichung oder
Serienaktivierung. Die erfolgreiche iPhone-/Safari-Galerieprüfung bleibt erhalten.

## Kurzer Ablauf auf dem vorhandenen iPhone

1. Unter **Einstellungen → Apps → Safari → Datenschutz & Sicherheit** kontrollieren,
   dass **„Cross-Sitetracking verhindern“** aktiv ist. Der WebKit-Schutz blockiert
   Drittanbieter-Cookies. „Alle Cookies blockieren“ ist eine andere Einstellung,
   die auch notwendige eigene Sitzungscookies sperrt; sie gehört nicht zu diesem
   Test. Keine Cookie-/Trackingausnahme erteilen.
2. Einen **neuen privaten Tab im Safari-Browser** öffnen, für diesen Test die
   gespeicherte Homescreen-Webapp nicht verwenden. Alle folgenden Schritte im
   selben Tab durchführen. Die Anmeldedaten ausschließlich selbst bei GitHub
   eingeben; nichts davon an den Agenten übermitteln.
3. [Galerie-Einstellungen](https://bummber.github.io/evolvera/#/einstellungen)
   öffnen → **„Zur geschützten Betreiberseite“** → **„Mit GitHub anmelden“**.
   Mit dem bestehenden Betreiberkonto `bummber` anmelden, gegebenenfalls eigene
   GitHub-Zwei-Faktor-Bestätigung durchführen. Keine neue App/Installation freigeben.
4. Rückkehr auf die bestehende Worker-Seite unter `/settings` prüfen: gespeicherter
   Modus und Revision sind sichtbar. Zuletzt dokumentiert: **Nachvollziehbare
   Vererbung, Revision 3**. Bei Abweichung nur den angezeigten Stand melden,
   nichts korrigieren oder speichern. **„Modus speichern“ nicht betätigen.**
5. **„Abmelden“** wählen. Erwartet: Anmeldung wird wieder angeboten. Anschließend
   dieselbe Worker-Einstellungsseite **neu laden**; ein Speicherformular darf
   ohne neue Anmeldung nicht wieder erscheinen. Danach den privaten Prüftab schließen.

Die Ansicht nach Logout durch erneutes Laden prüfen, nicht allein durch die
Zurück-Taste und eine möglicherweise wiederhergestellte Browseransicht.
Der Test meldet die dafür neu angelegte Sitzung ab, nicht absichtlich andere Sitzungen.

## Alternative auf dem Mac, falls Chrome bereits vorhanden ist

Neues Inkognitofenster mit **⌘⇧N** öffnen. Drittanbieter-Cookies sind dort nach
Google standardmäßig blockiert; kontrollieren, dass für Galerie, Worker oder GitHub
keine vorübergehende Ausnahme aktiviert wurde. Dann Schritte 3–5 durchführen.
Eine neue Chrome-/Firefox-Installation ist für den iPhone-Ablauf nicht nötig.

## Rückmeldung ohne vertrauliche Daten

Ausreichend ist beispielsweise:

> iPhone/Safari, Cross-Sitetracking verhindern aktiv. Anmeldung und Rückkehr
> erfolgreich, angezeigter Modus … / Revision … . Abmelden erfolgreich;
> nach Neuladen weiterhin Anmeldung erforderlich.

Bei Problemen nur Schritt und sichtbare Fehlermeldung nennen. Keine Callback-URL
mit Parametern, Codes, Cookies, Tokens, Passwörter oder vollständigen Netzwerklogs
übermitteln. Den Datenschutzschutz nicht ausschalten, um den Test erfolgreich zu machen.

## Aussagekraft und Grenze

Ein Erfolg belegt echte Anmeldung/Callback und Logout bei blockierten
Drittanbieter-Cookies im genannten Browser. Das ergänzt die bereits bestandenen
synthetischen Login-/Formularprüfungen und die frühere echte Modusrunde.
Es ist **noch kein neuer realer Speichernachweis unter genau dieser Cookieeinstellung**.
Für den vollständigen Cloudnachweis von A-25 wäre eine konkrete Modusspeicherprüfung
gesondert vorzulegen: ein solcher Schreibvorgang kann Git-Commit und Pages auslösen.
Die Anleitung erteilt dafür keine Freigabe. Generierung und Serienstart bleiben aus.

## Anbieterquellen, am 04.11.2026 geprüft

- [Apple: Privatsphäre beim Surfen auf dem iPhone](https://support.apple.com/de-de/guide/iphone/iphb01fc3c85/ios)
  (Abruf der deutschen Fassung zeitweise mit HTTP 429; entsprechender
  [Apple-Anleitungstext](https://support.apple.com/nl-nl/guide/iphone/iphb01fc3c85/ios) gelesen).
- [WebKit: Tracking Prevention / Full Third-Party Cookie Blocking](https://webkit.org/tracking-prevention/)
- [Google: Cookies in Chrome zulassen und blockieren](https://support.google.com/chrome/answer/95647?hl=de)
- [Google: Inkognitofenster öffnen](https://support.google.com/chrome/answer/95464?hl=de)
