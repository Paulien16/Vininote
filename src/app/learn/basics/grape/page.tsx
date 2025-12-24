"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

function Callout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-black/25 p-6">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-white/70">{children}</div>
    </section>
  );
}

export default function GrapeGuidePage() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Breadcrumb + Title */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white/60">
              <Link href="/learn/basics" className="hover:text-white/85">
                Bases du vin
              </Link>
              <span className="mx-2 text-white/30">/</span>
              <span className="text-white/80">Cépage</span>
            </div>

            <h1 className="mt-2 flex items-center gap-3 text-4xl font-semibold">
              <span className="text-3xl">🍇</span> Cépage
            </h1>

            <p className="mt-3 text-white/70">
              Le cépage te donne des indices sur le style… mais il ne raconte jamais
              toute l’histoire.
            </p>
          </div>

          <Link
            href="/learn/basics"
            className="rounded-full border border-white/15 bg-white/0 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/30"
          >
            ← Bases
          </Link>
        </div>

        {/* Image card */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative block w-full"
            aria-label="Ouvrir l'image en plein écran"
          >
            <Image
              src="/learn/cepage.png"
              alt="Carte des cépages"
              width={1600}
              height={900}
              className="h-auto w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              priority
            />

            <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs text-white/80 backdrop-blur">
              Cliquer pour agrandir
            </div>
          </button>

          <div className="p-4 text-xs text-white/60">
            Astuce : tu peux changer l’image quand tu veux (dossier{" "}
            <span className="text-white/80">public/learn</span>).
          </div>
        </div>

        {/* Modal fullscreen */}
        {open && (
          <div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div
                className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-black/40"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="text-sm text-white/80">Carte des cépages</div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80 hover:border-white/25"
                  >
                    Fermer (Esc)
                  </button>
                </div>

                <div className="max-h-[80vh] overflow-auto p-4">
                  <Image
                    src="/learn/cepage.png"
                    alt="Carte des cépages"
                    width={2400}
                    height={1400}
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Big explanation */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Comprendre (vraiment)</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Un <span className="font-semibold text-white">cépage</span> est une{" "}
            <span className="font-semibold text-white">variété de raisin</span>{" "}
            (Chardonnay, Syrah, Merlot…). C’est la matière première du vin : chaque
            cépage a des{" "}
            <span className="font-semibold text-white">tendances naturelles</span>{" "}
            (arômes fréquents, acidité, texture, tanins…), mais il ne définit pas à
            lui seul le goût final.
            <br />
            <br />
            Le style dépend aussi du{" "}
            <span className="font-semibold text-white">lieu</span> (climat + sol),
            du{" "}
            <span className="font-semibold text-white">moment de récolte</span>{" "}
            (maturité), et de la{" "}
            <span className="font-semibold text-white">vinification</span>{" "}
            (élevage, bois, macération…). Résultat : un même cépage peut produire un
            vin très frais… ou riche et gourmand.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <Callout title="Définition simple">
            Un cépage est une variété de raisin utilisée pour faire du vin (ex :
            Chardonnay, Sauvignon Blanc, Syrah, Pinot Noir, Merlot).
          </Callout>

          <Callout title="Ce que le cépage te dit (vraiment)">
            Il donne des indices : famille d’arômes probable, acidité (souvent),
            structure, tanins (surtout pour les rouges). Mais c’est un{" "}
            <span className="text-white">indice</span>, pas une promesse.
          </Callout>

          <Callout title="Exemples rapides pour te repérer">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-semibold text-white">Sauvignon Blanc</span> :
                souvent vif, agrumes, notes herbacées.
              </li>
              <li>
                <span className="font-semibold text-white">Chardonnay</span> : très
                variable (de très frais à très riche).
              </li>
              <li>
                <span className="font-semibold text-white">Syrah</span> : épices /
                poivre, structure, tanins présents.
              </li>
              <li>
                <span className="font-semibold text-white">Pinot Noir</span> : plus
                léger, fruit rouge, tanins fins.
              </li>
            </ul>
          </Callout>
        </div>

        {/* CTA quiz */}
        <div className="mt-8 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div>
            <div className="text-sm font-semibold text-white">Prêt à te tester ?</div>
            <div className="mt-1 text-sm text-white/70">
              5 questions rapides + feedback immédiat.
            </div>
          </div>

          <Link
            href="/learn/basics/grape/quiz"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
          >
            Se tester →
          </Link>
        </div>
      </div>
    </main>
  );
}
