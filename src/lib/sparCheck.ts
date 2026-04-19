export type HeatingType = 'gas' | 'oil' | 'pellets' | 'heatpump' | 'unknown';
export type GasUsage = 'heating' | 'hotwater' | 'cooking';

export interface SparCheckData {
  heating: HeatingType;
  gasUsage: GasUsage[];
  area: number;
  persons: number;
  electricityKnown: boolean;
  electricityKwh: number;
  zip: string;
}

export interface CostItem {
  label: string;
  note: string;
  current: number;
  optimal: number;
}

export interface SavingRange {
  low: number;
  high: number;
}

export interface PathStep {
  title: string;
  text: string;
}

export interface SparCheckRecommendation {
  path: PathStep[];
  nextStepTitle: string;
  nextStepText: string;
  nextStepHref: string;
}

export const DEFAULT_SPAR_CHECK_DATA: SparCheckData = {
  heating: 'unknown',
  gasUsage: ['heating'],
  area: 100,
  persons: 2,
  electricityKnown: false,
  electricityKwh: 3000,
  zip: '',
};

export const GAS_GRUNDV = 0.136;
export const GAS_BEST = 0.081;
export const OIL_GRUNDV = 1.1;
export const OIL_BEST = 0.85;
export const PELLET_GRUNDV = 0.38;
export const PELLET_BEST = 0.28;
export const HEATPUMP_GRUNDV = 0.38;
export const HEATPUMP_BEST = 0.22;
export const STROM_GRUNDV = 0.4;
export const STROM_BEST = 0.28;

export const currency = (n: number) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

export function getInitialSparCheckData(): SparCheckData {
  if (typeof window === 'undefined') return DEFAULT_SPAR_CHECK_DATA;

  const zipFromUrl = new URLSearchParams(window.location.search).get('zip');
  const saved = localStorage.getItem('sparCheckData');
  let nextData = cloneDefaultSparCheckData();

  if (saved) {
    try {
      const p = JSON.parse(saved);
      nextData = {
        heating: p.heating ?? 'unknown',
        gasUsage: Array.isArray(p.gasUsage) ? p.gasUsage : ['heating'],
        area: Number(p.area) || 100,
        persons: Number(p.persons) || 2,
        electricityKnown: p.electricityKnown ?? false,
        electricityKwh: Number(p.electricityKwh) || 3000,
        zip: /^\d{5}$/.test(p.zip ?? '') ? p.zip : '',
      };
    } catch {
      localStorage.removeItem('sparCheckData');
    }
  }

  if (zipFromUrl && /^\d{5}$/.test(zipFromUrl)) {
    nextData = { ...nextData, zip: zipFromUrl };
  }

  return nextData;
}

function cloneDefaultSparCheckData(): SparCheckData {
  return { ...DEFAULT_SPAR_CHECK_DATA };
}

export function calculateCosts(data: SparCheckData): CostItem[] {
  const items: CostItem[] = [];

  if (data.heating === 'gas') {
    if (data.gasUsage.includes('heating')) {
      const kwh = data.area * 140;
      items.push({
        label: 'Gasheizung (Raumwärme)',
        note: `140 kWh/m²/Jahr × ${data.area} m²`,
        current: kwh * GAS_GRUNDV,
        optimal: kwh * GAS_BEST,
      });
    }
    if (data.gasUsage.includes('hotwater')) {
      const kwh = data.persons * 500;
      items.push({
        label: 'Gaswarmwasser',
        note: `~500 kWh/Person/Jahr × ${data.persons} ${data.persons === 1 ? 'Person' : 'Personen'}`,
        current: kwh * GAS_GRUNDV,
        optimal: kwh * GAS_BEST,
      });
    }
    if (data.gasUsage.includes('cooking')) {
      items.push({
        label: 'Gaskochen',
        note: '~250 kWh/Jahr (Durchschnitt 2-Personen-Haushalt)',
        current: 250 * GAS_GRUNDV,
        optimal: 250 * GAS_BEST,
      });
    }
  }

  if (data.heating === 'oil') {
    const liters = data.area * 15;
    items.push({
      label: 'Heizöl (Jahresbedarf)',
      note: `~15 Liter/m²/Jahr × ${data.area} m²`,
      current: liters * OIL_GRUNDV,
      optimal: liters * OIL_BEST,
    });
  }

  if (data.heating === 'pellets') {
    const kg = data.area * 6;
    items.push({
      label: 'Holzpellets (Jahresbedarf)',
      note: `~6 kg/m²/Jahr × ${data.area} m²`,
      current: kg * PELLET_GRUNDV,
      optimal: kg * PELLET_BEST,
    });
  }

  if (data.heating === 'heatpump') {
    const kwh = data.area * 35;
    items.push({
      label: 'Heizstrom (Wärmepumpe)',
      note: `~35 kWh/m²/Jahr × ${data.area} m²`,
      current: kwh * HEATPUMP_GRUNDV,
      optimal: kwh * HEATPUMP_BEST,
    });
  }

  if (data.electricityKnown && data.electricityKwh > 0) {
    const kwh = data.electricityKwh;
    items.push({
      label: 'Haushaltsstrom',
      note: `${kwh.toLocaleString('de-DE')} kWh/Jahr (deine Angabe)`,
      current: kwh * STROM_GRUNDV,
      optimal: kwh * STROM_BEST,
    });
  }

  return items;
}

export function estimateElectricity(persons: number): number {
  if (persons <= 1) return 1500;
  if (persons === 2) return 2500;
  if (persons === 3) return 3500;
  return 4500;
}

export function getHeatingLabel(heating: HeatingType) {
  switch (heating) {
    case 'gas':
      return 'Gas';
    case 'oil':
      return 'Heizöl';
    case 'pellets':
      return 'Pellets';
    case 'heatpump':
      return 'Wärmepumpe';
    default:
      return 'unbekannte Heizung';
  }
}

export function getTotalSaving(data: SparCheckData) {
  return calculateCosts(data).reduce((sum, item) => sum + (item.current - item.optimal), 0);
}

export function getSavingRange(value: number, variance = 0.3): SavingRange {
  const normalized = Math.max(0, value);
  const low = Math.max(0, Math.round(normalized * (1 - variance) / 50) * 50);
  const high = Math.max(low, Math.round(normalized * (1 + variance) / 50) * 50);
  return { low, high };
}

export function formatSavingRange(range: SavingRange) {
  if (range.high === 0) return 'unter 100 € pro Jahr';
  if (range.low === range.high) return `${currency(range.low)} pro Jahr`;
  return `${currency(range.low)} bis ${currency(range.high)} pro Jahr`;
}

export function getPotentialLevel(value: number) {
  if (value >= 700) return 'hohes Sparpotenzial';
  if (value >= 300) return 'mittleres Sparpotenzial';
  return 'begrenztes Sparpotenzial';
}

export function getSummaryLine(data: SparCheckData) {
  const parts = [getHeatingLabel(data.heating), `${data.area} m²`, `${data.persons} ${data.persons === 1 ? 'Person' : 'Personen'}`];
  if (data.zip) parts.push(`PLZ ${data.zip}`);
  return parts.join(', ');
}

export function getSparCheckRecommendation(data: SparCheckData): SparCheckRecommendation {
  const costs = calculateCosts(data);
  const totalSaving = costs.reduce((sum, item) => sum + (item.current - item.optimal), 0);
  const heatingSaving = costs
    .filter((item) => item.label !== 'Haushaltsstrom')
    .reduce((sum, item) => sum + (item.current - item.optimal), 0);
  const electricitySaving = getEstimatedElectricitySaving(
    data.persons,
    data.electricityKnown ? data.electricityKwh : undefined,
  );
  const totalRange = formatSavingRange(getSavingRange(totalSaving));
  const heatingRange = formatSavingRange(getSavingRange(heatingSaving));
  const electricityRange = formatSavingRange(getSavingRange(electricitySaving));
  const modernizationRange = formatSavingRange(getSavingRange(getGasModernizationSaving(data.area), 0.4));
  const oilToPelletRange = formatSavingRange(getSavingRange(getOilToPelletSaving(data.area), 0.4));

  if (data.heating === 'gas' || data.heating === 'unknown') {
    return {
      path: [
        {
          title: 'Du zahlst vermutlich zu viel.',
          text: 'Die Grundversorgung ist oft der teuerste Tarif. Gerade bei Gas lohnt sich zuerst der einfache Preis- und Vertragscheck.',
        },
        {
          title: `Für Haushalte wie deinen liegt das typische Marktpotenzial bei etwa ${totalRange}.`,
          text: 'Das ist bewusst eine Spanne, keine scheinpräzise Vertragszahl. Ohne deinen echten Tarif schätzen wir Marktpotenzial, nicht deinen individuellen Vertrag.',
        },
        {
          title: `Optional: Eine Modernisierung kann langfristig weitere ${modernizationRange} bringen.`,
          text: 'Das ist aber ein größerer Schritt. Erst den Tarif sauber aufstellen, dann über Technik nachdenken.',
        },
        {
          title: 'Wir erinnern dich später an den nächsten Check.',
          text: 'Wenn du willst, übernimmt der Preis-Wächter das jährliche Wiedervorlegen für dich.',
        },
      ],
      nextStepTitle: 'Gas-Tarife und Wechseloptionen prüfen',
      nextStepText: 'Der sinnvollste nächste Schritt ist jetzt ein sauberer Blick auf passende Gasangebote und Wechselwege.',
      nextStepHref: '/tarif-vergleich#empfehlung',
    };
  }

  if (data.heating === 'oil') {
    return {
      path: [
        {
          title: 'Heizöl ist aktuell teurer als Pellets.',
          text: 'Ein Heizungstausch kann sinnvoll sein, ist aber eine größere Investition und nicht der erste Schritt für jede Situation.',
        },
        {
          title: `Kurzfristig liegt der Preishebel eher bei ${heatingRange}.`,
          text: 'Das erreichst du am ehesten, indem du die günstigsten Online-Preise vor der nächsten Bestellung systematisch prüfst.',
        },
        {
          title: `Langfristig überlegenswert: Wechsel zu Pellets mit einem zusätzlichen Hebel von grob ${oilToPelletRange}.`,
          text: 'Förderprogramme können einen großen Teil der Investition abfedern.',
        },
        {
          title: 'Mit Preisalarmen musst du den Markt nicht selbst beobachten.',
          text: 'Wenn Heizöl-Preise fallen, ist ein Erinnerungsdienst oft wertvoller als tägliches Nachsehen.',
        },
      ],
      nextStepTitle: 'Heizöl-Preise gezielt vergleichen',
      nextStepText: 'Der naheliegendste nächste Schritt ist ein Preisvergleich für deinen nächsten Kauf, nicht sofort ein Komplettumbau.',
      nextStepHref: '/tarif-vergleich#empfehlung',
    };
  }

  if (data.heating === 'pellets') {
    return {
      path: [
        {
          title: 'Du heizt bereits klimafreundlich und relativ günstig.',
          text: 'Das ist eine starke Ausgangslage. Dein Sparhebel liegt eher im Feinschliff als in einem großen Wechsel.',
        },
        {
          title: `Der größte Hebel ist wahrscheinlich dein Stromtarif mit einem typischen Potenzial von ${electricityRange}.`,
          text: 'Gerade bei Haushalten mit Pelletheizung bleibt der normale Haushaltsstrom oft der einfachste Optimierungshebel. Auch das ist eine Marktspanne, nicht dein exakter Vertragseffekt.',
        },
        {
          title: 'Optional: Solarthermie ergänzen.',
          text: 'Das ist kein Muss, kann aber in passenden Häusern Warmwasser und Heizlast zusätzlich entlasten.',
        },
      ],
      nextStepTitle: 'Stromtarif als Resthebel prüfen',
      nextStepText: 'Du musst nicht alles neu denken. Wahrscheinlich reicht ein gezielter Stromvergleich als sinnvollster nächster Schritt.',
      nextStepHref: '/tarif-vergleich#empfehlung',
    };
  }

  return {
    path: [
      {
        title: 'Du heizt bereits effizient. Gut.',
        text: 'Mit einer Wärmepumpe liegt dein Fokus meist nicht auf dem System selbst, sondern auf dem passenden Stromtarif.',
      },
      {
        title: 'Wärmepumpenstrom-Spezialtarife sparen oft 20 bis 30 Prozent.',
        text: 'Viele Haushalte zahlen weiter Haushaltsstrompreise, obwohl ihr Verbrauchsprofil besser zu Spezialtarifen passt.',
      },
      {
        title: `Das typische Potenzial liegt hier eher bei ${heatingRange}.`,
        text: 'Das ist der naheliegendste Hebel, bevor du an weitere Technik oder Optimierungen gehst. Ohne deinen aktuellen Tarif bleiben wir bewusst bei einer Spanne.',
      },
    ],
    nextStepTitle: 'Wärmepumpenstrom gezielt prüfen',
    nextStepText: 'Der beste nächste Schritt ist jetzt ein Vergleich passender Strom- und Wechseloptionen für deinen Haushalt.',
    nextStepHref: '/tarif-vergleich#empfehlung',
  };
}

export function getEstimatedElectricitySaving(persons: number, electricityKwh?: number) {
  const kwh = electricityKwh && electricityKwh > 0 ? electricityKwh : estimateElectricity(persons);
  return kwh * (STROM_GRUNDV - STROM_BEST);
}

export function getGasModernizationSaving(area: number) {
  const gasHeatingCurrent = area * 140 * GAS_GRUNDV;
  const heatPumpOptimal = area * 35 * HEATPUMP_BEST;
  return Math.max(0, gasHeatingCurrent - heatPumpOptimal);
}

export function getOilToPelletSaving(area: number) {
  const oilCurrent = area * 15 * OIL_GRUNDV;
  const pelletOptimal = area * 6 * PELLET_BEST;
  return Math.max(0, oilCurrent - pelletOptimal);
}
