# Analytics Setup

Diese Website ist für Google Analytics 4 und Microsoft Clarity vorbereitet.

## Empfehlung

Nimm beides:

- `GA4` für Zahlen, Conversion-Pfade, Events und Reports
- `Clarity` für Heatmaps, Scrolltiefe und Session Recordings

Das ist kein Konflikt. Beide Tools können parallel laufen.

## Benötigt

Trage in `.env.local` deine GA4 Measurement ID ein:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
```

## Google Analytics 4 einrichten

### Wo du genau klicken musst

1. In Google Analytics einloggen
2. Unten links auf `Verwaltung`
3. Falls noch keine Property existiert:
   `Konto` auswählen oder anlegen → `Property erstellen`
4. In der Property-Spalte auf `Datenstreams`
5. `Web` auswählen
6. Deine Website-URL eingeben
7. Stream anlegen
8. Danach den Web-Stream öffnen
9. Oben rechts bzw. im Stream-Detail die `Mess-ID` kopieren, z. B. `G-ABC123XYZ9`

Diese ID kommt in:

```bash
NEXT_PUBLIC_GA_ID=G-ABC123XYZ9
```

## Microsoft Clarity einrichten

### Wo du genau klicken musst

1. Bei Microsoft Clarity einloggen
2. `New project` bzw. neues Projekt anlegen
3. Domain deiner Website eingeben
4. Projekt erstellen
5. In den Projekt-Einstellungen oder im Installationsdialog die `Project ID` kopieren

Diese ID kommt in:

```bash
NEXT_PUBLIC_CLARITY_ID=deine_project_id
```

## Danach

1. `.env.local` speichern
2. Dev-Server neu starten
3. Website einmal selbst aufrufen und durch den Funnel klicken
4. In GA4 und Clarity prüfen, ob erste Daten ankommen

Aktuelle Ziel-Domain:

```text
https://energiesparschwein.de
```

## Was jetzt bereits erfasst wird

- Seitenaufrufe auf allen Unterseiten
- Start des Spar-Checks
- Validierungsfehler bei leerer/ungültiger PLZ auf der Startseite
- Schrittaufrufe im Spar-Check
- Ergebnisansicht
- Klicks auf Affiliate-Karten
- Klick auf den optionalen Tarif-Vergleich

## GA4 Events

Diese Custom Events sind aktuell im Funnel eingebaut:

### `homepage_sparcheck_start`

Wird ausgelöst, wenn der Nutzer auf der Startseite den Spar-Check mit gültiger PLZ startet.

Parameter:
- `zip`
- `entry_point`

### `homepage_zip_validation_error`

Wird ausgelöst, wenn auf der Startseite ohne gültige PLZ abgeschickt wird.

Parameter:
- `zip_length`
- `entry_point`

### `spar_check_started`

Wird ausgelöst, wenn der eigentliche Spar-Check gestartet wird.

Parameter:
- `entry_point`
- `zip_present`

### `spar_check_step_view`

Wird für die einzelnen Schritte des Spar-Checks ausgelöst.

Parameter:
- `step`
- `step_index`
- `heating`
- `zip_present`
- `electricity_known`

### `spar_check_result_view`

Wird beim Ergebnis-Schritt ausgelöst.

Parameter:
- `step`
- `step_index`
- `heating`
- `zip_present`
- `electricity_known`

### `spar_check_affiliate_click`

Wird beim Klick auf eine Anbieter-Karte ausgelöst.

Parameter:
- `provider`
- `way`
- `heating`
- `zip_present`
- `target_host`

`way` ist entweder:
- `self_compare`
- `managed_service`

### `spar_check_tarifvergleich_click`

Wird ausgelöst, wenn im Ergebnis zusätzlich auf den optionalen Tarif-Vergleich geklickt wird.

Parameter:
- `heating`
- `zip_present`

## Was du in GA4 zuerst prüfen solltest

Sobald Daten reinkommen, schau dir zuerst diese Fragen an:

1. Wie viele Nutzer starten den Spar-Check von der Startseite?
2. Welche Schritte brechen Nutzer am häufigsten ab?
3. Wie viele Nutzer erreichen das Ergebnis?
4. Welche Anbieter-Karten werden am häufigsten geklickt?
5. Wird häufiger `self_compare` oder `managed_service` gewählt?
6. Welche Heiztypen führen zu den meisten Affiliate-Klicks?

## Hinweis zu Unterseiten

Zusätzliche Unterseiten sind kein Problem. Solange sie unter derselben Domain laufen, werden sie in derselben GA4-Property als normale Seitenpfade erfasst.

Dasselbe gilt für Clarity: weitere Unterseiten derselben Website erscheinen automatisch im selben Projekt.
