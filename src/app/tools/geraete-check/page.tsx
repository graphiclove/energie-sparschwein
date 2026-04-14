'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

// ─── Typen ────────────────────────────────────────────────────────────────────
type AgeKey = 'pre2000' | '2000_2010' | '2010_2020' | 'post2020';

interface AgeOption { key: AgeKey; label: string }
const AGE_OPTIONS: AgeOption[] = [
  { key: 'pre2000',    label: 'vor 2000'  },
  { key: '2000_2010',  label: '2000–2010' },
  { key: '2010_2020',  label: '2010–2020' },
  { key: 'post2020',   label: 'nach 2020' },
];
const AGE_LABEL: Record<AgeKey, string> = {
  pre2000: 'vor 2000', '2000_2010': '2000–2010', '2010_2020': '2010–2020', post2020: 'nach 2020',
};

interface StepOpt { key: string; label: string; icon: string }

interface DetailStep {
  id:            string;
  question:      string;
  help:          string;
  type:          'options' | 'slider';
  options?:      StepOpt[];
  sliderMin?:    number;
  sliderMax?:    number;
  sliderDefault?: number;
}

interface BaseThreshold {
  extraCost:  number;
  newCost:    number;
  amortYears: number;
  tip:        string;
}

interface DeviceResult extends BaseThreshold {
  refined: boolean;
  note?:   string;
}

interface DeviceDef {
  id:          string;
  label:       string;
  icon:        string;
  desc:        string;
  thresholds:  Partial<Record<AgeKey, BaseThreshold>>;
  detailSteps: DetailStep[];
  refine:      (base: BaseThreshold, answers: Record<string, string>, sliders: Record<string, number>) => Pick<DeviceResult, 'extraCost' | 'amortYears' | 'note'>;
}

interface DeviceState {
  age:        AgeKey | null;
  expanded:   boolean;
  detailOpen: boolean;
  detailStep: number;
  answers:    Record<string, string>;
  sliders:    Record<string, number>;
}

// ─── Energie-Label ────────────────────────────────────────────────────────────
const LABEL_OPTS: StepOpt[] = [
  { key: 'aplus3',   label: 'A+++',             icon: '🟢' },
  { key: 'aplus2',   label: 'A++',              icon: '🟢' },
  { key: 'aplus1',   label: 'A+',               icon: '🟡' },
  { key: 'a',        label: 'A',                icon: '🟡' },
  { key: 'b_worse',  label: 'B oder schlechter', icon: '🔴' },
  { key: 'no_label', label: 'Kein Etikett',      icon: '⚫' },
  { key: 'unknown',  label: 'Weiß nicht',         icon: '❓' },
];
const LABEL_MULT: Record<string, number> = {
  aplus3: 0.10, aplus2: 0.30, aplus1: 0.60, a: 0.80,
  b_worse: 1.30, no_label: 1.25, unknown: 1.00,
};

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** alt=1.3× Mehrverbrauch, neu=0.3× */
function yrMult(yr: number, lo: number, hi: number): number {
  const t = clamp((yr - lo) / (hi - lo), 0, 1);
  return 1.3 - t;
}

const fmtEur = (n: number) =>
  n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

// ─── Sub-Komponenten ──────────────────────────────────────────────────────────
function Tooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500 transition hover:bg-slate-300"
      >
        ?
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-xl bg-slate-900 px-3 py-2 text-xs leading-snug text-white shadow-xl">
          {text}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </span>
      )}
    </span>
  );
}

function AccuracyStars({ count }: { count: number }) {
  const stars = Math.max(1, Math.min(5, count));
  const labels = ['', 'Schätzung', 'Niedrig', 'Mittel', 'Hoch', 'Sehr genau'];
  return (
    <span className="inline-flex items-center gap-0.5 text-xs text-slate-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < stars ? 'text-primary' : 'text-slate-200'}>★</span>
      ))}
      <span className="ml-1">{labels[stars]}</span>
    </span>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < current ? 'bg-primary' : 'bg-slate-200'}`}
        />
      ))}
    </div>
  );
}

// ─── Geräte ───────────────────────────────────────────────────────────────────
const DEVICES: DeviceDef[] = [
  // ── Heizkessel ──────────────────────────────────────────────────────────────
  {
    id: 'heizkessel', label: 'Heizkessel', icon: '🔥', desc: 'Gas-/Ölheizung',
    thresholds: {
      pre2000:   { extraCost: 630, newCost: 6000, amortYears: 10, tip: 'Ein moderner Brennwertkessel oder eine Wärmepumpe spart bis zu 30 % Heizenergie. KfW-Förderung bis 70 % möglich.' },
      '2000_2010': { extraCost: 280, newCost: 6000, amortYears: 21, tip: 'Ältere Niedertemperaturkessel haben oft 15–20 % Mehrverbrauch. Hydraulischer Abgleich kann kurzfristig 10 % sparen.' },
    },
    detailSteps: [
      {
        id: 'type', question: 'Welcher Kesseltyp?',
        help: 'Brennwertkessel nutzen Abgaswärme und sind deutlich effizienter als alte NT-Kessel (Niedertemperatur).',
        type: 'options',
        options: [
          { key: 'brennwert_gas', label: 'Brennwert Gas', icon: '🟡' },
          { key: 'nt_gas',       label: 'NT-Kessel Gas', icon: '🔴' },
          { key: 'brennwert_oel', label: 'Brennwert Öl',  icon: '🟡' },
          { key: 'nt_oel',       label: 'NT-Kessel Öl',  icon: '🔴' },
          { key: 'unknown',      label: 'Weiß nicht',     icon: '❓' },
        ],
      },
      {
        id: 'year', question: 'Baujahr (genauer)?',
        help: 'Je älter, desto mehr Wirkungsgradverfall durch Verschleiß und veraltete Brennertechnik.',
        type: 'slider', sliderMin: 1990, sliderMax: 2025, sliderDefault: 2000,
      },
    ],
    refine(base, answers, sliders) {
      let mult = 1.0;
      const type = answers.type ?? 'unknown';
      if (type === 'brennwert_gas' || type === 'brennwert_oel') mult *= 0.78;
      else if (type === 'nt_gas' || type === 'nt_oel') mult *= 1.15;
      const yr = sliders.year ?? 2000;
      mult *= yrMult(yr, 1990, 2025);
      const extraCost = Math.round(base.extraCost * mult);
      const amortYears = Math.round(base.newCost / Math.max(extraCost, 1));
      const typeLabel: Record<string, string> = { brennwert_gas: 'Brennwert-Gas', nt_gas: 'NT-Gas', brennwert_oel: 'Brennwert-Öl', nt_oel: 'NT-Öl', unknown: 'unbekannt' };
      return { extraCost, amortYears, note: `${typeLabel[type] ?? type}, Bj. ${yr}` };
    },
  },

  // ── Kühlschrank ─────────────────────────────────────────────────────────────
  {
    id: 'kuehlschrank', label: 'Kühlschrank', icon: '🧊', desc: 'Inkl. Gefrierfach',
    thresholds: {
      pre2000:   { extraCost: 180, newCost: 700,  amortYears: 4,  tip: 'Geräte vor 2000 sind oft in Effizienzklasse D–G. Ein A++/A-Gerät verbraucht 60–70 % weniger Strom.' },
      '2000_2010': { extraCost: 120, newCost: 700,  amortYears: 6,  tip: 'Kühlschränke aus den 2000ern erreichen selten moderne Effizienzklassen. Neugeräte sind deutlich sparsamer.' },
      '2010_2020': { extraCost: 50,  newCost: 600,  amortYears: 12, tip: 'Geräte aus 2010–2020 liegen im Mittelfeld. Ein Wechsel lohnt sich erst, wenn das Gerät defekt ist.' },
    },
    detailSteps: [
      {
        id: 'type', question: 'Welcher Typ?',
        help: 'Side-by-Side verbraucht deutlich mehr als ein Standardgerät. Mini-Kühlschränke viel weniger.',
        type: 'options',
        options: [
          { key: 'kombi',      label: 'Kombi (Kühl+Gefrierkombi)', icon: '🧊' },
          { key: 'ohne',       label: 'Ohne Gefrierfach',           icon: '🟢' },
          { key: 'sidebyside', label: 'Side-by-Side',               icon: '🏠' },
          { key: 'mini',       label: 'Mini-Kühlschrank',           icon: '🟢' },
          { key: 'unknown',    label: 'Weiß nicht',                  icon: '❓' },
        ],
      },
      {
        id: 'label', question: 'Energielabel?',
        help: 'Das Energielabel findest du oft auf der Innentür oder im Handbuch.',
        type: 'options', options: LABEL_OPTS,
      },
      {
        id: 'year', question: 'Kaufjahr (genauer)?',
        help: 'Das genaue Kaufjahr hilft, den Wirkungsgradverfall besser einzuschätzen.',
        type: 'slider', sliderMin: 2000, sliderMax: 2025, sliderDefault: 2005,
      },
    ],
    refine(base, answers, sliders) {
      let mult = 1.0;
      const type = answers.type ?? 'unknown';
      if (type === 'sidebyside') mult *= 1.4;
      else if (type === 'mini') mult *= 0.5;
      else if (type === 'ohne') mult *= 0.8;
      mult *= LABEL_MULT[answers.label ?? 'unknown'] ?? 1.0;
      const yr = sliders.year ?? 2005;
      mult *= yrMult(yr, 2000, 2025);
      const extraCost = Math.round(base.extraCost * mult);
      const amortYears = Math.round(base.newCost / Math.max(extraCost, 1));
      const typeLabel: Record<string, string> = { kombi: 'Kombi', ohne: 'Kühlschrank', sidebyside: 'Side-by-Side', mini: 'Mini', unknown: 'Standard' };
      return { extraCost, amortYears, note: `${typeLabel[type] ?? type}, Bj. ${yr}` };
    },
  },

  // ── Waschmaschine ───────────────────────────────────────────────────────────
  {
    id: 'waschmaschine', label: 'Waschmaschine', icon: '👕', desc: 'Toplader / Frontlader',
    thresholds: {
      pre2000:   { extraCost: 90, newCost: 600, amortYears: 7, tip: 'Alte Waschmaschinen verbrauchen bis zu 80 % mehr Energie und Wasser. Moderne A-Modelle waschen deutlich effizienter.' },
      '2000_2010': { extraCost: 65, newCost: 600, amortYears: 9, tip: 'Modelle aus den 2000ern haben meist höheren Wasser- und Stromverbrauch. Kaltwaschprogramme nutzen hilft kurzfristig.' },
    },
    detailSteps: [
      {
        id: 'label', question: 'Energielabel?',
        help: 'Das Energielabel steht auf dem Typenschild (oft hinten oder innen an der Tür).',
        type: 'options', options: LABEL_OPTS,
      },
      {
        id: 'freq', question: 'Wie oft wäschst du pro Woche?',
        help: 'Häufigeres Waschen erhöht den Jahresverbrauch proportional.',
        type: 'options',
        options: [
          { key: 'freq2',   label: '1–2×/Woche', icon: '🟢' },
          { key: 'freq3',   label: '3×/Woche',   icon: '🟡' },
          { key: 'freq5',   label: '5×/Woche',   icon: '🟠' },
          { key: 'freq7',   label: 'täglich',    icon: '🔴' },
          { key: 'unknown', label: 'Weiß nicht', icon: '❓' },
        ],
      },
      {
        id: 'year', question: 'Kaufjahr (genauer)?',
        help: 'Geräte altern – besonders nach 10+ Jahren steigt der Verbrauch messbar.',
        type: 'slider', sliderMin: 1995, sliderMax: 2025, sliderDefault: 2005,
      },
    ],
    refine(base, answers, sliders) {
      let mult = 1.0;
      mult *= LABEL_MULT[answers.label ?? 'unknown'] ?? 1.0;
      const freqMult: Record<string, number> = { freq2: 2/3, freq3: 1.0, freq5: 5/3, freq7: 7/3, unknown: 1.0 };
      mult *= freqMult[answers.freq ?? 'unknown'] ?? 1.0;
      const yr = sliders.year ?? 2005;
      mult *= yrMult(yr, 1995, 2025);
      const extraCost = Math.round(base.extraCost * mult);
      const amortYears = Math.round(base.newCost / Math.max(extraCost, 1));
      return { extraCost, amortYears, note: `Label: ${answers.label ?? '?'}, Bj. ${yr}` };
    },
  },

  // ── Spülmaschine ────────────────────────────────────────────────────────────
  {
    id: 'spuelmaschine', label: 'Spülmaschine', icon: '🍽️', desc: 'Geschirrspüler',
    thresholds: {
      pre2000:   { extraCost: 80, newCost: 500, amortYears: 6,  tip: 'Alte Spülmaschinen verbrauchen fast doppelt so viel Wasser und Strom wie moderne A-Geräte.' },
      '2000_2010': { extraCost: 45, newCost: 500, amortYears: 11, tip: 'Eco-Programm nutzen und nur vollbeladen starten spart sofort. Ein Neukauf amortisiert sich mittelfristig.' },
    },
    detailSteps: [
      {
        id: 'label', question: 'Energielabel?',
        help: 'Das Energielabel findest du auf dem Typenschild (Innenseite Tür).',
        type: 'options', options: LABEL_OPTS,
      },
      {
        id: 'freq', question: 'Wie oft läuft die Spülmaschine?',
        help: 'Ein Spülgang verbraucht im Schnitt ca. 1 kWh Strom und 12–20 Liter Wasser.',
        type: 'options',
        options: [
          { key: 'freq3',   label: '3×/Woche',      icon: '🟢' },
          { key: 'freq5',   label: 'täglich',        icon: '🟡' },
          { key: 'freq7',   label: 'tägl. mehrmals', icon: '🔴' },
          { key: 'unknown', label: 'Weiß nicht',      icon: '❓' },
        ],
      },
      {
        id: 'year', question: 'Kaufjahr (genauer)?',
        help: 'Spülmaschinen haben eine Lebensdauer von ca. 12–15 Jahren.',
        type: 'slider', sliderMin: 1995, sliderMax: 2025, sliderDefault: 2005,
      },
    ],
    refine(base, answers, sliders) {
      let mult = 1.0;
      mult *= LABEL_MULT[answers.label ?? 'unknown'] ?? 1.0;
      const freqMult: Record<string, number> = { freq3: 3/5, freq5: 1.0, freq7: 1.4, unknown: 1.0 };
      mult *= freqMult[answers.freq ?? 'unknown'] ?? 1.0;
      const yr = sliders.year ?? 2005;
      mult *= yrMult(yr, 1995, 2025);
      const extraCost = Math.round(base.extraCost * mult);
      const amortYears = Math.round(base.newCost / Math.max(extraCost, 1));
      return { extraCost, amortYears, note: `Label: ${answers.label ?? '?'}, Bj. ${yr}` };
    },
  },

  // ── Durchlauferhitzer ───────────────────────────────────────────────────────
  {
    id: 'durchlauferhitzer', label: 'Durchlauferhitzer', icon: '⚡', desc: 'Elektrisch / Gas',
    thresholds: {
      pre2000:   { extraCost: 420, newCost: 2500, amortYears: 6, tip: 'Elektrische Durchlauferhitzer kosten 3–4× mehr als Gas-Warmwasser. Ein Wärmepumpen-Boiler spart langfristig am meisten.' },
      '2000_2010': { extraCost: 380, newCost: 2000, amortYears: 5, tip: 'Der Wechsel zu Gas oder einer Warmwasser-Wärmepumpe amortisiert sich oft in unter 5 Jahren.' },
      '2010_2020': { extraCost: 320, newCost: 1500, amortYears: 5, tip: 'Auch neuere Elektro-Durchlauferhitzer sind gegenüber Gas oder WP teuer. Verbrauch reduzieren hilft sofort.' },
    },
    detailSteps: [
      {
        id: 'type', question: 'Welcher Typ?',
        help: 'Gas-Durchlauferhitzer sind im Betrieb deutlich günstiger als elektrische. Hydraulisch = alter Stromfresser.',
        type: 'options',
        options: [
          { key: 'hydraulisch',  label: 'Hydraulisch (Strom, alt)', icon: '🔴' },
          { key: 'elektronisch', label: 'Elektronisch (Strom)',      icon: '🟡' },
          { key: 'gas',          label: 'Gas-Durchlauferhitzer',     icon: '🟢' },
          { key: 'unknown',      label: 'Weiß nicht',                icon: '❓' },
        ],
      },
      {
        id: 'persons', question: 'Wie viele Personen im Haushalt?',
        help: 'Mehr Personen = mehr Warmwasserverbrauch. Entscheidend für die Gesamtkosten.',
        type: 'options',
        options: [
          { key: 'p1', label: '1 Person',   icon: '👤' },
          { key: 'p2', label: '2 Personen', icon: '👥' },
          { key: 'p3', label: '3 Personen', icon: '👨‍👩‍👦' },
          { key: 'p4', label: '4 Personen', icon: '👨‍👩‍👧‍👦' },
          { key: 'p5', label: '5+',         icon: '🏠' },
        ],
      },
      {
        id: 'year', question: 'Baujahr (genauer)?',
        help: 'Ältere Durchlauferhitzer haben oft Kalkablagerungen und geringere Effizienz.',
        type: 'slider', sliderMin: 1990, sliderMax: 2025, sliderDefault: 2005,
      },
    ],
    refine(base, answers, sliders) {
      const type = answers.type ?? 'unknown';
      if (type === 'gas') {
        return { extraCost: 0, amortYears: 0, note: 'Gas-Durchlauferhitzer – kein elektrischer Mehrverbrauch' };
      }
      let mult = 1.0;
      if (type === 'hydraulisch') mult *= 1.2;
      else if (type === 'elektronisch') mult *= 0.8;
      const personsMult: Record<string, number> = { p1: 0.5, p2: 0.75, p3: 1.0, p4: 1.25, p5: 1.5 };
      mult *= personsMult[answers.persons ?? 'p3'] ?? 1.0;
      const yr = sliders.year ?? 2005;
      mult *= yrMult(yr, 1990, 2025);
      const extraCost = Math.round(base.extraCost * mult);
      const amortYears = extraCost > 0 ? Math.round(base.newCost / extraCost) : 0;
      const typeLabel: Record<string, string> = { hydraulisch: 'Hydraulisch', elektronisch: 'Elektronisch', unknown: 'unbekannt' };
      return { extraCost, amortYears, note: `${typeLabel[type] ?? type}, Bj. ${yr}` };
    },
  },
];

// ─── Hauptkomponente ──────────────────────────────────────────────────────────
const mkState = (): DeviceState => ({ age: null, expanded: false, detailOpen: false, detailStep: 0, answers: {}, sliders: {} });

export default function GeraeteCheck() {
  const [states, setStates] = useState<Record<string, DeviceState>>(
    Object.fromEntries(DEVICES.map(d => [d.id, mkState()])),
  );
  const [animating, setAnimating] = useState<Record<string, boolean>>({});

  const patch = (id: string, p: Partial<DeviceState>) =>
    setStates(prev => ({ ...prev, [id]: { ...prev[id], ...p } }));

  const selectAge = (id: string, age: AgeKey) => patch(id, { age, expanded: true });
  const toggleExpanded = (id: string) => patch(id, { expanded: !states[id].expanded });
  const openDetail = (id: string) => patch(id, { detailOpen: true, detailStep: 0, answers: {}, sliders: {} });
  const editDetail = (id: string) => patch(id, { detailOpen: true, detailStep: 0 });
  const resetDetail = (id: string) => patch(id, { detailOpen: false, detailStep: 0, answers: {}, sliders: {} });

  const fade = (id: string, after: () => void) => {
    setAnimating(a => ({ ...a, [id]: true }));
    setTimeout(() => { after(); setAnimating(a => ({ ...a, [id]: false })); }, 150);
  };

  const answerOptions = (id: string, stepId: string, optKey: string) => {
    const cur = states[id];
    const device = DEVICES.find(d => d.id === id)!;
    const newAnswers = { ...cur.answers, [stepId]: optKey };
    const next = cur.detailStep + 1;
    fade(id, () => {
      if (next < device.detailSteps.length) patch(id, { answers: newAnswers, detailStep: next });
      else patch(id, { answers: newAnswers, detailOpen: false });
    });
  };

  const setSlider = (id: string, stepId: string, val: number) =>
    patch(id, { sliders: { ...states[id].sliders, [stepId]: val } });

  const confirmSlider = (id: string) => {
    const cur = states[id];
    const device = DEVICES.find(d => d.id === id)!;
    const next = cur.detailStep + 1;
    fade(id, () => {
      if (next < device.detailSteps.length) patch(id, { detailStep: next });
      else patch(id, { detailOpen: false });
    });
  };

  const goBack = (id: string) => {
    const cur = states[id];
    if (cur.detailStep > 0) fade(id, () => patch(id, { detailStep: cur.detailStep - 1 }));
    else patch(id, { detailOpen: false });
  };

  const accuracyStars = (id: string): number => {
    const cur = states[id];
    const device = DEVICES.find(d => d.id === id)!;
    let answered = 0;
    for (const step of device.detailSteps) {
      if (step.type === 'options') { if (cur.answers[step.id] && cur.answers[step.id] !== 'unknown') answered++; }
      else { if (cur.sliders[step.id] !== undefined) answered++; }
    }
    return Math.max(1, Math.round(1 + (answered / Math.max(device.detailSteps.length, 1)) * 4));
  };

  const results: Record<string, DeviceResult | null> = useMemo(() => {
    return Object.fromEntries(DEVICES.map(device => {
      const cur = states[device.id];
      const base = cur.age ? device.thresholds[cur.age] : undefined;
      if (!base) return [device.id, null];
      const hasDetail = Object.keys(cur.answers).length > 0 || Object.keys(cur.sliders).length > 0;
      if (hasDetail) {
        const refined = device.refine(base, cur.answers, cur.sliders);
        return [device.id, { ...base, ...refined, refined: true }];
      }
      return [device.id, { ...base, refined: false }];
    }));
  }, [states]);

  const findings = DEVICES.flatMap(device => {
    const r = results[device.id];
    const cur = states[device.id];
    if (!r || r.extraCost === 0) return [];
    return [{ device, age: cur.age!, result: r, hasDetail: r.refined }];
  });

  const totalExtraCost = findings.reduce((s, f) => s + f.result.extraCost, 0);
  const hasFindings    = findings.length > 0;
  const hasConfigured  = DEVICES.some(d => states[d.id].age !== null);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Tool</p>
          <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight md:text-6xl">Geräte-Friedhof</h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-slate-300">
            Welche alten Geräte fressen still dein Geld? Wähle das Alter – und verfeinere die Schätzung für genauere Zahlen.
          </p>
        </div>
      </section>

      {/* ── Geräte-Karten ─────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <p className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
            Wähle deine Geräte und ihr Alter
          </p>

          <div className="space-y-4">
            {DEVICES.map((device) => {
              const cur       = states[device.id];
              const r         = results[device.id];
              const isProblem = !!(r && r.extraCost > 0);
              const isGood    = cur.age !== null && !isProblem;
              const isAnim    = animating[device.id];
              const step      = device.detailSteps[cur.detailStep];
              const hasDA     = r?.refined === true;
              const stars     = hasDA ? accuracyStars(device.id) : 1;

              return (
                <div
                  key={device.id}
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                    isProblem ? 'border-red-200 shadow-md shadow-red-50'
                    : isGood  ? 'border-primary/30 shadow-md shadow-primary/5'
                    : 'border-slate-200 shadow-sm'
                  }`}
                >
                  {/* ── Header ────────────────────────────────────────────── */}
                  <button
                    className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50"
                    onClick={() => toggleExpanded(device.id)}
                  >
                    <span className="text-4xl">{device.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{device.label}</p>
                      <p className="text-xs text-slate-500">{device.desc}</p>
                    </div>

                    {cur.age ? (
                      isProblem ? (
                        <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">⚠ Energiefresser</span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">✓ Effizient</span>
                      )
                    ) : (
                      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-400">Alter wählen</span>
                    )}

                    <svg
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${cur.expanded ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* ── Accordion-Body (CSS Grid Trick) ───────────────────── */}
                  <div className={`grid transition-[grid-template-rows] duration-300 ${cur.expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="min-h-0 overflow-hidden">
                      <div className="border-t border-slate-100 p-5 pt-4">

                        {/* Alter-Tiles */}
                        <p className="mb-3 text-xs font-semibold text-slate-400">Baujahr / Kaufjahr:</p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {AGE_OPTIONS.map(opt => (
                            <button
                              key={opt.key}
                              onClick={() => selectAge(device.id, opt.key)}
                              className={`rounded-xl py-3 text-center text-sm font-bold transition hover:-translate-y-0.5 ${
                                cur.age === opt.key
                                  ? device.thresholds[opt.key]
                                    ? 'bg-red-500 text-white shadow-md shadow-red-200'
                                    : 'bg-primary text-slate-950 shadow-md shadow-primary/20'
                                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/30 hover:bg-primary/5'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>

                        {/* Inhalt unterhalb der Tiles */}
                        {cur.age && (
                          <div className="mt-4 space-y-3">

                            {/* "Genauer bestimmen" Button */}
                            {isProblem && !cur.detailOpen && !hasDA && (
                              <button
                                onClick={() => openDetail(device.id)}
                                className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                              >
                                <span>🔍</span>
                                <span>Genauer bestimmen</span>
                                <span className="ml-auto text-xs text-slate-400">optional → präzisere Schätzung</span>
                              </button>
                            )}

                            {/* Wizard */}
                            {cur.detailOpen && step && (
                              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                {/* Fortschritt */}
                                <ProgressBar current={cur.detailStep} total={device.detailSteps.length} />
                                <p className="mt-1.5 text-[10px] text-slate-400">
                                  Schritt {cur.detailStep + 1} von {device.detailSteps.length}
                                </p>

                                {/* Frage + Antworten (gefadet) */}
                                <div className={`mt-3 transition-opacity duration-150 ${isAnim ? 'opacity-0' : 'opacity-100'}`}>
                                  <div className="mb-3 flex items-center">
                                    <p className="text-sm font-bold text-slate-800">{step.question}</p>
                                    <Tooltip text={step.help} />
                                  </div>

                                  {step.type === 'options' && step.options && (
                                    <div className="grid grid-cols-2 gap-2">
                                      {step.options.map(opt => (
                                        <button
                                          key={opt.key}
                                          onClick={() => answerOptions(device.id, step.id, opt.key)}
                                          className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition ${
                                            cur.answers[step.id] === opt.key
                                              ? 'border-primary bg-primary/10 text-primary'
                                              : 'border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:bg-primary/5'
                                          }`}
                                        >
                                          <span>{opt.icon}</span>
                                          <span>{opt.label}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  {step.type === 'slider' && (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>{step.sliderMin}</span>
                                        <span className="text-xl font-bold text-primary">
                                          {cur.sliders[step.id] ?? step.sliderDefault}
                                        </span>
                                        <span>{step.sliderMax}</span>
                                      </div>
                                      <input
                                        type="range"
                                        min={step.sliderMin}
                                        max={step.sliderMax}
                                        value={cur.sliders[step.id] ?? step.sliderDefault}
                                        onChange={e => setSlider(device.id, step.id, Number(e.target.value))}
                                        className="w-full accent-primary"
                                      />
                                      <button
                                        onClick={() => confirmSlider(device.id)}
                                        className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-primary/90"
                                      >
                                        Weiter →
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Navigation */}
                                <div className="mt-3 flex items-center justify-between">
                                  <button onClick={() => goBack(device.id)} className="text-xs text-slate-400 hover:text-slate-600">
                                    ← Zurück
                                  </button>
                                  <button onClick={() => resetDetail(device.id)} className="text-xs text-slate-400 hover:text-slate-600">
                                    Abbrechen
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Inline-Ergebnis */}
                            <div className={`rounded-xl p-4 ${
                              isProblem ? 'border border-red-100 bg-red-50' : 'border border-primary/20 bg-primary/5'
                            }`}>
                              {isProblem && r ? (
                                <>
                                  <p className="font-bold text-red-800">Dein {device.label} ist ein Energiefresser!</p>
                                  <p className="mt-1 text-sm text-red-700">
                                    Mehrkosten: <strong>{fmtEur(r.extraCost)}/Jahr</strong>
                                  </p>
                                  {r.amortYears > 0 && (
                                    <p className="mt-0.5 text-sm text-red-700">
                                      Neugerät (~{fmtEur(r.newCost)}) amortisiert sich in ca. <strong>{r.amortYears} Jahren</strong>
                                    </p>
                                  )}
                                  {hasDA && r.note && <p className="mt-1.5 text-xs text-red-500">{r.note}</p>}
                                  {hasDA && (
                                    <div className="mt-2 flex items-center gap-2">
                                      <AccuracyStars count={stars} />
                                      <button
                                        onClick={() => resetDetail(device.id)}
                                        className="ml-auto text-[10px] text-slate-400 hover:text-slate-600"
                                      >
                                        zurücksetzen
                                      </button>
                                    </div>
                                  )}
                                  <p className="mt-2 text-xs leading-relaxed text-red-600">{r.tip}</p>
                                  {hasDA && !cur.detailOpen && (
                                    <button onClick={() => editDetail(device.id)} className="mt-1.5 text-xs text-primary hover:underline">
                                      Angaben ändern →
                                    </button>
                                  )}
                                </>
                              ) : (
                                <>
                                  <p className="font-bold text-primary">Dein {device.label} ist noch gut!</p>
                                  <p className="mt-1 text-sm text-slate-600">
                                    Ein Austausch lohnt sich aktuell nicht – erst wenn das Gerät defekt ist.
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Ergebnis ──────────────────────────────────────────────────────── */}
      {hasConfigured && (
        <section className="border-y border-slate-200 bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-2xl">
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Deine Auswertung</p>

            {hasFindings ? (
              <>
                {/* Gesamt-Box */}
                <div className="mb-8 rounded-3xl bg-linear-to-br from-slate-900 to-slate-800 p-8 text-center text-white shadow-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-400">Veraltete Geräte kosten dich</p>
                  <p className="mt-3 text-6xl font-bold tracking-tight">{fmtEur(totalExtraCost)}</p>
                  <p className="mt-2 text-slate-400">zu viel pro Jahr</p>

                  {findings.length > 1 && (
                    <div className="mt-6 grid gap-3">
                      {findings.map(f => (
                        <div key={f.device.id} className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3 text-sm">
                          <span className="flex items-center gap-2">
                            <span>{f.device.icon}</span>
                            <span>{f.device.label} ({AGE_LABEL[f.age]})</span>
                          </span>
                          <span className="font-bold text-red-300">+{fmtEur(f.result.extraCost)}/Jahr</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Detail-Karten */}
                <div className="mb-8 space-y-4">
                  {findings.map((f, i) => {
                    const fStars = f.hasDetail ? accuracyStars(f.device.id) : 1;
                    return (
                      <div key={f.device.id} className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-2xl">
                            {f.device.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold text-slate-900">#{i + 1} {f.device.label}</p>
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                                {AGE_LABEL[f.age]}
                              </span>
                              {f.hasDetail && <AccuracyStars count={fStars} />}
                            </div>
                            {f.hasDetail && f.result.note && (
                              <p className="mt-0.5 text-xs text-slate-400">{f.result.note}</p>
                            )}
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                              <div className="rounded-xl bg-slate-50 p-3 text-center">
                                <p className="text-xs text-slate-500">Mehrkosten</p>
                                <p className="mt-0.5 font-bold text-red-600">{fmtEur(f.result.extraCost)}/J.</p>
                              </div>
                              <div className="rounded-xl bg-slate-50 p-3 text-center">
                                <p className="text-xs text-slate-500">Neugerät ca.</p>
                                <p className="mt-0.5 font-bold text-slate-800">{fmtEur(f.result.newCost)}</p>
                              </div>
                              <div className="col-span-2 rounded-xl bg-primary/5 p-3 text-center sm:col-span-1">
                                <p className="text-xs text-slate-500">Amortisation</p>
                                <p className="mt-0.5 font-bold text-primary">
                                  {f.result.amortYears > 0 ? `~${f.result.amortYears} Jahre` : '–'}
                                </p>
                              </div>
                            </div>
                            <p className="mt-3 text-xs leading-relaxed text-slate-500">{f.result.tip}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="mb-8 rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 to-emerald-50 p-10 text-center">
                <div className="mb-4 text-5xl">🏆</div>
                <p className="text-2xl font-bold text-slate-900">Glückwunsch – keine Energiefresser!</p>
                <p className="mx-auto mt-3 max-w-md text-slate-600">
                  Deine Geräte sind auf dem neusten Stand. Der größte Hebel liegt jetzt bei deinem Energietarif.
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-lg">⚡</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">
                    {hasFindings ? 'Der größte Hebel ist dennoch dein Energietarif' : 'Dein größter Hebel: der Energietarif'}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Ein Tarifwechsel spart deutschen Haushalten im Schnitt 180–750 € / Jahr –{' '}
                    {hasFindings ? 'oft mehr als der Gerätewechsel.' : 'kostenlos und in 5 Minuten.'}
                  </p>
                  <Link
                    href="/spar-check"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                  >
                    Zum Spar-Check →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Info ──────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">Wann lohnt sich ein neues Gerät?</h2>
          <div className="space-y-4">
            {([
              { icon: '🔥', title: 'Heizkessel: größter Einzelposten', body: 'Ein Heizkessel vor 2000 verbraucht 25–35 % mehr Energie als ein moderner Brennwertkessel. Bei Heizkosten von 2.000 €/Jahr macht das bis zu 700 € Ersparnis – plus KfW-Förderung bis 70 %.' },
              { icon: '🧊', title: 'Kühlschrank läuft 24/7', body: 'Weil er ununterbrochen läuft, macht Effizienz beim Kühlschrank mehr aus als bei Wasch- oder Spülmaschine. Geräte vor 2000 verbrauchen oft 300–400 kWh/Jahr, moderne A-Geräte nur 100–150 kWh.' },
              { icon: '🔄', title: 'Faustregel: 10-Jahres-Grenze', body: 'Geräte über 15 Jahre lohnen sich selten zu reparieren – Ersatzteile werden teuer, die Effizienz bleibt schlecht. Unter 10 Jahren: erst tauschen wenn defekt.' },
              { icon: '📊', title: 'Gesamtbild zählt', body: 'Selbst wenn ein neues Gerät sich lohnt: Der Energietarif ist oft der schnellere Hebel. Ein Gastarif-Wechsel kostet nichts und spart in 5 Minuten bis zu 750 € / Jahr.' },
            ] as const).map(item => (
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
