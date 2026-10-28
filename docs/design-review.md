# Designvergleich – 28.10.2026

Der Betreiber wünscht eine zeitgemäße, ausdrucksstärkere Gestaltung mit eigenständiger
Typografie, Navigation und Farbgebung. Vor einer Übernahme stehen drei Richtungen
unter `/evolvera/design-concepts/index.html` zur lokalen Auswahl bereit:

- A / Experimentelles Kunstmagazin: große fette Grotesk, Papiergrund, Zinnoberrot,
  redaktionelles Raster mit Text und Werk als Gegenüber.
- B / Digitales Kunstlabor: dunkle Bühne, Monospace-Akzente, Limettengrün,
  instrumentartige Navigation und Metadaten.
- C / Progressive Galerie: helle Bühne, leichte große Grotesk, Ultramarin,
  großzügiges offenes Raster mit werkbetonter Anordnung.

Die Richtungen sind über Buttons und direkte URLs mit `?richtung=editorial`,
`?richtung=labor` oder `?richtung=galerie` vergleichbar. Verwendet werden lokale
Systemschriften ohne externe Ressourcen. Eine konkrete Hausschrift wird nach der
Richtungswahl ausgewählt; dies ist noch keine verbindliche Schriftfreigabe.

Alle Richtungen verwenden dieselbe manuelle HTML-/CSS-Komposition als Layoutstudie.
Sie zählt weder als offizielles Werk noch als eines der 30–50 später abzunehmenden
Testwerke. Es gibt keinen neuen Generator oder Renderer. Das offizielle Archiv,
Konfiguration und Phase-0-Shell bleiben unverändert. Serienstart bleibt offen,
Generierung deaktiviert; Phase 1 ist nicht begonnen.

Die Menülinks führen zu Abschnitten dieser Konzeptseite. Das Einstellungsfenster
beschreibt den späteren Zugang und ermöglicht keine Anmeldung oder Modusänderung.
Am 28.10.2026 hat der Betreiber Richtung A ausdrücklich ausgewählt. Sie ist als
gestalterische Grundlage in die Phase-0-Shell übernommen: Papiergrund, markante
Grotesktypografie, Zinnoberrot, redaktionelles Raster und mobiles Aufklappmenü.
Die Hausschrift nutzt vorerst lokale Systemschriften. Die manuelle Layoutstudie
bleibt nur in der Konzeptseite; die Hauptanwendung zeigt eine leere Kunstbühne.
Die Richtungswahl ist keine Kunstabnahme oder Freigabe einer weiteren Phase.

## Lokale Prüfung am 28.10.2026

`npm run check` erfolgreich: Format, ESLint, Typprüfung, 39 Vitest-Tests,
Datenprüfung (0 offizielle Werke) und Build. `npm run test:browser` mit
freigegebenem Browserstart außerhalb der Sandbox: alle 6 bestehenden Shell-Fälle
in Chromium auf Desktop und Mobil erfolgreich. Die bisherige Ausführungsblockade
ist damit für diesen geprüften Stand aufgehoben; Remote-CI bleibt unausgeführt.

Zusätzliche Prüfung im integrierten Browser: alle drei Designrichtungen bei
320 CSS-Pixeln ohne horizontalen Überlauf, Umschaltung mit aktualisiertem URL-
Parameter und Auswahlzustand, mobiles Menü sowie Öffnen/Schließen des Hinweisdialogs.
Keine img-, svg- oder canvas-Elemente. Keine externen Ressourcen oder neuen
Abhängigkeiten. Die vorhandene Playwright-Suite prüft die Shell; die neuen
Konzeptinteraktionen wurden zusätzlich direkt im Browser geprüft.

## Übernahme von Richtung A

Die bestehenden Hash-Routen, Werkdatenpfade und Leer-/Fehlerzustände bleiben erhalten.
Die Startseite übernimmt den Titel „Form wird Zukunft.“. Die Navigation wird auf
Mobilgeräten über ein natives Details-Menü geöffnet; Escape schließt das Menü, ein
Seitenwechsel schließt es und setzt den Fokus auf den Hauptinhalt.

Nach Übernahme von Richtung A erneut erfolgreich geprüft: `npm run check` mit
39 Tests, Format, Lint, Typprüfung, Datenprüfung und Build. Nach Anpassung der
Navigationsprüfungen bestanden alle 8 Playwright-Fälle auf Desktop und Mobil,
einschließlich Escape, Schließen nach Seitenwechsel, aktiver Navigation und Fokus.
Die übernommene Startseite wurde im integrierten Browser auf Desktop und bei
320 CSS-Pixeln ohne horizontalen Überlauf gesichtet. Keine neuen Abhängigkeiten.
