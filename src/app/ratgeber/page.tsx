import Image from 'next/image';
import Link from 'next/link';
import { RATGEBER_ENTRIES } from '@/lib/ratgeber';

const CATEGORY_INTRO = {
  Preise: 'Preisanalysen, Marktbewegungen und die wichtigsten Vergleichslogiken.',
  Heizen: 'Praktische Einordnung zu Heizsystemen, laufenden Kosten und Sofortmaßnahmen.',
  Politik: 'Regulatorische Änderungen, CO2-Kosten und ihre Wirkung auf Haushalte.',
};

export default function RatgeberHubPage() {
  const categories = Array.from(new Set(RATGEBER_ENTRIES.map((entry) => entry.category)));

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Hub</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
              Ratgeber für Preise, Heizkosten und die besten nächsten Schritte
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
              Hier landen alle Artikel, die Besucher vor dem Vergleich aufwärmen sollen: verständlich,
              konkret und immer mit klarem nächsten Schritt.
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

      {categories.map((category) => (
        <section key={category} className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{category}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{CATEGORY_INTRO[category]}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {RATGEBER_ENTRIES.filter((entry) => entry.category === category).map((entry) => (
              <Link
                key={entry.href}
                href={entry.href}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{entry.readingTime}</p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{entry.category}</span>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-slate-900 transition group-hover:text-primary">{entry.title}</h2>
                <p className="mt-3 leading-relaxed text-slate-600">{entry.description}</p>
                <p className="mt-5 text-sm font-semibold text-primary">Artikel lesen →</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
