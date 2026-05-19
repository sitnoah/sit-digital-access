"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { africaCountries, footerLinks } from "@/lib/data";
import { Icon } from "@/components/icons";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#090909] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(249,115,22,0.2),transparent_30%),radial-gradient(circle_at_88%_22%,rgba(249,115,22,0.12),transparent_26%),linear-gradient(180deg,#111111_0%,#090909_58%,#050505_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame-500/70 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.95fr_0.9fr_0.85fr]">
          <div>
            <Link href="/" className="inline-flex" aria-label="SIT Digital Access home">
              <BrandLogo variant="footer" />
            </Link>
            <p className="mt-4 text-sm font-semibold text-white">
              Part of SIT Learning and SIT Technology ecosystem
            </p>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/62">
              Affordable refurbished technology, digital skills enablement and deployment
              support for schools, SMEs, NGOs, training centres and communities.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-flame-300">
              Links
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/62 transition hover:text-flame-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-flame-300">
              Connect
            </h2>
            <div className="mt-5 flex gap-3">
              {["in", "x", "yt"].map((item) => (
                <span
                  key={item}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/5 text-xs font-semibold uppercase text-white/80 transition hover:border-flame-400/70 hover:bg-flame-500 hover:text-white"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6 space-y-3 text-sm text-white/62">
              <p className="flex gap-2">
                <Icon name="map" className="mt-0.5 h-4 w-4 shrink-0 text-flame-300" />
                UK-based with Africa deployment partnerships
              </p>
              <p className="flex gap-2">
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-flame-300" />
                hello@sitdigitalaccess.example
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-flame-300">
              Deployment
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {africaCountries.map((country) => (
                <span
                  key={country}
                  className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/68"
                >
                  {country}
                </span>
              ))}
            </div>
            <Link
              href="/africa-deployment#africa-enquiry"
              className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full bg-flame-500 px-4 text-sm font-semibold text-white transition hover:bg-flame-600"
            >
              Plan a deployment
            </Link>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/48 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SIT Digital Access. All rights reserved.</p>
          <p>Affordable technology access for learning, work and digital growth.</p>
        </div>
      </div>
    </footer>
  );
}
