# Galerie-Link und Werkbuch – veröffentlicht und geprüft

## Freigegeben und ausgeführt – 04.11.2026

Der Betreiber hat den genau vorgelegten lokalen Commit, regulären Push einschließlich
der sechs vorhandenen lokalen Commits und anschließende CI-/Pages-/Liveprüfung mit
**„Die Freigabe ist erteilt“** ausdrücklich beauftragt. Dieser Umfang ist ausgeführt:

- Commit **`d844e3fd623c19ce3185e1e9f165536aab0b5606`**, 04.11.2026,
  **07:20:38 Uhr MEZ**, einziger Elterncommit `53b7521`. Genau die unten benannten
  acht Dateien aufgenommen; PRD-Backup ausgeschlossen und bytegleich erhalten.
- Frischer Remote-/Gateabgleich vor dem regulären Fast-forward-Push von `f793247`
  auf `d844e3f`. Alle vorhandenen Commits erhalten, kein Force-Push. Nach erfolgreicher
  Liveprüfung Remote-main erneut lesend als `d844e3f` bestätigt. Lokales main und
  origin/main synchron; kein weiterer Commit oder Push aus dieser Freigabe abgeleitet.
- [CI erfolgreich](https://github.com/bummber/evolvera/actions/runs/41784921705).
  [Pages-Build und Deployment erfolgreich](https://github.com/bummber/evolvera/actions/runs/41784921688),
  ausdrücklich für `d844e3f`. Archiv-/Generierungsschritt **übersprungen**.
  Pages-Protokoll bestätigt 13 erfolgreiche Testdateien und **68 Browserfälle**,
  sechs bewusste Doppelaufruf-Skips; lokale 165 Tests und Runtime zuvor erfolgreich.
- [Öffentliche Galerie](https://bummber.github.io/evolvera/) jetzt mit abgenommenem
  Werkbuch-Design; [Galerie-Einstellungen](https://bummber.github.io/evolvera/#/einstellungen)
  verlinken den bestehenden geschützten Betreiberworker unter `/settings`.
- **Alle 22 öffentlichen Builddateien bytegleich** zum freigegebenen lokalen Build:
  HTML, sämtliche gebauten JS-/CSS-Dateien, lokale Schriften/Lizenzen und Archivindex.
  Vergleich per anonymem GET, keine echten Zugangsdaten oder Sitzung benutzt.
- Anonyme Live-Chromium-Prüfung bei **320 und 1440 px**: Heute, Einstellungen, Über
  und Datenschutz, insgesamt acht Routen-/Breitenkombinationen, erfolgreich.
  Linkziel exakt, Revision 3, Generierung deaktiviert, Moduskarten gesperrt, keine
  automatischen Fremdabrufe, Schreibzugriffe, Cookies, Seitenfehler oder horizontaler
  Dokumentüberlauf. Öffentliche 320px-Einstellungen und 1440px-Startseite sichtbar
  gesichtet. Keine echte Anmeldung oder Modusspeicherung ausgeführt.
- Remote-Konfiguration abschließend traceable/Revision 3, Generierung false,
  Startdatum null; Serienfreigabe false und offizieller Index leer erhalten.
  Worker-Health nach Galerie-Deployment `configurationReady:true`. Kein Worker-Upload,
  Zugriff auf Secrets, Verwaltungs-Token, Sitzungsänderung oder Serienstart.

GitHub nennt weiterhin nicht blockierende Hinweise zur Node-20-Zielversion
verschachtelter Artefakt-/Pages-Actions bei erzwungenem Node 24 sowie zur Migration
des Ubuntu-Runnerimages. Keine ungeprüfte Abhängigkeits-/Workflowänderung vorgenommen.
Safari/Firefox, echte Geräte/Safe-Area und umfassende WCAG-/Sitzungsabnahme bleiben
offen; die frühere zusätzliche Konfliktanzeige bleibt nicht abschließend erklärt.

Temporäre HTTP-/Browsernachweise liegen unter
`/private/tmp/evolvera-publication-d844e3f-*`; keine dauerhafte Ablagegarantie.
Der Ergebnisstand ist hier und im HANDOFF dokumentiert. Dieser Nachtrag samt
Status-/Startdokumenten bleibt **lokal uncommittiert**; keine zweite Commit-/Pushrunde.
Abschließend `npm run check` für die reinen Ergebnisdokumente erfolgreich: Format,
Lint, Typen, **165 Tests**, Datenprüfung, Build und deaktivierter Worker-Dry-Run.
Format-/Diff-/Backupprüfung ebenfalls erfolgreich; kein zusätzlicher Browser-/
Runtime-Lauf danach. Die abschließende Ergebniszeile anschließend gezielt formatgeprüft.

## Historische Vorbereitung vor der Veröffentlichungsfreigabe

Stand: 04.11.2026. Nach lesendem Wiedereinstieg und gemeinsamer Bestandssichtung
hat der Betreiber mit „Fahre fort“ die lokale Vorbereitung beauftragt. Kein neuer
Commit, Push, Deployment, Moduswechsel oder Serienstart. Die zehn Designpakete
sind bereits abgenommen; keine neue Designrunde.

## Ausgangsstand und lesende Nachweise

- Projekt und origin unverändert, lokales main/HEAD
  `53b7521cf027964c34091646432ba721514bd3c1`, sechs lokale Commits vor Remote.
- GitHub-main am 04.11. im Wiedereinstieg frisch lesend als
  `f7932479a839a6176160eabe4edc675133aacafb` bestätigt; kein Fetch/Ref-Update.
  [CI](https://github.com/bummber/evolvera/actions/runs/41727228799) und
  [Pages](https://github.com/bummber/evolvera/actions/runs/41727228841) erfolgreich.
  Pages-Variable true, Tagesautomatisierungsvariable nicht gesetzt.
- Öffentliche Galerie HTTP 200. Worker-Health mit Browser-User-Agent HTTP 200,
  `configurationReady:true`; `/settings`, `/privacy`, `/imprint` ebenfalls HTTP 200.
  Erste Python-Abrufe lieferten 403; Kontrollabrufe per curl mit Browser-User-Agent
  erfolgreich. Keine Ursache für diesen Unterschied behauptet. Keine Cookies,
  Anmeldung, Speichervorgänge oder Verwaltungs-API benutzt. Das bestätigt keine
  neue Sitzungsabnahme oder aktuelle Worker-Versionskennung.
- Vorhandene Pausenänderungen in HANDOFF/NEXT-START erhalten und weitergeführt;
  PRD-Backup weiterhin unversioniert und bytegleich. Keine Secrets gelesen.

## Lokale Änderungen dieses Arbeitspakets

1. `config/operator.json`: exakte HTTPS-Origin
   `https://evolvera-admin.alexander-brocker.workers.dev` gesetzt. Der bestehende
   Galerie-Link führt von `#/einstellungen` per normaler Navigation zu `/settings`.
   Kein automatischer Workerabruf und kein eingebettetes Login.
2. `src/app/App.tsx`: Über-Seite nennt den eingerichteten Zugang abhängig von der
   konfigurierten Origin. Einstellungen beschreiben verfügbare Modi und kennzeichnen
   ihre Anzeige als Stand dieser Galerieversion. Moduskarten bleiben deaktiviert;
   der aktuelle Stand und echte Änderungen gehören auf die Betreiberseite.
3. `src/app/LegalPages.tsx`: ausschließlich veralteten Betriebsstatus der Galerie
   berichtigt. Gemeinsame geprüfte Datenschutzhinweise, Textversion `2026-11-03.1`,
   Durchsichtsdaten und Anbieterprüfung unverändert. Keine neue Verarbeitung.
4. Dieser Bericht, HANDOFF, NEXT-START, Runbook und Publikationsbericht halten den
   neuen lokalen Stand fest. Historische Nachweise und Pausenarbeiten bleiben erhalten.

Keine Änderung an Gestaltung, Kunst, Generator, Titeln, Renderern, Archiv, Testwerken,
Referenzbildern, Worker-/Sitzungscode, Workflow, Lockfile oder Abhängigkeiten.
`traceable`/Revision 3, Generierung false, Serienstart null, Serienfreigabe false,
offizieller Index leer. Versionierter Workerstandard bleibt deaktiviert; die
ignorierte echte Uploadvorlage und bestehende Cloudressourcen bleiben unberührt.

## Tatsächlich ausgeführte Prüfungen

Node 24.21.0, npm 12.2.0; vorhandene gepinnte Abhängigkeiten.

- `npm run check:publication`: erfolgreich mit gesetzter Galerie-Origin.
- `npm run check`: Format/Lint/Typen, **165 Tests**, Datenprüfung, Build und
  deaktivierter Worker-Dry-Run erfolgreich. Der erste Sandboxaufruf stoppte bereits
  bei der Publikationsprüfung am lokalen tsx-Socket; Wiederholung mit lokalen
  Prozessrechten erfolgreich.
- `npm run worker:test-runtime`: echter lokaler workerd-/SQLite-Test erfolgreich,
  ausschließlich synthetische Daten und isolierter temporärer Speicher.
- `CI=true npm run test:browser` nach dem Build: **68 bestanden**, sechs bewusste
  Doppelaufruf-Skips. Sechs Kunstreferenzen unverändert. Bestehende Prüfungen für
  100 Seiten-/Breitenkombinationen bei 320/390/768/1024/1440 px erfolgreich.
  Linkziel, gesperrte Moduskarten, kein automatischer Fremdabruf, keine Cookies und
  keine Galerie-Schreibzugriffe durch vorhandene Browserfälle bestätigt.
- Einstellungsaufnahmen bei allen fünf Breiten sowie vollständige Desktop- und
  320px-Aufnahme gesichtet. Keine neue Gestaltung; Aufnahmen liegen nur im
  ignorierten `test-results`, nicht im veröffentlichten Build oder Git.
- `git diff --check` und bytegleiches PRD-Backup erfolgreich geprüft.

Wrangler 4.154.0 über vorhandenes Projektskript. Die installierte CLI-Hilfe
bestätigt `--dry-run` ohne Upload. Abruf der externen Wrangler-Dokuseiten über das
Webwerkzeug war nicht möglich; keine neuen CLI-Flags oder Konfigurationsfelder
eingeführt. Workerausgaben bleiben in ignoriertem `.worker-build` außerhalb von dist.

Safari/Firefox, physische Geräte/Safe-Area, umfassende WCAG-Abnahme und umfassende
reale Sitzungs-/Ablauf-/Negativfallabnahme bleiben offen. Die frühere zusätzliche
Konfliktanzeige beim Moduswechsel ist weiterhin nicht abschließend erklärt.
Keine erneute echte Anmeldung oder Modusrunde nötig oder durchgeführt.

## Konkreter späterer Freigabeumfang – noch nicht ausgeführt

Für die Fertigstellung der lokalen Vorbereitung sind genau diese acht Dateien
uncommittiert hinzugekommen beziehungsweise weitergeführt worden:

```text
config/operator.json
docs/HANDOFF.md
docs/NEXT-START.md
docs/gallery-publication-preparation.md
docs/publication-preparation.md
docs/runbook.md
src/app/App.tsx
src/app/LegalPages.tsx
```

Ein später gesondert freizugebender Ablauf wäre ein lokaler Commit genau dieser
acht Dateien und ein normaler Fast-forward-Push von main zu origin/main nach
frischem Head-Abgleich. Der Push veröffentlicht auch sämtliche sechs vorhandenen
lokalen Commits mit dem abgenommenen Werkbuch, Datenschutz, Workerquellen, Tests,
Dokumentation und lokalen Schriftabhängigkeiten. Es ist kein isolierter Link-Push.
Die vollständige Dateiliste gegenüber dem bestätigten Remote folgt unten.

Der bestehende main-Push löst CI und den Pages-Workflow aus. Mit unverändertem
Pages-Schalter true und fehlendem Automatisierungsschalter wird die geprüfte
Testgalerie veröffentlicht; die Generierung bleibt übersprungen. Kein separater
Worker-Upload und kein Cloudflare-Verwaltungstoken erforderlich. Ein erneuter
Moduscommit könnte ebenfalls Pages auslösen und gehört nicht zu diesem Umfang.

Vor jedem späteren Commit/Push tatsächliche Eingangsdateien, Remote-main und Gates
frisch abgleichen. Bei abweichendem Remote zuerst den Unterschied prüfen und den
Kandidaten gegebenenfalls erneut validieren; kein blindes Überschreiben/Force-Push.
Nach separat freigegebener Veröffentlichung CI-/Pages-Ergebnis und öffentliche
Builddateien gegen genau den freigegebenen Build prüfen, anschließend Linkziel und
Seriengates erneut lesend verifizieren. Kein Login-/Speichertest daraus ableiten.

PRD-Backup, Secrets, ignorierte Vorlagen, test-results, dist und Workerausgaben
bleiben aus dem Commit ausgeschlossen. Generierung und Serienstart bleiben aus.

## Vollständiger Kandidat gegenüber Remote

Die folgende Liste umfasst die vorhandenen Änderungen seit `f793247` einschließlich
der lokalen Vorbereitung dieses Arbeitspakets. Keine Veröffentlichung erfolgt.

72 Dateien, einschließlich dieses neuen Berichts:

```text
README.md
config/legal.json
config/operator-privacy.json
config/operator.json
docs/HANDOFF.md
docs/NEXT-START.md
docs/design-implementation.md
docs/design-system.md
docs/first-pages-deployment.md
docs/gallery-publication-preparation.md
docs/integration-preparation.md
docs/operator-first-upload.md
docs/operator-form-fix.md
docs/operator-mode-test.md
docs/operator-privacy-draft.md
docs/operator-secrets.md
docs/operator-setup.md
docs/provider-review.md
docs/publication-preparation.md
docs/runbook.md
package-lock.json
package.json
public/fonts/Archivo-OFL.txt
public/fonts/IBM-Plex-Mono-OFL.txt
scripts/test-worker-runtime.ts
src/app/AboutIllustration.tsx
src/app/App.tsx
src/app/ArchivePages.tsx
src/app/ArtReview.tsx
src/app/Atelier.tsx
src/app/EvolutionBraid.tsx
src/app/LegalPages.tsx
src/app/StageFrame.tsx
src/app/WorkProvenance.tsx
src/app/WorkTitle.tsx
src/main.tsx
src/site/legal.ts
src/site/operator-privacy-content.ts
src/site/operator-privacy.ts
src/styles/components.css
src/styles/detail.css
src/styles/evolution.css
src/styles/gallery.css
src/styles/information.css
src/styles/shell.css
src/styles/today.css
tests/browser/atelier.spec.ts
tests/browser/components.spec.ts
tests/browser/detail-layout.spec.ts
tests/browser/evolution-layout.spec.ts
tests/browser/gallery-layout.spec.ts
tests/browser/information-layout.spec.ts
tests/browser/mobile-navigation.spec.ts
tests/browser/operator-forms.spec.ts
tests/browser/polish.spec.ts
tests/browser/shell.spec.ts
tests/browser/today.spec.ts
tests/browser/werkbuch.spec.ts
tests/browser/worker.spec.ts
tests/evolution-braid.test.tsx
tests/fixtures/legal.ts
tests/fixtures/operator-browser.ts
tests/fixtures/session-memory.ts
tests/legal.test.ts
tests/operator.test.ts
tests/routing.test.tsx
tests/runtime/worker.ts
tests/work-title.test.tsx
workers/admin/README.md
workers/admin/index.ts
workers/admin/legal.ts
workers/admin/validation.ts
```
