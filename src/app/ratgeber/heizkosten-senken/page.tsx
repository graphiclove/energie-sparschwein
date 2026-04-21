import ArticleTemplate from '@/components/ratgeber/ArticleTemplate';

export default function HeizkostenSenkenPage() {
  return (
    <ArticleTemplate
      title="Heizkosten senken: Was wirklich hilft"
      intro="Pellets, Wärmepumpe oder Gasoptimierung: Nicht jede Maßnahme ist sofort sinnvoll. Entscheidend ist, ob dein erster Hebel im Tarif, im Verhalten oder im Heizsystem liegt."
      shortAnswer="Die meisten Haushalte sollten nicht mit einer großen Investition beginnen. Oft lohnt sich zuerst der einfache Hebel: Tarif, Verhalten oder kleinere Effizienzmaßnahmen. Technik wird erst dann spannend, wenn klar ist, dass der Rest nicht reicht."
      whyNow="Weil hohe Heizkosten schnell zu vorschnellen Technikentscheidungen führen. Wer zuerst den einfachsten Hebel klärt, spart oft schneller und mit weniger Risiko."
      relevantFor={[
        'Haushalte mit hoher Heizkostenbelastung',
        'Menschen, die zwischen Sofortmaßnahme und größerer Modernisierung schwanken',
        'Nutzer, die Förderungen hören, aber ihre reale Ausgangslage noch nicht kennen',
      ]}
      nextStep={{
        title: 'Erst den plausiblen Hebel finden',
        body: 'Bevor du Technik gegeneinander rechnest, solltest du wissen, ob dein erster sinnvoller Schritt überhaupt im Systemwechsel liegt. Genau dafür ist der Spar-Check da.',
        primary: { label: 'Spar-Check starten →', href: '/spar-check' },
        secondary: { label: 'Zur Preis-Einordnung →', href: '/preisrechner' },
      }}
      sections={[
        {
          title: 'Welche Hebel es überhaupt gibt',
          body: (
            <ul className="space-y-3">
              {[
                'Tarif oder Kaufzeitpunkt: häufig der schnellste und am wenigsten riskante Hebel.',
                'Verhalten und kleinere Maßnahmen: oft 10–15 % weniger Heizkosten ohne große Investition.',
                'Systemwechsel: relevant, wenn das heutige System strukturell teuer oder veraltet ist.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 text-primary">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ),
        },
        {
          title: 'Wann Technik wirklich interessant wird',
          body: (
            <>
              <p>
                Eine veraltete Gas- oder Ölheizung kann mittelfristig ein systemischer Kostentreiber
                sein. Moderne Pelletkessel und Wärmepumpen können im Betrieb günstiger sein, sind aber
                kein sinnvoller erster Schritt für jeden Haushalt.
              </p>
              <p>
                Wer ohnehin über einen Tausch nachdenkt, sollte Förderungen und Amortisation mitdenken.
                Wer dagegen erst einen teuren Tarif oder hohe Abschläge in Ordnung bringen kann, sollte
                dort beginnen.
              </p>
            </>
          ),
        },
      ]}
      sources={[
        {
          label: 'BAFA / Förderinformationen zu erneuerbaren Heizungen',
          href: 'https://www.bafa.de/',
        },
      ]}
    />
  );
}
