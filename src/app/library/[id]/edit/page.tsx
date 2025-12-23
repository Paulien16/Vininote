"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import WizardHeader from "@/components/ui/WizardHeader";
import { getTastingById, updateTasting, type Tasting } from "@/lib/storage";

type WineColor = "rouge" | "blanc" | "rose" | "";

const GRAPES_SUGGESTIONS = [
  "Chardonnay",
  "Sauvignon Blanc",
  "Pinot Noir",
  "Syrah",
  "Merlot",
  "Cabernet Sauvignon",
  "Cabernet Franc",
  "Grenache",
  "Cinsault",
  "Mourvèdre",
  "Riesling",
  "Chenin",
  "Gewurztraminer",
  "Viognier",
  "Sémillon",
  "Malbec",
  "Gamay",
  "Pinot Gris",
  "Muscat",
  "Petit Verdot",
  "Carignan",
  "Tempranillo",
  "Sangiovese",
  "Nebbiolo",
] as const;

const AROMA_SUGGESTIONS = [
  "Agrumes",
  "Pomme/Poire",
  "Fruits rouges",
  "Fruits noirs",
  "Fruits exotiques",
  "Fleurs",
  "Végétal",
  "Épices",
  "Vanille/Boisé",
  "Toasté",
  "Minéral",
  "Beurré/Noisette",
] as const;

function clampInt(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`text-2xl transition ${active ? "text-white" : "text-white/30"}`}
            aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
            title={`${n} étoile${n > 1 ? "s" : ""}`}
          >
            ★
          </button>
        );
      })}
      <span className="text-sm text-neutral-300 ml-2">{value}/5</span>
    </div>
  );
}

function SliderRow({
  label,
  value,
  onChange,
  left,
  right,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  left: string;
  right: string;
  hint: string;
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <label className="text-sm text-neutral-300">{label}</label>
        <span className="text-sm font-semibold text-neutral-100">{value}/5</span>
      </div>

      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(clampInt(Number(e.target.value), 1, 5))}
        className="mt-3 w-full"
      />

      <div className="mt-2 flex justify-between text-xs text-neutral-500">
        <span>{left}</span>
        <span>{right}</span>
      </div>

      <div className="mt-2 text-sm text-neutral-300">{hint}</div>
    </div>
  );
}

export default function EditTastingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const totalSteps = 5;
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  const [loaded, setLoaded] = useState<Tasting | null>(null);

  // Step 1
  const [year, setYear] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState<WineColor>("");

  // Step 2
  const [region, setRegion] = useState("");
  const [appellation, setAppellation] = useState("");
  const [grapes, setGrapes] = useState<string[]>([]);
  const [grapeQuery, setGrapeQuery] = useState("");
  const [grapeMenuOpen, setGrapeMenuOpen] = useState(false);
  const grapeWrapRef = useRef<HTMLDivElement | null>(null);

  // Step 3
  const [acidity, setAcidity] = useState(3);
  const [body, setBody] = useState(3);
  const [tannins, setTannins] = useState(3);
  const [sweetness, setSweetness] = useState(3);
  const [alcoholHeat, setAlcoholHeat] = useState(3);

  // Step 4
  const [aromas, setAromas] = useState<string[]>([]);
  const [aromaInput, setAromaInput] = useState("");

  // Step 5
  const [stars, setStars] = useState(3);
  const [comment, setComment] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  }

  // Load initial
  useEffect(() => {
    if (!id) return;
    const t = getTastingById(id);
    if (!t) {
      router.push("/library");
      return;
    }
    setLoaded(t);

    // Prefill
    setYear(t.wine.year || "");
    setName(t.wine.name || "");
    setColor(t.wine.color || "");
    setPhotoUrl(t.wine.photoUrl ?? null);

    setRegion(t.wine.region || "");
    setAppellation(t.wine.appellation || "");
    setGrapes(t.wine.grapes || []);

    setAcidity(t.structure.acidity ?? 3);
    setBody(t.structure.body ?? 3);
    setTannins(t.structure.tannins ?? 3);
    setSweetness(t.structure.sweetness ?? 3);
    setAlcoholHeat(t.structure.alcoholHeat ?? 3);

    setAromas(t.aromas ?? []);
    setStars(t.conclusion.stars ?? 3);
    setComment(t.conclusion.comment ?? "");
  }, [id, router]);

  // Close grape menu outside click
  useEffect(() => {
    function onDocClick(ev: MouseEvent) {
      const el = grapeWrapRef.current;
      if (!el) return;
      if (!el.contains(ev.target as Node)) setGrapeMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Photo change
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    e.target.value = "";
  }

  // Grapes
  function addGrape(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setGrapes((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setGrapeQuery("");
    setGrapeMenuOpen(false);
  }
  function removeGrape(g: string) {
    setGrapes((prev) => prev.filter((x) => x !== g));
  }

  const grapeResults = useMemo(() => {
    const q = grapeQuery.trim().toLowerCase();
    const list = Array.from(GRAPES_SUGGESTIONS);
    const filtered = q ? list.filter((g) => g.toLowerCase().includes(q)) : list;
    return filtered.filter((g) => !grapes.includes(g)).slice(0, 8);
  }, [grapeQuery, grapes]);

  const canAddCustomGrape = useMemo(() => {
    const q = grapeQuery.trim();
    if (!q) return false;
    const inSuggestions = Array.from(GRAPES_SUGGESTIONS).some(
      (g) => g.toLowerCase() === q.toLowerCase()
    );
    const alreadySelected = grapes.some((g) => g.toLowerCase() === q.toLowerCase());
    return !inSuggestions && !alreadySelected;
  }, [grapeQuery, grapes]);

  // Aromas
  function addAroma(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setAromas((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setAromaInput("");
  }
  function removeAroma(a: string) {
    setAromas((prev) => prev.filter((x) => x !== a));
  }

  const stepTitle = useMemo(() => {
    switch (step) {
      case 1:
        return "Le vin";
      case 2:
        return "Origine";
      case 3:
        return "Structure";
      case 4:
        return "Arômes";
      case 5:
        return "Conclusion";
      default:
        return "";
    }
  }, [step]);

  const progressPct = Math.round((step / totalSteps) * 100);

  const canGoNext = useMemo(() => {
    if (step === 1) return Boolean(year && name && color);
    return true;
  }, [step, year, name, color]);

  function onNext() {
    if (!canGoNext) {
      showToast("⚠️ Ajoute au moins millésime, nom et couleur.");
      return;
    }
    setStep((s) => Math.min(totalSteps, s + 1));
  }
  function onBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  function onFinish() {
    if (!loaded) return;

    const updated: Tasting = {
      ...loaded,
      wine: {
        year,
        name,
        color,
        photoUrl,
        region,
        appellation,
        grapes,
      },
      structure: {
        acidity,
        body,
        tannins: color === "rouge" ? tannins : null,
        sweetness,
        alcoholHeat,
      },
      aromas,
      conclusion: {
        stars,
        comment: comment.trim() || null,
      },
    };

    updateTasting(updated);
    showToast("✅ Dégustation mise à jour !");
    router.push("/library");
  }

  // Hints
  const acidityHint =
    acidity === 1
      ? "👉 Très faible : plutôt mou/peu salivant."
      : acidity === 2
      ? "👉 Faible : rondeur + légère fraîcheur."
      : acidity === 3
      ? "👉 Moyenne : équilibre frais."
      : acidity === 4
      ? "👉 Élevée : vif, salivant."
      : "👉 Très élevée : très tendu, nerveux.";

  const bodyHint =
    body === 1
      ? "👉 Très léger : fluide, peu de matière."
      : body === 2
      ? "👉 Léger : fin, facile."
      : body === 3
      ? "👉 Moyen : présence équilibrée."
      : body === 4
      ? "👉 Riche : ample, plus de volume."
      : "👉 Très riche : dense, opulent.";

  const tanninsHint =
    tannins === 1
      ? "👉 Très faibles : presque aucun assèchement."
      : tannins === 2
      ? "👉 Faibles : tanins souples."
      : tannins === 3
      ? "👉 Moyens : structure présente."
      : tannins === 4
      ? "👉 Élevés : bouche plus asséchante."
      : "👉 Très élevés : très astringent, puissant.";

  const sweetnessHint =
    sweetness === 1
      ? "👉 Très sec."
      : sweetness === 2
      ? "👉 Sec."
      : sweetness === 3
      ? "👉 Équilibré / légèrement doux."
      : sweetness === 4
      ? "👉 Doux."
      : "👉 Très doux / liquoreux.";

  const alcoholHint =
    alcoholHeat === 1
      ? "👉 Pas de chaleur alcoolique."
      : alcoholHeat === 2
      ? "👉 Faible sensation."
      : alcoholHeat === 3
      ? "👉 Moyenne : perceptible."
      : alcoholHeat === 4
      ? "👉 Élevée : ça chauffe."
      : "👉 Très élevée : très chaleureux.";

  if (!loaded) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-50">
        <WizardHeader />
        <div className="mx-auto max-w-2xl px-6 py-10 text-neutral-300">
          Chargement…
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <WizardHeader />

      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Modifier une dégustation</h1>
          <p className="mt-1 text-sm text-neutral-300">
            Étape {step}/{totalSteps} — {stepTitle}
          </p>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-white" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold">Le vin</h2>

              <div className="mt-6">
                <label className="block mb-2 text-sm text-neutral-300">Millésime</label>
                <input
                  type="number"
                  placeholder="Ex : 2021"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div className="mt-6">
                <label className="block mb-2 text-sm text-neutral-300">Photo du vin</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                {photoUrl ? (
                  <div className="relative">
                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-2xl border border-neutral-800"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded-lg text-sm hover:bg-black/70"
                    >
                      Changer
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-2xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-left text-neutral-300 hover:bg-neutral-800/60"
                  >
                    Ajouter une photo…
                  </button>
                )}
              </div>

              <div className="mt-6">
                <label className="block mb-2 text-sm text-neutral-300">Nom du vin</label>
                <input
                  type="text"
                  placeholder="Ex : Château Machin"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mt-6">
                <label className="block mb-2 text-sm text-neutral-300">Couleur</label>
                <div className="flex gap-3">
                  {(["rouge", "blanc", "rose"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`px-4 py-2 rounded-full text-sm capitalize border transition
                        ${
                          color === c
                            ? "bg-white text-neutral-900 border-white"
                            : "border-neutral-600 text-neutral-300 hover:border-neutral-400"
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold">Origine</h2>

              <div className="mt-6">
                <label className="block mb-2 text-sm text-neutral-300">Région</label>
                <input
                  type="text"
                  placeholder="Ex : Bordeaux"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </div>

              <div className="mt-6">
                <label className="block mb-2 text-sm text-neutral-300">Appellation</label>
                <input
                  type="text"
                  placeholder="Ex : Margaux"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100"
                  value={appellation}
                  onChange={(e) => setAppellation(e.target.value)}
                />
              </div>

              <div className="mt-6" ref={grapeWrapRef}>
                <label className="block mb-2 text-sm text-neutral-300">Cépages</label>

                {grapes.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {grapes.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => removeGrape(g)}
                        className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-neutral-100 hover:bg-white/15"
                        title="Cliquer pour supprimer"
                      >
                        {g} <span className="text-white/60">×</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <input
                    value={grapeQuery}
                    onChange={(e) => {
                      setGrapeQuery(e.target.value);
                      setGrapeMenuOpen(true);
                    }}
                    onFocus={() => setGrapeMenuOpen(true)}
                    placeholder="Rechercher un cépage…"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100"
                  />

                  {grapeMenuOpen && (grapeResults.length > 0 || canAddCustomGrape) && (
                    <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-xl">
                      <div className="max-h-60 overflow-auto py-1">
                        {grapeResults.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => addGrape(g)}
                            className="w-full px-3 py-2 text-left text-sm text-neutral-100 hover:bg-white/10"
                          >
                            {g}
                          </button>
                        ))}

                        {canAddCustomGrape && (
                          <button
                            type="button"
                            onClick={() => addGrape(grapeQuery)}
                            className="w-full px-3 py-2 text-left text-sm text-neutral-100 hover:bg-white/10"
                          >
                            Ajouter “{grapeQuery.trim()}”
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <p className="mt-2 text-xs text-neutral-500">
                  Clique sur une chip pour supprimer.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold">Structure</h2>
              <SliderRow label="Acidité" value={acidity} onChange={setAcidity} left="Faible" right="Très élevée" hint={acidityHint} />
              <SliderRow label="Corps" value={body} onChange={setBody} left="Fin" right="Très riche" hint={bodyHint} />

              {color === "rouge" && (
                <SliderRow label="Tanins" value={tannins} onChange={setTannins} left="Souples" right="Très élevés" hint={tanninsHint} />
              )}

              <SliderRow label="Sucrosité perçue" value={sweetness} onChange={setSweetness} left="Très sec" right="Très doux" hint={sweetnessHint} />
              <SliderRow label="Chaleur alcoolique" value={alcoholHeat} onChange={setAlcoholHeat} left="Aucune" right="Très élevée" hint={alcoholHint} />
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold">Arômes</h2>

              <div className="mt-6">
                <label className="block mb-2 text-sm text-neutral-300">Suggestions</label>
                <div className="flex flex-wrap gap-2">
                  {AROMA_SUGGESTIONS.map((a) => {
                    const active = aromas.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => (active ? removeAroma(a) : addAroma(a))}
                        className={`px-4 py-2 rounded-full text-sm border transition
                          ${
                            active
                              ? "bg-white text-neutral-900 border-white"
                              : "border-neutral-600 text-neutral-300 hover:border-neutral-400"
                          }`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    value={aromaInput}
                    onChange={(e) => setAromaInput(e.target.value)}
                    placeholder="Ajouter un arôme…"
                    className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={() => addAroma(aromaInput)}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
                  >
                    Ajouter
                  </button>
                </div>

                {aromas.length > 0 && (
                  <div className="mt-3 text-sm text-neutral-300">
                    Sélectionné : <span className="text-neutral-100">{aromas.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-xl font-semibold">Conclusion</h2>

              <div className="mt-6">
                <label className="block mb-2 text-sm text-neutral-300">Note</label>
                <Stars value={stars} onChange={setStars} />
              </div>

              <div className="mt-6">
                <label className="block mb-2 text-sm text-neutral-300">Commentaire (optionnel)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ex : Très frais, belle finale…"
                  className="w-full min-h-[120px] rounded-2xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100"
                />
              </div>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={step === 1}
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 hover:border-white/30 disabled:opacity-40"
            >
              Retour
            </button>

            {step < totalSteps ? (
              <button
                type="button"
                onClick={onNext}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 disabled:opacity-50"
                disabled={!canGoNext}
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                onClick={onFinish}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
              >
                Enregistrer
              </button>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-900 shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
