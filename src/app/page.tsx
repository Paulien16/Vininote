import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="text-lg font-semibold tracking-tight">ViniNote</div>
        <nav className="hidden gap-6 text-sm text-neutral-200 md:flex">
          <a className="hover:text-white" href="/library">Bibliothèque</a>
          <a className="hover:text-white" href="/learn">Apprendre</a>
          <a className="hover:text-white" href="/duels">Duels</a>
        </nav>
        <a
          href="/tasting/new"
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
        >
          Nouvelle dégustation
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="relative overflow-hidden rounded-3xl">
          <div
            className="h-[420px] w-full bg-cover bg-center"
            style={{ backgroundImage: "url('/hero.jpg')" }}
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-xl px-8">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Ton carnet de dégustation
              </h1>
              <p className="mt-3 text-base text-neutral-200 md:text-lg">
                Apprends à mettre des mots sur ton palais, un verre à la fois.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="/tasting/new"
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-neutral-200"
                >
                  Commencer une dégustation
                </a>
                <a
                  href="/library"
                  className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:border-white/40"
                >
                  Voir ma bibliothèque
                </a>
              </div>

              {/* Mini “bar” style Airbnb */}
              <div className="mt-7 flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur">
                <div className="flex-1">
                  <div className="text-xs text-neutral-300">Ajout rapide</div>
                  <div className="text-sm font-medium">Quel vin dégustes-tu ?</div>
                </div>
                <a
                  href="/tasting/new"
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200"
                >
                  Ajouter
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Cards row */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-neutral-200">Raccourcis</h2>
          <div className="mt-3 flex gap-4 overflow-x-auto pb-2">
            {[
              { title: "Dernières dégustations", desc: "Reprends où tu t’es arrêté", href: "/library" },
              { title: "Apprendre", desc: "Acidité, tanins, arômes…", href: "/learn" },
              { title: "Mode duel", desc: "Comparer 2 vins facilement", href: "/duels" },
            ].map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="min-w-[260px] rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
              >
                <div className="text-base font-semibold">{c.title}</div>
                <div className="mt-1 text-sm text-neutral-300">{c.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

