import ArticleTemplate from '@/components/ratgeber/ArticleTemplate';

export default function PelletsVsGasPage() {
  return (
    <ArticleTemplate
      title="Pellets oder Gas: Was lohnt sich 2026 eher?"
      intro="Die bessere Lösung hängt davon ab, ob du kurzfristig Kosten senken oder grundsätzlich über dein Heizsystem nachdenken willst. Für viele Haushalte ist der erste Hebel nicht der Heizungstausch, sondern der passende Tarif oder der richtige Vergleich."
      shortAnswer="Wenn du bereits eine Gasheizung hast, ist ein Tarifwechsel oft der schnellere erste Hebel als ein theoretischer Systemvergleich. Pellets werden dann interessant, wenn du ohnehin über einen größeren Umbau nachdenkst."
      whyNow="Weil Technikvergleiche schnell so wirken, als müsste sofort ein Grundsatzwechsel passieren. Für Haushalte ist aber wichtiger, ob heute ein Soforthebel existiert oder wirklich eine Systemfrage ansteht."
      relevantFor={[
        'Gas-Haushalte mit Blick auf mittelfristige Modernisierung',
        'Nutzer, die zwischen Soforthebel und strategischer Heizentscheidung unterscheiden wollen',
        'Haushalte, die Tariffragen und Technikfragen nicht vermischen möchten',
      ]}
      nextStep={{
        title: 'Erst die Ausgangslage klären',
        body: 'Wenn du noch nicht weißt, ob dein Problem eher Vertrag, Verbrauch oder System ist, hilft dir der Spar-Check mehr als ein abstrakter Technologiestreit.',
        primary: { label: 'Spar-Check starten →', href: '/spar-check' },
        secondary: { label: 'Zum Vergleichsraum →', href: '/tarif-vergleich' },
      }}
      sections={[
        {
          title: 'Systemwechsel vs. Soforthebel',
          body: (
            <>
              <p>
                Pellets und Gas werden oft nur über den reinen Energiepreis verglichen. Für die
                Praxis ist das zu kurz gedacht. Ein Haushalt mit bestehender Gasheizung kann kurzfristig
                oft mehr durch einen Tarifwechsel sparen als durch einen theoretischen Brennstoffvergleich.
              </p>
              <p>
                Umgekehrt kann ein Haushalt mit langfristigem Sanierungsbedarf Pellets oder Wärmepumpe
                strategisch neu bewerten. Die Reihenfolge bleibt aber wichtig: erst Lage klären, dann
                Technik gegeneinander stellen.
              </p>
            </>
          ),
        },
        {
          title: 'Wann Pellets strategisch interessant werden',
          body: (
            <>
              <p>
                Pellets können für Haushalte interessant sein, die ohnehin über einen größeren
                Heizungstausch nachdenken und die Investition langfristig betrachten. Für einen
                bestehenden Gas-Haushalt ist das aber fast nie der erste Schritt vor einem Tarifvergleich
                und einer Verbrauchsanalyse.
              </p>
              <p>
                Genau deshalb sollte vor jeder Technologiedebatte klar sein, was dich der heutige
                Haushalt wirklich kostet und wo dein größter Hebel liegt.
              </p>
            </>
          ),
        },
      ]}
      sources={[
        {
          label: 'Verivox: Gaskosten und Vergleich',
          href: 'https://www.verivox.de/gas/gaskosten/',
        },
        {
          label: 'BDEW Gaspreisanalyse',
          href: 'https://www.bdew.de/service/daten-und-grafiken/bdew-gaspreisanalyse/',
        },
      ]}
    />
  );
}
