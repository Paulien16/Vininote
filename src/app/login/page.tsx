"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setUser } from "@/lib/user";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    const cleanName =
      name.trim() || cleanEmail.split("@")[0]?.slice(0, 24) || "Utilisateur";

    setUser({
      id: crypto.randomUUID(),
      name: cleanName,
      email: cleanEmail,
      bio: "",
      photoUrl: null,
    });

    router.push("/"); // retour home -> header passe en avatar automatiquement
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">

      <div className="mx-auto max-w-md px-6 py-14">
        <h1 className="text-3xl font-semibold">Se connecter</h1>
        <p className="mt-2 text-white/70">Mode démo : session locale (pas de backend).</p>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6"
        >
          <label className="block text-sm text-white/75">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
            placeholder="toi@mail.com"
          />

          <label className="mt-5 block text-sm text-white/75">Nom (optionnel)</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
            placeholder="Paulien"
          />

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
          >
            Se connecter
          </button>

          <div className="mt-4 text-center text-sm text-white/65">
            Pas de compte ?{" "}
            <Link href="/signup" className="text-white underline underline-offset-4">
              Créer un compte
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
