'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_SPAR_CHECK_DATA,
  estimateElectricity,
  getInitialQuestionStepIndex,
  getInitialSparCheckData,
  getQuestionStepIds,
  SPAR_CHECK_STEP_STORAGE_KEY,
  SPAR_CHECK_STORAGE_KEY,
  type HeatingType,
  type SparCheckData,
  type SparCheckQuestionStepId,
} from '@/lib/sparCheck';
import { trackEvent } from '@/lib/tracking';

interface HeatingOption {
  value: HeatingType;
  label: string;
  subtitle: string;
}

const HEATING_OPTIONS: HeatingOption[] = [
  {
    value: 'gas',
    label: 'Gas',
    subtitle: 'Hier ist ein Tarif- oder Vertragscheck oft der erste echte Hebel.',
  },
  {
    value: 'oil',
    label: 'Heizöl',
    subtitle: 'Hier zählt meist eher Kaufzeitpunkt als klassischer Tarifwechsel.',
  },
  {
    value: 'pellets',
    label: 'Pellets',
    subtitle: 'Das Heizsystem steht oft schon gut. Spannender bleibt eher der Strom.',
  },
  {
    value: 'heatpump',
    label: 'Wärmepumpe',
    subtitle: 'Hier ist oft der Stromtarif spannender als die Technik selbst.',
  },
  {
    value: 'unknown',
    label: 'Ich weiß es nicht sicher',
    subtitle: 'Dann führen wir dich vorsichtiger und zuerst über Einordnung.',
  },
];

const STEP_META: Record<
  SparCheckQuestionStepId,
  {
    eyebrow: string;
    title: string;
    description: string;
    help: string;
  }
> = {
  heating: {
    eyebrow: 'Schritt 1',
    title: 'Womit heizt dein Haushalt aktuell?',
    description:
      'Diese Antwort verändert den nächsten sinnvollen Schritt am stärksten. Deshalb beginnen wir hier.',
    help: 'Wir brauchen keinen Vertrag, sondern nur die Richtung deines Haushalts.',
  },
  household: {
    eyebrow: 'Schritt 2',
    title: 'Wie groß ist dein Haushalt ungefähr?',
    description:
      'Wohnfläche und Personenzahl reichen aus, um deinen Haushalt grob und ehrlich einzuordnen.',
    help: 'Es geht nicht um exakte Abrechnung, sondern um eine plausible Empfehlung.',
  },
  electricity: {
    eyebrow: 'Schritt 3',
    title: 'Kennst du deinen Stromverbrauch ungefähr?',
    description:
      'Nur falls du ihn kennst. Sonst bleiben wir bewusst bei einer robusten, weniger präzisen Empfehlung.',
    help: 'Diese Frage stellen wir nur, wenn Strom wahrscheinlich den nächsten Schritt beeinflusst.',
  },
};

function hasStoredProgress() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(SPAR_CHECK_STORAGE_KEY) !== null;
}

function getStartState() {
  const data = getInitialSparCheckData();
  return {
    data,
    stepIndex: getInitialQuestionStepIndex(data),
    started: hasStoredProgress(),
  };
}

function isDefaultState(data: SparCheckData) {
  return (
    data.heating === DEFAULT_SPAR_CHECK_DATA.heating &&
    data.area === DEFAULT_SPAR_CHECK_DATA.area &&
    data.persons === DEFAULT_SPAR_CHECK_DATA.persons &&
    data.electricityKnown === DEFAULT_SPAR_CHECK_DATA.electricityKnown &&
    data.electricityKwh === DEFAULT_SPAR_CHECK_DATA.electricityKwh &&
    data.zip === DEFAULT_SPAR_CHECK_DATA.zip
  );
}

export default function SparCheckPage() {
  const router = useRouter();
  const [data, setData] = useState<SparCheckData>(() => getStartState().data);
  const [started, setStarted] = useState(() => getStartState().started);
  const [stepIndex, setStepIndex] = useState(() => getStartState().stepIndex);
  const trackedStepRef = useRef<string | null>(null);

  const stepIds = useMemo(() => getQuestionStepIds(data), [data]);
  const safeStepIndex = Math.min(stepIndex, stepIds.length - 1);
  const currentStepId = stepIds[safeStepIndex];
  const progress = ((safeStepIndex + 1) / stepIds.length) * 100;
  const canGoBack = safeStepIndex > 0;
  const isLastStep = safeStepIndex === stepIds.length - 1;
  const currentStep = STEP_META[currentStepId];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SPAR_CHECK_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SPAR_CHECK_STEP_STORAGE_KEY, String(safeStepIndex));
  }, [safeStepIndex]);

  useEffect(() => {
    if (!started) return;

    const trackingKey = `${currentStepId}-${safeStepIndex}-${data.heating}`;
    if (trackedStepRef.current === trackingKey) return;
    trackedStepRef.current = trackingKey;

    trackEvent('spar_check_step_view', {
      step: currentStepId,
      step_index: safeStepIndex,
      step_count: stepIds.length,
      heating: data.heating,
      zip_present: !!data.zip,
    });
  }, [currentStepId, data.heating, data.zip, safeStepIndex, started, stepIds.length]);

  const update = (partial: Partial<SparCheckData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const startCheck = () => {
    setStarted(true);
    trackEvent('spar_check_started', {
      entry_point: hasStoredProgress() ? 'resume' : 'direct',
      zip_present: !!data.zip,
    });
  };

  const advance = () => {
    if (isLastStep) {
      trackEvent('spar_check_completed', {
        heating: data.heating,
        zip_present: !!data.zip,
        electricity_known: data.electricityKnown,
      });
      router.push('/spar-check/einordnung');
      return;
    }

    setStepIndex((prev) => Math.min(prev + 1, stepIds.length - 1));
  };

  const goBack = () => {
    if (!canGoBack) return;
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const resetProgress = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SPAR_CHECK_STORAGE_KEY);
      window.localStorage.removeItem(SPAR_CHECK_STEP_STORAGE_KEY);
    }
    setData(DEFAULT_SPAR_CHECK_DATA);
    setStepIndex(0);
    setStarted(false);
  };

  return (
    <div className="min-h-screen bg-background text-slate-950">
      <section className="relative overflow-hidden bg-[#13263b] px-6 pb-18 pt-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(107,193,123,0.18),transparent_36%),linear-gradient(180deg,rgba(19,38,59,0.92)_0%,rgba(19,38,59,1)_100%)]" />
        <div className="editorial-grid absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,166,42,0.12),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/10 backdrop-blur-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/85">
              Spar-Check
            </p>
            <h1 className="mt-4 text-balance text-5xl font-bold leading-[0.94] tracking-[-0.05em] md:text-6xl">
              In wenigen Antworten zu einer klaren Energie-Empfehlung.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Wir fragen nur das, was deinen nächsten sinnvollen Schritt wirklich verändert. Danach
              bekommst du keine Zahlenwand, sondern eine Einordnung in normaler Sprache.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
              {['3 kurze Schritte', 'ohne Vertragsunterlagen', 'lokal im Browser gespeichert'].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/12 bg-white/7 px-4 py-2"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="radial-wash px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          {!started ? (
            <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
              <div className="surface-panel overflow-hidden rounded-[2.6rem]">
                <div className="border-b border-slate-200/70 px-7 py-6 md:px-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                    Was du hier bekommst
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950">
                    Kein Tarif-Dschungel. Erst Einordnung, dann Handlung.
                  </h2>
                </div>

                <div className="px-7 py-7 md:px-8">
                  <div className="space-y-4 text-base leading-7 text-slate-600">
                    <p>
                      Wir entscheiden zuerst, ob für dich eher <strong>vergleichen</strong>,{' '}
                      <strong>tiefer verstehen</strong> oder <strong>später beobachten</strong>{' '}
                      sinnvoll ist.
                    </p>
                    <p>
                      Tarif-Vergleich taucht erst dann als Empfehlung auf, wenn deine Antworten ihn
                      wirklich tragen.
                    </p>
                  </div>

                  <div className="mt-8 grid gap-3 md:grid-cols-3">
                    {[
                      '1. Heizsituation klären',
                      '2. Haushaltsgröße grob einordnen',
                      '3. Nächsten sinnvollen Schritt sehen',
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-[1.45rem] border border-slate-200 bg-[rgba(255,255,255,0.72)] px-5 py-4 text-sm font-medium text-slate-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={startCheck}
                      className="inline-flex min-h-14 items-center justify-center rounded-[1.2rem] bg-[#13263b] px-6 text-base font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-[#17324d]"
                    >
                      {hasStoredProgress() && !isDefaultState(data)
                        ? 'Mit gespeicherten Angaben weiter'
                        : 'Spar-Check starten'}
                    </button>

                    {hasStoredProgress() && !isDefaultState(data) ? (
                      <button
                        type="button"
                        onClick={resetProgress}
                        className="text-sm font-semibold text-slate-500 transition hover:text-slate-700"
                      >
                        Gespeicherte Angaben verwerfen
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <aside className="surface-panel rounded-[2.25rem] px-7 py-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                    Warum so wenig Fragen?
                  </p>
                  <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                    Wir fragen nur, was den nächsten Schritt verändert.
                  </h3>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
                    <p>
                      Heiztyp entscheidet, ob ein Vergleich plausibel ist oder ob zuerst Verstehen
                      sinnvoller wäre.
                    </p>
                    <p>
                      Wohnfläche und Personen reichen aus, um deinen Haushalt ehrlich grob einzuordnen.
                    </p>
                    <p>
                      Stromverbrauch fragen wir nur, wenn er für deinen nächsten Schritt wirklich
                      relevant sein könnte.
                    </p>
                  </div>
                </aside>

                <aside className="rounded-[2.25rem] border border-[#13263b]/10 bg-[#13263b] px-7 py-7 text-white shadow-[0_30px_70px_-55px_rgba(15,23,42,0.7)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/90">
                    Entscheidungslogik
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    {[
                      ['Vergleichen', 'wenn Tarif oder Vertrag jetzt wirklich der Hebel ist'],
                      ['Beobachten', 'wenn Timing wichtiger ist als sofortige Aktion'],
                      ['Verstehen', 'wenn zuerst Klarheit mehr bringt als Wechselstress'],
                    ].map(([title, text]) => (
                      <div key={title} className="border-t border-white/12 pt-4">
                        <p className="text-lg font-bold tracking-[-0.03em] text-white">{title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          ) : (
            <div className="surface-panel overflow-hidden rounded-[2.6rem]">
              <div className="border-b border-slate-200/70 px-7 py-6 md:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                      {currentStep.eyebrow} von {stepIds.length}
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950">
                      {currentStep.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-slate-600">
                      {currentStep.description}
                    </p>
                  </div>
                  <div className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-500">
                    {Math.round(progress)}%
                  </div>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-200/80">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-8 px-7 py-7 md:px-8 lg:grid-cols-[1fr_18rem]">
                <div>
                  {currentStepId === 'heating' ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {HEATING_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            update({ heating: option.value });
                            setStepIndex(1);
                          }}
                          className={`rounded-[1.85rem] p-5 text-left transition ${
                            data.heating === option.value
                              ? 'surface-panel border-primary/45 bg-[linear-gradient(180deg,rgba(121,208,138,0.14),rgba(255,255,255,0.92))] shadow-[0_24px_50px_-38px_rgba(23,50,77,0.35)]'
                              : 'surface-panel hover:-translate-y-0.5 hover:border-primary/30 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,250,246,0.98))]'
                          }`}
                        >
                          <div className="text-xl font-bold tracking-[-0.02em] text-slate-950">
                            {option.label}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{option.subtitle}</p>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {currentStepId === 'household' ? (
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center justify-between gap-4">
                          <label className="text-lg font-bold tracking-[-0.02em] text-slate-950">
                            Wohnfläche
                          </label>
                          <div className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-base font-bold text-slate-900">
                            {data.area} m²
                          </div>
                        </div>
                        <input
                          type="range"
                          min={20}
                          max={250}
                          step={5}
                          value={data.area}
                          onChange={(event) => update({ area: Number(event.target.value) })}
                          className="mt-5 h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-primary"
                        />
                        <div className="mt-2 flex justify-between text-xs text-slate-400">
                          <span>20 m²</span>
                          <span>100 m²</span>
                          <span>250 m²</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-lg font-bold tracking-[-0.02em] text-slate-950">
                          Personen im Haushalt
                        </label>
                        <div className="mt-4 flex flex-wrap gap-3">
                          {[1, 2, 3, 4, 5, 6].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => update({ persons: value })}
                            className={`h-14 w-14 rounded-[1rem] text-lg font-bold transition ${
                              data.persons === value
                                  ? 'surface-panel border-primary/45 bg-[linear-gradient(180deg,rgba(121,208,138,0.14),rgba(255,255,255,0.92))] text-slate-950'
                                  : 'surface-panel text-slate-700 hover:-translate-y-0.5 hover:border-primary/20'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {currentStepId === 'electricity' ? (
                    <div className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() =>
                            update({
                              electricityKnown: true,
                              electricityKwh: estimateElectricity(data.persons),
                            })
                          }
                          className={`rounded-[1.85rem] p-5 text-left transition ${
                            data.electricityKnown
                              ? 'surface-panel border-primary/45 bg-[linear-gradient(180deg,rgba(121,208,138,0.14),rgba(255,255,255,0.92))]'
                              : 'surface-panel hover:-translate-y-0.5 hover:border-primary/20'
                          }`}
                        >
                          <div className="text-xl font-bold tracking-[-0.02em] text-slate-950">
                            Ja, ungefähr
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            Dann nehmen wir deinen Jahreswert mit in die Einordnung.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => update({ electricityKnown: false })}
                          className={`rounded-[1.85rem] p-5 text-left transition ${
                            !data.electricityKnown
                              ? 'surface-panel border-primary/45 bg-[linear-gradient(180deg,rgba(121,208,138,0.14),rgba(255,255,255,0.92))]'
                              : 'surface-panel hover:-translate-y-0.5 hover:border-primary/20'
                          }`}
                        >
                          <div className="text-xl font-bold tracking-[-0.02em] text-slate-950">
                            Nein, überspringen
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            Dann rechnen wir nur mit vorsichtigen Standardwerten.
                          </p>
                        </button>
                      </div>

                      {data.electricityKnown ? (
                        <div className="surface-panel rounded-[1.85rem] px-5 py-5">
                          <label className="text-lg font-bold tracking-[-0.02em] text-slate-950">
                            Jahresverbrauch in kWh
                          </label>
                          <input
                            type="number"
                            min={500}
                            max={15000}
                            step={100}
                            value={data.electricityKwh}
                            onChange={(event) =>
                              update({
                                electricityKwh: Math.max(100, Number(event.target.value) || 100),
                              })
                            }
                            className="mt-4 h-14 w-full rounded-[1rem] border border-slate-200 bg-white px-4 text-lg text-slate-950 outline-none transition focus:border-slate-300"
                          />
                          <p className="mt-3 text-sm leading-6 text-slate-500">
                            Orientierung für {data.persons}{' '}
                            {data.persons === 1 ? 'Person' : 'Personen'}:{' '}
                            {estimateElectricity(data.persons).toLocaleString('de-DE')} kWh pro Jahr.
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <aside className="surface-panel rounded-[1.9rem] px-5 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    Warum wir das fragen
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{currentStep.help}</p>
                  <div className="mt-6 border-t border-slate-200/80 pt-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                    Schritt {safeStepIndex + 1} von {stepIds.length}
                  </div>
                </aside>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/70 px-7 py-5 md:px-8">
                {canGoBack ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-sm font-semibold text-slate-500 transition hover:text-slate-700"
                  >
                    Zurück
                  </button>
                ) : (
                  <span />
                )}

                {currentStepId === 'heating' ? (
                  <span className="text-sm text-slate-400">Bitte einen Heiztyp auswählen</span>
                ) : (
                  <button
                    type="button"
                    onClick={advance}
                    className="inline-flex min-h-12 items-center justify-center rounded-[1rem] bg-[#13263b] px-5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-[#17324d]"
                  >
                    {isLastStep ? 'Einordnung ansehen' : 'Weiter'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
