"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllTastings, saveTasting, type Tasting } from "@/lib/storage";

type CTAState = "start" | "new";

/**
 * Home = 3 actions non-redondantes :
 * 1) CTA intelligent -> Wizard (commencer / nouvelle dégustation)
 * 2) Bibliothèque
 * 3) Note express -> crée un brouillon directement dans la bibliothèque
 */
export default function HomePage() {
  const router = useRouter();

  const [tastingsCount, setTastingsCount] = useState(0);
  const [quickName, setQuickName] = useState("");
  const [quickYear, setQuickYear] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const all = getAllTastings();
    setTastingsCount(all.length);
  }, []);

  const cta: { label: string; href: string; state: CTAState } = useMemo(() => {
    if (tastingsCount === 0) {
      return { label: "Commencer", href: "/tasting/new", state: "start" };
    }
    return { label: "Nouvelle dégustation", href: "/tasting/new", state: "new" };
  }, [tastingsCount]);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  }

  function validYear(y: string) {
    if (!y.trim()) return true;
    return /^\d{4}$/.test(y.trim());
  }

  async function onQuickSave() {
    const name = quickName.trim();
    const year = quickYear.trim();

    if (!name) {
      showToast("Entre au moins un nom de vin.");
      return;
    }
    if (!validYear(year)) {
      showToast("Année invalide (format: 2021).");
      return;
    }

    setSaving(true);

    const tasting: Tasting = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      wine: {
        name,
        year,
        color: "",
        region: "",
        appellation: "",
        grapes: [],
        photoUrl: null,
      },
      structure: {
        acidity: 3,
        body: 3,
        tannins: 0,
        sweetness: 1,
        alcoholHeat: 3,
      },
      aromas: [],
      conclusion: {
        stars: 3,
        comment: "",
      },
    };

    try {
      saveTasting(tasting);
      setQuickName("");
      setQuickYear("");
      showToast("Note express enregistrée ✅");
      const all = getAllTastings();
      setTastingsCount(all.length);
      router.push(`/library/${tasting.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-sm text-white backdrop-blur">
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          {/* Background image */}
          <div
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage: "url(/hero.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(0px)",
            }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />

          <div className="relative z-10 grid gap-8 p-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-5xl font-semibold leading-tight md:text-6xl">
                Ton carnet de <br /> dégustation
              </h1>
              <p className="mt-4 max-w-xl text-base text-white/80">
                Apprends à mettre des mots sur ton palais, un verre à la fois.
              </p>

              {/* CTAs (non-redondants) */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={cta.href}
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
                >
                  {cta.label}
                </Link>

                <Link
                  href="/library"
                  className="rounded-full border border-white/20 bg-white/0 px-6 py-3 text-sm font-semibold text-white/90 hover:border-white/35"
                >
                  Bibliothèque
                </Link>
              </div>

              {/* Note express */}
              <div className="mt-8 rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-white/60">
                  Note express
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <input
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="Quel vin dégustes-tu ? (ex : Château X)"
                    className="w-full flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45"
                  />

                  <input
                    value={quickYear}
                    onChange={(e) => setQuickYear(e.target.value)}
                    placeholder="Année (optionnel)"
                    inputMode="numeric"
                    className="w-full md:w-40 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45"
                  />

                  <button
                    type="button"
                    onClick={onQuickSave}
                    disabled={saving}
                    className="w-full md:w-auto rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 disabled:opacity-60"
                  >
                    {saving ? "..." : "Enregistrer"}
                  </button>
                </div>

                <div className="mt-2 text-xs text-white/55">
                  Ça crée une fiche simple dans ta bibliothèque. Tu pourras la compléter ensuite.
                </div>
              </div>
            </div>

            <div className="hidden md:block" />
          </div>
        </div>

        {/* SHORTCUTS */}
        <div className="mt-10">
          <div className="mb-4 text-sm font-semibold text-white/80">Raccourcis</div>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/library"
              className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="text-lg font-semibold">Dernières dégustations</div>
              <div className="mt-1 text-sm text-white/65">Reprendre où tu t’es arrêté</div>
            </Link>

            <Link
              href="/learn"
              className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="text-lg font-semibold">Apprendre</div>
              <div className="mt-1 text-sm text-white/65">Acidité, tanins, arômes…</div>
            </Link>

            <Link
              href="/duels"
              className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="text-lg font-semibold">Mode duel</div>
              <div className="mt-1 text-sm text-white/65">Comparer 2 vins facilement</div>
            </Link>
          </div>
        </div>

        {/* Small stats */}
        <div className="mt-8 text-sm text-white/55">
          {tastingsCount === 0
            ? "Aucune dégustation enregistrée pour l’instant."
            : `${tastingsCount} dégustation${tastingsCount > 1 ? "s" : ""} enregistrée${
                tastingsCount > 1 ? "s" : ""
              }.`}
        </div>
      </div>
    </main>
  );
}
