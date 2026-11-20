# Aktueller Startprompt – 21.11.2026: Tageslauf, Test des Serienneustarts

```text
Bitte Evolvera im bestehenden Projekt /Users/abrocker/ai_o_projects/evolvera
mit origin https://github.com/bummber/evolvera.git fortsetzen. Zuerst AGENTS.md,
CLAUDE.md, den neuesten HANDOFF (Nachträge vom 20.11.2026) und diesen
Startprompt lesen. Dann /sichtung ausführen: rein lesend Git-Zustand, Remote,
Berliner Zeit, Tagesläufe und Archiv prüfen und gemeinsam sichten.

Stand 20.11.2026, 23:15: Werke 19.11. (Generation 1) und 20.11. (Generation 2
„Traumfieber im Stillstand“) archiviert und eingefroren. Paket B (Favoriten)
live, erster Favorit 4091b1c. Paket C (Serienneustart nach N Tagen,
Konfigurationsschema 3) gepusht (e44eff2, CI 44824238324 und Pages 44824238085
grün) und deployt (Worker bb8431b4, 23:03). Noch nicht eingestellt:
config/generation.json ist Schema 2, Revision 8, ohne Neustart. Lokal liegt
mindestens ein ungepushter Doku-Commit (Deployment von Paket C und dieser
Startprompt); er wird nach Freigabe zusammen mit dem nächsten Commit gepusht.

Der Betreiber testet heute zuerst selbst. Reihenfolge:

1. Den Tageslauf vom 21.11. (01:17, real meist gegen 8–9 Uhr) und alle
   seitherigen Läufe belegen: Lauf-ID, Archivcommit, Generation, Generator
   0.4.0, Revision, Nachholung, removed (muss 0 sein). Erwartet bei Revision 8:
   Generation 3 „Samtflechten / Leuchtfieber“, Eltern 19.11. und 20.11.,
   56 Elemente in 2 Ebenen, statisch; geerbt vom 19.11. eine Farbe, vom 20.11.
   Familie und eine Farbe. Eine neue Revision vor dem Lauf ergibt andere
   Werke. Ist ein Lauf gestoppt: nichts von Hand erzeugen oder löschen,
   Runbook „Lauf ohne Werk“.
2. Live-Test des Betreibers begleiten, erst nach diesem Lauf: /settings zeigt
   „Serienneustart“; Häkchen setzen, 30 Tage, Anzeige „19. Dezember 2026“,
   speichern. /favorites nennt danach den nächsten Neustart. Den
   Einstellungscommit lesend belegen: nur config/generation.json, Schema 3,
   Revision 9, restartAfterDays 30, Startdatum und Generierung unverändert;
   CI und Pages grün; #/ueber zeigt „Erster Serienstart 2026-11-19, Neustart
   alle 30 Tage“. Markiert der Betreiber das Werk vom 21.11. als Favorit:
   Commit belegen (drei Kopien, byte-gleich, nur public/favorites/).
3. Archiv-Baseline um das Werk vom 21.11. ergänzen (Befehl im Kopf von
   tests/archive-baseline.test.tsx, Bilder mit
   tests/browser/archive-baseline.spec.ts); nur anhängen.
4. Vererbung am Werk vom 21.11. prüfen: höchstens drei Eigenschaften je
   Elternteil, jede belegt und sichtbar, keine ganzen Ebenen.
5. npm run check und npm run test:browser ausführen und ehrlich berichten.
6. Commit der Ergebnisse vorschlagen; nach Freigabe Fetch, Remote-Commits per
   Rebase übernehmen und zusammen mit den lokalen Doku-Commits pushen.

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

Der Startprompt vom 20.11.2026 vor Paket C steht unter
`git show dc8dd09:docs/NEXT-START.md`, der davor (Tagesläufe ab 20.11. und Paket B)
in der Git-Historie (`git show a49217b:docs/NEXT-START.md`), der vom 19.11.2026 unter
`git show c3fdbab:docs/NEXT-START.md`. Die Startprompts bis zum 17.11.2026 stehen
zuletzt in Commit `387e3af` (`git show 387e3af:docs/NEXT-START.md`).
