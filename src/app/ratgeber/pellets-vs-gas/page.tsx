import Link from 'next/link';

const COMPARE = [
  {
    title: 'Laufende Kosten',
    gas: 'Gas bleibt stark tarif- und netzabhängig. Durchschnittswerte helfen, aber nur dein echter Vertrag zählt.',
    pellets: 'Pellets können bei den laufenden Kosten attraktiv sein, schwanken aber ebenfalls regional und saisonal.',
  },
  {
    title: 'Preissicherheit',
    gas: 'Gas ist zusätzlich von CO₂-Kosten und regulatorischen Änderungen beeinflusst.',
    pellets: 'Pellets hängen stärker an Rohstoff- und Logistikketten, weniger direkt an CO₂-Kosten.',
  },
  {
    title: 'Hebel heute',
    gas: 'Ein Tarifwechsel ist kurzfristig der schnellste Hebel.',
    pellets: 'Beim Pellet-System liegt der Hebel oft eher beim Einkaufszeitpunkt und Händlervergleich.',
  },
];

export default function PelletsVsGasPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Ratgeber</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            Pellets oder Gas: Was lohnt sich 2026 eher?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            Die bessere Lösung hängt davon ab, ob du nur kurzfristig Kosten senken oder grundsätzlich über dein Heizsystem nachdenken willst.
            Für viele Haushalte ist der erste Hebel nicht der Heizungstausch, sondern der richtige Tarif.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Der saubere Vergleich: Systemwechsel vs. Soforthebel</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Pellets und Gas werden oft nur über den reinen Energiepreis verglichen. Für die Praxis ist das zu kurz gedacht. Ein Haushalt mit
              bestehender Gasheizung kann kurzfristig oft mehr durch einen Tarifwechsel sparen als durch einen theoretischen Brennstoffvergleich.
              Umgekehrt kann ein Haushalt mit langfristigem Sanierungsbedarf Pellets oder Wärmepumpe strategisch neu bewerten.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {COMPARE.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-800">Gas</p>
                    <p className="mt-1">{item.gas}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Pellets</p>
                    <p className="mt-1">{item.pellets}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Wann Pellets strategisch interessant sind</h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Pellets können für Haushalte interessant sein, die ohnehin über einen größeren Heizungstausch nachdenken und die Investition
                langfristig betrachten. Für einen bestehenden Gas-Haushalt ist das aber fast nie der erste Schritt vor einem Tarifvergleich
                und einer Verbrauchsanalyse.
              </p>
              <p className="mt-4 leading-relaxed text-slate-600">
                Wer heute Gas nutzt, sollte zuerst wissen, ob das eigentliche Problem der Vertrag, der Verbrauch oder wirklich das System selbst ist.
                Genau dafür ist der Spar-Check der bessere erste Einstieg als eine reine Technologiedebatte.
              </p>
            </article>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-primary/20 bg-emerald-50 p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Praxis-Tipp</p>
                <h3 className="mt-3 text-2xl font-bold text-slate-900">Erst Kosten verstehen, dann Technik bewerten</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Bevor du Pellets und Gas gegeneinander rechnest, solltest du wissen, was dich dein heutiger Haushalt wirklich kostet und wo der größte Hebel liegt.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/spar-check"
                    className="inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-slate-950 transition hover:bg-primary/90"
                  >
                    Spar-Check starten →
                  </Link>
                  <Link
                    href="/tarif-vergleich"
                    className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Tarif-Vergleich ansehen →
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">Quelle</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>
                    <a className="underline underline-offset-2" href="https://www.verivox.de/gas/gaskosten/" target="_blank" rel="noopener noreferrer">
                      Verivox: Gaskosten und Vergleich
                    </a>
                  </li>
                  <li>
                    <a className="underline underline-offset-2" href="https://www.bdew.de/service/daten-und-grafiken/bdew-gaspreisanalyse/" target="_blank" rel="noopener noreferrer">
                      BDEW Gaspreisanalyse
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
