"use client";

import Link from "next/link";

type Topic = {
  title: string;
  subtitle: string;
  emoji: string;
  href: string;
  bullets: string[];
};

const topics: Topic[] = [
  {
    emoji: "🍇",
    title: "Cépage",
    subtitle: "Comprendre ce que c’est, ce que ça dit (et ce que ça ne dit pas).",
    href: "/learn/basics/grape",
    bullets: ["Définition simple", "Cépage ≠ goût garanti", "Exemples connus", "Pièges fréquents"],
  },
  {
    emoji: "📍",
    title: "Région vs Appellation",
    subtitle: "Large vs précis : comment lire l’origine sans se perdre.",
    href: "/learn/basics/region-appellation",
    bullets: ["Région (large)", "Appellation (règles)", "Exemples", "Indice de style"],
  },
  {
    emoji: "🗓️",
    title: "Millésime",
    subtitle: "Pourquoi une année change (parfois) tout.",
    href: "/learn/basics/vintage",
    bullets: ["Année de récolte (souvent)", "Impact climat", "Quand ça compte beaucoup", "Repères simples"],
  },
  {
    emoji: "🏷️",
    title: "Lire une étiquette",
    subtitle: "Les 4 infos à repérer en 15 secondes.",
    href: "/learn/basics/label",
    bullets: ["Origine", "Millésime", "Producteur", "Alcool"],
  },
];

function TopicCard({ t }: { t: Topic }) {
  return (
    <Link
      href={t.href}
      className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/30 text-xl">
            {t.emoji}
          </div>
          <div>
            <div className="text-lg font-semibold text-white">{t.title}</div>
            <div className="mt-1 text-sm text-white/65">{t.subtitle}</div>
          </div>
        </div>
        <div className="text-sm font-semibold text-white/80 group-hover:translate-x-1 transition">
          →
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {t.bullets.map((b) => (
          <span
            key={b}
            className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70"
          >
            {b}
          </span>
        ))}
      </div>

      <div className="mt-5 text-sm font-semibold text-white/85">Ouvrir le guide</div>
    </Link>
  );
}

export default function LearnBasicsHubPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <div className="text-sm font-semibold text-white/70">Module 1</div>
          <h1 className="mt-2 text-4xl font-semibold md:text-5xl">🍇 Les bases du vin</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Choisis un sujet. Chaque guide est complet, illustré (bientôt), puis tu peux te tester.
          </p>

          <div className="mt-6 flex gap-2 flex-wrap">
            <Link
              href="/learn"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/30"
            >
              ← Retour à l’Académie
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {topics.map((t) => (
            <TopicCard key={t.href} t={t} />
          ))}
        </div>
      </div>
    </main>
  );
}
