import Link from 'next/link';

const WHAT_WE_DO_NOT_DO = [
  'Keine aggressive Werbung',
  'Keine versteckten Kosten',
  'Keine Verkaufsanrufe',
  'Keine Empfehlungen nach Provisionshöhe',
];

export default function UeberUns() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Über uns</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.04em] md:text-6xl">
            Wir sind keine weitere Vergleichsseite.
            <br />
            Wir sind dein Kosten-Dolmetscher.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Wechselbiber hilft Haushalten, Energiekosten erst zu verstehen und dann die richtigen nächsten
            Schritte zu wählen.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Was uns anders macht</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-950">Erst verstehen, dann vergleichen, dann handeln.</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Wir zeigen dir nicht nur den billigsten Tarif, sondern den besten Sparpfad für deinen Haushalt. Das
              bedeutet: Erst verstehen, dann vergleichen, dann handeln. In dieser Reihenfolge.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Unsere Haltung</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-950">Nur sinnvoll empfehlen, nicht maximal monetarisieren.</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Wir verdienen nur, wenn du über unsere Links wechselst. Aber wir empfehlen nur, was für dich Sinn macht
              – nicht was uns mehr Provision bringt. Das ist für uns keine Floskel, sondern die Grundlage des
              Projekts.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Wie wir Empfehlungen ableiten</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-950">Methodik gehört ins Produkt, nicht nur ins Kleingedruckte.</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Wechselbiber arbeitet mit Marktpreisen, typischen Haushaltsprofilen und klarer
              Produktlogik. Wir versuchen zuerst herauszufinden, ob für einen Haushalt eher vergleichen,
              beobachten oder tiefer verstehen sinnvoll ist. Wie genau das funktioniert, haben wir
              transparent dokumentiert.
            </p>
            <Link
              href="/methodik"
              className="mt-6 inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Zur Methodik →
            </Link>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Was wir NICHT machen</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-950">Weniger Druck. Mehr Klarheit.</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {WHAT_WE_DO_NOT_DO.map((item) => (
                <div key={item} className="rounded-[1.25rem] bg-slate-50 px-5 py-4 text-base font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Link
              href="/spar-check"
              className="flex-1 rounded-2xl bg-primary py-4 text-center font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              Spar-Check starten →
            </Link>
            <Link
              href="/impressum"
              className="flex-1 rounded-2xl border border-slate-200 py-4 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Impressum & Kontakt
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
