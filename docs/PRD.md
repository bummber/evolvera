---
title: "Evolvera – Product Requirements Document"
subtitle: "Eine täglich wachsende, evolutionäre Web-Kunstgalerie"
version: "1.1"
status: "Fachlich abgestimmt / Start mit Phase 0"
date: "2026-10-27"
language: "de-DE"
---

# EVOLVERA
## Product Requirements Document (PRD)

**Version:** 1.1  
**Datum:** 27. Oktober 2026  
**Status:** Nach gemeinsamem Review fachlich abgestimmt; Umsetzung beginnt mit Phase 0  
**Arbeitstitel:** Evolvera (vorläufig)  
**Zielplattform:** Öffentliche, mobile-first Webanwendung  
**Leitprinzip:** Täglich generierte Kunst. Zwei Vorgänger. Ein neuer, unvorhersehbarer Nachfolger.

> **Kurzbeschreibung:** Evolvera erschafft jeden Tag automatisch ein neues abstraktes Kunstwerk – ausschließlich aus HTML-Elementen und CSS, ohne Fotos, Bilddateien, Canvas oder Bildgenerierungs-KI. Am ersten Serientag entsteht ein unabhängiges Ursprungswerk, am zweiten Serientag ein zweites. Ab dem dritten Werk kombiniert und mutiert ein Algorithmus die Eigenschaften der beiden unmittelbar vorherigen Werke. Jede Generation erhält einen erfundenen, poetischen Titel und wird dauerhaft als strukturierte Daten archiviert. Besuchende können das Tageswerk sehen, im Archiv stöbern und dessen Herkunft nachvollziehen.

---

## Ergänzung vom 05.11.2026 – Tageswechsel ab 06.11.2026

Auf Betreiberauftrag wird der Tageswechsel versuchsweise ab Werkdatum **06.11.2026 auf 01:17 Uhr Europe/Berlin** vorgezogen. Nachholversuche: **01:47 und 02:23 Uhr**. Für frühere Werkdaten bleibt der ursprüngliche Termin **04:00 Uhr** gültig; archivierte Werke und deren Metadaten werden nicht geändert. Zeitplan, Generierung, Schema und öffentliche Anzeige verwenden dieselbe datierte Regel. Sommer-/Winterzeit richtet sich nach dem Offset am vorgesehenen lokalen Termin. GitHub Actions bleibt best effort; eine höhere Zuverlässigkeit dieses Zeitfensters ist noch nicht nachgewiesen. Umsetzung und Veröffentlichung sind im [Umstellungsbericht](schedule-change.md) getrennt ausgewiesen.

## Beschlussstand nach dem gemeinsamen Review

Diese Version ersetzt die fachliche Ausgangsversion 1.0. Die folgenden Produktentscheidungen wurden gemeinsam mit dem Betreiber bestätigt. Die beschriebenen Funktionen sind Anforderungen, keine bereits implementierten oder getesteten Eigenschaften.

| Thema | Verbindlicher Beschluss |
|---|---|
| Serie | Tag 1: Ursprungswerk A; Tag 2: unabhängiges Ursprungswerk B; ab Tag 3 Evolution. Das konkrete Startdatum wird zum Livegang festgelegt. |
| Ausfälle | Fällige Tage werden chronologisch nachgeholt. Vorgesehenes Werkdatum und tatsächlicher Erstellungszeitpunkt werden getrennt gespeichert; nachgeholte Werke werden gekennzeichnet. |
| Vererbungsmodi | „Nachvollziehbare Vererbung“ und „Maximale Freiheit“ sind umschaltbar. Standard ist „Nachvollziehbare Vererbung“. |
| Einstellungen | Nur der Betreiber darf den Modus unter „Einstellungen“ ändern. Er bleibt bis zur nächsten Änderung aktiv und wirkt ab dem nächsten noch nicht begonnenen Generierungslauf. |
| Zugang | Anmeldung mit dem vorhandenen GitHub-Konto des Betreibers; keine Besucheranmeldung und kein zusätzliches Evolvera-Passwort. |
| Betreiberfunktion | Cloudflare Workers im kostenlosen Tarif ergänzt GitHub Pages. Galerie, Archiv und tägliche Generierung bleiben bei GitHub. |
| Historische Werke | Komposition, Farben und Bewegungsregeln bleiben dauerhaft erhalten; kleinere Browserunterschiede sind möglich. |
| Archivfehler | Historische Daten aus Git wiederherstellen, niemals neu auswürfeln. Bei nicht sicher behebbaren Schäden Generierung und defekte Veröffentlichung stoppen; die letzte funktionierende Website bleibt erreichbar. |
| Kunstabnahme | Vor Serienstart 30–50 getrennte Testwerke einschließlich Beispielketten beider Modi gemeinsam durchsehen. Die offizielle Serie beginnt erst nach ausdrücklicher Abnahme. |
| Galerie | Echte HTML-/CSS-Vorschauen in einem reproduzierbaren, gut sichtbaren Ruhezustand; Animation nur im geöffneten Hauptwerk. |
| Navigation | Heute, Galerie, Evolution, Über Evolvera und Einstellungen. Ein Werk kann in bis zu zwei Folgegenerationen Elternteil sein. |
| Repository | [bummber/evolvera](https://github.com/bummber/evolvera); spätestens zum ersten öffentlichen Testdeployment öffentlich. |

**Geprüfter Ausgangsstand:** Git und GitHub CLI sind installiert. Das GitHub-Repository ist zum Zeitpunkt des Reviews privat und leer. Der lokale Ordner `/Users/abrocker/ai_o_projects/evolvera/` enthält die PRD-Ausgangsversion, ist aber noch kein Git-Repository. Vor der Umsetzung diesen Stand erneut prüfen; zwischenzeitliche Änderungen erhalten.

**Noch nicht festgelegt:** konkretes Serienstartdatum, endgültiges Detaildesign und Bereitstellungsdetails der GitHub-Anmeldung. Ein Cloudflare-Konto und die GitHub-App-Konfiguration sind für die Betreiberfunktion später einzurichten; ihr Vorhandensein wurde nicht geprüft.

---

## 1. Produktvision

Evolvera ist eine öffentlich zugängliche, sich selbst weiterentwickelnde Kunstgalerie. Die Anwendung macht aus regelbasiert erzeugter, abstrakter Kunst eine fortlaufende Geschichte: Tag für Tag wächst eine Bildfolge, bei der jedes neue Werk aus den letzten zwei Generationen hervorgeht und dennoch überraschend anders aussehen darf.

Es geht **nicht** um technisch perfekte Bilder, Fotorealismus, KI-Bildgeneratoren oder von Menschen kuratierte Motive. Im Mittelpunkt stehen **Zufall, visuelle Vielfalt, Mutation, Kontinuität und Beobachtbarkeit der Entwicklung**. Die Galerie soll Neugier wecken: „Was ist heute entstanden, und wie ist es aus gestern und vorgestern hervorgegangen?“

### 1.1 Produktversprechen

- Jeden Tag ein neues, eindeutiges Kunstwerk, geplant ab **01:17 Uhr in der Zeitzone `Europe/Berlin`**.
- Jedes Werk wird mit seinem Titel, Erstellungsdatum, gestalterischen Eigenschaften und seiner Abstammung dauerhaft gespeichert.
- Eine kleine, ästhetische und schnelle Website, die auf Smartphones hervorragend funktioniert.
- Keine laufenden Kosten für Bildgenerierungsdienste und für die erste Version **möglichst 0 € Hostingkosten**.
- Ein technischer Unterbau, der später andere Inhalte und neue Funktionen aufnehmen kann.

### 1.2 Erfolgskriterien für Version 1

1. Die Website ist ohne Login über eine öffentliche URL erreichbar.
2. Pro vorgesehenem Berliner Serientag existiert höchstens ein kanonisches Kunstwerk. Ein Nachhollauf darf mehrere verschiedene Tageswerke erzeugen.
3. Ab der dritten Generation sind immer genau die beiden unmittelbar vorherigen Generationen die **Elternwerke**.
4. Besuchende können Tageswerk, Archiv und die Herkunft eines ausgewählten Werks ansehen.
5. Die Darstellung ist rein DOM-/CSS-basiert; keine Bilddateien für die Kunst.
6. Der Prozess funktioniert automatisch ohne geöffneten Browser und ohne laufenden Mac.
7. Betrieb und Veröffentlichung zielen auf GitHub Free und Cloudflare Workers Free ohne regelmäßige Gebühren; aktuelle Limits werden bei Einrichtung geprüft.
8. Nur der Betreiber kann sich mit GitHub anmelden und den Modus zukünftiger Generierungen dauerhaft ändern.

---

## 2. Zielgruppe und Nutzungsverhalten

### 2.1 Primäre Zielgruppen

- **Neugierige Besucher:** Möchten das heutige Bild betrachten und vielleicht einzelne ältere Werke erkunden.
- **Wiederkehrende Besucher:** Interessieren sich dafür, wie sich die Kunst über mehrere Tage verändert.
- **Projektbetreiber/Entwickler:** Möchten die Entwicklung verstehen, Regeln erweitern, Fehler analysieren und später weitere Inhalte ergänzen.

### 2.2 Typische Besuchsabläufe

**Szenario A – Der tägliche Blick:** Eine Person öffnet die Seite auf dem Smartphone, sieht sofort das aktuelle Kunstwerk und dessen Fantasietitel. Sie kann eine Animation stoppen und bei Interesse die beiden Vorgänger betrachten.

**Szenario B – Entdeckungsreise:** Eine Person öffnet die Galerie, scrollt durch die chronologischen Arbeiten und betrachtet einzelne Werke in größerer Darstellung.

**Szenario C – Entwicklung verfolgen:** Eine Person öffnet ein Werk in der Evolutionsansicht und sieht dessen zwei Eltern, bis zu zwei direkte Folgegenerationen und eine verständliche Zusammenfassung der übernommenen bzw. veränderten Merkmale.

**Szenario D – Betrieb:** Der Betreiber sieht im GitHub-Repository die gespeicherten Daten. Ein täglicher Workflow erzeugt das Werk und veröffentlicht die aktualisierte Website ohne manuelles Eingreifen. Unter „Einstellungen“ meldet sich der Betreiber mit GitHub an und stellt den Vererbungsmodus für kommende Generierungsläufe um.

---

## 3. Scope: Version 1 (MVP)

### 3.1 Verbindliche Funktionen (MUST)

| ID | Funktion | Anforderung |
|---|---|---|
| F-01 | Tageswerk | Das zuletzt veröffentlichte Tageskunstwerk ist auf der Startseite prominent sichtbar. |
| F-02 | Tägliche Generierung | Automatischer geplanter Auslöser um 01:17 Uhr `Europe/Berlin`; unabhängig vom Seitenaufruf. |
| F-03 | Zwei Startgenerationen | Am ersten und zweiten Serientag entsteht jeweils ein unabhängiges Ursprungswerk; kein doppelter Serienstart am selben Datum. |
| F-04 | Evolution | Ab Generation 3 dienen die beiden unmittelbar vorhergehenden Werke als Eltern. |
| F-05 | Zwei Vererbungsmodi | Zufällige Mischung und Mutation ohne feste Prozentquote. Im nachvollziehbaren Modus muss jeder Elternteil gestalterisch beitragen; im freien Modus ist ein vollständiger Bruch erlaubt. |
| F-06 | Rein CSS/HTML | Kunstobjekte bestehen ausschließlich aus HTML-Elementen, CSS-Regeln, CSS-Verläufen, Maskierungen/Transformationen und ggf. CSS-Animationen. |
| F-07 | Poetische Fantasietitel | Jeder Generation wird ein algorithmisch erzeugter, ungewöhnlicher Titel zugewiesen. |
| F-08 | Archiv | Jede Generation wird dauerhaft, unveränderlich und datiert als Datei im Repository gespeichert. |
| F-09 | Galerie | Alle bisherigen Werke sind chronologisch durchsuchbar bzw. blätterbar, mit einzelnen Detailansichten. |
| F-10 | Evolution ansehen | Detailansicht zeigt die Elternwerke (falls vorhanden) und die wichtigsten Mutations-/Vererbungsinformationen. |
| F-11 | Animationen | Der Generator kann statische, dezente oder dynamische CSS-Kunstwerke erzeugen. |
| F-12 | Bewegung kontrollieren | Animationen sind pausierbar; `prefers-reduced-motion` wird beachtet. |
| F-13 | Mobile First | Funktion und Lesbarkeit auf kleinen Bildschirmen haben Vorrang. |
| F-14 | Kostengünstiges Hosting | Öffentliche statische Auslieferung über GitHub Pages; Generator via GitHub Actions. |
| F-15 | Fehlerrobustheit | Wiederholtes Ausführen erzeugt keine doppelten Tageswerke; fehlende Tage können in Reihenfolge aufgeholt werden. |
| F-16 | Entwicklung mit Codex | Übersichtlicher TypeScript-Code, automatisierte Tests, klare README und reproduzierbare lokale Befehle. |
| F-17 | Einstellungen | Nur der mit GitHub angemeldete Betreiber kann den globalen Vererbungsmodus speichern; wirksam ab dem nächsten noch nicht begonnenen Generierungslauf. |
| F-18 | Historische Stabilität | Archivierte Komposition, Farben und Bewegungsregeln bleiben über Website- und Generatorupdates erhalten. |
| F-19 | Über Evolvera | Konzept, beide Modi, HTML-/CSS-Prinzip und Archiv werden zum ersten Release verständlich erklärt. |
| F-20 | Kunstabnahme | 30–50 getrennte Testwerke aus beiden Modi werden vor offiziellem Serienstart vom Betreiber abgenommen. |

### 3.2 Wünschenswerte Eigenschaften (SHOULD)

- Besuchende können das Tageswerk mit einem Link teilen.
- Die Galerie lädt ältere Werke abschnittsweise (Pagination/Lazy Loading).
- Das Archiv zeigt eine Generationsnummer und einen kurzen, verständlichen „Mutationsbericht“.
- Ein manueller, abgesicherter GitHub-Actions-Start hilft bei der Fehlerbehebung.
- Galerie und Details bieten Tastaturbedienung und sinnvolle Textalternativen.

### 3.3 Nicht Bestandteil des MVP (OUT OF SCOPE)

- Besucher-Benutzerkonten, Kommentare, Likes, Community-Moderation oder persönliche Profile. Die einzelne geschützte Betreiberanmeldung ist ausdrücklich Bestandteil des MVP.
- Kostenpflichtige KI-Bildgenerierung, LLM-API oder KI-basierte Titel.
- Fotos, Bild-Uploads, externe Illustrationen oder importierte Kunstwerke.
- Downloads als PNG/JPEG, Druckshop, NFT-/Blockchain-Funktionen oder Monetarisierung.
- Allgemeines Admin-Dashboard, CMS, komplexe Datenbank oder dauerhaft betriebener eigener Backend-Server. Eine kleine Betreiberfunktion auf Cloudflare Workers für GitHub-Anmeldung und Moduswechsel ist ausdrücklich im Scope.
- Redaktionelles Blogsystem oder ein separater Medienbereich (architektonisch ermöglichen, später bauen).
- Interaktive Kunst-Editoren oder das nachträgliche Bearbeiten publizierter Werke.

---

## 4. Visuelles Konzept und Informationsarchitektur

### 4.1 Grundprinzipien

Die Kunst steht im Mittelpunkt. Die Benutzeroberfläche soll minimalistisch wirken und die täglich wechselnden Farben und Formen nicht konkurrierend überlagern. Ein **dezenter Rahmen** für die Kunstfläche gibt ihr eine konstante Bühne. Da die Seite später erweiterbar sein soll, wird Kunst nicht zum gesamten Seitengerüst gemacht, sondern als eigenständige Komponente in eine flexible Website eingebettet.

- Mobile First, ruhige Typografie, großzügige Abstände, hohe Lesbarkeit.
- Dunkles oder neutrales Grunddesign als erster Vorschlag; ein späterer Hellmodus bleibt möglich.
- Kunstfläche mit **festem Seitenverhältnis 1:1** und intern normierten Koordinaten; so bleibt eine Generation auf Smartphones und Desktops dieselbe Komposition.
- Auf kleinen Bildschirmen nahezu volle Inhaltsbreite mit sicherem Seitenabstand.
- Auf großen Bildschirmen zentrierte Kunstfläche (z. B. maximal 720 px) und optional begleitende Details daneben.
- Animationen dürfen visuell eigenwillig sein; Bedienung, Navigation und Lesbarkeit müssen ruhig bleiben.

### 4.2 Navigation für MVP

| Bereich | Funktion | Priorität |
|---|---|---|
| **Heute** (`#/`) | Aktuelles Kunstwerk, Titel, Datum, Generation, Elternlinks | MUST |
| **Galerie** (`#/galerie`) | Historische Werke in chronologischer Reihenfolge | MUST |
| **Evolution** (`#/evolution`) | Letzte Generationen und Herkunft; alternativ Detailansicht eines Werkes | MUST |
| **Werkdetail** (`#/werk/2026-10-27`) | Ein Werk in groß, Titel, Daten, zwei Eltern, Mutationsbericht | MUST |
| **Über Evolvera** (`#/ueber`) | Konzept, Modi, HTML-/CSS-Kunst und Archiv | MUST |
| **Einstellungen** (`#/einstellungen`) | Einstieg in GitHub-Anmeldung und geschützte globale Moduswahl | MUST |

**Routing:** Für GitHub Pages wird in V1 bewusst **Hash-Routing** bevorzugt. Dadurch funktionieren direkte Links, ohne dass GitHub Pages einen dynamischen Server oder spezielle SPA-Fallbacks benötigt. Eine spätere Umstellung auf schöne Pfade ist möglich. Die GitHub-Anmeldung benötigt einen serverseitigen Callback am Cloudflare Worker; ein URL-Fragment ist kein OAuth-Callback. Für MVP darf „Einstellungen“ die geschützte Oberfläche am Worker öffnen und eine klar erkennbare Rückkehr zur Galerie bieten (siehe 9.5).

### 4.3 Mobile Grundansicht (schematisch)

```text
+----------------------------------+
| EVOLVERA                    Menü  |
| Heute · Galerie · Evolution      |
+----------------------------------+
|          27.10.2026              |
|  „Kaleidomorphes Schweigen“      |
|          Generation 037          |
|                                  |
|   +--------------------------+   |
|   |                          |   |
|   |   HTML/CSS-KUNSTWERK     |   |
|   |   (1:1; ggf. animiert)   |   |
|   |                          |   |
|   +--------------------------+   |
|                                  |
|      [Animation pausieren]       |
|                                  |
| Aus zwei Welten entstanden:      |
|   [Vorgänger 035] [Vorgänger 036]|
|                                  |
| [Zum Werk] [Galerie entdecken]   |
+----------------------------------+
```

*Die Beispiele sind Platzhalter, keine Festlegung auf tatsächliche Titel oder Generationen.*

### 4.4 Galerie

- Neueste Werke zuerst; die Startgenerationen bleiben erreichbar.
- Kachel enthält verkleinerte **echte DOM-/CSS-Darstellung** des Werks sowie Datum und Titel.
- Klick/Tap öffnet die Detailansicht.
- Galerie-Vorschauen sind immer **statisch** und zeigen einen fest definierten, gut sichtbaren Zustand der gespeicherten Komposition. Dieser Zustand wird deterministisch aus der Werkbeschreibung und Renderer-Version abgeleitet, nicht zufällig im Moment des Seitenaufrufs eingefroren. Animationen laufen ausschließlich im geöffneten Hauptwerk, sofern erlaubt. Das gilt auch für Eltern- und Nachfolgerkacheln.
- Zu Beginn z. B. 12 Werke pro Seite; weitere auf Anforderung nachladen. Kein gleichzeitiges Rendern des gesamten mehrjährigen Archivs.

### 4.5 Evolution

- Bei einer Generation ab Nr. 3: **Eltern A + Eltern B → Nachfolger C**.
- Elternkacheln sind anklickbar und führen zu deren eigener Abstammung.
- Ab Generation 2 kann ein Werk Elternteil von `n+1` und `n+2` sein; Links erscheinen, sobald diese Werke existieren. Generation 1 ist nur Elternteil von Generation 3, weil Generation 2 unabhängig entsteht. Die Nachfolger werden aus tatsächlichen Elternreferenzen ermittelt.
- Die Detailansicht nennt den beim Werk gespeicherten Vererbungsmodus. Bei Ursprungswerken wird erklärt, dass die Vererbungsregel noch nicht angewendet wurde.
- Metadaten können beschreiben: „Farbpalette von A“, „Formdichte verändert“, „neuer Kompositionsstil“, „Bewegung übernommen“ – nur wenn die tatsächlich gespeicherten Daten das belegen.
- Für Generationen 1 und 2 wird transparent erklärt: „Ursprungswerk – unabhängig generiert“.

---

## 5. Regeln für die Kunstgenerierung

### 5.1 Zulässige Zeichenmittel

**Erlaubt:** HTML-Elemente (`div`, `span`), CSS-Boxen, Kreise über `border-radius`, Rechtecke, Linien, Konturen, Schatten, `linear-gradient`, `radial-gradient`, `conic-gradient`, Transparenz, CSS-Farbmischung, `transform`, `clip-path`, `filter` sowie CSS-Keyframe-Animationen. CSS-Pseudoelemente sind optional.

**Nicht erlaubt für den Kunstinhalt:** `<img>`, SVG-Grafiken, HTML Canvas, WebGL, CSS-Hintergrundbilder per URL, externe Bildbibliotheken, Fotos oder Bildgenerierungsdienste.

**JavaScript/TypeScript ist erlaubt für die Berechnung und Darstellung**, nicht als eigentlicher pixelzeichnender Grafikrenderer. Die DOM-Knoten werden aus einer gespeicherten Werkbeschreibung abgeleitet.

### 5.2 Gestalterische „Gene“

Jedes Kunstwerk besitzt eine strukturierte **DNA**, die unter anderem diese Eigenschaften umfasst:

| Merkmalsgruppe | Beispielwerte |
|---|---|
| Kompositionsfamilie | Geometrisch, organisch, minimalistisch, mosaikartig, chaotisch, typografiefrei-abstrakt, farbfeldorientiert |
| Palette | Hintergrundfarbe, Akzentfarben, Farbkontrast, Helligkeitsrichtung |
| Formen | Kreis, Quadrat, Rechteck, Linie, Ellipse, Polygon per `clip-path` |
| Geometrie | Normierte Position, Größe, Rotation, Abstand, Überlagerung |
| Oberfläche | Deckkraft, Schatten, Unschärfe, Verlauf, Blendmodus |
| Rhythmus | Symmetrie, Streuung, Wiederholung, Dichte, Gruppierung |
| Bewegung | Statisch / animiert; Art, Dauer, Richtung, Intensität, Verzögerung |
| Mutation | Entscheidungen darüber, was von den Eltern übernommen bzw. neu erzeugt wurde |
| Titel-DNA | Wortsegmente, semantische Bausteine, Schreibmuster und ggf. Elternfragmente |

Die konkrete interne Datenstruktur wird in der Implementierung versioniert und mit einem Schema validiert.

### 5.3 Kompositionsfamilien

Die Entwicklung startet mit **wenigen, klar unterscheidbaren Familien**, etwa:

1. **Geometrische Konstellation:** Kreise, Linien, Quadrate, präzise Anordnungen.
2. **Farbfeld / Minimalismus:** Große Flächen, geringe Elementzahl, hoher Kontrast.
3. **Mosaik / Raster:** Wiederholungen, Kacheln, Ordnungsbrüche.
4. **Organische Verläufe:** CSS-Verläufe, Unschärfen, weiche Übergänge.
5. **Kinetische Studie:** Bewegung, rotierende oder pulsierende Elemente.
6. **Chaotische Überlagerung:** Asymmetrie, viele Formen, starke Kontraste.

**Wichtig:** Die Familien sind Anregungen, **keine geschlossenen Schubladen**. Ein Nachfolger kann Attribute unterschiedlicher Familien verbinden oder seinen Stil komplett wechseln.

### 5.4 Evolution von Tag zu Tag

**Generation 1:** Am ersten Serientag vollständig unabhängig generiertes Ursprungswerk A.  
**Generation 2:** Am zweiten Serientag vollständig unabhängig generiertes Ursprungswerk B.  
**Generation 3:** Kind C aus den Genen von A und B plus neu gewürfelten Eigenschaften.  
**Generation 4:** Kind D aus B und C.  
**Generation 5:** Kind E aus C und D.  
**Allgemein:** `Eltern(n) = [Werk(n−2), Werk(n−1)]`, für `n >= 3`.

**Mutations- und Vererbungslogik:**

- Der Algorithmus zieht für **jedes neue Werk** eigene Zufallsparameter.
- Für **jede Merkmalsgruppe** kann er erneut zufällig wählen: aus Elternteil A übernehmen, aus Elternteil B übernehmen, Eltern mischen, verändern oder völlig neu würfeln.
- Vererbungsstärken und Mutationswahrscheinlichkeiten sind **nicht fest** auf 70/30 o. Ä. eingestellt. Innerhalb der Regeln des gewählten Modus sind fast identische Verwandtschaft und starke Stilwechsel möglich.
- Das Ergebnis soll trotz Zufall eine **sichtbare, technisch gültige Komposition** sein: Fehlerhafte CSS-Werte, völlig leerer Bildraum oder nicht lesbare Daten müssen abgefangen werden.
- Elternbilder werden **nicht übereinander als Screenshots gelegt**; stattdessen werden die gespeicherten Gestaltungsparameter algorithmisch kombiniert.
- Der Algorithmus speichert **welche Entscheidungen getroffen wurden**. Das ermöglicht eine ehrliche Darstellung der Evolution.

**Leichte Qualitätsleitplanken (kein kuratorisches Bewertungssystem):** Gültige Farben, erlaubte CSS-Werte, genügend sichtbare Elemente, Begrenzung von Elementzahl und Animationslast sowie eine Prüfung, ob gegenüber dem unmittelbaren Vorgänger eine erkennbare Änderung vorliegt. Falls die zufällige Komposition unbrauchbar ist, wird sie mit demselben Seed über einen deterministischen Retry-Pfad ersetzt. Diese Leitplanken dürfen die künstlerische Unberechenbarkeit nicht in ein starres Schema pressen.

### 5.4.1 Verbindliche Vererbungsmodi

**Nachvollziehbare Vererbung (`traceable`, Standard):** Ab Generation 3 trägt jeder Elternteil mindestens ein tatsächlich sichtbares gestalterisches Merkmal zum Kind bei. Das kann etwa eine Akzentfarbe, eine Formgruppe oder eine Bewegungsregel sein. Das Merkmal darf mutiert werden, muss aber mit konkreten Ausgangs-/Zielwerten oder einem nachvollziehbaren Operator belegt sein. Reine Eltern-IDs, ein Titelwort oder unsichtbare Elemente erfüllen diese Bedingung nicht. Der Generator validiert diese Mindestbeiträge auch nach Qualitäts-Retries. Es gibt keine feste prozentuale Aufteilung.

**Maximale Freiheit (`free`):** Beide Eltern-DNA werden als Eingangsquellen geladen und ausgewertet. Für sämtliche Merkmalsgruppen ist eine vollständige Neuschöpfung zulässig; es besteht keine Mindestübernahme. Ein radikaler Bruch ist erlaubt. Der Evolutionsbericht darf keine tatsächlich nicht erfolgte Übernahme behaupten.

**Für beide Modi:** Genau dieselben beiden Vorgängergenerationen sind die Eltern. Qualitäts-, Sichtbarkeits- und Lastgrenzen gelten unverändert. Der Moduswechsel startet keine neue Serie und ändert keine Archivdateien. Generationen 1 und 2 bleiben unabhängig, auch wenn der konfigurierte Modus mitgespeichert wird.

### 5.5 Determinismus und Archivierung

- Jede Generation bekommt eine stabile ID nach lokalem Datum (`YYYY-MM-DD`) und eine fortlaufende Generationsnummer.
- Zufallswerte werden mit einem dokumentierten **PRNG** (Pseudozufallsgenerator) und einem gespeicherten Seed erzeugt. `generatorVersion`, der verwendete Vererbungsmodus und die Einstellungsrevision werden ebenfalls gespeichert.
- Identischer Seed, identische Eltern, identische Generator-/Lexikonversion und derselbe Einstellungssnapshot liefern dieselbe DNA und denselben Titel. Zeitmetadaten werden getrennt über eine injizierbare Uhr ermittelt und sind kein Zufallsinput.
- Durch gespeicherte Endparameter muss ein bereits publiziertes Werk **nicht erneut zufällig erzeugt werden**, um dargestellt zu werden.
- Der Generator darf sich bei künftigen Versionen verändern; bestehende Archivdateien **dürfen nicht heimlich neu berechnet oder überschrieben** werden.
- `schemaVersion`, `generatorVersion` und `rendererVersion` werden explizit gespeichert. Unterstützte alte Renderer erhalten die archivierte Komposition, Farben und Bewegungsregeln. Änderungen an Website-Styles dürfen Kunstwerke nicht unbeabsichtigt verändern.
- Auch Schatten, Blur, Linienbreiten, Transform-Ursprünge und Bewegungswege beziehen sich auf die gemeinsame logische 1:1-Kunstfläche. Diese wird einheitlich skaliert; allein Prozentwerte für Positionen reichen nicht aus.
- Visuelle Regressionstests nutzen eine festgelegte Browserumgebung und einen reproduzierbaren Animationszustand. Kleine Unterschiede zwischen Browsern sind zulässig; pixelidentische Ergebnisse über sämtliche Browserversionen werden nicht versprochen. Screenshots als Testbelege sind zulässig, aber niemals das Produktionsformat der Kunst.
- Für eine vollständig transportable Einzeldarstellung kann später ein HTML/CSS-Export ergänzt werden. Für MVP gelten archivierte JSON-DNA plus unterstützter Renderer als kanonische Speicherung.

### 5.6 Künstlerische Freiheitsgrade

Es gibt bewusst **keinen festen Stil, keine starre Farbpalette und keinen vorgeschriebenen Vererbungsprozentsatz**. Eine Generation kann statisch oder animiert, ruhig oder wild, minimalistisch oder komplex sein. Der Algorithmus steuert nicht auf einen vorher festgelegten Endstil zu. Verpflichtend sind die zwei Vorgängergenerationen als Eingangsquelle sowie die Regeln des bei der Erzeugung gespeicherten Modus. Der nachvollziehbare Modus garantiert Beiträge beider Eltern; der freie Modus erlaubt vollständige Neuschöpfung.

---

## 6. Animationen

CSS-Animationen sind ein optionales Gen jeder Kunstgeneration. Die Parameter werden bei der Erzeugung gespeichert und können von Eltern stammen oder neu entstehen.

**Mögliche Bewegungen:** Drehung, Pulsieren, langsames Schweben, Farbwechsel, Skalierung, Verschiebung, rhythmische Staffelung sowie Kombinationen davon.

**Verhalten im MVP:**

- Manche Werke haben überhaupt keine Bewegung.
- Ein sichtbarer **Pause-/Wiedergabe-Schalter** steuert alle Animationen der aktiven Hauptansicht.
- Bei `prefers-reduced-motion: reduce` startet die Darstellung ohne laufende Animation; eine explizite Entscheidung der Besuchenden kann eine Animation für die Sitzung aktivieren.
- Galerie-, Eltern- und Nachfolgerkacheln zeigen den reproduzierbaren Ruhezustand. Bei reduzierter Bewegung startet auch das Hauptwerk in diesem sichtbaren Zustand. Ein manuelles Pausieren eines bereits laufenden Hauptwerks darf hingegen den aktuellen Moment einfrieren.
- Animationen dürfen Navigation, Scrollen und Bedienelemente nicht blockieren.
- Animationen sollen bevorzugt `transform` und `opacity` verwenden; ressourcenintensive Effekte (z. B. große Unschärfefilter) sind begrenzt.
- Persönliche Wiedergabepräferenzen werden nicht serverseitig gespeichert; optional bleibt dafür ein lokaler Sitzungszustand. Der globale Vererbungsmodus ist eine separate, dauerhaft gespeicherte Betreiberkonfiguration und keine Besucherpräferenz.

---

## 7. Poetischer Fantasietitel-Generator

### 7.1 Zweck

Jedes Kunstwerk erhält einen eigenständigen Namen, der sprachlich so unvorhersehbar sein darf wie die Bildkomposition. Titel sollen nach Kunst, Poesie, Abstraktion und erfundenen Sprachen klingen – ohne dass sie logisch sein müssen.

### 7.2 Verfahren

Ein **kostenloser, deterministischer TypeScript-Titelgenerator** kombiniert:

- Lexika mit Kunst-, Farb-, Raum-, Bewegungs- und Wahrnehmungsbegriffen;
- Silben-/Morphembaukästen für frei erfundene Wörter;
- wählbare syntaktische Muster mit ungewöhnlichen Kombinationen;
- Fragmente der beiden Elterntitel ab Generation 3;
- Zufallsoperationen wie Kürzen, Verschmelzen, Umstellen, Verdoppeln und Neuschöpfung.

Beispiele für die angestrebte Anmutung (nicht fest zu verwendende Titel): „Chromatische Traumfuge“, „Kaleidomorphes Schweigen“, „Luminochaos“, „Fragmentanz der Unendlichkeit“.

### 7.3 Anforderungen

- Pro Werk genau ein dauerhaft gespeicherter Haupttitel.
- Keine kostenpflichtigen Dienste, externen APIs oder Laufzeitabhängigkeit von einem LLM.
- Möglichst abwechslungsreiche Titel; das System soll offensichtliche Wiederholungen prüfen.
- Sonderzeichen und Umlaute müssen sicher gespeichert und angezeigt werden.
- Der tatsächliche Titel wird archiviert und ändert sich beim erneuten Aufruf nicht.
- Die Sprach-DNA und ihre Herkunft dürfen, müssen aber nicht vollständig auf der Website erscheinen.

---

## 8. Datenmodell und Archiv

### 8.1 Speicherstrategie

**MVP: Git-Repository als dauerhafter Datenspeicher für Werke und globale Generierungseinstellungen. Keine Werkdatenbank erforderlich.**

Für jede Generation wird eine eigene JSON-Datei im Ordner `public/artworks/YYYY/` versioniert. Ein automatisch gepflegter Index unterstützt aktuelle Ansicht und Galerie. Alle Inhalte werden mit Git archiviert und gemeinsam mit der Website veröffentlicht.

**Beispielhafte Struktur:**

```text
evolvera/
├── .github/
│   └── workflows/
│       └── publish.yml
├── config/
│   └── generation.json        # Serienstart, Aktivierung und aktueller Modus
├── workers/
│   └── admin/                 # GitHub-Anmeldung + geschützte Einstellungen
├── docs/
│   ├── PRD.md
│   └── architecture.md
├── public/
│   └── artworks/
│       ├── index.json
│       └── 2026/
│           ├── 2026-10-27.json
│           ├── 2026-10-28.json
│           └── 2026-10-29.json
├── src/
│   ├── app/                   # Seiten, Routing und Layout
│   ├── components/            # Navigation, Kunstbühne, Karten, Controls
│   ├── art/
│   │   ├── generator/         # Generation + Evolution + Zufall
│   │   ├── renderer/          # DOM-/CSS-Darstellung, versionsfähig
│   │   ├── titles/            # Poetischer Titelgenerator
│   │   └── schema/            # Typen und Datenvalidierung
│   └── styles/
├── scripts/
│   ├── generate-daily.ts
│   ├── rebuild-index.ts
│   └── validate-archive.ts
├── tests/
├── package.json
├── vite.config.ts
└── README.md
```

**Hinweis:** Das ist eine Zielstruktur, keine Verpflichtung auf genau diese Dateinamen. Die Logik sollte klar vom Frontend getrennt bleiben. Das Build darf die Werk-JSON-Dateien nicht versehentlich auslassen.

### 8.2 Datenbeispiel (schematisch)

```json
{
  "schemaVersion": 1,
  "rendererVersion": "1",
  "generatorVersion": "1.0.0",
  "inheritanceMode": "traceable",
  "settingsRevision": 1,
  "id": "2026-10-29",
  "generation": 3,
  "title": "Kaleidomorphes Schweigen",
  "timezone": "Europe/Berlin",
  "scheduledFor": "2026-10-29T04:00:00+01:00",
  "generatedAt": "2026-10-29T03:00:06Z",
  "isCatchUp": false,
  "seed": "evolvera-v1:2026-10-29",
  "parentIds": ["2026-10-27", "2026-10-28"],
  "dna": {
    "family": "geometric",
    "background": "#101D34",
    "palette": ["#E89D56", "#69C7CF", "#F4DB9B"],
    "elements": [
      {
        "kind": "circle",
        "x": 0.31,
        "y": 0.32,
        "width": 0.48,
        "height": 0.48,
        "rotation": 0,
        "color": "#E89D56",
        "opacity": 1
      }
    ],
    "animation": {
      "enabled": true,
      "mode": "slow-rotation",
      "durationSeconds": 24
    }
  },
  "titleDna": {
    "tokens": ["Kaleido", "morph", "Schweigen"]
  },
  "evolution": {
    "type": "hybrid",
    "decisions": [
      { "trait": "palette", "source": "parentA", "action": "mutated" },
      { "trait": "geometry", "source": "parentB", "action": "inherited" },
      { "trait": "animation", "source": "new", "action": "generated" }
    ]
  }
}
```

**Wichtig:** Dies ist **ein Beispiel**, kein vollständiges finales JSON-Schema. Für nachvollziehbare Vererbung benötigt das finale Schema konkrete Belege der gestalterischen Beiträge beider Eltern; die verkürzte `decisions`-Liste zeigt nur die Grundidee. Numerische Koordinaten liegen normiert zwischen 0 und 1; Generator und Renderer vereinbaren verbindliche Grenzen und Defaults.

`id` ist das vorgesehene Berliner Werkdatum, `scheduledFor` der vorgesehene Termin und `generatedAt` der tatsächliche Erstellungszeitpunkt. `isCatchUp` ist wahr, wenn der Lauf für dieses Werk erst nach Beginn des nächsten Berliner Tageszyklus gestartet ist; gewöhnliche Verzögerungen am vorgesehenen Tag sind keine mehrtägige Nachholung. Ein späteres Deployment ändert diese Werkmetadaten nicht. Im MVP wird kein exakter Veröffentlichungszeitpunkt in unveränderlichen Werkdateien nachgetragen. Deployment-Erfolg und -Zeit bleiben im GitHub-Laufprotokoll nachvollziehbar.

Die JSON-Beispieldaten zeigen eine mögliche spätere Beispielkette; sie legen weder den tatsächlichen Serienstart noch den Standardmodusschalter neu fest.

### 8.3 Regeln für Archivdateien

- Pro vorgesehenem Berliner Seriendatum genau eine kanonische Werkdatei; mehrere nachgeholte Werke können denselben tatsächlichen Erstellungs- oder Deploymenttag haben.
- Dateien bereits publizierter Generationen werden im Normalbetrieb **nie überschrieben**.
- Der Index enthält die ID, Generation, den Titel und genug Daten für leichte Galerie-Navigation.
- Der Index wird **aus den Werkdateien rekonstruiert**, statt als separate Wahrheit behandelt zu werden.
- Alle Elternreferenzen müssen auf tatsächlich vorhandene Werke zeigen.
- Werkdaten werden vor Commit, Build und Anzeige anhand eines Schemas validiert.
- Bestehende Archive bleiben nutzbar, wenn neue Kompositionsfamilien hinzugefügt werden.
- Vorschau- und Testdaten liegen getrennt vom kanonischen Archiv, beispielsweise unter `fixtures/preview/`; sie dürfen weder den offiziellen Index noch die Generationsnummern oder Elternzuordnung beeinflussen.
- Ein fehlender Index kann aus validen Werkdateien rekonstruiert werden. Bereits archivierte, jetzt fehlende oder beschädigte Werkdateien werden dagegen aus Git wiederhergestellt, nicht neu generiert. Das gilt auch für gelöschte Dateien am Serienende: Vor einer Nachholung anhand der verfügbaren Git-Historie feststellen, ob das Werk bereits existierte. Der Workflow benötigt dafür die relevante vollständige Historie. Die wiederhergestellten Daten müssen exakt dem intakten gespeicherten Stand entsprechen.

### 8.4 Globale Generierungseinstellungen

Technischer Vorschlag für `config/generation.json`:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "seriesStartDate": null,
  "generationEnabled": false,
  "timezone": "Europe/Berlin",
  "inheritanceMode": "traceable"
}
```

- Bis zur Kunstabnahme bleiben Serienstart und offizielle Generierung deaktiviert. Die Freigabe und das Datum werden zum Livegang bewusst gesetzt; Testdeployments aktivieren die Serie nicht.
- Im MVP ist nur `inheritanceMode` über die Betreiberoberfläche veränderbar. Das Beispiel begründet keine zusätzlichen Schalter für Besucher oder frei editierbare Startdaten.
- Ein erfolgreich gespeicherter Wechsel wird dauerhaft in Git versioniert; `revision` wird erhöht. Die Oberfläche bestätigt erst nach erfolgreicher Speicherung und zeigt bei Konflikten einen nachvollziehbaren Fehler.
- Ein Generierungslauf übernimmt nach dem exklusiven Start einen frischen Stand der Konfiguration und friert dessen Modus/Revision für diesen Lauf ein. Eine währenddessen gespeicherte Änderung gilt für den folgenden noch nicht gestarteten Lauf.
- Ein Nachhollauf verwendet diesen Snapshot auch für seine mehreren fälligen Tageswerke. Frühere, zu jenen Daten nicht erzeugte Zustände werden nicht fiktiv rekonstruiert; die konkrete Revision steht im jeweiligen Werk.
- Historische Werkdetails lesen ihren Modus aus der Werkdatei und nicht aus der heutigen globalen Einstellung.
- Der Worker darf über fest definierte Endpunkte nur die erlaubte Konfiguration ändern; keine beliebigen Repositorypfade, Codeschnipsel oder Archivdateien aus Browser-Eingaben schreiben.

---

## 9. Technologiestack und Architektur

### 9.1 Entscheidung für V1

| Schicht | Wahl | Begründung |
|---|---|---|
| Sprache | **TypeScript** | Wartbarkeit, klare Datentypen für Kunst-DNA, gute Codex-Unterstützung |
| Frontend | **React** | Komponenten für Kunstwerk, Galerie und spätere Inhaltsbereiche |
| Build | **Vite** | Schlankes, schnelles statisches Build ohne Serverpflicht |
| Styling der Website | **Tailwind CSS** oder gut strukturierte CSS-Module | Mobile First, konsistente Oberfläche; Entscheidung beim Projekt-Setup |
| Styling der Kunst | **Eigenes CSS-/DOM-Rendering** | Technische und künstlerische Kernanforderung |
| Routing | **React Router im Hash-Modus** | Zuverlässige Direktlinks auf GitHub Pages |
| Datenvalidierung | **JSON Schema oder Zod** | Integrität der Archivdaten |
| Tests | **Vitest**, optional React Testing Library; gezielte Browserprüfungen z. B. mit Playwright | Generator-, Schema-, Zeitlogik-, Autorisierungs- und UI-Verhalten |
| Hosting | **GitHub Pages** | Kostenloser statischer Betrieb im öffentlichen Repository |
| Automatisierung | **GitHub Actions** | Täglicher Generierungs-, Commit-, Build- und Deploy-Prozess |
| Datenspeicherung | **JSON-Dateien + Git** | Werke und globale Einstellungen versioniert und transparent |
| Betreiberfunktion | **Cloudflare Workers Free** | Kleine geschützte Funktion für Anmeldung und Moduswechsel |
| Betreiberanmeldung | **GitHub** | Ein vorhandenes Betreiberkonto; keine Besucherregistrierung |

**Wichtige Abgrenzung:** Next.js und SQLite wurden früh als flexible Optionen betrachtet. Für die nun festgelegten Ziele – **frühes Testdeployment, möglichst kostenlos, kein eigener dauerhafter Server** – ist **React + Vite + versionierte JSON-Dateien** die passendere Startentscheidung. Eine spätere Migration auf eine servergestützte Plattform bleibt möglich.

### 9.2 Architekturprinzip

```text
                       GITHUB-REPOSITORY
           +--------------------------------------+
           |  TypeScript-Generator                |
           |  Archiv (JSON-Dateien)               |
           |  React/Vite-Frontend                 |
           +----------------+---------------------+
                            |
          GitHub Actions: 01:17 Europe/Berlin
                            |
                +-----------v-----------+
                | Letzte 2 Werke laden  |
                | -> DNA kombinieren    |
                | -> Titel erzeugen     |
                | -> validieren         |
                | -> JSON archivieren   |
                | -> committen          |
                | -> Build + Deploy     |
                +-----------+-----------+
                            |
                    GitHub Pages
                            |
                +-----------v-----------+
                | Öffentliche Website   |
                | Heute / Galerie /     |
                | Evolution / Details   |
                +-----------------------+
```

**Entkopplung:** Die Generatorbibliothek darf keinerlei React-Komponenten voraussetzen; sie nimmt validierte Eltern-DNA und einen Zufalls-Seed entgegen und gibt eine validierte Kind-DNA zurück. Das Frontend erhält nur archivierte Daten und stellt sie dar. So kann Evolvera später zusätzliche Kunstfamilien oder andere Websitebereiche aufnehmen.

### 9.3 Warum keine Datenbank in V1?

Die öffentliche Galerie braucht keine Besucherkonten und keine Interaktion mit einer Werkdatenbank. Ein **Werk pro Tag** bedeutet geringe Datenmengen, die sich als einzelne JSON-Dateien gut versionieren lassen. Auch die wenigen globalen Einstellungen können in Git gespeichert werden. Die geschützte Betreiberanmeldung ergänzt eine kleine serverseitige Funktion. Die Wahl einer kurzlebigen Sitzung ist getrennt von der Werkablage zu treffen; eine zusätzliche Werkdatenbank ist dafür nicht erforderlich.

### 9.4 GitHub Pages: Besonderheiten

- Die Website ist statisch. Die **tägliche Erzeugung passiert auf einem GitHub-Actions-Runner**, nicht in GitHub Pages und nicht im Browser.
- Bei einem Projekt-Repository muss Vite die passende `base`-URL verwenden (z. B. `/<repository-name>/`). Der Router und die Datenpfade müssen damit funktionieren.
- Bestätigte MVP-Entscheidung: spätestens zum ersten öffentlichen Testdeployment **öffentliches Repository auf GitHub Free**. Der beim Review noch private Status wird erst im passenden Einrichtungsschritt geändert, nicht automatisch beim lokalen Projektstart.
- Die Archivdateien sind öffentlich und über Git herunterladbar. Keine privaten Daten oder geheimen Tokens darin speichern.
- GitHub Pages ist für eine kleine öffentliche Kunstgalerie passend; Limits für Sitegröße und Bandbreite müssen bei Wachstum geprüft werden.

---

### 9.5 Geschützte Einstellungen mit Cloudflare Workers

GitHub Pages bleibt die statische öffentliche Galerie. Cloudflare Workers übernimmt ausschließlich die kleine Betreiberfunktion: GitHub-Anmeldung, Identitätsprüfung, aktuelle Konfiguration lesen und Moduswechsel sicher speichern. Ein Ausfall dieser Betreiberfunktion darf die bestehende Galerie und die Generierung mit der zuletzt gültigen gespeicherten Konfiguration nicht blockieren.

**Verbindliche Anforderungen:**

- Nur das Betreiberkonto darf speichern. Die Anmeldung identifiziert dieses Konto serverseitig; eine erfolgreiche GitHub-Anmeldung allein genügt nicht zur Freigabe beliebiger GitHub-Nutzer. Die stabile numerische GitHub-Konto-ID wird bei Einrichtung verifiziert und als erlaubte Identität hinterlegt; `bummber` ist der beim Review bekannte Repositoryinhaber.
- Keine zusätzliche Evolvera-Passwortverwaltung. Der öffentliche Galeriebesuch bleibt ohne Login möglich.
- GitHub-Zugriff und geheime App-Schlüssel bleiben serverseitig in geschützten Secrets; sie erscheinen weder in `VITE_*`-Variablen noch im Browser-Bundle, `localStorage`, Archiv oder Repository.
- GitHub-Anmeldung, Callback, Sitzung und Schreibzugriff brauchen Identitätsprüfung, Zustandsbindung gegen gefälschte Anmeldeantworten, sichere Ablaufzeiten und Schutz vor fremden Schreibanfragen. Abmelden muss die aktive Sitzung beenden; Tokens dürfen nicht in Logs oder URL-Parametern nach der Rückkehr verbleiben.
- Galerie und Worker können auf unterschiedlichen Anbieterdomains laufen. Die Lösung muss auch bei blockierten Drittanbieter-Cookies funktionieren. Als einfache MVP-Variante kann die Navigation die kleine Einstellungsoberfläche am Worker selbst öffnen; Anmeldung, Sitzung und Speichern bleiben dann dort in derselben Origin. Eine kostenpflichtige eigene Domain ist keine Voraussetzung. Einen anderen Ansatz vor Umsetzung dokumentieren und in unterstützten Browsern prüfen.
- Nach erfolgreicher Speicherung zeigt die Oberfläche den gespeicherten Modus sowie den Hinweis „Ab dem nächsten Generierungslauf“. Ohne erfolgreiche Antwort kein vorgetäuschtes Speichern.

**Technischer Vorschlag, in Phase 0 zu dokumentieren und vor Auth-Implementierung zu prüfen:** Eine auf `bummber/evolvera` beschränkte GitHub App kombiniert die GitHub-Betreiberanmeldung mit eng begrenztem Repositoryzugriff. Nur benötigte Berechtigungen anfordern; keine pauschalen Rechte auf alle Repositories. Der Worker ändert ausschließlich die Moduskonfiguration. Konflikte mit gleichzeitig laufenden Generator-Commits werden über einen frischen Stand und bedingtes Schreiben erkannt; niemals fremde Änderungen überschreiben.

**Betriebsgrenzen:** Kostenloser Workers-Tarif ist das Ziel, keine unbegrenzte Zusage. Aktuelle Requests-, CPU- und gegebenenfalls Sitzungsspeicher-Limits vor Livegang prüfen. Kein automatischer Wechsel in einen kostenpflichtigen Tarif. Cloudflare-Konto, GitHub-App-Registrierung und Secrets erst beim entsprechenden Umsetzungsschritt einrichten. Keine Secrets im Chat anfordern.

---

## 10. Tägliche Automatisierung und Zeitlogik

### 10.1 Zeitliche Definition

- **Gewünschter Zeitpunkt:** Täglich um **01:17 Uhr Europe/Berlin** (CET/CEST automatisch berücksichtigt).
- Ein neuer Tageszyklus beginnt um 01:17 Uhr und endet unmittelbar vor 01:17 Uhr des Folgetags. Kalenderarithmetik erfolgt in `Europe/Berlin`, nicht durch pauschales Addieren oder Subtrahieren von 24 Stunden.
- `seriesStartDate` wird zum Livegang festgelegt. Vor Kunstabnahme und Aktivierung werden keine offiziellen Tageswerke erzeugt. Ab Startdatum gibt es genau einen fälligen Datumsschlüssel pro Serientag; Generation 2 folgt am nächsten Berliner Kalendertag, nicht im selben Startlauf für ein zukünftiges Datum.
- Der Datumsschlüssel eines Kunstwerks ist das **Berliner Kalenderdatum des vorgesehenen Tages**, nicht das UTC-Datum des Runners.
- Vor 01:17 Uhr bleibt das zuletzt veröffentlichte Werk aktuell; das neue Werk darf **nicht vorzeitig** erscheinen.
- Ein neuer Titel, neue DNA und Elternzuordnung werden **einmalig** für den Tag festgelegt.
- Bei verspätetem Erscheinen nennt die Startseite das tatsächliche aktuelle Werkdatum und „Zuletzt veröffentlicht“, statt ein älteres Werk fälschlich als heute erzeugt zu bezeichnen. Vor Serienstart erscheint ein verständlicher Hinweis; nachgeholte Werke sind in den Details als solche gekennzeichnet.

### 10.2 GitHub-Actions-Zeitplan

Die aktuelle GitHub-Actions-Syntax unterstützt IANA-Zeitzonen. Konzeptionelles YAML-Beispiel:

```yaml
on:
  schedule:
    - cron: '17 1 * * *'
      timezone: 'Europe/Berlin'
    - cron: '47 1 * * *'   # kontrollierter Nachholversuch
      timezone: 'Europe/Berlin'
    - cron: '23 2 * * *'   # weiterer Nachholversuch
      timezone: 'Europe/Berlin'
  workflow_dispatch:
```

**Verfügbarkeitsvorbehalt:** GitHub Actions arbeitet mit **best effort**. Geplante Runs können verspätet starten oder in Ausnahmesituationen entfallen. Der Trigger ist auf 01:17 Uhr gestellt, doch sekundengenaue Veröffentlichung um 01:17 Uhr kann mit GitHub Pages/Actions nicht garantiert werden. Eine spätere Hosting-/Scheduler-Alternative wäre nötig, falls eine harte Uhrzeitgarantie zum Produktziel wird.

### 10.3 Verarbeitungsablauf

1. Workflow startet automatisch oder manuell und erhält den gemeinsamen exklusiven Generator-/Publish-Bereich.
2. Einen frischen Repositorystand laden, Einstellungen validieren und Modus/Revision für diesen Lauf einfrieren. Bei deaktivierter offizieller Generierung keine neuen Werke erzeugen; ein Testdeployment der leeren Galerie bleibt möglich.
3. Zeitzone `Europe/Berlin` auswerten. Nur bereits fällige Werkdaten ab Serienstart berücksichtigen; das heutige Werk vor 01:17 Uhr nicht vorziehen. Bereits fällige ältere Tage können auch vor 01:17 Uhr nachgeholt werden.
4. Archiv vollständig validieren und für fehlende Dateien prüfen, ob sie bereits in Git archiviert waren. Bei historischen Lücken, beschädigten Daten oder unerwarteten Elternbeziehungen zunächst Wiederherstellung aus Git versuchen; gelingt das nicht sicher, Lauf beenden. Nur noch nie archivierte fällige Tage sind Nachholbedarf; gelöschte historische Dateien am Serienende sind Archivschäden.
5. Fällige fehlende Tage chronologisch erzeugen: Generationen 1 und 2 unabhängig; danach bei jedem Werk die zwei unmittelbar vorhergehenden Generationen als Eltern verwenden. Den eingefrorenen Modus beachten.
6. Bereits vorhandene kanonische Werkdateien unverändert lassen (Idempotenz). Historische Daten nicht aus heutigen Regeln neu erzeugen.
7. Neue Dateien und Index zunächst vorbereiten, alle Schemas, Abstammung, Modusbeiträge und relevante Tests prüfen. Erst einen vollständig validen Stand archivieren. Eine fehlgeschlagene Vorbereitung darf keinen halben Nachholstand committen.
8. Vor dem Schreiben eventuelle parallele Konfigurations-/Codeänderungen erkennen. Mit frischem Stand einmal kontrolliert erneut prüfen; keine erzwungenen Pushes. Hat die Generierung bereits begonnen, bleibt ihr Einstellungssnapshot erhalten.
9. Valide neue Werkdateien, gegebenenfalls exakt wiederhergestellte historische Dateien und Index mit gezielten `contents: write`-Rechten committen und pushen. Unbeteiligte Dateien nicht in den automatischen Commit aufnehmen.
10. **Im selben Workflow** genau den validierten Stand bauen und mit passenden `pages: write`- und `id-token: write`-Rechten über GitHub Pages bereitstellen. Ein fehlgeschlagener Deploy wird später mit den bereits archivierten Werken wiederholt; keine Neuauswürfelung.
11. Ergebnis protokollieren; bei Fehlern keinen defekten Stand publizieren. Die letzte funktionierende Website bleibt bestehen.

### 10.4 GitHub-spezifischer Stolperstein

**Ein von `GITHUB_TOKEN` ausgelöster Commit startet normalerweise keinen neuen `push`-Workflow und keinen GitHub-Pages-Build.** Deshalb muss der tägliche Workflow **selbst bauen und deployen**, nachdem die neuen JSON-Dateien erzeugt wurden. Ein separater Push-Workflow darf nicht die einzige Publishing-Stufe für tägliche Generierungen sein. Für normale Codeänderungen kann derselbe Publish-Workflow zusätzlich auf Pushes in `main` reagieren.

### 10.5 Race Conditions und Sicherheit

- Ein gemeinsamer GitHub-Actions-`concurrency`-Bereich verhindert parallele Generator-/Publish-Läufe, die sich gegenseitig überschreiben. Ein neuer Lauf darf einen laufenden Schreib-/Veröffentlichungsvorgang nicht abbrechen (`cancel-in-progress: false`).
- Ein wartender Lauf darf keinen veralteten Checkout veröffentlichen. Nach Erhalt des exklusiven Bereichs frischen Zielbranch laden; vor Veröffentlichung auf inzwischen neuere Stände prüfen. Die Sperre serialisiert Workflows, verhindert aber keine gleichzeitigen Konfigurations-Commits über den Worker; diese separat konfliktfest behandeln.
- Zwei gleichzeitige Starts dürfen nicht zwei Werke für dasselbe Datum erzeugen.
- Commit- und Push-Konflikte werden erkannt; nach einem frischen Checkout kann einmal kontrolliert erneut geprüft werden.
- Nach einem Fehler im Deployment bleibt die archivierte Generierung intakt und die Veröffentlichung ist erneut ausführbar.
- Manuelle Läufe dürfen bestehende Werke nicht stillschweigend neu auswürfeln.
- Für gezielte lokale Testdaten sind ausdrücklich markierte **Preview-/Dry-Run-Optionen** vorgesehen.
- Falls am Ende der intakten Serie mehrere noch nie archivierte Tage fehlen, werden **alle fälligen Tage in der richtigen Reihenfolge nachgeholt**, anstatt die Abstammungskette zu unterbrechen. Bereits archivierte, jetzt fehlende Dateien erfordern Wiederherstellung statt Neugenerierung, auch am Serienende.

### 10.6 Betriebshinweise

GitHub dokumentiert, dass geplante Workflows in öffentlichen Repositories nach **60 Tagen ohne Repositoryaktivität** deaktiviert werden können. Die tägliche Generierung führt normalerweise zu Aktivität; der Status muss dennoch gelegentlich kontrolliert werden. Idealerweise gibt es eine kurze Betriebsanleitung („Letzten Workflow öffnen“, „Manuell starten“, „Fehlerlogs lesen“, „letzten Deploymentstand prüfen“).

---

## 11. Nichtfunktionale Anforderungen

### 11.1 Performance

- Erste Hauptansicht auf einem üblichen Smartphone soll sich auch bei durchschnittlichem Mobilfunk flüssig bedienen lassen.
- Kunstwerk mit begrenzter Zahl an DOM-Elementen (Startziel: **maximal etwa 120 aktive Kunst-Elemente** pro Hauptansicht; später per Profiling anpassen).
- Galerie rendert nicht ungebremst Hunderte animierte Werke gleichzeitig.
- Vermeidung großflächiger animierter Blur-/Filtereffekte auf schwächerer Hardware.
- Archivindex bleibt schlank; alte Werke werden bei Bedarf geladen.

### 11.2 Zugänglichkeit

- Tastaturbedienbare Links, Buttons und sichtbarer Fokus.
- `prefers-reduced-motion` respektieren; Pause-Funktion leicht auffindbar.
- Dekorative Formelemente sind für Screenreader verborgen; für das Gesamtkunstwerk gibt es einen knappen beschreibenden Text (Titel, Stil, Hauptfarben, Bewegung).
- Lesbare Navigation mit ausreichendem Kontrast unabhängig von der zufälligen Kunstpalette.
- Ausreichende Touch-Flächen; kein Bedienzwang durch Hover.

### 11.3 Qualität, Sicherheit und Datenschutz

- Kein Besuchertracking. Die öffentliche Galerie funktioniert ohne Anmeldung; die geschützte Betreiberfunktion darf erforderliche sichere Sitzungscookies nutzen. GitHub-Kennung und Sitzung werden nur für Betreiberzugang und Autorisierung verarbeitet. Hostinganbieter können unabhängig technische Zugriffslogs verarbeiten.
- Keine fremden ausführbaren Codeschnipsel oder vom Titelgenerator erzeugtes HTML als HTML interpretieren.
- Generierte CSS-Eigenschaften nur aus validierten, erlaubten Werten zusammensetzen; keine freien CSS-URLs oder externe Ressourcen.
- Abhängigkeiten mit Lockfile pinnen, GitHub-Actions-Berechtigungen möglichst gering halten und keine Secrets in Archivdateien ablegen.
- Keine sensiblen Daten in Git-Commits.
- Rechtliche Angaben (insbesondere Impressum/Datenschutz) vor öffentlicher Veröffentlichung prüfen; dabei GitHub, Cloudflare und die Betreiberanmeldung berücksichtigen. Dieses PRD ersetzt keine Prüfung des konkreten Betriebs.

### 11.4 Erweiterbarkeit

- Kunstgenerator, Titelgenerator, Archivspeicher, Rendering, Routing und UI klar trennen.
- Neue Kunstfamilien als zusätzliche Module einführbar.
- Neue Seiten/Contentbereiche ohne grundlegenden Wechsel des Frameworks möglich.
- Datenmigration oder Hostingwechsel bleibt möglich, weil Archivdateien standardisiert und exportierbar sind.

---

## 12. Akzeptanzkriterien (Definition of Done)

| Test-ID | Erwartetes Ergebnis |
|---|---|
| A-01 | `npm install` und `npm run dev` starten eine lokal nutzbare Website gemäß README. |
| A-02 | Ohne Serienfreigabe entstehen keine offiziellen Werke. Nach Freigabe entsteht Gen. 1 am Startdatum, Gen. 2 frühestens am nächsten Berliner Serientag unabhängig davon; beide haben keine Eltern. |
| A-03 | Generation 3 hat genau Gen. 1 und Gen. 2 als Eltern, Gen. 4 genau Gen. 2 und 3 usw. |
| A-04 | Derselbe Seed, identische Eltern, derselbe Einstellungssnapshot und identische Generator-/Lexikonversion liefern wieder dieselbe DNA und denselben Titel; die reale Uhr beeinflusst diese Inhalte nicht. |
| A-05 | Erneutes Generieren eines vorhandenen Datums ändert weder Archivdatei noch Generationenzahl. |
| A-06 | Ein und mehrere am Serienende übersprungene Tage werden chronologisch nachgeholt; tatsächliche Erstellungszeit und Kennzeichnung sind korrekt, Elternreferenzen bleiben lückenlos. |
| A-07 | Der Stichtag wird gemäß `Europe/Berlin` verarbeitet; Tests decken Winter-/Sommerzeitumstellung ab. |
| A-08 | Beim ersten Aufruf nach dem Deployment ist das neue Tageswerk ohne manuelle Aktion sichtbar. |
| A-09 | Kunstwerk verwendet keine `<img>`-, `<svg>`-, `<canvas>`-Elemente und lädt keine Bild-Assets. |
| A-10 | Alte Werke behalten Komposition, Farben, Bewegungsregeln und Ruhezustand nach Generator-/Websiteupdates. Referenzbrowserprüfungen berücksichtigen definierte Toleranzen. |
| A-11 | Galerie zeigt alle Werke chronologisch; Werkdetail, vorhandene Elternlinks und bis zu zwei tatsächliche Nachfolgerlinks funktionieren, einschließlich der Sonderfälle für Gen. 1 und 2. |
| A-12 | `prefers-reduced-motion` stoppt anfängliche Bewegungen; Pause-/Play-Schalter funktioniert. |
| A-13 | Die App ist auf Smartphonebreiten ab ca. 320 CSS-Pixel bedienbar, ohne horizontales Layout-Overflow. |
| A-14 | Generierter Titel wird fest gespeichert und verändert sich bei Reload nicht. |
| A-15 | Build/Test/Archivprüfung schlagen bei ungültigen oder verwaisten Werkdaten nachvollziehbar fehl. |
| A-16 | Ein geplanter GitHub-Actions-Lauf kann archivieren **und im selben Workflow deployen**. |
| A-17 | Dokumentation enthält Setup, Live-URL-Konfiguration, manuelle Generierung, Fehlerbehebung, Archivwiederherstellung, Betreiberanmeldung und Deployment. |
| A-18 | Standard ist `traceable`. Ab Gen. 3 sind in diesem Modus sichtbare gestalterische Beiträge beider Eltern in Daten belegt und anhand repräsentativer Werke geprüft. Im Modus `free` sind vollständige Neuschöpfungen erlaubt; Qualitätsgrenzen gelten weiter. |
| A-19 | Nur die konfigurierte GitHub-Betreiberidentität darf Einstellungen ändern. Nicht angemeldete und andere GitHub-Konten können keine Änderungen speichern, auch nicht durch direkte API-Aufrufe. |
| A-20 | Ein gespeicherter Modus bleibt über Browser-/Sitzungswechsel aktiv. Der nächste noch nicht gestartete Lauf nutzt ihn; ein bereits laufender Lauf behält seinen Snapshot. Modus/Revision sind im Werk archiviert. |
| A-21 | Fehlgeschlagenes oder kollidierendes Speichern zeigt einen Fehler und überschreibt keine fremden Änderungen. Moduswechsel verändert weder alte Werke noch Serienstart oder Archiv. |
| A-22 | Galerie-, Eltern- und Nachfolgerkacheln sind reproduzierbar statisch und sichtbar; Animation läuft ausschließlich im geöffneten Hauptwerk gemäß Wiedergabepräferenz. |
| A-23 | Beschädigte oder gelöschte historische Daten werden exakt aus Git wiederhergestellt, auch am Serienende. Ist das nicht sicher möglich, stoppt die Generierung ohne Neuauswürfelung und die letzte funktionierende Website bleibt bestehen. |
| A-24 | Vor offizieller Serienfreigabe liegen 30–50 getrennte Testwerke mit Beispielketten beider Modi und ausdrückliche Kunstabnahme durch den Betreiber vor. |
| A-25 | „Über Evolvera“ gehört zum Release; „Einstellungen“ ist über die Navigation erreichbar. Anmeldung und Speichern funktionieren auch bei blockierten Drittanbieter-Cookies; Abmelden beendet die Sitzung. |
| A-26 | Browserprüfung unter der Projektbasis `/evolvera/` deckt Direktlinks, JSON-Datenpfade, mobile Bedienung, Fehl-/Leerzustände sowie verzögertes Tageswerk mit wahrheitsgetreuem Datum ab. |
| A-27 | Tests decken parallele Läufe, veraltete Checkouts, Konfigurationswechsel während eines Laufs und erneutes Deployment bereits archivierter Werke nach einem Deployfehler ab. |

**Wichtig:** Für V1 ist eine gute, reproduzierbare technische Umsetzung wichtiger als die subjektive Bewertung einzelner Kunstwerke. Trotzdem muss eine Mindestprüfung die Erzeugung kaputter oder vollständig leerer Kompositionen verhindern.

---

## 13. Umsetzung in Phasen

### Phase 0 – Projektinitialisierung und Architektur

**Ziel:** Lokal lauffähiges Grundgerüst, sichere Verbindung zum vorhandenen Repository, CI, typisierte Datenschemata und dokumentierte Architektur der Betreiberfunktion.

**Ergebnisse:** Vite/React/TypeScript-Projekt, mobile-first Shell mit Heute, Galerie, Evolution, Über Evolvera und Einstellungen; Hash-Routing; Schema für Werke, Herkunftsbelege und Konfiguration; Formatierung/Linting; Testsetup; verständliche README. Offizieller Serienstart bleibt deaktiviert. Architekturentscheidung für GitHub-Anmeldung, Worker, Session, Repositoryschreiben und Ausführungs-Snapshot dokumentieren. Noch keine vollständige Kunst- oder Anmeldefunktion; unfertige Bedienung ehrlich kennzeichnen.

**Abnahme lokal:** Installation, Devserver, Build, Lint, Typprüfung und erste sinnvolle Schema-/Routingprüfungen laufen. Projektbasis `/evolvera/` und spätere Deploymentstruktur sind berücksichtigt.

**Anschließender Einrichtungsschritt:** Öffentliches GitHub-Pages-Testdeployment einer klar als Vorschau erkennbaren Shell; spätestens dafür Repository öffentlich schalten. Das startet noch keine offizielle Kunstserie. Echte GitHub-/Cloudflare-Einrichtung und Veröffentlichung als konkrete Schritte ausweisen; eine nur vorbereitete Konfiguration nicht als erfolgreiches Deployment melden.

### Phase 1 – Kunst-DNA und Renderer

**Ziel:** Unterschiedliche CSS-/DOM-Kunstwerke lokal erzeugen und zuverlässig darstellen.

**Ergebnisse:** PRNG, Form-/Farb-/Animationsmodelle, mindestens drei klar unterscheidbare Kompositionsfamilien, validierter skalierender Renderer mit festem Ruhezustand und getrennte Vorschau.

**Abnahme:** Unterschiedliche Seeds führen zu unterschiedlichen validen Werken; keine Bildassets in der Kunst; mobile Sichtbarkeit und Lastgrenzen geprüft.

### Phase 2 – Evolution, Modi und poetische Titel

**Ziel:** Unabhängige Ursprungswerke, danach Kindwerke nach den Regeln beider Modi erzeugen.

**Ergebnisse:** Kombinations-/Mutationslogik, belegte Beiträge beider Eltern im nachvollziehbaren Modus, freie Neuschöpfung im freien Modus, Titelgenerator, versionierte Herkunftsmetadaten und deterministische Tests.

**Abnahme:** Je Modus eine reproduzierbare Beispielkette mit mindestens 10 Werken; ergänzende Mehrgenerationstests prüfen etwa 365 aufeinanderfolgende Testtage auf Schema, Nummern und Elternintegrität. Keine offiziellen Daten erzeugen.

### Phase 3 – Galerie, Evolution und Kunstabnahme

**Ziel:** Besuchende können die Entwicklung erkunden; der Betreiber prüft die künstlerische Bandbreite vor Serienstart.

**Ergebnisse:** Tagesseite, Archiv mit Pagination, Werkdetail, Eltern-/Nachfolgernavigation, Modusdarstellung, Animation-Pause, Über-Seite und mobile Gestaltung. Insgesamt 30–50 separate Testwerke inklusive Beispielketten aus beiden Modi zur gemeinsamen Durchsicht; sowohl Vielfalt und erkennbare Beiträge als auch freie Stilbrüche prüfen.

**Abnahme:** Smartphone-/Desktop-Durchsicht und ausdrückliche Kunstabnahme durch den Betreiber dokumentiert. Vorschauwerke werden nicht in die offizielle Serie übernommen. Die Freigabe gilt den Generatorregeln und der Bandbreite, nicht einer täglichen menschlichen Kuratierung.

### Phase 4 – Betreiberfunktion, Automatisierung und Serienstart

**Ziel:** Geschützte globale Moduswahl und autonome tägliche Generierung.

**Ergebnisse:** Cloudflare-Worker-Funktion, GitHub-Anmeldung nur für den Betreiber, dauerhaft gespeicherter Modus, geschützte Sitzung und konfliktfeste Konfigurationsänderung; geplante GitHub-Actions-Läufe um 01:17 Europe/Berlin mit Nachholversuchen; Archivierung, Build, Deploy und Runbook.

**Abnahme vor Serienstart:** Autorisierung, Moduswechsel und Generierungs-Snapshot mit Testdaten geprüft; Cookies/Callback ohne Drittanbieter-Cookie-Abhängigkeit getestet. Erst nach Kunstabnahme konkretes Startdatum bestimmen und offizielle Generierung aktivieren.

**Abnahme nach Aktivierung:** Erster geplanter Lauf in GitHub Actions nachweislich erfolgreich; erneuter manueller Lauf ohne Duplikat; ein gespeicherter Moduswechsel beeinflusst einen folgenden Lauf und dessen Werkmetadaten.

### Phase 5 – Stabilisierung

**Ziel:** Qualität für langfristigen Betrieb sichern.

**Ergebnisse:** Geprüfte DST-, Konflikt-, Wiederherstellungs- und Rendererfälle; Performance-Profiling; Fehler-/Leerzustände; letzte UI-Verfeinerungen und vollständige Betriebsanleitung. Diese Prüfungen begleiten die vorigen Phasen und werden hier abschließend zusammengeführt.

**Abnahme:** MVP-Akzeptanzliste A-01 bis A-27 erfüllt. Nicht ausgeführte Prüfungen und externe Einrichtungsschritte bleiben als offen gekennzeichnet.

---

## 14. Produkt- und Technikrisiken

| Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|
| GitHub Actions läuft verspätet oder fällt aus | Tageswerk erscheint nicht genau 01:17 | Nachholtrigger, Idempotenz, Monitoring, klare Best-effort-Definition |
| GitHub-Actions-Commit triggert kein weiteres Publish | Archiv aktualisiert, Website veraltet | Generieren, Commit, Build und Pages-Deploy im selben Workflow |
| Zufällige Werke werden zu ähnlich oder unbrauchbar | Galerie verliert Reiz | Qualitätsleitplanken, diversifizierte Operatoren, visuelle Tests, kein fixiertes Mischverhältnis |
| Alte Werke verändern sich nach Renderer-Update | Geschichtliche Integrität leidet | Versioniertes Schema/Rendering, Migrationsstrategie, Snapshot-Tests |
| Große Galerie belastet Smartphones | Träge Oberfläche, hoher Akkuverbrauch | Statische Vorschauen, Pagination, DOM-/Animationsbudget |
| Repository wird sehr groß | Build/Deploy dauert länger | Pro Tag nur kleine JSON-Dateien; Größe überwachen und spätere Auslagerung ermöglichen |
| Styling ist auf Desktop gut, mobil schlecht | Zielgruppe kann Kunst nicht genießen | 1:1 normierte Kunstfläche, mobile-first, Responsive-Tests |
| Public Repo veröffentlicht Informationen ungewollt | Sicherheits-/Datenschutzprobleme | Nur öffentliche Werkdaten, keine Secrets, sichere Workflow-Rechte |
| Stille Zeitumstellungsfehler | Falsche Daten/Generationen | Ausschließlich `Europe/Berlin` als Tageslogik, Tests für CET/CEST |
| Unzureichend geschützte Einstellungen | Fremde ändern den offiziellen Modus | Serverprüfung der festen Betreiber-ID, sichere Sitzung, erlaubte Endpunkte und Konflikterkennung |
| Anmeldung setzt Drittanbieter-Cookies voraus | Betreiber kann Einstellungen nicht speichern | Einstellungsoberfläche und Anmeldung in derselben Worker-Origin oder anderweitig getestetes Konzept |
| Worker-Ausfall oder Tariflimit | Moduswechsel vorübergehend unmöglich | Galerie und Tagesgenerator unabhängig halten; zuletzt gültige Git-Konfiguration weiter nutzen |
| Historische Daten werden neu generiert | Abstammung oder ursprüngliche Kunst geht verloren | Exakte Wiederherstellung aus Git, bei Unsicherheit anhalten |
| Testdaten starten versehentlich die Serie | Falscher Serienbeginn / Archiv | Getrennte Preview-Daten, Startdatum und explizite Serienaktivierung erst nach Abnahme |

---

## 15. Messgrößen für den Projektstart

Für die erste Phase keine aufwendige Besucheranalyse. Relevanter sind **technische Qualitätsindikatoren**:

- Anteil planmäßig erzeugter Tageswerke.
- Anzahl fehlgeschlagener Generierungs- oder Deployment-Läufe.
- Anzahl fehlender oder doppelt belegter Datums-IDs: **Ziel 0**.
- Anzahl ungültiger Archivdateien: **Ziel 0**.
- Performance der Tagesseite und Galerie auf Mobilgeräten.
- Anteil funktionierender historischer Werke nach Renderer-Updates: **Ziel 100 %**.

Besucherzahlen oder Verweildauer können später datenschutzfreundlich und nur bei tatsächlichem Bedarf ergänzt werden.

---

## 16. Erweiterungsmöglichkeiten (später, nicht V1)

- **Weitere Seitenbereiche:** Texte, Geschichten über generative Kunst, andere Experimente, redaktionelle Inhalte.
- **Zusätzliche Medien:** Ein separater Navigationspunkt für fotografische, KI-generierte oder andere Kunstformen – ausdrücklich getrennt vom CSS-Kernprinzip.
- **Evolutionsbaum oder Zeitreise:** Visuelle Linien zwischen Generationen, Animation der Entwicklung.
- **Kunstwerk-Export:** Eigenständige `.html`/`.css`-Datei oder auf Wunsch ein Bildexport als sekundäres Format.
- **Künstlerische Ereignisse:** Seltene „Mutationssprünge“, zufällige Phasen oder Themenperioden.
- **Titel-Labor:** Sprachfamilien, erfundene Lexika, stärkere Vererbung früherer Titel.
- **Künstlerischer Modus:** Besucher können Parameter experimentell verändern, **ohne** das offizielle Tagesarchiv zu überschreiben.
- **Inhaltsplattform:** Austausch der Datenspeicherung oder Ergänzung um Backend/CMS, sobald echte redaktionelle Anforderungen bestehen.
- **Alternative Hostingplattform:** Bei Bedarf Wechsel zu einem Anbieter mit zuverlässigerem zeitgesteuertem Backend.

---

## 17. Offene Detailentscheidungen und Einrichtung

### 17.1 Umsetzungsspielraum

Die folgenden technischen und gestalterischen Details darf Codex im Rahmen dieser Anforderungen begründet wählen:

1. Exakte Farb-/Formalgorithmen und Start-Kompositionsfamilien.
2. Lexika und Regeln für abwechslungsreiche Fantasietitel.
3. Detaildesign, Typografie, Logo und Markenfarben; ruhiges dunkles oder neutrales Grunddesign als Ausgangspunkt.
4. Tailwind CSS oder CSS-Module, Schema-Werkzeug und konkrete Testwerkzeuge.
5. Grenzen für Formen, Dichte und Animation nach Profiling; Ausgangsziel maximal etwa 120 aktive Kunstelemente in der Hauptansicht.
6. Versionsfähige Renderer und Referenzbrowserprüfungen gemäß den verbindlichen Erhaltungsregeln.
7. Konkrete sichere GitHub-App-/Sitzungsimplementierung, bedingte GitHub-Konfigurationsschreibvorgänge und Verknüpfung zwischen Galerie und Worker. Vor Auth-Implementierung dokumentieren und aktuelle Anbieterregeln prüfen; reine Browser-Demo nicht als echte Betreiberfunktion ausgeben.

### 17.2 Später benötigte Betreiberangaben und Schritte

- Genaues Serienstartdatum nach Kunstabnahme festlegen.
- Cloudflare-Konto bereitstellen; Worker und erforderliche Secrets einrichten.
- GitHub App einrichten, auf das Projekt begrenzen, Betreiber-ID verifizieren und Callback-URLs konfigurieren.
- Öffentliches Repository, Pages-Veröffentlichungsquelle und passende Actions-Rechte zum Testdeployment herstellen.
- Rechtliche Betreiberangaben vor öffentlicher Veröffentlichung klären.

Diese Schritte blockieren den lokalen Start von Phase 0 nicht. Es sind keine bereits vorhandenen Zugangsdaten oder eingerichteten Integrationen zu unterstellen.

**Bereits entschieden:** Evolvera als Arbeitstitel, mobile first, kostenloser Betrieb als Ziel, HTML-/CSS-Kunst, zwei Ursprungswerke an zwei Tagen, anschließend zwei unmittelbare Eltern, beide Vererbungsmodi mit nachvollziehbarem Standard, geschützte GitHub-Betreiberanmeldung unter Einstellungen, Cloudflare Workers als Ergänzung, täglicher Termin 01:17 Europe/Berlin, ehrliche Nachholung, dauerhaftes Archiv, stabile historische Gestaltung, statische Galerie, Evolution, Über-Seite, Animationen, Fantasietitel und Kunstabnahme mit 30–50 Testwerken vor Serienstart.

---

## 18. Codex-Handoff: Empfohlener Start

### 18.1 Vorbereitung und vorhandenes Repository

1. In Codex den bestehenden Ordner `/Users/abrocker/ai_o_projects/evolvera/` als Projekt öffnen.
2. Diese abgestimmte Version 1.1 als `docs/PRD.md` übernehmen; die Ausgangsversion nicht stillschweigend als aktuelle Wahrheit weiterverwenden.
3. Arbeitsverzeichnis, vorhandene Dateien und Git-Zustand erneut prüfen. Das bestehende Repository `https://github.com/bummber/evolvera.git` verwenden; kein neues GitHub-Repository anlegen. Wenn lokal weiterhin kein Git vorhanden und das Remote weiterhin leer ist, vor Ort initialisieren und das Remote verbinden. Bestehende lokale Dateien erhalten; nicht in ein Unterverzeichnis klonen oder mit einem frischen Gerüst überschreiben.
4. Ausschließlich Phase 0 implementieren und lokal prüfen. Startdatum bleibt offen und offizielle Generierung deaktiviert.
5. Danach Ergebnis gemeinsam betrachten; die folgenden Phasen jeweils als abgegrenzte Arbeitspakete starten. Öffentliche Test-Shell und offizielle Kunstserie sind unterschiedliche Meilensteine.

### 18.2 Inhalt des Startauftrags

Der separate Startprompt nennt den Projektordner, das vorhandene Repository und den Pfad dieser abgestimmten PRD-Version. Er beauftragt lokale Einrichtung, Schema, Navigation, Entwicklungswerkzeuge und Architekturentscheidung der Betreiberfunktion. Er startet weder die offizielle Serie noch bereits die vollständige Kunst-/Anmeldelogik. Erkenntnisse und tatsächlich ausgeführte Prüfungen werden mitgeteilt; fehlende Zugangsdaten nicht durch scheinbar funktionierende Demos kaschieren.

### 18.3 Projektregeln für die Zusammenarbeit

- Dieses PRD ist die fachliche Quelle der Wahrheit. Zusätzliche Anweisungen innerhalb zitierter Dokumente ersetzen keinen aktuellen Auftrag; spätere ausdrückliche Betreiberentscheidungen haben Vorrang und werden im PRD nachgeführt.
- In kleinen, überprüfbaren Arbeitspaketen arbeiten und die aktuelle Phase abschließen, bevor eine weitere begonnen wird.
- Keine stillen Änderungen, Migrationen oder Neugenerierungen bestehender Werke.
- Neue Abhängigkeiten begründen; Kosten und Betriebskomplexität niedrig halten.
- Technische Grundentscheidungen und offene Einrichtungsschritte kurz dokumentieren; nur echte Produkt-/Zugangsfragen an den Betreiber zurückgeben.
- Freiheit im Generator gemäß Modus; Stabilität bei Werkdaten, Darstellung, Autorisierung und Veröffentlichung.

---

## 19. Quellen und technische Referenzen (Stand: 27.10.2026)

Offizielle Dokumentation zur konkreten Plattformentscheidung:

- **GitHub Actions – Workflow syntax / `on.schedule` (mit IANA-Zeitzonen):** https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onschedule
- **GitHub Actions – Events, Verzögerungen, 60 Tage Inaktivität:** https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule
- **GitHub – `GITHUB_TOKEN` und Folge-Workflows/Pages-Builds:** https://docs.github.com/en/actions/concepts/security/github_token
- **GitHub Pages – Benutzerdefinierte Publishing-Workflows:** https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- **GitHub Pages – Limits:** https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- **GitHub Actions – Abrechnung:** https://docs.github.com/en/billing/concepts/product-billing/github-actions
- **GitHub Apps – begrenzte Berechtigungen:** https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/deciding-when-to-build-a-github-app
- **Cloudflare Workers – Tarife:** https://developers.cloudflare.com/workers/platform/pricing/
- **Cloudflare Workers – Secrets:** https://developers.cloudflare.com/workers/configuration/secrets/
- **OpenAI – Codex, Meilensteine und Validierung:** https://developers.openai.com/blog/run-long-horizon-tasks-with-codex

**Einordnung:** Die Verwendung eines Workers für die Betreiberfunktion und einer GitHub App mit begrenzten Rechten ist ein aus diesen Plattformfähigkeiten abgeleiteter Architekturvorschlag. Der konkrete Anmeldeablauf wurde im Review nicht implementiert oder Ende-zu-Ende getestet. Kostenloser Betrieb bleibt von den aktuellen Limits und der tatsächlichen Nutzung abhängig.

Die Dienste und ihre Bedingungen können sich ändern. Bei Einrichtung der Workflows aktuelle Dokumentation und Tarifbedingungen erneut prüfen.

---

## 20. Management Summary / Beschlussstand

Evolvera wird als öffentliche, mobile-first und möglichst kostenlos betriebene Kunstgalerie umgesetzt. Ein TypeScript-Algorithmus erzeugt pro vorgesehenem Berliner Tag ein HTML-/CSS-Werk mit fest gespeichertem Fantasietitel. Tag 1 und 2 liefern unabhängige Ursprungswerke; ab Tag 3 sind die zwei unmittelbar vorhergehenden Generationen die Eltern.

Der Betreiber kann unter „Einstellungen“ nach GitHub-Anmeldung zwischen nachvollziehbarer Vererbung und maximaler Freiheit wechseln. Standard ist nachvollziehbare Vererbung. Der Modus bleibt gespeichert und gilt ab dem nächsten noch nicht begonnenen Generierungslauf. Jedes Werk archiviert seinen konkreten Modus und dessen Herkunftsentscheidungen. Vergangene Werke werden nicht verändert.

React/Vite und GitHub Pages liefern Heute, Galerie, Evolution, Werkdetails und Über Evolvera. Statische echte HTML-/CSS-Kacheln schonen mobile Geräte. Cloudflare Workers ergänzt die geschützte Betreiberfunktion. GitHub Actions übernimmt die um 01:17 Europe/Berlin geplante Generierung, Git-Archivierung und Veröffentlichung. Fehlende neue Tage werden transparent nachgeholt; historische Schäden werden aus Git wiederhergestellt.

Vor dem offiziellen Serienstart werden 30–50 getrennte Testwerke beider Modi gemeinsam geprüft. Erst nach ausdrücklicher Kunstabnahme werden Startdatum und offizielle Generierung aktiviert. Ein frühes öffentliches Testdeployment der Shell startet noch keine Kunstserie.

**Nächster Umsetzungsschritt:** Im vorhandenen Projektordner mit dem vorhandenen Repository ausschließlich Phase 0 umsetzen. Diese PRD-Version beschreibt die abgestimmten Anforderungen, nicht bereits fertiggestellte Software.
