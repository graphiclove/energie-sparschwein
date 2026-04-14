'use client';

import Link from 'next/link';
import { useState } from 'react';

// ─── Daten ────────────────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'PLZ eingeben',
    desc: 'Gib deine Postleitzahl ein und beantworte drei kurze Fragen zu deinem Haushalt.',
  },
  {
    step: '02',
    title: 'Analyse lesen',
    desc: 'Wir zeigen dir konkret, was du aktuell zahlst – und was mit besseren Tarifen möglich wäre.',
  },
  {
    step: '03',
    title: 'Wechseln & sparen',
    desc: 'Ein Klick bringt dich direkt zum passenden Vergleichsportal. Wechsel dauert 5 Minuten.',
  },
];

const FEATURES = [
  {
    icon: '⚡',
    title: 'Gas & Strom vergleichen',
    desc: 'Persönliche Empfehlungen basierend auf deinem Heizungstyp, deiner Wohnfläche und deiner Region.',
    href: '/tarif-vergleich',
    bg: 'bg-blue-50',
  },
  {
    icon: '⛽',
    title: 'Günstig tanken',
    desc: 'Echtzeit-Preise der Tankstellen in deiner Nähe – gefiltert nach Kraftstoff und Radius.',
    href: '/guenstig-tanken',
    bg: 'bg-amber-50',
  },
  {
    icon: '🧮',
    title: 'Heizkosten berechnen',
    desc: 'Gib deine Wohnfläche und deinen Heizungstyp ein und sieh dein Sparpotenzial in Echtzeit.',
    href: '/preisrechner',
    bg: 'bg-green-50',
  },
  {
    icon: '🏠',
    title: 'Heizung modernisieren',
    desc: 'Pellets, Wärmepumpe oder Gas? Wir erklären Kosten, Förderungen und den Unterschied.',
    href: '/ratgeber/heizkosten-senken',
    bg: 'bg-purple-50',
  },
];

const TRUST = [
  {
    icon: '🔍',
    title: 'Unabhängig',
    desc: 'Wir sind kein Vergleichsportal. Wir helfen dir verstehen, bevor du entscheidest.',
  },
  {
    icon: '📊',
    title: 'Transparent',
    desc: 'Jede Berechnung zeigt ihre Grundlage. Keine Phantomzahlen, keine versteckten Annahmen.',
  },
  {
    icon: '🎁',
    title: 'Kostenlos',
    desc: 'Alle Tools sind und bleiben kostenlos. Wir finanzieren uns über transparente Provisionen.',
  },
];

// ─── Hauptkomponente ──────────────────────────────────────────────────────────
export default function Home() {
  const [zip,   setZip]   = useState('');
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length === 5) window.location.href = `/spar-check?zip=${zip}`;
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) setSent(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#1e3a5f_0%,#0f172a_60%)] px-6 text-white">
        {/* Subtiler Hintergrund-Akzent */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(34,197,94,0.08),transparent_50%)]" />

        <div className="relative w-full max-w-3xl text-center">
          {/* Social Proof */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-5 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            10.000+ Haushalte haben bereits gespart
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
            Finde heraus, wo du<br />
            <span className="text-primary">bei Energie draufzahlst.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300 sm:text-xl">
            Der kostenlose Energie-Check für deinen Haushalt – ohne Anmeldung, ohne Schnörkel.
          </p>

          {/* PLZ-Eingabe */}
          <form onSubmit={handleZipSubmit} className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Deine Postleitzahl"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
              maxLength={5}
              className="h-14 w-full rounded-2xl bg-white/10 px-6 text-center text-lg font-semibold text-white placeholder:text-slate-400 outline-none ring-1 ring-white/20 backdrop-blur-sm transition focus:bg-white/15 focus:ring-white/40 sm:w-52"
            />
            <button
              type="submit"
              className="h-14 rounded-2xl bg-primary px-8 text-base font-semibold text-slate-950 shadow-lg shadow-primary/25 transition hover:bg-primary/90 active:scale-[0.98]"
            >
              Spar-Check starten →
            </button>
          </form>

          {/* Trust-Badges */}
          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-slate-400">
            {['Kostenlos', 'Unverbindlich', '60 Sekunden'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-primary/70" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll-Indikator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── WIE ES FUNKTIONIERT ───────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">So einfach</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">In drei Schritten zu deinem Spartipp</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="group relative rounded-2xl border border-slate-100 bg-background p-8 transition hover:border-primary/20 hover:shadow-lg">
                <p className="mb-4 font-mono text-5xl font-bold text-slate-100 transition group-hover:text-primary/15">{s.step}</p>
                <h3 className="mb-2 text-xl font-bold text-slate-900">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/spar-check"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              Jetzt starten →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURE-KACHELN ──────────────────────────────────────────────── */}
      <section className="bg-background py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Unsere Tools</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Was wir für dich machen</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className={`group flex flex-col rounded-2xl border border-slate-200/60 ${f.bg} p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm text-3xl">
                  {f.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">{f.title}</h3>
                <p className="flex-1 text-slate-600 leading-relaxed">{f.desc}</p>
                <p className="mt-6 text-sm font-semibold text-primary transition group-hover:gap-2">
                  Mehr erfahren →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── VERTRAUEN ────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              Unabhängig.&ensp;Transparent.&ensp;Kostenlos.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Energie-Sparschwein ist kein Schnäppchen-Portal. Wir sind dein Kosten-Dolmetscher.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TRUST.map((t) => (
              <div key={t.title} className="rounded-2xl border border-slate-100 bg-background p-8 text-center">
                <div className="mb-4 text-4xl">{t.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">{t.title}</h3>
                <p className="text-slate-500 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREIS-WÄCHTER / NEWSLETTER ───────────────────────────────────── */}
      <section className="bg-[#0f172a] py-24 px-6 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Preis-Wächter</p>
          <h2 className="mt-3 text-4xl font-bold leading-tight">
            Wir informieren dich,<br />wenn die Preise sinken.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-slate-400">
            Kostenlos. Kein Spam. Jederzeit abmeldbar.
          </p>

          {sent ? (
            <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/10 px-8 py-6 text-primary">
              <p className="text-xl font-semibold">Angemeldet! ✓</p>
              <p className="mt-1 text-sm text-primary/80">Wir melden uns, sobald die Preise fallen.</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 w-full rounded-2xl bg-white/10 px-6 text-white placeholder:text-slate-500 outline-none ring-1 ring-white/20 transition focus:bg-white/15 focus:ring-white/40 sm:w-72"
              />
              <button
                type="submit"
                className="h-14 rounded-2xl bg-primary px-8 font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90"
              >
                Jetzt anmelden
              </button>
            </form>
          )}

          <p className="mt-5 text-xs text-slate-600">
            Mit der Anmeldung stimmst du unserer{' '}
            <Link href="/datenschutz" className="underline underline-offset-2 hover:text-slate-400 transition">
              Datenschutzerklärung
            </Link>{' '}
            zu.
          </p>
        </div>
      </section>

    </div>
  );
}
