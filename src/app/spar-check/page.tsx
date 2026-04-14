'use client';

import { useEffect, useMemo, useState } from 'react';

// ─── Typen ────────────────────────────────────────────────────────────────────
type HeatingType = 'gas' | 'oil' | 'pellets' | 'heatpump' | 'unknown';
type GasUsage    = 'heating' | 'hotwater' | 'cooking';

interface SparCheckData {
  heating:          HeatingType;
  gasUsage:         GasUsage[];   // nur relevant wenn heating === 'gas'
  area:             number;
  persons:          number;
  electricityKnown: boolean;
  electricityKwh:   number;       // nur relevant wenn electricityKnown === true
}

const DEFAULT_DATA: SparCheckData = {
  heating:          'unknown',
  gasUsage:         ['heating'],
  area:             100,
  persons:          2,
  electricityKnown: false,
  electricityKwh:   3000,
};

// ─── Preise (BDEW/Verivox 2026) ───────────────────────────────────────────────
const GAS_GRUNDV   = 0.136;  // €/kWh – Grundversorgung
const GAS_BEST     = 0.081;  // €/kWh – Bester Neukundentarif
const OIL_GRUNDV   = 1.10;   // €/Liter
const OIL_BEST     = 0.85;
const PELLET_GRUNDV = 0.38;  // €/kg
const PELLET_BEST   = 0.28;
const HEATPUMP_GRUNDV = 0.38; // €/kWh Heizstrom
const HEATPUMP_BEST   = 0.22;
const STROM_GRUNDV = 0.40;   // €/kWh Haushaltsstrom
const STROM_BEST   = 0.28;

const currency = (n: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

// ─── Kostenberechnung ─────────────────────────────────────────────────────────
interface CostItem {
  label:   string;
  note:    string;      // z.B. "140 kWh/m²/Jahr × 120 m²"
  current: number;
  optimal: number;
}

function calculateCosts(data: SparCheckData): CostItem[] {
  const items: CostItem[] = [];

  if (data.heating === 'gas') {
    if (data.gasUsage.includes('heating')) {
      const kwh = data.area * 140;
      items.push({
        label:   'Gasheizung (Raumwärme)',
        note:    `140 kWh/m²/Jahr × ${data.area} m²`,
        current: kwh * GAS_GRUNDV,
        optimal: kwh * GAS_BEST,
      });
    }
    if (data.gasUsage.includes('hotwater')) {
      const kwh = data.persons * 500;
      items.push({
        label:   'Gas­warm­wasser',
        note:    `~500 kWh/Person/Jahr × ${data.persons} ${data.persons === 1 ? 'Person' : 'Personen'}`,
        current: kwh * GAS_GRUNDV,
        optimal: kwh * GAS_BEST,
      });
    }
    if (data.gasUsage.includes('cooking')) {
      items.push({
        label:   'Gaskochen',
        note:    '~250 kWh/Jahr (Durchschnitt 2-Personen-Haushalt)',
        current: 250 * GAS_GRUNDV,
        optimal: 250 * GAS_BEST,
      });
    }
  }

  if (data.heating === 'oil') {
    const liters = data.area * 15;
    items.push({
      label:   'Heizöl (Jahresbedarf)',
      note:    `~15 Liter/m²/Jahr × ${data.area} m²`,
      current: liters * OIL_GRUNDV,
      optimal: liters * OIL_BEST,
    });
  }

  if (data.heating === 'pellets') {
    const kg = data.area * 6;
    items.push({
      label:   'Holzpellets (Jahresbedarf)',
      note:    `~6 kg/m²/Jahr × ${data.area} m²`,
      current: kg * PELLET_GRUNDV,
      optimal: kg * PELLET_BEST,
    });
  }

  if (data.heating === 'heatpump') {
    const kwh = data.area * 35;
    items.push({
      label:   'Heizstrom (Wärmepumpe)',
      note:    `~35 kWh/m²/Jahr × ${data.area} m²`,
      current: kwh * HEATPUMP_GRUNDV,
      optimal: kwh * HEATPUMP_BEST,
    });
  }

  if (data.electricityKnown && data.electricityKwh > 0) {
    const kwh = data.electricityKwh;
    items.push({
      label:   'Haushaltsstrom',
      note:    `${kwh.toLocaleString('de-DE')} kWh/Jahr (deine Angabe)`,
      current: kwh * STROM_GRUNDV,
      optimal: kwh * STROM_BEST,
    });
  }

  return items;
}

// ─── Stromschätzung als Orientierung ─────────────────────────────────────────
function estimateElectricity(persons: number): number {
  // Quelle: BDEW-Haushaltsstromverbrauch ohne Wärme
  if (persons <= 1) return 1500;
  if (persons === 2) return 2500;
  if (persons === 3) return 3500;
  return 4500;
}

// ─── Schritt-IDs ─────────────────────────────────────────────────────────────
type StepId = 'welcome' | 'heating' | 'gasUsage' | 'area' | 'electricity' | 'result';

function getActiveStepIds(data: SparCheckData): StepId[] {
  const ids: StepId[] = ['welcome', 'heating'];
  if (data.heating === 'gas') ids.push('gasUsage');
  ids.push('area', 'electricity', 'result');
  return ids;
}

// ─── Hauptkomponente ──────────────────────────────────────────────────────────
export default function SparCheck() {
  const [step, setStep]   = useState(0);
  const [data, setData]   = useState<SparCheckData>(DEFAULT_DATA);

  // Aus localStorage laden
  useEffect(() => {
    const saved = localStorage.getItem('sparCheckData');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setData({
          heating:          p.heating          ?? 'unknown',
          gasUsage:         Array.isArray(p.gasUsage) ? p.gasUsage : ['heating'],
          area:             Number(p.area)     || 100,
          persons:          Number(p.persons)  || 2,
          electricityKnown: p.electricityKnown ?? false,
          electricityKwh:   Number(p.electricityKwh) || 3000,
        });
      } catch {
        localStorage.removeItem('sparCheckData');
      }
    }
  }, []);

  // In localStorage speichern
  useEffect(() => {
    localStorage.setItem('sparCheckData', JSON.stringify(data));
  }, [data]);

  const update = (partial: Partial<SparCheckData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  // Aktive Schritte neu berechnen wenn sich Heiztyp ändert
  const activeStepIds = useMemo(() => getActiveStepIds(data), [data.heating]);

  // Schritt-Index absichern wenn sich Liste ändert
  useEffect(() => {
    if (step >= activeStepIds.length) setStep(activeStepIds.length - 1);
  }, [activeStepIds.length]);

  const currentStepId  = activeStepIds[step];
  const isFirst        = step === 0;
  const isLast         = step === activeStepIds.length - 1;
  const isResultStep   = currentStepId === 'result';
  // Nicht-Inhalt-Schritte: welcome und result (kein "Weiter"-Button nötig)
  const showNext       = !isLast && currentStepId !== 'welcome';

  const goNext = () => {
    if (step < activeStepIds.length - 1) setStep(step + 1);
  };
  const goPrev = () => {
    if (step > 0) setStep(step - 1);
  };

  // Gas-Nutzung togglen
  const toggleGasUsage = (usage: GasUsage) => {
    const current = data.gasUsage;
    if (current.includes(usage)) {
      if (current.length === 1) return; // mind. eine muss aktiv bleiben
      update({ gasUsage: current.filter((u) => u !== usage) });
    } else {
      update({ gasUsage: [...current, usage] });
    }
  };

  const costs       = useMemo(() => calculateCosts(data), [data]);
  const totalCurrent = costs.reduce((s, c) => s + c.current, 0);
  const totalOptimal = costs.reduce((s, c) => s + c.optimal, 0);
  const totalSaving  = totalCurrent - totalOptimal;

  // ─── Schritt-Inhalte ────────────────────────────────────────────────────
  const stepContent: Record<StepId, { title: string; description: string; content: React.ReactNode }> = {

    welcome: {
      title: 'Willkommen beim Energie-Spar-Check',
      description: 'In 3 Minuten erfährst du, wie viel du bei deinen Energiekosten wirklich sparen kannst.',
      content: (
        <div className="space-y-6 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Wir fragen nur, was wir wirklich brauchen – und zeigen dir dann konkrete Beträge. Keine Schätzungen ins Blaue.
          </p>
          <button
            onClick={() => setStep(1)}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-semibold hover:bg-primary/90 transition"
          >
            Jetzt starten →
          </button>
        </div>
      ),
    },

    heating: {
      title: 'Womit heizt du?',
      description: 'Wähle deinen aktuellen Heizungstyp.',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(
            [
              { value: 'gas',      label: 'Gas',          subtitle: 'Gasheizung, evt. Gasherd oder Warmwasser',  icon: '🔥' },
              { value: 'oil',      label: 'Heizöl',       subtitle: 'Ölheizung im Keller',                      icon: '🛢️' },
              { value: 'pellets',  label: 'Pellets',      subtitle: 'Holzpellet-Heizung',                       icon: '🌰' },
              { value: 'heatpump', label: 'Wärmepumpe',   subtitle: 'Elektrisch betriebene Wärmepumpe',         icon: '♨️' },
              { value: 'unknown',  label: 'Ich weiß es nicht', subtitle: 'Wir schätzen das Beste für dich',    icon: '❓' },
            ] as { value: HeatingType; label: string; subtitle: string; icon: string }[]
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => { update({ heating: opt.value }); goNext(); }}
              className={`rounded-3xl border p-5 text-left transition hover:border-primary ${
                data.heating === opt.value ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="text-3xl mb-2">{opt.icon}</div>
              <div className="font-semibold text-slate-900">{opt.label}</div>
              <div className="text-xs text-gray-500 mt-1">{opt.subtitle}</div>
            </button>
          ))}
        </div>
      ),
    },

    gasUsage: {
      title: 'Wofür nutzt du Gas?',
      description: 'Mehrfachauswahl möglich – das bestimmt, wie wir deinen Verbrauch berechnen.',
      content: (
        <div className="space-y-4">
          {(
            [
              {
                value:    'heating' as GasUsage,
                label:    'Heizung (Raumwärme)',
                subtitle: 'Deine Heizkörper oder Fußbodenheizung läuft mit Gas.',
                icon:     '🏠',
              },
              {
                value:    'hotwater' as GasUsage,
                label:    'Warmwasser',
                subtitle: 'Warmwasser für Dusche und Bad kommt aus der Gastherme.',
                icon:     '🚿',
              },
              {
                value:    'cooking' as GasUsage,
                label:    'Kochen (Gasherd)',
                subtitle: 'Du hast einen Gasherd in der Küche.',
                icon:     '🍳',
              },
            ]
          ).map((opt) => {
            const active = data.gasUsage.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleGasUsage(opt.value)}
                className={`w-full rounded-3xl border p-5 text-left transition flex items-start gap-4 ${
                  active ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white hover:border-primary/50'
                }`}
              >
                <span className="text-3xl shrink-0">{opt.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    {opt.label}
                    {active && <span className="text-primary text-sm font-bold">✓</span>}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">{opt.subtitle}</div>
                </div>
              </button>
            );
          })}
          <p className="text-xs text-gray-400 text-center pt-2">Mindestens eine Verwendung muss ausgewählt sein.</p>
        </div>
      ),
    },

    area: {
      title: 'Wohnfläche & Personenzahl',
      description: 'Diese Angaben bestimmen deinen ungefähren Jahresverbrauch.',
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="block font-semibold text-gray-800">
              Wohnfläche (m²)
            </label>
            <input
              type="number"
              min={20}
              max={400}
              value={data.area}
              onChange={(e) => update({ area: Math.max(20, Number(e.target.value)) })}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="text-xs text-gray-400">Nur Wohnfläche (ohne Keller/Garage)</p>
          </div>
          <div className="space-y-3">
            <label className="block font-semibold text-gray-800">
              Personen im Haushalt
            </label>
            <div className="flex gap-3 flex-wrap">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => update({ persons: n })}
                  className={`w-14 h-14 rounded-2xl border text-lg font-bold transition ${
                    data.persons === n
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    electricity: {
      title: 'Haushaltsstrom (optional)',
      description: 'Nur wenn du ihn kennst – sonst einfach überspringen.',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => update({ electricityKnown: true, electricityKwh: estimateElectricity(data.persons) })}
              className={`rounded-3xl border p-5 text-left transition ${
                data.electricityKnown
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 bg-white hover:border-primary/50'
              }`}
            >
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold text-slate-900">Ja, ich kenne meinen Verbrauch</div>
              <div className="text-xs text-gray-500 mt-1">Steht auf der Jahresabrechnung</div>
            </button>
            <button
              onClick={() => update({ electricityKnown: false })}
              className={`rounded-3xl border p-5 text-left transition ${
                !data.electricityKnown
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 bg-white hover:border-primary/50'
              }`}
            >
              <div className="text-2xl mb-2">⏭️</div>
              <div className="font-semibold text-slate-900">Nein, überspringen</div>
              <div className="text-xs text-gray-500 mt-1">Strom wird dann nicht berechnet</div>
            </button>
          </div>

          {data.electricityKnown && (
            <div className="space-y-3 animate-in fade-in">
              <label className="block font-semibold text-gray-800">
                Jahresverbrauch in kWh
              </label>
              <input
                type="number"
                min={500}
                max={15000}
                step={100}
                value={data.electricityKwh}
                onChange={(e) => update({ electricityKwh: Math.max(100, Number(e.target.value)) })}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="flex items-start gap-2 rounded-2xl bg-blue-50 border border-blue-100 px-4 py-3">
                <span className="text-blue-400 text-sm mt-0.5">ℹ</span>
                <p className="text-xs text-blue-700">
                  Orientierung für {data.persons} {data.persons === 1 ? 'Person' : 'Personen'}:{' '}
                  ca. <strong>{estimateElectricity(data.persons).toLocaleString('de-DE')} kWh/Jahr</strong>{' '}
                  (BDEW-Durchschnitt, ohne Heizung/Warmwasser)
                </p>
              </div>
            </div>
          )}
        </div>
      ),
    },

    result: {
      title: 'Dein Spar-Potenzial',
      description: 'Basierend auf deinen Angaben und Marktpreisen 2026.',
      content: costs.length === 0 ? (
        <div className="text-center space-y-4 py-8">
          <p className="text-gray-500">Keine Daten zum Berechnen vorhanden.</p>
          <button
            onClick={() => setStep(1)}
            className="bg-primary text-white px-8 py-3 rounded-2xl font-semibold hover:bg-primary/90 transition"
          >
            Angaben machen →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Kostenaufschlüsselung */}
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-3 bg-slate-800 text-white text-xs font-semibold px-4 py-3 gap-2">
              <div>Kostenart</div>
              <div className="text-right">Aktuell</div>
              <div className="text-right text-primary">Ersparnis möglich</div>
            </div>
            {costs.map((item, i) => (
              <div
                key={item.label}
                className={`grid grid-cols-3 gap-2 px-4 py-4 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
              >
                <div>
                  <p className="font-semibold text-slate-800">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>
                </div>
                <div className="text-right font-semibold text-slate-700 self-center">{currency(item.current)}</div>
                <div className="text-right font-bold text-primary self-center">− {currency(item.current - item.optimal)}</div>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2 px-4 py-4 bg-slate-800 text-white text-sm font-bold">
              <div>Gesamt</div>
              <div className="text-right text-slate-300">{currency(totalCurrent)}</div>
              <div className="text-right text-primary">− {currency(totalSaving)}</div>
            </div>
          </div>

          {/* Sparpotenzial-Highlight */}
          <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-6 text-center">
            <p className="text-sm uppercase tracking-widest text-emerald-600 font-semibold mb-2">Dein Sparpotenzial</p>
            <p className="text-5xl font-bold text-green-600">{currency(totalSaving)}</p>
            <p className="mt-2 text-sm text-gray-600">pro Jahr – durch Tarifwechsel beim günstigsten Neukundentarif.</p>
          </div>

          {/* Hinweis */}
          <div className="flex gap-3 items-start rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3">
            <span className="text-amber-500 text-sm mt-0.5 shrink-0">ℹ</span>
            <p className="text-xs text-amber-800">
              Berechnung auf Basis von BDEW/Verivox-Durchschnittspreisen 2026. Tatsächliche Kosten hängen von
              deiner Region, deinem Verbrauchsverhalten und deinen aktuellen Verträgen ab.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/tarif-vergleich"
              className="flex-1 bg-primary text-white rounded-2xl px-6 py-4 text-center font-semibold hover:bg-primary/90 transition"
            >
              Tarife vergleichen & sparen →
            </a>
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-100 text-secondary rounded-2xl px-6 py-4 font-semibold hover:bg-gray-200 transition"
            >
              Angaben anpassen
            </button>
          </div>
        </div>
      ),
    },
  };

  const current = stepContent[currentStepId];
  // Schritt-Nummer für Anzeige (ohne welcome und result)
  type ContentStepId = 'heating' | 'gasUsage' | 'area' | 'electricity';
  const contentSteps   = activeStepIds.filter((id): id is ContentStepId => id !== 'welcome' && id !== 'result');
  const currentContent = contentSteps.indexOf(currentStepId as ContentStepId);
  const showStepLabel  = currentContent >= 0;

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center bg-linear-to-b from-slate-900 to-slate-800 px-6 pt-16 text-center text-white">
        <div className="max-w-2xl mx-auto space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Kosten-Dolmetscher</p>
          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">Energie-Spar-Check</h1>
          <p className="mx-auto max-w-lg text-lg text-slate-300 leading-relaxed">
            Drei Fragen. Konkrete Zahlen. Kein Schnörkel.
          </p>
        </div>
      </section>

      {/* Wizard */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Schritt-Indikator */}
          {showStepLabel && (
            <div className="mb-8 flex items-center gap-3">
              {contentSteps.map((id, i) => (
                <div key={id} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                      i < currentContent
                        ? 'bg-primary text-white'
                        : i === currentContent
                        ? 'bg-secondary text-white ring-4 ring-secondary/20'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {i < currentContent ? '✓' : i + 1}
                  </div>
                  {i < contentSteps.length - 1 && (
                    <div className={`h-0.5 w-8 rounded ${i < currentContent ? 'bg-primary' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Schritt-Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">{current.title}</h2>
            <p className="mt-2 text-gray-600">{current.description}</p>
          </div>

          {/* Schritt-Inhalt */}
          <div className="rounded-4xl bg-white p-8 shadow-2xl">
            {current.content}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {!isFirst ? (
              <button
                onClick={goPrev}
                className="text-secondary font-semibold hover:text-secondary/80 transition flex items-center gap-2"
              >
                ← Zurück
              </button>
            ) : <span />}

            {showNext && (
              <button
                onClick={goNext}
                className="bg-secondary text-white rounded-2xl px-6 py-3 font-semibold hover:bg-secondary/90 transition"
              >
                Weiter →
              </button>
            )}

            {/* Auf Ergebnis springen wenn schon Daten vorhanden */}
            {!isResultStep && !isFirst && costs.length > 0 && (
              <button
                onClick={() => setStep(activeStepIds.length - 1)}
                className="text-gray-400 text-sm hover:text-gray-600 transition ml-4"
              >
                Ergebnis ansehen →
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
