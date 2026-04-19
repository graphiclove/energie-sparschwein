# Page Brief: Spar-Check

## Rolle im Produkt

Der Spar-Check ist das Hauptprodukt.

Er ist nicht nur ein Rechner, sondern die gefuehrte Einordnungsstrecke fuer den Haushalt.

## Aktueller Stand im Repo

[src/app/spar-check/page.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/spar-check/page.tsx) kombiniert heute:

- Welcome-Step
- Heiztyp-Abfrage
- Gasnutzung
- Flaeche / Personenzahl
- optionalen Stromverbrauch
- Ergebnis innerhalb derselben Route

Staerken:

- relevante Fragen sind schon weitgehend begrenzt
- Daten bleiben in `localStorage`
- Heiztyp-spezifische Logik ist in `src/lib/sparCheck.ts` zentralisiert

Probleme:

- manche Schritte wirken noch wie Formulare statt gefuehrte Produktschritte
- die Sprache ist noch nicht ueberall konsequent beratend
- Vertrauen ist in der Strecke noch zu wenig explizit

## Ziel

Der Spar-Check soll sich anfuehlen wie:

- wenige Fragen
- klare Begruendung
- keine Ueberforderung
- sichtbare Annäherung an eine persoenliche Einordnung

## Primaerer CTA

- `Weiter`

## Sekundaerer CTA

- `Zurueck`

Optional:

- `Ergebnis ansehen`, aber nur wenn es die Strecke verkuerzt und nicht zersplittert

## Trust-Elemente

- Erklaerung, warum genau diese Fragen gestellt werden
- klare Begrenzung der Tiefe
- Hinweis, dass keine Vertragsunterlagen noetig sind
- ruhige Sprache statt "Maximal sparen"-Tonalitaet

## Must-have Components

- Welcome mit Nutzenversprechen
- Schrittanzeige oder Fortschrittslogik
- reduzierte Eingabeschritte
- kontextuelle Hilfestellung pro Schritt
- saubere mobile Bedienbarkeit

## Nicht auf dem Spar-Check selbst

- Anbieterlisten
- Portal-Logik
- breite Tool-Verweise
- visuelle Ablenkungen, die nicht zur Beantwortung der Frage beitragen

## Erfolgsbild

Der Nutzer fuehlt:

- das ist schnell
- das ist fuer mich nachvollziehbar
- ich werde nicht in einen Vergleich geschoben
- am Ende bekomme ich eine echte Einordnung
