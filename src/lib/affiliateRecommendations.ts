export type HeatingType = 'gas' | 'oil' | 'pellets' | 'heatpump' | 'unknown';

interface AffiliateRecommendationInput {
  heating: HeatingType;
  area: number;
  persons: number;
  electricityKwh?: number;
  zip?: string;
}

export interface AffiliateRecommendation {
  partnerName: string;
  headline: string;
  description: string;
  ctaLabel: string;
  url: string;
  bullets: string[];
}

export interface AffiliatePortalCard {
  name: string;
  taglines: string[];
  rating: number;
  url: string;
  buttonText: string;
  isRecommended?: boolean;
}

export interface AffiliateAlternativeOption {
  name: string;
  title: string;
  description: string;
  ctaLabel: string;
  url: string;
}

export interface AffiliateBranding {
  shortName: string;
  accentClassName: string;
  badgeClassName: string;
}

export function getPrimaryAffiliateRecommendation(
  input: AffiliateRecommendationInput,
): AffiliateRecommendation {
  const { heating, zip } = input;
  const zipParam = zip && /^\d{5}$/.test(zip) ? `plz=${encodeURIComponent(zip)}&` : '';
  const verivoxGasUrl = `https://www.verivox.de/gasvergleich/?partner=6776&${zipParam}`.replace(/[?&]$/, '');
  const verivoxPowerUrl = `https://www.verivox.de/stromvergleich/?partner=6776&${zipParam}`.replace(/[?&]$/, '');

  if (heating === 'gas') {
    return {
      partnerName: 'Verivox',
      headline: 'Beste Sofortchance: Gasanbieter wechseln',
      description:
        'Für Gas ist ein Tarifwechsel in der Regel der schnellste Hebel. Wir geben dir die stabilste Vorbelegung direkt mit: deine Postleitzahl.',
      ctaLabel: 'Jetzt Gasvergleich öffnen →',
      url: verivoxGasUrl,
      bullets: [
        zip ? `Postleitzahl ${zip} bereits übergeben` : 'PLZ kann bei Verivox direkt ergänzt werden',
        'Neukundentarife meist deutlich unter Grundversorgung',
        'Verbrauch ergänzt du direkt im Vergleich',
        'Wechsel online in wenigen Minuten',
      ],
    };
  }

  if (heating === 'oil') {
    return {
      partnerName: 'HeizOel24',
      headline: 'Beste Sofortchance: Heizölpreise vergleichen',
      description:
        'Bei Heizöl entscheidet der Kaufzeitpunkt stark über den Endpreis. Ein Preisvergleich vor der Bestellung ist hier der direkteste Umsatzhebel.',
      ctaLabel: 'Jetzt Heizöl vergleichen →',
      url: 'https://www.heizoel24.de/',
      bullets: [
        'Sofort mehrere Händler im Vergleich',
        'Besonders relevant vor der nächsten Bestellung',
        'Passt zu deinem aktuellen Heizsystem ohne Umbau',
      ],
    };
  }

  if (heating === 'pellets') {
    return {
      partnerName: 'HeizPellets24',
      headline: 'Beste Sofortchance: Pelletspreise prüfen',
      description:
        'Du heizt bereits günstig. Der größte kurzfristige Hebel ist meist der aktuelle Pelletspreis beim nächsten Einkauf.',
      ctaLabel: 'Jetzt Pellets vergleichen →',
      url: 'https://www.heizpellets24.de/',
      bullets: [
        'Schneller Händlervergleich vor dem Kauf',
        'Besonders sinnvoll bei schwankenden Regionalpreisen',
        'Direkt relevant für deine nächste Bestellung',
      ],
    };
  }

  if (heating === 'heatpump') {
    return {
      partnerName: 'Verivox Strom',
      headline: 'Beste Sofortchance: passenden Stromtarif prüfen',
      description:
        'Für Wärmepumpen ist ein passender Stromtarif oft der schnellste Hebel. Wir geben dir den stabilsten Einstieg direkt mit: deine Postleitzahl.',
      ctaLabel: 'Jetzt Stromvergleich öffnen →',
      url: verivoxPowerUrl,
      bullets: [
        zip ? `Postleitzahl ${zip} bereits übergeben` : 'PLZ kann bei Verivox direkt ergänzt werden',
        'Schneller Einstieg ohne zusätzliche Zählerfragen',
        'Verbrauch ergänzt du direkt im Vergleich',
      ],
    };
  }

  return {
    partnerName: 'Verivox Strom',
    headline: 'Einfachster Start: Stromtarif direkt prüfen',
    description:
      'Wenn dein Heizsystem unklar ist, ist ein Stromvergleich der sicherste erste Hebel. Wir setzen nur auf den stabilen Einstieg, der in deinen Tests funktioniert.',
    ctaLabel: 'Jetzt Stromvergleich öffnen →',
    url: verivoxPowerUrl,
    bullets: [
      zip ? `Postleitzahl ${zip} bereits übergeben` : 'PLZ kann bei Verivox direkt ergänzt werden',
      'Funktioniert auch ohne sicheren Heizungstyp',
      'Direkter Start ohne fragliche Zusatzparameter',
      'Verbrauch ergänzt du direkt im Vergleich',
    ],
  };
}

export function getManagedSwitchAlternative(
  input: AffiliateRecommendationInput,
): AffiliateAlternativeOption {
  const { heating } = input;

  if (heating === 'oil' || heating === 'pellets') {
    return {
      name: 'remind.me',
      title: 'Wenn du nicht selbst vergleichen willst',
      description:
        'Lass dich kostenlos an den richtigen Wechsel- oder Kaufzeitpunkt erinnern, statt Preise selbst im Blick zu behalten.',
      ctaLabel: 'Kostenlos erinnern lassen →',
      url: 'https://www.remind.me/',
    };
  }

  return {
    name: 'Wechselpilot',
    title: 'Wenn du den Wechsel abgeben willst',
    description:
      'Wechselpilot übernimmt die Tarifsuche und den jährlichen Wechsel für dich. Gut, wenn du sparen willst, aber dich nicht selbst kümmern möchtest.',
    ctaLabel: 'Wechselservice ansehen →',
    url: 'https://www.wechselpilot.com/',
  };
}

export function getManagedSwitchOptions(
  input: AffiliateRecommendationInput,
): AffiliateAlternativeOption[] {
  const primary = getManagedSwitchAlternative(input);
  const secondary: AffiliateAlternativeOption =
    primary.name === 'Wechselpilot'
      ? {
          name: 'remind.me',
          title: 'Wenn du nur erinnert werden willst',
          description:
            'remind.me erinnert dich kostenlos an den passenden Wechselzeitpunkt, wenn du die Entscheidung selbst treffen möchtest.',
          ctaLabel: 'Zu remind.me →',
          url: 'https://www.remind.me/',
        }
      : {
          name: 'Wechselpilot',
          title: 'Wenn du den Wechsel komplett abgeben willst',
          description:
            'Wechselpilot übernimmt die Tarifsuche und den Wechselprozess für dich, wenn du möglichst wenig Aufwand willst.',
          ctaLabel: 'Zu Wechselpilot →',
          url: 'https://www.wechselpilot.com/',
        };

  return [primary, secondary];
}

export function getSelfCompareCards(
  input: AffiliateRecommendationInput,
): AffiliatePortalCard[] {
  const { heating, zip } = input;
  const zipParam = zip && /^\d{5}$/.test(zip) ? `plz=${encodeURIComponent(zip)}&` : '';
  const verivoxGasUrl = `https://www.verivox.de/gasvergleich/?partner=6776&${zipParam}`.replace(/[?&]$/, '');
  const verivoxPowerUrl = `https://www.verivox.de/stromvergleich/?partner=6776&${zipParam}`.replace(/[?&]$/, '');

  if (heating === 'gas' || heating === 'unknown') {
    return [
      {
        name: 'Verivox',
        taglines: ['PLZ wird direkt übernommen', '930+ Anbieter · TÜV-geprüft · Testsieger'],
        rating: 4.5,
        url: verivoxGasUrl,
        buttonText: 'Gas vergleichen →',
        isRecommended: true,
      },
      {
        name: 'CHECK24',
        taglines: ['Stabiler Einstieg ohne Vorbelegung', 'Testsieger Stiftung Warentest'],
        rating: 4.6,
        url: 'https://www.check24.de/gas/',
        buttonText: 'Gas vergleichen →',
      },
    ];
  }

  if (heating === 'oil') {
    return [
      {
        name: 'HeizOel24',
        taglines: ['500+ Händler im Vergleich', 'Testsieger 2024 · 20+ Jahre Erfahrung'],
        rating: 4.7,
        url: 'https://www.heizoel24.de/',
        buttonText: 'Heizöl vergleichen →',
        isRecommended: true,
      },
      {
        name: 'esyoil',
        taglines: ['800+ Händler deutschlandweit', 'Stiftung Warentest: Sehr gut'],
        rating: 4.5,
        url: 'https://www.esyoil.com/',
        buttonText: 'Heizöl vergleichen →',
      },
    ];
  }

  if (heating === 'pellets') {
    return [
      {
        name: 'HeizPellets24',
        taglines: ['Größter Pellets-Marktplatz DE', '500+ Händler · ENplus A1 Qualität'],
        rating: 4.6,
        url: 'https://www.heizpellets24.de/',
        buttonText: 'Pellets vergleichen →',
        isRecommended: true,
      },
      {
        name: 'Verivox Strom',
        taglines: ['PLZ wird direkt übernommen', '800+ Stromanbieter'],
        rating: 4.5,
        url: verivoxPowerUrl,
        buttonText: 'Strom vergleichen →',
      },
    ];
  }

  if (heating === 'heatpump') {
    return [
      {
        name: 'Verivox Strom',
        taglines: ['PLZ wird direkt übernommen', 'Reibungsloser Einstieg ohne Zählerfragen'],
        rating: 4.5,
        url: verivoxPowerUrl,
        buttonText: 'Strom vergleichen →',
        isRecommended: true,
      },
      {
        name: 'CHECK24 Heizstrom',
        taglines: ['Wärmepumpen-Spezialtarife', 'Schnell & kostenlos wechseln'],
        rating: 4.6,
        url: 'https://www.check24.de/heizstrom/',
        buttonText: 'Heizstrom vergleichen →',
      },
    ];
  }

  return [];
}

export function getManagedSwitchCards(
  input: AffiliateRecommendationInput,
): AffiliatePortalCard[] {
  const options = getManagedSwitchOptions(input);

  return options.map((option, index) => ({
    name: option.name,
    taglines:
      option.name === 'Wechselpilot'
        ? ['Automatischer Wechsel jedes Jahr', 'Kostenlos wenn keine Ersparnis', 'Bekannt aus: Handelsblatt, Focus, ARD']
        : ['Erinnert dich an den besten Wechselzeitpunkt', 'Komplett kostenlos', 'Über 1 Mio. Nutzer'],
    rating: option.name === 'Wechselpilot' ? 4.4 : 4.2,
    url: option.url,
    buttonText: option.ctaLabel,
    isRecommended: index === 0,
  }));
}

export function getAffiliateBranding(name: string): AffiliateBranding {
  const normalized = name.toLowerCase();

  if (normalized.includes('verivox')) {
    return {
      shortName: 'V',
      accentClassName: 'text-sky-700',
      badgeClassName: 'border-sky-200 bg-sky-50 text-sky-700',
    };
  }

  if (normalized.includes('wechselpilot')) {
    return {
      shortName: 'WP',
      accentClassName: 'text-emerald-700',
      badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };
  }

  if (normalized.includes('remind.me')) {
    return {
      shortName: 'r.',
      accentClassName: 'text-violet-700',
      badgeClassName: 'border-violet-200 bg-violet-50 text-violet-700',
    };
  }

  if (normalized.includes('heizoel24')) {
    return {
      shortName: 'H24',
      accentClassName: 'text-amber-700',
      badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
    };
  }

  if (normalized.includes('heizpellets24')) {
    return {
      shortName: 'P24',
      accentClassName: 'text-orange-700',
      badgeClassName: 'border-orange-200 bg-orange-50 text-orange-700',
    };
  }

  return {
    shortName: name.slice(0, 2).toUpperCase(),
    accentClassName: 'text-slate-700',
    badgeClassName: 'border-slate-200 bg-slate-50 text-slate-700',
  };
}
