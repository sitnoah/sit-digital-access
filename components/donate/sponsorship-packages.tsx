import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { sponsorshipPackages } from "@/lib/donation-options";

export function SponsorshipPackages() {
  return (
    <section id="sponsorship-packages" className="scroll-mt-36 bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Sponsorship packages
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Sponsorship packages for practical digital access.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Choose a route that fits your giving goals, from one configured learner laptop to a
              full computer lab or recurring corporate impact partnership.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {sponsorshipPackages.map((item, index) => (
            <AnimatedSection key={item.title} delay={index * 0.04}>
              <article
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft",
                  item.recommended ? "border-flame-300 ring-4 ring-flame-100" : "border-line"
                )}
              >
                {item.recommended ? (
                  <span className="absolute right-4 top-4 rounded-full bg-flame-500 px-3 py-1 text-xs font-semibold text-white">
                    Recommended
                  </span>
                ) : null}
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl text-white",
                    item.recommended ? "bg-flame-500" : "bg-ink"
                  )}
                >
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-flame-600">
                  {item.quoteLabel}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted">{item.audience}</p>
                <p className="mt-4 text-sm leading-6 text-muted">{item.description}</p>
                <div className="mt-5 grid gap-2">
                  {item.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm leading-6 text-muted">
                      <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-flame-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-6">
                  <Link
                    href={item.ctaHref}
                    className={cn(
                      "inline-flex min-h-11 items-center justify-center rounded-full text-sm font-semibold transition",
                      item.recommended ? "text-flame-600 hover:text-flame-700" : "text-ink hover:text-flame-600"
                    )}
                  >
                    <span className="inline-flex items-center gap-2">
                      {item.ctaLabel}
                      <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
