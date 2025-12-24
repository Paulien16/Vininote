"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`text-sm font-medium transition ${
        active ? "text-white" : "text-white/70 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<number | null>(null);

  function openNow() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    // petit délai = évite les "clignotements" quand on passe de l'avatar au menu
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  }

  // Fermer si clic en dehors
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      {/* Avatar */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)} // utile mobile
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2 py-1.5 hover:border-white/30"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm font-semibold text-white">
          P
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-white/70"
        >
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
        </svg>
      </button>

      {/* Menu */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/95 shadow-lg backdrop-blur"
          role="menu"
        >
          <div className="px-3 py-2 text-xs text-white/50">Compte</div>

          <Link
            href="/profile"
            className="block px-3 py-2 text-sm text-white/85 hover:bg-white/5"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Mon profil
          </Link>

          <Link
            href="/favorites"
            className="block px-3 py-2 text-sm text-white/85 hover:bg-white/5"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Mes favoris
          </Link>

          <Link
            href="/settings"
            className="block px-3 py-2 text-sm text-white/85 hover:bg-white/5"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Paramètres
          </Link>

          <div className="my-2 h-px bg-white/10" />

          <button
            type="button"
            className="w-full px-3 py-2 text-left text-sm text-white/70 hover:bg-white/5"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              // plus tard: logout
            }}
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          ViniNote
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          <NavLink href="/library" label="Bibliothèque" />
          <NavLink href="/learn" label="Apprendre" />
          <NavLink href="/duels" label="Duels" />
        </nav>

        <ProfileMenu />
      </div>
    </header>
  );
}
