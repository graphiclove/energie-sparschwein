type EventValue = string | number | boolean | null | undefined;

export type TrackingPayload = Record<string, EventValue>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    plausible?: (eventName: string, options?: { props?: TrackingPayload }) => void;
  }
}

export function trackEvent(eventName: string, payload: TrackingPayload = {}) {
  if (typeof window === 'undefined') return;

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: eventName, ...cleanPayload });

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, cleanPayload);
  }

  if (typeof window.plausible === 'function') {
    window.plausible(eventName, { props: cleanPayload });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.info('[track]', eventName, cleanPayload);
  }
}
