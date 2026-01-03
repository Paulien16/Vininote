const KEY = "vininote:favorites";

export function getFavoriteIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavoriteIds().includes(id);
}

export function setFavorite(id: string, value: boolean) {
  const ids = new Set(getFavoriteIds());
  if (value) ids.add(id);
  else ids.delete(id);
  localStorage.setItem(KEY, JSON.stringify(Array.from(ids)));

  // Important: prévenir tous les composants de l’app
  window.dispatchEvent(new Event("vininote:favorites"));
}

export function toggleFavorite(id: string) {
  setFavorite(id, !isFavorite(id));
}
