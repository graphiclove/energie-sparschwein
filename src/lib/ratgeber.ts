export interface RatgeberEntry {
  href: string;
  title: string;
  description: string;
  category: 'Preise' | 'Heizen' | 'Politik';
  readingTime: string;
}

export const RATGEBER_ENTRIES: RatgeberEntry[] = [
  {
    href: '/ratgeber/gaspreise-2026',
    title: 'Gaspreise 2026',
    description: 'Preistreiber, CO2-Kosten und die wichtigsten Hebel für deinen Vertrag.',
    category: 'Preise',
    readingTime: '6 Min.',
  },
  {
    href: '/ratgeber/co2-steuer-2026',
    title: 'CO2-Steuer 2026',
    description: 'Was sich im nationalen Emissionshandel ändert und warum fossile Wärme teurer bleibt.',
    category: 'Politik',
    readingTime: '5 Min.',
  },
  {
    href: '/ratgeber/heizkosten-senken',
    title: 'Heizkosten senken',
    description: 'Sofort-Tipps, Förderungen und praktische Maßnahmen für zuhause.',
    category: 'Heizen',
    readingTime: '5 Min.',
  },
  {
    href: '/ratgeber/pellets-vs-gas',
    title: 'Pellets vs. Gas',
    description: 'Wann sich ein Tarifwechsel lohnt und wann ein Systemvergleich sinnvoll wird.',
    category: 'Heizen',
    readingTime: '5 Min.',
  },
];
