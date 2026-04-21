import Image from 'next/image';
import Link from 'next/link';
import { RATGEBER_ENTRIES } from '@/lib/ratgeber';

const QUESTION_INTRO: Record<string, string> = {
  'Was bedeuten die Gaspreise 2026 konkret für meinen Haushalt?':
    'Für Nutzer, die wissen wollen, ob ihr Problem eher Marktpreis, Vertrag oder Grundversorgung ist.',
  'Warum kann Heizen 2026 trotz Marktruhe teurer bleiben?':
    'Für Nutzer, die politische Preisänderungen verstehen möchten, bevor sie handeln.',
  'Wie kann ich meine Heizkosten senken, ohne planlos zu investieren?':
    'Für Nutzer, die spürbar sparen möchten, aber noch nicht wissen, ob Tarif, Verhalten oder Technik ihr erster Hebel ist.',
  'Sollte ich eher den Tarif wechseln oder grundsätzlich über mein Heizsystem nachdenken?':
    'Für Nutzer, die zwischen Soforthebel und größerer Systementscheidung unterscheiden müssen.',
};

export default function RatgeberHubPage() {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Ratgeber</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
              Antworten auf die Fragen, die vor dem nächsten Energieschritt wirklich zählen.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
              Kein Content-Silo und keine lose Artikelsammlung. Hier findest du Orientierung zu realen
              Haushaltsfragen und immer einen sinnvollen nächsten Schritt zurück ins Produkt.
            </p>
          </div>

          <div className="relative min-h-[15rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/6">
            <Image
              src="/illustrations/editorial-energy-lines.svg"
              alt="Illustration für den Ratgeber-Hub"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {RATGEBER_ENTRIES.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {entry.category}
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                {entry.readingTime}
              </p>
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Nutzerfrage
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 transition group-hover:text-primary">
              {entry.question}
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">{QUESTION_INTRO[entry.question]}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">{entry.description}</p>
            <p className="mt-6 text-sm font-semibold text-primary">Antwort lesen →</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Methodik</p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">
            Warum diese Inhalte in den Funnel führen und nicht danebenlaufen.
          </h2>
          <div className="mt-5 space-y-4 text-base leading-7 text-slate-600">
            <p>
              Wechselbiber beantwortet Inhalte nicht nur, um Zeit auf der Seite zu verlängern. Jeder
              Artikel soll entweder Komplexität reduzieren oder helfen, den nächsten sinnvollen
              Schritt klarer zu sehen.
            </p>
            <p>
              Deshalb endet jeder Artikel nicht in einem toten Ende, sondern in einer sauberen
              Rückführung: Spar-Check, Preis-Wächter oder eine passende Vertiefung.
            </p>
          </div>
          <Link
            href="/methodik"
            className="mt-6 inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            So arbeiten wir →
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Tools als Vertiefung</p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">
            Mehr verstehen, ohne den Kernfunnel zu verlieren.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Preisrechner und Mikro-Tools bleiben erreichbar, aber bewusst nachgeordnet. Sie helfen,
            einzelne Fragen zu vertiefen, ersetzen aber nicht die Einordnung im Spar-Check.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Preisrechner', href: '/preisrechner' },
              { label: 'Dusch-Rechner', href: '/tools/dusch-rechner' },
              { label: 'Geräte-Check', href: '/tools/geraete-check' },
              { label: 'Günstig tanken', href: '/guenstig-tanken' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {item.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
