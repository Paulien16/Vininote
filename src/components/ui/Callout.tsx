"use client";

import React from "react";

type CalloutVariant = "info" | "tip" | "warning" | "note";

type CalloutProps = {
  title: string;
  children: React.ReactNode;
  variant?: CalloutVariant;
  compact?: boolean;
  className?: string;
};

function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

const VARIANTS: Record<
  CalloutVariant,
  {
    label: string;
    icon: string;
    border: string;
    bg: string;
    title: string;
    text: string;
    badge: string;
  }
> = {
  info: {
    label: "Info",
    icon: "ℹ️",
    border: "border-white/10",
    bg: "bg-white/5",
    title: "text-white",
    text: "text-white/70",
    badge: "border-white/15 bg-black/25 text-white/75",
  },
  tip: {
    label: "Astuce",
    icon: "✨",
    border: "border-emerald-400/20",
    bg: "bg-emerald-500/10",
    title: "text-emerald-50",
    text: "text-emerald-50/80",
    badge: "border-emerald-300/20 bg-emerald-500/10 text-emerald-50/80",
  },
  warning: {
    label: "Attention",
    icon: "⚠️",
    border: "border-amber-400/25",
    bg: "bg-amber-500/10",
    title: "text-amber-50",
    text: "text-amber-50/80",
    badge: "border-amber-300/25 bg-amber-500/10 text-amber-50/80",
  },
  note: {
    label: "À retenir",
    icon: "📌",
    border: "border-sky-400/20",
    bg: "bg-sky-500/10",
    title: "text-sky-50",
    text: "text-sky-50/80",
    badge: "border-sky-300/20 bg-sky-500/10 text-sky-50/80",
  },
};

export default function Callout({
  title,
  children,
  variant = "info",
  compact = false,
  className,
}: CalloutProps) {
  const v = VARIANTS[variant];

  return (
    <section
      className={cn(
        "rounded-3xl border backdrop-blur-sm",
        v.border,
        v.bg,
        compact ? "p-4" : "p-6",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid h-10 w-10 place-items-center rounded-2xl border",
              v.badge
            )}
            aria-hidden="true"
          >
            <span className="text-base">{v.icon}</span>
          </div>

          <div>
            <div className={cn("text-sm font-semibold", v.title)}>{title}</div>
            <div className="mt-1 text-xs text-white/45">{v.label}</div>
          </div>
        </div>

        {/* petite pastille */}
        <div
          className={cn(
            "rounded-full border px-2 py-1 text-[11px] font-semibold",
            v.badge
          )}
        >
          {v.label}
        </div>
      </div>

      <div
        className={cn(
          "mt-3 text-sm leading-relaxed",
          v.text,
          compact && "text-[13px]"
        )}
      >
        {children}
      </div>
    </section>
  );
}
