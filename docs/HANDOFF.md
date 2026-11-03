# Evolvera – aktueller Übergabestand

Stand: 03.11.2026. Aktueller Betreiberauftrag hat Vorrang. Die öffentliche
**Pages-Testversion ist veröffentlicht und geprüft**. Betreiberanmeldung und
Worker-Einrichtung sind noch offen. Cloudflare-Konto und lesende Codex-MCP-Verbindung
sind inzwischen vorhanden und geprüft. Kein offizieller Serienstart.
Die GitHub App wurde am 03.11. separat freigegeben, registriert und ausschließlich
auf `bummber/evolvera` installiert; Secrets und Worker fehlen weiterhin.
Auf anschließenden Fortsetzungsauftrag sind Datenschutzhinweise und unabhängige
Pages-/Worker-Aktivierungsgates lokal umgesetzt. Die Textdurchsicht für die gewählte
Worker-Adresse wurde anschließend ausdrücklich bestätigt; Cloudflare-Kontoprüfung offen.

## Aktueller Stand – lokaler Werkbuch-Checkpoint am 03.11.2026

Nach dem Wiedereinstieg wurde ein ausschließlich lokaler Werkbuch-Checkpoint
vorgeschlagen: bestehende Browsersuite am gebauten Stand ausführen, Dateiauswahl
sichten und lokal sichern. Der Betreiber hat diesen nächsten Schritt mit
„Mach weiter“ beauftragt. Dies erweitert den vorherigen reinen Bestandsauftrag
um die lokale Sicherung, nicht um Push, Veröffentlichung oder externe Einrichtung.
Die positive Designsichtung bleibt abgeschlossen; keine neue Designrunde.

- Ausgangsstand erneut geprüft: bestehendes Projekt, `main`, HEAD `8a324da`,
  drei lokale Commits vor dem bekannten `origin/main`, `origin` unverändert
  `https://github.com/bummber/evolvera.git`. Kein neuer Remoteabgleich.
- Die vorhandene Werkbuch-Umsetzung einschließlich Komponenten, CSS, lokalen
  Schriftpaketen/OFL-Lizenzen, Tests und Designdokumentation wird gezielt mit
  Commit-Titel `chore: checkpoint reviewed Werkbuch design locally` gesichert.
  Den resultierenden Hash mit `git log -1` lesen. Das PRD-Backup bleibt
  unversioniert und bytegleich; Build-, Browser- und Workerausgaben bleiben ignoriert.
  In diesem Checkpoint keine Produkt-, Kunst-, Daten- oder Konfigurationsänderung;
  nur der bestehende Stand und aktualisierte Übergabedokumentation.
- Node 24.21.0/npm 12.2.0. `npm run check` erneut vollständig erfolgreich:
  Format/Lint/Typen, **155 Tests**, Datenprüfung, Produktionsbuild und lokaler
  Worker-Dry-Run. Nach dem Build `npm run test:browser`: **66 bestanden, sechs
  bewusste Doppelaufruf-Skips**. Sechs unveränderte Kunstreferenzen bestanden;
  100 Seiten-/Breitenkombinationen bei 320/390/768/1024/1440 px ohne horizontalen
  Dokumentüberlauf, externe Requests oder `img/svg/canvas`. Tastatur/Fokus,
  lange Titel, Reduced Motion und Menügrenze erneut automatisiert geprüft.
  Keine neue manuelle Bildsichtung oder Designabnahme daraus ableiten.
- Worker-/Sitzungscode unverändert; kein separater `worker:test-runtime`-Lauf.
  Der bestehende Browserfall nutzte einen isolierten lokalen Worker mit
  temporärem Speicher und synthetischen Daten. Safari/Firefox, physische Geräte,
  echte Safe-Area und vollständige WCAG-Abnahme bleiben offen.
- `npm run check:publication` erneut erwarteter Exit 1, ausschließlich
  „Cloudflare-Vertrag und Kontoeinstellungen noch zu prüfen.“
  `providerReviewedOn:null`; Secrets, Worker-Bereitstellung und echte Anmeldung
  weiterhin offen. Keine externe Prüfung oder Einrichtung in diesem Schritt.
- Generierung `false`, Startdatum `null`, `seriesAuthorized:false`, Modus
  `traceable`, Revision 1 und offizielles Archiv leer. Kunstabnahme der 40
  Testwerke bleibt separat erhalten. Geschützte Kunst-/Archiv-/Daten-/Betreiber- und
  Konfigurationspfade sowie Referenzbilder gegenüber dem Ausgangs-HEAD unverändert.

Nächster Vorschlag nach gemeinsamer Sichtung des Checkpoints: die offene
Cloudflare-Vertrags-/Kontoprüfung als eigenen **lesenden** Auftrag abgrenzen
(tatsächlicher Vertragspartner, wirksame Bedingungen/DPA, Logging-Einstellungen).
Keine Vereinbarung annehmen, Rechte erweitern, Secrets erzeugen oder deployen.
Eine tatsächliche Durchsicht erst nach ihrem Nachweis dokumentieren; gegebenenfalls
Textversion und Textdurchsicht erneuern. Veröffentlichung und Betreiber-Einrichtung
bleiben eigene Aufträge. Ein Push auf `main` kann Pages starten.

## Vorheriger Wiedereinstieg nach positiver Designsichtung – 03.11.2026

Der Betreiber hat nach Abschluss von Paket 10 bestätigt: „Ich habe mir die Änderungen
angeschaut und sie sehen gut aus.“ Der lokale gestalterische Stand der **zehn
Werkbuch-Pakete ist damit positiv gesichtet**. Der anschließende Auftrag umfasst nur
die Statusdokumentation und einen Startprompt für einen neuen Chat im selben Projekt.
Keine weitere Gestaltung, Implementierung, Sicherungscommits oder Veröffentlichung
aus dieser Rückmeldung ableiten. Frühere Vorschläge zur gemeinsamen Designsichtung
in der folgenden Paketchronik sind durch diese Rückmeldung erledigt.

- Bestehender Ordner `/Users/abrocker/ai_o_projects/evolvera`, `main`, HEAD `8a324da`,
  `origin` `https://github.com/bummber/evolvera.git`. Drei lokale Commits seit dem
  bekannten `origin/main`; kein neuer Remoteabgleich. Sämtliche Designänderungen,
  Schriften, neuen Komponenten, CSS- und Testdateien liegen **uncommittiert** vor.
  Auch unversionierte Dateien erhalten; insbesondere PRD-Backup nicht aufnehmen
  oder formatieren. Dies ist eine dokumentierte Übergabe, kein neuer Git-Checkpoint.
- Letzter UI-Prüfstand aus Paket 10: **155 Tests** im Gesamtcheck; **66 Browserfälle
  bestanden, sechs bewusste Doppelaufruf-Skips**. 100 Seiten-/Breitenkombinationen
  bei 320/390/768/1024/1440 px ohne horizontalen Dokumentüberlauf, sechs unveränderte
  Kunstreferenzen. Details und Einschränkungen in [design-implementation.md](design-implementation.md#paket-10--feinschliff).
  Safari/Firefox, physische Geräte, echte Safe-Area und vollständige WCAG-Abnahme offen;
  Evolution zeigt bewusst das ausgewählte Werk mit bereits geladenen Eltern,
  kein vollständiges Gesamtarchiv-Geflecht.
- Generierung `false`, Startdatum `null`, `seriesAuthorized:false`, Modus `traceable`,
  Revision 1, offizielles Archiv leer. Die frühere Abnahme der 40 Testwerke bleibt
  unabhängig von der Designsichtung und Serienfreigabe erhalten.
- Öffentlicher Pages-Stand zuletzt dokumentiert `9ad1fa7`; das neue Werkbuch-Design
  ist ausschließlich lokal. GitHub App registriert/installiert; Secrets, Worker-
  Bereitstellung und echte Anmeldung weiterhin offen. Keine externe Einrichtung
  in diesem Dokumentationsschritt erneut geprüft.
- Textdurchsicht für die geplante Betreiber-Origin/Version bestätigt;
  `providerReviewedOn:null`. `npm run check:publication` jetzt erneut ausgeführt:
  erwarteter Exit 1, ausschließlich „Cloudflare-Vertrag und Kontoeinstellungen noch
  zu prüfen.“ Ein späterer Push auf `main` kann den vorhandenen Pages-Workflow starten;
  weder Push noch Secretbefehle oder Deployment sind aus diesem Stand freigegeben.
- In diesem Übergabeschritt nur Dokumentation geändert. `npm run check` mit 155 Tests,
  Build und Worker-Dry-Run erneut erfolgreich; Formatierung und `git diff --check`
  geprüft. Kein neuer Browser-/Worker-Runtime-Lauf, da UI/Routing und Worker unverändert.
  PRD-Backup weiterhin bytegleich; geschützte Kunst-/Daten-/Betreiberpfade unverändert.

[Kopierbarer Startprompt für den nächsten Chat](NEXT-START.md). Zunächst Bestand
prüfen und den nächsten abgegrenzten Schritt vorschlagen. Externe Voraussetzungen
und technische Restprüfungen getrennt benennen; aus der Designsichtung keine
Veröffentlichungs-, Anmelde- oder Serienfreigabe ableiten.

## Werkbuch-Designauftrag – 03.11.2026

Der anschließende ausdrückliche Designauftrag ersetzt die frühere Warteanweisung
unten: zehn Pakete planen, ausschließlich **Paket 1 (Tokens/lokale Schrift) und
2 (Preview-Leiste/Header/Desktopnavigation/Footer)** lokal umsetzen. Quelle eindeutig
`docs/design-system.md`, vollständig gelesen und nur mit Prettier formatiert.
[Umsetzungsstand, Schriftbegründung, Prüfungen und Folgeauftrag](design-implementation.md).
Die Schriftdatei wurde vor dem Einbau binär auf `wdth` 62–125 geprüft. Kunst,
Generatoren, Daten, Referenzbilder, Betreiberlogik und sämtliche Gates bleiben erhalten.
PRD-Backup unverändert und unversioniert; keine Commits, Pushes oder Deployments.
Vor **Paket 3 (mobiles Overlay und Dock)** den Stand gemeinsam sichten; kein weiterer
Designumfang aus diesem Vermerk ableiten. Externe Einrichtung weiterhin zurückgestellt.
Abschließend `npm run check` mit 149 Tests, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: 40 bestanden, sechs doppelte Aufrufe bewusst übersprungen.
100 Ansichten über alle fünf Breiten ohne horizontalen Überlauf; Kontaktbögen und
Footer gesichtet. Sechs Kunstreferenzen unverändert bestanden. Prüfgrenzen und
Testkorrekturen stehen im verlinkten Umsetzungsvermerk.

**Anschließender Folgeauftrag:** Nach gezeigtem Stand und vorgeschlagenem Auftrag
für Paket 3 antwortete der Betreiber „ok“. Darauf ausschließlich **Paket 3** lokal
fortgesetzt: dunkles natives Details-Overlay, Fokus-/Scrollbindung, Dock unter
1000 px mit erhaltenen Testsammlungslinks, Safe-Area und Platz unter dem Inhalt.
Generatoren, Kunst, Daten, Betreiberlogik und sämtliche Gates bleiben erhalten;
keine neuen Abhängigkeiten, Commits, Pushes oder Deployments. Prüfstand und
Grenzen im [Umsetzungsvermerk](design-implementation.md#paket-3--mobiles-overlay-und-dock).
Paket 3 abschließend geprüft: `npm run check` mit 149 Tests, Build und Worker-Dry-Run;
`npm run test:browser` mit **44 bestanden, sechs bewussten Doppelaufruf-Skips**.
Alle fünf Breiten ohne horizontalen Überlauf; Overlay/Dock und Kontaktbögen gesichtet,
sechs Kunstreferenzen unverändert. Safari/Firefox, echte Geräte/Safe-Area offen.
Vor Paket 4 gemeinsam sichten und neuen abgegrenzten Auftrag entgegennehmen.

**Paket 4 anschließend ausdrücklich lokal beauftragt:** gemeinsame Buttons/Links,
Infochips/Badges, native Felder und Leer-/Fehlerzustände nach Werkbuch 7.6–7.9/7.20.
Umsetzung in separatem Shell-Baustein-CSS und vorhandenen UI-Komponenten. Texte,
Routen, Bedienelemente und Betreiber-Sperre erhalten; keine Filterfunktion, keine
neuen Abhängigkeiten, keine Kunst-/Daten-/Renderer-/Konfigurationsänderung.
Prüfungen und Grenzen im [Umsetzungsvermerk](design-implementation.md#paket-4--gemeinsame-bausteine).
Paket 4 abgeschlossen: `npm run check` mit 149 Tests, Build und Worker-Dry-Run;
`npm run test:browser`: **46 bestanden, sechs bewusste Doppelaufruf-Skips**.
Alle fünf Breiten ohne horizontalen Überlauf, Kontaktbögen und Leer-/Fehlerzustände
gesichtet; sechs Kunstreferenzen unverändert. Grenzen wie Safari/Firefox und echte
Geräte weiter offen; keine vollständige WCAG-Abnahme behauptet.
Paket 5 erst nach gemeinsamer Sichtung und neuem Auftrag. Alles weiterhin lokal,
kein Commit, Push oder Deployment; Veröffentlichung und Seriengates unverändert.

**Paket 5 anschließend lokal fortgesetzt:** Nach „es geht und sieht gut aus“ und
„ok, leg los“ ausschließlich Heute und Bühnenrahmen umgesetzt. Mobile Bühne vor
dem Text, ab 1000 px rechts; CSS-Schnittmarken, Materialetikett und tatsächliche
Generation bei vorhandenen Werken. Bestehende Leertexte/Überschriften erhalten,
Serieninfo dunkel gestaltet. Kein Countdown, keine neue Funktion oder Abhängigkeit.
ArtStage, Kunst, Daten, Referenzbilder und Betreiberlogik unverändert. Details und
Evolution behalten ihren bisherigen Aufbau. Prüfstand und Grenzen im
[Umsetzungsvermerk](design-implementation.md#paket-5--heute-und-bühnenrahmen).
`npm run check` mit 149 Tests, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: **48 bestanden, sechs Doppelaufruf-Skips**. 100 Ansichten
über fünf Breiten ohne horizontalen Überlauf; Kontaktbögen und volle leere Heute-Seite
sowie Testwerk-Heroaufnahmen gesichtet. Alle sechs Kunstreferenzen unverändert.
Safari/Firefox, physische Geräte und echte Safe-Area bleiben offen.
Vor Paket 6 gemeinsam sichten: nächster abgegrenzter Auftrag ist Galerie und
Werkkarten, mit erhaltenen Such-/Seiten-/Sammlungs-URLs und ruhiger Kunst. Kein
neuer Filter. Alles weiterhin lokal, kein Commit, Push, Deployment oder Serienstart.

**Paket 6 danach mit „du kannst starten“ freigegeben:** Galerie und Werkkarten
lokal gestaltet. Zweispaltiger Desktopkopf, Linien am Zähler, erstes Werk der
jeweiligen Seite/Suche hervorgehoben, vier Desktopspalten und zwei versetzte mobile
Kartenspalten. Hochformatige Kartenrahmen zeigen die quadratische Kunst vollständig;
ArtRenderer unverändert. Suche, zwölf plus acht Werke, Pagination, Fehlerzustände,
Sammlungslinks und zugängliche Kartennamen erhalten. Keine zusätzliche Datenabfrage,
Filterfunktion oder neue Abhängigkeit. Prüfstand im
[Umsetzungsvermerk](design-implementation.md#paket-6--galerie-und-werkkarten).
`npm run check` mit 149 Tests, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: **50 bestanden, sechs Doppelaufruf-Skips**. Alle fünf
Breiten und volle Galerieaufnahmen gesichtet; 100 Ansichten ohne horizontalen
Überlauf. Sechs Kunstreferenzen unverändert. Safari/Firefox und echte Geräte offen.
Nächster Vorschlag nach gemeinsamer Sichtung: Paket 7, Werkdetail mit Herkunft,
Titel-DNA und Werkdaten aus vorhandenen Werten. Kein Paket 8, keine neue Funktion.
Alles weiterhin lokal, Serie aus; kein Commit, Push oder Deployment.

**Paket 7 danach mit „Du kannst starten“ freigegeben:** Werkdetail lokal gestaltet,
mobil Bühne zuerst, auf Desktop links; Eltern-Klammer aus tatsächlichen Referenzen,
Merkmalsbelege mit A/B und dekorativen Zielwertvorschauen, Titel-DNA nur aus
gespeicherten Fragmenten. Mehrdeutige/überlappende Fundstellen bleiben unmarkiert,
Legende bleibt. Neun Werkdatenfelder unverändert und standardmäßig offen.
Keine Teilenfunktion; ArtStage, Kunst, Daten und Betreiberlogik unverändert.
Heute und Evolution behalten ihre Darstellung; keine neuen Abhängigkeiten.
[Umsetzungsstand und Grenzen](design-implementation.md#paket-7--werkdetail-herkunft-und-werkdaten).
`npm run check`: **153 Tests**, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: **52 bestanden, sechs Doppelaufruf-Skips**. Sechs
Kunstreferenzen unverändert. Alle fünf Breiten ohne horizontalen Überlauf;
Kontaktbögen und zusätzliche ganze Detailaufnahmen gesichtet. Safari/Firefox,
physische Geräte und echte Safe-Area weiter offen.
Vor Paket 8 gemeinsam sichten: Vorschlag Evolution nach Werkbuch mit bestehender
Auswahl, tatsächlichen Beziehungen und Sammlungslinks. Kein Paket 9, keine neue
Funktion oder Generierung. Alles lokal, kein Commit, Push, Deployment oder Serienstart.

**Paket 8 danach mit „Bitte starte 8“ beauftragt:** Evolution lokal als vertikaler/
horizontaler Zopf des ausgewählten Werks mit seinen bereits geladenen Eltern.
Semantische Liste, CSS-Linien, ruhige echte Vorschauen, drei Desktopkarten und
erhaltene Auswahl/Belege/Metadaten/Nachfolger. A/B aus tatsächlichen Eltern-IDs;
abweichende Zuordnung der Werkbuch-Skizze nicht übernommen. Kein Gesamtarchiv-Laden
oder vorgetäuschter durchgehender Pfad zu den Ursprüngen. Ursprung 1/2 ohne Kanten;
Werkauswahl auch bei Ladefehler nutzbar. h1-Texte erhalten, ArtStage/Renderer unverändert.
[Umsetzung und Grenzen](design-implementation.md#paket-8--evolution).
`npm run check`: **155 Tests**, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: **56 bestanden, sechs Doppelaufruf-Skips**. Sechs
Kunstreferenzen unverändert, 100 Ansichten über fünf Breiten ohne horizontalen
Dokumentüberlauf. Kontaktbögen und ganze Evolutionsansichten gesichtet. Safari/Firefox,
echte Geräte und Gesamtarchiv-Geflecht offen. Keine neuen Abhängigkeiten oder
Änderungen an Kunst, Daten, Konfiguration oder Betreiberlogik. Alles lokal, kein
Commit, Push, Deployment oder Serienstart.
Nach gemeinsamer Sichtung nächster Vorschlag: Paket 9, Über und Einstellungen im
Rahmen bestehender Logik. Keine neue Anmeldung, Speicherfunktion oder Generierungsschalter.

**Paket 9 danach mit „bitte starte paket 9“ beauftragt:** Über-Seite mit fünf
Kapiteln, Hash-Router-Sprungmarken und rein erklärenden HTML/CSS-Diagrammen;
Originaltexte und Überschriften erhalten. Einstellungen als Status-/Zugangsansicht
mit zwei nativen gesperrten Moduskarten aus dem tatsächlichen Konfigurationswert.
Bestehende Auth-Bedingung und Betreiber-Sperre erhalten; keine Sitzung, Speicherung
oder Generierungsschalter. Keine neuen Abhängigkeiten, Kunst-/Daten-/Backendänderung.
[Umsetzung und Prüfgrenzen](design-implementation.md#paket-9--über-und-einstellungen).
`npm run check`: **155 Tests**, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: **60 bestanden, sechs Doppelaufruf-Skips**. Alle fünf
Breiten ohne horizontalen Überlauf, sechs Kunstreferenzen unverändert. Kontaktbögen
und ganze Informationsseiten auf Desktop/Mobil gesichtet. Sprungmarken mit Fokus,
Reload und gleichem Ziel geprüft; Moduskarten ändern beim Klick nichts. Safari/Firefox,
echte Geräte, Safe-Area und echte Betreiberanmeldung weiter offen.
Nach gemeinsamer Sichtung Paket 10 vorschlagen: Feinschliff der bestehenden Shell,
Tastatur/Fokus, Reduced Motion und Kontraste. Alles weiterhin lokal, kein Commit,
Push, Deployment oder Serienstart.

**Paket 10 mit „ok, mach den Feinschliff“ lokal beauftragt:** ausgeglichene
Informationsüberschriften und begrenzte automatische Worttrennung langer Werktitel.
Originaltexte, Titel-DNA und Kunst erhalten. Drei neue Browserfälle je Projekt
prüfen 30 Tastaturdurchläufe bis zum Footer über fünf Breiten, 15 lange Titelansichten,
Reduced Motion und die Menügrenze 999/1000 px. Kontrast-/Trefferflächenstichproben
ohne Befund im erfassten Umfang; kein vollständiges WCAG-Audit.
[Prüfungen, Zwischenstände und Grenzen](design-implementation.md#paket-10--feinschliff).
`npm run check`: **155 Tests**, Build und Worker-Dry-Run erfolgreich;
`npm run test:browser`: **66 bestanden, sechs Doppelaufruf-Skips**. Alle fünf
Breiten ohne horizontalen Dokumentüberlauf; Kontaktbögen und lange Titel gesichtet.
Sechs Kunstreferenzen unverändert. Safari/Firefox, echte Geräte/Safe-Area, vollständige
WCAG-Abnahme und externe Betreiberprüfung bleiben offen. Keine neuen Abhängigkeiten
oder Änderungen an Kunst, Generatoren, Daten, Konfiguration oder Betreiberlogik.
Zehn Gestaltungspakete lokal umgesetzt; nächster Schritt ist gemeinsame Sichtung
und Designabnahme. Kein weiteres Paket automatisch starten, kein Commit, Push,
Deployment, Serienstart oder Generierung aus diesem Stand ableiten.

## Übergabe an den neuen Design-Chat – 03.11.2026 (vorheriger Stand)

**Aktueller Betreiberauftrag:** Den erreichten Stand sichern. Der Betreiber möchte
vor der nächsten Veröffentlichung das Design anpassen und gibt den konkreten
Designprompt in einem neuen Chat. **Jetzt keine Designänderung beginnen.**
Cloudflare-Vertragsprüfung, Secret-Anlage und Deployment sind vorerst nicht das
nächste Arbeitspaket; erst den neuen Designauftrag entgegennehmen und den Stand
gemeinsam sichten. Die bereits öffentliche Pages-Testversion bleibt auf `9ad1fa7`;
eine neue Veröffentlichung oder ein Serienstart ist nicht freigegeben.

Der gesamte in diesem Chat erarbeitete lokale Stand wird als Sicherungscommit
mit Titel `chore: checkpoint operator privacy work before design handoff` erhalten.
Er enthält App-Einrichtungsnachweis, Datenschutzvorbereitung/-gates, Tests und die
bestätigte Textdurchsicht. Kein Push. Vor der Sicherung: `main`, zwei lokale Commits
`5056ed7`/`d9f921b` vor `origin/main`; nach der Sicherung den neuen Commit zusätzlich
über `git log` prüfen. `origin` bleibt `https://github.com/bummber/evolvera.git`.

Für den neuen Chat maßgeblich:

- `AGENTS.md`, diese HANDOFF und `docs/PRD.md` v1.1 lesen. Der neue Designprompt
  bestimmt den Designumfang. Die frühere Auswahl Design A darf nicht als bereits
  erteilter Auftrag für die neue Gestaltung behandelt werden. EP-01 bleibt zurückgestellt.
- `docs/design-system.md` wurde während dieser Arbeit unversioniert vorgefunden,
  weder inhaltlich ausgewertet noch geändert oder als verbindliche Quelle übernommen.
  Es bleibt **außerhalb des Sicherungscommits**. Erst anhand des neuen Prompts klären,
  welche Rolle es spielen soll. `docs/PRD_v1.1_backup.md` ebenfalls unversioniert
  erhalten und bytegleich mit der PRD; nicht automatisch aufnehmen oder formatieren.
- Lokal enthält `config/legal.json` den vorbereiteten Scope `pages-and-operator`.
  Textdurchsicht für die ausgewählte Worker-Origin ist am 03.11. mit Version
  `2026-11-03.1` bestätigt. `providerReviewedOn:null` bleibt offen; Veröffentlichung
  und Worker-Anmeldung deshalb weiterhin gesperrt. Ändert der Designauftrag auch
  Datenschutztext oder Datenfluss, Version/Durchsicht entsprechend erneuern.
- GitHub App registriert und nur auf `bummber/evolvera` installiert. Noch keine
  Secrets, privaten Schlüssel, zusätzliche Cloudflare-Rechte oder Worker-Bereitstellung.
  Galerie-Origin null, `ADMIN_ORIGIN` leer, `ENABLED=false`. Serienstart null,
  Generierung aus, Serienfreigabe false, Modus `traceable`, Revision 1, Archiv leer.
- Kunst bleibt HTML/CSS. Generator-/Rendererhistorie, archivierte Daten und die
  abgenommenen 40 Testwerke erhalten. UI-Designänderungen dürfen alte Kunst nicht
  unbeabsichtigt verändern; bestehende sechs Kunstreferenzen nicht still ersetzen.
- Letzte Einzelprüfungen erfolgreich: Lint, Typen, **149 Tests**, Datenprüfung, Build,
  Worker-Dry-Run und **35 Browserfälle**, ein doppelter Worker-Aufruf bewusst übersprungen.
  Echter workerd-/SQLite-Lauf zuletzt im Datenschutzpaket erfolgreich. Der Gesamtcheck
  stoppt aktuell bereits bei Prettier an `docs/design-system.md`, beim Sichern erneut
  genauso ausgeführt. Formatprüfung dieser HANDOFF und `git diff --check` erfolgreich.
  `check:publication` stoppt nur an der offenen Cloudflare-Kontoprüfung.
  Für diese reine Sicherung keine neuen UI-/Worker-Laufzeitnachweise behaupten.
- Lokale Vorschauprozesse wurden auf 4173 (gebauter Galeriestand) und 8787
  (deaktivierter Worker) gestartet. Im neuen Chat Erreichbarkeit prüfen; Persistenz
  über den Chat-/App-Wechsel nicht voraussetzen. Bei Bedarf Projektbefehle verwenden.

## Öffentliche Vorschau und Git

- Live: https://bummber.github.io/evolvera/
- 40 getrennte Testwerke: https://bummber.github.io/evolvera/#/kunstpruefung
- Bestehender Ordner `/Users/abrocker/ai_o_projects/evolvera/`, Branch `main`,
  `origin` `https://github.com/bummber/evolvera.git`. Repository öffentlich.
- Veröffentlichter Commit: `9ad1fa797210680e4348e2da5c487c2b37037960`.
- [Normale GitHub-CI erfolgreich](https://github.com/bummber/evolvera/actions/runs/41524513299).
- [Erstes Pages-Deployment erfolgreich](https://github.com/bummber/evolvera/actions/runs/41524588435),
  inklusive Build, Tests, Upload, Prüfung des aktuellen Commits und Deploy.
- Pages-Quelle `workflow`, HTTPS erzwungen. `PAGES_DEPLOYMENT_ENABLED=true` gesetzt.
  Dadurch sind künftige freigegebene Pushes auf `main` auch Veröffentlichungsvorgänge.
  `EVOLVERA_AUTOMATION_ENABLED` nicht gesetzt, geplante Tagesläufe bleiben aus.
- Dokumentationsnachtrag `5056ed7` und die anschließende Einrichtungsvorbereitung
  werden nur lokal versioniert. Kein weiterer Push/Pages-Lauf beauftragt.
  Git und Umfang der lokalen Folgecommits vor dem Wiedereinstieg prüfen.
- Unversionierte `docs/PRD_v1.1_backup.md` ist identisch mit `docs/PRD.md` und wurde
  erhalten; nicht still in einen Commit aufnehmen.

## Betreiberentscheidungen und Quellen

Quelle bleibt `docs/PRD.md` v1.1; Root-v1.0 historisch. `AGENTS.md` beachten.
Design A ist ausgewählt. Die 40 bisherigen Testwerke beider Modi sind ausdrücklich
abgenommen; Versionen/Digests in `config/release.json` und `docs/art-review.md`.

Am 02.11. wurden nacheinander ausdrücklich freigegeben: erster privater Push samt
CI, öffentliche Repositorysichtbarkeit, dann Push der Impressums-/Datenschutzseiten
und erstes Pages-Testdeployment. Der letzte Auftrag umfasst die bestätigten Angaben
in `config/legal.json`. Deutschland, Kunst ohne Einnahmen; Kontaktdaten nicht aus
Profilen abgeleitet. `reviewedOn:2026-11-02`. Keine anwaltliche Rechtsprüfung behauptet;
Erreichbarkeit des neuen E-Mail-Postfachs nicht durch Testversand des Agenten geprüft.

Die neue PRD v1.2 aus dem anderen Ordner wurde ausschließlich ausgewertet. Das
abgeleitete [Erweiterungspaket EP-01](extensions/PRD-EP01.md) bleibt für später
vorgemerkt: höhere Varianz, Verläufe, Linien und Kurven. Nicht implementieren,
keine neue Serie und keine Neugenerierung alter Werke. Siehe `docs/future-series.md`.

## Verfügbarer Funktionsstand

Heute, Galerie mit Suche/Pagination, Werkdetails, Herkunft mit tatsächlichen Eltern
und Nachfolgern, Über-Seite, deaktivierter Betreiberzugang, Impressum und Datenschutz.
`#/kunstpruefung` zeigt 20 Werke je Modus; `#/atelier` und `#/evolutionslabor` bleiben.
Testdaten liegen separat, simulierte Januar-2000-Daten, nie offizielles Archiv.
Hash-Query `sammlung=traceable|free` wählt nur die Testsammlung, keine Konfiguration.
Kunst ausschließlich HTML/CSS, Hauptwerk mit Pause/reduzierter Bewegung, Kacheln statisch.
Bestehende Generatoren/Renderer, Daten und sechs Kunstreferenzen unverändert erhalten.

Worker lokal implementiert: GitHub-App-PKCE/State, feste numerische Betreiber-ID,
SQLite-Sitzung, CSRF/Origin, Logout, eingeschränkte Git-Modusspeicherung mit
SHA/Revision und Commitverifikation. Reale GitHub App inzwischen registriert und
installiert; noch keine Secrets oder Workerroute, kein echter Login-Nachweis.
Lokal ergänzte Worker-Routen `/privacy` und `/imprint` funktionieren auch deaktiviert
ohne Anmeldung. Die gemeinsame Datenschutzfassung wird ebenfalls in der Galerie
gerendert. Fehlende Durchsicht blockiert Pages-Publikation und direkte Worker-Anmeldung.

Tagesplaner/Git-Adapter lokal implementiert: Berliner 04:00-Zyklus, Nachholung,
Snapshot, unabhängige Ursprünge, ganze Historie prüfen, Originalbytes restaurieren,
atomarer Archivcommit und begrenzter Konflikt-Retry ohne Force-Push. Heute liest
bei Fokus/Rückkehr und in sichtbaren Tabs alle 60 Sekunden neu.

## Prüfstand der veröffentlichten Pages-Fassung vom 02.11.

Node 24.21.0, npm 12.2.0. Lokal `npm run check` mit **131 Tests**, Format, Lint,
Typen, Daten-/Vorschauprüfung, Build und Worker-Dry-Run erfolgreich.
`npm run test:browser`: **32 Fälle** Desktop/320px Chromium, bestehende sechs
Kunstreferenzen unverändert. `npm run check:publication` nach Freigabe erfolgreich.

Dieselben Prüfungen einschließlich echtem workerd-/SQLite-Laufzeittest auch auf
GitHub erfolgreich. Der Archiv-/Generierungsschritt wurde dort korrekt übersprungen.
Frühere reine Logiktests nutzen isolierte Git-Repositories und synthetische Secrets,
keine echten GitHub-Schreibzugriffe. 365 Testtage je Modus weiterhin enthalten.

Live zusätzlich ohne Anmeldung geprüft: HTTPS/HTTP 200, HTML und initiale JS-/CSS-
Assets bytegenau zum lokalen Build, `artworks/index.json` HTTP 200 mit richtigem
JSON-Typ und null Werken. Im Browser Startseite, Footer/Impressum/Datenschutz,
Testübersicht, nachvollziehbare Galerie und Werkdetails beider Modi samt Elternbelegen.
Bei gemessenen 320 CSS-Pixeln kein horizontaler Überlauf der geprüften Werkansicht,
keine `img`-/`svg`-/`canvas`-Knoten. Temporäre Browsergrößen zurückgesetzt.

GitHub meldet eine nicht blockierende Node-20-Abkündigung innerhalb der verschachtelten
Upload-Action; Lauf verwendet erzwungen Node 24 und ist erfolgreich. Runner-Image-Migration
ebenfalls nur Hinweis. Keine ungeprüfte Abhängigkeitsänderung vorgenommen.

## Weiterhin gesperrt und offen

`seriesAuthorized:false`, Startdatum `null`, Generierung `false`, Standard `traceable`,
Revision 1, offizieller Index leer. Betreiber-Origin `null`, Worker `ENABLED=false`.
Keine Cloudflare-Ressourcen oder Secrets eingerichtet. Keine Secrets in Frontend,
Git, Logs oder Chat; niemals im Chat anfordern.

Das Cloudflare-Konto wurde vom Betreiber selbst angelegt. Die erfolgreiche
MCP-Anmeldung verbindet Codex mit Cloudflare; sie ist **nicht** die spätere
GitHub-Betreiberanmeldung von Evolvera. Worker, App-Secrets und öffentliche
Worker-Origin sind weiterhin nicht eingerichtet. Workers Free und vorhandene
Account-Subdomain wurden am 03.11. lesend im Dashboard verifiziert; siehe unten.
2FA-Status weiterhin nicht geprüft.

Offen: echte Betreiberanmeldung und Modusspeicherung über GitHub/Cloudflare,
blockierte Drittanbieter-Cookies, reale Konflikt-/Sitzungstests, geplanter Tageslauf
und Nachholung nach späterer Aktivierung. Safari/Firefox, physische Smartphones und
GPU-/FPS-Profiling noch offen. Kein lokales `actionlint`. Keine vollständige Phase-4-
Cloud-Abnahme, kein Phase-5-Start. Erstes Pages-Deployment ist keine Serienfreigabe.

## Nächster abgegrenzter Schritt

Am 02.11.2026 wurde auf Folgeauftrag ausschließlich lokal die echte Betreiberanmeldung
vorbereitet. [Einrichtungsvorlage](operator-setup.md) enthält konkrete App-Felder,
Rechte, noch offene Kontowerte und getrennte Freigaben; der
[Datenschutzentwurf](operator-privacy-draft.md) dokumentiert Datenfluss, Cookies und
die noch erforderliche Ergänzung der öffentlichen Hinweise/Publikationsprüfung.
Runbook aktualisiert, bestehende Implementierung und sämtliche Konfiguration erhalten.
Die Vorbereitung wird auf Wunsch des Betreibers vor der Unterbrechung bis morgen
als weiterer lokaler Dokumentationscommit gesichert. `5056ed7` bleibt erhalten.
Kein Push oder Deployment; PRD-Backup nicht mitversionieren.

Lesend über GitHub-API bestätigt: Remote weiterhin `9ad1fa7`, Repository öffentlich,
Pages-Variable true, Tagesautomatisierungsvariable fehlt, `main` ungeschützt und keine
Rulesets. Betreiber `bummber` hat numerische ID `46008719`; bei Einrichtung gegen
das tatsächlich angemeldete Konto prüfen. Diese GitHub-Leseprüfung erfolgte vor
der späteren MCP-Einrichtung; keine neue Remoteprüfung beim Sichern behauptet.
Keine Secrets gelesen. PRD-Backup weiterhin unversioniert und bytegleich.

Erneut tatsächlich geprüft: `npm run check` mit 131 Tests, Build und Worker-Dry-Run;
`npm run worker:test-runtime` mit echtem lokalem workerd/SQLite;
`npm run check:publication` für den bisherigen Pages-only-Umfang. Alles erfolgreich.
`npm run generate:daily -- --dry-run`: 0 neue, 0 restaurierte, 0 offizielle Werke.
Der erste Check wurde beim lokalen tsx-Socket von der Sandbox gestoppt; Wiederholung
mit lokalen Prozessrechten erfolgreich. Kein neuer Browserlauf, da nur Dokumentation
geändert wurde; bisherige 32 Browserfälle sind der vorherige Nachweis.
Vor dem abendlichen Sicherungscommit nochmals `npm run check` erfolgreich ausgeführt;
kein neuer Browser- oder Worker-Sitzungslauf für die reinen Dokumentationsänderungen.

## Cloudflare-MCP und lokale Entwicklungswerkzeuge

Auf ausdrücklichen Folgeauftrag die
[offizielle Cloudflare-Agent-Anleitung](https://developers.cloudflare.com/agent-setup/prompt.md)
abgerufen und den Codex-Teil eingerichtet:

- 19 offizielle Skills aus `cloudflare/skills`, Quellcommit
  `1a33048817d06df12882cb881dfc754e7039954a`, unter
  `/Users/abrocker/.codex/skills/` installiert; vorhandene Skills erhalten.
- MCP `cloudflare` mit URL `https://mcp.cloudflare.com/mcp` in der persönlichen
  Codex-Konfiguration registriert. Bestehende MCP-Einträge unverändert.
- Nach Abbruch des standardmäßig zu breiten OAuth-Dialogs nur `offline_access`,
  `user:read`, `account:read` gewählt. Betreiber hat die Verbindung im Browser
  bestätigt. CLI meldete erfolgreichen OAuth-Abschluss; keine Tokens dokumentiert.
- Codex wurde anschließend vom Betreiber neu gestartet. Alle vier MCP-Werkzeuge
  tatsächlich erfolgreich geprüft: `whoami` erkennt eine Benutzeridentität,
  `execute` mit `GET /accounts` liefert Erfolg und genau ein Konto, `search` findet
  API-Endpunkte/Berechtigungen, `docs` liefert Dokumentationssuchergebnisse.
- Bei der anschließenden MCP-Funktionsprüfung keine Schreibaufrufe, Ressourcenerstellung,
  zusätzlichen Rechte, Tarifänderung oder Deployments. Die optionale `cf`-CLI wurde
  nicht installiert; Wrangler bleibt
  projektlokal gepinnt. Konto-/Profilkennungen, E-Mail und OAuth-Daten nicht ins Repo.

Die Skills/MCP-Konfiguration und OAuth-Anmeldedaten liegen außerhalb des
Projekt-Repositories und werden durch dessen Git-Commit nicht mitgesichert.
Ein MCP-Lesetest belegt weder den Workers-Free-Tarif noch Worker-Deploymentbereitschaft.

## Wiedereinstieg – 03.11.2026

Auf Auftrag anhand dieses Vermerks fortgesetzt. Git vor Änderungen geprüft: `main`
mit zwei lokalen Dokumentationscommits `5056ed7`/`d9f921b` vor `origin/main`, nur das
unversionierte PRD-Backup vorhanden und bytegleich erhalten. GitHub-API am 03.11.
erneut lesend geprüft: Remote bleibt `9ad1fa797210680e4348e2da5c487c2b37037960`;
angemeldetes Konto `bummber`, numerische ID `46008719`. Keine erneute Prüfung von
Pages-Variable, Branchschutz oder Rulesets in diesem Schritt behauptet.

MCP `GET /accounts` erneut erfolgreich, genau ein Konto. API-Schema nennt für
Abonnements Billing Read und für Subdomain Workers Scripts Read; diese Aufrufe
nicht ausgeführt und keine zusätzlichen Rechte angefordert. Stattdessen vorhandenes
Cloudflare-Dashboard lesend geöffnet: **Workers Free**, „Current plan“, 0 US-Dollar,
100.000 Requests/Tag, 10 ms CPU pro Aufruf. Vorhandene Account-Subdomain
`alexander-brocker.workers.dev`; Workers-&-Pages-Übersicht meldet keine Projekte.
Keine Konto-/Profilkennung oder E-Mail ins Projekt übernommen.

Der Betreiber hat für die Einrichtungsvorlage
`https://evolvera-admin.alexander-brocker.workers.dev` ausgewählt. Noch keine Worker-
Adresse eingerichtet oder Erreichbarkeit geprüft. `ADMIN_ORIGIN` bleibt leer,
Galerie-Origin null, `ENABLED=false`; alle Seriengates unverändert. Nur lokale
Dokumentation fortgeschrieben, kein Commit/Push, keine Secrets oder Deployments.
Die [Einrichtungsvorlage](operator-setup.md) enthält die aktualisierten Werte.

Am 03.11. tatsächlich neu geprüft: Node 24.21.0/npm 12.2.0, `npm run check`
erfolgreich mit 131 Tests, Format/Lint/Typen, Daten-/Vorschauprüfung, Build und
lokalem Worker-Dry-Run. Erster Sandboxlauf nach bestandenen Tests am tsx-Socket
blockiert, Wiederholung mit lokalen Prozessrechten erfolgreich. Kein neuer Browser-
oder Worker-Sitzungstest, da nur Dokumentation geändert wurde. PRD-Backup bytegleich,
keine offizielle Generierung und keine Änderung an Implementierung/Konfiguration.

## GitHub App – separat freigegeben und eingerichtet am 03.11.

Nach konkreter Vorlage ausdrücklich Registrierung und Installation freigegeben;
Secrets, Worker-Deployment und Push waren ausgenommen. GitHub verlangte Sudo-
Bestätigung, die der Betreiber selbst im Browser vorgenommen hat.

- App **Evolvera Betreiber bummber**, Slug `evolvera-betreiber-bummber`, Eigentümer
  `bummber`, Installierbarkeit **Only on this account**.
- App-ID `5595636`, Client-ID `Iv23liYblHBrFsNZZllG`, Installations-ID `178198041`.
  Diese Kennungen sind nicht geheim; nur dokumentiert, keine Worker-Konfiguration geändert.
- Homepage `https://bummber.github.io/evolvera/`; einziger Callback
  `https://evolvera-admin.alexander-brocker.workers.dev/auth/callback`, Wildcards aus.
- Webhooks aus, keine Events, Device Flow aus, OAuth während Installation aus,
  Setup URL leer; ablaufende User-Tokens bei Registrierung aktiviert gelassen.
- GitHub meldet erfolgreiche Installation auf `bummber`. Persistierte Installation
  zeigt **Only select repositories**, genau **`bummber/evolvera`** und ausschließlich
  **Contents read/write**, **Metadata read-only**. Keine App-Installation auf anderen
  Repositories; keine Administration-/Actions-/Workflows-/Pages-Rechte oder Bypässe.
- Kein privater Schlüssel und kein Client-Secret erzeugt, gelesen oder übertragen;
  GitHub ließ die Installation trotz vorherigem Hinweis auf den noch fehlenden
  privaten Schlüssel abschließen. Keine Authentifizierungs- oder Schreibprüfung.
- [App-Einstellungen](https://github.com/settings/apps/evolvera-betreiber-bummber),
  [Installation](https://github.com/settings/installations/178198041).

Contents gilt repositoryweit; der Worker begrenzt den Schreibpfad zusätzlich im Code.
Keine Cloudflare-Berechtigung erweitert, keine Anmeldung aktiviert, kein Deployment,
Push oder offizielles Werk. PRD-Backup erhalten. Nur lokale Dokumentation angepasst;
anschließend erneut `npm run check` mit 131 Tests, Daten-/Vorschauprüfung, Build
und Worker-Dry-Run erfolgreich. `git diff --check` erfolgreich, PRD-Backup weiterhin
bytegleich. Kein neuer App-Browserregressions- oder Worker-Sitzungslauf, da weder
UI/Routing noch Worker-/Sitzungscode geändert; GitHub-Einrichtung im Browser geprüft.

## Datenschutz lokal vorbereitet – weiterer Auftrag am 03.11.

Hinweise zu Anmeldung, Datenfluss, Cookies, Cloudflare/Empfängern, Speicherdauer,
Rechten und Rechtsgrundlagen lokal umgesetzt. Gemeinsamer Text in
`src/site/operator-privacy-content.ts`; eigene Durchsicht in neuer
`config/operator-privacy.json`, an die geplante Worker-Origin und Textversion
`2026-11-03.1` gebunden. Alle drei Nachweise waren zunächst null. Nach ausdrücklicher
Betreiberbestätigung ist `reviewedOn:2026-11-03`, `reviewedVersion:2026-11-03.1`
gesetzt; `providerReviewedOn` bleibt null. `config/legal.json` lokal auf
`privacyScope:pages-and-operator` vorbereitet;
bestätigter Kontakt und früheres Pages-Durchsichtsdatum unverändert erhalten.
Keine Durchsicht, Vertragsannahme oder Rechtsprüfung aus dem Auftrag abgeleitet.

Pages-Prüfung verlangt die neue Durchsicht und Cloudflare-Vertrags-/Kontoprüfung.
Auch bei vollständigen technischen Zugangswerten sperrt der Worker ohne passenden
Nachweis `/login`; `/health` liefert 503. Rechtstexte auf `/privacy` und `/imprint`
bleiben ohne Sitzung/Cookies und ohne GitHub-Aufruf erreichbar. Alle Worker-HTML-Seiten
verlinken sie. Eingesetzte Texte werden vor HTML-Ausgabe maskiert; Schemaauswertung
läuft in workerd ohne dynamischen JIT-Code. Kein erweiterter Git-Zugriff.

Tatsächlich geprüft: `npm run check` mit **149 Tests**, Format/Lint/Typen, Datenprüfung,
Build und Worker-Dry-Run erfolgreich. `npm run worker:test-runtime` mit lokalem
workerd/SQLite erfolgreich, einschließlich Rechtstextrouten und Datenschutzgate.
`npm run test:browser`: **35 bestanden, 1 bewusst übersprungen**. Der neue synthetische
Worker-Browserfall prüft Desktop und 320px gemeinsam; deshalb keine Verdopplung im
Mobilprojekt. Sechs bestehende Kunstreferenzen unverändert. Keine Cloud-Auth-Abnahme.
`npm run check:publication` erwartungsgemäß Exit 1 mit genau den zwei offenen Durchsichten.

Zusätzlich gebaute Galerie-Datenschutzfassung und deaktivierte Worker-Datenschutzseite
im lokalen Chrome geöffnet und sichtbar geprüft. Lokale Vorschauen zur Durchsicht:
`http://127.0.0.1:4173/evolvera/#/datenschutz` und `http://127.0.0.1:8787/privacy`.
Keine veröffentlichten URLs. Automatisierte Worker-Tests verwenden isolierten
temporären SQLite-Speicher und synthetische Zugangsdaten.

Der [vorbereitete Secret-Ablauf](operator-secrets.md) sieht später eine geschützte
JSON-Datei außerhalb des Repositories vor. Lokales Wrangler 4.154.0 bestätigt
`deploy --secrets-file` für einen gemeinsamen Code-/Secret-Upload; nur Hilfe/Anleitung
gelesen, kein Upload. Keine Schlüssel, Secrets, zusätzlichen Rechte, Commits, Pushes
oder Deployments; alle Seriengates, Archiv und Betreiberkonfiguration unverändert.
PRD-Backup bleibt unversioniert und bytegleich.

Die ausdrückliche Betreiberbestätigung lautet: „Ich bestätige die Textdurchsicht der
Datenschutzhinweise für die Betreiberanmeldung unter
evolvera-admin.alexander-brocker.workers.dev.“ Nur diese Textdurchsicht dokumentiert;
keine Anbieter-/Kontoprüfung, Vertragsannahme oder Veröffentlichung daraus abgeleitet.
Datenschutztext und Textversion selbst unverändert. Zusätzlich vorgefundene
unversionierte `docs/design-system.md` erhalten, nicht verändert oder mitversioniert.

Nach Textbestätigung erneut geprüft: `check:publication` Exit 1 ausschließlich wegen
offener Cloudflare-Vertrags-/Kontoprüfung. `npm run check` stoppt bei Prettier an der
neu vorgefundenen `docs/design-system.md`; deren Formatierung nicht ungefragt geändert.
Formatprüfung der eigenen geänderten Dateien und `git diff --check` erfolgreich.
Die übrigen Prüfungen separat erfolgreich: Lint, Typen, 149 Tests, Datenprüfung,
Build, Worker-Dry-Run und 35 Browserfälle (1 Doppelaufruf bewusst übersprungen).
Kein neuer Worker-Sitzungslauf, da nur Durchsichtsdaten/Dokumentation und die erwartete
verbleibende Browsermeldung geändert wurden. Keine zusätzliche Freigabe dokumentiert.

**Späterer Einrichtungsschritt nach dem nun gewünschten Designpaket:** Zum Cloudflare-Konto
gehörenden Vertragspartner, wirksame Bedingungen/DPA und Logging-Vorgaben konkret
prüfen; erst danach die Durchsicht dokumentieren. Sicherer Secret-Ablauf und konkretes
Deployment bleiben gesondert zu beauftragen. Bei Textänderungen Version/Durchsicht
erneuern. Das Runtimegate verhindert keine direkten Code-Uploads.
Cloudflare nennt für Worker-Neuanlage Workers-Admin auf Produktebene, für spätere
Updates genügt Worker-Editor. Keine zusätzlichen Rechte allein aus diesem Vermerk ableiten.

Die Textdurchsicht gilt für die gemeinsame Fassung in Galerie und Worker an der
genannten Origin. `check:publication` blockiert wegen der offenen Kontoprüfung weiterhin,
aber keinen direkten Worker-Code-Upload.
`wrangler secret put/delete` deployt unmittelbar; echte Moduscommits auf `main`
lösen Pages aus. Beides deshalb nur mit konkretem Auftrag. Eine deaktivierte
Bereitstellung/Healthprüfung ist noch kein Login-Nachweis. Echte Geräteprüfung der
öffentlichen Vorschau bleibt ebenfalls offen.

Kontoregistrierung, Sicherheitsberechtigungen und konkrete externe Einrichtung nicht
allein aus diesem Dokument ableiten. Serienstartdatum und Generierung bleiben eine
spätere eigenständige Entscheidung. EP-01 bleibt zurückgestellt.

## Wiedereinstieg

`AGENTS.md`, diesen Vermerk, `docs/PRD.md`, `docs/runbook.md`,
`docs/first-pages-deployment.md` und `docs/publication-preparation.md` lesen; Git prüfen.
Lokal `npm run dev`. `npm run generate:daily -- --dry-run` liest den Git-Commit,
ändert weder Dateien noch Remote. Historische Schäden niemals neu auswürfeln.
