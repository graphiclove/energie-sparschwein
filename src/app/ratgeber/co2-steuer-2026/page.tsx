import Link from 'next/link';

const IMPACTS = [
  {
    title: 'Heizen mit fossilen Brennstoffen',
    body: 'Gas und Heizöl bleiben direkt von der CO₂-Bepreisung betroffen. Die Zusatzkosten werden in der Praxis in der Regel an Endkunden weitergegeben.',
  },
  {
    title: 'Mehr Unsicherheit als bei Festpreisen',
    body: '2026 gilt im nationalen Emissionshandel kein einzelner fester Wert, sondern ein Korridor von 55 bis 65 Euro pro Tonne.',
  },
  {
    title: 'Energieeffizienz wird wertvoller',
    body: 'Wer Heizenergie spart oder den Tarif verbessert, federt steigende CO₂-Kosten doppelt ab: weniger Verbrauch, weniger Preisweitergabe.',
  },
];

export default function Co2Steuer2026Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Ratgeber</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            CO₂-Steuer 2026: Warum Heizen teurer bleiben kann
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            2026 startet im nationalen Emissionshandel die Preiskorridorphase. Für Haushalte heißt das: fossile Wärme bleibt unter Kostendruck,
            auch wenn der Endpreis nicht mehr nur aus einem festen CO₂-Wert abgeleitet wird.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="grid gap-4 md:grid-cols-3">
            {IMPACTS.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Was sich 2026 konkret ändert</h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Laut Umweltbundesamt werden nEHS-Zertifikate 2026 erstmals versteigert. Der Preis liegt dabei innerhalb eines Korridors von
                55 bis 65 Euro pro Tonne CO₂. Dazu kommt eine anschließende Verkaufsphase zu 68 Euro je Zertifikat und eine begrenzte
                Nachkaufmöglichkeit im Folgejahr.
              </p>
              <p className="mt-4 leading-relaxed text-slate-600">
                Für Verbraucher ist entscheidend: Die CO₂-Kosten verschwinden nicht. Wer mit Gas oder Heizöl heizt, bleibt von diesem
                Aufschlag betroffen, auch wenn die genaue Weitergabe über den Tarif oder die Brennstoffrechnung läuft.
              </p>

              <h3 className="mt-8 text-xl font-bold text-slate-900">Was du daraus ableiten solltest</h3>
              <ul className="mt-4 space-y-3 text-slate-600">
                <li className="flex items-start gap-3"><span className="mt-1 text-primary">✓</span><span>Fossile Heizungen werden preislich nicht planbarer, sondern eher sensibler gegenüber Marktmechanismen.</span></li>
                <li className="flex items-start gap-3"><span className="mt-1 text-primary">✓</span><span>Ein Tarifvergleich lohnt sich weiterhin, weil CO₂-Kosten nur ein Teil des Endpreises sind.</span></li>
                <li className="flex items-start gap-3"><span className="mt-1 text-primary">✓</span><span>Sofortmaßnahmen wie Raumtemperatur, Warmwasser und Verbrauchsreduktion bleiben wirtschaftlich sinnvoll.</span></li>
              </ul>
            </article>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-primary/20 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Was jetzt sinnvoll ist</p>
                <h3 className="mt-3 text-2xl font-bold text-slate-900">Eigene Kosten zuerst sichtbar machen</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Die CO₂-Debatte bringt wenig, wenn du deinen eigenen Ausgangswert nicht kennst. Rechne zuerst durch, was dein Haushalt aktuell zahlt.
                </p>
                <Link
                  href="/spar-check"
                  className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-slate-950 transition hover:bg-primary/90"
                >
                  Zum Spar-Check →
                </Link>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">Quellen</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>
                    <a className="underline underline-offset-2" href="https://www.umweltbundesamt.de/presse/pressemitteilungen/erstmals-versteigerungen-im-nationalen" target="_blank" rel="noopener noreferrer">
                      Umweltbundesamt: Versteigerungen im nEHS 2026
                    </a>
                  </li>
                  <li>
                    <a className="underline underline-offset-2" href="https://www.umweltbundesamt.de/publikationen/umsetzung-des-preiskorridors-im-nationalen" target="_blank" rel="noopener noreferrer">
                      Umweltbundesamt: Umsetzung des Preiskorridors 2026
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
