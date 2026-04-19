# Information Architecture

## Aktuelle Struktur im Repo

### Kernseiten

- `/` Startseite
- `/spar-check`
- `/tarif-vergleich`
- `/preis-waechter`

### Sekundaerseiten

- `/preisrechner`
- `/ratgeber`
- `/ueber-uns`

### Mikro-Tools

- `/guenstig-tanken`
- `/tools/dusch-rechner`
- `/tools/geraete-check`

### Rechtlich / technisch

- `/impressum`
- `/datenschutz`
- `/preview`

## Problem der aktuellen IA

Die aktuelle Architektur ist technisch sauber, aber aus Produktsicht noch zu breit:

- Die Navigation behandelt `Spar-Check`, `Tarif-Vergleich`, `Preisrechner`, `Guenstig tanken` und Ratgeber fast auf derselben Ebene.
- Die Startseite enthaelt Funnel-Einstieg, Tool-Hub und Content-Hub gleichzeitig.
- Der Tarif-Vergleich ist in der Informationsarchitektur noch zu nah am Kernversprechen, obwohl er eigentlich nur ein nachgelagerter Raum sein sollte.

## Zielbild

Wechselbiber soll in drei Ebenen organisiert sein:

### Ebene 1: Kernfunnel

Diese Ebene repraesentiert das eigentliche Produkt.

- `/`
- `/spar-check`
- `/spar-check#result`
- `/tarif-vergleich`
- `/preis-waechter`

### Ebene 2: Vertiefung und Vertrauen

Diese Ebene hilft Nutzern, die mehr Kontext oder Sicherheit brauchen.

- `/preisrechner`
- `/ratgeber`
- ausgewaehlte Ratgeberartikel
- `/ueber-uns`

### Ebene 3: Periphere Tools

Diese Ebene bleibt erreichbar, aber nicht dominant.

- `/guenstig-tanken`
- `/tools/dusch-rechner`
- `/tools/geraete-check`

## Ziel-Nutzerfluss

### Primaerer Fluss

1. Nutzer landet auf `/`
2. Nutzer versteht in wenigen Sekunden:
   - worum es geht
   - was Wechselbiber anders macht
   - was der erste sinnvolle Schritt ist
3. Nutzer startet `/spar-check`
4. Nutzer beantwortet wenige, relevante Fragen
5. Nutzer landet auf dem Ergebnis-Screen innerhalb `/spar-check`
6. Nutzer bekommt:
   - persoenliche Einordnung
   - Diagnose
   - einen empfohlenen naechsten Schritt
   - eine Alternative
   - Preis-Waechter als Exit-Option
7. Nutzer geht in:
   - `/tarif-vergleich`, oder
   - `/preis-waechter`, oder
   - eine passende Vertiefung

### Sekundaerer Fluss

Ein Teil der Nutzer kommt nicht ueber den Funnel, sondern ueber Information:

- SEO-Einstieg in `/ratgeber/...`
- Interesse an Kostenverstehen ueber `/preisrechner`

Diese Nutzer sollen von dort nicht in Tool-Sprawl laufen, sondern moeglichst schnell in einen der Kernwege:

- `Spar-Check starten`
- `Preis-Waechter aktivieren`
- `passenden naechsten Schritt sehen`

## Zielpriorisierung pro Route

### `/`

Rolle:
- Produktversprechen
- Funnel-Einstieg
- Vertrauensaufbau

Primaer:
- Spar-Check starten

Sekundaer:
- Preis-Waechter
- Ratgeber

Nicht primaer:
- Tarif-Vergleich
- Mikro-Tools

### `/spar-check`

Rolle:
- Hauptprodukt
- Datensammel- und Einordnungsstrecke

Primaer:
- Fragen beantworten
- Ergebnis erhalten

Sekundaer:
- Eingaben anpassen

Nicht primaer:
- Tool-Wechsel
- Portal-Navigation

### Ergebnis innerhalb `/spar-check`

Rolle:
- Beratungsseite
- Scharnier zwischen Diagnose und Aktion

Primaer:
- sinnvollster naechster Schritt

Sekundaer:
- komplette Uebersicht
- Preis-Waechter

### `/tarif-vergleich`

Rolle:
- Entscheidungsraum fuer Nutzer, die bereits eingeordnet wurden

Primaer:
- konkret vergleichen

Sekundaer:
- Wechselservice
- rueckwaertige Verstaerkung von Vertrauen

Nicht primaer:
- erneute Einordnung als Hauptzweck

### `/preis-waechter`

Rolle:
- bewusste Nicht-Jetzt-Option
- Retention-Einstieg

Primaer:
- E-Mail eintragen

Sekundaer:
- erklaeren, wann und warum Erinnerungen kommen

### `/preisrechner`

Rolle:
- Verstaendnis vertiefen

Primaer:
- einzelne Kostenblöcke besser verstehen

Sekundaer:
- Rueckfuehrung in Spar-Check oder Ergebnislogik

### `/ratgeber`

Rolle:
- Vertrauen
- SEO
- Vorqualifizierung

Primaer:
- hilfreiche Einordnung

Sekundaer:
- Rueckfuehrung in den Funnel

## Navigationsempfehlung

Die aktuelle Navigation ist fuer das Zielprodukt zu breit.

Empfohlene Hauptnavigation fuer den Rebuild:

- `Spar-Check`
- `Preis-Waechter`
- `Ratgeber`
- `Ueber uns`

Optional:
- `Mehr` oder kompakter Tools-Einstieg fuer periphere Features

Nicht mehr als primaere Navigation behandeln:

- `Tarif-Vergleich`
- `Preisrechner`
- Mikro-Tools

Diese Seiten bleiben vorhanden, werden aber ueber:

- Ergebnisseiten
- Ratgeber-CTAs
- sekundaere Navigationsmuster

angespielt.

## Content-to-product-Verknuepfung

Jede Inhalts- oder Vertiefungsseite braucht genau einen Rueckweg in das Kernprodukt:

- aus Preisartikeln: `Spar-Check starten`
- aus Heiz-Artikeln: `passenden naechsten Schritt finden`
- aus Preisrechner: `Einordnung fuer meinen Haushalt sehen`

## Was explizit sekundaer wird

- Dropdown-Breite in der Navigation
- gleichrangige Tool-Hubs
- Mikro-Tools auf hoher Hierarchieebene
- Tarif-Vergleich als Top-Level-Versprechen
