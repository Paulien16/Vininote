"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold tracking-tight">
          ViniNote
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-10 md:flex">
          <NavLink href="/library" label="Bibliothèque" />
          <NavLink href="/learn" label="Apprendre" />
          <NavLink href="/duels" label="Duels" />
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/30"
          >
            Se connecter
          </Link>

          <Link
            href="/signup"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </header>
  );
}
