"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import SiteHeader from "@/components/ui/SiteHeader";

type Q = {
  id: string;
  question: string;
  answers: { label: string; correct: boolean; why: string }[];
};

const STORAGE_KEY = "learn:basics:region:quiz";
const PASS_SCORE = 4;
const XP_PER_CORRECT = 10;

const BASE_QUESTIONS: Q[] = [
  {
    id: "region-1",
    question: "Une région viticole, c’est…",
    answers: [
      {
        label: "Une zone large (ex : Bordeaux, Bourgogne)",
        correct: true,
        why: "Oui : la région donne un cadre géographique et des styles fréquents.",
      },
      {
        label: "Une règle officielle obligatoire",
        correct: false,
        why: "Non : ça correspond plutôt à l’idée d’appellation/cahier des charges.",
      },
      {
        label: "Le nom du producteur",
        correct: false,
        why: "Non : ça, c’est le domaine/le producteur.",
      },
    ],
  },
  {
    id: "region-2",
    question: "Une appellation, c’est…",
    answers: [
      {
        label: "Une zone plus précise + des règles (cépages, rendements, etc.)",
        correct: true,
        why: "Exact : appellation = aire délimitée + cahier des charges.",
      },
      {
        label: "Toujours un seul cépage",
        correct: false,
        why: "Non : certaines autorisent plusieurs cépages (assemblages).",
      },
      {
        label: "La couleur du vin (rouge/blanc/rosé)",
        correct: false,
        why: "Non : la couleur n’est pas la définition d’une appellation.",
      },
    ],
  },
  {
    id: "region-3",
    question: "Laquelle des infos est en général la plus “cadrante” sur le style ?",
    answers: [
      {
        label: "L’appellation",
        correct: true,
        why: "Souvent : règles + zone précise → style plus identifiable.",
      },
      {
        label: "La région uniquement",
        correct: false,
        why: "La région est utile, mais souvent trop large pour être très précise.",
      },
      {
        label: "Le code-barres",
        correct: false,
        why: "Ça ne donne aucune info sur le style.",
      },
    ],
  },
  {
    id: "region-4",
    question: "Vrai ou faux : “Bordeaux” (tout seul) est une appellation unique.",
    answers: [
      {
        label: "Vrai",
        correct: false,
        why: "Faux : Bordeaux est une région et contient de nombreuses appellations.",
      },
      {
        label: "Faux",
        correct: true,
        why: "Exact : il y a plein d’appellations à l’intérieur.",
      },
    ],
  },
  {
    id: "region-5",
    question: "Même appellation… deux vins peuvent être très différents surtout à cause de…",
    answers: [
      {
        label: "Le producteur et la vinification",
        correct: true,
        why: "Oui : style, élevage, maturité… le producteur fait souvent la différence.",
      },
      {
        label: "La forme de la bouteille uniquement",
        correct: false,
        why: "Non : ce n’est pas un facteur fiable.",
      },
      {
        label: "Le prix de l’étiquette",
        correct: false,
        why: "Le prix ne garantit pas un style précis.",
      },
    ],
  },
];

type ModuleProgress = {
  passed: boolean;
  bestScore: number;
  attempts: number;
  xp: number;
};

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function readProgress(): ModuleProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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

function writeProgress(next: ModuleProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function Medal({ label = "Module validé" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-100">
      <span className="grid h-6 w-6 place-items-center rounded-full border border-emerald-300/20 bg-emerald-400/10">
        🏅
      </span>
      {label}
    </span>
  );
}

export default function RegionQuizPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [questions, setQuestions] = useState<Q[]>(() => shuffle(BASE_QUESTIONS));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);

  const [xpKey, setXpKey] = useState(0);
  const [shake, setShake] = useState(false);
  const [pop, setPop] = useState(false);

  const [progress, setProgress] = useState<ModuleProgress | null>(null);

  useEffect(() => {
    setProgress(readProgress() ?? { passed: false, bestScore: 0, attempts: 0, xp: 0 });
  }, []);

  const total = questions.length;
  const done = i >= total;
  const current = questions[Math.min(i, total - 1)];
  const success = done && score >= PASS_SCORE;

  function safeConfetti(opts: Parameters<typeof confetti>[0]) {
    if (!mounted) return;
    confetti(opts);
  }

  function shootSmall() {
    safeConfetti({
      particleCount: 18,
      spread: 35,
      startVelocity: 18,
      origin: { x: 0.85, y: 0.25 },
    });
  }

  function shootBig() {
    if (!mounted) return;
    const end = Date.now() + 900;
    const tick = () => {
      confetti({
        particleCount: 45,
        spread: 65,
        startVelocity: 28,
        origin: { x: 0.5, y: 0.2 },
      });
      if (Date.now() < end) requestAnimationFrame(tick);
    };
    tick();
  }

  useEffect(() => {
    if (!success) return;
    shootBig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  useEffect(() => {
    if (!done) return;
    if (!progress) return;

    const next: ModuleProgress = {
      attempts: progress.attempts + 1,
      bestScore: Math.max(progress.bestScore, score),
      passed: progress.passed || score >= PASS_SCORE,
      xp: progress.xp + earnedXp,
    };

    writeProgress(next);
    setProgress(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function choose(answerIdx: number) {
    if (picked !== null || done) return;

    setPicked(answerIdx);
    const ans = current.answers[answerIdx];

    if (ans.correct) {
      setScore((s) => s + 1);
      setEarnedXp((x) => x + XP_PER_CORRECT);

      setPop(true);
      setXpKey((k) => k + 1);
      window.setTimeout(() => setPop(false), 220);

      shootSmall();
    } else {
      setShake(true);
      window.setTimeout(() => setShake(false), 260);
    }
  }

  function next() {
    if (picked === null) return;
    setPicked(null);
    setI((x) => x + 1);
  }

  function restart() {
    setQuestions(shuffle(BASE_QUESTIONS));
    setI(0);
    setPicked(null);
    setScore(0);
    setEarnedXp(0);
    setShake(false);
    setPop(false);
  }

  const answeredCount = Math.min(total, i + (picked !== null ? 1 : 0));
  const progressPct = Math.round((answeredCount / total) * 100);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <SiteHeader />

      <style jsx global>{`
        .shake { animation: shake 0.25s ease-in-out; }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
        .xp-float { animation: xpfloat 0.8s ease-out forwards; }
        @keyframes xpfloat {
          0% { opacity: 0; transform: translateY(6px) scale(0.98); }
          15% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-18px) scale(1.02); }
        }
        .win-card { animation: wincard 0.38s ease-out both; }
        @keyframes wincard {
          0% { opacity: 0; transform: translateY(10px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm font-semibold text-white/70">Quiz</div>
              {progress?.passed ? <Medal /> : null}
            </div>
            <h1 className="mt-2 text-4xl font-semibold">📍 Région vs Appellation — Se tester</h1>
            <p className="mt-3 text-white/70">
              5 questions, feedback immédiat, XP & confettis ✨
            </p>
          </div>

          <Link
            href="/learn/basics/region-appellation"
            className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/30"
          >
            ← Guide
          </Link>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Progression</span>
            <span>{done ? "Terminé" : `Question ${i + 1}/${total}`}</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/70 transition-all duration-300"
              style={{ width: `${done ? 100 : progressPct}%` }}
            />
          </div>
        </div>

        <div className={`mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 ${shake ? "shake" : ""}`}>
          {done ? (
            <div className={success ? "win-card" : ""}>
              <div className="text-xl font-semibold">{success ? "🎉 Bravo !" : "Résultat"}</div>
              <div className="mt-2 text-white/70">
                Score : <span className="font-semibold text-white">{score}/{total}</span>
                <span className="text-white/40"> · </span>
                {success ? (
                  <span className="text-emerald-200">Réussi (≥ {PASS_SCORE})</span>
                ) : (
                  <span className="text-rose-200">À retenter (objectif {PASS_SCORE}/{total})</span>
                )}
              </div>

              <div className="mt-2 text-sm text-white/70">
                XP gagné : <span className="text-white font-semibold">+{earnedXp}</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/learn/basics"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
                >
                  Retour aux Bases →
                </Link>

                <button
                  type="button"
                  onClick={restart}
                  className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/85 hover:border-white/30"
                >
                  Refaire le quiz
                </button>

                {success && (
                  <Link
                    href="/learn/basics/vintage"
                    className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/85 hover:border-white/30"
                  >
                    Continuer (Millésime) →
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">
                  Question {i + 1}/{total}
                </div>

                <div className="relative text-sm text-white/60">
                  Score: {score} <span className="text-white/30">·</span> XP: {earnedXp}
                  {pop && (
                    <span
                      key={xpKey}
                      className="xp-float absolute -right-2 -top-5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-100"
                    >
                      +{XP_PER_CORRECT} XP
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 text-lg font-semibold">{current.question}</div>

              <div className="mt-4 grid gap-2">
                {current.answers.map((a, idx) => {
                  const show = picked !== null;
                  const isPicked = picked === idx;

                  const cls =
                    show && isPicked
                      ? a.correct
                        ? "border-emerald-400/30 bg-emerald-500/10"
                        : "border-rose-400/30 bg-rose-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]";

                  return (
                    <button
                      key={`${current.id}-${idx}`}
                      type="button"
                      onClick={() => choose(idx)}
                      className={`text-left rounded-2xl border px-4 py-3 text-sm text-white/85 transition ${cls}`}
                    >
                      {a.label}
                      {show && isPicked && (
                        <div className="mt-2 text-xs text-white/70">{a.why}</div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-white/55">
                  Clique une réponse pour voir l’explication.
                </div>

                <button
                  type="button"
                  onClick={next}
                  disabled={picked === null}
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}
        </div>

        {!done && (
          <div className="mt-4 text-xs text-white/50">
            Objectif : {PASS_SCORE}/{total} pour valider le module.
          </div>
        )}
      </div>
    </main>
  );
}
