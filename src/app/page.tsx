import Image from "next/image";
import Link from "next/link";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Einordnen statt überfordern",
    text: "Der Spar-Check sortiert in wenigen Fragen, welcher Hebel für deinen Haushalt jetzt wirklich relevant ist.",
  },
  {
    step: "02",
    title: "Den nächsten sinnvollen Schritt sehen",
    text: "Du bekommst erst Orientierung und erst danach eine klare Empfehlung: vergleichen, beobachten oder tiefer verstehen.",
  },
  {
    step: "03",
    title: "Ohne Druck weitergehen",
    text: "Wenn du noch nicht wechseln willst, übernimmt der Preis-Wächter die Wiederkehr für dich und hält dich auf dem Laufenden.",
  },
];

const TRUST_SIGNALS = [
  "Kein Tarif-Dschungel",
  "Keine Verkaufsanrufe",
  "Provisionen transparent erklärt",
];

const SECONDARY_TOOLS = [
  {
    href: "/preisrechner",
    title: "Preisrechner",
    text: "Wenn du einzelne Kostenblöcke tiefer verstehen willst.",
  },
  {
    href: "/tarif-vergleich",
    title: "Tarif-Vergleich",
    text: "Für die volle Übersicht, nachdem du eingeordnet wurdest.",
  },
  {
    href: "/guenstig-tanken",
    title: "Günstig tanken",
    text: "Schneller Nebenweg für Mobilität statt Kernfunnel.",
  },
  {
    href: "/tools/dusch-rechner",
    title: "Dusch-Rechner",
    text: "Kleines Tool für Teilfragen rund um den Haushalt.",
  },
  {
    href: "/tools/geraete-check",
    title: "Geräte-Check",
    text: "Hilft bei Einzelentscheidungen zu Stromfressern.",
  },
];

const TRUST_BLOCKS = [
  {
    title: "Wir empfehlen nicht zuerst Anbieter, sondern den sinnvollsten nächsten Schritt.",
    text: "Wechselbiber ist als Kosten-Dolmetscher gebaut. Erst verstehen, dann einordnen, dann handeln.",
  },
  {
    title: "Nicht jeder Haushalt muss sofort wechseln.",
    text: "Wenn Beobachten gerade sinnvoller ist als Handeln, ist der Preis-Wächter der richtige Weg und nicht nur ein Nebenformular.",
  },
  {
    title: "Provisionen sind Teil des Modells, aber nicht der Startpunkt.",
    text: "Wir verdienen nur, wenn über unsere Links gewechselt wird. Im Funnel zeigen wir trotzdem zuerst das, was für den Haushalt plausibel wirkt.",
  },
];

export default function Home() {
  return (
    <main className="bg-[#edf1f2] text-slate-950">
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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,37,58,0.94)_0%,rgba(18,37,58,0.9)_30%,rgba(18,37,58,0.52)_58%,rgba(18,37,58,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,37,58,0.2)_0%,rgba(18,37,58,0.08)_35%,rgba(18,37,58,0.42)_100%)]" />

        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl items-end px-6 pb-12 pt-28 md:pb-16 md:pt-32">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              Kosten-Dolmetscher für Energie
            </p>
            <h1 className="mt-5 text-balance text-5xl font-bold leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              In einer Minute zum Sparpfad für dein Zuhause.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              Kein Tarif-Dschungel. Kein Verkaufsdruck. Wechselbiber zeigt dir, welche Energie-Entscheidung
              für deinen Haushalt jetzt wirklich relevant ist und in welcher Reihenfolge sie Sinn ergibt.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/spar-check"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-slate-950 transition hover:bg-primary/90"
              >
                Spar-Check starten
              </Link>
              <Link
                href="/preis-waechter"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-white/8 px-8 text-base font-semibold text-white transition hover:bg-white/14"
              >
                Noch nicht wechseln? Preis-Wächter
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              {["Kostenlos", "Unverbindlich", "60 Sekunden"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-3 rounded-[1.75rem] border border-white/12 bg-white/6 p-4 backdrop-blur-sm sm:grid-cols-3">
              {TRUST_SIGNALS.map((signal) => (
                <div key={signal} className="rounded-[1.15rem] bg-white/8 px-4 py-4">
                  <p className="text-sm font-medium leading-6 text-white/92">{signal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fa] px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Wie Wechselbiber funktioniert</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950">
                Erst verstehen, dann einordnen, dann sinnvoll handeln.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Die Startseite soll dich nicht in zehn Richtungen schicken. Sie führt dich in einen klaren
                ersten Schritt und macht erst danach weitere Wege sichtbar.
              </p>
            </div>

            <div className="space-y-5">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="grid gap-4 border-t border-slate-200 pt-5 md:grid-cols-[auto_1fr] md:gap-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#13263b] text-sm font-semibold text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">{item.title}</h3>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e3eaed] px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative min-h-[24rem] overflow-hidden rounded-[2.5rem]">
            <Image
              src="/Bilder/003-03-hf_20260318_143440_faa4514d-0b92-4641-bcdb-c372c91f6018.jpeg"
              alt="Familie in heller Küche"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_42%,rgba(15,23,42,0.2)_100%)]" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Warum das hilfreich ist</p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950">
              Du musst nicht zuerst Tarife sortieren, um eine gute Entscheidung zu treffen.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Die meisten Haushalte brauchen nicht sofort eine volle Anbieterübersicht. Sie brauchen zuerst
              eine glaubwürdige Einordnung, welcher Hebel jetzt wirklich zählt und welcher erst später.
            </p>

            <div className="mt-8 space-y-4">
              {TRUST_BLOCKS.map((item) => (
                <div key={item.title} className="border-t border-slate-300/80 pt-4">
                  <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>

            <blockquote className="mt-8 border-l-2 border-primary pl-5 text-base leading-7 text-slate-700">
              „Zum ersten Mal war nicht der billigste Tarif die erste Frage, sondern was für unseren Haushalt
              überhaupt der richtige nächste Schritt ist.“
              <footer className="mt-3 text-sm font-semibold text-slate-500">Julia & Daniel M., Niedersachsen</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-[#13263b] px-6 py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Noch nicht wechseln?</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em]">
                Dann ist Beobachten der richtige Schritt, nicht Aktionismus.
              </h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-slate-300">
                Der Preis-Wächter ist die bewusste Nicht-Jetzt-Option. Er erinnert dich, wenn Preise in deiner
                Region fallen, dein Tarif ausläuft oder ein neuer Check sinnvoll wird.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/preis-waechter"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-slate-950 transition hover:bg-primary/90"
                >
                  Preis-Wächter aktivieren
                </Link>
                <Link
                  href="/spar-check"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/16 px-8 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Erst den Spar-Check machen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fa] px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Sekundäre Tools</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950">
                Für Teilfragen gibt es weitere Werkzeuge. Der erste Schritt bleibt trotzdem der Spar-Check.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {SECONDARY_TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-5 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <h3 className="text-lg font-semibold text-slate-950">{tool.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{tool.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
