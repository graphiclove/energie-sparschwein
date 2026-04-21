'use client';

import { useEffect, useMemo, useState } from 'react';

type HeatingType = 'gas' | 'oil' | 'pellets' | 'heatpump' | 'unknown';

const heatingOptions = [
  { value: 'gas', label: 'Gas', subtitle: 'Konventionelle Heizung' },
  { value: 'oil', label: 'Heizöl', subtitle: 'Ältere Ölheizung' },
  { value: 'pellets', label: 'Pellets', subtitle: 'Erneuerbare Wärme' },
  { value: 'heatpump', label: 'Wärmepumpe', subtitle: 'Moderne Effizienz' },
  { value: 'unknown', label: 'Ich weiß es nicht', subtitle: 'Beste Schätzung' },
];

const currency = (value: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

const estimateCosts = (data: {
  heating: HeatingType;
  area: number;
  persons: number;
  electricity: number;
  km: number;
}) => {
  const rate =
    data.heating === 'gas'
      ? 0.136
      : data.heating === 'oil'
      ? 0.145
      : data.heating === 'pellets'
      ? 0.09
      : data.heating === 'heatpump'
      ? 0.09
      : 0.13;

  const heatingBase =
    data.heating === 'gas'
      ? data.area * 11.5
      : data.heating === 'oil'
      ? data.area * 14.5
      : data.heating === 'pellets'
      ? data.area * 9
      : data.area * 10.5;

  const heatingCost = heatingBase * rate;
  const electricityCost = data.electricity * 0.34;
  const mobilityCost = data.km * 0.2;

  const currentTotal = heatingCost + electricityCost + mobilityCost;
  const optimizedTotal = currentTotal * 0.82;
  const savings = Math.max(0, currentTotal - optimizedTotal);

  return {
    heatingCost,
    electricityCost,
    mobilityCost,
    currentTotal,
    optimizedTotal,
    savings,
  };
};

function getInitialPreisrechnerData() {
  if (typeof window === 'undefined') {
    return {
      heating: 'gas' as HeatingType,
      area: 120,
      persons: 2,
      electricity: 3800,
      km: 12000,
    };
  }

  const saved = localStorage.getItem('preisrechnerData');
  if (!saved) {
    return {
      heating: 'gas' as HeatingType,
      area: 120,
      persons: 2,
      electricity: 3800,
      km: 12000,
    };
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      heating: (parsed.heating ?? 'gas') as HeatingType,
      area: parsed.area ?? 120,
      persons: parsed.persons ?? 2,
      electricity: parsed.electricity ?? 3800,
      km: parsed.km ?? 12000,
    };
  } catch {
    localStorage.removeItem('preisrechnerData');
    return {
      heating: 'gas' as HeatingType,
      area: 120,
      persons: 2,
      electricity: 3800,
      km: 12000,
    };
  }
}

export default function Preisrechner() {
  const initialData = getInitialPreisrechnerData();
  const [heating, setHeating] = useState<HeatingType>(initialData.heating);
  const [area, setArea] = useState(initialData.area);
  const [persons, setPersons] = useState(initialData.persons);
  const [electricity, setElectricity] = useState(initialData.electricity);
  const [km, setKm] = useState(initialData.km);

  useEffect(() => {
    localStorage.setItem('preisrechnerData', JSON.stringify({ heating, area, persons, electricity, km }));
  }, [heating, area, persons, electricity, km]);

  const result = useMemo(
    () => estimateCosts({ heating, area, persons, electricity, km }),
    [heating, area, persons, electricity, km],
  );

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.16),transparent_18%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] pt-16 text-white">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.32em] text-slate-200">
                Preisrechner
              </span>
              <h1 className="mt-8 text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Dein smarter Energiepreis-Rechner für Haushalt & Mobilität
              </h1>
              <p className="mt-6 text-lg text-slate-300 sm:text-xl">
                Vergleiche Heizkosten, Stromverbrauch und Fahrleistung. Sieh sofort, wo dein Sparpotenzial liegt und welche Einsparungen möglich sind.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90">
                  Jetzt berechnen
                </a>
                <a
                  href="/spar-check"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white transition hover:border-white hover:bg-white/20">
                  Zum Spar-Check
                </a>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Schnell', value: '60 Sekunden' },
                  { label: 'Unabhängig', value: 'Kostenlos' },
                  { label: 'Transparent', value: 'Ohne Anmeldung' },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
                    <p className="font-semibold">{item.label}</p>
                    <p className="mt-2 text-base text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.28em] text-slate-400">
                <span>Live-Rechner</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-200">Neu</span>
              </div>
              <div className="mt-8 space-y-6">
                <div className="rounded-[1.75rem] bg-slate-950 p-6 ring-1 ring-white/10">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Jahreskosten</span>
                    <span className="font-semibold text-white">{currency(result.currentTotal)}</span>
                  </div>
                  <div className="mt-6 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" />
                  <p className="mt-4 text-sm text-slate-400">Strom, Heizung und Mobilität in einer Übersicht.</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-950 p-6 ring-1 ring-white/10">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Potenzial</span>
                    <span className="font-semibold text-emerald-300">{currency(result.savings)}</span>
                  </div>
                  <div className="mt-6 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300" />
                  <p className="mt-4 text-sm text-slate-400">So viel könntest du mit smarter Planung sparen.</p>
                </div>
              </div>
              <div className="mt-8 rounded-[1.75rem] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-800 p-6 shadow-inner shadow-cyan-500/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Optimiertes Ziel</p>
                    <p className="mt-2 text-3xl font-bold text-white">{currency(result.optimizedTotal)}</p>
                  </div>
                  <div className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">-18%</div>
                </div>
                <p className="mt-4 text-sm text-slate-400">Wenn du Kostenhebel gezielt angehst und nicht alles auf einmal lösen willst.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="bg-background py-20 px-6">
        <div className="max-w-7xl mx-auto grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-[2rem] bg-white p-10 shadow-2xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Eingabedaten</p>
                  <h2 className="mt-3 text-3xl font-bold text-slate-950">So kalkulierst du richtig</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">lokal gespeichert</span>
              </div>
              <p className="mt-4 max-w-2xl text-slate-600">
                Gib deine tatsächlichen Werte ein und der Rechner aktualisiert die Prognose sofort. Alle Daten bleiben in deinem Browser.
              </p>

              <div className="mt-10 grid gap-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">Wohnfläche (m²)</label>
                  <input
                    type="number"
                    min={30}
                    max={350}
                    value={area}
                    onChange={(event) => setArea(Number(event.target.value))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg text-slate-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">Personen im Haushalt</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={persons}
                    onChange={(event) => setPersons(Number(event.target.value))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg text-slate-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Heizungstyp</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {heatingOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setHeating(option.value as HeatingType)}
                        className={`rounded-3xl border p-4 text-left transition ${
                          heating === option.value
                            ? 'border-cyan-500 bg-cyan-500/10 text-slate-950'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-500 hover:bg-cyan-50'
                        }`}>
                        <p className="font-semibold">{option.label}</p>
                        <p className="mt-1 text-sm text-slate-500">{option.subtitle}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">Stromverbrauch (kWh/Jahr)</label>
                  <input
                    type="number"
                    min={1200}
                    max={8000}
                    value={electricity}
                    onChange={(event) => setElectricity(Number(event.target.value))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg text-slate-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">Fahrleistung (km/Jahr)</label>
                  <input
                    type="number"
                    min={0}
                    max={50000}
                    value={km}
                    onChange={(event) => setKm(Number(event.target.value))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg text-slate-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Auf einen Blick</p>
                <h3 className="mt-4 text-2xl font-bold">Kosten sofort verstehen</h3>
                <p className="mt-4 text-slate-400">Die wichtigsten Zahlen zeigen dir direkt, wo du am Budget sparen kannst.</p>
                <ul className="mt-6 space-y-3 text-slate-300">
                  <li>• Heizkosten, Stromkosten und Fahrkosten in einem Rechenmodell</li>
                  <li>• Optimiertes Ziel mit erkennbarem Sparpotenzial</li>
                  <li>• Ohne Anmeldung und lokal gespeichert</li>
                </ul>
              </div>
              <div className="rounded-[2rem] bg-slate-50 p-8 shadow-2xl">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">So funktioniert der Rechner</p>
                <h3 className="mt-4 text-2xl font-bold text-slate-950">In drei einfachen Schritten</h3>
                <ol className="mt-6 space-y-4 text-slate-600">
                  <li>1. Wohnfläche, Personen und Verbrauch eingeben</li>
                  <li>2. Kosten-Übersicht ansehen</li>
                  <li>3. Sparpotenzial nutzen und Tarifwechsel planen</li>
                </ol>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-8 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Deine Prognose</p>
                  <h2 className="mt-3 text-3xl font-bold">Kernzahlen</h2>
                </div>
                <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200">Live</span>
              </div>
              <div className="mt-8 grid gap-4">
                {[
                  { label: 'Heizung', value: currency(result.heatingCost), accent: 'text-amber-300' },
                  { label: 'Strom', value: currency(result.electricityCost), accent: 'text-cyan-300' },
                  { label: 'Mobilität', value: currency(result.mobilityCost), accent: 'text-lime-300' },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl bg-slate-950 p-6 ring-1 ring-white/10">
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
                    <p className={`mt-4 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-black p-6 text-white shadow-inner shadow-cyan-500/10">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Aktuelle Jahreskosten</p>
                <p className="mt-4 text-5xl font-bold">{currency(result.currentTotal)}</p>
                <p className="mt-2 text-slate-400">Basierend auf deiner Eingabe.</p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-800 p-8 text-white shadow-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Sparpotenzial</p>
              <h2 className="mt-4 text-4xl font-bold text-white">{currency(result.savings)}</h2>
              <p className="mt-3 text-slate-400">Das ist der Betrag, den du mit besseren Tarifen und intelligentem Verbrauch sparen kannst.</p>
              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm text-slate-300">Tarife vergleichen und wechseln</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm text-slate-300">Verbrauch in günstigen Stunden verlagern</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm text-slate-300">Effizienzpotenzial für Heizung prüfen</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
