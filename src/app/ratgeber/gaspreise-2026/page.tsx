import ArticleTemplate from '@/components/ratgeber/ArticleTemplate';

export default function Gaspreise2026Page() {
  return (
    <ArticleTemplate
      title="Gaspreise 2026: Was jetzt wirklich wichtig ist"
      intro="2026 bleiben Gaspreise stark von Region, Tarifstruktur und CO₂-Kosten beeinflusst. Der größte Fehler ist, pauschale Durchschnittswerte mit dem eigenen Vertrag zu verwechseln."
      shortAnswer="Für viele Haushalte ist nicht der Markt das Hauptproblem, sondern der eigene Tarif. Wenn du in Grundversorgung oder in einem teuren Altvertrag bist, liegt dein erster Hebel oft im Vergleich, nicht in großen Annahmen über den Gesamtmarkt."
      whyNow="2026 wirken CO₂-Kosten, Netzentgelte und regionale Unterschiede weiter auf Gaspreise. Wer zu lange mit einem ungünstigen Vertrag wartet, zahlt diese Effekte direkt mit."
      relevantFor={[
        'Gas-Haushalte mit hoher Abschlagsbelastung',
        'Haushalte in Grundversorgung oder älteren Verträgen',
        'Nutzer, die wissen wollen, ob ihr erster Hebel Tarif oder Technik ist',
      ]}
      nextStep={{
        title: 'Erst Einordnung, dann Vergleich',
        body: 'Wenn du noch nicht weißt, wie relevant der Tarifhebel für deinen Haushalt gerade wirklich ist, ist der Spar-Check der bessere erste Schritt. Wenn du schon klar im Vergleichsraum bist, kannst du danach direkt weitergehen.',
        primary: { label: 'Spar-Check starten →', href: '/spar-check' },
        secondary: { label: 'Zum Vergleichsraum →', href: '/tarif-vergleich' },
      }}
      sections={[
        {
          title: 'Warum Gas 2026 nicht einfach „teuer“ oder „billig“ ist',
          body: (
            <>
              <p>
                Der BDEW sah im Herbst 2025 für Haushalte im Einfamilienhaus einen durchschnittlichen
                Gaspreis von 12,07 Ct/kWh. Gleichzeitig werden für 2026 weiterhin deutlich niedrigere
                Neukundentarife beworben. Diese Lücke zeigt: Für Haushalte zählt nicht der Durchschnitt,
                sondern die konkrete Tarifposition.
              </p>
              <p>
                2026 kommt hinzu, dass der CO₂-Preis im nationalen Emissionshandel nicht mehr nur starr
                festgesetzt wird, sondern in einem Korridor versteigert wird. Das macht die Lage nicht
                unbeherrschbar, aber für fossile Wärme weiter kostenrelevant.
              </p>
            </>
          ),
        },
        {
          title: 'Was du daraus praktisch ableiten solltest',
          body: (
            <ul className="space-y-3">
              {[
                'Nicht nur den Arbeitspreis prüfen, sondern auch Grundpreis, Bonus und Preisgarantie.',
                'Mit realistischer PLZ und realistischem Verbrauch rechnen, nicht mit Idealwerten.',
                'Wenn du noch in Grundversorgung bist, ist ein Vergleich meist der schnellste Hebel.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 text-primary">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ),
        },
      ]}
      sources={[
        {
          label: 'BDEW Gaspreisanalyse',
          href: 'https://www.bdew.de/service/daten-und-grafiken/bdew-gaspreisanalyse/',
        },
        {
          label: 'Umweltbundesamt zum nEHS-Preiskorridor 2026',
          href: 'https://www.umweltbundesamt.de/presse/pressemitteilungen/erstmals-versteigerungen-im-nationalen',
        },
        {
          label: 'Verivox Gasvergleich / Gaskosten',
          href: 'https://www.verivox.de/gas/gaskosten/',
        },
      ]}
    />
  );
}
