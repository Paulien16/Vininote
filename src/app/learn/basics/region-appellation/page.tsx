"use client";

import Link from "next/link";
import Callout from "@/components/ui/Callout";

export default function RegionAppellationPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Breadcrumb + Title */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white/60">
              <Link href="/learn/basics" className="hover:text-white/85">
                Bases du vin
              </Link>
              <span className="mx-2 text-white/30">/</span>
              <span className="text-white/80">Région vs Appellation</span>
            </div>

            <h1 className="mt-2 flex items-center gap-3 text-4xl font-semibold">
              <span className="text-3xl">📍</span>
              Région vs Appellation
            </h1>

            <p className="mt-3 text-white/70">
              Comprendre l’origine d’un vin sans se perdre entre régions, AOC et
              noms compliqués.
            </p>
          </div>

          <Link
            href="/learn/basics"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/30"
          >
            ← Bases
          </Link>
        </div>

        {/* Intro visuelle (placeholder image) */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="p-6 text-sm text-white/60">
            Image (bientôt) : carte de France avec régions + appellations
          </div>
        </div>

        {/* Core explanation */}
        <div className="mt-6 space-y-4">
          <Callout title="Différence simple" variant="info">
            Une <span className="text-white font-semibold">région</span> est une
            zone viticole large (ex : Bordeaux, Vallée du Rhône).
            <br />
            Une <span className="text-white font-semibold">appellation</span> est
            une zone plus précise, avec des règles strictes (ex : Pauillac,
            Chablis, Sancerre).
          </Callout>

          <Callout title="Pourquoi l’appellation est plus précise" variant="note">
            L’appellation impose :
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>les cépages autorisés</li>
              <li>les rendements maximum</li>
              <li>des règles de vinification</li>
            </ul>
            Résultat : elle donne de vrais indices sur le style du vin.
          </Callout>

          <Callout title="Piège fréquent" variant="warning">
            Dire “j’aime les Bordeaux” ne veut pas dire grand-chose.
            <br />
            Un Bordeaux peut être léger, puissant, boisé ou très frais selon
            l’appellation et le producteur.
          </Callout>

          <Callout title="Astuce pour lire une étiquette" variant="tip">
            Lis dans cet ordre :
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Appellation (la plus précise)</li>
              <li>Région (le cadre général)</li>
              <li>Cépage (quand il est indiqué)</li>
            </ol>
          </Callout>
        </div>

        {/* Exemples concrets */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">
            Exemples pour t’entraîner
          </h2>

          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>
              <span className="text-white font-semibold">Bordeaux</span> → région
              <br />
              <span className="text-white font-semibold">Saint-Émilion AOC</span>{" "}
              → appellation
            </li>
            <li>
              <span className="text-white font-semibold">Vallée du Rhône</span> →
              région
              <br />
              <span className="text-white font-semibold">Crozes-Hermitage</span>{" "}
              → appellation
            </li>
            <li>
              <span className="text-white font-semibold">Bourgogne</span> →
              région
              <br />
              <span className="text-white font-semibold">Chablis</span> →
              appellation
            </li>
          </ul>
        </div>

        {/* CTA quiz */}
        <div className="mt-8 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div>
            <div className="text-sm font-semibold text-white">
              Prêt à vérifier si c’est clair ?
            </div>
            <div className="mt-1 text-sm text-white/70">
              5 questions rapides pour ancrer les bases.
            </div>
          </div>

          <Link
            href="/learn/basics/region-appellation/quiz"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
          >
            Se tester →
          </Link>
        </div>
      </div>
    </main>
  );
}
