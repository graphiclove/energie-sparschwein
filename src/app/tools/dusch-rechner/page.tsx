'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

// ─── Konstanten ───────────────────────────────────────────────────────────────
const DURATION_OPTIONS  = [3, 5, 8, 10, 15] as const;
const TEMP_OPTIONS      = [35, 37, 38, 39, 40, 42] as const;
const FREQ_OPTIONS      = [3, 4, 5, 6, 7, 10, 14] as const;

type HeatingKey  = 'gas' | 'oil' | 'electric' | 'heatpump';
type ShowerHead  = 'standard' | 'eco';

interface HeatingOption {
  key:     HeatingKey;
  label:   string;
  icon:    string;
  desc:    string;
  pricePerKwh: number;  // €/kWh Energie-Inputkosten
  eff:         number;  // Wirkungsgrad (<1) oder COP (>1)
}

const HEATING_OPTIONS: HeatingOption[] = [
  { key: 'gas',      label: 'Gas',               icon: '🔥', desc: 'Gasboiler',           pricePerKwh: 0.105, eff: 0.90 },
  { key: 'oil',      label: 'Heizöl',            icon: '🛢️', desc: 'Ölheizung',          pricePerKwh: 0.105, eff: 0.85 },
  { key: 'electric', label: 'Durchlauferhitzer', icon: '⚡', desc: 'Elektrisch',           pricePerKwh: 0.35,  eff: 0.98 },
  { key: 'heatpump', label: 'Wärmepumpe',        icon: '♻️', desc: 'Warmwasser-WP, COP 3,5', pricePerKwh: 0.30, eff: 3.50 },
];

const LPM: Record<ShowerHead, number> = { standard: 12, eco: 7 };

// ─── Berechnung ───────────────────────────────────────────────────────────────
interface Result {
  liters:        number;
  energyKwh:     number;
  costPerShower: number;
  showersPerYear: number;
  costPerMonth:  number;
  costPerYear:   number;
  cheapestKey:   HeatingKey;
  cheapestCostPerShower: number;
  ecoHeadSaving: number;   // €/Jahr wenn man auf Eco-Duschkopf wechselt
}

function calculate(
  durationMin: number,
  tempC:       number,
  heatingKey:  HeatingKey,
  freqPerWeek: number,
  showerHead:  ShowerHead,
): Result {
  const lpm    = LPM[showerHead];
  const liters = durationMin * lpm;

  // Physik: Q [kWh] = m [L] × ΔT [K] × spezifische Wärmekapazität (0.00116 kWh/L/K)
  // Kaltwasser-Eingang: 10°C
  const energyKwh = liters * (tempC - 10) * 0.00116;

  const opt = HEATING_OPTIONS.find(h => h.key === heatingKey)!;
  // Kosten = Energiebedarf × Preis pro kWh Eingansenergie / Wirkungsgrad (oder × 1/COP für WP)
  const costPerShower = energyKwh * opt.pricePerKwh / opt.eff;

  const showersPerYear = freqPerWeek * 52;
  const costPerYear    = costPerShower * showersPerYear;
  const costPerMonth   = costPerYear / 12;

  // Günstigste Alternative
  const allCosts = HEATING_OPTIONS.map(h => ({
    key:  h.key,
    cost: energyKwh * h.pricePerKwh / h.eff,
  }));
  const cheapest = allCosts.reduce((a, b) => a.cost < b.cost ? a : b);

  // Sparduschkopf-Differenz (nur relevant wenn Standard gewählt)
  const ecoLiters    = durationMin * LPM.eco;
  const ecoEnergy    = ecoLiters * (tempC - 10) * 0.00116;
  const ecoCost      = ecoEnergy * opt.pricePerKwh / opt.eff;
  const ecoHeadSaving = (costPerShower - ecoCost) * showersPerYear;

  return {
    liters,
    energyKwh,
    costPerShower,
    showersPerYear,
    costPerMonth,
    costPerYear,
    cheapestKey:            cheapest.key as HeatingKey,
    cheapestCostPerShower:  cheapest.cost,
    ecoHeadSaving,
  };
}

// ─── Formatierung ─────────────────────────────────────────────────────────────
const fmt    = (n: number, dec = 2) =>
  n.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtEur = (n: number, dec = 2) => `${fmt(n, dec)} €`;

const TEMP_LABEL: Record<number, string> = {
  35: 'Lauwarm', 37: 'Warm', 38: 'Warm', 39: 'Heiß', 40: 'Heiß', 42: 'Sehr heiß',
};

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────
export default function DuschRechner() {
  const [duration,   setDuration]   = useState<number>(8);
  const [temp,       setTemp]       = useState<number>(38);
  const [heating,    setHeating]    = useState<HeatingKey>('gas');
  const [freqPerWeek, setFreq]      = useState<number>(7);
  const [showerHead, setShowerHead] = useState<ShowerHead>('standard');
  const [copied,     setCopied]     = useState(false);

  const result = useMemo(
    () => calculate(duration, temp, heating, freqPerWeek, showerHead),
    [duration, temp, heating, freqPerWeek, showerHead],
  );

  const heatingLabel = HEATING_OPTIONS.find(h => h.key === heating)!.label;
  const cheapestLabel = HEATING_OPTIONS.find(h => h.key === result.cheapestKey)!.label;
  const hasCheaperHeating = result.cheapestKey !== heating;

  const handleShare = async () => {
    const text =
      `Meine Dusche kostet ${fmtEur(result.costPerShower)} pro Duschgang.\n` +
      `Das macht ${fmtEur(result.costPerYear, 0)} im Jahr ` +
      `(${duration} Min, ${temp}°C, ${heatingLabel}, ${freqPerWeek}× pro Woche).\n` +
      `Berechnet mit Wechselbiber → wechselbiber.de/tools/dusch-rechner`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Tool</p>
          <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Heiß-Dusch-Rechner
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-slate-300">
            Was kostet deine Dusche wirklich? Stelle Dauer, Temperatur, Heizung und Duschkopf ein.
          </p>
        </div>
      </section>

      {/* ── Eingaben ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl space-y-8">

          {/* 1. Duschdauer */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              1 · Duschdauer
            </p>
            <div className="grid grid-cols-5 gap-3">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`rounded-xl py-4 text-center font-bold transition hover:-translate-y-0.5 ${
                    duration === d
                      ? 'bg-primary text-slate-950 shadow-md shadow-primary/20'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/30 hover:bg-primary/5'
                  }`}
                >
                  <span className="block text-xl">{d}</span>
                  <span className="block text-xs font-normal opacity-60">Min</span>
                </button>
              ))}
            </div>
            <div className="mt-5">
              <input
                type="range"
                min={3} max={15} step={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>3 Min</span>
                <span className="font-semibold text-primary">{duration} Minuten</span>
                <span>15 Min</span>
              </div>
            </div>
          </div>

          {/* 2. Temperatur */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              2 · Wassertemperatur
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {TEMP_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTemp(t)}
                  className={`rounded-xl py-4 text-center font-bold transition hover:-translate-y-0.5 ${
                    temp === t
                      ? 'bg-primary text-slate-950 shadow-md shadow-primary/20'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/30 hover:bg-primary/5'
                  }`}
                >
                  <span className="block text-lg">{t}°</span>
                  <span className="block text-[10px] font-normal leading-tight opacity-60">
                    {TEMP_LABEL[t]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Duschkopf */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              3 · Duschkopf-Typ
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                { key: 'standard' as ShowerHead, icon: '🚿', label: 'Herkömmlicher Duschkopf', lpm: 12, desc: '~12 Liter pro Minute' },
                { key: 'eco'      as ShowerHead, icon: '💧', label: 'Wassersparender Duschkopf', lpm: 7, desc: '~7 Liter pro Minute' },
              ] as const).map((h) => (
                <button
                  key={h.key}
                  onClick={() => setShowerHead(h.key)}
                  className={`flex items-center gap-4 rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${
                    showerHead === h.key
                      ? 'border-primary/40 bg-primary/5 shadow-md shadow-primary/10'
                      : 'border-slate-200 bg-slate-50 hover:border-primary/20'
                  }`}
                >
                  <span className="text-3xl">{h.icon}</span>
                  <div className="flex-1">
                    <p className={`font-bold ${showerHead === h.key ? 'text-primary' : 'text-slate-800'}`}>
                      {h.label}
                    </p>
                    <p className="text-xs text-slate-500">{h.desc}</p>
                  </div>
                  {showerHead === h.key && <span className="ml-auto shrink-0 text-primary">✓</span>}
                </button>
              ))}
            </div>

            {/* Tipp: Sparduschkopf wenn Standard gewählt */}
            {showerHead === 'standard' && result.ecoHeadSaving > 0 && (
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                <span className="mt-0.5 shrink-0 text-amber-500">💡</span>
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Tipp:</strong> Mit einem Sparduschkopf (ab 15 €) sparst du{' '}
                  <strong>{fmtEur(result.ecoHeadSaving, 0)}</strong> pro Jahr –
                  bei sonst gleichen Gewohnheiten.
                </p>
              </div>
            )}
          </div>

          {/* 4. Heizungstyp */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              4 · Warmwasser-Quelle
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {HEATING_OPTIONS.map((h) => (
                <button
                  key={h.key}
                  onClick={() => setHeating(h.key)}
                  className={`flex items-center gap-4 rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${
                    heating === h.key
                      ? 'border-primary/40 bg-primary/5 shadow-md shadow-primary/10'
                      : 'border-slate-200 bg-slate-50 hover:border-primary/20'
                  }`}
                >
                  <span className="text-2xl">{h.icon}</span>
                  <div className="flex-1">
                    <p className={`font-bold ${heating === h.key ? 'text-primary' : 'text-slate-800'}`}>
                      {h.label}
                    </p>
                    <p className="text-xs text-slate-500">{h.desc}</p>
                  </div>
                  {heating === h.key && <span className="ml-auto shrink-0 text-primary">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Duschfrequenz */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              5 · Wie oft duschst du pro Woche?
            </p>
            <p className="mb-5 text-xs text-slate-400">= {freqPerWeek * 52} Duschen pro Jahr</p>
            <div className="grid grid-cols-7 gap-2">
              {FREQ_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFreq(f)}
                  className={`rounded-xl py-3 text-center font-bold transition hover:-translate-y-0.5 ${
                    freqPerWeek === f
                      ? 'bg-primary text-slate-950 shadow-md shadow-primary/20'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/30 hover:bg-primary/5'
                  }`}
                >
                  <span className="block text-base">{f}×</span>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="range"
                min={1} max={14} step={1}
                value={freqPerWeek}
                onChange={(e) => setFreq(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>1× / Woche</span>
                <span className="font-semibold text-primary">{freqPerWeek}× / Woche</span>
                <span>14× / Woche</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Ergebnis ─────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl">

          {/* Hauptzahl */}
          <div className="mb-8 rounded-3xl bg-linear-to-br from-slate-900 to-slate-800 p-10 text-center text-white shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">
              Deine Dusche kostet
            </p>
            <p className="mt-4 font-bold tracking-tight text-white" style={{ fontSize: 'clamp(3rem, 12vw, 5rem)' }}>
              {fmtEur(result.costPerShower)}
            </p>
            <p className="mt-1 text-slate-400">pro Duschgang</p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 px-5 py-4">
                <p className="text-2xl font-bold">{fmtEur(result.costPerMonth, 0)}</p>
                <p className="mt-0.5 text-xs text-slate-400">pro Monat</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-5 py-4">
                <p className="text-2xl font-bold">{fmtEur(result.costPerYear, 0)}</p>
                <p className="mt-0.5 text-xs text-slate-400">pro Jahr</p>
              </div>
            </div>
          </div>

          {/* Berechnung aufgedröselt */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Berechnung</p>
            <dl className="text-sm">
              {[
                { label: 'Wassermenge',         value: `${result.liters} L (${duration} Min × ${LPM[showerHead]} L/Min)` },
                { label: 'Energiebedarf',        value: `${fmt(result.energyKwh, 3)} kWh` },
                { label: 'Heizungstyp',          value: heatingLabel },
                { label: 'Duschkopf',            value: showerHead === 'eco' ? 'Wassersparend (7 L/Min)' : 'Herkömmlich (12 L/Min)' },
                { label: 'Duschen pro Jahr',     value: `${result.showersPerYear} (${freqPerWeek}× / Woche × 52)` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-4 border-b border-slate-100 py-2 last:border-0">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="font-semibold text-slate-800 text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Spar-Hinweis: günstigere Heizquelle */}
          {hasCheaperHeating ? (
            <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-lg">💡</div>
                <div>
                  <p className="font-bold text-slate-900">
                    Mit {cheapestLabel} sparst du{' '}
                    {fmtEur((result.costPerShower - result.cheapestCostPerShower) * result.showersPerYear, 0)} / Jahr
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Bei {result.showersPerYear} Duschen/Jahr und sonst gleichen Gewohnheiten.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-lg">🏆</div>
                <div>
                  <p className="font-bold text-slate-900">Du heizt bereits am günstigsten!</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {heatingLabel} ist in dieser Auswahl der effizienteste Warmwassertyp.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Aktionen */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleShare}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md"
            >
              {copied ? <><span>✓</span> Kopiert!</> : <><span>📤</span> Ergebnis teilen</>}
            </button>
            <Link
              href="/spar-check"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              Insgesamt sparen → Spar-Check
            </Link>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            Preise 2026. Kaltwasser 10°C. Ohne Wasserleitungsverluste. Gas/Öl: Durchschnittspreise BDEW.
          </p>
        </div>
      </section>

      {/* ── Kontext-Infos ────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">Was kostet eine Dusche in Deutschland?</h2>
          <div className="space-y-4">
            {([
              { icon: '⏱️', title: 'Durchschnittliche Duschdauer: 8 Minuten', body: 'Deutsche duschen im Schnitt 8 Minuten. Das entspricht 96 Litern beim herkömmlichen Duschkopf.' },
              { icon: '🌡️', title: 'Temperatur macht den Unterschied', body: 'Von 38°C auf 42°C steigt der Energieverbrauch um ~16%. Zwei Grad kühler bedeutet oft 50–80 € weniger im Jahr.' },
              { icon: '💧', title: 'Sparduschkopf: Rendite in Wochen', body: 'Ein Eco-Duschkopf kostet ab 15 € und amortisiert sich bei täglicher Nutzung oft in unter 2 Monaten.' },
              { icon: '♻️', title: 'Wärmepumpe vs. Durchlauferhitzer', body: 'Ein Wärmepumpen-Warmwasserbereiter kostet pro Dusche bis zu 70% weniger als ein elektrischer Durchlauferhitzer.' },
            ] as const).map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="shrink-0 text-2xl">{item.icon}</span>
                <div>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
