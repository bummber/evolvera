# Aktueller Startprompt – 22.11.2026: Tageslauf mit Revision 9

```text
Bitte Evolvera im bestehenden Projekt /Users/abrocker/ai_o_projects/evolvera
mit origin https://github.com/bummber/evolvera.git fortsetzen. Zuerst AGENTS.md,
CLAUDE.md, den neuesten HANDOFF (Nachtrag vom 21.11.2026) und diesen
Startprompt lesen. Dann /sichtung ausführen: rein lesend Git-Zustand, Remote,
Berliner Zeit, Tagesläufe und Archiv prüfen und gemeinsam sichten.

Stand 21.11.2026 abends: Werke 19.11. bis 21.11. (Generationen 1–3) archiviert;
Baseline bis 21.11. Der Betreiber hat den Serienneustart eingestellt
(a321a89: Schema 3, Revision 9, restartAfterDays 30, erster Neustart
19.12.2026). Der Konfigurationstest kannte Schema 3 nicht und ließ CI und
Pages scheitern; Korrektur 6710a98 gepusht, CI 44940937761 und Pages
44940937850 grün. Baseline und Doku vom 21.11. werden nach Freigabe gepusht.

1. Den Tageslauf vom 22.11. (01:17, real meist gegen 8–9 Uhr) und alle
   seitherigen Läufe belegen: Lauf-ID, Archivcommit, Generation, Generator
   0.4.0, Revision, Nachholung, removed (muss 0 sein, belegt über den Commit,
   weil die Laufausgabe nicht im Log steht). Erwartet bei Revision 9:
   Generation 4 „Leuchtsaum“, Eltern 20.11. und 21.11., 16 Elemente in
   3 Ebenen, statisch; geerbt vom 20.11. eine Farbe, vom 21.11. eine Form.
   Eine neue Revision vor dem Lauf ergibt andere Werke. Ist ein Lauf
   gestoppt: nichts von Hand erzeugen oder löschen, Runbook „Lauf ohne Werk“.
2. Determinismus mit planAt im Speicher auf dem Elterncommit des
   Archivcommits und den Zeitstempeln des Laufs prüfen.
3. Archiv-Baseline um das neue Werk ergänzen (Befehl im Kopf von
   tests/archive-baseline.test.tsx, Bilder mit
   tests/browser/archive-baseline.spec.ts); nur anhängen.
4. Vererbung am neuen Werk prüfen: höchstens drei Eigenschaften je
   Elternteil, jede belegt und sichtbar, keine ganzen Ebenen.
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

Der Startprompt vom 21.11.2026 (Tageslauf und Test des Serienneustarts) steht unter
`git show e2ef41c:docs/NEXT-START.md`. Der Startprompt vom 20.11.2026 vor Paket C steht unter
`git show dc8dd09:docs/NEXT-START.md`, der davor (Tagesläufe ab 20.11. und Paket B)
in der Git-Historie (`git show a49217b:docs/NEXT-START.md`), der vom 19.11.2026 unter
`git show c3fdbab:docs/NEXT-START.md`. Die Startprompts bis zum 17.11.2026 stehen
zuletzt in Commit `387e3af` (`git show 387e3af:docs/NEXT-START.md`).
