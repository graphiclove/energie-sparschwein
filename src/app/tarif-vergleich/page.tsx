'use client';

import { useState } from 'react';
import {
  getManagedSwitchCards,
  getSelfCompareCards,
  type AffiliatePortalCard,
  type HeatingType,
} from '@/lib/affiliateRecommendations';

// ─── Typen ────────────────────────────────────────────────────────────────────
interface UserData {
  heating: HeatingType;
  area:    number;
  persons: number;
  zip:     string;
}

const DEFAULT_DATA: UserData = { heating: 'unknown', area: 120, persons: 2, zip: '' };

function getInitialTarifVergleichData(): { data: UserData; hasData: boolean } {
  if (typeof window === 'undefined') {
    return { data: DEFAULT_DATA, hasData: false };
  }

  const saved = localStorage.getItem('sparCheckData');
  if (!saved) {
    return { data: DEFAULT_DATA, hasData: false };
  }

  try {
    const p = JSON.parse(saved);
    return {
      data: {
        heating: p.heating ?? 'unknown',
        area:    Number(p.area)    || 120,
        persons: Number(p.persons) || 2,
        zip:     p.zip ?? '',
      },
      hasData: true,
    };
  } catch {
    return { data: DEFAULT_DATA, hasData: false };
  }
}

// ─── Preise (BDEW/Verivox 2026) ───────────────────────────────────────────────
const P = {
  gas:       { alt: 0.136, neu: 0.081 },
  oil:       { alt: 1.45,  neu: 1.30  },
  pellets:   { alt: 0.38,  neu: 0.28  },
  heizstrom: { alt: 0.38,  neu: 0.22  },
  strom:     { alt: 0.40,  neu: 0.28  },
};

const currency = (n: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

// ─── Vergleichstabelle ────────────────────────────────────────────────────────
interface TableRow {
  label:      string;
  note:       string;
  alt:        number;
  neu:        number;
  isEstimate?: boolean;
}

function calcRows(data: UserData): TableRow[] {
  const rows: TableRow[] = [];
  const stromKwh = 1500 + data.persons * 500;

  if (data.heating === 'gas') {
    const kwh = data.area * 140;
    rows.push({ label: 'Gasheizung', note: `${data.area} m² × 140 kWh/m² × Preis/kWh`, alt: kwh * P.gas.alt, neu: kwh * P.gas.neu });
  }
  if (data.heating === 'oil') {
    const liter = data.area * 15;
    rows.push({ label: 'Heizöl', note: `${data.area} m² × 15 L/m² × Preis/L`, alt: liter * P.oil.alt, neu: liter * P.oil.neu });
  }
  if (data.heating === 'pellets') {
    const kg = data.area * 6;
    rows.push({ label: 'Holzpellets', note: `${data.area} m² × 6 kg/m² × Preis/kg`, alt: kg * P.pellets.alt, neu: kg * P.pellets.neu });
  }
  if (data.heating === 'heatpump') {
    const kwh = data.area * 35;
    rows.push({ label: 'Heizstrom (Wärmepumpe)', note: `${data.area} m² × 35 kWh/m² × Preis/kWh`, alt: kwh * P.heizstrom.alt, neu: kwh * P.heizstrom.neu });
  }

  rows.push({
    label:      'Haushaltsstrom',
    note:       `Schätzwert: ~${stromKwh.toLocaleString('de-DE')} kWh/Jahr für ${data.persons} ${data.persons === 1 ? 'Person' : 'Personen'}`,
    alt:        stromKwh * P.strom.alt,
    neu:        stromKwh * P.strom.neu,
    isEstimate: true,
  });

  return rows;
}

// ─── Spar-Tipp ────────────────────────────────────────────────────────────────
function getSparTipp(data: UserData): { title: string; body: string; cta?: { text: string; href: string } } {
  if (data.heating === 'gas') {
    return {
      title: 'Wusstest du? Pellets kosten nur 7,6 Ct/kWh',
      body:  'Gas kostet aktuell ~10,5 Ct/kWh effektiv – Pellets nur 7,6 Ct/kWh. Bei gleicher Wärme könntest du deutlich sparen. Mit KfW-Förderung (bis 70 %) amortisiert sich ein Umstieg oft in unter 10 Jahren.',
      cta:   { text: 'Mehr zur Heizungsmodernisierung', href: '/ratgeber/heizkosten-senken' },
    };
  }
  if (data.heating === 'oil') {
    return {
      title: 'Heizöl ist 37% teurer als Pellets',
      body:  'Heizöl schwankt stark mit dem Ölpreis. Pellets sind seit Jahren stabiler und aktuell 37 % günstiger pro kWh. Ein Umstieg wird mit KfW-Mitteln (bis 70 %) gefördert.',
      cta:   { text: 'Mehr zur Heizungsmodernisierung', href: '/ratgeber/heizkosten-senken' },
    };
  }
  if (data.heating === 'pellets') {
    return {
      title: 'Du heizt bereits sehr günstig!',
      body:  'Pellets sind einer der günstigsten und klimafreundlichsten Brennstoffe. Dein größtes Restpotenzial liegt beim Stromtarif – prüfe, ob du mehr als 28 Ct/kWh zahlst.',
    };
  }
  if (data.heating === 'heatpump') {
    return {
      title: 'Heizstrom statt Normaltarif spart 500–900 €/Jahr',
      body:  'Wärmepumpen-Besitzer zahlen oft unnötig viel, weil sie keinen Spezialtarif nutzen. Heizstromtarife kosten 22–25 Ct/kWh statt 38 Ct/kWh – ohne jede Investition.',
    };
  }
  return {
    title: 'Stromtarif wechseln: einfachster Hebel',
    body:  'Ein Wechsel zum günstigsten Neukundentarif spart deutschen Haushalten im Schnitt 180 € pro Jahr – in weniger als 10 Minuten erledigt.',
  };
}

// ─── Sterne ───────────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs font-semibold text-slate-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

// ─── Portal-Karte ─────────────────────────────────────────────────────────────
function PortalCardUI({ card }: { card: AffiliatePortalCard }) {
  return (
    <div className={`relative flex flex-col rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
      card.isRecommended ? 'border-primary/30 bg-white shadow-md shadow-primary/5' : 'border-slate-200 bg-slate-50/80'
    }`}>
      {card.isRecommended && (
        <div className="absolute -top-3 left-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-slate-950 shadow shadow-primary/20">
            ★ Unsere Empfehlung
          </span>
        </div>
      )}
      <div className="flex-1">
        <p className={`text-base font-bold mb-1.5 mt-1 ${card.isRecommended ? 'text-slate-900' : 'text-slate-700'}`}>{card.name}</p>
        <StarRating rating={card.rating} />
        <ul className="mt-3 space-y-1.5">
          {card.taglines.map((t) => (
            <li key={t} className="flex items-start gap-1.5 text-xs text-slate-600 leading-snug">
              <span className="text-primary mt-0.5 shrink-0">✓</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <a
        href={card.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-5 block rounded-full px-4 py-2.5 text-xs font-semibold text-center transition ${
          card.isRecommended
            ? 'bg-primary text-slate-950 hover:bg-primary/90 shadow-md shadow-primary/20'
            : 'bg-slate-800 text-white hover:bg-slate-700'
        }`}
      >
        {card.buttonText}
      </a>
    </div>
  );
}

const HEATING_LABELS: Record<HeatingType, string> = {
  gas:      'Gas',
  oil:      'Heizöl',
  pellets:  'Pellets',
  heatpump: 'Wärmepumpe',
  unknown:  'Nicht angegeben',
};

// ─── Hauptkomponente ──────────────────────────────────────────────────────────
export default function TarifVergleich() {
  const initialState = getInitialTarifVergleichData();
  const [data] = useState<UserData>(initialState.data);
  const [hasData] = useState(initialState.hasData);

  const rows       = calcRows(data);
  const totalAlt   = rows.reduce((s, r) => s + r.alt, 0);
  const totalNeu   = rows.reduce((s, r) => s + r.neu, 0);
  const totalSaving = totalAlt - totalNeu;
  const weg1Cards  = getSelfCompareCards({
    heating: data.heating,
    area: data.area,
    persons: data.persons,
    zip: data.zip,
  });
  const weg2Cards = getManagedSwitchCards({
    heating: data.heating,
    area: data.area,
    persons: data.persons,
    zip: data.zip,
  });
  const sparTipp   = getSparTipp(data);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Deine persönliche Spar-Analyse</p>
          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Was du zahlst –<br className="hidden sm:block" /> und was möglich wäre
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300">
            Konkrete Zahlen für deinen Haushalt, bevor du zu einem Vergleichsportal gehst.
          </p>

          {hasData ? (
            <div className="inline-flex flex-wrap justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-slate-200">
              <span>Heizung: {HEATING_LABELS[data.heating]}</span>
              <span className="text-white/30">·</span>
              <span>{data.area} m²</span>
              <span className="text-white/30">·</span>
              <span>{data.persons} {data.persons === 1 ? 'Person' : 'Personen'}</span>
              {data.zip && <><span className="text-white/30">·</span><span>PLZ {data.zip}</span></>}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/20 px-5 py-2.5 text-sm font-semibold text-amber-200">
              ⚠ Noch kein Spar-Check –{' '}
              <a href="/spar-check" className="underline underline-offset-2 transition hover:text-white">jetzt starten</a>
              {' '}für personalisierte Werte.
            </div>
          )}

          <div className="flex flex-col justify-center gap-3 pt-1 sm:flex-row">
            <a href="/spar-check" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold transition hover:bg-white/20">
              Angaben anpassen →
            </a>
            <a href="#wege" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90">
              Zu den Wechseloptionen ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── Block 1: Vergleichstabelle ──────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Schritt 1</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">Was du aktuell zahlst – und was möglich wäre</h2>
            <p className="mt-2 text-sm text-slate-500">
              Grundlage: Durchschnittspreise 2026 (BDEW, Verivox). Exakte Tarife findest du bei den Vergleichsportalen unten.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
            {/* Kopfzeile */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 bg-slate-900 px-6 py-4 text-xs font-bold uppercase tracking-wider text-white">
              <div>Kostenart</div>
              <div className="w-28 text-right">Grundversorgung</div>
              <div className="w-28 text-right">Bester Neukunde</div>
              <div className="w-24 text-right text-primary">Ersparnis</div>
            </div>

            {/* Datenzeilen */}
            {rows.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 px-6 py-5 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                <div>
                  <p className="font-semibold text-slate-800">
                    {row.label}
                    {row.isEstimate && <span className="ml-1.5 align-middle text-[10px] font-normal text-slate-400">*</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">{row.note}</p>
                </div>
                <div className="w-28 text-right text-slate-500">{currency(row.alt)}</div>
                <div className="w-28 text-right font-semibold text-slate-900">{currency(row.neu)}</div>
                <div className="w-24 text-right font-bold text-primary">− {currency(row.alt - row.neu)}</div>
              </div>
            ))}

            {/* Summenzeile */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 border-t border-slate-700 bg-slate-900 px-6 py-5 text-sm font-bold text-white">
              <div>Gesamt / Jahr</div>
              <div className="w-28 text-right text-slate-400">{currency(totalAlt)}</div>
              <div className="w-28 text-right">{currency(totalNeu)}</div>
              <div className="w-24 text-right text-base text-primary">− {currency(totalSaving)}</div>
            </div>
          </div>

          {/* Fußnoten */}
          <div className="mt-4 space-y-2">
            <p className="text-xs text-slate-400">* Haushaltsstrom geschätzt auf Basis der Personenzahl (BDEW-Durchschnitt ohne Heizung/Warmwasser).</p>
            <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
              <span className="mt-0.5 shrink-0 text-sm text-amber-500">ℹ</span>
              <p className="text-xs text-amber-800">
                Berechnung basiert auf Durchschnittspreisen 2026 (BDEW, Verivox). Exakte Tarife für deine PLZ findest du bei den Vergleichsportalen unten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Block 2: Zwei Wege ──────────────────────────────────────────────── */}
      <section id="wege" className="border-y border-slate-200 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Schritt 2</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">Wähle deinen Weg</h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-500">
              Egal ob du selbst vergleichen oder alles automatisch erledigen lassen willst – hier sind die besten Optionen.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">

            {/* Weg 1 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">🔍</div>
                <div>
                  <p className="mb-0.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Weg 1</p>
                  <h3 className="text-xl font-bold text-slate-900">Selbst vergleichen & wechseln</h3>
                </div>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-slate-500">
                Du willst selbst den besten Tarif finden? Vergleiche auf den führenden Portalen und wechsle direkt. Der neue Anbieter kündigt für dich.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {weg1Cards.map((card) => <PortalCardUI key={card.name} card={card} />)}
              </div>
            </div>

            {/* Weg 2 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">🤖</div>
                <div>
                  <p className="mb-0.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">Weg 2</p>
                  <h3 className="text-xl font-bold text-slate-900">Für mich erledigen lassen</h3>
                </div>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-slate-500">
                Keine Lust auf Vergleichen? Diese Services wechseln deinen Tarif automatisch – jedes Jahr aufs Neue. Kein Aufwand, kein Risiko.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {weg2Cards.map((card) => <PortalCardUI key={card.name} card={card} />)}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Block 3: Spar-Tipp ───────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 to-emerald-50 p-10">
            <div className="flex items-start gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-xl">💡</div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.28em] text-primary">Spar-Tipp</p>
                <h3 className="mb-3 text-2xl font-bold text-slate-900">{sparTipp.title}</h3>
                <p className="leading-relaxed text-slate-600">{sparTipp.body}</p>
                {sparTipp.cta && (
                  <a href={sparTipp.cta.href} className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90">
                    {sparTipp.cta.text} →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Block 4: Transparenz ─────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-100 px-6 py-10">
        <div className="mx-auto flex max-w-4xl items-start gap-4">
          <span className="shrink-0 text-2xl">🔒</span>
          <div>
            <p className="mb-1 text-sm font-bold text-slate-700">So finanzieren wir uns</p>
            <p className="text-sm leading-relaxed text-slate-500">
              Bei einem Wechsel oder einer Anmeldung über unsere Links erhalten wir eine Provision vom Vergleichsportal oder Partner.
              Für dich entstehen dadurch <strong className="text-slate-700">keine Mehrkosten</strong>.
              Unsere Empfehlungen basieren auf unabhängiger Recherche – nicht auf Provisionsgrößen.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
