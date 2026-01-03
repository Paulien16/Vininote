"use client";

import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

export default function FavoriteButton({
  id,
  size = "md",
}: {
  id: string;
  size?: "sm" | "md";
}) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    const sync = () => setFav(isFavorite(id));
    sync();

    window.addEventListener("vininote:favorites", sync as EventListener);
    return () => window.removeEventListener("vininote:favorites", sync as EventListener);
  }, [id]);

  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  return (
    <button
      type="button"
      onClick={() => {
        toggleFavorite(id);
        setFav(isFavorite(id));
      }}
      className={`rounded-full border border-white/15 bg-white/5 ${pad} font-semibold text-white/85 hover:border-white/30`}
      aria-pressed={fav}
      title={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <span className="inline-flex items-center gap-2">
        <span className={fav ? "" : "opacity-70"}>{fav ? "⭐" : "☆"}</span>
        {fav ? "Favori" : "Ajouter"}
      </span>
    </button>
  );
}
