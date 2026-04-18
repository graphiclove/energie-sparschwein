'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RATGEBER_ENTRIES } from '@/lib/ratgeber';

export default function RatgeberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <section className="border-t border-slate-200 bg-white/70 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Ratgeber</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Themen & Artikel</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Der Hub für Preisentwicklung, Spar-Hebel und Heizungsfragen. Ideal, um Besucher vor dem Vergleich besser vorzuwärmen.
            </p>

            <div className="relative mt-5 h-32 overflow-hidden rounded-[1.75rem] bg-slate-50">
              <Image
                src="/illustrations/editorial-energy-lines.svg"
                alt="Illustration für den Ratgeber-Bereich"
                fill
                className="object-cover"
              />
            </div>

            <nav className="mt-6 space-y-2">
              <Link
                href="/ratgeber"
                className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  pathname === '/ratgeber'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Übersicht
              </Link>
              {RATGEBER_ENTRIES.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={`block rounded-2xl px-4 py-3 transition ${
                    pathname === entry.href
                      ? 'bg-primary/10 text-primary'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">{entry.category}</p>
                  <p className="mt-1 text-sm font-semibold">{entry.title}</p>
                  <p className="mt-1 text-xs opacity-70">{entry.readingTime}</p>
                </Link>
              ))}
            </nav>

            <div className="mt-6 rounded-[1.75rem] bg-slate-950 p-4 text-white">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
                Nächster Schritt
              </p>
              <h3 className="mt-3 text-lg font-bold">Lieber direkt rechnen?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Nach dem Lesen kannst du dein Sparpotenzial sofort mit wenigen Angaben prüfen.
              </p>
              <Link
                href="/spar-check"
                className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-primary/90"
              >
                Zum Spar-Check
              </Link>
            </div>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </section>
    </div>
  );
}
