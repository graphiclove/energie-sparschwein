'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// ─── Menü-Konfiguration ───────────────────────────────────────────────────────
interface NavLink {
  icon:   'spark' | 'chart' | 'calc' | 'home' | 'shower' | 'fuel' | 'plug' | 'globe' | 'pellets';
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
      { icon: 'spark', label: 'Spar-Check',            desc: 'In 3 Min. dein Sparpotenzial berechnen', href: '/spar-check' },
      { icon: 'chart', label: 'Tarif-Vergleich',       desc: 'Beste Anbieter für deine Situation',     href: '/tarif-vergleich' },
      { icon: 'calc', label: 'Preisrechner',          desc: 'Heizung, Strom und Mobilität berechnen', href: '/preisrechner' },
    ],
    right: [
      { icon: 'home', label: 'Heizkosten senken',    desc: 'Praktische Spar-Tipps für zuhause', href: '/ratgeber/heizkosten-senken' },
      { icon: 'shower', label: 'Dusch-Rechner',        desc: 'Was kostet dein Duschverhalten?',   href: '/tools/dusch-rechner' },
    ],
  },
  {
    label: 'Tools',
    left: [
      { icon: 'fuel', label: 'Günstig Tanken',  desc: 'Tankstellen in deiner Nähe',        href: '/guenstig-tanken' },
      { icon: 'shower', label: 'Dusch-Rechner',   desc: 'Was kostet dein Duschverhalten?',   href: '/tools/dusch-rechner' },
      { icon: 'plug', label: 'Geräte-Check',    desc: 'Lohnt sich ein neues Gerät?',       href: '/tools/geraete-check' },
    ],
  },
  {
    label: 'Ratgeber',
    href: '/ratgeber',
    left: [
      { icon: 'chart', label: 'Gaspreise 2026',      desc: 'Preistreiber und was jetzt zählt', href: '/ratgeber/gaspreise-2026' },
      { icon: 'globe', label: 'CO₂-Steuer 2026',     desc: 'Was sich 2026 ändert', href: '/ratgeber/co2-steuer-2026' },
      { icon: 'home', label: 'Heizkosten senken',   desc: 'Sofort-Tipps und Förderungen',  href: '/ratgeber/heizkosten-senken' },
    ],
    right: [
      { icon: 'pellets', label: 'Pellets vs. Gas',      desc: 'Was lohnt sich 2026 eher?', href: '/ratgeber/pellets-vs-gas' },
      { icon: 'plug', label: 'Geräte-Check',         desc: 'Energiefresser im Haushalt finden', href: '/tools/geraete-check' },
    ],
  },
  { label: 'Über uns', href: '/ueber-uns' },
];

function NavIcon({ kind }: { kind: NavLink['icon'] }) {
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'h-5 w-5',
  };

  switch (kind) {
    case 'spark':
      return (
        <svg {...props}>
          <path d="M13 2 7 12h4l-1 10 7-11h-4V2Z" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...props}>
          <path d="M4 19h16" />
          <path d="M7 15V9" />
          <path d="M12 15V5" />
          <path d="M17 15v-3" />
        </svg>
      );
    case 'calc':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2.5" />
          <path d="M8 7h8" />
          <path d="M8 11h2M14 11h2M8 15h2M14 15h2M8 19h8" />
        </svg>
      );
    case 'home':
      return (
        <svg {...props}>
          <path d="M3.5 10.5 12 3l8.5 7.5" />
          <path d="M6 9.5V20h12V9.5" />
          <path d="M10 20v-5h4v5" />
        </svg>
      );
    case 'shower':
      return (
        <svg {...props}>
          <path d="M6 8a5 5 0 0 1 10 0v1H6Z" />
          <path d="M16 9v2.5" />
          <path d="M10 13v1M13 13.5v1M16 14v1M9 16v1M12 16.5v1M15 17v1" />
        </svg>
      );
    case 'fuel':
      return (
        <svg {...props}>
          <path d="M7 6h7a2 2 0 0 1 2 2v10H7z" />
          <path d="M9 6V4h4v2" />
          <path d="M16 8h1.5l2.5 2.5V16a1.5 1.5 0 0 1-3 0v-2" />
        </svg>
      );
    case 'plug':
      return (
        <svg {...props}>
          <path d="M9 3v6M15 3v6" />
          <path d="M7 8h10v2a5 5 0 0 1-5 5 5 5 0 0 1-5-5V8Z" />
          <path d="M12 15v6" />
        </svg>
      );
    case 'globe':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.8 12h16.4" />
          <path d="M12 3.5c2.6 2.4 4 5.2 4 8.5s-1.4 6.1-4 8.5c-2.6-2.4-4-5.2-4-8.5s1.4-6.1 4-8.5Z" />
        </svg>
      );
    case 'pellets':
      return (
        <svg {...props}>
          <path d="M7 8.5c0-2.8 2.4-5 5.3-5 2.3 0 4.2 1.2 5.1 3.2" />
          <path d="M9 13.5c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5-1.8 3.5-4 3.5-4-1.5-4-3.5Z" />
          <path d="M5 17c0-1.7 1.4-3 3.2-3 1.7 0 3.1 1.3 3.1 3s-1.4 3-3.1 3C6.4 20 5 18.7 5 17Z" />
        </svg>
      );
  }
}

// ─── Dropdown-Link ────────────────────────────────────────────────────────────
function DropdownLink({ item, onClick }: { item: NavLink; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="group/link flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition group-hover/link:bg-slate-200">
        <NavIcon kind={item.icon} />
      </span>
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

  // Keep the navbar dark over hero imagery, then make it denser on scroll.
  const navBg     = scrolled
    ? 'bg-[#0f172a]/96 shadow-md border-b border-slate-800 backdrop-blur-xl'
    : 'bg-[#0f172a]/72 border-b border-white/10 backdrop-blur-md';
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
                  <div
                    className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      openMenu === item.label ? linkActive : linkColor
                    }`}
                  >
                    {item.href ? (
                      <Link href={item.href} className="focus:outline-none">
                        {item.label}
                      </Link>
                    ) : (
                      item.label
                    )}
                    <svg
                      className={`h-3.5 w-3.5 text-white/50 transition-transform duration-200 ${openMenu === item.label ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

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
