# Evolvera – Erweiterungspaket EP-01

Version: 0.1 · Stand: 29.10.2026

Status: Spezifikation für später, zur gemeinsamen Durchsicht. Dokumentation beauftragt;
Implementierung, Aktivierung und Veröffentlichung dieses Pakets sind nicht beauftragt.

## 1. Zweck und Einordnung

EP-01 erweitert die künstlerische Bandbreite um Farbverläufe, Linien, Kurven,
generative Formen und kombinierbare Ebenen. Betreiber können den Möglichkeitsraum
kommender Werke beeinflussen und die Wirkung vor dem Speichern an Probewerken sehen.
Zufall und belegbare Vererbung bleiben das künstlerische Prinzip.

Grundlage ist die externe PRD v1.2 vom 29.10.2026:
`/Users/abrocker/ai_projects/evolvera Claude/PRD.md`, SHA-256
`ee3642f9b6e850ddb295e77a7eb5a13a7007ad94381059dd86b5ad1d3c49fb25`.
Dieses Dokument passt deren Erweiterungen an den tatsächlich vorhandenen Projektstand
an. Es übernimmt keine Aufforderung, Phase 0 neu zu beginnen oder den Projektordner
zu wechseln. Maßgeblicher Ordner bleibt `/Users/abrocker/ai_o_projects/evolvera/`;
Repository bleibt `bummber/evolvera`.

`docs/PRD.md` v1.1 und ausdrücklich dokumentierte Betreiberentscheidungen gelten für
den aktuellen Entwicklungsplan weiter. Bei späterem Auftrag gilt EP-01 ergänzend für
die hier beschriebenen Erweiterungen. Offene Entscheidungen sind keine Freigaben.

## 2. Ausgangsstand und Grenzen

- Lokale Phase 4 vorhanden; externe Einrichtung und echte Cloud-Abnahme noch offen.
- Generator 0.2.0, Titelgenerator 0.1.0, Renderer 1, Werkschemata 1/2 und
  Konfigurationsschema 1 vorhanden. Drei erzeugende Familien: geometrisch, Farbfeld,
  Mosaik. Die logische 1000 × 1000-Kunstfläche ist bereits implementiert.
- 40 Testwerke beider Modi sind für den bestehenden Stand abgenommen. Diese Abnahme
  gilt nicht automatisch für neue Regeln, neue Renderer oder ein neues Standardprofil.
- Aktuell Startdatum null, Generierung aus, Serienfreigabe false. Das Dokument ändert
  weder diese Gates noch Betreiber-, Workflow- oder Deploymentkonfigurationen.
- Historische Werke, Testdaten, Referenzbilder, Generatoren und Renderer bleiben erhalten.

Kunst bleibt ausschließlich HTML/CSS: keine SVG-Elemente/-Assets, Canvas, WebGL,
Bilddateien oder URL-basierte Bildquellen. Keine externen Bild- oder LLM-Dienste.
Kein Besucherlogin, kein Werkeditor, keine nachträgliche Kuratierung des Archivs.
Export, Community, neue redaktionelle Bereiche und Titel-Labor gehören nicht zu EP-01.

## 3. Nutzung und Oberfläche

Der Betreiber öffnet die geschützten Einstellungen, bearbeitet ein lokales Formular,
betrachtet 6–9 Probewerke, prüft den Unterschied zur gespeicherten Revision und speichert.
Erst eine bestätigte, konfliktfreie Git-Speicherung zeigt Erfolg. Änderungen gelten ab
dem nächsten noch nicht begonnenen Lauf. Begonnene Läufe behalten ihren Snapshot.

Sieben Bereiche: Evolution, Formen, Oberfläche, Farbe, Komposition, Bewegung,
Experimente. Mobile Bedienung ab 320 CSS-Pixel, Tastatur, sichtbarer Fokus,
verständliche Beschriftungen. Das gewählte Editorial-Design A bleibt der Rahmen.
Mehrere „Immer“- oder „Aus“-Werte erzeugen einen Hinweis auf verringerte Vielfalt.
Profile „Standard“, „Ruhig“, „Wild“ sind optional und setzen lediglich Formularwerte.
Besuchende erhalten keine Schalter für die offizielle Generierung.

## 4. Einstellungen und Standardprofil

Die folgende Tabelle definiert das vorgesehene Standardprofil. Technische Feldnamen
sind Vertragsentwurf, keine bereits gültigen Schlüssel der aktuellen Konfiguration.

| Bereich | Einstellung | Werte / Standard |
|---|---|---|
| Evolution | Modus | `traceable` (Standard), `free` |
| Evolution | Mutationsstärke | `calm`, `medium` (Standard), `high`, `wild` |
| Evolution | Ähnlichkeitsfenster | 1–30 vorherige Werke; Standard 7 |
| Formen | Linien | `normal` |
| Formen | Kurven/Bögen, generative Formen | jeweils `rare` |
| Oberfläche | Verläufe, Muster | jeweils `normal` |
| Oberfläche | Masken, Blendmodi, Schatten/Unschärfe | jeweils `rare` |
| Farbe | Strategien | mindestens eine aus harmonisch, komplementär, monochrom, frei; Standard alle |
| Farbe | Kontrast | `low`, `varied` (Standard), `high` |
| Komposition | Aktive Familien | mindestens eine; Standard alle sechs aus Abschnitt 6 |
| Komposition | Maximale Ebenen | 1–3; Standard 3 |
| Komposition | Symmetrie | `normal` |
| Komposition | Dichte | `sparse`, `varied` (Standard), `dense` |
| Bewegung | Häufigkeit | `normal` |
| Bewegung | Intensität | `subtle`, `varied` (Standard), `strong` |
| Experimente | Seltene Mutationssprünge | aus |

Merkmalshäufigkeiten einschließlich Symmetrie verwenden fünf Stufen:

| Stufe | Bedeutung |
|---|---|
| `off` | Im neuen Werk ausgeschlossen, auch bei Vererbung |
| `rare` | Selten neu erzeugt; Richtwert 10–20 % |
| `normal` | Normal neu erzeugt; Richtwert 35–50 % |
| `often` | Häufig neu erzeugt; Richtwert 65–80 % |
| `always` | In jedem neuen Werk sichtbar vorhanden |

Die Prozentwerte beziehen sich auf die Entscheidung je Werk und Merkmalsgruppe,
nicht auf den Anteil einzelner DOM-Knoten. Vererbte Vorkommen können die beobachtete
Häufigkeit erhöhen; nur `off` und `always` sind harte Garantien. Exakte Wahrscheinlichkeiten,
Abhängigkeiten und Anzahl der Vorkommen werden mit der Generatorversion dokumentiert.
Kein Versprechen, dass eine kleine Stichprobe genau diese Prozentsätze erreicht.

## 5. Vorrangregeln, Vererbung und Konflikte

1. Sicherheits-, Sichtbarkeits- und Lastgrenzen sind zwingend. Ein Profil darf sie
   nicht durch „Immer“, Mutationssprünge oder Retry-Versuche umgehen.
2. Einstellungen begrenzen beide Modi. `off` verhindert ein Merkmal im Kind;
   `always` verlangt mindestens ein sichtbares Vorkommen. Übrige Stufen steuern neue
   Vorkommen und löschen keine zulässigen ererbten Merkmale.
3. Palette und Geometrie sind immer vorhandene Kerngene. Ab Generation 3 muss
   `traceable` mindestens einen sichtbaren, konkret belegten Beitrag jedes Elternteils
   erhalten, auch unter restriktiven Profilen. Kerngene allein beweisen dies nicht:
   tatsächliche Ausgangs-/Zielwerte, Operatoren und Sichtbarkeit werden geprüft.
4. Verbotene Elternmerkmale dürfen z. B. von Verlauf zu Farbfläche oder Bogen zu Linie
   umgewandelt werden, sofern auch das Zielmerkmal erlaubt ist. Sonst weitere zulässige
   Umwandlung wählen. `constrained` belegt Quelle, Ziel, Operator und auslösende Regel.
   Eine entfernte oder verdeckte Eigenschaft zählt nicht als Elternbeitrag.
5. Mindestens eine Familie und Palettenstrategie bleiben aktiv. Alle sonstigen
   Merkmale dürfen `off` sein, wenn ein sichtbares Werk aus Kerngenen möglich bleibt.
6. Vor Implementierung wird eine versionierte Kompatibilitätsmatrix festgelegt,
   insbesondere für Symmetrie, Familien, Ebenenzahl und kombinierte Oberflächeneffekte.
   Widersprüche werden vor Speicherung verständlich abgelehnt. „Alles Immer“ muss mit
   allen Familien und ausreichendem Budget als unterstütztes Testprofil realisierbar
   sein; es garantiert keine beliebige Kombination mit jeder anderen Einschränkung.
7. UI, Worker und Generator teilen denselben Validator. Keine stille Änderung des
   Profils. Laufzeitdaten, die ihn verletzen, stoppen die Generierung. Deterministische
   Retries dürfen nur innerhalb des gültigen Profils andere Kompositionen wählen.

Beide Ursprungswerke bleiben unabhängig; danach gelten weiterhin genau die beiden
unmittelbaren Vorgängergenerationen als Eltern. `free` verlangt keine Mindestübernahme.
Mutationsstärke verschiebt Verteilungen, garantiert aber weder Stilbruch noch Nähe.

## 6. Künstlerische Bausteine und Renderer

Familien: geometrische Konstellation, Farbfeld/Minimalismus, Mosaik/Raster,
organische Verläufe, generative Strukturen, chaotische Überlagerung. Bewegung ist ein
eigenes Gen, keine neue Familie. Bis zu drei Ebenen (Hintergrund, Struktur, Akzent)
besitzen jeweils eine Familie und eine feste Reihenfolge. Ebenen dürfen vererbt oder
neu aufgebaut werden; kein bloßes Überlagern der vollständigen Elternwerke.

Pflichtumfang des Pakets:

- Linien und Linienbündel; Bögen, Ringe, Halbkreise und Truchet-Kacheln.
- Generative Polygone sowie kurvige Flächen/Pfade aus numerischen Kontrollpunkten.
- Spiralen, Phyllotaxis und Lissajous-Anordnungen aus budgetierten DOM-Elementen.
- Wiederholende CSS-Verläufe für Streifen, Raster, Ringe, Punktmuster und Moiré.
- Lineare/radiale/konische Füllverläufe; Verlaufsmasken; begrenzte Blendmodi,
  Schatten und Unschärfen; rekursive Flächenteilung innerhalb des Gesamtbudgets.
- OKLCH-Paletten mit dokumentierter Farbraum-/Gamutbehandlung. Konkrete Endwerte
  werden archiviert, nicht bei Anzeige aus einer aktuellen Palette neu berechnet.

DNA enthält ausschließlich streng validierte Zahlen, Farben und geschlossene
Aufzählungen. CSS-/Pfadstrings erzeugt nur der Renderer. `clip-path: path()` ist eine
CSS-Technik; es werden keine SVG-Dokumente erzeugt. Für sichtbare Kurvenstriche ist
die konkrete Flächen-/Rahmentechnik nachzuweisen, ein offener Clip-Pfad reicht nicht.
Browserunterstützung von Pfaden, Masken, Farbfunktionen und gegebenenfalls `shape()`
bei Umsetzung anhand aktueller Primärquellen prüfen. Erforderliche Rückfallebenen
werden versioniert; sie dürfen einen belegten Elternbeitrag nicht unsichtbar machen.

Die vorhandene 1000 × 1000-Fläche mit einheitlicher Skalierung wird weiterverwendet.
Vorgesehenes Gesamtbudget: höchstens 120 Kunst-DOM-Elemente über alle Ebenen,
einschließlich zusätzlicher Wrapper innerhalb der Kunstfläche. Punktanordnungen
erhalten ein Teilbudget. Filter-/Animationslast zusätzlich auf Mobilgeräten messen;
geringe DOM-Kosten sind kein Nachweis geringer Renderlast. Vor Kunstabnahme konkrete
Lastgrenzen dokumentieren. Historische Budgets und Renderer werden nicht umgeschrieben.

Statische reproduzierbare Kacheln, Animation nur im Hauptwerk, Pause und
`prefers-reduced-motion` bleiben verbindlich. Sichtbarkeit und Elternbeiträge werden
mit Mindestgröße, Kontrast, Überdeckung und Ruhezustand geprüft.

## 7. Determinismus und Vielfalt

Die Ähnlichkeitsprüfung betrachtet höchstens die letzten N Werke derselben Kette,
bei kürzeren Ketten alle vorhandenen. Ein versioniertes numerisches Abstandsmaß
berücksichtigt Familien, Palette, Formarten, Dichte, Muster und Bewegung. Schwelle,
Gewichte und eine endliche Retry-Grenze werden vor E2 festgelegt und getestet.
Keine automatische Lockerung von Mindestabstand, Profil oder Vererbungsbeiträgen;
wenn kein gültiger Kandidat entsteht, stoppt der Lauf ohne Teilarchivierung.

Vollständige deterministische Eingaben sind: Seed, geordnete Eltern, eingefrorene
Einstellungen, Generator-/Lexikon-/Abstandsversion, geordneter Historienkontext des
Ähnlichkeitsfensters und der für Titelkollisionen nötige Titelbestand. Ein stabiler
Digest bindet den Kontext an die im Archiv verfügbaren Werke. Alle Inhalte lassen
sich bei gleichen Eingaben reproduzieren; reale Uhrzeiten sind separate Metadaten.
Nachholwerke erweitern den Kontext innerhalb des Laufs chronologisch.

## 8. Datenverträge, Versionsschutz und Betrieb

Neue Konfigurations-, Werk-, Generator- und Rendererverträge erhalten eigene Versionen.
Vorgesehen: Konfigurationsschema 2, Werkschema 3 und Renderer 2; endgültige Nummern
im späteren E0 mit dem dann aktuellen Stand abgleichen. Bestehende Verträge bleiben
lesbar und ausführbar. Keine Erweiterung unter unverändertem Renderer 1.

Jedes neue Werk speichert End-DNA, Ebenen, vollständigen effektiven Snapshot mit
Modus/Revision, alle Algorithmusversionen, Herkunftsbelege einschließlich `constrained`
und den Kontextdigest. Datum, Laufstart, Erstellungszeit und Nachholkennzeichnung
bleiben getrennt. Details zeigen historische „Rahmenbedingungen“ aus diesem Snapshot.
Alte Werke erhalten keine erfundenen Snapshots: bekannte Metadaten zeigen, fehlende
Angaben ausdrücklich als „in dieser Version nicht gespeichert“ kennzeichnen.

Vorschau, Actions und Validierung verwenden dieselbe reine Bibliothek. Die geschützte
Oberfläche soll einen zusätzlichen Vite-Einstieg erhalten und über Worker-Assets in
derselben Origin laufen. Bestehende Sitzung/Identitätsprüfung/CSRF/Origin-Prüfung und
konfliktfeste Git-Speicherung bleiben erhalten; CSP gezielt an lokale Bundles anpassen.
Keine Geheimnisse im Browser. Vorschaugenerierung läuft im Browser, schreibt keine
Dateien/Commits, hat keine offiziellen IDs und verändert keine gespeicherte Revision.
Probekette enthält zwei unabhängige Eltern und mindestens ein Kind. Vorschau-Seeds
bleiben während der Betrachtung stabil; „Neu würfeln“ ändert sie ausdrücklich.
Ein Hinweis nennt abweichende veröffentlichte Generatorversionen; eine Vorschau ist
keine Vorhersage des nächsten offiziellen Werks.

Der Worker darf zusätzlich nur die freigegebenen Einstellungen aus Abschnitt 4 ändern.
Startdatum, Generierungsaktivierung, Serienfreigabe, Zeitzone und Versionsauswahl bleiben
außerhalb des Formulars. Ein Lauf übernimmt den vollständigen Snapshot einmal nach
exklusivem Start. Konflikt-Retry bewahrt ihn; archivierte Werke werden nie angepasst.
Archivwiederherstellung bleibt bytegenau aus Git, keine Neuberechnung.

Ob eine neue getrennte Serie oder ein ausdrücklich datierter Versionswechsel innerhalb
derselben Serie erfolgen soll, bleibt eine Betreiberentscheidung vor Aktivierung.
EP-01 bereitet keine automatische Serienumschaltung vor. Für eine getrennte Serie
müssen Kennung, Datums-IDs, Pfade, Eltern und Index vorab kollisionsfrei spezifiziert
werden. Ein späterer Auftrag darf dies nicht still aus dem Wort „Erweiterung“ ableiten.

## 9. Arbeitspakete und Abnahme

| Paket | Ergebnis und Grenze |
|---|---|
| E0 | Aktuellen Stand gemeinsam sichten; Versionsplan, Konfliktmatrix, Budgets, Wahrscheinlichkeiten und Abstandsvertrag konkret dokumentieren; Serienweg als offene Aktivierungsentscheidung ausweisen. Noch keine Kunst-/Betriebsänderung. |
| E1 | Neue additive Schemata, Renderer und Formenkatalog; getrenntes lokales Atelier; alte Referenzen unverändert. |
| E2 | Neue Evolution, Profilregeln, Kontext/Ähnlichkeitsprüfung, deterministische Retries und Herkunftsbelege. |
| E3 | Betreiberformular, ungespeicherte Vorschau, Git-Snapshot, historische Detaildarstellung; sichere bestehende Anmeldung weiterverwenden. |
| E4 | Kunst-/Leistungsprüfung und eigene Abnahme; konkreten Aktivierungsplan vorlegen. Kein automatisches Deployment oder Start. |

Jedes Paket wird vor dem nächsten gemeinsam gesichtet. Vor offizieller Nutzung:

- 30–50 neue getrennte Testwerke im Standardprofil, beide Modi und Beispielketten;
  ausdrückliche Betreiberabnahme. Zusätzlich kurze Ketten für 2–3 abweichende Profile.
- Je Modus mindestens 365 Testtage, Zeitumstellung/Nachholung und gültige Elternketten.
- Je mindestens 50 Werke pro Extremprofil und Modus: alle optionalen Merkmale aus,
  alle auf immer, nur eine Familie, Mutationsstärke wild. Profilmatrix unterscheidet
  gültige und abzuweisende Kombinationen; kein stiller Fallback. Last, Sichtbarkeit,
  Elternbeiträge und Ähnlichkeitsregeln werden geprüft.
- Determinismus einschließlich Historienkontext, Titelkollisionen und Retry-Grenzen;
  neue Historie darf den Kontextdigest ändern, alte Enddaten jedoch nicht.
- `off`/`always`, `constrained`, Snapshotwechsel während eines Laufs, paralleles
  Speichern und Nachholung in lokalen isolierten Repositories mit synthetischen Secrets.
- Neue Browserreferenzen für die neuen Bausteine; bestehende Referenzen unverändert.
  320px und Desktop, Tastatur, reduzierte Bewegung, mobile Last, Safari/Firefox und
  reale Geräte prüfen oder fehlende Prüfungen ausdrücklich offen halten.
- `npm run check`, bei UI/Routing `npm run test:browser`, bei Worker/Sitzungen
  `npm run worker:test-runtime`; echte Cloud-/Cookie-/Speicherprüfung nach entsprechender
  externer Freigabe. Lokale Tests ersetzen diese nicht.

## 10. Jetzt und später

Jetzt wird ausschließlich diese Spezifikation samt Startprompt abgelegt. Der nächste
aktive Schritt bleibt die gemeinsame Durchsicht des externen Phase-4-Einrichtungsplans
in `docs/runbook.md`. Die bisherige Kunstabnahme und die aktuelle PRD bleiben erhalten.

EP-01 startet erst durch einen späteren ausdrücklichen Auftrag mit dem Startprompt
in `docs/extensions/STARTPROMPTS.md`. Serien-/Versionsaktivierung, Veröffentlichung,
neue Konten/Apps und Berechtigungen benötigen weiterhin den jeweils passenden Auftrag.
