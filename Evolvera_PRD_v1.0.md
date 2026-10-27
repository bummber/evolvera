---
title: "Evolvera – Product Requirements Document"
subtitle: "Eine täglich wachsende, evolutionäre Web-Kunstgalerie"
version: "1.0"
status: "Konzept / bereit für technische Umsetzung"
date: "2026-10-27"
language: "de-DE"
---

# EVOLVERA
## Product Requirements Document (PRD)

**Version:** 1.0  
**Datum:** 27. Oktober 2026  
**Status:** Fachliche Ausgangsbasis zur Durchsicht und späteren Umsetzung mit Codex  
**Arbeitstitel:** Evolvera (vorläufig)  
**Zielplattform:** Öffentliche, mobile-first Webanwendung  
**Leitprinzip:** Täglich generierte Kunst. Zwei Vorgänger. Ein neuer, unvorhersehbarer Nachfolger.

> **Kurzbeschreibung:** Evolvera erschafft jeden Tag automatisch ein neues abstraktes Kunstwerk – ausschließlich aus HTML-Elementen und CSS, ohne Fotos, Bilddateien, Canvas oder Bildgenerierungs-KI. Die ersten beiden Werke entstehen unabhängig voneinander. Ab dem dritten Werk kombiniert und mutiert ein Algorithmus die Eigenschaften der beiden unmittelbar vorherigen Werke. Jede Generation erhält einen erfundenen, poetischen Titel und wird dauerhaft als strukturierte Daten archiviert. Besuchende können das Tageswerk sehen, im Archiv stöbern und dessen Herkunft nachvollziehen.

---

## 1. Produktvision

Evolvera ist eine öffentlich zugängliche, sich selbst weiterentwickelnde Kunstgalerie. Die Anwendung macht aus regelbasiert erzeugter, abstrakter Kunst eine fortlaufende Geschichte: Tag für Tag wächst eine Bildfolge, bei der jedes neue Werk aus den letzten zwei Generationen hervorgeht und dennoch überraschend anders aussehen darf.

Es geht **nicht** um technisch perfekte Bilder, Fotorealismus, KI-Bildgeneratoren oder von Menschen kuratierte Motive. Im Mittelpunkt stehen **Zufall, visuelle Vielfalt, Mutation, Kontinuität und Beobachtbarkeit der Entwicklung**. Die Galerie soll Neugier wecken: „Was ist heute entstanden, und wie ist es aus gestern und vorgestern hervorgegangen?“

### 1.1 Produktversprechen

- Jeden Tag ein neues, eindeutiges Kunstwerk, geplant ab **04:00 Uhr in der Zeitzone `Europe/Berlin`**.
- Jedes Werk wird mit seinem Titel, Erstellungsdatum, gestalterischen Eigenschaften und seiner Abstammung dauerhaft gespeichert.
- Eine kleine, ästhetische und schnelle Website, die auf Smartphones hervorragend funktioniert.
- Keine laufenden Kosten für Bildgenerierungsdienste und für die erste Version **möglichst 0 € Hostingkosten**.
- Ein technischer Unterbau, der später andere Inhalte und neue Funktionen aufnehmen kann.

### 1.2 Erfolgskriterien für Version 1

1. Die Website ist ohne Login über eine öffentliche URL erreichbar.
2. An jedem geplanten Generierungstag entsteht höchstens ein neues dauerhaftes Kunstwerk; versäumte Tage sind nachholbar.
3. Ab der dritten Generation sind immer genau die beiden unmittelbar vorherigen Generationen die **Elternwerke**.
4. Besuchende können Tageswerk, Archiv und die Herkunft eines ausgewählten Werks ansehen.
5. Die Darstellung ist rein DOM-/CSS-basiert; keine Bilddateien für die Kunst.
6. Der Prozess funktioniert automatisch ohne geöffneten Browser und ohne laufenden Mac.
7. Betrieb und Veröffentlichung sind im Rahmen der GitHub-Free-Nutzung ohne regelmäßige Gebühren möglich.

---

## 2. Zielgruppe und Nutzungsverhalten

### 2.1 Primäre Zielgruppen

- **Neugierige Besucher:** Möchten das heutige Bild betrachten und vielleicht einzelne ältere Werke erkunden.
- **Wiederkehrende Besucher:** Interessieren sich dafür, wie sich die Kunst über mehrere Tage verändert.
- **Projektbetreiber/Entwickler:** Möchten die Entwicklung verstehen, Regeln erweitern, Fehler analysieren und später weitere Inhalte ergänzen.

### 2.2 Typische Besuchsabläufe

**Szenario A – Der tägliche Blick:** Eine Person öffnet die Seite auf dem Smartphone, sieht sofort das aktuelle Kunstwerk und dessen Fantasietitel. Sie kann eine Animation stoppen und bei Interesse die beiden Vorgänger betrachten.

**Szenario B – Entdeckungsreise:** Eine Person öffnet die Galerie, scrollt durch die chronologischen Arbeiten und betrachtet einzelne Werke in größerer Darstellung.

**Szenario C – Entwicklung verfolgen:** Eine Person öffnet ein Werk in der Evolutionsansicht und sieht dessen zwei Eltern, den Nachfolger und eine verständliche Zusammenfassung der übernommenen bzw. veränderten Merkmale.

**Szenario D – Betrieb:** Der Betreiber sieht im GitHub-Repository die gespeicherten Daten. Ein täglicher Workflow erzeugt das Werk und veröffentlicht die aktualisierte Website ohne manuelles Eingreifen.

---

## 3. Scope: Version 1 (MVP)

### 3.1 Verbindliche Funktionen (MUST)

| ID | Funktion | Anforderung |
|---|---|---|
| F-01 | Tageswerk | Das zuletzt veröffentlichte Tageskunstwerk ist auf der Startseite prominent sichtbar. |
| F-02 | Tägliche Generierung | Automatischer geplanter Auslöser um 04:00 Uhr `Europe/Berlin`; unabhängig vom Seitenaufruf. |
| F-03 | Zwei Startgenerationen | Die ersten zwei Werke werden unabhängig generiert. |
| F-04 | Evolution | Ab Generation 3 dienen die beiden unmittelbar vorhergehenden Werke als Eltern. |
| F-05 | Dynamische Vererbung | Mischung und Mutationen werden pro Generation und pro Merkmalsgruppe zufällig bestimmt; keine feste Prozentquote. |
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

### 3.2 Wünschenswerte Eigenschaften (SHOULD)

- Besuchende können das Tageswerk mit einem Link teilen.
- Die Galerie lädt ältere Werke abschnittsweise (Pagination/Lazy Loading).
- Die Kunstwerke bleiben über neue Versionen der Website hinweg visuell stabil.
- Das Archiv zeigt eine Generationsnummer und einen kurzen, verständlichen „Mutationsbericht“.
- Ein manueller, abgesicherter GitHub-Actions-Start hilft bei der Fehlerbehebung.
- Galerie und Details bieten Tastaturbedienung und sinnvolle Textalternativen.

### 3.3 Nicht Bestandteil des MVP (OUT OF SCOPE)

- Benutzerkonten, Kommentare, Likes, Community-Moderation oder persönliches Profil.
- Kostenpflichtige KI-Bildgenerierung, LLM-API oder KI-basierte Titel.
- Fotos, Bild-Uploads, externe Illustrationen oder importierte Kunstwerke.
- Downloads als PNG/JPEG, Druckshop, NFT-/Blockchain-Funktionen oder Monetarisierung.
- Admin-Dashboard, CMS, komplexe Datenbank oder klassischer Backend-Server.
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
| **Über Evolvera** (`#/ueber`) | Kurze Erklärung des Konzepts, optional im MVP | SHOULD |

**Routing:** Für GitHub Pages wird in V1 bewusst **Hash-Routing** bevorzugt. Dadurch funktionieren direkte Links, ohne dass GitHub Pages einen dynamischen Server oder spezielle SPA-Fallbacks benötigt. Eine spätere Umstellung auf schöne Pfade ist möglich.

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
- Um die Leistung mobiler Geräte zu schützen, bleiben Galerie-Vorschauen standardmäßig **statisch**. Animationen laufen nur im fokussierten Werk, sofern erlaubt.
- Zu Beginn z. B. 12 Werke pro Seite; weitere auf Anforderung nachladen. Kein gleichzeitiges Rendern des gesamten mehrjährigen Archivs.

### 4.5 Evolution

- Bei einer Generation ab Nr. 3: **Eltern A + Eltern B → Nachfolger C**.
- Elternkacheln sind anklickbar und führen zu deren eigener Abstammung.
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

**Generation 1:** Vollständig unabhängig generiertes Ursprungswerk A.  
**Generation 2:** Vollständig unabhängig generiertes Ursprungswerk B.  
**Generation 3:** Kind C aus den Genen von A und B plus neu gewürfelten Eigenschaften.  
**Generation 4:** Kind D aus B und C.  
**Generation 5:** Kind E aus C und D.  
**Allgemein:** `Eltern(n) = [Werk(n−2), Werk(n−1)]`, für `n >= 3`.

**Mutations- und Vererbungslogik:**

- Der Algorithmus zieht für **jedes neue Werk** eigene Zufallsparameter.
- Für **jede Merkmalsgruppe** kann er erneut zufällig wählen: aus Elternteil A übernehmen, aus Elternteil B übernehmen, Eltern mischen, verändern oder völlig neu würfeln.
- Vererbungsstärken und Mutationswahrscheinlichkeiten sind **nicht fest** auf 70/30 o. Ä. eingestellt. Extreme sind ausdrücklich erwünscht: fast identische Verwandtschaft oder radikaler Bruch.
- Das Ergebnis soll trotz Zufall eine **sichtbare, technisch gültige Komposition** sein: Fehlerhafte CSS-Werte, völlig leerer Bildraum oder nicht lesbare Daten müssen abgefangen werden.
- Elternbilder werden **nicht übereinander als Screenshots gelegt**; stattdessen werden die gespeicherten Gestaltungsparameter algorithmisch kombiniert.
- Der Algorithmus speichert **welche Entscheidungen getroffen wurden**. Das ermöglicht eine ehrliche Darstellung der Evolution.

**Leichte Qualitätsleitplanken (kein kuratorisches Bewertungssystem):** Gültige Farben, erlaubte CSS-Werte, genügend sichtbare Elemente, Begrenzung von Elementzahl und Animationslast sowie eine Prüfung, ob gegenüber dem unmittelbaren Vorgänger eine erkennbare Änderung vorliegt. Falls die zufällige Komposition unbrauchbar ist, wird sie mit demselben Seed über einen deterministischen Retry-Pfad ersetzt. Diese Leitplanken dürfen die künstlerische Unberechenbarkeit nicht in ein starres Schema pressen.

### 5.5 Determinismus und Archivierung

- Jede Generation bekommt eine stabile ID nach lokalem Datum (`YYYY-MM-DD`) und eine fortlaufende Generationsnummer.
- Zufallswerte werden mit einem dokumentierten **PRNG** (Pseudozufallsgenerator) und einem gespeicherten Seed erzeugt.
- Durch gespeicherte Endparameter muss ein bereits publiziertes Werk **nicht erneut zufällig erzeugt werden**, um dargestellt zu werden.
- Der Generator darf sich bei künftigen Versionen verändern; bestehende Archivdateien **dürfen nicht heimlich neu berechnet oder überschrieben** werden.
- `schemaVersion` und `rendererVersion` sichern die spätere Kompatibilität. Änderungen am Renderer müssen historische Werke weiterhin korrekt anzeigen; andernfalls bleiben passende ältere Renderer erhalten oder es wird ein expliziter Migrationsprozess dokumentiert.
- Für eine vollständig transportable Einzeldarstellung kann später ein HTML/CSS-Export ergänzt werden. Für MVP gelten archivierte JSON-DNA plus unterstützter Renderer als kanonische Speicherung.

### 5.6 Künstlerische Freiheitsgrade

Es gibt bewusst **keinen festen Stil, keine starre Farbpalette und keinen vorgeschriebenen Vererbungsprozentsatz**. Eine Generation kann statisch oder animiert, ruhig oder wild, minimalistisch oder komplex sein. Der Algorithmus steuert nicht auf einen vorher festgelegten Endstil zu. Sein einziges verpflichtendes genealogisches Prinzip ist die Nutzung der zwei Vorgängergenerationen als Eingangsquelle.

---

## 6. Animationen

CSS-Animationen sind ein optionales Gen jeder Kunstgeneration. Die Parameter werden bei der Erzeugung gespeichert und können von Eltern stammen oder neu entstehen.

**Mögliche Bewegungen:** Drehung, Pulsieren, langsames Schweben, Farbwechsel, Skalierung, Verschiebung, rhythmische Staffelung sowie Kombinationen davon.

**Verhalten im MVP:**

- Manche Werke haben überhaupt keine Bewegung.
- Ein sichtbarer **Pause-/Wiedergabe-Schalter** steuert alle Animationen der aktiven Hauptansicht.
- Bei `prefers-reduced-motion: reduce` startet die Darstellung ohne laufende Animation; eine explizite Entscheidung der Besuchenden kann eine Animation für die Sitzung aktivieren.
- Galerie-Kacheln bleiben standardmäßig unbewegt.
- Animationen dürfen Navigation, Scrollen und Bedienelemente nicht blockieren.
- Animationen sollen bevorzugt `transform` und `opacity` verwenden; ressourcenintensive Effekte (z. B. große Unschärfefilter) sind begrenzt.
- Die App speichert **keine persönlichen Präferenzen serverseitig**; optional kann ein lokaler Sitzungszustand genutzt werden.

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

**MVP: Git-Repository als dauerhafter Datenspeicher. Keine Datenbank erforderlich.**

Für jede Generation wird eine eigene JSON-Datei im Ordner `public/artworks/YYYY/` versioniert. Ein automatisch gepflegter Index unterstützt aktuelle Ansicht und Galerie. Alle Inhalte werden mit Git archiviert und gemeinsam mit der Website veröffentlicht.

**Beispielhafte Struktur:**

```text
evolvera/
├── .github/
│   └── workflows/
│       └── publish.yml
├── docs/
│   └── PRD.md
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
  "id": "2026-10-29",
  "generation": 3,
  "title": "Kaleidomorphes Schweigen",
  "timezone": "Europe/Berlin",
  "scheduledFor": "2026-10-29T04:00:00+01:00",
  "generatedAt": "2026-10-29T03:00:06Z",
  "publishedAt": null,
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
      { "trait": "geometry", "source": "parentB", "action": "mixed" },
      { "trait": "animation", "source": "new", "action": "generated" }
    ]
  }
}
```

**Wichtig:** Dies ist **ein Beispiel**, kein vollständiges finales JSON-Schema. Insbesondere `publishedAt` muss wahrheitsgetreu verwaltet werden (oder in einem separaten Veröffentlichungsmanifest liegen): Die Website darf nicht suggerieren, dass bereits vor dem tatsächlichen Deployment veröffentlicht wurde. Numerische Koordinaten liegen normiert zwischen 0 und 1; Generator und Renderer vereinbaren verbindliche Grenzen und Defaults.

### 8.3 Regeln für Archivdateien

- Pro lokalem Veröffentlichungsdatum genau eine kanonische Werkdatei.
- Dateien bereits publizierter Generationen werden im Normalbetrieb **nie überschrieben**.
- Der Index enthält die ID, Generation, den Titel und genug Daten für leichte Galerie-Navigation.
- Der Index wird **aus den Werkdateien rekonstruiert**, statt als separate Wahrheit behandelt zu werden.
- Alle Elternreferenzen müssen auf tatsächlich vorhandene Werke zeigen.
- Werkdaten werden vor Commit, Build und Anzeige anhand eines Schemas validiert.
- Bestehende Archive bleiben nutzbar, wenn neue Kompositionsfamilien hinzugefügt werden.

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
| Tests | **Vitest**, optional React Testing Library | Generator-, Schema- und Komponententests |
| Hosting | **GitHub Pages** | Kostenloser statischer Betrieb im öffentlichen Repository |
| Automatisierung | **GitHub Actions** | Täglicher Generierungs-, Commit-, Build- und Deploy-Prozess |
| Datenspeicherung | **JSON-Dateien + Git** | Versioniert, transparent, ohne Datenbankbetrieb |

**Wichtige Abgrenzung:** Next.js und SQLite wurden früh als flexible Optionen betrachtet. Für die nun festgelegten Ziele – **sehr frühe Veröffentlichung, möglichst kostenlos, kein dauerhafter Server** – ist **React + Vite + versionierte JSON-Dateien** die passendere Startentscheidung. Eine spätere Migration auf eine servergestützte Plattform bleibt möglich.

### 9.2 Architekturprinzip

```text
                       GITHUB-REPOSITORY
           +--------------------------------------+
           |  TypeScript-Generator                |
           |  Archiv (JSON-Dateien)               |
           |  React/Vite-Frontend                 |
           +----------------+---------------------+
                            |
          GitHub Actions: 04:00 Europe/Berlin
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

Die Website braucht zunächst keine Nutzerdaten, kein Login und keine serverseitige Interaktion. Ein **Werk pro Tag** bedeutet geringe Datenmengen, die sich als einzelne JSON-Dateien gut versionieren lassen. Eine Datenbank würde die Betriebs- und Hostingkomplexität erhöhen, ohne in V1 einen ausreichenden Nutzen zu bringen.

### 9.4 GitHub Pages: Besonderheiten

- Die Website ist statisch. Die **tägliche Erzeugung passiert auf einem GitHub-Actions-Runner**, nicht in GitHub Pages und nicht im Browser.
- Bei einem Projekt-Repository muss Vite die passende `base`-URL verwenden (z. B. `/<repository-name>/`). Der Router und die Datenpfade müssen damit funktionieren.
- Für ein privates Repository können andere Tarifbedingungen gelten. **MVP-Annahme: öffentliches Repository auf GitHub Free.**
- Die Archivdateien sind öffentlich und über Git herunterladbar. Keine privaten Daten oder geheimen Tokens darin speichern.
- GitHub Pages ist für eine kleine öffentliche Kunstgalerie passend; Limits für Sitegröße und Bandbreite müssen bei Wachstum geprüft werden.

---

## 10. Tägliche Automatisierung und Zeitlogik

### 10.1 Zeitliche Definition

- **Gewünschter Zeitpunkt:** Täglich um **04:00 Uhr Europe/Berlin** (CET/CEST automatisch berücksichtigt).
- Ein neuer Tageszyklus beginnt um 04:00 Uhr und endet um 03:59:59 Uhr am Folgetag.
- Der Datumsschlüssel eines Kunstwerks ist das **Berliner Kalenderdatum des vorgesehenen Tages**, nicht das UTC-Datum des Runners.
- Vor 04:00 Uhr bleibt das zuletzt veröffentlichte Werk aktuell; das neue Werk darf **nicht vorzeitig** erscheinen.
- Ein neuer Titel, neue DNA und Elternzuordnung werden **einmalig** für den Tag festgelegt.

### 10.2 GitHub-Actions-Zeitplan

Die aktuelle GitHub-Actions-Syntax unterstützt IANA-Zeitzonen. Konzeptionelles YAML-Beispiel:

```yaml
on:
  schedule:
    - cron: '0 4 * * *'
      timezone: 'Europe/Berlin'
    - cron: '17 4 * * *'   # kontrollierter Nachholversuch
      timezone: 'Europe/Berlin'
    - cron: '13 5 * * *'   # weiterer Nachholversuch
      timezone: 'Europe/Berlin'
  workflow_dispatch:
```

**Verfügbarkeitsvorbehalt:** GitHub Actions arbeitet mit **best effort**. Geplante Runs können verspätet starten oder in Ausnahmesituationen entfallen. Der Trigger ist auf 04:00 Uhr gestellt, doch sekundengenaue Veröffentlichung um 04:00 Uhr kann mit GitHub Pages/Actions nicht garantiert werden. Eine spätere Hosting-/Scheduler-Alternative wäre nötig, falls eine harte Uhrzeitgarantie zum Produktziel wird.

### 10.3 Verarbeitungsablauf

1. Workflow startet automatisch oder manuell.
2. Zeitzone `Europe/Berlin` auswerten; bei regulären Läufen **vor 04:00 Uhr keinen neuen Tag erzeugen**.
3. Werkdateien laden, validieren und alle vorhandenen Generationen chronologisch sortieren.
4. Prüfen, welche Berliner Tageszyklen seit Projektstart fehlen und bereits um 04:00 Uhr fällig sind.
5. Fehlende Tage **chronologisch** erzeugen: Bei jeder neu generierten Generation die zwei letzten verfügbaren Werke als Eltern verwenden.
6. Vorhandene Tage unverändert lassen (Idempotenz).
7. Archivdateien schreiben, Index aktualisieren, Integrität prüfen und Tests laufen lassen.
8. Neue Dateien mit kontrollierten `contents: write`-Rechten ins Repository committen.
9. **Im selben Workflow** die aktuelle Website bauen und über GitHub Pages bereitstellen.
10. Lauf protokollieren; bei Fehler **keinen defekten Stand publizieren**.

### 10.4 GitHub-spezifischer Stolperstein

**Ein von `GITHUB_TOKEN` ausgelöster Commit startet normalerweise keinen neuen `push`-Workflow und keinen GitHub-Pages-Build.** Deshalb muss der tägliche Workflow **selbst bauen und deployen**, nachdem die neuen JSON-Dateien erzeugt wurden. Ein separater Push-Workflow darf nicht die einzige Publishing-Stufe für tägliche Generierungen sein. Für normale Codeänderungen kann derselbe Publish-Workflow zusätzlich auf Pushes in `main` reagieren.

### 10.5 Race Conditions und Sicherheit

- Ein gemeinsamer GitHub-Actions-`concurrency`-Bereich verhindert parallele Generator-/Publish-Läufe, die sich gegenseitig überschreiben.
- Zwei gleichzeitige Starts dürfen nicht zwei Werke für dasselbe Datum erzeugen.
- Commit- und Push-Konflikte werden erkannt; nach einem frischen Checkout kann einmal kontrolliert erneut geprüft werden.
- Nach einem Fehler im Deployment bleibt die archivierte Generierung intakt und die Veröffentlichung ist erneut ausführbar.
- Manuelle Läufe dürfen bestehende Werke nicht stillschweigend neu auswürfeln.
- Für gezielte lokale Testdaten sind ausdrücklich markierte **Preview-/Dry-Run-Optionen** vorgesehen.
- Falls mehrere Tage fehlen, werden **alle fälligen Tage in der richtigen Reihenfolge nachgeholt**, anstatt die Abstammungskette zu unterbrechen.

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

- Kein Benutzertracking und keine Cookies im MVP erforderlich; Hostinganbieter können unabhängig technische Zugriffslogs verarbeiten.
- Keine fremden ausführbaren Codeschnipsel oder vom Titelgenerator erzeugtes HTML als HTML interpretieren.
- Generierte CSS-Eigenschaften nur aus validierten, erlaubten Werten zusammensetzen; keine freien CSS-URLs oder externe Ressourcen.
- Abhängigkeiten mit Lockfile pinnen, GitHub-Actions-Berechtigungen möglichst gering halten und keine Secrets in Archivdateien ablegen.
- Keine sensiblen Daten in Git-Commits.
- Website braucht kein Cookie-Banner, **sofern** keine zustimmungspflichtigen Trackingtechniken hinzugefügt werden; Rechtliches (Impressum/Datenschutz) vor Veröffentlichung prüfen.

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
| A-02 | Eine frisch initialisierte Installation erzeugt Generation 1 und 2 unabhängig voneinander. |
| A-03 | Generation 3 hat genau Gen. 1 und Gen. 2 als Eltern, Gen. 4 genau Gen. 2 und 3 usw. |
| A-04 | Derselbe Seed plus identische Eingabedaten liefert wieder dieselbe generierte DNA und denselben Titel. |
| A-05 | Erneutes Generieren eines vorhandenen Datums ändert weder Archivdatei noch Generationenzahl. |
| A-06 | Ein übersprungener Tag wird später nachgeholt; alle Elternreferenzen bleiben korrekt. |
| A-07 | Der Stichtag wird gemäß `Europe/Berlin` verarbeitet; Tests decken Winter-/Sommerzeitumstellung ab. |
| A-08 | Beim ersten Aufruf nach dem Deployment ist das neue Tageswerk ohne manuelle Aktion sichtbar. |
| A-09 | Kunstwerk verwendet keine `<img>`-, `<svg>`-, `<canvas>`-Elemente und lädt keine Bild-Assets. |
| A-10 | Ein altes Werk kann nach mehreren Generator-Versionen aus seinen Archivdaten unverändert dargestellt werden. |
| A-11 | Galerie zeigt alle Werke chronologisch; Werkdetail und beide Elternlinks funktionieren. |
| A-12 | `prefers-reduced-motion` stoppt anfängliche Bewegungen; Pause-/Play-Schalter funktioniert. |
| A-13 | Die App ist auf Smartphonebreiten ab ca. 320 CSS-Pixel bedienbar, ohne horizontales Layout-Overflow. |
| A-14 | Generierter Titel wird fest gespeichert und verändert sich bei Reload nicht. |
| A-15 | Build/Test/Archivprüfung schlagen bei ungültigen oder verwaisten Werkdaten nachvollziehbar fehl. |
| A-16 | Ein geplanter GitHub-Actions-Lauf kann archivieren **und im selben Workflow deployen**. |
| A-17 | Dokumentation enthält Setup, Live-URL-Konfiguration, manuelle Generierung, Fehlerbehebung und Deployment. |

**Wichtig:** Für V1 ist eine gute, reproduzierbare technische Umsetzung wichtiger als die subjektive Bewertung einzelner Kunstwerke. Trotzdem muss eine Mindestprüfung die Erzeugung kaputter oder vollständig leerer Kompositionen verhindern.

---

## 13. Umsetzung in Phasen

### Phase 0 – Projektinitialisierung und Architektur

**Ziel:** Lokal lauffähiges Grundgerüst, Repo, GitHub Pages, CI/Tests, typisierte Datenschemata.

**Ergebnisse:** Vite/React/TypeScript-Projekt, mobile-first Shell, Routing, klare Ordnerstruktur, Formatierung/Linting, Testsetup, GitHub-Pages-Testdeployment mit Platzhalterkunst.

**Abnahme:** Eine öffentliche URL zeigt eine responsive Seite; lokale Entwicklung funktioniert auf dem Mac.

### Phase 1 – Kunst-DNA und Renderer

**Ziel:** Unterschiedliche CSS-/DOM-Kunstwerke lokal erzeugen und zuverlässig darstellen.

**Ergebnisse:** PRNG, Form-/Farb-/Animationsmodelle, min. drei klar unterscheidbare Kompositionsfamilien, validierter Renderer und visuelle Debug-/Preview-Möglichkeit.

**Abnahme:** Unterschiedliche Seeds führen zu unterschiedlich aussehenden validen Werken; kein Bildasset erforderlich.

### Phase 2 – Evolution und poetische Titel

**Ziel:** Erste beiden Werke unabhängig erzeugen; Folgewerke aus zwei Eltern entwickeln.

**Ergebnisse:** Kombinations-/Mutationslogik, Titelgenerator, nachvollziehbare Abstammungsmetadaten, deterministische Tests.

**Abnahme:** Beispielkette mit mindestens 10 Werken korrekt und wiederholbar; Titel sind persistiert.

### Phase 3 – Galerie und Evolutionsansichten

**Ziel:** Besuchende können die Geschichte der Kunst erkunden.

**Ergebnisse:** Tagesseite, Archiv mit Pagination, Werkdetail, Eltern-/Kind-Navigation, Animation-Pause, mobile Gestaltung.

**Abnahme:** Die komplette Testkette kann am Smartphone und Desktop nachvollzogen werden.

### Phase 4 – Tägliche Automatisierung und öffentliche Veröffentlichung

**Ziel:** Jeden Tag ohne manuellen Eingriff ein neues Werk erzeugen, archivieren und veröffentlichen.

**Ergebnisse:** Geplanter GitHub-Actions-Workflow um 04:00 Europe/Berlin, Nachholtrigger, idempotenter Generator, Commit, Build, Deploy, Log-/Runbook-Dokumentation.

**Abnahme:** Mindestens ein erfolgreicher geplanter Lauf im GitHub-Actions-Protokoll; erneuter manueller Lauf erzeugt kein Duplikat.

### Phase 5 – Stabilisierung

**Ziel:** Qualität für langfristigen Betrieb sichern.

**Ergebnisse:** Tests zu DST/Race Conditions/Schema-Kompatibilität, Performance-Profiling auf Mobilgeräten, Fehlerfälle, kleine UI-Verfeinerungen, Betriebsanleitung.

**Abnahme:** Vollständige MVP-Akzeptanzliste A-01 bis A-17 erfüllt.

---

## 14. Produkt- und Technikrisiken

| Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|
| GitHub Actions läuft verspätet oder fällt aus | Tageswerk erscheint nicht genau 04:00 | Nachholtrigger, Idempotenz, Monitoring, klare Best-effort-Definition |
| GitHub-Actions-Commit triggert kein weiteres Publish | Archiv aktualisiert, Website veraltet | Generieren, Commit, Build und Pages-Deploy im selben Workflow |
| Zufällige Werke werden zu ähnlich oder unbrauchbar | Galerie verliert Reiz | Qualitätsleitplanken, diversifizierte Operatoren, visuelle Tests, kein fixiertes Mischverhältnis |
| Alte Werke verändern sich nach Renderer-Update | Geschichtliche Integrität leidet | Versioniertes Schema/Rendering, Migrationsstrategie, Snapshot-Tests |
| Große Galerie belastet Smartphones | Träge Oberfläche, hoher Akkuverbrauch | Statische Vorschauen, Pagination, DOM-/Animationsbudget |
| Repository wird sehr groß | Build/Deploy dauert länger | Pro Tag nur kleine JSON-Dateien; Größe überwachen und spätere Auslagerung ermöglichen |
| Styling ist auf Desktop gut, mobil schlecht | Zielgruppe kann Kunst nicht genießen | 1:1 normierte Kunstfläche, mobile-first, Responsive-Tests |
| Public Repo veröffentlicht Informationen ungewollt | Sicherheits-/Datenschutzprobleme | Nur öffentliche Werkdaten, keine Secrets, sichere Workflow-Rechte |
| Stille Zeitumstellungsfehler | Falsche Daten/Generationen | Ausschließlich `Europe/Berlin` als Tageslogik, Tests für CET/CEST |

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

## 17. Offene Detailentscheidungen – bewusst für die Umsetzung reserviert

Die folgenden Punkte sind **keine Blocker** für den Projektstart. Codex kann zunächst einen nachvollziehbaren Vorschlag implementieren, sofern die PRD-Anforderungen eingehalten werden.

1. Exakte Farb-/Formalgorithmen und finale Start-Kompositionsfamilien.
2. Umfang der initialen Lexika für Fantasietitel.
3. Detaildesign, Typografie, endgültige Logo- und Markenfarben.
4. Ob Tailwind CSS oder CSS-Module die UI besser unterstützen.
5. Grenzwerte für Anzahl der Formen, Dichte und Animationen nach realen Performance-Tests.
6. Implementierungsdetails für stabile Renderer-Versionen und langfristige Snapshot-Kompatibilität.
7. Ob die optionale Seite „Über Evolvera“ schon mit dem ersten öffentlichen MVP live geht.

**Bereits entschieden:** Arbeitstitel Evolvera, mobile first, frühzeitige öffentliche Verfügbarkeit, möglichst kostenloser Betrieb, eigene HTML-/CSS-Kunst, zwei Vorgänger, frei randomisierte Vererbung, täglich 04:00 Uhr Europe/Berlin, dauerhaftes Archiv, Galerie, Evolutionsansicht, Animationen und Fantasietitel.

---

## 18. Codex-Handoff: Empfohlener Start

### 18.1 Vorbereitung auf dem Mac

1. Lokalen Projektordner `evolvera` anlegen.
2. Diese Datei als **`docs/PRD.md`** in den Ordner kopieren (oder zunächst im Wurzelverzeichnis ablegen).
3. Codex aus dem Projektordner öffnen und das PRD als maßgebliche fachliche Spezifikation nennen.
4. Mit **Phase 0** beginnen; nicht direkt alle fünf Phasen gleichzeitig implementieren lassen.
5. Bei jedem Schritt den Quellcode lokal starten, Tests ausführen und Ergebnisse prüfen, bevor der nächste Schritt folgt.

### 18.2 Vorschlag für die erste Codex-Anweisung

```text
Wir entwickeln das Projekt „Evolvera“. Lies zunächst vollständig docs/PRD.md.

Arbeite in kleinen, überprüfbaren Schritten. Beginne ausschließlich mit Phase 0:
- Erstelle ein React-/Vite-/TypeScript-Projekt mit übersichtlicher Architektur.
- Richte ein responsive Mobile-First-Layout mit den Navigationsbereichen
  Heute, Galerie und Evolution ein (GitHub-Pages-taugliches Routing).
- Definiere die TypeScript-Datentypen und ein validierbares Schema für
  archivierte Kunstwerke, ohne schon die komplette Kunstlogik zu bauen.
- Bereite Tests, Linting und ein verständliches README vor.
- Richte die statische Build-Konfiguration für GitHub Pages ein.

Wichtig: Die Kunst selbst darf ausschließlich aus HTML und CSS entstehen,
ohne SVG, Canvas, WebGL oder Bilddateien. Die Daten sollen in JSON-Dateien
im Repository gespeichert werden. Der tägliche Generator wird später mit
GitHub Actions um 04:00 Europe/Berlin ausgeführt.

Bevor du Änderungen vornimmst, gib mir einen kurzen Umsetzungsplan und
markiere Annahmen. Nach jedem abgeschlossenen Schritt nenne die geänderten
Dateien, die ausgeführten Tests und den nächsten sinnvollen Schritt.
```

### 18.3 Projektregeln für die weitere Zusammenarbeit mit Codex

- Das PRD ist die **Produktquelle der Wahrheit**. Abweichungen vor der Implementierung ansprechen.
- Features in kleinen, testbaren Arbeitspaketen bauen.
- Keine stillen Datenmigrationen oder Änderungen an bestehenden Werken.
- Neue Abhängigkeiten kurz begründen; Kosten und Betriebskomplexität möglichst klein halten.
- Vor dem Livegang die für öffentliche Websites in Deutschland relevanten rechtlichen Angaben prüfen.
- Bei Konflikten zwischen gestalterischer Freiheit und Stabilität: Freiheit im Generator, Stabilität bei Datenformat, Sicherheit und Veröffentlichung.

---

## 19. Quellen und technische Referenzen (Stand: 27.10.2026)

Offizielle Dokumentation zur konkreten Plattformentscheidung:

- **GitHub Actions – Workflow syntax / `on.schedule` (mit IANA-Zeitzonen):** https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onschedule
- **GitHub Actions – Events, Verzögerungen, 60 Tage Inaktivität:** https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule
- **GitHub – `GITHUB_TOKEN` und Folge-Workflows/Pages-Builds:** https://docs.github.com/en/actions/concepts/security/github_token
- **GitHub Pages – Benutzerdefinierte Publishing-Workflows:** https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- **GitHub Pages – Limits:** https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- **GitHub Actions – Abrechnung:** https://docs.github.com/en/billing/concepts/product-billing/github-actions

Die Dienste und ihre Bedingungen können sich ändern. Bei Einrichtung der Workflows aktuelle Dokumentation und Tarifbedingungen erneut prüfen.

---

## 20. Management Summary / Beschlussstand

Evolvera wird als **öffentliche, zunächst serverlose und kostengünstige Kunstplattform** umgesetzt. Das erste Produkt ist eine jeden Tag um 04:00 Uhr deutscher Zeit geplante Kunstgeneration. Ihre Bilder bestehen aus **HTML- und CSS-Formen** und werden von einem **TypeScript-Algorithmus** gestaltet. Die ersten zwei Generationen bilden den Ausgangspunkt; anschließend entsteht jede weitere Generation durch **zufällig gewichtete Vererbung und Mutation der zwei letzten Werke**. Dazu kommt ein evolutionärer Generator für poetische, teils erfundene Titel.

Eine mobile-first React-/Vite-Website bietet **Heute, Galerie und Evolution**. Alle Werkdaten bleiben als versionierte **JSON-Dateien in Git**, während **GitHub Actions** Erzeugung, Archivierung und Veröffentlichung und **GitHub Pages** die öffentliche Bereitstellung übernehmen. Die Website wird so modular entwickelt, dass weitere Inhalte und Kunstformen später ergänzt werden können.

**Empfohlener nächster Schritt:** PRD in Ruhe prüfen; danach mit Codex **Phase 0** beginnen, insbesondere Projektstruktur, Hosting und Datenmodell. Die eigentliche evolutionsbasierte Kunstgenerierung folgt in klar getrennten Entwicklungsschritten.
