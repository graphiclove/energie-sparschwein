export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-b from-slate-900 to-slate-800 px-6 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Rechtliches</p>
          <h1 className="mt-4 text-4xl font-bold">Datenschutzerklärung</h1>
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-8 text-slate-600 leading-relaxed">

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. Datenschutz auf einen Blick</h2>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit deinen personenbezogenen Daten passiert,
                wenn du diese Website besuchst. Personenbezogene Daten sind alle Daten, mit denen du persönlich identifiziert werden kannst.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. Datenerfassung auf dieser Website</h2>
              <h3 className="font-semibold text-slate-800 mt-4 mb-1">Lokaler Speicher (localStorage)</h3>
              <p>
                Unser Spar-Check und Preisrechner speichern deine Eingaben (Postleitzahl, Wohnfläche, Heizungstyp) ausschließlich im
                lokalen Speicher deines Browsers (localStorage). Diese Daten verlassen deinen Browser nicht und werden nicht an unsere
                Server übertragen.
              </p>
              <h3 className="font-semibold text-slate-800 mt-4 mb-1">Server-Log-Dateien</h3>
              <p>
                Der Provider dieser Website erhebt und speichert automatisch Informationen in Server-Log-Dateien, die dein Browser
                automatisch übermittelt. Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer-URL,
                Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse.
              </p>
              <h3 className="font-semibold text-slate-800 mt-4 mb-1">Newsletter (Preis-Wächter)</h3>
              <p>
                Wenn du unseren Newsletter abonnierst, wird deine E-Mail-Adresse verarbeitet, um dir Preisbenachrichtigungen zu senden.
                Du kannst dich jederzeit über den Abmeldelink im Newsletter austragen. Wir nutzen Brevo (ehemals Sendinblue) als
                Versanddienstleister; es gilt deren Datenschutzerklärung.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">3. Externe Links & Affiliate-Partner</h2>
              <p>
                Diese Website enthält Links zu externen Vergleichsportalen (Verivox, CHECK24 u.a.). Wenn du diese Links nutzt und
                einen Vertrag abschließt, erhalten wir eine Provision. Die verlinkten Portale haben eigene Datenschutzerklärungen,
                die für deren Dienste gelten.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">4. Deine Rechte</h2>
              <p>
                Du hast jederzeit das Recht auf unentgeltliche Auskunft über deine gespeicherten personenbezogenen Daten, deren
                Herkunft und Empfänger sowie den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
                Hierzu sowie zu weiteren Fragen zum Thema Datenschutz kannst du dich jederzeit unter der im Impressum angegebenen
                Adresse an uns wenden.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">5. Kontakt</h2>
              <p>Bei Datenschutzfragen: hallo@energie-sparschwein.de</p>
              <p className="mt-2 text-sm text-slate-400">Stand: April 2026 (Platzhalter – vor Livegang durch Rechtsanwalt prüfen lassen)</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
