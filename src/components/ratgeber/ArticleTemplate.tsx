import type { ReactNode } from 'react';
import Link from 'next/link';

type ArticleNextStep = {
  label: string;
  href: string;
};

type ArticleSource = {
  label: string;
  href: string;
};

type ArticleTemplateProps = {
  eyebrow?: string;
  title: string;
  intro: string;
  shortAnswer: string;
  whyNow: string;
  relevantFor: string[];
  nextStep: {
    title: string;
    body: string;
    primary: ArticleNextStep;
    secondary?: ArticleNextStep;
  };
  sections: Array<{
    title: string;
    body: ReactNode;
  }>;
  sources?: ArticleSource[];
};

export default function ArticleTemplate({
  eyebrow = 'Ratgeber',
  title,
  intro,
  shortAnswer,
  whyNow,
  relevantFor,
  nextStep,
  sections,
  sources = [],
}: ArticleTemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">{intro}</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Kurzantwort</p>
              <p className="mt-3 text-base leading-7 text-slate-700">{shortAnswer}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Warum das jetzt zählt</p>
              <p className="mt-3 text-base leading-7 text-slate-700">{whyNow}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Relevant für</p>
              <ul className="mt-3 space-y-2 text-base leading-7 text-slate-700">
                {relevantFor.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="space-y-6">
              {sections.map((section) => (
                <section key={section.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                  <div className="mt-4 space-y-4 text-slate-600">{section.body}</div>
                </section>
              ))}
            </article>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-primary/20 bg-emerald-50 p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Was du als Nächstes tun kannst</p>
                <h3 className="mt-3 text-2xl font-bold text-slate-900">{nextStep.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{nextStep.body}</p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href={nextStep.primary.href}
                    className="inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-slate-950 transition hover:bg-primary/90"
                  >
                    {nextStep.primary.label}
                  </Link>
                  {nextStep.secondary ? (
                    <Link
                      href={nextStep.secondary.href}
                      className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {nextStep.secondary.label}
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Methodik & Transparenz</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Wechselbiber arbeitet mit Marktpreisen, typischen Haushaltsprofilen und nachvollziehbaren
                  Quellen. Wir versuchen zuerst einzuordnen, welcher Schritt für deinen Haushalt plausibel ist,
                  statt sofort möglichst viele Wege gleichzeitig zu öffnen.
                </p>
                <Link
                  href="/methodik"
                  className="mt-5 inline-flex text-sm font-semibold text-slate-700 underline underline-offset-2 transition hover:text-slate-950"
                >
                  So arbeiten wir →
                </Link>
              </div>

              {sources.length > 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900">Quellen</h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    {sources.map((source) => (
                      <li key={source.href}>
                        <a
                          className="underline underline-offset-2"
                          href={source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
