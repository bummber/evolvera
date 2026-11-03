# Evolvera Design-System v1 – „Werkbuch“

Umsetzungsgrundlage für die Gestaltung der Evolvera-Shell (Mobile first, dann Desktop).
Weiterentwicklung der am 28.10.2026 gewählten **Richtung A / Experimentelles Kunstmagazin**
(siehe `docs/design-review.md`): Papiergrund, markante Grotesk, Zinnoberrot, redaktionelles
Raster – ergänzt um variable Schriftbreiten, Mono-Metadaten wie Museumsetiketten,
Werkbühne mit Schnittmarken und eine sichtbare Darstellung der Vererbung.

Ablage im Repo: `docs/design-system.md`. Visuelle Referenz: Design-Canvas
„Evolvera – Mobile first“ (Seiten _Mobil_ 01–07 und _Desktop_ D1–D6).

---

## 0. Regeln für die Umsetzung (zuerst lesen)

Diese Regeln gehen jeder Gestaltungsvorgabe unten vor. Bei Konflikt gilt `AGENTS.md`.

1. **Nur Gestaltung, keine neuen Funktionen.** Dieses Dokument ändert Layout, Typografie,
   Farben und Komponenten der bestehenden Shell. Es startet keine Phase, keine Serie und
   keine Generierung.
2. **Kunst bleibt unangetastet.** Werke werden weiterhin ausschließlich über
   `ArtStage`/`ArtRenderer` gerendert. Die CSS-Kompositionen im Mockup sind _Platzhalter_
   und dürfen **nicht** als Kunst übernommen werden. Renderer-Referenzbilder unter
   `tests/browser/references/` dürfen sich nicht ändern.
3. **Keine `img`, `svg` oder `canvas` in der Shell.** Der Browsertest prüft
   `page.locator('img, svg, canvas')` auf 0. Icons daher nur als Textzeichen oder CSS
   (Abschnitt 7.16).
4. **Keine externen Ressourcen.** Schriften lokal einbinden (Abschnitt 3.1), keine CDNs.
5. **Mockup-Daten sind erfunden.** Generationsnummern, Daten, Titelzuordnung, Merkmalswerte,
   Countdown, `[GITHUB-NAME]`, `[REVISION]`, `[SEED DES WERKS]` stammen nicht aus dem Archiv.
   In der Umsetzung kommen alle Inhalte aus Archiv, Konfiguration und bestehenden
   Komponenten (`WorkProvenance`, `modeLabels`, `initialSettings`, `operatorSettings`).
6. **Anmeldung nicht vortäuschen.** Der An-/Abmelden-Umschalter im Mockup ist nur eine
   Prototyp-Simulation. Die echte Seite behält die bestehende Logik
   (`operatorSettings.adminOrigin`, deaktivierter Button, Hinweistext).
7. **Generierungsschalter sind ein Entwurf.** Die Schalter „Verläufe, Linien, Kurven, per
   Code generierte Formen“ (Einstellungen 02) gibt es im Generator noch nicht. Nicht
   umsetzen, solange kein eigener Betreiberauftrag vorliegt. Höchstens als deaktivierte,
   klar beschriftete Vorschau („in Vorbereitung“), wenn ausdrücklich gewünscht.
8. **Leer- und Vor-Serienstart-Zustände bleiben.** Solange keine offiziellen Werke
   existieren, zeigt „Heute“ die bestehende Startseite („Form wird Zukunft.“, leere Bühne,
   Serieninfo). Das Layout „Werk des Tages“ (7.7 ff.) gilt, sobald ein Werk vorliegt.
   Texte, auf die Tests prüfen, nicht ändern.
9. **Barrierefreiheit und bestehendes Verhalten erhalten:** Skip-Link, Fokus auf `main`
   nach Seitenwechsel, `aria-current`, Escape schließt das mobile Menü, Seitenwechsel
   schließt es, Navigationsnamen `Hauptnavigation` / `Mobile Hauptnavigation`.
10. **Überschriften-Texte unverändert.** `h1` behält exakt die bisherigen Titel (Tests
    prüfen `exact: true`). Großschreibung nur per `text-transform`. Zeilenumbrüche in
    Titeln nur mit Leerzeichen vor `<br>` (z. B. `Über <br>Evolvera`) oder per CSS. Keine
    Trennzeichen in den Text einfügen (z. B. „Einstel–lungen“ nur optisch über
    `hyphens: auto` mit `lang="de"` oder kleinere Schrift).
11. **Prüfen:** nach jedem Arbeitspaket `npm run check` und `npm run test:browser`;
    zusätzlich Sichtprüfung bei 320, 390, 768, 1024 und 1440 CSS-Pixeln ohne
    horizontalen Überlauf.

---

## 1. Gestaltungsprinzipien

- **Das Werk zuerst.** Jede Seite hat genau eine Bühne. UI ist Papier und Tinte, Farbe
  gehört der Kunst. Zinnoberrot ist das einzige UI-Signal.
- **Redaktionell statt App-haft.** Große, schmale Versal-Titel; Haarlinien als
  Abschnittstrenner; Mono-Etiketten für Metadaten.
- **Herkunft sichtbar machen.** Eltern, Vererbung und Titel-DNA werden gezeigt, nicht nur
  beschrieben (Klammer-Diagramm, Zopf, Fragment-Markierung).
- **Mobile first, Daumen zuerst.** Wichtige Aktionen unten und groß (≥ 44 px), auf Mobil
  eine schwebende Navigationsleiste.
- **Ehrlich und ruhig.** Keine dekorativen Verläufe im UI, keine Schatten, keine Emoji.

---

## 2. Design-Tokens

In `src/styles/shell.css` den bestehenden `:root`-Block ersetzen bzw. erweitern.
Bestehende Variablennamen (`--muted`, `--accent`, `--border`, `--paper`, `--ink`,
`--display-accent`) bleiben als Aliase erhalten, damit vorhandene Regeln weiter greifen.

```css
:root {
  /* Farbe – Grund */
  --paper: #eeeae2; /* Seitengrund */
  --paper-raised: #f6f2e9; /* Felder, Karten, aktive Auswahl */
  --ink: #181919; /* Text, Linien, dunkle Flächen */
  --ink-soft: #575950; /* Sekundärtext, Labels */
  --rule: #181919; /* Abschnittslinien 1px */
  --rule-soft: #bdbbb2; /* Listentrenner (nur Deko) */
  --rule-faint: #8f8d84; /* Hilfslinien in Diagrammen (nur Deko) */

  /* Farbe – Akzent */
  --accent: #c83920; /* Zinnoberrot: Flächen, Display-Text ≥ 24px */
  --accent-text: #a92d18; /* Zinnoberrot für kleinen Text auf Papier */
  --accent-on-dark: #e2553b; /* Akzent auf --ink */
  --accent-soft: #e39a8a; /* inaktive Diagrammbögen (nur Deko) */
  --on-accent: #ffffff; /* Text auf --accent */

  /* Farbe – auf Dunkel */
  --on-ink: #f6f2e9;
  --on-ink-soft: #bdbbb2;
  --on-ink-body: #d9d5cc;
  --rule-on-ink: #4a4b46;

  /* Farbe – Status */
  --success: #1f6b34;
  --live: #7fd18b; /* Punkt „angemeldet“, nur Deko */

  /* Titel-DNA-Markierung (Fragmentherkunft) */
  --dna-a: #9fd3d8; /* Elternteil A */
  --dna-b: #3f57d6; /* Elternteil B */

  /* Aliase für bestehende Regeln */
  --muted: var(--ink-soft);
  --border: var(--rule-soft);
  --display-accent: var(--accent);

  /* Schrift */
  --font-sans: 'Archivo', Arial, Helvetica, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, 'Courier New', monospace;
  --stretch-display: 62%; /* Titel, Ziffern */
  --stretch-heading: 75%; /* h2/h3 */
  --stretch-brand: 125%; /* Wortmarke */

  /* Abstände (4er-Raster) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-14: 56px;
  --space-16: 64px;
  --space-26: 104px;
  --gutter: clamp(16px, 4vw, 64px);
  --section-gap: clamp(56px, 8vw, 104px);

  /* Form */
  --radius-pill: 999px;
  --radius-sm: 4px;
  --line: 1px;
  --line-strong: 1.5px;
  --focus: 3px solid var(--accent);
  --focus-offset: 4px;

  /* Maße */
  --container: 1440px;
  --touch: 44px;
  --control-h: 52px; /* Formfelder, Sekundärbuttons */
  --cta-h: 56px; /* Primäraktionen Mobil; Desktop 60px */
  --dock-h: 68px; /* Mobile Navigationsleiste inkl. Innenabstand */

  /* Bewegung */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --dur-fast: 120ms;
  --dur: 220ms;
}
```

### 2.1 Kontrast (WCAG 2.1, geprüft)

| Vordergrund                                    | Hintergrund | Verhältnis  | Einsatz                                       |
| ---------------------------------------------- | ----------- | ----------- | --------------------------------------------- |
| `--ink` #181919                                | `--paper`   | 14,7 : 1    | Fließtext, alles                              |
| `--ink-soft` #575950                           | `--paper`   | 5,9 : 1     | Sekundärtext, Labels                          |
| `--accent-text` #a92d18                        | `--paper`   | 5,7 : 1     | kleiner Akzenttext                            |
| `--accent` #c83920                             | `--paper`   | **4,3 : 1** | **nur ≥ 24 px / fett ≥ 18,7 px** oder Flächen |
| `--on-accent` #fff                             | `--accent`  | 5,2 : 1     | Text auf roten Buttons                        |
| `--on-ink` #f6f2e9                             | `--ink`     | 15,8 : 1    | Text auf Dunkel                               |
| `--on-ink-soft` #bdbbb2                        | `--ink`     | 9,2 : 1     | Labels auf Dunkel                             |
| `--accent-on-dark` #e2553b                     | `--ink`     | 4,7 : 1     | Akzent auf Dunkel                             |
| `--success` #1f6b34                            | `--paper`   | 5,5 : 1     | Status „gespeichert“                          |
| `--rule-soft`, `--rule-faint`, `--accent-soft` | `--paper`   | < 3 : 1     | **nie für Text oder einzige Bedeutung**       |

Regel: `--accent` nie für Text unter 24 px. Dafür `--accent-text` verwenden.

---

## 3. Typografie

### 3.1 Schriften (lokal, Lizenz SIL OFL 1.1)

- **Archivo** als variable Schrift mit Achsen `wght` (100–900) **und `wdth` (62–125)**.
  Die Breitenachse ist Pflicht, sie trägt den Look.
- **IBM Plex Mono** 400 und 500.

Einbindung ohne externe Ressourcen, z. B. per Fontsource (`@fontsource-variable/archivo`
mit der Datei, die die `wdth`-Achse enthält, und `@fontsource/ibm-plex-mono`) oder als
`woff2` unter `public/fonts/` mit eigenem `@font-face`. Vor dem Einbau prüfen, dass die
gewählte Datei die `wdth`-Achse wirklich enthält. Die neue Abhängigkeit in der
Projektdokumentation begründen. `font-display: swap`. Fallback bleibt Arial.

```css
@font-face {
  font-family: 'Archivo';
  src: url('/evolvera/fonts/Archivo-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-stretch: 62% 125%;
  font-display: swap;
}
```

(Pfad an `base` aus `vite.config.ts` anpassen.)

### 3.2 Rollen

| Rolle                    | Familie | Größe Mobil → Desktop       | Gewicht | Breite | Zeilenhöhe | Sonstiges                                                                              |
| ------------------------ | ------- | --------------------------- | ------- | ------ | ---------- | -------------------------------------------------------------------------------------- |
| Display (h1 Seitentitel) | sans    | `clamp(84px, 13vw, 232px)`  | 900     | 62 %   | 0,82       | Versalien, `letter-spacing: -0.02em`, max. 2 Zeilen                                    |
| Werktitel (h1 Werk)      | sans    | `clamp(60px, 9.5vw, 164px)` | 850–900 | 62 %   | 0,84–0,88  | Versalien, zweite Zeile optional in `--accent`                                         |
| Kapitelziffer            | sans    | 64–72 px → 96 px            | 900     | 62 %   | 0,8        | `--accent`, `aria-hidden`                                                              |
| h2 Abschnitt             | sans    | 28–30 px → 34–36 px         | 800     | 75 %   | 1          | `letter-spacing: -0.02em`                                                              |
| h3 / Kartentitel         | sans    | 18–20 px → 22 px            | 800     | 75 %   | 1,05       |                                                                                        |
| Lead                     | sans    | 17 px → 20–21 px            | 500     | 100 %  | 1,4–1,5    | `max-width: 34–40ch`                                                                   |
| Fließtext                | sans    | 15–16 px → 17 px            | 400     | 100 %  | 1,6        |                                                                                        |
| Werktitel in Karten      | sans    | 15–17 px                    | 700     | 100 %  | 1,15       |                                                                                        |
| Label / Meta (Etikett)   | mono    | 10–12 px                    | 400–500 | –      | 1,5        | Versalien, `letter-spacing: 0.06–0.12em`, Farbe `--ink-soft`                           |
| Datenwert (Seed, Hex)    | mono    | 13 px                       | 400     | –      | 1,4        | `overflow-wrap: anywhere`                                                              |
| Countdown-Ziffern        | sans    | 64 px → 88 px               | 800     | 62 %   | 1          | `font-variant-numeric: tabular-nums`                                                   |
| Wortmarke                | sans    | 26 px → 34 px               | 850     | 125 %  | 1          | Kleinbuchstaben, `letter-spacing: -0.05em`, gefolgt von „↗“ in `--accent`, Gewicht 400 |
| Footer-Wortmarke         | sans    | `clamp(38px, 6vw, 88px)`    | 850     | 125 %  | 1          | „evolvera.“                                                                            |

Regeln:

- Ein Display-Titel pro Seite. Zweite Zeile oder letzte Silbe darf `--accent` tragen
  (z. B. „Gale**rie**“, „Evo**lution**“, „Über **Evolvera**“).
- Mono nie für Fließtext, nur für Etiketten, Daten und Zähler.
- Keine Schrift unter 10 px. Interaktive Beschriftungen mindestens 14 px.

---

## 4. Layout und Raster

### 4.1 Breakpoints (mobile first, `min-width`)

| Name | ab      | Verhalten                                                                                          |
| ---- | ------- | -------------------------------------------------------------------------------------------------- |
| base | 0       | einspaltig, Dock unten, Header mit Menü-Knopf                                                      |
| `sm` | 640 px  | Galerie zweispaltig, Karten nebeneinander                                                          |
| `md` | 1000 px | Desktop-Navigation sichtbar, Dock und mobiles Menü ausgeblendet, zweispaltige Hero-/Detail-Layouts |
| `xl` | 1440 px | Container-Maximum erreicht                                                                         |

Die bestehenden `max-width`-Media-Queries (1000 / 520 / 600) schrittweise auf diese
`min-width`-Logik umstellen. Wo es reicht, intrinsische Raster statt Breakpoints:
`grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr))`.

### 4.2 Container und Abstände

- Container: `max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter)`.
- Abschnittsabstand: `var(--section-gap)` (56 px Mobil → 104 px Desktop).
- Abschnittskopf: `border-top: 1px solid var(--rule); padding-top: 12–14px`.
- Mobil: Seitenränder 16 px; Inhalt darf nie horizontal überlaufen (ab 320 px).
- Mobil unten `padding-bottom: calc(var(--dock-h) + 32px)` auf `main`, damit das Dock
  nichts verdeckt; `env(safe-area-inset-bottom)` berücksichtigen.

### 4.3 Seitenraster Desktop

- Hero / Detail: zwei Spalten per `display: flex; flex-wrap: wrap`, links `flex: 1.3 1 560px`
  (Bühne), rechts `flex: 1 1 400px` (Text). Gap 48–64 px.
- Drei-Spalten-Band: `repeat(auto-fit, minmax(min(100%, 340px), 1fr))`, Gap 48 px.
- Galerie: 4 Spalten (`md`), 2 (`sm`), 1 (base); Hervorhebung `grid-column: span 2; grid-row: span 2`
  ab `sm`.
- Inhaltsseite mit Verzeichnis: `nav` `flex: 1 1 220px`, Inhalt `flex: 999 1 640px`
  (Verzeichnis rutscht auf Mobil nach oben, **nicht sticky**).

---

## 5. Farbe im Einsatz

- **Papier** ist Standardgrund; **Papier hell** (`--paper-raised`) für Formularfelder,
  aktive Auswahlkarten, Hinweisboxen.
- **Tinte-Fläche** (`--ink`): Preview-Leiste, Countdown, Dock, Menü-Overlay,
  „Stand dieser Vorschau“, ausgewählte Werkkarte in der Evolution.
- **Zinnoberrot**: Primärbutton, aktiver Navigationspunkt (Unterstreichung 2 px bzw.
  Dock-Pille), Generation-Aufkleber, Kapitelziffern, Hervorhebung „ausgewähltes Werk“
  (`outline: 2–3px solid var(--accent); outline-offset: 4px`), Elternteil-B-Bogen.
- Elternteil A = Tinte, Elternteil B = Zinnoberrot (überall gleich: Tags, Linien, Bögen).

---

## 6. Bewegung

- Nur Zustandswechsel animieren: Schalter, Menü-Overlay (Einblenden, 220 ms), Hover von
  Links (Farbe). Keine Dauerbewegung im UI; Bewegung gehört der Kunst.
- `@media (prefers-reduced-motion: reduce)`: alle UI-Übergänge aus (bestehende Regel
  erweitern).

---

## 7. Komponenten

Je Komponente: Zweck · Aufbau · Maße · Zustände · Barrierefreiheit · Bezug im Code.

### 7.1 Preview-Leiste

Tinte-Fläche ganz oben, Mono 10 px, Versalien, `letter-spacing: 0.08em`, Text `--on-ink`,
Padding 10–12 px. Links „Evolvera · Täglich neu“ bzw. „· Testversion“, rechts
„HTML + CSS / …“. Bestehend: `.preview-bar` – nur Typo/Abstände anpassen, Texte bleiben
logikgesteuert.

### 7.2 Header

Mobil: Wortmarke links, Menü-Knopf rechts (Pille, 44 px hoch, 1 px Tinte-Rahmen,
„Menü“ + CSS-Icon). Desktop (`md`): Wortmarke links, Navigation rechts, `flex-wrap`.
Unterkante 1 px `--rule`. Bestehend: `.site-header`, `.brand`, `.brand-dot`.

### 7.3 Desktop-Navigation

Links 15 px, Gewicht 600, `min-height: 44px`, Abstand 28 px. Aktiv:
`border-bottom: 2px solid var(--accent)` über `aria-current="page"`. Reihenfolge:
Heute · Galerie · Evolution · Über Evolvera · Einstellungen · Testatelier.
Bestehend: `.desktop-navigation`.

### 7.4 Mobiles Menü (Overlay)

Weiterhin `<details class="mobile-navigation">` mit `<summary>` (Tests!). Geöffnet:
Vollfläche in Tinte über der Seite (`position: fixed; inset: 0`), Inhalt:

- Kopf: Wortmarke + Schließen-Knopf (44 × 44, Kreis, Icon „×“). Schließen = `open` entfernen.
- Nummerierte Liste: Mono-Nummer 11 px `--on-ink-soft` + Eintrag. Hauptpunkte (Heute,
  Galerie, Evolution, Über Evolvera) Display 52 px / 900 / 62 % / Versalien; Nebenpunkte
  (Einstellungen, Testatelier) 26 px / 700 / 75 %, rechts Mono-Hinweis („Betreiber“,
  „Studien“). Zeilen ≥ 56 px, Trenner `--rule-on-ink`. Aktiv in `--accent-on-dark`.
- Info-Raster (Mono): Rhythmus, Modus kommender Werke – aus Konfiguration.
- Fuß: Claim + Impressum/Datenschutz.
  Verhalten unverändert: Escape schließt und fokussiert `summary`, Linkklick schließt,
  Fokus springt auf `main`. Beim Öffnen `body` nicht scrollen lassen.

### 7.5 Mobiles Dock (neu, nur base/`sm`)

Schwebende Leiste unten: `position: fixed; left: 16px; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom))`,
Tinte-Fläche, `border-radius: var(--radius-pill)`, Padding 6 px, Gap 4 px.
Vier gleich breite Ziele à 56 px Höhe: Heute · Galerie · Evolution · Menü.
Je Ziel: CSS-Icon (18 px) über Mono-Label 10 px Versalien. Aktiv: Pille in `--accent`,
Text `--on-accent`. „Menü“ ist ein `<button>`, das das bestehende `<details>` öffnet
(`aria-expanded` spiegeln).
`<nav aria-label="Schnellnavigation">` – **nicht** „Hauptnavigation“ nennen, damit die
Tests eindeutig bleiben. Ab `md` ausgeblendet.

### 7.6 Buttons und Links

| Variante                                                                                          | Aussehen                                                                               | Höhe                       | Einsatz                               |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------- |
| Primär                                                                                            | Pille, Fläche `--accent`, Text `--on-accent` 16–18 px / 700, Pfeil „↗“ oder „→“ rechts | 56 px Mobil, 60 px Desktop | eine pro Bildschirmbereich            |
| Sekundär                                                                                          | Pille, 1 px Tinte-Rahmen, transparent, 600                                             | 52–56 px                   | Nebenaktionen                         |
| Dunkel                                                                                            | Pille/Rechteck, Fläche `--ink`, Text `--on-ink`                                        | 48–56 px                   | „Finden“, „Mit GitHub anmelden“       |
| Textlink                                                                                          | unterstrichen, `text-underline-offset: 0.3em`                                          | min. 44 px Trefferfläche   | „Alle Werke →“                        |
| Icon-Knopf                                                                                        | Kreis 44 × 44, 1 px Rahmen                                                             | 44 px                      | Teilen, Schließen; immer `aria-label` |
| Mobil stehen Primär/Sekundär untereinander in voller Breite mit `justify-content: space-between`. |
| Disabled: Rahmen `--rule-soft`, Text `--ink-soft`, `cursor: not-allowed`.                         |
| Fokus überall `outline: var(--focus); outline-offset: var(--focus-offset)`.                       |
| Bestehend: `.primary-link`, `.text-link`, `button`.                                               |

### 7.7 Chips, Badges, Tags

- **Info-Chip:** Mono 11–12 px Versalien, Padding 6–7 × 12–14 px, Pille, 1 px Rahmen
  (z. B. Datum, Modus). Variante gefüllt in Tinte (z. B. „Generation 12“).
- **Badge:** eckig, Mono 10 px, Fläche Tinte („Standard“, „Vor Serienstart“) oder
  `--accent` („Nachgeholt“, „Neu“).
- **Eltern-Tag:** Kreis 26–28 px mit „A“/„B“ (Rahmen) bzw. eckiger Tag
  „A“ in Tinte / „B“ in `--accent`.
  Bestehend: `.badge` (anpassen).

### 7.8 Filter-Chips

`<div role="group" aria-label="Nach Vererbungsmodus filtern">` mit `<button aria-pressed>`.
Pille 44 px hoch, 15 px / 600. Aus: transparent + Rahmen. An: Fläche Tinte, Text
`--on-ink`. Mobil horizontal scrollbar (`overflow-x: auto`), Desktop umbrechend.
Optionen: Alle · Nachvollziehbar · Maximale Freiheit. Zustand in URL-Parameter, damit
Direktlinks funktionieren. _Nur umsetzen, wenn Filtern zum Auftrag gehört; sonst Gestaltung
für vorhandene Steuerelemente übernehmen._

### 7.9 Formularfelder

Label darüber in Mono 11 px Versalien `--ink-soft`. Feld 48–52 px, eckig,
1 px Tinte-Rahmen, Fläche `--paper-raised`, Eingabe in Mono 16 px (kein Zoom auf iOS).
Danebenliegender Aktionsknopf „Finden“ (Dunkel). Select gleich, Text sans 16–17 px / 600.
Bestehend: `.gallery-search`, `.evolution-picker`, `.collection-bar`, `.chain-controls`.

### 7.10 Werkbühne (Stage)

Rahmen um `ArtStage`:

- Außenabstand 10 px (Mobil) / 16 px (Desktop), darin vier **Schnittmarken** an den Ecken:
  14 × 14 bzw. 20 × 20 px, nur zwei Seiten je Ecke mit 1 px Tinte
  (`::before/::after` an Wrapper + zwei Kind-Elemente oder vier `span aria-hidden`).
- **Generation-Aufkleber** oben rechts, überlappend: Kreis 78 px (Mobil) / 120 px (Desktop),
  Fläche `--accent`, `transform: rotate(-12deg)`, oben Mono „Gen.“ 10–12 px, darunter
  Ziffer dreistellig („012“) Display 28/44 px. `aria-hidden` – Generation steht zusätzlich als Text.
- **Etikett** unten links auf der Bühne: Fläche `--paper`, Mono 10–11 px Versalien,
  z. B. „Nur HTML + CSS“.
- Format: Heute 1 : 1; Werkdetail 4 : 5; Werk nie beschneiden, wenn der Renderer ein
  anderes Seitenverhältnis verlangt – dann gilt der Renderer.
  Leer-Bühne (vor Serienstart) behält bestehenden Inhalt, bekommt Schnittmarken und
  gestrichelte Innenfläche. Bestehend: `.home-stage`, `.stage`, `.stage-mark`, `.caption`.

### 7.11 Werkkarte

Link-Block: Vorschau (4 : 5, Galerie-Hervorhebung 1 : 1) → Mono-Zeile
„Nº 012 · 02.11.2026“ → Titel 15–19 px / 700 → Modus als Mono-Label.
Gap 8–10 px. Hover: Titel `--accent-text`. Gesamte Karte ist ein `<a>`.
Galerie-Hervorhebung (neuestes Werk der Ansicht): doppelte Breite/Höhe, Titel als Display
`clamp(34px, 4vw, 60px)` / 900 / 62 % / Versalien, Meta-Zeile mit Modus rechts.
Mobil: Hervorhebung voll breit, darunter zwei versetzte Spalten (rechte Spalte
`padding-top: 56px`, Seitenverhältnisse abwechselnd 4 : 5 / 1 : 1).
„Zuletzt“-Reihe Mobil: horizontaler Scroller, Karten 150 px, `scroll-snap-type: x mandatory`.
Bestehend: `.archive-card`, `.card-meta`, `.card-mode`, `.archive-grid`, `.related-card`.

### 7.12 Abschnittskopf und Kapitelziffer

Kopf: 1 px Linie oben, darunter h2 links, optional Mono-Meta rechts (baseline-ausgerichtet).
Kapitel (Über, Einstellungen): große Ziffer „01“ in `--accent` links unten ausgerichtet
neben h2 (`display: flex; align-items: flex-end; gap: 14–16px`).

### 7.13 Eltern-Diagramm („Klammer“)

Zwei Elternvorschauen (A links, B rechts, gleich groß) → darunter Klammer:
Element mit `border: 1.5px solid var(--ink); border-top: none; height: 20–28px`,
Breite = Abstand der beiden Vorschau-Mitten → Stiel `1.5px × 20–28px` mittig →
Kind-Element (Pille mit kleiner runder Vorschau + Mono „Heute · Gen. 12“ oder
Vorschau 72–96 px mit Rot-Outline). Mono-Label unter jeder Elternvorschau
„A · Gen. 11 · 01.11.“. Diagrammteile `aria-hidden`, Beziehung zusätzlich als Text.
Ursprungswerke (Gen. 1–2): statt Klammer der Text aus `WorkProvenance`.

### 7.14 Vererbungsliste („Was weiterlebt.“)

Gestaltung für das bestehende `ol.inheritance-proofs` aus `WorkProvenance`:
Zeile 14 px Padding, Trenner `--rule-soft`; links Eltern-Tag (A/B, Kreis 28 px; „NEU“ in
`--accent` für Ergänzungen), Mitte Text 15 px („**Farbe** #9fd3d8 übernommen“, Werte in
Mono 13 px), rechts 28-px-Vorschau des Merkmals (Farbfeld bei Farben, gedrehter Strich bei
Drehung, Balken bei Breite). Vorschau `aria-hidden`. „Beleg ansehen“ bleibt `<details>`.

### 7.15 Titel-DNA

Wenn `work.titleDna.parentFragments` vorhanden: Fragment im Werktitel mit
`box-shadow: inset 0 -0.13em 0 var(--dna-a | --dna-b)` unterstreichen, darunter Legende in
Mono („„Iri“ von A“, „„Azur“ von B“) mit 16 × 4 px Farbbalken. Ohne Fragmente keine Markierung.
Fragmentzuordnung zu A/B nur aus den Daten, nie raten.

### 7.16 Icons (nur CSS/Text, kein SVG)

Strichstärke 1,5 px, Größe 16–18 px, Farbe `currentColor`.

- Menü: zwei waagerechte Balken (`::before/::after`, Abstand 6 px).
- Schließen: zwei um ±45° gedrehte Balken.
- Heute: Kreis (Rahmen) über Horizontlinie.
- Galerie: 2 × 2 Quadrate (Rahmen) per `grid`.
- Evolution: zwei Kreise oben, ein Kreis unten, verbunden – vereinfacht als drei Punkte im Dreieck.
- Pfeile, Plus, Minus, Fragezeichen als Textzeichen: ↗ → ← + − ?
  Alle Icons `aria-hidden="true"`; Knöpfe ohne sichtbaren Text brauchen `aria-label`.

### 7.17 Countdown-Block

Nur wenn `generationEnabled` und ein nächster Lauf feststeht. Tinte-Fläche,
Padding 20–28 px, `border-radius: var(--radius-sm)`. Mono-Label „Generation 13 entsteht in“
(`--on-ink-soft`), Ziffern hh:mm:ss Display 64/88 px tabellarisch, Satz mit Rhythmus und
Eltern (`--on-ink-body`). Berechnung auf Europe/Berlin (04:00), Aktualisierung höchstens
sekündlich, `aria-live="off"` (Zahl nicht vorlesen; zusätzlich statischer Text
„täglich ab 04:00 Uhr Berliner Zeit“). Ohne aktive Serie: stattdessen bestehender Block
„Die erste Seite ist noch offen.“ im selben Stil.

### 7.18 Zopf (Evolution)

Darstellung der Abstammung: Jedes Werk ab Gen. 3 hat A = n−1 (gerade Linie) und B = n−2 (Bogen).
**Mobil – senkrecht**, neueste oben, Zeilenhöhe 96 px:

- Knotenspalte 80 px, Vorschau 44 × 44 px bei x = 18 px (Mitte x = 40).
- Grundlinie: `1.5px` breit bei x = 39 von erster bis letzter Knotenmitte, `--rule-faint`.
- Bögen für Zeile i → i+2: Höhe 192 px, Breite 15 px, abwechselnd links (gerade i:
  `left: 4px`, Rahmen ohne rechts, `border-radius: 18px 0 0 18px`) und rechts (ungerade i:
  `left: 61px`, ohne links, `border-radius: 0 18px 18px 0`), Farbe `--accent-soft`.
- Ausgewähltes Werk: Zeile `--paper-raised`, Vorschau mit Rot-Outline; sein A-Segment 3 px
  Tinte, sein B-Bogen 3 px `--accent`. Eltern-Zeilen tragen Tag „A“/„B“ rechts.
- Linien `z-index: 1`, Vorschauen `z-index: 2`, damit Hintergründe nichts verdecken.
  **Desktop – waagerecht**, älteste links, Abstand 160 px, Knoten 96 px, Spur 380 px hoch
  in `overflow-x: auto` (`role="region"`, `aria-label`, `tabindex="0"`):
- Knotenmitte x = 80 + 160·i, y = 150. Grundlinie 2 px bei y = 149.
- Bögen i → i+2: Breite 320 px, Höhe 50 px; gerade i oben (`top: 52px`, ohne unten,
  `border-radius: 160px 160px 0 0 / 50px 50px 0 0`), ungerade i unten (`top: 198px`, ohne oben,
  gespiegelt).
- Beschriftung unter den Knoten ab y = 264, 150 px breit, zentriert.
  Darunter: Legende (A = Tinte-Linie, B = roter Bogen), Hinweis
  „… bis Generation 1 + 2 · Ursprungswerke“, auf Desktop drei Karten (ausgewählt in Tinte,
  Elternteil A, Elternteil B). Jeder Knoten/jede Beschriftung verlinkt auf `/werk/:date`.
  Die Liste bleibt semantisch ein `<ol>`; das Geflecht ist rein dekorativ (`aria-hidden`).
  Bestehende Logik (`evolution-picker`, Eltern/Nachfolger aus `WorkContext`) bleibt Quelle.

### 7.19 Werkdaten

`<details open>` mit `summary` „Werkdaten“ (18–19 px / 700, Zeichen „−/+“ rechts),
Linie oben/unten. Darin `dl` als Raster `repeat(auto-fill, minmax(min(100%, 180px), 1fr))`,
`dt` Mono 10 px Versalien `--ink-soft`, `dd` 15 px. Seed in Mono 13 px.
Felder und Texte exakt wie bisher in `ArchivePages.tsx`.

### 7.20 Leerzustände

Gestrichelter Rahmen 1,5 px Tinte, Padding 18–20 px, links 52–56 px gestricheltes Quadrat
mit „?“, rechts Satz. Für: „Direkte Nachfolger“, leere Galerie, keine Treffer.
Fehler (`role="alert"`) bleiben im bestehenden `.notice`-Stil, aber mit 1 px Tinte-Rahmen
und Mono-Label „Fehler“ in `--accent-text`.

### 7.21 Auswahlkarten (Modus)

`fieldset` + `legend` (Mono-Label). Je Option `<label>` als Karte (Padding 16–20 px)
mit nativem `input type="radio"` (`accent-color: var(--accent)`, 20 px), Titel 18–20 px / 800 / 75 %,
Beschreibung 14 px `--ink-soft`. Gewählt: `2px solid var(--accent)`, Fläche `--paper-raised`;
sonst `1px solid var(--ink)`. Desktop nebeneinander (`auto-fit, minmax(260px, 1fr)`).
Solange der Betreiberzugang nicht verbunden ist: Karten sichtbar, `disabled`, mit Hinweis.

### 7.22 Schalter

`<button aria-pressed>` über die ganze Zeile/Karte (Name = sichtbarer Text).
Spur 52 × 30 px, Rahmen 1,5 px Tinte, Knopf 21 px. An: Spur Tinte, Knopf Papier, rechts.
Aus: Spur transparent, Knopf Tinte, links. Links daneben 44–56 px Vorschaufeld.
Zähler „3 von 4 aktiv“ als `role="status"`. (Nur Gestaltungsvorlage, siehe Regel 0.7.)

### 7.23 Speicherleiste

Pille mit 1 px Rahmen, links Status (Mono 11 px: „Alles gespeichert“ `--ink-soft`,
„Ungespeicherte Änderungen“ `--accent-text`, „Gespeichert · gilt ab Generation n“ `--success`;
`role="status"`), rechts „Verwerfen“ (Sekundär) und „Speichern“ (Primär, 48 px).
Mobil `position: sticky` oberhalb des Docks (`bottom: calc(var(--dock-h) + 28px)`).

### 7.24 Anmeldestatus (Betreiber)

Nur wenn eine echte Sitzung besteht: Tinte-Pille mit grünem Punkt (Deko), Mono
„Angemeldet · <Name>“, Knopf „Abmelden“ (Rahmen `--on-ink`). Sonst die bestehende Karte
„Geschützter Betreiberzugang“ mit Button laut `operatorSettings`.

### 7.25 Footer

Linie oben, Wortmarke „evolvera.“ groß, Claim „Ein Experiment mit offenem Ausgang.“,
`nav aria-label="Rechtliche Informationen"` mit Impressum/Datenschutz (44 px Trefferfläche),
Mono-Zeile Serienstatus. Desktop `flex-wrap`, Elemente unten ausgerichtet.

---

## 8. Seiten-Blueprints

Reihenfolge der Blöcke von oben nach unten. „→ D“ = Abweichung auf Desktop (`md`).

**Heute `/`** (mit Werk)

1. Preview-Leiste, Header.
2. Meta-Zeile (Mono): „Heute · <Wochentag Datum>“ | „04:00 Berlin“. → D: drei Spalten mit Kicker.
3. Werkbühne 1 : 1 mit Aufkleber. → D: rechte Spalte.
4. Mono „Werk des Tages“, Werktitel (h1), Chips (Modus, Generation), Lead, CTAs
   „Herkunft ansehen ↗“ (Primär) und „Werk im Detail →“. → D: linke Spalte, unten ausgerichtet.
5. Die Eltern (7.13). 6. Was weiterlebt. (7.14). 7. Countdown (7.17). → D: 5–7 als Drei-Spalten-Band.
6. Zuletzt (Scroller / → D: 4er-Raster). 9. Footer. Mobil: Dock.
   Vor Serienstart: bestehender Inhalt (Kicker, „Form wird Zukunft.“, leere Bühne, Serieninfo)
   im neuen Stil, Reihenfolge wie 2–4.

**Galerie `/galerie`**: Mono-Kicker „Archiv · neueste zuerst“ → Display „Galerie“ →
Lead → Filter → Datumssuche → Zählerzeile (`role="status"`) → Hervorhebung + Raster →
Pagination (Pillen „← Neuer“ / „Älter →“). → D: Titel links, Lead + Suche rechts;
Filter und Zähler in einer Leiste zwischen zwei Linien.

**Werk `/werk/:date`**: Kopf mit „← Galerie“ (Sekundär), Mono „Nº 012“, Teilen-Icon-Knopf →
Bühne 4 : 5 volle Breite → Eyebrow → Titel mit Titel-DNA → Chips → Aktionen →
Was weiterlebt (Diagramm + Liste) → Werkdaten → Direkte Nachfolger. → D: Bühne links
(`flex 1.3`), alles andere rechts; Diagramm und Liste nebeneinander.

**Evolution `/evolution`**: Kicker „Woher etwas kommt“ → Display „Evolution“ → Lead →
Werkwahl (Select) → Legende → Zopf (7.18) → Ursprungshinweis. → D: Titel links,
Lead + Select rechts; waagerechter Zopf; drei Karten.

**Über `/ueber`**: Kicker → Display „Über Evolvera“ → Lead (21 px / 500) →
Kapitel-Chips (Sprungmarken) → Kapitel 01–05 mit Ziffer, h2, Text, Illustration in
HTML/CSS (Chips erlaubter/ausgeschlossener Mittel, Ursprung→Kind-Klammer, zwei Modus-Karten,
Zeitleiste mit „Nachgeholt“-Badge) → Kapitel 05 als Tinte-Fläche → CTAs.
Texte aus der bestehenden `About`-Komponente. → D: Verzeichnis links, Kapitel als
Text | Illustration nebeneinander.

**Einstellungen `/einstellungen`**: Kicker „Nur für den Betreiber“ → Display →
Lead → Zugang (7.24) → Status-`dl` (Generierung, Revision, Rhythmus) → 01 Modus (7.21) →
[02 Generierungsschalter – nur nach Auftrag] → Hinweis „gilt ab dem nächsten …“ →
Speicherleiste (nur mit echter Betreiberfunktion). → D: links Titel/Status/Hinweis,
rechts Modus, Schalter, Speicherleiste.

**Testatelier, Impressum, Datenschutz, Kunstsichtung, Evolutionslabor**: übernehmen
Tokens, Typorollen, Header/Footer, Formularfelder und Karten; Layout sonst unverändert.

---

## 9. Barrierefreiheit (Abnahme)

- Kontraste laut 2.1; `--accent` nie als kleiner Text.
- Trefferflächen ≥ 44 × 44 px; Abstand zwischen Zielen ≥ 4 px.
- Alle Steuerelemente nativ (`a`, `button`, `input`, `select`, `details`); keine Klicks auf `div`.
- Sichtbarer Fokus überall (`--focus`), auch im Dock und Overlay; Fokus nie verdecken
  (Dock: `scroll-padding-bottom` auf `html`).
- Deko (Schnittmarken, Aufkleber, Klammer, Zopf, Merkmalsvorschau, Icons) `aria-hidden`.
- Bedeutung nie nur über Farbe: A/B immer zusätzlich als Buchstabe.
- `lang="de"`; Großschreibung nur per CSS.
- `prefers-reduced-motion` respektieren.

---

## 10. Arbeitspakete für die Umsetzung

Jedes Paket einzeln umsetzen, prüfen (`npm run check`, `npm run test:browser`), Stand
in `docs/` ehrlich dokumentieren (was geprüft, was nicht).

1. **Tokens & Schrift:** `:root` aus Abschnitt 2, lokale Schriften (3.1), Typorollen auf
   `h1/h2/p/.eyebrow/.intro` anwenden. _Abnahme:_ keine externen Requests, Schriftbreite
   62 % sichtbar, Tests grün.
2. **Shell:** Preview-Leiste, Header, Desktop-Navigation, Footer (7.1–7.3, 7.25).
3. **Mobile Navigation:** Overlay-Stil für `<details>` (7.4) + Dock (7.5).
   _Abnahme:_ bestehende Menütests grün, bei 320 px kein Überlauf, Dock verdeckt keinen Inhalt.
4. **Bausteine:** Buttons, Chips, Badges, Formularfelder, Leerzustände (7.6–7.9, 7.20).
5. **Heute + Werkbühne** inkl. Vor-Serienstart-Zustand (7.10, 8).
6. **Galerie + Werkkarte** (7.11; Filter nur, wenn beauftragt).
7. **Werkdetail:** Eltern-Diagramm, Vererbungsliste, Titel-DNA, Werkdaten (7.13–7.15, 7.19).
8. **Evolution:** Zopf mobil/desktop (7.18).
9. **Über & Einstellungen** (8; 7.21–7.24 nur im Rahmen bestehender Logik).
10. **Feinschliff:** Breakpoint-Sichtung 320/390/768/1024/1440, Reduced Motion, Kontraste.

Nicht Teil dieser Pakete: Generatorfunktionen, echte Betreiberanmeldung, Serienstart,
Änderungen an Renderer, Archivformat oder Testwerken.
