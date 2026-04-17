import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geschützter Zugang",
  robots: {
    index: false,
    follow: false,
  },
};

type PreviewPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const { error, next } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : "/";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-12">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-300">
            Wechselbiber
          </p>
          <h1 className="mt-4 text-3xl font-semibold">Geschützter Zugang</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Diese Vorschau ist noch nicht öffentlich. Bitte gib das Passwort ein, um die Seite zu öffnen.
          </p>

          <form action="/api/preview-login" method="post" className="mt-8 space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Passwort</span>
              <input
                name="password"
                type="password"
                required
                autoFocus
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-base text-white outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400"
                placeholder="Passwort eingeben"
              />
            </label>

            {error ? (
              <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                Das Passwort war nicht korrekt.
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Seite öffnen
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
