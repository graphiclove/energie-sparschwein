# Page Brief: Vergleichen

## Rolle im Produkt

`/tarif-vergleich` ist nicht das Produktversprechen.

Die Seite ist ein nachgelagerter Entscheidungsraum fuer Nutzer, die bereits eingeordnet wurden und jetzt aktiv vergleichen wollen.

## Aktueller Stand im Repo

[src/app/tarif-vergleich/page.tsx](/Users/adamdrobiec/energie-sparschwein/src/app/tarif-vergleich/page.tsx) zeigt heute:

- Vergleichstabelle mit Modellpreisen
- empfohlene Karten
- Vollansicht mit weiteren Karten
- Spar-Tipp
- Transparenzblock

Staerken:

- Trennung zwischen Empfehlung und Vollansicht ist bereits angelegt
- heiztyp-spezifische Karten kommen aus `src/lib/affiliateRecommendations.ts`

Probleme:

- Seite ist begrifflich und strukturell noch nah am klassischen Vergleichsportal
- Provider und Portal-Mechanik koennen noch zu sehr als eigentliche Hauptsache wirken

## Ziel

Die Seite soll sagen:

- hier kannst du jetzt wirklich vergleichen
- aber nur, weil du vorher schon eingeordnet wurdest

## Primaerer CTA

- der beste aktuelle Vergleichsweg fuer den Nutzer

## Sekundaerer CTA

- alternative Vollansicht oder Wechselservice

## Trust-Elemente

- Rueckbezug auf vorherige Einordnung
- Transparenz, dass dies Partner- und Vergleichswege sind
- Erklaerung, warum diese Option hier gezeigt wird

## Must-have Components

- kurzer Rueckbezug auf den Haushalt
- empfohlener Vergleichsweg
- Vollansicht als echte Alternative
- Transparenz zu Affiliate-/Partnerlogik

## Nicht primaer auf dieser Seite

- allgemeiner Produktpitch
- neue Grundsatzdiagnose
- breite Tool- oder Content-Hubs

## Erfolgsbild

Der Nutzer fuehlt:

- ich bin jetzt im richtigen Vergleichsraum
- ich verstehe, warum ich diese Optionen sehe
- ich verliere mich nicht sofort im Portalchaos
