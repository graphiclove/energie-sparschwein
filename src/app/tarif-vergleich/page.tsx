'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  getAffiliateBranding,
  getManagedSwitchCards,
  getSelfCompareCards,
  type AffiliatePortalCard,
  type HeatingType,
} from '@/lib/affiliateRecommendations';
import {
  getSavingRange,
  getSparCheckResultRecommendation,
  getSummaryLine,
  getTotalSaving,
  formatSavingRange,
  type SparCheckData,
} from '@/lib/sparCheck';

interface UserData {
  heating: HeatingType;
  area: number;
  persons: number;
  zip: string;
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
    const parsed = JSON.parse(saved) as SparCheckData;
    return {
      data: {
        heating: parsed.heating ?? 'unknown',
        area: Number(parsed.area) || 120,
        persons: Number(parsed.persons) || 2,
        zip: parsed.zip ?? '',
      },
      hasData: true,
    };
  } catch {
    return { data: DEFAULT_DATA, hasData: false };
  }
}

function getComparisonExplanation(heating: HeatingType) {
  if (heating === 'gas') {
    return 'Weil dein Heiztyp klar ist und der wahrscheinlichste Hebel im Tarifraum liegt, ist Vergleichen hier ein plausibler nächster Schritt.';
  }
  if (heating === 'oil') {
    return 'Bei Heizöl geht es weniger um klassische Tariflogik und stärker um den richtigen Kaufzeitpunkt und passende Preisräume.';
  }
  if (heating === 'pellets') {
    return 'Für Pellet-Haushalte ist Vergleichen eher ein gezielter Resthebel als eine große Grundsatzentscheidung.';
  }
  if (heating === 'heatpump') {
    return 'Bei Wärmepumpen ist der Tarif oft der direkteste Hebel nach der technischen Entscheidung.';
  }
  return 'Weil dein Heiztyp noch nicht ganz klar ist, solltest du diesen Vergleichsraum als Orientierung nutzen und nicht als automatische Entscheidung.';
}

function getSelfServiceReason(heating: HeatingType) {
  if (heating === 'oil') {
    return 'Du willst selbst sehen, welcher Preisraum für die nächste Bestellung gerade wirklich attraktiv ist.';
  }
  if (heating === 'pellets') {
    return 'Du brauchst wahrscheinlich keinen großen Wechselservice, sondern einen gezielten Blick auf den verbleibenden Hebel.';
  }
  if (heating === 'heatpump') {
    return 'Du weißt bereits, dass die Technik steht und willst den Tarif jetzt selbst sauber prüfen.';
  }
  return 'Du willst den Vergleich selbst in der Hand behalten und direkt zum passenden Anbieterraum gehen.';
}

function getAssistedReason(heating: HeatingType) {
  if (heating === 'oil' || heating === 'pellets') {
    return 'Diese Variante passt, wenn du lieber an den richtigen Moment erinnert werden willst statt selbst laufend Preise zu beobachten.';
  }
  return 'Diese Variante passt, wenn du sparen willst, aber die Suche und den Wechsel nicht selbst organisieren möchtest.';
}

function PortalCard({
  card,
  whyFits,
  emphasized = false,
}: {
  card: AffiliatePortalCard;
  whyFits: string;
  emphasized?: boolean;
}) {
  const branding = getAffiliateBranding(card.name);

  return (
    <div
      className={`rounded-[1.75rem] border p-6 ${
        emphasized
          ? 'border-primary/30 bg-white shadow-[0_35px_80px_-70px_rgba(15,23,42,0.42)]'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            {emphasized ? 'Empfohlene Option' : 'Alternative'}
          </p>
          <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-slate-950">{card.name}</h3>
        </div>
        <span
          className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-bold ${branding.badgeClassName}`}
        >
          {branding.shortName}
        </span>
      </div>

      <p className="mt-5 text-base leading-7 text-slate-600">{whyFits}</p>

      <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-600">
        {card.taglines.map((tagline) => (
          <li key={tagline} className="flex gap-2">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
            <span>{tagline}</span>
          </li>
        ))}
      </ul>

      <a
        href={card.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-7 inline-flex min-h-12 items-center justify-center rounded-[1rem] px-5 text-sm font-semibold transition ${
          emphasized
            ? 'bg-slate-900 text-white hover:bg-slate-800'
            : 'border border-slate-300 text-slate-900 hover:bg-slate-50'
        }`}
      >
        {card.buttonText}
      </a>
    </div>
  );
}

export default function TarifVergleichPage() {
  const initialState = useMemo(() => getInitialTarifVergleichData(), []);
  const [data] = useState<UserData>(initialState.data);
  const [hasData] = useState(initialState.hasData);

  const sparCheckData = useMemo<SparCheckData>(
    () => ({
      heating: data.heating,
      area: data.area,
      persons: data.persons,
      zip: data.zip,
      electricityKnown: false,
      electricityKwh: 3000,
    }),
    [data],
  );

  const result = useMemo(() => getSparCheckResultRecommendation(sparCheckData), [sparCheckData]);
  const savingRangeText = useMemo(
    () => formatSavingRange(getSavingRange(getTotalSaving(sparCheckData), 0.35)),
    [sparCheckData],
  );
  const summaryLine = useMemo(() => getSummaryLine(sparCheckData), [sparCheckData]);

  const selfCompareCards = useMemo(
    () =>
      getSelfCompareCards({
        heating: data.heating,
        area: data.area,
        persons: data.persons,
        zip: data.zip,
      }),
    [data],
  );
  const managedSwitchCards = useMemo(
    () =>
      getManagedSwitchCards({
        heating: data.heating,
        area: data.area,
        persons: data.persons,
        zip: data.zip,
      }),
    [data],
  );

  const selfServiceCard = selfCompareCards.find((card) => card.isRecommended) ?? selfCompareCards[0];
  const assistedCard = managedSwitchCards.find((card) => card.isRecommended) ?? managedSwitchCards[0];
  const fullOverviewCards = [...selfCompareCards, ...managedSwitchCards];

  return (
    <div className="min-h-screen bg-[#eef2f2] text-slate-950">
      <section className="relative overflow-hidden bg-[#13263b] px-6 pb-18 pt-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(107,193,123,0.18),transparent_36%),linear-gradient(180deg,rgba(19,38,59,0.92)_0%,rgba(19,38,59,1)_100%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/85">
              Vergleichsraum
            </p>
            <h1 className="mt-4 text-balance text-5xl font-bold leading-[0.94] tracking-[-0.05em] md:text-6xl">
              Jetzt bist du im passenden Vergleichsraum. Nicht mehr im Portalchaos.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Diese Seite ist der nachgelagerte Entscheidungsraum nach deiner Einordnung. Du siehst
              hier nur Wege, die zu deinem Haushalt plausibel passen.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/12 bg-white/7 px-4 py-2 text-slate-100">
                {hasData ? summaryLine : 'ohne gespeicherte Einordnung'}
              </span>
              <span className="rounded-full border border-white/12 bg-white/7 px-4 py-2 text-slate-100">
                typische Spanne: {savingRangeText}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_40px_90px_-72px_rgba(15,23,42,0.32)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Rückbezug auf deine Einordnung
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950">
              {result.mainRecommendation.title}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              {getComparisonExplanation(data.heating)}
            </p>
            <div className="mt-6 rounded-[1.4rem] bg-[#f6f8f8] p-5">
              <p className="text-sm font-semibold text-slate-500">Warum du diese Optionen hier siehst</p>
              <p className="mt-2 text-base leading-7 text-slate-700">{result.recommendationReason}</p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-900 bg-slate-950 p-7 text-white shadow-[0_40px_90px_-72px_rgba(15,23,42,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Primärer Weg
            </p>
            <h2 className="mt-4 text-balance text-4xl font-bold tracking-[-0.05em]">
              Selbst vergleichen und direkt handeln
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Wenn du jetzt handeln willst, ist das der direkteste und klarste Weg. Du gehst selbst
              in den passenden Vergleichsraum und behältst die Entscheidung vollständig in der Hand.
            </p>

            {selfServiceCard ? (
              <div className="mt-8">
                <PortalCard card={selfServiceCard} whyFits={getSelfServiceReason(data.heating)} emphasized />
              </div>
            ) : null}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Seitlicher Weg
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                Lieber delegieren statt selbst prüfen
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Diese Variante passt, wenn du nicht selbst alle Tarife und Fristen im Blick behalten
                willst, aber trotzdem von einem besseren Weg profitieren möchtest.
              </p>

              {assistedCard ? (
                <div className="mt-6">
                  <PortalCard card={assistedCard} whyFits={getAssistedReason(data.heating)} />
                </div>
              ) : null}
            </div>

            <div className="rounded-[2rem] border border-primary/20 bg-[#eaf4ec] p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Noch nicht bereit?
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                Dann pausiere bewusst statt das Thema wieder zu verlieren.
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-700">
                Nicht jeder Haushalt muss heute sofort wechseln. Wenn dir gerade Klarheit reicht,
                ist der Preis-Wächter der richtige Produktzustand für jetzt.
              </p>
              <div className="mt-6 grid gap-3 text-sm text-slate-700 md:grid-cols-3">
                {[
                  'wenn Preise in deiner Region fallen',
                  'wenn dein Tarif ausläuft',
                  'wenn ein neuer Check sinnvoll wird',
                ].map((item) => (
                  <div key={item} className="rounded-[1.2rem] bg-white/75 px-4 py-4">
                    {item}
                  </div>
                ))}
              </div>
              <Link
                href="/preis-waechter"
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[1rem] bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Zum Preis-Wächter →
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_40px_90px_-72px_rgba(15,23,42,0.32)]">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Komplette Übersicht
                </p>
                <h3 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950">
                  Wenn du alles nebeneinander sehen willst
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Das ist die breite Sicht auf Selbstvergleich und Delegation. Sie ist bewusst
                  nachgeordnet, falls du lieber selbst sortieren möchtest.
                </p>
                <div className="mt-6 rounded-[1.4rem] bg-[#f6f8f8] p-5">
                  <p className="text-sm font-semibold text-slate-500">Vertiefung statt Exit</p>
                  <p className="mt-2 text-base leading-7 text-slate-700">
                    Wenn du vor dem Vergleich noch genauer auf einzelne Kostenblöcke schauen willst,
                    ist der Preisrechner ein sinnvoller Drill-down, aber nicht der Hauptweg auf
                    dieser Seite.
                  </p>
                  <Link
                    href="/preisrechner"
                    className="mt-4 inline-flex text-sm font-semibold text-slate-700 transition hover:text-slate-950"
                  >
                    Preisrechner als Vertiefung öffnen →
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {fullOverviewCards.map((card) => (
                  <PortalCard
                    key={`${card.name}-${card.buttonText}`}
                    card={card}
                    whyFits={
                      managedSwitchCards.some((managedCard) => managedCard.name === card.name)
                        ? getAssistedReason(data.heating)
                        : getSelfServiceReason(data.heating)
                    }
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_40px_90px_-72px_rgba(15,23,42,0.32)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Transparenz
            </p>
            <h3 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950">
              Warum diese Vergleichswege hier auftauchen
            </h3>
            <div className="mt-6 space-y-4">
              {[
                'Diese Seite zeigt Partner- und Vergleichswege, weil du vorher bereits eingeordnet wurdest und Vergleichen jetzt plausibel sein kann.',
                'Wir verdienen nur, wenn du über einen dieser Wege wechselst oder dich anmeldest. Für dich entstehen dadurch keine Mehrkosten.',
                'Nicht jede Option ist für jeden Haushalt gleich sinnvoll. Deshalb bekommst du oben einen empfohlenen Startpunkt statt nur eine Liste.',
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary" />
                  <p className="text-base leading-7 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
