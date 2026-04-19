# Implementation Plan

## Ziel dieses Plans

Die vorhandene App soll nicht neu gebaut, sondern auf ihren Kern verdichtet werden:

`Startseite -> Spar-Check -> Ergebnis -> sinnvoller naechster Schritt`

Die Reihenfolge unten ist absichtlich produktlogisch und nicht komponentenlogisch.

## Abhaengigkeiten

Der Plan folgt den realen Abhaengigkeiten im Repo:

1. Produktregeln und IA festziehen
2. Startseite auf Kernfunnel ausrichten
3. Spar-Check als Hauptprodukt verdichten
4. Ergebnisseite als Beratungsscreen umbauen
5. Tarif-Vergleich als nachgelagerten Entscheidungsraum scharfstellen
6. Preis-Waechter als echte Nicht-Jetzt-Option klaeren
7. Ratgeber und Vertiefungen konsequent rueck in den Funnel fuehren
8. Navigation und Sekundaerflaechen bereinigen

## Empfohlene Build-Reihenfolge

### Phase 0: Dokumentation und Zielbild

Abhaengigkeit:
- keine

Output:
- `docs/product-principles.md`
- `docs/information-architecture.md`
- `docs/page-briefs/*`

Warum zuerst:
- ohne klares Zielbild wird im aktuellen Repo weiter lokal optimiert statt strukturell verbessert

### Phase 1: Startseite neu priorisieren

Betroffene Bereiche:
- [src/app/page.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/page.tsx)
- ggf. [src/components/Navbar.tsx](/Users/adamdrobiec/energie-sparschwein/src/components/Navbar.tsx)

Abhaengigkeit:
- Phase 0

Ziel:
- Startseite vom Tool-Hub zum Funnel-Einstieg umbauen

Konkret:
- Hero fokussieren
- Spar-Check als klaren Einstieg setzen
- Preis-Waechter als bewusste Nebenoption
- Tarif-Vergleich und Mikro-Tools entdominieren
- Testimonials und Vertrauenselemente in den Funnel stellen, nicht daneben

### Phase 2: Spar-Check als Produktstrecke schaerfen

Betroffene Bereiche:
- [src/app/spar-check/page.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/spar-check/page.tsx)
- [src/lib/sparCheck.ts](/Users/adamdrobiec/energie-sparschwein/src/lib/sparCheck.ts)

Abhaengigkeit:
- Phase 1

Ziel:
- Spar-Check nicht wie Rechner, sondern wie gefuehrtes Produkt wirken lassen

Konkret:
- Schrittlogik reduzieren auf wirklich noetige Inputs
- Copy auf Orientierung statt Zahlenfixierung ausrichten
- Vertrauen bereits in der Strecke verankern
- jeden Screen auf einen primaeren CTA pruefen

### Phase 3: Ergebnis als Beratungsseite bauen

Betroffene Bereiche:
- [src/app/spar-check/page.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/spar-check/page.tsx)
- [src/lib/sparCheck.ts](/Users/adamdrobiec/energie-sparschwein/src/lib/sparCheck.ts)

Abhaengigkeit:
- Phase 2

Ziel:
- Ergebnis von "Ausgabe + Optionen" zu "Einordnung + Empfehlung + Alternative" machen

Konkret:
- persoenliche Einordnung oben
- klare Diagnose
- genau ein empfohlener naechster Schritt
- ruhige Alternative
- Preis-Waechter als Nicht-Jetzt-Weg
- kompakter Vertrauensblock

### Phase 4: Tarif-Vergleich neu einordnen

Betroffene Bereiche:
- [src/app/tarif-vergleich/page.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/tarif-vergleich/page.tsx)
- [src/lib/affiliateRecommendations.ts](/Users/adamdrobiec/energie-sparschwein/src/lib/affiliateRecommendations.ts)

Abhaengigkeit:
- Phase 3

Ziel:
- Tarif-Vergleich darf nicht mehr wie das eigentliche Produkt wirken

Konkret:
- als nachgelagerter Entscheidungsraum framen
- Empfehlung und Vollansicht sauber differenzieren
- Provider-/Portal-Logik nur nach Einordnung zeigen
- Portal-Sprache reduzieren

### Phase 5: Preis-Waechter als Kernbestandteil positionieren

Betroffene Bereiche:
- [src/app/preis-waechter/page.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/preis-waechter/page.tsx)
- [src/app/preis-waechter/PreisWaechterClient.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/preis-waechter/PreisWaechterClient.tsx)
- [src/components/PriceWatcherWidget.tsx](/Users/adamdrobiec/energie-sparschwein/src/components/PriceWatcherWidget.tsx)

Abhaengigkeit:
- Phase 3

Ziel:
- Preis-Waechter als legitime Alternative verankern, nicht als Add-on

Konkret:
- klare Positionierung fuer "noch nicht wechseln"
- wiederkehrenden Nutzen klar benennen
- Widget-/Inline-Variante und eigene Seite aufeinander abstimmen

### Phase 6: Ratgeber und Preisrechner rueck an den Funnel anbinden

Betroffene Bereiche:
- [src/app/ratgeber/page.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/ratgeber/page.tsx)
- Artikel unter `src/app/ratgeber/*`
- [src/app/preisrechner/page.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/preisrechner/page.tsx)
- [src/lib/ratgeber.ts](/Users/adamdrobiec/energie-sparschwein/src/lib/ratgeber.ts)

Abhaengigkeit:
- Phase 1

Ziel:
- Content und Tiefen-Tools sollen in den Hauptfunnel einspeisen statt parallel zu laufen

Konkret:
- CTAs vereinheitlichen
- Ratgeber-Hub priorisieren
- Preisrechner als Vertiefung statt Parallelprodukt definieren

### Phase 7: Navigation und Sekundaerstruktur bereinigen

Betroffene Bereiche:
- [src/components/Navbar.tsx](/Users/adamdrobiec/energie-sparschwein/src/components/Navbar.tsx)
- [src/app/layout.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/layout.tsx)

Abhaengigkeit:
- Phase 1 bis 6

Ziel:
- Navigation muss die neue Produkt-Hierarchie spiegeln

Konkret:
- Spar-Check und Preis-Waechter priorisieren
- Tarif-Vergleich und Mikro-Tools entdominieren
- Ratgeber als Vertrauens-/SEO-Flaeche klar halten

## Was bewusst spaeter kommt

Folgende Themen sind wichtig, aber nicht zuerst:

- visuelle Neusprache auf allen Seiten
- Icon-System vereinheitlichen
- Ratgeber-Redaktion ausbauen
- Mikro-Tools neu strukturieren
- erweiterte Analytics-Optimierung

## Was vorerst nicht angefasst werden sollte

- rechtliche Seiten ausser bei Produktwirkung
- Preview-Mechanik, sofern nicht produktrelevant
- periphere API-Logik wie Tanken, solange der Kernfunnel noch unscharf ist

## Checkliste pro Umsetzungsphase

Nach jeder Phase:

1. `pnpm lint`
2. `pnpm exec tsc --noEmit`
3. `pnpm build`
4. manueller Check der betroffenen Route

Hinweis:
- Ein eigener Test-Runner ist aktuell im Repo nicht eingerichtet.
