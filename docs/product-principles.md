# Product Principles

## Ausgangslage im aktuellen Repo

Wechselbiber hat heute bereits die richtigen Bausteine, aber noch nicht die richtige Priorisierung:

- Die Startseite in [src/app/page.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/page.tsx) will gleichzeitig Funnel-Einstieg, Tool-Hub, Ratgeber-Einstieg und Preis-Waechter-Flaeche sein.
- Der Spar-Check in [src/app/spar-check/page.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/spar-check/page.tsx) ist bereits der staerkste Einstieg, wirkt aber noch wie ein Tool mit Folgeoptionen statt wie eine gefuehrte Produktentscheidung.
- Der Tarif-Vergleich in [src/app/tarif-vergleich/page.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/tarif-vergleich/page.tsx) ist aktuell zu frueh zu stark und liegt begrifflich noch zu nah am klassischen Vergleichsportal.
- Preis-Waechter existiert bereits als eigene Logik und Seite in [src/app/preis-waechter/page.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/preis-waechter/page.tsx), ist aber produktstrategisch noch nicht klar genug als bewusste "noch nicht wechseln"-Option markiert.
- Die Navigation in [src/components/Navbar.tsx](/Users/adamdrobiec/energie-sparschwein/src/components/Navbar.tsx) priorisiert aktuell Breite statt Fokus.

Das Produkt muss deshalb nicht neu erfunden werden, sondern konsequent auf den Kernfunnel verdichtet werden.

## Produktdefinition

Wechselbiber ist ein **Kosten-Dolmetscher fuer Energie**.

Das bedeutet:

- nicht zuerst Tarife zeigen
- nicht zuerst Anbieter zeigen
- nicht zuerst moeglichst viele Wege oeffnen
- sondern zuerst einordnen, was fuer den Haushalt gerade wirklich relevant ist

Wechselbiber soll die Frage beantworten:

`Was ist fuer meinen Haushalt jetzt der sinnvollste naechste Schritt?`

## Primaeres Produktversprechen

Der primaere Nutzen ist nicht "der billigste Tarif".

Der primaere Nutzen ist:

- Orientierung in einem komplexen Energiethema
- Reduktion von Unsicherheit
- eine nachvollziehbare Empfehlung
- ein klarer naechster Schritt ohne Portalchaos

## Kernfunnel

Der Kernfunnel bleibt:

`Startseite -> Spar-Check -> Ergebnis -> sinnvoller naechster Schritt`

Moegliche naechste Schritte:

- `Vergleichen`
- `Beobachten`
- `tiefer verstehen`

Wichtig:

- `Vergleichen` ist nur einer von drei moeglichen Wegen, nicht der Default-Zweck des Produkts.
- `Beobachten` wird ueber Preis-Waechter repraesentiert.
- `tiefer verstehen` wird ueber Preisrechner und ausgewaehlte Ratgeberartikel repraesentiert.

## Primaer vs. sekundaer

### Primaer

- Startseite als fokussierter Funnel-Einstieg
- Spar-Check als Hauptprodukt
- Ergebnisseite als Beratungs- und Entscheidungsseite
- ein klar empfohlener naechster Schritt
- Preis-Waechter als bewusste "noch nicht wechseln"-Option

### Sekundaer

- Tarif-Vergleich als nachgelagerter Entscheidungsraum
- Preisrechner als Vertiefung fuer Nutzer mit mehr Analysebedarf
- Ratgeber als Vertrauens- und SEO-Schicht
- Mikro-Tools wie `Guenstig tanken`, `Dusch-Rechner`, `Geraete-Check`

### Nicht dominierend

Folgende Dinge duerfen im Produkt existieren, aber nie die primaere Produktlogik uebernehmen:

- Dropdown-Breiten in der Navigation
- Tool-Hub-Denken
- zu viele gleichgewichtige CTA-Flaechen
- "mehrere Wege gleichzeitig" im ersten Screen

## Entscheidungsregeln fuer alle Screens

### 1. Ein Screen, ein primaerer CTA

Wenn ein Nutzer mehrere gleich starke Wege sieht, fuehrt Wechselbiber gerade nicht, sondern delegiert die Entscheidung zurueck an den Nutzer.

Deshalb gilt:

- genau ein primaerer CTA pro Screen
- jeder weitere CTA ist sichtbar, aber klar nachgeordnet

### 2. Empfehlung vor Vergleich

In Wechselbiber darf ein Nutzer nie zuerst im Tarifraum landen, ohne vorher eine Einordnung bekommen zu haben.

Deshalb gilt:

- Startseite fuehrt in den Spar-Check
- Spar-Check fuehrt ins Ergebnis
- Ergebnis fuehrt erst dann in den Vergleich oder in eine andere passende Richtung

### 3. Vertrauen im Funnel, nicht nur im Footer

Vertrauen muss auf Startseite, Spar-Check und Ergebnis passieren.

Nicht ausreichend sind:

- nur `/ueber-uns`
- nur Footer-Hinweise
- nur Affiliate-Disclaimer

Vertrauen muss sichtbar werden durch:

- klare Sprache
- Begrenzung von Komplexitaet
- nachvollziehbare Einordnung
- transparente Begruendung fuer Empfehlungen

### 4. Nicht jeder Nutzer will sofort wechseln

Preis-Waechter ist kein "Lead-Catcher", sondern eine produktlogische Exit-Option fuer Nutzer, die:

- noch nicht entscheidungsbereit sind
- beobachten statt handeln wollen
- das Thema nicht vergessen moechten

### 5. Tools muessen in die Produktlogik eingebettet sein

Preisrechner, Ratgeber und Mikro-Tools sind nur dann wertvoll, wenn sie den Kernfunnel unterstuetzen.

Sie duerfen:

- Orientierung vertiefen
- Vertrauen verstaerken
- Unsicherheit abbauen

Sie duerfen nicht:

- den primaeren Funnel ueberlagern
- als parallele Hauptnavigation wirken
- den Nutzer aus der Hauptentscheidung herausziehen

## Copy-Prinzipien fuer dieses Repo

Die beste vorhandene Richtung im Repo ist:

- klar
- deutsch
- direkt
- ruhig
- ohne Portalsprech

Beibehalten:

- `Kosten-Dolmetscher`
- `Sparpfad`
- `noch nicht wechseln`
- `sinnvoller naechster Schritt`

Reduzieren oder vermeiden:

- zu viele Tool-Beschreibungen nebeneinander
- "beste Anbieter", "sofortchance", "Neukunden"-Framing in primaeren Funnel-Screens
- technische oder datenfixierte Sprache ohne Einordnung

## Erfolgskriterien fuer den Rebuild

Der Rebuild ist erfolgreich, wenn:

- die Startseite klarer in den Spar-Check fuehrt
- der Spar-Check sich wie ein Produkt, nicht wie ein Rechner anfuehlt
- die Ergebnisseite als Beratung erlebt wird
- der empfohlene naechste Schritt glaubwuerdiger ist als heute
- Preis-Waechter als legitime Alternative funktioniert
- Tarif-Vergleich sichtbar wichtig, aber klar nachgelagert ist
