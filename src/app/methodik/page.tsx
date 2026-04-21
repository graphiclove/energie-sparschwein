import Link from 'next/link';

export default function MethodikPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Methodik</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            Wie Wechselbiber Empfehlungen ableitet
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            Wechselbiber ist kein klassisches Vergleichsportal. Wir versuchen zuerst einzuordnen,
            welcher Schritt für einen Haushalt plausibel ist, bevor wir in einen Anbieter- oder Preisraum führen.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Unsere Logik</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              Erst Einordnung, dann Vergleich, dann Handlung.
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-slate-600">
              <p>
                Der Kernfunnel von Wechselbiber lautet: Startseite → Spar-Check → Ergebnis →
                sinnvoller nächster Schritt.
              </p>
              <p>
                Die entscheidende Frage lautet nicht: „Welcher Anbieter ist am billigsten?“ Sondern:
                „Was ist für diesen Haushalt jetzt der sinnvollste nächste Schritt?“
              </p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: 'Welche Daten wir nutzen',
                body: 'Wir arbeiten mit Marktpreisen, typischen Haushaltsprofilen, Heiztyp, Wohnfläche, Personenzahl und – wenn sinnvoll – groben Verbrauchswerten.',
              },
              {
                title: 'Was wir bewusst nicht tun',
                body: 'Wir versprechen keine scheinpräzisen Vertragsersparnisse, wenn uns dein echter Vertrag nicht vorliegt. Deshalb arbeiten wir im Funnel mit Richtungen und Spannen.',
              },
              {
                title: 'Wie Vergleichswege eingebunden sind',
                body: 'Vergleichsseiten und Partner tauchen erst dort auf, wo sie in der Produktlogik plausibel werden. Sie sind Folge eines Ergebnisses, nicht der Start des Produkts.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Transparenz</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900">Wie wir Geld verdienen</h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-slate-600">
              <p>
                Wenn du über unsere Links vergleichst, wechselst oder dich bei einem Partner anmeldest,
                erhalten wir gegebenenfalls eine Provision. Für dich entstehen dadurch keine Mehrkosten.
              </p>
              <p>
                Diese Provision entscheidet aber nicht darüber, welcher Schritt im Funnel zuerst empfohlen
                wird. Genau deshalb bauen wir das Produkt zuerst als Einordnung und erst danach als
                Entscheidungsraum.
              </p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">Wenn du tiefer einsteigen willst</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Nutze den Ratgeber, wenn du einen Sachverhalt erst verstehen willst, bevor du handelst.
              </p>
              <Link
                href="/ratgeber"
                className="mt-6 inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Zum Ratgeber →
              </Link>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">Wenn du direkt deine Lage prüfen willst</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Der Spar-Check ist der schnellste Weg, um aus allgemeiner Information wieder in eine
                konkrete Empfehlung zu kommen.
              </p>
              <Link
                href="/spar-check"
                className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-primary/90"
              >
                Spar-Check starten →
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
