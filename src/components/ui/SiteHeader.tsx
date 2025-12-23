"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={[
        "rounded-full px-4 py-2 text-sm transition",
        active
          ? "bg-white text-neutral-900"
          : "text-white/80 hover:text-white hover:bg-white/10",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          ViniNote
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink href="/library" label="Bibliothèque" />
          <NavLink href="/learn" label="Apprendre" />
          <NavLink href="/duels" label="Duels" />
        </nav>

        <Link
          href="/tasting/new"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
        >
          Nouvelle dégustation
        </Link>
      </div>
    </header>
  );
}
