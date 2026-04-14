import Link from 'next/link';

export default function KommtBald() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-24 pt-40 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">In Kürze</p>
          <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight md:text-6xl">Kommt bald</h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-slate-300">
            Wir arbeiten an diesem Inhalt. Schau bald wieder vorbei – oder starte direkt mit unserem Spar-Check.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/spar-check"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              Spar-Check starten →
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 font-semibold transition hover:bg-white/20"
            >
              Zur Startseite
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
