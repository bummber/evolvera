# Öffentliche Vorschau – Betreiberangaben und Datenschutz

Stand: 02.11.2026. Die Angaben wurden bestätigt; anschließend wurden Push und erstes
Pages-Testdeployment ausdrücklich freigegeben und erfolgreich durchgeführt.
Live: https://bummber.github.io/evolvera/ — [Deploymentbericht](first-pages-deployment.md).

## Festgelegt und umgesetzt

Der Betreiber hat Deutschland und ein Kunstprojekt ohne Einnahmen angegeben.
Name, Projekt-E-Mail und die zur Veröffentlichung vorgesehene Anschrift wurden
ausdrücklich im Chat übermittelt. Sie stehen ausschließlich zentral in
`config/legal.json`; keine Ableitung aus Git-Profil, Kontodaten oder lokalen Pfaden.
Die Angaben erscheinen lokal auf `#/impressum` und `#/datenschutz`. Beide Seiten
sind von jeder App-Ansicht im Footer erreichbar. Keine neuen Abhängigkeiten.

Die Datenschutzhinweise beschreiben die statische Pages-Galerie, GitHub-Verbindungsdaten,
das Proton-Mail-Kontaktpostfach, Verarbeitung zu Kontaktzwecken, Speicher-/Löschkriterien,
Rechte und die saarländische Aufsicht. Eigene Besucheranalyse, fremde Schriftarten,
Medieneinbettungen, Cookies und persistente Besucherspeicherung sind im geprüften
Galeriecode nicht eingerichtet. Atelier-Eingaben bleiben im Browser. Verlinkte
Anbieterinformationen werden erst beim Aufruf des Links geladen.

GitHub-/Cloudflare-Betreiberanmeldung ist extern weiterhin nicht eingerichtet. Die
Texte versprechen keinen aktiven Login und behandeln diese zukünftige Verarbeitung
nicht als bereits vorhanden. Vor Aktivierung braucht sie konkrete ergänzte Hinweise.

## Durchsicht und Veröffentlichung

Die bestätigten Angaben und der anschließend erteilte Veröffentlichungsauftrag sind
mit `reviewedOn:2026-11-02` dokumentiert. Dies ist keine anwaltliche oder automatisierte
rechtliche Freigabe. Der Entwurfshinweis entfällt. Die folgende Liste dokumentiert die
vorbereitenden Schritte; Push/erstes Deployment sind inzwischen beauftragt:

1. Betreiber prüft Schreibweise und Anschrift sowie die Hinweise zu Hosting, Kontakt,
   Löschung und Rechten. Rechtsgrundlage/Anbieterrollen anhand des konkreten Betriebs
   beurteilen; die Vorlage ist keine anwaltliche Prüfung oder Rechtsgarantie.
2. Erreichbarkeit des neuen Proton-Postfachs selbst durch Empfang und Antwort prüfen.
   Kein Testversand durch den Agenten beauftragt oder ausgeführt.
3. Textdurchsicht dokumentieren (`reviewedOn`), danach `npm run check:publication`.
   Das Datum allein ist keine Deploymentfreigabe.
4. Expliziten Auftrag für Push der vorbereiteten Änderungen und erstes Pages-Deployment
   einholen. Dabei werden auch die Betreiberangaben in Git und Website öffentlich.
   Die frühere Freigabe betrifft ausschließlich den ersten privaten Push und die
   anschließend separat beauftragte öffentliche Repositorysichtbarkeit.
5. GitHub Pages aus Actions einrichten, bewusst `PAGES_DEPLOYMENT_ENABLED=true`
   setzen, Prüfungen und konkrete URL verifizieren. `EVOLVERA_AUTOMATION_ENABLED`
   bleibt aus; Serienfreigabe false, Startdatum null und Generierung false unverändert.

`npm run check:publication` prüft streng validierte Kontaktangaben, dokumentierte
Durchsicht und den vorgesehenen Datenschutzhinweisumfang. Im Pages-Workflow läuft
dies vor Archivschreiben und Build/Upload. Lokale Builds und CI bleiben für Entwürfe
möglich. Bei später gesetzter Betreiber-Origin verlangt die Prüfung zunächst die
Erweiterung der Datenschutzinformationen und des zugehörigen Prüfumfangs. Sie
bescheinigt keine rechtliche Vollständigkeit und ersetzt keinen Betreiberauftrag.

Mit dem konkreten Deploymentauftrag ist die App nun als „Testversion“ beschriftet.
Dies funktioniert lokal und öffentlich; es behauptet keinen offiziellen Serienstart.

## Tatsächlich geprüft

- `npm run check`: Format, Lint, Typen, **131 Tests**, Datenprüfung, Produktionsbuild,
  lokaler Worker-Dry-Run erfolgreich.
- `npm run test:browser`: **32 Fälle**, Desktop/320px Chromium, inklusive Direktlinks,
  Footer, Kontaktlink, Fokus, Layout und fehlenden automatischen Fremdabrufen.
  Die sechs bestehenden Kunstreferenzen unverändert erfolgreich.
- `npm run check:publication` vor Freigabe: erwartungsgemäß Exit 1, ausschließlich die
  noch offene Textdurchsicht gemeldet. Nach Freigabe erfolgreich, lokal und im Pages-Lauf.
- Beide Seiten zusätzlich im lokalen In-App-Browser geöffnet und sichtbar geprüft.
- Bis zur ersten Freigabe kein Push dieser Änderungen, kein Pages- oder Worker-Deployment, keine Anmeldung,
  keine offizielle Generierung. Worker-/Sitzungsimplementierung unverändert; deren
  Laufzeittest in diesem Arbeitspaket nicht erneut ausgeführt.

## Quellen für den Entwurf

Am 02.11.2026 gelesen; bei geändertem Betrieb neu prüfen:

- [LFK: Impressumspflicht auch außerhalb ausschließlich persönlicher/familiärer Angebote](https://www.lfk.de/service/dokumente-rechtsgrundlagen/leitfaden-zur-impressumspflicht-im-internet)
- [Sächsische Datenschutzaufsicht: Informationspflichten](https://www.datenschutz.sachsen.de/informationspflichten.html)
- [GitHub Pages: Datenerfassung](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection)
- [GitHub: Datenschutzerklärung, Empfänger, Transfers, Aufbewahrung und Kontakt](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)
- [Proton: Datenschutzinformationen](https://proton.me/legal/privacy)
- [Europäische Kommission: Angemessenheitsentscheidungen einschließlich Schweiz](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en)
- [Unabhängiges Datenschutzzentrum Saarland](https://www.datenschutz.saarland.de/)
