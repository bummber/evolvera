# Lokale Zusammenführung – isoliert geprüft, noch nicht ausgeführt

Stand 03.11.2026. Auf „Wie geht es weiter“ den nächsten abgegrenzten Schritt
vorbereitet: vorhandene lokale Arbeiten und erfolgreiche Remote-Modusrunde erhalten
und deren Kombination prüfen. **Keine neuen Commits, kein Push, kein Deployment
und keine Änderung des eigentlichen Arbeitsbaums außerhalb dieser Statusdokumentation.**
Keine neue Designrunde, Generierung oder Serienfreigabe.

## Geprüfter Ausgangsstand

- Bestehendes Projekt und unverändertes `origin`:
  `https://github.com/bummber/evolvera.git`.
- Lokales `main` auf `5afbe7bf8e9c10e7d78c05c01b3b100bf0b5fe66`.
  Vier lokale Commits seit `9ad1fa7` bleiben erhalten, einschließlich des
  abgenommenen Werkbuch-Checkpoints. Dazu alle vorhandenen uncommittierten Dateien.
- GitHub lesend erneut auf `f7932479a839a6176160eabe4edc675133aacafb` bestätigt.
  Die drei Remote-Commits seit `9ad1fa7` sind Hinwechsel free/2, Testfix und
  Rückwechsel traceable/3. Zusammen ändern sie ausschließlich
  `config/generation.json` und `tests/evolution.test.ts`.
- Die reale lokale Modusdatei ist weiterhin traceable/1 und seit lokalem HEAD
  unverändert. **Remote traceable/3 muss beim tatsächlichen Merge erhalten werden.**
  Der lokale Testfix ist bereits bytegleich zur Remote-Testdatei.
- Unversioniertes `docs/PRD_v1.1_backup.md` bytegleich erhalten; ausgeschlossen
  aus dem Kandidaten und aus der vorgesehenen Commitdateiauswahl.

## Isolierter Kandidat und tatsächliche Nachweise

Temporäre Kopie des vorhandenen Repositories ohne Hardlinks unter
`/private/tmp/evolvera-integration-g1a6p_ji/checkouts/evolvera`. Nur dort lesender
Fetch des bekannten Remote-Stands; kein Fetch oder Ref-Update im eigentlichen Projekt.
Das isolierte Repository hat nach Entfernen der lokalen Clone-Remote keinen
Push-Zielnamen. Keine neuen Commits erzeugt, auch nicht im Test-Repository.

`git merge-tree --write-tree HEAD FETCH_HEAD` der beiden vorhandenen Historien
erfolgreich und ohne Konflikte; resultierender Baum
`e8cae2e7c5c9f22e9155e70292dbbf5074db099e`. Diesen Baum ausschließlich in der
isolierten Kopie ausgecheckt und alle 158 berücksichtigten Arbeitsdateien bytegleich
aus dem eigentlichen Projekt darübergelegt. Ausnahmen: PRD-Backup ausgeschlossen,
Modusdatei bewusst bytegleich vom Remote erhalten. Da sich nur zwei Remotepfade
unterscheiden und der lokale Testfix bereits identisch ist, gehen keine lokalen
Produkt-/Testdateien verloren. Bei neuen Änderungen vor der echten Zusammenführung
Stand und Dateigleichheit erneut prüfen.

Kandidat: traceable/Revision 3, Generierung false, Serienstart null,
Serienfreigabe false, offizielles Archiv leer, Galerie-Origin weiterhin null.
Versionierter Workerstandard deaktiviert, echte Uploadvorlage weiterhin separat
ignoriert. Keine echten Secrets oder Betreiberzugänge in die Testkopie übernommen.
Vorhandene Abhängigkeiten ausschließlich lokal verlinkt; keine neue Installation.
Die verschachtelte Testkopie hält auch relative Worker-Ausgaben innerhalb des
temporären Arbeitsbereichs und außerhalb von `dist`/Git.

Tatsächlich im kombinierten Kandidaten ausgeführt, Node 24.21.0:

- `npm run check:publication`: Exit 0.
- `npm run check`: Format/Lint/Typen, **165 Tests**, Daten-/Vorschauprüfung,
  Build und deaktivierter Worker-Dry-Run erfolgreich.
- `npm run worker:test-runtime`: echter lokaler workerd-/SQLite-Test erfolgreich.
- `npm run test:browser` am kombinierten Build: **68 bestanden**, sechs bewusste
  Doppelaufruf-Skips; sechs bestehende Kunstreferenzen unverändert. `CI=true`
  verhindert die Wiederverwendung eines fremden lokalen Vorschauprozesses.

Nur synthetische Zugangsdaten und isolierte Test-Repositories. Keine manuelle neue
Designsichtung oder Safari-/Firefox-/Geräteabnahme daraus ableiten.
Protokolle unter `/private/tmp/evolvera-integration-g1a6p_ji/`; temporär, keine
dauerhafte Ablagegarantie. Das aktuelle Projekt blieb während dieser Prüfung auf
traceable/1 und HEAD `5afbe7b`.

Nach Erstellung dieser Vorlage Statusdokumente auch in die isolierte Kopie
übernommen und deren vollständige Formatprüfung erneut erfolgreich ausgeführt.
Im eigentlichen Projekt nach der Dokumentation `npm run check` ebenfalls erneut
erfolgreich mit **165 Tests**, Datenprüfung, Build und deaktiviertem Worker-Dry-Run.
Keine zusätzliche aktuelle Browser-/Runtime-Suite für die reine Dokumentation;
deren oben genannte Nachweise stammen aus dem kombinierten Kandidaten.

## Konkret vorgeschlagene lokale Freigabe – zwei Commits, kein Push

1. Aktuellen uncommittierten Stand mit den unten einzeln benannten Dateien in einem
   **lokalen Sicherungscommit** festhalten. Alle bisherigen Commits erhalten;
   PRD-Backup, ignorierte Uploadvorlage, Secrets und generierte Ausgaben ausschließen.
2. Aktuellen Remote-main nach frischem Leseabgleich im bestehenden Repository
   fetchen und mit `--no-commit` zusammenführen. Keine fremde Arbeit überschreiben,
   Remote-Revision 3 erhalten und den identischen Testfix übernehmen. Aktuelle
   Statusdokumentation anpassen, vorgeschriebene Prüfungen im tatsächlichen
   zusammengeführten Stand ausführen und dann einen **lokalen Mergecommit** erstellen.

Bei unerwarteten Änderungen oder Konflikten vor einem Commit Ursache prüfen;
keinen blind erzwungenen Merge oder Force-Push. Der vorgeschlagene Umfang enthält
**keinen Push, kein Pages-/Worker-Deployment, keine neue Modusspeicherung und keinen
Serienstart**. Erst danach gemeinsam den Stand sichten und die separate Veröffentlichung
des abgenommenen Werkbuch-Designs vorbereiten. Die Galerie-Origin ist noch null;
der spätere Galerie-Link zum geprüften Betreiberworker gehört in diese getrennte
Veröffentlichungsvorbereitung.

Vorgesehene Dateiauswahl des Sicherungscommits (22 Dateien):

```text
config/operator-privacy.json
docs/HANDOFF.md
docs/NEXT-START.md
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
scripts/test-worker-runtime.ts
tests/browser/operator-forms.spec.ts
tests/browser/shell.spec.ts
tests/evolution.test.ts
tests/fixtures/operator-browser.ts
tests/fixtures/session-memory.ts
tests/operator.test.ts
tests/runtime/worker.ts
workers/admin/index.ts
```

Die frühere Sperre für lokale Commits wird durch diese Vorbereitung nicht aufgehoben.
Für genau diese zwei lokalen Commits die ausdrückliche Betreiberfreigabe abwarten.
