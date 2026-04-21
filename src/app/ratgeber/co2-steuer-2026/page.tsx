import ArticleTemplate from '@/components/ratgeber/ArticleTemplate';

export default function Co2Steuer2026Page() {
  return (
    <ArticleTemplate
      title="CO₂-Steuer 2026: Warum Heizen teurer bleiben kann"
      intro="2026 startet im nationalen Emissionshandel die Preiskorridorphase. Für Haushalte heißt das: fossile Wärme bleibt unter Kostendruck, auch wenn der Endpreis nicht mehr nur aus einem festen CO₂-Wert abgeleitet wird."
      shortAnswer="Die CO₂-Kosten verschwinden 2026 nicht. Für Gas- und Öl-Haushalte bleiben sie ein echter Preistreiber, auch wenn der Mechanismus über einen Korridor statt einen festen Wert läuft."
      whyNow="Weil politische Preislogik schnell abstrakt wird. Für Haushalte zählt aber die praktische Frage: Wird mein System oder mein Tarif dadurch empfindlicher gegenüber Kostenanstiegen?"
      relevantFor={[
        'Haushalte mit Gas oder Heizöl',
        'Nutzer, die politische Preisänderungen auf ihren Alltag übersetzen wollen',
        'Menschen, die sich fragen, ob Tarif, Verbrauch oder Technik ihr erster Hebel ist',
      ]}
      nextStep={{
        title: 'Eigene Lage sichtbar machen statt nur Politik verfolgen',
        body: 'Die CO₂-Debatte bringt wenig, wenn du deinen eigenen Ausgangswert nicht kennst. Der Spar-Check zeigt dir, ob dein erster Hebel eher im Tarif, im Verbrauch oder später in der Technik liegt.',
        primary: { label: 'Zum Spar-Check →', href: '/spar-check' },
        secondary: { label: 'Preis-Wächter aktivieren →', href: '/preis-waechter' },
      }}
      sections={[
        {
          title: 'Was sich 2026 konkret ändert',
          body: (
            <>
              <p>
                Laut Umweltbundesamt werden nEHS-Zertifikate 2026 erstmals versteigert. Der Preis liegt
                dabei innerhalb eines Korridors von 55 bis 65 Euro pro Tonne CO₂. Dazu kommt eine
                anschließende Verkaufsphase zu 68 Euro je Zertifikat und eine begrenzte Nachkaufmöglichkeit
                im Folgejahr.
              </p>
              <p>
                Für Verbraucher ist entscheidend: Die CO₂-Kosten bleiben im System. Wer mit Gas oder
                Heizöl heizt, bleibt von diesem Aufschlag betroffen, auch wenn die genaue Weitergabe über
                Tarif oder Brennstoffrechnung läuft.
              </p>
            </>
          ),
        },
        {
          title: 'Was du daraus praktisch ableiten solltest',
          body: (
            <ul className="space-y-3">
              {[
                'Fossile Heizungen werden preislich nicht planbarer, sondern eher sensibler gegenüber Marktmechanismen.',
                'Ein Tarifvergleich bleibt sinnvoll, weil CO₂-Kosten nur ein Teil des Endpreises sind.',
                'Sofortmaßnahmen wie Temperatur, Warmwasser und Verbrauchsreduktion bleiben wirtschaftlich relevant.',
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
          label: 'Umweltbundesamt: Versteigerungen im nEHS 2026',
          href: 'https://www.umweltbundesamt.de/presse/pressemitteilungen/erstmals-versteigerungen-im-nationalen',
        },
        {
          label: 'Umweltbundesamt: Umsetzung des Preiskorridors 2026',
          href: 'https://www.umweltbundesamt.de/publikationen/umsetzung-des-preiskorridors-im-nationalen',
        },
      ]}
    />
  );
}
