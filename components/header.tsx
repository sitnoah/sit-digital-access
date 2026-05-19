"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnnouncementBar } from "@/components/announcement-bar";
import { BrandLogo } from "@/components/brand-logo";
import { Icon } from "@/components/icons";
import { MegaMenu } from "@/components/mega-menu";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMegaMenu(null);
  }, [pathname]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      <AnnouncementBar />
      <nav className="border-b border-white/10 bg-[#0B0B0B] shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex min-w-0 items-center"
            aria-label="SIT Digital Access home"
            onClick={() => {
              setMobileOpen(false);
              setActiveMegaMenu(null);
            }}
          >
            <BrandLogo className="max-w-[250px]" />
          </Link>

          <div className="hidden items-center gap-2 2xl:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const menuActive = activeMegaMenu === item.href;

              if (item.hasMenu) {
                return (
                  <button
                    key={item.href}
                    type="button"
                    aria-expanded={menuActive}
                    aria-controls="desktop-mega-menu"
                    aria-label={`${menuActive ? "Close" : "Open"} ${item.label} menu`}
                    onClick={() =>
                      setActiveMegaMenu((current) => (current === item.href ? null : item.href))
                    }
                    className={cn(
                      "group inline-flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-[12px] font-medium text-white/72 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-flame-300",
                      (active || menuActive) && "border-flame-500 text-white"
                    )}
                  >
                    {item.label}
                    <Icon
                      name="chevron"
                      className={cn(
                        "h-3.5 w-3.5 text-white/45 transition group-hover:text-flame-300",
                        menuActive && "rotate-180 text-flame-300"
                      )}
                    />
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setActiveMegaMenu(null)}
                  className={cn(
                    "group inline-flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-[12px] font-medium text-white/72 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-flame-300",
                    active && "border-flame-500 text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/devices#device-request"
              className="inline-flex min-h-10 items-center rounded-full bg-flame-500 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600 focus:outline-none focus:ring-2 focus:ring-flame-300 focus:ring-offset-2 focus:ring-offset-ink"
            >
              Request Devices
            </Link>
            <Link
              href="/book-repair"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-flame-300/70 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:border-flame-200 hover:bg-flame-500/16 hover:text-flame-100 focus:outline-none focus:ring-2 focus:ring-flame-300 focus:ring-offset-2 focus:ring-offset-ink"
            >
              <Icon name="wrench" className="h-4 w-4" />
              Book Repair
            </Link>
            <Link
              href="/donate"
              className="inline-flex min-h-10 items-center rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-flame-300 hover:text-flame-200 focus:outline-none focus:ring-2 focus:ring-flame-300 focus:ring-offset-2 focus:ring-offset-ink"
            >
              Sponsor
            </Link>
            {activeMegaMenu ? (
              <button
                type="button"
                className="hidden h-10 w-10 items-center justify-center rounded-full text-white/82 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-flame-300 2xl:inline-flex"
                aria-label="Close menu"
                onClick={() => setActiveMegaMenu(null)}
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            ) : null}
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/8 text-white transition hover:bg-white/14 focus:outline-none focus:ring-2 focus:ring-flame-300 2xl:hidden"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => {
              setMobileOpen((value) => !value);
              setActiveMegaMenu(null);
            }}
          >
            <Icon name={mobileOpen ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {activeMegaMenu ? (
        <div id="desktop-mega-menu" className="hidden px-4 pt-4 2xl:block">
          <div className="mx-auto flex max-w-[calc(100%-4rem)] justify-end">
            <div className="w-full max-w-[940px]">
              <MegaMenu onNavigate={() => setActiveMegaMenu(null)} />
            </div>
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <div id="mobile-menu" className="relative max-h-[calc(100vh-120px)] overflow-y-auto border-t border-white/10 bg-[#090909] px-4 pb-5 pt-3 shadow-[0_30px_80px_rgba(0,0,0,0.5)] 2xl:hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(249,115,22,0.18),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(249,115,22,0.1),transparent_28%),linear-gradient(180deg,#101010_0%,#090909_56%,#050505_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame-500/70 to-transparent" />
          <div className="relative mx-auto grid max-w-7xl gap-4">
            <div className="grid gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const menuActive = activeMegaMenu === item.href;

                if (item.hasMenu) {
                  return (
                    <button
                      key={item.href}
                      type="button"
                      aria-expanded={menuActive}
                      aria-controls="mobile-mega-menu"
                      aria-label={`${menuActive ? "Close" : "Open"} ${item.label} menu`}
                      onClick={() =>
                        setActiveMegaMenu((current) => (current === item.href ? null : item.href))
                      }
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-3 text-left text-sm font-semibold text-white/78 transition hover:border-white/10 hover:bg-white/[0.07] hover:text-white focus:outline-none focus:ring-2 focus:ring-flame-300",
                        (active || menuActive) &&
                          "border-flame-500/35 bg-flame-500 text-white hover:border-flame-500/35 hover:bg-flame-500 hover:text-white"
                      )}
                    >
                      <span>{item.label}</span>
                      <Icon
                        name="chevron"
                        className={cn("h-4 w-4 transition", menuActive && "rotate-180")}
                      />
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setMobileOpen(false);
                      setActiveMegaMenu(null);
                    }}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg border border-transparent px-3 py-3 text-sm font-semibold text-white/78 transition hover:border-white/10 hover:bg-white/[0.07] hover:text-white",
                      active && "border-flame-500/35 bg-flame-500 text-white hover:border-flame-500/35 hover:bg-flame-500 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            {activeMegaMenu ? (
              <div id="mobile-mega-menu">
                <MegaMenu
                  onNavigate={() => {
                    setMobileOpen(false);
                    setActiveMegaMenu(null);
                  }}
                />
              </div>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                href="/devices#device-request"
                onClick={() => {
                  setMobileOpen(false);
                  setActiveMegaMenu(null);
                }}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-flame-500 px-5 py-2 text-sm font-semibold text-white"
              >
                Request Devices
              </Link>
              <Link
                href="/book-repair"
                onClick={() => {
                  setMobileOpen(false);
                  setActiveMegaMenu(null);
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-flame-300/70 bg-white/8 px-5 py-2 text-sm font-semibold text-white"
              >
                <Icon name="wrench" className="h-4 w-4" />
                Book Repair
              </Link>
              <Link
                href="/donate"
                onClick={() => {
                  setMobileOpen(false);
                  setActiveMegaMenu(null);
                }}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white"
              >
                Sponsor
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
