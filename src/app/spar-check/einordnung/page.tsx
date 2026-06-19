'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import {
  formatSavingRange,
  getInitialSparCheckData,
  getPotentialLevel,
  getSavingRange,
  getSparCheckResultRecommendation,
  getTotalSaving,
  SPAR_CHECK_STORAGE_KEY,
} from '@/lib/sparCheck';
import { trackEvent } from '@/lib/tracking';

function subscribeToClientReady(callback: () => void) {
  callback();
  return () => {};
}

function ResultLoadingState() {
  return (
    <div className="min-h-screen bg-background px-6 py-28">
      <div className="surface-panel mx-auto max-w-3xl rounded-[2rem] p-8 text-center text-slate-600">
        Einordnung wird geladen ...
      </div>
    </div>
  );
}

function MissingResultState() {
  return (
    <div className="min-h-screen bg-background px-6 py-28">
      <div className="surface-panel mx-auto max-w-3xl rounded-[2rem] p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          Keine Einordnung vorhanden
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950">
          Starte zuerst den Spar-Check.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Ohne gespeicherte Angaben können wir keinen sinnvollen nächsten Schritt empfehlen.
        </p>
        <Link
          href="/spar-check"
          className="mt-8 inline-flex min-h-14 items-center justify-center rounded-[1.1rem] bg-[#13263b] px-6 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#17324d]"
        >
          Zum Spar-Check
        </Link>
      </div>
    </div>
  );
}

export default function SparCheckEinordnungPage() {
  const clientReady = useSyncExternalStore(subscribeToClientReady, () => true, () => false);

  if (!clientReady) return <ResultLoadingState />;

  const hasStoredData = window.localStorage.getItem(SPAR_CHECK_STORAGE_KEY) !== null;
  if (!hasStoredData) return <MissingResultState />;

  return <SparCheckResultContent />;
}

function SparCheckResultContent() {
  const router = useRouter();
  const data = getInitialSparCheckData();
  const result = getSparCheckResultRecommendation(data);
  const totalSaving = getTotalSaving(data);
  const savingRangeText = formatSavingRange(getSavingRange(totalSaving));
  const potentialLevel = getPotentialLevel(totalSaving);

  useEffect(() => {
    trackEvent('spar_check_result_view', {
      heating: data.heating,
      zip_present: !!data.zip,
      primary_kind: result.mainRecommendation.kind,
    });
  }, [data.heating, data.zip, result.mainRecommendation.kind]);

  return (
    <div className="min-h-screen bg-background text-slate-950">
      <section className="relative overflow-hidden bg-[#13263b] px-6 pb-18 pt-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(107,193,123,0.18),transparent_36%),linear-gradient(180deg,rgba(19,38,59,0.92)_0%,rgba(19,38,59,1)_100%)]" />
        <div className="editorial-grid absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,166,42,0.12),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/10 backdrop-blur-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/85">
              Deine persönliche Einordnung
            </p>
            <h1 className="mt-4 text-balance text-5xl font-bold leading-[0.94] tracking-[-0.05em] md:text-6xl">
              {result.situationTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              {result.situationText}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/12 bg-white/7 px-4 py-2 text-slate-100">
                {result.householdSummary}
              </span>
              <span className="rounded-full border border-white/12 bg-white/7 px-4 py-2 text-slate-100">
                {potentialLevel}
              </span>
              <span className="rounded-full border border-primary/25 bg-primary/12 px-4 py-2 text-primary">
                typische Spanne: {savingRangeText}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="radial-wash px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="surface-panel rounded-[2.2rem] px-7 py-7">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Haushaltsprofil
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">{result.profileLine}</p>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="surface-panel rounded-[2.2rem] px-7 py-7">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                {result.diagnosisTitle}
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950">
                {result.mainRecommendation.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600">{result.diagnosisText}</p>
              <div className="mt-6 rounded-[1.6rem] border border-slate-200 bg-white/70 p-5">
                <p className="text-sm font-semibold text-slate-500">Warum wir so empfehlen</p>
                <p className="mt-2 text-base leading-7 text-slate-700">
                  {result.recommendationReason}
                </p>
                <p className="mt-4 text-sm leading-6 text-slate-500">{result.savingsHint}</p>
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-[#13263b]/10 bg-[#13263b] px-7 py-7 text-white shadow-[0_34px_80px_-58px_rgba(15,23,42,0.75)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/90">
                Sparpotenzial
              </p>
              <p className="mt-4 text-5xl font-bold tracking-[-0.06em] text-white">
                {savingRangeText}
              </p>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Keine Garantiezahl, sondern eine ehrliche Spanne dafür, was in deiner Situation
                typischerweise drin sein kann.
              </p>
              <div className="mt-8 grid gap-3">
                {[
                  `Heizung: ${data.heating === 'heatpump' ? 'Wärmepumpe' : data.heating}`,
                  result.householdSummary,
                  `${potentialLevel} Potenzial`,
                ].map((item) => (
                  <div key={item} className="rounded-[1.15rem] border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2.2rem] border border-slate-900 bg-slate-950 p-7 text-white shadow-[0_40px_90px_-72px_rgba(15,23,42,0.45)]">
            <div className="grid gap-6 lg:grid-cols-[1fr_14rem] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  {result.mainRecommendation.eyebrow}
                </p>
                <h2 className="mt-4 text-balance text-4xl font-bold tracking-[-0.05em]">
                  {result.mainRecommendation.title}
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
                  {result.mainRecommendation.description}
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/6 px-4 py-4 text-sm leading-7 text-slate-200">
                <strong className="text-white">Warum dieser Weg passt:</strong>{' '}
                {result.mainRecommendation.reason}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                trackEvent('spar_check_primary_path_click', {
                  heating: data.heating,
                  kind: result.mainRecommendation.kind,
                  href: result.mainRecommendation.href,
                });
                router.push(result.mainRecommendation.href);
              }}
              className="mt-8 inline-flex min-h-14 items-center justify-center rounded-[1.1rem] bg-primary px-6 text-base font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              {result.mainRecommendation.ctaLabel}
            </button>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
            <div className="surface-panel rounded-[2.2rem] px-7 py-7">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                {result.alternativePath.eyebrow}
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                {result.alternativePath.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {result.alternativePath.description}
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                {result.alternativePath.reason}
              </p>
              <button
                type="button"
                onClick={() => {
                  trackEvent('spar_check_alternative_path_click', {
                    heating: data.heating,
                    kind: result.alternativePath.kind,
                    href: result.alternativePath.href,
                  });
                  router.push(result.alternativePath.href);
                }}
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[1rem] border border-slate-300 px-5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-white"
              >
                {result.alternativePath.ctaLabel}
              </button>
            </div>

            <div className="rounded-[2.2rem] border border-primary/20 bg-[#eaf4ec] p-7 shadow-[0_34px_80px_-58px_rgba(15,23,42,0.24)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                {result.watcherFallback.eyebrow}
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                {result.watcherFallback.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-700">
                {result.watcherFallback.description}
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
              <p className="mt-4 text-sm leading-6 text-slate-600">{result.watcherFallback.reason}</p>
              <button
                type="button"
                onClick={() => {
                  trackEvent('spar_check_price_watcher_click', {
                    heating: data.heating,
                    source: 'result_fallback',
                  });
                  router.push(result.watcherFallback.href);
                }}
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[1rem] bg-[#13263b] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#17324d]"
              >
                {result.watcherFallback.ctaLabel}
              </button>
            </div>
          </section>

          <section className="surface-panel rounded-[2.2rem] px-7 py-7">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Methodik & Vertrauen
            </p>
            <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
              <div>
                <h3 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950">
                  {result.trustBlock.title}
                </h3>
              </div>
              <div className="space-y-4">
                {result.trustBlock.items.map((item) => (
                  <div key={item} className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary" />
                    <p className="text-base leading-7 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <Link
                href="/spar-check"
                className="text-sm font-semibold text-slate-500 transition hover:text-slate-700"
              >
                Angaben im Spar-Check anpassen
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
