'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { subscribeToPriceWatcher } from '@/lib/priceWatcher';
import { trackEvent } from '@/lib/tracking';

const HOW_IT_WORKS = [
  {
    step: 'Orientierung',
    title: 'Schnell sehen, was für deinen Haushalt relevant ist',
    desc: 'Kein langes Recherchieren, sondern ein klarer Einstieg mit den Themen, die bei dir wirklich eine Rolle spielen.',
    image: '/Bilder/003-04-hf_20260318_143729_ff215124-c834-442a-bf7b-e43fde6c48cb.jpeg',
    href: '/spar-check',
  },
  {
    step: 'Kosten verstehen',
    title: 'Verbräuche und Tarife besser einordnen',
    desc: 'Wir helfen dir, Zahlen, Verträge und Sparpotenziale verständlich zu machen, bevor du überhaupt wechselst.',
    image: '/Bilder/db7befd2-8e1f-43d2-9da4-3b5fd0887adc-2026-04-15.png',
    href: '/preisrechner',
  },
  {
    step: 'Nächster Schritt',
    title: 'Danach gezielt vergleichen oder den Wechsel abgeben',
    desc: 'Wenn du willst, gehst du direkt weiter zu passenden Tarifen, Services oder einem vertiefenden Rechner.',
    image: '/Bilder/003-05-hf_20260318_144411_01626ceb-4850-4170-8d1b-3bbb288d2a54.jpeg',
    href: '/tarif-vergleich',
  },
];

const TOOL_CARDS = [
  {
    href: '/spar-check',
    eyebrow: 'Funnel',
    title: 'Spar-Check',
    text: 'Der schnellste Einstieg für Menschen, die ihre Energiekosten endlich verständlich sehen wollen.',
    tone: 'bg-[#edf6ef]',
    accent: 'text-primary',
    size: 'lg:col-span-2',
  },
  {
    href: '/tarif-vergleich',
    eyebrow: 'Vergleich',
    title: 'Tarif-Vergleich',
    text: 'Anbieter, Services und klare nächste Schritte passend zu deinem Heiztyp.',
    tone: 'bg-white',
    accent: 'text-slate-900',
    size: '',
  },
  {
    href: '/guenstig-tanken',
    eyebrow: 'Mobilität',
    title: 'Günstig tanken',
    text: 'Schnelle Orientierung bei Tankpreisen in deiner Nähe.',
    tone: 'bg-[#f7f5ef]',
    accent: 'text-slate-900',
    size: '',
  },
  {
    href: '/preisrechner',
    eyebrow: 'Analyse',
    title: 'Preisrechner',
    text: 'Für Haushalte, die tiefer einsteigen und einzelne Kostenblöcke verstehen wollen.',
    tone: 'bg-[#eef4f7]',
    accent: 'text-primary',
    size: '',
  },
];

const TRUST_POINTS = [
  {
    step: '01',
    title: 'Sofort verstehen, wo Sparpotenzial liegt',
    text: 'Wir übersetzen Tarife, Verbrauch und Angebote in klare nächste Schritte statt Fachsprache.',
    stat: '60 Sek.',
  },
  {
    step: '02',
    title: 'Selbst vergleichen oder den Wechsel abgeben',
    text: 'Du entscheidest selbst, ob du aktiv vergleichen möchtest oder den Wechsel lieber einem Service überlässt.',
    stat: '2 Wege',
  },
  {
    step: '03',
    title: 'Ohne Risiko und ohne Mehrkosten starten',
    text: 'Die Tools sind kostenlos nutzbar und Partnerprovisionen kennzeichnen wir transparent.',
    stat: '0 €',
  },
];

const TESTIMONIALS = [
  {
    topic: 'Spar-Check',
    topicHref: '/spar-check',
    headline: 'Zum ersten Mal war klar, wo bei uns überhaupt Sparpotenzial liegt.',
    body:
      'Wir wollten nicht wieder zehn Tabs mit Tarifen öffnen. Der Spar-Check hat unsere Situation in wenigen Antworten sortiert und uns dann erst gezeigt, welcher Weg für uns Sinn ergibt.',
    outcome: 'Weniger Bauchgefühl, mehr Richtung für den nächsten Schritt.',
    name: 'Julia & Daniel M.',
    detail: 'Einfamilienhaus, Niedersachsen',
  },
  {
    topic: 'Tarif-Vergleich',
    topicHref: '/tarif-vergleich',
    headline: 'Wir hatten endlich zwei klare Wege statt zwanzig offener Tabs.',
    body:
      'Für uns war wichtig, nicht sofort wieder im Vergleichsdschungel zu landen. Hier war klar: entweder selbst vergleichen oder den Wechsel abgeben. Das hat sofort Druck rausgenommen.',
    outcome: 'Mehr Übersicht und ein Wechsel, der sich endlich machbar angefühlt hat.',
    name: 'Sabine K.',
    detail: 'Reihenhaus, Nordrhein-Westfalen',
  },
  {
    topic: 'Preisrechner',
    topicHref: '/preisrechner',
    headline: 'Plötzlich waren Verbrauch, Tarife und Abschläge nicht mehr nur Fachsprache.',
    body:
      'Ich wollte erst verstehen, was wir eigentlich gerade zahlen. Der Preisrechner hat die Zahlen viel verständlicher gemacht als jede Jahresabrechnung, die ich bisher in der Hand hatte.',
    outcome: 'Mehr Wissen und dadurch deutlich mehr Sicherheit bei der Entscheidung.',
    name: 'Martin R.',
    detail: 'Wohnung, Baden-Württemberg',
  },
  {
    topic: 'Preis-Wächter',
    topicHref: '/#preis-waechter',
    headline: 'Wir mussten nicht sofort wechseln, aber wir hatten den Markt wieder im Blick.',
    body:
      'Der Preis-Wächter war genau richtig für uns, weil wir erst einmal abwarten wollten. So war das Thema wieder sortiert, ohne direkt einen Vertrag abschließen zu müssen.',
    outcome: 'Mehr Ruhe und trotzdem das Gefühl, nichts Wichtiges zu verpassen.',
    name: 'Claudia S.',
    detail: 'Doppelhaushälfte, Hessen',
  },
  {
    topic: 'Ratgeber',
    topicHref: '/ratgeber',
    headline: 'Aus einem diffusen Gefühl wurden konkrete nächste Schritte für unser Zuhause.',
    body:
      'Wir haben erst über die Artikel verstanden, welche Themen für uns wirklich relevant sind. Danach war klar, ob wir tiefer rechnen, vergleichen oder einfach erstmal abwarten sollten.',
    outcome: 'Weniger Informationschaos, mehr Geld und Energie für die wichtigen Dinge.',
    name: 'Andreas P.',
    detail: 'Familie mit zwei Kindern, Rheinland-Pfalz',
  },
  {
    topic: 'Spar-Check',
    topicHref: '/spar-check',
    headline: 'Das eingesparte Geld ist bei uns nicht abstrakt, sondern direkt in den Urlaub geflossen.',
    body:
      'Wir haben über die Seite zuerst Klarheit gewonnen und dann den passenden Anbieter gefunden. Dass dadurch am Ende wirklich mehr Geld in der Haushaltskasse geblieben ist, war der eigentliche Unterschied.',
    outcome: 'Mehr Luft im Monatsbudget und ein Thema weniger, das ständig aufgeschoben wird.',
    name: 'Nina & Tarek B.',
    detail: 'Eigentumswohnung, Hamburg',
  },
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function RingStat({
  value,
  label,
  colorClass,
}: {
  value: string;
  label: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-14 w-14">
        <svg viewBox="0 0 42 42" className="h-14 w-14 -rotate-90">
          <circle cx="21" cy="21" r="16" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200" />
          <circle
            cx="21"
            cy="21"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="76 100"
            className={colorClass}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[0.7rem] font-bold text-slate-950">{value}</div>
      </div>
      <p className="text-sm font-medium leading-5 text-slate-600">{label}</p>
    </div>
  );
}

export default function Home() {
  const [zip, setZip] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [zipError, setZipError] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [pauseTestimonials, setPauseTestimonials] = useState(false);
  const hasMountedTestimonials = useRef(false);
  const testimonialTrackRef = useRef<HTMLDivElement | null>(null);
  const testimonialCardRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (pauseTestimonials) return;

    const timer = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % TESTIMONIALS.length);
    }, 4400);

    return () => window.clearInterval(timer);
  }, [pauseTestimonials]);

  useEffect(() => {
    if (!hasMountedTestimonials.current) {
      hasMountedTestimonials.current = true;
      return;
    }

    const track = testimonialTrackRef.current;
    const target = testimonialCardRefs.current[activeTestimonial];
    if (!track || !target) return;

    track.scrollTo({
      left: target.offsetLeft - track.offsetLeft,
      behavior: 'smooth',
    });
  }, [activeTestimonial]);

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length === 5) {
      setZipError('');
      trackEvent('homepage_sparcheck_start', {
        zip,
        entry_point: 'hero_zip_form',
      });
      window.location.href = `/spar-check?zip=${zip}`;
      return;
    }

    trackEvent('homepage_zip_validation_error', {
      zip_length: zip.length,
      entry_point: 'hero_zip_form',
    });
    setZipError('Bitte gib zuerst eine gültige 5-stellige Postleitzahl ein.');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void (async () => {
      setNewsletterLoading(true);
      setNewsletterMessage('');

      const result = await subscribeToPriceWatcher({
        email,
        source: 'homepage_price_watcher',
      });

      setNewsletterLoading(false);
      setNewsletterMessage(result.message ?? '');

      if (result.ok) {
        setSent(true);
        setEmail('');
      }
    })();
  };

  return (
    <div className="min-h-screen bg-[#edf1f2] text-slate-950">
      <section className="relative overflow-hidden bg-[#dfe7ea] px-6 pb-18 pt-28 md:pb-24 md:pt-34">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(107,193,123,0.12),transparent_26%),radial-gradient(circle_at_78%_24%,rgba(23,50,77,0.12),transparent_24%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-slate-200 bg-[#f4f7f8] shadow-[0_45px_120px_-75px_rgba(15,23,42,0.45)]">
            <div className="absolute inset-0">
              <Image
                src="/Bilder/003-02-hf_20260318_142840_06df545c-63c3-4093-b95f-14b345c42b5b.jpeg"
                alt="Menschen vor einem Haus mit Solardach"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,247,248,0.96)_0%,rgba(244,247,248,0.9)_26%,rgba(244,247,248,0.58)_48%,rgba(244,247,248,0.08)_74%,rgba(244,247,248,0)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,50,77,0.04)_0%,rgba(23,50,77,0)_50%,rgba(23,50,77,0.08)_100%)]" />

            <div className="relative z-10 grid xl:grid-cols-[0.82fr_1.18fr]">
              <div className="px-7 py-10 md:px-10 md:py-12 xl:px-12 xl:py-14">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                Energie Sparschwein
              </p>
              <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[0.92] tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">
                In einer Minute
                <br />
                zum <span className="text-primary">Sparpfad</span>
                <br />
                für dein Zuhause.
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
                Kein Tarif-Dschungel. Kein Verkaufsdruck. Wir zeigen dir, welche Energie-Entscheidungen für deinen
                Haushalt jetzt wirklich relevant sind – und in welcher Reihenfolge.
              </p>

              <form onSubmit={handleZipSubmit} className="mt-10 max-w-2xl">
                <div className="flex flex-col gap-3 rounded-[2.3rem] border border-slate-300 bg-white p-3 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.35)] md:flex-row">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Deine Postleitzahl"
                    value={zip}
                    onChange={(e) => {
                      setZip(e.target.value.replace(/\D/g, '').slice(0, 5));
                      if (zipError) setZipError('');
                    }}
                    maxLength={5}
                    className="h-16 w-full rounded-[1.5rem] border border-slate-200 bg-white px-6 text-xl font-semibold text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-slate-300 md:w-[20rem]"
                  />
                  <button
                    type="submit"
                    className="h-16 rounded-[1.5rem] bg-primary px-12 text-lg font-semibold whitespace-nowrap text-slate-950 transition hover:bg-primary/90 active:scale-[0.98] md:min-w-[18rem]"
                  >
                    Spar-Check starten
                  </button>
                </div>
                {zipError && <p className="mt-3 text-sm font-medium text-[#24533a]">{zipError}</p>}
              </form>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                {['Kostenlos', 'Unverbindlich', '60 Sekunden'].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </span>
                ))}
              </div>
              </div>
              <div className="min-h-[20rem] xl:min-h-[42rem]" />
            </div>
          </div>

          <div className="mt-14 rounded-[2rem] border border-black/5 bg-white/85 px-6 py-5 shadow-[0_25px_70px_-60px_rgba(15,23,42,0.28)] backdrop-blur">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              <span>Für Eigentümer & Mieter</span>
              <span>Ohne Anmeldung</span>
              <span>Mit klaren nächsten Schritten</span>
              <span>Kostenlos nutzbar</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e8eef0] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">So funktioniert es</p>
            <h2 className="mt-5 text-4xl font-bold tracking-[-0.04em] text-slate-950">
              Drei Dinge, die dir der Spar-Check sofort abnimmt.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_25px_80px_-65px_rgba(15,23,42,0.35)]"
              >
                <div className="relative h-60">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-7">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary">{item.step}</p>
                  <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-950">{item.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">{item.desc}</p>
                  <Link
                    href={item.href}
                    className="mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 text-primary transition hover:bg-primary/20"
                    aria-label={`${item.title} öffnen`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f8f9] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Was du hier findest</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950">
                Alles an einem Ort, um Energiekosten besser zu verstehen und klüger zu handeln.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Vom schnellen Spar-Check über konkrete Vergleiche bis zu Ratgebern und Rechnern: Jede Seite hilft dir,
              eine bessere Entscheidung für deinen Haushalt zu treffen.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {TOOL_CARDS.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className={cn(
                  'group rounded-[2rem] border border-black/5 p-8 shadow-[0_25px_80px_-65px_rgba(15,23,42,0.32)] transition hover:-translate-y-1',
                  card.tone,
                  card.size,
                )}
              >
                <p className={cn('text-[0.72rem] font-semibold uppercase tracking-[0.24em]', card.accent)}>
                  {card.eyebrow}
                </p>
                <h3 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-slate-950">{card.title}</h3>
                <p className="mt-4 max-w-md text-base leading-7 text-slate-600">{card.text}</p>
                <p className="mt-8 text-sm font-semibold text-slate-950">Mehr sehen →</p>
              </Link>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-[2rem] border border-primary/15 bg-[#e9f4ec] shadow-[0_25px_80px_-65px_rgba(15,23,42,0.2)]">
            <div className="grid gap-6 px-8 py-8 lg:grid-cols-[0.8fr_1.2fr_auto] lg:items-center">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary">Dauerhaft</p>
                <h3 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950">Preis-Wächter</h3>
              </div>
              <p className="max-w-3xl text-base leading-7 text-slate-700">
                Wenn du nicht sofort wechseln willst – wir beobachten den Markt für dich und informieren dich, sobald
                sich ein Wechsel lohnt.
              </p>
              <Link
                href="#preis-waechter"
                className="inline-flex items-center justify-center rounded-[1.2rem] bg-primary px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-primary/90"
              >
                Preis-Wächter aktivieren →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e2eaec] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white shadow-[0_35px_90px_-65px_rgba(15,23,42,0.38)]">
            <div className="relative min-h-[27rem] overflow-hidden">
            <Image
              src="/Bilder/003-03-hf_20260318_143440_faa4514d-0b92-4641-bcdb-c372c91f6018.jpeg"
              alt="Familie in heller Küche mit Solardach im Hintergrund"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,242,234,0.06)_0%,rgba(247,242,234,0)_40%,rgba(247,242,234,0.16)_100%)]" />
            <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(247,242,234,0.04)_0%,rgba(247,242,234,0.02)_26%,rgba(247,242,234,0)_62%)]" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(255,255,255,0.96),rgba(255,255,255,0))]" />
            <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm backdrop-blur">
              Für Familien & Haushalte
            </div>
            <div className="absolute bottom-6 right-6 rounded-[1.5rem] bg-white/92 px-5 py-4 shadow-lg backdrop-blur">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary">Einfacher Einstieg</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">3 Fragen</p>
              <p className="mt-1 text-sm text-slate-600">bis zur ersten Einordnung</p>
            </div>
            </div>

            <div className="grid gap-4 border-t border-slate-100 bg-white px-6 py-5 md:grid-cols-3">
              <RingStat value="3" label="Fragen bis zur ersten Einschätzung" colorClass="text-primary" />
              <RingStat value="60s" label="für den schnellen Einstieg" colorClass="text-[#17324d]" />
              <RingStat value="0€" label="kostenlos nutzbar" colorClass="text-primary" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Vertrauen</p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950">
              Alles, was du brauchst, um beim Wechsel schneller Klarheit zu bekommen.
            </h2>
            <div className="mt-8 divide-y divide-slate-300/80 border-y border-slate-300/80">
              {TRUST_POINTS.map((point) => (
                <div key={point.title} className="grid gap-3 py-5 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-5">
                  <div className="pt-1">
                    <span className="inline-flex min-w-11 justify-center rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-[0.18em] text-slate-400 shadow-sm">
                      {point.step}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-950">{point.title}</h3>
                    </div>
                    <p className="mt-2 max-w-xl text-base leading-7 text-slate-600">{point.text}</p>
                  </div>
                  <div className="shrink-0 text-left md:text-right">
                    <p className="text-2xl font-bold tracking-tight text-primary">{point.stat}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="preis-waechter" className="relative overflow-hidden bg-[#13263b] px-6 py-24 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="relative h-full w-full">
            <Image
              src="/Bilder/f9208ace-c5b3-45c1-b083-2c6dc62058f2-2026-04-15.png"
              alt="Person schaut auf das Smartphone als Abschnittshintergrund"
              fill
              className="object-cover object-[20%_center]"
            />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(19,38,59,0.82)_0%,rgba(19,38,59,0.72)_30%,rgba(19,38,59,0.64)_58%,rgba(19,38,59,0.8)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(19,38,59,0.08)_0%,rgba(19,38,59,0.18)_100%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="relative mx-auto max-w-6xl rounded-[2.5rem] border border-white/10 bg-white/5 px-6 py-12 shadow-[0_35px_120px_-70px_rgba(0,0,0,0.7)] backdrop-blur-[2px] md:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Preis-Wächter</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em]">
                Für alle, die noch warten, aber den richtigen Moment nicht verpassen wollen.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-slate-300">
                Ein ruhiger, einfacher Newsletter-Einstieg statt sofortigem Abschlussdruck.
              </p>
            </div>

            <div>
              {sent ? (
                <div className="rounded-[2rem] border border-primary/30 bg-primary/10 px-8 py-7 text-[#d9f3df]">
                  <p className="text-xl font-semibold">Angemeldet! ✓</p>
                  <p className="mt-2 text-sm text-[#d9f3df]/80">
                    {newsletterMessage || 'Wir melden uns, sobald Preise wieder attraktiver werden.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="rounded-[2rem] bg-white p-3 shadow-[0_25px_80px_-60px_rgba(0,0,0,0.35)]">
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      type="email"
                      placeholder="deine@email.de"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 w-full rounded-[1.25rem] border border-slate-200 bg-white px-6 text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-slate-300"
                    />
                    <button
                      type="submit"
                      disabled={newsletterLoading}
                      className="h-14 rounded-[1.25rem] bg-primary px-8 font-semibold whitespace-nowrap text-slate-950 transition hover:bg-primary/90 md:min-w-[12rem]"
                    >
                      {newsletterLoading ? 'Wird aktiviert ...' : 'Jetzt anmelden'}
                    </button>
                  </div>
                  {newsletterMessage && (
                    <p className="px-2 pt-3 text-sm font-medium text-slate-600">{newsletterMessage}</p>
                  )}
                </form>
              )}

              <p className="mt-4 text-sm text-slate-400">Kostenlos. Kein Spam. Jederzeit abmeldbar.</p>
              <p className="mt-2 text-xs text-slate-500">
                Mit der Anmeldung stimmst du unserer{' '}
                <Link href="/datenschutz" className="underline underline-offset-2 transition hover:text-slate-300">
                  Datenschutzerklärung
                </Link>{' '}
                zu.
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#dde6ea] px-6 py-24 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(107,193,123,0.16),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(23,50,77,0.08),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(221,230,234,0)_100%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Stimmen aus dem Alltag</p>
              <h2 className="mt-5 text-4xl font-bold tracking-[-0.04em] text-slate-950">
                Was Menschen sagen, nachdem aus Energiechaos endlich ein klarer nächster Schritt geworden ist.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                So fühlt es sich an, wenn Haushalte erst Klarheit gewinnen und dann mit einem guten Gefühl handeln.
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveTestimonial((current) => (current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="absolute left-0 top-1/2 z-20 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300/80 bg-white/90 text-slate-950 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)] transition hover:bg-white lg:inline-flex"
              aria-label="Vorheriges Testimonial"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <div
              ref={testimonialTrackRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onMouseEnter={() => setPauseTestimonials(true)}
              onMouseLeave={() => setPauseTestimonials(false)}
            >
              {TESTIMONIALS.map((item, index) => (
                <article
                  key={item.name}
                  ref={(node) => {
                    testimonialCardRefs.current[index] = node;
                  }}
                  className="group min-w-[19.5rem] snap-start rounded-[2rem] border border-white/55 bg-[#152235]/78 p-7 shadow-[0_35px_90px_-65px_rgba(0,0,0,0.55)] backdrop-blur-md transition duration-300 hover:scale-[1.025] hover:border-white/75 md:min-w-[28rem] xl:min-w-[32rem]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-1 text-primary">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <svg
                          key={starIndex}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-[1.05rem] w-[1.05rem]"
                          aria-hidden="true"
                        >
                          <path d="m12 3.7 2.5 5.1 5.7.8-4.1 4 1 5.7L12 16.6 6.9 19.3l1-5.7-4.1-4 5.7-.8L12 3.7Z" />
                        </svg>
                      ))}
                    </div>

                    <Link
                      href={item.topicHref}
                      className="shrink-0 text-sm font-semibold text-slate-300 transition hover:text-white"
                    >
                      {item.topic} ↗
                    </Link>
                  </div>

                  <p className="mt-6 max-w-[18ch] text-[2rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white md:text-[2.15rem]">
                    {item.headline}
                  </p>

                  <div className="mt-6 border-t border-white/10 pt-6">
                    <p className="text-base leading-7 text-slate-300">{item.body}</p>
                    <p className="mt-5 text-sm font-semibold text-primary">{item.outcome}</p>
                  </div>

                  <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/8 text-sm font-semibold tracking-[0.12em] text-white">
                      {item.name
                        .split(' ')
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveTestimonial((current) => (current + 1) % TESTIMONIALS.length)}
              className="absolute right-0 top-1/2 z-20 hidden h-12 w-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300/80 bg-white/90 text-slate-950 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)] transition hover:bg-white lg:inline-flex"
              aria-label="Nächstes Testimonial"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-3">
              {TESTIMONIALS.map((item, index) => (
                <button
                  key={`${item.name}-dot`}
                  type="button"
                  onClick={() => setActiveTestimonial(index)}
                  onMouseEnter={() => setPauseTestimonials(true)}
                  onMouseLeave={() => setPauseTestimonials(false)}
                  className={cn(
                    'h-4 rounded-full transition-all',
                    index === activeTestimonial ? 'w-16 bg-primary' : 'w-4 bg-slate-400/60 hover:bg-slate-500/80',
                  )}
                  aria-label={`Testimonial ${index + 1} anzeigen`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
