"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";

type Q = {
  question: string;
  answers: { label: string; correct: boolean; why: string }[];
};

const PASS_SCORE = 4; // >= 4/5

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function VintageQuizPage() {
  const baseQuestions: Q[] = useMemo(
    () => [
      {
        question: "Le millésime correspond généralement à…",
        answers: [
          { label: "L’année de récolte des raisins", correct: true, why: "Oui : c’est l’année de vendange." },
          { label: "L’année de mise en bouteille", correct: false, why: "Non : ça peut être plus tard." },
          { label: "L’année où le vin est bu", correct: false, why: "Non : ça dépend de toi 😄" },
        ],
      },
      {
        question: "Une année chaude tend à produire des vins…",
        answers: [
          { label: "Plus mûrs et souvent plus riches", correct: true, why: "Oui : maturité ↑, parfois alcool ↑." },
          { label: "Toujours plus acides", correct: false, why: "Souvent l’inverse : acidité perçue ↓." },
          { label: "Sans aucun impact", correct: false, why: "Si, mais variable selon régions/producteurs." },
        ],
      },
      {
        question: "Vrai ou faux : un “bon millésime” garantit un grand vin.",
        answers: [
          { label: "Vrai", correct: false, why: "Faux : le producteur/terroir/vinification comptent énormément." },
          { label: "Faux", correct: true, why: "Exact : millésime ≠ réussite automatique." },
        ],
      },
      {
        question: "Quand le millésime est souvent le plus “visible” ?",
        answers: [
          { label: "Dans des régions à climat variable et des vins de garde", correct: true, why: "Oui : variations plus marquées." },
          { label: "Uniquement sur les vins blancs", correct: false, why: "Non : ça dépend surtout du climat/style." },
          { label: "Jamais", correct: false, why: "Si, parfois très clairement." },
        ],
      },
      {
        question: "Lequel peut compenser une année compliquée ?",
        answers: [
          { label: "Un bon producteur (tri, choix de vinification…)", correct: true, why: "Oui : décisions + savoir-faire." },
          { label: "La couleur de l’étiquette", correct: false, why: "Non 😅" },
          { label: "Le bouchon uniquement", correct: false, why: "Non : pas le facteur principal." },
        ],
      },
    ],
    []
  );

  // On randomise l’ordre des questions au démarrage
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => shuffle(baseQuestions), [baseQuestions, seed]);

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const [xpBurstKey, setXpBurstKey] = useState(0);
  const [shake, setShake] = useState(false);
  const [pop, setPop] = useState(false);

  const done = i >= questions.length;
  const q = questions[Math.min(i, questions.length - 1)];
  const success = done && score >= PASS_SCORE;

  // GROS confetti fin
  useEffect(() => {
    if (!success) return;
    const end = Date.now() + 900;
    const tick = () => {
      confetti({ particleCount: 45, spread: 70, startVelocity: 30, origin: { x: 0.5, y: 0.2 } });
      if (Date.now() < end) requestAnimationFrame(tick);
    };
    tick();

    // ici tu pourras stocker un badge + tard
    // localStorage.setItem("learn:basics:vintage", "done");
  }, [success]);

  function choose(idx: number) {
    if (picked !== null) return;
    setPicked(idx);

    const ans = q.answers[idx];
    if (ans.correct) {
      setScore((s) => s + 1);
      setPop(true);
      setXpBurstKey((k) => k + 1);
      window.setTimeout(() => setPop(false), 220);

      confetti({ particleCount: 18, spread: 35, startVelocity: 18, origin: { x: 0.85, y: 0.25 } });
    } else {
      setShake(true);
      window.setTimeout(() => setShake(false), 260);
    }
  }

  function next() {
    setPicked(null);
    setI((x) => x + 1);
  }

  function resetQuiz() {
    setI(0);
    setPicked(null);
    setScore(0);
    // re-randomise
    setSeed((s) => s + 1);
  }

  const progress = Math.min(100, Math.round((i / questions.length) * 100));
  const progressAfter = Math.min(
    100,
    Math.round(((i + (picked !== null ? 1 : 0)) / questions.length) * 100)
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">

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
          <div>
            <div className="text-sm font-semibold text-white/70">Quiz</div>
            <h1 className="mt-2 text-4xl font-semibold">🗓️ Millésime — Se tester</h1>
            <p className="mt-3 text-white/70">5 questions, XP & confettis ✨</p>
          </div>

          <Link
            href="/learn/basics/vintage"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/30"
          >
            ← Guide
          </Link>
        </div>

        {/* Progress */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Progression</span>
            <span>{done ? "Terminé" : `Question ${i + 1}/${questions.length}`}</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/70 transition-all duration-300"
              style={{ width: `${done ? 100 : (picked !== null ? progressAfter : progress)}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className={`mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 ${shake ? "shake" : ""}`}>
          {done ? (
            <div className={success ? "win-card" : ""}>
              <div className="text-xl font-semibold">{success ? "🎉 Bravo !" : "Résultat"}</div>
              <div className="mt-2 text-white/70">
                Score : <span className="font-semibold text-white">{score}/{questions.length}</span>
                <span className="text-white/40"> · </span>
                {success ? (
                  <span className="text-emerald-200">Réussi (≥ {PASS_SCORE})</span>
                ) : (
                  <span className="text-rose-200">À retenter (objectif {PASS_SCORE}/{questions.length})</span>
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
                  onClick={resetQuiz}
                  className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/85 hover:border-white/30"
                >
                  Refaire le quiz (ordre aléatoire)
                </button>

                {success && (
                  <Link
                    href="/learn/basics/label"
                    className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/85 hover:border-white/30"
                  >
                    Continuer (Lire une étiquette) →
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">
                  Question {i + 1}/{questions.length}
                </div>

                <div className="relative text-sm text-white/60">
                  Score: {score}
                  {pop && (
                    <span
                      key={xpBurstKey}
                      className="xp-float absolute -right-2 -top-5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-100"
                    >
                      +10 XP
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 text-lg font-semibold">{q.question}</div>

              <div className="mt-4 grid gap-2">
                {q.answers.map((a, idx) => {
                  const isPicked = picked === idx;
                  const show = picked !== null;

                  const cls =
                    show && isPicked
                      ? a.correct
                        ? "border-emerald-400/30 bg-emerald-500/10"
                        : "border-rose-400/30 bg-rose-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]";

                  return (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() => choose(idx)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm text-white/85 transition ${cls}`}
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
                <div className="text-xs text-white/55">Clique une réponse pour voir l’explication.</div>

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
