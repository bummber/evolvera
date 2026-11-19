# Aktueller Startprompt – Tagesläufe ab 20.11.2026 und Paket B (Favoritengalerie)

```text
Bitte Evolvera im bestehenden Projekt /Users/abrocker/ai_o_projects/evolvera
mit origin https://github.com/bummber/evolvera.git fortsetzen. Zuerst AGENTS.md,
CLAUDE.md, den neuesten HANDOFF (Nachtrag vom 19.11.2026) und diesen
Startprompt lesen. Dann /sichtung ausführen: rein lesend Git-Zustand, Remote,
Berliner Zeit, Tagesläufe und Archiv prüfen und gemeinsam sichten.

Stand: Am 19.11.2026 veröffentlicht (c3fdbab; CI 44532339016 und Pages
44532338762 grün). Erstes Werk der neuen Serie ist Generation 1
„Falterkristall im Zwischenraum“ (19.11., Generator 0.4.0), eingefroren in
der Archiv-Baseline. Die Einstellungsseite ist live (Worker-Version
6b7e4354); der Betreiber hat das Schnellprofil „Ruhig“ gespeichert
(8381a8c, Schema 2, Revision 8). Damit sind die Pakete von EP-01 umgesetzt.
Ein danach angelegter Doku-Commit („docs: record the settings page and the
first run of 2026-11-19“) kann noch ungepusht sein: bei der Sichtung prüfen
und mit dem nächsten Commit pushen, nicht allein.

1. Den Tageslauf vom 20.11. (01:17) und alle seitherigen Läufe belegen:
   Lauf-ID, Archivcommit, Generation, Generator 0.4.0, Revision 8,
   Nachholung. Erwartet für Generation 2 (zweites Ursprungswerk) laut
   Probelauf auf 8381a8c: „Traumfieber im Stillstand“, 47 Elemente in 3
   Ebenen, statisch. Gilt nur, solange die Einstellungen vor dem Lauf
   unverändert bleiben. DNA und Titel sind deterministisch; eine Abweichung
   ist ein Befund. Ist ein Lauf gestoppt: nichts von Hand erzeugen oder
   löschen, Runbook „Lauf ohne Werk“, Ursache gemeinsam klären.
2. Archiv-Baseline um die archivierten Werke ergänzen (Befehl im Kopf von
   tests/archive-baseline.test.tsx, Bilder mit
   tests/browser/archive-baseline.spec.ts); nur anhängen, nichts
   Bestehendes ändern. Der Linux-Runner bestätigt die Bilder beim nächsten
   Push.
3. Ab Generation 3 (21.11.) die Vererbung an echten Werken prüfen: höchstens
   drei Eigenschaften je Elternteil, jede belegt und sichtbar, keine ganzen
   Ebenen. Die Fülle mit Profil „Ruhig“ beobachten (Simulation: Dichte
   sparsam etwa 20 % unter dem Standard, ohne Verzögerung).
4. npm run check und npm run test:browser ausführen und ehrlich berichten.
5. Paket B, Favoritengalerie: ein ausgewähltes Werk samt direkten Eltern,
   vom Löschen ausgenommen. Das ändert das Datenmodell: zuerst 2–3 Optionen
   mit Empfehlung vorlegen und die Freigabe abwarten. Danach Paket C
   (Serienneustart nach einem einstellbaren Wert von einem Monat), ebenfalls
   zuerst mit Optionen.

Grenzen: Generator 0.4.0, fixtures/preview/review-v4.json und artReviewV4
nicht ohne Auftrag ändern. Werke nur auf ausdrücklichen Auftrag löschen.
config/generation.json ändert der Betreiber über die Einstellungsseite oder
per ausdrücklichem Auftrag. Worker-Deployments nur mit eigener Freigabe und
nach Runbook (Token mit Rolle Editor nur für evolvera-admin, kurz befristet).
Fetch, Pull, Commit und Push erst nach Rückfrage; ein Push auf main ist eine
Veröffentlichung und löst auch den Tageslauf aus. Remote-Archiv- und
Einstellungscommits nur per Fast-forward bzw. Rebase übernehmen, nie
überschreiben. Kein manueller Workflowstart. Keine Secrets. Neue
Abhängigkeiten nur nach Rückfrage.
```

## Ältere Startprompts

Der Startprompt vom 19.11.2026 (erster Tageslauf mit Generator 0.4.0) und der
seitdem erledigte EP-01-Startprompt zur Inbetriebnahme der Einstellungsseite und
P9 stehen in der Git-Historie (`git show c3fdbab:docs/NEXT-START.md`). Die
Startprompts bis zum 17.11.2026 stehen zuletzt in Commit `387e3af`
(`git show 387e3af:docs/NEXT-START.md`).
