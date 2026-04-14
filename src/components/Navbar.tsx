'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// ─── Menü-Konfiguration ───────────────────────────────────────────────────────
interface NavLink {
  icon:   string;
  label:  string;
  desc:   string;
  href:   string;
  badge?: string;
}

interface NavItem {
  label:  string;
  href?:  string;
  left?:  NavLink[];
  right?: NavLink[];
}

const NAV: NavItem[] = [
  {
    label: 'Energie sparen',
    left: [
      { icon: '🔥', label: 'Spar-Check',           desc: 'In 3 Min. dein Sparpotenzial berechnen', href: '/spar-check' },
      { icon: '⚖️', label: 'Brennstoff-Vergleich', desc: 'Gas, Öl, Pellets & Wärmepumpe',          href: '/kommt-bald', badge: 'Bald' },
      { icon: '📊', label: 'Tarif-Vergleich',       desc: 'Beste Anbieter für deine Situation',     href: '/tarif-vergleich' },
    ],
    right: [
      { icon: '📈', label: 'Gaspreise 2026',    desc: 'Aktuelle Preistrends & Prognosen',  href: '/kommt-bald', badge: 'Bald' },
      { icon: '🏠', label: 'Heizkosten senken', desc: 'Praktische Spar-Tipps für zuhause', href: '/ratgeber/heizkosten-senken' },
    ],
  },
  {
    label: 'Tools',
    left: [
      { icon: '⛽', label: 'Günstig Tanken', desc: 'Tankstellen in deiner Nähe',       href: '/guenstig-tanken' },
      { icon: '🚿', label: 'Dusch-Rechner',  desc: 'Was kostet dein Duschverhalten?',  href: '/tools/dusch-rechner' },
      { icon: '🔌', label: 'Geräte-Check',    desc: 'Lohnt sich ein neues Gerät?',       href: '/tools/geraete-check' },
    ],
  },
  {
    label: 'Ratgeber',
    left: [
      { icon: '📈', label: 'Gaspreise 2026',     desc: 'Entwicklung und Ausblick',     href: '/kommt-bald', badge: 'Bald' },
      { icon: '🏢', label: 'Mieter-Guide',        desc: 'Energie sparen als Mieter',    href: '/kommt-bald', badge: 'Bald' },
      { icon: '🌍', label: 'CO₂-Steuer erklärt', desc: 'Was das für dich bedeutet',    href: '/kommt-bald', badge: 'Bald' },
    ],
    right: [
      { icon: '🌰', label: 'Pellets vs. Gas',       desc: 'Kostenvergleich 2026',            href: '/kommt-bald', badge: 'Bald' },
      { icon: '⚡', label: 'Gasanbieter insolvent', desc: 'Deine Rechte & nächste Schritte', href: '/kommt-bald', badge: 'Bald' },
    ],
  },
  { label: 'Über uns', href: '/ueber-uns' },
];

// ─── Dropdown-Link ────────────────────────────────────────────────────────────
function DropdownLink({ item, onClick }: { item: NavLink; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="group/link flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50"
    >
      <span className="mt-0.5 w-7 shrink-0 text-xl">{item.icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-800 transition group-hover/link:text-primary">
            {item.label}
          </span>
          {item.badge && (
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold leading-none text-primary">
              {item.badge}
            </span>
          )}
        </div>
        <span className="mt-0.5 block text-xs leading-snug text-slate-500">{item.desc}</span>
      </div>
    </Link>
  );
}

// ─── Hauptkomponente ──────────────────────────────────────────────────────────
export default function Navbar() {
  const [openMenu,          setOpenMenu]          = useState<string | null>(null);
  const [scrolled,          setScrolled]          = useState(false);
  const [mobileOpen,        setMobileOpen]        = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const enter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const hasDropdown = (item: NavItem) => !!(item.left || item.right);

  // Transparent → dark when scrolled (always white text on dark background)
  const navBg     = scrolled ? 'bg-[#0f172a] shadow-md border-b border-slate-800' : 'bg-transparent';
  const linkColor = 'text-white/80 hover:text-white hover:bg-white/10';
  const linkActive = 'bg-white/10 text-white';

  return (
    <>
      {/* ── Desktop-Navbar ────────────────────────────────────────────────── */}
      <nav className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">

          {/* Logo */}
          <Link href="/" className="shrink-0 text-lg font-bold text-white transition hover:opacity-80">
            Energie&#8209;Sparschwein
          </Link>

          {/* Desktop-Nav-Items */}
          <div className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
            {NAV.map((item) =>
              hasDropdown(item) ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => enter(item.label)}
                  onMouseLeave={leave}
                >
                  <button
                    className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      openMenu === item.label ? linkActive : linkColor
                    }`}
                  >
                    {item.label}
                    <svg
                      className={`h-3.5 w-3.5 text-white/50 transition-transform duration-200 ${openMenu === item.label ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown-Panel */}
                  <div
                    className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 transition-all duration-200 ${
                      openMenu === item.label
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible -translate-y-2 opacity-0'
                    }`}
                  >
                    <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white" />
                    <div className={`relative mt-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 ${item.right ? 'w-125' : 'w-75'}`}>
                      <div className={item.right ? 'grid grid-cols-2 divide-x divide-slate-100' : ''}>
                        {item.left && (
                          <div className="space-y-0.5 p-3">
                            {item.left.map((link) => <DropdownLink key={link.label} item={link} />)}
                          </div>
                        )}
                        {item.right && (
                          <div className="space-y-0.5 p-3">
                            {item.right.map((link) => <DropdownLink key={link.label} item={link} />)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${linkColor}`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          {/* Desktop-CTA */}
          <div className="hidden shrink-0 md:block">
            <Link href="/spar-check" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90">
              Spar-Check starten
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 transition hover:bg-white/10 md:hidden"
            aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            <div className="relative h-5 w-5">
              <span className={`absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${mobileOpen ? 'top-2.5 rotate-45' : ''}`} />
              <span className={`absolute left-0 top-2.5 block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-4 block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${mobileOpen ? 'top-2.5 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile Backdrop ───────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile Drawer ─────────────────────────────────────────────────── */}
      <div
        className={`fixed left-0 right-0 top-16 z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-slate-800 bg-[#0f172a] shadow-xl transition-all duration-300 md:hidden ${
          mobileOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <div className="space-y-1 px-4 py-4">
          {NAV.map((item) => (
            <div key={item.label}>
              {hasDropdown(item) ? (
                <>
                  <button
                    onClick={() => setOpenMobileSection(openMobileSection === item.label ? null : item.label)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 font-semibold text-white transition hover:bg-white/10"
                  >
                    {item.label}
                    <svg
                      className={`h-4 w-4 text-white/40 transition-transform duration-200 ${openMobileSection === item.label ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openMobileSection === item.label ? 'max-h-150 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-0.5 pb-2 pl-4">
                      {[...(item.left ?? []), ...(item.right ?? [])].map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                        >
                          <span className="w-6 shrink-0 text-base">{link.icon}</span>
                          <span className="font-medium">{link.label}</span>
                          {link.badge && (
                            <span className="ml-auto rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <div className="border-t border-white/10 pb-2 pt-4">
            <Link
              href="/spar-check"
              onClick={() => setMobileOpen(false)}
              className="block w-full rounded-full bg-primary py-3.5 text-center font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              Spar-Check starten
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
