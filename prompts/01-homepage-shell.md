# Wechselbiber Prompt: Homepage Shell

Du arbeitest im Projekt `Wechselbiber`.

## Ziel dieser Aufgabe

Baue **nicht** die komplette Produktwelt um.

Bearbeite nur die **Startseite als Shell des Kernfunnels**:

`Startseite -> Spar-Check -> Ergebnis -> sinnvoller naechster Schritt`

Die Startseite soll danach klarer sein als heute:

- weniger Tool-Hub
- weniger Portal-Eindruck
- mehr Vertrauen
- klarerer Einstieg in den Spar-Check

## Wichtiger Produktkontext

Wechselbiber ist **kein Vergleichsportal**, sondern ein **Kosten-Dolmetscher fuer Energie**.

Das bedeutet fuer die Startseite:

- nicht moeglichst viele Wege gleichzeitig zeigen
- nicht Tarif-Vergleich frueh pushen
- nicht Mikro-Tools auf dieselbe Ebene wie den Hauptweg setzen
- sondern: Produkt erklaeren, Vertrauen aufbauen, in den Spar-Check fuehren

## Lies zuerst

Bevor du aenderst, nutze diese Dateien als Grundlage:

- `AGENTS.md`
- `docs/product-principles.md`
- `docs/information-architecture.md`
- `docs/implementation-plan.md`
- `docs/page-briefs/startseite.md`

## Relevante bestehende Dateien

Arbeite vor allem mit:

- `src/app/page.tsx`
- `src/components/Navbar.tsx`
- ggf. bestehende Komponenten, die bereits auf der Startseite genutzt werden

## Problem im aktuellen Stand

Die aktuelle Startseite will zu viel gleichzeitig sein:

- Hero / Funnel-Einstieg
- Tool-Hub
- Ratgeber-Einstieg
- Preis-Waechter
- Vertrauensseite

Dadurch entstehen:

- zu viele gleich starke Einstiege
- zu fruehe Sichtbarkeit von Tarif-Vergleich und Mikro-Tools
- zu wenig Klarheit, was der erste sinnvolle Schritt ist

## Was auf der neuen Homepage primaer bleiben muss

1. Produktversprechen:
   Wechselbiber hilft Nutzern zu verstehen, welcher Energie-Schritt fuer ihren Haushalt jetzt wirklich sinnvoll ist.

2. Primaerer CTA:
   `Spar-Check starten`

3. Sekundaerer CTA:
   `Preis-Waechter aktivieren`

4. Vertrauen:
   Der Nutzer soll frueh verstehen:
   - wir sind nicht einfach ein Vergleichsportal
   - man muss nicht sofort wechseln
   - wir erklaeren zuerst, dann wird gehandelt

## Was auf der Homepage sekundaer werden muss

- `Tarif-Vergleich`
- `Preisrechner`
- Mikro-Tools
- breite Tool-Galerien
- mehrere gleich starke CTA-Flaechen

Diese Inhalte duerfen bleiben, aber nur sichtbar nachgeordnet.

## Inhaltliche Leitlinie fuer die Seite

Die Homepage soll in wenigen Sekunden beantworten:

1. Was ist Wechselbiber?
2. Warum ist das nicht einfach ein Vergleichsportal?
3. Warum ist der Spar-Check der logische erste Schritt?
4. Was passiert, wenn ich noch nicht wechseln will?

## Erwartete Struktur

Arbeite auf eine klare Shell-Struktur hin:

1. Hero
   - klares Kosten-Dolmetscher-/Sparpfad-Versprechen
   - primaerer CTA: `Spar-Check starten`
   - sekundaerer CTA: `Preis-Waechter aktivieren`
   - kurze Trust-Hinweise

2. Kurze Erklaerung: Wie Wechselbiber funktioniert
   - zuerst verstehen
   - dann einordnen
   - dann sinnvoll handeln

3. Warum das hilfreich ist
   - Unsicherheit reduzieren
   - nicht sofort zu einem Anbieter gedrueckt werden
   - Orientierung vor Vergleich

4. Preis-Waechter als bewusste Nicht-Jetzt-Option
   - fuer Nutzer, die noch nicht wechseln wollen

5. Vertrauensblock
   - transparente Haltung
   - Provisionen offen benennen
   - Hilfe statt Druck

Weitere Inhalte nur, wenn sie den Hauptweg klar stuetzen.

## Wichtige Regeln fuer die Umsetzung

- Ein Screen, ein primaerer CTA
- Kein neues Dependency
- Bestehende Projektkonventionen nutzen
- Mobil zuerst, Desktop nicht brechen
- Keine visuelle Komplexitaet aufblasen
- Nicht mehr Features auf die Homepage ziehen
- Nicht die komplette IA in dieser Aufgabe loesen

## Was du vermeiden sollst

- Tool-Kacheln als dominante Fruehsektion
- Vergleichsportal-Sprache
- zu viele gleich starke Buttons
- generische Marketing-Claims ohne Produktlogik
- "mehr ist besser"-Layout

## Erwartete Arbeitsweise

1. Beschreibe kurz, was aktuell auf der Startseite nicht funktioniert
2. Beschreibe die neue Shell-Logik
3. Setze sie gezielt in `src/app/page.tsx` um
4. Wenn noetig, passe die Navigation nur so weit an, wie es fuer die neue Priorisierung noetig ist
5. Fuehre danach aus:
   - `pnpm lint`
   - `pnpm exec tsc --noEmit`
   - `pnpm build`

## Done means

Die Aufgabe ist gut geloest, wenn:

- die Startseite klarer in den Spar-Check fuehrt als vorher
- Preis-Waechter sichtbar als bewusste Alternative funktioniert
- Tarif-Vergleich und Mikro-Tools nicht mehr die gleiche Prioritaet haben
- die Seite sich mehr wie Produktfuehrung und weniger wie ein Tool-/Portal-Hub anfuehlt

## Erwartete Ausgabe

Antworte bevorzugt in dieser Struktur:

1. Was auf der alten Homepage nicht funktioniert
2. Welche Struktur du jetzt umgesetzt hast
3. Welche Dateien du geaendert hast und warum
4. Ergebnis der Checks
