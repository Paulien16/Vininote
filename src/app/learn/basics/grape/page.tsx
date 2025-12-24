"use client";

import Link from "next/link";
import Image from "next/image";

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-black/25 p-6">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <div className="mt-2 text-sm text-white/70 leading-relaxed">{children}</div>
    </section>
  );
}

export default function GrapeGuidePage() {
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

            <h1 className="mt-2 text-4xl font-semibold flex items-center gap-3">
              <span className="text-3xl">🍇</span> Cépage
            </h1>

            <p className="mt-3 text-white/70">
              Le cépage te donne des indices sur le style… mais il ne raconte jamais toute l’histoire.
            </p>
          </div>

          <Link
            href="/learn/basics"
            className="rounded-full border border-white/15 bg-white/0 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/30"
          >
            ← Bases
          </Link>
        </div>

        {/* Image responsive, non rognée */}
<div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
  <Image
    src="/learn/cepage.png" // remplace par ton image
    alt="Carte des cépages"
    width={1600}   // largeur réelle approximative de l’image
    height={800}   // hauteur réelle approximative
    className="w-full h-auto object-contain"
    priority
  />

  <div className="p-4 text-xs text-white/60">
  </div>
</div>


        {/* Big explanation */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Comprendre (vraiment)</h2>
          <p className="mt-3 text-sm text-white/70 leading-relaxed">
            Un <span className="text-white font-semibold">cépage</span> est une{" "}
            <span className="text-white font-semibold">variété de raisin</span> (comme Chardonnay, Syrah, Merlot…).
            C’est la matière première du vin : chaque cépage a des{" "}
            <span className="text-white font-semibold">tendances naturelles</span> (arômes fréquents, acidité,
            texture, tanins…), mais il ne définit pas à lui seul le goût final.
            <br />
            <br />
            Le style dépend aussi du <span className="text-white font-semibold">lieu</span> (climat + sol),
            du <span className="text-white font-semibold">moment de récolte</span> (maturité),
            et de la <span className="text-white font-semibold">vinification</span> (élevage, bois, macération…).
            Résultat : un même cépage peut produire un vin très frais et tendu… ou riche et gourmand.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <Callout title="Définition simple">
            Un cépage est une variété de raisin utilisée pour faire du vin (ex : Chardonnay, Sauvignon Blanc, Syrah,
            Pinot Noir, Merlot).
          </Callout>

          <Callout title="Ce que le cépage te dit (vraiment)">
            Il donne des indices : famille d’arômes probable, acidité (souvent), structure, tanins (surtout pour les rouges).
            Mais c’est un <span className="text-white">indice</span>, pas une promesse.
          </Callout>

          <Callout title="Exemples rapides pour te repérer">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="text-white font-semibold">Sauvignon Blanc</span> : souvent vif, agrumes, notes herbacées.
              </li>
              <li>
                <span className="text-white font-semibold">Chardonnay</span> : très variable (de très frais à très riche).
              </li>
              <li>
                <span className="text-white font-semibold">Syrah</span> : épices/poivre, structure, tanins présents.
              </li>
              <li>
                <span className="text-white font-semibold">Pinot Noir</span> : plus léger, fruit rouge, tanins fins.
              </li>
            </ul>
          </Callout>
        </div>

        {/* CTA quiz */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white">Prêt à te tester ?</div>
            <div className="mt-1 text-sm text-white/70">5 questions rapides + feedback immédiat.</div>
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
