'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { subscribeToPriceWatcher } from '@/lib/priceWatcher';
import { type HeatingType } from '@/lib/affiliateRecommendations';
import {
  calculateCosts,
  estimateElectricity,
  formatSavingRange,
  getSummaryLine,
  getInitialSparCheckData,
  getPotentialLevel,
  getSparCheckRecommendation,
  getSavingRange,
  type GasUsage,
  type SparCheckData,
} from '@/lib/sparCheck';
import { trackEvent } from '@/lib/tracking';

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
  const [data, setData]   = useState<SparCheckData>(getInitialSparCheckData);
  const [step, setStep]   = useState(() => (getInitialSparCheckData().zip ? 1 : 0));
  const [watcherEmail, setWatcherEmail] = useState('');
  const [watcherLoading, setWatcherLoading] = useState(false);
  const [watcherMessage, setWatcherMessage] = useState('');
  const [watcherSent, setWatcherSent] = useState(false);
  const trackedStepRef = useRef<string | null>(null);

  // In localStorage speichern
  useEffect(() => {
    localStorage.setItem('sparCheckData', JSON.stringify(data));
  }, [data]);

  const update = (partial: Partial<SparCheckData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  // Aktive Schritte neu berechnen wenn sich Heiztyp ändert
  const activeStepIds = getActiveStepIds(data);
  const safeStep = Math.min(step, activeStepIds.length - 1);
  const currentStepId  = activeStepIds[safeStep];
  const isFirst        = safeStep === 0;
  const isLast         = safeStep === activeStepIds.length - 1;
  const isResultStep   = currentStepId === 'result';
  // Nicht-Inhalt-Schritte: welcome und result (kein "Weiter"-Button nötig)
  const showNext       = !isLast && currentStepId !== 'welcome';

  const goNext = () => {
    if (safeStep < activeStepIds.length - 1) setStep(safeStep + 1);
  };
  const goPrev = () => {
    if (safeStep > 0) setStep(safeStep - 1);
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
  const totalSaving  = costs.reduce((s, c) => s + (c.current - c.optimal), 0);
  const savingRangeText = formatSavingRange(getSavingRange(totalSaving));
  const potentialLevel = getPotentialLevel(totalSaving);
  const recommendation = useMemo(() => getSparCheckRecommendation(data), [data]);
  const advisoryContent = useMemo(() => {
    switch (data.heating) {
      case 'oil':
        return {
          hero: 'Bei dir liegt der kurzfristige Hebel eher im Einkauf als im Komplettumbau.',
          intro:
            'Langfristig kann Technik relevant werden. Kurzfristig zählt vor allem, wie und wann du kaufst.',
          diagnosisTitle: 'Unsere Einschätzung für deinen Fall',
          diagnosisLead: 'Bei dir lohnt sich wahrscheinlich zuerst ein gezielter Preisvergleich für den nächsten Heizölkauf.',
          diagnosisPoints: [
            'Heizöl ist stark preisabhängig. Schon der richtige Kaufzeitpunkt und ein sauberer Vergleich können einen spürbaren Unterschied machen.',
            'Ein Heizungswechsel ist eine größere Investition und meistens nicht der erste sinnvolle Schritt.',
          ],
          nextStepTitle: 'Heizöl-Preise gezielt vergleichen',
          nextStepText:
            'Das ist für dich gerade der direkteste Hebel. Bevor du über neue Technik nachdenkst, solltest du zuerst den aktuellen Markt für deinen nächsten Kauf sauber prüfen.',
          alternativeTitle: 'Oder wenn du lieber alle Wege nebeneinander sehen willst',
          alternativeText:
            'Dann kannst du dir auch die komplette Übersicht mit Preiswegen, Services und langfristigen Wechseloptionen ansehen.',
        };
      case 'pellets':
        return {
          hero: 'Du bist bereits in einer vergleichsweise guten Ausgangslage.',
          intro:
            'Der größte zusätzliche Hebel liegt bei dir wahrscheinlich nicht im Heizsystem, sondern eher im restlichen Energie-Setup.',
          diagnosisTitle: 'Unsere Einschätzung für deinen Fall',
          diagnosisLead: 'Bei dir lohnt sich wahrscheinlich zuerst ein Blick auf den Stromtarif.',
          diagnosisPoints: [
            'Wer bereits mit Pellets heizt, hat den größten Systemwechsel oft schon hinter sich.',
            'Der verbleibende Sparhebel liegt häufig eher beim Haushaltsstrom als bei der Heizung selbst.',
          ],
          nextStepTitle: 'Stromtarif als nächsten Hebel prüfen',
          nextStepText:
            'Du musst nicht alles neu denken. Für deinen Haushalt ist wahrscheinlich eher ein gezielter Stromvergleich sinnvoll als eine neue große Heizentscheidung.',
          alternativeTitle: 'Oder wenn du lieber alles selbst einordnen willst',
          alternativeText:
            'Dann kannst du dir auch die komplette Übersicht mit allen Anbietern, Services und weiteren Sparwegen ansehen.',
        };
      case 'heatpump':
        return {
          hero: 'Du heizt bereits effizient. Das ist eine starke Ausgangslage.',
          intro:
            'Der wahrscheinlich wichtigste Hebel liegt bei dir jetzt nicht mehr im System, sondern beim passenden Stromtarif.',
          diagnosisTitle: 'Unsere Einschätzung für deinen Fall',
          diagnosisLead: 'Bei dir lohnt sich wahrscheinlich zuerst ein Check für Wärmepumpenstrom oder passende Stromtarife.',
          diagnosisPoints: [
            'Viele Haushalte mit Wärmepumpe zahlen weiter normale Haushaltsstrompreise, obwohl ihr Profil besser zu speziellen Tarifen passt.',
            'Bevor du über weitere Technik oder Optimierungen nachdenkst, ist der Tarif meist der naheliegendere Hebel.',
          ],
          nextStepTitle: 'Wärmepumpenstrom gezielt prüfen',
          nextStepText:
            'Das ist für dich gerade der sinnvollste nächste Schritt. Die Technik steht schon – jetzt geht es darum, ob sie auch tariflich zu deinem Vorteil läuft.',
          alternativeTitle: 'Oder wenn du lieber die ganze Übersicht sehen willst',
          alternativeText:
            'Dann kannst du direkt in die vollständige Übersicht mit Anbietern, Services und weiteren Optionen gehen.',
        };
      case 'gas':
      case 'unknown':
      default:
        return {
          hero: 'Für deinen Haushalt gibt es wahrscheinlich einen relevanten Sparhebel.',
          intro:
            'Der naheliegendste Hebel liegt aktuell eher im Tarif als in einer technischen Modernisierung.',
          diagnosisTitle: 'Unsere Einschätzung für deinen Fall',
          diagnosisLead: 'Bei dir lohnt sich wahrscheinlich zuerst ein Tarif- und Vertragscheck.',
          diagnosisPoints: [
            'Haushalte mit ähnlichem Profil zahlen in ungünstigen Tarifen oft deutlich mehr als nötig.',
            'Ein Heizungsumbau kann später sinnvoll sein – aber zuerst ist der einfachere Hebel der saubere Blick auf deinen aktuellen Tarif.',
          ],
          nextStepTitle: 'Gas-Tarife und Wechseloptionen prüfen',
          nextStepText:
            'Das ist für dich gerade der einfachste und wirksamste Hebel. Du musst nichts umbauen und keine große Investition treffen – nur prüfen, ob du aktuell unnötig zu viel zahlst.',
          alternativeTitle: 'Oder wenn du lieber alles selbst prüfen willst',
          alternativeText:
            'Du kannst dir auch die komplette Übersicht mit allen Anbietern, Services und Wechselwegen ansehen.',
        };
    }
  }, [data.heating]);

  const handleWatcherSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void (async () => {
      setWatcherLoading(true);
      setWatcherMessage('');

      const result = await subscribeToPriceWatcher({
        email: watcherEmail,
        source: 'spar_check_result_price_watcher',
      });

      setWatcherLoading(false);
      setWatcherMessage(result.message ?? '');

      if (result.ok) {
        setWatcherSent(true);
        setWatcherEmail('');
      }
    })();
  };

  useEffect(() => {
    const trackingKey = `${currentStepId}-${safeStep}-${data.heating}-${data.zip ? 'zip' : 'nozip'}`;
    if (trackedStepRef.current === trackingKey) return;
    trackedStepRef.current = trackingKey;

    trackEvent(currentStepId === 'result' ? 'spar_check_result_view' : 'spar_check_step_view', {
      step: currentStepId,
      step_index: safeStep,
      heating: data.heating,
      zip_present: !!data.zip,
      electricity_known: data.electricityKnown,
    });
  }, [currentStepId, safeStep, data.heating, data.zip, data.electricityKnown]);

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
            onClick={() => {
              trackEvent('spar_check_started', {
                entry_point: data.zip ? 'homepage_with_zip' : 'direct_welcome',
                zip_present: !!data.zip,
              });
              setStep(1);
            }}
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
            <div className="flex items-center justify-between gap-4">
              <label className="block font-semibold text-gray-800">
                Wohnfläche (m²)
              </label>
              <div className="rounded-full bg-primary/10 px-4 py-2 text-base font-bold text-primary">
                {data.area} m²
              </div>
            </div>
            <input
              type="range"
              min={20}
              max={250}
              step={5}
              value={data.area}
              onChange={(e) => update({ area: Number(e.target.value) })}
              className="h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>20 m²</span>
              <span>100 m²</span>
              <span>250 m²</span>
            </div>
            <p className="text-xs text-gray-400">Nur Wohnfläche ohne Keller oder Garage. Mit dem Slider kannst du den Wert schnell anpassen.</p>
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
      title: 'Deine persönliche Einordnung',
      description: 'Alles auf einer Seite: Markt-Einordnung, sinnvoller nächster Schritt und Wiederkehr ohne zusätzlichen Klick.',
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
        <div className="space-y-8">
          <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div className="relative overflow-hidden rounded-[2.25rem] bg-slate-950 text-white">
              <div className="absolute inset-0">
                <Image
                  src="/Bilder/003-05-hf_20260318_144411_01626ceb-4850-4170-8d1b-3bbb288d2a54.jpeg"
                  alt="Familie in heller Wohnsituation"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.14)_0%,rgba(15,23,42,0.78)_66%,rgba(15,23,42,0.95)_100%)]" />
              <div className="relative flex min-h-[34rem] flex-col justify-end px-8 py-8 md:px-10">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/90">Deine persönliche Einordnung</p>
                <p className="mt-5 max-w-xl text-4xl font-bold tracking-[-0.04em] text-balance">{advisoryContent.hero}</p>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-200">{advisoryContent.intro}</p>
                <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">Profil</p>
                    <p className="mt-2 text-lg font-semibold text-white">{getSummaryLine(data)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">Marktspanne</p>
                    <p className="mt-2 text-lg font-semibold text-primary">{savingRangeText}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 rounded-[2.25rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{advisoryContent.diagnosisTitle}</p>
                <h3 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-slate-950">
                  {advisoryContent.diagnosisLead}
                </h3>
                <div className="mt-6 space-y-4">
                  {advisoryContent.diagnosisPoints.map((point) => (
                    <div key={point} className="flex gap-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                      <p className="text-base leading-7 text-slate-600">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.6rem] bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Einordnung</p>
                <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-slate-950">{potentialLevel}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Das ist bewusst eine Marktspanne für Haushalte mit ähnlichem Profil, nicht dein exakter Vertrag.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2.25rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Unser empfohlener nächster Schritt</p>
              <h3 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950">
                {advisoryContent.nextStepTitle}
              </h3>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{advisoryContent.nextStepText}</p>
              <div className="mt-8 border-t border-slate-200 pt-6">
                <Link
                  href={recommendation.nextStepHref}
                  onClick={() =>
                    trackEvent('spar_check_tarifvergleich_click', {
                      heating: data.heating,
                      zip_present: !!data.zip,
                      source: 'recommended_next_step',
                    })
                  }
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-800"
                >
                  Diesen Schritt jetzt machen →
                </Link>
              </div>
            </div>

            <div className="rounded-[2.25rem] border border-slate-200 bg-[#f8f8f5] p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Alternative</p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                {advisoryContent.alternativeTitle}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{advisoryContent.alternativeText}</p>
              <Link
                href="/tarif-vergleich#vollansicht"
                onClick={() =>
                  trackEvent('spar_check_tarifvergleich_click', {
                    heating: data.heating,
                    zip_present: !!data.zip,
                    source: 'full_comparison',
                  })
                }
                className="mt-8 inline-flex items-center justify-center rounded-2xl border border-slate-300 px-5 py-3.5 text-base font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-white"
              >
                Zur kompletten Übersicht →
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-primary/15 bg-[#e9f4ec] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Wenn du noch nicht wechseln willst</p>
            <h3 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-950">
              Dann musst du das Thema trotzdem nicht wieder aus dem Blick verlieren.
            </h3>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              Unser Preis-Wächter meldet sich, wenn sich ein Wechsel eher lohnt oder dein nächster Check sinnvoll wird.
            </p>
            <div className="mt-6 grid gap-4 text-sm text-slate-700 md:grid-cols-3">
              <div className="border-l border-primary/25 pl-4">
                <p className="font-semibold text-slate-950">Wenn Preise in deiner Region fallen</p>
              </div>
              <div className="border-l border-primary/25 pl-4">
                <p className="font-semibold text-slate-950">Wenn dein aktueller Tarif ausläuft</p>
              </div>
              <div className="border-l border-primary/25 pl-4">
                <p className="font-semibold text-slate-950">Einmal pro Jahr für deinen nächsten Tarif-Check</p>
              </div>
            </div>

            {watcherSent ? (
              <div className="mt-6 rounded-[1.6rem] border border-primary/25 bg-white px-6 py-5">
                <p className="text-xl font-bold text-slate-950">Preis-Wächter aktiviert ✓</p>
                <p className="mt-2 text-sm text-slate-600">
                  {watcherMessage || 'Wir informieren dich, sobald sich ein sinnvoller Wechsel für deinen Haushalt lohnt.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleWatcherSubmit} className="mt-6 rounded-[1.6rem] bg-white p-3 shadow-[0_25px_80px_-65px_rgba(15,23,42,0.2)]">
                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    type="email"
                    placeholder="deine@email.de"
                    value={watcherEmail}
                    onChange={(event) => setWatcherEmail(event.target.value)}
                    className="h-14 w-full rounded-[1.1rem] border border-slate-200 px-5 text-slate-950 outline-none transition focus:border-slate-300"
                  />
                  <button
                    type="submit"
                    disabled={watcherLoading}
                    className="inline-flex h-14 items-center justify-center rounded-[1.1rem] bg-primary px-6 font-semibold text-slate-950 transition hover:bg-primary/90 md:min-w-[16rem]"
                  >
                    {watcherLoading ? 'Wird aktiviert ...' : 'Preis-Wächter aktivieren'}
                  </button>
                </div>
                {watcherMessage && <p className="px-2 pt-3 text-sm font-medium text-slate-600">{watcherMessage}</p>}
              </form>
            )}
          </section>

          <section className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="relative min-h-[22rem]">
                <Image
                  src="/Bilder/003-03-hf_20260318_143440_faa4514d-0b92-4641-bcdb-c372c91f6018.jpeg"
                  alt="Familie im Alltag zuhause"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-8 md:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Warum wir dir das so empfehlen</p>
                <div className="mt-6 space-y-5 text-base leading-7 text-slate-600">
                  <p>Unsere Einordnung basiert auf Marktpreisen, Vergleichsdaten und typischen Haushaltsprofilen.</p>
                  <p>
                    Wir zeigen bewusst Richtungen und Spannen statt scheinexakter Versprechen, die ohne deinen Vertrag
                    unseriös wären.
                  </p>
                  <p>
                    Wir verdienen nur, wenn du über unsere Links wechselst. Empfohlen wird trotzdem zuerst das, was für
                    deinen Haushalt sinnvoll wirkt.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2.25rem] border border-slate-200 bg-[#f8f8f5] p-8">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Eingaben anpassen</p>
                <h3 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-slate-950">
                  Wenn etwas nicht stimmt, rechnen wir die Einordnung neu.
                </h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                  Heiztyp, Fläche oder Stromverbrauch ändern sich schnell. Passe deine Angaben an und wir bewerten die
                  Lage sofort neu.
                </p>
              </div>
              <div className="rounded-[1.8rem] bg-white p-4 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.28)]">
                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="rounded-[1.3rem] border border-dashed border-slate-200 px-5 py-4 text-sm text-slate-500">
                    Zurück in den Check und einzelne Werte korrigieren.
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-800"
                  >
                    Angaben anpassen
                  </button>
                </div>
              </div>
            </div>
          </section>
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
      {isResultStep ? (
        <section className="relative overflow-hidden bg-slate-900 px-6 pb-18 pt-28 text-white">
          <div className="absolute inset-0">
            <Image
              src="/Bilder/003-03-hf_20260318_143440_faa4514d-0b92-4641-bcdb-c372c91f6018.jpeg"
              alt="Emotionale Alltagsszene im Zuhause"
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.9)_0%,rgba(15,23,42,0.84)_38%,rgba(15,23,42,0.58)_70%,rgba(15,23,42,0.8)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.2)_100%)]" />
          <div className="relative mx-auto max-w-6xl">
            <div className="max-w-3xl space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Dein persönlicher Energie-Spar-Check</p>
              <h1 className="text-5xl font-bold leading-[0.94] tracking-tight md:text-6xl">
                Deine persönliche Einordnung
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-200">
                Für {getSummaryLine(data)} zeigen wir dir jetzt den sinnvollsten nächsten Schritt, die volle Übersicht
                und einen Weg, das Thema nicht wieder aus dem Blick zu verlieren.
              </p>
              <div className="inline-flex flex-wrap gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-slate-100 backdrop-blur">
                <span>{potentialLevel}</span>
                <span className="text-white/40">•</span>
                <span>typisch {savingRangeText}</span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative flex min-h-[60vh] flex-col items-center justify-center bg-linear-to-b from-slate-900 to-slate-800 px-6 pt-16 text-center text-white">
          <div className="max-w-2xl mx-auto space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Kosten-Dolmetscher</p>
            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">Energie-Spar-Check</h1>
            <p className="mx-auto max-w-lg text-lg text-slate-300 leading-relaxed">
              Drei Fragen. Konkrete Zahlen. Kein Schnörkel.
            </p>
          </div>
        </section>
      )}

      {/* Wizard */}
      <section className="py-20 px-6">
        <div className={`${isResultStep ? 'max-w-6xl' : 'max-w-3xl'} mx-auto`}>

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
          {!isResultStep && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">{current.title}</h2>
              <p className="mt-2 text-gray-600">{current.description}</p>
            </div>
          )}

          {/* Schritt-Inhalt */}
          <div className={isResultStep ? '' : 'rounded-4xl bg-white p-8 shadow-2xl'}>
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
