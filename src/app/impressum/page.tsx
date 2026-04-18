export default function Impressum() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Rechtliches</p>
          <h1 className="mt-4 text-4xl font-bold">Impressum</h1>
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6 text-slate-600 leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Angaben gemäß § 5 TMG</h2>
              <p>Wechselbiber<br />Platzhalter GmbH<br />Musterstraße 1<br />12345 Musterstadt</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Kontakt</h2>
              <p>E-Mail: hallo@wechselbiber.de</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)</h2>
              <p>Name Vorname<br />Musterstraße 1<br />12345 Musterstadt</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Haftungsausschluss</h2>
              <p>
                Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität
                der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Affiliate-Hinweis</h2>
              <p>
                Diese Website enthält Affiliate-Links. Bei einem Vertragsabschluss über diese Links erhalten wir eine Provision,
                ohne dass für dich Mehrkosten entstehen. Unsere redaktionellen Inhalte sind davon unabhängig.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
