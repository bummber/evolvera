---
name: sichtung
description: Rein lesender Sitzungseinstieg für Evolvera. Prüft Git-Zustand, Remote-Stand, Berliner Zeit, Tagesläufe und Archiv und fasst den Befund zusammen. Verwenden zu Beginn einer Sitzung oder wenn nach dem aktuellen Stand gefragt wird.
---

Erstelle eine Bestandsaufnahme des Projekts, ohne irgendetwas zu verändern.

## Grenzen

Ausschließlich lesen. Kein `git fetch`, `pull`, `merge`, `commit`, `push`, kein
Workflowstart, kein Deployment, keine Datei- oder Konfigurationsänderung. Keine
Einsicht in Secrets, Cookies, Tokens, `.dev.vars` oder Liveworker-Logs.

## Schritte

1. `docs/HANDOFF.md` (neuester Abschnitt) und `docs/NEXT-START.md` lesen.
2. Lokaler Zustand: `git status --short`, `git log --oneline -5`,
   `git rev-parse HEAD`.
3. Remote-Stand ohne Fetch:
   `gh api repos/bummber/evolvera/git/ref/heads/main --jq .object.sha`
   und mit lokalem `HEAD` vergleichen. Bei Abweichung die fehlenden Commits über
   `gh api "repos/bummber/evolvera/commits?per_page=5"` benennen.
4. Berliner Datum und Uhrzeit: `TZ=Europe/Berlin date '+%Y-%m-%d %H:%M %Z'`.
5. Letzte Läufe: `gh run list --repo bummber/evolvera --limit 8` (Workflow,
   Auslöser, Status, Zeitpunkt).
6. Archiv: `public/artworks/index.json` lesen; letztes Werk mit Datum,
   Generation, Titel und Eltern nennen. Anhand von `src/series/calendar.ts` und
   der Berliner Zeit bestimmen, welches Werkdatum fällig wäre. Beachten, dass das
   lokale Archiv hinter dem Remote liegen kann (Schritt 3).
7. `config/generation.json` und `config/release.json` lesen: Startdatum, Modus,
   Generierung, Serienfreigabe.

## Bericht

Kurz und auf Deutsch:

- Lokal vs. Remote (synchron, hinter oder voraus; uncommittierte Dateien)
- Archivstand und fälliges Werkdatum
- Letzte Läufe mit Auffälligkeiten (fehlgeschlagen, verspätet, fehlend)
- Abweichungen gegenüber HANDOFF/NEXT-START
- Vorschlag für den nächsten Schritt

Danach anhalten und auf die gemeinsame Sichtung warten. Was nicht geprüft werden
konnte, ausdrücklich nennen.
