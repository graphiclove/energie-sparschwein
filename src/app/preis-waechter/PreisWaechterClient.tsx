'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { subscribeToPriceWatcher } from '@/lib/priceWatcher';
import { getInitialSparCheckData, getSummaryLine } from '@/lib/sparCheck';

export default function PreisWaechterClient({ initialEmail = '' }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const summaryLine = useMemo(() => {
    if (typeof window === 'undefined') return '';

    const raw = window.localStorage.getItem('sparCheckData');
    if (!raw) return '';

    try {
      return getSummaryLine(getInitialSparCheckData());
    } catch {
      return '';
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void (async () => {
      setLoading(true);
      setMessage('');

      const result = await subscribeToPriceWatcher({
        email,
        source: 'price_watcher_page',
      });

      setLoading(false);
      setMessage(result.message ?? '');

      if (result.ok) {
        setSent(true);
        setEmail('');
      }
    })();
  };

  return (
    <div className="min-h-screen bg-[#eef2f2] text-slate-950">
      <section className="relative overflow-hidden bg-[#13263b] px-6 pb-18 pt-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(107,193,123,0.18),transparent_36%),linear-gradient(180deg,rgba(19,38,59,0.92)_0%,rgba(19,38,59,1)_100%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/85">
              Preis-Wächter
            </p>
            <h1 className="mt-4 text-balance text-5xl font-bold leading-[0.94] tracking-[-0.05em] md:text-6xl">
              Noch nicht wechseln ist okay. Solange du bewusst auf Beobachten stellst.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Der Preis-Wächter ist keine Notlösung und kein Newsletter-Hack. Er ist die Produktform
              für alle, die heute nicht handeln wollen, das Thema aber auch nicht wieder verlieren möchten.
            </p>

            {summaryLine ? (
              <div className="mt-8">
                <span className="rounded-full border border-white/12 bg-white/7 px-4 py-2 text-sm text-slate-100">
                  letzter bekannter Haushalt: {summaryLine}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_40px_90px_-72px_rgba(15,23,42,0.32)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Was beobachtet wird
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950">
                Drei konkrete Auslöser statt regelmäßiger Post.
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  {
                    title: 'Wenn Preise in deiner Region fallen',
                    body: 'Dann bekommst du einen Hinweis, dass ein neuer Blick auf deinen Tarifraum sinnvoll sein könnte.',
                  },
                  {
                    title: 'Wenn dein aktueller Tarif ausläuft',
                    body: 'Dann erinnern wir dich an den Moment, an dem ein Wechsel eher praktisch wird als heute.',
                  },
                  {
                    title: 'Wenn ein neuer Jahres-Check sinnvoll ist',
                    body: 'Dann bekommst du eine ruhige Wiedervorlage, ohne dass du das Thema selbst mitschleppen musst.',
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.4rem] bg-[#f6f8f8] p-5">
                    <p className="text-base font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-primary/20 bg-[#eaf4ec] p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Warum Warten rational sein kann
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950">
                Nicht jeder sinnvolle Schritt muss heute passieren.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-7 text-slate-700">
                <p>
                  Vielleicht willst du gerade keinen Vergleich starten, keine Unterlagen öffnen und
                  keine neue Entscheidung treffen. Das ist legitim.
                </p>
                <p>
                  Preis-Wächter heißt: Du pausierst bewusst, statt das Thema komplett aus dem Blick
                  zu verlieren. Genau dafür ist diese Produktphase da.
                </p>
              </div>
              <div className="mt-6 rounded-[1.4rem] bg-white/80 p-5">
                <p className="text-sm font-semibold text-slate-500">Was du bekommst</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                    <span>eine kurze Mail, wenn Beobachten in Handlung umschlagen sollte</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                    <span>keinen täglichen Preislärm und keine aggressive Sales-Tonalität</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                    <span>eine saubere Wiedervorlage statt erneuter Überforderung</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_40px_90px_-72px_rgba(15,23,42,0.32)]">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Aktivieren
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950">
                  Lass dir den nächsten sinnvollen Moment wieder vorlegen.
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Eine E-Mail reicht. Danach melden wir uns nur dann, wenn Beobachten in Handeln
                  umschlagen sollte.
                </p>
              </div>

              <div>
                {sent ? (
                  <div className="rounded-[1.6rem] border border-primary/25 bg-[#f3fbf5] px-6 py-5">
                    <p className="text-xl font-bold text-slate-950">Preis-Wächter aktiviert ✓</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {message ||
                        'Wir informieren dich, sobald sich ein sinnvoller nächster Schritt für deinen Haushalt ergibt.'}
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="rounded-[1.6rem] bg-[#f6f8f8] p-4"
                  >
                    <div className="flex flex-col gap-3">
                      <input
                        type="email"
                        placeholder="deine@email.de"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        className="h-14 w-full rounded-[1.1rem] border border-slate-200 bg-white px-5 text-slate-950 outline-none transition focus:border-slate-300"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex h-14 items-center justify-center rounded-[1.1rem] bg-slate-900 px-6 font-semibold text-white transition hover:bg-slate-800"
                      >
                        {loading ? 'Wird aktiviert ...' : 'Preis-Wächter aktivieren →'}
                      </button>
                    </div>
                    <p className="px-2 pt-4 text-sm leading-6 text-slate-500">
                      Keine Login-Hürde. Keine tägliche Werbung. Nur eine Wiedervorlage, wenn sie
                      sinnvoll wird.
                    </p>
                    {message ? (
                      <p className="px-2 pt-2 text-sm font-medium text-slate-600">{message}</p>
                    ) : null}
                  </form>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Wenn du doch weiter willst
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                Du kannst jederzeit wieder in Handlung wechseln.
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Preis-Wächter sperrt dich nicht in eine Wartelogik ein. Wenn du doch vergleichen
                willst, kannst du jederzeit zurück in den Entscheidungsraum gehen.
              </p>
              <Link
                href="/tarif-vergleich"
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[1rem] border border-slate-300 px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Zum Vergleichsraum →
              </Link>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Oder zurück zur Einordnung
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                Wenn du deine Ausgangslage noch einmal prüfen willst.
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Du kannst jederzeit wieder in den Spar-Check oder auf deine Empfehlung zurück und
                dort deine Angaben anpassen.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/spar-check/einordnung"
                  className="inline-flex min-h-12 items-center justify-center rounded-[1rem] border border-slate-300 px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Zur Einordnung →
                </Link>
                <Link
                  href="/spar-check"
                  className="inline-flex min-h-12 items-center justify-center rounded-[1rem] border border-slate-300 px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Spar-Check anpassen →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
