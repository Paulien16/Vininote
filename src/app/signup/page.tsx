import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Créer un compte</h1>
          <p className="mt-2 text-white/70">
            Pour l’instant c’est une démo UI. L’authentification arrive bientôt.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <label className="block text-sm text-white/80">Email</label>
          <input
            type="email"
            placeholder="toi@mail.com"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white placeholder:text-white/40"
          />

          <label className="mt-5 block text-sm text-white/80">Mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white placeholder:text-white/40"
          />

          <button
            type="button"
            disabled
            className="mt-6 w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-900 opacity-60"
            title="Bientôt disponible"
          >
            Créer mon compte (bientôt)
          </button>

          <div className="mt-4 text-center text-sm text-white/70">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-white underline underline-offset-4">
              Se connecter
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-white/70 hover:text-white underline underline-offset-4"
          >
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
