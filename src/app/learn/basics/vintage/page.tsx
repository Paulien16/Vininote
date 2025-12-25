"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Callout from "@/components/ui/Callout";

export default function VintageGuidePage() {
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
              <span className="text-white/80">Millésime</span>
            </div>

            <h1 className="mt-2 flex items-center gap-3 text-4xl font-semibold">
              <span className="text-3xl">🗓️</span> Millésime
            </h1>

            <p className="mt-3 text-white/70">
              Le millésime, c’est l’empreinte d’une année sur le vin. Parfois
              énorme… parfois presque invisible.
            </p>
          </div>

          <Link
            href="/learn/basics"
            className="rounded-full border border-white/15 bg-white/0 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/30"
          >
            ← Bases
          </Link>
        </div>

        {/* Image card (cliquable) */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative block w-full"
            aria-label="Ouvrir l'image en plein écran"
          >
            <Image
              src="/learn/vintage.jpeg"
              alt="Illustration du millésime"
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
            Astuce : tu peux remplacer l’image quand tu veux (dossier{" "}
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
                  <div className="text-sm text-white/80">Millésime</div>

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
                    src="/learn/vintage.jpeg"
                    alt="Illustration du millésime"
                    width={2200}
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
            Le <span className="font-semibold text-white">millésime</span> est
            l’année de récolte des raisins (souvent indiquée sur la bouteille).
            Il reflète surtout{" "}
            <span className="font-semibold text-white">la météo de l’année</span>{" "}
            : chaleur, pluie, soleil, gel, grêle… et donc la{" "}
            <span className="font-semibold text-white">maturité</span> des raisins.
            <br />
            <br />
            Concrètement, une année chaude donne souvent des vins{" "}
            <span className="font-semibold text-white">plus mûrs</span>,
            plus riches, parfois plus alcooleux. Une année fraîche peut donner des
            vins <span className="font-semibold text-white">plus tendus</span>,
            plus acides, parfois plus “stricts”.
            <br />
            <br />
            Mais attention : le millésime n’est pas une note absolue. Le{" "}
            <span className="font-semibold text-white">producteur</span>, le{" "}
            <span className="font-semibold text-white">terroir</span> et la{" "}
            <span className="font-semibold text-white">vinification</span>{" "}
            peuvent compenser une année compliquée (ou rater une bonne année 😅).
          </p>
        </div>

        {/* Callouts */}
        <div className="mt-6 space-y-4">
          <Callout title="Définition simple">
            Le millésime = l’année de récolte des raisins. Il influence le niveau
            de maturité, l’acidité, parfois le style global.
          </Callout>

          <Callout title="Quand ça compte beaucoup">
            Souvent sur des régions “à millésimes” (climats plus variables) et
            sur des vins qui vieillissent bien. Certaines années se sentent très
            clairement.
          </Callout>

          <Callout title="Quand ça compte moins">
            Sur des styles très réguliers, ou quand le producteur/vinification
            standardise beaucoup. Le millésime existe… mais se remarque moins.
          </Callout>

          <Callout title="Réflexe utile en dégustation">
            Si un vin te paraît trop riche / trop acide : demande-toi si l’année
            était chaude ou fraîche. Ça donne une piste (pas un verdict).
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
            href="/learn/basics/vintage/quiz"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
          >
            Se tester →
          </Link>
        </div>
      </div>
    </main>
  );
}
