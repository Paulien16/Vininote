// src/lib/storage.ts

export type Tasting = {
  id: string;
  createdAt: string;

  wine: {
    year: string;
    name: string;
    color: "rouge" | "blanc" | "rose" | "";
    photoUrl: string | null;
    region: string;
    appellation: string;
    grapes: string[];
  };

  structure: {
    acidity: number; // 1..5
    body: number; // 1..5
    tannins: number | null; // 1..5 (rouge) sinon null
    sweetness: number; // 1..5
    alcoholHeat: number; // 1..5
  };

  aromas: string[];

  conclusion: {
    stars: number; // 1..5
    comment: string | null;
  };
};

const KEY = "wine_tastings_v1";

export function getTastingById(id: string): Tasting | null {
  const all = getAllTastings();
  return all.find((t) => t.id === id) ?? null;
}

export function updateTasting(updated: Tasting) {
  if (typeof window === "undefined") return;
  const all = getAllTastings();
  const next = all.map((t) => (t.id === updated.id ? updated : t));
  window.localStorage.setItem(KEY, JSON.stringify(next));
}


function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getAllTastings(): Tasting[] {
  if (typeof window === "undefined") return [];
  const data = safeParse<Tasting[]>(window.localStorage.getItem(KEY));
  return Array.isArray(data) ? data : [];
}

export function saveTasting(tasting: Tasting) {
  if (typeof window === "undefined") return;
  const all = getAllTastings();
  window.localStorage.setItem(KEY, JSON.stringify([tasting, ...all]));
}

export function deleteTasting(id: string) {
  if (typeof window === "undefined") return;
  const all = getAllTastings().filter((t) => t.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function clearAllTastings() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
