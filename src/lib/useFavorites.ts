"use client";

import { useEffect, useState } from "react";
import { getFavoriteIds } from "./favorites";

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setIds(getFavoriteIds());
    sync();

    window.addEventListener("storage", sync);
    window.addEventListener("vininote:favorites", sync as EventListener);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vininote:favorites", sync as EventListener);
    };
  }, []);

  return ids;
}
