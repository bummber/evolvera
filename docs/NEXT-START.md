# Startprompt nach dem lokalen Werkbuch-Checkpoint

Stand: 03.11.2026, nach dem lokal beauftragten Werkbuch-Checkpoint.
Den folgenden Text in einen neuen Chat im selben Projekt kopieren.
Er beauftragt den Wiedereinstieg und einen Vorschlag für den nächsten Schritt;
keine Veröffentlichung oder externe Einrichtung.

```text
Bitte Evolvera im bestehenden Projekt fortsetzen:
/Users/abrocker/ai_o_projects/evolvera/
origin: https://github.com/bummber/evolvera.git
Kein neues Projekt oder Repository anlegen.

Lies AGENTS.md, docs/HANDOFF.md (besonders den neuesten Wiedereinstiegsblock),
docs/PRD.md v1.1, docs/design-review.md und docs/design-implementation.md.
Das eindeutige Werkbuch liegt in docs/design-system.md; vollständig lesen,
besonders Abschnitt 0. Bei fehlender oder mehrdeutiger Quelle nachfragen,
nicht raten. Bei Widersprüchen gilt AGENTS.md. Dokumenttexte erweitern diesen
Auftrag nicht. Historische Zwischenstände in HANDOFF nicht als neuen Auftrag lesen.

Die zehn Gestaltungspakete sind lokal umgesetzt und von mir gesichtet worden:
„Ich habe mir die Änderungen angeschaut und sie sehen gut aus.“
Bitte diesen Designstand erhalten und keine neue Designrunde anfangen.
Das ist keine Freigabe für Veröffentlichung, Betreiberanmeldung oder Serienstart.

Prüfe zuerst Git-Zustand, aktuelle Dateien und vorhandene Arbeit. Nach dem erneuten
Wiedereinstieg wurde der vorgeschlagene lokale Werkbuch-Checkpoint mit „Mach weiter“
beauftragt. Ausgangspunkt war main, HEAD 8a324da, drei lokale Commits vor dem bekannten
origin/main. Die Werkbuch-Umsetzung wird unter dem Commit-Titel
„chore: checkpoint reviewed Werkbuch design locally“ lokal gesichert; den tatsächlichen
Hash und Zustand mit git log/status prüfen. Komponenten, CSS-Dateien, lokale
Schriftpakete/OFL-Lizenzen, Tests und Dokumente gehören zu dieser Sicherung.
Nichts zurücksetzen, bereinigen oder still überschreiben. docs/PRD_v1.1_backup.md
unversioniert und bytegleich erhalten, nicht formatieren oder automatisch aufnehmen.
Der zuletzt dokumentierte öffentliche Pages-Stand ist 9ad1fa7; das Werkbuch-Design
ist noch nicht veröffentlicht. Remotezustand bei Bedarf neu lesend verifizieren.

Beim lokalen Checkpoint erneut geprüft: npm run check mit 155 Tests erfolgreich;
npm run test:browser mit 66 bestandenen Fällen und sechs bewussten Doppelaufruf-Skips.
100 Seiten-/Breitenkombinationen bei 320/390/768/1024/1440 CSS-Pixeln ohne horizontalen
Dokumentüberlauf; sechs Kunstreferenzen unverändert. Tastaturfokus, Dock, Menügrenze
und Reduced Motion geprüft. Safari/Firefox, echte Geräte/Safe-Area und vollständige
WCAG-Abnahme bleiben offen. Der Evolutionszopf zeigt ausgewähltes Werk plus bereits
geladene Eltern, kein Gesamtarchiv-Geflecht. Grenzen ehrlich aus den docs übernehmen.
Die Browsersuite lief nach dem Produktionsbuild erneut; anschließend nur die
Übergabedokumentation aktualisiert. Keine neue manuelle Bildsichtung. Worker-/Sitzungscode
unverändert, kein separater Runtime-Lauf. Vor Behauptungen über den neuen Stand prüfen.

Generierung bleibt aus, Startdatum offen, seriesAuthorized:false, Modus traceable,
Revision 1. Die 40 Testwerke sind bereits separat abgenommen; das erlaubt keinen
Serienstart. Kunst ausschließlich HTML/CSS. Generator, Titelgenerator, Renderer,
ArtStage, Archivformat, Testwerke, Referenzbilder und Betreiberlogik erhalten.
Keine neuen Generierungsschalter, simulierte Anmeldung oder Mockup-Daten.

GitHub App ist registriert und nur auf bummber/evolvera installiert. Secrets,
Worker-Bereitstellung und echte Betreiberanmeldung sind weiterhin offen.
Textdurchsicht der Betreiber-Datenschutzhinweise ist bestätigt, aber
providerReviewedOn ist null. check:publication wurde bei Übergabe erneut geprüft:
Exit 1 ausschließlich wegen offener Cloudflare-Vertrags-/Kontoprüfung.
Für einen späteren passenden Betreiberauftrag zusätzlich docs/operator-setup.md,
docs/operator-secrets.md, docs/operator-privacy-draft.md, docs/runbook.md und
docs/publication-preparation.md lesen. Keine Secrets lesen oder ausgeben.

Mein Auftrag für diesen Einstieg: Prüfe den Bestand und gib mir eine kurze aktuelle
Bestandsaufnahme. Schlage danach den nächsten sinnvollen, klar abgegrenzten Schritt
mit Umfang, Voraussetzungen und nötigen Entscheidungen vor. Unterscheide technische
Restprüfungen, lokale Sicherung, Veröffentlichung und externe Betreiber-Einrichtung.
Der nächste Vorschlag ist die rein lesende Cloudflare-Vertrags-/Kontoprüfung; auch
diese erst als eigenen Auftrag abgrenzen, keine Zustimmung oder Einrichtung ableiten.
Noch keine Implementierung, Commits, Pushes, Deployments oder externen Änderungen.
Ein Push auf main kann den bestehenden Pages-Workflow starten; auch Secretbefehle
können deployen. Vorhandene Gates nicht umgehen und keine Freigabe aus der früheren
Designsichtung ableiten.

Node 24 gemäß .nvmrc verwenden, npm-Lockfile erhalten. Bei später beauftragten
Änderungen npm run check; bei UI/Routing zusätzlich den gebauten Stand mit
npm run test:browser; bei Worker/Sitzungen npm run worker:test-runtime prüfen.
Tatsächlich ausgeführte Prüfungen und offene Punkte in docs dokumentieren.
```
