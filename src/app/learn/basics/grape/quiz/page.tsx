"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SiteHeader from "@/components/ui/SiteHeader";

type Q = {
  question: string;
  answers: { label: string; correct: boolean; why: string }[];
};

export default function GrapeQuizPage() {
  const questions: Q[] = [
    {
      question: "Un cépage, c’est…",
      answers: [
        { label: "Une variété de raisin (ex: Syrah, Chardonnay)", correct: true, why: "Oui. Cépage = variété de raisin." },
        { label: "Une région viticole (ex: Bordeaux)", correct: false, why: "Non. Ça c’est une région." },
        { label: "Une appellation (ex: Chablis)", correct: false, why: "Non. Ça c’est une appellation." },
      ],
    },
    {
      question: "Vrai ou faux : si je connais le cépage, je connais forcément le goût du vin.",
      answers: [
        { label: "Vrai", correct: false, why: "Faux : le climat, le sol et la vinification changent énormément le résultat." },
        { label: "Faux", correct: true, why: "Exact : le cépage donne des indices, pas une certitude." },
      ],
    },
    {
      question: "Parmi ces éléments, lequel peut le plus changer le style d’un même cépage ?",
      answers: [
        { label: "Le climat et le lieu", correct: true, why: "Oui : un climat frais vs chaud change acidité, maturité, arômes." },
        { label: "Le nom du domaine uniquement", correct: false, why: "Le producteur compte, mais pas “uniquement”." },
        { label: "La couleur de l’étiquette", correct: false, why: "Ça ne dit rien sur le vin." },
      ],
    },
    {
      question: "Lequel de ces cépages est souvent associé à des tanins plus présents ?",
      answers: [
        { label: "Syrah", correct: true, why: "Souvent : structure + tanins présents (selon style)." },
        { label: "Sauvignon Blanc", correct: false, why: "C’est un blanc : pas de tanins comme un rouge (ou très faibles)." },
        { label: "Chardonnay", correct: false, why: "Blanc : pas de tanins marqués." },
      ],
    },
    {
      question: "Pourquoi un Chardonnay peut être très différent d’une bouteille à l’autre ?",
      answers: [
        { label: "Parce que l’élevage (ex: bois) et la vinification influencent beaucoup", correct: true, why: "Exact : bois / élevage / style peuvent tout changer." },
        { label: "Parce que Chardonnay veut dire 'vin sucré'", correct: false, why: "Non : Chardonnay n’indique pas le sucre." },
        { label: "Parce que tous les Chardonnay viennent de la même région", correct: false, why: "Au contraire : il est planté dans plein de régions." },
      ],
    },
  ];
  

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const q = questions[i];
  const done = i >= questions.length;

  function choose(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    if (q.answers[idx].correct) setScore((s) => s + 1);
  }

  function next() {
    setPicked(null);
    setI((x) => x + 1);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <SiteHeader />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white/70">Quiz</div>
            <h1 className="mt-2 text-4xl font-semibold">🍇 Cépage — Se tester</h1>
            <p className="mt-3 text-white/70">2 questions, feedback immédiat.</p>
          </div>

          <Link
            href="/learn/basics/grape"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/30"
          >
            ← Guide
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          {done ? (
            <div>
              <div className="text-xl font-semibold">Résultat</div>
              <div className="mt-2 text-white/70">
                Score : <span className="text-white font-semibold">{score}/{questions.length}</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/learn/basics"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
                >
                  Retour aux Bases →
                </Link>
                <button
                  onClick={() => {
                    setI(0);
                    setPicked(null);
                    setScore(0);
                  }}
                  className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/85 hover:border-white/30"
                >
                  Refaire le quiz
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">
                  Question {i + 1}/{questions.length}
                </div>
                <div className="text-sm text-white/60">Score: {score}</div>
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
                      key={a.label}
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
      </div>
    </main>
  );
}
