# Wechselbiber Foundation Prompt

Du arbeitest im Projekt `Wechselbiber`.

## Produktkern

Wechselbiber ist **kein Vergleichsportal**, sondern ein **Kosten-Dolmetscher fuer Energie**.

Die Produktidee ist:
- Nutzer bei Energieentscheidungen klar fuehren
- Unsicherheit reduzieren
- den naechsten sinnvollen Schritt erklaeren
- Vertrauen direkt im Funnel aufbauen
- Wechsel nicht pushen, sondern einordnen

## Kernfunnel

Der wichtigste Weg ist immer:

`Startseite -> Spar-Check -> Ergebnis -> naechster sinnvoller Schritt`

Regeln:
- Ein Screen hat nur **einen primaeren CTA**
- `Tarif-Vergleich` ist **nie** der erste Default-Weg
- `Preis-Waechter` ist die explizite **"noch nicht wechseln"**-Option
- Mikro-Tools bleiben sekundaer und duerfen den Kernfunnel nicht dominieren

## Aktueller Kontext

Das Projekt ist ein Next.js-App-Router-Projekt mit:
- Next.js 16
- React 19
- TypeScript
- Tailwind 4

Wichtige Bereiche:
- `src/app/page.tsx`
- `src/app/spar-check/page.tsx`
- `src/app/tarif-vergleich/page.tsx`
- `src/app/preis-waechter/page.tsx`
- `docs/visual-system.md`
- `docs/analytics.md`
- `AGENTS.md`

## Visuelle und inhaltliche Richtung

Wechselbiber soll:
- warm
- klar
- menschlich
- editorial
- ruhig
- vertrauenswuerdig

wirken, nicht:
- generisch
- wie ein Vergleichsportal
- wie ein Lead-Formular mit Affiliate-Absicht

Die Copy soll immer:
- Nutzen klar erklaeren
- Unsicherheit benennen
- den naechsten Schritt verstaendlich machen

## Arbeitsregeln

- Lies vor groesseren Aenderungen die Dateien in `docs/`.
- Nutze bestehende Projektkonventionen und vorhandene Komponenten.
- Fuege keine neuen Dependencies hinzu, wenn bestehende Mittel reichen.
- Arbeite mobil zuerst, ohne Desktop zu brechen.
- Halte die UI bewusst einfach.
- Vertrauen muss im Funnel sichtbar sein, nicht nur auf `/ueber-uns`.
- Keine unnötige visuelle Komplexitaet.

## Done means

Eine Aufgabe gilt nur dann als wirklich gut geloest, wenn:
- der primaere Nutzerweg klarer ist als vorher
- der Screen besser fuehrt als vorher
- die Empfehlung plausibler wirkt
- der Nutzer sich eher beraten als gedrueckt fuehlt

## Erwartete Arbeitsweise

Wenn du an einer groesseren Aufgabe arbeitest:
1. Beschreibe zuerst kurz die bestehende Lage
2. Benenne die Hauptprobleme
3. Schlage eine klare Struktur oder Richtung vor
4. Setze dann gezielt um
5. Halte die Antwort konkret und nicht abstrakt

## Erwartete Ausgabe

Wenn du analysierst oder vorschlaegst, antworte bevorzugt in dieser Struktur:

1. Was aktuell nicht funktioniert
2. Was geaendert werden sollte
3. Warum diese Aenderung dem Kernfunnel hilft
4. Welche Dateien betroffen sind

Wenn du implementierst:
- arbeite konkret
- aendere nicht unnoetig viele Dinge auf einmal
- mache den primaeren Weg klarer
