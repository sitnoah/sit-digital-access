"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import { megaMenuColumns } from "@/lib/data";

type MegaMenuProps = {
  onNavigate?: () => void;
};

export function MegaMenu({ onNavigate }: MegaMenuProps) {
  return (
    <div className="relative grid gap-0 overflow-hidden rounded-lg border border-white/12 bg-[#090909] shadow-[0_30px_90px_rgba(0,0,0,0.46)] ring-1 ring-flame-500/10 backdrop-blur-xl lg:grid-cols-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_9%_0%,rgba(249,115,22,0.18),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(249,115,22,0.12),transparent_28%),linear-gradient(180deg,#111111_0%,#090909_58%,#050505_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame-500/70 to-transparent" />
      {megaMenuColumns.map((column) => (
        <section
          key={column.title}
          className="relative z-10 border-b border-white/10 p-4 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
          aria-labelledby={`mega-${column.title.toLowerCase().replaceAll(" ", "-")}`}
        >
          <h2
            id={`mega-${column.title.toLowerCase().replaceAll(" ", "-")}`}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-flame-200"
          >
            {column.title}
          </h2>
          <div className="mt-3 grid gap-1.5">
            {column.links.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={onNavigate}
                className="group grid grid-cols-[28px_1fr] gap-2.5 rounded-md p-2 transition hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-flame-400/70"
              >
                <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.03] text-flame-400 ring-1 ring-flame-500/40 transition group-hover:bg-flame-500 group-hover:text-white group-hover:ring-flame-400">
                  <Icon name={item.icon} className="h-3.5 w-3.5" />
                </span>
                <span>
                  <span className="block text-[13px] font-semibold leading-4 text-white">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-[11px] leading-4 text-white/56">
                    {item.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <Link
            href={column.cta.href}
            onClick={onNavigate}
            className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold text-flame-300 transition hover:text-flame-100 focus:outline-none focus:ring-2 focus:ring-flame-400/70"
          >
            {column.cta.label}
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </Link>
        </section>
      ))}
    </div>
  );
}
