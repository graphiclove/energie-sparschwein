export interface PriceWatcherSubscribeInput {
  email: string;
  source: string;
}

export interface PriceWatcherSubscribeResult {
  ok: boolean;
  message?: string;
}

export async function subscribeToPriceWatcher(
  input: PriceWatcherSubscribeInput,
): Promise<PriceWatcherSubscribeResult> {
  const response = await fetch('/api/price-watcher/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json().catch(() => null)) as PriceWatcherSubscribeResult | null;

  if (!response.ok) {
    return {
      ok: false,
      message: data?.message ?? 'Die Anmeldung konnte gerade nicht abgeschlossen werden.',
    };
  }

  return {
    ok: true,
    message: data?.message,
  };
}
