# Spätere Serie – vorgemerkter Wunsch

28.10.2026, ausdrücklicher Betreiberwunsch: Nach der jetzigen Serie später eine
weitere Serie mit höherer Varianz erarbeiten, insbesondere mehr Farbverläufe,
Linien und Kurven.

Das ist ein vorgemerkter separater Auftrag, keine Erweiterung dieser Phase.
Keine neuen Generatorregeln, keine neue Serie und keine Neugenerierung vorhandener
Werke begonnen. Die 40 aktuellen Testwerke sind abgenommen. Bestehende Versionen
und Endparameter erhalten. Eine spätere neue Serie/Version braucht eigene
Spezifikation, getrennte Testwerke und Abnahme vor ihrem Start.

Am 29.10.2026 wurde auf Betreiberauftrag das spätere Erweiterungspaket
[EP-01](extensions/PRD-EP01.md) formuliert. Grundlage ist die separat geprüfte PRD
v1.2. Die Spezifikation berücksichtigt den bestehenden Stand, Versionsschutz und
eine neue Kunstabnahme. [Startprompts](extensions/STARTPROMPTS.md) trennen die
Fortsetzung des aktuellen Plans vom späteren Einstieg in EP-01. Keine Umsetzung
des Pakets und keine Änderung des aktuellen Betriebsplans beauftragt.

## Vorgemerkt am 10.11.2026 – Favoriten, Löschschalter und Serienneustart

Ausdrücklicher Betreiberwunsch für die Zeit nach EP-01
([Umsetzungsplan](extensions/EP01-umsetzungsplan.md)); kein Teil von EP-01 und
kein Umsetzungsauftrag:

- Der Betreiber kann im geschützten Bereich Werke als Favoriten markieren.
- Ein Löschschalter für den Betreiber löscht alle bisherigen Werke, die nicht
  als Favorit markiert sind.
- Die Favoriten erscheinen in einem eigenen Bereich „Favoriten-Galerie“, ohne
  ihre Vorgänger (keine Elternwerke, keine Abstammungskette).
- Danach beginnt eine neue Serie.

Vor einer Umsetzung zu klären:

- Der Wunsch widerspricht der heutigen Grundregel in `AGENTS.md` und PRD v1.1,
  dass historische Werke nie gelöscht oder verändert werden. Die Regel muss
  dafür ausdrücklich und gezielt geändert werden.
- Umfang des Löschens: nur aus dem veröffentlichten Stand oder auch aus der
  Git-Historie des öffentlichen Repositories. Sicherung vor dem Löschen.
- Darstellung der Favoriten ohne Eltern: Herkunftsangaben, Elternverweise und
  Evolutionsansicht verweisen sonst auf gelöschte Werke.
- Schutz des Schalters: Betreiberidentität, ausdrückliche Bestätigung, kein
  versehentliches oder wiederholtes Auslösen.
- Neue Serie: Kennung, Datums-IDs, Pfade, Index, zwei neue Ursprungswerke und
  Startdatum; Verhältnis zur Favoriten-Galerie.
- Die alten Renderer müssen erhalten bleiben, solange Favoriten sie brauchen.
