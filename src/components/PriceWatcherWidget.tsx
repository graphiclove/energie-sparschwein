'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { subscribeToPriceWatcher } from '@/lib/priceWatcher';

export default function PriceWatcherWidget() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 260) setVisible(true);
    };

    const timer = window.setTimeout(() => setVisible(true), 1800);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void (async () => {
      setLoading(true);
      setMessage('');

      const result = await subscribeToPriceWatcher({
        email,
        source: 'floating_price_watcher_widget',
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
    <div
      className={`pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex justify-end transition-all duration-700 md:inset-x-6 md:bottom-6 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      }`}
    >
      <div className="pointer-events-auto relative flex items-end">
        {open && (
          <div className="absolute bottom-20 right-0 w-[min(25rem,calc(100vw-2rem))] overflow-hidden rounded-[1.8rem] border border-white/20 bg-[linear-gradient(180deg,rgba(19,38,59,0.88),rgba(19,38,59,0.82))] text-white shadow-[0_35px_120px_-55px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:w-[25rem]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_36%,rgba(255,255,255,0.01)_100%)]" />
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-primary">Preis-Wächter</p>
                  <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em]">
                    Wir sagen dir Bescheid, sobald sich ein Wechsel lohnt.
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white"
                  aria-label="Preis-Wächter schließen"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Für alle, die nicht sofort wechseln wollen: Wir helfen dir, den Markt im Blick zu behalten, statt ständig
                selbst nachsehen zu müssen.
              </p>
            </div>

            <div className="px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  'Markt im Blick behalten',
                  'Nur melden, wenn es relevant wird',
                  'Kostenlos und ohne Druck',
                ].map((item) => (
                  <div key={item} className="rounded-[1.15rem] border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-slate-200 backdrop-blur-md">
                    {item}
                  </div>
                ))}
              </div>

              {sent ? (
                <div className="mt-5 rounded-[1.4rem] border border-primary/30 bg-primary/10 px-5 py-4 text-[#d9f3df]">
                  <p className="text-lg font-semibold">Preis-Wächter aktiviert ✓</p>
                  <p className="mt-1 text-sm text-[#d9f3df]/85">
                    {message || 'Wir melden uns, sobald sich ein sinnvoller Wechsel abzeichnet.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5">
                  <div className="rounded-[1.45rem] bg-white p-2.5 shadow-[0_18px_50px_-38px_rgba(0,0,0,0.45)]">
                    <div className="flex flex-col gap-2 md:flex-row">
                      <input
                        type="email"
                        placeholder="deine@email.de"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-13 w-full rounded-[1rem] border border-slate-200 bg-white px-4 text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-slate-300"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex h-13 items-center justify-center rounded-[1rem] bg-primary px-5 font-semibold whitespace-nowrap text-slate-950 transition hover:bg-primary/90"
                      >
                        {loading ? 'Wird aktiviert ...' : 'Aktivieren →'}
                      </button>
                    </div>
                  </div>
                  {message && (
                    <p className="mt-3 text-sm font-medium text-slate-300">{message}</p>
                  )}
                </form>
              )}

              <p className="mt-4 text-xs leading-6 text-slate-400">
                Kostenlos. Kein Spam. Jederzeit abmeldbar. Mehr dazu in unserer{' '}
                <Link href="/datenschutz" className="underline underline-offset-2 transition hover:text-slate-200">
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="group flex items-center gap-3 rounded-full border border-white/15 bg-[linear-gradient(180deg,rgba(19,38,59,0.82),rgba(19,38,59,0.72))] px-4 py-3 text-white shadow-[0_18px_60px_-32px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-[linear-gradient(180deg,rgba(23,50,77,0.86),rgba(23,50,77,0.76))] md:px-5"
          aria-expanded={open}
          aria-controls="price-watcher-widget"
        >
          <span className="relative flex h-11 w-11 items-center justify-center">
            {!open && (
              <>
                <span className="absolute inset-0 rounded-full bg-primary/25 animate-ping" />
                <span className="absolute inset-0 rounded-full border border-primary/40" />
              </>
            )}
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),rgba(255,255,255,0.08)_38%,rgba(107,193,123,0.88)_100%)] text-slate-950 shadow-[0_10px_30px_-18px_rgba(107,193,123,0.8)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M12 4a4 4 0 0 0-4 4v2.4c0 .6-.2 1.2-.6 1.7L6 14h12l-1.4-1.9c-.4-.5-.6-1.1-.6-1.7V8a4 4 0 0 0-4-4Z" />
                <path d="M10 18a2 2 0 0 0 4 0" />
              </svg>
            </span>
          </span>
          <span className="hidden text-left md:block">
            <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary/90">Preis-Wächter</span>
            <span className="mt-0.5 block text-sm font-medium text-white/90">
              Nicht sofort wechseln? Wir beobachten mit.
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
