"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Topic = {
  title: string;
  subtitle: string;
  emoji: string;
  href: string;
  bullets: string[];
  // clé localStorage du quiz associé (optionnel si pas encore de quiz)
  progressKey?: string;
};

// ✅ mêmes clés que dans ton quiz (grape)
// tu pourras ajouter les autres au fur et à mesure
const MODULE_KEYS = {
  grapeQuiz: "learn:basics:grape:quiz",
  // regionQuiz: "learn:basics:region:quiz",
  // vintageQuiz: "learn:basics:vintage:quiz",
  // labelQuiz: "learn:basics:label:quiz",
} as const;

type ModuleProgress = {
  passed: boolean;
  bestScore: number;
  attempts: number;
  xp: number;
};

function readProgress(key?: string): ModuleProgress | null {
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return {
      passed: Boolean(p?.passed),
      bestScore: Number(p?.bestScore ?? 0),
      attempts: Number(p?.attempts ?? 0),
      xp: Number(p?.xp ?? 0),
    };
  } catch {
    return null;
  }
}

const topics: Topic[] = [
  {
    emoji: "🍇",
    title: "Cépage",
    subtitle: "Comprendre ce que c’est, ce que ça dit (et ce que ça ne dit pas).",
    href: "/learn/basics/grape",
    bullets: ["Définition simple", "Cépage ≠ goût garanti", "Exemples connus", "Pièges fréquents"],
    progressKey: MODULE_KEYS.grapeQuiz,
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

function Medal({ label = "Validé" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-100">
      {/* mini médaille */}
      <span className="grid h-6 w-6 place-items-center rounded-full border border-emerald-300/20 bg-emerald-400/10">
        🏅
      </span>
      {label}
    </span>
  );
}

function ProgressPill({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs text-white/70">
      <span className="font-semibold text-white/80">
        Progression : {done}/{total}
      </span>
      <span className="text-white/30">·</span>
      <div className="h-2 w-28 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white/70 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function TopicCard({
  t,
  p,
}: {
  t: Topic;
  p: ModuleProgress | null;
}) {
  const validated = Boolean(p?.passed);

  return (
    <Link
      href={t.href}
      className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      {/* Badge en haut à droite */}
      <div className="absolute right-4 top-4">
        {validated ? <Medal /> : null}
      </div>

      <div className="flex items-start justify-between gap-4 pr-20">
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

      {/* Mini stats (optionnel) */}
      {p ? (
        <div className="mt-4 text-xs text-white/50">
          Best: <span className="text-white/70 font-semibold">{p.bestScore}/5</span>{" "}
          <span className="text-white/20">·</span>{" "}
          XP: <span className="text-white/70 font-semibold">{p.xp}</span>{" "}
          <span className="text-white/20">·</span>{" "}
          Tentatives: <span className="text-white/70 font-semibold">{p.attempts}</span>
        </div>
      ) : (
        <div className="mt-4 text-xs text-white/40">
          Quiz à venir / pas encore de progression.
        </div>
      )}

      <div className="mt-5 text-sm font-semibold text-white/85">
        Ouvrir le guide
      </div>
    </Link>
  );
}

export default function LearnBasicsHubPage() {
  const [progressMap, setProgressMap] = useState<Record<string, ModuleProgress | null>>({});

  useEffect(() => {
    const map: Record<string, ModuleProgress | null> = {};
    for (const t of topics) {
      if (t.progressKey) {
        map[t.href] = readProgress(t.progressKey);
      } else {
        map[t.href] = null;
      }
    }
    setProgressMap(map);

    // Bonus UX : si tu reviens sur la page après le quiz, on refresh auto
    function onFocus() {
      const refreshed: Record<string, ModuleProgress | null> = {};
      for (const t of topics) {
        refreshed[t.href] = t.progressKey ? readProgress(t.progressKey) : null;
      }
      setProgressMap(refreshed);
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const { doneCount, totalCount } = useMemo(() => {
    const withQuiz = topics.filter((t) => Boolean(t.progressKey));
    const done = withQuiz.filter((t) => progressMap[t.href]?.passed).length;
    return { doneCount: done, totalCount: withQuiz.length };
  }, [progressMap]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-white/70">Module 1</div>
              <h1 className="mt-2 text-4xl font-semibold md:text-5xl">
                🍇 Les bases du vin
              </h1>
              <p className="mt-3 max-w-2xl text-white/70">
                Choisis un sujet. Chaque guide est complet, puis tu peux te tester.
              </p>
            </div>

            {/* Progression globale (option 3) */}
            <ProgressPill done={doneCount} total={totalCount} />
          </div>

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
            <TopicCard key={t.href} t={t} p={progressMap[t.href] ?? null} />
          ))}
        </div>

        {/* Petit hint pour la suite */}
        <div className="mt-8 text-xs text-white/45">
          Astuce : quand tu ajouteras les quiz des autres modules, donne-leur une
          clé localStorage (ex : <span className="text-white/60">learn:basics:region:quiz</span>)
          et tu auras automatiquement les médailles + la progression globale.
        </div>
      </div>
    </main>
  );
}
