"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";

type Q = {
  id: string;
  question: string;
  answers: { label: string; correct: boolean; why: string }[];
};

const STORAGE_KEY = "learn:basics:grape:quiz"; // state du module
const PASS_SCORE = 4; // >=4/5 = réussite
const XP_PER_CORRECT = 10;

const BASE_QUESTIONS: Q[] = [
  {
    id: "grape-1",
    question: "Un cépage, c’est…",
    answers: [
      {
        label: "Une variété de raisin (ex : Syrah, Chardonnay)",
        correct: true,
        why: "Oui. Cépage = variété de raisin (la “matière première” du vin).",
      },
      {
        label: "Une région viticole (ex : Bordeaux)",
        correct: false,
        why: "Non. Ça, c’est une région viticole (un lieu).",
      },
      {
        label: "Une appellation (ex : Chablis)",
        correct: false,
        why: "Non. Ça, c’est une appellation (une zone + règles).",
      },
    ],
  },
  {
    id: "grape-2",
    question:
      "Vrai ou faux : si je connais le cépage, je connais forcément le goût du vin.",
    answers: [
      {
        label: "Vrai",
        correct: false,
        why: "Faux : climat, sol, maturité et vinification changent énormément le résultat.",
      },
      {
        label: "Faux",
        correct: true,
        why: "Exact : le cépage donne des indices, pas une certitude.",
      },
    ],
  },
  {
    id: "grape-3",
    question:
      "Parmi ces éléments, lequel peut le plus changer le style d’un même cépage ?",
    answers: [
      {
        label: "Le climat et le lieu",
        correct: true,
        why: "Oui : climat frais vs chaud → acidité, maturité, arômes, alcool… tout change.",
      },
      {
        label: "Le nom du domaine uniquement",
        correct: false,
        why: "Le producteur compte, mais le lieu/climat et le style de vinif sont majeurs.",
      },
      {
        label: "La couleur de l’étiquette",
        correct: false,
        why: "Non : c’est du marketing, pas une info fiable sur le style.",
      },
    ],
  },
  {
    id: "grape-4",
    question:
      "Lequel de ces cépages est souvent associé à des tanins plus présents ?",
    answers: [
      {
        label: "Syrah",
        correct: true,
        why: "Souvent : structure + tanins présents (selon style).",
      },
      {
        label: "Sauvignon Blanc",
        correct: false,
        why: "Blanc : pas de tanins marqués comme un rouge.",
      },
      {
        label: "Chardonnay",
        correct: false,
        why: "Blanc : pas de tanins marqués (ou très faibles).",
      },
    ],
  },
  {
    id: "grape-5",
    question:
      "Pourquoi un Chardonnay peut être très différent d’une bouteille à l’autre ?",
    answers: [
      {
        label:
          "Parce que l’élevage (ex : bois) et la vinification influencent beaucoup",
        correct: true,
        why: "Exact : bois, élevage, fermentation, maturité… peuvent transformer le vin.",
      },
      {
        label: "Parce que Chardonnay veut dire “vin sucré”",
        correct: false,
        why: "Non : un cépage n’indique pas le sucre.",
      },
      {
        label: "Parce que tous les Chardonnay viennent de la même région",
        correct: false,
        why: "Au contraire : il est planté dans plein de régions.",
      },
    ],
  },
];

// --- Utils
function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function readProgress():
  | { passed: boolean; bestScore: number; attempts: number; xp: number }
  | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      passed: Boolean(parsed?.passed),
      bestScore: Number(parsed?.bestScore ?? 0),
      attempts: Number(parsed?.attempts ?? 0),
      xp: Number(parsed?.xp ?? 0),
    };
  } catch {
    return null;
  }
}

function writeProgress(next: {
  passed: boolean;
  bestScore: number;
  attempts: number;
  xp: number;
}) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-100">
      <span className="h-2 w-2 rounded-full bg-emerald-300" />
      {children}
    </span>
  );
}

export default function GrapeQuizPage() {
  // ordre aléatoire à chaque "session"
  const [questions, setQuestions] = useState<Q[]>(() =>
    shuffle(BASE_QUESTIONS)
  );

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);

  // micro-animations
  const [xpBurstKey, setXpBurstKey] = useState(0);
  const [shake, setShake] = useState(false);
  const [pop, setPop] = useState(false);

  // badge/progression (localStorage)
  const [progress, setProgress] = useState<{
    passed: boolean;
    bestScore: number;
    attempts: number;
    xp: number;
  } | null>(null);

  useEffect(() => {
    setProgress(readProgress() ?? { passed: false, bestScore: 0, attempts: 0, xp: 0 });
  }, []);

  const done = i >= questions.length;
  const q = questions[Math.min(i, questions.length - 1)];
  const success = done && score >= PASS_SCORE;

  // grosse animation fin (si réussite)
  useEffect(() => {
    if (!success) return;

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
  }, [success]);

  // quand on termine → on persiste la progression (bestScore, attempts, xp)
  useEffect(() => {
    if (!done) return;
    // Évite d’écrire avant que progress soit chargé
    if (!progress) return;

    const attemptXp = earnedXp;
    const next = {
      attempts: progress.attempts + 1,
      bestScore: Math.max(progress.bestScore, score),
      passed: progress.passed || score >= PASS_SCORE,
      xp: progress.xp + attemptXp,
    };

    writeProgress(next);
    setProgress(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function choose(idx: number) {
    if (picked !== null) return;

    setPicked(idx);
    const ans = q.answers[idx];

    if (ans.correct) {
      setScore((s) => s + 1);
      setEarnedXp((x) => x + XP_PER_CORRECT);

      setPop(true);
      setXpBurstKey((k) => k + 1);
      window.setTimeout(() => setPop(false), 220);

      // mini confetti à chaque bonne réponse
      confetti({
        particleCount: 18,
        spread: 35,
        startVelocity: 18,
        origin: { x: 0.85, y: 0.25 },
      });
    } else {
      setShake(true);
      window.setTimeout(() => setShake(false), 260);
    }
  }

  function next() {
    setPicked(null);
    setI((x) => x + 1);
  }

  function restart() {
    setQuestions(shuffle(BASE_QUESTIONS)); // ✅ nouvel ordre
    setI(0);
    setPicked(null);
    setScore(0);
    setEarnedXp(0);
    setShake(false);
    setPop(false);
  }

  const progressPct = Math.min(
    100,
    Math.round((i / questions.length) * 100)
  );
  const progressAfterAnswer = Math.min(
    100,
    Math.round(
      ((i + (picked !== null ? 1 : 0)) / questions.length) * 100
    )
  );

  const alreadyPassed = Boolean(progress?.passed);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">

      <style jsx global>{`
        .shake {
          animation: shake 0.25s ease-in-out;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }

        .xp-float {
          animation: xpfloat 0.8s ease-out forwards;
        }
        @keyframes xpfloat {
          0% { opacity: 0; transform: translateY(6px) scale(0.98); }
          15% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-18px) scale(1.02); }
        }

        .win-card {
          animation: wincard 0.38s ease-out both;
        }
        @keyframes wincard {
          0% { opacity: 0; transform: translateY(10px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Top header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm font-semibold text-white/70">Quiz</div>
              {alreadyPassed && <Badge>Module validé</Badge>}
            </div>

            <h1 className="mt-2 text-4xl font-semibold">🍇 Cépage — Se tester</h1>
            <p className="mt-3 text-white/70">
              Questions dans un ordre aléatoire, feedback immédiat, XP & confettis ✨
            </p>

            {progress && (
              <div className="mt-3 text-xs text-white/55">
                Meilleur score :{" "}
                <span className="text-white/80 font-semibold">
                  {progress.bestScore}/{BASE_QUESTIONS.length}
                </span>{" "}
                <span className="text-white/30">·</span>{" "}
                Tentatives :{" "}
                <span className="text-white/80 font-semibold">{progress.attempts}</span>{" "}
                <span className="text-white/30">·</span>{" "}
                XP total :{" "}
                <span className="text-white/80 font-semibold">{progress.xp}</span>
              </div>
            )}
          </div>

          <Link
            href="/learn/basics/grape"
            className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/30"
          >
            ← Guide
          </Link>
        </div>

        {/* Progress bar */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Progression</span>
            <span>{done ? "Terminé" : `Question ${i + 1}/${questions.length}`}</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/70 transition-all duration-300"
              style={{
                width: `${done ? 100 : picked !== null ? progressAfterAnswer : progressPct}%`,
              }}
            />
          </div>
        </div>

        {/* Card */}
        <div
          className={`mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 ${
            shake ? "shake" : ""
          }`}
        >
          {done ? (
            <div className={success ? "win-card" : ""}>
              <div className="text-xl font-semibold">
                {success ? "🎉 Bravo !" : "Résultat"}
              </div>

              <div className="mt-2 text-white/70">
                Score :{" "}
                <span className="font-semibold text-white">
                  {score}/{questions.length}
                </span>
                <span className="text-white/40"> · </span>
                {success ? (
                  <span className="text-emerald-200">
                    Réussi (≥ {PASS_SCORE})
                  </span>
                ) : (
                  <span className="text-rose-200">
                    À retenter (objectif {PASS_SCORE}/{questions.length})
                  </span>
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
                  onClick={restart}
                  className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/85 hover:border-white/30"
                >
                  Refaire le quiz
                </button>

                {success && (
                  <Link
                    href="/learn/basics/region-appellation"
                    className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/85 hover:border-white/30"
                  >
                    Continuer (Région vs Appellation) →
                  </Link>
                )}
              </div>

              {success && (
                <div className="mt-4 text-xs text-white/55">
                  Module validé ✅ (badge + progression enregistrés en localStorage).
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">
                  Question {i + 1}/{questions.length}
                </div>

                <div className="relative text-sm text-white/60">
                  Score: {score}{" "}
                  <span className="text-white/30">·</span>{" "}
                  XP: {earnedXp}
                  {pop && (
                    <span
                      key={xpBurstKey}
                      className="xp-float absolute -right-2 -top-5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-100"
                    >
                      +{XP_PER_CORRECT} XP
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 text-lg font-semibold">{q.question}</div>

              <div className="mt-4 grid gap-2">
                {q.answers.map((a, idx) => {
                  const isPicked = picked === idx;
                  const show = picked !== null;
                  const correct = a.correct;

                  const cls =
                    show && isPicked
                      ? correct
                        ? "border-emerald-400/30 bg-emerald-500/10"
                        : "border-rose-400/30 bg-rose-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]";

                  return (
                    <button
                      key={`${q.id}-${idx}`}
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
            Objectif : {PASS_SCORE}/{questions.length} pour valider le module.
          </div>
        )}
      </div>
    </main>
  );
}
