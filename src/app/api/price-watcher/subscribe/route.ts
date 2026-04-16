import { NextResponse } from 'next/server';

interface SubscribePayload {
  email?: string;
  source?: string;
}

const BREVO_API_URL = 'https://api.brevo.com/v3';

function getBrevoConfig() {
  return {
    apiKey: process.env.BREVO_API_KEY,
    listId: Number(process.env.BREVO_PRICE_WATCHER_LIST_ID),
    doiTemplateId: Number(process.env.BREVO_DOI_TEMPLATE_ID),
    doiRedirectUrl: process.env.BREVO_DOI_REDIRECT_URL,
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const { apiKey, listId, doiTemplateId, doiRedirectUrl } = getBrevoConfig();

  if (!apiKey || !listId) {
    return NextResponse.json(
      { ok: false, message: 'Preis-Wächter ist noch nicht vollständig eingerichtet.' },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as SubscribePayload | null;
  const email = body?.email?.trim().toLowerCase();
  const source = body?.source?.trim() || 'website';

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, message: 'Bitte gib eine gültige E-Mail-Adresse ein.' },
      { status: 400 },
    );
  }

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'api-key': apiKey,
  };

  try {
    if (doiTemplateId && doiRedirectUrl) {
      const doiResponse = await fetch(`${BREVO_API_URL}/contacts/doubleOptinConfirmation`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          includeListIds: [listId],
          templateId: doiTemplateId,
          redirectionUrl: doiRedirectUrl,
          attributes: {
            SOURCE: source,
          },
        }),
      });

      if (!doiResponse.ok) {
        const errorData = await doiResponse.json().catch(() => null);

        // Fall back to direct upsert if DOI is misconfigured or the attribute doesn't exist yet.
        if (!errorData) {
          throw new Error('Brevo DOI request failed');
        }
      } else {
        return NextResponse.json({
          ok: true,
          message: 'Bitte bestätige jetzt deine Anmeldung über die E-Mail von Brevo.',
        });
      }
    }

    const contactResponse = await fetch(`${BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (!contactResponse.ok) {
      const errorData = await contactResponse.json().catch(() => null);
      const code = errorData?.code as string | undefined;

      if (code === 'duplicate_parameter') {
        return NextResponse.json({
          ok: true,
          message: 'Diese E-Mail ist bereits für den Preis-Wächter eingetragen.',
        });
      }

      return NextResponse.json(
        { ok: false, message: 'Brevo konnte die Anmeldung gerade nicht annehmen.' },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Preis-Wächter aktiviert. Wir melden uns, sobald es relevant wird.',
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Die Anmeldung konnte gerade nicht abgeschlossen werden.' },
      { status: 500 },
    );
  }
}
