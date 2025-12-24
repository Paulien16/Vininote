"use client";

import Link from "next/link";

type Module = {
  id: string;
  title: string;
  subtitle: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  eta: string;
  href: string;
  emoji: string;
  points: string[];
  locked?: boolean;
};

const modules: Module[] = [
  {
    id: "basics",
    emoji: "🍇",
    title: "Les bases du vin",
    subtitle: "Cépages, étiquette, millésime, région vs appellation",
    level: "Débutant",
    eta: "10–15 min",
    href: "/learn/basics",
    points: ["Cépage", "Étiquette", "Millésime", "Région vs appellation"],
  },
  {
    id: "taste",
    emoji: "👅",
    title: "Le goût",
    subtitle: "Acidité, tanins, sucre, alcool — comment les repérer",
    level: "Intermédiaire",
    eta: "12–18 min",
    href: "/learn/taste",
    points: ["Acidité", "Tanins", "Sucre", "Alcool", "Erreurs fréquentes"],
  },
  {
    id: "aromas",
    emoji: "👃",
    title: "Les arômes",
    subtitle: "Fruité, floral, épices, boisé — entraîner son nez",
    level: "Intermédiaire",
    eta: "12–18 min",
    href: "/learn/aromas",
    points: ["Roue simplifiée", "Rouges vs blancs", "Méthodes d’entraînement"],
  },
  {
    id: "styles",
    emoji: "🍷",
    title: "Les styles de vins",
    subtitle: "Léger → puissant, frais, tannique, gourmand, boisé",
    level: "Avancé",
    eta: "10–16 min",
    href: "/learn/styles",
    points: ["Classer un vin", "3 exemples par style", "Repères rapides"],
  },
  {
    id: "describe",
    emoji: "📚",
    title: "Décrire un vin",
    subtitle: "Structure d’une fiche + lexique simple + exemples",
    level: "Avancé",
    eta: "12–20 min",
    href: "/learn/describe",
    points: ["Attaque", "Milieu", "Finale", "Exemples"],
  },
  {
    id: "quiz",
    emoji: "🧪",
    title: "Exercices & Quiz",
    subtitle: "Tester ses connaissances et préparer le mode Duel",
    level: "Intermédiaire",
    eta: "5–10 min",
    href: "/learn/quiz",
    points: ["Mini quiz", "Reconnaître un style", "Deviner un arôme"],
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
      {children}
    </span>
  );
}

function LevelDot({ level }: { level: Module["level"] }) {
  const label =
    level === "Débutant" ? "Facile" : level === "Intermédiaire" ? "Moyen" : "Difficile";

  return (
    <span className="inline-flex items-center gap-2 text-xs text-white/70">
      <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
      {label}
    </span>
  );
}

function ModuleCard({ m }: { m: Module }) {
  return (
    <Link
      href={m.href}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      {/* subtle glow */}
      <div className="pointer-events-none absolute -inset-16 opacity-0 transition group-hover:opacity-100">
        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/30 text-xl">
              {m.emoji}
            </div>
            <div>
              <div className="text-lg font-semibold text-white">{m.title}</div>
              <div className="mt-1 text-sm text-white/65">{m.subtitle}</div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge>{m.level}</Badge>
            <span className="text-xs text-white/55">{m.eta}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <LevelDot level={m.level} />
          <span className="text-xs text-white/50">•</span>
          <span className="text-xs text-white/70">Module</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {m.points.slice(0, 4).map((p) => (
            <span
              key={p}
              className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70"
            >
              {p}
            </span>
          ))}
        </div>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/85">
          Commencer
          <span className="transition group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <div className="text-sm font-semibold text-white/70">Académie ViniNote</div>
          <h1 className="mt-2 text-4xl font-semibold leading-tight md:text-5xl">
            Apprendre, progresser, jouer.
          </h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Des modules courts, utiles, sans snobisme. Tu avances à ton rythme et tu te
            prépares au mode Duel.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>Modules courts</Badge>
            <Badge>Quiz</Badge>
            <Badge>Niveaux (bientôt)</Badge>
            <Badge>Duels (bientôt)</Badge>
          </div>
        </div>

        {/* Modules grid */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {modules.map((m) => (
            <ModuleCard key={m.id} m={m} />
          ))}
        </div>

        {/* Footer hint */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70">
          <div className="text-sm font-semibold text-white">Prochaine étape</div>
          <p className="mt-2 text-sm text-white/70">
            On va créer le premier module <span className="text-white">“Les bases du vin”</span>{" "}
            avec des sections + un mini quiz. Ensuite on pourra ajouter une progression et un
            niveau de connaisseur.
          </p>
        </div>
      </div>
    </main>
  );
}
