import Image from 'next/image';
import Link from 'next/link';

type HomeIconKind = 'compass' | 'path' | 'bell' | 'spark' | 'watch' | 'graph';

const TRUST_SIGNALS = [
  '60 Sekunden Einordnung',
  'keine Tarifliste zuerst',
  'klarer nächster Schritt',
];

const PAIN_POINTS = [
  {
    title: 'Zu viele Wege auf einmal',
    text: 'Du siehst Vergleichsportale, Boni, Vertragsfristen und Tarifrechner und weißt am Ende trotzdem nicht, womit du anfangen sollst.',
  },
  {
    title: 'Angst, etwas Falsches zu wählen',
    text: 'Du willst nicht in den falschen Tarif springen, nur weil irgendwo ein Preis gut aussieht, obwohl für deinen Haushalt vielleicht gerade etwas anderes wichtiger ist.',
  },
  {
    title: 'Das Thema bleibt liegen',
    text: 'Nicht weil es dir egal ist, sondern weil der Einstieg zu anstrengend wirkt und du ohne klare Richtung lieber gar nichts machst.',
  },
];

const CHECK_OUTCOMES: { icon: HomeIconKind; title: string; text: string }[] = [
  {
    icon: 'spark',
    title: 'Vergleichen',
    text: 'wenn ein Tarifcheck dir jetzt tatsächlich Geld oder bessere Konditionen bringen kann.',
  },
  {
    icon: 'watch',
    title: 'Beobachten',
    text: 'wenn du gerade nicht wechseln willst, aber den richtigen Moment auch nicht verpassen möchtest.',
  },
  {
    icon: 'graph',
    title: 'Verstehen',
    text: 'wenn du erst verstehen willst, wo in deinem Haushalt überhaupt Einsparpotenzial steckt.',
  },
];

const HOW_IT_WORKS: { icon: HomeIconKind; title: string; text: string }[] = [
  {
    icon: 'compass',
    title: 'Haushalt kurz einordnen',
    text: 'Du beantwortest nur ein paar Fragen zu deinem Haushalt. Nicht mehr, als nötig ist, um eine sinnvolle Richtung zu erkennen.',
  },
  {
    icon: 'path',
    title: 'Empfehlung in normaler Sprache',
    text: 'Du bekommst keine Zahlenwand, sondern eine verständliche Einordnung: Was ist jetzt sinnvoll und warum gerade das.',
  },
  {
    icon: 'bell',
    title: 'Mit Klarheit weitergehen',
    text: 'Danach gehst du mit Klarheit weiter: in den Vergleich, in den Preis-Wächter oder in die Vertiefung.',
  },
];

const QUICK_ENTRY_CARDS = [
  {
    image: '/Bilder/003-04-hf_20260318_143729_ff215124-c834-442a-bf7b-e43fde6c48cb.jpeg',
    eyebrow: 'Orientierung',
    title: 'Schnell sehen, was für deinen Haushalt relevant ist',
    text: 'Kein langes Recherchieren, sondern ein klarer Einstieg mit den Themen, die bei dir wirklich eine Rolle spielen.',
    href: '/spar-check',
  },
  {
    image: '/Bilder/003-08-hf_20260318_144621_261b87da-e44d-4bf0-a414-b67dc6b6c67d.jpeg',
    eyebrow: 'Kosten verstehen',
    title: 'Verbräuche und Tarife besser einordnen',
    text: 'Du verstehst Zahlen, Verträge und Sparpotenziale, bevor du überhaupt wechselst.',
    href: '/preisrechner',
  },
  {
    image: '/Bilder/003-07-hf_20260318_144545_67dff7de-df1b-4a2e-8e03-c9287c91c6ab.jpeg',
    eyebrow: 'Nächster Schritt',
    title: 'Danach gezielt vergleichen oder beobachten',
    text: 'Wenn du willst, gehst du direkt weiter zu passenden Tarifen, Services oder in den Preis-Wächter.',
    href: '/preis-waechter',
  },
];

const TRUST_BLOCKS = [
  {
    title: 'Du musst nicht sofort auf einen Tarif klicken.',
    text: 'Wenn du erst Klarheit brauchst, bekommst du sie hier, bevor du irgendeine Anbieterentscheidung treffen musst.',
  },
  {
    title: 'Du darfst auch feststellen, dass gerade Beobachten sinnvoller ist.',
    text: 'Nicht jeder Haushalt sollte sofort handeln. Manchmal ist der beste Schritt, Preise im Blick zu behalten und erst später zu entscheiden.',
  },
  {
    title: 'Du bekommst eine nachvollziehbare Empfehlung statt Verkaufsdruck.',
    text: 'Das Ziel ist nicht, dich möglichst schnell irgendwohin zu schieben, sondern dir einen Schritt zu zeigen, der für deinen Haushalt plausibel wirkt.',
  },
];

const POSSIBILITY_OVERVIEW = [
  {
    eyebrow: 'Funnel',
    title: 'Spar-Check',
    text: 'Der schnellste Einstieg für Menschen, die ihre Energiekosten endlich verständlich einordnen wollen.',
    href: '/spar-check',
    tone: 'soft-green',
  },
  {
    eyebrow: 'Vergleich',
    title: 'Tarif-Vergleich',
    text: 'Anbieter, Services und klare nächste Schritte passend zu deiner Situation.',
    href: '/tarif-vergleich',
    tone: 'plain',
  },
  {
    eyebrow: 'Analyse',
    title: 'Preisrechner',
    text: 'Für Haushalte, die tiefer einsteigen und einzelne Kostenblöcke verstehen wollen.',
    href: '/preisrechner',
    tone: 'soft-blue',
  },
  {
    eyebrow: 'Dauerhaft',
    title: 'Preis-Wächter',
    text: 'Wenn du nicht sofort wechseln willst, beobachten wir den Markt für dich und informieren dich, sobald ein Wechsel sinnvoll wird.',
    href: '/preis-waechter',
    tone: 'soft-green-wide',
  },
];

function HomeIcon({ kind }: { kind: HomeIconKind }) {
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'h-5 w-5',
  };

  switch (kind) {
    case 'compass':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m14.8 9.2-4.3 1.7-1.3 4 4.2-1.6 1.4-4.1Z" />
        </svg>
      );
    case 'path':
      return (
        <svg {...props}>
          <path d="M5 18c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4" />
          <path d="M5 6c2.5 0 2.5 4 5 4s2.5-4 5-4 2.5 4 5 4" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...props}>
          <path d="M8 17h8l-1-2.5V11a4 4 0 1 0-8 0v3.5L8 17Z" />
          <path d="M10.5 18.5a1.8 1.8 0 0 0 3 0" />
        </svg>
      );
    case 'spark':
      return (
        <svg {...props}>
          <path d="M13 2 7 12h4l-1 10 7-11h-4V2Z" />
        </svg>
      );
    case 'watch':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="6.5" />
          <path d="M12 9v3.5l2 1.2" />
          <path d="M9 2h6M9 22h6" />
        </svg>
      );
    case 'graph':
      return (
        <svg {...props}>
          <path d="M4 19h16" />
          <path d="M7 15V9" />
          <path d="M12 15V6" />
          <path d="M17 15v-4" />
        </svg>
      );
  }
}

export default function Home() {
  return (
    <main className="bg-background text-slate-950">
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-[#12253a] text-white">
        <div className="absolute inset-0">
          <Image
            src="/Bilder/003-02-hf_20260318_142840_06df545c-63c3-4093-b95f-14b345c42b5b.jpeg"
            alt="Familie vor dem eigenen Zuhause"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,37,58,0.95)_0%,rgba(18,37,58,0.9)_28%,rgba(18,37,58,0.5)_58%,rgba(18,37,58,0.12)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,37,58,0.18)_0%,rgba(18,37,58,0.08)_38%,rgba(18,37,58,0.44)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(121,208,138,0.24)_0%,transparent_28%)]" />

        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl items-end px-6 pb-12 pt-28 md:pb-16 md:pt-32">
          <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,45rem)_minmax(16rem,20rem)] lg:items-end">
            <div className="max-w-4xl rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/10 backdrop-blur-sm md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                Kosten-Dolmetscher für Energie
              </p>
              <h1 className="mt-5 max-w-3xl text-balance text-5xl font-bold leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-[4.8rem]">
                In einer Minute
                <br />
                zum Sparpfad
                <br />
                für dein Zuhause.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
                Wenn du bei Strom, Heizung oder Verträgen festhängst, zeigt dir der Spar-Check
                zuerst die richtige Richtung: sofort vergleichen, später beobachten oder erst
                einmal verstehen, wo dein Hebel liegt.
              </p>

              <div className="mt-9 max-w-[42rem] rounded-[1.75rem] border border-white/12 bg-white/12 p-3 backdrop-blur-sm">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Deine Postleitzahl"
                    className="h-14 flex-1 rounded-full border border-white/15 bg-white px-5 text-base font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <Link
                    href="/spar-check"
                    className="inline-flex min-h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
                  >
                    Spar-Check starten
                  </Link>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                {TRUST_SIGNALS.map((item) => (
                  <span key={item} className="flex items-center gap-2 whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden rounded-[1.9rem] border border-white/10 bg-white/8 p-5 text-white shadow-xl shadow-black/10 backdrop-blur-sm lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                Du gehst nicht mehr blind weiter:
              </p>
              <div className="mt-5 space-y-4">
                {CHECK_OUTCOMES.map((item) => (
                  <div key={item.title} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                        <HomeIcon kind={item.icon} />
                      </span>
                      <p className="text-lg font-semibold tracking-[-0.03em] text-white">{item.title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="radial-wash bg-surface px-6 py-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          {[
            ['Klarheit', 'womit du jetzt sinnvoll anfangen solltest'],
            ['Orientierung', 'ob Vergleich, Beobachten oder Verstehen passt'],
            ['Entlastung', 'weniger Unsicherheit und weniger falsche Klicks'],
          ].map(([value, label]) => (
            <div key={value} className="surface-panel rounded-[1.7rem] px-5 py-5">
              <p className="text-3xl font-bold tracking-[-0.05em] text-slate-950">{value}</p>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              Kommt dir das bekannt vor?
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.045em] text-slate-950 md:text-5xl">
              Du willst sparen, aber weißt nicht, wo du sinnvoll anfangen sollst.
            </h2>
          </div>

          <div className="grid gap-4">
            {PAIN_POINTS.map((item) => (
              <div
                key={item.title}
                className="surface-panel grid gap-3 rounded-[2rem] px-5 py-5 md:grid-cols-[15rem_1fr] md:items-start"
              >
                <h3 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                  {item.title}
                </h3>
                <p className="text-base leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#dfe8e4] px-6 py-20 md:py-24">
        <div className="absolute inset-0">
          <Image
            src="/Bilder/003-09-hf_20260318_144646_3956ac0f-5b8c-4531-95f1-b76bf3468943.jpeg"
            alt="Familie in heller Wohnsituation"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(223,232,228,0.94)_0%,rgba(223,232,228,0.9)_36%,rgba(223,232,228,0.7)_58%,rgba(223,232,228,0.26)_100%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="relative max-w-xl rounded-[2.4rem] border border-white/55 bg-white/72 px-6 py-8 shadow-[0_34px_80px_-58px_rgba(15,23,42,0.24)] backdrop-blur-sm md:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              Was dir der Spar-Check bringt
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.045em] text-slate-950">
              Du bekommst aus Unsicherheit einen klaren nächsten Schritt.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Statt dich durch Tarife, Boni und Verbrauchsfragen zu wühlen, bekommst du erst
              Orientierung. Das nimmt Druck raus und macht die Entscheidung überhaupt erst machbar.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Du erkennst, ob ein Tarifvergleich jetzt wirklich Sinn ergibt.',
                'Du siehst, ob Beobachten gerade klüger ist als hektisches Handeln.',
                'Du verstehst, wo du zuerst tiefer hinschauen solltest.',
              ].map((item) => (
                <div key={item} className="flex gap-3 border-t border-slate-300/80 pt-4">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary" />
                  <p className="text-base leading-7 text-slate-600">{item}</p>
                </div>
              ))}
            </div>

            <Link
              href="/spar-check"
              className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-[#13263b] px-8 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#17324d]"
            >
              Jetzt Klarheit holen
            </Link>
          </div>

          <div />
        </div>
      </section>

      <section className="bg-surface px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              Sofortige Orientierung
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.045em] text-slate-950">
              Drei Dinge, die dir der Spar-Check sofort abnimmt.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {QUICK_ENTRY_CARDS.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="surface-panel group overflow-hidden rounded-[2rem]"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover object-center transition duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="px-6 py-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">
                    {card.eyebrow}
                  </p>
                  <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{card.text}</p>
                  <div className="mt-6 text-sm font-semibold text-slate-900">Mehr sehen →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                So kommst du zu deiner Empfehlung
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.045em] text-slate-950">
                Kurz genug, um sofort anzufangen. Klar genug, um danach sicher weiterzugehen.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {HOW_IT_WORKS.map((item, index) => (
                <div key={item.title} className="surface-panel rounded-[2rem] px-7 py-8 md:min-h-[20rem]">
                  <div className="flex justify-end">
                    <span className="text-sm font-semibold tracking-[0.24em] text-slate-400">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="radial-wash bg-[#dce6e6] px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
          <div className="rounded-[2.5rem] bg-white px-6 py-8 shadow-[0_34px_80px_-58px_rgba(15,23,42,0.18)] md:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              Warum das Vertrauen schafft
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.045em] text-slate-950">
              Du wirst nicht in Komplexität gedrückt, sondern aus ihr herausgeführt.
            </h2>
            <div className="mt-8 space-y-4">
              {TRUST_BLOCKS.map((item) => (
                <div key={item.title} className="border-t border-slate-300/80 pt-5">
                  <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[32rem] overflow-hidden rounded-[2.5rem] shadow-[0_34px_80px_-58px_rgba(15,23,42,0.18)]">
            <Image
              src="/Bilder/father-and-sons-loading-washing-machine-in-kitchen-2026-03-17-17-43-52-utc.jpg"
              alt="Vater und Kinder in einer Alltagsszene in der Küche"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_44%,rgba(15,23,42,0.24)_100%)]" />
            <blockquote className="absolute bottom-6 left-6 max-w-sm rounded-[1.4rem] border border-white/20 bg-white/14 px-4 py-4 text-white backdrop-blur-sm">
              <p className="text-base leading-7">
                „Zum ersten Mal war nicht der billigste Tarif die erste Frage, sondern was für
                unseren Haushalt überhaupt der richtige nächste Schritt ist.“
              </p>
              <footer className="mt-3 text-sm font-semibold text-slate-200">
                Julia &amp; Daniel M., Niedersachsen
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                Überblick über die Möglichkeiten
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-bold tracking-[-0.045em] text-slate-950">
                Du siehst schnell, was auf der Seite möglich ist und was zuerst Sinn ergibt.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {POSSIBILITY_OVERVIEW.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`rounded-[2rem] px-6 py-6 transition hover:-translate-y-0.5 ${
                    item.tone === 'soft-green'
                      ? 'border border-[#d7ead8] bg-[#eef7ef]'
                      : item.tone === 'soft-blue'
                        ? 'border border-[#d9e5ee] bg-[#eef4f8]'
                        : item.tone === 'soft-green-wide'
                          ? 'border border-[#d7ead8] bg-[#eef7ef] md:col-span-2 md:grid md:grid-cols-[0.9fr_1.1fr] md:items-center'
                          : 'surface-panel'
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                      {item.title}
                    </h3>
                  </div>
                  <div className={item.tone === 'soft-green-wide' ? 'md:pl-6' : ''}>
                    <p className="mt-3 text-base leading-7 text-slate-600">{item.text}</p>
                    <div className="mt-6 text-sm font-semibold text-slate-900">Mehr sehen →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#13263b] px-6 py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 overflow-hidden rounded-[2.8rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:p-6">
            <div className="relative min-h-[20rem] overflow-hidden rounded-[2rem]">
              <Image
                src="/Bilder/003-05-hf_20260318_144411_01626ceb-4850-4170-8d1b-3bbb288d2a54.jpeg"
                alt="Ruhige Familienszene im Wohnzimmer"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,37,58,0.05)_0%,rgba(18,37,58,0.42)_100%)]" />
            </div>

            <div className="px-2 py-4 lg:px-6">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                Noch nicht entscheidungsbereit?
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.045em]">
                Dann beobachte lieber bewusst, statt das Thema wieder zu verdrängen.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Wenn jetzt nicht der Moment zum Wechseln ist, musst du trotzdem nicht alles im
                Kopf behalten. Der Preis-Wächter meldet sich, wenn Beobachten in Handeln
                übergehen sollte.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/preis-waechter"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Preis-Wächter aktivieren
                </Link>
                <Link
                  href="/spar-check"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/16 px-8 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Erst den Spar-Check machen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
