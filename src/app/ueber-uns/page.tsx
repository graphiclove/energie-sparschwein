import Link from 'next/link';

export default function UeberUns() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Über uns</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Dein Kosten-Dolmetscher<br />für Energie.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300 leading-relaxed">
            Energie-Sparschwein erklärt die Energiewelt auf Deutsch – ohne Fachjargon, ohne Agenda, ohne versteckte Kosten.
          </p>
        </div>
      </section>

      {/* Inhalt */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl space-y-8">

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Warum Energie-Sparschwein?</h2>
            <p className="text-slate-600 leading-relaxed">
              Der deutsche Energiemarkt ist komplex: über 1.000 Gasanbieter, wechselnde Preise, unverständliche Tarifdschungel.
              Viele Verbraucher zahlen deshalb jahrelang zu viel – nicht weil sie sparen wollen, sondern weil sie nicht wissen, wie.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Energie-Sparschwein macht das anders. Wir übersetzen Energiepreise in konkrete Euro-Beträge für deinen Haushalt.
              Du siehst sofort, was du zahlst – und was mit einem einfachen Wechsel möglich wäre.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: '🔍', title: 'Unabhängig', desc: 'Wir verkaufen keine Tarife. Wir helfen dir verstehen.' },
              { icon: '📊', title: 'Transparent', desc: 'Jede Berechnung zeigt ihre Grundlage offen.' },
              { icon: '🎁', title: 'Kostenlos', desc: 'Alle Tools bleiben immer kostenlos für dich.' },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="mb-3 text-3xl">{v.icon}</div>
                <h3 className="mb-2 font-bold text-slate-900">{v.title}</h3>
                <p className="text-sm text-slate-500">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Wie wir uns finanzieren</h2>
            <p className="text-slate-600 leading-relaxed">
              Wenn du über unsere Links zu einem Vergleichsportal wechselst (Verivox, CHECK24 u.a.) und dort einen neuen Vertrag abschließt,
              erhalten wir eine Provision. Für dich entstehen dadurch <strong className="text-slate-800">keine Mehrkosten</strong>.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Unsere Empfehlungen basieren auf unabhängiger Recherche, nicht auf Provisionsgrößen. Affiliate-Links kennzeichnen wir transparent.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
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
