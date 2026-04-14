import Link from 'next/link';

const SECTIONS = [
  {
    icon: '📉',
    title: 'Warum sich ein Heizungswechsel lohnt',
    body: 'Eine veraltete Gas- oder Ölheizung arbeitet oft mit einem Wirkungsgrad von unter 70 %. Moderne Pelletkessel und Wärmepumpen erreichen 90–400 % (Wärmepumpe: COP). Das bedeutet: Für jeden investierten Euro Energie holst du bis zu viermal mehr Wärme heraus.',
  },
  {
    icon: '💰',
    title: 'Förderungen & Zuschüsse 2026',
    body: 'Das Bundesamt für Wirtschaft und Ausfuhrkontrolle (BAFA) fördert den Einbau erneuerbarer Heizungen mit bis zu 70 % der Investitionskosten. Voraussetzung: Das Gebäude ist älter als 5 Jahre, und du tauschst eine fossile Heizung aus. Hinzu kommt die steuerliche Abschreibung über § 35c EStG.',
  },
  {
    icon: '🌰',
    title: 'Pelletheizung: Günstig und klimaneutral',
    body: 'Pellets kosten aktuell rund 7–8 Ct/kWh – Gas liegt bei 10–14 Ct/kWh. Für ein 120-m²-Haus bedeutet das rund 600–900 € Ersparnis pro Jahr. Holzpellets gelten als CO₂-neutral, da nur so viel Kohlenstoff freigesetzt wird, wie der Baum vorher gebunden hat.',
  },
  {
    icon: '♨️',
    title: 'Wärmepumpe: Die günstigste laufende Heizung',
    body: 'Wärmepumpen erzeugen aus 1 kWh Strom bis zu 4 kWh Wärme (COP 4). Mit einem Heizstrom-Spezialtarif von 22 Ct/kWh kostet eine kWh Wärme effektiv nur 5,5 Ct – günstiger als Pellets. Die hohen Investitionskosten amortisieren sich durch BAFA-Förderung oft in 7–10 Jahren.',
  },
  {
    icon: '🔧',
    title: 'Sofort-Maßnahmen ohne Investition',
    body: 'Hydraulischer Abgleich (oft kostenlos vom Installateur), Absenktemperatur nachts auf 18 °C, Thermostatventile in allen Räumen, Türen zu unbeheizten Räumen schließen – diese Maßnahmen können 10–15 % der Heizkosten einsparen, ohne einen Cent zu investieren.',
  },
];

export default function HeizkostenSenken() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Ratgeber</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Heizkosten senken:<br />Was wirklich hilft
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300 leading-relaxed">
            Pellets, Wärmepumpe oder Gasoptimierung – wir erklären Kosten, Förderungen und den echten Unterschied.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/spar-check"
              className="rounded-full bg-primary px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              Mein Sparpotenzial berechnen →
            </Link>
            <Link
              href="/tarif-vergleich"
              className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Tarif-Vergleich
            </Link>
          </div>
        </div>
      </section>

      {/* Inhalt */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl space-y-6">
          {SECTIONS.map((s) => (
            <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-4 text-3xl">{s.icon}</div>
              <h2 className="mb-3 text-2xl font-bold text-slate-900">{s.title}</h2>
              <p className="text-slate-600 leading-relaxed">{s.body}</p>
            </div>
          ))}

          {/* Vergleichstabelle */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Heizkosten im Vergleich (120 m² Wohnfläche)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4">Heizungstyp</th>
                    <th className="pb-3 pr-4 text-right">Ct/kWh</th>
                    <th className="pb-3 pr-4 text-right">Jahreskosten</th>
                    <th className="pb-3 text-right">Förderung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { type: 'Gas (Grundversorgung)',  ct: '13,6',  year: '~2.290 €', foerd: '—' },
                    { type: 'Heizöl',                ct: '14,5',  year: '~2.610 €', foerd: '—' },
                    { type: 'Pellets',               ct: '7,6',   year: '~1.370 €', foerd: 'bis 70 %' },
                    { type: 'Wärmepumpe (Heizstrom)',ct: '5,5*',  year: '~990 €',   foerd: 'bis 70 %' },
                  ].map((row) => (
                    <tr key={row.type} className="text-slate-700">
                      <td className="py-3 pr-4 font-medium">{row.type}</td>
                      <td className="py-3 pr-4 text-right">{row.ct}</td>
                      <td className="py-3 pr-4 text-right">{row.year}</td>
                      <td className={`py-3 text-right font-semibold ${row.foerd !== '—' ? 'text-primary' : 'text-slate-400'}`}>{row.foerd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-slate-400">* COP 4, Heizstromtarif 22 Ct/kWh. Jahreskosten auf Basis 17.600 kWh Heizenergie (140 kWh/m²/Jahr).</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Wie viel könntest du sparen?</h2>
          <p className="mt-3 text-slate-400">Gib deine Angaben ein – wir rechnen es dir in 60 Sekunden aus.</p>
          <Link
            href="/spar-check"
            className="mt-8 inline-flex rounded-full bg-primary px-8 py-4 font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            Spar-Check starten →
          </Link>
        </div>
      </section>
    </div>
  );
}
