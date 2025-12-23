"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { deleteTasting, getTastingById, type Tasting } from "@/lib/storage";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function StarsRead({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, value || 0));
  return (
    <div className="flex items-center gap-2">
      <div className="text-xl text-white">
        {"★".repeat(v)}
        <span className="text-white/30">{"★".repeat(5 - v)}</span>
      </div>
      <span className="text-sm text-neutral-300">{v}/5</span>
    </div>
  );
}

export default function TastingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [tasting, setTasting] = useState<Tasting | null>(null);

  useEffect(() => {
    if (!id) return;
    const found = getTastingById(id);
    if (!found) {
      router.push("/library");
      return;
    }
    setTasting(found);
  }, [id, router]);

  const title = useMemo(() => {
    if (!tasting) return "Dégustation";
    const n = tasting.wine.name || "Vin";
    const y = tasting.wine.year ? ` (${tasting.wine.year})` : "";
    return `${n}${y}`;
  }, [tasting]);

  function onDelete() {
    if (!tasting) return;
    const ok = window.confirm("Supprimer cette dégustation ?");
    if (!ok) return;
    deleteTasting(tasting.id);
    router.push("/library");
  }

  if (!tasting) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-10 text-neutral-300">Chargement…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <Link href="/library" className="text-sm text-white/70 hover:text-white transition">
              ← Retour bibliothèque
            </Link>

            <h1 className="mt-2 text-3xl font-semibold">{title}</h1>

            <p className="mt-1 text-sm text-neutral-300">
              {tasting.wine.color ? tasting.wine.color : "couleur ?"}
              {tasting.wine.region ? ` · ${tasting.wine.region}` : ""}
              {tasting.wine.appellation ? ` · ${tasting.wine.appellation}` : ""}
              {" · "}
              {formatDate(tasting.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/library/${tasting.id}/edit`}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-white/30"
            >
              Modifier
            </Link>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-white/30"
            >
              Supprimer
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          {tasting.wine.photoUrl && (
            <img
              src={tasting.wine.photoUrl}
              alt="Photo du vin"
              className="h-72 w-full rounded-2xl border border-white/10 object-cover"
            />
          )}

          <div className="mt-6 grid gap-6">
            <section>
              <h2 className="text-lg font-semibold">Origine</h2>
              <div className="mt-2 text-sm text-neutral-300">
                <div>
                  Région : <span className="text-neutral-100">{tasting.wine.region || "—"}</span>
                </div>
                <div className="mt-1">
                  Appellation :{" "}
                  <span className="text-neutral-100">{tasting.wine.appellation || "—"}</span>
                </div>
                <div className="mt-1">
                  Cépages :{" "}
                  <span className="text-neutral-100">
                    {tasting.wine.grapes?.length ? tasting.wine.grapes.join(", ") : "—"}
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Structure</h2>
              <div className="mt-2 text-sm text-neutral-300">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <span>
                    Acidité : <span className="text-neutral-100">{tasting.structure.acidity}/5</span>
                  </span>
                  <span>
                    Corps : <span className="text-neutral-100">{tasting.structure.body}/5</span>
                  </span>
                  {tasting.structure.tannins ? (
                    <span>
                      Tanins :{" "}
                      <span className="text-neutral-100">{tasting.structure.tannins}/5</span>
                    </span>
                  ) : null}
                  <span>
                    Sucrosité :{" "}
                    <span className="text-neutral-100">{tasting.structure.sweetness}/5</span>
                  </span>
                  <span>
                    Alcool :{" "}
                    <span className="text-neutral-100">{tasting.structure.alcoholHeat}/5</span>
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Arômes</h2>
              {tasting.aromas?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tasting.aromas.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-neutral-100"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="mt-2 text-sm text-neutral-300">—</div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold">Conclusion</h2>
              <div className="mt-2">
                <StarsRead value={tasting.conclusion?.stars ?? 0} />
              </div>

              {tasting.conclusion?.comment ? (
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-100">
                  {tasting.conclusion.comment}
                </div>
              ) : (
                <div className="mt-2 text-sm text-neutral-300">Pas de commentaire.</div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
