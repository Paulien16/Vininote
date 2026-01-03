"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAllTastings, type Tasting } from "@/lib/storage";
import FavoriteButton from "@/components/ui/FavoriteButton";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function isFavoriteFromStorage(id: string) {
  // ⚠️ adapte ce nom de clé si ton FavoriteButton utilise une autre clé.
  // (Je mets "vininote:favorites" comme convention)
  try {
    const raw = localStorage.getItem("vininote:favorites");
    if (!raw) return false;
    const arr = JSON.parse(raw) as string[];
    return Array.isArray(arr) && arr.includes(id);
  } catch {
    return false;
  }
}

export default function FavoritesPage() {
  const [items, setItems] = useState<Tasting[]>([]);
  const [query, setQuery] = useState("");
  const [favTick, setFavTick] = useState(0); // force refresh après toggle

  useEffect(() => {
    setItems(getAllTastings());
  }, []);

  // Quand on clique sur un favori, on veut rafraîchir la liste
  // -> on écoute l'event "storage" + un custom event simple
  useEffect(() => {
    function onStorage() {
      setFavTick((x) => x + 1);
    }
    window.addEventListener("storage", onStorage);

    function onFavChanged() {
      setFavTick((x) => x + 1);
    }
    window.addEventListener("vininote:favorites-changed", onFavChanged as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("vininote:favorites-changed", onFavChanged as EventListener);
    };
  }, []);

  const favoritesOnly = useMemo(() => {
    return items.filter((t) => isFavoriteFromStorage(t.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, favTick]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return favoritesOnly;

    return favoritesOnly.filter((t) => {
      const hay = [
        t.wine.name,
        t.wine.year,
        t.wine.color,
        t.wine.region,
        t.wine.appellation,
        (t.wine.grapes ?? []).join(" "),
        (t.aromas ?? []).join(" "),
        t.conclusion?.comment ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [favoritesOnly, query]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Mes favoris</h1>
            <p className="mt-1 text-sm text-neutral-300">
              Les vins que tu as “étoilés” ⭐ dans ta bibliothèque.
            </p>
          </div>

          <Link
            href="/library"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/30"
          >
            ← Bibliothèque
          </Link>
        </div>

        <div className="mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher dans mes favoris…"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-neutral-100 placeholder:text-neutral-400"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-neutral-300">
            <div className="text-lg font-semibold text-white">Aucun favori pour l’instant</div>
            <div className="mt-2 text-sm text-white/70">
              Va dans ta bibliothèque et clique sur ⭐ pour épingler tes vins préférés.
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/library"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
              >
                Aller à la bibliothèque →
              </Link>
              <Link
                href="/tasting/new"
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/85 hover:border-white/30"
              >
                Nouvelle dégustation
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/library/${t.id}`} className="block min-w-0 flex-1">
                    <div className="text-lg font-semibold group-hover:underline truncate">
                      {t.wine.name || "Vin"} {t.wine.year ? `(${t.wine.year})` : ""}
                    </div>
                    <div className="mt-1 text-sm text-neutral-300">
                      {t.wine.color ? `${t.wine.color}` : "couleur ?"}
                      {t.wine.region ? ` · ${t.wine.region}` : ""}
                      {t.wine.appellation ? ` · ${t.wine.appellation}` : ""}
                      {" · "}
                      {formatDate(t.createdAt)}
                    </div>
                  </Link>

                  <div className="shrink-0">
                    <FavoriteButton id={t.id} size="sm" />
                  </div>
                </div>

                <Link href={`/library/${t.id}`} className="block">
                  {t.wine.photoUrl && (
                    <img
                      src={t.wine.photoUrl}
                      alt="Photo du vin"
                      className="mt-4 h-44 w-full rounded-2xl object-cover border border-white/10"
                    />
                  )}

                  <div className="mt-4 grid gap-2 text-sm text-neutral-300">
                    {(t.wine.grapes?.length ?? 0) > 0 && (
                      <div>
                        Cépages :{" "}
                        <span className="text-neutral-100">
                          {(t.wine.grapes ?? []).join(", ")}
                        </span>
                      </div>
                    )}

                    <div>
                      Note :{" "}
                      <span className="text-neutral-100">{t.conclusion?.stars ?? 0}/5</span>
                      {t.conclusion?.comment ? (
                        <>
                          {" · "}
                          <span className="text-neutral-100">{t.conclusion.comment}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </Link>

                <div className="mt-4">
                  <Link
                    href={`/library/${t.id}`}
                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-white/30 inline-flex"
                  >
                    Ouvrir
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
