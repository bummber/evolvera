# Erstes öffentliches Pages-Testdeployment

02.11.2026. Nach Bestätigung der Betreiberangaben hat der Betreiber den Push der
vorbereiteten Änderungen und das erste Pages-Testdeployment ausdrücklich freigegeben.
Die offizielle Serie war nicht Bestandteil dieses Auftrags.

## Ergebnis

- Live: https://bummber.github.io/evolvera/
- Commit: `9ad1fa797210680e4348e2da5c487c2b37037960`.
- [Push-CI 41524513299](https://github.com/bummber/evolvera/actions/runs/41524513299): erfolgreich.
- [Pages-Lauf 41524588435](https://github.com/bummber/evolvera/actions/runs/41524588435):
  `workflow_dispatch`, `deploy=true`, Build und Deploy erfolgreich.
- Pages-Quelle per GitHub-API auf `workflow` eingerichtet; HTTPS erzwungen.
- `PAGES_DEPLOYMENT_ENABLED=true` gesetzt; `EVOLVERA_AUTOMATION_ENABLED` nicht gesetzt.
  Keine Generierung, kein offizielles Werk, kein Worker-Deployment.

Der Push-Lauf des Pages-Workflows 41524513418 war vor Setzen der Variable korrekt
übersprungen. Anschließend wurde genau ein manueller Veröffentlichungsworkflow gestartet.
Künftige Pushes auf `main` können bei gesetzter Pages-Variable automatisch veröffentlichen.
Eine spätere Veröffentlichung braucht weiterhin einen passenden Betreiberauftrag.

## Prüfungen

Lokal `npm run check` (131 Tests), `npm run check:publication` und
`npm run test:browser` (32 Fälle) erfolgreich. Auf GitHub zusätzlich echter
workerd-/SQLite-Laufzeittest erfolgreich. Der Generierungsschritt wurde übersprungen.
Bestehende Kunstreferenzen unverändert, keine neuen Abhängigkeiten.

Die öffentliche HTTPS-Seite liefert HTTP 200. HTML sowie initiales JavaScript und
CSS stimmen bytegenau mit dem lokal gebauten Stand überein. SHA-256 des HTML:
`a10545da1afac84cad5f54e6746863bc59c8fb5dfb7548231629c3746b6a25a1`.
`/evolvera/artworks/index.json`: HTTP 200, `application/json`, null offizielle Werke.

Im echten In-App-Browser geprüft: Startseite, Impressum/Datenschutz ohne
Entwurfskennzeichnung, die getrennte 40er-Sammlung, nachvollziehbare Galerie,
Werkdetail/Elternbelege sowie freier Modus. Bei gemessenen 320 CSS-Pixeln kein
horizontaler Überlauf der geprüften Werkansicht und keine verbotenen Kunstelemente.
Der reguläre eingebettete Browser war zunächst nur 319 CSS-Pixel breit, also unter
der vereinbarten Mindestbreite. Die temporäre Größenanpassung wurde zurückgesetzt.
Keine Prüfung auf physischen Smartphones oder Safari/Firefox behauptet.

Nicht blockierende GitHub-Hinweise: verschachtelte Upload-Action deklariert noch Node
20, Runner führt sie bereits mit Node 24 aus; Ubuntu-Image-Migration angekündigt.
Kein Fehler und kein Anlass für ein ungetestetes Werkzeugupgrade in diesem Auftrag.

## Erhaltene Grenzen und nächster Schritt

`seriesAuthorized:false`, `seriesStartDate:null`, `generationEnabled:false`, Modus
`traceable`, Revision 1. Betreiber-Origin null, Worker deaktiviert; kein echter
GitHub-App-Login und keine Cloudflare-Einrichtung. Keine Änderung alter Kunstwerke.
EP-01 bleibt vorgemerkt. Nächster Schritt: gemeinsame Live-Durchsicht und danach
konkrete Freigabe der Betreiberanmeldung/externen Einrichtung. Serienstart separat.

Dieser Abschlussbericht und der aktualisierte Übergabevermerk werden lokal
versioniert; kein weiterer Pages-Lauf allein zum Veröffentlichen des Berichts.

## Einrichtung nach offizieller Dokumentation

- [GitHub Pages per API einrichten](https://docs.github.com/en/rest/pages/pages#create-a-github-pages-site)
- [GitHub Actions als Veröffentlichungsquelle](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
