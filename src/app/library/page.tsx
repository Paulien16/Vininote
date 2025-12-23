"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import WizardHeader from "@/components/ui/WizardHeader";
import { deleteTasting, getAllTastings, type Tasting } from "@/lib/storage";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function LibraryPage() {
  const [items, setItems] = useState<Tasting[]>([]);
  const [query, setQuery] = useState("");

  const refresh = () => setItems(getAllTastings());

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((t) => {
      const hay = [
        t.wine.name,
        t.wine.year,
        t.wine.color,
        t.wine.region,
        t.wine.appellation,
        t.wine.grapes.join(" "),
        t.aromas.join(" "),
        t.conclusion.comment ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [items, query]);

  function onDelete(id: string) {
    const ok = window.confirm("Supprimer cette dégustation ?");
    if (!ok) return;

    deleteTasting(id);
    refresh();
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <WizardHeader />

      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Bibliothèque</h1>
          <p className="mt-1 text-sm text-neutral-300">
            Tes dégustations sauvegardées en local (dans ton navigateur).
          </p>

          <div className="mt-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher (nom, région, cépage, arômes...)"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-neutral-100 placeholder:text-neutral-400"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-neutral-300">
            Aucune dégustation pour l’instant. Va sur “Nouvelle dégustation” et termine un vin.
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">
                      {t.wine.name || "Vin"} {t.wine.year ? `(${t.wine.year})` : ""}
                    </div>

                    <div className="mt-1 text-sm text-neutral-300">
                      {t.wine.color ? t.wine.color : "couleur ?"}
                      {t.wine.region ? ` · ${t.wine.region}` : ""}
                      {t.wine.appellation ? ` · ${t.wine.appellation}` : ""}
                      {" · "}
                      {formatDate(t.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/library/${t.id}/edit`}
                      className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-white/30"
                    >
                      Modifier
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDelete(t.id)}
                      className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-white/30"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                {t.wine.photoUrl && (
                  <img
                    src={t.wine.photoUrl}
                    alt="Photo du vin"
                    className="mt-4 h-48 w-full rounded-2xl border border-white/10 object-cover"
                  />
                )}

                <div className="mt-4 grid gap-2 text-sm text-neutral-300">
                  {t.wine.grapes.length > 0 && (
                    <div>
                      Cépages :{" "}
                      <span className="text-neutral-100">
                        {t.wine.grapes.join(", ")}
                      </span>
                    </div>
                  )}

                  <div>
                    Structure :{" "}
                    <span className="text-neutral-100">
                      acidité {t.structure.acidity}/5 · corps {t.structure.body}/5
                      {t.structure.tannins ? ` · tanins ${t.structure.tannins}/5` : ""}
                      {" · "} sucrosité {t.structure.sweetness}/5 · alcool{" "}
                      {t.structure.alcoholHeat}/5
                    </span>
                  </div>

                  {t.aromas.length > 0 && (
                    <div>
                      Arômes :{" "}
                      <span className="text-neutral-100">
                        {t.aromas.join(", ")}
                      </span>
                    </div>
                  )}

                  <div>
                    Note :{" "}
                    <span className="text-neutral-100">
                      {t.conclusion.stars}/5
                    </span>
                    {t.conclusion.comment ? (
                      <>
                        {" · "}Commentaire :{" "}
                        <span className="text-neutral-100">
                          {t.conclusion.comment}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
