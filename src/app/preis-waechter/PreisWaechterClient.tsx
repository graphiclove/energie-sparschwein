'use client';

import { useState } from 'react';
import { subscribeToPriceWatcher } from '@/lib/priceWatcher';

export default function PreisWaechterClient({ initialEmail = '' }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

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
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-18 pt-32 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Preis-Wächter</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Für alle, die nicht sofort wechseln wollen.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Wir beobachten den Markt für dich und melden uns nur dann, wenn ein sinnvoller nächster Schritt ansteht.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-primary/15 bg-[#e9f4ec] p-8 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/70 px-4 py-4 text-sm text-slate-700">Wenn Preise in deiner Region fallen</div>
            <div className="rounded-2xl bg-white/70 px-4 py-4 text-sm text-slate-700">Wenn dein Tarif ausläuft</div>
            <div className="rounded-2xl bg-white/70 px-4 py-4 text-sm text-slate-700">Einmal pro Jahr als Tarif-Check</div>
          </div>

          {sent ? (
            <div className="mt-8 rounded-[1.6rem] border border-primary/25 bg-white px-6 py-5">
              <p className="text-xl font-bold text-slate-950">Preis-Wächter aktiviert ✓</p>
              <p className="mt-2 text-sm text-slate-600">
                {message || 'Wir informieren dich, sobald sich ein sinnvoller Wechsel für deinen Haushalt lohnt.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 rounded-[1.6rem] bg-white p-3 shadow-[0_25px_80px_-65px_rgba(15,23,42,0.2)]">
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-14 w-full rounded-[1.1rem] border border-slate-200 px-5 text-slate-950 outline-none transition focus:border-slate-300"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-14 items-center justify-center rounded-[1.1rem] bg-primary px-6 font-semibold text-slate-950 transition hover:bg-primary/90 md:min-w-[16rem]"
                >
                  {loading ? 'Wird aktiviert ...' : 'Preis-Wächter aktivieren →'}
                </button>
              </div>
              {message && <p className="px-2 pt-3 text-sm font-medium text-slate-600">{message}</p>}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
