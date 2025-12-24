"use client";

import { useEffect, useState } from "react";
import { getUser, setUser, type UserProfile } from "@/lib/user";

export default function ProfilePage() {
  const [user, setLocalUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const u = getUser();
    setLocalUser(u);
    setName(u?.name ?? "");
    setBio(u?.bio ?? "");
    setPhotoUrl(u?.photoUrl ?? null);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1400);
  }

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  }

  function onSave() {
    if (!user) {
      showToast("Connecte-toi d’abord.");
      return;
    }
    const updated: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      bio: bio.trim(),
      photoUrl,
    };
    setUser(updated);
    showToast("Profil mis à jour ✅");
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-sm text-white backdrop-blur">
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Mon profil</h1>
        <p className="mt-2 text-white/65">
          Version locale (pas de backend). Tu pourras connecter ça à une vraie auth plus tard.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start gap-6">
            <div>
              <div className="h-24 w-24 overflow-hidden rounded-full border border-white/10 bg-white/10">
                {photoUrl ? (
                  <img src={photoUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-sm text-white/60">
                    —
                  </div>
                )}
              </div>

              <label className="mt-3 inline-block cursor-pointer rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-white/30">
                Changer la photo
                <input type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
              </label>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/70">Nom</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
                  placeholder="Ton nom"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
                  placeholder="Quelques mots sur toi…"
                />
              </div>

              <button
                type="button"
                onClick={onSave}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
