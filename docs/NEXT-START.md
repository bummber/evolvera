# Aktueller Startprompt – ab 19.12.2026: erster Serienneustart

```text
Bitte Evolvera im bestehenden Projekt /Users/abrocker/ai_o_projects/evolvera
mit origin https://github.com/bummber/evolvera.git fortsetzen. Zuerst AGENTS.md,
CLAUDE.md, den neuesten HANDOFF (Nachtrag vom 24.11.2026), im Runbook den
Abschnitt „Serienneustart einstellen und belegen“ und diesen Startprompt
lesen. Dann /sichtung ausführen: rein lesend Git-Zustand, Remote, Berliner
Zeit, Tagesläufe und Archiv prüfen und gemeinsam sichten.

Stand 24.11.2026: Werke 19.11. bis 24.11. (Generationen 1–6) archiviert und
geprüft; Baseline bis 24.11. Konfiguration Schema 3, Revision 9,
restartAfterDays 30. Betreiberentscheidung vom 24.11.: Die Serie läuft vom
25.11. bis 18.12. ohne tägliche Prüfung; diese Werke werden weder einzeln
belegt noch in die Baseline aufgenommen, weil der Neustart sie löscht. Am
19.12.2026 (01:17, real meist zwischen 8 und 11 Uhr) startet die Serie zum
ersten Mal live neu.

1. Zwischenzeit summarisch prüfen: Läufe vom 25.11. bis 18.12. ohne
   Fehlschlag, Archiv lückenlos 19.11. bis 18.12. (Generationen 1–30), jeder
   Archivcommit nur mit Werkdatei(en) und index.json, nichts gelöscht;
   Einstellungscommits des Betreibers (neue Revision) und Nachholungen nennen.
   Ist ein Lauf gestoppt: nichts von Hand erzeugen oder löschen, Runbook
   „Lauf ohne Werk“; die Serie steht dann bis zu einer Einstellungsänderung.
2. Neustart vom 19.12. und alle seitherigen Läufe belegen: Lauf-ID,
   Archivcommit und Elterncommit. Im Neustartcommit alle Werkdateien der
   ersten Serie gelöscht (bei lückenloser Serie 30), genau eine neue
   Werkdatei 2026-12-19 (Generation 1, ohne Eltern, isCatchUp false,
   Generator 0.4.0), Index nur mit ihr; public/favorites/** unverändert.
   Erwartet bei Revision 9 (Probe vom 24.11., hängt nur von Datum und
   Einstellungen ab): „Traumfalter im Zwischenraum“, 17 Elemente in 2 Ebenen
   (generativ 3, chaotisch 14), statisch. CI und Pages grün; auf Pages Index
   und Werkdatei bytegleich, die Favoritengalerie zeigt ihre Favoriten weiter.
3. Determinismus mit planAt im Speicher auf dem Elterncommit des
   Archivcommits und den Zeitstempeln des Laufs prüfen; removed muss genau die
   gelöschten Werke der ersten Serie nennen.
4. Archiv-Baseline: Manifest-Einträge, markup/<id>.txt und die Bilder
   archive-<id>.png der gelöschten Werke (19.11. bis 24.11.) gezielt entfernen,
   dann um die Werke der neuen Serie ergänzen (Befehl im Kopf von
   tests/archive-baseline.test.tsx, Bilder mit
   tests/browser/archive-baseline.spec.ts); sonst nichts ändern.
5. npm run check und npm run test:browser ausführen und ehrlich berichten.
6. Commit der Ergebnisse vorschlagen; nach Freigabe Fetch, Remote-Commits per
   Rebase übernehmen und zusammen mit lokalen Doku-Commits pushen.

Grenzen: Generator 0.4.0, fixtures/preview/review-v4.json und artReviewV4
nicht ohne Auftrag ändern. Werke nur auf ausdrücklichen Auftrag oder durch den
eingestellten Serienneustart löschen; public/favorites/** nie von Hand ändern.
config/generation.json ändert der Betreiber über die Einstellungsseite oder per
ausdrücklichem Auftrag. Worker-Deployments nur mit eigener Freigabe und nach
Runbook (Token mit Rolle Editor nur für evolvera-admin, kurz befristet). Fetch,
Pull, Commit und Push erst nach Rückfrage; ein Push auf main ist eine
Veröffentlichung und löst auch den Tageslauf aus. Remote-Archiv-, Einstellungs-
und Favoritencommits nur per Fast-forward bzw. Rebase übernehmen, nie
überschreiben. Kein manueller Workflowstart. Keine Secrets. Neue Abhängigkeiten
nur nach Rückfrage.
```

## Ältere Startprompts

Der Startprompt vom 25.11.2026 (Tageslauf mit Revision 9) steht unter
`git show 502aea6:docs/NEXT-START.md`, der vom 24.11.2026 unter
`git show f10e5fe:docs/NEXT-START.md`, der vom 23.11.2026 unter
`git show 0b45470:docs/NEXT-START.md`, der vom 22.11.2026 unter
`git show 5c61cc4:docs/NEXT-START.md`, der vom 21.11.2026 (Tageslauf und Test des
Serienneustarts) unter `git show e2ef41c:docs/NEXT-START.md`. Der Startprompt vom
20.11.2026 vor Paket C steht unter
`git show dc8dd09:docs/NEXT-START.md`, der davor (Tagesläufe ab 20.11. und Paket B)
in der Git-Historie (`git show a49217b:docs/NEXT-START.md`), der vom 19.11.2026 unter
`git show c3fdbab:docs/NEXT-START.md`. Die Startprompts bis zum 17.11.2026 stehen
zuletzt in Commit `387e3af` (`git show 387e3af:docs/NEXT-START.md`).
