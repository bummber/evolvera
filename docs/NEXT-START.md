# Aktueller Startprompt – erster Tageslauf der neuen Serie mit Generator 0.4.0

```text
Bitte Evolvera im bestehenden Projekt /Users/abrocker/ai_o_projects/evolvera
mit origin https://github.com/bummber/evolvera.git fortsetzen. Zuerst AGENTS.md,
CLAUDE.md, den neuesten HANDOFF (Nachtrag vom 18.11.2026) und diesen
Startprompt lesen. Dann /sichtung ausführen: rein lesend Git-Zustand, Remote,
Berliner Zeit, Tagesläufe und Archiv prüfen und gemeinsam sichten.

Stand: Am 18.11.2026 veröffentlicht (387e3af; CI 44280212199 und Pages
44280212170 grün): Generator 0.4.0 vererbt je Elternteil höchstens drei
einzelne Eigenschaften (Farbe, Form oder Familie einer Ebene), traceable
mindestens eine von jedem Elternteil, free keine; alles andere entsteht neu.
Die Serie startet neu am 19.11.2026 (config/generation.json Revision 7,
Archiv vorher leer), die Abnahme steht als artReviewV4 in
config/release.json. Testphase: Werke dürfen auf ausdrücklichen Auftrag
gelöscht werden; der Tageslauf holt gelöschte Werke nicht zurück. Ein danach
angelegter Doku-Commit („docs: record the push of 2026-11-18 …“) kann noch
ungepusht sein: bei der Sichtung prüfen und mit dem nächsten Commit pushen,
nicht allein.

1. Den Tageslauf vom 19.11. (01:17) und alle seitherigen Läufe belegen:
   Lauf-ID, Archivcommit, Generation, Generator 0.4.0, Revision, Nachholung.
   Erwartet für Generation 1 laut Probelauf: „Falterkristall im
   Zwischenraum“, 72 Elemente. DNA und Titel sind deterministisch; eine
   Abweichung ist ein Befund. Ist ein Lauf gestoppt: nichts von Hand
   erzeugen oder löschen, Ursache gemeinsam klären.
2. Archiv-Baseline um die archivierten Werke ergänzen (Befehl im Kopf von
   tests/archive-baseline.test.tsx, Bilder mit
   tests/browser/archive-baseline.spec.ts); nur anhängen, nichts
   Bestehendes ändern. Die Bilder entstehen auf macOS; der Linux-Runner
   bestätigt sie erst beim nächsten Push.
3. Ab Generation 3 (21.11.) die Vererbung an echten Werken prüfen: höchstens
   drei Eigenschaften je Elternteil, jede belegt und sichtbar, keine ganzen
   Ebenen. Die Fülle beobachten; Hebel ist die Dichte im Profil.
4. npm run check und npm run test:browser ausführen und ehrlich berichten.
5. Gemeinsame Sichtung und Entscheidung über das nächste Paket: Rest von
   EP-01 (Worker-Deployment der Einstellungsseite und P9, Startprompt unten;
   dessen Grenzen „nichts löschen“ und „keine Änderung an Generator 0.3.0“
   sind überholt), Serienneustart nach einem Wert von einem Monat oder die
   Favoritengalerie (ausgewähltes Werk samt direkten Eltern, vom Löschen
   ausgenommen). Für neue Funktionen zuerst 2–3 Optionen mit Empfehlung.

Grenzen: Generator 0.4.0, fixtures/preview/review-v4.json und artReviewV4
nicht ohne Auftrag ändern. Werke nur auf ausdrücklichen Auftrag löschen.
config/generation.json ändert der Betreiber über die Einstellungsseite oder
per ausdrücklichem Auftrag. Fetch, Pull, Commit und Push erst nach Rückfrage;
ein Push auf main ist eine Veröffentlichung und löst auch den Tageslauf aus.
Remote-Archiv- und Einstellungscommits nur per Fast-forward bzw. Rebase
übernehmen, nie überschreiben. Kein manueller Workflowstart. Keine Secrets.
Neue Abhängigkeiten nur nach Rückfrage.
```

## Historischer Startprompt – EP-01: Inbetriebnahme der Einstellungsseite und P9 Abschluss (ruht seit 18.11.2026)

Hinweis: Die Grenzen „nichts löschen“ und „keine Änderung an Generator 0.3.0“
dieses Prompts sind durch die Betreiberentscheidung vom 18.11.2026 überholt.

```text
Bitte Evolvera im bestehenden Projekt /Users/abrocker/ai_o_projects/evolvera
mit origin https://github.com/bummber/evolvera.git fortsetzen. Zuerst AGENTS.md,
CLAUDE.md, neuesten HANDOFF, diesen Startprompt,
docs/extensions/EP01-umsetzungsplan.md (Abschnitte P8, P9 und 7),
workers/admin/README.md, docs/runbook.md und docs/operator-setup.md lesen.
Dann /sichtung ausführen: rein lesend Git-Zustand, Remote, Berliner Zeit,
Tagesläufe und Archiv prüfen und gemeinsam sichten.

Stand: EP-01 P0 bis P8 umgesetzt. P8a ist mit Push 1 veröffentlicht
(3c0d709 am 17.11.2026; CI 44165366329 und Pages 44165366325 grün): Alle
Leser verstehen Konfigurationsschema 2, die Profilregeln Version 2 lehnen
traceable mit einer Ebene ab, config/generation.json steht in
.prettierignore. Einstellungsseite und Worker-API sind mit Push 2
veröffentlicht (ddb8f2e am 17.11.2026; CI 44169156988 und Pages 44169157269
grün). Ein danach angelegter Doku-Commit („docs: record push 2 of
2026-11-17“) kann noch ungepusht sein: bei der Sichtung prüfen und mit dem
nächsten Commit pushen, nicht allein. Der Live-Worker zeigt noch das alte
Modusformular; config/generation.json ist Schema 1, Revision 6. Bekanntes Restrisiko:
Generator 0.3.0 findet bei seltenen Profilen kein Werk (HANDOFF 17.11.); dann
stockt die Serie, bis sich eine Einstellung ändert. In dem Fall nichts
löschen, nichts neu erzeugen, gemeinsam entscheiden. Offen bleiben die
Firefox-/Safari-Prüfung und der zurückgestellte Serienneustart (kein
Auftrag, nichts löschen).

Ich beauftrage jetzt die Inbetriebnahme der Einstellungsseite (Rest von P8)
und das Arbeitspaket P9 (Abschluss) aus dem Umsetzungsplan.
1. Archiv-Baseline um die seit 18.11. archivierten Werke ergänzen (Befehl im
   Kopf von tests/archive-baseline.test.tsx); Bestehendes nicht verändern.
   Den Tageslauf zum 18.11. als ersten Lauf auf dem P8a-Stand belegen.
2. Worker-Deployment vorbereiten und mir zeigen: npm run build:admin, dann
   Deployment aus workers/admin; was sich live ändert (Modusformular
   entfällt, Einstellungsseite und /api/settings kommen, Seitendateien als
   Worker-Assets). Deployment erst nach meiner ausdrücklichen Freigabe.
   Secrets und SQLite-Sitzungen bleiben erhalten; keine Cookie-, Token- oder
   Liveworker-Logeinsicht.
3. Nach dem Deployment gemeinsam live prüfen: Anmeldung, Seite lädt ohne
   CSP-Fehler, Vorschau, Abmelden. Das erste Speichern mache ich selbst.
   Danach den Commit „Update future generation settings“ belegen (Schema 2,
   revision + 1, Startdatum, Generierung und Zeitzone unverändert) und den
   nächsten Tageslauf (übernimmt Profil und Revision, kein Archivwerk
   ändert sich).
4. P9: README.md, docs/architecture.md, docs/runbook.md (u. a. Build der
   Seite vor jedem Deployment, Vorgehen bei einem Lauf ohne Werk), HANDOFF
   und NEXT-START auf den neuen Stand bringen; Restgrenzen ehrlich
   festhalten (verzögerte Wirkung der Dichte, Generatorrisiko, ungeprüfte
   Browser).
5. npm run check, npm run test:browser und npm run worker:test-runtime
   ausführen und ehrlich berichten.
6. Gemeinsame Sichtung; danach EP-01 abschließen oder Restpunkte benennen.

Grenzen: Keine Änderung an Generator 0.2.0 und 0.3.0, Abstandsmaß,
Titelgenerator, ArtV1, ArtRenderer.tsx, Renderer 2, artwork.ts,
artwork-v3.ts, generatorChangeDate, artReviewV3, Archivdateien,
Archiv-Baseline (nur ergänzen), eingefrorenen Fixtures oder bestehenden
Browserreferenzen. config/generation.json ändert nur der Betreiber über die
Einstellungsseite. Keine Secrets und keine externe Einrichtung ohne eigene
Freigabe. Zeigt ein Tageswerk einen Fehler: nichts löschen, nichts neu
erzeugen, gemeinsam entscheiden. Kein Löschen von Werken ohne ausdrücklichen
Auftrag. Neue Abhängigkeiten nur nach Rückfrage.

Remote-Archiv- und Einstellungscommits nur per Fast-forward bzw. Rebase
übernehmen, nie überschreiben. Fetch, Pull, Commit und Push erst nach
Rückfrage; ein Push auf main ist eine Veröffentlichung und löst auch den
Tageslauf aus. Kleine, thematisch getrennte Commits vorschlagen. Kein
manueller Workflowstart. Lokale Tests isoliert/synthetisch, Workerausgaben
außerhalb dist und Git.
```

## Ältere Startprompts

Die Startprompts bis zum 17.11.2026 (Serienstart, Phasen 0–4, EP-01 P0 bis
P8) wurden am 18.11.2026 aus dieser Datei entfernt, weil sie zu groß wurde.
Sie stehen vollständig in der Git-Historie, zuletzt in Commit `387e3af`
(`git show 387e3af:docs/NEXT-START.md`).
