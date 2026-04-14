# Energie-Sparschwein

## Projekt
Energiespar-Portal für deutsche Verbraucher. Positionierung als "Kosten-Dolmetscher".
Monetarisierung über Verivox/CHECK24 Affiliate-Provisionen.

## Tech-Stack
- Next.js 14 (App Router) mit TypeScript
- Tailwind CSS
- Supabase (Datenbank)
- Vercel (Hosting)
- Brevo (Newsletter)
- Tankerkönig API (Spritpreise)
- Verivox iFrame (Gas/Strom-Vergleich)

## Befehle
- npm run dev → Entwicklungsserver (Port 3000)
- npm run build → Produktions-Build
- npm run lint → Code prüfen

## Konventionen
- Deutsche Sprache für alle UI-Texte
- Mobile-first Design
- DSGVO-konform (Cookie-Consent, Double-Opt-In)
- API-Keys nur in .env.local, NIE im Frontend
- Affiliate-Links als Werbung kennzeichnen

## Farbschema
- Primär: Warmes Grün (#22c55e) → Sparen
- Sekundär: Dunkelblau (#1e3a5f) → Vertrauen
- Akzent: Orange (#f59e0b) → CTAs
- Hintergrund: Warmweiß (#fafaf8)
