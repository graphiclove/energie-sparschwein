import Link from 'next/link';

const FACTS = [
  {
    label: 'BDEW-Durchschnitt 2025',
    value: '12,07 Ct/kWh',
    note: 'Für Haushalte im Einfamilienhaus mit 20.000 kWh Jahresverbrauch.',
  },
  {
    label: 'Verivox-Angebote 2026',
    value: 'ab 8 Ct/kWh',
    note: 'Niedrige Neukundentarife sind weiter möglich, aber stark von PLZ und Bonusstruktur abhängig.',
  },
  {
    label: 'CO₂-Preis 2026',
    value: '55–65 €/t',
    note: 'Im nationalen Emissionshandel gilt 2026 erstmals ein Preiskorridor statt eines festen Preises.',
  },
];

const DRIVERS = [
  'Netzentgelte, Steuern und Umlagen bleiben ein wesentlicher Kostentreiber.',
  'Der CO₂-Preis steigt 2026 nicht mehr starr, sondern wird innerhalb eines Korridors versteigert.',
  'Regionale Unterschiede bleiben groß: dieselbe Verbrauchsmenge kann je nach PLZ deutlich unterschiedlich teuer sein.',
  'Neukundentarife können attraktiv wirken, sind aber nur sinnvoll, wenn Preisgarantie, Bonus und Folgekosten zusammenpassen.',
];

const ACTIONS = [
  'Nicht nur den Arbeitspreis prüfen, sondern auch Grundpreis, Bonus und Preisgarantie.',
  'Bei hoher Abschlagsbelastung zuerst den aktuellen Arbeitspreis in Ct/kWh aus der letzten Rechnung heraussuchen.',
  'Beim Vergleich immer mit realistischer PLZ und realistischem Verbrauch rechnen, nicht mit Idealwerten.',
  'Für Haushalte in Grundversorgung ist ein Vergleich meist der schnellste Hebel.',
];

export default function Gaspreise2026Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Ratgeber</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            Gaspreise 2026: Was jetzt wichtig ist
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            2026 bleiben Gaspreise stark von Region, Tarifstruktur und CO₂-Kosten beeinflusst. Der größte Fehler ist,
            pauschale Durchschnittswerte mit dem eigenen Vertrag zu verwechseln.
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
              Direkt zum Tarif-Vergleich
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="grid gap-4 md:grid-cols-3">
            {FACTS.map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{fact.label}</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{fact.value}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{fact.note}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Warum Gas 2026 nicht einfach „teuer“ oder „billig“ ist</h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Für viele Haushalte liegt das Problem nicht im Großhandelsmarkt, sondern im eigenen Vertrag. Der BDEW sah im Herbst 2025
                für Haushalte im Einfamilienhaus einen durchschnittlichen Gaspreis von 12,07 Ct/kWh. Gleichzeitig bewirbt Verivox für 2026
                Tarife ab etwa 8 Ct/kWh. Diese Lücke zeigt: Nicht der Durchschnitt ist entscheidend, sondern die konkrete Tarifposition.
              </p>
              <p className="mt-4 leading-relaxed text-slate-600">
                2026 kommt hinzu, dass der CO₂-Preis nicht mehr nur festgesetzt wird, sondern im nationalen Emissionshandel innerhalb eines
                Preiskorridors von 55 bis 65 Euro pro Tonne versteigert wird. Das macht den Kosteneffekt für fossile Brennstoffe planbar,
                aber nicht mehr völlig starr.
              </p>

              <h3 className="mt-8 text-xl font-bold text-slate-900">Die wichtigsten Preistreiber</h3>
              <ul className="mt-4 space-y-3 text-slate-600">
                {DRIVERS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 text-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-xl font-bold text-slate-900">Was du konkret tun solltest</h3>
              <ul className="mt-4 space-y-3 text-slate-600">
                {ACTIONS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 text-primary">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-primary/20 bg-emerald-50 p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Schnellster Hebel</p>
                <h3 className="mt-3 text-2xl font-bold text-slate-900">Grundversorgung prüfen</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Wer noch in einem teuren Altvertrag oder in Grundversorgung steckt, hat oft das größte Sparpotenzial ohne Investition.
                </p>
                <Link
                  href="/tarif-vergleich"
                  className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-slate-950 transition hover:bg-primary/90"
                >
                  Tarif-Vergleich öffnen →
                </Link>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">Quellen</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>
                    <a className="underline underline-offset-2" href="https://www.bdew.de/service/daten-und-grafiken/bdew-gaspreisanalyse/" target="_blank" rel="noopener noreferrer">
                      BDEW Gaspreisanalyse
                    </a>
                  </li>
                  <li>
                    <a className="underline underline-offset-2" href="https://www.umweltbundesamt.de/presse/pressemitteilungen/erstmals-versteigerungen-im-nationalen" target="_blank" rel="noopener noreferrer">
                      Umweltbundesamt zum nEHS-Preiskorridor 2026
                    </a>
                  </li>
                  <li>
                    <a className="underline underline-offset-2" href="https://www.verivox.de/gas/gaskosten/" target="_blank" rel="noopener noreferrer">
                      Verivox Gasvergleich / Gaskosten
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
