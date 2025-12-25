"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";

type Q = {
  question: string;
  answers: { label: string; correct: boolean; why: string }[];
};

export default function GrapeQuizPage() {
  const questions: Q[] = useMemo(
    () => [
      {
        question: "Un cépage, c’est…",
        answers: [
          {
            label: "Une variété de raisin (ex: Syrah, Chardonnay)",
            correct: true,
            why: "Oui. Cépage = variété de raisin.",
          },
          {
            label: "Une région viticole (ex: Bordeaux)",
            correct: false,
            why: "Non. Ça c’est une région.",
          },
          {
            label: "Une appellation (ex: Chablis)",
            correct: false,
            why: "Non. Ça c’est une appellation.",
          },
        ],
      },
      {
        question:
          "Vrai ou faux : si je connais le cépage, je connais forcément le goût du vin.",
        answers: [
          {
            label: "Vrai",
            correct: false,
            why: "Faux : climat, sol, maturité et vinification changent beaucoup le résultat.",
          },
          {
            label: "Faux",
            correct: true,
            why: "Exact : le cépage donne des indices, pas une certitude.",
          },
        ],
      },
      {
        question:
          "Parmi ces éléments, lequel peut le plus changer le style d’un même cépage ?",
        answers: [
          {
            label: "Le climat et le lieu",
            correct: true,
            why: "Oui : un climat frais vs chaud change acidité, maturité et arômes.",
          },
          {
            label: "Le nom du domaine uniquement",
            correct: false,
            why: "Le producteur compte, mais pas “uniquement”.",
          },
          {
            label: "La couleur de l’étiquette",
            correct: false,
            why: "Ça ne dit rien sur le vin.",
          },
        ],
      },
      {
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
        question:
          "Pourquoi un Chardonnay peut être très différent d’une bouteille à l’autre ?",
        answers: [
          {
            label:
              "Parce que l’élevage (ex: bois) et la vinification influencent beaucoup",
            correct: true,
            why: "Exact : bois / élevage / style peuvent transformer le vin.",
          },
          {
            label: "Parce que Chardonnay veut dire 'vin sucré'",
            correct: false,
            why: "Non : le cépage n’indique pas le sucre.",
          },
          {
            label: "Parce que tous les Chardonnay viennent de la même région",
            correct: false,
            why: "Au contraire : il est planté dans plein de régions.",
          },
        ],
      },
    ],
    []
  );

  const PASS_SCORE = 4;

  // Anti-hydration (important)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Quiz state
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  // UI micro-animations
  const [xpKey, setXpKey] = useState(0);
  const [shake, setShake] = useState(false);
  const [pop, setPop] = useState(false);

  const total = questions.length;
  const done = index >= total;
  const current = questions[Math.min(index, total - 1)];
  const success = done && score >= PASS_SCORE;

  // Safe confetti wrapper
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

  // Big animation at the end
  useEffect(() => {
    if (!success) return;
    shootBig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  function choose(answerIdx: number) {
    if (picked !== null || done) return;

    setPicked(answerIdx);
    const ans = current.answers[answerIdx];

    if (ans.correct) {
      setScore((s) => s + 1);

      // pop + XP float
      setPop(true);
      setXpKey((k) => k + 1);
      window.setTimeout(() => setPop(false), 220);

      // small confetti
      shootSmall();
    } else {
      setShake(true);
      window.setTimeout(() => setShake(false), 260);
    }
  }

  function next() {
    if (picked === null) return;
    setPicked(null);
    setIndex((x) => x + 1);
  }

  function reset() {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setShake(false);
    setPop(false);
  }

  // Progress
  const answeredCount = Math.min(total, index + (picked !== null ? 1 : 0));
  const progress = Math.round((answeredCount / total) * 100);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">

      {/* Animations CSS */}
      <style jsx global>{`
        .shake {
          animation: shake 0.25s ease-in-out;
        }
        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-6px);
          }
          50% {
            transform: translateX(6px);
          }
          75% {
            transform: translateX(-4px);
          }
          100% {
            transform: translateX(0);
          }
        }

        .xp-float {
          animation: xpfloat 0.8s ease-out forwards;
        }
        @keyframes xpfloat {
          0% {
            opacity: 0;
            transform: translateY(6px) scale(0.98);
          }
          15% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-18px) scale(1.02);
          }
        }

        .win-card {
          animation: wincard 0.38s ease-out both;
        }
        @keyframes wincard {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white/70">Quiz</div>
            <h1 className="mt-2 text-4xl font-semibold">🍇 Cépage — Se tester</h1>
            <p className="mt-3 text-white/70">
              5 questions, feedback immédiat, XP & confettis ✨
            </p>
          </div>

          <Link
            href="/learn/basics/grape"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/30"
          >
            ← Guide
          </Link>
        </div>

        {/* Progress */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Progression</span>
            <span>{done ? "Terminé" : `Question ${index + 1}/${total}`}</span>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/70 transition-all duration-300"
              style={{ width: `${done ? 100 : progress}%` }}
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
                  {score}/{total}
                </span>
                <span className="text-white/40"> · </span>
                {success ? (
                  <span className="text-emerald-200">
                    Réussi (≥ {PASS_SCORE})
                  </span>
                ) : (
                  <span className="text-rose-200">
                    À retenter (objectif {PASS_SCORE}/{total})
                  </span>
                )}
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
                  onClick={reset}
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
                  Prochaine étape : on enregistrera la réussite (XP / niveau) en
                  localStorage.
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">
                  Question {index + 1}/{total}
                </div>

                <div className="relative text-sm text-white/60">
                  Score: {score}
                  {pop && (
                    <span
                      key={xpKey}
                      className="xp-float absolute -right-2 -top-5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-100"
                    >
                      +10 XP
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 text-lg font-semibold">{current.question}</div>

              <div className="mt-4 grid gap-2">
                {current.answers.map((a, idx) => {
                  const show = picked !== null;
                  const isPicked = picked === idx;

                  const cls = show && isPicked
                    ? a.correct
                      ? "border-emerald-400/30 bg-emerald-500/10"
                      : "border-rose-400/30 bg-rose-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]";

                  return (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() => choose(idx)}
                      className={`text-left rounded-2xl border px-4 py-3 text-sm text-white/85 transition ${cls}`}
                    >
                      {a.label}
                      {show && isPicked && (
                        <div className="mt-2 text-xs text-white/70">
                          {a.why}
                        </div>
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
