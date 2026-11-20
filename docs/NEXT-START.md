# Aktueller Startprompt – Tagesläufe ab 21.11.2026, Favoriten live, Serienneustart

```text
Bitte Evolvera im bestehenden Projekt /Users/abrocker/ai_o_projects/evolvera
mit origin https://github.com/bummber/evolvera.git fortsetzen. Zuerst AGENTS.md,
CLAUDE.md, den neuesten HANDOFF (Nachträge vom 20.11.2026) und diesen
Startprompt lesen. Dann /sichtung ausführen: rein lesend Git-Zustand, Remote,
Berliner Zeit, Tagesläufe und Archiv prüfen und gemeinsam sichten.

Stand: Werke 19.11. (Generation 1) und 20.11. (Generation 2 „Traumfieber im
Stillstand“) archiviert und eingefroren. Paket B (Favoriten) ist live
(Worker 7a13badc, erster Favorit 4091b1c, Testkorrektur 83b8292). Paket C
(Serienneustart nach N Tagen, Schema 3) ist am 20.11. abends umgesetzt;
prüfen, ob Commit, Push und Worker-Deployment erfolgt sind und ob der Betreiber
schon Tage eingestellt hat (config/generation.json Schema 3).

1. Den Tageslauf vom 21.11. (01:17) und alle seitherigen Läufe belegen:
   Lauf-ID, Archivcommit, Generation, Generator 0.4.0, Revision, Nachholung,
   gelöschte Werke (removed). Erwartet bei Revision 8: Generation 3
   „Samtflechten / Leuchtfieber“, Eltern 19.11. und 20.11., 56 Elemente in
   2 Ebenen, statisch; geerbt vom 19.11. eine Farbe, vom 20.11. Familie und eine
   Farbe. Eine neue Revision vor dem Lauf ergibt andere Werke. Ist ein Lauf
   gestoppt: nichts von Hand erzeugen oder löschen, Runbook „Lauf ohne Werk“.
2. Archiv-Baseline um die neuen Werke ergänzen (Befehl im Kopf von
   tests/archive-baseline.test.tsx, Bilder mit
   tests/browser/archive-baseline.spec.ts); nur anhängen.
3. Vererbung an echten Werken prüfen: höchstens drei Eigenschaften je
   Elternteil, jede belegt und sichtbar, keine ganzen Ebenen.
4. Paket C: Falls noch offen, Commit, Push und Worker-Deployment je nach
   Freigabe. Danach stellt der Betreiber auf /settings 30 Tage ein (erster
   Neustart 19.12.2026). Den Einstellungscommit belegen: nur
   config/generation.json, Schema 3, Revision + 1, Startdatum unverändert.
5. Favoritencommits belegen: nur public/favorites/ geändert, Kopien byte-gleich,
   Läufe grün; #/favoriten live ansehen.
6. npm run check und npm run test:browser ausführen und ehrlich berichten.

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
