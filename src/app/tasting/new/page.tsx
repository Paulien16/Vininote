"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import WizardHeader from "@/components/ui/WizardHeader";
import { saveTasting, type Tasting } from "@/lib/storage";

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
            className={`text-2xl transition-transform duration-150 ${
              active ? "text-white" : "text-white/30"
            } hover:scale-110`}
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
        className="mt-3 w-full accent-white"
      />

      <div className="mt-2 flex justify-between text-xs text-neutral-500">
        <span>{left}</span>
        <span>{right}</span>
      </div>

      <div className="mt-2 text-sm text-neutral-300">{hint}</div>
    </div>
  );
}

function StepTabs({
  step,
  setStep,
  canJumpTo,
}: {
  step: number;
  setStep: (n: number) => void;
  canJumpTo: (n: number) => boolean;
}) {
  const steps = [
    { n: 1, label: "Vin" },
    { n: 2, label: "Origine" },
    { n: 3, label: "Structure" },
    { n: 4, label: "Arômes" },
    { n: 5, label: "Conclusion" },
  ];

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {steps.map((s) => {
        const active = s.n === step;
        const disabled = !canJumpTo(s.n);

        return (
          <button
            key={s.n}
            type="button"
            disabled={disabled}
            onClick={() => setStep(s.n)}
            className={[
              "rounded-full px-4 py-2 text-sm border transition duration-200",
              active
                ? "bg-white text-neutral-900 border-white"
                : "border-white/15 text-white/70 hover:border-white/30 hover:bg-white/5",
              disabled ? "opacity-40 cursor-not-allowed hover:border-white/15" : "",
            ].join(" ")}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

export default function NewTasting() {
  const router = useRouter();

  // Wizard
  const totalSteps = 5;
  const [step, setStep] = useState(1);

  // Étape 1
  const [year, setYear] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState<WineColor>("");

  // Étape 2
  const [region, setRegion] = useState("");
  const [appellation, setAppellation] = useState("");

  // Cépages (search dropdown + multi + ajout libre)
  const [grapes, setGrapes] = useState<string[]>([]);
  const [grapeQuery, setGrapeQuery] = useState("");
  const [grapeMenuOpen, setGrapeMenuOpen] = useState(false);
  const grapeWrapRef = useRef<HTMLDivElement | null>(null);

  // Étape 3
  const [acidity, setAcidity] = useState(3);
  const [body, setBody] = useState(3);
  const [tannins, setTannins] = useState(3);
  const [sweetness, setSweetness] = useState(3);
  const [alcoholHeat, setAlcoholHeat] = useState(3);

  // Étape 4
  const [aromas, setAromas] = useState<string[]>([]);
  const [aromaInput, setAromaInput] = useState("");

  // Étape 5
  const [stars, setStars] = useState(3);
  const [comment, setComment] = useState("");

  // UI
  const [toast, setToast] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Animation entre étapes (re-mount)
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [step]);

  // Photo
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    e.target.value = "";
  }

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  // Close grapes menu on outside click
  useEffect(() => {
    function onDocClick(ev: MouseEvent) {
      const el = grapeWrapRef.current;
      if (!el) return;
      if (!el.contains(ev.target as Node)) setGrapeMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Grapes helpers
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

  // Wizard state
  const progressPct = Math.round((step / totalSteps) * 100);

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

  const canGoNext = useMemo(() => {
    if (step === 1) return Boolean(year && name && color);
    return true;
  }, [step, year, name, color]);

  function canJumpTo(n: number) {
    if (n === 1) return true;
    return Boolean(year && name && color);
  }

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  }

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
    const tasting: Tasting = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
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

    saveTasting(tasting);
    showToast("✅ Dégustation enregistrée !");
    router.push("/library");
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTextArea = tag === "textarea";

      const mod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + Enter -> finish on step 5
      if (mod && e.key === "Enter" && step === 5) {
        e.preventDefault();
        onFinish();
        return;
      }

      // Esc -> back
      if (e.key === "Escape") {
        e.preventDefault();
        onBack();
        return;
      }

      // Enter -> next (except textarea)
      if (e.key === "Enter" && !isTextArea) {
        e.preventDefault();
        if (step < 5) onNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, year, name, color, acidity, body, tannins, sweetness, alcoholHeat, aromas, stars, comment]);

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

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <WizardHeader />

      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Top header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Nouvelle dégustation</h1>
          <p className="mt-1 text-sm text-neutral-300">
            Étape {step}/{totalSteps} — {stepTitle}
          </p>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <StepTabs step={step} setStep={setStep} canJumpTo={canJumpTo} />
        </div>

        {/* Card */}
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20 hover:bg-white/[0.07]">
          {/* subtle glow */}
          <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 hover:opacity-100" />

          {/* Step content (animated) */}
          <div
            key={animKey}
            className="animate-[fadeSlide_220ms_ease-out]"
          >
            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold">Le vin</h2>
                <p className="mt-1 text-sm text-neutral-300">
                  Minimum pour continuer : millésime, nom, couleur.
                </p>

                <div className="mt-6">
                  <label className="block mb-2 text-sm text-neutral-300">Millésime</label>
                  <input
                    type="number"
                    placeholder="Ex : 2021"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900/70 px-3 py-2 text-neutral-100 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10"
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
                        className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded-lg text-sm hover:bg-black/70 transition"
                      >
                        Changer
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full rounded-2xl border border-neutral-700 bg-neutral-900/70 px-4 py-3 text-left text-neutral-300 hover:bg-neutral-800/60 transition"
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
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900/70 px-3 py-2 text-neutral-100 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10"
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
                        className={`px-4 py-2 rounded-full text-sm capitalize border transition duration-200 hover:scale-[1.02]
                          ${
                            color === c
                              ? "bg-white text-neutral-900 border-white"
                              : "border-neutral-600 text-neutral-300 hover:border-neutral-400 hover:bg-white/5"
                          }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold">Origine</h2>
                <p className="mt-1 text-sm text-neutral-300">
                  Recherche un cépage (menu déroulant), sélection multiple, ajout libre possible.
                </p>

                <div className="mt-6">
                  <label className="block mb-2 text-sm text-neutral-300">Région</label>
                  <input
                    type="text"
                    placeholder="Ex : Bordeaux, Bourgogne, Rhône…"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900/70 px-3 py-2 text-neutral-100 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </div>

                <div className="mt-6">
                  <label className="block mb-2 text-sm text-neutral-300">Appellation</label>
                  <input
                    type="text"
                    placeholder="Ex : Margaux, Sancerre, Chablis…"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900/70 px-3 py-2 text-neutral-100 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10"
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
                          className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-neutral-100 hover:bg-white/15 transition"
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
                      placeholder="Rechercher un cépage… (ex : Chardonnay)"
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-900/70 px-3 py-2 text-neutral-100 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10"
                    />

                    {grapeMenuOpen && (grapeResults.length > 0 || canAddCustomGrape) && (
                      <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl">
                        <div className="max-h-60 overflow-auto py-1">
                          {grapeResults.map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => addGrape(g)}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-100 hover:bg-white/10 transition"
                            >
                              {g}
                            </button>
                          ))}

                          {canAddCustomGrape && (
                            <button
                              type="button"
                              onClick={() => addGrape(grapeQuery)}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-100 hover:bg-white/10 transition"
                            >
                              Ajouter “{grapeQuery.trim()}”
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-neutral-500">
                    Astuce : clique sur une chip pour la supprimer.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold">Structure</h2>
                <p className="mt-1 text-sm text-neutral-300">
                  Échelle 1→5 : 1 = faible, 5 = intense.
                </p>

                <SliderRow
                  label="Acidité"
                  value={acidity}
                  onChange={setAcidity}
                  left="Faible"
                  right="Très élevée"
                  hint={acidityHint}
                />

                <SliderRow
                  label="Corps"
                  value={body}
                  onChange={setBody}
                  left="Fin"
                  right="Très riche"
                  hint={bodyHint}
                />

                {color === "rouge" && (
                  <SliderRow
                    label="Tanins"
                    value={tannins}
                    onChange={setTannins}
                    left="Souples"
                    right="Très élevés"
                    hint={tanninsHint}
                  />
                )}

                <SliderRow
                  label="Sucrosité perçue"
                  value={sweetness}
                  onChange={setSweetness}
                  left="Très sec"
                  right="Très doux"
                  hint={sweetnessHint}
                />

                <SliderRow
                  label="Chaleur alcoolique"
                  value={alcoholHeat}
                  onChange={setAlcoholHeat}
                  left="Aucune"
                  right="Très élevée"
                  hint={alcoholHint}
                />
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold">Arômes</h2>
                <p className="mt-1 text-sm text-neutral-300">
                  Clique des suggestions, ou ajoute tes propres mots.
                </p>

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
                          className={`px-4 py-2 rounded-full text-sm border transition duration-200 hover:scale-[1.02]
                            ${
                              active
                                ? "bg-white text-neutral-900 border-white"
                                : "border-neutral-600 text-neutral-300 hover:border-neutral-400 hover:bg-white/5"
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
                      placeholder="Ajouter un arôme… (ex : miel, truffe, cuir)"
                      className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900/70 px-3 py-2 text-neutral-100 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => addAroma(aromaInput)}
                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 transition"
                    >
                      Ajouter
                    </button>
                  </div>

                  {aromas.length > 0 && (
                    <div className="mt-3 text-sm text-neutral-300">
                      Sélectionné :{" "}
                      <span className="text-neutral-100">{aromas.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div>
                <h2 className="text-xl font-semibold">Conclusion</h2>
                <p className="mt-1 text-sm text-neutral-300">
                  Note ton plaisir. Commentaire optionnel.
                </p>

                <div className="mt-6">
                  <label className="block mb-2 text-sm text-neutral-300">Note</label>
                  <Stars value={stars} onChange={setStars} />
                </div>

                <div className="mt-6">
                  <label className="block mb-2 text-sm text-neutral-300">Commentaire (optionnel)</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ex : Très frais, parfait à l’apéro. Belle finale…"
                    className="w-full min-h-[120px] rounded-2xl border border-neutral-700 bg-neutral-900/70 px-3 py-2 text-neutral-100 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10"
                  />
                  <div className="mt-2 text-xs text-neutral-500">
                    Raccourci : Cmd/Ctrl + Enter pour enregistrer.
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-neutral-100">Résumé (aperçu)</div>
                  <div className="mt-2 text-sm text-neutral-300">
                    <span className="text-neutral-100">{name || "Vin"}</span>{" "}
                    {year ? `(${year})` : ""} — {color || "couleur ?"}
                    {region ? ` · ${region}` : ""}
                    {appellation ? ` · ${appellation}` : ""}
                  </div>
                  <div className="mt-1 text-sm text-neutral-300">
                    Structure : acidité {acidity}/5, corps {body}/5
                    {color === "rouge" ? `, tanins ${tannins}/5` : ""}
                    , sucrosité {sweetness}/5, alcool {alcoholHeat}/5
                  </div>
                  {aromas.length > 0 && (
                    <div className="mt-1 text-sm text-neutral-300">
                      Arômes : {aromas.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-10 border-t border-white/10 pt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={step === 1}
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 hover:border-white/30 hover:bg-white/5 transition disabled:opacity-40"
            >
              Retour
            </button>

            {step < totalSteps ? (
              <button
                type="button"
                onClick={onNext}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 transition disabled:opacity-50"
                disabled={!canGoNext}
              >
                Suivant <span className="opacity-60">⏎</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onFinish}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 transition"
              >
                Terminer <span className="opacity-60">⌘⏎</span>
              </button>
            )}
          </div>

          <p className="mt-3 text-xs text-neutral-500">
            Astuces : Enter = suivant (sauf commentaire), Esc = retour.
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-900 shadow-lg animate-[toastIn_180ms_ease-out]">
          {toast}
        </div>
      )}

      {/* Keyframes (Tailwind arbitrary animations) */}
      <style jsx global>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </main>
  );
}
