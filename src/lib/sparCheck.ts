export type HeatingType = 'gas' | 'oil' | 'pellets' | 'heatpump' | 'unknown';
export type SparCheckQuestionStepId = 'heating' | 'household' | 'electricity';

export interface SparCheckData {
  heating: HeatingType;
  area: number;
  persons: number;
  electricityKnown: boolean;
  electricityKwh: number;
  zip: string;
}

export interface SavingRange {
  low: number;
  high: number;
}

export interface SparCheckResultPath {
  kind: 'compare' | 'understand' | 'watch';
  eyebrow: string;
  title: string;
  description: string;
  reason: string;
  href: string;
  ctaLabel: string;
}

export interface SparCheckResultRecommendation {
  householdSummary: string;
  profileLine: string;
  situationTitle: string;
  situationText: string;
  diagnosisTitle: string;
  diagnosisText: string;
  recommendationReason: string;
  savingsHint: string;
  mainRecommendation: SparCheckResultPath;
  alternativePath: SparCheckResultPath;
  watcherFallback: SparCheckResultPath;
  trustBlock: {
    title: string;
    items: string[];
  };
}

export const SPAR_CHECK_STORAGE_KEY = 'sparCheckData';
export const SPAR_CHECK_STEP_STORAGE_KEY = 'sparCheckStep';

export const DEFAULT_SPAR_CHECK_DATA: SparCheckData = {
  heating: 'unknown',
  area: 100,
  persons: 2,
  electricityKnown: false,
  electricityKwh: 3000,
  zip: '',
};

const STROM_GRUNDVERSORGUNG = 0.4;
const STROM_BESSERER_TARIF = 0.28;

const currency = (value: number) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);

function cloneDefaultSparCheckData(): SparCheckData {
  return { ...DEFAULT_SPAR_CHECK_DATA };
}

export function getInitialSparCheckData(): SparCheckData {
  if (typeof window === 'undefined') return DEFAULT_SPAR_CHECK_DATA;

  const zipFromUrl = new URLSearchParams(window.location.search).get('zip');
  const saved = window.localStorage.getItem(SPAR_CHECK_STORAGE_KEY);
  let nextData = cloneDefaultSparCheckData();

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      nextData = {
        heating: parsed.heating ?? 'unknown',
        area: Number(parsed.area) || 100,
        persons: Number(parsed.persons) || 2,
        electricityKnown: parsed.electricityKnown ?? false,
        electricityKwh: Number(parsed.electricityKwh) || 3000,
        zip: /^\d{5}$/.test(parsed.zip ?? '') ? parsed.zip : '',
      };
    } catch {
      window.localStorage.removeItem(SPAR_CHECK_STORAGE_KEY);
    }
  }

  if (zipFromUrl && /^\d{5}$/.test(zipFromUrl)) {
    nextData = { ...nextData, zip: zipFromUrl };
  }

  return nextData;
}

export function getInitialQuestionStepIndex(data: SparCheckData) {
  if (typeof window === 'undefined') return 0;

  const savedIndex = Number(window.localStorage.getItem(SPAR_CHECK_STEP_STORAGE_KEY));
  const stepIds = getQuestionStepIds(data);

  if (Number.isFinite(savedIndex)) {
    return Math.min(Math.max(savedIndex, 0), stepIds.length - 1);
  }

  return 0;
}

export function shouldAskElectricity(data: SparCheckData) {
  return data.heating === 'pellets' || data.heating === 'heatpump' || data.heating === 'unknown';
}

export function getQuestionStepIds(data: SparCheckData): SparCheckQuestionStepId[] {
  const ids: SparCheckQuestionStepId[] = ['heating', 'household'];
  if (shouldAskElectricity(data)) ids.push('electricity');
  return ids;
}

export function estimateElectricity(persons: number) {
  if (persons <= 1) return 1500;
  if (persons === 2) return 2500;
  if (persons === 3) return 3500;
  return 4500;
}

export function getSavingRange(value: number, variance = 0.3): SavingRange {
  const normalized = Math.max(0, value);
  const low = Math.max(0, Math.round((normalized * (1 - variance)) / 50) * 50);
  const high = Math.max(low, Math.round((normalized * (1 + variance)) / 50) * 50);
  return { low, high };
}

export function formatSavingRange(range: SavingRange) {
  if (range.high === 0) return 'unter 100 € pro Jahr';
  if (range.low === range.high) return `${currency(range.low)} pro Jahr`;
  return `${currency(range.low)} bis ${currency(range.high)} pro Jahr`;
}

export function getPotentialLevel(value: number) {
  if (value >= 700) return 'hohes Sparpotenzial';
  if (value >= 300) return 'mittleres Sparpotenzial';
  return 'begrenztes Sparpotenzial';
}

export function getHeatingLabel(heating: HeatingType) {
  switch (heating) {
    case 'gas':
      return 'Gas';
    case 'oil':
      return 'Heizöl';
    case 'pellets':
      return 'Pellets';
    case 'heatpump':
      return 'Wärmepumpe';
    default:
      return 'Heizung unklar';
  }
}

export function getSummaryLine(data: SparCheckData) {
  const parts = [
    getHeatingLabel(data.heating),
    `${data.area} m²`,
    `${data.persons} ${data.persons === 1 ? 'Person' : 'Personen'}`,
  ];

  if (data.zip) parts.push(`PLZ ${data.zip}`);

  return parts.join(', ');
}

export function getEstimatedElectricitySaving(persons: number, electricityKwh?: number) {
  const kwh = electricityKwh && electricityKwh > 0 ? electricityKwh : estimateElectricity(persons);
  return kwh * (STROM_GRUNDVERSORGUNG - STROM_BESSERER_TARIF);
}

function getGasSaving(area: number) {
  return area * 140 * (0.136 - 0.081);
}

function getOilSaving(area: number) {
  return area * 15 * (1.1 - 0.85);
}

function getHeatpumpSaving(area: number) {
  return area * 35 * (0.38 - 0.22);
}

export function getTotalSaving(data: SparCheckData) {
  switch (data.heating) {
    case 'gas':
      return getGasSaving(data.area);
    case 'oil':
      return getOilSaving(data.area);
    case 'pellets':
      return getEstimatedElectricitySaving(
        data.persons,
        data.electricityKnown ? data.electricityKwh : undefined,
      );
    case 'heatpump':
      return getHeatpumpSaving(data.area);
    default:
      return Math.round(getEstimatedElectricitySaving(data.persons) * 0.5 + data.area * 2);
  }
}

function getSharedTrustBlock() {
  return {
    title: 'Warum wir das so einordnen',
    items: [
      'Wir arbeiten mit Haushaltsprofilen und Marktspannen statt mit scheinpräzisen Vertragsversprechen.',
      'Empfohlen wird zuerst der plausibelste nächste Schritt, nicht automatisch der größte Vergleichsraum.',
      'Wenn du noch nicht handeln willst, ist Beobachten über den Preis-Wächter ein legitimer Weg.',
    ],
  };
}

export function getSparCheckResultRecommendation(data: SparCheckData): SparCheckResultRecommendation {
  const householdSummary = getSummaryLine(data);
  const totalSaving = getTotalSaving(data);
  const savingRangeText = formatSavingRange(getSavingRange(totalSaving, 0.35));
  const electricityRangeText = formatSavingRange(
    getSavingRange(
      getEstimatedElectricitySaving(
        data.persons,
        data.electricityKnown ? data.electricityKwh : undefined,
      ),
      0.35,
    ),
  );
  const trustBlock = getSharedTrustBlock();

  if (data.heating === 'gas') {
    return {
      householdSummary,
      profileLine: `Basierend auf deinen Angaben: ${householdSummary}`,
      situationTitle: 'Für deinen Haushalt gibt es wahrscheinlich einen relevanten Sparhebel.',
      situationText:
        'Der naheliegendste Hebel liegt aktuell eher im Tarif als in einer technischen Modernisierung.',
      diagnosisTitle: 'Unsere Einschätzung für deinen Fall',
      diagnosisText:
        'Bei dir lohnt sich wahrscheinlich zuerst ein Tarif- und Vertragscheck. Für Gas-Haushalte ist das oft der einfachste Weg zu spürbar weniger Kosten.',
      recommendationReason:
        'Haushalte mit ähnlichem Profil zahlen in ungünstigen Gastarifen oft deutlich mehr als nötig. Ohne deinen Vertrag zu kennen, können wir keine genaue Ersparnis versprechen, aber die Richtung ist klar.',
      savingsHint: `Typische Marktspanne für Haushalte wie deinen: ${savingRangeText}. Das ist eine Orientierung, keine Vertragszusage.`,
      mainRecommendation: {
        kind: 'compare',
        eyebrow: 'Unser empfohlener nächster Schritt',
        title: 'Gas-Tarife und Wechseloptionen prüfen',
        description:
          'Das ist für dich gerade der einfachste und wirksamste Hebel. Du musst nichts umbauen, sondern nur sauber prüfen, ob du unnötig zu viel zahlst.',
        reason:
          'Der Heiztyp ist klar und der wahrscheinlichste Hebel liegt im Tarifraum. Deshalb ist Vergleichen hier nicht zu früh, sondern plausibel.',
        href: '/tarif-vergleich#empfehlung',
        ctaLabel: 'Diesen Schritt jetzt machen →',
      },
      alternativePath: {
        kind: 'understand',
        eyebrow: 'Alternative',
        title: 'Erst die komplette Übersicht ansehen',
        description:
          'Wenn du lieber selbst nebeneinander prüfen willst, kannst du direkt in die volle Übersicht mit Anbietern und Wechselwegen gehen.',
        reason:
          'Das ist sinnvoll, wenn du bewusst mehr Kontext sehen willst statt direkt der engeren Empfehlung zu folgen.',
        href: '/tarif-vergleich#vollansicht',
        ctaLabel: 'Zur kompletten Übersicht →',
      },
      watcherFallback: {
        kind: 'watch',
        eyebrow: 'Noch nicht wechseln?',
        title: 'Dann beobachte den Markt statt das Thema wieder zu verdrängen.',
        description:
          'Der Preis-Wächter erinnert dich, wenn ein neuer Check oder Wechsel eher Sinn ergibt.',
        reason:
          'Das ist der richtige Weg, wenn du heute keine Entscheidung treffen willst, aber das Thema nicht erneut verlieren möchtest.',
        href: '/preis-waechter',
        ctaLabel: 'Preis-Wächter aktivieren →',
      },
      trustBlock,
    };
  }

  if (data.heating === 'oil') {
    return {
      householdSummary,
      profileLine: `Basierend auf deinen Angaben: ${householdSummary}`,
      situationTitle: 'Bei Heizöl liegt der kurzfristige Hebel eher im Einkauf als im Komplettumbau.',
      situationText:
        'Bevor du über neue Technik nachdenkst, lohnt sich meistens zuerst ein sauberer Blick auf den nächsten Kaufzeitpunkt und aktuelle Preise.',
      diagnosisTitle: 'Unsere Einschätzung für deinen Fall',
      diagnosisText:
        'Bei dir ist ein klassischer Tarifwechsel nicht die erste Frage. Wichtiger ist, ob du den nächsten Heizölkauf günstig und bewusst platzierst.',
      recommendationReason:
        'Heizöl-Haushalte haben ihren ersten Hebel oft beim Kaufzeitpunkt und beim Preisvergleich vor der nächsten Bestellung, nicht bei einer sofortigen Grundsatzentscheidung.',
      savingsHint: `Typische Marktspanne für Haushalte wie deinen: ${savingRangeText}. Auch das ist nur eine Marktgröße, nicht die Zusage für deine nächste Bestellung.`,
      mainRecommendation: {
        kind: 'compare',
        eyebrow: 'Unser empfohlener nächster Schritt',
        title: 'Heizöl-Preise gezielt vergleichen',
        description:
          'Das ist aktuell der direkteste Hebel. Erst den Einkauf sauber prüfen, dann über größere Investitionen nachdenken.',
        reason:
          'Bei Heizöl verändert ein kluger Kauf oft schneller etwas als ein aufgeschobener Technikplan.',
        href: '/tarif-vergleich#empfehlung',
        ctaLabel: 'Heizöl jetzt prüfen →',
      },
      alternativePath: {
        kind: 'understand',
        eyebrow: 'Alternative',
        title: 'Erst langfristige Wege besser verstehen',
        description:
          'Wenn du noch unsicher bist, ob für dich eher Einkauf oder Modernisierung die eigentliche Frage ist, hilft der Ratgeber zuerst mehr als ein Preisraum.',
        reason:
          'Das passt, wenn du die Lage erst sauber einordnen willst, bevor du handelst.',
        href: '/ratgeber/heizkosten-senken',
        ctaLabel: 'Mehr zur Einordnung →',
      },
      watcherFallback: {
        kind: 'watch',
        eyebrow: 'Noch nicht kaufen?',
        title: 'Dann lass dir den nächsten sinnvollen Moment lieber wieder vorlegen.',
        description:
          'Der Preis-Wächter erinnert dich, wenn ein neuer Check oder besserer Kaufzeitpunkt plausibler wird.',
        reason:
          'So musst du nicht selbst ständig Preise beobachten, wenn heute kein Handlungsdruck da ist.',
        href: '/preis-waechter',
        ctaLabel: 'Preis-Wächter aktivieren →',
      },
      trustBlock,
    };
  }

  if (data.heating === 'pellets') {
    return {
      householdSummary,
      profileLine: `Basierend auf deinen Angaben: ${householdSummary}`,
      situationTitle: 'Du bist bereits in einer vergleichsweise guten Ausgangslage.',
      situationText:
        'Der größte zusätzliche Hebel liegt bei dir wahrscheinlich nicht im Heizsystem, sondern eher beim Strom.',
      diagnosisTitle: 'Unsere Einschätzung für deinen Fall',
      diagnosisText:
        'Bei Pellet-Haushalten ist der große Systemwechsel oft schon passiert. Übrig bleibt eher ein gezielter Resthebel als eine neue Grundsatzentscheidung.',
      recommendationReason:
        'Der wahrscheinlich sinnvolle nächste Schritt ist hier enger als ein großer Heizvergleich. Deshalb empfehlen wir zuerst den Strom als naheliegenden Resthebel.',
      savingsHint: `Der naheliegende Resthebel liegt bei Haushalten wie deinem häufig grob bei ${electricityRangeText}. Das ist bewusst eine Spanne.`,
      mainRecommendation: {
        kind: 'compare',
        eyebrow: 'Unser empfohlener nächster Schritt',
        title: 'Stromtarif als Resthebel prüfen',
        description:
          'Du musst nicht alles neu denken. Wahrscheinlich reicht ein gezielter Stromvergleich als sinnvollster nächster Schritt.',
        reason:
          'Bei Pellet-Haushalten liegt der verbleibende Hebel oft eher beim Haushaltsstrom als im Heizsystem selbst.',
        href: '/tarif-vergleich#empfehlung',
        ctaLabel: 'Strom als nächsten Hebel prüfen →',
      },
      alternativePath: {
        kind: 'understand',
        eyebrow: 'Alternative',
        title: 'Erst die Kostenstruktur genauer verstehen',
        description:
          'Wenn du vor einem Vergleich lieber erst Ordnung in deine Kosten bringen willst, ist der Preisrechner die ruhigere Alternative.',
        reason:
          'Das passt, wenn du nicht direkt handeln, aber die Lage besser verstehen willst.',
        href: '/preisrechner',
        ctaLabel: 'Preisrechner öffnen →',
      },
      watcherFallback: {
        kind: 'watch',
        eyebrow: 'Noch nicht handeln?',
        title: 'Dann halte den Resthebel einfach im Blick, ohne heute etwas zu ändern.',
        description:
          'Der Preis-Wächter hält das Thema präsent und meldet sich, wenn ein neuer Check sinnvoll wird.',
        reason:
          'Das ist der ruhigere Weg, wenn du gerade keinen direkten Handlungsdruck verspürst.',
        href: '/preis-waechter',
        ctaLabel: 'Preis-Wächter aktivieren →',
      },
      trustBlock,
    };
  }

  if (data.heating === 'heatpump') {
    return {
      householdSummary,
      profileLine: `Basierend auf deinen Angaben: ${householdSummary}`,
      situationTitle: 'Dein Heizsystem ist schon effizient. Jetzt zählt vor allem, ob der Stromtarif dazu passt.',
      situationText:
        'Für Wärmepumpen-Haushalte liegt der wichtigste Hebel oft nicht mehr in der Technik, sondern im passenden Strompreis.',
      diagnosisTitle: 'Unsere Einschätzung für deinen Fall',
      diagnosisText:
        'Bei dir lohnt sich wahrscheinlich zuerst ein Check für Wärmepumpenstrom oder passende Stromtarife.',
      recommendationReason:
        'Viele Haushalte mit Wärmepumpe zahlen weiter normale Haushaltsstrompreise. Deshalb ist der Tarif oft naheliegender als jede weitere Technikfrage.',
      savingsHint: `Typische Marktspanne für Haushalte wie deinen: ${savingRangeText}. Das ist als ehrliche Richtung gemeint, nicht als versprochene Vertragsersparnis.`,
      mainRecommendation: {
        kind: 'compare',
        eyebrow: 'Unser empfohlener nächster Schritt',
        title: 'Wärmepumpenstrom gezielt prüfen',
        description:
          'Die Technik steht schon. Jetzt geht es darum, ob sie tariflich wirklich zu deinem Vorteil läuft.',
        reason:
          'Der Heiztyp ist klar und der wahrscheinlichste Hebel liegt direkt im passenden Stromtarif.',
        href: '/tarif-vergleich#empfehlung',
        ctaLabel: 'Passenden Tarif prüfen →',
      },
      alternativePath: {
        kind: 'understand',
        eyebrow: 'Alternative',
        title: 'Erst Strom- und Haushaltskosten besser verstehen',
        description:
          'Wenn du vor einem Vergleich noch tiefer in deine Zahlen schauen willst, ist der Preisrechner zuerst der ruhigere Weg.',
        reason:
          'Das passt, wenn du erst Ordnung in deine Kosten bringen willst, bevor du in Anbieter oder Services gehst.',
        href: '/preisrechner',
        ctaLabel: 'Preisrechner öffnen →',
      },
      watcherFallback: {
        kind: 'watch',
        eyebrow: 'Noch nicht wechseln?',
        title: 'Dann bleib lieber informiert, statt das Thema wieder komplett wegzulegen.',
        description:
          'Der Preis-Wächter übernimmt die Wiederkehr und erinnert dich, wenn ein neuer Check sinnvoll wird.',
        reason:
          'So bleibt das Thema präsent, ohne dass du heute schon eine Entscheidung treffen musst.',
        href: '/preis-waechter',
        ctaLabel: 'Preis-Wächter aktivieren →',
      },
      trustBlock,
    };
  }

  return {
    householdSummary,
    profileLine: `Basierend auf deinen Angaben: ${householdSummary}`,
    situationTitle: 'Ohne klaren Heiztyp ist zuerst Verstehen sinnvoller als ein direkter Vergleich.',
    situationText:
      'Wenn noch nicht sicher ist, wie dein Haushalt genau heizt, erzeugt ein sofortiger Anbieterraum eher neue Unsicherheit als Klarheit.',
    diagnosisTitle: 'Unsere Einschätzung für deinen Fall',
    diagnosisText:
      'Tarif-Vergleich wäre hier zu früh. Erst die Kostenlage besser verstehen, dann enger werden.',
    recommendationReason:
      'Ohne klaren Heiztyp könnten wir dir zwar viele Optionen zeigen, aber nicht glaubwürdig sagen, welche davon zuerst Sinn ergibt.',
    savingsHint: `Für Haushalte wie deinen gibt es wahrscheinlich ein Potenzial. Ohne klaren Heiztyp bleiben wir bewusst bei einer vorsichtigen Größenordnung von ${savingRangeText}.`,
    mainRecommendation: {
      kind: 'understand',
      eyebrow: 'Unser empfohlener nächster Schritt',
      title: 'Kosten und Verbrauch zuerst besser einordnen',
      description:
        'Der Preisrechner ist hier der sinnvollste nächste Schritt, bevor du Anbieter oder Services vergleichst.',
      reason:
        'Er hilft dir, die Struktur deiner Kosten zu verstehen, wenn dein Heizsystem noch nicht sicher genug für eine engere Empfehlung ist.',
      href: '/preisrechner',
      ctaLabel: 'Preisrechner öffnen →',
    },
    alternativePath: {
      kind: 'compare',
      eyebrow: 'Alternative',
      title: 'Trotzdem die volle Übersicht ansehen',
      description:
        'Wenn du dir lieber selbst erst einen Überblick verschaffen willst, kannst du direkt in die komplette Übersicht gehen.',
      reason:
        'Das ist kein enger geführter Weg, aber eine legitime Alternative, wenn du bewusst selbst sortieren möchtest.',
      href: '/tarif-vergleich#vollansicht',
      ctaLabel: 'Zur kompletten Übersicht →',
    },
    watcherFallback: {
      kind: 'watch',
      eyebrow: 'Noch nicht soweit?',
      title: 'Dann ist Beobachten gerade der ehrlichere Weg als Aktionismus.',
      description:
        'Der Preis-Wächter übernimmt die Wiederkehr für dich, bis dein nächster sinnvoller Schritt klarer ist.',
      reason:
        'So bleibt das Thema präsent, ohne dass du dich jetzt zu einem zu frühen Vergleich drängen musst.',
      href: '/preis-waechter',
      ctaLabel: 'Preis-Wächter aktivieren →',
    },
    trustBlock,
  };
}
