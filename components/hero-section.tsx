import Link from "next/link";
import { HeroDashboardMockup } from "@/components/hero-dashboard-mockup";
import { Icon } from "@/components/icons";
import { homeHero } from "@/lib/data";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#111111] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,rgba(249,115,22,0.42),transparent_30%),radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(135deg,#111111_0%,#111111_54%,#3b1a07_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.98)_0%,rgba(17,17,17,0.84)_45%,rgba(17,17,17,0.58)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F7F7F5] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-36 sm:px-6 lg:px-8 lg:pt-48">
        <div className="grid gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] sm:text-4xl lg:text-5xl xl:text-6xl">
              {homeHero.headline}{" "}
              <span className="text-flame-500">{homeHero.highlighted}</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
              {homeHero.subheadline}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              {homeHero.ctas.map((cta) => (
                <Link
                  key={cta.label}
                  href={cta.href}
                  className={
                    cta.variant === "primary"
                      ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600"
                      : cta.variant === "secondary"
                        ? "inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:text-flame-200"
                        : "inline-flex min-h-12 items-center justify-center gap-2 px-2 py-3 text-sm font-semibold text-white/90 transition hover:text-flame-200"
                  }
                >
                  {cta.label}
                  {cta.variant !== "secondary" ? <Icon name="arrow" className="h-4 w-4" /> : null}
                </Link>
              ))}
            </div>
          </div>

          <HeroDashboardMockup />
        </div>
      </div>
    </section>
  );
}
