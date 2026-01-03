"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/useFavorites";
import { getAllTastings, type Tasting } from "@/lib/storage";
import FavoriteButton from "@/components/ui/FavoriteButton";

function WineCard({ t }: { t: Tasting }) {
  const title = t.wine.year ? `${t.wine.name} (${t.wine.year})` : t.wine.name;
  const meta = [
    t.wine.color ? t.wine.color : null,
    t.wine.region ? t.wine.region : null,
    t.wine.appellation ? t.wine.appellation : null,
  ].filter(Boolean);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/[0.07] transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-white">{title}</div>
          <div className="mt-1 text-sm text-white/60">
            {meta.length ? meta.join(" · ") : "Infos à compléter"}
          </div>
        </div>

        <FavoriteButton id={t.id} size="sm" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-white/45">
          Ajouté le {new Date(t.createdAt).toLocaleDateString()}
        </div>

        <Link
          href={`/library/${t.id}`}
          className="text-sm font-semibold text-white/85 hover:text-white"
        >
          Ouvrir →
        </Link>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const favIds = useFavorites();
  const all = getAllTastings();
  const favorites = all
    .filter((t) => favIds.includes(t.id))
    // tri : plus récent en premier
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <div className="text-sm font-semibold text-white/70">Compte</div>
          <h1 className="mt-2 text-4xl font-semibold md:text-5xl">⭐ Mes favoris</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Retrouve ici les vins que tu veux garder “sous le coude”.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/library"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/30"
            >
              ← Aller à la bibliothèque
            </Link>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-white/70">
            <div className="text-lg font-semibold text-white">Aucun favori pour l’instant.</div>
            <div className="mt-2">
              Va dans ta bibliothèque et clique sur ☆ pour épingler un vin ici.
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {favorites.map((t) => (
              <WineCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
