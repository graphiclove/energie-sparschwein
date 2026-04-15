import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";

export const metadata: Metadata = {
  title: "Energie-Sparschwein | Dein kostenloser Energie-Check",
  description: "Finde heraus, wo du bei Gas, Strom, Heizöl und Sprit draufzahlst. Kostenloser Spar-Check in 60 Sekunden.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <html lang="de" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Suspense fallback={null}>
          <GoogleAnalytics gaId={gaId} />
        </Suspense>
        <MicrosoftClarity projectId={clarityId} />
        <Navbar />

        <div className="flex-1">{children}</div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">

              {/* Brand */}
              <div>
                <p className="text-lg font-bold">Energie-Sparschwein</p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
                  Dein unabhängiger Kosten-Dolmetscher für Energie. Kostenlos, transparent, ohne Agenda.
                </p>
                <p className="mt-5 text-xs text-slate-600">
                  Affiliate-Hinweis: Wir erhalten ggf. Provisionen bei Tarifwechseln über unsere Links. Für dich entstehen keine Mehrkosten.
                </p>
              </div>

              {/* Tools */}
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tools</p>
                <ul className="space-y-2.5 text-sm text-slate-400">
                  {[
                    { label: 'Spar-Check',      href: '/spar-check' },
                    { label: 'Tarif-Vergleich', href: '/tarif-vergleich' },
                    { label: 'Günstig Tanken',  href: '/guenstig-tanken' },
                    { label: 'Preisrechner',    href: '/preisrechner' },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="transition hover:text-white">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ratgeber */}
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Ratgeber</p>
                <ul className="space-y-2.5 text-sm text-slate-400">
                  {[
                    { label: 'Heizkosten senken', href: '/ratgeber/heizkosten-senken' },
                    { label: 'Gaspreise 2026',    href: '/ratgeber/gaspreise-2026' },
                    { label: 'Pellets vs. Gas',   href: '/ratgeber/pellets-vs-gas' },
                    { label: 'CO₂-Steuer 2026',   href: '/ratgeber/co2-steuer-2026' },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="transition hover:text-white">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Unternehmen */}
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Unternehmen</p>
                <ul className="space-y-2.5 text-sm text-slate-400">
                  {[
                    { label: 'Über uns',     href: '/ueber-uns' },
                    { label: 'Impressum',    href: '/impressum' },
                    { label: 'Datenschutz',  href: '/datenschutz' },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="transition hover:text-white">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-slate-600 sm:flex-row">
              <p>© {new Date().getFullYear()} Energie-Sparschwein. Alle Rechte vorbehalten.</p>
              <p>Mit ♥ gebaut für deutsche Verbraucher.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
