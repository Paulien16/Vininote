"use client";

import Link from "next/link";

export default function WizardHeader() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800">
      <Link href="/" className="text-lg font-semibold text-neutral-100 hover:text-white">
        ViniNote
      </Link>

      <Link
        href="/"
        className="text-sm text-neutral-400 hover:text-neutral-200"
      >
        Annuler
      </Link>
    </header>
  );
}
