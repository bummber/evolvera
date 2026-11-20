# Aktueller Startprompt – Tagesläufe ab 21.11.2026, Favoriten live, Paket C

```text
Bitte Evolvera im bestehenden Projekt /Users/abrocker/ai_o_projects/evolvera
mit origin https://github.com/bummber/evolvera.git fortsetzen. Zuerst AGENTS.md,
CLAUDE.md, den neuesten HANDOFF (Nachtrag vom 20.11.2026) und diesen
Startprompt lesen. Dann /sichtung ausführen: rein lesend Git-Zustand, Remote,
Berliner Zeit, Tagesläufe und Archiv prüfen und gemeinsam sichten.

Stand: Werke 19.11. (Generation 1) und 20.11. (Generation 2 „Traumfieber im
Stillstand“) archiviert und in der Archiv-Baseline eingefroren (a49217b, CI
44750848170 und Pages 44750848242 grün). Paket B (Favoritengalerie) ist
umgesetzt: Option A (Kopien unter public/favorites/), der Worker committet
direkt, Entfernen mit Bestätigung, nur der Betreiber unter /favorites. Prüfen,
ob Commit, Push und Worker-Deployment von Paket B erfolgt sind; der Worker
läuft sonst noch als Version 6b7e4354 ohne Favoriten.

1. Den Tageslauf vom 21.11. (01:17) und alle seitherigen Läufe belegen:
   Lauf-ID, Archivcommit, Generation, Generator 0.4.0, Revision 8,
   Nachholung. Erwartet für Generation 3 laut Probelauf: „Samtflechten /
   Leuchtfieber“, Eltern 19.11. und 20.11., 56 Elemente in 2 Ebenen,
   statisch; geerbt vom 19.11. eine Farbe, vom 20.11. Familie und eine Farbe.
   Gilt nur bei unveränderten Einstellungen. DNA und Titel sind
   deterministisch; eine Abweichung ist ein Befund. Ist ein Lauf gestoppt:
   nichts von Hand erzeugen oder löschen, Runbook „Lauf ohne Werk“.
2. Archiv-Baseline um die neuen Werke ergänzen (Befehl im Kopf von
   tests/archive-baseline.test.tsx, Bilder mit
   tests/browser/archive-baseline.spec.ts); nur anhängen.
3. Vererbung an echten Werken prüfen: höchstens drei Eigenschaften je
   Elternteil, jede belegt und sichtbar, keine ganzen Ebenen. Fülle mit
   Profil „Ruhig“ beobachten.
4. Falls Paket B deployt ist: Favoritencommits belegen (nur public/favorites/
   geändert, Kopien byte-gleich, Läufe grün) und #/favoriten live ansehen.
5. npm run check und npm run test:browser ausführen und ehrlich berichten.
6. Paket C, Serienneustart nach einem einstellbaren Wert von einem Monat:
   zuerst 2–3 Optionen mit Empfehlung vorlegen und die Freigabe abwarten.
   Favoriten unter public/favorites/ bleiben beim Neustart unangetastet.

Grenzen: Generator 0.4.0, fixtures/preview/review-v4.json und artReviewV4
nicht ohne Auftrag ändern. Werke nur auf ausdrücklichen Auftrag löschen;
public/favorites/** nie von Hand ändern. config/generation.json ändert der
Betreiber über die Einstellungsseite oder per ausdrücklichem Auftrag.
Worker-Deployments nur mit eigener Freigabe und nach Runbook (Token mit Rolle
Editor nur für evolvera-admin, kurz befristet). Fetch, Pull, Commit und Push
erst nach Rückfrage; ein Push auf main ist eine Veröffentlichung und löst auch
den Tageslauf aus. Remote-Archiv-, Einstellungs- und Favoritencommits nur per
Fast-forward bzw. Rebase übernehmen, nie überschreiben. Kein manueller
Workflowstart. Keine Secrets. Neue Abhängigkeiten nur nach Rückfrage.
```

## Ältere Startprompts

Der Startprompt vom 20.11.2026 (Tagesläufe ab 20.11. und Paket B) steht in der
Git-Historie (`git show a49217b:docs/NEXT-START.md`), der vom 19.11.2026 unter
`git show c3fdbab:docs/NEXT-START.md`. Die Startprompts bis zum 17.11.2026 stehen
zuletzt in Commit `387e3af` (`git show 387e3af:docs/NEXT-START.md`).
